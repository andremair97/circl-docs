import os

import pytest

from connectors.certified_lists import client

pytestmark = pytest.mark.skipif(
    os.getenv("CERTS_LIVE_TEST") != "1" or not os.getenv("GS_API_KEY"),
    reason="CERTS_LIVE_TEST!=1 or missing GS_API_KEY",
)


def test_live_search():
    items = client.search_certified("green_seal", "soap", limit=1)
    assert items
    item = items[0]
    assert item["certificate_id"]
    assert item["product"]["name"]
    assert item["status"].get("standard")
