"""JSONL CLI for the TCO Certified connector."""

from __future__ import annotations

import argparse
import json
import sys
from typing import Any

from . import client
from .client import ProviderNotAvailableError
from .providers.gtin_api import TcoGtinHttpError, TcoGtinParseError


def _print_jsonl(items: list[dict]) -> None:
    for item in items:
        print(json.dumps(item, ensure_ascii=False))


def cmd_search(args: argparse.Namespace) -> int:
    try:
        items = client.search(
            provider=args.provider,
            q=args.q,
            brand=args.brand,
            model=args.model,
            category=args.category,
            gtin=args.gtin,
            limit=args.limit,
            offset=args.offset,
            path=getattr(args, "path", None),
            fixture_path=getattr(args, "fixture_path", None),
        )
    except (ProviderNotAvailableError, TcoGtinHttpError, TcoGtinParseError) as exc:
        print(str(exc), file=sys.stderr)
        return 1
    _print_jsonl(items)
    return 0


def cmd_cert(args: argparse.Namespace) -> int:
    try:
        item = client.get_by_certificate(
            provider=args.provider, certificate_number=args.id, path=getattr(args, "path", None)
        )
    except (ProviderNotAvailableError, TcoGtinHttpError, TcoGtinParseError) as exc:
        print(str(exc), file=sys.stderr)
        return 1
    if item:
        print(json.dumps(item, ensure_ascii=False))
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="tco-cert")
    sub = p.add_subparsers(dest="cmd", required=True)

    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--provider", required=True, choices=["gtin-api", "csv", "productfinder-stub"])

    sp = sub.add_parser("search", parents=[common])
    sp.add_argument("--q")
    sp.add_argument("--brand")
    sp.add_argument("--model")
    sp.add_argument("--category")
    sp.add_argument("--gtin")
    sp.add_argument("--limit", type=int, default=20)
    sp.add_argument("--offset", type=int, default=0)
    sp.add_argument("--path")
    sp.add_argument("--fixture-path")
    sp.set_defaults(func=cmd_search)

    cp = sub.add_parser("cert", parents=[common])
    cp.add_argument("--id", required=True, help="certificate number")
    cp.add_argument("--path")
    cp.set_defaults(func=cmd_cert)
    return p


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":  # pragma: no cover
    sys.exit(main())
