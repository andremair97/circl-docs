.PHONY: changelog docs

changelog:
	. .venv/bin/activate && cz changelog --unreleased

docs:
	mkdocs build --strict
