export interface NoteStashTheme {
  id: string;
  name: string;
  type: "dark" | "light";
  colors: {
    background: string;
    foreground: string;
    sidebarBackground: string;
    sidebarForeground: string;
    editorBackground: string;
    editorForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    muted: string;
    mutedForeground: string;
    tabActive: string;
    tabHover: string;
    selection: string;
    lineHighlight: string;
  };
  syntax: {
    keyword: string;
    string: string;
    comment: string;
    heading: string;
    link: string;
    code: string;
    bold: string;
    italic: string;
    tag: string;
    wikiLink: string;
  };
}

// ── Dark themes ────────────────────────────────────────────────

export const tokyoNight: NoteStashTheme = {
  id: "tokyo-night",
  name: "Tokyo Night",
  type: "dark",
  colors: {
    background: "#1a1b2e",
    foreground: "#c0caf5",
    sidebarBackground: "#16161e",
    sidebarForeground: "#a9b1d6",
    editorBackground: "#1a1b2e",
    editorForeground: "#c0caf5",
    accent: "#7aa2f7",
    accentForeground: "#1a1b2e",
    border: "#292e42",
    muted: "#292e42",
    mutedForeground: "#565f89",
    tabActive: "#1a1b2e",
    tabHover: "#1e2030",
    selection: "#2d3f76",
    lineHighlight: "#1e2030",
  },
  syntax: {
    keyword: "#bb9af7",
    string: "#9ece6a",
    comment: "#565f89",
    heading: "#7aa2f7",
    link: "#73daca",
    code: "#b4f9f8",
    bold: "#c0caf5",
    italic: "#e0af68",
    tag: "#f7768e",
    wikiLink: "#7dcfff",
  },
};

export const catppuccinMocha: NoteStashTheme = {
  id: "catppuccin-mocha",
  name: "Catppuccin Mocha",
  type: "dark",
  colors: {
    background: "#1e1e2e",
    foreground: "#cdd6f4",
    sidebarBackground: "#181825",
    sidebarForeground: "#bac2de",
    editorBackground: "#1e1e2e",
    editorForeground: "#cdd6f4",
    accent: "#89b4fa",
    accentForeground: "#1e1e2e",
    border: "#313244",
    muted: "#313244",
    mutedForeground: "#6c7086",
    tabActive: "#1e1e2e",
    tabHover: "#24273a",
    selection: "#45475a",
    lineHighlight: "#24273a",
  },
  syntax: {
    keyword: "#cba6f7",
    string: "#a6e3a1",
    comment: "#6c7086",
    heading: "#89b4fa",
    link: "#94e2d5",
    code: "#f38ba8",
    bold: "#cdd6f4",
    italic: "#fab387",
    tag: "#f38ba8",
    wikiLink: "#89dceb",
  },
};

export const githubDark: NoteStashTheme = {
  id: "github-dark",
  name: "GitHub Dark",
  type: "dark",
  colors: {
    background: "#0d1117",
    foreground: "#e6edf3",
    sidebarBackground: "#010409",
    sidebarForeground: "#c9d1d9",
    editorBackground: "#0d1117",
    editorForeground: "#e6edf3",
    accent: "#58a6ff",
    accentForeground: "#0d1117",
    border: "#30363d",
    muted: "#21262d",
    mutedForeground: "#8b949e",
    tabActive: "#0d1117",
    tabHover: "#161b22",
    selection: "#264f78",
    lineHighlight: "#161b22",
  },
  syntax: {
    keyword: "#ff7b72",
    string: "#a5d6ff",
    comment: "#8b949e",
    heading: "#58a6ff",
    link: "#79c0ff",
    code: "#f85149",
    bold: "#e6edf3",
    italic: "#ffa657",
    tag: "#7ee787",
    wikiLink: "#79c0ff",
  },
};

