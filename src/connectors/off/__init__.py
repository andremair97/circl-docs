"""Open Food Facts connector emitting the universal product schema.

The module exposes `fetch_off` to retrieve data and `normalize_off` to map the
raw payload into the schema.  Both functions honour the `USE_OFF_V1` feature
flag so the connector can be rolled out gradually.
"""

from .adapter import fetch_off, normalize_off  # noqa: F401
