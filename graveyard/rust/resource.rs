// this is resrouce manager proj:// protocol version

use crate::config::MAX_IMPORT_FILE_SIZE;
use file_format::FileFormat;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::Path;
use std::sync::{Arc, Mutex};
use std::{fmt, fs};
use tauri::{AppHandle, Manager, State};
use http::{header::*, response::Builder as ResponseBuilder, status::StatusCode, Response};
use http_range::HttpRange;
use std::io::{Read, Seek, SeekFrom};
// ----------------------------
// Types
// ----------------------------

#[derive(Clone)]
pub struct ResourceEntry {
    pub hash_id: String,
    pub data: Vec<u8>,
    pub mime: String,
    pub original_name: String,
    pub crc32: u32,
    pub directory: String,
    pub size: u64,
}


#[derive(Clone, Deserialize, Serialize)]
pub struct ResourcePayload{
    pub hash_id: String,
    pub url: String,
    pub mime: String,
    pub original_name: String,
    pub crc32: u32,
    pub directory: String,
    pub size: u64,
}

// debug display
impl fmt::Debug for ResourceEntry {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let data_preview = if self.data.len() > 16 {
            format!(
                "{:?}... ({} bytes total)",
                &self.data[..16],
                self.data.len()
            )
        } else {
            format!("{:?}", self.data)
        };

        f.debug_struct("ResourceEntry")
            .field("hash_id", &self.hash_id)
            .field("data", &data_preview)
            .field("mime", &self.mime)
            .field("original_name", &self.original_name)
            .field("crc32", &self.crc32)
            .finish()
    }
}

/// Shared in-memory store for resources.
/// Key = hash_id coming from the frontend.
pub type ResourceStore = Arc<Mutex<HashMap<String, ResourceEntry>>>;

// ----------------------------
// Commands
// ----------------------------

/// Adds a resource to the in-memory store and makes it available
/// via the custom protocol: `proj://localhost/resource/<hash>`
///
/// The frontend is responsible for generating the hash and detecting
/// the real MIME type (via file_format or similar).
#[tauri::command]
pub fn add_resource(
    store: State<'_, ResourceStore>,
    hash: String,
    path: String,
    dir: String,
) -> Result<ResourcePayload, String> {
    // Read the file from disk

    let data = std::fs::read(&path).map_err(|e| format!("Failed to read file: {}", e))?;

    let bytes = fs::read(&path).map_err(|e| e.to_string())?;

    let metadata = fs::metadata(&path).map_err(|e| e.to_string())?;

    let format = FileFormat::from_bytes(&bytes);

    let mime = format.media_type().to_string();
    let crc32 = crc32fast::hash(&bytes);

    if metadata.len() > MAX_IMPORT_FILE_SIZE {
        return Err(format!(
            "The selected project exceeds the maximum supported size of {} MB.",
            MAX_IMPORT_FILE_SIZE / 1024 / 1024
        ));
    }

    let original_name = Path::new(&path)
        .file_name()
        .unwrap_or_default()
        .to_string_lossy()
        .into_owned();
    let entry = ResourceEntry {
        hash_id: hash.clone(),
        data,
        mime: mime.clone(),
        original_name: original_name.clone(),
        crc32,
        directory: dir.clone(),
        size: metadata.len(),
    };

    // dbg!(&entry);

    // Insert into the store
    {
        let mut map = store.lock().map_err(|_| "Failed to lock resource store")?;
        map.insert(hash.clone(), entry.clone());
    }

    // Return the URL that the frontend can use immediately
    let url = format!("proj://localhost/resource/{}", hash);
    Ok(ResourcePayload{
        hash_id: hash,
        mime,
        original_name,
        directory: dir,
        crc32,
        size: metadata.len(),
        url,
    })
}

/// Clears all resources from memory.
/// Call this when the project is unloaded or closed.
#[tauri::command]
pub fn clear_resources(store: State<'_, ResourceStore>) -> Result<(), String> {
    let mut map = store.lock().map_err(|_| "Failed to lock resource store")?;
    map.clear();
    Ok(())
}

