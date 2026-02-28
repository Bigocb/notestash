import { useEditor } from "@/store";
import VaultWelcome from "@/components/vault/VaultWelcome";
import { useVault } from "@/store";
import TabBar from "./TabBar";
import EditorPane from "./EditorPane";

export default function EditorArea() {
  const { vaultPath } = useVault();
  const { tabs, activeTabId, split } = useEditor();

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

  return (
    <div
      className="flex flex-col flex-1 overflow-hidden"
      style={{ background: "var(--ns-editor-bg)" }}
    >
      <TabBar />

      {split.isActive && split.secondaryTabId ? (
        <div className="flex flex-1 overflow-hidden">
          <EditorPane tabId={activeTab.id} />
          <div style={{ width: 1, background: "var(--ns-border)" }} />
          <EditorPane tabId={split.secondaryTabId} />
        </div>
      ) : (
        <EditorPane tabId={activeTab.id} />
      )}
    </div>
  );
}
