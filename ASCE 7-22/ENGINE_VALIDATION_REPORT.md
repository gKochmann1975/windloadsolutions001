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

## Still to validate (need published examples)
| Calc | Status | Example source needed |
|---|---|---|
| MWFRS Directional (Ch 27, #2) | base validated; full pending | CED S02‑047 (directional) or equiv |
| C&C Roofs ×6 (#4–9) | figure‑verified; end‑to‑end pending | C&C worked example per shape |
| Other Structures (#12–17) | figure‑verified; end‑to‑end pending | chimney/sign/tower worked examples |
| Solar (#10/#11) | figure read still pending (graphs) | + snow/foundation (waiting on Ch 7/Ch 2 scans) |

**Note:** all the above are already figure‑cell verified against the physical book + ledger‑locked +
regression‑tested (WE‑3…WE‑13). This report adds the *independent end‑to‑end* layer on top.

## How this was run
Engines run directly (pure Python modules), e.g.:
`ASCE7_MWFRS_EnvelopeCalculator().calculate_envelope_pressures(115,'ultimate','C','enclosed',36.63,200,250,18.4)`.
Scratch scripts in the session scratchpad; PDFs mined with `pypdf` (text extraction).
