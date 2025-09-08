import os

import pytest

from connectors.libraryofthings_uk import client

if not (os.getenv("LOT_LIVE_TEST") == "1" and os.getenv("MYTURN_BASE_URL")):
    pytest.skip(
        "Live myTurn test skipped (set LOT_LIVE_TEST=1 and MYTURN_BASE_URL)",
        allow_module_level=True,
    )


def test_live_search_and_get():
    results = client.search_items("myturn", "drill", limit=2)
    assert results
    first = results[0]
    assert first.get("id") and first.get("title") and first.get("url")
    item = client.get_item("myturn", first["id"])
    assert item and item["id"] == first["id"]
