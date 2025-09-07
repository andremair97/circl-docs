#!/usr/bin/env python3
"""Validate JSON Schemas and OpenAPI specs.

This script ensures our contract files stay healthy by running:
- jsonschema structural checks plus example validation for each schema
- Spectral lint against any OpenAPI documents

It is intentionally lightweight so `make validate` remains fast and CI-friendly.
"""

from __future__ import annotations

from pathlib import Path
import json
import subprocess

from jsonschema import Draft202012Validator

SCHEMA_DIR = Path("schemas/universal")
OPENAPI_DIR = Path("openapi")


def validate_json_schemas() -> None:
    """Check schema structure and validate embedded examples.

    We iterate over each schema file to catch structural errors early and
    confirm that documented examples remain in sync with the contract.
    """
    for schema_path in SCHEMA_DIR.glob("*.json"):
        schema = json.loads(schema_path.read_text())
        Draft202012Validator.check_schema(schema)
        validator = Draft202012Validator(schema)
        for example in schema.get("examples", []):
            validator.validate(example)


def validate_openapi() -> None:
    """Run Spectral lint on each OpenAPI spec if present."""
    for spec in OPENAPI_DIR.glob("*.yaml"):
        # `npx` resolves the locally installed spectral CLI.
        subprocess.run(["npx", "spectral", "lint", str(spec)], check=True)


def main() -> None:
    validate_json_schemas()
    validate_openapi()


if __name__ == "__main__":
    main()
