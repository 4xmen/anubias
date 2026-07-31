use std::fs;
use std::fs::File;
use std::io::Read;
use std::path::Path;
use file_format::{FileFormat, Kind};
use serde::{Deserialize, Serialize};

const MAX_IMPORT_FILE_SIZE: u64 = 50 * 1024 * 1024;
/// High-level preview category used by the frontend.
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum PreviewKind {
    None,
    Image,
    Video,
    Audio,
    Font,
    Text,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum AssetKind {
    Image,
    Video,
    Audio,
    Font,
    Document,
    Archive,
    Executable,
    Package,
    Disk,
    DataBase,
    Unknown,
}

impl From<file_format::Kind> for AssetKind {
    fn from(kind: file_format::Kind) -> Self {
        match kind {
            file_format::Kind::Image => Self::Image,
            file_format::Kind::Video => Self::Video,
            file_format::Kind::Audio => Self::Audio,
            file_format::Kind::Font => Self::Font,
            file_format::Kind::Document => Self::Document,
            file_format::Kind::Compressed => Self::Archive,
            file_format::Kind::Archive => Self::Archive,
            file_format::Kind::Executable => Self::Executable,
            file_format::Kind::Package => Self::Package,
            file_format::Kind::Disk => Self::Disk,
            file_format::Kind::Database => Self::DataBase,
            _ => Self::Unknown,
        }
    }
}
/// Metadata and binary data returned after importing a project.
///
/// This structure represents the canonical result of the import step.
/// The frontend should rely on this metadata instead of inferring project
/// information from the project name or extension.
#[derive(Debug, Serialize)]
pub struct ImportedAsset {
    /// Original project name including its extension.
    pub original_name: String,

    /// Raw binary content of the imported project.
    pub bytes: Vec<u8>,

    /// File size in bytes.
    pub size: u64,

    /// MIME type detected from the project content.
    pub mime: String,

    /// High-level project kind reported by `project-format`.
    pub kind: AssetKind,

    /// UI preview category.
    pub preview_kind: PreviewKind,

    /// CRC32 checksum of the raw project bytes.
    pub crc32: u32,
}

#[derive(Debug, Clone, Serialize)]
pub struct FileMetadata {
    pub original_name: String,
    pub size: u64,
    pub mime: String,
}

/// Retrieves metadata for a project without loading its entire contents into memory.
///
/// The returned metadata includes:
/// - Original project name.
/// - File size in bytes.
/// - Detected MIME type.
/// - Asset kind.
/// - Preview kind used by the application.
///
/// This command is intended for lightweight validation and decision-making
/// before performing more expensive operations such as importing or processing
/// the project.
///
/// # Errors
///
/// Returns an error if the project cannot be accessed or its metadata cannot be
/// determined.
///  IMPORTANT NOTE: this function is fast may can't detect well
#[tauri::command]
pub async fn get_fast_file_metadata(path: String) -> Result<FileMetadata, String> {
    tokio::task::spawn_blocking(move || {
        let metadata = fs::metadata(&path).map_err(|e| e.to_string())?;

        // a few bytes to detect
        let mut file = File::open(&path).map_err(|e| e.to_string())?;

        let mut header = [0u8; 8192];
        let read = file.read(&mut header).map_err(|e| e.to_string())?;

        let format = FileFormat::from_bytes(&header[..read]);

        let mime = format.media_type().to_string();

        Ok(FileMetadata {
            original_name: Path::new(&path)
                .file_name()
                .unwrap_or_default()
                .to_string_lossy()
                .into_owned(),

            size: metadata.len(),
            mime,
        })
    })
        .await
        .map_err(|e| e.to_string())?
}

/// Reads a project from disk and returns its binary content together with
/// metadata detected from the project itself.
///
/// The detected MIME type and project kind are derived from the project content,
/// not from its extension. This makes Rust the single source of truth for
/// imported assets.
fn read_file_binary_impl(path: String) -> Result<ImportedAsset, String> {
    let metadata = fs::metadata(&path).map_err(|e| e.to_string())?;

    if metadata.len() > MAX_IMPORT_FILE_SIZE {
        return Err(format!(
            "The selected project exceeds the maximum supported size of {} MB.",
            MAX_IMPORT_FILE_SIZE / 1024 / 1024
        ));
    }

    let bytes = fs::read(&path).map_err(|e| e.to_string())?;

    let metadata = fs::metadata(&path).map_err(|e| e.to_string())?;

    let format = FileFormat::from_bytes(&bytes);

    let mime = format.media_type().to_string();
    let file_kind = format.kind();

    let preview_kind = match file_kind {
        Kind::Image => PreviewKind::Image,
        Kind::Video => PreviewKind::Video,
        Kind::Audio => PreviewKind::Audio,
        Kind::Font => PreviewKind::Font,

        _ if mime.starts_with("text/")
            || mime == "application/json"
            || mime == "application/xml"
            || mime == "application/javascript"
            || mime == "application/x-sh"
            || format == FileFormat::PlainText =>
            {
                PreviewKind::Text
            }

        Kind::Document | Kind::Archive => PreviewKind::Text,

        _ => PreviewKind::None,
    };

    let crc32 = crc32fast::hash(&bytes);

    Ok(ImportedAsset {
        original_name: Path::new(&path)
            .file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .into_owned(),

        bytes,

        size: metadata.len(),

        mime,

        kind: file_kind.into(),

        preview_kind,

        crc32,
    })
}

/// Imports a project from disk and produces an `ImportedAsset`.
///
/// The returned asset contains the original project bytes, metadata, detected
/// media information, preview type, and a CRC32 checksum.
///
/// This function performs blocking I/O and should be executed using
/// `tokio::task::spawn_blocking`.
///
/// # Errors
///
/// Returns an error if the project or its metadata cannot be read.
#[tauri::command]
pub async fn read_file_binary(path: String) -> Result<ImportedAsset, String> {
    tokio::task::spawn_blocking(move || read_file_binary_impl(path))
        .await
        .map_err(|e| e.to_string())?
}
