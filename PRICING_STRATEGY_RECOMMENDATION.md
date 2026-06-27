# WindLoad Solutions — Multi-Calculator Pricing Strategy
## Final Recommendation for Gregory Kochmann
*Produced 2026-06-27 by a 5-analyst panel (design → independent scoring → synthesis), grounded in the verified current code state.*

---

## 1. Recommendation

**Ship a single dynamic subscription where each calculator is a line item and one count-scaled coupon discounts the whole bill — "One Dynamic Subscription, Calcs as Items, Count-Scaled Coupon."** It is the closest literal match to your roadmap (one sub, in-account add/remove, auto-reprice with proration, no re-checkout, single lump-sum shown), it structurally forbids an all-access bundle (calcs are just new Price items, honoring incremental release), and its grow-the-account reward is automatic and legible: every added calc lowers the effective per-calc price across the entire invoice. It scored highest (3.55) on roadmap alignment and customer simplicity, and its one real weakness — a high greenfield build — is **unavoidable in every non-baseline model**, so paying that cost once for the best-aligned design is the correct trade.

One adjustment to the raw model: keep the headline anchor at the real W/D Pro **$59** but enter the catalog at the **$35 Starter**, and resolve the documented Stripe `discounts` + `allow_promotion_codes` conflict by switching the laddered coupon path off `allow_promotion_codes` and applying LEGACY/INSTITUTIONAL server-side.

---

## 2. Scoreboard (best first)

| Rank | Strategy | Weighted | One-line verdict |
|------|----------|----------|------------------|
| **1** | **One Dynamic Subscription, Calcs as Items, Count-Scaled Coupon** ✅ | **3.55** | Best roadmap fit and cleanest customer experience with solid land-and-expand revenue; most greenfield to build and a live discounts-vs-promo-codes Stripe conflict to resolve. |
| 2 | Platform Base + Discounted Per-Calc Add-Ons | 3.40 | Cleanest fit to the already-built per-line-item cart, but raises the entry price on the single-calc majority and can't express live Starter/Pro/Premium tiers. |
| 3 | Stacking Volume Discount by Calculator Count | 3.35 | Well-aligned and sticky for multi-calc accounts, but a high net-new build with a blended-coupon library and a fragile single-calc/team-sub migration; discount too shallow at the 1–2 calc tier where most customers sit. |
| 4 (tie) | Flat Per-Calc Pricing (No Discount) — Baseline | 3.30 | Ship-today revenue-max control that's trivial on Stripe but contradicts your two headline goals. |
| 4 (tie) | Threshold Bundle SKUs with Auto-Upgrade | 3.30 | Pragmatic ladder that nails lump-sum simplicity and reuses the bundle-Product model, but count-only SKUs cap revenue and the auto-reprice core is still net-new, high-risk code. |

---

## 3. Recommended pricing & discount curve

**Anchor:** the real, live W/D price. Single-calc entry = **Starter $35/mo · $336/yr**; the "own a calc" power tier = **Pro $59/mo · $564/yr**. The curve below is modeled on the **$59 Pro** anchor (the rate that compounds as the account grows).

**The count ladder (percent off the whole subscription):**

| # Calcs | Ladder discount |
|---------|-----------------|
| 1 | 0% |
| 2 | 10% |
| 3 | 15% |
| 4 | 20% |
| 5+ | 25% (cap — freeze here until the full catalog ships) |

`total = (Σ item base prices) × (1 − ladder%)`. The 25% cap protects margin; freezing at 25% until everything ships prevents an accidental near-free all-access tier mid-rollout.

### Pro-anchored curve ($59/mo · $564/yr per calc)

| # Calcs | Discount | Monthly total | Annual total | Effective / calc (mo) | Effective / calc (yr) |
|--------:|:--------:|--------------:|-------------:|----------------------:|----------------------:|
| 1 | 0% | **$59.00** | **$564.00** | $59.00 | $564.00 |
| 2 | 10% | **$106.20** | **$1,015.20** | $53.10 | $507.60 |
| 3 | 15% | **$150.45** | **$1,438.20** | $50.15 | $479.40 |
| 5 | 25% | **$221.25** | **$2,115.00** | $44.25 | $423.00 |
| "All shipped" (e.g. 8) | 25% | **$354.00** | **$3,384.00** | $44.25 | $423.00 |

