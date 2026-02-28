import { FolderOpen } from "lucide-react";
import { useVault } from "@/store";
import { pickVaultFolder } from "@/lib/fs";

export default function VaultWelcome() {
  const { openVault, recentVaults } = useVault();

  async function handleOpenVault() {
    const path = await pickVaultFolder();
    if (path) await openVault(path);
  }

  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-10 px-8"
      style={{ background: "var(--ns-bg)", color: "var(--ns-fg)" }}
    >
      {/* Brand */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "var(--ns-accent)", color: "var(--ns-accent-fg)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div className="text-center">
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ color: "var(--ns-fg)" }}
          >
            NoteStash
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--ns-muted-fg)" }}>
            A workspace for notes, code, and ideas
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <button
          onClick={handleOpenVault}
          className="flex items-center justify-center gap-2.5 w-full px-5 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
          style={{ background: "var(--ns-accent)", color: "var(--ns-accent-fg)" }}
        >
          <FolderOpen size={16} />
          Open Vault Folder
        </button>

        {recentVaults.length > 0 && (
          <div className="w-full mt-2">
            <div
              className="text-xs font-medium uppercase tracking-widest mb-2 px-1"
              style={{ color: "var(--ns-muted-fg)" }}
            >
              Recent
            </div>
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid var(--ns-border)" }}
            >
              {recentVaults.slice(0, 5).map((vaultPath, i) => {
                const name =
                  vaultPath.split("/").pop() ??
                  vaultPath.split("\\").pop() ??
                  vaultPath;
                return (
                  <button
                    key={vaultPath}
                    onClick={() => openVault(vaultPath)}
                    className="flex flex-col w-full text-left px-4 py-2.5 transition-colors hover:bg-[var(--ns-muted)]"
                    style={{
                      borderTop: i > 0 ? "1px solid var(--ns-border)" : "none",
                    }}
                  >
                    <span className="text-sm font-medium" style={{ color: "var(--ns-fg)" }}>
                      {name}
                    </span>
                    <span
                      className="text-xs mt-0.5 truncate max-w-full"
                      style={{ color: "var(--ns-muted-fg)" }}
                    >
                      {vaultPath}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs" style={{ color: "var(--ns-muted-fg)" }}>
        Press{" "}
        <kbd
          className="px-1.5 py-0.5 rounded text-xs"
          style={{
            background: "var(--ns-muted)",
            color: "var(--ns-fg)",
            border: "1px solid var(--ns-border)",
          }}
        >
          Ctrl+P
        </kbd>{" "}
        for the command palette
      </p>
    </div>
  );
}
