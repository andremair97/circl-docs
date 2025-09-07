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

## Local git setup
Configure git to simplify conflict resolution and to activate repo hooks:

```sh
git config --global rerere.enabled true     # reuse recorded conflict resolutions
git config --global pull.rebase true        # keep history linear
git config --global merge.conflictStyle zdiff3  # show base during merges
git config core.hooksPath .githooks         # enable pre-commit safeguards
```

The top-level `Makefile` is intentionally stable; edit files under `make/*.mk` instead.
