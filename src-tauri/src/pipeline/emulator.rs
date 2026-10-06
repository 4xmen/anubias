use serde::Serialize;
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

/// Generic response shape used by all commands.
///
/// Always returns either:
/// - `ok: true`  + `data`
/// - `ok: false` + `error`
#[derive(Debug, Serialize)]
pub struct CommandResponse<T> {
    pub ok: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<T>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

/// Full information about a single Android emulator (AVD).
#[derive(Debug, Serialize, Clone)]
pub struct EmulatorInfo {
    pub name: String,
    pub path: String,
    pub target: Option<String>,
    pub abi: Option<String>,
    pub device: Option<String>,
    pub manufacturer: Option<String>,
    pub ram: Option<String>,
    pub heap_size: Option<String>,
    pub sdcard: Option<String>,
    pub skin: Option<String>,
    pub gpu: Option<String>,
    pub is_running: bool,
    pub serial: Option<String>,
    /// All key-value pairs parsed from the AVD's config.ini file.
    pub config: HashMap<String, String>,
}

/// Returns the user home directory using standard environment variables.
///
/// Checks `HOME` first (Unix/macOS/Linux), then falls back to `USERPROFILE` (Windows).
fn home_dir() -> Option<PathBuf> {
    std::env::var_os("HOME")
        .or_else(|| std::env::var_os("USERPROFILE"))
        .map(PathBuf::from)
}

/// Locates the Android SDK root directory.
///
/// Search order:
/// 1. `ANDROID_HOME` environment variable
/// 2. `ANDROID_SDK_ROOT` environment variable
/// 3. Common default install locations under the user's home directory
fn android_sdk_path() -> Option<PathBuf> {
    for key in ["ANDROID_HOME", "ANDROID_SDK_ROOT"] {
        if let Ok(path) = std::env::var(key) {
            let p = PathBuf::from(path);
            if p.exists() {
                return Some(p);
            }
        }
    }

    let home = home_dir()?;
    let candidates = [
        home.join("Android/Sdk"), //linux
        home.join("Library/Android/sdk"),       // macOS default
        home.join("AppData/Local/Android/Sdk"), // Windows default
    ];

    candidates.into_iter().find(|p| p.exists())
}

/// Resolves the AVD directory.
///
/// Resolution order:
/// 1. `ANDROID_AVD_HOME` environment variable (if set and exists)
/// 2. Default location: `~/.android/avd`
/// 3. Optional fallback path provided by the frontend (if it exists on disk)
///
/// The frontend fallback is only used when automatic detection fails.
/// This keeps the common case simple while still allowing the UI to
/// point us to a custom location when needed.
fn resolve_avd_home(frontend_fallback: Option<&str>) -> Result<PathBuf, String> {
    // 1. Explicit environment variable takes highest priority
    if let Ok(path) = std::env::var("ANDROID_AVD_HOME") {
        let p = PathBuf::from(&path);
        if p.exists() {
            return Ok(p);
        }
    }

    // 2. Standard default location
    if let Some(home) = home_dir() {
        let default = home.join(".android/avd");
        if default.exists() {
            return Ok(default);
        }
    }

    // 3. Optional path supplied by the frontend (last resort)
    if let Some(fallback) = frontend_fallback {
        let p = PathBuf::from(fallback);
        if p.exists() {
            return Ok(p);
        }
        // Path was given but does not exist — report a clear error
        return Err(format!(
            "AVD directory not found. Tried default locations and the provided path: {fallback}"
        ));
    }

    Err("AVD directory not found (~/.android/avd). You can pass an explicit path from the frontend.".into())
}

/// Parses an AVD's `config.ini` file into a simple key-value map.
///
/// Lines that are empty or start with `#` are ignored.
/// Only the first `=` on each line is treated as the separator.
fn parse_config_ini(avd_dir: &Path) -> HashMap<String, String> {
    let mut map = HashMap::new();

    let content = match fs::read_to_string(avd_dir.join("config.ini")) {
        Ok(c) => c,
        Err(_) => return map, // missing or unreadable config → empty map is fine
    };

    for line in content.lines() {
        let line = line.trim();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        if let Some((k, v)) = line.split_once('=') {
            map.insert(k.trim().to_string(), v.trim().to_string());
        }
    }

    map
}

/// Builds a map of currently running AVD name → adb serial number.
///
/// Example entry: `"Pixel_8_API_34" → "emulator-5554"`
///
/// If `adb` is not available or no emulators are running, an empty map is returned.
fn running_emulators() -> HashMap<String, String> {
    let mut map = HashMap::new();

    let output = match Command::new("adb").args(["devices"]).output() {
        Ok(o) => o,
        Err(_) => return map, // adb not found or failed to start
    };

    let stdout = String::from_utf8_lossy(&output.stdout);

    // Skip the header line ("List of devices attached")
    for line in stdout.lines().skip(1) {
        let parts: Vec<&str> = line.split_whitespace().collect();
        if parts.len() < 2 || !parts[0].starts_with("emulator-") || parts[1] != "device" {
            continue;
        }

        let serial = parts[0];

        // Ask the emulator itself for its AVD name
        if let Ok(out) = Command::new("adb")
            .args(["-s", serial, "emu", "avd", "name"])
            .output()
        {
            let name = String::from_utf8_lossy(&out.stdout)
                .lines()
                .next()
                .unwrap_or("")
                .trim()
                .to_string();

            if !name.is_empty() {
                map.insert(name, serial.to_string());
            }
        }
    }

    map
}

/// Lists all AVD names by calling `emulator -list-avds`.
///
/// Tries the binary inside the detected SDK first, then falls back to
/// whatever `emulator` is available on PATH.
fn list_avd_names() -> Result<Vec<String>, String> {
    let emulator = android_sdk_path()
        .map(|sdk| sdk.join("emulator").join("emulator"))
        .unwrap_or_else(|| PathBuf::from("emulator"));

    let output = Command::new(&emulator)
        .arg("-list-avds")
        .output()
        .or_else(|_| Command::new("emulator").arg("-list-avds").output())
        .map_err(|e| format!("Failed to run emulator -list-avds: {e}"))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("emulator -list-avds failed: {stderr}"));
    }

    Ok(String::from_utf8_lossy(&output.stdout)
        .lines()
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())
        .collect())
}

