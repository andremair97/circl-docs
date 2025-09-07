# Changelog fragments

- Never edit `CHANGELOG.md` directly.
- For each PR, add a fragment under `changelog.d/` summarising the change in one or two lines.
- Name fragments descriptively, e.g. `add-off-connector.md`.
- If no entry is needed, label the PR `no-changelog`.
- During release, fragments are compiled into `CHANGELOG.md` and then removed.
