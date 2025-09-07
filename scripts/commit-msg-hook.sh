# scripts/commit-msg-hook.sh (optional, local dev)

```bash
#!/usr/bin/env bash
# Prevent commits to main without updating the changelog in the same branch (local enforcement)
set -euo pipefail

changed=$(git diff --cached --name-only)
if ! grep -q "^PROJECT_CHANGELOG.md$" <<< "$changed"; then
  echo "WARNING: You haven't staged PROJECT_CHANGELOG.md. Please update it before committing." >&2
fi
```

Install (optional):
```bash
chmod +x scripts/commit-msg-hook.sh
ln -s ../../scripts/commit-msg-hook.sh .git/hooks/pre-commit
```