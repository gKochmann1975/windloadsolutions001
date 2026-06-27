# ASCE 7-22 Figure 29.4-3 — Force Coefficients, Cf
## Trussed Towers (Open Structures)

**Source:** ASCE 7-22, Chapter 29, Section 29.4, Figure 29.4-3
**Status:** ⏳ UNVERIFIED — engine formulas listed below; confirm against the physical book.
**Engine file:** `webapp/asce7_22_other_towers.py`

> Trussed towers of all heights, square and triangular cross sections. Cf is a **polynomial
> in the solidity ratio ε** (solid area ÷ gross area of one tower face), not a graph read —
> so verify the **coefficients of each polynomial** against the Figure 29.4-3 equations.

---

## Equation

**Eq. 29.4-1:**
```
F = qz · G · Cf · Af
```

Where:
- F = Design wind force, lb (N)
- qz = Velocity pressure (Eq. 26.10-1) at height z
- G = Gust-effect factor per Section 26.11 (**0.85** rigid) — *verify*
- Cf = Force coefficient from Figure 29.4-3 (formulas below)
- Af = Projected area of **ONE** tower face, ft² (m²)

| Item | Engine | Book | ✅ |
|---|---|---|---|
| Kd (Table 26.6-1, trussed towers) | 0.85 | | ☐ |
| G (Section 26.11, rigid) | 0.85 | | ☐ |
| Af = area of **one** tower face | yes | | ☐ |

---

## Force-Coefficient Formulas — Figure 29.4-3

ε = ratio of solid area to gross area of the tower face under consideration.

| Cross section | Engine formula for Cf | Book formula | ✅ |
|---|---|---|---|
| **Square** | `4.0·ε² − 5.9·ε + 4.0` | | ☐ |
| **Triangular** | `3.4·ε² − 4.7·ε + 3.4` | | ☐ |

### Round-member reduction factor (Note 3)

> For towers built with **round members**, multiply the (flat-member) Cf above by this factor —
> **but not more than 1.0**:

| Item | Engine | Book | ✅ |
|---|---|---|---|
| Round-member multiplier | `0.51·ε² + 0.57` | | ☐ |
| Cap | ≤ 1.0 | | ☐ |

### Spot-check values (engine output, for sanity at the book)

| ε | Square Cf (eng) | Triangle Cf (eng) | Round mult (eng) |
|---|---|---|---|
| 0.1 | 3.45 | 2.97 | 0.575 |
| 0.2 | 2.98 | 2.59 | 0.590 |
| 0.3 | 2.59 | 2.29 | 0.616 |
| 0.5 | 2.05 | 1.90 | 0.698 |

---

## Notes to verify (from Figure 29.4-3)

| # | Engine's understanding | Book ✅ |
|---|---|---|
| 1 | ε is for the tower-face region under consideration | ☐ |
| 2 | Force applied to the area of **one** tower face | ☐ |
| 3 | Round members: multiply Cf by (0.51·ε² + 0.57), ≤ 1.0 | ☐ |
| 4 | Ladders / conduit / lights use their own appropriate Cf | ☐ |
| 5 | Ice accretion loads per Chapter 10 when applicable | ☐ |

---

## Sign-off

- [ ] Square Cf polynomial coefficients confirmed (4.0 / −5.9 / 4.0)
- [ ] Triangular Cf polynomial coefficients confirmed (3.4 / −4.7 / 3.4)
- [ ] Round-member multiplier confirmed (0.51 / 0.57, cap 1.0)
- [ ] Af = one tower face confirmed
- [ ] Kd = 0.85 and G = 0.85 confirmed
- Verified by: _______________  Date: ___________
