# Circl – Planning & Specs

Docs-as-code for the Circl project:

- Product vision, PRD, roadmap
- Data standards, provenance, taxonomy mapping
- OpenAPI 3.1 contracts + JSON Schemas
- ADRs (Architectural Decision Records)
- Ingestion playbooks

## Local dev

```bash
source .venv/bin/activate
mkdocs serve
```

### Docs build with/without committers

- With token (recommended):
  `export MKDOCS_GIT_COMMITTERS_APIKEY=<gh PAT or GITHUB_TOKEN>`
  then `mkdocs build`
- Without token (forks/offline):
  `mkdocs build -f mkdocs.nocommitters.yml`

## Changelog

- Do not edit `CHANGELOG.md` directly.
- For each PR, add a fragment under `changelog.d/` summarizing the change in one or two lines using Conventional Commit style (e.g., `changelog.d/add-off-connector.md`).
- If no entry is needed, label the PR `no-changelog`.
- During release, fragments are compiled into `CHANGELOG.md` and then cleared.
- See [docs/contributing/changelog.md](docs/contributing/changelog.md) for details.
