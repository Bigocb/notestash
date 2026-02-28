import { useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";
import { useEditor, useSettings } from "@/store";
import { EditorTab } from "@/types/editor";
import { debounce } from "@/lib/utils";

interface Props {
  tab: EditorTab;
}

const baseExtensions = [
  markdown({ base: markdownLanguage, codeLanguages: languages }),
  EditorView.lineWrapping,
];

export default function MarkdownEditor({ tab }: Props) {
  const { updateTabContent, saveTab } = useEditor();
  const { fontSize, lineHeight, spellcheck, autosaveDelay } = useSettings();


  // Debounced auto-save
  const debouncedSave = useCallback(
    debounce((tabId: string) => {
      if (autosaveDelay > 0) saveTab(tabId);
    }, autosaveDelay),
    [autosaveDelay, saveTab]
  );

  const handleChange = useCallback(
    (value: string) => {
      updateTabContent(tab.id, value);
      debouncedSave(tab.id);
    },
    [tab.id, updateTabContent, debouncedSave]
  );

  const editorTheme = EditorView.theme({
    "&": {
      background: "var(--ns-editor-bg)",
      color: "var(--ns-editor-fg)",
      fontSize: `${fontSize}px`,
      lineHeight: String(lineHeight),
      fontFamily: "var(--ns-font-mono)",
      height: "100%",
    },
    ".cm-content": {
      padding: "16px 24px",
      caretColor: "var(--ns-accent)",
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
  });

  return (
    <CodeMirror
      value={tab.content}
      onChange={handleChange}
      extensions={[...baseExtensions, editorTheme]}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        searchKeymap: true,
        history: true,
        closeBrackets: true,
      }}
      spellCheck={spellcheck}
      height="100%"
      style={{ height: "100%", overflow: "hidden" }}
    />
  );
}
