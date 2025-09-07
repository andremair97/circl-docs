#!/usr/bin/env python3
"""Compile changelog fragments into PROJECT_CHANGELOG.md.

Why: avoid merge conflicts by keeping one fragment per PR that is stitched
into the project changelog automatically on merge."""

from __future__ import annotations

import datetime as _dt
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FRAGMENTS_DIR = ROOT / "changelog"
OUTPUT_FILE = ROOT / "PROJECT_CHANGELOG.md"


def main() -> int:
    """Build the changelog and remove processed fragments."""
    fragments = sorted(
        p for p in FRAGMENTS_DIR.glob("*.md") if p.name not in {"README.md", "0000-example.md"}
    )
    if not fragments:
        # Nothing to do; keep existing changelog untouched.
        return 0

    today = _dt.date.today().isoformat()
    lines = ["# PROJECT_CHANGELOG", "", f"## {today}", ""]
    for frag in fragments:
        lines.append(frag.read_text().strip())
        lines.append("")  # blank line between entries
    OUTPUT_FILE.write_text("\n".join(lines).rstrip() + "\n")

    # Remove fragments after compiling so they aren't re-used.
    for frag in fragments:
        frag.unlink()
    return 0


if __name__ == "__main__":  # pragma: no cover - script entry point
    raise SystemExit(main())
