# Changelog

All notable changes to NoteStash are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.5] – 2026-03-01

### Fixed
- Explicitly configure `tauri-plugin-log` to write to the platform log directory (`notestash.log`) so the file is always created on disk.
- Add `log::info!` / `log::error!` / `log::warn!` calls to every Rust command (vault tree, file listing, note CRUD, file watcher) so useful activity actually appears in the log.
- Log app version on startup.

## [0.1.4] – 2026-03-01

### Fixed
- Add `tauri-plugin-log` so the app writes log files on every run — previously, startup crashes left no diagnostic output anywhere.

## [0.1.1] – 2026-02-28

### Fixed
- Replace invalid `fs:allow-metadata` capability with the correct `fs:allow-stat` in Tauri v2 permissions.
- Replace invalid `fs:allow-create-dir` capability with the correct `fs:allow-mkdir` in Tauri v2 permissions.

## [0.1.0] – 2026-02-28

### Added
- Initial scaffold: Tauri v2 + React + TypeScript project structure.
- Core note reading and writing via Rust backend commands.
- Obsidian-style welcome screen, sidebar with resize handle, inline file/folder creation, and status bar.
- CodeMirror 6 editor with live-preview Markdown rendering and wiki-link extensions.
- `useNote` hook and file-watcher integration for real-time vault sync.
- FlexSearch full-text search, tag filtering, and editor context menu.
- `cmdk` command palette with fuzzy search and keyboard shortcut bindings.
- Draggable split pane and file-watcher search synchronisation.
- GitHub Actions workflows for CI (check on every PR/push to `main`) and cross-platform release builds triggered by version tags.

[Unreleased]: https://github.com/Bigocb/notestash/compare/v0.1.5...HEAD
[0.1.5]: https://github.com/Bigocb/notestash/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/Bigocb/notestash/compare/v0.1.1...v0.1.4
[0.1.1]: https://github.com/Bigocb/notestash/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Bigocb/notestash/releases/tag/v0.1.0
