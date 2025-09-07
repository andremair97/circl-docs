# Changelog fragments

Each pull request should include a short fragment in `changelog.d/` instead of editing `CHANGELOG.md` directly. This avoids merge conflicts and keeps the history clear.

## How to add a fragment

1. Create a new file in `changelog.d/` named like `123-short-title.md`.
2. Add a brief bullet describing the change, for example:
   - `feat: add recycling connector (#123)`
3. Commit the file with the rest of your changes.
4. For docs-only or CI-only updates, apply the `no-changelog` label instead of adding a fragment.

CI checks fail if `CHANGELOG.md` is edited directly or a fragment is missing. During releases, `scripts/compile_changelog.py` stitches these fragments into the main `CHANGELOG.md` and clears the directory.
