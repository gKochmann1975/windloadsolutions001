# Calculator Release & Testing Runbook
*Created 2026-06-27. How to test the per-calculator subscription system in the admin
view before go-live, the repeatable checklist to push each calculator live, the nav-menu
rollout milestone, and the B4 webhook idempotency test+deploy plan.*

> **Golden rule (two gates, both required).** A calculator may flip to **live/sellable**
> only when BOTH are true:
> 1. **The calculator is finished & verified** — engine + UI work, and every ASCE value
>    is book-verified (see `reference_asce_7_22_verified_values`, `UNVERIFIED_FIGURE_VALUES_WORKLIST.md`).
> 2. **The billing plumbing exists** — Stripe product/prices, DB product row with the
>    correct `calculator_file`, the per-calc permission gate, and the `live` switch.
>
> Completeness is **upstream** of "sellable." Never flip a calc live just because pricing
> exists. Never claim a calc is verified without data (Stripe test-mode + DB checks below).

---

## STATUS — updated 2026-07-01

### ✅ Done this session (2026-07-01)
- **Stripe LIVE aligned** for MWFRS: 3 tiers at v3 (Starter $35/$350, Pro $59/$590, Premium
  $149/$1490), `product_code` metadata added to the live `prod_UmKa…` products, old prices
  archived. 0 MWFRS subscribers affected. (Ran `backend/align_mwfrs_stripe_v3.py --apply` with
  the full live key; script compat + rk_live_ mode bugs fixed.)
- **MWFRS marketing page LIVE & correct**: `shop/mwfrs.html` — pricing cards moved to the TOP
  (first section after hero, matching W/D), recolored **blue `#3b82f6` to match its shop card**,
  card flipped **"Coming soon" → "● Available now"**, `robots` → `index,follow` + added to
  `sitemap.xml`, `rel=nofollow` removed from MWFRS footer links across 30+ pages.
- **All 5 shop pages branded by color** (W/D green, MWFRS blue, Roofing orange, Solar yellow,
  Specialty purple): backgrounds now lead with each page's brand color (aurora + hero glow +
  panels recolored; navy chrome kept). Colors must match the category-card `--ac` on
  `wind-load-calculator-shop.html`.

### ⚠️ PENDING before promoting MWFRS purchases to customers (do NOT send the newsletter first)
The shop page is live and Stripe is aligned, but a real purchase must be proven to **complete
AND unlock** end-to-end. Finish runbook `GO_LIVE_RUNBOOK_JULY1.md` Steps 3–5:
- Deploy backend `feat/mwfrs-gating` + webapp `feat/mwfrs-sellable`.
- Seed prod DB `mwfrs_*` rows + wire the canonical live price IDs (recorded in the runbook).
- **Verify:** god-mode grant (no money) + one `4242` test purchase → MWFRS unlocks, exactly one sub row (B4). This closes the B2 "paid-but-locked" trap.

### 📣 Business / sales follow-ups (raised 2026-07-01 — discuss, not tonight)
1. **MWFRS launch Newsletter** — review + prepare an announcement to **current members** to
   purchase MWFRS. Gate on the purchase-flow verification above. (See `feedback_security_framing_and_support_phone` for tone + the (833) support line.)
2. **Lockheed Martin** wants to buy MWFRS — will need **another PO** (repeat purchase). Blocked on ↓.
3. **Define the PO process on our system** — how a PO is intake'd, invoiced, and fulfilled
   (grant entitlement without a Stripe card-checkout; comp/admin-grant path exists via
   `backend/admin_routes.py`). Needs a documented workflow.
4. **Customer-logo advertising** — research whether we may display customer logos (e.g.,
   Lockheed Martin) on the site — trademark/permission/PO-terms. **Deferred ("not now").**

### Next products to go live (waitlist → priced), each via the two-gate golden rule
Roofing, Solar, Specialty — recolored/branded but still "Launching Soon"; add priced cards at
top + Stripe + backend when each is verified & sellable, the same way MWFRS was done.

---

## 0. Where everything lives (the switches & files)

