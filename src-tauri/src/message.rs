use serde::Serialize;
use tauri::{AppHandle, Emitter};

#[allow(dead_code)]
#[derive(Serialize, Clone)]
pub enum MessageType {
    Info,
    Error,
    Warning,
    Success,
}

#[derive(Serialize, Clone)]
pub struct ToastPayload {
    pub message_type: MessageType,
    pub message_text: String,
}

pub fn send_toast(app: &AppHandle, message_type: MessageType, message_text: impl Into<String>) {
    let payload = ToastPayload {
        message_type,
        message_text: message_text.into(),
    };

    let _ = app.emit("toast", payload);
}

pub fn send_log(app: &AppHandle, log_message: &str) {
    let _ = app.emit("log", log_message);
}
