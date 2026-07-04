use std::fmt;
use serde::{Deserialize, Serialize};
use crate::format::app;
use std::io::{self, Read, Seek, SeekFrom, Write};
use std::path::Path;
use zstd::stream::{Encoder, Decoder};
use thiserror::Error;
use std::fs::File;

/// how is project structure
/// ┌───────────────────────────────────────────────────────────┐
/// |│                   Project Metadata                      | │
/// ├───────────────────────────────────────────────────────────┤
/// |│           Compressed Project (project.json)             | │
/// ├───────────────────────────────────────────────────────────┤
/// |│        Compressed Preview (Page Hash A)                 |│
/// ├───────────────────────────────────────────────────────────┤
/// |│        Compressed Preview (Page Hash B)                 |│
/// ├───────────────────────────────────────────────────────────┤
/// |│                           ...                           | │
/// ├───────────────────────────────────────────────────────────┤ │
/// |│                     DataMap Index                       | │ │
/// └───────────────────────────────────────────────────────────┘

/// Project file metadata.
///
/// Layout:
///
/// ┌───────────────────────────────────────────────────────────────┐
/// │ magic                  File signature                        │
/// │ version                File format version                   │
/// │ random_seed            Project random seed                   │
/// │ data_map_offset        Offset of serialized DataMap          │
/// │ data_map_size          Serialized DataMap size              │
/// │ data_map               all project files
/// └───────────────────────────────────────────────────────────────┘
///
/// The metadata is always located at the beginning of the file
/// so the loader can immediately validate the file and locate
/// the project descriptor and index.
///
/// File Layout:
///
/// Metadata
///     │
///     ▼
/// project.json (compressed)
///     │
///     ▼
/// preview #1
///     │
///     ▼
/// preview #2
///     │
///     ▼
/// ...
///     │
///     ▼
/// DataMap
///
#[derive(Debug)]
pub struct ProjectMetadata {
    pub magic: [u8; 8],
    pub version: u16,

    /// Stable project random seed.
    pub random_seed: u64,

    /// all project files
    pub data_map: DataMap,

    /// Location of DataMap.
    pub data_map_offset: u64,

    /// Serialized DataMap size.
    pub data_map_size: u64,
}


impl ProjectMetadata {
    /// Creates project metadata.
    pub fn new(
        data_map_offset: u64,
        data_map_size: u64,
    ) -> Self {
        Self {
            magic: app::MAGIC,
            version: app::VERSION,
            random_seed: app::random_seed(),
            data_map: DataMap::new(),
            data_map_offset,
            data_map_size,
        }
    }

    /// Returns true if the magic is valid.
    pub fn is_valid_magic(&self) -> bool {
        self.magic == app::MAGIC
    }

    /// Returns true if the file version is supported.
    pub fn is_supported_version(&self) -> bool {
        self.version == app::VERSION
    }

    pub fn from_request(req: SaveProjectRequest) -> Self {
        let project_main_data = FileEntry::from_string(req.project,"project.json".to_string(), None);
        let mut project = ProjectMetadata::new(0,0);
        project.add_file_entry(project_main_data);
        for preview in req.previews {
            project.add_file_entry(FileEntry::from_preview(preview));
        }
        dbg!(&project);
        project
    }

    pub fn add_file_entry(&mut self, entry: FileEntry) {
        self.data_map.add(entry);
    }

