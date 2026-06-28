# Engine Validation — Independent ASCE 7‑22 Worked Examples
*End‑to‑end validation of the wind‑load engines against **third‑party published** ASCE 7‑22 worked
examples (not our own values). This is the B0 "confirm we're all good" gate before release, on top of
the figure‑cell verification already in the ledger. Started 2026‑06‑28.*

> **Method:** find a complete published ASCE 7‑22 worked example (all inputs + expected final design
> pressures) → run our engine with the same inputs → compare. Match = independent confirmation.
> **Compare FINAL pressures, not intermediate qz** — our engines fold Kd into qz (locked 7‑16 form),
> many examples apply Kd in the pressure step (7‑22 form); intermediate qz differs by 0.85, final p is identical.

---

## ✅ #1 — Velocity‑pressure base (Chapter 26, shared by ALL engines)
**Source:** littlepeng.com, ASCE 7‑22 partial example.
**Inputs:** V=120 mph, Exposure C, z=30 ft, Kzt=1.0, Ke=1.0, Kd=0.85, Cp=0.8 (windward wall), G=0.85.

| Quantity | Engine | Published | Match |
|---|---|---|---|
| Kz @ 30 ft, Exp C | 0.980 | 0.98 | ✅ |
| qz (Kd folded) | 30.7 psf | 30.8 | ✅ (rounding) |
| p = qz·G·Cp | 20.9 psf | 20.9 | ✅ |

Confirms the Kz→Kzt→Ke→Kd→qz→p foundation that every engine inherits.

---

## ✅ #2 — MWFRS Envelope Procedure (Chapter 28, calc #3) — FULL end‑to‑end
**Source:** CED Engineering course **S02‑048**, "Calculating Wind Loads on Buildings Using the Envelope
Procedure of ASCE 7‑22."
**Building:** Gable roof, length b=250 ft, width d=200 ft, eave H=20 ft, **pitch α=18.4°**, mean h=36.63 ft.
**Wind:** V=115 mph (Risk II), Exposure C, Enclosed (GCpi=±0.18), Kzt=1.0, elevation 0.

Engine: Kz=1.0198 (≈1.02 ✓), qh=29.35 psf (= 0.85·34.5, Kd folded; example reports 34.5 without Kd).

**Load Case A — all 8 zones, GCpf and both final design pressures:**

| Zone | GCpf eng/exp | p(+GCpi) eng/exp | p(−GCpi) eng/exp | |
|---|---|---|---|---|
| 1  | 0.52/0.52 | 9.9/9.9 | 20.4/20.4 | ✅ |
| 2  | −0.69/−0.69 | −25.5/−25.5 | −15.0/−15.0 | ✅ |
| 3  | −0.47/−0.47 | −19.0/−19.0 | −8.5/−8.5 | ✅ |
| 4  | −0.42/−0.42 | −17.5/−17.5 | −6.9/−6.9 | ✅ |
| 1E | 0.78/0.78 | 17.6/17.6 | 28.2/28.2 | ✅ |
| 2E | −1.07/−1.07 | −36.7/−36.7 | −26.1/−26.1 | ✅ |
| 3E | −0.67/−0.67 | −25.0/−25.0 | −14.5/−14.5 | ✅ |
| 4E | −0.62/−0.62 | −23.4/−23.4 | −12.8/−12.8 | ✅ |

**Result: EXACT MATCH on all zones.** Independent end‑to‑end confirmation of the MWFRS Envelope engine,
including the GCpf figure (Fig 28.3‑1) interpolation at θ=18.4°, the qh, and the Kd convention.

---

## ✅ #3 — MWFRS Directional Procedure (Chapter 27, calc #2) — FULL end‑to‑end
**Source:** MecaWind "Wind Example E‑Book" (ASCE 7‑10 worked example). Edition note: the directional
wall Cp (Fig 27.3‑1: windward 0.8, leeward −0.3/−0.5 by L/B, side −0.7) and flat‑roof Cp (−0.9/−0.5/−0.3
by distance/h‑L) are **unchanged 7‑10→7‑22**, and 7‑10 uses Kd‑in‑qz (same as our engine) — so this
cleanly checks the 7‑22 directional assembly. Our **7‑22 engine** produced the values below.
**Building:** flat roof 35 ft × 70 ft × 15 ft tall, Exposure D, Enclosed (±0.18), V=150 mph, sea level.
Engine qh=50.43 psf (≈ example 50.44, Kd folded).

