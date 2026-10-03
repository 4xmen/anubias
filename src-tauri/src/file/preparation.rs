// Preparation tasks
// The preparation task will run before debug or build
// if run will be necessary
use anyhow::{anyhow, Context, Result as AnyResult};
use std::path::{Path, PathBuf};
use crate::constants::DEFAULT_APP_ID;
use crate::file::general::{refresh_source, replace_in_file, ReplaceError};



/// Relative paths that contain the application ID and do **not** depend on
/// the package directory structure.
const STATIC_APP_ID_FILES: &[&str] = &[
    // ------------------------------------------------------------------
    // Android
    // ------------------------------------------------------------------
    "android/app/build.gradle.kts",

    // ------------------------------------------------------------------
    // Windows
    // ------------------------------------------------------------------
    "windows/runner/Runner.rc",

    // ------------------------------------------------------------------
    // Linux
    // ------------------------------------------------------------------
    "linux/CMakeLists.txt",

    // ------------------------------------------------------------------
    // iOS
    // ------------------------------------------------------------------
    "ios/Runner.xcodeproj/project.pbxproj",

    // ------------------------------------------------------------------
    // macOS
    // ------------------------------------------------------------------
    "macos/Runner.xcodeproj/project.pbxproj",
    "macos/Runner/Configs/AppInfo.xcconfig",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/// Builds the relative path to `MainActivity.kt` for the given application ID.
fn android_main_activity_path(app_id: &str) -> String {
    let package_dir = app_id.replace('.', "/");
    format!("android/app/src/main/kotlin/{package_dir}/MainActivity.kt")
}

/// Returns every relative path that is expected to contain `app_id`.
fn app_id_files(app_id: &str) -> Vec<String> {
    let mut files: Vec<String> = STATIC_APP_ID_FILES
        .iter()
        .map(|s| (*s).to_owned())
        .collect();
    files.push(android_main_activity_path(app_id));
    files
}

// ---------------------------------------------------------------------------
// Core logic (sync – called from spawn_blocking)
// ---------------------------------------------------------------------------

/// Changes the application ID in all relevant Flutter project files.
///
/// This is the pure synchronous implementation. Prefer calling it through
/// the Tauri command so the UI thread is never blocked.
///
/// # Stages
///
/// 1. **In-place replace** – verifies that every expected file exists, then
///    runs the replacements.
///    - Missing file or `PatternNotFound` → falls through to stage 2.
///    - Any other error (especially write failures) aborts immediately.
///
/// 2. **Fallback** – restores the files from the project template
///    they match `DEFAULT_APP_ID`, then performs the replacements again.
///    Any failure here is returned as an error.
pub fn change_application_id(
    project_root: impl AsRef<Path>,
    old_app_id: &str,
    new_app_id: &str,
) -> AnyResult<()> {
    let root = project_root.as_ref();

    // Stage 1
    if try_stage1_replace(root, old_app_id, new_app_id)? {
        return Ok(());
    }

    // Stage 2 – fallback
    stage2_fallback(root, new_app_id)
}

/// Attempts the in-place replacement.
///
/// Returns `Ok(true)` on full success, `Ok(false)` when a fallback is needed
/// (missing file or pattern not found), and `Err` for fatal errors.
fn try_stage1_replace(
    root: &Path,
    old_app_id: &str,
    new_app_id: &str,
) -> AnyResult<bool> {
    let files = app_id_files(old_app_id);

    // Verify every file is present before touching anything.
    for rel in &files {
        let full = root.join(rel);
        if !full.is_file() {
            return Ok(false);
        }
    }

    let pattern = regex::escape(old_app_id);
    let replacements = [(pattern.as_str(), new_app_id)];

    for rel in &files {
        let full = root.join(rel);
        match replace_in_file(&full, &replacements) {
            Ok(()) => {}
            Err(ReplaceError::PatternNotFound(_)) => return Ok(false),
            Err(e) => {
                return Err(anyhow!(e)).context(format!("stage1 failed on {rel}"));
            }
        }
    }

    Ok(true)
}

/// Restores the project files from the template and applies the new ID
/// using `DEFAULT_APP_ID` as the source pattern.
fn stage2_fallback(root: &Path, new_app_id: &str) -> AnyResult<()> {
    //    Copy the relevant files from the default project template
    //       over the current project files so that content and directory
    //       structure match DEFAULT_APP_ID.
    //
    //       After the copy, every path returned by
    //       `app_id_files(DEFAULT_APP_ID)` must exist and contain the
    //       default application ID.
    //

    refresh_source(root.to_str().unwrap())?;

    let files = app_id_files(DEFAULT_APP_ID);

    // Re-check after the (future) restore.
    for rel in &files {
        let full = root.join(rel);
        if !full.is_file() {
            anyhow::bail!(
                "fallback failed: expected file still missing after template restore: {rel}"
            );
        }
    }

    let pattern = regex::escape(DEFAULT_APP_ID);
    let replacements = [(pattern.as_str(), new_app_id)];

    for rel in &files {
        let full = root.join(rel);
        replace_in_file(&full, &replacements)
            .with_context(|| format!("fallback replace failed on {rel}"))?;
    }

    Ok(())
}

// ---------------------------------------------------------------------------
// Tauri 2 command – non-blocking for the UI thread
// ---------------------------------------------------------------------------

/// Tauri command that changes the application ID without freezing the UI.
///
/// Heavy file I/O is off-loaded to the blocking thread pool via
/// `spawn_blocking`, so neither the main thread nor the async runtime
/// is blocked.
///
/// Register it with:
/// ```rust
/// .invoke_handler(tauri::generate_handler![change_application_id_cmd, /* ... */])
/// ```
///
/// Frontend call:
/// ```ts
/// await invoke('change_application_id_cmd', {
///   projectRoot: '/path/to/project',
///   oldAppId: 'com.example.mynewproject',
///   newAppId: 'com.mycompany.myapp',
/// });
/// ```
#[tauri::command]
pub async fn change_application_id_cmd(
    project_root: String,
    old_app_id: String,
    new_app_id: String,
) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        change_application_id(&project_root, &old_app_id, &new_app_id)
    })
        .await
        .map_err(|e| format!("task join error: {e}"))?
        .map_err(|e| e.to_string())
}