### Starter-anchored curve ($35/mo · $336/yr per calc), for reference

| # Calcs | Discount | Monthly total | Annual total | Effective / calc (mo) |
|--------:|:--------:|--------------:|-------------:|----------------------:|
| 1 | 0% | $35.00 | $336.00 | $35.00 |
| 2 | 10% | $63.00 | $604.80 | $31.50 |
| 3 | 15% | $89.25 | $856.80 | $29.75 |
| 5 | 25% | $131.25 | $1,260.00 | $26.25 |

**What the customer sees:** one line — *"$150.45/mo for 3 calculators"* — that gets cheaper per calc as they add more. Never the `3 × $59 − 15%` formula. Honors the lump-sum-only rule. **Premium ($1,428/yr, annual-only) is excluded from the laddered sub by design** (see §6).

---

## 4. Per-subscription / per-user management model

**One user → one "calc subscription."** First purchase runs through Stripe Checkout; the resulting `stripe_subscription_id` is recorded once as that user's canonical calc subscription. Every calc thereafter is a **`subscription_item`** on it.

**Sync triangle on every add/remove:**
1. **Account UI (shell.js Add/Remove modal):** user clicks a locked calc → `POST /api/subscription/add-calc` (or `/remove-calc`). UI shows the *new lump-sum total before confirm*.
2. **Backend:** resolves calc → its `stripe_monthly_price_id`/`stripe_annual_price_id`, calls `Subscription.modify` (item add or delete) with `proration_behavior='create_prorations'`, recomputes count → ladder% → swaps the coupon, writes the new item set.
3. **Stripe → webhook → DB:** `customer.subscription.updated` fires; handler **reconciles the live item set** by mapping each `subscription_item` price ID back to `calculator_files`, then grants/revokes access. This is the source of truth — never trust the request optimistically.

**DB model:** Keep `SubscriptionProduct` (one row per calc, carries `calculator_files` + both Price IDs). The consolidated calc subscription is one `UserSubscription` row whose granted `calculator_files` is the **union of its live items' files**. Add a `stripe_subscription_item_id` mapping (item ↔ calc). **Migration:** existing single-calc subscribers keep their one sub as-is; only users who later add a 2nd calc get consolidated — lazy migration, no risky backfill.

**Team members (`TeamMembership`):** the owner's consolidated sub is the billed entity; members inherit via the existing team-union check. Guardrails (your audit memory flags live team-union + double-grant bugs): (a) only the owner can add/remove calcs; (b) the union check must read the owner's live item set, not a stale per-product grant; (c) the `subscription.updated` reconciliation must re-propagate to all members in one transaction so a member never sees a lock page after the owner adds a calc.

---

## 5. Stripe mechanics

**Chosen primitive: ONE subscription + multiple `subscription_items` + proration + one swappable count-coupon.** The only approach that yields one renewal date, one invoice, and add/remove-without-re-checkout simultaneously.

