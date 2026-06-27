# WindLoadCalc — Execution Roadmap
*Created 2026-06-27. Path from "calculators migrated to staging" → "calculators live + sellable per-calc with the Complete bundle." Owners: **G**=Greg, **C**=Claude (me), **A**=other agent (UI-format fix in progress).*

## Hard gates (nothing crosses these)
- **GATE 1 — Verification:** no calculator goes live until its ASCE 7-22 figure values are book-verified by Greg and locked in the ledger.
- **GATE 2 — On-brand UI:** every calculator must match the canonical **Windows/Doors/Shutters** workflow format (no bespoke formats). *(Workstream A, in progress by another agent.)*
- **GATE 3 — Catalog complete:** the "WindLoad Complete" all-access bundle only goes live once **all 6 wind products** have shipped (incremental release).

---

## Workstream A — UI format standardization  *(Owner: A, in progress)*
Bring MWFRS / Roofs / Specialized / Solar pages to the **canonical W/D workflow format** (fixes the off-brand drift from the custom `calc-workflow.js`).
- A1. Standardize each migrated calc page to the W/D structure (step-dial, velocity finder, help cards, report/save section, class names, breakpoints).
- A2. Re-apply features ON the W/D format: **US/Metric toggle**, slope edge-cases, pending-verification banner.
- **C dependency:** I pause bespoke-page edits; once A lands, I rebuild any feature work on the standardized format. **Do not touch A's files mid-flight.**

## Workstream B — Pricing model lock  *(Owner: G decides → C executes)*
- B1. **G** answers the open knobs: tier feature-walls (what splits Pro vs Premium — white-label / revision-history / API), pay-per-report option (y/n), free 14-day full-Complete trial (y/n), confirm Solo $99 / Pro $129 / Premium $149 + Firm $3,500/yr.
- B2. **C** locks the catalog: create the per-calc + Complete-tier **Stripe products** (mirroring the MWFRS pattern; flagged not-live). Wire `lookup_keys`.
- B3. **C** finalizes `pricing-model-explorer.html` to the locked numbers; produce a **customer-only** version (strip competitor/margin sections) as the in-account preview.

## Workstream C — Book-verification  *(Owner: G reads → C locks)*  **[GATE 1]**
The long pole, and Greg-dependent. Worksheets ready in `ASCE 7-22/`.
- C1. **Quick wins first (formula/text-based):** Rooftop Equipment (§29.4.1), Trussed Towers (Fig 29.4-3), Signs/Walls (Fig 29.3-1) — fast to confirm.
- C2. **Then graph-based (need careful book reads):** Chimneys (Fig 29.4-1), the 6 Roof shapes (Fig 30.3-2/-4/-5/-6), Solar (Fig 29.4-7/-8/-10/-11).
- C3. Per sheet: **G** fills "Book" columns → **C** cross-checks vs engine → lock values in `reference_asce_7_22_verified_values.md` (ledger) → fix any engine mismatch (webapp + backend + report, one commit) → add a regression test so it can't drift.

## Workstream D — Per-calc dynamic subscription build  *(Owner: C)*  **[needs B; Complete needs GATE 3]**
The "add subscriptions from your account" flow (the explorer made real).
- D0. **Phase 0** — wire the in-account "Add to my account" button → Stripe Checkout for a single calc (kills the `shell.js` `// TODO`). *Buildable now after B; independent of verification.*
- D1. **Phase 1** — dynamic add/remove via `Subscription.modify` + proration; item-keyed access reconciliation on `customer.subscription.updated`.
- D2. **Phase 2** — Complete bundle tiers (Solo/Pro/Premium) + annual ("2 months free") + BIP-tier-by-plan. *(Complete blocked by GATE 3.)*
- D3. **Phase 3** — team/seat hardening (owner-only add/remove, team-union read of live items, fix audit-flagged double-grant), Firm/Custom tier.

## Workstream E — Stripe ↔ backend DB wiring + gating audit  *(Owner: C)*  **[needs B]**
- E1. Create `SubscriptionProduct` rows for each calc + Complete tiers (calculator_files, Stripe price IDs).
- E2. Wire entitlement gating to the products (per-calc access via `lookup_keys`).
- E3. Clear the **subscription-gating audit** items: confirm the `mwfrs` product row exists in live DB before go-live; verify team-union + webhook double-grant fixes against prod DB.

## Workstream F — Engineering Reports  *(Owner: C)*  **[needs C per calc]**
- Build the Engineering Report (Generate / Print / Download / Save) for Roofs, Specialized, Solar — **after** each calc's values verify. (W/D + MWFRS reports already exist.)

## Workstream G — Go-live sequence  *(Owner: G approves, C ships)*  **[needs A + GATE 1 per calc + E]**
Flip calculators live **one at a time**, each only when it clears: on-brand UI ✓ · verified ✓ · Stripe product ✓ · report ✓.
- Order: **MWFRS** (most ready) → **Roofs** → **Specialized** (Signs/Equipment/Chimneys/Towers) → **Solar**.
- When the last one ships → GATE 3 clears → launch **WindLoad Complete** bundle + the customer "add subscriptions" flow.

---

## Today's parallel plan (full day)
| Track | Who | Do now |
|---|---|---|
| **B — Pricing** | G→C | G answers the 4 knobs (5 min) → C locks catalog + Stripe products |
| **C — Verification** | G→C | G starts the 2 quick sheets (Equipment, Towers) → C locks ledger + regression tests as they come in |
| **D0 — Build** | C | Scaffold Phase 0 (in-account add → checkout) on the standardized format once A lands |
| **A — UI fix** | A | (in flight) — C stays clear, rebuilds features on top after |

**Critical path:** Verification (C) gates go-live and is Greg-paced → start it first and feed me sheets as you finish them; I'll work B/D/E in parallel so nothing waits on me.

## Sequencing logic / dependencies
- B unblocks D + E (need locked prices/products).
- A (on-brand) + C (verified) + E (sellable) must ALL be true per calc before G (go-live).
- GATE 3 (all shipped) unblocks the Complete bundle + the full add-subscriptions UI.
- F (reports) is per-calc, after that calc's C (verification).
