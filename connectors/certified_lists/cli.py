"""JSON Lines CLI for certified lists connector."""

from __future__ import annotations

import argparse
import json
import sys
from typing import List

from . import client
from .providers import eu_ecolabel, green_seal


EXCEPTIONS = (
    client.ProviderNotAvailableError,
    eu_ecolabel.EUEcolabelHttpError,
    eu_ecolabel.EUEcolabelParseError,
    green_seal.GreenSealAuthError,
    green_seal.GreenSealHttpError,
    green_seal.GreenSealParseError,
)


def _print(items: List[dict]) -> None:
    for item in items:
        print(json.dumps(item, ensure_ascii=False))


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Certified lists CLI")
    parser.add_argument("--provider", required=True, choices=list(client.PROVIDERS.keys()))
    sub = parser.add_subparsers(dest="cmd")

    p_search = sub.add_parser("search", help="search certified products")
    p_search.add_argument("--q", default="")
    p_search.add_argument("--limit", type=int, default=5)
    p_search.add_argument("--offset", type=int, default=0)
    p_search.add_argument("--category")
    p_search.add_argument("--standard")

    p_item = sub.add_parser("item", help="fetch single certificate")
    p_item.add_argument("--id", required=True)

    args = parser.parse_args(argv)

    try:
        if args.cmd == "search":
            items = client.search_certified(
                args.provider,
                args.q,
                limit=args.limit,
                offset=args.offset,
                category=args.category,
                standard=args.standard,
            )
            _print(items)
        elif args.cmd == "item":
            item = client.get_certificate(args.provider, args.id)
            if item:
                _print([item])
        else:
            parser.print_help()
            return 1
    except EXCEPTIONS as exc:
        sys.stderr.write(f"error: {exc}\n")
        return 1
    return 0


if __name__ == "__main__":  # pragma: no cover - CLI entry point
    raise SystemExit(main())
