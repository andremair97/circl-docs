.PHONY: changelog docs setup validate lint test smoke test-connectors test-contracts test-web

changelog:
	. .venv/bin/activate && cz changelog --unreleased

docs:
	./scripts/mkdocs_build_ci.sh

setup:
	python -m venv .venv && . .venv/bin/activate && pip install -U pip && pip install -r requirements.txt && npm ci

validate:
	python scripts/validate_schemas.py

lint:
	pnpm lint


test:
	pytest -q

smoke:
	./tools/ingest_and_map.py --source off --barcode 737628064502 --out /tmp/off-mapped.json && head -n 30 /tmp/off-mapped.json

test-connectors:
	pytest -q tests/connectors/off

test-contracts:
	$(MAKE) validate

test-web:
	pnpm -C ui test
