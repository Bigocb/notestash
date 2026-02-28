import { useRef, useState } from "react";
import { Plus, FolderPlus, FilePlus } from "lucide-react";
import { useVault, useEditor } from "@/store";
import { FileTreeNode } from "@/types/note";
import FileTreeNodeItem from "./FileTreeNode";
import * as fsLib from "@/lib/fs";

type CreatingKind = "note" | "folder" | null;

export default function FileTree() {
  const { vaultPath, vaultName, fileTree, refreshFileTree } = useVault();
  const { openTab } = useEditor();
  const [creating, setCreating] = useState<CreatingKind>(null);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function startCreating(kind: CreatingKind) {
    setInputValue("");
    setCreating(kind);
    // focus is handled by autoFocus on the input
  }

  async function commitCreate() {
    const name = inputValue.trim();
    setCreating(null);
    setInputValue("");
    if (!name || !vaultPath) return;
    try {
      if (creating === "note") {
        const newPath = await fsLib.createNote(vaultPath, name);
        await refreshFileTree();
        await openTab(newPath, name);
      } else if (creating === "folder") {
        await fsLib.createFolder(vaultPath, name);
        await refreshFileTree();
      }
    } catch (err) {
      console.error("Failed to create:", err);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") commitCreate();
    if (e.key === "Escape") { setCreating(null); setInputValue(""); }
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
        <div className="flex items-center gap-0.5">
          <button
            title="New Note (n)"
            onClick={() => startCreating("note")}
            className="p-1.5 rounded-md hover:bg-[var(--ns-muted)] transition-colors"
            style={{ color: "var(--ns-muted-fg)" }}
          >
            <FilePlus size={13} />
          </button>
          <button
            title="New Folder"
            onClick={() => startCreating("folder")}
            className="p-1.5 rounded-md hover:bg-[var(--ns-muted)] transition-colors"
            style={{ color: "var(--ns-muted-fg)" }}
          >
            <FolderPlus size={13} />
          </button>
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {fileTree?.children?.map((node: FileTreeNode) => (
          <FileTreeNodeItem key={node.path} node={node} depth={0} />
        ))}

        {/* Inline creation input at end of list */}
        {creating && (
          <div
            className="flex items-center gap-1.5 mx-2 mt-1 px-2 py-1 rounded-md"
            style={{ border: "1px solid var(--ns-accent)" }}
          >
            {creating === "note" ? (
              <Plus size={12} style={{ color: "var(--ns-accent)" }} className="shrink-0" />
            ) : (
              <FolderPlus size={12} style={{ color: "var(--ns-accent)" }} className="shrink-0" />
            )}
            <input
              ref={inputRef}
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={commitCreate}
              placeholder={creating === "note" ? "note-name.md" : "folder-name"}
              className="flex-1 bg-transparent text-xs outline-none"
              style={{ color: "var(--ns-fg)" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
