import { StateCreator } from "zustand";

export type SidebarPanel = "files" | "search" | "tags";
export type Theme = "dark" | "light";

export interface UISlice {
  activePanel: SidebarPanel;
  isSidebarOpen: boolean;
  sidebarWidth: number;
  isCommandPaletteOpen: boolean;
  theme: Theme;

  setActivePanel: (panel: SidebarPanel) => void;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createUISlice: StateCreator<UISlice, any, [], UISlice> = (set) => ({
  activePanel: "files",
  isSidebarOpen: true,
  sidebarWidth: 280,
  isCommandPaletteOpen: false,
  theme: "dark",

  setActivePanel: (panel) =>
    set((state) => {
      state.activePanel = panel;
      if (!state.isSidebarOpen) state.isSidebarOpen = true;
    }),

  toggleSidebar: () =>
    set((state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    }),

  setSidebarWidth: (width) =>
    set((state) => {
      state.sidebarWidth = Math.max(180, Math.min(600, width));
    }),

  setCommandPaletteOpen: (open) =>
    set((state) => {
      state.isCommandPaletteOpen = open;
    }),

  setTheme: (theme) =>
    set((state) => {
      state.theme = theme;
    }),

  toggleTheme: () =>
    set((state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    }),
});
