import { useEffect } from "react";
import { useUI, useSettings } from "@/store";
import { applyTheme, getTheme } from "@/styles/themes";
import ActivityBar from "./ActivityBar";
import Sidebar from "./Sidebar";
import EditorArea from "@/components/editor/EditorArea";
import StatusBar from "./StatusBar";
import CommandPalette from "@/components/command-palette/CommandPalette";

export default function AppShell() {
  const { isSidebarOpen, sidebarWidth } = useUI();
  const { activeThemeId } = useSettings();

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyTheme(getTheme(activeThemeId));
  }, [activeThemeId]);

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "var(--ns-bg)", color: "var(--ns-fg)" }}
    >
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar />

        {isSidebarOpen && (
          <Sidebar style={{ width: sidebarWidth }} />
        )}

        <EditorArea />
      </div>

      <StatusBar />
      <CommandPalette />
    </div>
  );
}
