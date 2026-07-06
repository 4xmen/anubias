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
    /// Creates a new menu state instance with all options disabled by default.
    ///
    /// # Returns
    ///
    /// A new `MenuState` where all action states (`can_save`, `can_undo`, `can_redo`, and
    /// `is_project_loaded`) are initialized to `false`.
    pub fn new() -> Self {
        MenuState {
            can_save: false,
            can_undo: false,
            can_redo: false,
            is_project_loaded: false,
        }
    }

    /// Updates the menu to reflect the current state.
    ///
    /// Rebuilds the menu based on whether a project is currently loaded. When a project is
    /// loaded, additional menu options become available. Otherwise, only basic menu items
    /// are shown.
    ///
    /// # Arguments
    ///
    /// * `app` - A reference to the application instance used to apply the new menu.
    ///
    /// # Returns
    ///
    /// `Ok(())` if the menu was successfully updated, or an `Err` if something went wrong
    /// during the menu construction or application.
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

/// Constructs the basic menu structure when no project is open.
///
/// Creates a menu with fundamental options available regardless of project state.
/// This includes actions like creating a new project, opening an existing one, and exiting.
///
/// # Arguments
///
/// * `app` - A reference to the application instance needed to build menu components.
///
/// # Returns
///
/// Returns the constructed menu, or an `Err` if menu construction fails.
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

/// Constructs the complete menu structure when a project is open.
///
/// Builds a menu with all available options for an active project. Menu item availability
/// is determined by the current state—for example, the Save option is only enabled when
/// there are unsaved changes, and Undo/Redo are enabled based on history availability.
///
/// # Arguments
///
/// * `app` - A reference to the application instance needed to build menu components.
/// * `state` - The current menu state that determines which options should be enabled or disabled.
///
/// # Returns
///
/// Returns the constructed menu, or an `Err` if menu construction fails.
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


/// Updates a specific menu state property and applies the changes to the menu.
///
/// This is a tauri command call from front-end API
/// Modifies one of the menu state flags that control whether certain menu options are
/// enabled or disabled. When the project-loaded state changes, the entire menu is rebuilt.
/// For other state changes, only the affected menu items are updated.
///
/// # Arguments
///
/// * `app` - A reference to the application instance used to update the menu.
/// * `menu_state` - A shared reference to the current menu state that will be modified.
/// * `state` - Which state property should be updated.
/// * `value` - The new value for the selected property.
///
/// # Returns
///
/// Returns `Ok(true)` if the state was successfully updated and applied, or an `Err`
/// with a description if the operation failed.
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


/// Updates the enabled state of individual menu items based on the current menu state.
///
/// Locates specific menu items within the application menu and sets their enabled
/// or disabled status according to the corresponding properties in the menu state.
/// This is used for incremental updates when state changes that do not require
/// a complete menu rebuild.
///
/// # Arguments
///
/// * `app` - A reference to the application instance from which the menu is retrieved.
/// * `state` - A reference to the current menu state containing the enabled/disabled
///   flags for each menu item.
///
/// # Returns
///
/// Returns `Ok(())` if the menu items were successfully updated, or an `Err` with
/// a description if retrieving or updating the menu failed.
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




/// Recursively searches for a menu item by its identifier throughout the menu structure.
///
/// Traverses the menu hierarchy, checking both top-level items and items within submenus,
/// to locate the menu item with the specified ID. The search uses a breadth-first approach
/// at each level before descending into nested submenus.
///
/// # Arguments
///
/// * `menu` - The menu to search within.
/// * `id` - The identifier string of the menu item to find.
///
/// # Returns
///
/// Returns `Some(MenuItemKind)` if a matching item is found, or `None` if no item
/// with the given ID exists in the menu structure.
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

/// Recursively searches for a menu item within a submenu and its nested submenus.
///
/// A helper function that traverses a submenu hierarchy to find an item by its identifier.
/// It checks the current submenu first, then recursively searches any nested submenus
/// found within it.
///
/// # Arguments
///
/// * `submenu` - The submenu to search within.
/// * `id` - The identifier string of the menu item to find.
///
/// # Returns
///
/// Returns `Some(MenuItemKind)` if a matching item is found, or `None` if no item
/// with the given ID exists in the submenu or its nested structure.
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


/// Constructs the Help submenu with application assistance and information options.
///
/// Creates a submenu containing links to documentation, issue reporting, version checking,
/// and other help-related functionality. The submenu is enabled by default and ready to
/// be integrated into the application menu.
///
/// # Arguments
///
/// * `app` - A reference to the application instance used to create menu items.
///
/// # Returns
///
/// Returns `Ok(Submenu)` containing the constructed Help menu if successful, or an `Err`
/// if creating any of the menu items failed.
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