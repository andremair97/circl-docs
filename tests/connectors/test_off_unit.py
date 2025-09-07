import json
from pathlib import Path
from urllib.parse import urlparse

from connectors.off.adapter import map_off_product, map_off_search_result

FIXTURES = Path(__file__).resolve().parents[2] / "connectors" / "off" / "fixtures"


def load(name: str):
    with (FIXTURES / name).open("r", encoding="utf-8") as fh:
        return json.load(fh)


def test_map_off_search_result():
    raw = load("sample_search.json")
    products = map_off_search_result(raw)
    assert len(products) == 2
    first = products[0]
    assert first["source"] == "openfoodfacts"
    assert first["sustainability"]["eco_score"] == "a"
    assert "a" in first["badges"] and "b" in first["badges"]
    assert first["sustainability"]["labels"] == ["en:organic"]
    assert all(isinstance(u, str) for u in first["images"])
    parsed = urlparse(first["provenance"]["source_url"])
    assert parsed.scheme in {"http", "https"}


def test_map_off_product():
    raw = load("sample_product.json")
    product = map_off_product(raw)
    assert product is not None
    assert product["id"] == "1234567890123"
    assert product["brand"] == "BrandA"
    assert product["sustainability"]["nutri_score"] == "b"
