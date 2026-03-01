use notify::{Config, Event, RecommendedWatcher, RecursiveMode, Watcher};
use std::sync::Mutex;
use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager, State};

pub struct WatcherState {
    pub watcher: Mutex<Option<RecommendedWatcher>>,
}

impl Default for WatcherState {
    fn default() -> Self {
        WatcherState {
            watcher: Mutex::new(None),
        }
    }
}

#[tauri::command]
pub async fn start_watching_vault(
    app: AppHandle,
    vault_path: String,
    state: State<'_, WatcherState>,
) -> Result<(), String> {
    log::info!("start_watching_vault: {}", vault_path);
    let app_handle = app.clone();

    let watcher = RecommendedWatcher::new(
        move |result: notify::Result<Event>| {
            if let Ok(event) = result {
                let paths: Vec<String> = event
                    .paths
                    .iter()
                    .map(|p| p.to_string_lossy().to_string())
                    .collect();

                if paths.iter().any(|p| {
                    p.split('/').any(|seg| seg.starts_with('.'))
                        || p.split('\\').any(|seg| seg.starts_with('.'))
                }) {
                    return;
                }

                let event_name = match event.kind {
                    notify::EventKind::Create(_) => "vault:created",
                    notify::EventKind::Modify(_) => "vault:modified",
                    notify::EventKind::Remove(_) => "vault:deleted",
                    _ => return,
                };

                log::info!("watcher event {} {:?}", event_name, paths);
                let _ = app_handle.emit(event_name, &paths);
            }
        },
        Config::default().with_poll_interval(Duration::from_secs(1)),
    )
    .map_err(|e| {
        let msg = format!("Failed to create watcher: {}", e);
        log::error!("{}", msg);
        msg
    })?;

    let mut watcher_with_path = watcher;
    watcher_with_path
        .watch(
            std::path::Path::new(&vault_path),
            RecursiveMode::Recursive,
        )
        .map_err(|e| {
            let msg = format!("Failed to watch vault: {}", e);
            log::error!("{}", msg);
            msg
        })?;

    let mut state_guard = state
        .watcher
        .lock()
        .map_err(|e| format!("Lock error: {}", e))?;
    *state_guard = Some(watcher_with_path);
    log::info!("start_watching_vault: watching {}", vault_path);
    Ok(())
}

#[tauri::command]
pub async fn stop_watching_vault(state: State<'_, WatcherState>) -> Result<(), String> {
    log::info!("stop_watching_vault");
    let mut state_guard = state
        .watcher
        .lock()
        .map_err(|e| format!("Lock error: {}", e))?;
    *state_guard = None;
    Ok(())
}
