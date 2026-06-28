# ASCE 7-22 Chapter 32 — Tornado Loads — Engine Scope & Build Plan

**Status:** **PARKED (2026-06-27)** — deferred on a demand call, not a technical one. Scoping kept
for when/if it's revisited. Nothing built. No values written.
**Drafted:** 2026-06-27

> **Why parked (owner decision, 2026-06-27):** The math isn't the blocker — Greg has the book and
> Option B (user-supplied V_T from the ASCE Hazard Tool) needs **no shapefiles**, so the map-tracing
> problem is moot. It's parked purely on **demand**: the tornado-prone region is mostly
> weak-adoption / weak-enforcement for ASCE 7 wind law, and Ch. 32 only triggers for **RC III/IV**.
> Texas (jurisdiction-driven, also hurricane-exposed) is the only partial exception. Book-verification
> time is better spent on calcs that are legally required and in demand (C&C / MWFRS / roofs backlog).
> **Revisit triggers:** (a) IBC 2024 / ASCE 7-22 adoption spreads across the tornado belt, or (b) a
> paying RC III/IV customer asks. **Real tornado-design demand lives in storm shelters / safe rooms
> under ICC 500 + FEMA P-361 (often grant-funded → actually enforced) — a SEPARATE engine, not Ch. 32.**
**Hard rule:** Per project policy we do **not** write a single ASCE coefficient, map value,
table entry, or factor on faith. Every number below is marked **[VERIFY FROM BOOK]** and must
be transcribed from the physical ASCE 7-22 standard and entered into the verified-values ledger
**before** any engine code ships. Chapter 32 is **not** in our ledger today.

---

## 1. Why this is its own product (and a real differentiator)

ASCE 7-22 introduced **Chapter 32, "Tornado Loads" — the first time tornado loads have ever
appeared in ASCE 7.** It is genuinely new, genuinely complex, and most competitors have not
shipped it. That is the moat: a working, cited, permit-ready ASCE 7-22 tornado calculator is
something almost no one offers yet.

It is **not** a replacement for the normal wind calc — it's an **additional check** layered on
top, and the building is designed for the **greater of** the standard wind load or the tornado
load (load combinations per Chapter 2 with the tornado load factor).

---

## 2. Applicability — the scope gate (drives the whole market case)

Tornado loads are **mandatory only when ALL of these are true** (confirm exact wording in §32.1):

1. **Risk Category III or IV** building or structure (hospitals, schools, emergency/essential
   facilities, large-occupancy, critical infrastructure). **Risk Cat I and II are exempt** —
   ordinary homes and most commercial buildings never trigger this.
2. Located in the **tornado-prone region** — roughly the eastern two-thirds of the continental
   US, east of the Rockies, defined by a map **[VERIFY FROM BOOK — tornado-prone region figure]**.
3. Above the size/threshold triggers in §32.1 (there are exemptions for small RC III/IV
   structures — **[VERIFY exact thresholds]**).

**Market consequence:** narrower than C&C/MWFRS (no RC II residential), but high-value
(institutional/essential buildings, engineers who *must* comply) and not commoditized. Pairs
naturally with the inland tornado-region states in the location cluster (Midwest / Mid-South /
Southeast), extending us beyond the hurricane coasts.

---

## 3. The new physics — parameters the engine must model

