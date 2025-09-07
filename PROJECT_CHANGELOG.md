# Project Changelog

> Lightweight running history to keep humans and AIs aligned. Append entries
> under **Unreleased** during development; move them to a dated section on
> merge.

## Unreleased

- Start here for your current branch. On merge, move bullets under today’s
  date.

- connectors: enforce schema-safe mapping defaults (string ids, minimal provenance); fix samples & tests; scripts/map.mjs, tests/**, examples/*; follow-up: expand connector coverage
- docs: add connectors section to nav and bundle local mermaid assets; mkdocs.yml, docs/assets/mermaid.esm.min.mjs; follow-up: publish diagrams

## 2025-09-07

- Seeded `PROJECT_OVERVIEW.md` and `PROJECT_CHANGELOG.md`. Added a plan for a
  CI guard that requires changelog updates on PRs.

### Changelog Entry Template
```text
- area: short description of change; why it matters; primary files touched;
  follow-ups
**Examples**
- connectors/off: add UI render for OFF nutrition badges; wires to
  schemas/universal/off.json; follow-up: add i18n labels

- ci: fix mkdocs build by installing mermaid2 plugin; add
  mkdocs.nocommitters.yml; follow-up: cache deps

- docs: add PRD “Deliberate Friction”; add Borrow and Repair buckets to UI
  spec; follow-up: screenshots
