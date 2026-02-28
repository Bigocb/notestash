import { NoteFileMeta } from "@/types/note";

/**
 * Resolve a [[wiki-link]] target name to a full file path.
 *
 * Resolution order (same as Obsidian):
 * 1. Exact file path match (relative from vault root)
 * 2. Filename match (case-insensitive)
 * 3. Return null if not found
 */
export function resolveWikiLink(
  linkTarget: string,
  flatFiles: NoteFileMeta[],
  vaultPath: string | null
): string | null {
  if (!vaultPath) return null;

  const target = linkTarget.trim().replace(/\.md$/, "");

  // 1. Exact name match (case-insensitive)
  const exact = flatFiles.find(
    (f) => f.name.toLowerCase() === target.toLowerCase()
  );
  if (exact) return exact.filePath;

  // 2. Title match (case-insensitive)
  const byTitle = flatFiles.find(
    (f) => f.title.toLowerCase() === target.toLowerCase()
  );
  if (byTitle) return byTitle.filePath;

  // 3. Partial path match — e.g. "folder/note"
  const normalized = target.replace(/\\/g, "/");
  const byPath = flatFiles.find((f) =>
    f.filePath.replace(/\\/g, "/").toLowerCase().endsWith(normalized.toLowerCase() + ".md")
  );
  if (byPath) return byPath.filePath;

  return null;
}

/** Extract all [[wiki-links]] from a markdown string */
export function extractWikiLinks(content: string): string[] {
  const RE = /\[\[([^\]|#\n]+?)(?:[|#][^\]]*?)?\]\]/g;
  const links: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = RE.exec(content)) !== null) {
    links.push(match[1].trim());
  }
  return links;
}

/** Get the display text for a wiki-link: [[target|alias]] → alias, [[target]] → target */
export function wikiLinkDisplayText(raw: string): string {
  const pipeIdx = raw.indexOf("|");
  if (pipeIdx !== -1) return raw.slice(pipeIdx + 1).trim();
  const hashIdx = raw.indexOf("#");
  if (hashIdx !== -1) return raw.slice(0, hashIdx).trim();
  return raw.trim();
}
