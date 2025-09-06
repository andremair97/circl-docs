#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> Latest commit"
git log -1 --pretty=fuller

echo
echo "==> Repo structure (top 3 levels, ignoring junk)"
tree -L 3 -I 'node_modules|.venv|__pycache__|.git|.mypy_cache|.pytest_cache|site|dist|build'

echo
echo "==> MkDocs config (first 40 lines)"
head -n 40 mkdocs.yml || echo "No mkdocs.yml found"

echo
echo "==> Recent diffs (last 5 commits)"
git diff --stat HEAD~5 HEAD || true