/// Lists all Android emulators installed on the system with full details.
///
/// # Arguments
/// * `avd_path` – Optional absolute path to the AVD directory.
///   Used only when automatic detection (`ANDROID_AVD_HOME` / `~/.android/avd`) fails.
///   If the provided path does not exist, an error is returned.
///
/// # Returns
/// * `ok: true`  + `data: Vec<EmulatorInfo>` on success
/// * `ok: false` + `error: message` on failure
#[tauri::command]
pub fn list_android_emulators(avd_path: Option<String>) -> CommandResponse<Vec<EmulatorInfo>> {
    match list_android_emulators_inner(avd_path.as_deref()) {
        Ok(list) => CommandResponse {
            ok: true,
            data: Some(list),
            error: None,
        },
        Err(e) => CommandResponse {
            ok: false,
            data: None,
            error: Some(e),
        },
    }
}

/// Internal implementation of the emulator listing logic.
///
/// Separated from the command handler so the response wrapping stays clean.
fn list_android_emulators_inner(frontend_fallback: Option<&str>) -> Result<Vec<EmulatorInfo>, String> {
    let avd_dir = resolve_avd_home(frontend_fallback)?;
    let names = list_avd_names()?;
    let running = running_emulators();

    let mut list = Vec::with_capacity(names.len());

    for name in names {
        let path = avd_dir.join(format!("{name}.avd"));
        let config = parse_config_ini(&path);

        list.push(EmulatorInfo {
            name: name.clone(),
            path: path.to_string_lossy().into_owned(),
            target: config
                .get("image.sysdir.1")
                .or_else(|| config.get("tag.display"))
                .cloned(),
            abi: config
                .get("abi.type")
                .or_else(|| config.get("hw.cpu.arch"))
                .cloned(),
            device: config.get("hw.device.name").cloned(),
            manufacturer: config.get("hw.device.manufacturer").cloned(),
            ram: config.get("hw.ramSize").cloned(),
            heap_size: config.get("vm.heapSize").cloned(),
            sdcard: config
                .get("sdcard.size")
                .or_else(|| config.get("hw.sdCard"))
                .cloned(),
            skin: config.get("skin.name").cloned(),
            gpu: config.get("hw.gpu.mode").cloned(),
            is_running: running.contains_key(&name),
            serial: running.get(&name).cloned(),
            config,
        });
    }

    // Keep the list stable and easy to scan in the UI
    list.sort_by_key(|a| a.name.to_lowercase());
    Ok(list)
}