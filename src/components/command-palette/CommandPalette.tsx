import { useCallback } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "cmdk";
import {
  FileText,
  FolderOpen,
  PanelLeft,
  Sun,
  Moon,
  SplitSquareHorizontal,
  Search,
  Tag,
  FilePlus,
  X,
} from "lucide-react";
import { useUI, useVault, useEditor } from "@/store";
import { pickVaultFolder, createNote } from "@/lib/fs";

export default function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    toggleTheme,
    toggleSidebar,
    setActivePanel,
    theme,
  } = useUI();
  const { flatFiles, openVault, vaultPath } = useVault();
  const { openTab, activeTabId, closeTab, toggleSplit, setTabMode, tabs } = useEditor();

  const close = useCallback(() => setCommandPaletteOpen(false), [setCommandPaletteOpen]);

  async function handleOpenVault() {
    close();
    const path = await pickVaultFolder();
    if (path) await openVault(path);
  }

  async function handleNewNote() {
    close();
    if (!vaultPath) return;
    const name = `Untitled-${Date.now()}.md`;
    try {
      const newPath = await createNote(vaultPath, name);
      await openTab(newPath, name);
    } catch (err) {
      console.error("New note failed:", err);
    }
  }

  function handleGoSearch() {
    close();
    setActivePanel("search");
  }

  function handleGoTags() {
    close();
    setActivePanel("tags");
  }

  function handleToggleSidebar() {
    close();
    toggleSidebar();
  }

  function handleToggleTheme() {
    close();
    toggleTheme();
  }

  function handleToggleSplit() {
    close();
    toggleSplit();
  }

  function handleCloseTab() {
    close();
    if (activeTabId) closeTab(activeTabId);
  }

  function handleCycleMode() {
    close();
    if (!activeTabId) return;
    const tab = tabs.find((t) => t.id === activeTabId);
    if (!tab) return;
    const modes = ["source", "live-preview", "preview"] as const;
    const idx = modes.indexOf(tab.mode);
    setTabMode(activeTabId, modes[(idx + 1) % modes.length]);
  }

  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <CommandDialog
      open={isCommandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
      label="Command palette"
    >
      {/* Overlay handled by cmdk/Radix — style via class */}
      <style>{`
        /* Dialog overlay */
        [cmdk-overlay] {
          position: fixed;
          inset: 0;
          z-index: 40;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(2px);
        }
        /* Dialog content */
        [cmdk-dialog] > div {
          position: fixed;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          width: 100%;
          max-width: 580px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
          background: var(--ns-bg);
          border: 1px solid var(--ns-border);
        }
        /* Search input */
        [cmdk-input] {
          width: 100%;
          padding: 14px 16px;
          font-size: 14px;
          background: transparent;
          color: var(--ns-fg);
          border: none;
          border-bottom: 1px solid var(--ns-border);
          outline: none;
        }
        [cmdk-input]::placeholder {
          color: var(--ns-muted-fg);
        }
        /* List container */
        [cmdk-list] {
          max-height: 360px;
          overflow-y: auto;
          padding: 6px 0;
        }
        /* Group heading */
        [cmdk-group-heading] {
          padding: 6px 14px 4px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ns-muted-fg);
          user-select: none;
        }
        /* Items */
        [cmdk-item] {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          font-size: 13px;
          color: var(--ns-fg);
          cursor: pointer;
          border-radius: 0;
          user-select: none;
          transition: background 80ms;
        }
        [cmdk-item][data-selected="true"] {
          background: var(--ns-muted);
          color: var(--ns-fg);
        }
        [cmdk-item]:active {
          background: var(--ns-muted);
        }
        /* Empty state */
        [cmdk-empty] {
          padding: 24px 16px;
          font-size: 13px;
          text-align: center;
          color: var(--ns-muted-fg);
        }
        /* Separator */
        [cmdk-separator] {
          height: 1px;
          background: var(--ns-border);
          margin: 4px 0;
        }
      `}</style>

      <CommandInput placeholder="Search notes and commands…" />

      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Notes ── fuzzy filtered by title, path */}
        {flatFiles.length > 0 && (
          <CommandGroup heading="Notes">
            {flatFiles.map((file) => (
              <CommandItem
                key={file.filePath}
                value={`${file.title} ${file.filePath}`}
                onSelect={() => {
                  openTab(file.filePath, file.title);
                  close();
                }}
              >
                <FileText size={14} style={{ color: "var(--ns-muted-fg)", flexShrink: 0 }} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {file.title}
                  </span>
                </span>
                {file.tags.length > 0 && (
                  <span style={{ fontSize: 11, color: "var(--ns-muted-fg)", flexShrink: 0 }}>
                    #{file.tags[0]}
                    {file.tags.length > 1 ? ` +${file.tags.length - 1}` : ""}
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        {/* Commands ── static, always filterable */}
        <CommandGroup heading="Commands">
          <CommandItem value="new note create" onSelect={handleNewNote}>
            <FilePlus size={14} style={{ color: "var(--ns-muted-fg)", flexShrink: 0 }} />
            New Note
            <Kbd>Ctrl+N</Kbd>
          </CommandItem>

          <CommandItem value="open vault folder" onSelect={handleOpenVault}>
            <FolderOpen size={14} style={{ color: "var(--ns-muted-fg)", flexShrink: 0 }} />
            Open Vault Folder
            <Kbd>Ctrl+O</Kbd>
          </CommandItem>

          <CommandItem value="toggle sidebar panel" onSelect={handleToggleSidebar}>
            <PanelLeft size={14} style={{ color: "var(--ns-muted-fg)", flexShrink: 0 }} />
            Toggle Sidebar
            <Kbd>Ctrl+B</Kbd>
          </CommandItem>

          <CommandItem value="search notes full text" onSelect={handleGoSearch}>
            <Search size={14} style={{ color: "var(--ns-muted-fg)", flexShrink: 0 }} />
            Go to Search
            <Kbd>Ctrl+Shift+F</Kbd>
          </CommandItem>

          <CommandItem value="tags filter browse" onSelect={handleGoTags}>
            <Tag size={14} style={{ color: "var(--ns-muted-fg)", flexShrink: 0 }} />
            Go to Tags
          </CommandItem>

          <CommandItem value="split editor pane" onSelect={handleToggleSplit}>
            <SplitSquareHorizontal size={14} style={{ color: "var(--ns-muted-fg)", flexShrink: 0 }} />
            Toggle Split Editor
            <Kbd>Ctrl+\</Kbd>
          </CommandItem>

          {activeTab && (
            <CommandItem value="cycle editor mode source live preview" onSelect={handleCycleMode}>
              <span style={{ width: 14, flexShrink: 0 }} />
              Cycle Editor Mode
              <Kbd>Ctrl+E</Kbd>
            </CommandItem>
          )}

          {activeTabId && (
            <CommandItem value="close tab" onSelect={handleCloseTab}>
              <X size={14} style={{ color: "var(--ns-muted-fg)", flexShrink: 0 }} />
              Close Tab
              <Kbd>Ctrl+W</Kbd>
            </CommandItem>
          )}

          <CommandItem
            value={`switch theme ${theme === "dark" ? "light" : "dark"}`}
            onSelect={handleToggleTheme}
          >
            {theme === "dark"
              ? <Sun size={14} style={{ color: "var(--ns-muted-fg)", flexShrink: 0 }} />
              : <Moon size={14} style={{ color: "var(--ns-muted-fg)", flexShrink: 0 }} />}
            Toggle Theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        marginLeft: "auto",
        fontSize: 11,
        color: "var(--ns-muted-fg)",
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
}
