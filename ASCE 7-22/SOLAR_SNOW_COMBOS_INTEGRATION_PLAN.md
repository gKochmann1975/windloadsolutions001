# Solar Engineering Report — Snow (Ch 7) + Load Combinations (Ch 2) Integration Map

**Created 2026-06-28** from a read-through of the scanned ASCE 7-22 Chapter 2
(Combinations of Loads), Chapter 7 (Snow Loads), and Chapter 8 (Rain Loads).
Maps how snow + combinations fold onto the already-verified wind engines to make a
*complete* solar Engineering Report. **This is a build plan, not a value lock** —
the snow factor tables/figures still need a book-verify pass (see §6).

---

## 1. Why
A solar array (rooftop or ground-mount) and its racking must be designed for
**dead + wind + snow**, combined per Chapter 2. Wind is done and book-verified.
This adds the snow + combination side. (Rain — Ch 8 — is mainly a roof-structure
ponding check, `R = 5.2(d_s+d_h+d_p)`; not a panel load, so it's lower priority for
the array itself.)

## 2. Snow methodology (Ch 7) — the chain
| Quantity | Formula / source | Notes |
|---|---|---|
| **Ground snow `p_g`** | ASCE Design Ground Snow Load **Geodatabase**, Fig 7.2-1A–D + Table 7.2-1 (AK) | **Now per RISK CATEGORY** (separate map for I/II/III/IV) — *exactly like wind speed*. Hazard Tool / geodatabase is the source. |
| **Flat-roof `p_f`** | **`p_f = 0.7·C_e·C_t·p_g`** (Eq 7.3-1) | ⚠️ **No importance factor `I_s` in 7-22** (risk is baked into `p_g`). Confirm exact form on p.61. "Flat" = slope ≤ 5°. |
| **Sloped-roof `p_s`** | **`p_s = C_s·p_f`** (Eq 7.4-1) | `C_s` = slope factor, Fig 7.4-1 (depends on slope, `C_t`, slippery surface). |
| **Minimum `p_m`** | Table 7.3-4 (by risk category) | Low-slope roofs only. |
| **`C_e`** exposure factor | Table 7.3-1 | terrain category × roof exposure (fully/partially exposed/sheltered) |
| **`C_t`** thermal factor | Table 7.3-2 | heated 1.0 / kept-just-above-freezing 1.1 / unheated 1.2 / freezer 1.3 / heated greenhouse 0.85 |
| Drift / sliding / rain-on-snow | §7.7 / §7.9 / §7.10 | relevant where panels act as obstructions |

## 3. How snow applies to SOLAR (no dedicated section — derive it)
- **Ground-mounted array:** the panel plane is a **monoslope surface** at tilt ω → snow
  load via the sloped-roof path **`p_s = C_s·p_f`** (PV glass is *slippery* → lower `C_s`,
  often → 0 at steeper tilt). The support structure also carries it.
- **Rooftop array:** the **roof** snow (`p_f`/`p_s`) acts under/around the panels; the
  panels are **obstructions** → **drift (§7.7/§7.8)** and **sliding** snow on/off; snow on
  the panel itself = slippery sloped surface.
- **§7.13 (open-frame equipment — pipes, cable trays, p.70)** is the nearest explicit
  provision; the racking framework is analogous but the figures are for round members.
- ⚠️ Manufacturer test data / ASCE 49 wind-tunnel may govern specific products — flag in report.

## 4. Load combinations (Ch 2) — combine wind + snow + dead
**LRFD (strength), §2.3.1:**
1. 1.4D
2. 1.2D + 1.6L + 0.5(L_r or **S** or R)
3. 1.2D + 1.6(L_r or **S** or R) + (L or **0.5W**)
4. 1.2D + **1.0W** + L + 0.5(L_r or **S** or R)
5. 0.9D + **1.0W**

**ASD (allowable), §2.4.1:**
1. D · 2. D+L · 3. D+(L_r or **S** or R) · 4. D+0.75L+0.75(L_r or **S** or R)
· 5. D+(**0.6W** or 0.7E) · 6. D+0.75L+0.75(**0.6W**)+0.75(L_r or **S** or R)
· 7. 0.6D + **0.6W**