| Concern | File | What it controls |
|---|---|---|
| **Sellable flag (source of truth)** | `webapp/flask_app/account_proxy.py` → `PROGRAMS[].live` | Picker shows a calc as buyable vs "Coming soon" |
| Owned-detection | `account_proxy.py` → `_program_for_code()` | Maps a user's subscription product_code → program |
| (program,tier)→Stripe code | `account_proxy.py` → `_LIVE_CHECKOUT_CODE` | Which Stripe product a live calc checks out as |
| Per-user catalog API | `account_proxy.py` → `/api/account/calculators` | Returns each user's `owned` + `live` programs |
| Checkout API | `account_proxy.py` → `/api/account/billing/checkout` | Live → Stripe checkout; else "coming soon" |
| Admin god-mode grant | `account_proxy.py` → `/api/account/admin/{catalog,grants,grant,revoke}` | Grant/revoke any calc to any user (admin only) |
| Picker UI + prices | `webapp/flask_app/static/add-calculators.js` → `PROGRAMS`, `TIERS` | Tier × multiplier prices, bundle nudge (mirror of the BFF list) |
| Nav menu + locks | `webapp/flask_app/static/shell.js` → `MENU`, `effectiveState()`, `ENTITLE`, View toggle | Locked vs unlocked per entitlement; admin View toggle |
| Seat limits | `backend/team_routes.py` → `SEAT_LIMITS` | Seats per product tier |
| Entitlement check | `backend/permissions.py` (exact `calculator_file` match) | Whether a user may run a calc |
| Admin grant backend | `backend/admin_routes.py` → `/api/admin/users/grant-subscription` | Comp a sub (bypasses Stripe) |
| Checkout webhook | `backend/subscription_manager.py` → `handle_checkout_completed` | Creates subs on payment (B4 idempotency fix) |
| Calc endpoint gates | `webapp/flask_app/calc_api.py` (`require_admin_api()` today) | Currently admin-only for all non-W/D calcs |

**Keep two lists in sync:** `account_proxy.py PROGRAMS` (server truth) and
`add-calculators.js PROGRAMS` (client display). The server's `live` list always wins —
the client fetches it from `/api/account/calculators`.

---

## 1. Environments

| Env | URL | Branch | Notes |
|---|---|---|---|
| **Staging** (test here) | `worthy-delight-production-4763.up.railway.app` | `feat/flask-multicalc` | Locked admin-only via `STAGING_ADMIN_ONLY`. Auto-deploys on push. |
| **Live calc app** | `calc.windloadcalc.com` | `feat/flask-migration` | Customer-facing. Promote per-calc here. |
| **Backend API** | `api.windloadcalc.com` | `main` (separate repo) | Handles real payments. Has its own `ADMIN_KEY`, Stripe keys. |

**Pre-reqs on the Flask service(s):**
- `ADMIN_KEY` env var set **and matching the backend's** `ADMIN_KEY` (the god-mode grant
  panel needs it; it's injected server-side, never sent to the browser). If unset, grant/revoke
  return a clear 503.
- Know whether Stripe is in **test** or **live** mode before clicking any checkout.

---

## 2. PART A — Test the system in the ADMIN view (no real money)

Do all of this on **staging** while logged in as an admin. The god-mode grant panel lets
you simulate a paying customer end-to-end **without a real charge**.

### A1. Admin view — sanity
- [ ] Account page loads; inputs are clearly visible (contrast fix).
- [ ] **"Grant Calculator Access"** (ADMIN) panel is present.
- [ ] Sidebar shows a **View: Admin / Customer** toggle.
- [ ] In **Admin** view, every calc shows the `ADMIN` badge and clicking opens its page.

### A2. Customer-preview — locks & picker
- [ ] Flip the View toggle to **Customer**.
- [ ] Every calc you don't "own" becomes **locked**; clicking opens the **Add picker**
      pre-selected to that calc.
- [ ] In the picker: Starter/Pro/Premium changes prices by the multiplier; Monthly/Annual
      toggles (annual = ×10); the **"WindLoad Complete" nudge** appears when à-la-carte ≥ bundle.
