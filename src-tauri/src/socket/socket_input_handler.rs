use serde::Deserialize;
use tauri::{AppHandle,Emitter};
use tokio_tungstenite::tungstenite::{Error, Message};



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

        Ok(_) => {
            // others
        }

        Err(e) => {
            eprintln!("WebSocket error: {}", e);
            return;
        }
    }
}