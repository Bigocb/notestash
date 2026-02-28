import { useCallback, useEffect, useRef } from "react";
import { useUI, useSettings } from "@/store";
import { applyTheme, getTheme } from "@/styles/themes";
import ActivityBar from "./ActivityBar";
import Sidebar from "./Sidebar";
import EditorArea from "@/components/editor/EditorArea";
import StatusBar from "./StatusBar";
import CommandPalette from "@/components/command-palette/CommandPalette";

export default function AppShell() {
  const { isSidebarOpen, sidebarWidth, setSidebarWidth } = useUI();
  const { activeThemeId } = useSettings();
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  useEffect(() => {
    applyTheme(getTheme(activeThemeId));
  }, [activeThemeId]);

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      startX.current = e.clientX;
      startWidth.current = sidebarWidth;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [sidebarWidth]
  );

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current) return;
      setSidebarWidth(startWidth.current + (e.clientX - startX.current));
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
  }, [setSidebarWidth]);

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "var(--ns-bg)", color: "var(--ns-fg)" }}
    >
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar />

        {isSidebarOpen && (
          <>
            <Sidebar style={{ width: sidebarWidth }} />
            {/* Drag handle */}
            <div
              className="w-1 shrink-0 cursor-col-resize group relative"
              style={{ background: "var(--ns-border)" }}
              onMouseDown={handleDragStart}
            >
              <div
                className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-[var(--ns-accent)] opacity-0 group-hover:opacity-30 transition-opacity"
              />
            </div>
          </>
        )}

        <EditorArea />
      </div>

      <StatusBar />
      <CommandPalette />
    </div>
  );
}
