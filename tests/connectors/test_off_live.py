import os

import pytest

from connectors.off.adapter import map_off_product, map_off_search_result
from connectors.off.client import get_product, search_off

pytestmark = pytest.mark.skipif(
    os.getenv("OFF_LIVE_TEST") != "1", reason="live test disabled"
)


def test_live_search():
    raw = search_off("oat milk", page_size=2, fields=["code", "product_name"])
    products = map_off_search_result(raw)
    assert 0 < len(products) <= 2


def test_live_product():
    raw = get_product("737628064502", fields=["code", "product_name"])
    product = map_off_product(raw)
    assert product is not None
    assert product["id"] == "737628064502"
