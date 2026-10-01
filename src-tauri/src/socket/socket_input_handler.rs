use std::sync::Arc;
use serde::Deserialize;
use tauri::{AppHandle, Emitter, Manager};
use tokio_tungstenite::tungstenite::{Error, Message};
use crate::AppState;

#[inline]
pub fn handle_input_socket(input: Result<Message,Error>, app_handle: AppHandle){
    match input {
        Ok(Message::Text(text)) => {
            if let Err(e) = app_handle.emit("ws-handle", text.to_string()) {
                eprintln!("[ws-server] Failed to emit ws-handle: {}", e);
            }
        },

        Ok(Message::Close(_)) => {
            println!("Client disconnected");
            return;
        }

        Ok(Message::Binary(data)) => {
            handle_binary(Vec::from(data), &app_handle);
        }

        Ok(_) => {
            // others
        }

        Err(e) => {
            eprintln!("WebSocket error: {}", e);
            return;
        }
    }
}

fn handle_binary(data: Vec<u8>, app_handle: &AppHandle) {
    const SCREENSHOT_SIGNATURE: &[u8; 4] = b"SCRN";

    if data.len() < SCREENSHOT_SIGNATURE.len() {
        eprintln!("[ws-server] Binary packet too small");
        return;
    }

    let (signature, payload) = data.split_at(4);

    match signature {
        b"SCRN" => {
            let app_state = app_handle.state::<AppState>();
            let hash = app_state.current_page_hash.lock().unwrap().clone();

            println!(
                "[ws-server] Screenshot received: {} bytes with hash {}",
                payload.len(),
                hash
            );

            // Store with Arc so cloning is cheap
            let screenshot_data = Arc::new(payload.to_vec());

            {
                let mut screenshots = app_state.screenshots.lock().unwrap();
                screenshots.insert(hash.clone(), screenshot_data);
            }

            // Notify frontend
            if let Err(e) = app_handle.emit("screenshot-received", &hash) {
                eprintln!("[ws-server] Failed to emit screenshot-received: {}", e);
            }
        }
        _ => {
            println!("[ws-server] Unknown binary signature: {:?}", signature);
        }
    }
}
