import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from "lucide-react";
import { useVault, useEditor } from "@/store";
import { FileTreeNode } from "@/types/note";
import { cn } from "@/lib/utils";
import FileTreeContextMenu from "./FileTreeContextMenu";

interface Props {
  node: FileTreeNode;
  depth: number;
}

const BASE_PAD = 10;
const INDENT = 16;

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

  return (
    <div>
      <FileTreeContextMenu node={node}>
      <div
        className={cn(
          "relative flex items-center gap-1.5 py-[3px] pr-3 cursor-pointer transition-colors",
          "hover:bg-[var(--ns-muted)]",
          isOpen && !node.isDirectory && "bg-[var(--ns-muted)]"
        )}
        style={{ paddingLeft: BASE_PAD + depth * INDENT }}
        onClick={handleClick}
      >
        {/* Chevron */}
        <span className="shrink-0 w-3 flex items-center justify-center">
          {node.isDirectory ? (
            isExpanded ? (
              <ChevronDown size={11} className="opacity-60" />
            ) : (
              <ChevronRight size={11} className="opacity-40" />
            )
          ) : null}
        </span>

        {/* Icon */}
        {node.isDirectory ? (
          isExpanded ? (
            <FolderOpen size={14} className="shrink-0" style={{ color: "var(--ns-accent)" }} />
          ) : (
            <Folder size={14} className="shrink-0" style={{ color: "var(--ns-accent)", opacity: 0.8 }} />
          )
        ) : (
          <FileText size={14} className="shrink-0" style={{ color: "var(--ns-muted-fg)", opacity: 0.7 }} />
        )}

        {/* Name */}
        <span
          className="truncate text-xs"
          style={{
            color: isOpen && !node.isDirectory ? "var(--ns-accent)" : "var(--ns-sidebar-fg)",
          }}
        >
          {node.name}
        </span>
      </div>
      </FileTreeContextMenu>

      {/* Children with indent guide */}
      {node.isDirectory && isExpanded && node.children && (
        <div
          className="relative"
          style={{
            borderLeft: "1px solid var(--ns-border)",
            marginLeft: BASE_PAD + depth * INDENT + 12,
            opacity: 0.8,
          }}
        >
          <div style={{ marginLeft: -(BASE_PAD + depth * INDENT + 12) }}>
            {node.children.map((child) => (
              <FileTreeNodeItem key={child.path} node={child} depth={depth + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
