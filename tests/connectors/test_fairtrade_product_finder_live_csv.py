import os

import pytest

from connectors.fairtrade_product_finder import client


live = os.getenv("FT_LIVE_TEST") == "1" and (
    os.getenv("FAIRTRADE_CSV_URL") or os.getenv("FAIRTRADE_CSV_PATH")
)


@pytest.mark.skipif(not live, reason="FT_LIVE_TEST not enabled")
def test_csv_search_smoke():
    results = client.search_products("csv", "coffee", limit=2)
    assert results
    item = results[0]
    assert item.get("id")
    assert item.get("name")
    assert isinstance(item.get("product_ids", {}).get("gtins", []), list)
