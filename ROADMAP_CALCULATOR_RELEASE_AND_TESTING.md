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
- [ ] Engine implemented; UI works on the multi-calc shell.
- [ ] **All ASCE values book-verified** (cross-ref `UNVERIFIED_FIGURE_VALUES_WORKLIST.md`;
      no `# VERIFIED` on unverified figure values).
- [ ] Sample calculations validated against known references.

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

## 6. Quick reference — current state (2026-06-27)

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
