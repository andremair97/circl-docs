import os

import pytest

from connectors.ifixit import adapter, client

pytestmark = pytest.mark.skipif(
    os.getenv("IFIXIT_LIVE_TEST") != "1", reason="IFIXIT_LIVE_TEST!=1"
)


def test_live_flow():
    search_raw = client.search_devices("iphone 11", limit=2)
    devices = adapter.map_device_search(search_raw)
    assert devices
    device_name = devices[0]["device"]

    guides_raw = client.list_guides_for_device(device_name, limit=2)
    guides = adapter.map_guides_list(guides_raw, device_name)
    assert guides

    wiki_raw = client.get_device_wiki(device_name)
    wiki = adapter.map_device_wiki(wiki_raw, device_name)
    assert wiki and wiki["title"]
