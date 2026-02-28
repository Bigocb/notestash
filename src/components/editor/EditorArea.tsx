import { useCallback, useEffect, useRef } from "react";
import { useEditor } from "@/store";
import { useVault } from "@/store";
import VaultWelcome from "@/components/vault/VaultWelcome";
import TabBar from "./TabBar";
import EditorPane from "./EditorPane";

export default function EditorArea() {
  const { vaultPath } = useVault();
  const { tabs, activeTabId, split, setSplitRatio } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startRatio = useRef(0.5);

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      startX.current = e.clientX;
      startRatio.current = split.splitRatio;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [split.splitRatio]
  );

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current || !containerRef.current) return;
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const delta = (e.clientX - startX.current) / containerWidth;
      setSplitRatio(startRatio.current + delta);
    }
    function onMouseUp() {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [setSplitRatio]);

  if (!vaultPath) {
    return <VaultWelcome />;
  }

  if (tabs.length === 0) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        style={{ background: "var(--ns-editor-bg)", color: "var(--ns-muted-fg)" }}
      >
        <div className="text-center text-sm">
          <p>Open a note from the sidebar</p>
          <p className="text-xs mt-2 opacity-60">or press Ctrl+P</p>
        </div>
      </div>
    );
  }

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  const isSplit = split.isActive && split.secondaryTabId;

  return (
    <div
      className="flex flex-col flex-1 overflow-hidden"
      style={{ background: "var(--ns-editor-bg)" }}
    >
      <TabBar />

      {isSplit ? (
        <div ref={containerRef} className="flex flex-1 overflow-hidden">
          {/* Primary pane */}
          <div
            className="flex flex-col overflow-hidden"
            style={{ flex: `0 0 ${split.splitRatio * 100}%`, minWidth: 0 }}
          >
            <EditorPane tabId={activeTab.id} />
          </div>

          {/* Drag handle */}
          <div
            className="relative shrink-0 cursor-col-resize transition-colors"
            style={{ width: 5, background: "var(--ns-border)" }}
            onMouseDown={handleDragStart}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--ns-accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--ns-border)";
            }}
          />

          {/* Secondary pane */}
          <div
            className="flex flex-col overflow-hidden"
            style={{ flex: `0 0 ${(1 - split.splitRatio) * 100}%`, minWidth: 0 }}
          >
            <EditorPane tabId={split.secondaryTabId!} />
          </div>
        </div>
      ) : (
        <EditorPane tabId={activeTab.id} />
      )}
    </div>
  );
}
