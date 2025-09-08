import json
from pathlib import Path

from connectors.ebay.adapter import map_item_detail, map_item_summary_search

FIXTURES = Path(__file__).resolve().parent.parent.parent / "connectors" / "ebay" / "fixtures"

def load_fixture(name: str) -> dict:
    path = FIXTURES / name
    with path.open("r", encoding="utf-8") as f:
        data = "".join(line for line in f if not line.strip().startswith("//"))
    return json.loads(data)

def test_map_search_returns_list() -> None:
    raw = load_fixture("sample_search_laptops.json")
    items = map_item_summary_search(raw)
    assert isinstance(items, list) and items
    first = items[0]
    assert first["source"] == "ebay-browse"
    assert first["id"]
    assert first["title"]
    assert first["price"]["value"] is not None
    assert first["price"]["currency"] == "GBP"
    assert first["url"].startswith("http")
    assert isinstance(first["images"], list)
    assert "buyingOption:FIXED_PRICE" in first["badges"]
    assert len(json.dumps(first["provenance"]["raw"])) < 30 * 1024

def test_map_item_detail() -> None:
    raw = load_fixture("sample_item_detail.json")
    item = map_item_detail(raw)
    assert item is not None
    assert item["id"] == "v1|1234567890|0"
    assert item["price"]["currency"] == "GBP"
    assert item["url"].startswith("http")
