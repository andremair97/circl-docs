import os
import pytest

from connectors.tco_certified import client


@pytest.mark.skipif(
    os.getenv("TCO_LIVE_TEST") != "1" or not os.getenv("TCO_GTIN_API_BASE"),
    reason="live GTIN test disabled",
)
def test_live_gtin_lookup():
    gtin = os.getenv("TCO_GTIN_TEST_GTIN", "0887276789012")
    items = client.search(provider="gtin-api", gtin=gtin, limit=1)
    assert items, "GTIN lookup returned no items – check API access or GTIN"
    item = items[0]
    assert item["certificate_number"]
    assert item["brand"] and item["model"]
