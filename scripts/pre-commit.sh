#!/usr/bin/env bash
# Pre-commit safeguard to keep high-churn files stable.
# Fails when the changelog or monolithic Makefile are edited directly so
# contributors add fragments and touch modular makefiles instead.
set -euo pipefail

# Gather staged files.
staged=$(git diff --cached --name-only)

# Prevent direct edits to the aggregated changelog.
if echo "$staged" | grep -q '^PROJECT_CHANGELOG.md$'; then
  echo 'Do not edit PROJECT_CHANGELOG.md directly. Add a fragment under /changelog/.' >&2
  exit 1
fi

# Encourage modular Makefile changes.
if echo "$staged" | grep -q '^Makefile$'; then
  echo 'Edit files under make/*.mk instead.' >&2
  exit 1
fi
