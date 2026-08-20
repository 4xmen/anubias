use tauri::App;

use super::menu_actions;

pub fn register(app: &App) {
    app.on_menu_event(|app, event| match event.id().as_ref() {
        "about" => menu_actions::about(app),
        "save" => menu_actions::save(app),
        "open" => menu_actions::open(app),
        "undo" => menu_actions::undo(app),
        "redo" => menu_actions::redo(app),
        "properties" => menu_actions::properties_panel_toggle(app),
        "components" => menu_actions::components_panel_toggle(app),
        "preference" => menu_actions::open_settings(app),
        "resource" =>  menu_actions::open_resource(app),
        "logs" => menu_actions::logs_panel_toggle(app),
        _ => {
            println!("Unhandled event: {:?}", event.id().as_ref());
        }
    });
}
