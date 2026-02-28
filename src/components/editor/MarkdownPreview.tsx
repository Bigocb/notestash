import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface Props {
  content: string;
}

export default function MarkdownPreview({ content }: Props) {
  return (
    <div
      className="h-full overflow-y-auto px-8 py-6 prose prose-invert max-w-none"
      style={{
        background: "var(--ns-editor-bg)",
        color: "var(--ns-editor-fg)",
        "--tw-prose-body": "var(--ns-editor-fg)",
        "--tw-prose-headings": "var(--ns-syn-heading)",
        "--tw-prose-links": "var(--ns-syn-link)",
        "--tw-prose-code": "var(--ns-syn-code)",
        "--tw-prose-pre-bg": "var(--ns-muted)",
        "--tw-prose-bold": "var(--ns-syn-bold)",
      } as React.CSSProperties}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
