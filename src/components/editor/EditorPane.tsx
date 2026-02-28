import { useEditor } from "@/store";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownPreview from "./MarkdownPreview";

interface Props {
  tabId: string;
}

export default function EditorPane({ tabId }: Props) {
  const { tabs, setTabMode } = useEditor();
  const tab = tabs.find((t) => t.id === tabId);

  if (!tab) return null;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Toolbar */}
      <div
        className="flex items-center gap-1 px-3 py-1 shrink-0 text-xs no-select"
        style={{
          background: "var(--ns-sidebar-bg)",
          borderBottom: "1px solid var(--ns-border)",
          color: "var(--ns-muted-fg)",
        }}
      >
        {(["source", "live-preview", "preview"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setTabMode(tab.id, mode)}
            className="px-2 py-0.5 rounded transition-colors"
            style={{
              background: tab.mode === mode ? "var(--ns-muted)" : "transparent",
              color: tab.mode === mode ? "var(--ns-fg)" : "var(--ns-muted-fg)",
            }}
          >
            {mode === "live-preview" ? "Live" : mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {tab.mode === "preview" ? (
          <MarkdownPreview content={tab.content} />
        ) : (
          <MarkdownEditor tab={tab} />
        )}
      </div>
    </div>
  );
}
