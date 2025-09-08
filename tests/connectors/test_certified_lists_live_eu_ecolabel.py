import os

import pytest

from connectors.certified_lists import client

pytestmark = pytest.mark.skipif(
    os.getenv("CERTS_LIVE_TEST") != "1" or not os.getenv("EU_ECOLABEL_DATA_URL"),
    reason="CERTS_LIVE_TEST!=1 or missing EU_ECOLABEL_DATA_URL",
)


def test_live_fetch():
    items = client.search_certified("eu_ecolabel", "", limit=1)
    assert items and items[0]["certificate_id"]
