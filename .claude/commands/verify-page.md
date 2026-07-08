---
description: Headlessly verify a windloadcalc.com page on the LIVE site (redirect-aware) — never trust a localhost test of a marketing page
argument-hint: "[page path/URL, e.g. /shop/mwfrs.html or wind-load-calculator-landing.html]"
allowed-tools: Bash, Read
---

Verify the page **$ARGUMENTS** on the LIVE site with a headless browser (puppeteer-core; Chrome at
`C:/Program Files/Google/Chrome/Application/chrome.exe`). Encodes two traps that cost real time on
2026-07-08 (see memory `lesson_marketing_page_redirect_and_script_traps`).

**TRAP 1 — marketing pages hard-redirect `http`→`https://windloadcalc.com`.** A local `python -m http.server`
test of any marketing page (index, landing, why-us, state pages, …) silently navigates to PRODUCTION,
so you end up testing the live site, not your local edit. Shop pages (`/shop/*`) do NOT have this
redirect, so they test fine locally. Therefore: **verify marketing-page changes on the LIVE site after
deploy** (poll `/api/health`… no — that's the app; for the static site poll the file, e.g.
`curl -s https://windloadcalc.com/<page> | grep <marker>`), or, if you must test locally, assert the
final URL and bail if it left localhost.

**Always assert `page.url()` after `goto`** — if it doesn't match the URL you requested, a redirect moved
you; your assertions are running against the wrong page. `htmlHasStr` (does the parsed DOM contain a
string you know is in the file) is the fastest "am I even looking at my file?" check.

**TRAP 2 — a static `<script src>` placed late in `<head>`/`<body>` was silently dropped by the parser on
many marketing pages** (the sole external script never entered the DOM). If you need a script on every
page, load it via a tiny inline bootstrap that creates the `<script>` dynamically (see
`js/cart-indicator.js` + `partials/sync_cart_indicator.py`), not a static tag. When a "script isn't
running" check fails, first confirm the tag is even in the DOM (`document.querySelector('script[src*="…"]')`)
before assuming the script is broken — and confirm your test's own assertion isn't the bug (e.g.
`typeof X==='function'` when `X` is an object).

Steps:
1. Load `https://windloadcalc.com/$ARGUMENTS` headless; assert `page.url()` matches (no surprise redirect);
   capture console/page errors.
2. Assert what the change was supposed to do (element present, text correct, etc.).
3. For anything cart-related, also verify persistence: add on a `/shop/*` page, then `goto` a different
   page and confirm `#wlc-cart-indicator` shows with the right `#wlc-cart-count` (the count lives in
   `localStorage.windloadcalc_cart`). Run `cd website && node scripts/check-cart.js` too.

Report the final URL, each assertion, and any console errors. Don't claim a marketing-page change is live
until it's confirmed on windloadcalc.com itself.
