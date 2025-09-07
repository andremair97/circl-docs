# Project Overview

> Single source of truth for humans and AIs (Codex, Cursor, ChatGPT) to reload
> the project’s purpose, scope, architecture, and current state. Keep this file
> high-signal and evergreen.

## 1) Project Name and Purpose

**Circl — Sustainability Discovery and Transparency**

We are building a sustainability-first discovery layer that helps people make
better choices before buying new. The app aggregates product and service data,
then deliberately nudges toward these options in order:

- **Borrow** (tool libraries, rentals, Library of Things)
- **Repair** (local repair shops, mail-in repair services, DIY guides via
  iFixit, YouTube, and open content)
- **Buy used** (Facebook Marketplace, eBay, Vinted, Gumtree)
- **Buy new (transparent)** with eco-info (durability, repairability, materials,
  warranty and parts availability) and local provenance when possible

**Key principle:** *Deliberate Friction* — we intentionally make the more
sustainable options prominent (borrow, repair, local) before “buy new”.

## 2) What Success Looks Like

- Users find viable non-new options first (borrow, repair, used) with clear
  steps.
- When buying new is necessary, users see transparent eco-info and can choose
  high-durability and repairable products.
- Modular connectors allow us to plug in new datasets quickly and consistently.
- The system is explainable: sources and scoring are visible and auditable.

## 3) Current Scope and Core Features

- **Unified Search:** query across multiple connectors (Amazon categories,
  Open Food Facts, eBay or Vinted or Marketplace stubs, repair and borrow
  directories).

- **Result Buckets:** **Borrow**, **Repair**, **Used**, **New (transparent)**
  buckets in the UI.

- **Eco-Info Enrichment:** durability indicators (warranty length, parts
  availability), repairability (spare parts and guides), material signals.

- **Localisation:** use the user’s location to surface nearby options.

- **No payments:** link out to trusted sources; we do not host checkout.

## 4) Architecture (High Level)

- **Connectors layer** (data ingestion and normalisation) →
  **Schemas** (OpenAPI and JSON Schemas) →
  **Enrichment** (scoring, provenance) →
  **UI** (category views, buckets, filters).

- **Docs-as-code** via MkDocs including PRD, roadmap, specs, and ingestion
  playbooks.

- **CI** with GitHub Actions for docs build, linting, and connector checks.

**Relevant folders (representative):**

- `.github/workflows/` — CI pipelines
- `docs/` — MkDocs docs site
- `examples/off/` — OFF connector examples
- `openapi/` — OpenAPI 3.1 contracts
- `overlays/` and `overrides/` — docs and site theming
- `registry/` — connector registry
- `schemas/universal/` — shared JSON Schemas
- `scripts/` — utilities
- `src/` — source code
- `tests/` — tests
- `tools/` — tooling helpers
- `ui/` — UI pieces

See `README.md` for quickstart. MkDocs build options are documented in-repo.

## 5) Data Contracts and Standards

- **OpenAPI 3.1** for service contracts.
- **JSON Schemas** for connector payloads.
- **Provenance:** each field should be traceable to a source with timestamps.
- **Taxonomy mapping:** map disparate source categories to a canonical set
  (Amazon categories as an initial spine; can evolve to GS1 or UNSPSC).

## 6) Connectors (Status)

- **Open Food Facts (OFF):** initial connector and example payloads; next step
  is UI rendering and enrichment hooks.

- **Amazon categories:** taxonomy harvesting and mapping groundwork for
  cross-catalog discovery.

- **Planned next:** eBay, Vinted, Facebook Marketplace, Library of Things
  directories, local repair databases, iFixit and YouTube guide indexers.

**Connector principles:**

- Deterministic, idempotent fetch and transform.
- Built-in rate-limit and error handling.
- Output conforms to `schemas/universal/*` with provenance.

## 7) Enrichment and Scoring (Initial Framework)

- **Durability signals:** warranty term (10+ years, lifetime repair policies),
  materials (solid wood, stainless), spare-parts programs.

- **Repairability signals:** official parts store, published guides, third-party
  repair ecosystem.

- **Locality signals:** distance, local maker or retailer, community libraries.

- **Transparency:** show the factors and links; avoid black boxes.

## 8) UI Principles

- Four-bucket layout: **Borrow**, **Repair**, **Used**, **New (transparent)**.
- Minimalist, fast, accessible. Clear source links. Explain scoring.
- Introduce friction that favours sustainable choices by default.

## 9) CI and Dev Tooling

- **MkDocs** for docs; build with or without committers token.
- **Actions:** build, lint, and test; workflows under `.github/workflows/`.
- **Guardrails:** PRs should update `PROJECT_CHANGELOG.md`. Scope changes may
  also update this overview.

## 10) Roadmap (Rolling)

**Near term (Now → Next):**

- Finalise OFF connector UI rendering and enrichment.
- Add Amazon category mapping into the search pipeline.
- Introduce Borrow and Repair directories (initial seed sources).
- CI guard: require changelog update on PRs.

**Mid term:**

- Marketplace connectors (eBay, Vinted, Facebook Marketplace) with dedupe.
- Scoring v1 for durability, repairability, and locality.
- Per-source quality metrics and fallback logic.

**Long term:**

- Community data contributions (repair notes and photos).
- Reputation signals for repairers and libraries.
- Internationalisation and region-specific datasets.

## 11) How to Contribute (Humans and AIs)

- Open a branch and make changes.

- Update `PROJECT_CHANGELOG.md` (what changed, why, where).

- If scope or vision shifts, refresh this file.

- Open a PR, let CI run, and include links to data sources.

## 12) Contacts and Ownership

- Product and Engineering owner: `@andremair97` (GitHub).
- AI agents: Codex, Cursor, and ChatGPT — read this file and the changelog on
  every run.
