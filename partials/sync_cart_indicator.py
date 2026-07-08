"""Ensure the site-wide cart indicator script is on every page.

Adds `<script src="/js/cart-indicator.js" defer></script>` inside <head> on every page
that carries the site header (detected by the #fullMenu drawer). Idempotent and safe to
re-run. It goes in <head> (with defer) — NOT inside the #fullMenu aside (some pages' menu
JS rebuilds the aside and drops embedded scripts) and NOT at end-of-body (on pages whose
last element is a big inline <script>, the trailing tag was not reliably parsed into the
DOM). Head parsing is reliable everywhere. cart-indicator.js guards on document.readyState
so defer-in-head is correct.

  python partials/sync_cart_indicator.py

Run this whenever a new page is added (same as partials/sync_nav.py).
"""
import glob
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Inline bootstrap that DYNAMICALLY loads the cart indicator. A static <script src> placed
# late in <head>/<body> was silently dropped by the parser on many marketing pages (the sole
# external script never entered the DOM). Inline scripts DO parse reliably, and a
# dynamically-created <script> element always loads — so we inject this right after <head>.
TAG = ('<script>/* site-wide cart indicator */(function(d){var s=d.createElement("script");'
       's.src="/js/cart-indicator.js";s.defer=true;(d.head||d.documentElement).appendChild(s);})(document);</script>')
SKIP = (".backups/", ".archive/", "node_modules/", "/partials/", "-old.html")


def targets():
    for path in glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True):
        rel = os.path.relpath(path, ROOT).replace("\\", "/")
        if any(s in "/" + rel for s in SKIP):
            continue
        try:
            html = open(path, encoding="utf-8").read()
        except Exception:
            continue
        if 'id="fullMenu"' not in html:   # only real pages with the site header/drawer
            continue
        yield path, rel, html


def main():
    added = present = 0
    for path, rel, html in targets():
        m = re.search(r"<head[^>]*>", html, re.IGNORECASE)
        if not m:
            print(f"  SKIP (no <head>): {rel}")
            continue
        # strip any prior placement (static tag or an older bootstrap) so re-runs don't double up
        cleaned = "".join(l for l in html.splitlines(keepends=True) if "cart-indicator.js" not in l)
        m = re.search(r"<head[^>]*>", cleaned, re.IGNORECASE)
        canonical = cleaned[:m.end()] + "\n" + TAG + cleaned[m.end():]
        if canonical == html:
            present += 1
            continue
        with open(path, "w", encoding="utf-8", newline="") as f:
            f.write(canonical)
        added += 1
        print(f"  set     {rel}")
    print(f"\ncart-indicator bootstrap: {added} set, {present} already correct")


if __name__ == "__main__":
    main()
