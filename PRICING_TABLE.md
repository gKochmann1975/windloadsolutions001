# WindLoadCalc — Master Pricing Table (for engineering / Stripe wiring)
*Updated 2026-06-27. **Read the status flags.** Build against the CONFIRMED section. The PROPOSED
section is the target model but is **NOT locked** — do not hardcode those numbers until Greg signs off.*

---

## ⚠️ Status at a glance
- **CONFIRMED & LIVE in Stripe** → Windows/Doors (selling now) + BIP (selling now). Safe to build.
- **CREATED in Stripe, NOT live** → MWFRS (catalog-only, no checkout, flagged pending). Real IDs exist.
- **PROPOSED, PENDING sign-off** → the new per-calc à-la-carte + "WindLoad Complete" bundle model.
  **Numbers may change. Do not wire as final.**
- **STALE — do NOT use** → the backend DB `subscription_products` seed prices (e.g. mwfrs $149/$1490,
  signs $29) match neither Stripe nor the new model. See `SUBSCRIPTION_GATING_AUDIT_2026-06-27.md`.

---

## ✅ CONFIRMED — live in Stripe today (account: "Wind Load Solutions, LLC")

### Windows, Doors & Shutters (product family `cc_walls`) — SELLING NOW
| Tier | Monthly | Annual | Notes |
|---|---|---|---|
| Starter | $35/mo | $336/yr | |
| Pro | $59/mo | $564/yr | |
| Premium | — | $1,428/yr | **annual only, no monthly** |

### Building Intelligence Platform (BIP) — SELLING NOW
| Tier | Monthly | Annual |
|---|---|---|
| Starter | $29/mo | $300/yr |
| Pro | $79/mo | $804/yr |
| Premium | $149/mo | $1,524/yr |

---

## 🟡 CREATED in Stripe but NOT LIVE — MWFRS (catalog-only, no checkout)
Created 2026-06-26, mirrors W/D. Metadata `status=pending_verification_not_live`. Default price = yearly.

| Tier | Monthly | Annual | Stripe product | lookup_keys |
|---|---|---|---|---|
| Starter | $35/mo | $336/yr | `prod_UmKaD3vGP6mgoP` | `mwfrs_starter_monthly` / `mwfrs_starter_yearly` |
| Pro | $59/mo | $564/yr | `prod_UmKaXZc31hbPIC` | `mwfrs_pro_monthly` / `mwfrs_pro_yearly` |
| Premium | — | $1,428/yr | `prod_UmKaKSQdigYd83` | `mwfrs_premium_yearly` |

> Blocked from go-live by: book-verification gate + the subscription-gating fixes (no per-calc
> permission check wired, stale `calculator_files`, webhook double-grant). See the audit doc.

---

## 🔶 PROPOSED — v2 model (PENDING Greg sign-off — do NOT hardcode as final)
The intended end-state once every calculator ships. Source: `PRICING_STRATEGY_V2_IMPROVED.md`.

### À-la-carte per calculator (monthly), tier-priced by type — NO count discount
| Product (calculator family) | $/mo |
|---|---|
| Solar (rooftop + ground) | $79 |
| Windows/Doors & Shutters | $59 |
| MWFRS Buildings | $59 |
| C&C Roofs (all 6 shapes) | $59 |
| Other Structures (Chimneys/Tanks/Towers/Rooftop Equipment) | $49 |
| Signs & Freestanding Walls | $39 |

*(Annual ≈ "2 months free" = monthly × 10. Per-calc Premium-style annual TBD per product.)*

### "WindLoad Complete" — all calculators + BIP free (the bundle; the up-sell)
| Tier | Monthly | Annual ("2 months free") | Seats | BIP included |
|---|---|---|---|---|
| Solo | $99/mo | $990/yr | 1 | BIP Starter |
| **Pro** (most popular) | $129/mo | $1,290/yr | 3 | BIP Pro |
| Premium | $149/mo | $1,490/yr | 5 | BIP Premium |
| Firm / Enterprise | — | $3,500/yr (flat) | up to 10 | BIP Pro |
| Custom | quote | quote | 10+ | — |

- **Annual = pay 10, get 12 ("2 months free").**
- Bundle is priced so it beats 2 à-la-carte calcs → funnels buyers to "Complete" (see
  `feedback_pricing_bundle_maximization`).
- **No PE-sealing in any tier** — separate quoted service, never bundled.

### Open decisions still PENDING (block "final"):
1. Confirm tier prices $99 / $129 / $149 (+ Firm $3,500).
2. Tier feature-walls — what splits Pro vs Premium (white-label reports / revision history / API).
3. Pay-per-report option for occasional buyers — yes/no.
4. Free 14-day full-Complete trial — yes/no.

---

## Reference docs (this repo)
- `PRICING_STRATEGY_V2_IMPROVED.md` — full model + reasoning
- `COMPETITIVE_PRICING_ANALYSIS.md` — verified competitor pricing + platform/security
- `pricing-model-explorer.html` — interactive visual of the proposed model
- `SUBSCRIPTION_GATING_AUDIT_2026-06-27.md` — what blocks selling the new calcs
- Memory: `reference_stripe_mwfrs_products`, `project_pricing_model_design`, `feedback_pricing_bundle_maximization`

**Bottom line for the Stripe/account agent:** build the plumbing against the **CONFIRMED** W/D + BIP
prices and the **MWFRS IDs** (which are real). Treat the **PROPOSED** à-la-carte + Complete model as
the *architecture to support* (per-calc items + a bundle + annual + seats), but **don't bake the
dollar values in** until Greg confirms the 4 open decisions.
