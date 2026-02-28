use std::fs;
use std::path::Path;

#[tauri::command]
pub async fn read_note(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| format!("Failed to read {}: {}", path, e))
}

#[tauri::command]
pub async fn write_note(path: String, content: String) -> Result<(), String> {
    // Create parent directories if they don't exist
    if let Some(parent) = Path::new(&path).parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create directories for {}: {}", path, e))?;
    }
    fs::write(&path, content).map_err(|e| format!("Failed to write {}: {}", path, e))
}

#[tauri::command]
pub async fn create_note(dir_path: String, name: String) -> Result<String, String> {
    let dir = Path::new(&dir_path);
    fs::create_dir_all(dir)
        .map_err(|e| format!("Failed to create directory {}: {}", dir_path, e))?;

    // Sanitize filename and ensure .md extension
    let safe_name = name
        .trim()
        .trim_end_matches(".md")
        .to_string();
    let filename = format!("{}.md", safe_name);
    let file_path = dir.join(&filename);

    if file_path.exists() {
        return Err(format!("Note already exists: {}", filename));
    }

    // Write empty note with title frontmatter
    let initial_content = format!("# {}\n", safe_name);
    fs::write(&file_path, initial_content)
        .map_err(|e| format!("Failed to create note {}: {}", filename, e))?;

    Ok(file_path.to_string_lossy().to_string())
}

#[tauri::command]
pub async fn delete_note(path: String) -> Result<(), String> {
    let p = Path::new(&path);
    if p.is_dir() {
        fs::remove_dir_all(&path).map_err(|e| format!("Failed to delete directory {}: {}", path, e))
    } else {
        fs::remove_file(&path).map_err(|e| format!("Failed to delete {}: {}", path, e))
    }
}

#[tauri::command]
pub async fn rename_note(old_path: String, new_path: String) -> Result<String, String> {
    // Create parent dirs for new path if needed
    if let Some(parent) = Path::new(&new_path).parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create directories: {}", e))?;
    }
    fs::rename(&old_path, &new_path)
        .map_err(|e| format!("Failed to rename {} to {}: {}", old_path, new_path, e))?;
    Ok(new_path)
}

#[tauri::command]
pub async fn create_folder(parent_path: String, name: String) -> Result<String, String> {
    let dir_path = Path::new(&parent_path).join(&name);
    fs::create_dir_all(&dir_path)
        .map_err(|e| format!("Failed to create folder {}: {}", name, e))?;
    Ok(dir_path.to_string_lossy().to_string())
}
