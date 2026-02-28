import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from "lucide-react";
import { useVault, useEditor } from "@/store";
import { FileTreeNode } from "@/types/note";
import { cn } from "@/lib/utils";

interface Props {
  node: FileTreeNode;
  depth: number;
}

export default function FileTreeNodeItem({ node, depth }: Props) {
  const { expandedDirs, toggleDirExpansion } = useVault();
  const { openTab, tabs } = useEditor();

  const isExpanded = expandedDirs.has(node.path);
  const isOpen = tabs.some((t) => t.filePath === node.path);

  function handleClick() {
    if (node.isDirectory) {
      toggleDirExpansion(node.path);
    } else {
      openTab(node.path, node.name);
    }
  }

  const paddingLeft = 12 + depth * 16;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1.5 py-0.5 pr-2 cursor-pointer text-sm transition-colors",
          "hover:bg-[var(--ns-muted)]",
          isOpen && !node.isDirectory && "text-[var(--ns-accent)]"
        )}
        style={{
          paddingLeft,
          color: node.isDirectory
            ? "var(--ns-sidebar-fg)"
            : isOpen
            ? "var(--ns-accent)"
            : "var(--ns-sidebar-fg)",
        }}
        onClick={handleClick}
      >
        {/* Expand arrow for directories */}
        {node.isDirectory ? (
          isExpanded ? (
            <ChevronDown size={12} className="shrink-0 opacity-60" />
          ) : (
            <ChevronRight size={12} className="shrink-0 opacity-60" />
          )
        ) : (
          <span className="w-3 shrink-0" />
        )}

        {/* Icon */}
        {node.isDirectory ? (
          isExpanded ? (
            <FolderOpen size={14} className="shrink-0" style={{ color: "var(--ns-accent)" }} />
          ) : (
            <Folder size={14} className="shrink-0" style={{ color: "var(--ns-accent)" }} />
          )
        ) : (
          <FileText size={14} className="shrink-0 opacity-70" />
        )}

        {/* Name */}
        <span className="truncate">
          {node.isDirectory ? node.name : node.name}
        </span>
      </div>

      {/* Children */}
      {node.isDirectory && isExpanded && node.children?.map((child) => (
        <FileTreeNodeItem key={child.path} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}
