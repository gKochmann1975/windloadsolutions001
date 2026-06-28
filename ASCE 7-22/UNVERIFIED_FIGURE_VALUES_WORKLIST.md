# ASCE 7-22 — Unverified Figure Values Worklist (Verification Roadmap)

**Created 2026-06-21** from the engine-correctness audit (see memory
`audit_engine_correctness_2026_06_21.md`). **Last updated 2026-06-22** — added the
master calculator checklist + the Ch29 specialized calculators (now UI-exposed) +
solar status.

---

## MASTER CHECKLIST — every wind load calculator that needs a manual book cross-reference

This is the full list of calculators whose numbers you must personally confirm
against the ASCE 7-22 book before they can ship PE-sealed deliverables. ✅ = already
ledger-locked + code-verified (no action). ⬜ = built but figure values NOT in the
ledger — needs your book read. 🔲 = not built yet (verify when built).

| # | Calculator | UI status | Verify? | ASCE refs to cross-reference | Detail |
|---|---|---|---|---|---|
| 1 | **C&C Windows / Doors** | LIVE | ✅ verified | Ch26 universals, Fig 30.3-1 (walls), Fig 30.4-1 | ledger-locked |
| 2 | **MWFRS Building — Directional** | admin | ✅ verified | Ch27, Fig 27.3-1 | ledger-locked |
| 3 | **MWFRS Building — Envelope** | admin | ✅ verified | Ch28, Fig 28.3-1 | ledger-locked |
| 4 | **C&C Roof — Flat** | admin | ✅ VERIFIED 2026-06-27 | Fig 30.3-2A + overhang §30.7 | ledger-locked + test WE-3 |
| 5 | **C&C Roof — Gable** | admin | ✅ VERIFIED 2026-06-27 | Fig 30.3-2B/C/D | ledger-locked + test WE-4 |
| 6 | **C&C Roof — Hip** | admin | ✅ VERIFIED 2026-06-27 | Fig 30.3-2E/F/G | ledger-locked + test WE-5 (1 fix: 2G Z2 A 50→100) |
| 7 | **C&C Roof — Monoslope** | admin | ✅ VERIFIED 2026-06-27 | Fig 30.3-5A/5B | ledger-locked + test WE-6 |
| 8 | **C&C Roof — Multispan** | admin | ✅ VERIFIED 2026-06-27 | Fig 30.3-4 | ledger-locked + test WE-7 |
| 9 | **C&C Roof — Sawtooth** | admin | ✅ VERIFIED 2026-06-27 | Fig 30.3-6 | ledger-locked + test WE-8 |
| 10 | **Rooftop Solar** | admin | ⬜ NEEDS READ | Fig 29.4-7, 29.4-8, Eq 29.4-6 | **dedicated worksheet** `SOLAR_29.4_VERIFICATION_WORKSHEET.md` |
| 11 | **Ground-Mounted Solar** | admin | ⬜ NEEDS READ | Fig 29.4-10, 29.4-11 (+ Fig 29.4-9 zones) | **dedicated worksheet** (same file) |
| 12 | **Chimneys & Tanks** | admin | ✅ VERIFIED 2026-06-27 | Fig/Table 29.4-1 Cf row mapping | ledger-locked + test WE-10 |
| 13 | **Signs & Billboards** | admin | ⬜ NEEDS READ | §29.3, Fig 29.3-1 (solid-sign Cf) | §CH29 SPECIALIZED below |
| 14 | **Open Signs & Frames** | admin | ⬜ NEEDS READ | Fig 29.4-2 (open-sign Cf, ε-banded) | §CH29 SPECIALIZED |
| 15 | **Rooftop Equipment** | admin | ✅ VERIFIED 2026-06-27 | §29.4.1, (GCr) lateral/vertical | ledger-locked + test WE-9 |
| 16 | **Trussed / Comm Towers** | admin | ✅ VERIFIED 2026-06-27 | Fig 29.4-3 Cf(ε) + round-member factor | ledger-locked + test WE-11 |
| 17 | **Fencing / Freestanding Walls** | admin | ⬜ NEEDS READ | §29.3, Fig 29.3-1 (solid-wall Cf) | §CH29 SPECIALIZED |
| 18 | **Attached Canopies** | engine only | ⬜ NEEDS READ | Fig 30.9-1A/1B, 30.9-2A/2B (graphs) | §NEW ENGINES below |
| 19 | **Parapets (C&C)** | engine only | ⬜ partial | Fig 30.6-1 combo + roof Zones 2/3 (wall GCp ✅) | §NEW ENGINES |
| 20 | **C&C Free Roofs (open bldgs)** | engine only | ⬜ NEEDS READ | Fig 30.5-1 Cn table (monoslope done; pitched/troughed pending) | §NEW ENGINES |
| 21 | **Arch / Dome / Barrel Roofs** | engine only | ⬜ NEEDS READ | **Fig 30.3-8** (formulas by rise/span r) | §NEW ENGINES |
| 22 | **Flexible-Building Gf** | engine only | ⬜ NEEDS READ | §26.11.5 Eqs 26.11-10..16 + Table 26.11-1 | §NEW ENGINES |
| — | **MWFRS Free Roofs** | not built | 🔲 BLOCKED | Fig 27.3-4..-7 — **figures beyond scanned pages** (need pp.293-298) | — |
| — | **Parapets (MWFRS)** | not built | 🔲 future | §27/28 parapet loads | future |