- [ ] Live calc (W/D) shows a price + "Continue to secure checkout"; not-yet-live calcs show
      **"Coming soon"**; split-outs with no price show **"Pricing soon"**.
- [ ] Selecting only coming-soon calcs → CTA = "Notify me"; submitting returns "we'll email
      you," **charges nothing**.

### A3. Simulate a paying customer with god-mode grant (the key test)
This proves the unlock path without Stripe.
1. [ ] Create/choose a **test account** (a real registered user; grant 404s on unknown email).
2. [ ] In the ADMIN panel: pick a calculator → enter the test email → **Grant**.
3. [ ] Confirm it appears under "Users with access."
4. [ ] Log in as that test user (or use admin impersonation):
   - [ ] The granted calc shows **unlocked** in the nav and links to its page.
   - [ ] The picker shows it as **"In your plan"** (green, not selectable).
   - [ ] The calc page loads and runs (entitlement check passes).
5. [ ] Back in the ADMIN panel: **Revoke** the test user.
   - [ ] The calc re-locks for them; the page denies access again.

> This is your standard pre-launch acceptance test for **every** calc: grant → verify
> unlock → revoke → verify re-lock. No money involved.

### A4. Real checkout — Stripe TEST mode only
Only for a calc whose billing plumbing is wired (W/D today).
1. [ ] Confirm Stripe is in **test mode**.
2. [ ] In the picker, select the live calc → "Continue to secure checkout."
3. [ ] Complete with a Stripe **test card** (`4242 4242 4242 4242`).
4. [ ] Confirm the webhook creates the subscription and the calc unlocks for that user.

---

## 3. PART B — Per-calculator go-live checklist (repeat for EACH calc)

Copy this block per calculator. Order to release (your plan):
**MWFRS + Roofs → Signs → Rooftop Equipment → Chimneys & Tanks → Solar → Telecom Towers.**

### B0 — Calculator is finished & verified (GATE 1)
- [ ] Engine implemented; UI works on the multi-calc shell. *(All 18 engines are wired to the
      admin UI as of 2026-06-28 — see `CALCULATOR_READINESS_MATRIX.md`.)*
- [ ] **All ASCE values book-verified** (cross-ref `UNVERIFIED_FIGURE_VALUES_WORKLIST.md`;
      no `# VERIFIED` on unverified figure values).
- [ ] Sample calculations validated against known references (engine-level: the WE-test suite,
      `webapp/testing/validate_asce7_22.py`).
- [ ] **Golden-report check — the TRUE test (PART E):** for any calc with a published ASCE 7-22
      *Wind Loads Guide* worked example, run that example's exact inputs through the live
      **Engineering Report** and confirm the report's final design numbers match the Guide's
      published answer (within tolerance, accounting for the Kd-in-qz convention). The customer's
      deliverable is the report — verifying the engine in isolation is necessary but **not
      sufficient**. A calc with a Guide example does not pass GATE 1 until its golden-report passes.

### B1 — Backend entitlement wiring (fixes gating-audit B1/B2)
- [ ] Define the **canonical `calculator_file`** identifier for this calc (the real engine
      module name the Flask endpoint will check, e.g. `asce7_22_mwfrs_directional.py`).
- [ ] Replace `require_admin_api()` on the calc's Flask endpoint(s) in `calc_api.py` with the
      **W/D-style entitlement check** (`/api/permissions/check` with that `calculator_file`).
      Keep an admin bypass so you can still test.
- [ ] Remove this calc from the admin-only route gate so **entitled customers** can load the page.

### B2 — Product taxonomy + Stripe (fixes B3)
- [ ] Lock the **price** (for split-outs currently "Pricing soon": Rooftop Equipment,
      Chimneys & Tanks, Telecom — set the v3 base before launch).
- [ ] Create the **Stripe products/prices** at the 3 tiers (Starter ×1.00 / Pro ×1.69 /
      Premium ×4.26; annual = ×10). (MWFRS tier products already exist — see `PRICING_TABLE.md`.)
- [ ] Create/clean the **`SubscriptionProduct` DB row(s)** with: correct `calculator_files`
      (matching B1), correct prices, and `stripe_*_price_id` links.
