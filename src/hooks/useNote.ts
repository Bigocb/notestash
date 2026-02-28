import { useCallback } from "react";
import { useEditor, useVault } from "@/store";
import * as fsLib from "@/lib/fs";

/**
 * Clean abstraction for note CRUD operations tied to the editor state.
 * Wraps the lower-level fs calls with vault refresh + tab management.
 */
export function useNote() {
  const { openTab, closeTab, renameTab, tabs } = useEditor();
  const { vaultPath, refreshFileTree } = useVault();

  const createNote = useCallback(
    async (name: string, dirPath?: string) => {
      const dir = dirPath ?? vaultPath;
      if (!dir) throw new Error("No vault open");
      const newPath = await fsLib.createNote(dir, name);
      await refreshFileTree();
      await openTab(newPath, name);
      return newPath;
    },
    [vaultPath, refreshFileTree, openTab]
  );

  const deleteNote = useCallback(
    async (path: string) => {
      // Close any open tabs for this path
      const openTab_ = tabs.find((t) => t.filePath === path);
      if (openTab_) closeTab(openTab_.id);
      await fsLib.deleteNote(path);
      await refreshFileTree();
    },
    [tabs, closeTab, refreshFileTree]
  );

  const renameNote = useCallback(
    async (oldPath: string, newName: string) => {
      const parts = oldPath.replace(/\\/g, "/").split("/");
      parts[parts.length - 1] = newName.endsWith(".md") ? newName : `${newName}.md`;
      const newPath = parts.join("/");
      await fsLib.renameNote(oldPath, newPath);
      // Update any open tab
      const openTab_ = tabs.find((t) => t.filePath === oldPath);
      if (openTab_) renameTab(openTab_.id, newPath, newName.replace(/\.md$/, ""));
      await refreshFileTree();
      return newPath;
    },
    [tabs, renameTab, refreshFileTree]
  );

  const createFolder = useCallback(
    async (name: string, parentPath?: string) => {
      const parent = parentPath ?? vaultPath;
      if (!parent) throw new Error("No vault open");
      const newPath = await fsLib.createFolder(parent, name);
      await refreshFileTree();
      return newPath;
    },
    [vaultPath, refreshFileTree]
  );

  return { createNote, deleteNote, renameNote, createFolder };
}
