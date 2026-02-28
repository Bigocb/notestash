import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";

/**
 * Base CM6 theme that reads NoteStash CSS custom properties.
 * Keeping it thin — the heavy lifting is done by CSS variables set by applyTheme().
 * This way all 8 built-in themes work automatically.
 */
export const noteBaseTheme: Extension = EditorView.baseTheme({
  // Heading sizes (applied by livePreviewExtension marks)
  ".cm-ns-h1": {
    fontSize: "1.75em",
    fontWeight: "700",
    color: "var(--ns-syn-heading)",
    fontFamily: "var(--ns-font-ui)",
  },
  ".cm-ns-h2": {
    fontSize: "1.45em",
    fontWeight: "700",
    color: "var(--ns-syn-heading)",
    fontFamily: "var(--ns-font-ui)",
  },
  ".cm-ns-h3": {
    fontSize: "1.2em",
    fontWeight: "600",
    color: "var(--ns-syn-heading)",
    fontFamily: "var(--ns-font-ui)",
  },
  ".cm-ns-h4, .cm-ns-h5, .cm-ns-h6": {
    fontSize: "1em",
    fontWeight: "600",
    color: "var(--ns-syn-heading)",
  },

  // Heading marker (#, ##, ...) — dimmed on unfocused lines
  ".cm-ns-heading-mark": {
    opacity: "0.2",
    fontSize: "0.65em",
    fontWeight: "normal",
    verticalAlign: "super",
    letterSpacing: "0",
  },

  // Inline emphasis
  ".cm-ns-bold": { fontWeight: "700" },
  ".cm-ns-italic": { fontStyle: "italic" },
  ".cm-ns-code": {
    fontFamily: "var(--ns-font-mono)",
    color: "var(--ns-syn-code)",
    background: "var(--ns-muted)",
    borderRadius: "3px",
    padding: "0 3px",
  },

  // Wiki-links [[note]]
  ".cm-ns-wikilink": {
    color: "var(--ns-syn-wiki-link)",
    textDecoration: "underline",
    cursor: "pointer",
    borderRadius: "2px",
  },
  ".cm-ns-wikilink:hover": {
    opacity: "0.8",
  },

  // Inline #tags
  ".cm-ns-tag": {
    color: "var(--ns-syn-tag)",
    fontWeight: "500",
  },

  // Horizontal rule
  ".cm-ns-hr": {
    color: "var(--ns-border)",
    display: "block",
    textAlign: "center",
  },
});

/**
 * Dynamic theme that applies the active color scheme.
 * Re-created when settings change (fontSize, lineHeight, fontFamily).
 */
export function buildEditorTheme(
  fontSize: number,
  lineHeight: number
): Extension {
  return EditorView.theme({
    "&": {
      background: "var(--ns-editor-bg)",
      color: "var(--ns-editor-fg)",
      fontSize: `${fontSize}px`,
      lineHeight: String(lineHeight),
      fontFamily: "var(--ns-font-mono)",
      height: "100%",
    },
    ".cm-content": {
      padding: "20px 32px",
      caretColor: "var(--ns-accent)",
      maxWidth: "780px",
      margin: "0 auto",
    },
    ".cm-focused .cm-cursor": {
      borderLeftColor: "var(--ns-accent)",
    },
    ".cm-selectionBackground, ::selection": {
      background: "var(--ns-selection) !important",
    },
    ".cm-activeLine": {
      background: "var(--ns-line-highlight)",
    },
    ".cm-gutters": {
      display: "none",
    },
    ".cm-scroller": {
      overflow: "auto",
      height: "100%",
    },
    // Markdown syntax colors via CM6 highlight
    ".cm-header": { color: "var(--ns-syn-heading)", fontWeight: "bold" },
    ".cm-keyword": { color: "var(--ns-syn-keyword)" },
    ".cm-string": { color: "var(--ns-syn-string)" },
    ".cm-comment": { color: "var(--ns-syn-comment)", fontStyle: "italic" },
    ".cm-link": { color: "var(--ns-syn-link)" },
    ".cm-url": { color: "var(--ns-syn-link)", textDecoration: "underline" },
  });
}
