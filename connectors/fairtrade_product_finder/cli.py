"""JSONL CLI for the Fairtrade Product Finder connector."""

from __future__ import annotations

import argparse
import json
import sys

from . import client
from .providers import csv_provider


def _emit(items):
    for item in items:
        print(json.dumps(item))


def _cmd_search(args):
    try:
        items = client.search_products(
            args.provider,
            args.q,
            brand=args.brand,
            country=args.country,
            limit=args.limit,
            offset=args.offset,
        )
    except (client.ProviderNotAvailableError, csv_provider.CsvLoadError) as exc:
        sys.exit(str(exc))
    _emit(items)


def _cmd_item(args):
    try:
        item = client.get_product(args.provider, args.id)
    except (client.ProviderNotAvailableError, csv_provider.CsvLoadError) as exc:
        sys.exit(str(exc))
    if item:
        print(json.dumps(item))


def _cmd_gtin(args):
    try:
        item = client.lookup_by_gtin(args.provider, args.gtin)
    except (client.ProviderNotAvailableError, csv_provider.CsvLoadError) as exc:
        sys.exit(str(exc))
    if item:
        print(json.dumps(item))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="fairtrade_product_finder")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_search = sub.add_parser("search", help="search products")
    p_search.add_argument("--provider", required=True)
    p_search.add_argument("--q", required=True)
    p_search.add_argument("--brand")
    p_search.add_argument("--country")
    p_search.add_argument("--limit", type=int, default=20)
    p_search.add_argument("--offset", type=int, default=0)
    p_search.set_defaults(func=_cmd_search)

    p_item = sub.add_parser("item", help="get product by id")
    p_item.add_argument("--provider", required=True)
    p_item.add_argument("--id", required=True)
    p_item.set_defaults(func=_cmd_item)

    p_gtin = sub.add_parser("gtin", help="lookup by GTIN")
    p_gtin.add_argument("--provider", required=True)
    p_gtin.add_argument("--gtin", required=True)
    p_gtin.set_defaults(func=_cmd_gtin)

    args = parser.parse_args(argv)
    args.func(args)
    return 0


if __name__ == "__main__":  # pragma: no cover - CLI entry
    raise SystemExit(main())
