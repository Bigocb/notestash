export default function SearchPanel() {
  return (
    <div className="flex flex-col h-full p-3">
      <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--ns-muted-fg)" }}>
        Search
      </div>
      <input
        type="text"
        placeholder="Search notes..."
        className="w-full px-3 py-1.5 rounded text-sm outline-none"
        style={{
          background: "var(--ns-muted)",
          color: "var(--ns-fg)",
          border: "1px solid var(--ns-border)",
        }}
      />
      <p className="text-xs mt-4 text-center" style={{ color: "var(--ns-muted-fg)" }}>
        Full-text search — coming in Phase 4
      </p>
    </div>
  );
}
