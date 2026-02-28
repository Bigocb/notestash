/**
 * Module-level FlexSearch Document index.
 * Lives outside Zustand because FlexSearch instances aren't serializable.
 * The searchSlice stores query + results; this module does the actual indexing.
 */
import FlexSearch from "flexsearch";
import { excerptAround } from "@/lib/utils";
import type { SearchResult } from "@/types/search";

interface IndexedDoc {
  id: string;   // filePath
  title: string;
  body: string;
  tags: string; // space-joined for tokenization
}

// Simple index — we look up metadata from metaMap instead of using enrich
const docIndex = new FlexSearch.Document<IndexedDoc>({
  document: {
    id: "id",
    index: [
      { field: "title", tokenize: "forward", resolution: 9 },
      { field: "body",  tokenize: "forward", resolution: 5 },
      { field: "tags",  tokenize: "strict",  resolution: 9 },
    ],
  },
  cache: 200,
});

// Keep all metadata for result enrichment without re-fetching
const metaMap = new Map<string, { title: string; body: string; tags: string[] }>();

export function addToSearchIndex(
  filePath: string,
  title: string,
  body: string,
  tags: string[]
): void {
  const cleanBody = body.replace(/```[\s\S]*?```/g, "").replace(/[#*`_[\]]/g, " ");
  metaMap.set(filePath, { title, body: cleanBody, tags });
  docIndex.add({ id: filePath, title, body: cleanBody, tags: tags.join(" ") });
}

export function updateSearchIndex(
  filePath: string,
  title: string,
  body: string,
  tags: string[]
): void {
  const cleanBody = body.replace(/```[\s\S]*?```/g, "").replace(/[#*`_[\]]/g, " ");
  metaMap.set(filePath, { title, body: cleanBody, tags });
  docIndex.update({ id: filePath, title, body: cleanBody, tags: tags.join(" ") });
}

export function removeFromSearchIndex(filePath: string): void {
  metaMap.delete(filePath);
  docIndex.remove(filePath);
}

export function clearSearchIndex(): void {
  for (const filePath of metaMap.keys()) {
    docIndex.remove(filePath);
  }
  metaMap.clear();
}

export function querySearchIndex(query: string, limit = 50): SearchResult[] {
  if (!query.trim()) return [];

  // Returns SimpleDocumentSearchResultSetUnit[] — each has { field, result: Id[] }
  const rawResults = docIndex.search(query, { limit });

  // De-duplicate file paths across fields
  const seen = new Set<string>();
  const results: SearchResult[] = [];

  for (const fieldResult of rawResults) {
    for (const id of fieldResult.result) {
      const filePath = id as string;
      if (seen.has(filePath)) continue;
      seen.add(filePath);

      const meta = metaMap.get(filePath);
      results.push({
        filePath,
        title: meta?.title ?? filePath.split("/").pop() ?? filePath,
        excerpt: excerptAround(meta?.body ?? "", query, 120),
        tags: meta?.tags ?? [],
        score: 1,
      });
    }
  }

  return results;
}
