import json
from pathlib import Path

from connectors.ifixit import adapter

FIXTURES = Path(__file__).resolve().parents[2] / "connectors/ifixit/fixtures"


def load(name: str):
    text = (FIXTURES / name).read_text()
    content = "\n".join(line for line in text.splitlines() if not line.startswith("//"))
    return json.loads(content)


def test_map_device_search():
    raw = load("sample_search_devices.json")
    items = adapter.map_device_search(raw)
    assert items and items[0]["source"] == "ifixit"
    for item in items:
        assert item["device"]
        assert item["url"]


def test_map_guides_list():
    raw = load("sample_guides_for_device.json")
    items = adapter.map_guides_list(raw, "iPhone 11")
    assert items and items[0]["id"] == "1"
    for item in items:
        assert item["title"]
        assert item["url"]
        assert len(json.dumps(item["provenance"]["raw"])) < 2000


def test_map_device_wiki():
    raw = load("sample_wiki_device.json")
    item = adapter.map_device_wiki(raw, "iPhone 11")
    assert item["title"]
    assert item["url"]
    assert "ifixit" == item["source"]
    assert len(json.dumps(item["provenance"]["raw"])) < 2000
