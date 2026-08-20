mod config;
mod file;
mod format;
mod global_shortcut;
mod menu;
mod message;

mod window_manger;

use http::header::CONTENT_TYPE;
use http::{Response, StatusCode};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tauri::{include_image, Manager};

use crate::config::{DEV_TOOLS, IS_DEBUG, SECOND_MONITOR};
use crate::file::general::path_exists;
use crate::file::project::{
    autosave_project_backup, delete_old_backups, list_backups, load_project, save_project,
};
use crate::menu::menu_state::{build_menu_no_project, set_menu_state, MenuState};
// use crate::file::asset::{
//     register_file_binary, get_fast_file_metadata
// };

use tauri::AppHandle;
use tauri::{PhysicalPosition, Position};
use tauri_plugin_opener::OpenerExt;
use window_manger::open_about;

use crate::file::resource::{add_resource, ResourceEntry,sync_resources};

type ResourceStore = Arc<Mutex<HashMap<String, ResourceEntry>>>;

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
    let resource_store: ResourceStore = Arc::new(Mutex::new(HashMap::new()));

    // let builder =
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_positioner::init())
        .manage(menu_state)
        .manage(resource_store.clone()) //just copy refrence
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
            path_exists,
            open_about,
            add_resource,
            sync_resources
        ])
        // /// register custome protocol `proj://`
        // let builder = register_resource_protocol(builder, resource_store);
        .setup(|app| {
            // Start the resource server
            crate::file::resource::init_resource_server(app.handle(), resource_store)?;

            let window = app.get_webview_window("main").unwrap();

            println!("App debug status: {}", IS_DEBUG);
            if SECOND_MONITOR {
                if let Some(monitor) = window.available_monitors()?.get(1) {
                    let pos = monitor.position();

                    window.set_position(Position::Physical(PhysicalPosition {
                        x: pos.x,
                        y: pos.y,
                    }))?;

                    window.maximize()?;
                }
            }

            if DEV_TOOLS {
                window.open_devtools();
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
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::Destroyed = event {
                // Optional: also clear resources
            }
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app_handle, event| {
            if let tauri::RunEvent::Exit = event {
                crate::file::resource::shutdown_resource_server(app_handle);
            }
        });
}
