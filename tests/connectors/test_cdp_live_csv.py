import os

import pytest

from connectors.cdp import client

LIVE = os.getenv("CDP_LIVE_TEST") == "1"


@pytest.mark.skipif(not LIVE or not os.getenv("CDP_SCORES_CSV_URL"), reason="live test disabled")
def test_live_csv_smoke():
    items = client.search_scores("csv_http", "Alphabet", year=2024)
    assert items and items[0]["org_name"]
    assert items[0]["scores"]
    assert items[0]["year"] == 2024