- [ ] Add seat limits to `team_routes.py SEAT_LIMITS` for the new product codes.

### B3 — Flip the switches (UI)
- [ ] `account_proxy.py PROGRAMS`: set this program `"live": True`.
- [ ] `account_proxy.py _LIVE_CHECKOUT_CODE`: add `(program, tier) → product_code` for each tier.
- [ ] `add-calculators.js PROGRAMS`: set the program's `base` price (if it was `null`).
- [ ] Confirm `_program_for_code()` maps the new product codes → this program (owned-detection).

### B4 — Verify on staging, then promote
- [ ] Deploy to **staging**; run the **Part A** test matrix for this calc (grant→unlock→revoke,
      then a Stripe **test-mode** purchase → unlock).
- [ ] Confirm a paying customer (non-admin) can: see it unlocked, open it, run it, get a report.
- [ ] Promote to **live** (`feat/flask-migration` → `calc.windloadcalc.com`) and re-verify with
      one real test account.

### B5 — Post-launch
- [ ] Watch the first real purchases: exactly **one** `UserSubscription` row each (B4 fix), one receipt.
- [ ] Spot-check the calc page + report for the first customer.

---

## 4. PART C — Nav-menu rollout milestone (when program #2 ships)

**Today:** one program (W/D), so customers don't need the calculator menu.

**At the moment the 2nd program goes live**, the customer experience changes — this is a
one-time milestone, not per-calc:

- [ ] The **sidebar nav becomes customer-facing** (it already renders entitlement-driven via
      `shell.js`): owned calcs link to their page; everything else is **locked**.
- [ ] **Badges:** show **"Coming soon"** on not-yet-live calcs and a **lock + "Add"** on
      live-but-unpaid calcs.
  - *Refinement to implement here:* `shell.js effectiveState()`/`navItem()` already has
    `ENTITLE.live`. Use it so a **not-owned + not-live** item shows a **"Soon"** badge
    (instead of "Add"), and a **not-owned + live** item shows the **lock + "Add"** (→ picker).
    Owned items are unlocked.
- [ ] **Locks on everything the user hasn't paid for** — clicking a locked item opens the
      Add picker (coming-soon calcs say "notify me"; live calcs go to checkout).
- [ ] Verify the menu on mobile (collapsed rail) and that the View toggle is admin-only.

Net customer view after this milestone: a full menu where they see what they own (unlocked),
what they can buy now (lock + Add), and what's coming (Soon badge).

---

## 5. PART D — B4 webhook idempotency: test & deploy

**What it fixes:** Stripe can retry a `checkout.session.completed` webhook; the old handler
inserted a new `UserSubscription` per delivery → duplicate active rows for one payment. The
fix (in `backend/subscription_manager.py`) guards on `(user, product, stripe_subscription_id)`
and skips duplicates, and skips re-sending the receipt on a pure replay. (Mirrors the existing
`FileDelivery` guard.) It is **data-integrity** hardening — it does not change Stripe charging.

**Status:** written, **not yet verified** against a live event. Verify before deploy.

### D1 — Verify in Stripe TEST mode
1. [ ] Point a backend (staging/local) at a **test** DB + Stripe **test** keys.
2. [ ] Complete a test checkout → confirm **one** `UserSubscription` row + one receipt.
3. [ ] In the **Stripe Dashboard → Developers → Events**, find that
       `checkout.session.completed` and **Resend** it (or use Stripe CLI
       `stripe events resend <evt_id>`).
4. [ ] Confirm the DB **still has exactly one** row for that purchase (the replay was skipped)
       and **no second receipt** email was sent.
5. [ ] Repeat for a **multi-product cart** (when carts exist): replay → still one row per product.

### D2 — Deploy to production backend
- [ ] Review the diff. Commit to a **branch** first (not `main`) for review.
- [ ] On explicit go: merge to `main` → backend redeploys (`api.windloadcalc.com`).
- [ ] **Verify live:** after deploy, confirm a real test-account purchase creates one row;
      check logs for the `↺ Duplicate webhook … skipping` line if Stripe happens to retry.

