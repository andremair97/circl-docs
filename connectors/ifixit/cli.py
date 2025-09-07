"""Tiny CLI for poking the iFixit connector.

This is intended for manual smoke tests and prints JSON Lines of normalized
records. It deliberately avoids external dependencies and heavy formatting.
"""

from __future__ import annotations

import argparse
import json
import sys
from typing import List

from . import adapter, client


def _print(items: List[dict]) -> None:
    for item in items:
        print(json.dumps(item, ensure_ascii=False))


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="iFixit connector CLI")
    sub = parser.add_subparsers(dest="cmd")

    p_search = sub.add_parser("search", help="search for devices")
    p_search.add_argument("--q", required=True)
    p_search.add_argument("--limit", type=int, default=5)
    p_search.add_argument("--offset", type=int, default=0)

    p_guides = sub.add_parser("guides", help="list guides for a device")
    p_guides.add_argument("--device", required=True)
    p_guides.add_argument("--limit", type=int, default=5)
    p_guides.add_argument("--offset", type=int, default=0)

    p_wiki = sub.add_parser("wiki", help="fetch device wiki")
    p_wiki.add_argument("--device", required=True)

    args = parser.parse_args(argv)

    try:
        if args.cmd == "search":
            raw = client.search_devices(args.q, args.limit, args.offset)
            items = adapter.map_device_search(raw)
            _print(items)
        elif args.cmd == "guides":
            raw = client.list_guides_for_device(args.device, args.limit, args.offset)
            items = adapter.map_guides_list(raw, args.device)
            _print(items)
        elif args.cmd == "wiki":
            raw = client.get_device_wiki(args.device)
            item = adapter.map_device_wiki(raw, args.device)
            if item:
                _print([item])
        else:
            parser.print_help()
            return 1
    except (client.IFixitHttpError, client.IFixitParseError) as exc:
        sys.stderr.write(f"error: {exc}\n")
        return 1
    return 0


if __name__ == "__main__":  # pragma: no cover - CLI entry point
    raise SystemExit(main())
