use serde::{Deserialize, Serialize};
use std::path::Path;
use walkdir::WalkDir;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct FileTreeNode {
    pub name: String,
    pub path: String,
    pub is_directory: bool,
    pub children: Option<Vec<FileTreeNode>>,
    pub extension: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct NoteFileMeta {
    pub file_path: String,
    pub name: String,
    pub extension: String,
    pub modified: u64,
    pub size: u64,
}

fn build_tree(dir: &Path, vault_root: &Path) -> Option<Vec<FileTreeNode>> {
    let mut children: Vec<FileTreeNode> = Vec::new();

    let entries = match std::fs::read_dir(dir) {
        Ok(e) => e,
        Err(_) => return None,
    };

    let mut sorted_entries: Vec<_> = entries.filter_map(|e| e.ok()).collect();
    sorted_entries.sort_by(|a, b| {
        let a_is_dir = a.path().is_dir();
        let b_is_dir = b.path().is_dir();
        // Directories first, then alphabetical
        match (a_is_dir, b_is_dir) {
            (true, false) => std::cmp::Ordering::Less,
            (false, true) => std::cmp::Ordering::Greater,
            _ => a.file_name().cmp(&b.file_name()),
        }
    });

    for entry in sorted_entries {
        let path = entry.path();
        let name = entry.file_name().to_string_lossy().to_string();

        // Skip hidden files/dirs (starting with .)
        if name.starts_with('.') {
            continue;
        }

        let path_str = path.to_string_lossy().to_string();
        let is_dir = path.is_dir();
        let extension = if is_dir {
            None
        } else {
            path.extension()
                .map(|e| e.to_string_lossy().to_string())
        };

        let node_children = if is_dir {
            build_tree(&path, vault_root)
        } else {
            None
        };

        children.push(FileTreeNode {
            name,
            path: path_str,
            is_directory: is_dir,
            children: node_children,
            extension,
        });
    }

    Some(children)
}

#[tauri::command]
pub async fn get_file_tree(vault_path: String) -> Result<FileTreeNode, String> {
    let path = Path::new(&vault_path);
    if !path.exists() {
        return Err(format!("Vault path does not exist: {}", vault_path));
    }
    if !path.is_dir() {
        return Err(format!("Vault path is not a directory: {}", vault_path));
    }

    let name = path
        .file_name()
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_else(|| vault_path.clone());

    let children = build_tree(path, path);

    Ok(FileTreeNode {
        name,
        path: vault_path,
        is_directory: true,
        children,
        extension: None,
    })
}

#[tauri::command]
pub async fn list_vault_files(vault_path: String) -> Result<Vec<NoteFileMeta>, String> {
    let path = Path::new(&vault_path);
    if !path.exists() {
        return Err(format!("Vault path does not exist: {}", vault_path));
    }

    let mut files: Vec<NoteFileMeta> = Vec::new();

    for entry in WalkDir::new(path)
        .follow_links(false)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_file())
    {
        let entry_path = entry.path();

        // Skip hidden files
        if entry_path
            .components()
            .any(|c| c.as_os_str().to_string_lossy().starts_with('.'))
        {
            continue;
        }

        let ext = entry_path
            .extension()
            .map(|e| e.to_string_lossy().to_string())
            .unwrap_or_default();

        // For now index all files (IDE-ready), but mark non-md separately
        let metadata = entry.metadata().map_err(|e| e.to_string())?;
        let modified = metadata
            .modified()
            .ok()
            .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
            .map(|d| d.as_secs())
            .unwrap_or(0);

        let name = entry_path
            .file_stem()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_default();

        files.push(NoteFileMeta {
            file_path: entry_path.to_string_lossy().to_string(),
            name,
            extension: ext,
            modified,
            size: metadata.len(),
        });
    }

    Ok(files)
}
