"""JSON Lines CLI for the ENERGY STAR connector."""


from __future__ import annotations

import argparse
import json
import sys
from typing import List

from . import client
from .providers import socrata


def _print(items: List[dict]) -> None:
    for item in items:
        print(json.dumps(item, ensure_ascii=False))


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="ENERGY STAR connector CLI")
    sub = parser.add_subparsers(dest="cmd")

    p_search = sub.add_parser("search", help="search within a category")
    p_search.add_argument("--category", required=True, choices=client.CATEGORIES)
    p_search.add_argument("--q")
    p_search.add_argument("--limit", type=int, default=5)
    p_search.add_argument("--offset", type=int, default=0)

    p_item = sub.add_parser("item", help="fetch a single item")
    p_item.add_argument("--category", required=True, choices=client.CATEGORIES)
    p_item.add_argument("--id", required=True)

    args = parser.parse_args(argv)

    try:
        if args.cmd == "search":
            items = client.search_items(
                args.category, q=args.q, limit=args.limit, offset=args.offset
            )
            _print(items)
        elif args.cmd == "item":
            item = client.get_item(args.category, args.id)
            if item:
                _print([item])
        else:
            parser.print_help()
            return 1
    except (
        client.CategoryNotSupportedError,
        socrata.SocrataHttpError,
        socrata.SocrataParseError,
    ) as exc:
        sys.stderr.write(f"error: {exc}\n")
        return 1
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
