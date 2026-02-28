import { CSSProperties } from "react";
import { useUI } from "@/store";
import FileTree from "@/components/sidebar/FileTree";
import SearchPanel from "@/components/sidebar/SearchPanel";
import TagsPanel from "@/components/sidebar/TagsPanel";

interface SidebarProps {
  style?: CSSProperties;
}

export default function Sidebar({ style }: SidebarProps) {
  const { activePanel } = useUI();

  return (
    <div
      className="flex flex-col h-full shrink-0 overflow-hidden"
      style={{
        background: "var(--ns-sidebar-bg)",
        color: "var(--ns-sidebar-fg)",
        borderRight: "1px solid var(--ns-border)",
        ...style,
      }}
    >
      {activePanel === "files" && <FileTree />}
      {activePanel === "search" && <SearchPanel />}
      {activePanel === "tags" && <TagsPanel />}
    </div>
  );
}
