mod config;
mod file;
mod format;
mod global_shortcut;
mod menu;
mod message;
mod socket;
mod window_manger;

use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tauri::Manager;

use crate::config::{DEV_TOOLS, IS_DEBUG, SECOND_MONITOR};
use crate::file::general::path_exists;
use crate::file::project::{
    autosave_project_backup, delete_old_backups, list_backups, load_project, save_project,
};
use crate::menu::menu_state::{build_menu_no_project, set_menu_state, MenuState};
use socket::server::{
    broadcast_to_clients, start_ws_server, WsServerState,
};

use tauri::AppHandle;
use tauri::{PhysicalPosition, Position};
use tauri_plugin_opener::OpenerExt;
use window_manger::open_about;

use crate::file::resource::{
    add_resource, clear_resources, init_resource_server, shutdown_resource_server, sync_resources,
    ResourceEntry,
};

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

// Shared app state for the current page hash
struct AppState {
    current_page_hash: Mutex<String>,
}

#[tauri::command]
fn get_current_page_hash(state: tauri::State<'_, AppState>) -> String {
    state.current_page_hash.lock().unwrap().clone()
}

#[tauri::command]
fn set_current_page_hash(state: tauri::State<'_, AppState>, value: String) {
    println!("Set current page hash: {}", value);
    *state.current_page_hash.lock().unwrap() = value;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let menu_state = Mutex::new(MenuState::new());
    let resource_store: ResourceStore = Arc::new(Mutex::new(HashMap::new()));
    let app_state = AppState {
        current_page_hash: Mutex::new(String::new()),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_positioner::init())
        .manage(menu_state)
        .manage(resource_store.clone()) // Keep a shared reference to the resource store
        .manage(app_state) // Store app-wide mutable state here
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            open_url,
            get_current_page_hash,
            set_current_page_hash,
            set_menu_state,
            save_project,
            load_project,
            autosave_project_backup,
            delete_old_backups,
            list_backups,
            path_exists,
            open_about,
            add_resource,
            sync_resources,
            clear_resources,
            broadcast_to_clients,
        ])
        .setup(|app| {
            // Start the resource server
            init_resource_server(app.handle(), resource_store)?;

            // Start WebSocket server
            let ws_state = Arc::new(WsServerState::new());
            app.manage(ws_state.clone());

            let app_handle = app.handle().clone();

            tauri::async_runtime::spawn(async move {
                if let Err(e) = start_ws_server(ws_state, app_handle).await {
                    eprintln!("[ws-server] Failed to start: {}", e);
                }
            });

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

            // Initialize menu state
            let menu_state = Mutex::new(MenuState::new());
            app.manage(menu_state);

            // Set initial menu without a project
            let menu = build_menu_no_project(app.handle())?;
            app.set_menu(menu)?;

            // Register menu event handlers
            menu::menu_events::register(app);

            // Register global shortcut
            global_shortcut::init(app.handle());

            Ok(())
        })
        .on_window_event(|_window, event| {
            if let tauri::WindowEvent::Destroyed = event {
                // Optional: clear resources here if needed
            }
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app_handle, event| {
            if let tauri::RunEvent::Exit = event {
                shutdown_resource_server(app_handle);
            }
        });
}
