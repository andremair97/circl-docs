import json
from pathlib import Path

import pytest

from connectors.cdp import adapter, client

FIXTURES = Path(__file__).resolve().parents[2] / "connectors/cdp/fixtures"

def test_search_scores_local():
    path = FIXTURES / "sample_scores_2024.csv"
    items = client.search_scores("csv_local", "Alphabet", year=2024, path=str(path))
    assert items and items[0]["source"] == "cdp:scores"
    item = items[0]
    assert item["provider"] == "csv_local"
    assert item["scores"]["climate_change"] == "A"
    assert "provenance" in item and item["provenance"]["raw"]

def test_grade_passthrough():
    path = FIXTURES / "sample_scores_2024.csv"
    items = client.search_scores("csv_local", "Nestlé", year=2024, path=str(path))
    assert items and items[0]["scores"]["climate_change"] == "A-"

def test_year_filter():
    path = FIXTURES / "sample_scores_2024.csv"
    items = client.search_scores("csv_local", "Alphabet", year=2023, path=str(path))
    assert items == []

def test_adapter_json_fixture():
    data = json.loads((FIXTURES / "sample_scores_2024.json").read_text())[0]
    item = adapter.map_row(data, "csv_local", "sample")
    assert item["scores"]["climate_change"] == data["score_climate"]

def test_sanitize_raw_bounds():
    big = {"a": "x" * 50000}
    trimmed = adapter.sanitize_raw(big, max_bytes=1000)
    assert len(json.dumps(trimmed)) <= 1000

def test_bad_provider():
    with pytest.raises(client.ProviderNotAvailableError):
        client.search_scores("unknown", "x")
