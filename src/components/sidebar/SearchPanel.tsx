import { useCallback, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useSearch, useEditor, useUI } from "@/store";
import { debounce } from "@/lib/utils";
import type { SearchResult } from "@/types/search";

export default function SearchPanel() {
  const { searchQuery, searchResults, isSearching, setSearchQuery, runSearch, clearSearch } =
    useSearch();
  const { openTab } = useEditor();
  const { setActivePanel } = useUI();
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search runner
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((q: string) => runSearch(q), 200),
    [runSearch]
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim()) {
      debouncedSearch(q);
    }
  }

  function handleClear() {
    clearSearch();
    inputRef.current?.focus();
  }

  async function handleResultClick(result: SearchResult) {
    await openTab(result.filePath, result.title);
    setActivePanel("files");
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const hasResults = searchResults.length > 0;
  const hasQuery = searchQuery.trim().length > 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="px-3 py-2 shrink-0"
        style={{ borderBottom: "1px solid var(--ns-border)" }}
      >
        <div
          className="text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: "var(--ns-muted-fg)" }}
        >
          Search
        </div>

        {/* Input */}
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
          style={{
            background: "var(--ns-muted)",
            border: "1px solid var(--ns-border)",
          }}
        >
          <Search size={13} style={{ color: "var(--ns-muted-fg)" }} className="shrink-0" />
          <input
            ref={inputRef}
            value={searchQuery}
            onChange={handleChange}
            placeholder="Search notes…"
            className="flex-1 bg-transparent text-xs outline-none"
            style={{ color: "var(--ns-fg)" }}
          />
          {hasQuery && (
            <button onClick={handleClear} className="shrink-0 opacity-50 hover:opacity-100">
              <X size={12} style={{ color: "var(--ns-muted-fg)" }} />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {!hasQuery && (
          <p
            className="text-xs text-center mt-8 px-4"
            style={{ color: "var(--ns-muted-fg)" }}
          >
            Type to search across all notes
          </p>
        )}

        {hasQuery && isSearching && (
          <p className="text-xs text-center mt-6" style={{ color: "var(--ns-muted-fg)" }}>
            Searching…
          </p>
        )}

        {hasQuery && !isSearching && !hasResults && (
          <p className="text-xs text-center mt-6 px-4" style={{ color: "var(--ns-muted-fg)" }}>
            No results for &ldquo;{searchQuery}&rdquo;
          </p>
        )}

        {hasResults && (
          <ul className="py-1">
            {searchResults.map((result) => (
              <li key={result.filePath}>
                <button
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left px-3 py-2 transition-colors hover:bg-[var(--ns-muted)]"
                >
                  <div className="text-xs font-medium truncate" style={{ color: "var(--ns-fg)" }}>
                    {result.title}
                  </div>
                  {result.excerpt && (
                    <div
                      className="text-xs mt-0.5 line-clamp-2 opacity-70"
                      style={{ color: "var(--ns-sidebar-fg)" }}
                    >
                      {result.excerpt}
                    </div>
                  )}
                  {result.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-px rounded-full"
                          style={{
                            background: "var(--ns-muted)",
                            color: "var(--ns-accent)",
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer count */}
      {hasResults && (
        <div
          className="shrink-0 px-3 py-1.5 text-xs"
          style={{
            borderTop: "1px solid var(--ns-border)",
            color: "var(--ns-muted-fg)",
          }}
        >
          {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
