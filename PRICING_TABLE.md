# WindLoadCalc — Master Pricing Table (for engineering / Stripe wiring)
*Updated 2026-06-27. **Read the status flags.** Build against the CONFIRMED section. The PROPOSED
section is the target model but is **NOT locked** — do not hardcode those numbers until Greg signs off.*

---

## ⚠️ Status at a glance
- **CONFIRMED & LIVE in Stripe** → Windows/Doors (selling now) + BIP (selling now). Safe to build.
- **CREATED in Stripe, NOT live** → MWFRS (catalog-only, no checkout, flagged pending). Real IDs exist.
- **CONFIRMED MODEL (v3, signed off 2026-06-27)** → per-calc à-la-carte + "WindLoad Complete" bundle,
  priced by **tier × multiplier**. Final numbers below — safe to architect against. (Stripe products
  for the new calcs still need creating; only W/D + BIP + MWFRS exist today.)
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

## ✅ CONFIRMED MODEL — v3 "tier × multiplier" (signed off 2026-06-27)
Two axes: **Tier** (seats/limits/features = a price multiplier) × **Breadth** (which calculators).
**Price = Starter-tier base × tier multiplier.** Visual tool: `pricing-model-explorer.html`.
*Customers on the current W/D plan change nothing — W/D is simply the "1 calculator" column and its
live $35/$59/$149 falls right out of the multiplier.*

### Tier multiplier (derived from live W/D $35 → $59 → $149)
| Tier | Seats | Calcs/mo | Multiplier | Key features |
|---|---|---|---|---|
| **Starter** | 1 user | 100 | **×1.00** | PDF reports · email support · free updates |
| **Pro** | 5 users | 500 | **×1.69** | priority support · team admin dashboard · centralized billing · project templates |
| **Premium** | 10 users | unlimited | **×4.26** | phone support · onboarding · custom report branding · usage analytics |
| **Enterprise** | unlimited | unlimited | **Custom (quote)** | dedicated account mgr · custom training · API (coming soon) · SLA |

### À-la-carte per calculator — Starter base × tier multiplier (monthly)
| Calculator | Starter base | Starter | Pro | Premium |
|---|---|---|---|---|
| Windows, Doors & Shutters | $35 | $35 | $59 | $149 |
| MWFRS Buildings | $35 | $35 | $59 | $149 |
| C&C Roofs (all 6 shapes) | $35 | $35 | $59 | $149 |
| Solar (rooftop + ground) | $45 | $45 | $76 | $192 |
| Other Structures (Chimneys/Tanks/Towers/Equip) | $29 | $29 | $49 | $124 |
| Signs & Freestanding Walls | $25 | $25 | $42 | $107 |

### WindLoad Complete — all calculators + BIP free (base $99 × tier multiplier)
| Tier | Monthly | Annual (2 mo free) | Seats | BIP |
|---|---|---|---|---|
| **Complete Solo** | $99 | $990 | 1 | BIP Starter |
| **Complete Pro** | $167 | $1,670 | 5 | BIP Pro |
| **Complete Premium** | $422 | $4,220 | 10 | BIP Premium |
| **Complete Enterprise** | quote | quote | 10+ | — |

### Rules (locked)
- **Annual = pay 10, get 12 ("2 months free").** ⚠️ Reconcile: current live W/D annual uses ~20% off
  (×9.56 → $336/$564/$1428); the new standard is ×10 → $350/$590/$1490. **Keep existing W/D annual
  customers as-is; apply ×10 to new products / the Complete bundle.** (Or migrate W/D annual to ×10 —
  small change, Greg's call; not blocking.)
- **Complete wins at ~the 3rd calculator** (3 core calcs $105 > Complete Starter $99) — funnels to the
  bundle (see `feedback_pricing_bundle_maximization`). Sooner if Solar/pricier calcs are picked.
- **No PE-sealing in any tier** — separate quoted service, never bundled.
- **No pay-per-report.**
- **7-day free trial** stays (already live: 10 calcs total / 5 per day).

### Decisions — all RESOLVED
1. ✅ Tier prices = multiplier off $99 Complete base (W/D $35/$59/$149 validates it).
2. ✅ Tier feature-walls = the live W/D tier features (seats / calc limits / support / dashboard / branding / analytics).
3. ✅ Pay-per-report = **NO**.
4. ✅ Free trial = the existing **7-day** trial (not a new 14-day).

---

## Reference docs (this repo)
- `PRICING_STRATEGY_V2_IMPROVED.md` — full model + reasoning
- `COMPETITIVE_PRICING_ANALYSIS.md` — verified competitor pricing + platform/security
- `pricing-model-explorer.html` — interactive visual of the proposed model
- `SUBSCRIPTION_GATING_AUDIT_2026-06-27.md` — what blocks selling the new calcs
- Memory: `reference_stripe_mwfrs_products`, `project_pricing_model_design`, `feedback_pricing_bundle_maximization`

**Bottom line for the Stripe/account agent:** the **v3 tier × multiplier model is CONFIRMED** — build
against it. Architecture: each calculator is a Stripe price at **3 tiers** (Starter/Pro/Premium =
base × 1.0 / 1.69 / 4.26) + a **Complete bundle** at the same tiers ($99/$167/$422) + **Enterprise =
quote**. Annual = ×10 ("2 months free"). W/D + BIP + MWFRS Stripe products already exist; the other
calcs' products still need creating (per the bases above). Keep existing W/D customers on their
current prices (the model is back-compatible — W/D $35/$59/$149 is the multiplier's "1-calc" column).
