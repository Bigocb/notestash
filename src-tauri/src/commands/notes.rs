use std::fs;
use std::path::Path;

#[tauri::command]
pub async fn read_note(path: String) -> Result<String, String> {
    log::info!("read_note: {}", path);
    fs::read_to_string(&path).map_err(|e| {
        let msg = format!("Failed to read {}: {}", path, e);
        log::error!("{}", msg);
        msg
    })
}

#[tauri::command]
pub async fn write_note(path: String, content: String) -> Result<(), String> {
    log::info!("write_note: {} ({} bytes)", path, content.len());
    if let Some(parent) = Path::new(&path).parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create directories for {}: {}", path, e))?;
    }
    fs::write(&path, content).map_err(|e| {
        let msg = format!("Failed to write {}: {}", path, e);
        log::error!("{}", msg);
        msg
    })
}

#[tauri::command]
pub async fn create_note(dir_path: String, name: String) -> Result<String, String> {
    let dir = Path::new(&dir_path);
    fs::create_dir_all(dir)
        .map_err(|e| format!("Failed to create directory {}: {}", dir_path, e))?;

    let safe_name = name.trim().trim_end_matches(".md").to_string();
    let filename = format!("{}.md", safe_name);
    let file_path = dir.join(&filename);

    if file_path.exists() {
        let msg = format!("Note already exists: {}", filename);
        log::warn!("{}", msg);
        return Err(msg);
    }

    let initial_content = format!("# {}\n", safe_name);
    fs::write(&file_path, initial_content)
        .map_err(|e| format!("Failed to create note {}: {}", filename, e))?;

    let result = file_path.to_string_lossy().to_string();
    log::info!("create_note: {}", result);
    Ok(result)
}

#[tauri::command]
pub async fn delete_note(path: String) -> Result<(), String> {
    log::info!("delete_note: {}", path);
    let p = Path::new(&path);
    if p.is_dir() {
        fs::remove_dir_all(&path).map_err(|e| {
            let msg = format!("Failed to delete directory {}: {}", path, e);
            log::error!("{}", msg);
            msg
        })
    } else {
        fs::remove_file(&path).map_err(|e| {
            let msg = format!("Failed to delete {}: {}", path, e);
            log::error!("{}", msg);
            msg
        })
    }
}

#[tauri::command]
pub async fn rename_note(old_path: String, new_path: String) -> Result<String, String> {
    log::info!("rename_note: {} -> {}", old_path, new_path);
    if let Some(parent) = Path::new(&new_path).parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create directories: {}", e))?;
    }
    fs::rename(&old_path, &new_path).map_err(|e| {
        let msg = format!("Failed to rename {} to {}: {}", old_path, new_path, e);
        log::error!("{}", msg);
        msg
    })?;
    Ok(new_path)
}

#[tauri::command]
pub async fn create_folder(parent_path: String, name: String) -> Result<String, String> {
    let dir_path = Path::new(&parent_path).join(&name);
    fs::create_dir_all(&dir_path).map_err(|e| {
        let msg = format!("Failed to create folder {}: {}", name, e);
        log::error!("{}", msg);
        msg
    })?;
    let result = dir_path.to_string_lossy().to_string();
    log::info!("create_folder: {}", result);
    Ok(result)
}
