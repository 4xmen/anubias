#[cfg(desktop)]
use tauri::{AppHandle};
#[cfg(desktop)]
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};
use crate::menu::menu_actions;

#[cfg(desktop)]
pub fn init(app: &AppHandle) {

    println!("start init shortcut");
    let redo = Shortcut::new(Some(Modifiers::CONTROL), Code::KeyY);

    if let Err(e) = app.plugin(
        tauri_plugin_global_shortcut::Builder::new()
            .with_handler(move |app, shortcut, event| {
                if shortcut == &redo && event.state() == ShortcutState::Pressed {
                    menu_actions::redo(app);
                }
            })
            .build(),
    ) {
        eprintln!("failed to init global-shortcut plugin: {e}");

        return;
    }

    if let Err(e) = app.global_shortcut().register(redo) {
        eprintln!("failed to register redo shortcut: {e}");
    }
}