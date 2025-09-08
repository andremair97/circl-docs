"""JSONL CLI for the CDP Scores connector."""

from __future__ import annotations

import argparse
import json
import sys
from typing import List

from .client import ProviderNotAvailableError, get_org, search_scores
from .providers import csv_http


def _print(items: List[dict]) -> None:
    for item in items:
        print(json.dumps(item, ensure_ascii=False))


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="CDP Scores connector CLI")
    sub = parser.add_subparsers(dest="cmd")

    p_search = sub.add_parser("search", help="search organisations")
    p_search.add_argument("--provider", required=True, choices=["csv_local", "csv_http"])
    p_search.add_argument("--q", required=True)
    p_search.add_argument("--year", type=int)
    p_search.add_argument("--limit", type=int, default=20)
    p_search.add_argument("--offset", type=int, default=0)
    p_search.add_argument("--path")
    p_search.add_argument("--url")

    p_org = sub.add_parser("org", help="fetch a single organisation")
    p_org.add_argument("--provider", required=True, choices=["csv_local", "csv_http"])
    p_org.add_argument("--key", required=True)
    p_org.add_argument("--year", type=int)
    p_org.add_argument("--path")
    p_org.add_argument("--url")

    args = parser.parse_args(argv)

    try:
        if args.cmd == "search":
            items = search_scores(
                args.provider,
                args.q,
                year=args.year,
                limit=args.limit,
                offset=args.offset,
                path=args.path,
                url=args.url,
            )
            _print(items)
        elif args.cmd == "org":
            item = get_org(
                args.provider,
                args.key,
                year=args.year,
                path=args.path,
                url=args.url,
            )
            if item:
                _print([item])
        else:
            parser.print_help()
            return 1
    except ProviderNotAvailableError as exc:
        sys.stderr.write(f"error: {exc}\n")
        return 1
    except (csv_http.CDPHttpError, csv_http.CDPParseError) as exc:
        sys.stderr.write(f"error: {exc}\n")
        return 1
    return 0


if __name__ == "__main__":  # pragma: no cover - CLI entry
    raise SystemExit(main())