**Governing cases for a solar array:**
- **Uplift:** `0.9D + 1.0W` (LRFD) / `0.6D + 0.6W` (ASD) — wind up, minimum dead (snow absent).
- **Downward:** `1.2D + 1.6S` (snow-dominated) and `1.2D + 1.0W + 0.5S` / `1.2D + 1.6S + 0.5W` (combined).
- Run **both** "solar present" and "solar removed" roof cases (§29.4.3 note).

## 5. Build plan (phased — this is a real new feature, not a verify pass)
1. **Snow engine** `webapp/asce7_22_snow.py`: `p_g → p_f → p_s`, `p_m`, factors `C_e/C_t/C_s`,
   drift/sliding helpers. Pure functions, same pattern as the wind engines.
2. **`p_g` by location**: extend the existing ZIP→wind-speed velocity-finder to also return
   **ground snow by risk category** (same geodatabase pattern). Biggest reuse win.
3. **Combinations module**: apply the §2.3 LRFD + §2.4 ASD combos over {D, W (verified), S, (R)}.
4. **Solar report sections**: add a Snow load case + a Load-Combinations table to the solar
   Engineering Report (`solar_report.py`), pulling the verified wind pressures.
5. Inputs to thread: `p_g` (or ZIP), terrain/exposure → `C_e`, thermal → `C_t`, roof/panel
   slope → `C_s`, risk category, dead load of panels+racking.

## 6. Verification follow-ups (book-lock, the way we did wind)
Before any of this ships sealed, these need a physical-book confirm (mostly tables/formulas —
faster than the solar graphs; `C_s` is the one GRAPH):
- [x] `p_f` formula — `I_s` removed, `p_f = 0.7·C_e·C_t·p_g` ✅ **USER-VERIFIED 2026-06-28** (p.61)
- [x] **Table 7.3-1** `C_e` (terrain × exposure) ✅ **USER-VERIFIED 2026-06-28**
- [x] **Table 7.3-2** `C_t` ✅ **USER-VERIFIED 2026-06-28**
- [x] **Table 7.3-3** `C_t` heated/UNVENTILATED roofs (R_roof × p_g, bilinear; foot b: R>50→1.2)
      ✅ **USER-VERIFIED 2026-06-28** — *was a gap; not in the original engine skeleton*
- [x] **Table 7.3-4** `p_m,max` = 25/30/35/40 psf (Risk I/II/III/IV); `p_m = min(p_g, p_m,max)`
      ✅ **USER-VERIFIED 2026-06-28** (p.62) — *placeholder had used 20*
- [x] **Fig 7.4-1** `C_s`: (a) C_t=1.1 → 30°/5°, (b) 1.1<C_t<1.2 → 37.5°/10°, (c) C_t≥1.2 → 45°/15°;
      linear to 0 at 70°. ✅ **USER-VERIFIED 2026-06-28** (clear graph crops, like the solar figs)
- [ ] Drift (§7.7) + sliding (§7.9) + rain-on-snow (§7.10) provisions if the report covers them
      — **NOT yet implemented** (engine is balanced-snow only)
- [ ] Ch 2 combos — confirm full LRFD + ASD lists (p.7–10)

> **Status 2026-06-28:** `webapp/asce7_22_snow.py` BUILT + all balanced-snow factors book-verified;
> `VALUES_PENDING_VERIFICATION = False`. Regression locked in `validate_asce7_22.py` **WE-18**
> (25 assertions). Next: (b) `p_g` geodatabase lookup, then (c) combos + report sections.

## 7. Scope note
This is a **new feature** (snow engine + a snow geodatabase lookup + combination logic +
report sections), distinct from the wind verification we just finished. Recommended order:
**(a) build + book-verify the snow engine/factors → (b) add the `p_g` geodatabase lookup →
(c) wire combinations + the report sections.** Each is a self-contained chunk.
