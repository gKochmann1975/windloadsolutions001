# Calculator Pre‑Launch Scope Checklist
*What each calculator must include to be complete & code‑compliant before go‑live, the governing
ASCE 7‑22 / IBC reference for each, and whether we already have the reference material. Created
2026‑06‑27. Pairs with `ROADMAP_CALCULATOR_RELEASE_AND_TESTING.md` (release/billing process) and
`reference_asce_7_22_verified_values` (value verification). No guessing on code values — anything
marked ❌ needs a book scan before it ships.*

---

## Reference inventory (what we have vs. need)
**HAVE (in repo):** ASCE 7‑22 **wind** chapters 26–30 + wind‑coefficient sheets (roof GCp; sign/wall,
open‑sign, chimney/tank, trussed‑tower Cf; rooftop‑equipment GCr; Solar §29.4); IBC §1807.3 + Table
1806.2 (`IBC/IBC_1807.3_1806.2_POST_FOUNDATION_REFERENCE.md`, pulled online & cross‑checked).

**NEED scanned (priority order):**
1. **ASCE 7‑22 Chapter 7 — Snow Loads** (full text, equations, ALL maps/figures/tables; incl. rooftop‑solar snow provision + rain‑on‑snow surcharge).
2. **ASCE 7‑22 Chapter 2 — Load Combinations** (§2.3 LRFD / §2.4 ASD — wind + snow + dead).
3. *(later)* **ASCE 7‑22 Chapter 13 §13.6.12** — solar seismic (if scoped).
4. *(later, telecom)* **ANSI/TIA‑222‑I (2024)** — the whole standard (separate from ASCE 7).
5. *(ground‑mount solar foundations)* **ACI 318** footing/pier sections + a pile‑capacity reference.
6. *(ground‑mount solar RACKING — to compete with SkyCiv)* **Aluminum Design Manual (ADM)** for the aluminum rails + **AISI S100** for cold‑formed members. **AISC 360 we already HAVE** (`AISC/`, free PDF).
7. *(optional confirm)* IBC §1807.3.2.2 (constrained Eq 18‑2/18‑3) + §1806.3.4 isolated‑pole factor — a 2015 IBC is fine (these provisions are stable across editions).

---

## ☀️ SOLAR (rooftop + ground‑mount)
| Component | Reference | Status |
|---|---|---|
| Wind loads — **rooftop** | ASCE 7‑22 §29.4 | ✅ book‑verified + **report‑level validated vs Guide Ex 5.3** (`GUIDE_REPORT_CROSSREF.md`) |
| Wind loads — **ground‑mount** | ASCE 7‑22 §29.4.5 | ⚠️ engine done, but **no published worked example** to third‑party validate + **`row_spacing_S` UI gap** (Zone‑2 override unreachable — fix before ship) |
| **Snow loads** | ASCE 7‑22 **Ch 7** (Ce/Ct/Cs/pm; ground snow pg) | ✅ **BUILT** — `asce7_22_snow.py` book‑verified, balanced snow wired into the solar report (drift/sliding/rain‑on‑snow excluded + labeled) |
| Load combinations | ASCE 7‑22 **Ch 2** (wind + snow + dead) | ✅ **BUILT** — `asce7_22_load_combinations.py` (LRFD+ASD) in the report; factor lists pending one p.7‑10 confirm |
| **Ground‑mount foundation** | embedded post = IBC §1807.3 Eq 18‑1 · footings/piers/ballast = IBC Ch 18 + ACI 318 | ⚠️ embedded‑post **reference ✅** (same as signs) but **NOT built**; footing/pier/ballast path **❌ needs ACI** |
| **Racking / support structure (members + connections)** | **AISC 360** (steel posts/torque tubes, ✅ have) · **Aluminum Design Manual** (aluminum rails, ❌ need) · **AISI S100** (cold‑formed, ❌ need) | ❌ **NOT built — the SkyCiv‑competitive differentiator** (member sizing, deflection, connections). Separate, larger workstream — NOT an ASCE 7 extension. |
| Rooftop anchor uplift + roof‑member check | wind/snow reactions + member design (AISC/NDS) | ⚠️ logic only |
| Seismic (optional) | ASCE 7‑22 **Ch 13 §13.6.12** | ❌ need if included |

**Ground snow** is map/location‑based (like wind speed) → today it's **manual entry via the embedded ASCE
Hazard Tool** (required input); a `usps_zip_codes.csv`‑style lookup dataset is scaffolded for later.

