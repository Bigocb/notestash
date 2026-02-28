mod commands;

use commands::watcher::WatcherState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(log::LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .manage(WatcherState::default())
        .invoke_handler(tauri::generate_handler![
            commands::vault::get_file_tree,
            commands::vault::list_vault_files,
            commands::notes::read_note,
            commands::notes::write_note,
            commands::notes::create_note,
            commands::notes::delete_note,
            commands::notes::rename_note,
            commands::notes::create_folder,
            commands::watcher::start_watching_vault,
            commands::watcher::stop_watching_vault,
            commands::processes::spawn_process,
            commands::processes::kill_process,
        ])
        .run(tauri::generate_context!())
        .expect("error while running NoteStash");
}