Tornado loads parallel the directional wind procedure but with tornado-specific factors. The
engine must compute a **tornado velocity pressure** and tornado pressures for both MWFRS and C&C,
**plus** an effect that ordinary wind does not have: an **atmospheric pressure change (APC)**
internal load (a tornado's core pressure drop). The distinct pieces to model:

| Symbol / concept | What it is | Source to transcribe |
|---|---|---|
| **V_T** (tornado speed) | Tornado design wind speed — from new maps, a function of **effective plan area** and Risk Category | **[VERIFY — tornado speed maps, multiple plan-area maps]** |
| **Effective plan area (A_e)** | Determines which V_T map/value applies; larger footprint → different tornado speed | **[VERIFY — §32 definition + procedure]** |
| **K_zTor** | Tornado velocity pressure exposure coefficient (distinct from K_z) | **[VERIFY — table]** |
| **K_dT** | Tornado directionality factor (distinct from K_d) | **[VERIFY — table]** |
| **K_vTor** | Tornado vertical/elevation factor (if applicable) | **[VERIFY — §32]** |
| **q_Tz** | Tornado velocity pressure = f(K_zTor, K_e, K_dT, V_T) | **[VERIFY exact equation form]** |
| **(GCp)_Tor / Cp_Tor** | Tornado external pressure coefficients (MWFRS + C&C) | **[VERIFY — coefficient figures/tables]** |
| **APC internal load** | Atmospheric Pressure Change load from the tornado core pressure drop; combined with GCpi | **[VERIFY — APC provisions + which enclosures get relief]** |
| **(GCpi)_Tor** | Tornado internal pressure coefficient | **[VERIFY — table]** |
| **Tornado load factor** | Load-combination factor for the tornado case (Chapter 2 + §32) | **[VERIFY]** |

> All eight+ items above are **unknown numbers until read from the book.** This table is the
> verification worklist — it goes into `ASCE 7-22/UNVERIFIED_FIGURE_VALUES_WORKLIST.md` and the
> verified-values ledger before code.

---

## 4. The data-layer gap (the biggest hidden lift)

Our entire velocity system today (`webapp/usps_zip_codes.csv`, `velocity_finder_core.py`,
`wind_velocity_assignment.py`) stores **basic wind speed** in four columns
(`velocity_risk_cat_1..4`). **Tornado speed is a different quantity on different maps** — keyed by
**(location × Risk Category × effective plan area)**. That is a *new dimension* (plan area) the
current CSV has no room for.

Two options to scope against:
- **(A) Full pre-computed layer** — trace the tornado speed maps the same way we traced the wind
  maps, add tornado-speed columns/lookup keyed by plan-area bands. High accuracy, high effort,
  matches our "never rely on a live API" doctrine. Mirrors the documented process in CLAUDE.md
  for adding a new ASCE version.
- **(B) User-entered V_T** — engine takes V_T (and plan area) as a **user input** from the ASCE
  Hazard Tool, computes everything downstream. Ships far faster, defers the map-tracing project,
  and is honest (we already point users to the Hazard Tool for tornado data today).

**Recommendation: ship (B) first**, add (A) later as a data-accuracy upgrade. (B) de-risks the
launch and lets us validate the pressure math against the book independently of the map-tracing.

---

## 5. Engine inputs / outputs (modeled on existing `asce7_22_*` engines)

**Inputs** (pure-function signature, mirroring `webapp/mwfrs_calculator.py` /
`asce7_22_cc_roofs_*.py`):
- Risk Category (must be III or IV — engine should **refuse/flag** I & II with a clear message)
- Location / tornado-prone-region check (state or ZIP)
- **V_T tornado speed** + **effective plan area** (Option B: user-supplied; Option A: looked up)
- Building geometry: mean roof height, plan dimensions, enclosure classification
- Exposure category
- Component effective wind area + zone (for the C&C tornado case)

**Outputs:**
- q_Tz, tornado MWFRS pressures, tornado C&C pressures (zone-by-zone)
- The **governing** result = max(standard wind, tornado) per surface, clearly labeled
- Every factor cited to its **[VERIFIED]** §32 source (same citation discipline as every other calc)
- Permit-ready Engineering Report section (reuse `report_generator.py`)

---

## 6. Build plan (phased, low-risk)

- **Phase 0 — Book read (BLOCKER):** transcribe every item in §3 from the physical ASCE 7-22
  Chapter 32 → ledger + worklist. **No code until this is done.** *(User action: read Ch. 32.)*
- **Phase 1 — Pure engine (Option B):** `webapp/asce7_22_tornado.py`, user-supplied V_T + plan
  area. Unit-test against any worked example in the book / commentary. Mirror to `backend/` per
  the shared-sync rule (`scripts/check_shared_sync.py`).
- **Phase 2 — Validation:** cross-check 10–20 cases vs the ASCE Hazard Tool / published examples;
  document discrepancies (same bar as the wind-map validation).
- **Phase 3 — UI:** new admin-only calc route on the calc shell (`calc-shell.js/css`, `WLC_CALC`),
  RC III/IV gating in the UI, tornado-prone-region guard. Keep customer-invisible until verified +
  Stripe product exists (same pattern as the roofs/MWFRS rollout).
- **Phase 4 — Data upgrade (Option A, optional):** trace tornado speed maps, add the pre-computed
  plan-area-keyed lookup so V_T auto-fills.
- **Phase 5 — SEO/marketing:** "ASCE 7-22 Tornado Loads" reference + product page, wired into the
  tornado-region states in the location cluster; pricing as a standalone calc per the à-la-carte +
  bundle model.

---

## 7. Effort & risk summary

| | Assessment |
|---|---|
| Engineering complexity | **High** — new chapter, new factors, APC internal load, plan-area dimension |
| Verification burden | **High** — ~8+ new value sets, all book-gated, none in ledger |
| Data-layer work | **Medium–High** if Option A; **Low** if Option B (user-supplied V_T) |
| Market size | **Narrower** (RC III/IV only) but **high-value + uncontested** |
| Fastest honest path | Option B engine, admin-only, after a Chapter 32 book read |
| Hard dependency | **Physical-book read of Chapter 32** — everything is blocked on it |

**Single biggest decision for you:** Option A (trace the maps) vs Option B (user-supplied V_T) for
v1. Recommend **B**. Everything else is blocked on reading Chapter 32 into the ledger.
