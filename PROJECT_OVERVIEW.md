# PROJECT_OVERVIEW.md

> Single source of truth for humans & AIs (Codex/Cursor/ChatGPT) to reload the project’s purpose, scope, architecture, and current state. Keep this file high‑signal and evergreen.

---

## 1) Project Name & Purpose
**Circl — Sustainability Discovery & Transparency**

We’re building a sustainability-first discovery layer that helps people make better choices before buying new. The app aggregates product and service data, then deliberately nudges toward:
- **Borrow** (tool libraries, rental services, Library of Things)
- **Repair** (local repair shops, mail‑in repair services, DIY guides via iFixit/YouTube/open content)
- **Buy used** (Facebook Marketplace, eBay, Vinted, Gumtree)
- **Buy new (transparent)** with **eco‑info** (durability, repairability, materials, warranty/parts availability) and **local** provenance when possible.

**Key principle:** *Deliberate Friction* — we intentionally make the more sustainable options prominent (borrow/repair/local) before “add‑to‑cart”.

---

## 2) What Success Looks Like
- Users find **viable non‑new** options first (borrow/repair/used) with clear steps.
- When buying new is necessary, users see **transparent eco‑info** and can choose **high‑durability/repairable** products.
- Modular connectors allow us to plug in new datasets quickly and consistently.
- The system is explainable: sources and scoring are visible and auditable.

---

## 3) Current Scope & Core Features
- **Unified Search:** query across multiple connectors (Amazon categories, Open Food Facts (OFF), eBay/Vinted/Marketplace stubs, repair/borrow directories).
- **Result Buckets:** **Borrow / Repair / Used / New (transparent)** buckets in the UI.
- **Eco‑Info Enrichment:** durability indicators (warranty length, parts availability), repairability (spare parts + guides), material signals.
- **Localisation:** plug user’s location to surface nearby options.
- **No payment processing:** we link out to trusted sources; we don’t host checkout.

---

## 4) Architecture (high‑level)
- **Connectors layer** (data ingestion/normalisation) → **Schemas** (OpenAPI + JSON Schemas) → **Enrichment** (scoring, provenance) → **UI** (category views, buckets, filters).
- **Docs‑as‑code** via MkDocs including PRD/roadmap/specs and ingestion playbooks.
- **CI** with GitHub Actions for docs build, linting, and connector checks.

**Relevant folders (as of repo state):**
- `.github/workflows/` — CI pipelines
- `docs/` — MkDocs docs site (product vision, PRD, roadmap, etc.)
- `examples/off/` — OFF connector examples
- `openapi/` — OpenAPI 3.1 contracts
- `overlays/` & `overrides/` — docs/site theming
- `registry/` — connector registry
- `schemas/universal/` — shared JSON Schemas
- `scripts/` — utilities
- `src/` — source code
- `tests/` — tests
- `tools/` — tooling helpers
- `ui/` — UI pieces

> See `README.md` for quickstart; MkDocs build options are documented in‑repo.

---

## 5) Data Contracts & Standards
- **OpenAPI 3.1** for service contracts.
- **JSON Schemas** for connector payloads.
- **Provenance**: each field should be traceable back to source with timestamps.
- **Taxonomy mapping**: align disparate source categories to a canonical set (Amazon categories as a spine to start; can evolve to GS1/UNSPSC if helpful).

---

## 6) Connectors (status)
- **Open Food Facts (OFF):** initial connector + example payloads; next step is UI rendering and enrichment hooks.
- **Amazon categories:** taxonomy harvesting + mapping groundwork for cross‑catalog discovery.
- **Planned next:** eBay, Vinted, Facebook Marketplace; Library of Things directories; local repair databases; iFixit/YouTube guide indexers.

**Connector principles:**
- Deterministic, idempotent fetch/transform.
- Built‑in rate‑limit & error handling.
- Output conforms to `schemas/universal/*` with provenance.

---

## 7) Enrichment & Scoring (initial framework)
- **Durability signals:** warranty term (≥10 yrs, lifetime repair policies), materials (solid wood, stainless), brand spare‑parts programs.
- **Repairability signals:** official parts store, published guides, third‑party repair ecosystem.
- **Locality signals:** distance, local maker/retailer, community libraries.
- **Transparency:** show the factors and links; no black boxes.

---

## 8) UI Principles
- Four‑bucket layout: **Borrow / Repair / Used / New (transparent)**
- Minimalist, fast, accessible. Clear source links. Explain scoring.
- Friction toward sustainable choices (default sorting: non‑new first).

---

## 9) CI/CD & Dev Tooling
- **MkDocs** for docs; build with/without committers token.
- **Actions**: build/lint/test; workflows under `.github/workflows/`.
- **Guardrails:** PRs should update `PROJECT_CHANGELOG.md`; scope changes may also update this overview.

---

## 10) Roadmap (rolling)
**Near‑term (Now → Next):**
- Finalise OFF connector UI rendering + enrichment.
- Add Amazon category mapping into the search pipeline.
- Introduce Borrow/Repair directories (initial seed sources).
- CI guard: require changelog update on PRs.

**Mid‑term:**
- Marketplace connectors (eBay/Vinted/FBM) with dedupe.
- Scoring v1 for durability/repairability/locality.
- Per‑source quality metrics and fallback logic.

**Long‑term:**
- Community data contributions (repair notes/photos).
- Reputation signals for repairers/libraries.
- Internationalisation; region‑specific datasets.

---

## 11) How to contribute (humans & AIs)
- Open a branch. Make changes.
- **Update `PROJECT_CHANGELOG.md`** (What changed? Why? Where?).
- If scope/vision shifts, **refresh this file**.
- Open PR; let CI run; include links to data sources.

---

## 12) Contacts & Ownership
- Product/Eng owner: @andremair97 (GitHub).
- AI agents: Codex/Cursor/ChatGPT — read this file and the changelog on every run.


---

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

