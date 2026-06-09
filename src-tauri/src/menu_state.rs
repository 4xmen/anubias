use tauri::State;
use std::sync::Mutex;
use serde::{Deserialize, Serialize};

pub struct MenuState{
    can_undo: bool,
    can_redo: bool,
    can_save: bool,
    is_project_loaded: bool,
}



impl MenuState{
    pub fn new() -> Self{
        MenuState{
            can_save: false,
            can_undo: false,
            can_redo: false,
            is_project_loaded: false,
        }
    }
}

#[derive(Serialize, Deserialize)]
pub enum StateList{
    CanSave,
    CanUndo,
    CanRedo,
    IsProjectLoaded,
}



#[tauri::command]
pub fn set_menu_state(
    menu_state: State<'_, Mutex<MenuState>>,
    state: StateList,
    value: bool,
) -> bool {
    let mut menu = menu_state.lock().unwrap();

    match state {
        StateList::CanUndo => {
            menu.can_undo = value;
        }
        StateList::CanRedo => {
            menu.can_redo = value;
        }
        StateList::CanSave => {
            menu.can_save = value;
        }
        StateList::IsProjectLoaded => {
            menu.is_project_loaded = value;
        }
    }

    true
}