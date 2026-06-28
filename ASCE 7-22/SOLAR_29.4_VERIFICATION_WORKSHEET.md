# Solar (ASCE 7-22 §29.4) — Engine-vs-Book Verification Worksheet

Created 2026-06-22. Pairs the solar engines' coded values against ASCE 7-22 Ch 29
(scanned pages 308–313). Splits **CONFIRMED** (readable text/legend) from **NEEDS
BOOK-READ** (graph-traced curve values I cannot reliably read off the JPEGs — your
confirmation against the physical book required, per the never-guess rule).

Engines: `webapp/asce7_22_other_solar_rooftop.py`, `webapp/asce7_22_other_solar_ground.py`
Supersedes the solar rows in `UNVERIFIED_FIGURE_VALUES_WORKLIST.md` once you confirm.

---

## A. CONFIRMED against book text/legend (high confidence)

| Item | Book source | Engine | Status |
|---|---|---|---|
| Array edge factor γE = 1.0 (non-exposed collectors) / 1.5 (exposed panels) | p.308 legend + p.309 note | `is_exposed_panel` → 1.5 else 1.0 | ✅ match |
| Rooftop force/pressure eq form `p = qh·(GCrn)` | p.309 §29.4.3 | `p = qh * gcrn` | ✅ form match |
| Ground force `Fn = qh·GCgn·A`, moment `Mn = qh·GCgm·A·Lc` | p.310 §29.4.5 (Eq 29.4-8/9) | `Fn_pos = qh*gcgn_total*A`, `Mn=...*Lc` | ✅ form match |
| Combined coeff `GCgn = ±static ± dynamic` (Eq 29.4-10/11) | p.312/313 | `gcgn_total = gcgn_s + gcgn_d` | ✅ form match |
| Ground zones = 1 & 2; rooftop zones = 1, 2, 3 | p.308 / p.312 fig titles | matches | ✅ |
| ω bands: rooftop 0–5° & 15–35° (interp 5–15); ground static 0–5° & 15–60°, dynamic 0–15° & 15–60° | p.308 / p.312 / p.313 | matches | ✅ |
| A1 = min(4·Lc², 500), A2 = min(15·Lc², 1000) | p.313 notation | `calculate_area_thresholds` | ✅ (confirm exact form) |
| Ns reduced frequency, 1% damping basis | p.313 notation | `Ns = 0.682·n·Lc/V`, β=0.01 | ⚠️ confirm Ns coefficient 0.682 |
| Minimum design load 16 psf (§29.7) | §29.7 | `min_pressure_psf = 16.0` | ✅ |
| Ch26 base (Kz, Ke, Kzt, terrain) | Ch26 | identical to other engines | ✅ (prior audit confirmed) |

---

## B. NEEDS BOOK-READ — graph-traced curve values (HIGHEST RISK)

