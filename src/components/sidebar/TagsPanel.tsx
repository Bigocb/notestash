import { useMemo } from "react";
import { X } from "lucide-react";
import { useVault, useSearch, useEditor } from "@/store";
import { cn } from "@/lib/utils";

export default function TagsPanel() {
  const { flatFiles } = useVault();
  const { activeTags, toggleTag, clearTags } = useSearch();
  const { openTab } = useEditor();

  // Build tag → count map, sorted by count desc then alpha
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const file of flatFiles) {
      for (const tag of file.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [flatFiles]);

  // Files matching all active tags
  const filteredFiles = useMemo(() => {
    if (activeTags.length === 0) return [];
    return flatFiles.filter((f) => activeTags.every((t) => f.tags.includes(t)));
  }, [flatFiles, activeTags]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="px-3 py-2 shrink-0"
        style={{ borderBottom: "1px solid var(--ns-border)" }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--ns-muted-fg)" }}
          >
            Tags
          </span>
          {activeTags.length > 0 && (
            <button
              onClick={clearTags}
              className="flex items-center gap-1 text-xs transition-colors hover:opacity-80"
              style={{ color: "var(--ns-accent)" }}
            >
              <X size={11} />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tagCounts.length === 0 ? (
          <p className="text-xs px-3 mt-6 text-center" style={{ color: "var(--ns-muted-fg)" }}>
            No tags found. Add{" "}
            <code
              className="px-1 rounded text-xs"
              style={{ background: "var(--ns-muted)" }}
            >
              #tag
            </code>{" "}
            to your notes.
          </p>
        ) : (
          <>
            {/* Tag cloud */}
            <div className="flex flex-wrap gap-1.5 p-3">
              {tagCounts.map(([tag, count]) => {
                const isActive = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors",
                      isActive
                        ? "font-medium"
                        : "hover:opacity-90"
                    )}
                    style={{
                      background: isActive ? "var(--ns-accent)" : "var(--ns-muted)",
                      color: isActive ? "var(--ns-accent-fg)" : "var(--ns-accent)",
                      border: isActive ? "none" : "1px solid transparent",
                    }}
                  >
                    <span>#{tag}</span>
                    <span
                      className="opacity-70"
                      style={{ fontSize: "10px" }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filtered file list */}
            {filteredFiles.length > 0 && (
              <div style={{ borderTop: "1px solid var(--ns-border)" }}>
                <div
                  className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--ns-muted-fg)" }}
                >
                  {filteredFiles.length} note{filteredFiles.length !== 1 ? "s" : ""}
                </div>
                <ul>
                  {filteredFiles.map((file) => (
                    <li key={file.filePath}>
                      <button
                        onClick={() => openTab(file.filePath, file.title)}
                        className="w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-[var(--ns-muted)] truncate"
                        style={{ color: "var(--ns-sidebar-fg)" }}
                      >
                        {file.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTags.length > 0 && filteredFiles.length === 0 && (
              <p
                className="text-xs px-3 mt-2 text-center"
                style={{ color: "var(--ns-muted-fg)" }}
              >
                No notes match all selected tags
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
