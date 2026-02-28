/**
 * fs.ts — Single boundary between the React frontend and Tauri IPC.
 * All invoke() calls live here. To add mobile support, implement
 * the same interface using Capacitor plugins.
 */
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { FileTreeNode, NoteFileMeta } from "@/types/note";

export async function pickVaultFolder(): Promise<string | null> {
  const result = await open({
    directory: true,
    multiple: false,
    title: "Open Vault",
  });
  if (Array.isArray(result)) return result[0] ?? null;
  return result;
}

export async function getFileTree(vaultPath: string): Promise<FileTreeNode> {
  return invoke("get_file_tree", { vaultPath });
}

export async function listVaultFiles(vaultPath: string): Promise<NoteFileMeta[]> {
  return invoke("list_vault_files", { vaultPath });
}

export async function readNote(path: string): Promise<string> {
  return invoke("read_note", { path });
}

export async function writeNote(path: string, content: string): Promise<void> {
  return invoke("write_note", { path, content });
}

export async function createNote(dirPath: string, name: string): Promise<string> {
  return invoke("create_note", { dirPath, name });
}

export async function deleteNote(path: string): Promise<void> {
  return invoke("delete_note", { path });
}

export async function renameNote(oldPath: string, newPath: string): Promise<string> {
  return invoke("rename_note", { oldPath, newPath });
}

export async function createFolder(parentPath: string, name: string): Promise<string> {
  return invoke("create_folder", { parentPath, name });
}

export async function startWatchingVault(vaultPath: string): Promise<void> {
  return invoke("start_watching_vault", { vaultPath });
}

export async function stopWatchingVault(): Promise<void> {
  return invoke("stop_watching_vault");
}
