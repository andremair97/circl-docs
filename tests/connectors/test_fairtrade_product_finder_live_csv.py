import os
import pytest

from connectors.fairtrade_product_finder import client

skip_reason = "live CSV not configured"
requires_env = (
    os.getenv("FT_LIVE_TEST") == "1"
    and (os.getenv("FAIRTRADE_CSV_URL") or os.getenv("FAIRTRADE_CSV_PATH"))
)


@pytest.mark.skipif(not requires_env, reason=skip_reason)
def test_live_csv_search_smoke():
    items = client.search_products("csv", "coffee", limit=2)
    assert items
    item = items[0]
    assert item.get("id")
    assert item.get("name")
    gtins = item.get("product_ids", {}).get("gtins", [])
    assert isinstance(gtins, list)
