.PHONY: changelog docs

changelog:
	. .venv/bin/activate && cz changelog --unreleased

docs:
	./scripts/mkdocs_build_ci.sh
