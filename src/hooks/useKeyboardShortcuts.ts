import { useEffect } from "react";
import { useUI, useEditor, useVault } from "@/store";
import { pickVaultFolder, createNote } from "@/lib/fs";

export function useKeyboardShortcuts() {
  const { setCommandPaletteOpen, toggleSidebar, setActivePanel } = useUI();
  const { saveTab, saveAllTabs, closeTab, activeTabId, toggleSplit, setTabMode, tabs, openTab } = useEditor();
  const { openVault, vaultPath } = useVault();

  useEffect(() => {
    async function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl+P — Command palette
      if (mod && !e.shiftKey && e.key === "p") {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      // Cmd/Ctrl+N — New note
      if (mod && !e.shiftKey && e.key === "n") {
        e.preventDefault();
        if (!vaultPath) return;
        const name = `Untitled-${Date.now()}.md`;
        try {
          const newPath = await createNote(vaultPath, name);
          await openTab(newPath, name);
        } catch (err) {
          console.error("New note failed:", err);
        }
        return;
      }

      // Cmd/Ctrl+S — Save
      if (mod && !e.shiftKey && e.key === "s") {
        e.preventDefault();
        if (activeTabId) saveTab(activeTabId);
        return;
      }

      // Cmd/Ctrl+Shift+S — Save all
      if (mod && e.shiftKey && e.key === "S") {
        e.preventDefault();
        saveAllTabs();
        return;
      }

      // Cmd/Ctrl+W — Close tab
      if (mod && !e.shiftKey && e.key === "w") {
        e.preventDefault();
        if (activeTabId) closeTab(activeTabId);
        return;
      }

      // Cmd/Ctrl+B — Toggle sidebar
      if (mod && !e.shiftKey && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      // Cmd/Ctrl+\ — Toggle split
      if (mod && e.key === "\\") {
        e.preventDefault();
        toggleSplit();
        return;
      }

      // Cmd/Ctrl+O — Open vault
      if (mod && !e.shiftKey && e.key === "o") {
        e.preventDefault();
        const path = await pickVaultFolder();
        if (path) openVault(path);
        return;
      }

      // Cmd/Ctrl+Shift+F — Go to Search panel
      if (mod && e.shiftKey && (e.key === "f" || e.key === "F")) {
        e.preventDefault();
        setActivePanel("search");
        return;
      }

      // Cmd/Ctrl+E — Cycle editor mode
      if (mod && !e.shiftKey && e.key === "e") {
        e.preventDefault();
        if (!activeTabId) return;
        const tab = tabs.find((t) => t.id === activeTabId);
        if (!tab) return;
        const modes = ["source", "live-preview", "preview"] as const;
        const idx = modes.indexOf(tab.mode);
        setTabMode(activeTabId, modes[(idx + 1) % modes.length]);
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    activeTabId,
    tabs,
    vaultPath,
    setCommandPaletteOpen,
    toggleSidebar,
    setActivePanel,
    saveTab,
    saveAllTabs,
    closeTab,
    toggleSplit,
    openVault,
    openTab,
    setTabMode,
  ]); // eslint-disable-line react-hooks/exhaustive-deps
}
