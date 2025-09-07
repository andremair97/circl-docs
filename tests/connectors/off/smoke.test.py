import os, pathlib, sys

root = pathlib.Path(__file__).resolve().parents[3]
sys.path.insert(0, str(root))

# Avoid proxy interference in CI environments
for _var in ["http_proxy", "https_proxy", "HTTP_PROXY", "HTTPS_PROXY"]:
    os.environ.pop(_var, None)
os.environ.setdefault("NO_PROXY", "*")
os.environ.setdefault("no_proxy", "*")

from urllib.error import URLError

import pytest
from src.adapters.off import fetch_off_product


def test_off_smoke_fetches_product():
    """Simple network smoke test for the OFF connector."""
    barcode = "737628064502"
    try:
        product = fetch_off_product(barcode)
    except URLError as e:
        pytest.skip(f"network unavailable: {e}")
    assert product.get("code") == barcode
