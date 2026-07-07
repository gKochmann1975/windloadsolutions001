# Feature: Wind‑Load *Applications* Layer — "what the number means"
*Proposed 2026‑06‑28 (Greg mockup: "Wind Load Pressure Applications Examples"). Turn the calculated
wind pressure into actionable selection/design decisions — windows, materials, and structure — with
diagrams. Strategic fit: deepens the "**the wind calc that doesn't stop at the math**" moat
([[project_competitor_strategy]]).*

---

## Concept
After the calculator produces the design pressures, an **Applications** view translates them into
real decisions, in three columns mapped to loads we already compute:

| Column | Driven by | Decision it answers |
|---|---|---|
| **Window / Opening Selection** | C&C wall pressure (W/D calc) | Does this window/door/shutter's **rated DP** meet the demand? |
| **Material Selection** | C&C pressure (roof/siding/cladding) | Does this siding/roofing **rated capacity** meet the demand? |
| **Structural Design** | MWFRS (base shear, moment, uplift) | Foundation / connection / tie‑down adequacy |

---

## THE make‑or‑break principle: a CHECKER, not a fabricated database
The mockup shows product numbers (e.g. "Metal Roofing 80 psf ✓"). Those are fine as *illustrations*,
but the shipped tool must **never present generic product ratings as fact** — real capacities vary by
manufacturer/approval, and asserting them is inaccurate + a liability ([[feedback_defensible_scale_claims]]).

**Correct model (already proven in W/D):** we compute the **demand**; the **user enters the candidate's
*rated* capacity** from its real **Florida Product Approval / Miami‑Dade NOA / ASTM** rating; engine
shows **PASS/FAIL + margin**. This is exactly how the existing **Product Certification** section works.

> **This already exists for windows.** `webapp/flask_app/calc_api.py` (~L260–282, L368–495) +
> `webapp/assets/cc_cert_toggle.js`: the W/D "Product Certifications" panel takes certified DP(+/−)
> per component, computes PASS/FAIL vs the required pressure, links to the FL Product Approval Search,
> and exports a "Product Certification Summary." **Window Selection = this, already built.**

---

## Phasing
### Phase 1 — Material Selection (extend the cert checker) ← do first
Generalize the existing component‑certification pattern from openings to **roof/siding/cladding
materials**: user enters the material's rated wind capacity (from its product approval) + tributary/
effective area → engine checks vs the **C&C demand** for that surface/zone → PASS/FAIL + margin +
"must meet or exceed" note. Reuses the W/D cert UI + PASS/FAIL + export plumbing. Low liability,
high value, ships on the live C&C calcs.
**Killer angle:** this is the **FL Product Approval / NOA matching** workflow contractors + building
officials do by hand — almost nobody automates "does this product's DP rating meet the calculated
design pressure?" Big differentiator in the FL market.

### Phase 2 — Diagrams (parallel, low‑risk)
Add visuals showing **where** pressures apply: building elevation/plan with windward/leeward/roof,
the C&C corner/edge/field zones, the opening locations. We already own the ASCE figures. Makes the
number legible to non‑engineers. (Greg's "+ Diagrams / w/ Diagrams" notes.)

### Phase 3 — Structural Design column (later, heavier)
Base shear / overturning moment / uplift from **MWFRS** → foundation + connection + tie‑down checks.
This crosses from *wind pressure* into *structural + foundation design* (reactions, capacities) — bigger
scope + more liability (same boundary as the telecom solver). Foundation "adequate/insufficient" must
come from **real** capacities (geotech / design), never generic numbers. Worth doing as a deliberate
later phase.

---

## Framing / liability (guardrails)
- Present as **"Applications & Evaluation guidance"** — educational; helps *evaluate* products vs the
  calculated demand. **Final selection is the engineer's responsibility.**
- **Never** call this "sealed" ([[feedback_no_sealed_reports_in_software]]) — it's part of the
  Engineering Report / permit‑ready export.
- No fabricated product numbers — user‑entered real ratings only, or sourced from a verifiable
  product‑approval database if we ever add one.

---

## Why it's worth doing
- Deepens the moat: competitors stop at the psf number; this bridges to the building decision.
- Reuses proven plumbing (the W/D cert checker) → Phase 1 is an extension, not a rebuild.
- The NOA/Product‑Approval matching is a real, unautomated pain point in the FL market.

## Open questions
- Do we ever build a real **product‑approval database** (FL Product Approval / NOA lookups) so the user
  doesn't hand‑enter ratings? (Big value, but a data‑maintenance commitment — could be Phase 4.)
- Structural column scope: stop at reactions (base shear/moment/uplift) the engineer applies, or go
  into foundation/connection design (more liability)?
