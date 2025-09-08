"""Command line interface for the Open Food Facts connector."""

from __future__ import annotations

import argparse
import json
import sys
from typing import List

from .adapter import map_off_product, map_off_search_result
from .client import OFFHttpError, OFFParseError, get_product, search_off


def _print_products(products):
    for prod in products:
        print(json.dumps(prod))


def cmd_search(args):
    fields = args.fields.split(",") if args.fields else None
    raw = search_off(args.q, page_size=args.limit, page=args.page, fields=fields)
    products = map_off_search_result(raw)
    _print_products(products)


def cmd_product(args):
    fields = args.fields.split(",") if args.fields else None
    raw = get_product(args.barcode, fields=fields)
    product = map_off_product(raw)
    if product:
        _print_products([product])


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Open Food Facts connector CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    p_search = sub.add_parser("search", help="search products")
    p_search.add_argument("--q", required=True, help="search query")
    p_search.add_argument("--limit", type=int, default=20, help="page size")
    p_search.add_argument("--page", type=int, default=1, help="page number")
    p_search.add_argument("--fields", help="comma-separated OFF fields")
    p_search.set_defaults(func=cmd_search)

    p_product = sub.add_parser("product", help="fetch product by barcode")
    p_product.add_argument("--barcode", required=True, help="barcode")
    p_product.add_argument("--fields", help="comma-separated OFF fields")
    p_product.set_defaults(func=cmd_product)

    args = parser.parse_args(argv)
    try:
        args.func(args)
        return 0
    except (OFFHttpError, OFFParseError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
