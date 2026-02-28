import { useEffect } from "react";
import { useUI, useEditor } from "@/store";
import { pickVaultFolder } from "@/lib/fs";
import { useVault } from "@/store";

export function useKeyboardShortcuts() {
  const { setCommandPaletteOpen, toggleSidebar } = useUI();
  const { saveTab, saveAllTabs, closeTab, activeTabId, toggleSplit } = useEditor();
  const { openVault } = useVault();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl+P — Command palette
      if (mod && e.key === "p" && !e.shiftKey) {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      // Cmd/Ctrl+S — Save
      if (mod && e.key === "s" && !e.shiftKey) {
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
      if (mod && e.key === "w") {
        e.preventDefault();
        if (activeTabId) closeTab(activeTabId);
        return;
      }

      // Cmd/Ctrl+B — Toggle sidebar
      if (mod && e.key === "b") {
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
      if (mod && e.key === "o") {
        e.preventDefault();
        pickVaultFolder().then((path) => {
          if (path) openVault(path);
        });
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    activeTabId,
    setCommandPaletteOpen,
    toggleSidebar,
    saveTab,
    saveAllTabs,
    closeTab,
    toggleSplit,
    openVault,
  ]);
}
