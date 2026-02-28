/**
 * Shared types for the Zustand store slices.
 * Extracted here to avoid circular imports between slice files and index.ts.
 *
 * TypeScript handles `import type` circular references correctly,
 * so each slice can import ImmerSet/ImmerGet from here.
 */
import type { VaultSlice } from "./vaultSlice";
import type { EditorSlice } from "./editorSlice";
import type { UISlice } from "./uiSlice";
import type { SettingsSlice } from "./settingsSlice";

export type BoundStore = VaultSlice & EditorSlice & UISlice & SettingsSlice;

/** The immer-enhanced `set` function — accepts a mutating draft callback */
export type ImmerSet = (fn: (state: BoundStore) => void) => void;

/** Standard zustand `get` */
export type ImmerGet = () => BoundStore;
