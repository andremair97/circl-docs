.PHONY: docs-serve docs-build docs

docs-serve: ## Serve docs locally
	mkdocs serve

docs-build: ## Build docs with strict mode
	mkdocs build --strict

# Compatibility alias
docs: ## [DEPRECATED] Use docs-build
	@echo "[DEPRECATED] use 'make docs-build'" && $(MAKE) docs-build
