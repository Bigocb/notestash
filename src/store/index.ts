import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { VaultSlice, createVaultSlice } from "./vaultSlice";
import { EditorSlice, createEditorSlice } from "./editorSlice";
import { UISlice, createUISlice } from "./uiSlice";
import { SettingsSlice, createSettingsSlice } from "./settingsSlice";

export type BoundStore = VaultSlice & EditorSlice & UISlice & SettingsSlice;

export const useStore = create<BoundStore>()(
  immer((set, get, store) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...createVaultSlice(set as any, get as any, store as any),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...createEditorSlice(set as any, get as any, store as any),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...createUISlice(set as any, get as any, store as any),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...createSettingsSlice(set as any, get as any, store as any),
  }))
);

// Convenience selectors
export const useVault = () =>
  useStore((s) => ({
    vaultPath: s.vaultPath,
    vaultName: s.vaultName,
    fileTree: s.fileTree,
    flatFiles: s.flatFiles,
    expandedDirs: s.expandedDirs,
    recentVaults: s.recentVaults,
    isLoading: s.isLoading,
    error: s.error,
    openVault: s.openVault,
    closeVault: s.closeVault,
    refreshFileTree: s.refreshFileTree,
    toggleDirExpansion: s.toggleDirExpansion,
    handleFileEvent: s.handleFileEvent,
  }));

export const useEditor = () =>
  useStore((s) => ({
    tabs: s.tabs,
    activeTabId: s.activeTabId,
    split: s.split,
    openTab: s.openTab,
    closeTab: s.closeTab,
    setActiveTab: s.setActiveTab,
    updateTabContent: s.updateTabContent,
    saveTab: s.saveTab,
    saveAllTabs: s.saveAllTabs,
    setTabMode: s.setTabMode,
    updateTabCursor: s.updateTabCursor,
    toggleSplit: s.toggleSplit,
    setSplitSecondaryTab: s.setSplitSecondaryTab,
  }));

export const useUI = () =>
  useStore((s) => ({
    activePanel: s.activePanel,
    isSidebarOpen: s.isSidebarOpen,
    sidebarWidth: s.sidebarWidth,
    isCommandPaletteOpen: s.isCommandPaletteOpen,
    theme: s.theme,
    setActivePanel: s.setActivePanel,
    toggleSidebar: s.toggleSidebar,
    setSidebarWidth: s.setSidebarWidth,
    setCommandPaletteOpen: s.setCommandPaletteOpen,
    setTheme: s.setTheme,
    toggleTheme: s.toggleTheme,
  }));

export const useSettings = () =>
  useStore((s) => ({
    fontFamily: s.fontFamily,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight,
    spellcheck: s.spellcheck,
    autosaveDelay: s.autosaveDelay,
    defaultEditorMode: s.defaultEditorMode,
    vimMode: s.vimMode,
    activeThemeId: s.activeThemeId,
    updateSettings: s.updateSettings,
  }));
