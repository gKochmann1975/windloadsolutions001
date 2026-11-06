# WindLoad Solutions - Claude Memory

## SEO Rules — DO NOT VIOLATE (established 2026-05-19)

These rules came out of a GSC indexing cleanup. Violating them risks Google manual
actions or wasted crawl budget. Read before adding new pages or schema markup.

### Structured data (JSON-LD)
- **NEVER** add `aggregateRating`, `reviewCount`, or `ratingCount` to schema unless
  the numbers reflect REAL customer reviews from a verifiable source (Stripe,
  Google Business Profile, Trustpilot, etc.). Fake review schema is one of Google's
  most-enforced policies and can trigger a sitewide manual action.
- If asked to add testimonials/social proof markup, push back and ask where the
  numbers come from. Made-up numbers are never acceptable.

### `<meta name="robots">` + sitemap.xml must agree
- A page tagged `noindex` must NOT appear in sitemap.xml. The contradiction
  confuses Google and wastes crawl budget.
- A page in sitemap.xml must NOT be tagged `noindex`.
- When you add a new page: pick one — public (in sitemap, `index, follow`) or
  private (out of sitemap, `noindex, nofollow`). Never both.

### Gated app pages
- Pages that require login or show "Upgrade Required" / "Welcome to X!" with no
  public-readable content must be `noindex, follow` with a `<link rel="canonical">`
  pointing to the corresponding marketing landing page.
- Example: `building-intelligence-platform.html` (gated app) → canonical to
  `building-intelligence-platform-landing.html` (real SEO target).

### "Coming Soon" / placeholder pages
- Must be `noindex, follow` and NOT in sitemap until the product ships.
- When the product launches: flip back to `index, follow` AND re-add to sitemap
  in the SAME commit.

### Pages that should always be `noindex, nofollow`
- account.html, dashboard.html, cart.html, login.html, admin.html
- All `*-success.html` and `*-cancel.html` (Stripe redirect targets)
- success.html, checkout-success.html, checkout-cancelled.html
- bip-shop-success.html, bip-shop-cancel.html
- calc-shop-success.html, calc-shop-cancel.html
- reset-password.html, join-team.html, download.html

### Subdomains — already blocked, keep them blocked
- `api.windloadcalc.com` — `/robots.txt` route in `backend/app.py` blocks all crawlers
- `calc.windloadcalc.com` — `/robots.txt` route + `noindex` meta in
  `webapp/wind_load_app.py` blocks all crawlers (subscriber-only Dash app)
- Do not undo these unless the user explicitly asks.

### Legacy URL redirects (GitHub Pages-safe pattern)
- GitHub Pages doesn't support server-side 301s. For legacy URLs, create
  `{slug}/index.html` stub files with:
  - `<meta name="robots" content="noindex, follow">`
  - `<link rel="canonical" href="{destination}">`
  - `<meta http-equiv="refresh" content="0; url={destination}">`
  - `<script>window.location.replace("{destination}");</script>`
  - Plain `<a href>` fallback in body
- Examples already in repo: `asce-7-wind-load-calculator/`,
  `components-and-cladding-wind-loads/`, `service-area/wind-load-analysis-idaho/`

---

## Shop / Pricing Page Format (apply to EVERY shop page — current + future products)

### Pricing-card CTA placement — ONE canonical order for EVERY pricing page
- **Canonical visual order, top → bottom, on every pricing card:**
  **plan name → description → PRICE → billing-note → CTA (Add to Cart / Choose plan / Contact Sales)
  → (or Start Free Trial link) → features.**
- The **CTA goes DIRECTLY UNDER the price block** (price + billing note). The **price is ALWAYS
  ABOVE the CTA — never below it.** Features go BELOW the CTA. Never pin the button to the bottom
  of the card.
- **`building-intelligence-platform-shop.html` is the reference layout.** Every other pricing page
  (`shop/windows-doors-shutters.html` + all future product shops) must match it. If they diverge,
  fix the other page to match BIP — do not change BIP.
- **Why:** (1) the price is the thing the user evaluates first, so it reads above the action;
  (2) all cards' buttons align on one line regardless of feature-list length — a bottom-anchored
  button makes columns look ragged; (3) the button is reachable on mobile without scrolling past a
  long list.
- **How:** card is `display:flex; flex-direction:column`. Either build the DOM already in the
  canonical order, OR set flex `order` ONCE so it resolves to that order. Do NOT use
  `margin-top:auto` on the CTA or a `flex:1`/`flex-grow:1` on the features that sinks it. Keep any
  "or Start Free Trial" link / billing toggle with the CTA, above the features.
