use crate::config::MAX_IMPORT_FILE_SIZE;
use file_format::FileFormat;
use http_range::HttpRange;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::io;
use std::io::Read;
use std::path::Path;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::{fmt, fs, thread};
use tauri::{AppHandle, Manager, State};
use tiny_http::{Header, Response, Server, StatusCode};
// ----------------------------
// Types
// ----------------------------

#[allow(dead_code)]
#[derive(Clone)]
pub struct ResourceEntry {
    pub hash_id: String,
    pub data: Arc<Vec<u8>>,
    pub mime: String,
    pub original_name: String,
    pub crc32: u32,
    pub directory: String,
    pub size: u64,
}
#[allow(dead_code)]
#[derive(Clone, Deserialize, Serialize)]
pub struct ResourcePayload {
    pub hash_id: String,
    pub url: String,
    pub mime: String,
    pub original_name: String,
    pub crc32: u32,
    pub directory: String,
    pub size: u64,
}

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

/// Shared in-memory store for resources
/// Key = hash_id coming from the frontend
pub type ResourceStore = Arc<Mutex<HashMap<String, ResourceEntry>>>;

/// Holds the base URL of the local resource server (e.g. "http://127.0.0.1:54321")
pub type ResourceServerBase = Arc<Mutex<Option<String>>>;

/// Flag used to signal the HTTP server thread to stop
pub type ServerShutdownFlag = Arc<AtomicBool>;

// Helper reader that keeps the Arc alive and reads without copying the underlying bytes.
// This gives us true zero-copy for the full-file response path.
struct ArcVecReader {
    data: Arc<Vec<u8>>,
    pos: usize,
}

impl Read for ArcVecReader {
    fn read(&mut self, buf: &mut [u8]) -> io::Result<usize> {
        let slice = self.data.as_slice();
        if self.pos >= slice.len() {
            return Ok(0);
        }
        let remaining = &slice[self.pos..];
        let n = remaining.len().min(buf.len());
        buf[..n].copy_from_slice(&remaining[..n]);
        self.pos += n;
        Ok(n)
    }
}

// ----------------------------
// Commands
// ----------------------------

