import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { immer } from "zustand/middleware/immer";
import { createVaultSlice, VaultSlice } from "./vaultSlice";
import { createEditorSlice, EditorSlice } from "./editorSlice";
import { createUISlice, UISlice } from "./uiSlice";
import { createSettingsSlice, SettingsSlice } from "./settingsSlice";
import { createSearchSlice, SearchSlice } from "./searchSlice";
import type { BoundStore } from "./types";

export type { BoundStore };
export type { VaultSlice, EditorSlice, UISlice, SettingsSlice, SearchSlice };

export const useStore = create<BoundStore>()(
  immer((set, get) => ({
    ...createVaultSlice(set, get),
    ...createEditorSlice(set, get),
    ...createUISlice(set),
    ...createSettingsSlice(set),
    ...createSearchSlice(set),
  }))
);

export const useVault = () =>
  useStore(
    useShallow((s) => ({
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
    }))
  );

export const useEditor = () =>
  useStore(
    useShallow((s) => ({
      tabs: s.tabs,
      activeTabId: s.activeTabId,
      split: s.split,
      openTab: s.openTab,
      closeTab: s.closeTab,
      setActiveTab: s.setActiveTab,
      updateTabContent: s.updateTabContent,
      saveTab: s.saveTab,
      saveAllTabs: s.saveAllTabs,
      renameTab: s.renameTab,
      setTabMode: s.setTabMode,
      updateTabCursor: s.updateTabCursor,
      toggleSplit: s.toggleSplit,
      setSplitSecondaryTab: s.setSplitSecondaryTab,
      setSplitRatio: s.setSplitRatio,
    }))
  );

export const useUI = () =>
  useStore(
    useShallow((s) => ({
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
    }))
  );

export const useSettings = () =>
  useStore(
    useShallow((s) => ({
      fontFamily: s.fontFamily,
      fontSize: s.fontSize,
      lineHeight: s.lineHeight,
      spellcheck: s.spellcheck,
      autosaveDelay: s.autosaveDelay,
      defaultEditorMode: s.defaultEditorMode,
      vimMode: s.vimMode,
      activeThemeId: s.activeThemeId,
      updateSettings: s.updateSettings,
    }))
  );

export const useSearch = () =>
  useStore(
    useShallow((s) => ({
      searchQuery: s.searchQuery,
      searchResults: s.searchResults,
      activeTags: s.activeTags,
      isSearching: s.isSearching,
      setSearchQuery: s.setSearchQuery,
      runSearch: s.runSearch,
      toggleTag: s.toggleTag,
      clearTags: s.clearTags,
      clearSearch: s.clearSearch,
      resetSearchIndex: s.resetSearchIndex,
    }))
  );
