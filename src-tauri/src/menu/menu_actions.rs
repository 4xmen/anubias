use tauri::{AppHandle, Emitter};

pub fn save(app: &AppHandle) {
    let _ = app.emit("menu-event", "request-save");
}

pub fn open(app: &AppHandle) {
    let _ = app.emit("menu-event","request-open");
}

pub fn undo(app: &AppHandle) {
    let _ = app.emit("menu-event", "request-undo");
}