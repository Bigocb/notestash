import { StateCreator } from "zustand";
import { EditorMode } from "@/types/editor";

export interface SettingsSlice {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  spellcheck: boolean;
  autosaveDelay: number;       // ms; 0 = disabled
  defaultEditorMode: EditorMode;
  vimMode: boolean;
  activeThemeId: string;

  updateSettings: (partial: Partial<Omit<SettingsSlice, "updateSettings">>) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createSettingsSlice: StateCreator<SettingsSlice, any, [], SettingsSlice> = (set) => ({
  fontFamily: "monospace",
  fontSize: 14,
  lineHeight: 1.6,
  spellcheck: false,
  autosaveDelay: 1000,
  defaultEditorMode: "live-preview",
  vimMode: false,
  activeThemeId: "tokyo-night",

  updateSettings: (partial) =>
    set((state) => {
      Object.assign(state, partial);
    }),
});
