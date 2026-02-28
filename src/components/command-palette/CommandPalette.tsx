import { useEffect } from "react";
import { useUI, useVault, useEditor } from "@/store";
import { pickVaultFolder } from "@/lib/fs";
import { FileText, FolderOpen, Moon, Sun, PanelLeft } from "lucide-react";

export default function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen, toggleTheme, theme, toggleSidebar } = useUI();
  const { flatFiles, openVault } = useVault();
  const { openTab } = useEditor();

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setCommandPaletteOpen(false);
    }
    if (isCommandPaletteOpen) {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  async function handleOpenVault() {
    setCommandPaletteOpen(false);
    const path = await pickVaultFolder();
    if (path) await openVault(path);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.5)" }}
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* Modal */}
      <div
        className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl rounded-lg shadow-2xl overflow-hidden"
        style={{
          background: "var(--ns-bg)",
          border: "1px solid var(--ns-border)",
        }}
      >
        <input
          autoFocus
          type="text"
          placeholder="Search notes and commands..."
          className="w-full px-4 py-3 text-sm outline-none"
          style={{
            background: "transparent",
            color: "var(--ns-fg)",
            borderBottom: "1px solid var(--ns-border)",
          }}
        />

        <div className="max-h-80 overflow-y-auto py-2">
          {/* Notes section */}
          {flatFiles.length > 0 && (
            <div>
              <div
                className="px-4 py-1 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--ns-muted-fg)" }}
              >
                Notes
              </div>
              {flatFiles.slice(0, 8).map((file) => (
                <button
                  key={file.filePath}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-[var(--ns-muted)] transition-colors"
                  style={{ color: "var(--ns-fg)" }}
                  onClick={() => {
                    openTab(file.filePath, file.title);
                    setCommandPaletteOpen(false);
                  }}
                >
                  <FileText size={14} style={{ color: "var(--ns-muted-fg)" }} />
                  {file.title}
                </button>
              ))}
            </div>
          )}

          {/* Commands section */}
          <div>
            <div
              className="px-4 py-1 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--ns-muted-fg)" }}
            >
              Commands
            </div>

            <button
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-[var(--ns-muted)] transition-colors"
              style={{ color: "var(--ns-fg)" }}
              onClick={handleOpenVault}
            >
              <FolderOpen size={14} style={{ color: "var(--ns-muted-fg)" }} />
              Open Vault
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-[var(--ns-muted)] transition-colors"
              style={{ color: "var(--ns-fg)" }}
              onClick={() => { toggleSidebar(); setCommandPaletteOpen(false); }}
            >
              <PanelLeft size={14} style={{ color: "var(--ns-muted-fg)" }} />
              Toggle Sidebar
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-[var(--ns-muted)] transition-colors"
              style={{ color: "var(--ns-fg)" }}
              onClick={() => { toggleTheme(); setCommandPaletteOpen(false); }}
            >
              {theme === "dark"
                ? <Sun size={14} style={{ color: "var(--ns-muted-fg)" }} />
                : <Moon size={14} style={{ color: "var(--ns-muted-fg)" }} />}
              Toggle Theme
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