**Reused (already built — verified in code):**
- `SubscriptionProduct` with per-calc `stripe_monthly_price_id` / `stripe_annual_price_id` → become the per-**item** prices, no schema change.
- Stripe Checkout Sessions for the **first** purchase.
- Webhooks: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated/deleted`.
- The institutional/legacy coupon-create pattern → reuse to pre-create the ladder coupons (`COUNT2=10%`, `COUNT3=15%`, `COUNT4=20%`, `COUNT5=25%`).

**Net-new (confirmed absent from app code today):**
1. `Subscription.modify(items=[{price: …}], proration_behavior='create_prorations')` for **add**.
2. `Subscription.modify(items=[{id: si_…, deleted: True}], proration_behavior='create_prorations')` for **remove**.
3. Count → coupon recompute + `Subscription.modify(discounts=[{coupon: tier}])` swap, atomic with the item change.
4. `subscription.updated` handler upgraded from **product-keyed** to **item-keyed** `calculator_files` reconciliation.
5. `/api/subscription/add-calc` + `/remove-calc` endpoints; shell.js Add-modal CTA wired off its TODO `'/'`.
6. Restricted Billing Portal config so users can't self-edit items outside the laddered flow.

**Two hard Stripe constraints to design around:**
- **`discounts` and `allow_promotion_codes` cannot coexist** (live blocker in `subscription_manager.py:323-325`, which hard-sets `allow_promotion_codes=True`). **Fix:** on the laddered sub, drop `allow_promotion_codes` and apply LEGACY/INSTITUTIONAL server-side via the same `discounts` array.
- **One billing interval per subscription** — monthly and annual items cannot share a sub. Enforce one cycle per calc subscription.

---

## 6. Build plan (phased, each phase shippable)

**Phase 0 — In-account self-serve add (ships standalone, no discount yet).** Wire shell.js Add modal → for a user with no calc sub, launch a normal Checkout Session; for a user who already has one, `POST /api/subscription/add-calc`. Add the `stripe_subscription_item_id` mapping. *Risk: low.* Delivers the locked-calc → buy CTA (the #1 roadmap gap) with zero pricing change.

**Phase 1 — Dynamic add via `Subscription.modify` + proration (no coupon yet).** Item add/delete with `create_prorations`; upgrade `subscription.updated` to item-keyed reconciliation. Test mid-cycle add, mid-cycle remove (credit/negative-invoice), annual proration shock. *Dependency: Phase 0. Risk: medium* (money-touching; needs idempotency + heavy test-mode coverage). Delivers "no re-checkout" auto-reprice at full per-calc price.

**Phase 2 — Count-scaled coupon ladder.** Pre-create the four ladder coupons; recompute count → tier → swap coupon atomically with every item change. Resolve the `allow_promotion_codes` conflict. Confirm-before-commit UI showing the new lump-sum on add and remove. *Dependency: Phase 1. Risk: medium.* Delivers the full grow-the-account reward.

**Phase 3 — Team-membership hardening + lazy consolidation.** Owner-only add/remove guard; union check reads owner's live item set; member re-propagation in one transaction. Fix the audit-flagged double-grant on `subscription.updated`. *Dependency: Phase 2. Risk: medium-high.* Ship after solo accounts are proven.

**Cross-cutting risks / quirks:**
- **W/D Premium $1,428/yr (annual-only)** does NOT fit the laddered model. Keep Premium as a **standalone** subscription outside the calc-ladder (it's a feature tier, not a count item).
- **Proration on annual mid-year adds** = a large immediate charge → support/dispute vector. Mitigate with confirm-before-commit total and a plain-language line ("you'll be charged $X today for the remainder of this term").
- **Remove re-prices survivors upward** (3→2 raises per-calc). Always show the new total before confirm; never expose the tier table.
- **One-interval rule** means "one subscription" is only fully true per cycle. Decide the cross-cycle UX (open question #3).

---

## 7. Open questions for Gregory (decisions only you can make)

1. **Discount steepness & cap.** Confirm the ladder (0/10/15/20/25%) and the **25% cap frozen until the full catalog ships**. Where do you want the cap?
2. **Anchor for the curve.** Model the headline ladder on **Pro $59** (recommended), or on **Starter $35**? Sets every published "save up to X" number.
3. **Add-on billing cycle.** Given Stripe's one-interval-per-sub rule: do adds inherit the subscription's existing cycle (clean), or may a customer mix monthly + annual (requires a second sub / breaks "one subscription")?
4. **Promo-code stacking.** On the laddered sub we must drop `allow_promotion_codes`. Should LEGACY/INSTITUTIONAL **stack** on the count discount, **replace** it (larger wins), or be **disallowed** on multi-calc subs? Margin decision.
5. **Is the Platform-Base model (#2) on the table at all?** It scored 3.40 and reuses the most code, but raises single-calc entry from $35→$39 and collapses Starter/Pro/Premium. If you'd accept a higher entry price for simpler add-on economics, say so — it changes the whole build.
