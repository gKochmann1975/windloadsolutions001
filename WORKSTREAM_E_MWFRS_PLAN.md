# Workstream E — make MWFRS sellable (the first second-product)

*Concrete, code-grounded plan, 2026-06-29. Built from a live audit of the gating/Stripe code
(file:line below). Pairs with `GO_LIVE_SET.md` (MWFRS = Wave 1) and the per-calc B0–B5
checklist in `ROADMAP_CALCULATOR_RELEASE_AND_TESTING.md`. **This touches production payments
(`api.windloadcalc.com`) — build + test-mode verify now, deploy the backend AFTER the July 1
GitHub cap, Stripe TEST mode before live.**

---

## Two decisions needed from Greg BEFORE I write payment code
**D1 — Canonical `calculator_file` identifier.** The entitlement gate matches the calc-file
string EXACTLY (`backend/permissions.py:275` — `if calculator_file in allowed_calculators`).
Pick ONE identifier per MWFRS calc and use it everywhere (gate + DB seed + config):
- **Recommended:** the real engine names — `asce7_22_mwfrs_directional.py`, `asce7_22_mwfrs_envelope.py`.
  (Clean, matches the engines the Flask endpoints actually import.)

**D2 — MWFRS pricing/tiers.** They don't currently line up:
- DB seed (`backend/models.py:691‑707`): ONE bundle, **$149 / $1490**, Stripe IDs NULL.
- Stripe products created 2026‑06‑26 (`reference_stripe_mwfrs_products`): THREE tiers —
  **Starter $35/$336, Pro $59/$564, Premium $1428 (annual-only)**.
- v3 model (`PRICING_TABLE.md`): base $35 × {1.00/1.69/4.26}, annual ×10 → Starter $35/$350,
  Pro $59/$590, Premium $149/$1490.
- **Confirm the final tiers + prices** (and whether Premium is annual-only). I'll wire to whatever you lock.

---

## Build steps (in order) — with the exact files

### E-1 · Reconcile the product taxonomy (fixes B2)
- [ ] `backend/models.py:691‑707` — replace the stale single `mwfrs` bundle seed with **3 tier rows**
      (`mwfrs_starter / mwfrs_pro / mwfrs_premium`), each `calculator_files = ['asce7_22_mwfrs_directional.py','asce7_22_mwfrs_envelope.py']` (per D1), prices per D2.
- [ ] `backend/config.py:123‑163` (`CALCULATOR_PRODUCT_MAP`) — key the **real engine names** →
      `['mwfrs_starter','mwfrs_pro','mwfrs_premium','professional','enterprise']`. Remove/retire the stale `mwfrs_*.py` keys.
- [ ] One canonical source: make the Flask gate's identifier (E‑2) == the seed `calculator_files` == the config keys. (Today W/D is consistent: `WD_CALCULATOR_FILE="cc_windows_doors.py"` matches its seed — copy that discipline.)

### E-2 · Wire the entitlement gate (fixes B1)
- [ ] `webapp/flask_app/auth_proxy.py` — add `require_mwfrs_access(check_usage=False)` mirroring
      `require_wd_access()` (lines 224‑297): set `MWFRS_CALCULATOR_FILE = "asce7_22_mwfrs_directional.py"`
      (+ envelope), POST to `/api/permissions/check`. **Keep an admin bypass** so we can still test.
- [ ] `webapp/flask_app/calc_api.py` — swap `require_admin_api()` → `require_mwfrs_access()` on:
      `/api/calc/mwfrs` (558), `/api/calc/mwfrs-envelope` (801), `/api/report/mwfrs` (967).

### E-3 · Wire Stripe ↔ DB + checkout (fixes B3)
- [ ] Confirm the 3 MWFRS Stripe products/prices exist (TEST + live); capture `stripe_product_id` + `stripe_*_price_id`.
- [ ] Write them into the new DB tier rows (E‑1).
- [ ] `webapp/flask_app/account_proxy.py:109‑114` (`_LIVE_CHECKOUT_CODE`) — add
      `("mwfrs","Starter")→"mwfrs_starter"`, Pro, Premium.
- [ ] `backend/team_routes.py:15‑33` (`SEAT_LIMITS`) — add `mwfrs_starter:1, mwfrs_pro:5, mwfrs_premium:10` (match W/D pattern).

### E-4 · Flip the switches
- [ ] `webapp/flask_app/account_proxy.py:56‑84` (`PROGRAMS`) — set the `mwfrs` program `"live": True`.
- [ ] Confirm `_program_for_code()` maps the new product codes → `mwfrs` (owned-detection).
- [ ] `webapp/flask_app/static/add-calculators.js` — confirm MWFRS shows a price (not "coming soon").

### E-5 · Deploy the B4 webhook fix
- [ ] B4 is FIXED in code (`backend/subscription_manager.py:899‑908`) but lives on `fix/webhook-idempotency-b4`.
      Test-replay in Stripe TEST mode, then merge → backend main → deploy (after July 1).

### E-6 · Verify (Stripe TEST mode) then promote
- [ ] **Grant→unlock→revoke** (admin god-mode) for a test user on MWFRS — the Part A matrix in the runbook.
- [ ] **Test-card purchase** (`4242…`) → webhook → MWFRS unlocks → user can run BOTH MWFRS calcs + get the report.
- [ ] Confirm exactly ONE `UserSubscription` row per purchase (B4).
- [ ] Promote to live; re-verify with one real test account.

### E-7 · Secondary (not a launch blocker)
- [ ] `backend/auth.py:711‑753` — Google-OAuth login returns `has_calculator:false` for team members
      (email/password path does the union). Fix before team customers rely on Google sign-in.

---

## What's already done / safe
- ✅ B4 webhook idempotency (code) — `subscription_manager.py:899‑908`.
- ✅ Team-union access in `check_paid_access()` — `permissions.py:230‑245`.
- ✅ DB schema supports multi-calc products (`SubscriptionProduct.calculator_files` JSON).
- ✅ W/D gate is the clean template to copy (`auth_proxy.py:224‑297`).

## Sequencing / risk
- E‑1…E‑4 are **code** I can build now on branches (webapp + backend) and verify against Stripe **TEST**.
- **No backend production deploy until July 1** (GitHub cap) — and then TEST-mode first, live last.
- Nothing here touches the live W/D product path or the production Dash app.
