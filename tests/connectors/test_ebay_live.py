import os
import pytest

from connectors.ebay.adapter import map_item_detail, map_item_summary_search
from connectors.ebay.client import EbayClient


def _skip_live() -> bool:
    return os.getenv("EBAY_LIVE_TEST") != "1" or not os.getenv("EBAY_OAUTH_TOKEN")


@pytest.mark.skipif(_skip_live(), reason="EBAY_LIVE_TEST not set or missing token")
def test_live_search_and_item() -> None:
    client = EbayClient()
    raw = client.search_items("laptop", limit=2)
    items = map_item_summary_search(raw)
    assert items and items[0]["id"]
    item_id = items[0]["id"]
    raw_item = client.get_item(item_id)
    detail = map_item_detail(raw_item)
    assert detail and detail["id"] == item_id
    assert detail["url"]
