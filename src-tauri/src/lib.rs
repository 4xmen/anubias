mod config;
mod file;
mod format;
mod menu;
mod message;
mod global_shortcut;

use std::sync::Mutex;
use tauri::{
    Manager,
};

use crate::config::{IS_DEBUG, SECOND_MONITOR};
use crate::menu::menu_state::{build_menu_no_project, set_menu_state, MenuState};
use file::{
    autosave_project_backup, delete_old_backups, list_backups, load_project, path_exists,
    save_project,
};
use tauri::AppHandle;
use tauri::{PhysicalPosition, Position};
use tauri_plugin_opener::OpenerExt;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn open_url(app: AppHandle, url: String) {
    let _ = app.opener().open_url(url, None::<&str>);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

    let menu_state = Mutex::new(MenuState::new());

    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
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
            set_menu_state,
            save_project,
            load_project,
            autosave_project_backup,
            delete_old_backups,
            list_backups,
            path_exists
        ])
        .setup(|app| {


            println!("App debug status: {}",IS_DEBUG);
            if SECOND_MONITOR  {
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
            let menu = build_menu_no_project(app.handle())?;
            app.set_menu(menu)?;

            // Event handler
            menu::menu_events::register(app);

            // register global shortcut
            global_shortcut::init(app.handle());

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
