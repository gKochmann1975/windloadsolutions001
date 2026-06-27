# ASCE 7-22 Figure 29.4-2 — Force Coefficients, Cf
## Open Signs and Single-Plane Open Frames

**Source:** ASCE 7-22, Chapter 29, Section 29.4, Figure 29.4-2
**Status:** ⏳ UNVERIFIED — engine values listed below; confirm against the physical book.
**Engine file:** `webapp/asce7_22_other_open_signs.py`
**In-code note:** comment says "user-confirmed 2026-06-15" — **re-confirm against the book and
lock into the ledger; do not trust the in-code comment alone** (project hard rule).

> **Scope:** "Open" = openings ≥ 30 % of gross area, i.e. solidity ratio **ε ≤ 0.7**.
> If ε > 0.7 (openings < 30 %) it is a **solid** sign → use Figure 29.3-1 (the solid-sign /
> freestanding-wall sheet), not this one. The engine raises an error for ε > 0.7.

---

## Equation

**Eq. 29.4-1:**
```
F = qz · G · Cf · Af
```

Where:
- F = Design wind force, lb (N)
- qz = Velocity pressure (Eq. 26.10-1) at height z (top of sign)
- G = Gust-effect factor per Section 26.11 (**0.85** rigid) — *verify*
- Cf = Force coefficient from Figure 29.4-2 (table below)
- Af = **Solid** area projected normal to the wind, ft² (m²)

| Item | Engine | Book | ✅ |
|---|---|---|---|
| Kd (Table 26.6-1, open signs / single-plane open frames) | 0.85 | | ☐ |
| G (Section 26.11, rigid) | 0.85 | | ☐ |
| Af = solid (not gross) projected area | yes | | ☐ |

---

## Force Coefficients, Cf — Figure 29.4-2

Keyed by **solidity ratio ε** band × member type / Reynolds regime.
For rounded members, regime is set by **D·√qz** (D = typical round-member diameter, ft; qz in psf):
≤ 2.5 = subcritical, > 2.5 = supercritical.

| Solidity ratio ε | Flat-sided (eng) | Book | Rounded D√qz≤2.5 (eng) | Book | Rounded D√qz>2.5 (eng) | Book |
|---|---|---|---|---|---|---|
| **ε < 0.1** | 2.0 | ☐ | 1.2 | ☐ | 0.8 | ☐ |
| **0.1 ≤ ε < 0.3** | 1.8 | ☐ | 1.3 | ☐ | 0.9 | ☐ |
| **0.3 ≤ ε ≤ 0.7** | 1.6 | ☐ | 1.5 | ☐ | 1.1 | ☐ |

> ⚠️ **Confirm the band breakpoints** the book uses for ε (engine bins: `<0.1`, `0.1–0.29`,
> `0.3–0.7`). Some editions tabulate `< 0.1`, `0.1 to 0.29`, `0.3 to 0.7` exactly — confirm.
> ⚠️ **Confirm the D·√qz = 2.5** subcritical/supercritical threshold for rounded members.

---

## Notes to verify (from Figure 29.4-2)

| # | Engine's understanding | Book ✅ |
|---|---|---|
| 1 | Openings ≥ 30 % of gross area → open sign (ε ≤ 0.7) | ☐ |
| 2 | Force based on solid area projected normal to wind; acts parallel to wind | ☐ |
| 3 | Af = solid area projected normal to the wind direction | ☐ |
| 4 | Rounded members: regime via D·√qz threshold 2.5 | ☐ |

---

## Sign-off

- [ ] All 9 Cf cells confirmed against Figure 29.4-2
- [ ] ε band breakpoints confirmed
- [ ] D·√qz = 2.5 threshold confirmed
- [ ] Kd = 0.85 and G = 0.85 confirmed
- [ ] ε > 0.7 → solid-sign routing confirmed
- Verified by: _______________  Date: ___________
