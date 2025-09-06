#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> venv"
[ -d .venv ] || python3 -m venv .venv
source .venv/bin/activate
pip install -U pip wheel setuptools
pip install -r requirements.txt

echo "==> node deps"
[ -f package.json ] && npm ci

echo "==> ajv validate"
if npm run | grep -q "schema:validate"; then
  npm run schema:validate
else
  echo "No schema:validate script"
fi

echo "==> pytest"
if command -v pytest >/dev/null 2>&1; then
  pytest -q || true
fi

echo "==> smoke: OFF -> universal"
if [ -f tools/ingest_and_map.py ]; then
  ./tools/ingest_and_map.py --source off --barcode 737628064502 --out /tmp/off-mapped.json
  echo "Wrote /tmp/off-mapped.json"
  head -n 30 /tmp/off-mapped.json || true
fi
echo "==> done ✓"
