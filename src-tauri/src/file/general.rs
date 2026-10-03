use regex::Regex;
use std::fs;
use std::io;
use std::path::{Path, PathBuf};
use crate::constants::FRESH_SOURCE;

#[derive(Debug)]
pub enum ReplaceError {
    Read(io::Error),
    Write(io::Error),
    Regex(regex::Error),
    PatternNotFound(String),
}

impl std::fmt::Display for ReplaceError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Read(err) => write!(f, "failed to read file: {err}"),
            Self::Write(err) => write!(f, "failed to write file: {err}"),
            Self::Regex(err) => write!(f, "invalid regex: {err}"),
            Self::PatternNotFound(pattern) => {
                write!(f, "regex did not match the file: {pattern}")
            }
        }
    }
}

impl std::error::Error for ReplaceError {}

/// Replaces all configured regex patterns in a file.
///
/// All replacements are applied in memory first. The file is written only
/// when every pattern matches successfully.
///
/// # Errors
///
/// Returns an error if the file cannot be read, a regex is invalid, a
/// pattern does not match, or the final content cannot be written.
pub fn replace_in_file<P: AsRef<Path>>(
    path: P,
    replacements: &[(&str, &str)],
) -> Result<(), ReplaceError> {
    let path = path.as_ref();

    let mut content =
        fs::read_to_string(path).map_err(ReplaceError::Read)?;

    // Apply all replacements in memory first.
    // The file is only written if every pattern matches.
    for (pattern, replacement) in replacements {
        let regex = Regex::new(pattern)
            .map_err(ReplaceError::Regex)?;

        if !regex.is_match(&content) {
            return Err(ReplaceError::PatternNotFound(
                pattern.to_string(),
            ));
        }

        content = regex
            .replace_all(&content, *replacement)
            .into_owned();
    }

    fs::write(path, content)
        .map_err(ReplaceError::Write)?;

    Ok(())
}

/// Replaces the destination directory with a fresh copy of the source tree.
///
/// If the destination already exists, it is removed first. The destination
/// directory is then recreated, and the entire contents of `SOURCE` are copied
/// into it recursively.
///
/// # Errors
///
/// Returns an error if removing, creating, or copying any directory or file fails.
pub fn refresh_source(dest: &str) -> io::Result<()> {
    let dest_path = Path::new(dest);

    // Remove destination completely if it exists
    if dest_path.exists() {
        fs::remove_dir_all(dest_path)?;
    }

    // Recreate destination (including parents if needed)
    fs::create_dir_all(dest_path)?;

    // Copy everything from SOURCE
    copy_dir_recursive(&soruce_root(), dest_path)
}

/// Recursively copies the contents of a source directory into a destination directory.
///
/// For each entry in `src`, this function creates matching directories in `dst`
/// and copies regular files to the corresponding destination path.
///
/// # Errors
///
/// Returns an error if reading the source directory, creating destination
/// directories, or copying files fails.
fn copy_dir_recursive(src: &Path, dst: &Path) -> io::Result<()> {
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let src_path = entry.path();
        let dst_path = dst.join(entry.file_name());

        if src_path.is_dir() {
            fs::create_dir_all(&dst_path)?;
            copy_dir_recursive(&src_path, &dst_path)?;
        } else {
            fs::copy(&src_path, &dst_path)?;
        }
    }
    Ok(())
}


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



/// Resolve the Flutter web build root (src-tauri/soruce_template)
fn soruce_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join(FRESH_SOURCE)
}