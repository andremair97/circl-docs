SHELL := /bin/bash
.DEFAULT_GOAL := help
include make/*.mk
-include make/local.mk
.PHONY: help
help:
	@grep -hE '^[a-zA-Z0-9_-]+:.*?## ' make/*.mk | sort | sed -e 's/:.*## /\t/'
