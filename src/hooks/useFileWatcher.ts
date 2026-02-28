import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useVault } from "@/store";
import { VaultFileEventKind } from "@/types/note";
import * as fsLib from "@/lib/fs";

/**
 * Subscribes to Tauri vault:* events emitted by the Rust watcher
 * and forwards them to the vaultSlice for reactive file tree updates.
 */
export function useFileWatcher() {
  const { vaultPath, handleFileEvent } = useVault();

  useEffect(() => {
    if (!vaultPath) return;

    let unlisten: (() => void) | null = null;

    async function startWatcher() {
      if (!vaultPath) return;
      try {
        await fsLib.startWatchingVault(vaultPath);
      } catch (err) {
        console.warn("Could not start file watcher:", err);
      }

      // Listen for each event kind from the Rust watcher
      const unlisteners = await Promise.all([
        listen<string[]>("vault:created", (e) =>
          handleFileEvent({ kind: "created" as VaultFileEventKind, paths: e.payload })
        ),
        listen<string[]>("vault:modified", (e) =>
          handleFileEvent({ kind: "modified" as VaultFileEventKind, paths: e.payload })
        ),
        listen<string[]>("vault:deleted", (e) =>
          handleFileEvent({ kind: "deleted" as VaultFileEventKind, paths: e.payload })
        ),
      ]);

      unlisten = () => unlisteners.forEach((u) => u());
    }

    startWatcher();

    return () => {
      unlisten?.();
      fsLib.stopWatchingVault().catch(() => {});
    };
  }, [vaultPath, handleFileEvent]);
}
