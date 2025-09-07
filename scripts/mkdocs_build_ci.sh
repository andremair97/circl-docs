#!/usr/bin/env bash
set -euo pipefail

# Prefer token from CI secrets if available (GitHub Actions sets this for internal PRs)
TOKEN="${MKDOCS_GIT_COMMITTERS_APIKEY:-${GITHUB_TOKEN:-}}"

if [ -n "${TOKEN}" ]; then
  echo "Using mkdocs.yml with git-committers (token present)"
  mkdocs build --strict -f mkdocs.yml
else
  echo "Using mkdocs.nocommitters.yml (no token; likely a fork PR)"
  mkdocs build --strict -f mkdocs.nocommitters.yml
fi
