import json

import pytest

from connectors.fairtrade_product_finder import adapter, client


def _required_keys(item):
    for key in ["source", "provider", "id", "name", "product_ids", "certification", "provenance"]:
        assert key in item


def test_fixture_uk_search_returns_items():
    results = client.search_products("fixtures_uk", "coffee")
    assert results
    _required_keys(results[0])


def test_fixture_global_search_returns_items():
    results = client.search_products("fixtures_global", "tea")
    assert results
    _required_keys(results[0])


def test_sanitize_raw_bounds_size():
    raw = {"big": "x" * 5000}
    cleaned = adapter.sanitize_raw(raw, max_bytes=1000)
    assert len(json.dumps(cleaned)) <= 1000


def test_dispatcher_rejects_bad_provider():
    with pytest.raises(client.ProviderNotAvailableError):
        client.search_products("missing", "coffee")


def test_lookup_by_gtin():
    item = client.lookup_by_gtin("fixtures_uk", "5071234567890")
    assert item is not None
    assert item["name"] == "Divine Chocolate Bar"