    /// Writes the project to disk in the following binary layout:
    ///
    /// ┌───────────────────────────────────────────────────────────────┐
    /// │ magic                  [u8; 8]     File signature             │
    /// │ version                u16         File format version        │
    /// │ random_seed            u64         Project random seed        │
    /// │ data_map_offset        u64         Offset of compressed DataMap │
    /// │ data_map_size          u64         Size of compressed DataMap   │
    /// │ data_map               [...]       Compressed & serialized DataMap │
    /// └───────────────────────────────────────────────────────────────┘
    pub fn save<P: AsRef<Path>>(&self, path: P) -> Result<(), ProjectError> {
        let mut file = File::create(path)?;

        // Compress the DataMap first (this is the core part you were stuck on)
        let compressed_data = self.data_map.compress(6)?;

        // Calculate where the DataMap starts (right after the fixed header)
        let header_size = 8 + 2 + 8 + 8 + 8; // magic + version + random_seed + offset + size
        let data_map_offset = header_size as u64;
        let data_map_size = compressed_data.len() as u64;

        // Write fixed-size header (you can populate magic/version/random_seed yourself before calling save)
        file.write_all(&self.magic)?;
        file.write_all(&self.version.to_le_bytes())?;
        file.write_all(&self.random_seed.to_le_bytes())?;
        file.write_all(&data_map_offset.to_le_bytes())?;
        file.write_all(&data_map_size.to_le_bytes())?;

        // Write the compressed DataMap
        file.write_all(&compressed_data)?;

        file.flush()?;
        Ok(())
    }

    /// Reads the project file back (symmetric to `save`).
    pub fn load<P: AsRef<Path>>(path: P) -> Result<Self, ProjectError> {
        let mut file = File::open(path)?;

        let mut magic = [0u8; 8];
        file.read_exact(&mut magic)?;

        let mut version_bytes = [0u8; 2];
        file.read_exact(&mut version_bytes)?;
        let version = u16::from_le_bytes(version_bytes);

        let mut random_seed_bytes = [0u8; 8];
        file.read_exact(&mut random_seed_bytes)?;
        let random_seed = u64::from_le_bytes(random_seed_bytes);

        let mut offset_bytes = [0u8; 8];
        file.read_exact(&mut offset_bytes)?;
        let data_map_offset = u64::from_le_bytes(offset_bytes);

        let mut size_bytes = [0u8; 8];
        file.read_exact(&mut size_bytes)?;
        let data_map_size = u64::from_le_bytes(size_bytes);

        // Seek to the DataMap and read it
        file.seek(SeekFrom::Start(data_map_offset))?;
        let mut compressed = vec![0u8; data_map_size as usize];
        file.read_exact(&mut compressed)?;

        let data_map = DataMap::decompress(&compressed)?;

        Ok(Self {
            magic,
            version,
            random_seed,
            data_map,
            data_map_offset,
            data_map_size,
        })
    }
}


/// Describes a single compressed asset stored inside the project.
///
/// Every binary resource inside the project file is represented
/// by exactly one FileEntry.
///
/// Examples:
///
/// project.json
/// preview/a82bc91.webp
/// preview/18dcf0a.webp
/// preview/91d31ea.webp
///
/// hash
/// -----
/// A stable logical identifier used by the application.
/// Preview images are linked to pages through this value.
///
/// path
/// ----
/// Absolute byte offset of daa
///
/// size
/// ------------------
/// file data
///
/// data
/// ------------------
/// Original data size.
///
/// crc32
/// -----
/// CRC32 of the uncompressed data for integrity verification.
#[derive(Serialize, Deserialize, Clone)]
pub struct FileEntry {
    pub hash: String,

    pub path: String,

    pub size: u64,

    pub data: Vec<u8>,

    pub crc32: u32,

}


impl FileEntry {
    pub fn from_string(string_data: String, path: String, hash: Option<String>) -> Self {
        let bytes = string_data.into_bytes();
        Self {
            size: bytes.len() as u64,
            crc32: crc32fast::hash(&bytes),
            hash: hash.unwrap_or_else(|| String::new()),
            path,
            data: bytes,
        }
    }

    pub fn from_preview(preview_data: PreviewData) -> Self {
        Self{
            size: preview_data.data.len() as u64,
            crc32: crc32fast::hash(&preview_data.data),
            data: preview_data.data,
            path: format!("/preview/{}.webp",&preview_data.page_id),
            hash: preview_data.page_id,
        }
    }
}


impl fmt::Debug for FileEntry {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let preview_len = self.data.len().min(3);

        let preview: Vec<u8> = self.data[..preview_len].to_vec();

