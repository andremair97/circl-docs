import json
import os
from pathlib import Path

import pytest

from connectors.libraryofthings_uk import adapter, client
from connectors.libraryofthings_uk.providers import lendengine_stub, lot_stub

FIXTURES = Path(__file__).resolve().parents[2] / "connectors" / "libraryofthings_uk" / "fixtures"


def _required_keys(item):
    for key in ["source", "provider", "id", "title", "price", "location", "provenance"]:
        assert key in item


def test_lot_stub_search_and_get():
    items = lot_stub.search_items("Sewing")
    assert items
    _required_keys(items[0])
    item = lot_stub.get_item("lot1")
    assert item and item["id"] == "lot1"


def test_lendengine_stub_search_and_get():
    items = lendengine_stub.search_items("Drill")
    assert items
    _required_keys(items[0])
    item = lendengine_stub.get_item("le1")
    assert item and item["id"] == "le1"


def test_sanitize_raw_bounds_size():
    raw = {"a": "x" * 5000, "b": list(range(1000))}
    san = adapter.sanitize_raw(raw, max_bytes=2000)
    assert len(json.dumps(san)) <= 2000


def test_dispatcher_with_myturn_fixture():
    results = client.search_items("myturn", "Hammer", use_fixture=True)
    assert results and results[0]["provider"] == "myturn"
    first_id = results[0]["id"]
    item = client.get_item("myturn", first_id, use_fixture=True)
    assert item and item["id"] == first_id


def test_bad_provider():
    with pytest.raises(client.ProviderNotAvailableError):
        client.search_items("nope", "x")
