# Subscription-Gating Audit — 2026-06-27
*Autonomous pre-go-live check: are the new calculators actually sellable, or will the first go-live break? Backend = `c:\Dev\windload-solutions\backend\`, Flask = `webapp/flask_app/`.*

> **This re-verifies the comprehensive 50-agent audit of 2026-06-22** (memory
> `audit_subscription_gating_2026_06_22`) against current code — its findings still stand.
> That audit is the master punch-list; this pass adds Flask-specific + Stripe-linkage detail.

## ✅ What's good (and reusable)
1. **The W/D gating pattern is clean and is the template.** Flask sends `WD_CALCULATOR_FILE = "cc_windows_doors.py"` (`auth_proxy.py:224`) to `/api/permissions/check`; the seed `cc_walls` product's `calculator_files=['cc_windows_doors.py', 'cc_wall_cladding.py']` matches exactly, so live W/D subscribers pass. Copy this pattern for every other calc.

## ⚠️ Team-union is PARTIAL, not done (correction)
`permissions.py:check_paid_access` (230-245) **does** union owned + TeamMembership subscriptions — good. **But the 2026-06-22 audit found other paths that do NOT union** and those are still present: `usage_enforcement.py:61-103` (team-seat members throttled; also reads a non-existent `expires_at` column) and the Google-OAuth login branch `auth.py:711-753` (team members signing in with Google get `has_calculator:false`; the email/password path *does* union). So team access is **inconsistent across code paths** — don't call it "done."

## 🔴 Go-live blockers (must fix before selling ANY new calc)

**B1 — No subscription gating is wired for MWFRS / Roofs / Specialized / Solar.**
Every one of those Flask endpoints uses `require_admin_api()` *only* (`calc_api.py:563, 604, 643, 787`) — an **admin-role** gate, not a subscription check. They are admin-visible, not *sellable*. Each needs the W/D-style `calculator_file → /api/permissions/check` entitlement check added before it can be sold to a paying customer.

**B2 — Seed `calculator_files` are stale → a paying subscriber would be DENIED.**
Access is by **exact filename match** (`permissions.py:275`, `calculator_file in allowed_calculators`). But the seed `mwfrs` product lists `['mwfrs_calculator.py', 'mwfrs_lowrise_directional.py', …]` (`models.py:698-703`) while the real Flask engine is `asce7_22_mwfrs_directional.py`. None match. Same stale-name problem likely affects `cc_roofs`, signs, towers, equipment, etc. → **must define a canonical `calculator_file` identifier per calc and rewrite the product rows to match.**

**B3 — Stripe ↔ DB product mapping is out of sync.**
The seed `mwfrs` row is **one bundle** at **$149/$1490** with **no `stripe_product_id` set** (`models.py:691-707`). The Stripe products I created 2026-06-26 are **three tiers** (`mwfrs_starter/pro/premium`, mirroring W/D $59/$564). They're disconnected, and the seed prices ($149 mwfrs, $29 signs) match **neither** the Stripe products **nor** the new pricing model. The whole product taxonomy is stale.

**B4 — Webhook is NOT idempotent → double-grant CONFIRMED.**
`handle_checkout_completed` (`subscription_manager.py:881-898`) inserts a **new `UserSubscription` per cart product with no "already exists for this `stripe_subscription_id`" guard** — unlike the `FileDelivery` handler, which *does* guard (`subscription_manager.py:613-615`). Stripe retries/duplicates webhooks, so a duplicate `checkout.session.completed` would create **duplicate active subscription rows** for the same user. Clear, safe fix: add an existence check before insert (mirror the FileDelivery pattern).

## ⚠️ Unknown — needs a live check (can't run from here)
**U1 — Does the live production DB actually contain these seed rows?** The seed *defines* `mwfrs` et al., but whether the live Railway Postgres was seeded/migrated with them is unconfirmed (the prior audit flagged this). Needs a live `SELECT product_code FROM subscription_products;` — a backend script or DB query only you can run.

## What this means for the roadmap
Workstream **E (Stripe↔DB wiring)** is **not a small patch** — it's a rebuild that should follow the locked pricing model:
1. Define the canonical `calculator_file` identifier for each calc (e.g. the real engine module name).
2. Rebuild `SubscriptionProduct` rows to the **new pricing model** (per-calc à-la-carte + Complete tiers), with correct `calculator_files` and Stripe price-ID links.
3. Add the W/D-style per-calc permission check to each Flask endpoint (B1).
4. Fix the webhook idempotency (B4) — *this one is safe to do now, independent of pricing.*
5. Run the live `SELECT` to confirm prod-DB state (U1).

**Net:** good news — team-union works and W/D is a clean template. But **no new calc is sellable today**: no subscription check is wired, the product `calculator_files` are stale, the Stripe↔DB mapping is broken, and the webhook can double-grant. All fixable, and all part of Workstream E once the pricing model is locked. The only piece safe to fix *before* pricing is the **webhook idempotency guard (B4)**.
