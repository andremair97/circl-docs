# Changelog fragments

Each pull request should include a short fragment in `changelog.d/` instead of editing `CHANGELOG.md` directly. This avoids merge conflicts.

## How to add a fragment

1. Create a new file in `changelog.d/` named like `123-short-title.md`.
2. Add a brief bullet describing the change, for example:
   - `feat: add recycling connector (#123)`
3. Commit the file with the rest of your changes.

During releases, `scripts/compile_changelog.py` stitches these fragments into the main `CHANGELOG.md`.
