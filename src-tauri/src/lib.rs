mod file;
mod format;
mod menu_state;

mod config;

use std::sync::Mutex;
use tauri::{
    image::Image,
    menu::{IconMenuItemBuilder, Menu, MenuItem, Submenu},
    Manager,
};

use crate::config::{IS_DEBUG, SECOND_MONITOR};
use crate::menu_state::{build_menu_no_project, set_menu_state, MenuState};
use file::{load_project, save_project, autosave_project_backup};
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_opener::OpenerExt;
use tauri_plugin_store::StoreExt;
use tauri::{PhysicalPosition, Position};


// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn open_url(app: AppHandle, url: String) {
    let _ = app.opener().open_url(url, None::<&str>);
}
#[tauri::command]
fn set_has_project(app: AppHandle, status: bool) -> bool {
    // let store = app.store("settings.json").unwrap();
    // store.set("theme", "dark");
    // change app menu

    true
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut menu_state = Mutex::new(MenuState::new());

    tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .manage(menu_state)
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            open_url,
            set_has_project,
            set_menu_state,
            save_project,
            load_project,
            autosave_project_backup,
        ])
        .setup(|app| {
            if SECOND_MONITOR {
                let window = app.get_webview_window("main").unwrap();

                if let Some(monitor) = window.available_monitors()?.get(1) {
                    let pos = monitor.position();

                    window.set_position(Position::Physical(PhysicalPosition {
                        x: pos.x,
                        y: pos.y,
                    }))?;

                    window.maximize()?;
                }
            }
            // to manage menu state
            let menu_state = Mutex::new(MenuState::new());
            app.manage(menu_state);

            // initial menu without project
            let initial_state = MenuState::new();
            let menu = build_menu_no_project(app.handle())?;
            app.set_menu(menu)?;

            // Event handler
            app.on_menu_event(|app_handle, event| {
                match event.id().0.as_str() {
                    "new" => { /* ... */ }
                    "open" => { /* ... */ }
                    "save" => { /* ... */ }
                    "undo" => { /* ... */ }
                    _ => {}
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