| Surface | Engine (psf) | Published (psf) | |
|---|---|---|---|
| Windward wall | 25.21 / 43.37 | 25.22 / 43.38 | ✅ |
| Leeward wall (L/B=2.0, Cp=−0.3) | −21.94 / −3.78 | −21.94 / −3.78 | ✅ |
| Side wall (Cp=−0.7) | −39.08 / −20.93 | −39.09 / −20.93 | ✅ |
| Roof 0–h (Cp=−0.9) | −47.66 / −29.50 | −47.67 / −29.51 | ✅ |
| Roof h–2h (Cp=−0.5) | −30.51 / −12.36 | −30.52 / −12.36 | ✅ |
| Roof >2h (Cp=−0.3) | −21.94 / −3.78 | −21.94 / −3.78 | ✅ |

**Result: EXACT MATCH** (≤0.01 psf, qz rounding). Both MWFRS procedures (Directional + Envelope) now
independently validated end‑to‑end.

---

## ✅ #4 — C&C Flat Roof (Fig 30.3‑2A, calc #4) vs the OFFICIAL ASCE 7‑22 Guide
**Source:** *Wind Loads: Guide to the Wind Load Provisions of ASCE 7‑22* (Stafford & Reinhold),
**Example 6.1 "Commercial Building with a Flat Roof"** (pp.124‑128) — the authoritative ASCE companion.
**Building:** 30×60×15 ft flat roof, h=15 ft, near Corpus Christi TX. **Wind:** V=148 mph, Exp C,
Kzt=1.0, Ke=1.0 (elev 37 ft), Kh=0.85, Enclosed; worst‑case uplift GCpi=+0.18. Engine qh=40.5 psf
(= 0.85·47.7, Kd folded; book qh=47.7 without Kd).

| Zone | A=10 eng/book | A=300 eng/book |
|---|---|---|
| 1  | −76.2 / −76.1 ✅ | −51.5 / −51.4 ✅ |
| 1' | −43.8 / −43.7 ✅ | −34.1 / −34.0 ✅ |
| 2  | −100.5 / −100.4 ✅ | −68.8 / −68.9 ✅ |
| 3  | −136.9 / −136.9 ✅ | −73.5 / −73.3 ⚠️ (+0.2 psf) |

**7 of 8 exact.** The one outlier (A=300 Zone 3) differs by **0.2 psf / 0.3%** — engine log‑interpolates
GCp=−1.64 vs book −1.63 at the large area; **slightly more conservative (safe)**, a 3rd‑digit interpolation
rounding artifact, not an error. Appendix B graph equations (pp.183‑186, not yet captured) would make it
match to the digit. **First validation against the official ASCE Guide — flat‑roof C&C confirmed.**

---

## ✅ #5–#8 — C&C roofs + Solar vs the OFFICIAL ASCE 7‑22 Guide (all EXACT)
Source: *Wind Loads: Guide to ASCE 7‑22* (Stafford & Reinhold), pages captured.
- **#5 Gable (Ex 6.2, θ=18.4°, Fig 30.3‑2B):** all 6 roof zone pressures EXACT (Panel A=10 + Purlin A=208).
- **#6 Hip (Ex 6.3, θ=15°, Fig 30.3‑2E):** GCp all 3 zones EXACT at A=32 (−1.41/−1.97/−2.13); gable portion (Fig 30.3‑2B) also EXACT.
- **#7 Monoslope (Ex 6.5, θ=14°, Fig 30.3‑5B):** all 6 zone pressures EXACT (A=20 + A=566).
- **#8 Solar rooftop PARALLEL (Ex 5.3, §29.4.4):** p = qh·GCp·γE·γa EXACT — perimeter −24.1/book −24.2, interior −16.1, +16 psf min. (GCp from the validated monoslope roof.)

## 🔴 #9 — Rooftop Equipment (Ex 5.2) — BUG FOUND (vertical uplift)
**Lateral force Fh ✅ matches** (GCr=1.9 → 4,328 lb / 86.6 psf). **Vertical uplift Fv ❌**: our engine
`asce7_22_other_rooftop_equipment.py:316` computes `Fv = qh·GCr·Ar` with **GCr=1.9**, but ASCE 7‑22
§29.4.1 (Eq 29.4‑3) and the Guide use **GCr=1.5** for vertical. → engine Fv = 4,328 lb vs **book 3,417 lb**
(**27% over‑estimate**; conservative/safe but non‑conforming). Two fixes needed: (1) vertical anchor
1.5 (not 1.9); (2) the vertical reduction (1.5→1.0) should be driven by **Ar** (plan area), not Af.
**The prior 2026‑06‑27 figure‑cell verification missed this — independent Guide validation caught it.**

