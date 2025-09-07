#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Create/activate local venv for UI only
if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate

# Install UI-only deps (do NOT touch main requirements.txt)
pip install -U pip wheel setuptools
pip install -r requirements-dev.txt

# Run Streamlit UI
streamlit run ui/app.py
