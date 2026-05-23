# Funnel Architecture — Every Page Must Funnel to Purchase

**Purpose:** Map every page on windloadcalc.com to its position in the conversion funnel and its specific role in moving the visitor toward subscription. Pages without a purchase path = wasted traffic.

**Status:** Living document. Update when new pages ship or pricing/product changes. Last updated 2026-05-23.

---

## The funnel in one diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  GOOGLE SEARCH                                                   │
│  ("Florida wind load calculator", "Miami-Dade wind load",        │
│   "ASCE 7-22 calculator", "wind speed by zip", etc.)             │
│                                                                  │
└─────────────────────────────┬────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────────┐
        │                                             │
        │  TOFU — Top of Funnel pages                 │
        │  windloadcalc.com landing pages             │
        │  (state/county/city calculators,            │
        │   "ASCE hazard tool alternative",           │
        │   "wind speed by zip" etc.)                 │
        │                                             │
        │  GOAL: get ZIP into above-fold form         │
        │                                             │
        └─────────────────────┬───────────────────────┘
                              │
                              ▼  (ZIP entered, form submitted)
        ┌─────────────────────────────────────────────┐
        │                                             │
        │  CALC APP                                   │
        │  calc.windloadcalc.com/?zip=NNNNN           │
        │  (auto-prefills city/state/county/speed)    │
        │                                             │
        │  GOAL: deliver instant wind speed for free  │
        │  (no signup required for the lookup itself) │
        │                                             │
        └─────────────────────┬───────────────────────┘
                              │
                              ▼  (user wants more — pressures, report)
        ┌─────────────────────────────────────────────┐
        │                                             │
        │  TRIAL SIGNUP                               │
        │  (free trial of C&C calculator)             │
        │                                             │
        │  GOAL: capture email + ZIP                  │
        │                                             │
        └─────────────────────┬───────────────────────┘
                              │
                              ▼  (user wants permit-ready output)
        ┌─────────────────────────────────────────────┐
        │                                             │
        │  PAID SUBSCRIPTION                          │
        │  windloadcalc.com/wind-load-calculator-shop │
        │  Starting $28/mo (or $336/yr — 20% off)     │
        │                                             │
        │  GOAL: convert to recurring revenue         │
        │                                             │
        └─────────────────────┬───────────────────────┘
                              │
                              ▼  (FL project, needs PE stamp)
        ┌─────────────────────────────────────────────┐
        │                                             │
        │  PE STAMP UPSELL                            │
        │  windload.co/pe (FL-only, ≤3 stories)       │
        │                                             │
        │  GOAL: per-project revenue on top of sub    │
        │                                             │
        └─────────────────────────────────────────────┘
```

---

## TOFU pages — what they all must have

These are the SEO entry points. Every one must include:

### Required (no exceptions)
1. **Above-the-fold ZIP form** — `<input>` with `pattern="^\d{5}$"` validation + `<button>` submitting to `https://calc.windloadcalc.com/` with method=`get` so the URL becomes `calc.windloadcalc.com/?zip=NNNNN` (which the calc app accepts as of webapp commit `46c9c8e`).
2. **Mid-body inline CTA** — at a natural break point (after the main educational content but before deep technical detail), an "Open the Calculator →" button linking to the calc app or to a relevant product page.
3. **Bottom-of-page conversion section** — strong headline, 2-3 value-prop bullets, prominent "Start Free →" or "View Plans →" button.
4. **Sticky sidebar CTA** on long pages (>1,500 words) so the conversion path is always one tap away.

### Recommended (most pages)
5. **Internal link to the next-stage page** — if the page is informational (state/county), link to the product page (`/wind-load-calculator-shop`) or to a deeper-funnel landing (`/wind-load-calculator-comparison`).
6. **"Why us" trust block** — short callout activating Pillar 1 (since 2002) and Pillar 2 (Florida specialist) per [02-differentiation-pillars.md](./02-differentiation-pillars.md).
7. **Email capture as a fallback** — if a user is not yet ready to enter a ZIP, offer "Get our free wind load checklist" as a softer first-touch.

---

## Page-by-page funnel role

