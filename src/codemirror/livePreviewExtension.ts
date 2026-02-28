import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import type { SyntaxNodeRef } from "@lezer/common";

/**
 * Live Preview extension — Phase 3.
 *
 * On lines that do NOT contain the cursor:
 *  - Heading markers (#, ##, ...) are visually dimmed + superscript
 *  - Heading text is enlarged and colored
 *  - Bold markers (**) are hidden (replaced), bold text gets font-weight
 *  - Italic markers (* and _) are hidden, italic text gets font-style
 *  - Inline code backticks are hidden, code text gets code style
 *
 * On the cursor line everything shows as raw source (CM6's default
 * syntax highlighting still applies).
 */

type DecEntry = { from: number; to: number; dec: Decoration };

function getCursorLines(view: EditorView): Set<number> {
  const lines = new Set<number>();
  for (const r of view.state.selection.ranges) {
    const fromLine = view.state.doc.lineAt(r.from).number;
    const toLine = view.state.doc.lineAt(r.to).number;
    for (let l = fromLine; l <= toLine; l++) lines.add(l);
  }
  return lines;
}

// Heading level → CSS class
const H_CLASSES = [
  "cm-ns-h1",
  "cm-ns-h2",
  "cm-ns-h3",
  "cm-ns-h4",
  "cm-ns-h5",
  "cm-ns-h6",
];

function buildDecorations(view: EditorView): DecorationSet {
  const cursorLines = getCursorLines(view);

  // Collect all decoration entries; we'll sort & deduplicate before building.
  const marks: DecEntry[] = [];
  const replaces: DecEntry[] = [];

  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter(node: SyntaxNodeRef) {
        const lineNum = view.state.doc.lineAt(node.from).number;
        if (cursorLines.has(lineNum)) {
          return false; // skip entire subtree — show raw source on cursor line
        }

        // ── Headings ─────────────────────────────────────────────
        if (/^ATXHeading\d$/.test(node.name)) {
          const level = parseInt(node.name.slice(-1)); // 1-6
          const cls = H_CLASSES[level - 1];
          const headerMark = node.node.firstChild;

          if (headerMark?.name === "HeaderMark") {
            const markTo = headerMark.to;
            const afterMark = view.state.doc.sliceString(markTo, markTo + 1);
            const hideEnd = afterMark === " " ? markTo + 1 : markTo;

            // Dim the "# " mark
            if (node.from < hideEnd) {
              marks.push({
                from: node.from,
                to: hideEnd,
                dec: Decoration.mark({ class: "cm-ns-heading-mark" }),
              });
            }

            // Size/color the heading text
            if (hideEnd < node.to) {
              marks.push({
                from: hideEnd,
                to: node.to,
                dec: Decoration.mark({ class: cls }),
              });
            }
          } else {
            // Fallback: mark the whole line
            marks.push({
              from: node.from,
              to: node.to,
              dec: Decoration.mark({ class: cls }),
            });
          }

          return false; // children handled above
        }

        // ── Bold (StrongEmphasis) ────────────────────────────────
        if (node.name === "StrongEmphasis") {
          marks.push({
            from: node.from,
            to: node.to,
            dec: Decoration.mark({ class: "cm-ns-bold" }),
          });
          // EmphasisMark children will be caught below
        }

        // ── Italic (Emphasis) ────────────────────────────────────
        if (node.name === "Emphasis") {
          marks.push({
            from: node.from,
            to: node.to,
            dec: Decoration.mark({ class: "cm-ns-italic" }),
          });
        }

        // ── Bold/Italic markers (**  *  _) → replace (hide) ─────
        if (node.name === "EmphasisMark") {
          replaces.push({
            from: node.from,
            to: node.to,
            dec: Decoration.replace({}),
          });
        }

        // ── Inline code ──────────────────────────────────────────
        if (node.name === "InlineCode") {
          marks.push({
            from: node.from,
            to: node.to,
            dec: Decoration.mark({ class: "cm-ns-code" }),
          });
        }

        // ── Inline code backtick marks → replace ────────────────
        if (node.name === "CodeMark") {
          replaces.push({
            from: node.from,
            to: node.to,
            dec: Decoration.replace({}),
          });
        }
      },
    });
  }

  // Sort replaces; remove overlapping ones (replace() cannot overlap)
  replaces.sort((a, b) => a.from - b.from || a.to - b.to);
  const safeReplaces: DecEntry[] = [];
  let lastTo = -1;
  for (const r of replaces) {
    if (r.from >= lastTo && r.from < r.to) {
      safeReplaces.push(r);
      lastTo = r.to;
    }
  }

  // Merge marks + replaces, sort all by from then to
  const all: DecEntry[] = [...marks, ...safeReplaces];
  all.sort((a, b) => a.from - b.from || a.to - b.to);

  const builder = new RangeSetBuilder<Decoration>();
  for (const { from, to, dec } of all) {
    if (from < to) {
      try {
        builder.add(from, to, dec);
      } catch {
        // Skip if CM6 rejects the range (e.g. overlapping replaces that slipped through)
      }
    }
  }

  return builder.finish();
}

export const livePreviewPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = buildDecorations(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged || update.selectionSet) {
        this.decorations = buildDecorations(update.view);
      }
    }
  },
  { decorations: (v) => v.decorations }
);
