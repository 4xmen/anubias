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

pub fn logs_panel_toggle(app: &AppHandle) {
    let _ = app.emit("menu-event", "logs-panel-toggle");
}
pub fn components_panel_toggle(app: &AppHandle) {
    let _ = app.emit("menu-event", "components-panel-toggle");
}
pub fn properties_panel_toggle(app: &AppHandle) {
    let _ = app.emit("menu-event", "properties-panel-toggle");
}