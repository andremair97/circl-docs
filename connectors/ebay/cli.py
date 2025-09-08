"""Tiny CLI around the eBay Browse API connector."""

from __future__ import annotations

import argparse
import json
import os
import sys

from .adapter import map_item_detail, map_item_summary_search
from .client import EbayClient, EbayHttpError, EbayParseError


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="eBay Browse API CLI")
    sub = parser.add_subparsers(dest="cmd", required=True)

    search = sub.add_parser("search", help="Search items")
    search.add_argument("--q", required=True, help="Keyword to search")
    search.add_argument("--limit", type=int, default=5)
    search.add_argument("--offset", type=int, default=0)
    search.add_argument("--market", default=os.getenv("EBAY_MARKETPLACE", "EBAY_GB"))
    search.add_argument("--buying-options", dest="buying_options")

    item = sub.add_parser("item", help="Get item detail")
    item.add_argument("--id", required=True, help="Item ID")
    item.add_argument("--market", default=os.getenv("EBAY_MARKETPLACE", "EBAY_GB"))

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = _build_parser()
    args = parser.parse_args(argv)
    try:
        client = EbayClient(marketplace=args.market)
        if args.cmd == "search":
            raw = client.search_items(
                args.q,
                limit=args.limit,
                offset=args.offset,
                buying_options=args.buying_options,
            )
            listings = map_item_summary_search(raw)
            for item in listings:
                print(json.dumps(item, ensure_ascii=False))
        elif args.cmd == "item":
            raw = client.get_item(args.id)
            listing = map_item_detail(raw)
            if listing:
                print(json.dumps(listing, ensure_ascii=False))
        return 0
    except (EbayHttpError, EbayParseError, RuntimeError) as e:
        print(str(e), file=sys.stderr)
        return 1


if __name__ == "__main__":  # pragma: no cover - CLI entry point
    raise SystemExit(main())
