.PHONY: ui-install ui-build ui-test test-web

ui-install: ## Install UI dependencies
	pnpm -C ui install

ui-build: ## Build the UI
	pnpm -C ui build

ui-test: ## Run UI tests
	pnpm -C ui test

# Compatibility alias
test-web: ## [DEPRECATED] Use ui-test
	@echo "[DEPRECATED] use 'make ui-test'" && $(MAKE) ui-test
