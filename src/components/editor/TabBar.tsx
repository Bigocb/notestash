import { X } from "lucide-react";
import { useEditor } from "@/store";
import { cn } from "@/lib/utils";

export default function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useEditor();

  return (
    <div
      className="flex items-end shrink-0 overflow-x-auto no-select"
      style={{
        height: "var(--ns-tabbar-height)",
        background: "var(--ns-sidebar-bg)",
        borderBottom: "1px solid var(--ns-border)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            className={cn(
              "flex items-center gap-2 px-3 h-full text-sm cursor-pointer select-none shrink-0 max-w-[200px]",
              "border-r border-[var(--ns-border)] transition-colors",
              isActive
                ? "border-t-2 border-t-[var(--ns-accent)]"
                : "hover:bg-[var(--ns-tab-hover)]"
            )}
            style={{
              background: isActive ? "var(--ns-tab-active)" : "var(--ns-sidebar-bg)",
              color: isActive ? "var(--ns-fg)" : "var(--ns-muted-fg)",
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="truncate text-xs">{tab.title}</span>

            {/* Dirty indicator */}
            {tab.isDirty && (
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: "var(--ns-accent)" }}
              />
            )}

            {/* Close button */}
            <button
              className="shrink-0 p-0.5 rounded hover:bg-[var(--ns-muted)] opacity-60 hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              <X size={11} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