> **Corrections (2026-06-23):** the old "not built" rows are now ENGINES (#18-22,
> built `webapp/asce7_22_cc_*.py` + `asce7_22_flexible_gust.py`, no UI yet, all values
> flagged `values_pending_verification`). Two roadmap mislabels fixed: **arched/dome =
> Fig 30.3-8** (not 30.3-7/2H/2I), and **Fig 30.5-1 = C&C OPEN-BUILDING free roofs**
> (not an "alternative simplified procedure" — that doesn't exist as 30.5-1 in 7-22).

**Cross-cutting OPEN QUESTION (affects the LIVE engine too):** Kz Exposure B below
z_min — the 0.70 floor vs raw Table 26.10-1 cells (0.57/0.62/0.66). See the OPEN
QUESTION section at the bottom. Conservative either way (no safety risk), but the
*reported* intermediate Kz for low-rise Exp-B is the floor.

**Bottom line: 12 calculators need your manual book cross-reference before they can
ship.** Done: #1–3 production; **ALL 6 C&C ROOF SHAPES (#4–9) VERIFIED 2026-06-27**
(tests WE-3…WE-8, 131 assertions; hip had one fix, 2G Zone 2 A-max 50→100); **#15
Rooftop Equipment VERIFIED 2026-06-27** (physical book, test WE-9). **Remaining
Specialized (#12–14,16,17): Chimneys, Signs, Open Signs, Towers, Walls — being
re-read from the physical book (Option B). Then Solar (#10,11) + scaffolds (#18–22).** #18-22 are brand-new
engines (no UI) built 2026-06-23; #20/#21/#22 use mostly READABLE tables/formulas
(higher confidence); #18 is graph-traced (lower). MWFRS free roofs is blocked on scans.

## Purpose
Every calculator listed below is **admin-gated / not yet shipped**. Each carries
GCp / Cf / coefficient values that were sourced from *"user Excel + screenshots"*
and have an in-code `# VERIFIED` comment — **but they are NOT in the authoritative
verified-values ledger** (`reference_asce_7_22_verified_values.md`). Per project
hard rules (verify against the book FIRST; the ledger is the single source of
truth; in-code "verified" comments are untrustworthy), these MUST be user-read
from the ASCE 7-22 book and locked in the ledger **before the corresponding
calculator ships PE-sealed deliverables.**

## How to use this
For each figure: open the ASCE 7-22 book to the cited page, compare each cell to
the **Engine value** shown, and mark `[x] confirmed` or write the correct value.
Then I'll (a) lock confirmed values into the ledger and (b) fix any engine
mismatch in webapp + backend + report as one atomic commit.

**Anchors are `value @ A=10 ft² / value @ A=max`** unless noted. Log-interpolation
between anchors. Confirm BOTH the anchor magnitudes AND the effective-area range
(several engines use A=10→100 instead of the usual 10→500 — flagged below).

---

## C&C ROOFS

### [x] Fig 30.3-2A — Flat roof, h ≤ 60 ft  (book ~p.319) — `asce7_22_cc_roofs_flat.py:303-331`
> ✅ VERIFIED 2026-06-27 — user confirmed "all match"; ledger-locked + regression test WE-3. All values below confirmed correct.
> ⚠️ This is the PRIMARY path for the most common case (every 1–2 story flat roof).
| Zone | A=10 | A=500 (or noted) | Confirm |
|---|---|---|---|
| Positive (all zones) | +0.3 | +0.2 @A=100 | [ ] |
| Zone 1′ | −0.9 @A=100 | −0.4 @A=1000 | [ ] |
| Zone 1 | −1.7 | −1.0 | [ ] |
| Zone 2 | −2.3 | −1.4 | [ ] |
| Zone 3 | −3.2 | −1.4 | [ ] |
> Note: Zone 2 and Zone 3 share the same A=500 anchor (−1.4) — unusual, confirm explicitly.

### [x] Fig 30.3-2A overhangs / §30.7  — `asce7_22_cc_roofs_flat.py:375-398`
> ✅ VERIFIED 2026-06-27 — confirmed with the field figure above.
| Zone | A=10 | A=500 | Confirm |
|---|---|---|---|
| Zone 1′/1 | −1.7 | −1.0 (mid −1.6 @A=100) | [ ] |
| Zone 2 | −2.3 | −1.1 | [ ] |
| Zone 3 | −3.2 | −1.1 | [ ] |
> Overhangs usually govern (most negative) → an error here is directly safety-relevant.

### [x] Fig 30.3-2B/C/D — Gable roof  — `asce7_22_cc_roofs_gable.py:226-291`
> ✅ VERIFIED 2026-06-27 — user confirmed "all match"; ledger-locked + regression test WE-4 (24 cells). θ-band breakpoints + per-zone area anchors all confirmed. (θ-interp-vs-hard-band decision still open below.)
**Fig 30.3-2B (θ ≤ 20°):** Pos +0.6/+0.3 @(10/200) · Z1 −2.0/−0.5 @(10/300) · Z2 −2.7/−1.0 @(10/200) · Z3 −3.6/−1.8 @(10/100) — [ ]
**Fig 30.3-2C (θ ≤ 27°):** Pos +0.6/+0.3 @(10/200) · Z1 −1.5/−0.8 @(10/200) · Z2 −2.5/−1.2 @(10/100) · Z3 −3.0/−1.4 @(10/100) — [ ]
**Fig 30.3-2D (θ ≤ 45°):** Pos +0.9/+0.5 @(10/200) · Z1 −1.8/−0.8 @(10/100) · Z2 −2.0/−1.0 @(10/200) · Z3 −2.5/−1.0 @(10/200) — [ ]
> Also confirm the per-zone A-max breakpoints (300/200/100). And decide: linear θ-interpolation
> between figures vs the current hard θ-bands (step discontinuity at 20°/27°) — same issue the hip
> engine already fixed. Don't change interpolation until these cells are confirmed.

### [x] Fig 30.3-2E/F/G — Hip roof  — `asce7_22_cc_roofs_hip.py:184-265`
> ✅ VERIFIED 2026-06-27 — user reviewed all; 1 correction: **2G Zone 2 A-max 50 → 100** (magnitude −0.8 unchanged). Engine fixed (line 255), ledger-locked, regression test WE-5.
**Fig 30.3-2E (7°<θ≤20°):** Pos +0.7/+0.3 · Z1 −1.8/−0.8 @(10/200) · Z2 −2.4/−1.3 @(10/200) · Z3 −2.6/−1.4 @(10/200) — [ ]
**Fig 30.3-2F (20°<θ≤27°):** Z1 −1.4/−0.8 @(10/100) · Z2 −2.0/−1.0 @(10/200) · Z3 −2.0/−1.0 @(10/200) — [ ]
**Fig 30.3-2G (27°<θ≤45°):** Z1 −1.5/−0.7 @(10/100) · Z2 −1.8/−0.8 @(10/50) · Z3 −2.4/−1.0 @(10/100) — [ ]

### [x] Fig 30.3-5A/5B — Monoslope roof  — `asce7_22_cc_roofs_monoslope.py:155-190`
> ✅ VERIFIED 2026-06-27 — user confirmed "all match". A-max=100 confirmed; Zone 1 (5A) constant −1.1; 2′/3′ only in 5A. Ledger-locked + test WE-6.
**Fig 30.3-5A (3°<θ≤10°):** Pos +0.3/+0.2 · Z1 −1.1 (const) · Z2 −1.3/−1.2 · Z2′ −1.6/−1.5 · Z3 −1.8/−1.2 · Z3′ −2.6/−1.6 @(10/100) — [ ]
**Fig 30.3-5B (10°<θ≤30°):** Pos +0.4/+0.3 · Z1 −1.3/−1.1 · Z2 −1.6/−1.2 · Z3 −2.9/−2.0 @(10/100) — [ ]
> ⚠️ Confirm the effective-area range: engine uses A=10→100 (not 10→500). Verify both anchors AND endpoints.

### [x] Fig 30.3-4 — Multispan gable roof  — `asce7_22_cc_roofs_multispan.py:272-349`
> ✅ VERIFIED 2026-06-27 — user confirmed "all match". A-max=100 confirmed (plateaus at 100). Ledger-locked + test WE-7.
**(10°<θ≤30°):** Pos +0.6/+0.4 · Z1 −1.6/−1.4 · Z2 −2.2/−1.7 · Z3 −2.7/−1.7 @(10/100) — [ ]
**(30°<θ≤45°):** Pos +1.0/+0.8 · Z1 −2.0/−1.1 · Z2 −2.5/−1.7 · Z3 −2.6/−1.7 @(10/100) — [ ]
> ⚠️ Upper anchor is A=100 (not 500). Confirm whether the curve plateaus at 100 or continues to 500.

### [x] Fig 30.3-6 — Sawtooth roof  — `asce7_22_cc_roofs_sawtooth.py:296-386`
> ✅ VERIFIED 2026-06-27 — user confirmed "all match". Per-zone positive, Z3 Span-A 3-point piecewise (−4.1/−3.7/−2.1), Z3 B/C/D start at A=100 — all confirmed. Ledger-locked + test WE-8. **Closes the C&C roof cluster.**
Zone1 +0.7/+0.4, −2.2/−1.1 · Zone2 +1.1/+0.8 (@A=100), −3.2/−1.6 · Zone3 +0.8/+0.7 (@A=100) ·
Zone3 neg Span A −4.1/−3.7/−2.1 (piecewise), Spans B/C/D −2.6/−1.9 (start A=100) — [ ]
> Most complex of the roof figures; verify the Span-A piecewise curve and the A=100 start points carefully.

---

## CHAPTER 29 — SOLAR

> **2026-06-22 UPDATE:** Both solar calculators now have a UI (admin-only -v2 routes)
> AND an Engineering Report scaffold (`webapp/solar_report.py`, banner stays "values
> pending verification" until confirmed). The figure values below are reproduced in a
> **dedicated cell-by-cell worksheet — `ASCE 7-22/SOLAR_29.4_VERIFICATION_WORKSHEET.md`**
> — which splits CONFIRMED (γE=1.0/1.5 + equation forms, read from book text) from the
> graph-traced curve values that still need your physical-book read. **Use that
> worksheet for solar.** The entries below are the quick index.
> ⚠️ PRIORITY: Fig 29.4-7 left-graph high-An endpoints may NOT match the coded
> 0.4/0.7/0.9 (the §29.4 figures are log-scale graphs — unreadable to ±0.05 from scans).

### [ ] Fig 29.4-7 — Rooftop solar (GCrn)nom, tilted panels  (book p.308) — `asce7_22_other_solar_rooftop.py:85-97`
**ω 0–5°:** Z1 [(10,1.0),(100,0.8),(500,0.6),(5000,0.4)] · Z2 [(10,1.8),(100,1.4),(500,1.0),(5000,0.7)] · Z3 [(10,2.8),(100,2.0),(500,1.4),(5000,0.9)] — [ ]
**ω 15–35°:** Z1 [(10,1.5)…] · Z2 [(10,2.5)…] · Z3 [(10,3.5)…] (confirm full curves) — [ ]

### [ ] Fig 29.4-8 — Rooftop solar array edge factor γ_a  (book p.310) — `asce7_22_other_solar_rooftop.py:115-123`
solid line [(10,1.0),(50,0.90),(100,0.85),(500,0.70),(1000,0.65),(5000,0.55)] · dashed [(10,0.85)…(5000,0.40)] — [ ]
> γ_a < 1.0 REDUCES pressure → if too low, result is unconservative.

### [ ] Eq. 29.4-6 adjustment factors  — `asce7_22_other_solar_rooftop.py:304-393,478`
γ_p = min(1.2, 0.9+hpt/h) · γ_c = max(0.6+0.06·Lp, 0.8) · γ_E = 1.0/1.5 ·
An = (1000/max(Lb,15)²)·A with Lb=min(0.4·√(h·WL), h, WS) · ω bands 0–5 / 15–35 with linear interp 5–15 — [ ]
> Confirm the ω-band routing (tilted vs parallel split) and the 5–15° interpolation gap.

### [ ] Fig 29.4-10/11 — Ground-mounted solar GCgn/GCgm  (book p.312/313) — `asce7_22_other_solar_ground.py:68-166`
Static (29.4-10) + dynamic (29.4-11) GCgn/GCgm anchor curves — zones 1/2, two ω bands, A≤A1 / A≥A2, Ns curves.
> Full table is large; verify against book pages 312–313. Engine's Ch26 base (Ke/Kz/terrain) is already confirmed correct.

---

## CHAPTER 29 — CHIMNEYS (engine fixed 2026-06-21, but confirm Cf row mapping)
> **2026-06-26:** dedicated cell-by-cell worksheet created —
> **`ASCE 7-22/CHIMNEYS_TANKS_Cf_REFERENCE.md`** (every Cf cell + Kd-by-cross-section +
> the D√qz threshold + the Octagonal-shares-Hexagonal assumption, each with a blank
> "Book" column to tick). Use that sheet when verifying.
### [x] Fig 29.4-1 round subcritical/supercritical mapping — `asce7_22_other_chimneys_tanks.py`
> ✅ VERIFIED 2026-06-27 (physical book, Option B) — all 8 Cf rows × h/D(1/7/25), round D√qz=2.5 split direction, octagonal=hex row, Kd-by-section. Ledger-locked + test WE-10.
Cf values themselves ARE in the ledger and match. Re-confirm the round-section regime→row mapping
(D√qz ≤ 2.5 = subcritical single "All" row; > 2.5 = roughness rows) — this had a swap bug 2026-06-15. — [ ]

---

## CHAPTER 29 — SPECIALIZED (UI-exposed 2026-06-22 → verification trigger fired)

These five got the Option-6 UI this session, so per the "verify when UI-exposed" rule
([[roadmap_asce_verification_pending]]) they now need a book cross-reference before
shipping. Engine values below are the real coded values (extracted 2026-06-22).
Each should get its own cell-by-cell worksheet like solar did when you sit down to verify it.

### [ ] Signs & Billboards (solid signs) — `asce7_22_other_signs_calculator.py`
F = q<sub>h</sub>·G·C<sub>f</sub>·A<sub>s</sub> (Eq. 29.3-1). Uses the **same Fig 29.3-1 C<sub>f</sub>
table** as freestanding walls (Case A/B/C, s/h × B/s). — [ ]
> A user reference exists: `SIGNS_FREESTANDING_WALLS_Cf_REFERENCE.md` (Feb 2026). Confirm
> that against the book + lock into the ledger; don't trust the in-code "VERIFIED" comment alone.

### [ ] Fencing / Freestanding Walls — `asce7_22_other_freestanding_walls.py:59-130`
Fig 29.3-1 C<sub>f</sub>, keyed s/h ∈ {0.16..1.0} × B/s ∈ {0.05..45}. Case A/B sample row
(s/h=1.0): C<sub>f</sub> = 1.80/1.70/1.65/1.55/1.45/1.40/1.35.../1.30. Plus Case C region
table. In-code says "verified pp.301-302". — [ ]
> Most detailed Ch29 table. Confirm Case A/B grid + Case C regions + the Case-C reduction note.

### [ ] Open Signs & Frames — `asce7_22_other_open_signs.py:61-71`
Fig 29.4-2 C<sub>f</sub> keyed [member regime][ε band]:
flat 2.0/1.8/1.6 · rounded-subcritical (D√qz≤2.5) 1.2/1.3/1.5 · rounded-supercritical (>2.5) 0.8/0.9/1.1 — [ ]
> **2026-06-26:** dedicated worksheet — **`ASCE 7-22/OPEN_SIGNS_OPEN_FRAMES_Cf_REFERENCE.md`**
> (9 Cf cells + ε bands + D√qz threshold + ε>0.7→solid routing). Use that sheet.

### [x] Rooftop Equipment — `asce7_22_other_rooftop_equipment.py`
> ✅ VERIFIED 2026-06-27 (physical book, Option B) — GCr 1.9→1.0 over 0.1·B·h→B·h, both force eqs, single GCr, Kd=0.85 (folded into qh). Ledger-locked + test WE-9.
(GC<sub>r</sub>) = **1.9** for A<sub>f</sub> ≤ 0.1·B·h, reduced linearly 1.9 → 1.0 for A<sub>f</sub>
between 0.1·B·h and B·h (§29.4.1). Confirm the 1.9 anchor, the 1.0 floor, and the area band. — [ ]
> **2026-06-26:** dedicated worksheet created — **`ASCE 7-22/ROOFTOP_EQUIPMENT_GCr_REFERENCE.md`**
> (1.9/1.0 anchors, the 0.1·B·h → B·h reduction band, Eqs 29.4-2/29.4-3, Kd=0.85, and the
> "no separate G / single GCr for both Fh & Fv" assumptions). This one is text+formula (no graph)
> → quickest to confirm. Use that sheet.

### [x] Trussed / Comm Towers — `asce7_22_other_towers.py:22-32`
> ✅ VERIFIED 2026-06-27 (physical book, Option B) — Square/Triangle polynomials + round-member (≤1.0) + diagonal (≤1.2) factors + Kd=0.85. Ledger-locked + test WE-11.
Fig 29.4-3 C<sub>f</sub>(ε): square = 4.0ε²−5.9ε+4.0 · triangle = 3.4ε²−4.7ε+3.4 ·
round-member multiplier = 0.51ε²+0.57. Confirm all three polynomial coefficient sets. — [ ]
> **2026-06-26:** dedicated worksheet — **`ASCE 7-22/TRUSSED_TOWERS_Cf_REFERENCE.md`**
> (3 polynomial coefficient sets + round-member cap ≤1.0 + one-face Af). Formulas not graphs
> → high-confidence verify. Use that sheet.

---

## NEW ENGINES (built 2026-06-23, engine-only, no UI) — verify before any UI/ship

All share the verified Chapter 26 base `webapp/asce7_22_cc_base.py` (inherited, not
re-transcribed). Each `calculate_*` returns `values_pending_verification=True`.

### [ ] #18 Attached Canopies — `asce7_22_cc_canopy.py` (Fig 30.9-1/-2, GRAPHS p.341-344)
Net method (GCpn, Fig *-1B/-2B) by hc/he band + separate-surface method (GCp upper/lower,
Fig *-1A/-2A), split at h=60. ⚠️ ALL anchors graph-traced → confirm vs book (low confidence).

### [ ] #19 Parapets (C&C) — `asce7_22_cc_parapet.py` (Fig 30.6-1 p.339)
Wall GCp (Fig 30.3-1/30.4-1) reused ✅ VERIFIED from W/D ledger. PENDING: (a) roof Zones 2/3
negative GCp (Fig 30.3-2A/30.4-1 — same as flat-roof engine, not yet ledger-locked); (b) the
§30.6 COMBINATION RULE — windward = +wall − (−roof); leeward pairing; qp at parapet top; the
3-ft parapet reduction note. Confirm the load-case logic against Fig 30.6-1.

### [ ] #20 C&C Free Roofs — `asce7_22_cc_free_roof.py` (Fig 30.5-1 TABLE p.336)
Monoslope Cn table transcribed (clear + obstructed flow, θ=0/7.5/15/30/45, 3 area bands,
Zones 1/2/3) — TABULAR, confirm cells. Pitched (Fig 30.5-2) + troughed (Fig 30.5-3) NOT yet
transcribed (pp.337-338 unread). Confirm p = qh·Cn (no separate G for C&C free roofs).

### [ ] #21 Arch/Dome Roofs — `asce7_22_cc_dome.py` (Fig 30.3-8 TABLE p.332)
GCp by rise-to-span r (formulas): Zone A (elevated: -1.08 / 7.2r-2.52 / 3.3r-0.84 by r-band;
ground: 1.68r), Zone B = -0.84-1.2r. Zone C delegates to Fig 30.3-2 roof zones. Confirm
formulas + r-band breakpoints (0.2/0.3/0.6) + dual Zone-A values.

### [ ] #22 Flexible-Building Gf — `asce7_22_flexible_gust.py` (§26.11.5 p.278)
Gf per Eqs 26.11-10..16 (Iz, Lz, Q, R, Rn, Rh/RB/RL, gR, Vz). Equation forms transcribed.
⚠️ Table 26.11-1 gust constants (ᾱ, b̄, c, ℓ, ε̄, zmin) are the standard published values but
NOT yet confirmed cell-by-cell vs this book. STANDALONE (not wired into MWFRS). Confirm
constants + each equation before any sealed use.

---

## OPEN QUESTION — Kz Exposure B below z_min (affects the LIVE C&C engine)
Surfaced by the regression harnesses 2026-06-21. **Every** engine's `calculate_kz`
returns the Section 26.10.2 **z_min floor (Kz=0.70)** for all Exposure-B heights
below 30 ft, instead of the raw Table 26.10-1 cells (**0.57** @≤15, **0.62** @20,
**0.66** @25). Both are transcribed in the ledger. This is a real table-vs-equation
tension in ASCE 7-22 itself:
- Table 26.10-1 tabulates the lower cells (0.57/0.62/0.66) below 30 ft.
- Eq. 26.10-1's `z < z_min → use z_min` floor gives ~0.70 for all B below 30 ft.

The engine uses the **floor (0.70)** — **conservative** (higher pressure → safe),
and standard for C&C where qh is taken at mean roof height. **No safety risk
either way.** But the *reported* intermediate Kz/qz for low-rise Exposure-B
buildings (the common case) is 0.70, not the lower table cell.

- [ ] **Confirm against the book's Table 26.10-1 footnote / §26.10.2:** for a direct
  Kz(z) lookup below z_min in Exposure B, does the floor (0.70) apply, or the raw
  tabulated cell? (Watch for any "Case 1 / Case 2" or "z not less than 30 ft in
  Exposure B" note.) If the raw cells should apply for any application (e.g. MWFRS
  windward-wall-per-height, per-segment towers), the engines + harness baseline
  must change together. The regression harnesses currently lock the engine's
  conservative floor behavior and flag this inline.

## After verification
For each `[x]` confirmed figure, tell me and I will:
1. Lock the values into `reference_asce_7_22_verified_values.md` (the ledger).
2. Fix any engine cell that disagrees (webapp + backend + report, one commit).
3. Move the item from `roadmap_asce_verification_pending.md` to VERIFIED.
4. Add a regression test so it can never silently drift.