| Page (URL) | Funnel stage | Primary CTA target | Secondary CTAs |
|---|---|---|---|
| `/` (homepage) | TOFU + brand entry | `calc.windloadcalc.com/?zip=` | shop, FL page, comparison |
| `/florida-wind-load-calculator` | TOFU (state) | `calc.windloadcalc.com/?zip=` | 4 county pages, ASCE-alt |
| `/miami-dade-wind-load-calculator` | TOFU (county) | `calc.windloadcalc.com/?zip=` | FL, Broward, shop |
| `/broward-wind-load-calculator` | TOFU (county) | `calc.windloadcalc.com/?zip=` | FL, Miami-Dade, shop |
| `/collier-county-wind-load-calculator` | TOFU (county) | `calc.windloadcalc.com/?zip=` | FL, Naples specific, shop |
| `/palm-beach-wind-load-calculator` | TOFU (county) | `calc.windloadcalc.com/?zip=` | FL, Boca specific, shop |
| `/asce-hazard-tool-alternative` | TOFU (alternative-to) | `calc.windloadcalc.com/?zip=` | FL, comparison, shop |
| `/Landing Pages/asce-7-wind-load-calculator.html` | TOFU (code-version) | `calc.windloadcalc.com/?zip=` | shop, FAQ |
| `/Landing Pages/components-and-cladding-wind-loads.html` | TOFU (technical-topic) | `calc.windloadcalc.com/?zip=` | shop/windows-doors-shutters, MWFRS page |
| `/Landing Pages/free-wind-load-calculator.html` | TOFU (free-bait) | trial signup | shop, demo |
| `/wind-load-calculator-for-architects.html` | TOFU (audience) | shop, calc | comparison, services |
| `/wind-load-calculator-for-engineers.html` | TOFU (audience) | shop, calc | comparison, services |
| `/contractors-wind-load-calculator.html` | TOFU (audience) | shop, calc | comparison, services |
| `/wind-loads-for-consultants.html` | TOFU (audience) | services, calc | shop, contact |
| `/wind-load-calculator-shop.html` | MOFU (pricing) | Stripe checkout | windows-doors-shutters product |
| `/shop/windows-doors-shutters.html` | BOFU (product) | Stripe checkout | shop overview |
| `/wind-load-calculator-comparison.html` | MOFU (decision) | shop, trial | architect/engineer/contractor pages |
| `/why-us.html` | MOFU (trust) | shop, contact | services |
| `/services.html` | MOFU (custom services) | contact form | shop, PE service |
| `/faq.html` | MOFU (objection handling) | shop, contact | calc, comparison |
| `/contact.html` | BOFU (high-intent) | contact form submit | shop, services |
| `/demo.html` | TOFU (low-commit) | trial signup | shop, comparison |
| `/building-intelligence-platform-landing.html` | TOFU (BIP product) | BIP shop | calc shop |
| `/building-intelligence-platform-shop.html` | BOFU (BIP pricing) | Stripe checkout | BIP landing |
| `/account.html`, `/dashboard.html`, `/cart.html`, `/login.html` | (utility — noindex) | n/a | n/a |

---

## Conversion-killing anti-patterns (do not let these slip)

| Anti-pattern | Why it kills funnel | Fix |
|---|---|---|
| Page links to a "Coming Soon" placeholder | Authority leak to noindex page + user dead-end | Use `rel="nofollow"` until product ships; grey out the card with "Coming Soon" inline |
| Above-fold CTA below the fold on mobile | Most traffic is mobile; if CTA is below fold on a 6.1" phone, 50%+ never see it | Test on iPhone SE viewport (375×667) — CTA must be visible without scrolling |
| ZIP form requires login first | Friction = bounce | The ZIP lookup is FREE — no signup until they want a report |
| Bottom CTA repeats the above-fold one verbatim | Wasted real estate | Vary the framing (e.g., above-fold = "Get instant wind speed", bottom = "Stop calculating by hand — start free") |
| "Contact us for pricing" without visible price | B2B friction; modern buyers expect transparency | Show pricing on the shop page. Hide nothing. |
| External links that open in new tab without warning | OK for trust-link outbound (ASCE.org, FEMA) but never for our own ecosystem | Keep internal `target="_self"` always |
| Page has 7+ CTAs all competing | Choice paralysis | Maximum 3 CTAs per page (above-fold, mid, bottom). The sticky sidebar counts as one of these. |

---

## Conversion measurement — what to watch

| Metric | Source | Healthy benchmark | Action if degraded |
|---|---|---|---|
| TOFU page → calc app click-through | GA4 (or whatever analytics is wired) | ≥15% of page sessions | A/B test the above-fold CTA copy |
| Calc app session → trial signup | Backend log (Railway) | ≥5% of sessions | Soften the trial signup ask; reduce required fields |
| Trial → paid conversion | Stripe + backend | ≥10% of trials | Improve onboarding email sequence; in-app upsell timing |
| Paid → PE stamp upsell (FL only) | Stripe | ≥20% of FL paid users | PE service visibility in calc output |
| Cancel rate | Stripe | <5%/mo | Customer service intervention; cancellation flow |

(Set these baselines using the next 60 days of post-Wave-1 data. Adjust benchmarks once we have real numbers.)

---

## Where the funnel breaks today (as of 2026-05-23)

Honest current-state assessment:

1. **TOFU → calc app deep-link works** (just shipped). Until 2026-05-22, this path was broken — calc didn't accept `?zip=`. Now it does.
2. **Calc app → trial signup is unmeasured.** No analytics yet on the Dash app's conversion to trial. Need to add event tracking.
3. **Trial → paid conversion path is opaque.** Stripe shows the conversion but we don't have per-cohort tracking by source page yet.
4. **PE stamp upsell is buried.** It's on windload.co/pe but not surfaced from windloadcalc.com paid users' workflow. Cross-domain upsell loss.
5. **Cancel flow is the default Stripe one.** No save-the-customer logic.

These aren't blockers — they're "Wave 8" candidates after the SEO push compounds. Note them so they don't get forgotten.

---

## See also

- [SEO-DOMINATION-ROADMAP.md](./SEO-DOMINATION-ROADMAP.md) — Main strategy
- [02-differentiation-pillars.md](./02-differentiation-pillars.md) — How we win
- [03-page-quality-standards.md](./03-page-quality-standards.md) — Quality rules every page must meet