        f.debug_struct("FileEntry")
            .field("hash", &self.hash)
            .field("path", &self.path)
            .field("size", &self.size)
            .field("crc32", &self.crc32)
            .field("data_preview", &preview)
            .field("data_len", &self.data.len())
            .finish()
    }
}

//// Lookup table for every asset stored in the project.
///
/// The DataMap is serialized at the end of the file to avoid
/// rewriting offsets while saving.
///
/// Lookup flow:
///
/// page hash
///     │
///     ▼
/// FileEntry
///     │
///     ▼
/// offset
///     │
///     ▼
/// compressed bytes
///
#[derive(Serialize, Deserialize, Debug)]
pub struct DataMap {
    pub entries: Vec<FileEntry>,
}

impl DataMap {
    /// Creates an empty index.
    pub fn new() -> Self {
        Self {
            entries: Vec::new(),
        }
    }

    /// Adds a new file entry.
    pub fn add(&mut self, entry: FileEntry) {
        self.entries.push(entry);
    }

    /// Finds an entry by its logical hash.
    pub fn find(&self, hash: &str) -> Option<&FileEntry> {
        self.entries.iter().find(|e| e.hash == hash)
    }

    /// Finds an entry by archive path.
    pub fn find_path(&self, path: &str) -> Option<&FileEntry> {
        self.entries.iter().find(|e| e.path == path)
    }

    /// Returns the number of stored entries.
    pub fn len(&self) -> usize {
        self.entries.len()
    }

    /// Returns true when no entries exist.
    pub fn is_empty(&self) -> bool {
        self.entries.is_empty()
    }

    /// Serializes the DataMap using postcard then compresses it with zstd.
    pub fn compress(&self, level: i32) -> Result<Vec<u8>, DataMapError> {
        // Serialize with postcard (compact and fast)
        let serialized = postcard::to_allocvec(self)
            .map_err(|_| DataMapError::Serialize)?;

        // Compress with zstd
        zstd::encode_all(&serialized[..], level)
            .map_err(DataMapError::Io)
    }

    /// Decompresses the data with zstd then deserializes with postcard.
    pub fn decompress(bytes: &[u8]) -> Result<Self, DataMapError> {
        // Decompress with zstd
        let decompressed = zstd::decode_all(bytes)
            .map_err(DataMapError::Io)?;

        // Deserialize with postcard
        postcard::from_bytes(&decompressed)
            .map_err(|_| DataMapError::Deserialize)
    }
}

impl Default for DataMap {
    fn default() -> Self {
        Self::new()
    }
}


#[derive(Debug, thiserror::Error)]
pub enum DataMapError {
    #[error("Serialization error")]
    Serialize,

    #[error("Deserialization error")]
    Deserialize,

    #[error("IO/de/compression error: {0}")]
    Io(#[from] std::io::Error),
}



/// Error type for project file operations
#[derive(Debug, thiserror::Error)]
pub enum ProjectError {
    #[error("IO error: {0}")]
    Io(#[from] io::Error),

    #[error("DataMap error: {0}")]
    DataMap(#[from] DataMapError),
}

#[derive(Deserialize, Serialize, Debug)]
pub struct PreviewData {
    pub page_id: String,
    pub data: Vec<u8>,
}

#[derive(Deserialize, Debug)]
pub struct SaveProjectRequest {
    pub path: String,
    pub project: String,
    pub previews: Vec<PreviewData>,
}

#[derive(Serialize, Debug)]
pub struct LoadProjectResponse {
    pub project: String,
    pub previews: Vec<PreviewData>,
}



#[tauri::command]
pub fn save_project(request: SaveProjectRequest) -> Result<(), String> {
    // dbg!(&request);
    let save_path = request.path.clone();
    ProjectMetadata::from_request(request).save(save_path).unwrap();
    // write file...
    Ok(())
}

#[tauri::command]
pub fn load_project(path: String) -> Result<LoadProjectResponse, String> {
    // read file...
    Ok(LoadProjectResponse {
        project: String::new(),
        previews: Vec::new(),
    })
}

