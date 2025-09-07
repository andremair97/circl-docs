# Project Changelog

> Lightweight running history to keep humans and AIs aligned. Append entries
> under **Unreleased** during development; move them to a dated section on
> merge.

## Unreleased

- Start here for your current branch. On merge, move bullets under today’s
  date.
- infra: scaffold pnpm monorepo with Next.js web, Expo mobile, shared packages, and CI; follow-up: flesh out features
- ci: switch workflows to pnpm to leverage lockfile caching and prevent setup-node failures; files: .github/workflows/ci.yml, .github/workflows/docs.yml; follow-up: tighten cache paths
- ui: rename Tamagui provider entry to .tsx so TypeScript compiles JSX; files: packages/ui/index.tsx, packages/ui/package.json, packages/ui/tsconfig.json; follow-up: add component tests
- web: alias react-native to react-native-web and simplify shared UI to React Native primitives; files: apps/web/next.config.mjs, apps/web/tsconfig.json, packages/ui/\*; follow-up: audit Next ESLint plugin
- ci: ignore pnpm lockfile and fix require-changelog workflow so YAML lint passes; files: .yamllint.yaml, .github/workflows/require-changelog.yml; follow-up: monitor YAML lint
- ci: path-scoped jobs, caches, codeowners

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
```
