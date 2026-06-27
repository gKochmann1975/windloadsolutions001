# WindLoadCalc Pricing — v2 (Improved after adversarial review)
*2026-06-27. Two independent passes (competitor red-team + funnel optimizer) pressure-tested v1. This is the improved model. Supersedes the pricing in COMPETITIVE_PRICING_ANALYSIS.md / PRICING_STRATEGY_RECOMMENDATION.md.*

## Verdict
Positioning is strong — we win the cloud-SaaS tier on price *and* feature (dedicated **solar** + **BIP** + **web**, none of which the cloud rivals combine). But v1 had **one leak that works against the owner's own goal** (make "All Programs" win as early as possible), plus three upgrades that sharpen the funnel and the retention. (PE sealing is a real differentiator competitors lack, but it stays a **separate quoted service** — never a pricing/tier lever.)

---

## Improvement #1 — FIX THE FUNNEL LEAK: flatten the à-la-carte discount
**The problem:** v1's count discount made **2 calcs ($124) *cheaper* than the bundle ($129)** — i.e., we were *paying customers to stay off the bundle* at the exact moment they decide. That contradicts the bundle-maximization principle.

**The fix:** drop the count discount; à-la-carte = raw sum. The **bundle becomes the discount.**

| # calcs | à-la-carte (v1, discounted) | à-la-carte (v2, raw) | Complete Solo $99 |
|--:|--:|--:|--:|
| 1 | $79 | **$79** | only +$20 → "add 5 calcs + BIP for $20/mo" |
| 2 | $124 | **$138** | **bundle wins by $39** |
| 3 | $162 | $197 | bundle |
| 6 | $241 | $344 | bundle |

Now **All Programs wins at the 2-calc decision** (the most common upgrade moment), the page is simpler (no discount table to explain), and it kills the "rigged decoy" optics that skeptical engineers resent. The savings story survives — it's just shown as *"vs buying separately you'd pay $X — Complete saves you Y%."*

---

## Improvement #2 — give the tiers a real reason to climb, on SOFTWARE value only
**The problem:** v1's three tiers ($99/$129/$149) all include "all 6 + BIP" and differ only by seats — the $20 gaps look arbitrary, so buyers default to the cheapest tier (or a cheaper competitor during the hesitation).

**The fix:** differentiate on concrete **software** value — **seats, BIP tier, report branding/exports, project storage, support.** (⛔ NOT sealing — PE sealing is a separate, per-project-quoted service, never a tier incentive or "seal credit": a bundled seal would commit a PE to a project sight-unseen, and a messy/deep job burns the PE's value.)

| Tier | $/mo | Annual ("2 mo free") | Seats | BIP | Reports / extras |
|---|--:|--:|:--:|---|---|
| **Complete Solo** | $99 | $990/yr | 1 | BIP Starter | Standard PDF, 25 saved projects, email support |
| **Complete Pro** ★ | $129 | $1,290/yr | 3 | BIP Pro | Branded reports + CSV/Excel exports, unlimited projects, priority support |
| **Complete Premium** | $149 | $1,490/yr | 5 | BIP Premium | White-label reports + all exports, revision history, dedicated support |

Each step adds something tangible (seats + BIP depth + report capability + support), so the ladder is legible. The **BIP tier scales with the plan** (Solo→BIP Starter … Premium→BIP Premium) — clean, software-only, zero liability. Sealing remains available as a **separate quoted service** alongside any tier — mentioned, not bundled.

---

## Improvement #3 — RETENTION: annual "2 months free," BIP gravity, free feeder, Firm tier
- **Annual = pay 10, get 12 ("2 months free")** instead of an opaque ×9.56. Same revenue zone, far better conversion psychology, locks in a year → churn floor. Push it hard at the first sealing event.
- **BIP data gravity:** keep BIP free in every tier; surface saved BIP data in-account ("you have 14 buildings saved") right before any cancel/downgrade — makes switching cost visible.
- **Free feeder + 14-day full-Complete trial** (email normalization ON per pre-launch checklist): the trial shows ALL 6 + BIP so they *feel* the bundle, then drops to Solo unless they pick a tier. Feeling all six is what sells the bundle.
- **Firm tier — $3,500/yr flat for up to 10 seats** (= $350/seat) + BIP + API + SSO + dedicated account manager. Beats **SkyCiv Enterprise ($5,000/yr, 5 users)** and **ENERCALC (+$1,150/seat/yr)** decisively on seats-for-money. Custom above 10 seats; consider **floating/concurrent seats** (ClearCalcs uses these to beat per-user models). (Sealing stays a separate quoted service — not bundled into the seat price.)

---

## The honest vulnerability (don't paper over it)
**Single-calc entry vs MecaWind.** One WLC calc = $59–79/mo ($708–948/yr). MecaWind gives **all wind + solar for $252/yr (desktop)**. We do **not** win the pure-price single-calc buyer — and we shouldn't try (lowballing $59 cheapens the brand and we'd still lose on raw price). Our buyer values **web access (anywhere, team, no install) + dedicated solar + BIP integration + permit-ready reports** — none of which MecaWind's desktop tool has. Defenses:
- **Lead with the all-access value**, not the single calc — "all 6 + BIP for barely more than 2 calcs," and the web/solar/BIP differentiators.
- Optional **pay-per-report / pay-per-export** ($15–25/report) for occasional users — "free to calculate, pay when you need the permit-ready report" — turns our weakest segment into a feeder.
- **Don't over-lean on "ASCE 7-22 native"** — MecaWind and ENERCALC also do 7-22; it only beats RISACalc (7-16). The real software wedges are **dedicated solar (ENERCALC has none) + BIP + web + breadth.**
- PE sealing is a real differentiator competitors lack — but it's a **separate quoted service** we *offer*, mentioned as available, never a pricing/tier lever.

---

## v2 competitive check (annual, "2 months free" = ×10)
| | v2 price | vs market |
|---|--:|---|
| Complete Solo | $990/yr | undercuts RISACalc ($1,000, 7-16 only) & ClearCalcs Pro ($1,190) — and includes everything + BIP |
| Complete Pro ★ | $1,290/yr | under ENERCALC ($1,699), ClearCalcs Ultimate ($1,490), SkyCiv (~$1,250); only one with dedicated solar + BIP |
| Complete Premium | $1,490/yr | = ClearCalcs Ultimate, under ENERCALC; + solar + BIP + white-label they lack |
| Firm (10 seats) | $3,500/yr | crushes SkyCiv Enterprise ($5,000/5-seat) and ENERCALC per-seat |

Margin stays ~97% at every price; BIP-free inclusion costs ~$0 marginal. **Sealing is excluded from all tiers** — separate quoted service.

---

## Decisions to lock (the few real knobs)
1. **Flatten the à-la-carte discount?** (Recommended yes — it serves your own bundle-first principle.) Or keep a token 2-calc nudge for the visual?
2. **Tier prices** — Solo $99 / Pro $129 / Premium $149 (the band you already liked), differentiated by seats + BIP tier + report/branding + support?
3. **Tier feature walls** — confirm the seats (1/3/5/10) and BIP-tier-by-plan mapping; what else gates Pro vs Premium (white-label reports, revision history, API)?
4. **Pay-per-report / pay-per-export option** for occasional/solar buyers — yes/no?
5. **Free 14-day full-Complete trial** — yes/no?
