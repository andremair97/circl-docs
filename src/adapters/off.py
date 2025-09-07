import json
from typing import Any, Dict, Optional
from urllib.request import urlopen
from urllib.parse import urlencode

BASE = "https://world.openfoodfacts.org/api/v2/product/{barcode}.json"

def fetch_off_product(barcode: str, *, fields: Optional[str] = None, lang: str = "en") -> Dict[str, Any]:
    url = BASE.format(barcode=barcode)
    params = {}
    if fields:
        params["fields"] = fields
    if lang:
        params["lc"] = lang
    if params:
        url = f"{url}?{urlencode(params)}"
    with urlopen(url, timeout=20) as r:
        data = json.loads(r.read().decode("utf-8"))
    return data.get("product", {}) or {}