export const nord: NoteStashTheme = {
  id: "nord",
  name: "Nord",
  type: "dark",
  colors: {
    background: "#2e3440",
    foreground: "#eceff4",
    sidebarBackground: "#272c36",
    sidebarForeground: "#d8dee9",
    editorBackground: "#2e3440",
    editorForeground: "#eceff4",
    accent: "#88c0d0",
    accentForeground: "#2e3440",
    border: "#3b4252",
    muted: "#3b4252",
    mutedForeground: "#616e88",
    tabActive: "#2e3440",
    tabHover: "#3b4252",
    selection: "#434c5e",
    lineHighlight: "#3b4252",
  },
  syntax: {
    keyword: "#81a1c1",
    string: "#a3be8c",
    comment: "#616e88",
    heading: "#88c0d0",
    link: "#8fbcbb",
    code: "#bf616a",
    bold: "#eceff4",
    italic: "#ebcb8b",
    tag: "#b48ead",
    wikiLink: "#5e81ac",
  },
};

export const gruvboxDark: NoteStashTheme = {
  id: "gruvbox-dark",
  name: "Gruvbox Dark",
  type: "dark",
  colors: {
    background: "#282828",
    foreground: "#ebdbb2",
    sidebarBackground: "#1d2021",
    sidebarForeground: "#d5c4a1",
    editorBackground: "#282828",
    editorForeground: "#ebdbb2",
    accent: "#d79921",
    accentForeground: "#282828",
    border: "#3c3836",
    muted: "#3c3836",
    mutedForeground: "#665c54",
    tabActive: "#282828",
    tabHover: "#32302f",
    selection: "#504945",
    lineHighlight: "#32302f",
  },
  syntax: {
    keyword: "#fb4934",
    string: "#b8bb26",
    comment: "#928374",
    heading: "#fabd2f",
    link: "#83a598",
    code: "#fe8019",
    bold: "#ebdbb2",
    italic: "#d3869b",
    tag: "#8ec07c",
    wikiLink: "#83a598",
  },
};

// ── Light themes ───────────────────────────────────────────────

export const catppuccinLatte: NoteStashTheme = {
  id: "catppuccin-latte",
  name: "Catppuccin Latte",
  type: "light",
  colors: {
    background: "#eff1f5",
    foreground: "#4c4f69",
    sidebarBackground: "#e6e9ef",
    sidebarForeground: "#5c5f77",
    editorBackground: "#eff1f5",
    editorForeground: "#4c4f69",
    accent: "#1e66f5",
    accentForeground: "#eff1f5",
    border: "#ccd0da",
    muted: "#dce0e8",
    mutedForeground: "#9ca0b0",
    tabActive: "#eff1f5",
    tabHover: "#e6e9ef",
    selection: "#acb0be",
    lineHighlight: "#e6e9ef",
  },
  syntax: {
    keyword: "#8839ef",
    string: "#40a02b",
    comment: "#9ca0b0",
    heading: "#1e66f5",
    link: "#179299",
    code: "#e64553",
    bold: "#4c4f69",
    italic: "#fe640b",
    tag: "#e64553",
    wikiLink: "#04a5e5",
  },
};

export const githubLight: NoteStashTheme = {
  id: "github-light",
  name: "GitHub Light",
  type: "light",
  colors: {
    background: "#ffffff",
    foreground: "#24292f",
    sidebarBackground: "#f6f8fa",
    sidebarForeground: "#24292f",
    editorBackground: "#ffffff",
    editorForeground: "#24292f",
    accent: "#0969da",
    accentForeground: "#ffffff",
    border: "#d0d7de",
    muted: "#f6f8fa",
    mutedForeground: "#57606a",
    tabActive: "#ffffff",
    tabHover: "#f6f8fa",
    selection: "#b6d4f8",
    lineHighlight: "#f6f8fa",
  },
  syntax: {
    keyword: "#cf222e",
    string: "#0a3069",
    comment: "#57606a",
    heading: "#0969da",
    link: "#0969da",
    code: "#953800",
    bold: "#24292f",
    italic: "#8250df",
    tag: "#116329",
    wikiLink: "#0969da",
  },
};

