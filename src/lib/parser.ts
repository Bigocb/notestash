import matter from "gray-matter";
import { NoteFrontmatter } from "@/types/note";

export interface ParsedNote {
  frontmatter: NoteFrontmatter;
  body: string;
  tags: string[];
  wikiLinks: string[];
  title: string;
}

const WIKI_LINK_RE = /\[\[([^\]|#\n]+?)(?:[|#][^\]]*?)?\]\]/g;
const INLINE_TAG_RE = /#([\w/-]+)/g;

export function parseNote(rawContent: string, fallbackName: string): ParsedNote {
  let frontmatter: NoteFrontmatter = {};
  let body = rawContent;

  try {
    const parsed = matter(rawContent);
    frontmatter = parsed.data as NoteFrontmatter;
    body = parsed.content;
  } catch {
    // Malformed frontmatter — treat whole content as body
    body = rawContent;
  }

  // Extract wiki-links
  const wikiLinks: string[] = [];
  let match: RegExpExecArray | null;
  const wikiRe = new RegExp(WIKI_LINK_RE.source, "g");
  while ((match = wikiRe.exec(rawContent)) !== null) {
    wikiLinks.push(match[1].trim());
  }

  // Merge frontmatter tags + inline #tags
  const frontmatterTags = (frontmatter.tags ?? []).map((t) => t.toLowerCase());
  const inlineTags: string[] = [];
  const tagRe = new RegExp(INLINE_TAG_RE.source, "g");
  while ((match = tagRe.exec(body)) !== null) {
    inlineTags.push(match[1].toLowerCase());
  }
  const tags = Array.from(new Set([...frontmatterTags, ...inlineTags]));

  // Determine title: frontmatter > first # heading > fallbackName
  let title = frontmatter.title ?? "";
  if (!title) {
    const headingMatch = body.match(/^#\s+(.+)$/m);
    if (headingMatch) {
      title = headingMatch[1].trim();
    } else {
      title = fallbackName;
    }
  }

  return { frontmatter, body, tags, wikiLinks, title };
}
