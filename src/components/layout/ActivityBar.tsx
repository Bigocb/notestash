import { Files, Search, Tag, Settings } from "lucide-react";
import { useUI } from "@/store";
import { SidebarPanel } from "@/store/uiSlice";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: SidebarPanel | "settings";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

const ACTIVITY_ITEMS: ActivityItem[] = [
  { id: "files", icon: Files, label: "Explorer" },
  { id: "search", icon: Search, label: "Search" },
  { id: "tags", icon: Tag, label: "Tags" },
];

export default function ActivityBar() {
  const { activePanel, isSidebarOpen, setActivePanel, toggleSidebar } = useUI();

  function handleClick(id: SidebarPanel) {
    if (activePanel === id && isSidebarOpen) {
      toggleSidebar();
    } else {
      setActivePanel(id);
      if (!isSidebarOpen) toggleSidebar();
    }
  }

  return (
    <div
      className="flex flex-col items-center py-2 gap-1 shrink-0 no-select"
      style={{
        width: "var(--ns-activity-bar-width)",
        background: "var(--ns-sidebar-bg)",
        borderRight: "1px solid var(--ns-border)",
      }}
    >
      {/* Top items */}
      <div className="flex flex-col items-center gap-1 flex-1">
        {ACTIVITY_ITEMS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            title={label}
            onClick={() => handleClick(id as SidebarPanel)}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-md transition-colors",
              "hover:bg-[var(--ns-muted)]",
              activePanel === id && isSidebarOpen
                ? "text-[var(--ns-accent)] border-l-2 border-[var(--ns-accent)]"
                : "text-[var(--ns-muted-fg)]"
            )}
          >
            <Icon size={18} />
          </button>
        ))}
      </div>

      {/* Settings at bottom */}
      <button
        title="Settings"
        className="w-9 h-9 flex items-center justify-center rounded-md transition-colors hover:bg-[var(--ns-muted)] text-[var(--ns-muted-fg)]"
      >
        <Settings size={18} />
      </button>
    </div>
  );
}
