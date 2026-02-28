import { StateCreator } from "zustand";
import { FileTreeNode, NoteFileMeta, VaultFileEvent } from "@/types/note";
import { DocumentType, documentTypeFromExtension } from "@/types/document";
import { parseNote } from "@/lib/parser";
import * as fs from "@/lib/fs";

export interface VaultSlice {
  vaultPath: string | null;
  vaultName: string | null;
  fileTree: FileTreeNode | null;
  flatFiles: NoteFileMeta[];
  expandedDirs: Set<string>;
  recentVaults: string[];
  isLoading: boolean;
  error: string | null;

  openVault: (path: string) => Promise<void>;
  closeVault: () => void;
  refreshFileTree: () => Promise<void>;
  handleFileEvent: (event: VaultFileEvent) => void;
  toggleDirExpansion: (path: string) => void;
  addRecentVault: (path: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createVaultSlice: StateCreator<VaultSlice, any, [], VaultSlice> = (set, get) => ({
  vaultPath: null,
  vaultName: null,
  fileTree: null,
  flatFiles: [],
  expandedDirs: new Set(),
  recentVaults: [],
  isLoading: false,
  error: null,

  openVault: async (path: string) => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });
    try {
      const [tree, rawFiles] = await Promise.all([
        fs.getFileTree(path),
        fs.listVaultFiles(path),
      ]);

      // Enrich flat file list with parsed metadata (tags, wikilinks, title)
      const enriched: NoteFileMeta[] = rawFiles.map((f) => ({
        filePath: (f as any).file_path ?? f.filePath,
        name: f.name,
        title: f.name,
        tags: [],
        wikiLinks: [],
        type: documentTypeFromExtension(f.extension),
        extension: f.extension,
        modified: (f.modified ?? 0) * 1000,
        created: (f.modified ?? 0) * 1000,
        size: f.size ?? 0,
      }));

      const vaultName = path.split("/").pop() ?? path.split("\\").pop() ?? path;

      set((state) => {
        state.vaultPath = path;
        state.vaultName = vaultName;
        state.fileTree = tree;
        state.flatFiles = enriched;
        state.isLoading = false;
        // Auto-expand the vault root
        state.expandedDirs = new Set([path]);
      });

      get().addRecentVault(path);

      // Kick off background content parsing for metadata enrichment
      enrichNoteMetadata(enriched, set);
    } catch (err) {
      set((state) => {
        state.isLoading = false;
        state.error = String(err);
      });
    }
  },

  closeVault: () => {
    set((state) => {
      state.vaultPath = null;
      state.vaultName = null;
      state.fileTree = null;
      state.flatFiles = [];
      state.expandedDirs = new Set();
    });
  },

  refreshFileTree: async () => {
    const { vaultPath } = get();
    if (!vaultPath) return;
    try {
      const [tree, rawFiles] = await Promise.all([
        fs.getFileTree(vaultPath),
        fs.listVaultFiles(vaultPath),
      ]);
      const enriched: NoteFileMeta[] = rawFiles.map((f) => ({
        filePath: (f as any).file_path ?? f.filePath,
        name: f.name,
        title: f.name,
        tags: [],
        wikiLinks: [],
        type: documentTypeFromExtension(f.extension),
        extension: f.extension,
        modified: (f.modified ?? 0) * 1000,
        created: (f.modified ?? 0) * 1000,
        size: f.size ?? 0,
      }));
      set((state) => {
        state.fileTree = tree;
        state.flatFiles = enriched;
      });
    } catch (err) {
      console.error("Failed to refresh file tree:", err);
    }
  },

  handleFileEvent: (_event: VaultFileEvent) => {
    // Trigger a lightweight refresh on file system events
    get().refreshFileTree();
  },

  toggleDirExpansion: (path: string) => {
    set((state) => {
      if (state.expandedDirs.has(path)) {
        state.expandedDirs.delete(path);
      } else {
        state.expandedDirs.add(path);
      }
    });
  },

  addRecentVault: (path: string) => {
    set((state) => {
      const filtered = state.recentVaults.filter((v) => v !== path);
      state.recentVaults = [path, ...filtered].slice(0, 10);
    });
  },
});

/**
 * Reads and parses a sample of notes in the background to extract
 * accurate title, tag, and wiki-link metadata without blocking the UI.
 */
async function enrichNoteMetadata(
  files: NoteFileMeta[],
  set: (fn: (state: VaultSlice) => void) => void
) {
  const mdFiles = files.filter((f) => f.type === DocumentType.Markdown);
  // Process in batches to avoid hammering the file system
  const BATCH = 20;
  for (let i = 0; i < mdFiles.length; i += BATCH) {
    const batch = mdFiles.slice(i, i + BATCH);
    await Promise.all(
      batch.map(async (file) => {
        try {
          const content = await fs.readNote(file.filePath);
          const parsed = parseNote(content, file.name);
          set((state) => {
            const idx = state.flatFiles.findIndex((f) => f.filePath === file.filePath);
            if (idx !== -1) {
              state.flatFiles[idx].title = parsed.title;
              state.flatFiles[idx].tags = parsed.tags;
              state.flatFiles[idx].wikiLinks = parsed.wikiLinks;
            }
          });
        } catch {
          // Non-critical — skip silently
        }
      })
    );
    // Yield to the event loop between batches
    await new Promise((r) => setTimeout(r, 0));
  }
}
