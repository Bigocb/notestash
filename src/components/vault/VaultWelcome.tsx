import { FolderOpen, Clock } from "lucide-react";
import { useVault } from "@/store";
import { pickVaultFolder } from "@/lib/fs";

export default function VaultWelcome() {
  const { openVault, recentVaults } = useVault();

  async function handleOpenVault() {
    const path = await pickVaultFolder();
    if (path) {
      await openVault(path);
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-8 px-8"
      style={{ background: "var(--ns-bg)", color: "var(--ns-fg)" }}
    >
      {/* Logo / title */}
      <div className="text-center">
        <h1 className="text-4xl font-light tracking-widest mb-2" style={{ color: "var(--ns-accent)" }}>
          NoteStash
        </h1>
        <p className="text-sm" style={{ color: "var(--ns-muted-fg)" }}>
          A simple workspace for notes, code, and ideas
        </p>
      </div>

      {/* Open vault button */}
      <button
        onClick={handleOpenVault}
        className="flex items-center gap-3 px-6 py-3 rounded-lg transition-colors text-sm font-medium"
        style={{
          background: "var(--ns-accent)",
          color: "var(--ns-accent-fg)",
        }}
      >
        <FolderOpen size={18} />
        Open Vault Folder
      </button>

      {/* Recent vaults */}
      {recentVaults.length > 0 && (
        <div className="w-full max-w-sm">
          <div
            className="flex items-center gap-2 text-xs mb-3"
            style={{ color: "var(--ns-muted-fg)" }}
          >
            <Clock size={12} />
            RECENT
          </div>
          <ul className="space-y-1">
            {recentVaults.slice(0, 5).map((vaultPath) => {
              const name = vaultPath.split("/").pop() ?? vaultPath.split("\\").pop() ?? vaultPath;
              return (
                <li key={vaultPath}>
                  <button
                    onClick={() => openVault(vaultPath)}
                    className="w-full text-left px-3 py-2 rounded text-sm transition-colors hover:bg-[var(--ns-muted)]"
                    style={{ color: "var(--ns-fg)" }}
                  >
                    <div className="font-medium">{name}</div>
                    <div className="text-xs mt-0.5 truncate" style={{ color: "var(--ns-muted-fg)" }}>
                      {vaultPath}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p className="text-xs" style={{ color: "var(--ns-muted-fg)" }}>
        Press <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: "var(--ns-muted)" }}>Ctrl+P</kbd> for the command palette
      </p>
    </div>
  );
}