export const gruvboxLight: NoteStashTheme = {
  id: "gruvbox-light",
  name: "Gruvbox Light",
  type: "light",
  colors: {
    background: "#fbf1c7",
    foreground: "#3c3836",
    sidebarBackground: "#f2e5bc",
    sidebarForeground: "#504945",
    editorBackground: "#fbf1c7",
    editorForeground: "#3c3836",
    accent: "#b57614",
    accentForeground: "#fbf1c7",
    border: "#d5c4a1",
    muted: "#ebdbb2",
    mutedForeground: "#a89984",
    tabActive: "#fbf1c7",
    tabHover: "#f2e5bc",
    selection: "#d5c4a1",
    lineHighlight: "#f2e5bc",
  },
  syntax: {
    keyword: "#9d0006",
    string: "#79740e",
    comment: "#a89984",
    heading: "#b57614",
    link: "#076678",
    code: "#af3a03",
    bold: "#3c3836",
    italic: "#8f3f71",
    tag: "#427b58",
    wikiLink: "#076678",
  },
};

// ── Theme registry ─────────────────────────────────────────────

export const THEMES: NoteStashTheme[] = [
  tokyoNight,
  catppuccinMocha,
  githubDark,
  nord,
  gruvboxDark,
  catppuccinLatte,
  githubLight,
  gruvboxLight,
];

export const THEME_MAP: Record<string, NoteStashTheme> = Object.fromEntries(
  THEMES.map((t) => [t.id, t])
);

export function getTheme(id: string): NoteStashTheme {
  return THEME_MAP[id] ?? tokyoNight;
}

/** Apply a theme by setting CSS custom properties on :root */
export function applyTheme(theme: NoteStashTheme): void {
  const root = document.documentElement;
  const { colors, syntax } = theme;

  root.setAttribute("data-theme", theme.id);
  root.setAttribute("data-theme-type", theme.type);

  // Color tokens
  root.style.setProperty("--ns-bg", colors.background);
  root.style.setProperty("--ns-fg", colors.foreground);
  root.style.setProperty("--ns-sidebar-bg", colors.sidebarBackground);
  root.style.setProperty("--ns-sidebar-fg", colors.sidebarForeground);
  root.style.setProperty("--ns-editor-bg", colors.editorBackground);
  root.style.setProperty("--ns-editor-fg", colors.editorForeground);
  root.style.setProperty("--ns-accent", colors.accent);
  root.style.setProperty("--ns-accent-fg", colors.accentForeground);
  root.style.setProperty("--ns-border", colors.border);
  root.style.setProperty("--ns-muted", colors.muted);
  root.style.setProperty("--ns-muted-fg", colors.mutedForeground);
  root.style.setProperty("--ns-tab-active", colors.tabActive);
  root.style.setProperty("--ns-tab-hover", colors.tabHover);
  root.style.setProperty("--ns-selection", colors.selection);
  root.style.setProperty("--ns-line-highlight", colors.lineHighlight);

  // Syntax tokens
  root.style.setProperty("--ns-syn-keyword", syntax.keyword);
  root.style.setProperty("--ns-syn-string", syntax.string);
  root.style.setProperty("--ns-syn-comment", syntax.comment);
  root.style.setProperty("--ns-syn-heading", syntax.heading);
  root.style.setProperty("--ns-syn-link", syntax.link);
  root.style.setProperty("--ns-syn-code", syntax.code);
  root.style.setProperty("--ns-syn-bold", syntax.bold);
  root.style.setProperty("--ns-syn-italic", syntax.italic);
  root.style.setProperty("--ns-syn-tag", syntax.tag);
  root.style.setProperty("--ns-syn-wiki-link", syntax.wikiLink);
}
