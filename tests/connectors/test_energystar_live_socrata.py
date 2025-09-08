import os

import pytest

from connectors.energystar import client
from connectors.energystar.providers.socrata import (
    SocrataHttpError,
    SocrataParseError,
)

pytestmark = pytest.mark.skipif(
    os.getenv("ENERGY_STAR_LIVE_TEST") != "1", reason="ENERGY_STAR_LIVE_TEST!=1"
)


def test_live_search():
    try:
        items = client.search_items("televisions", q="LG", limit=2)
    except (SocrataHttpError, SocrataParseError) as exc:
        pytest.xfail(f"API error: {exc}")
    if not items:
        pytest.xfail("empty result or rate limited")
    assert items[0]["id"]
    assert items[0]["title"]
