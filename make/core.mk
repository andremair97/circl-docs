.PHONY: changelog setup validate lint test

changelog: ## Generate changelog from fragments
	. .venv/bin/activate && cz changelog --unreleased

setup: ## Setup Python and Node dependencies
	python -m venv .venv && . .venv/bin/activate && pip install -U pip && pip install -r requirements.txt && npm ci

validate: ## Validate JSON schemas
	python scripts/validate_schemas.py

lint: ## Run lint checks
	pnpm lint

test: ## Run Python tests
	pytest -q
