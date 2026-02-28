import { v4 as uuidv4 } from "uuid";
import { EditorTab, EditorMode, SplitLayout } from "@/types/editor";
import * as fs from "@/lib/fs";
import type { ImmerSet, ImmerGet } from "./types";

export interface EditorSlice {
  tabs: EditorTab[];
  activeTabId: string | null;
  split: SplitLayout;

  openTab: (filePath: string, title: string) => Promise<void>;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabContent: (tabId: string, content: string) => void;
  saveTab: (tabId: string) => Promise<void>;
  saveAllTabs: () => Promise<void>;
  renameTab: (tabId: string, newPath: string, newTitle: string) => void;
  setTabMode: (tabId: string, mode: EditorMode) => void;
  updateTabCursor: (tabId: string, line: number, ch: number) => void;
  toggleSplit: () => void;
  setSplitSecondaryTab: (tabId: string) => void;
}

export const createEditorSlice = (set: ImmerSet, get: ImmerGet): EditorSlice => ({
  tabs: [],
  activeTabId: null,
  split: {
    isActive: false,
    primaryTabId: null,
    secondaryTabId: null,
    splitRatio: 0.5,
  },

  openTab: async (filePath: string, title: string) => {
    const existing = get().tabs.find((t) => t.filePath === filePath);
    if (existing) {
      set((state) => { state.activeTabId = existing.id; });
      return;
    }

    let content = "";
    try {
      content = await fs.readNote(filePath);
    } catch (err) {
      console.error("Failed to read note:", err);
    }

    const tab: EditorTab = {
      id: uuidv4(),
      filePath,
      title,
      content,
      savedContent: content,
      isDirty: false,
      mode: "live-preview",
      cursorPos: { line: 0, ch: 0 },
      scrollTop: 0,
    };

    set((state) => {
      state.tabs.push(tab);
      state.activeTabId = tab.id;
    });
  },

  closeTab: (tabId: string) => {
    set((state) => {
      const idx = state.tabs.findIndex((t) => t.id === tabId);
      if (idx === -1) return;
      state.tabs.splice(idx, 1);
      if (state.activeTabId === tabId) {
        state.activeTabId =
          state.tabs[Math.min(idx, state.tabs.length - 1)]?.id ?? null;
      }
      if (state.split.primaryTabId === tabId) {
        state.split.primaryTabId = state.activeTabId;
      }
      if (state.split.secondaryTabId === tabId) {
        state.split.secondaryTabId = null;
      }
    });
  },

  setActiveTab: (tabId: string) => {
    set((state) => { state.activeTabId = tabId; });
  },

  updateTabContent: (tabId: string, content: string) => {
    set((state) => {
      const tab = state.tabs.find((t) => t.id === tabId);
      if (!tab) return;
      tab.content = content;
      tab.isDirty = content !== tab.savedContent;
    });
  },

  saveTab: async (tabId: string) => {
    const tab = get().tabs.find((t) => t.id === tabId);
    if (!tab) return;
    try {
      await fs.writeNote(tab.filePath, tab.content);
      set((state) => {
        const t = state.tabs.find((t) => t.id === tabId);
        if (!t) return;
        t.savedContent = t.content;
        t.isDirty = false;
      });
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  },

  saveAllTabs: async () => {
    const dirtyTabs = get().tabs.filter((t) => t.isDirty);
    await Promise.all(dirtyTabs.map((t) => get().saveTab(t.id)));
  },

  renameTab: (tabId: string, newPath: string, newTitle: string) => {
    set((state) => {
      const tab = state.tabs.find((t) => t.id === tabId);
      if (!tab) return;
      tab.filePath = newPath;
      tab.title = newTitle;
    });
  },

  setTabMode: (tabId: string, mode: EditorMode) => {
    set((state) => {
      const tab = state.tabs.find((t) => t.id === tabId);
      if (tab) tab.mode = mode;
    });
  },

  updateTabCursor: (tabId: string, line: number, ch: number) => {
    set((state) => {
      const tab = state.tabs.find((t) => t.id === tabId);
      if (tab) tab.cursorPos = { line, ch };
    });
  },

  toggleSplit: () => {
    set((state) => {
      state.split.isActive = !state.split.isActive;
      if (state.split.isActive) {
        state.split.primaryTabId = state.activeTabId;
        state.split.secondaryTabId = state.activeTabId;
      } else {
        state.split.primaryTabId = null;
        state.split.secondaryTabId = null;
      }
    });
  },

  setSplitSecondaryTab: (tabId: string) => {
    set((state) => { state.split.secondaryTabId = tabId; });
  },
});
