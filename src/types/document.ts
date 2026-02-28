export enum DocumentType {
  Markdown = "markdown",
  Code = "code",       // post-MVP: IDE mode
  Notebook = "notebook", // post-MVP: Jupyter
  Unknown = "unknown",
}

export function documentTypeFromExtension(ext: string): DocumentType {
  switch (ext.toLowerCase()) {
    case "md":
    case "markdown":
      return DocumentType.Markdown;
    case "py":
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
    case "rs":
    case "go":
    case "java":
    case "cpp":
    case "c":
    case "h":
    case "css":
    case "html":
    case "json":
    case "yaml":
    case "yml":
    case "toml":
    case "sh":
      return DocumentType.Code;
    case "ipynb":
      return DocumentType.Notebook;
    default:
      return DocumentType.Unknown;
  }
}