// ----------------------------
// Protocol registration helper
// Call this once in lib.rs when building the app
// ----------------------------
/// Registers the `proj://` custom protocol.
/// Resources become available at: `proj://localhost/resource/<hash>`
///
/// IMPORTANT: Media files (mp3/mp4/...) require proper HTTP Range support.
/// Without 206 Partial Content + Accept-Ranges + Content-Range the WebView
/// will refuse to play them ("Plug-in handled load").
pub fn register_resource_protocol(
    builder: tauri::Builder<tauri::Wry>,
    store: ResourceStore,
) -> tauri::Builder<tauri::Wry> {
    builder.register_asynchronous_uri_scheme_protocol("proj", move |_ctx, request, responder| {
        let path = request.uri().path(); // e.g. "/resource/abc123..."
        let hash = path
            .trim_start_matches('/')
            .trim_start_matches("resource/")
            .to_string();

        let store = store.clone();

        std::thread::spawn(move || {
            let response = match store.lock() {
                Ok(map) => {
                    if let Some(entry) = map.get(&hash) {
                        build_resource_response(&request, entry)
                    } else {
                        ResponseBuilder::new()
                            .status(StatusCode::NOT_FOUND)
                            .header(CONTENT_TYPE, "text/plain")
                            .body(b"Resource not found".to_vec())
                            .unwrap()
                    }
                }
                Err(_) => ResponseBuilder::new()
                    .status(StatusCode::INTERNAL_SERVER_ERROR)
                    .header(CONTENT_TYPE, "text/plain")
                    .body(b"Internal error".to_vec())
                    .unwrap(),
            };

            responder.respond(response);
        });
    })
}

/// Builds the correct HTTP response for a resource.
/// Supports both full-file (200) and Range requests (206).
fn build_resource_response(
    request: &http::Request<Vec<u8>>,
    entry: &ResourceEntry,
) -> http::Response<Vec<u8>> {
    let data = &entry.data;
    let len = data.len() as u64;
    let mime = &entry.mime;

    let mut resp = ResponseBuilder::new()
        .header(CONTENT_TYPE, mime)
        .header("Access-Control-Allow-Origin", "*")
        .header("Cache-Control", "public, max-age=31536000, immutable")
        .header(ACCEPT_RANGES, "bytes"); // advertise that we support ranges

    // ------------------------------------------------------------------
    // Range request handling (required for <audio>/<video>)
    // ------------------------------------------------------------------
    if let Some(range_header) = request.headers().get(RANGE) {
        // Helper for 416 Range Not Satisfiable
        let not_satisfiable = || {
            ResponseBuilder::new()
                .status(StatusCode::RANGE_NOT_SATISFIABLE)
                .header(CONTENT_RANGE, format!("bytes */{len}"))
                .header(ACCEPT_RANGES, "bytes")
                .body(Vec::new())
                .unwrap()
        };

        let ranges = match HttpRange::parse(
            range_header.to_str().unwrap_or(""),
            len,
        ) {
            Ok(r) => r,
            Err(_) => return not_satisfiable(),
        };

        // We only support a single range for simplicity (most common case).
        // Multi-range (multipart/byteranges) is rarely needed for media.
        if ranges.len() == 1 {
            let range = &ranges[0];
            let start = range.start;
            let mut end = range.start + range.length - 1;

            // Sanity checks
            if start >= len || end >= len || end < start {
                return not_satisfiable();
            }

            // Optional safety limit (WebView2 sometimes asks for huge ranges)
            // Adjust or remove if you prefer to serve the full requested range.
            const MAX_CHUNK: u64 = 2 * 1024 * 1024; // 2 MB
            end = start + (end - start).min(len - start).min(MAX_CHUNK - 1);

            let bytes_to_send = (end - start + 1) as usize;
            let body = data[start as usize..=end as usize].to_vec();

            return resp
                .status(StatusCode::PARTIAL_CONTENT)
                .header(CONTENT_RANGE, format!("bytes {start}-{end}/{len}"))
                .header(CONTENT_LENGTH, bytes_to_send)
                .body(body)
                .unwrap();
        } else {
            // Multi-range not implemented → fall back to full file
            // (or implement multipart/byteranges if you really need it)
        }
    }

    // ------------------------------------------------------------------
    // Normal full-file response (images, text, or when no Range header)
    // ------------------------------------------------------------------
    resp.header(CONTENT_LENGTH, len)
        .status(StatusCode::OK)
        .body(data.clone())
        .unwrap()
}
