import { useCallback, useMemo } from "react";
import CodeMirror, { Statistics } from "@uiw/react-codemirror";
import { useEditor, useSettings, useVault } from "@/store";
import { EditorTab } from "@/types/editor";
import { debounce } from "@/lib/utils";
import { resolveWikiLink } from "@/lib/wikilinks";
import {
  baseExtensions,
  livePreviewExtensions,
  sourceExtensions,
  buildEditorTheme,
} from "@/codemirror";

interface Props {
  tab: EditorTab;
}

export default function MarkdownEditor({ tab }: Props) {
  const { updateTabContent, saveTab, updateTabCursor, openTab } = useEditor();
  const { flatFiles, vaultPath } = useVault();
  const { fontSize, lineHeight, spellcheck, autosaveDelay } = useSettings();

  // Wiki-link navigation — resolve [[target]] → open file in a tab
  const handleWikiLinkNavigate = useCallback(
    (target: string) => {
      const resolved = resolveWikiLink(target, flatFiles, vaultPath);
      if (resolved) {
        openTab(resolved, target);
      }
    },
    [flatFiles, vaultPath, openTab]
  );

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

  // Report cursor position to StatusBar
  const handleStatistics = useCallback(
    (stats: Statistics) => {
      const col = stats.selection.main.head - stats.line.from;
      updateTabCursor(tab.id, stats.line.number - 1, col);
    },
    [tab.id, updateTabCursor]
  );

  // Build extensions based on current mode
  const modeExtensions = useMemo(() => {
    if (tab.mode === "live-preview") {
      return livePreviewExtensions(handleWikiLinkNavigate);
    }
    return sourceExtensions(handleWikiLinkNavigate);
  }, [tab.mode, handleWikiLinkNavigate]);

  const editorTheme = useMemo(
    () => buildEditorTheme(fontSize, lineHeight),
    [fontSize, lineHeight]
  );

  const extensions = useMemo(
    () => [...baseExtensions, ...modeExtensions, editorTheme],
    [modeExtensions, editorTheme]
  );

  return (
    <CodeMirror
      value={tab.content}
      onChange={handleChange}
      onStatistics={handleStatistics}
      extensions={extensions}
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
