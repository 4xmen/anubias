use std::ffi::c_long;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{AppHandle, State, Runtime};
use tauri::menu::{Menu, Submenu, MenuItem, MenuItemKind, PredefinedMenuItem, CheckMenuItem};

#[derive(Clone)]
pub struct MenuState {
    can_undo: bool,
    can_redo: bool,
    can_save: bool,
    is_project_loaded: bool,
}



impl MenuState {
    pub fn new() -> Self {
        MenuState {
            can_save: false,
            can_undo: false,
            can_redo: false,
            is_project_loaded: false,
        }
    }

    // rebuild ide menu
    pub fn rebuild_menu<R: Runtime>(&self, app: &AppHandle<R>) -> tauri::Result<()> {
        let menu = if self.is_project_loaded {
            build_menu_with_project(app, self)?
        } else {
            build_menu_no_project(app)?
        };
        app.set_menu(menu)?;
        Ok(())
    }
}

#[derive(Serialize, Deserialize)]
pub enum StateList {
    CanSave,
    CanUndo,
    CanRedo,
    IsProjectLoaded,
}

pub fn build_menu_no_project<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<Menu<R>> {
    let file_menu = Submenu::with_items(
        app,
        "File",
        true,
        &[
            &MenuItem::with_id(app, "new", "New Project", true, None::<&str>)?,
            &MenuItem::with_id(app, "open", "Open...", true, None::<&str>)?,
            &PredefinedMenuItem::separator(app)?,
            &MenuItem::with_id(app, "exit", "Exit", true, Some("Alt+F4"))?,
        ],
    )?;


    let help_menu = help_menu(app)?;
    Menu::with_items(app, &[&file_menu,&help_menu])
}

pub fn build_menu_with_project<R: Runtime>(
    app: &AppHandle<R>,
    state: &MenuState
) -> tauri::Result<Menu<R>> {
    let file_menu = Submenu::with_items(
        app,
        "File",
        true,
        &[
            &MenuItem::with_id(app, "new", "New Project", true, None::<&str>)?,
            &MenuItem::with_id(app, "open", "Open...", true,  Some("CmdOrCtrl+O"))?,
            &MenuItem::with_id(app, "save", "Save", state.can_save, None::<&str>)?,
            &MenuItem::with_id(app, "save_as", "Save As...", true, None::<&str>)?,
            &MenuItem::with_id(app, "close", "Close Project", true, None::<&str>)?,
            &PredefinedMenuItem::separator(app)?,
            &MenuItem::with_id(app, "exit", "Exit", true, Some("Alt+F4"))?,
        ],
    )?;

    let edit_menu = Submenu::with_items(
        app,
        "Edit",
        true,
        &[
            &MenuItem::with_id(app, "undo", "Undo", state.can_undo, None::<&str>)?,
            &MenuItem::with_id(app, "redo", "Redo", state.can_redo, None::<&str>)?,
        ],
    )?;
    let view_menu = Submenu::with_items(
        app,
        "View",
        true,
        &[
            &MenuItem::with_id(app, "logs", "Logs panel toggle", true, None::<&str>)?,
            &MenuItem::with_id(app, "components", "Components panel toggle", true, None::<&str>)?,
            &MenuItem::with_id(app, "properties", "Properties panel toggle", true, None::<&str>)?,
            &PredefinedMenuItem::separator(app)?,
            &MenuItem::with_id(app, "fullscreen", "Full screen toggle", true,  Some("F11"))?,
        ],
    )?;
    let setting_menu = Submenu::with_items(
        app,
        "Setting",
        true,
        &[
            &MenuItem::with_id(app, "preference", "Preferences", true, None::<&str>)?,
            &MenuItem::with_id(app, "sdk", "SDK", true, None::<&str>)?,
            &MenuItem::with_id(app, "emulator", "Emulators", true, None::<&str>)?,
            &MenuItem::with_id(app, "project", "Project setting", true, None::<&str>)?,
            &MenuItem::with_id(app, "resource", "Resources", true, None::<&str>)?,
        ],
    )?;
    let app_menu = Submenu::with_items(
        app,
        "Application",
        true,
        &[
            &MenuItem::with_id(app, "debug", "Debug", true, None::<&str>)?,
            &MenuItem::with_id(app, "run", "Run", true, None::<&str>)?,
            &MenuItem::with_id(app, "clean", "Emulators", true, None::<&str>)?,
            &MenuItem::with_id(app, "build", "Project setting", true, None::<&str>)?,
            &Submenu::with_items(
                app,
                "Build output",
                true,
                &[
                    &CheckMenuItem::with_id(app, "andriod", "Andriod", true,true,None::<&str>,)?,
                    &CheckMenuItem::with_id(app, "ios", "iOS", true,false,None::<&str>,)?,
                    &CheckMenuItem::with_id(app, "desktop", "Desktop", true,false,None::<&str>,)?,
                    &CheckMenuItem::with_id(app, "web", "WebApp", true,false,None::<&str>,)?,
                ],
            )? ,
            &PredefinedMenuItem::separator(app)?,
            &MenuItem::with_id(app, "cloud", "Cloud build", true, None::<&str>)?,
        ],
    )?;

    let help_menu = help_menu(app)?;
    Menu::with_items(app, &[&file_menu, &edit_menu, &view_menu , &app_menu , &setting_menu ,&help_menu])
}

