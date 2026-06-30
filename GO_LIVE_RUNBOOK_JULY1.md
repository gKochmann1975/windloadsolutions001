# MWFRS Go-Live Runbook — execute when the GitHub cap lifts (~July 1)

*All the code is built + committed on branches; this is the ~30-minute execution checklist.
Pairs with `WORKSTREAM_E_MWFRS_PLAN.md` (what/why) and `GO_LIVE_SET.md` (MWFRS = Wave 1).
**Money-touching — do it in Stripe TEST mode first, verify, then live.***

## Branches to ship
- webapp `feat/mwfrs-sellable` — E2 gate, E4 flips, MWFRS shop page.
- backend `feat/mwfrs-gating` — E1 taxonomy, E4 seat limits, `align_mwfrs_stripe_v3.py`.
- `windload-backend` (api) = PRODUCTION payments · `worthy-delight`/calc = the calc app · windloadcalc.com = GitHub Pages.

---

## Step 0 — Pre-flight
- [ ] GitHub cap lifted (you can `git push` again).
- [ ] Have the Stripe **TEST** key (`sk_test_…`) and **LIVE** key ready.
- [ ] `git -C webapp log --oneline -3` / `git -C backend log --oneline -3` show the E1–E4 commits.

## Step 1 — Stripe align (TEST first)
- [ ] `cd backend && STRIPE_API_KEY=sk_test_… python align_mwfrs_stripe_v3.py`  → review the dry-run plan.
- [ ] `… python align_mwfrs_stripe_v3.py --apply`  → creates 3 products + v3 prices in **test**.
- [ ] Note the printed `price_id`s + the UPDATE SQL.

## Step 2 — Merge + push (so GitHub-deploy and CLI-deploy stay in sync)
- [ ] webapp: merge `feat/mwfrs-sellable` → `feat/flask-multicalc` (+ `feat/flask-migration` for the live calc app); `git push`.
- [ ] backend: test-replay the **B4** webhook fix, then merge `feat/mwfrs-gating` → `main`; `git push`.
- [ ] parent: `git push` (publishes the **website** shop page via GitHub Pages — Step 6).

## Step 3 — Deploy the apps
- [ ] backend → `railway up --service windload-backend` (PRODUCTION — low-risk: additive config/seat + the gate lives in webapp). Watch `/api/health`.
- [ ] webapp → `railway up --service <calc app>` (and worthy-delight for staging). Confirm `/api/health` = `windload-flask` and MWFRS routes 302→login.

## Step 4 — Seed the prod DB with the new products
- [ ] Add the `mwfrs_starter/pro/premium` `SubscriptionProduct` rows to the production DB (idempotent upsert — they're in `backend/models.py` seed; run a one-time migration, do NOT wipe existing rows).
- [ ] Wire the Stripe price IDs from Step 1 into those rows (the UPDATE SQL the script printed) — so checkout uses the canonical prices, not auto-created ones.

## Step 5 — VERIFY (the gate that protects you)
- [ ] **God-mode grant (NO money):** admin panel → grant `mwfrs` to a test user → log in as them → MWFRS page loads + calc runs + report generates → **revoke** → it re-locks. *This proves E1+E2+E4 end-to-end without Stripe.*
- [ ] **Test purchase (Stripe TEST):** buy MWFRS Starter with card `4242 4242 4242 4242` → webhook → MWFRS unlocks → run + report. Confirm exactly **one** `UserSubscription` row (B4).
- [ ] Only after both pass: re-run Step 1 with the **LIVE** key, confirm prod DB has live price IDs.

## Step 6 — Website live (GitHub Pages, from Step 2's push)
- [ ] Confirm `https://windloadcalc.com/shop/mwfrs.html` shows the v3 pricing + "Add to Cart" wired to `mwfrs_*` (matches the W/D shop page).
- [ ] Confirm the category card on `wind-load-calculator-shop.html` points to it (already does).

## Step 7 — Post-launch watch
- [ ] First real purchases → exactly one subscription row each, one receipt (B4).
- [ ] Spot-check the first customer's MWFRS page + report.

---

## Rollback
- Code: `railway up` the previous commit, or flip `account_proxy.py PROGRAMS mwfrs "live": False` and redeploy.
- Stripe: prices are additive (old ones archived, not deleted) — safe.
- DB: the migration only ADDS rows; W/D rows untouched.

## What can't move until the push (Step 2)
The **website** (GitHub Pages) — that's the only piece truly gated on July 1. Everything else (app deploy, Stripe, DB) is CLI/dashboard and could be done earlier with the Stripe key, but doing it all together is cleaner.
