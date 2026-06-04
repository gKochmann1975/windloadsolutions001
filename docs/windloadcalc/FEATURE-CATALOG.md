# WindLoadCalc — Feature Catalog (Internal Source of Truth)

> **Purpose:** A single, accurate inventory of what the WindLoadCalc system actually
> does today. Use it as the source for marketing copy, sales decks, onboarding, and
> support — but derive customer-facing claims from here following the brand/SEO rules
> (defensible claims only; no fabricated specifics).
>
> **Status legend:**
> - ✅ **LIVE** — public, available to subscribers now
> - 🔒 **ADMIN** — built and functional, gated to admin/engineering mode (not yet public)
> - 🟡 **PLANNED** — not built yet / hidden in the UI
>
> _Last reviewed: 2026-06-03. Maintainer: keep this updated whenever a calculator ships
> or a feature changes status. Verify against `webapp/wind_sidebar.py` (what's exposed),
> `webapp/report_generator.py` (report types), and the engine files listed below._

---

## 1. Calculators (engines)

| Calculator | Standard / Scope | Status | Engine file(s) |
|---|---|---|---|
| **C&C Windows · Doors · Storm Shutters** | ASCE 7-22 Chapter 30, Components & Cladding | ✅ LIVE | `cc_windows_doors.py`, `cc_windows_doors_table.py`, `storm_shutters.py`, `asce7_22_cc_windows_doors.py` |
| **MWFRS Building** | ASCE 7-22 Ch 27 (Directional, all heights) + Ch 28 (Envelope, low-rise) | 🔒 ADMIN | `mwfrs_calculator.py` |
| **C&C Roofs — Gable** | ASCE 7-22 Ch 30 | 🔒 ADMIN | `cc_gable_roof.py` |
| **C&C Roofs — Hip** | ASCE 7-22 Ch 30 | 🔒 ADMIN | `cc_hip_roof.py` |
| **C&C Roofs — Monoslope** | ASCE 7-22 Ch 30 | 🔒 ADMIN | `cc_monoslope_roof.py` |
| **C&C Roofs — Flat** | ASCE 7-22 Ch 30 | 🔒 ADMIN | `cc_roofs_flat.py` |
| **C&C Roofs — Sawtooth** | ASCE 7-22 Ch 30 | 🔒 ADMIN | `cc_sawtooth_roof.py` |
| **C&C Roofs — Multi-span** | ASCE 7-22 Ch 30 | 🔒 ADMIN | `cc_multispan_roof.py` |
| **C&C Roofs — Curved / Arched** | ASCE 7-22 Ch 30 | 🔒 ADMIN | (curved roof route) |
| **Solar — rooftop & ground-mount racking** | — | 🟡 PLANNED | hidden in sidebar |
| **Wall Cladding** | ASCE 7-22 Ch 30 | 🟡 PLANNED | hidden |
| **Canopies / Balconies (projections)** | — | 🟡 PLANNED | hidden |
| **Chapter 29 appurtenances** — Signs & Billboards, Communication Towers, Industrial Structures, Rooftop Equipment, Fencing & Barriers, Elevated Buildings | ASCE 7-22 Ch 29 | 🟡 PLANNED | separate standalone products (not part of MWFRS Building) |

> **Note on scope:** MWFRS Building covers Ch 27 + Ch 28 only. Chapter 29 appurtenances
> (signs, freestanding walls, rooftop equipment, parapets) are deliberately **separate
> planned products**, not additions to the MWFRS Building calculator.

---

## 2. Wind-speed / hazard engine

- **Pre-calculated wind velocities for ~33,000+ US ZIP codes**, for **all four ASCE
  Risk Categories (I–IV)**, stored locally (`usps_zip_codes.csv`) — fast, consistent,
  no external API dependency at runtime.
- **Lookup by ZIP, City/State, or full address** (`velocity_finder_core.py`,
  `usps_zip_data.py`).
- **Local jurisdiction overrides** that supersede base ASCE values where AHJs mandate
  higher speeds (e.g., Collier County 170 mph, Miami-Dade 175 mph, Broward 170 mph).
- Wind speeds derived from **official ASCE 7-22 wind-speed maps**, contour boundaries
  traced and encoded as geographic rules (`wind_velocity_assignment.py`).
- **Public wind-speed API** endpoint (`/api/public/wind-speed`) backed by a synced copy
  of the engine in `backend/`.

## 3. Design parameters supported

- **Risk Category** I–IV
- **Exposure Category** B / C / D
- **Enclosure classification** — Enclosed / Partially Enclosed / Open
- **Topographic effects (Kzt)** — flat, 2D ridge, 3D axisymmetric hill, escarpment
  (with hill height, horizontal distance, distance-from-crest, height-above-ground)
- **Building geometry** — width, length, mean roof height; auto edge-strip "a"
  calculation (with FBC 4 ft minimum)
- **Pressure zones** — Zone 4 (interior) / Zone 5 (edge·corner), with an interactive
  zone guide
- **Units toggle** — inches / feet (default inches)
- **Full upstream recalculation** — change any upstream value (wind speed, exposure,
  zone, geometry…) and every component recalculates automatically.

---

## 4. Components & certification (C&C Windows/Doors)

- **Inline component table** ("Wind Pressure Calculations") — add openings with Mark ID,
  type (window/door/SGD/shutter), zone, width, height, description; pressures populate
  automatically.
- **Component Library** — save reusable components (bookmark) and bulk-add them to new
  projects. The library ribbon reflects whether you have saved components.
- **Product Certification** per opening:
  - Manufacturer, Model, **Series**
  - **FL #** (Florida Product Approval), **NOA #** / secondary cert # (ASTM, AAMA, NFRC…)
  - **Impact Rating** — Large Missile / Small Missile / Non-Impact
  - Certified Design Pressure (DP ±) with **automatic PASS/FAIL** vs. the calculated
    design pressure
  - Compliance Standard, notes
  - Built-in link to the **Florida DBPR Product Approval** database for lookups
- **Egress (EG) flag** — one-click per-opening marker; prints an EG column + legend on
  the Architectural Schedule (identification only — not a wind-load permit requirement).

---

## 5. Reports & exports

**Two report formats** (toggle), generated by `report_generator.py`:

1. **Engineering Report** — full ASCE 7-22 narrative: parameters, factors, sample
   calculation, component pressure table, product-certification summary, PASS/FAIL.
2. **Architectural Schedule** — drawing-sheet window/door schedule (AutoCAD drop-in):
   component schedule, product-certification sub-table (FL#/NOA/Mfr/Model/Impact/Series),
   notes block, title block with project parties + logo.

**Report features:**
- **Schedule Notes** — free-text, job-specific notes (egress statements, rough-opening
  notes, etc.) print as numbered notes in the report's NOTES section.
- **Custom company logo** upload on reports.
- **ASCE 7-22 disclaimer** auto-added for states still on older editions.
- **MWFRS reports** (🔒 admin) — engineering report + pressure diagrams.

**Export formats:** HTML · PDF · Print · **Excel (real `.xlsx`)** · CSV.

---

## 6. Codes & standards reference

- **ASCE 7-22 (current)** and **ASCE 7-16 (legacy)** reference pages + a **Version
  Comparison Tool** (🟡 BETA).
- **IBC 2024 (current)** and **IBC 2021** reference pages (🟡 BETA).
- **HVHZ (High-Velocity Hurricane Zone)** requirements reference (🟡 BETA).
- **State building-code matrix** — all 54 US jurisdictions with the adopted ASCE edition
  tracked (`state_building_codes.py`), driving the auto-disclaimer logic.

---

## 7. Projects, accounts & teams

- **Save / load projects** (database-backed) — full project restore including parties,
  design parameters, components, and certification.
- **Autosave** + honest save UX.
- **Team management** (Pro plan) — invite members; team-scoped subscription access.
- **Authentication** — email/password + Google OAuth; password reset.
- **Subscriptions** — Stripe-backed, with **per-calculator subscription gating**
  (2-layer: sidebar UX + route security).

## 8. Admin & operations tooling

- **View toggle** — admin ↔ production view.
- **Read-only user impersonation** + **audit log** + email alerts.
- **Automated file-delivery system** — create delivery → upload files → customer pays
  (Stripe) → auto-email with download link (used for PE-stamped deliverables).

## 9. Developer / API

- **Public wind-speed API** (`/api/public/wind-speed`).
- **Developer Portal** (🟡 NEW) and **API Documentation** (🟡 V2) pages.

---

## 10. Recently shipped (2026-06)

Captured here so this batch lands in marketing/onboarding:

- **Impact Rating** field on product certification (Large/Small Missile, Non-Impact) →
  prints in the IMPACT RATED column across Schedule, Engineering Report, Excel, CSV.
- **NOA & Series** columns now populate (NOA auto-fills from the secondary cert #; new
  Series field).
- **Schedule Notes** box — custom notes print in the report NOTES section.
- **Egress (EG)** per-opening checkbox → EG column + legend on the Architectural Schedule.
- **Pressure Calc table polish** — slimmer Width/Height fields, more room for
  descriptions, and an outline-vs-filled library ribbon based on saved components.

---

## How to keep this current

When a calculator changes status (e.g., Roofs or MWFRS goes public), or a feature ships,
update the relevant row/section here **in the same effort** — and flip the matching
`badge=` in `webapp/wind_sidebar.py`. Cross-check against `CLAUDE.md` (SEO/structured-data
rules) before turning anything here into public marketing copy.
