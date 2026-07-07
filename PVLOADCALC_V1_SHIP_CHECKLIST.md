# PVLoadCalc v1 — Ship Checklist (Ground-Mount Solar Wind)

**Created 2026-06-29.** Turns the *already-verified* ground-mounted solar wind engine into a
sellable v1. This is **wiring, not new math** — the §29.4.5 calculations are user-book-verified
(see `ASCE 7-22/SOLAR_29.4_VERIFICATION_WORKSHEET.md`, banner lifted 2026-06-28).

> **Strategy:** ship the verified wind core now as PVLoadCalc v1, then morph it on the SAME
> backend into the full "does-everything" tool (v2 snow/combos → v3 seismic → v4 racking →
> v5 foundation = SkyCiv parity). See the solar full-package memory for the morph roadmap.

---

## v1 SCOPE (hold the line)
- **IN:** ASCE 7-22 **wind** loads for **ground-mounted** PV (§29.4.5). Snow is auto-attached
  for ground (`_attach_snow(..., is_ground=True)` in `calc_api.py`) → include it as a bonus.
- **OUT (stays admin-only / later versions):** rooftop solar, racking (ADM), foundation
  (AISC/ACI + lateral pile), seismic (free USGS, later), tracker dynamics.
- **Stack:** Flask `webapp/flask_app/` (the live/future stack — NOT Dash `cc_solar_v2.py`).

---

## 0. PRE-FLIGHT — verify, don't assume (never-theorize rule)
- [ ] Confirm the ground-solar endpoint returns the **verified** flag live (no "pending" banner).
      Memory says flipped (`verified:true`, `values_verified=True`), but the `calc_api.py`
      docstrings (≈L904/L933) still read *"ADMIN-ONLY, pending verification"* — **reconcile**:
      fix the stale docstrings + confirm runtime flag.
- [ ] Confirm the engine in use is **`asce7_22_other_solar_ground.py`** (NOT the legacy
      `cc_solar_ground_mount.py` referenced in the old product map).
- [ ] Run ground-solar engine tests green (WE-15 static, WE-21 zone overrides, WE-22 dynamic).

## A. UN-GATE (admin-only → customer-visible)
- [ ] Ground-solar route is currently admin-only (`flask_app/__init__.py` product-exists gate
      ≈L59 + `flask_app/admin_gate.py` `STAGING_ADMIN_ONLY`).
- [ ] Choose the customer model: **visible-but-locked → shop** (per
      `roadmap_roofs_mwfrs_subscriptions` pattern) vs fully open. Recommend visible-but-locked.
- [ ] Add ground-solar to the customer-visible set / map it to its Stripe product (see B).

## B. STRIPE PRODUCT + PRICING
- [ ] **Decide:** standalone "PVLoadCalc — Ground-Mount Solar Wind" product vs fold under the
      existing `cc_solar` bundle. (Standalone fits the PVLoadCalc brand + per-calc dynamic model.)
- [ ] Create Stripe product **test mode first**, then live (follow `reference_stripe_mwfrs_products`
      + `scripts/stripe_payment_link.sh` patterns; WLS account).
- [ ] Update `backend/config.py`:
  - [ ] `SUBSCRIPTION_PRODUCTS` — add the new product code.
  - [ ] `CALCULATOR_PRODUCT_MAP` — map **`asce7_22_other_solar_ground.py`** (the REAL engine)
        to the product. *(Current map only lists the stale `cc_solar_ground_mount.py`.)*
- [ ] **Verify the product row exists in the LIVE DB** (per `audit_subscription_gating_2026_06_22`
      — the `mwfrs` row was missing in prod). Mirror webapp/↔backend/ if shared.
- [ ] Pricing per `project_pricing_model_design` (à-la-carte ≥ bundle; NO sealing in pricing).

## C. REPORT / DELIVERABLE
- [ ] Solar Engineering Report (HTML) exists: `/api/report/solar` + `solar_report.py`.
- [ ] **Add PDF export** (Excel optional) — reuse the exporter the MWFRS/other reports use;
      `solar_report.py` already has the `export-toolbar` div, export not wired.
- [ ] Language audit: "**Engineering Report / permit-ready exports**" — NEVER "sealed"
      (`feedback_no_sealed_reports_in_software`).
- [ ] Confirm report includes wind result + snow (when `snow_pg` provided) + Ch 2 load combos.

## D. UI / SHELL / NAV
- [ ] `solar-ground.html` on the Flask "Aurora Rail" shell; header via calc-shell single-source.
- [ ] Visible sidebar/nav entry for Ground-Mount Solar (nav active-selection truth sources).
- [ ] Inputs wired & labeled: risk cat, location (ZIP/lat-long → wind V from CSV), Lc, Wg,
      tilt ω, mean height h, row spacing S, exposure, Kzt. (Ground = open structure; the
      four-enclosure cards do NOT apply here.)
- [ ] Mobile pass: `node scripts/check-mobile.js`. SEO pass: `node scripts/check-seo.js`.

## E. HAZARD-DATA INPUTS (status)
- [x] Wind velocity: ZIP → V from `usps_zip_codes.csv`.
- [x] Snow p_g: embedded ASCE Hazard Tool + required manual entry.
- [ ] (Seismic deferred to a later version — free keyless USGS `building-codes/asce7-22/calculate`.)

## F. FRONT DOOR (decide — can defer)
- [ ] **Option 1 (recommended for v1):** launch under the existing calc app
      (`calc.windloadcalc.com`) to validate demand — no domain commitment.
- [ ] **Option 2:** stand up **pvloadcalc.com** (chosen, not yet purchased). One backend,
      point the domain at the shared Flask stack (BIP pattern). Gated app pages `noindex` +
      canonical to a marketing landing (CLAUDE.md SEO rules).

## G. QA / LAUNCH GATES
- [ ] Engine values verified ✅ — do NOT re-open.
- [ ] Post-page QA standard (6 checks) + Calculator Readiness Matrix 4 gates.
- [ ] Checkout end-to-end (test mode): purchase → grant → calc unlocks → report PDF exports.
- [ ] Guard the known traps: legacy-account checkout, team-union subscription check,
      webhook double-grant.

---

## DEFINITION OF DONE (v1)
A non-admin user can: find Ground-Mount Solar in nav → see it locked → buy it (Stripe) →
get access → run an ASCE 7-22 §29.4.5 wind calc (with snow + combos) → export a permit-ready
PDF Engineering Report. All on verified numbers, on the Flask stack.