- **REGRESSION TRAP (this has bitten twice):** on `windows-doors-shutters.html` the card DOM is
  `header, price, note, divider, features, button, trial-link` and the visual order is produced
  with flex `order` (`.pricing-cta{order:4}` sits after `.price-note{order:3}`). **NEVER set
  `.pricing-cta{order:1}`** — that pulls the button ABOVE the price. There must be exactly ONE
  `order` declaration per element; do not add a second "override" block that flips it.

### Card grids — never orphan a card
- Never leave a lone card alone on a row. Fit one row, else **2 per row** (4 → 2×2, not 3+1).
  Pricing-tier rows may be 3–4 across on wide desktop but must collapse responsively (→ 2×2 →
  1 col) so they never orphan. **Always 1 column on mobile.**

### CTA hover (same on every shop page)
- **Primary CTA** (Add to Cart / Choose plan): on hover, the blue gradient shifts to **vibrant green**
  `linear-gradient(135deg,#0a8f5b,#34D399)` (the "go/buy" signal) + `transform:translateY(-3px) scale(1.02)`
  + green glow `box-shadow:0 18px 42px rgba(16,185,129,.55)`.
- **Secondary CTA** (Contact Sales): on hover, **fills white with navy text** `background:#fff;color:#0d1233`
  + same lift/scale (set the contrasting text color in the SAME rule per the contrast rule — never white-on-white).
- The base button needs a `transition` (e.g. `transition:all .25-.3s ease`) so the color animates.
  Touch only `:hover` rules — never the structural `order`.

---

## Report & CTA Copy Rules — DO NOT VIOLATE

### The software output is an "Engineering Report" — NEVER "sealed"
- The software / subscription / calculator produces an **Engineering Report**. It is **NOT** a "sealed
  report", "sealed deliverable", "PE-stamped report", "PE-stampable PDF", or "stamped document." Never
  describe the software output as sealed or stamped.
- **PE sign-and-seal is a SEPARATE professional service** — in-house FL P.E. (residential ≤ 3 stories),
  PE network for other states. Copy may advertise that service ("PE sign-and-seal is available…",
  "24 years of PE-stamped projects"), but must never imply the *software* seals.
- Canonical correct wording is in `faq.html`: *"Is the software output a sealed report? No. The software
  produces an Engineering Report, not a sealed document. A PE sign-and-seal is a separate service…"*
- **Run `/check-report-copy` before committing any page copy that mentions reports, permits, or sealing.**

### Buy/upgrade CTA routing — product tool → product shop; general page → general catalog
- A **product-specific free tool** routes its upgrade/limit/lock popups + post-result CTA to **its own
  product shop with pricing**: free C&C (`free-wind-load-calculator.html`) → `/shop/windows-doors-shutters.html`;
  free MWFRS (`free-mwfrs-wind-load-calculator.html`) → `/shop/mwfrs.html`. Never send these to the
  general catalog or a generic landing.
- **General / multi-product pages** (state pages `*-wind-load-calculator/index.html`, audience pages,
  comparison) correctly route their buy CTAs and "All Calculators & Pricing" links to the **general
  catalog** `wind-load-calculator-shop.html`. This is intentional — do NOT "fix" them to a single product
  shop. Nav "Pricing" → general catalog everywhere (correct).

---

## Subscription Cancellation — Self-Serve (shipped 2026-07-20)

Customers can cancel themselves; before this they had to email support (there was NO cancel route).
- **Behavior: cancel-at-period-end, NOT immediate delete.** Access continues through
  `current_period_end`; Stripe then fires `customer.subscription.deleted` and status flips to
  `cancelled`. Reversible with "Resume" until the period ends. After it ends there is NO resume — the
  Stripe sub is gone; they must re-purchase via the shop.
- Backend: `POST /api/subscriptions/cancel` (owner-only; a `subscription_id`, or ALL the user's active
  owned subs if omitted) + `POST /api/subscriptions/reactivate`. Logic in `subscription_manager.py`
  (`schedule_subscription_cancellation` / `reactivate_subscription`; `_stripe_period_end` handles the
  item-nested Stripe field). `user_subscriptions.cancel_at_period_end` column. Webhook syncs the flag.
- Frontend: `account.html` Subscriptions tab — Cancel/Resume button per owned active sub.
- Locked users → shop: the calc gate redirects non-entitled users to `/?need=calculator|bip` on the
  dashboard, which now shows a banner routing them to the shop ("View Plans & Pricing"). Account page's
  "No Active Subscriptions" state also links to `wind-load-calculator-shop.html`.

## Calculator Wind-Parameter DEFAULTS + per-user "Set as my defaults" (shipped 2026-07-24)

- **App defaults changed to: Risk II · Nominal · Exposure B · Enclosed.** Greg confirmed
  Nominal + Exposure B on purpose (his FL residential/ASD base) even though they yield LOWER
  pressures — a "these are our defaults, but you can set your own; change to suit your project"
  note + per-section Help carry the responsibility. **Do NOT revert Nominal→Ultimate or B→C.**
