import { Plus, FolderPlus } from "lucide-react";
import { useVault, useEditor } from "@/store";
import { FileTreeNode } from "@/types/note";
import FileTreeNodeItem from "./FileTreeNode";
import * as fsLib from "@/lib/fs";

export default function FileTree() {
  const { vaultPath, vaultName, fileTree, refreshFileTree } = useVault();
  const { openTab } = useEditor();

  async function handleNewNote() {
    if (!vaultPath) return;
    const name = prompt("Note name:");
    if (!name?.trim()) return;
    try {
      const newPath = await fsLib.createNote(vaultPath, name.trim());
      await refreshFileTree();
      await openTab(newPath, name.trim());
    } catch (err) {
      console.error("Failed to create note:", err);
    }
  }

  async function handleNewFolder() {
    if (!vaultPath) return;
    const name = prompt("Folder name:");
    if (!name?.trim()) return;
    try {
      await fsLib.createFolder(vaultPath, name.trim());
      await refreshFileTree();
    } catch (err) {
      console.error("Failed to create folder:", err);
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 shrink-0 no-select"
        style={{ borderBottom: "1px solid var(--ns-border)" }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-wider truncate"
          style={{ color: "var(--ns-muted-fg)" }}
          title={vaultPath ?? ""}
        >
          {vaultName ?? "Explorer"}
        </span>
        <div className="flex items-center gap-1">
          <button
            title="New Note"
            onClick={handleNewNote}
            className="p-1 rounded hover:bg-[var(--ns-muted)] transition-colors"
            style={{ color: "var(--ns-muted-fg)" }}
          >
            <Plus size={14} />
          </button>
          <button
            title="New Folder"
            onClick={handleNewFolder}
            className="p-1 rounded hover:bg-[var(--ns-muted)] transition-colors"
            style={{ color: "var(--ns-muted-fg)" }}
          >
            <FolderPlus size={14} />
          </button>
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {fileTree?.children?.map((node: FileTreeNode) => (
          <FileTreeNodeItem key={node.path} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
}
