
# PROJECT_CHANGELOG.md

> Lightweight running history to keep humans & AIs aligned. Append entries under **Unreleased** during development; move to a dated section on merge.

## Unreleased
- _Start here for your current branch. On merge, move bullets under today’s date._

## 2025‑09‑07
- Seeded **PROJECT_OVERVIEW.md** and **PROJECT_CHANGELOG.md** drafts; added CI guard plan to require changelog updates on PRs.

---

### Changelog entry template
```
- [area]: short description of change; why it matters; primary files touched; any follow‑ups
```
Examples:
```
- connectors/off: add UI render for OFF nutrition & eco‑badges; wires to schemas/universal/off.json; follow‑up: add i18n labels
- ci: fix mkdocs build by installing mermaid2 plugin; add mkdocs.nocommitters.yml path; follow‑up: cache deps
- docs: add PRD page “Deliberate Friction”; add Borrow/Repair buckets to UI spec; follow‑up: screenshots
```


---

# .github/workflows/require-changelog.yml (add this file)

```yaml
name: Require CHANGELOG update

on:
  pull_request:
    types: [opened, synchronize, reopened, edited]

jobs:
  check-changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Ensure PROJECT_CHANGELOG.md modified in this PR
        run: |
          set -euo pipefail
          base="${{ github.event.pull_request.base.sha }}"
          head="${{ github.event.pull_request.head.sha }}"
          if git diff --name-only "$base" "$head" | grep -q '^PROJECT_CHANGELOG.md$'; then
            echo "Changelog updated. ✅"
          else
            echo "ERROR: PROJECT_CHANGELOG.md must be updated in this PR." >&2
            exit 1
          fi
```

> Tip: if you prefer a softer approach, change `exit 1` to a warning and gate merges via branch protection.

---

# .github/pull_request_template.md (optional but recommended)

```md
## Summary

- What’s changing?
- Why?

## Checklist
- [ ] Updated `PROJECT_CHANGELOG.md`
- [ ] Considered whether `PROJECT_OVERVIEW.md` needs an update
- [ ] Linked sources/datasets in code or docs
- [ ] CI is green locally (if applicable)
```

---

# scripts/commit-msg-hook.sh (optional, local dev)

```bash
#!/usr/bin/env bash
# Prevent commits to main without updating the changelog in the same branch (local enforcement)
set -euo pipefail

changed=$(git diff --cached --name-only)
if ! grep -q "^PROJECT_CHANGELOG.md$" <<< "$changed"; then
  echo "WARNING: You haven't staged PROJECT_CHANGELOG.md. Please update it before committing." >&2
fi
```

Install (optional):
```bash
chmod +x scripts/commit-msg-hook.sh
ln -s ../../scripts/commit-msg-hook.sh .git/hooks/pre-commit
```

---

## Contributor guidance for AI agents (paste into your agent prompt)
- Always read `PROJECT_OVERVIEW.md` and `PROJECT_CHANGELOG.md` before starting.
- On any PR:
  1. Summarise changes in `PROJECT_CHANGELOG.md`.
  2. Update `PROJECT_OVERVIEW.md` **only** if the product scope/architecture shifts.
  3. Include links to relevant data sources and schemas you touched.
  4. Ensure MkDocs builds (`mkdocs build` or `-f mkdocs.nocommitters.yml`).
```
export MKDOCS_GIT_COMMITTERS_APIKEY=<token>
mkdocs build
```

---

## Notes tied to the current repo state
- Repo already contains `AGENT.md` and `CONTEXT-PACK.md` for agent context packaging; keep these in sync with this overview & changelog.
- Folders present include `.github/workflows/`, `docs/`, `examples/off/`, `openapi/`, `overlays/`, `overrides/`, `registry/`, `schemas/universal/`, `scripts/`, `src/`, `tests/`, `tools/`, `ui/`. If you add new top‑level areas, reference them here and add schema & provenance notes.

