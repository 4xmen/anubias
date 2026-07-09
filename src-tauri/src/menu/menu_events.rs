use tauri::App;

use super::menu_actions;

pub fn register(app: &App) {
    app.on_menu_event(|app, event| {
        match event.id().as_ref() {
            "save" => menu_actions::save(app),
            "open" => menu_actions::open(app),
            "undo" => menu_actions::undo(app),
            _ => {}
        }
    });
}