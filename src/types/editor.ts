export type EditorMode = "source" | "live-preview" | "preview";

export interface EditorTab {
  id: string;           // uuid
  filePath: string;
  title: string;
  content: string;      // current in-memory content
  savedContent: string; // last-persisted content (dirty detection)
  isDirty: boolean;
  mode: EditorMode;
  cursorPos: { line: number; ch: number };
  scrollTop: number;
}

export interface SplitLayout {
  isActive: boolean;
  primaryTabId: string | null;
  secondaryTabId: string | null;
  splitRatio: number; // 0.0–1.0, default 0.5
}
