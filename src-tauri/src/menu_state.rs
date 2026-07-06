use std::ffi::c_long;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{AppHandle, State, Runtime};
use tauri::menu::{Menu, Submenu, MenuItem, MenuItemKind};

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
            &MenuItem::with_id(app, "exit", "Exit", true, None::<&str>)?,
        ],
    )?;

    Menu::with_items(app, &[&file_menu])
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
            &MenuItem::with_id(app, "open", "Open...", true, None::<&str>)?,
            &MenuItem::with_id(app, "save", "Save", state.can_save, None::<&str>)?,
            &MenuItem::with_id(app, "save_as", "Save As...", true, None::<&str>)?,
            &MenuItem::with_id(app, "close", "Close Project", true, None::<&str>)?,
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

    Menu::with_items(app, &[&file_menu, &edit_menu])
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