# scripts/commit-msg-hook.sh (optional, local dev)

```bash
#!/usr/bin/env bash
# Warn if commit lacks a changelog fragment
set -euo pipefail

changed=$(git diff --cached --name-only)
if ! grep -q '^changelog/.*\.md$' <<< "$changed"; then
  echo "WARNING: You haven't staged a changelog fragment in changelog/." >&2
fi
```

Install (optional):
```bash
chmod +x scripts/commit-msg-hook.sh
ln -s ../../scripts/commit-msg-hook.sh .git/hooks/pre-commit
```