/// Adds a resource to the in-memory store and returns an HTTP URL
/// served by the local tiny_http server.
///
/// Example URL: `http://127.0.0.1:54321/resource/<hash>`
#[tauri::command]
pub fn add_resource(
    store: State<'_, ResourceStore>,
    server_base: State<'_, ResourceServerBase>,
    hash: String,
    path: String,
    dir: String,
) -> Result<ResourcePayload, String> {
    let data = fs::read(&path).map_err(|e| format!("Failed to read file: {}", e))?;
    let metadata = fs::metadata(&path).map_err(|e| e.to_string())?;

    if metadata.len() > MAX_IMPORT_FILE_SIZE {
        return Err(format!(
            "The selected project exceeds the maximum supported size of {} MB.",
            MAX_IMPORT_FILE_SIZE / 1024 / 1024
        ));
    }

    let format = FileFormat::from_bytes(&data);
    let mime = format.media_type().to_string();
    let crc32 = crc32fast::hash(&data);

    let original_name = Path::new(&path)
        .file_name()
        .unwrap_or_default()
        .to_string_lossy()
        .into_owned();

    let data = Arc::new(data);
    let entry = ResourceEntry {
        hash_id: hash.clone(),
        data,
        mime: mime.clone(),
        original_name: original_name.clone(),
        crc32,
        directory: dir.clone(),
        size: metadata.len(),
    };

    // Insert into the store
    {
        let mut map = store.lock().map_err(|_| "Failed to lock resource store")?;
        map.insert(hash.clone(), entry);
    }

    // Build URL from the running local server
    let base = server_base
        .lock()
        .map_err(|_| "Failed to lock server base")?
        .clone()
        .ok_or_else(|| "Resource server is not running".to_string())?;

    let url = format!("{}/resource/{}", base, hash);

    Ok(ResourcePayload {
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
/// Call this when the project is unloaded or closed
#[tauri::command]
pub fn clear_resources(store: State<'_, ResourceStore>) -> Result<(), String> {
    let mut map = store.lock().map_err(|_| "Failed to lock resource store")?;
    map.clear();
    Ok(())
}

/// Synchronizes the in-memory resource store with the given list of hash_ids
/// Any resource whose hash_id is **not** present in `keep` will be removed
///
/// Useful after undo/redo operations where some resources are no longer needed
#[tauri::command]
pub fn sync_resources(store: State<'_, ResourceStore>, keep: Vec<String>) -> Result<(), String> {
    let mut map = store.lock().map_err(|_| "Failed to lock resource store")?;

    // Retain only the entries whose key exists in the provided list
    map.retain(|hash, _| keep.contains(hash));

    Ok(())
}

// ----------------------------
// Local HTTP Server (tiny_http)
// ----------------------------

/// Starts the resource server on a random free port (127.0.0.1:0)
/// Returns the base URL so the rest of the app can build resource URLs
///
/// The server runs in a background thread and will stop when
/// `shutdown_flag` is set to `true` (or when the process exits)
pub fn start_resource_server(
    store: ResourceStore,
    shutdown_flag: ServerShutdownFlag,
) -> Result<String, String> {
    let server = Server::http("127.0.0.1:0")
        .map_err(|e| format!("Failed to bind resource server: {}", e))?;

    let port = match server.server_addr() {
        tiny_http::ListenAddr::IP(socket) => socket.port(),
        _ => return Err("Unexpected listen address type".into()),
    };

    let base_url = format!("http://127.0.0.1:{}", port);
    println!("[ResourceServer] listening on {}", base_url);

    let store_clone = store.clone();
    let flag_clone = shutdown_flag.clone();

    thread::spawn(move || {
        // We use a short timeout so the thread can periodically check the shutdown flag
        // tiny_http does not have a perfect non-blocking API, so this is the pragmatic approach
        while !flag_clone.load(Ordering::SeqCst) {
            match server.recv_timeout(std::time::Duration::from_millis(300)) {
                Ok(Some(request)) => {
                    handle_request(request, &store_clone);
                }
                Ok(None) => {
                    // timeout – just loop and check the flag again
                }
                Err(e) => {
                    eprintln!("[ResourceServer] recv error: {}", e);
                    break;
                }
            }
        }
        println!("[ResourceServer] shutdown complete");
    });

    Ok(base_url)
}

/// Handles a single incoming request
/// Supports both full-file (200) and Range (206) responses
/// Handles a single incoming request
/// Supports both full-file (200) and Range (206) responses
fn handle_request(request: tiny_http::Request, store: &ResourceStore) {
    let url = request.url(); // e.g. "/resource/abc123..."

    let hash = match url.strip_prefix("/resource/") {
        Some(h) if !h.is_empty() && !h.contains('/') => h.to_string(),
        _ => {
            let _ = request.respond(Response::empty(404));
            return;
        }
    };

    let entry = {
        let map = match store.lock() {
            Ok(m) => m,
            Err(_) => {
                let _ = request.respond(Response::empty(500));
                return;
            }
        };
        match map.get(&hash) {
            Some(e) => e.clone(),
            None => {
                let _ = request.respond(Response::empty(404));
                return;
            }
        }
    };

    // data is Arc<Vec<u8>> → only the reference count is incremented
    let data = entry.data;
    let len = data.len() as u64;
    let mime = &entry.mime;

    // ---------- Range request handling ----------
    if let Some(range_header) = request
        .headers()
        .iter()
        .find(|h| h.field.equiv("Range"))
        .map(|h| h.value.as_str())
    {
        match HttpRange::parse(range_header, len) {
            Ok(ranges) if ranges.len() == 1 => {
                let range = &ranges[0];
                let start = range.start;
                let mut end = range.start + range.length - 1;

                if start >= len || end >= len || end < start {
                    // 416 Range Not Satisfiable
                    let mut response = Response::empty(416);
                    response.add_header(
                        Header::from_bytes("Content-Range", format!("bytes */{}", len).as_bytes())
                            .unwrap(),
                    );
                    let _ = request.respond(response);
                    return;
                }

                // Safety limit (some WebViews request extremely large ranges)
                // Guard against empty files and invalid ranges
                if len == 0 || start >= len {
                    let mut response = Response::empty(416);
                    response.add_header(
                        Header::from_bytes("Content-Range", format!("bytes */{}", len).as_bytes())
                            .unwrap(),
                    );
                    let _ = request.respond(response);
                    return;
                }

                // Clamp end so it never exceeds the last valid byte
                let max_end = len - 1;
                end = end.min(max_end);

                // Apply safety chunk limit
                const MAX_CHUNK: u64 = 2 * 1024 * 1024; // 2 MB
                if end - start + 1 > MAX_CHUNK {
                    end = start + MAX_CHUNK - 1;
                }

                // Only the requested range is copied (max 2 MB) – acceptable
                let body = data[start as usize..=end as usize].to_vec();
                let content_len = body.len();

                let mut response = Response::from_data(body).with_status_code(StatusCode(206));

                response.add_header(Header::from_bytes("Content-Type", mime.as_bytes()).unwrap());
                response.add_header(Header::from_bytes("Accept-Ranges", b"bytes").unwrap());
                response.add_header(
                    Header::from_bytes(
                        "Content-Range",
                        format!("bytes {}-{}/{}", start, end, len).as_bytes(),
                    )
                    .unwrap(),
                );
                response.add_header(
                    Header::from_bytes("Content-Length", content_len.to_string().as_bytes())
                        .unwrap(),
                );
                response
                    .add_header(Header::from_bytes("Access-Control-Allow-Origin", b"*").unwrap());
                response.add_header(
                    Header::from_bytes("Cache-Control", b"public, max-age=31536000, immutable")
                        .unwrap(),
                );

                let _ = request.respond(response);
                return;
            }
            _ => {
                // Invalid or multi-range → fall through to full file
            }
        }
    }

    // ---------- Full file response (200) ----------
    // Zero-copy: ArcVecReader only increments the Arc refcount.
    // The actual bytes stay in the original allocation and are streamed directly.
    let reader = ArcVecReader { data, pos: 0 };

    let mut response = Response::new(
        StatusCode(200),
        Vec::new(),
        reader,
        Some(len as usize),
        None,
    );

    response.add_header(Header::from_bytes("Content-Type", mime.as_bytes()).unwrap());
    response.add_header(Header::from_bytes("Accept-Ranges", b"bytes").unwrap());
    response.add_header(Header::from_bytes("Access-Control-Allow-Origin", b"*").unwrap());
    response.add_header(
        Header::from_bytes("Cache-Control", b"public, max-age=31536000, immutable").unwrap(),
    );

    let _ = request.respond(response);
}
// ----------------------------
// Integration helpers
// ----------------------------

/// Call this once in your `setup` hook.
/// It starts the server and stores the base URL + shutdown flag in the app state.
pub fn init_resource_server(app: &AppHandle, store: ResourceStore) -> Result<(), String> {
    let shutdown_flag = Arc::new(AtomicBool::new(false));
    let base_url = start_resource_server(store, shutdown_flag.clone())?;

    app.manage(Arc::new(Mutex::new(Some(base_url))));
    app.manage(shutdown_flag);

    Ok(())
}

/// Call this when the application is about to exit.
/// It signals the server thread to stop.
pub fn shutdown_resource_server(app: &AppHandle) {
    if let Some(flag) = app.try_state::<ServerShutdownFlag>() {
        flag.store(true, Ordering::SeqCst);
        println!("[ResourceServer] shutdown signal sent");
    }
}
