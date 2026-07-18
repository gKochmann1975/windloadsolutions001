# Attached Canopies (§30.9) & Parapets (§30.6) — C&C Reference

**Status: BOOK-VERIFIED 2026-07-18** — Gregory Kochmann read the physical ASCE 7-22
figures cell-by-cell; values below are locked and the engines
(`webapp/asce7_22_cc_canopy.py`, `webapp/asce7_22_cc_parapet.py`) match them exactly
(smoke-tested). These are **Chapter 30 Components & Cladding** appurtenances (net /
surface pressure coefficients), **not** Chapter 29 force-coefficient structures.

---

## 1. Attached Canopies — ASCE 7-22 §30.9 (Figs 30.9-1A/1B, 30.9-2A/2B)

`p = qh·(GCp)` separate-surface method · `p = qh·(GCpn)` net method · qh at z = h · Kd = 0.85.

### Effective-wind-area curve breakpoints (where each curve bends) — CONFIRMED
| Height | Negative curves | Positive curve |
|---|---|---|
| h ≤ 60 | flat 1→10, ramp **10→100**, flat 100→1000 | same (bend 10→100) |
| h > 60 | ramp **10→100→1000** (no flat) | ramp 10→100, **flat 100→1000** |

Anchors below are (effective wind area ft², coefficient); `_lookup_from_curve` clamps
flat outside the listed range, so the anchor list encodes the shape.

### Fig 30.9-1A — SEPARATE surfaces, h ≤ 60 (GCp)
Note 1: values already envelope the most critical hc/he → no hc/he bands. Only three
curves: Upper (neg), Lower (neg), and one shared "Upper & Lower surfaces" (positive).
*(The old engine's phantom "combined negative" −1.7 was removed — it is not in the figure.)*
| Curve | @10 | @100 (flat to 1000) |
|---|---|---|
| Upper surface (neg) | −1.125 | −0.7 |
| Lower surface (neg) | −0.8 | −0.625 |
| Upper & Lower (pos) | +0.8 | +0.625 |

### Fig 30.9-1B — NET GCpn, h ≤ 60 — **THREE hc/he bands**
| Curve | @10 | @100 |
|---|---|---|
| Positive (all hc/he) | +0.875 | +0.6667 |
| Neg, 0.9 ≤ hc/he ≤ 1 | −1.375 | −1.125 |
| Neg, 0.5 < hc/he < 0.9 | −0.875 | −0.6 |
| Neg, hc/he ≤ 0.5 | −0.5625 | −0.45 |

### Fig 30.9-2A — SEPARATE surfaces, h > 60 (GCp)
| Curve | @10 | @100 | @1000 |
|---|---|---|---|
| Upper surface (neg) | −1.9 | −1.7 | −1.0 |
| Lower surface (neg) | −1.0 | −0.8 | **−0.5** |
| Upper & Lower (pos) | +0.8 | +0.6 | (flat) |

*(The −0.5 lower-surface endpoint at 1000 ft² was MISSING from the old engine — now added.)*

### Fig 30.9-2B — NET GCpn, h > 60 — **TWO hc/he bands** (not three)
| Curve | @10 | @100 | @1000 |
|---|---|---|---|
| Positive (all hc/he) | +0.9 | +0.65 | +0.65 |
| Neg, 0.9 < hc/he ≤ 1 | −2.3 | −2.1 | −1.2 |
| Neg, 0.1 < hc/he < 0.9 | −1.3 | −0.75 | −0.75 |

*(The old engine wrongly used three bands split at 0.5 for h > 60. Corrected: h > 60 has
TWO bands, split at 0.9, lower band spanning 0.1 < hc/he < 0.9.)*

### hc/he interpolation (Fig 30.9-1B/-2B Note 5: "Use linear interpolation for
intermediate values of hc/he") — implemented in `_gcpn_neg()`
Each band curve is anchored at a representative hc/he; GCpn is read at the effective
wind area, then linearly interpolated across hc/he and held flat outside the range:
- **h ≤ 60:** 0.95 → (0.9-1 curve), 0.70 → (0.5-0.9 curve), 0.50 → (≤0.5 curve)
- **h > 60:** 0.95 → (0.9-1 curve), 0.50 → (0.1-0.9 curve)

Sign convention (Note 3/4): **negative = uplift** (away from surface), **positive =
downward**. Each component designed for both. Minimum C&C design pressure 16 psf (§30.2.2).

---

## 2. Parapets — ASCE 7-22 §30.6 (Fig 30.6-1)

The parapet feels pressure on **both faces simultaneously**, so each of the two load
cases combines a front-face and a back-face coefficient. `p = qp·GCp_combined`, qp at the
**top of the parapet** (z = h + hp). Kd = 0.85.

| Load case | Front face | Back face | Physics |
|---|---|---|---|
| **A — Windward parapet** | +wall p₅ (Zones 4/5) | −**roof** p₇ (Zones 2/3) | back sits in the roof-edge separation zone → roof suction |
| **B — Leeward parapet** | +wall p₅ (Zones 4/5) | −**wall** p₆ (Zones **4/5**) | parapet acts as an extension of the wall → wall suction |

Combination (confirmed vs book 2026-07-13):
- Windward: `GCp = GCp_wall_pos − GCp_roof_neg`  (= |wall_pos| + |roof_neg|)
- Leeward:  `GCp = GCp_wall_pos − GCp_wall_neg`  (= |wall_pos| + |wall_neg|)

### ⚠ ASCE figure-note error (documented decision — Greg 2026-07-18)
Fig 30.6-1's Load Case B note 2 labels the negative **wall** pressure p₆ as
"**Zones 2 or 3**." Wall C&C zones are only **4 (interior) / 5 (corner)** — roof zones
are 1/2/3 — and p₅ (the positive wall pressure) is correctly tagged 4/5. So the "2 or 3"
on p₆ is a **book typo**; the engine uses the physically-correct **wall Zones 4/5** for
p₆ (decision A1). Following the note literally (roof Zones 2/3, ≈ −3.2 corner vs wall
−1.4) would roughly double the leeward back-face suction — over-conservative and wrong.

### Verification state
- **Wall GCp** (Fig 30.3-1 h≤60 / Fig 30.4-1 h>60) — ✅ verified (reused from the
  ledger-locked Windows/Doors engine).
- **Roof GCp, h ≤ 60** (Fig 30.3-2A, Zones 2/3) — ✅ inherited from the ledger-locked
  flat-roof figure (verified 2026-07-04).
- **Combination rule** — ✅ confirmed vs Fig 30.6-1.
- **Roof GCp, h > 60** (Fig 30.4-1 roof, Zones 2/3) — ⚠ **STILL PENDING**: the engine
  currently reuses the h≤60 roof values. Read Fig 30.4-1 roof before a parapet h>60 ships.

The engines carry these explanations in an `engineering_notes` field so the Engineering
Report and calc UI show the "why" (avoids reviewer phone calls).
