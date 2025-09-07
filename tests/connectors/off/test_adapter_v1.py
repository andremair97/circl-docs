import json
import os
import sys
from pathlib import Path

import pytest
from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT))

from src.connectors.off import normalize_off

SCHEMA_PATH = ROOT / "schemas" / "universal" / "product.json"
RAW_PAYLOAD = ROOT / "tests" / "data" / "off-product.raw.json"


@pytest.fixture(autouse=True)
def enable_flag(monkeypatch):
    monkeypatch.setenv("USE_OFF_V1", "1")


def load_schema():
    with open(SCHEMA_PATH) as f:
        return json.load(f)


def test_normalization_matches_schema():
    schema = load_schema()
    payload = json.loads(RAW_PAYLOAD.read_text())
    normalized = normalize_off(payload)
    Draft202012Validator(schema).validate(normalized)
    assert normalized["id"] == payload["code"]
    assert normalized["title"] == payload["product_name"]