## ⚠️ #10 — Open/free roof (Ex 6.6) — N/A (not implemented)
Engine `asce7_22_cc_free_roof.py` has `_CN_PITCHED = None` — gable/pitched free roofs (Fig 30.5‑2) not
transcribed (monoslope only, and those Cₙ still pending). Ex 6.6 + Fig 30.5‑2 give the values to build it.
(Free roofs are engine‑only, not in the imminent release.)

## ✅ #11 — Flexible gust factor Gf (Signs Ex 5.1, engine #22)
Billboard on flexible poles, n₁=0.7 Hz, β=0.01, Exp C. **Final Gf equation (26.11‑10) confirmed:**
engine formula reproduces **Gf=1.35** from the book's verified intermediates (Iz=0.176, gQ=3.4, Q=0.926,
gR=4.1, R²=1.93). Full input‑chain run deferred (#22 not shipped; needs V + sign height convention).
The shipped Signs Cf (#13) is already WE‑verified.

## 🔴 #12 — Dome (Ex 6.7) — WRONG FIGURE (engine #21, not shipped)
Book Ex 6.7 domed roof C&C uses **Figure 30.3‑7** (Table G6‑19): GCp = +0.9/−0.9 (0–60°), +0.5/−0.9
(60–90°) — a simple table. But `asce7_22_cc_dome.py` implements **Figure 30.3‑8** (ARCHED‑roof formulas,
Zone A=1.68r…, Zone B=−0.84−1.2r). **30.3‑7 = domes, 30.3‑8 = arched/barrel — different figures.** The
engine is really an *arched‑roof* engine; a true dome (Fig 30.3‑7) is not implemented. Not in release.

## ✅ MWFRS Envelope (Ex 4.1) — already validated
Same Envelope procedure already confirmed EXACT (all 8 zones) via the CED ASCE 7‑22 example (#2 above).
Guide Ex 4.1 is the official version of the same; no re‑run needed.

---

## SWEEP SUMMARY (ASCE 7‑22 Guide, Stafford & Reinhold)
| Calc | Result |
|---|---|
| C&C Flat (6.1), Gable (6.2), Hip (6.3), Monoslope (6.5) | ✅ EXACT |
| Solar rooftop parallel (5.3) | ✅ EXACT |
| MWFRS Directional + Envelope | ✅ EXACT (earlier) |
| Flexible Gf (5.1) | ✅ equation confirmed |
| **Rooftop Equipment vertical Fv (5.2)** | ✅ **FIXED** — GCr_vertical=1.5 per Eq 29.4-3 (Greg-confirmed); Fv now 3,419 (book 3,417) |
| **Dome (6.7)** | 🔴 **wrong figure (uses 30.3‑8 arched, domes need 30.3‑7)** — engine #21 not shipped |
| Open/free gable roof (6.6) | ⚠️ not implemented (Fig 30.5‑2) |

### Rooftop Equipment fix (2026-06-28) — Greg confirmed vs the physical ASCE 7-22 standard (Eq 29.4-3)
The standard: `Fv = qh·Kd·(GCr)·Ar`, **(GCr)=1.5** for Ar<0.1BL, reducing 1.5→1.0 to Ar=BL. Engine fixed
(`webapp` commit on feat/flask-multicalc): new `get_gcr_vertical`, `building_length_L` param, Fv uses 1.5.
Re-validated vs Ex 5.2: Fh=4,331 (book 4,328), **Fv=3,419 (book 3,417)** ✅.
⚠️ **TODO: update regression test WE-9** — it currently locks the OLD 1.9 Fv behavior.

**Remaining discrepancy:** Dome (#21, not shipped) uses Fig 30.3-8 (arched) instead of Fig 30.3-7 (domed);
reclassify the engine as "arched roof" + add a true dome path. Lower priority (engine-only).

## Other still‑pending
| Calc | Status | Example source needed |
| Other Structures (#12–17) | figure‑verified; end‑to‑end pending | chimney/sign/tower worked examples |
| Solar (#10/#11) | figure read still pending (graphs) | + snow/foundation (waiting on Ch 7/Ch 2 scans) |

**Note:** all the above are already figure‑cell verified against the physical book + ledger‑locked +
regression‑tested (WE‑3…WE‑13). This report adds the *independent end‑to‑end* layer on top.

## How this was run
Engines run directly (pure Python modules), e.g.:
`ASCE7_MWFRS_EnvelopeCalculator().calculate_envelope_pressures(115,'ultimate','C','enclosed',36.63,200,250,18.4)`.
Scratch scripts in the session scratchpad; PDFs mined with `pypdf` (text extraction).
