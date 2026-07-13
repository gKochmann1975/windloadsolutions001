# ASCE 7-22 Figure 29.4-1 — Force Coefficients, Cf
## Chimneys, Tanks, Rooftop Equipment (when treated as Other Structures), and Similar Structures

**Source:** ASCE 7-22, Chapter 29, Section 29.4, Figure 29.4-1
**Status:** ✅ VERIFIED 2026-07-12 (Gregory Kochmann, physical ASCE 7-22 book).
All 24 Cf cells matched the engine exactly (Fig 29.4-1). Octagonal is grouped with Hexagonal
("Hexagonal or octagonal") in the book → engine's shared row confirmed correct. Kd confirmed
against Table 26.6-1 (Square 0.90, Hex 0.95, Oct 1.0, Round 1.0). Subcritical/supercritical
threshold D·√qz = 2.5 (US) / 5.3 (SI) confirmed. Notes 1 & 2 confirmed.
**Engine file:** `webapp/asce7_22_other_chimneys_tanks.py`

> **How to use this sheet:** Open ASCE 7-22 to Figure 29.4-1. For every cell,
> read the book value and write it in the "Book Cf" column. If it matches the
> "Engine Cf" column, tick ✅. If it differs, write the book value and flag it —
> the engine gets corrected to match the book, never the other way around.

---

## Equation

**Eq. 29.4-1:**
```
F = qz · G · Cf · Af
```

Where:
- F = Design wind force, lb (N)
- qz = Velocity pressure (Eq. 26.10-1) evaluated at height z above ground
- G = Gust-effect factor per Section 26.11 (**0.85** for rigid structures) — *verify*
- Cf = Force coefficient from Figure 29.4-1 (tables below)
- Af = Projected area normal to wind, ft² (m²)

---

## Wind Directionality Factor Kd (Table 26.6-1) — by cross section

> Chimneys/tanks do **not** use the 0.85 buildings value. Confirm each against Table 26.6-1
> (row "Chimneys, Tanks, and Similar Structures").

| Cross section | Engine Kd | Book Kd | ✅ |
|---|---|---|---|
| Square | 0.90 | | ☐ |
| Hexagonal | 0.95 | | ☐ |
| Octagonal | 1.0 | | ☐ |
| Round | 1.0 | | ☐ |

---

## h/D breakpoints

Figure 29.4-1 tabulates Cf at **h/D = 1, 7, and 25**. Linear interpolation permitted for
intermediate h/D (Note 2). Engine clamps h/D to [1, 25]. — *confirm breakpoints & Note 2.*

| Engine breakpoints | Book breakpoints | ✅ |
|---|---|---|
| 1, 7, 25 | | ☐ |

---

## Cf — Square, Hexagonal, Octagonal cross sections

> "Type of surface = All" for these (no roughness split). D = least horizontal dimension.

| Cross section | h/D | Engine Cf | Book Cf | ✅ |
|---|---|---|---|---|
| **Square** (wind normal to face) | 1 | 1.3 | | ☐ |
| | 7 | 1.4 | | ☐ |
| | 25 | 2.0 | | ☐ |
| **Square** (wind along diagonal) | 1 | 1.0 | | ☐ |
| | 7 | 1.1 | | ☐ |
| | 25 | 1.5 | | ☐ |
| **Hexagonal** | 1 | 1.0 | | ☐ |
| | 7 | 1.2 | | ☐ |
| | 25 | 1.4 | | ☐ |
| **Octagonal** | 1 | 1.0 | | ☐ |
| | 7 | 1.2 | | ☐ |
| | 25 | 1.4 | | ☐ |

> ⚠️ **Engine assumption to verify:** Octagonal currently shares the **Hexagonal** Cf row.
> Confirm Fig 29.4-1 groups them ("Hexagonal/Octagonal") or lists Octagonal separately.

---

## Cf — Round cross section, D·√qz ≤ 2.5 (subcritical)

> Single surface-independent "All" row. (qz in psf, D in ft.)

| h/D | Engine Cf | Book Cf | ✅ |
|---|---|---|---|
| 1 | 0.7 | | ☐ |
| 7 | 0.8 | | ☐ |
| 25 | 1.2 | | ☐ |

---

## Cf — Round cross section, D·√qz > 2.5 (supercritical), roughness-dependent

> Roughness measured by D′/D (depth of protrusions ÷ diameter).
> Engine surface bins: moderately smooth `D′/D < 0.02`, rough `0.02 ≤ D′/D ≤ 0.08`, very rough `D′/D = 0.08`.

| Surface | h/D | Engine Cf | Book Cf | ✅ |
|---|---|---|---|---|
| **Moderately smooth** (D′/D < 0.02) | 1 | 0.5 | | ☐ |
| | 7 | 0.6 | | ☐ |
| | 25 | 0.7 | | ☐ |
| **Rough** (D′/D ≈ 0.02) | 1 | 0.7 | | ☐ |
| | 7 | 0.8 | | ☐ |
| | 25 | 0.9 | | ☐ |
| **Very rough** (D′/D ≈ 0.08) | 1 | 0.8 | | ☐ |
| | 7 | 1.0 | | ☐ |
| | 25 | 1.2 | | ☐ |

> ⚠️ **Verify the regime threshold:** engine uses **D·√qz = 2.5** as the subcritical/supercritical
> split (D in ft, qz in psf). Confirm against the Figure 29.4-1 column headings / footnotes.

---

## Notes to verify (from Figure 29.4-1)

| # | Engine's understanding | Book ✅ |
|---|---|---|
| 1 | Af = area projected on a vertical plane normal to wind | ☐ |
| 2 | Linear interpolation permitted for intermediate h/D | ☐ |
| 3 | D = diameter (round) or least horizontal dimension (square/hex) | ☐ |
| 4 | D′ = depth of protruding elements (ribs, spoilers) | ☐ |
| 5 | Round: D·√qz ≤ 2.5 subcritical, > 2.5 supercritical | ☐ |

---

## Sign-off

- [x] All Cf cells confirmed against Figure 29.4-1 — exact match
- [x] Kd-by-cross-section confirmed against Table 26.6-1 — exact match
- [x] G = 0.85 confirmed (Section 26.11, rigid)
- [x] Octagonal-shares-Hexagonal assumption resolved — book groups them, engine correct
- [x] D·√qz = 2.5 threshold confirmed (5.3 in SI)
- Verified by: **Gregory Kochmann**  Date: **2026-07-12**

> ⚠️ CODE (non-value) follow-ups, separate from this value sign-off:
> 1. Round surface bin: engine `_surface_roughness` classifies D′/D = 0.08 exactly as **rough**
>    (`<= 0.08`), but the book puts D′/D = 0.08 in **very rough**. Unconservative at that exact
>    boundary — change to `< 0.08`.
> 2. Audit (2026-07-09) reported the production/Flask chimney front-end posts `cross_section='square'`
>    (engine only accepts `square_normal`/`square_diagonal`). The Dash page is clean; re-confirm the
>    Flask path before selling.
