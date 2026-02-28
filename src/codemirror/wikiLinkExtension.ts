import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { RangeSetBuilder, Extension } from "@codemirror/state";

const WIKI_LINK_RE = /\[\[([^\]|#\n]+?)(?:[|#][^\]]*?)?\]\]/g;

function buildWikiLinkDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  const doc = view.state.doc;

  for (const { from, to } of view.visibleRanges) {
    const text = doc.sliceString(from, to);
    WIKI_LINK_RE.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = WIKI_LINK_RE.exec(text)) !== null) {
      const matchFrom = from + match.index;
      const matchTo = matchFrom + match[0].length;
      const linkTarget = match[1].trim();

      builder.add(
        matchFrom,
        matchTo,
        Decoration.mark({
          class: "cm-ns-wikilink",
          attributes: { "data-wikilink": linkTarget },
        })
      );
    }
  }

  return builder.finish();
}

export function wikiLinkExtension(
  onNavigate: (target: string) => void
): Extension[] {
  const plugin = ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = buildWikiLinkDecorations(view);
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
          this.decorations = buildWikiLinkDecorations(update.view);
        }
      }
    },
    { decorations: (v) => v.decorations }
  );

  const clickHandler = EditorView.domEventHandlers({
    click(event, _view) {
      const target = event.target as HTMLElement;
      const el = target.closest("[data-wikilink]") as HTMLElement | null;
      if (!el) return false;

      const linkTarget = el.dataset["wikilink"];
      if (linkTarget) {
        event.preventDefault();
        onNavigate(linkTarget);
        return true;
      }
      return false;
    },
  });

  return [plugin, clickHandler];
}
