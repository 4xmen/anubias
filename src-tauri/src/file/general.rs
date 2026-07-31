use std::path::Path;

/// Checks whether a project or directory exists at the given path.
///
/// This Tauri command provides a simple way for the frontend to verify path existence
/// without exposing raw filesystem APIs. Returns immediately without throwing errors.
///
/// # Parameters
///
/// * `path` - Absolute or relative project system path to check
///
/// # Returns
///
/// * `true` - Path exists (project or directory)
/// * `false` - Path does not exist or is inaccessible
///
/// # Notes
///
/// This function does not distinguish between files and directories.
/// Permission errors are treated as "path does not exist" (returns `false`).
///
#[tauri::command]
pub fn path_exists(path: String) -> bool {
    Path::new(&path).exists()
}