- **Per-user defaults are backend-persisted**: `users.calc_defaults` JSON column +
  `GET/PUT /api/user/calc-defaults` (whitelisted keys) → BFF `/api/account/calc-defaults` →
  shared `calc-defaults.js`. Applied on a fresh calculator + New Project; a loaded project wins.
- **Per-section Help (ⓘ)** on Risk/Speed Type/Exposure/Enclosure + a **Florida-only** C&C
  Speed-Type note (shows only when detected state=FL): FBC adopts ASCE 7-22; C&C incl. roof C&C
  may use Nominal (ASD) ≈ ultimate×0.78 (ASCE 7-22 ASD load combos 0.6W apply to ALL C&C). This
  note is **C&C-only, NOT MWFRS**. On roofs it's roof-scoped; W/D gets a windows/doors version.
- **Status: roofs (`roof.html`, all 6 shapes) only.** Roll the SAME pattern to W/D, MWFRS×2,
  Other Structures×6, Specialty×2, Solar×2. Not yet verified: the live AUTHED save→reload.

## C&C component schedules — input classes must be UNIQUE (roof outage 2026-07-24)

- A schedule row's number inputs must NOT reuse a layout/utility class as their read selector.
  The roof row had `<td class="l">` (left-align) AND `<input class="num l">` (length); reading
  `tr.querySelector('.l').value` hit the `<td>` (document-order-first) → length `undefined` →
  every pressure showed "—". Fixed: length input is `num len`, read via `.len`. **Rule: unique
  input class (or read `input.num.<x>`); never reuse `.l`/`.w`-style classes across td + input.**
- **Audit calculators with `/audit-calculators`** (static selector-collision scan + the two
  report validators + on-screen headless). Only roof was affected; all other calcs verified clean.

## Customer HTML Email — LOGO RULE (Greg rejected the wrong logo 3×)

- **NEVER** use the raw `images/windloadcalc-logo.png` in an email — it's a 3000×3000 transparent SQUARE
  that renders as a giant white box with a tiny logo.
- **USE** the cropped horizontal wordmark `https://windloadcalc.com/images/windloadcalc-logo-email.png`
  (440×90, display `width="200" height="41"`), in a `<td align="center" style="...text-align:center">`
  with `<img style="display:inline-block">`. inline-block + text-align:center survives Gmail copy/paste;
  `margin:0 auto` does NOT (it left-shifts on paste).
- **ALWAYS render the email and look before sending** — run `/preview-email`. Seed from the Eduardo
  reference template, never clone an old customer email.

## IMPORTANT: Pre-Launch Checklist

### Before Going Live - MUST DO:
1. **Enable Email Normalization** - Prevent trial abuse
   - In Railway backend environment variables, ensure:
   - `NORMALIZE_EMAIL_ALIASES=true` (or remove the variable - defaults to true)
   - This prevents users from using `user+alias@gmail.com` for unlimited trials

2. **Switch Stripe to Production Mode**
   - Replace test API keys with live keys in Railway
   - Update webhook secret for production

---

## Project Overview

### Architecture:
- **Frontend**: windloadcalc.com (static HTML/CSS/JS hosted on GitHub Pages)
- **Backend**: Railway (Python/Flask API with PostgreSQL)
- **Payments**: Stripe (subscriptions)
- **Email**: SendGrid (transactional emails)
- **Auth**: Email/password + Google OAuth

### Key Products:
- **BIP** (Building Intelligence Platform) - HTML/JSON website tool
- **Wind Load Calculator** - Python/JSON calculation webapp
- **Free public calculators** (SEO funnel, no signup, 10 calcs/IP/day each):
  - C&C `free-wind-load-calculator.html` → `POST api/public/design-pressure` (single wall component)
  - MWFRS `free-mwfrs-wind-load-calculator.html` → `POST api/public/mwfrs-pressure` (one low-rise box,
    directional Ch. 27; Kzt=1.0). Per-tool 10/day quota via `_record_free_calc_usage(..., tool=)` in
    `backend/app.py` — tool-prefixed keys, no DB migration. Engines mirrored webapp/↔backend/.

### Domain Strategy:
- windloadcalc.com - Main product site
- windload.solutions - 100+ page authority site
- windload.co - Marketing landing pages

---

## Current Testing Status

Email normalization is **ENABLED in production** (set 2026-07-18). `NORMALIZE_EMAIL_ALIASES=true`
is live on Railway (windload-backend) — verified via `https://api.windloadcalc.com/health`
(`"normalize_email_aliases": true`). +alias trial abuse is blocked. Do NOT set it back to `false`
on production.

Environment variable: `NORMALIZE_EMAIL_ALIASES`
- `false` = allows +alias emails (testing only — never on prod)
- `true` = blocks +alias abuse (current prod setting)

