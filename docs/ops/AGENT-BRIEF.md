# Circl – Agent Brief

Coding + contribution rules for AI agents and humans.

## Tech Rules
- Language: **TypeScript** (Node.js / Next.js).
- Schemas: **JSON Schema 2020-12**.
- API: **OpenAPI 3.1**.

## Git & PR
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/).
- **PRs:** small, tested, with linked issue/task.
- **Tests:** add/extend unit tests; must pass CI.

## File Placement
- Schemas → `/schemas/`
- API specs → `/apis/`
- Ops/Process docs → `/docs/ops/` and `/docs/process/`

## ADRs
Write an ADR when:
- New data source or ingestion method.
- Change to core schema or scoring logic.
- Major dependency / architecture decision.

