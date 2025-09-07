#!/usr/bin/env python3
"""Compile changelog fragments into the main CHANGELOG.md.

Why: avoids merge conflicts by collecting one fragment per PR in
``changelog.d/`` and stitching them into an "Unreleased" section.

The script prints the compiled changelog to STDOUT so contributors can preview
it without touching ``CHANGELOG.md``.  When ``RUN_MODE=write`` is set, the file
is overwritten.  The script is idempotent and safe to run multiple times.
"""

from __future__ import annotations

import os
import re
from pathlib import Path
from typing import List

ROOT = Path(__file__).resolve().parent.parent
CHANGELOG = ROOT / "CHANGELOG.md"
FRAGMENTS_DIR = ROOT / "changelog.d"


def load_fragments() -> List[str]:
    """Return fragment contents sorted by filename, skipping examples."""
    fragments = []
    for path in sorted(FRAGMENTS_DIR.glob("*.md")):
        if path.name.startswith("EXAMPLE"):
            continue  # Skip template fragment
        text = path.read_text().strip()
        if text:
            fragments.append(text)
    return fragments


def strip_unreleased(text: str) -> str:
    """Remove any existing Unreleased section so we can rebuild it."""
    return re.sub(r"^## Unreleased.*?(?=^## |\Z)", "", text, flags=re.MULTILINE | re.DOTALL).strip()


def compile_changelog() -> str:
    """Build the changelog string with a fresh Unreleased section."""
    base = CHANGELOG.read_text() if CHANGELOG.exists() else "# Changelog\n"
    base_body = strip_unreleased(base)
    # Drop leading title if present to avoid duplication
    base_tail = re.sub(r"^# Changelog\s*\n?", "", base_body).strip()

    fragments = load_fragments()
    unreleased_lines = ["## Unreleased"]
    unreleased_lines.extend(fragments)
    unreleased = "\n\n".join(unreleased_lines).strip()

    new_content = "# Changelog\n\n" + unreleased
    if base_tail:
        new_content += "\n\n" + base_tail
    return new_content + "\n"


def main() -> None:
    compiled = compile_changelog()
    if os.environ.get("RUN_MODE") == "write":
        CHANGELOG.write_text(compiled)
    else:
        print(compiled, end="")


if __name__ == "__main__":
    main()
