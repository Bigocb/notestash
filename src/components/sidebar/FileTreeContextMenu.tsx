import { useRef, useState } from "react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { FilePlus, FolderPlus, Pencil, Trash2 } from "lucide-react";
import { useVault, useEditor } from "@/store";
import * as fsLib from "@/lib/fs";
import type { FileTreeNode } from "@/types/note";

interface Props {
  node: FileTreeNode;
  children: React.ReactNode;
}

type PendingAction = "rename" | null;

export default function FileTreeContextMenu({ node, children }: Props) {
  const { vaultPath, refreshFileTree } = useVault();
  const { openTab, tabs, closeTab, renameTab } = useEditor();
  const [pending, setPending] = useState<PendingAction>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameRef = useRef<HTMLInputElement>(null);

  // ── Rename ────────────────────────────────────────────────────────────────
  function startRename() {
    setRenameValue(node.name);
    setPending("rename");
  }

  async function commitRename() {
    const newName = renameValue.trim();
    setPending(null);
    if (!newName || newName === node.name) return;
    try {
      const dir = node.path.replace(/[/\\][^/\\]+$/, "");
      const ext = node.isDirectory ? "" : node.path.match(/(\.[^.]+)$/)?.[1] ?? ".md";
      const newPath = `${dir}/${newName}${node.isDirectory ? "" : ext.startsWith(".") ? "" : ext}`;
      await fsLib.renameNote(node.path, newPath);
      // Update any open tab
      const tab = tabs.find((t) => t.filePath === node.path);
      if (tab) renameTab(tab.id, newName.replace(/\.[^.]+$/, ""), newPath);
      await refreshFileTree();
    } catch (err) {
      console.error("Rename failed:", err);
    }
  }

  function handleRenameKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") commitRename();
    if (e.key === "Escape") setPending(null);
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete() {
    try {
      await fsLib.deleteNote(node.path);
      const tab = tabs.find((t) => t.filePath === node.path);
      if (tab) closeTab(tab.id);
      await refreshFileTree();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  // ── New note / folder inside directory ────────────────────────────────────
  const [creating, setCreating] = useState<"note" | "folder" | null>(null);
  const [createValue, setCreateValue] = useState("");

  function startCreate(kind: "note" | "folder") {
    setCreateValue("");
    setCreating(kind);
  }

  async function commitCreate() {
    const name = createValue.trim();
    setCreating(null);
    if (!name || !vaultPath) return;
    const parentDir = node.isDirectory ? node.path : node.path.replace(/[/\\][^/\\]+$/, "");
    try {
      if (creating === "note") {
        const newPath = await fsLib.createNote(parentDir, name);
        await refreshFileTree();
        await openTab(newPath, name);
      } else {
        await fsLib.createFolder(parentDir, name);
        await refreshFileTree();
      }
    } catch (err) {
      console.error("Create failed:", err);
    }
  }

  function handleCreateKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") commitCreate();
    if (e.key === "Escape") setCreating(null);
  }

  // ── Inline rename/create overlays ─────────────────────────────────────────
  if (pending === "rename") {
    return (
      <div
        className="flex items-center gap-1.5 mx-2 my-0.5 px-2 py-1 rounded-md"
        style={{ border: "1px solid var(--ns-accent)" }}
      >
        <input
          ref={renameRef}
          autoFocus
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={handleRenameKey}
          onBlur={commitRename}
          className="flex-1 bg-transparent text-xs outline-none"
          style={{ color: "var(--ns-fg)" }}
        />
      </div>
    );
  }

  if (creating) {
    return (
      <>
        {children}
        <div
          className="flex items-center gap-1.5 mx-2 my-0.5 px-2 py-1 rounded-md"
          style={{ border: "1px solid var(--ns-accent)" }}
        >
          <input
            autoFocus
            value={createValue}
            onChange={(e) => setCreateValue(e.target.value)}
            onKeyDown={handleCreateKey}
            onBlur={commitCreate}
            placeholder={creating === "note" ? "new-note.md" : "new-folder"}
            className="flex-1 bg-transparent text-xs outline-none"
            style={{ color: "var(--ns-fg)" }}
          />
        </div>
      </>
    );
  }

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content
          className="z-50 min-w-[160px] overflow-hidden rounded-lg py-1 shadow-lg"
          style={{
            background: "var(--ns-sidebar-bg)",
            border: "1px solid var(--ns-border)",
            color: "var(--ns-sidebar-fg)",
          }}
        >
          {node.isDirectory && (
            <>
              <ContextMenuButton
                icon={<FilePlus size={13} />}
                label="New Note"
                onClick={() => startCreate("note")}
              />
              <ContextMenuButton
                icon={<FolderPlus size={13} />}
                label="New Folder"
                onClick={() => startCreate("folder")}
              />
              <ContextMenu.Separator
                className="my-1"
                style={{ height: 1, background: "var(--ns-border)" }}
              />
            </>
          )}

          <ContextMenuButton
            icon={<Pencil size={13} />}
            label="Rename"
            onClick={startRename}
          />
          <ContextMenuButton
            icon={<Trash2 size={13} />}
            label="Delete"
            onClick={handleDelete}
            danger
          />
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

interface BtnProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

function ContextMenuButton({ icon, label, onClick, danger }: BtnProps) {
  return (
    <ContextMenu.Item
      onSelect={onClick}
      className="flex items-center gap-2.5 px-3 py-1.5 text-xs cursor-pointer outline-none select-none transition-colors"
      style={
        {
          color: danger ? "var(--ns-error, #f87171)" : "var(--ns-sidebar-fg)",
          "--ns-item-hover-bg": "var(--ns-muted)",
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--ns-muted)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      <span style={{ color: danger ? "inherit" : "var(--ns-muted-fg)" }}>{icon}</span>
      {label}
    </ContextMenu.Item>
  );
}