**Competing with SkyCiv (the full ground‑mount PV package).** SkyCiv's solar wind docs are on ASCE **7‑16**;
we're on **7‑22**. The win is a single workflow that does **loads → racking members → foundation** — SkyCiv
makes engineers leave the tool for the structure + foundation. To get there we need TWO new builds beyond the
load engine: **(A) Racking/member design** (AISC 360 ✅ / Aluminum Design Manual ❌ / AISI S100 ❌) and
**(B) Ground‑mount foundation** (embedded post buildable now; footings/piers/ballast need ACI 318). These are
structural‑design modules, a different domain than the §29.4 wind coefficients — scope them as their own
products/phases, not as part of "finish solar."

---

## 🪧 SIGNS & FREESTANDING WALLS (+ Fencing)
| Component | Reference | Status |
|---|---|---|
| Wind force (Cf) | ASCE 7‑22 sign/wall + open‑sign Cf sheets | ✅ have |
| **Post foundation embedment** | **IBC §1807.3.2.1 (Eq 18‑1, nonconstrained) + Table 1806.2** | ✅ have (`IBC/IBC_1807.3_1806.2_POST_FOUNDATION_REFERENCE.md`); constrained Eq 18‑2/18‑3 + isolated‑pole factor flagged to confirm |
| Load combinations | ASCE 7‑22 Ch 2 | ❌ need Ch 2 |

Build: take P (wind force) + h from the sign/wall calc → solve Eq 18‑1 **iteratively** for embedment d
(≤12 ft; soil from Table 1806.2; isolated‑pole + 15× depth increases) → output d, hole size, backfill note.

---

## 🧱 OTHER STRUCTURES (chimneys / tanks / towers / rooftop equipment)
| Component | Reference | Status |
|---|---|---|
| Wind force (Cf / GCr) | ASCE 7‑22 chimney/tank, trussed‑tower Cf; rooftop‑equipment GCr sheets | ✅ have |
| Foundation / anchorage (when scoped) | IBC Ch 18 + ACI 318 (anchor bolts/footings) | ❌ need if scoped |
| Load combinations | ASCE 7‑22 Ch 2 | ❌ need Ch 2 |

---

## 📡 TELECOM TOWERS (separate future product)
Governed by **ANSI/TIA‑222‑I**, not ASCE 7. Full scope, feasibility, build plan & resources in
`TELECOM_TOWER_TIA222_OPPORTUNITY_AND_BUILD_PLAN.md`. Needs the TIA‑222‑I book + AISC + FEA reference +
tower PE. Deferred until the above calculators are live.

---

## Cross‑cutting
- **ASCE 7‑22 Chapter 2 (Load Combinations)** is needed by *every* calc that combines loads (wind+snow+dead). Single highest‑leverage scan after Ch 7.
- Value verification: every new figure/table value goes through the same book cross‑ref as the wind chapters (see `ASCE 7-22/UNVERIFIED_FIGURE_VALUES_WORKLIST.md`).

### Rain loads (ASCE 7‑22 Chapter 8) — OUT OF SCOPE (decided 2026‑06‑27)
Chapter 8 rain loads are a **flat/low‑slope ROOF ponding** problem (R = 5.2(ds + dh), water accumulating
when drains clog). **Not applicable** to the current calculators:
- **Solar:** tilted panels shed water — no ponding on the array. (The rain that matters for solar is the
  **rain‑on‑snow surcharge in Ch 7**, which *is* included.)
- **Signs / walls / towers / chimneys:** not roof surfaces — N/A.
- **C&C Roof calcs:** compute wind pressures (GCp), not roof framing/ponding capacity — N/A.
→ **No Chapter 8 scan needed.** Revisit ONLY if we ever build a flat/low‑slope **roof structural/ponding
design** calculator (then Ch 8 rain + ponding instability come into scope).

---

## Status summary
- **Signs/Fencing foundation:** ✅ reference complete (online) — buildable once wind side is verified.
- **Solar — rooftop:** ✅ wind report‑level validated (Guide Ex 5.3) + ✅ snow + ✅ load combos built into the report.
- **Solar — ground‑mount:** wind engine done but **not validated** (no published example) + **`row_spacing_S` UI gap** to fix;
  **foundation** (embedded‑post buildable now; footing/ballast needs ACI) and **racking** still to build.
- **Solar RACKING (SkyCiv differentiator):** ❌ not started — needs Aluminum Design Manual + AISI S100 (AISC 360 ✅ have).
  Separate structural‑design workstream; scope as its own product/phase.
- **Everything's wind side:** ✅ have references (rooftop/MWFRS now report‑level validated; others engine‑level WE‑verified).
