import { useEditor } from "@/store";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownPreview from "./MarkdownPreview";
import { cn } from "@/lib/utils";

interface Props {
  tabId: string;
}

const MODES = [
  { id: "source", label: "Source" },
  { id: "live-preview", label: "Live" },
  { id: "preview", label: "Preview" },
] as const;

export default function EditorPane({ tabId }: Props) {
  const { tabs, setTabMode } = useEditor();
  const tab = tabs.find((t) => t.id === tabId);

  if (!tab) return null;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-3 py-1.5 shrink-0 no-select"
        style={{
          background: "var(--ns-sidebar-bg)",
          borderBottom: "1px solid var(--ns-border)",
        }}
      >
        {/* Pill mode switcher */}
        <div
          className="flex items-center p-0.5 rounded-lg gap-0.5"
          style={{ background: "var(--ns-muted)" }}
        >
          {MODES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTabMode(tab.id, id)}
              className={cn(
                "px-2.5 py-0.5 rounded-md text-xs transition-colors font-medium",
                tab.mode === id
                  ? "shadow-sm"
                  : "hover:bg-[var(--ns-muted)]"
              )}
              style={{
                background: tab.mode === id ? "var(--ns-editor-bg)" : "transparent",
                color: tab.mode === id ? "var(--ns-fg)" : "var(--ns-muted-fg)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
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
