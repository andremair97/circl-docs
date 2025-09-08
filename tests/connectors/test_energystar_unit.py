import json
from pathlib import Path

import pytest

from connectors.energystar import adapter, client
from connectors.energystar.providers import socrata

FIXTURES = Path(__file__).resolve().parents[2] / "connectors/energystar/fixtures"


def load(name: str):
    return json.loads((FIXTURES / name).read_text())


@pytest.mark.parametrize(
    "category, fixture, dataset_id",
    [
        ("televisions", "search_televisions.json", "pd96-rr3d"),
        ("computers", "search_computers.json", "j7nq-iepp"),
        ("dehumidifiers", "search_dehumidifiers.json", "mgiu-hu4z"),
        ("heat_pumps", "search_heatpumps.json", "w7cv-9xjt"),
    ],
)
def test_normalize_search(category, fixture, dataset_id):
    rows = load(fixture)
    dataset_url = f"https://data.energystar.gov/d/{dataset_id}"
    items = [
        adapter.normalize_item(category, dataset_id, dataset_url, row, "http://example")
        for row in rows
    ]
    assert items
    for item in items:
        assert item["source"] == "energystar:socrata"
        assert item["provider"] == "socrata"
        assert item["category"] == category
        assert item["id"]
        assert item["title"]
        assert item["identifiers"]["esuid"]
        assert item["provenance"]["raw"]


def test_sanitize_raw_truncates():
    raw = {"big": "x" * 40000}
    trimmed = adapter.sanitize_raw(raw, max_bytes=1000)
    assert len(json.dumps(trimmed)) <= 1000


def test_dispatcher_and_category_error():
    orig = socrata.search_items
    socrata.search_items = lambda category, dataset_id, dataset_url, **kw: ["ok"]
    try:
        items = client.search_items("televisions")
        assert items == ["ok"]
    finally:
        socrata.search_items = orig
    with pytest.raises(client.CategoryNotSupportedError):
        client.search_items("unknown")
