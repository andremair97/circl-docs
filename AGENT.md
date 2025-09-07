# Circl – Agent Guide

- [Agent Brief](docs/ops/AGENT-BRIEF.md)
- [Context Pack](docs/ops/CONTEXT-PACK.md)
- **NEVER** modify `CHANGELOG.md` directly.
  - For every PR add `/changelog.d/<short-title>.md` describing the change in one or two lines.
  - Example filenames: `123-add-repair-connector.md`, `fix-typo.md`.
  - Fragment style: `feat: add repair connector (#123)`.
  - If no entry is needed, apply the `no-changelog` label.