> Do not push billing changes straight to `main` without the test-mode replay passing first.

---

## 6. PART E — Golden-report validation against the ASCE 7-22 Wind Loads Guide (the TRUE acceptance test)

**The principle (Greg, 2026-06-28):** the engineer-facing product is the **Engineering Report**, not
the engine. The real proof that a calculator is correct is that **our generated report produces the
same answers as the worked examples we verified against in the *ASCE 7-22 Wind Loads — Guide to the
Wind Load Provisions*** (Stafford & Reinhold). Engine unit tests (the WE suite) validate the math in
isolation; the report path (endpoint → report generator → rendered HTML) is a **separate surface that
can drift** — the Sealed-Deliverable audit (`audit_sealed_deliverable_pipeline_2026_06_22`) already
caught a report hardcoding Kz/Ke/qh and under-reporting qh by 28–56%. So we validate the **report
output end-to-end**, not just the engine.

> **Status (2026-06-28):** harness `webapp/testing/validate_reports_vs_guide.py` — **60/60 published
> answers matched** across: MWFRS Directional + Envelope (Ex 4.1), Rooftop Equipment (Ex 5.2),
> Domed Roof (Ex 6.7), C&C Flat (Ex 6.1) + Gable (Ex 6.2) at pressure level, C&C Hip (Ex 6.3) +
> Monoslope (Ex 6.5) at GC<sub>p</sub> level (pressures conservative — engine floors Exp-B K<sub>z</sub>
> to 0.70 vs the book's raw 0.57/0.62; disclosed). Rendered reports in `ASCE 7-22/guide_report_crossref/`.
> **Generic report generator** (`generate_generic_engineering_report`) built; **UI "Generate Engineering
> Report" buttons + `/api/report/{equipment,arched-dome,roof}` endpoints wired**. **ALL roof Guide
> examples + rooftop solar (Ex 5.3) now proven at report level (64/64).** Remaining: route
> `/api/report/solar` to the **parallel** method (needs a Ch-30 GC<sub>p</sub> input) for the §29.4.4 case;
> and the **Other-Structures** report paths (signs/walls/towers/chimneys/open-signs) — none have a Guide
> worked example, so those would be engine-level, not report-vs-Guide.

### E1 — Every calc needs an Engineering Report path
Today only **W/D, MWFRS, and Solar** have report endpoints (`/api/report`, `/api/report/mwfrs`,
`/api/report/solar`). To apply the examples to the platform, each shipped calc needs a report:
- [ ] Build a report endpoint + template per calc family (C&C roofs incl. arched/dome, Signs,
      Open Signs, Freestanding Walls, Rooftop Equipment, Chimneys & Tanks, Trussed Towers).
      Reuse `report_generator.py` / the solar-report pattern; **never** recompute or hardcode
      factors in the report — pull qh, K-factors, coefficients, and final pressures/forces
      straight from the engine result dict (the lesson from the sealed-deliverable audit).
- [ ] Wire the `📄 Generate Engineering Report` button (already supported by
      `calc-workflow.js` via `config.reportEndpoint`) on each calc page.

### E2 — Build the golden-report test set (one per Guide example)
The authoritative example→answer mapping lives in `ASCE 7-22/ENGINE_VALIDATION_REPORT.md`. Known
Guide worked examples already verified (extend as more are read):
| Calc | Guide example | Published answer to match (report output) |
|---|---|---|
| Rooftop Equipment | Ex 5.2 | F_h ≈ 4,328 lb · F_v ≈ 3,417 lb |
| Arched/Dome (dome) | Ex 6.7 | qh(h_D+f) ≈ 48.6 psf · GC_p ±0.9 |
| MWFRS Directional / Envelope | Guide MWFRS examples | per ENGINE_VALIDATION_REPORT.md |
| C&C Flat/Gable/Hip/Monoslope | Guide C&C examples | per ENGINE_VALIDATION_REPORT.md |
| Solar (rooftop parallel) | Guide §29.4 example | per ENGINE_VALIDATION_REPORT.md |

- [ ] Add a `webapp/testing/validate_reports_vs_guide.py` harness that, for each example:
  1. builds the **exact Guide inputs** as a report-endpoint payload,
  2. calls the report endpoint (or the report-generator function directly),
  3. **parses the rendered report** for the headline outputs (qh, coefficients, design
     pressures/forces), and
  4. asserts they equal the Guide's published answer within tolerance (account for the
     Kd-in-qz convention — compare FINAL pressures/forces, not intermediate q).
