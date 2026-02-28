import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { noteBaseTheme, buildEditorTheme } from "./noteTheme";
import { livePreviewPlugin } from "./livePreviewExtension";
import { wikiLinkExtension } from "./wikiLinkExtension";

export { noteBaseTheme, buildEditorTheme };
export { livePreviewPlugin };
export { wikiLinkExtension };

/** Always-on extensions that don't depend on mode or settings */
export const baseExtensions: Extension[] = [
  markdown({ base: markdownLanguage, codeLanguages: languages }),
  EditorView.lineWrapping,
  noteBaseTheme,
];

/** Extensions active in "live-preview" mode */
export function livePreviewExtensions(
  onWikiLinkNavigate: (target: string) => void
): Extension[] {
  return [livePreviewPlugin, ...wikiLinkExtension(onWikiLinkNavigate)];
}

/** Extensions active in "source" mode (wiki-links still clickable) */
export function sourceExtensions(
  onWikiLinkNavigate: (target: string) => void
): Extension[] {
  return wikiLinkExtension(onWikiLinkNavigate);
}
