# Contributing

## Required checks per path
- Changes in `schemas/**` or `openapi/**` run **contracts**.
- Changes in `ui/**` run **web** build and tests.
- Changes in `examples/**`, `src/connectors/**` or `tests/connectors/**` run **connectors** pytest.
- Changes in `docs/**` or `mkdocs.yml` run **docs** mkdocs build.

## Merge queue & auto-merge
Use GitHub's merge queue. Enable auto-merge after all required checks and reviews pass so branches land sequentially without manual intervention.

## git worktree for parallel branches
Use `git worktree add ../<dir> <branch>` to work on multiple branches simultaneously without switching checkouts.
