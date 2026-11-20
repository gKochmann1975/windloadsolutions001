# ASCE 7-22 Flat Roof C&C GCp Values — Verified Reference

**✅ VERIFIED 2026-07-04:** User confirmed the Fig 30.3-2A anchors against the high-res book
figure ("Correct"), AND `asce7_22_cc_roofs_flat.py` matches this reference EXACTLY at every
breakpoint: Zone 3 −3.2→−1.4(500sf), Zone 2 −2.3→−1.4(500sf), Zone 1 −1.7→−1.0(500sf),
Zone 1′ −0.9(10–100sf)→−0.4(1000sf), Positive +0.3(10sf)→+0.2(100sf). Flat + Gable θ≤7° locked.
**Date Verified:** February 2026
**Source:** ASCE 7-22, Figure 30.3-2A (h <= 60 ft), Figure 30.4-1 Note 6 (h > 60 ft)
**Cross-Ref:** "ASCE 7-22, Windows, Doors, Roofs_black & white.xlsx" — Tab: Gable_Hip Roofs (after column GN)
**ASCE 7-22 Updates Tab Confirmation:** "Figure 30.3-2A: NO CHANGE CONFIRMED" from ASCE 7-16

---

## Key Finding

GCp values **DIFFER by building height** for flat roofs (theta <= 7 degrees):
- **h <= 60 ft → Figure 30.3-2A** (values tabulated below).
- **h > 60 ft → Figure 30.4-1** (user-verified 2026-05-03, book p.334): larger edge/corner
  suction — Zone 1 −1.4→−0.9, Zone 2 −2.3→−1.6, Zone 3 −3.2→−2.3 (@A=10→500), and **no Zone 1′**.
  Only the A=10 corner/edge anchors coincide with the h<=60 curve; the A=500 ends are more negative.

The engine dispatches on `mean_roof_height` in `get_gcp_flat_roof()`. `calculate_wind_pressure()`
threads the height through so a tall flat roof uses the Fig 30.4-1 curve (regression: TEST 8 in
`tests/test_engine_roofs_flat.py`). An earlier note here claimed the values were identical for all
heights — that was INCORRECT and has been corrected.

---

## Roof Pressure Zones

| Zone | Description | Location |
|------|-------------|----------|
| **1'** | Interior field (large areas) | More than distance "a" from all edges, for large structural components (A = 100-1000 sf) |
| **1** | Interior field (standard areas) | More than distance "a" from all edges (A = 10-500 sf) |
| **2** | Edge / Perimeter | Within distance "a" from roof edge, but not at corners |
| **3** | Corner | Within distance "a" from two intersecting roof edges |

### Dimension "a" (differs by height — book-verified)
- **h ≤ 60 ft (Fig 30.3-2A):** a = min(10% least horizontal, 0.4h), not less than
  max(4% least horizontal, 3 ft).
- **h > 60 ft (Fig 30.4-1, book p.334):** a = 10% of least horizontal dimension,
  **not less than 3 ft (0.9 m)** — NO 0.4h cap and NO 4% rule.
- Jurisdictional floor: 4 ft for Florida (FBC) in place of the 3 ft ASCE floor (conservative).
- Zone layout (Fig 30.4-1): corner Zone 3 = 2a×2a, edge Zone 2 = width a, interior Zone 1;
  there is **no Zone 1′** for h > 60 ft.

---

## Negative GCp Values (Suction / Uplift)

### Zone 1' (Interior — Large Tributary Areas)
| Effective Wind Area (sf) | GCp |
|--------------------------|------|
| 100 | **-0.9** |
| 1000 | **-0.4** |
| Between 100-1000 | Log-scale interpolation |

### Zone 1 (Interior — Standard Tributary Areas)
| Effective Wind Area (sf) | GCp |
|--------------------------|------|
| 10 | **-1.7** |
| 500 | **-1.0** |
| Between 10-500 | Log-scale interpolation |

### Zone 2 (Edge / Perimeter)
| Effective Wind Area (sf) | GCp |
|--------------------------|------|
| 10 | **-2.3** |
| 500 | **-1.4** |
| Between 10-500 | Log-scale interpolation |

### Zone 3 (Corner)
| Effective Wind Area (sf) | GCp |
|--------------------------|------|
| 10 | **-3.2** |
| 500 | **-1.4** |
| Between 10-500 | Log-scale interpolation |

---

## Positive GCp Values (Inward Pressure)

Same for ALL zones (1', 1, 2, 3):

| Effective Wind Area (sf) | GCp |
|--------------------------|------|
| 10 | **+0.3** |
| 100 | **+0.2** |
| Between 10-100 | Log-scale interpolation |

---

## Roof Overhang GCp Values (Section 30.7)

Overhang values are negative only (uplift is the critical case).

### Zone 1' and Zone 1 Overhang (3-point piecewise curve)
| Effective Wind Area (sf) | GCp |
|--------------------------|------|
| 10 | **-1.7** |
| 100 | **-1.6** |
| 500 | **-1.0** |
| Between endpoints | Log-scale interpolation (piecewise at A=100) |

### Zone 2 Overhang
| Effective Wind Area (sf) | GCp |
|--------------------------|------|
| 10 | **-2.3** |
| 500 | **-1.1** |
| Between 10-500 | Log-scale interpolation |

### Zone 3 Overhang
| Effective Wind Area (sf) | GCp |
|--------------------------|------|
| 10 | **-3.2** |
| 500 | **-1.1** |
| Between 10-500 | Log-scale interpolation |

---

## Log-Scale Interpolation Formula

For area A between endpoints A_min and A_max with corresponding GCp values gcp_min and gcp_max:

```
GCp = gcp_min + (log10(A) - log10(A_min)) * (gcp_max - gcp_min) / (log10(A_max) - log10(A_min))
```

Values are clamped to the endpoint GCp values when A falls outside the specified range.

---

## Other Roof Types Using Flat Roof Values

Per ASCE 7-22, the following roof types at low slopes fall back to flat roof GCp values:

| Roof Type | Condition | Reference |
|-----------|-----------|-----------|
| Gable/Hip | theta <= 7 degrees | Figure 30.3-2A |
| Multispan Gabled | theta <= 10 degrees | Figure 30.3-4 |
| Monoslope | theta <= 3 degrees | Figure 30.3-5 |
| Sawtooth | theta <= 10 degrees | Figure 30.3-6 |

---

## Implementation File

Engine: `webapp/asce7_22_cc_roofs_flat.py`
- Class: `ASCE7_CC_FlatRoofCalculator`
- Single `get_gcp_flat_roof()` method for all building heights
- `get_gcp_overhang()` with 3-point piecewise curve for Zone 1'/1
- `_interpolate_gcp()` helper for log-scale interpolation
- `_normalize_zone()` helper for flexible zone input ("1'", "1_prime", "1p")

---

## Known Issues in Related Files

- **`asce7_22_cc_windows_doors.py` line 265**: Ke formula has positive exponent `math.exp(2.0e-4 * elevation_ft)` — should be negative `math.exp(-2.0e-4 * elevation_ft)`. Bug is masked by the `if elevation_ft <= 1000: return 1.0` guard. Flagged for correction.
