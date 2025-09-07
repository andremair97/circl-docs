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

### Developer commands

Common tasks are wrapped as make targets:

```bash
make ui-install   # install UI dependencies
make ui-build     # build the UI
make docs-serve   # serve docs locally
make docs-build   # build docs in strict mode
make help         # list all targets
```

### Docs build with/without committers

- With token (recommended):
  `export MKDOCS_GIT_COMMITTERS_APIKEY=<gh PAT or GITHUB_TOKEN>`
  then `mkdocs build`
- Without token (forks/offline):
  `mkdocs build -f mkdocs.nocommitters.yml`

### Changelog
Each PR must either:

1. Add `/changelog.d/<short-title>.md` with a one-line summary, or
2. Apply the `no-changelog` label for docs/CI-only changes.

The release workflow compiles fragments into `CHANGELOG.md` and clears the directory.
