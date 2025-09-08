import json
from pathlib import Path

import pytest

from connectors.tco_certified import adapter, client
from connectors.tco_certified.client import ProviderNotAvailableError

FIXTURES = Path("connectors/tco_certified/fixtures")


def load_json(name: str):
    return json.loads((FIXTURES / name).read_text())


def test_productfinder_stub_search():
    items = client.search(
        provider="productfinder-stub",
        q="display",
        path=str(FIXTURES / "productfinder_stub_inventory.json"),
    )
    assert items and items[0]["provider"] == "productfinder-stub"
    for item in items:
        assert item["brand"] and item["model"]
        assert "valid_from" in item["validity"]
        assert item["provenance"]


def test_csv_loader_multi_gtin_and_dates():
    items = client.search(
        provider="csv",
        q="Dell",
        path=str(FIXTURES / "certificates_sample.csv"),
    )
    assert items and len(items[0]["gtins"]) == 2
    assert (item := items[0])
    assert item["validity"]["valid_from"] == "2024-01-01"


def test_gtin_api_fixture_search():
    items = client.search(
        provider="gtin-api",
        gtin="0887276789012",
        fixture_path=str(FIXTURES / "gtin_api_lookup.json"),
    )
    assert items and items[0]["certificate_number"] == "TC0X12345"


def test_dispatcher_bad_provider():
    with pytest.raises(ProviderNotAvailableError):
        client.search(provider="unknown")


def test_sanitize_raw_bounds_size():
    raw = {"big": "x" * 40000, "arr": list(range(1000))}
    cleaned = adapter.sanitize_raw(raw, max_bytes=100)
    assert len(cleaned["big"]) <= 100
    assert len(cleaned["arr"]) <= 20
