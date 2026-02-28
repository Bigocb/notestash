import { Moon, Sun, GitBranch } from "lucide-react";
import { useUI, useEditor, useVault } from "@/store";

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

interface ChipProps {
  children: React.ReactNode;
  title?: string;
  muted?: boolean;
  onClick?: () => void;
}

function Chip({ children, title, muted, onClick }: ChipProps) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      title={title}
      onClick={onClick}
      className="flex items-center gap-1 px-2 h-full transition-colors hover:bg-[var(--ns-muted)]"
      style={{ color: muted ? "var(--ns-muted-fg)" : "var(--ns-sidebar-fg)" }}
    >
      {children}
    </Tag>
  );
}

export default function StatusBar() {
  const { theme, toggleTheme } = useUI();
  const { tabs, activeTabId } = useEditor();
  const { vaultPath, vaultName, flatFiles } = useVault();

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const words = activeTab ? wordCount(activeTab.content) : 0;
  const ln = activeTab ? activeTab.cursorPos.line + 1 : null;
  const col = activeTab ? activeTab.cursorPos.ch + 1 : null;

  return (
    <div
      className="flex items-stretch shrink-0 text-xs no-select overflow-hidden"
      style={{
        height: "var(--ns-statusbar-height)",
        background: "var(--ns-sidebar-bg)",
        borderTop: "1px solid var(--ns-border)",
        color: "var(--ns-sidebar-fg)",
      }}
    >
      {/* Accent vault chip — left anchor */}
      {vaultName && (
        <span
          className="flex items-center gap-1.5 px-3 shrink-0 font-medium"
          style={{
            background: "var(--ns-accent)",
            color: "var(--ns-accent-fg)",
          }}
          title={vaultPath ?? ""}
        >
          <GitBranch size={11} />
          {vaultName}
        </span>
      )}

      {/* Left info */}
      <div className="flex items-stretch">
        {flatFiles.length > 0 && (
          <Chip muted>{flatFiles.length} notes</Chip>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right info */}
      <div className="flex items-stretch">
        {activeTab && ln !== null && (
          <Chip muted title="Cursor position">
            Ln {ln}, Col {col}
          </Chip>
        )}
        {activeTab && (
          <Chip muted title="Word count">
            {words} words
          </Chip>
        )}
        {activeTab && (
          <Chip muted title="Editor mode">
            {activeTab.mode === "live-preview" ? "live" : activeTab.mode}
          </Chip>
        )}
        <Chip
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? <Sun size={12} /> : <Moon size={12} />}
        </Chip>
      </div>
    </div>
  );
}
