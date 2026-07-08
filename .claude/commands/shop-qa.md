---
description: QA a shop/pricing page — cart adds correctly (badge + green confirm + checkout link), catalog is synced, pricing agrees, SEO/mobile clean
argument-hint: "[shop page path or live URL, or blank for all]"
allowed-tools: Bash, Read, Grep, Edit
---

Run the full shop-page QA gate for: **$ARGUMENTS** (blank = all shop pages). Fix ROOT causes, never just the symptom. This encodes the 2026-07-08 MWFRS Add-to-Cart bug (stale `PRODUCT_CATALOG` → silent "coming soon" → no cart count) — see `website/CLAUDE.md` → "Shop / Pricing Page Format" → "Add-to-Cart behavior" and memory `feedback_shop_add_to_cart_standard`.

1. **Static cart-catalog lint (mechanical, always run):**
   `cd website && node scripts/check-cart.js $ARGUMENTS`
   Every sellable `data-product-code` must have a live (non-`comingSoon`) `js/shopping-cart.js` `PRODUCT_CATALOG` entry with the correct **Save-20% (×9.6)** price, and the page must include `shopping-cart.js` + `cart-header.js`. CRITICAL findings block. When a product goes live, un-flag/add its catalog entry with the correct price **in the same change**.
   Also run `node scripts/check-seo.js $ARGUMENTS` and `node scripts/check-mobile.js $ARGUMENTS`.

2. **Headless click test (run whenever the live page or a local server is reachable) — VERIFY WITH DATA, never eyeball:**
   With puppeteer-core (Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`; puppeteer-core lives in the session scratchpad `node_modules`): load the shop page, clear `localStorage.windloadcalc_cart`, then click each Add-to-Cart and assert ALL of:
   - the header badge (`#header-cart-badge`) becomes visible and its count **increments**;
   - the clicked button turns green and reads **`✓ Added to Cart`** (`.in-cart`);
   - a **`.cart-jump` "Go to checkout →"** link appears right after it;
   - `localStorage.windloadcalc_cart` contains the item at the right `billingCycle`;
   - **no `dialog`** fires ("coming soon" = bug).
   (Reuse `scratchpad/cart_verify_live.js` if present.) Test every tier card, and re-check a currently-live page (e.g. Windows/Doors) as a regression.

3. **Pricing consistency:** the card's annual = monthly × 9.6 ("Save 20%"), and the Stripe price + prod DB `stripe_annual_price_id`/`annual_price` + the `PRODUCT_CATALOG` annualPrice + the page text must ALL agree. If money is involved, create+expire a live Stripe Checkout Session to confirm the amount, and never invent prices.

Report CRITICAL/HIGH findings and what you fixed. Do not claim done until the headless click test passes on the deployed page.
