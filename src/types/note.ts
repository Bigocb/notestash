import { DocumentType } from "./document";

export interface NoteFileMeta {
  filePath: string;
  name: string;        // filename without extension
  title: string;       // frontmatter title || name
  tags: string[];
  wikiLinks: string[]; // [[link]] targets
  type: DocumentType;
  extension: string;
  modified: number;    // unix ms
  created: number;     // unix ms
  size: number;
}

export interface NoteFrontmatter {
  title?: string;
  tags?: string[];
  created?: string;
  modified?: string;
  // AI metadata slots (post-MVP — stored in frontmatter, non-breaking)
  summary?: string;
  embeddings_version?: string;
}

export interface FileTreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileTreeNode[];
  extension?: string;
}

export type VaultFileEventKind = "created" | "modified" | "deleted" | "renamed";

export interface VaultFileEvent {
  kind: VaultFileEventKind;
  paths: string[];
}
