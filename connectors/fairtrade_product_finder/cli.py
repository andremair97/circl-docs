"""JSON Lines CLI for the Fairtrade Product Finder connector."""

from __future__ import annotations

import argparse
import json
import sys
from typing import List

from . import client
from .providers.csv_provider import CsvLoadError


def _print(items: List[dict]) -> None:
    for item in items:
        print(json.dumps(item, ensure_ascii=False))


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Fairtrade Product Finder CLI")
    sub = parser.add_subparsers(dest="cmd")

    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--provider", required=True, choices=["fixtures_uk", "fixtures_global", "csv"])

    p_search = sub.add_parser("search", parents=[common], help="search for products")
    p_search.add_argument("--q", required=True)
    p_search.add_argument("--brand")
    p_search.add_argument("--country")
    p_search.add_argument("--limit", type=int, default=20)
    p_search.add_argument("--offset", type=int, default=0)

    p_item = sub.add_parser("item", parents=[common], help="fetch product by id")
    p_item.add_argument("--id", required=True)

    p_gtin = sub.add_parser("gtin", parents=[common], help="lookup product by GTIN")
    p_gtin.add_argument("--gtin", required=True)

    args = parser.parse_args(argv)

    try:
        if args.cmd == "search":
            items = client.search_products(
                args.provider,
                args.q,
                brand=args.brand,
                country=args.country,
                limit=args.limit,
                offset=args.offset,
            )
            _print(items)
        elif args.cmd == "item":
            item = client.get_product(args.provider, args.id)
            if item:
                _print([item])
        elif args.cmd == "gtin":
            item = client.lookup_by_gtin(args.provider, args.gtin)
            if item:
                _print([item])
        else:
            parser.print_help()
            return 1
    except (client.ProviderNotAvailableError, CsvLoadError) as exc:
        sys.stderr.write(f"error: {exc}\n")
        return 1
    return 0


if __name__ == "__main__":  # pragma: no cover - CLI entry point
    raise SystemExit(main())
