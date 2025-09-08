import json
import pytest

from connectors.fairtrade_product_finder import adapter, client


REQUIRED_KEYS = {
    "source",
    "provider",
    "id",
    "name",
    "product_ids",
    "certification",
    "provenance",
}


def _check_shape(item):
    for key in REQUIRED_KEYS:
        assert key in item


def test_fixture_provider_shape():
    items = client.search_products("fixtures_uk", "coffee")
    assert items
    _check_shape(items[0])
    items_g = client.search_products("fixtures_global", "coffee")
    assert items_g
    _check_shape(items_g[0])


def test_sanitize_raw_bounds():
    raw = {"big": ["x" * 2000] * 100}
    cleaned = adapter.sanitize_raw(raw, max_bytes=2000)
    size = len(json.dumps(cleaned).encode("utf-8"))
    assert size <= 2000


def test_dispatcher_and_lookup():
    item = client.lookup_by_gtin("fixtures_uk", "5012345678900")
    assert item and item["id"] == "UK-FT-0001"
    with pytest.raises(client.ProviderNotAvailableError):
        client.search_products("nope", "coffee")
