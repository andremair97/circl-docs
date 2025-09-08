"""JSON Lines CLI for the Library of Things (UK) connector.

The CLI is intentionally tiny and dependency-free. It prints each normalized
item as a JSON object per line so results can be piped or inspected manually.
"""

from __future__ import annotations

import argparse
import json
import sys
from typing import List

from . import client
from .providers import myturn


def _print(items: List[dict]) -> None:
    for item in items:
        print(json.dumps(item, ensure_ascii=False))


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Library of Things UK connector CLI"
    )
    sub = parser.add_subparsers(dest="cmd")

    p_search = sub.add_parser("search", help="search for items")
    p_search.add_argument("--provider", required=True, choices=["myturn", "lendengine", "lot"])
    p_search.add_argument("--q", required=True)
    p_search.add_argument("--limit", type=int, default=5)
    p_search.add_argument("--offset", type=int, default=0)
    p_search.add_argument("--category")

    p_item = sub.add_parser("item", help="fetch a single item")
    p_item.add_argument("--provider", required=True, choices=["myturn", "lendengine", "lot"])
    p_item.add_argument("--id", required=True)

    args = parser.parse_args(argv)

    try:
        if args.cmd == "search":
            items = client.search_items(
                args.provider,
                args.q,
                limit=args.limit,
                offset=args.offset,
                category=args.category,
            )
            _print(items)
        elif args.cmd == "item":
            item = client.get_item(args.provider, args.id)
            if item:
                _print([item])
        else:
            parser.print_help()
            return 1
    except (
        client.ProviderNotAvailableError,
        myturn.MyTurnHttpError,
        myturn.MyTurnParseError,
    ) as exc:
        sys.stderr.write(f"error: {exc}\n")
        return 1
    return 0


if __name__ == "__main__":  # pragma: no cover - CLI entry point
    raise SystemExit(main())