#[tauri::command]
pub fn set_menu_state<R: Runtime>(
    app: AppHandle<R>,
    menu_state: State<'_, Mutex<MenuState>>,
    state: StateList,
    value: bool,
) -> Result<bool, String> {
    let mut guard = menu_state.lock().unwrap();

    match state {
        StateList::CanUndo => guard.can_undo = value,
        StateList::CanRedo => guard.can_redo = value,
        StateList::CanSave => guard.can_save = value,
        StateList::IsProjectLoaded => guard.is_project_loaded = value,
    }

    if matches!(state, StateList::IsProjectLoaded) {
        guard.rebuild_menu(&app).map_err(|e| e.to_string())?;
    } else {
        update_individual_items(&app, &guard).map_err(|e| e.to_string())?;
    }

    Ok(true)
}

fn update_individual_items<R: Runtime>(
    app: &AppHandle<R>,
    state: &MenuState
) -> Result<(), String> {
    let Some(menu) = app.menu() else {
        println!("⚠️  Menu not found via app.menu()");
        return Ok(());
    };

    println!("🔍 Updating menu items...");

    // Save
    if let Some(MenuItemKind::MenuItem(item)) = find_menu_item_by_id(&menu, "save") {
        println!("✅ Found 'save' item → setting enabled = {}", state.can_save);
        let _ = item.set_enabled(state.can_save);
    } else {
        println!("❌ 'save' item NOT found");
    }

    // Undo
    if let Some(MenuItemKind::MenuItem(item)) = find_menu_item_by_id(&menu, "undo") {
        println!("✅ Found 'undo' item → setting enabled = {}", state.can_undo);
        let _ = item.set_enabled(state.can_undo);
    } else {
        println!("❌ 'undo' item NOT found");
    }

    // Redo
    if let Some(MenuItemKind::MenuItem(item)) = find_menu_item_by_id(&menu, "redo") {
        println!("✅ Found 'redo' item");
        let _ = item.set_enabled(state.can_redo);
    }

    Ok(())
}

// search recursive menu item
fn find_menu_item_by_id<R: Runtime>(
    menu: &Menu<R>,
    id: &str
) -> Option<MenuItemKind<R>> {
    if let Some(item) = menu.get(id) {
        return Some(item);
    }

    let items = menu.items().ok()?;
    for item in items {
        if let MenuItemKind::Submenu(submenu) = item {
            if let Some(found) = find_in_submenu(&submenu, id) {
                return Some(found);
            }
        }
    }
    None
}

fn find_in_submenu<R: Runtime>(
    submenu: &Submenu<R>,
    id: &str
) -> Option<MenuItemKind<R>> {
    if let Some(item) = submenu.get(id) {
        return Some(item);
    }

    let items = submenu.items().ok()?;
    for item in items {
        if let MenuItemKind::Submenu(nested_submenu) = item {
            if let Some(found) = find_in_submenu(&nested_submenu, id) {
                return Some(found);
            }
        }
    }
    None
}


fn help_menu<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<Submenu<R>> {
    let help_menu = Submenu::with_items(
        app,
        "Help",
        true,
        &[
            &MenuItem::with_id(app, "started", "Getting Started", true, None::<&str>)?,
            &MenuItem::with_id(app, "doc", "Documentation", true, None::<&str>)?,
            &MenuItem::with_id(app, "report", "Report Issue", true, None::<&str>)?,
            &MenuItem::with_id(app, "check", "Check new version", true, None::<&str>)?,
            &PredefinedMenuItem::separator(app)?,
            &MenuItem::with_id(app, "about", "About", true, None::<&str>)?,
        ],
    )?;

    Ok(help_menu)
}