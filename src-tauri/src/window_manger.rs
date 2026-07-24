use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};

#[tauri::command]
pub fn open_about(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("about") {
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
        return Ok(());
    }


    let about = WebviewWindowBuilder::new(
        &app,
        "about",
        WebviewUrl::App("/about.html".into()),
    )
        .title("About")
        .transparent(true)
        .decorations(false)
        .resizable(false)
        .always_on_top(true)
        .center()
        .inner_size(900.0, 600.0)
        .build()
        .map_err(|e| e.to_string())?;

    about.remove_menu().map_err(|e| e.to_string())?;

    Ok(())
}