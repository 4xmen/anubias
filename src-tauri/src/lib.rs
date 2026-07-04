mod menu_state;
mod file;
mod format;

use std::sync::Mutex;
use tauri::{
    image::Image,
    menu::{IconMenuItemBuilder, Menu, MenuItem, Submenu},
    Manager,
};

use crate::menu_state::{set_menu_state, MenuState};
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_opener::OpenerExt;
use tauri_plugin_store::StoreExt;
use file::{save_project,load_project};

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
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(menu_state)
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
        ])
        .setup(|app| {
            let file_menu = Submenu::with_items(
                app,
                "File",
                true,
                &[
                    &MenuItem::with_id(app, "new", "New", true, None::<&str>)?,
                    &MenuItem::with_id(app, "open", "Open", true, None::<&str>)?,
                ],
            )?;

            app.on_menu_event(move |app_handle: &tauri::AppHandle, event| {
                println!("menu event: {:?}", event.id());

                match event.id().0.as_str() {
                    "open" => {
                        println!("open event");
                    }
                    "close" => {
                        println!("close event");
                    }
                    _ => {
                        println!("unexpected menu event");
                    }
                }
            });

            let menu = Menu::with_items(app, &[&file_menu])?;

            app.set_menu(menu)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
