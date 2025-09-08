import json

import pytest

from connectors.certified_lists import adapter, client


@pytest.mark.parametrize("provider,query", [
    ("eu_ecolabel", "soap"),
    ("green_seal", "soap"),
])
def test_search_and_normalise(provider: str, query: str):
    items = client.search_certified(provider, query)
    assert items, provider
    first = items[0]
    for key in ["source", "provider", "certificate_id", "product", "organization", "status", "provenance"]:
        assert key in first
    assert first["product"]["name"]
    assert first["organization"]["name"]
    assert first["status"]["status"]


def test_get_certificate_dispatch():
    item = client.get_certificate("green_seal", "GS-41-456")
    assert item and item["certificate_id"] == "GS-41-456"


def test_bad_provider():
    with pytest.raises(client.ProviderNotAvailableError):
        client.search_certified("unknown", "x")


def test_sanitize_bounds():
    raw = {"big": "x" * 40000}
    san = adapter.sanitize_raw(raw, max_bytes=1000)
    assert len(json.dumps(san)) <= 1000
