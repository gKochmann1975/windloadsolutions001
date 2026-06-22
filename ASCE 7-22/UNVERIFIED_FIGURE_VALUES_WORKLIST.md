# ASCE 7-22 — Unverified Figure Values Worklist

**Created 2026-06-21** from the engine-correctness audit (see memory
`audit_engine_correctness_2026_06_21.md`).

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

### [ ] Fig 30.3-2A — Flat roof, h ≤ 60 ft  (book ~p.319) — `asce7_22_cc_roofs_flat.py:303-331`
> ⚠️ This is the PRIMARY path for the most common case (every 1–2 story flat roof).
| Zone | A=10 | A=500 (or noted) | Confirm |
|---|---|---|---|
| Positive (all zones) | +0.3 | +0.2 @A=100 | [ ] |
| Zone 1′ | −0.9 @A=100 | −0.4 @A=1000 | [ ] |
| Zone 1 | −1.7 | −1.0 | [ ] |
| Zone 2 | −2.3 | −1.4 | [ ] |
| Zone 3 | −3.2 | −1.4 | [ ] |
> Note: Zone 2 and Zone 3 share the same A=500 anchor (−1.4) — unusual, confirm explicitly.

### [ ] Fig 30.3-2A overhangs / §30.7  — `asce7_22_cc_roofs_flat.py:375-398`
| Zone | A=10 | A=500 | Confirm |
|---|---|---|---|
| Zone 1′/1 | −1.7 | −1.0 (mid −1.6 @A=100) | [ ] |
| Zone 2 | −2.3 | −1.1 | [ ] |
| Zone 3 | −3.2 | −1.1 | [ ] |
> Overhangs usually govern (most negative) → an error here is directly safety-relevant.

### [ ] Fig 30.3-2B/C/D — Gable roof  — `asce7_22_cc_roofs_gable.py:226-291`
**Fig 30.3-2B (θ ≤ 20°):** Pos +0.6/+0.3 @(10/200) · Z1 −2.0/−0.5 @(10/300) · Z2 −2.7/−1.0 @(10/200) · Z3 −3.6/−1.8 @(10/100) — [ ]
**Fig 30.3-2C (θ ≤ 27°):** Pos +0.6/+0.3 @(10/200) · Z1 −1.5/−0.8 @(10/200) · Z2 −2.5/−1.2 @(10/100) · Z3 −3.0/−1.4 @(10/100) — [ ]
**Fig 30.3-2D (θ ≤ 45°):** Pos +0.9/+0.5 @(10/200) · Z1 −1.8/−0.8 @(10/100) · Z2 −2.0/−1.0 @(10/200) · Z3 −2.5/−1.0 @(10/200) — [ ]
> Also confirm the per-zone A-max breakpoints (300/200/100). And decide: linear θ-interpolation
> between figures vs the current hard θ-bands (step discontinuity at 20°/27°) — same issue the hip
> engine already fixed. Don't change interpolation until these cells are confirmed.

### [ ] Fig 30.3-2E/F/G — Hip roof  — `asce7_22_cc_roofs_hip.py:184-265`
**Fig 30.3-2E (7°<θ≤20°):** Pos +0.7/+0.3 · Z1 −1.8/−0.8 @(10/200) · Z2 −2.4/−1.3 @(10/200) · Z3 −2.6/−1.4 @(10/200) — [ ]
**Fig 30.3-2F (20°<θ≤27°):** Z1 −1.4/−0.8 @(10/100) · Z2 −2.0/−1.0 @(10/200) · Z3 −2.0/−1.0 @(10/200) — [ ]
**Fig 30.3-2G (27°<θ≤45°):** Z1 −1.5/−0.7 @(10/100) · Z2 −1.8/−0.8 @(10/50) · Z3 −2.4/−1.0 @(10/100) — [ ]

### [ ] Fig 30.3-5A/5B — Monoslope roof  — `asce7_22_cc_roofs_monoslope.py:155-190`
**Fig 30.3-5A (3°<θ≤10°):** Pos +0.3/+0.2 · Z1 −1.1 (const) · Z2 −1.3/−1.2 · Z2′ −1.6/−1.5 · Z3 −1.8/−1.2 · Z3′ −2.6/−1.6 @(10/100) — [ ]
**Fig 30.3-5B (10°<θ≤30°):** Pos +0.4/+0.3 · Z1 −1.3/−1.1 · Z2 −1.6/−1.2 · Z3 −2.9/−2.0 @(10/100) — [ ]
> ⚠️ Confirm the effective-area range: engine uses A=10→100 (not 10→500). Verify both anchors AND endpoints.

### [ ] Fig 30.3-4 — Multispan gable roof  — `asce7_22_cc_roofs_multispan.py:272-349`
**(10°<θ≤30°):** Pos +0.6/+0.4 · Z1 −1.6/−1.4 · Z2 −2.2/−1.7 · Z3 −2.7/−1.7 @(10/100) — [ ]
**(30°<θ≤45°):** Pos +1.0/+0.8 · Z1 −2.0/−1.1 · Z2 −2.5/−1.7 · Z3 −2.6/−1.7 @(10/100) — [ ]
> ⚠️ Upper anchor is A=100 (not 500). Confirm whether the curve plateaus at 100 or continues to 500.

### [ ] Fig 30.3-6 — Sawtooth roof  — `asce7_22_cc_roofs_sawtooth.py:296-386`
Zone1 +0.7/+0.4, −2.2/−1.1 · Zone2 +1.1/+0.8 (@A=100), −3.2/−1.6 · Zone3 +0.8/+0.7 (@A=100) ·
Zone3 neg Span A −4.1/−3.7/−2.1 (piecewise), Spans B/C/D −2.6/−1.9 (start A=100) — [ ]
> Most complex of the roof figures; verify the Span-A piecewise curve and the A=100 start points carefully.

---

## CHAPTER 29 — SOLAR

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
### [ ] Fig 29.4-1 round subcritical/supercritical mapping — `asce7_22_other_chimneys_tanks.py`
Cf values themselves ARE in the ledger and match. Re-confirm the round-section regime→row mapping
(D√qz ≤ 2.5 = subcritical single "All" row; > 2.5 = roughness rows) — this had a swap bug 2026-06-15. — [ ]

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