These are the anchor points the engine reads off the **figure curves**. Please confirm
each against the physical book. **A wrong γE/γa/GCrn that is too LOW makes the result
unconservative** (per the book's own note on Fig 29.4-8).

### B1. Fig 29.4-7 — Rooftop (GCrn)nom (book p.308) — ✅ USER BOOK-VERIFIED 2026-06-27
**CORRECTED from physical book p.308** (the prior JPEG-traced values were wrong — the
old code read LOWER than the book at small An, which was UNCONSERVATIVE). Anchors as
`(An, value)`, log-interpolated; An≤1 is the plateau. Engine updated + test WE-14.

**ω = 0–5° (left graph):**
| Zone | An ≤ 1 | An = 500 | An = 5000 |
|---|---|---|---|
| 1 | ✅ 1.5 | ✅ 0.35 | ✅ 0.10 |
| 2 | ✅ 2.0 | ✅ 0.45 | ✅ 0.15 |
| 3 | ✅ 2.5 | ✅ 0.50 | ✅ 0.15 |

**ω = 15–35° (right graph):**
| Zone | An ≤ 1 | An = 1000 | An = 5000 |
|---|---|---|---|
| 1 | ✅ 2.0 | ✅ 0.56 | ✅ 0.30 |
| 2 | ✅ 2.9 | ✅ 0.65 | ✅ 0.40 |
| 3 | ✅ 3.5 | ✅ 0.80 | ✅ 0.50 |

> Engine fixes 2026-06-27: (a) both ω-band tables replaced with the above; (b) the
> `get_gcrn_nom` lower clamp changed `max(10,...)` → `max(1,...)` so the An≤1 plateau is
> used (the old clamp skipped it). Original left-graph zone-3 read 1.5 was a slip; user
> corrected to 2.5 (normal 1.5<2.0<2.5 ordering).
> ⏳ OPEN (mid-range fidelity): the curve is anchored on the 3 read gridpoints per zone;
> intermediate An=10/100 not read. A single log-segment from An≤1→500/1000 may under-read
> mid-range — add the An=10/100 gridline values when convenient for a truer curve.

### B2. Fig 29.4-8 — Rooftop γa equalization (book p.310) — ✅ USER BOOK-VERIFIED 2026-06-27
**CORRECTED from physical book p.310** (prior JPEG-traced values were WRONG — too high,
and invented an A=5000 point). PARALLEL panels only. **Plateau-ramp-plateau**, x-axis 1→1000:
| Curve | A ≤ 10 (plateau) | A = 100 → 1000 (flat) |
|---|---|---|
| Solid (gap = 0.25", h2 = 10") | ✅ 0.80 | ✅ 0.45 |
| Dashed (gaps ≥ 0.75", h2 ≤ 5") | ✅ 0.60 | ✅ 0.43 |

> Shape: flat plateau to A=10, ramp down A=10→100, flat after. Engine fix 2026-06-27:
> tables replaced + `get_gamma_a` clamp `max(10,min(5000,..))` → `max(1,min(1000,..))` to
> match the figure's range. Test WE-14 (gamma_a block). Endpoints (0.45/0.43) read off the
> user's clear crop — confirm vs book if a hair different.

### B3. Fig 29.4-10 — Ground static GCgn / GCgm (book p.312) — `solar_ground.py:81-102`
`(A, value)`, endpoints only (engine log-interpolates A=1→10000):
| Coeff | ω band | Zone 1 (A=1 → 10000) | Zone 2 (A=1 → 10000) |
|---|---|---|---|
| GCgn,static | 0–5° | 1.0 → 0.8 | 2.5 → 1.5 |
| GCgn,static | 15–60° | 2.0 → 1.5 | 3.5 → 1.5 |
| GCgm,static | 0–5° | 0.10 → 0.10 | 0.30 → 0.30 |
| GCgm,static | 15–60° | 0.30 → 0.15 | 0.55 → 0.15 |

### B4. Fig 29.4-11 — Ground dynamic GCgn / GCgm (book p.313) — `solar_ground.py:121-166`
`(Ns, value)`, linear-interp on Ns, 1% damping. 16 curves:
| Coeff | Area | ω band | Zone 1 | Zone 2 |
|---|---|---|---|---|
| GCgn,dyn | A≤A1 | 0–15° | (0,1.2)(0.7,0.36) | (0,2.2)(0.7,0.80) |
| GCgn,dyn | A≤A1 | 15–60° | (0,2.4)(0.35,1.2)(0.8,0.40) | (0,4.2)(0.35,1.6)(0.8,0.40) |
| GCgn,dyn | A≥A2 | 0–15° | (0,0.90)(0.7,0.20) | (0,1.2)(0.7,0.30) |
| GCgn,dyn | A≥A2 | 15–60° | (0,1.7)(0.35,0.80)(0.8,0.40) | (0,3.4)(0.35,1.2)(0.8,0.40) |
| GCgm,dyn | A≤A1 | 0–15° | (0,0.27)(0.7,0.08) | (0,0.36)(0.7,0.17) |
| GCgm,dyn | A≤A1 | 15–60° | (0,0.45)(0.35,0.26)(0.8,0.18) | (0,0.75)(0.35,0.40)(0.8,0.18) |
| GCgm,dyn | A≥A2 | 0–15° | (0,0.18)(0.7,0.05) | (0,0.26)(0.7,0.08) |
| GCgm,dyn | A≥A2 | 15–60° | (0,0.34)(0.35,0.18)(0.8,0.08) | (0,0.64)(0.35,0.28)(0.8,0.08) |

---

## C. ✅ CONFIRMED — adjustment-factor formulas (Eq 29.4-6, p.309) — USER BOOK-VERIFIED 2026-06-27
All four formulas match the engine EXACTLY (read off clear p.309 crops). Test WE-14.
| Factor | Engine formula | Book p.309 |
|---|---|---|
| γp (parapet) | `min(1.2, 0.9 + hpt/h)` | ✅ min(1.2, 0.9 + hpt/h) |
| γc (chord) | `max(0.6 + 0.06·Lp, 0.8)` | ✅ max(0.6 + 0.06·Lp, 0.8) |
| Normalized area An | `(1000 / max(Lb,15)²) · A` | ✅ Note 3 exact |
| Lb | `min(0.4·√(h·WL), h, WS)` | ✅ min(0.4(hWL)^0.5, h, Ws) |
| ω interpolation 5°–15° | linear | ✅ Note 2 |

## C2. ENGINE ENFORCEMENT GAPS found in the p.309 read (rules, not values — values all OK)
These are NOT value errors; the engine just doesn't enforce them (takes inputs as given).
Build into the solar calc/UI/report:
1. **θ ≤ 7° applicability guard** — Fig 29.4-7 is valid only for roof slope θ ≤ 7°. Engine has no guard. Add a reject/warn.
2. **h = EAVE height for θ ≤ 10°** (Notation: "eave height shall be used for roof angle θ ≤ 10°"). Engine uses whatever `h` (mean roof height) is passed — does not switch to eave. Thread θ + eave.
3. **Exposure thresholds DIFFER by method** — engine takes `is_exposed_panel` as a boolean and does not compute it:
   - **§29.4.3 tilted (GCrn):** γE=1.5 within **1.5·Lp** from row end; exposed if d₁ to edge > 0.5h AND (d₁ to adjacent array > **max(4h₂, 4 ft)** OR d₂ to next panel > **max(4h₂, 4 ft)**).
   - **§29.4.4 parallel (γa):** γE=1.5 within **2h₂** from edge; exposed if d₁ to edge > 0.5h AND (d₁ > **2h₂** OR d₂ > **2h₂**).
   Add an `is_exposed(...)` helper per method.
4. **Eq 29.4-7 (parallel) form:** p = qh·**Kd**·(GCp)·γE·γa, where (GCp) = the ROOF C&C coeff (Figs 30.3-2A…, already verified) — i.e. parallel/flush panels ride the roof's own GCp × γE × γa. Engine folds Kd into qh (same result). γa/§29.4.4 permitted when ω≤2°, h₂≤0.83 ft, gap rules.
5. **Both load cases:** roof designed for solar-present AND solar-removed.

---

## How to use this
Mark each B/C value ✅ or write the correct book value next to it. I'll patch the
engine for any corrections, re-run the smoke tests, then build the Engineering Report
on the confirmed numbers. Until B and C are confirmed, the solar calcs stay admin-only.
