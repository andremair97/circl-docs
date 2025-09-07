# Circl – Agent Guide

- [Agent Brief](docs/ops/AGENT-BRIEF.md)
- [Context Pack](docs/ops/CONTEXT-PACK.md)

## Changelog

 - **Never** modify `CHANGELOG.md` directly.
 - For each PR, add a fragment under `changelog.d/` summarising the change in one or two lines using Conventional Commit style.
 - If no entry is needed, label the PR `no-changelog`.
 - Example fragments:
   - `changelog.d/add-off-connector.md` → `feat: add Open Food Facts connector`
   - `changelog.d/fix-typo.md` → `fix: correct typo in docs`
