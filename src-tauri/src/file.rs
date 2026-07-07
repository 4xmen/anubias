use crate::config::IS_DEBUG;
use crate::format::app;
use serde::{Deserialize, Serialize};
use std::{fmt, fs};
use std::fs::File;
use std::io::{self, Read, Seek, SeekFrom, Write};
use std::path::Path;
use tauri::{AppHandle, Manager};
use std::path::PathBuf;
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

#[derive(Debug, thiserror::Error)]
pub enum DataMapError {
    #[error("Serialization error")]
    Serialize,

    #[error("Deserialization error")]
    Deserialize,

    #[error("IO: de/compression error: {0}")]
    Io(#[from] std::io::Error),
}

/// Error type for project file operations
#[derive(Debug, thiserror::Error)]
pub enum ProjectError {
    #[error("IO error: {0}")]
    Io(#[from] io::Error),

    #[error("DataMap error: {0}")]
    DataMap(#[from] DataMapError),

    #[error("UTF-8 error: {0}")]
    Utf8(#[from] std::string::FromUtf8Error),
}

#[derive(Deserialize, Serialize)]
pub struct PreviewData {
    pub page_id: String,
    pub data: Vec<u8>,
}

#[derive(Deserialize, Debug)]
pub struct SaveProjectRequest {
    pub path: Option<String>,
    pub project: String,
    pub previews: Vec<PreviewData>,
}

#[derive(Serialize, Debug)]
pub struct LoadProjectResponse {
    pub project: String,
    pub previews: Vec<PreviewData>,
}

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
    pub fn new(data_map_offset: u64, data_map_size: u64) -> Self {
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

    /// Converts a SaveProjectRequest into a ProjectMetadata instance.
    ///
    /// This function transforms the incoming request data from the frontend into an internal project
    /// representation. It processes the project configuration JSON and associated preview data, organizing
    /// them into a structured ProjectMetadata object ready for saving to disk.
    ///
    /// # Processing Steps
    ///
    /// 1. **Project Configuration**: Converts the project JSON string into a FileEntry with the name "project.json"
    /// 2. **Initialization**: Creates a new ProjectMetadata with default metadata values (timestamps/IDs set to 0)
    /// 3. **Preview Data**: Iterates through all preview entries and converts each PreviewData into FileEntry objects
    /// 4. **Debug Output**: If debug mode is enabled, logs the constructed project structure
    ///
    /// # Parameters
    ///
    /// * `req` - A SaveProjectRequest containing:
    ///   - `path`: Destination file path (used by the caller for saving)
    ///   - `project`: JSON string containing the main project configuration
    ///   - `previews`: Vector of PreviewData objects representing preview pages
    ///
    /// # Returns
    ///
    /// Returns a fully constructed `ProjectMetadata` object containing:
    /// - Main project configuration as a FileEntry named "project.json"
    /// - All preview data as separate FileEntry objects derived from PreviewData
    ///
    pub fn from_request(req: SaveProjectRequest) -> Self {
        let project_main_data =
            FileEntry::from_string(req.project, "project.json".to_string(), None);
        let mut project = ProjectMetadata::new(0, 0);
        project.add_file_entry(project_main_data);
        for preview in req.previews {
            project.add_file_entry(FileEntry::from_preview(preview));
        }
        if IS_DEBUG {
            dbg!(&project);
        }
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
    ///
    /// Saves the project to a binary file on disk with compression.
    ///
    /// This function serializes the ProjectLoader instance into a structured binary format and writes it
    /// to the specified path. The data map is compressed before writing to reduce file size. The resulting
    /// file can be loaded back using the `load` method.
    ///
    /// # File Format
    ///
    /// The binary file is written in little-endian encoding with the following structure:
    /// - **Magic Number** (8 bytes): File signature for format identification
    /// - **Version** (2 bytes): File format version for compatibility checking
    /// - **Random Seed** (8 bytes): Seed value used in project generation or validation
    /// - **Data Map Offset** (8 bytes): Byte offset where the compressed data map begins (calculated as header_size)
    /// - **Data Map Size** (8 bytes): Byte size of the compressed data map section
    /// - **Compressed Data Map** (variable size): Compressed project entries written at the calculated offset
    ///
    /// # Parameters
    ///
    /// * `path` - A path-like object where the binary project file will be created or overwritten
    ///
    /// # Returns
    ///
    /// Returns `Result<(), ProjectError>` indicating:
    /// - `Ok(())`: File successfully written and flushed to disk
    /// - `Err(ProjectError)`: If compression, file I/O, or serialization fails
    ///
    /// # Errors
    ///
    /// This function returns an error in the following cases:
    /// - File cannot be created or written to (permission denied, path invalid, etc.)
    /// - Data map compression fails
    /// - Buffer flush fails
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

    /// Loads a project file from disk and parses its binary structure.
    ///
    /// This function reads a binary project file from the specified path and reconstructs the ProjectLoader
    /// instance by parsing its structured format. The file format consists of a header followed by a compressed
    /// data map section.
    ///
    /// # File Format
    ///
    /// The binary file structure (little-endian encoding):
    /// - **Magic Number** (8 bytes): File signature for format identification
    /// - **Version** (2 bytes): File format version for compatibility checking
    /// - **Random Seed** (8 bytes): Seed value used in project generation or validation
    /// - **Data Map Offset** (8 bytes): Byte offset where the compressed data map section begins
    /// - **Data Map Size** (8 bytes): Byte size of the compressed data map section
    /// - **Compressed Data Map** (variable size): Compressed project entries, located at the specified offset
    ///
    /// # Parameters
    ///
    /// * `path` - A path-like object pointing to the binary project file on disk
    ///
    /// # Returns
    ///
    /// Returns `Result<Self, ProjectError>` containing:
    /// - `Ok(ProjectLoader)`: Successfully loaded and parsed project file
    /// - `Err(ProjectError)`: If file I/O fails, binary parsing fails, or decompression fails
    ///
    /// # Errors
    ///
    /// This function returns an error in the following cases:
    /// - File cannot be opened or read from disk
    /// - Header fields are incomplete or truncated
    /// - Data map offset or size is invalid
    /// - Compressed data map cannot be decompressed
    ///
    /// # Example
    ///
    /// ```ignore
    /// match ProjectLoader::load("path/to/project.bin") {
    ///     Ok(loader) => {
    ///         if loader.verify() {
    ///             let response = loader.into_response()?;
    ///             println!("Project loaded successfully");
    ///         }
    ///     }
    ///     Err(e) => eprintln!("Failed to load project: {}", e),
    /// }
    /// ```
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

    /// Verifies the integrity of the uncompressed file data.
    ///
    /// This function performs comprehensive validation checks on the decompressed project file to ensure
    /// data integrity and compatibility. It validates the file format, version compatibility, and data integrity
    /// by verifying CRC32 checksums for all entries.
    ///
    /// # Validation Steps
    ///
    /// 1. **Magic Number Check**: Verifies the file has the correct magic bytes (file signature)
    /// 2. **Version Check**: Ensures the file format version is supported by the current implementation
    /// 3. **CRC32 Integrity Check**: Validates each entry's data against its stored CRC32 checksum
    ///
    /// # Returns
    ///
    /// Returns `true` if all validation checks pass, `false` if any check fails:
    /// - Invalid magic number indicates corrupted or incompatible file format
    /// - Unsupported version indicates the file was created by a newer/incompatible version
    /// - CRC32 mismatch indicates data corruption during decompression or storage
    ///
    pub fn verify(&self) -> bool {
        if !self.is_valid_magic() {
            return false;
        }
        if !self.is_supported_version() {
            return false;
        }
        for entry in self.data_map.entries.iter() {
            if crc32fast::hash(&entry.data) != entry.crc32 {
                return false;
            }
        }
        true
    }

    /// Converts the project data map into a structured response object suitable for frontend consumption via Tauri.
    ///
    /// This function processes entries from the internal data map and organizes them into a `LoadProjectResponse`.
    /// It extracts the main project configuration from "project.json" and collects all preview data from entries
    /// with paths starting with "/preview/". Other entries are currently ignored.
    ///
    /// # Returns
    ///
    /// Returns a `Result<LoadProjectResponse, ProjectError>` containing:
    /// - `Ok(LoadProjectResponse)`: Successfully parsed response with project JSON content and preview data
    /// - `Err(ProjectError)`: If UTF-8 conversion of the project.json file fails
    ///
    /// # Errors
    ///
    /// This function will return an error if the project.json entry contains invalid UTF-8 sequences.
    ///
    pub fn into_response(self) -> Result<LoadProjectResponse, ProjectError> {
        let mut result = LoadProjectResponse {
            project: "".to_string(),
            previews: vec![],
        };
        for entry in self.data_map.entries.into_iter() {
            println!("path: {:?}", entry.path);
            if entry.path == "project.json" {
                result.project = String::from_utf8(entry.data)?;
            } else if entry.path.starts_with("/preview/") {
                result.previews.push(PreviewData {
                    page_id: entry.hash,
                    data: entry.data,
                });
            } else {
                // not now
            }
        }
        Ok(result)
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
    /// Creates a FileEntry from a string with optional metadata hash.
    ///
    /// Converts a string into binary data and calculates its CRC32 checksum for integrity verification.
    /// Used primarily for storing text-based project configuration (e.g., "project.json").
    ///
    /// # Parameters
    ///
    /// * `string_data` - The string content to store as file data
    /// * `path` - The file path/name within the project (e.g., "project.json")
    /// * `hash` - Optional metadata hash; defaults to empty string if None
    ///
    /// # Returns
    ///
    /// A FileEntry with:
    /// - Binary representation of the input string
    /// - Calculated CRC32 checksum
    /// - Specified path and optional hash
    ///
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

    /// Creates a FileEntry from preview image data.
    ///
    /// Converts preview image bytes into a FileEntry with an auto-generated path and page ID as hash.
    /// Used for storing preview/thumbnail images (WebP format) within the project.
    ///
    /// # Parameters
    ///
    /// * `preview_data` - PreviewData containing:
    ///   - `page_id`: Numeric identifier for the preview page
    ///   - `data`: Raw image bytes (typically WebP format)
    ///
    /// # Returns
    ///
    /// A FileEntry with:
    /// - Path formatted as "/preview/{page_id}.webp"
    /// - Calculated CRC32 checksum
    /// - page_id stored as the hash field
    ///
    pub fn from_preview(preview_data: PreviewData) -> Self {
        Self {
            size: preview_data.data.len() as u64,
            crc32: crc32fast::hash(&preview_data.data),
            data: preview_data.data,
            path: format!("/preview/{}.webp", &preview_data.page_id),
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
impl fmt::Debug for PreviewData {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let preview_len = self.data.len().min(3);

        let preview: Vec<u8> = self.data[..preview_len].to_vec();

        f.debug_struct("PreviewData")
            .field("page_id", &self.page_id)
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
        let serialized = postcard::to_allocvec(self).map_err(|_| DataMapError::Serialize)?;

        // Compress with zstd
        zstd::encode_all(&serialized[..], level).map_err(DataMapError::Io)
    }

    /// Decompresses the data with zstd then deserializes with postcard.
    pub fn decompress(bytes: &[u8]) -> Result<Self, DataMapError> {
        // Decompress with zstd
        let decompressed = zstd::decode_all(bytes).map_err(DataMapError::Io)?;

        // Deserialize with postcard
        postcard::from_bytes(&decompressed).map_err(|_| DataMapError::Deserialize)
    }
}

impl Default for DataMap {
    fn default() -> Self {
        Self::new()
    }
}

#[tauri::command]
pub fn save_project(request: SaveProjectRequest) -> Result<(), String> {
    if IS_DEBUG {
        dbg!(&request);
    }
    let save_path = request.path.clone().ok_or("path is required")?;

    ProjectMetadata::from_request(request)
        .save(save_path)
        .unwrap();
    // write file...
    Ok(())
}

#[tauri::command]
pub fn load_project(path: String) -> Result<LoadProjectResponse, String> {
    let project = ProjectMetadata::load(Path::new(&path))
        .map_err(|error| format!("Failed to load project from path {}: {}", path, error))?;

    if !project.verify() {
        return Err("Project does not verified.".to_string());
    }

    let response = project.into_response().map_err(|error| error.to_string())?;
    if IS_DEBUG {
        dbg!(&response);
    }
    Ok(response)
}



/// Creates an autosave backup of the project at a timestamped location.
///
/// This Tauri command handler saves a project backup to the application's data directory,
/// organized by project hash and timestamped for version control. It automatically creates
/// necessary directory structures and handles file system errors gracefully.
///
/// # Parameters
///
/// * `app` - Tauri application handle for accessing the app data directory
/// * `request` - SaveProjectRequest containing project configuration and preview data
/// * `hash` - Project hash/identifier used to organize backups into subdirectories
/// * `timestamp` - Unix timestamp (milliseconds) used as the backup filename
///
/// # Directory Structure
///
/// Backups are stored at: `{APP_DATA_DIR}/backups/{hash}/{timestamp}.anb`
///
/// # Returns
///
/// * `Ok(String)` - Full path to the created backup file
/// * `Err(String)` - Error message if directory creation or file saving fails
///
/// # Errors
///
/// - File system errors during directory creation
/// - Project serialization or save errors
/// - Path resolution errors from Tauri
///
#[tauri::command]
pub async fn autosave_project_backup(
    app: AppHandle,
    request: SaveProjectRequest,
    hash: String,
    timestamp: i64,
) -> Result<String, String> {
    let base = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    let dir = base.join("backups").join(&hash);
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;

    let path = dir.join(format!("{timestamp}.anb"));

    ProjectMetadata::from_request(request)
        .save(path.to_string_lossy().to_string())
        .map_err(|e| e.to_string())?;

    if IS_DEBUG {
        println!("backup created, {}", path.display());
    }
    Ok(path.to_string_lossy().to_string())
}

#[derive(Serialize, Debug)]
pub struct BackupEntry {
    pub timestamp: i64,
    pub path: String,
}





/// Lists all available backups for a given project, sorted by recency.
///
/// This Tauri command retrieves all backup files (.anb) from the project's backup directory,
/// extracts their timestamps, and returns them sorted in descending order (newest first).
/// Returns an empty list if no backups exist for the project.
///
/// # Parameters
///
/// * `app` - Tauri application handle for accessing the app data directory
/// * `hash` - Project hash/identifier to filter backups
///
/// # Returns
///
/// * `Ok(Vec<BackupEntry>)` - Sorted list of BackupEntry objects containing timestamp and full path.
///   Sorted by timestamp in descending order (most recent first).
/// * `Err(String)` - Error message if directory access fails or timestamps cannot be parsed
///
/// # Filtering
///
/// Only files with `.anb` extension are included. Files with invalid or unparseable timestamps
/// (non-numeric filenames) are silently skipped.
///
/// # Errors
///
/// - File system errors during directory reading
/// - Path resolution errors from Tauri
///
#[tauri::command]
pub async fn list_backups(
    app: AppHandle,
    hash: String,
) -> Result<Vec<BackupEntry>, String> {
    let base = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let dir = base.join("backups").join(&hash);

    if !dir.exists() {
        return Ok(vec![]);
    }

    let mut items = vec![];

    let entries = fs::read_dir(&dir).map_err(|e| e.to_string())?;
    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();

        if path.extension().and_then(|s| s.to_str()) != Some("anb") {
            continue;
        }

        let ts = match path.file_stem().and_then(|s| s.to_str()).and_then(|s| s.parse::<i64>().ok()) {
            Some(v) => v,
            None => continue,
        };

        items.push(BackupEntry {
            timestamp: ts,
            path: path.to_string_lossy().to_string(),
        });
    }

    items.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
    Ok(items)
}




/// Deletes all backup files older than the specified timestamp.
///
/// This Tauri command removes backup files (.anb) from a project's backup directory
/// that were created before the given timestamp. Useful for cleanup and storage management.
/// Returns the count of successfully deleted files.
///
/// # Parameters
///
/// * `app` - Tauri application handle for accessing the app data directory
/// * `hash` - Project hash/identifier to filter backups
/// * `timestamp` - Unix timestamp (milliseconds). All backups with timestamps less than this value are deleted
///
/// # Returns
///
/// * `Ok(usize)` - Number of backup files successfully deleted
/// * `Err(String)` - Error message if directory access or file deletion fails
///
/// # Filtering
///
/// Only `.anb` files are processed. Files with invalid or unparseable timestamps are skipped.
/// Returns 0 if the backup directory does not exist.
///
/// # Errors
///
/// - File system errors during directory reading or file deletion
/// - Path resolution errors from Tauri
///
#[tauri::command]
pub async fn delete_old_backups(
    app: AppHandle,
    hash: String,
    timestamp: i64,
) -> Result<usize, String> {
    let base = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let dir = base.join("backups").join(&hash);

    if !dir.exists() {
        return Ok(0);
    }

    let mut deleted = 0usize;
    let entries = fs::read_dir(&dir).map_err(|e| e.to_string())?;

    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();

        if path.extension().and_then(|s| s.to_str()) != Some("anb") {
            continue;
        }

        let ts = match path.file_stem().and_then(|s| s.to_str()).and_then(|s| s.parse::<i64>().ok()) {
            Some(v) => v,
            None => continue,
        };

        if ts < timestamp {
            fs::remove_file(&path).map_err(|e| e.to_string())?;
            deleted += 1;
        }
    }

    Ok(deleted)
}


/// Checks whether a file or directory exists at the given path.
///
/// This Tauri command provides a simple way for the frontend to verify path existence
/// without exposing raw filesystem APIs. Returns immediately without throwing errors.
///
/// # Parameters
///
/// * `path` - Absolute or relative file system path to check
///
/// # Returns
///
/// * `true` - Path exists (file or directory)
/// * `false` - Path does not exist or is inaccessible
///
/// # Notes
///
/// This function does not distinguish between files and directories.
/// Permission errors are treated as "path does not exist" (returns `false`).
///
#[tauri::command]
pub fn path_exists(path: String) -> bool {
    Path::new(&path).exists()
}