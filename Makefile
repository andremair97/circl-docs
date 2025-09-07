.PHONY: changelog docs setup validate test test-connectors smoke

changelog:
	. .venv/bin/activate && cz changelog --unreleased

docs:
	./scripts/mkdocs_build_ci.sh

setup:
	python -m venv .venv && . .venv/bin/activate && pip install -U pip && pip install -r requirements.txt && npm ci

validate:
	npm run schema:validate

test:
	pytest -q

test-connectors:
	@if [ -n "$(CONNECTOR)" ]; then \
		pytest -q tests/connectors/$(CONNECTOR); \
	else \
		pytest -q tests/connectors; \
	fi

smoke:
	./tools/ingest_and_map.py --source off --barcode 737628064502 --out /tmp/off-mapped.json && head -n 30 /tmp/off-mapped.json
