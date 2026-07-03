use serde::{Deserialize, Serialize};

///
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
/// │ project_entry          Main project.json entry               │
/// │ data_map_offset        Offset of serialized DataMap          │
/// │ data_map_size          Serialized DataMap size              │
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

    /// Entry describing the main project.json.
    pub project_entry: FileEntry,

    /// Location of DataMap.
    pub data_map_offset: u64,

    /// Serialized DataMap size.
    pub data_map_size: u64,
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
/// Human-readable archive path used for debugging and tooling.
///
/// offset
/// ------
/// Absolute byte offset of the compressed data.
///
/// compressed_size
/// ----------------
/// Size of compressed payload.
///
/// uncompressed_size
/// ------------------
/// Original data size.
///
/// crc32
/// -----
/// CRC32 of the uncompressed data for integrity verification.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct FileEntry {
    pub hash: String,

    pub path: String,

    pub offset: u64,

    pub compressed_size: u64,

    pub uncompressed_size: u64,

    pub crc32: u32,
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
    pub fn new() -> Self {
        Self {
            entries: Vec::new(),
        }
    }
    pub fn add_entry(&mut self, entry: FileEntry) {
        self.entries.push(entry);
    }

    pub fn find(&self, hash: &str) -> Option<&FileEntry> {
        self.entries.iter().find(|e| e.hash == hash)
    }

    pub fn find_path(&self, path: &str) -> Option<&FileEntry> {
        self.entries.iter().find(|e| e.path == path)
    }
}

impl Default for DataMap {
    fn default() -> Self {
        Self::new()
    }
}

#[derive(Deserialize,Serialize,Debug)]
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
    dbg!(&request);
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