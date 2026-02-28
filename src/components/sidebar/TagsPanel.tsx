import { useVault } from "@/store";

export default function TagsPanel() {
  const { flatFiles } = useVault();

  // Collect all unique tags
  const allTags = Array.from(
    new Set(flatFiles.flatMap((f) => f.tags))
  ).sort();

  return (
    <div className="flex flex-col h-full p-3">
      <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--ns-muted-fg)" }}>
        Tags
      </div>
      {allTags.length === 0 ? (
        <p className="text-xs" style={{ color: "var(--ns-muted-fg)" }}>
          No tags found. Add <code>#tags</code> to your notes.
        </p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs cursor-pointer hover:opacity-80"
              style={{ background: "var(--ns-muted)", color: "var(--ns-accent)" }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