NOTE: the backend's `ENVIRONMENT` var is still `development` (benign under gunicorn — Flask debug is
NOT active because `app.run()` never executes; only effect is SQL echo in logs + the email-normalize
default). Do NOT set `ENVIRONMENT=production` without first fixing `backend/app.py:~4001`, which
(inverted) would expose 500-error stack traces to API clients in production mode.

---

## Wind Velocity Data System - CRITICAL DOCUMENTATION

### Overview
The wind velocity lookup system uses **pre-calculated velocities stored in CSV** rather than external APIs. This ensures fast, accurate, and consistent results.

### Data Source: `usps_zip_codes.csv`
Located at: `webapp/usps_zip_codes.csv`
- Contains all ~33,000+ US ZIP codes
- Includes city, state, county, lat/lng for each ZIP
- **Pre-calculated wind velocities** for all 4 ASCE risk categories:
  - `velocity_risk_cat_1` - Risk Category I
  - `velocity_risk_cat_2` - Risk Category II
  - `velocity_risk_cat_3` - Risk Category III
  - `velocity_risk_cat_4` - Risk Category IV

### How Wind Velocities Were Determined

**The Problem (Before):**
- External APIs (ASCE Hazard Tool) were slow, rate-limited, inconsistent
- Runtime interpolation from contour lines gave inaccurate results
- Different sources disagreed on wind speeds

**The Solution:**
1. **Obtained official ASCE 7-22 wind speed maps** (PNG images for each risk category)
2. **Manually traced contour boundaries** from the maps
3. **Encoded boundaries as geographic rules** in `webapp/wind_velocity_assignment.py`
4. **Ran rules against all ZIP codes** to populate CSV with pre-verified velocities

### Key Files

| File | Purpose |
|------|---------|
| `webapp/usps_zip_codes.csv` | Master database with all ZIP codes and velocities |
| `webapp/usps_zip_data.py` | Python module to load/query CSV data |
| `webapp/wind_velocity_assignment.py` | Geographic rules for velocity assignment |
| `webapp/velocity_finder_core.py` | Main velocity lookup engine |
| `webapp/asce_wind_processor/` | Tools for processing ASCE map images |
| `website/building-intelligence-platform.js` | BIP frontend (loads same CSV) |

### How Lookups Work

```
User enters: ZIP code, City/State, or Address
            ↓
    Extract/Find ZIP Code
            ↓
    Look up in usps_zip_codes.csv
            ↓
    Return pre-calculated velocity from correct risk category column
```

### Geographic Rules Example (`wind_velocity_assignment.py`)

```python
# Florida - highest wind speeds on east coast
if state == 'FL':
    if lat < 26 and lng > -81:
        return 170  # Southeast Florida coast/Keys
    if lng > -80.5:
        return 160  # East coast
    if lat < 26.5 and lng < -82:
        return 150  # Southwest Florida
    ...
```

---

## UPDATING FOR NEW ASCE VERSIONS (e.g., ASCE 7-28)

When a new ASCE 7 version is published, follow this process:

### Step 1: Obtain Official Maps
- Get official ASCE 7-XX wind speed maps for all risk categories (I, II, III, IV)
- Maps should be high-resolution PNG or PDF
- Place in `webapp/asce_wind_processor/test_images/`

### Step 2: Trace Contour Boundaries
- Study each map and identify wind speed contour lines
- Note lat/lng boundaries where speeds change
- Document coastal vs inland transitions
- Pay special attention to:
  - Hurricane-prone regions (Florida, Gulf Coast, Atlantic Coast)
  - Special wind regions (Alaska, Hawaii, territories)
  - Local jurisdiction overrides

### Step 3: Update Geographic Rules
- Edit `webapp/wind_velocity_assignment.py`
- Create new functions: `get_wind_velocity_risk_cat_X_asce7_XX()`
- Encode the traced boundaries as lat/lng conditions
- Test with known locations to verify accuracy

### Step 4: Regenerate CSV
- Run the velocity assignment against all ZIP codes
- Update CSV columns or add new version-specific columns
- Verify sample locations match official ASCE values

### Step 5: Update Frontend/Backend
- Update `usps_zip_data.py` to read new columns
- Update `velocity_finder_core.py` for new version logic
- Update BIP JavaScript to use new data
- Add version selector if supporting multiple ASCE versions

### Step 6: Validate
- Test at least 20-30 locations across different regions
- Compare results with ASCE Hazard Tool for verification
- Document any discrepancies and their resolution

### Important Notes
- NEVER rely solely on external APIs for production
- Always maintain local CSV as primary data source
- Keep backups of previous ASCE version data
- The `asce_wind_processor/` folder has tools that may help with map analysis
