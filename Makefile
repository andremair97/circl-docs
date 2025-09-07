
.PHONY: setup validate test smoke changelog docs
setup:
	python -m venv .venv && . .venv/bin/activate && pip install -U pip && pip install -r requirements.txt && npm ci

validate:
	npm run schema:validate

test:
	pytest -q

smoke:
	./tools/ingest_and_map.py --source off --barcode 737628064502 --out /tmp/off-mapped.json && head -n 30 /tmp/off-mapped.json
  
changelog:
	. .venv/bin/activate && cz changelog --unreleased

docs:
	./scripts/mkdocs_build_ci.sh
