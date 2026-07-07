# ASCE 7-22 Chapter 32 — Tornado Loads — Reference & Status

**Status:** ⛔ **NOT VERIFIED · NOT BUILT · PARKED (2026-06-27)**
**Source standard:** ASCE 7-22, **Chapter 32 "Tornado Loads"** — NEW in the 2022 edition
(no equivalent exists in ASCE 7-16 or earlier).
**Decision:** Deferred on a **demand** call, not a technical one. See full scope/build plan:
`TORNADO_LOADS_ASCE7-22_CH32_ENGINE_SCOPE.md` (repo root). Owner-decision memory:
`project_tornado_loads_parked`.

> ⚠️ **No values are recorded in this file.** Per project policy we never write an ASCE
> coefficient, map value, table entry, or factor on faith. Every parameter below is listed as a
> **placeholder to transcribe from the physical ASCE 7-22 book** if/when this is built. Do **not**
> code against this file until the values are read in and added to the verified-values ledger.

---

## Why this is its own chapter (and unbuilt by most competitors)

ASCE 7-22 added **the first tornado-load provisions ever in ASCE 7.** Tornado load is **not** a
replacement for the standard wind calc — it is an **additional check**. The structure is designed
for the **greater of** the standard wind load (Ch. 26–30) or the tornado load (Ch. 32), per the
Chapter 2 load combinations with the tornado load factor.

---

## Applicability gate (verify exact wording in §32.1)

Tornado loads are **mandatory only when ALL hold**:

1. **Risk Category III or IV** — hospitals, schools, emergency/essential facilities, large
   occupancy, critical infrastructure. **RC I and II are exempt** (ordinary homes / most
   commercial never trigger it).
2. **Located in the "tornado-prone region"** — ~eastern two-thirds of the continental US, east of
   the Rockies — per the tornado-prone-region map. **[VERIFY FROM BOOK — region figure number]**
3. **Above the small-structure exemption thresholds** in §32.1. **[VERIFY exact thresholds]**

**Market note (why parked):** the tornado-prone region is mostly **weak ASCE-7 wind-law
adoption/enforcement**, and this only ever applies to **RC III/IV**, so there is very little
legally-compelled work today. **Texas** (jurisdiction-driven, also hurricane-exposed) is the only
partial exception. Real tornado-design demand lives in **storm shelters / safe rooms (ICC 500 +
FEMA P-361)** — a *separate* standard and engine, not Chapter 32.

---

## Parameter inventory — the verification worklist (ALL [NOT VERIFIED])

When/if built, every item below must be transcribed from the physical ASCE 7-22 Chapter 32 and
entered into the verified-values ledger **before** any engine code. None of these numbers exist in
our system today.

| Symbol / concept | What it is | Book source to transcribe |
|---|---|---|
| **V_T** | Tornado design wind speed — from tornado speed maps, a function of effective plan area and Risk Category | **[NOT VERIFIED — tornado speed maps; multiple plan-area maps]** |
| **A_e — effective plan area** | Selects which V_T map/value applies | **[NOT VERIFIED — §32 definition + procedure]** |
| **K_zTor** | Tornado velocity pressure exposure coefficient (distinct from K_z) | **[NOT VERIFIED — table]** |
| **K_dT** | Tornado directionality factor (distinct from K_d) | **[NOT VERIFIED — table]** |
| **K_vTor** | Tornado vertical/elevation factor, if applicable | **[NOT VERIFIED — §32]** |
| **q_Tz** | Tornado velocity pressure = f(K_zTor, K_e, K_dT, V_T) | **[NOT VERIFIED — exact equation form]** |
| **(GCp)_Tor / Cp_Tor** | Tornado external pressure coefficients (MWFRS + C&C) | **[NOT VERIFIED — coefficient figures/tables]** |
| **APC internal load** | Atmospheric Pressure Change load from the tornado core pressure drop (an effect ordinary wind does NOT have) | **[NOT VERIFIED — APC provisions + enclosure relief]** |
| **(GCpi)_Tor** | Tornado internal pressure coefficient | **[NOT VERIFIED — table]** |
| **Tornado load factor** | Load-combination factor for the tornado case | **[NOT VERIFIED — Ch. 2 + §32]** |

---

## Data-layer note (the hidden lift)

Our velocity system (`webapp/usps_zip_codes.csv`, `velocity_finder_core.py`,
`wind_velocity_assignment.py`) stores **basic wind speed only** (`velocity_risk_cat_1..4`). Tornado
speed is keyed by **(location × Risk Category × effective plan area)** — a new dimension. **Two
paths:** **(A)** trace the tornado maps into a pre-computed lookup (needs shapefiles we don't have →
the map-tracing blocker), or **(B)** take **V_T as a user input** from the ASCE Hazard Tool (needs
**no shapefiles**, ships fast, honest). If ever built, do **B** first.

---

## Cross-references

- Full scope, inputs/outputs, and phased build plan → `TORNADO_LOADS_ASCE7-22_CH32_ENGINE_SCOPE.md`
- Owner decision + revisit triggers (memory) → `project_tornado_loads_parked`
- Verified-values discipline → `reference_asce_7_22_verified_values` (ledger)
- Active (in-demand) verification backlog → `ASCE 7-22/UNVERIFIED_FIGURE_VALUES_WORKLIST.md`
  — **tornado is intentionally NOT on it** (parked, not queued).

**Revisit triggers:** IBC 2024 / ASCE 7-22 adoption spreads across the tornado belt, **or** a
paying RC III/IV customer asks.
