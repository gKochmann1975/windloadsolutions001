# WindLoadCalc — Locked Pricing Model (Volume Curve)

**Status:** LOCKED 2026‑07‑18 (structure + numbers). Supersedes the varied‑per‑calc bases in
`PRICING_TABLE.md` / `pricing-model-explorer.html`. Tune/verify shapes in `pricing-curve-explorer.html`.

---

## 1. Principles
- **One base price per calculator**, uniform across ALL calcs: **$35 / $59 / $149** (Starter / Pro / Premium).
- **Tier multiplier** (from live W/D): Starter **×1.0**, Pro **×1.69**, Premium **×4.26**. Enterprise = custom quote.
- **Annual = pay 10, get 12** (2 months free).
- The discount comes from a **volume CURVE**, never from different per‑calc prices.

## 2. The curve — COUNT‑based
Price depends on **how many** calculators you own, **not which**. Owned calcs are **never repriced
individually** — the single subscription steps up (or down) the curve as you add (or drop) calcs.

**Model:** `total(N) = base × N^0.646` — a power curve (concave, **never caps**, every add cheaper than
the last, total always rises → we keep earning as the catalog grows).

**Starter tier ($35 base):**

| Calcs (N) | Total /mo | Add‑next | Eff. $/calc | Discount |
|---:|---:|---:|---:|---:|
| 1 | $35 | — | $35 | — |
| 2 | $55 | **+$20** | $27 | 22% |
| 3 | $71 | **+$16** | $24 | 32% |
| 4 | $86 | **+$15** | $21 | 39% |
| 5 | $99 | **+$13** | $20 | 43% |
| 6 | $111 | **+$12** | $19 | 47% |
| 7 | $123 | **+$12** | $18 | 50% |

Pro = these ×1.69, Premium = ×4.26. Annual = ×10.

## 3. "Complete"
- **Complete = own EVERY calculator = the curve at full catalog size, + BIP free.** It is *not* a separate
  discounted SKU — it's the top of the same curve.
- At today's ~5 sellable calcs: **Complete = Starter $99 / Pro $167 / Premium $421** (preserves the
  prior anchor). **It auto‑grows as new calcs ship** (6th → $111, etc.) — that's the money‑as‑we‑grow engine.
- Owning the full set flips **BIP to free**.

## 4. BIP add‑on
- Anyone **not** at the full set can add **full BIP access for +$5/mo** — flat, **attach‑only** (not a
  standalone BIP price; protects standalone BIP tiers).
- Offer **surfaces at the 2nd calculator**.
- **Free at Complete** → the $5 attach doubles as a Complete nudge ("paying $5 for BIP? Complete includes it free + every calc").

## 5. Two surfaces, ONE engine
Same curve, same math, same result for the same count — whichever door they enter.
- **Existing user → account "Add calculators" screen.** Owned calcs shown checked/greyed, **not
  recharged**; the curve **continues from their current count**, so their "add‑next" is already deep/cheap.
- **New user → website Cart page.** Same curve, starting from zero.

## 6. UX mechanics (the rope‑in)
- **Hero = the shrinking "Add for +$X"** on every unselected calc card (drops as they select more).
- **Progress‑to‑Complete bar:** "You own 3 of 6 — get all + BIP free for +$X."
- **Strike‑through anchor:** show the separate/list price crossed out next to the curve price.
- **"Save more" reveal after the 2nd add** — as real numbers ("saving $Y vs separate; each next costs less").
- **Complete‑the‑set → BIP free** nudge near the top.
- **Annual "2 months free"** toggle at the point of decision.
- **Existing‑user proration shown plainly:** "+$X/mo, prorated $Y for the rest of this cycle."

## 7. Billing (Stripe) — implementation intent
- Count‑based: the subscription's price = `curve(N)`. Add/remove → move to `curve(N±1)` with proration.
- BIP = a +$5 add‑on line, auto‑removed/zeroed at Complete.
- Reuse the proven lazy‑price‑create path (`subscription_manager.py`) — prices generated from the curve.
- All current products ($35/$59/$149) already live & payment‑verified (see `project_stripe_payments_verified`).

## 8. Build phases
1. **Shared pricing engine** — one JS module (`pricing-engine.js`): curve, add‑next, Complete, BIP, tiers,
   cycle. Single source of truth for both surfaces + mirrored server‑side.
2. **Cart surface** (new user) — build on the engine.
3. **Account "Add calculators" surface** (existing user) — same engine, owned‑state aware.
4. **Backend count‑based Stripe pricing + proration + BIP attach** — LIVE PAYMENT: staged on the Flask
   app, tested with `checkout-guest` before customer exposure.

---
*Sandbox for shape/number tuning: `pricing-curve-explorer.html` (set model = Power, exponent ≈ 0.65).*
