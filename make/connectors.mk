.PHONY: smoke test-connectors test-contracts

smoke: ## Run a sample OFF mapping
	./tools/ingest_and_map.py --source off --barcode 737628064502 --out /tmp/off-mapped.json && head -n 30 /tmp/off-mapped.json

test-connectors: ## Run connector tests
	pytest -q tests/connectors/off

test-contracts: ## Validate connector contracts
	$(MAKE) validate
