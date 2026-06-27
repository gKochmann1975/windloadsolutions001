# ASCE 7-22 Section 29.4.1 — Rooftop Structures and Equipment for Buildings
## Combined Gust-Effect / Force Coefficient (GCr)

**Source:** ASCE 7-22, Chapter 29, Section 29.4.1 (Eqs. 29.4-2 and 29.4-3)
**Status:** ⏳ UNVERIFIED — engine values listed below; confirm against the physical book.
**Engine file:** `webapp/asce7_22_other_rooftop_equipment.py`

> This section is **text + formula** (no log-scale graph), so it should be quick to
> confirm by reading §29.4.1 directly. Write the book value beside each engine value
> and tick ✅, or flag the difference. The engine is corrected to match the book.

---

## Equations

**Eq. 29.4-2 (lateral / horizontal force):**
```
Fh = qh · (GCr) · Af
```

**Eq. 29.4-3 (vertical uplift force):**
```
Fv = qh · (GCr) · Ar
```

Where:
- Fh = Lateral force, lb (N)
- Fv = Vertical uplift force, lb (N)
- qh = Velocity pressure (Eq. 26.10-1) at the **mean roof height of the building**
- (GCr) = Combined gust-effect and force coefficient (below)
- Af = **Vertical** projected area of equipment normal to wind, ft² (m²) — drives Fh
- Ar = **Horizontal** projected (plan) area of equipment, ft² (m²) — drives Fv

| Item | Engine | Book | ✅ |
|---|---|---|---|
| Eq. number (lateral) | 29.4-2 | | ☐ |
| Eq. number (vertical) | 29.4-3 | | ☐ |
| qh at mean roof height of building | yes | | ☐ |
| Af = vertical projected area (Fh) | yes | | ☐ |
| Ar = horizontal plan area (Fv) | yes | | ☐ |

---

## (GCr) value and the permitted linear reduction

The engine uses **(GCr) = 1.9**, reduced **linearly to 1.0** as the projected area Af
increases from `0.1·B·h` to `B·h`:

```
Af ≤ 0.1·B·h        →  GCr = 1.9          (no reduction)
0.1·B·h < Af < B·h  →  GCr varies 1.9 → 1.0  (linear in Af)
Af ≥ B·h            →  GCr = 1.0
```

Where B = building horizontal dimension normal to wind, h = mean roof height.

| Parameter | Engine value | Book value | ✅ |
|---|---|---|---|
| (GCr) base (small equipment) | **1.9** | | ☐ |
| (GCr) floor (large equipment) | **1.0** | | ☐ |
| Full-1.9 threshold | Af ≤ **0.1·B·h** | | ☐ |
| Reduction-to-1.0 threshold | Af = **B·h** | | ☐ |
| Reduction shape | linear in Af | | ☐ |

> ⚠️ **Key things to confirm in §29.4.1:**
> 1. Is the base value **1.9**? (Some editions state 1.9 for rooftop equipment.)
> 2. Does the linear reduction run from **0.1·B·h → B·h**, ending at **1.0**?
> 3. Does the **same** (GCr) apply to both Fh (Eq. 29.4-2) and Fv (Eq. 29.4-3),
>    with the reduction driven by **Af** in both? (Engine assumes yes.)
> 4. Is there a **separate** vertical-uplift coefficient, or does Fv reuse (GCr)?

---

## Wind Directionality Factor Kd (Table 26.6-1)

| Item | Engine | Book | ✅ |
|---|---|---|---|
| Kd (rooftop equipment on a building → "Buildings") | 0.85 | | ☐ |

> Verify: rooftop equipment on a building is treated under the **building's** Kd = 0.85
> (Main Wind Force-Resisting System / C&C row), **not** the chimney/tank Kd values.

---

## Gust factor G

> Note: for the simplified §29.4.1 method, the gust effect is **folded into (GCr)** — there is
> no separate `G` multiplier in Eqs. 29.4-2/29.4-3 (unlike Eq. 29.4-1 for chimneys/tanks).
> Confirm the engine does **not** double-apply G here.

| Item | Engine | Book | ✅ |
|---|---|---|---|
| Separate G applied in 29.4-2/3? | **No** (folded into GCr) | | ☐ |

---

## Applicability

| Condition | Engine behavior | Book | ✅ |
|---|---|---|---|
| Af ≤ 0.1·B·h | GCr = 1.9 | | ☐ |
| 0.1·B·h < Af < B·h | GCr linear 1.9→1.0 | | ☐ |
| Af ≥ B·h | method no longer applies → design as part of MWFRS | | ☐ |

---

## Sign-off

- [ ] (GCr) = 1.9 base confirmed
- [ ] Linear reduction 0.1·B·h → B·h, floor 1.0 confirmed
- [ ] Eqs. 29.4-2 / 29.4-3 (Fh / Fv) confirmed
- [ ] Single (GCr) for both Fh and Fv confirmed (no separate uplift coefficient)
- [ ] Kd = 0.85 confirmed
- [ ] No double-applied G confirmed
- Verified by: _______________  Date: ___________
