// STUB: Future home of LSP server and Jupyter kernel process management.
// These commands will be implemented as part of the IDE and notebook features.

#[tauri::command]
pub async fn spawn_process(_cmd: String, _args: Vec<String>) -> Result<u32, String> {
    Err("Process management not yet implemented".to_string())
}

#[tauri::command]
pub async fn kill_process(_pid: u32) -> Result<(), String> {
    Err("Process management not yet implemented".to_string())
}