- [ ] A failing golden-report is a **release blocker** for that calc (it means the report
      deliverable disagrees with the book even if the engine unit test passes).

### E3 — Gate + cadence
- [ ] Tie E2 into B0: a calc with a Guide example cannot flip live until its golden-report passes.
- [ ] Run `validate_reports_vs_guide.py` alongside `validate_asce7_22.py` (both must be green).
- [ ] As we read more Guide examples, add a row + a golden-report case in the same commit.

> Net: WE-suite proves the **engine** matches the book; PART E proves the **report the customer
> downloads** matches the book. Both green = the calculator is truly verified end-to-end.

---

## 7. PART F — Free trials per calculator (pre-launch decision)

**Decision needed before go-live (Greg, 2026-06-28).** Today there's one product (W/D) and its
trial is the `trial-manager.js` / BIP pattern (3/hr · 10/day · 7-day). As the catalog grows we
need a deliberate free-trial model. Open questions to resolve and wire **before** program #2 ships:

- [ ] **Scope:** one global trial, or a **per-calculator** trial? (Does a W/D trial also unlock MWFRS, or is each calc its own trial?)
- [ ] **Length + limits per calc** (uses/hr, uses/day, trial days) — same as W/D or tuned per product?
- [ ] **Add-to-account flow:** when a paying customer adds a new calc, do they get a fresh trial of it, or unlock on purchase only?
- [ ] **Bundle vs à-la-carte:** does "WindLoad Complete" get one trial covering everything, vs per-calc trials?
- [ ] **Entry points:** per-calc "Start free trial" in the picker/nav, mapped to the trial entitlement.
- [ ] **Abuse controls (LAUNCH BLOCKER):** `NORMALIZE_EMAIL_ALIASES=true` ON at launch (blocks +alias trial farming); confirm trial limits enforced server-side, not just client.

Ties into **PART C** (nav rollout) and **Workstream E** (gating). Resolve before flipping program #2 live.

---

## 8. Quick reference — current state (2026-06-28)

- **Engines:** all 18 wired to the **admin UI** and runnable (2026-06-28); see
  `CALCULATOR_READINESS_MATRIX.md`. Engine math green: `validate_asce7_22.py` = 360 assertions pass.
- **Report path exists for:** W/D, MWFRS, Solar only — **PART E** tracks building it for the rest
  + the golden-report validation against the Guide.
- **Live/sellable today:** Windows, Doors & Shutters only.
- **Created in Stripe, not live:** MWFRS (3 tiers — see `PRICING_TABLE.md` for product IDs).
- **Pricing locked (v3):** W/D $35, MWFRS $35, Roofs $35, Signs $25, Solar $45 (Starter base);
  ×1.00/1.69/4.26 tiers; Complete base $99; annual ×10.
- **Pricing TBD (split-outs):** Rooftop Equipment, Chimneys & Tanks, Telecom Towers — set before launch.
- **Open backend work (Workstream E):** per-calc permission gates (B1), canonical
  `calculator_file` + product rows (B2), Stripe↔DB linkage (B3), **B4 webhook idempotency
  (written, pending test+deploy)**.

### Reference docs
- `PRICING_TABLE.md` — canonical v3 pricing for Stripe wiring
- `SUBSCRIPTION_GATING_AUDIT_2026-06-27.md` — the B1–B4 blockers
- `PRICING_STRATEGY_V2_IMPROVED.md`, `pricing-model-explorer.html` — model + visual
- Memory: `roadmap_per_calculator_dynamic_subscription`, `feature_admin_only_gate_all_except_wd`,
  `project_flask_staging_multicalc`, `audit_subscription_gating_2026_06_22`
