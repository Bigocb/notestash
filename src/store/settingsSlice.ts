import { EditorMode } from "@/types/editor";
import type { ImmerSet } from "./types";

export interface SettingsSlice {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  spellcheck: boolean;
  autosaveDelay: number;
  defaultEditorMode: EditorMode;
  vimMode: boolean;
  activeThemeId: string;

  updateSettings: (partial: Partial<Omit<SettingsSlice, "updateSettings">>) => void;
}

export const createSettingsSlice = (set: ImmerSet): SettingsSlice => ({
  fontFamily: "monospace",
  fontSize: 14,
  lineHeight: 1.6,
  spellcheck: false,
  autosaveDelay: 1000,
  defaultEditorMode: "live-preview",
  vimMode: false,
  activeThemeId: "tokyo-night",

  updateSettings: (partial) =>
    set((state) => { Object.assign(state, partial); }),
});
