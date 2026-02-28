import { useMemo, useCallback } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useEditor, useVault } from "@/store";
import { resolveWikiLink } from "@/lib/wikilinks";

interface Props {
  content: string;
}

const WIKI_LINK_RE = /\[\[([^\]|#\n]+?)(?:\|([^\]]*?))?\]\]/g;

/** Preprocess markdown: replace [[wiki-links]] with [display](notestash://target) */
function preprocessWikiLinks(md: string): string {
  return md.replace(WIKI_LINK_RE, (_match, target, alias) => {
    const display = (alias ?? target).trim();
    return `[${display}](notestash://${encodeURIComponent(target.trim())})`;
  });
}

export default function MarkdownPreview({ content }: Props) {
  const { flatFiles, vaultPath } = useVault();
  const { openTab } = useEditor();

  const processedContent = useMemo(
    () => preprocessWikiLinks(content),
    [content]
  );

  const handleLinkClick = useCallback(
    (href: string | undefined) => {
      if (!href?.startsWith("notestash://")) return false;
      const target = decodeURIComponent(href.slice("notestash://".length));
      const resolved = resolveWikiLink(target, flatFiles, vaultPath);
      if (resolved) openTab(resolved, target);
      return true;
    },
    [flatFiles, vaultPath, openTab]
  );

  const components: Components = useMemo(
    () => ({
      a({ href, children }) {
        const isWikiLink = href?.startsWith("notestash://");
        return (
          <a
            href={isWikiLink ? undefined : href}
            onClick={
              isWikiLink
                ? (e) => {
                    e.preventDefault();
                    handleLinkClick(href);
                  }
                : undefined
            }
            style={
              isWikiLink
                ? { color: "var(--ns-syn-wiki-link)", cursor: "pointer" }
                : undefined
            }
          >
            {children}
          </a>
        );
      },
    }),
    [handleLinkClick]
  );

  return (
    <div
      className="h-full overflow-y-auto py-8"
      style={{
        background: "var(--ns-editor-bg)",
        color: "var(--ns-editor-fg)",
      }}
    >
      <div
        className="mx-auto px-8"
        style={{
          maxWidth: "780px",
          fontFamily: "var(--ns-font-ui)",
          lineHeight: "1.7",
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={components}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
