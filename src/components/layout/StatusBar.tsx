import { Moon, Sun } from "lucide-react";
import { useUI, useEditor, useVault } from "@/store";

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function StatusBar() {
  const { theme, toggleTheme } = useUI();
  const { tabs, activeTabId } = useEditor();
  const { vaultPath, vaultName, flatFiles } = useVault();

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const words = activeTab ? wordCount(activeTab.content) : 0;
  const cursor = activeTab
    ? `Ln ${activeTab.cursorPos.line + 1}, Col ${activeTab.cursorPos.ch + 1}`
    : "";

  return (
    <div
      className="flex items-center justify-between px-3 shrink-0 text-xs no-select"
      style={{
        height: "var(--ns-statusbar-height)",
        background: "var(--ns-accent)",
        color: "var(--ns-accent-fg)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        {vaultName && (
          <span title={vaultPath ?? ""} className="opacity-90">
            {vaultName}
          </span>
        )}
        {flatFiles.length > 0 && (
          <span className="opacity-75">{flatFiles.length} notes</span>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {cursor && <span>{cursor}</span>}
        {activeTab && <span>{words} words</span>}
        {activeTab && (
          <span className="opacity-75">{activeTab.mode}</span>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="hover:opacity-80 transition-opacity"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
        </button>
      </div>
    </div>
  );
}
