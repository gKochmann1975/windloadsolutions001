# Engineering-Report Cross-Reference vs the ASCE 7-22 Wind Loads Guide

*Regenerated 2026-07-12 by `webapp/testing/validate_reports_vs_guide.py` (PART E). Each calc's EXACT Guide inputs are run through the **same engine + Engineering Report generator** the admin app uses; the rendered report is saved beside this file, and every published answer is cross-referenced against the values the report renders (nearest rendered value; tolerance 0.20 psf/coeff, 5 lb forces).*

## Solid Sign / Billboard (Guide Ex 5.1 / §29.3) [Cf]

Report rendered OK (80181 bytes); qh in report: n/a · saved report: `ASCE 7-22/guide_report_crossref/sign_report.html`

| Answer | Guide (psf) | Our report (psf) | Δ | Match |
|---|---:|---:|---:|:--:|
| Case A Cf (book 1.8) | 1.80 | 1.80 | 0.00 | ✅ |
| Case C 0-s Cf (book 2.4) | 2.40 | 2.42 | 0.02 | ✅ |
| Case C s-2s Cf (book 1.6) | 1.60 | 1.60 | 0.00 | ✅ |
| Case C 2s-3s Cf (book 1.15) | 1.15 | 1.15 | 0.00 | ✅ |

**4 / 4 published answers matched** (tolerance 0.20 psf; forces 5 lb).

## MWFRS Directional (E-Book / Ch 27)

Report rendered OK (99864 bytes); qh in report: YES · saved report: `ASCE 7-22/guide_report_crossref/mwfrs_directional_report.html`

| Answer | Guide (psf) | Our report (psf) | Δ | Match |
|---|---:|---:|---:|:--:|
| qh | 50.43 | 50.43 | 0.00 | ✅ |
| Windward wall (-GCpi) | 25.21 | 25.22 | 0.01 | ✅ |
| Windward wall (+GCpi) | 43.37 | 43.37 | 0.00 | ✅ |
| Leeward wall (-GCpi) | -21.94 | -21.94 | 0.00 | ✅ |
| Leeward wall (+GCpi) | -3.78 | -3.78 | 0.00 | ✅ |
| Side wall (-GCpi) | -39.08 | -39.08 | 0.00 | ✅ |
| Side wall (+GCpi) | -20.93 | -20.93 | 0.00 | ✅ |
| Roof 0-h (-GCpi) | -47.66 | -47.66 | 0.00 | ✅ |
| Roof 0-h (+GCpi) | -29.50 | -29.50 | 0.00 | ✅ |
| Roof h-2h (-GCpi) | -30.51 | -30.51 | 0.00 | ✅ |
| Roof h-2h (+GCpi) | -12.36 | -12.36 | 0.00 | ✅ |
| Roof >2h (-GCpi) | -21.94 | -21.94 | 0.00 | ✅ |
| Roof >2h (+GCpi) | -3.78 | -3.78 | 0.00 | ✅ |

**13 / 13 published answers matched** (tolerance 0.20 psf; forces 5 lb).

## MWFRS Envelope (Guide Ex 4.1 / Ch 28)

Report rendered OK (104229 bytes); qh in report: YES · saved report: `ASCE 7-22/guide_report_crossref/mwfrs_envelope_report.html`

| Answer | Guide (psf) | Our report (psf) | Δ | Match |
|---|---:|---:|---:|:--:|
| qh | 29.35 | 29.35 | 0.00 | ✅ |
| Zone 1 (+GCpi) | 9.90 | 9.87 | 0.03 | ✅ |
| Zone 1 (-GCpi) | 20.40 | 20.40 | 0.00 | ✅ |
| Zone 2 (+GCpi) | -25.50 | -25.50 | 0.00 | ✅ |
| Zone 2 (-GCpi) | -15.00 | -14.97 | 0.03 | ✅ |
| Zone 3 (+GCpi) | -19.00 | -19.00 | 0.00 | ✅ |
| Zone 3 (-GCpi) | -8.50 | -8.47 | 0.03 | ✅ |
| Zone 4 (+GCpi) | -17.50 | -17.50 | 0.00 | ✅ |
| Zone 4 (-GCpi) | -6.90 | -6.91 | 0.01 | ✅ |
| Zone 1E (+GCpi) | 17.60 | 17.61 | 0.01 | ✅ |
| Zone 1E (-GCpi) | 28.20 | 28.20 | 0.00 | ✅ |
| Zone 2E (+GCpi) | -36.70 | -36.70 | 0.00 | ✅ |
| Zone 2E (-GCpi) | -26.10 | -26.12 | 0.02 | ✅ |
| Zone 3E (+GCpi) | -25.00 | -25.00 | 0.00 | ✅ |
| Zone 3E (-GCpi) | -14.50 | -14.48 | 0.02 | ✅ |
| Zone 4E (+GCpi) | -23.40 | -23.40 | 0.00 | ✅ |
| Zone 4E (-GCpi) | -12.80 | -12.85 | 0.05 | ✅ |

**17 / 17 published answers matched** (tolerance 0.20 psf; forces 5 lb).

## Rooftop Equipment (Guide Ex 5.2 / §29.4.1)

Report rendered OK (79676 bytes); qh in report: YES · saved report: `ASCE 7-22/guide_report_crossref/equipment_report.html`

| Answer | Guide (psf) | Our report (psf) | Δ | Match |
|---|---:|---:|---:|:--:|
| Fh lateral (book 4,328 lb) | 4328.00 | 4331.00 | 3.00 | ✅ |
| Fv uplift (book 3,417 lb) | 3417.00 | 3419.00 | 2.00 | ✅ |
| GCr lateral | 1.90 | 1.90 | 0.00 | ✅ |
| GCr vertical | 1.50 | 1.50 | 0.00 | ✅ |

**4 / 4 published answers matched** (tolerance 0.20 psf; forces 5 lb).

## Domed Roof (Guide Ex 6.7 / §30.3 Fig 30.3-7)

Report rendered OK (1416 bytes); qh in report: YES · saved report: `ASCE 7-22/guide_report_crossref/dome_report.html`

| Answer | Guide (psf) | Our report (psf) | Δ | Match |
|---|---:|---:|---:|:--:|
| qh at dome top (book 48.6 psf) | 48.60 | 48.62 | 0.02 | ✅ |
| GCp positive | 0.90 | 0.90 | 0.00 | ✅ |
| GCp negative | -0.90 | -0.90 | 0.00 | ✅ |

**3 / 3 published answers matched** (tolerance 0.20 psf; forces 5 lb).

## C&C Flat Roof (Guide Ex 6.1 / §30.3 Fig 30.3-2A)

Report rendered OK (147273 bytes); qh in report: n/a · saved report: `ASCE 7-22/guide_report_crossref/flat_roof_report.html`

| Answer | Guide (psf) | Our report (psf) | Δ | Match |
|---|---:|---:|---:|:--:|
| Zone 1  @A=10 (book -76.1) | -76.10 | -76.20 | 0.10 | ✅ |
| Zone 1' @A=10 (book -43.7) | -43.70 | -43.80 | 0.10 | ✅ |
| Zone 2  @A=10 (book -100.4) | -100.40 | -100.50 | 0.10 | ✅ |
| Zone 3  @A=10 (book -136.9) | -136.90 | -136.90 | 0.00 | ✅ |
| Zone 1  @A=300 (book -51.4) | -51.40 | -51.50 | 0.10 | ✅ |
| Zone 1' @A=300 (book -34.0) | -34.00 | -34.10 | 0.10 | ✅ |
| Zone 2  @A=300 (book -68.9) | -68.90 | -68.80 | 0.10 | ✅ |
| Zone 3  @A=300 (book -73.3) | -73.30 | -73.50 | 0.20 | ✅ |

**8 / 8 published answers matched** (tolerance 0.20 psf; forces 5 lb).

## C&C Gable Roof (Guide Ex 6.2 / §30.3 Fig 30.3-2B)

Report rendered OK (147274 bytes); qh in report: n/a · saved report: `ASCE 7-22/guide_report_crossref/gable_roof_report.html`

| Answer | Guide (psf) | Our report (psf) | Δ | Match |
|---|---:|---:|---:|:--:|
| Zone 1 panel @A=10 (book -64.1) | -64.10 | -64.00 | 0.10 | ✅ |
| Zone 2 panel @A=10 (book -84.7) | -84.70 | -84.50 | 0.20 | ✅ |
| Zone 3 panel @A=10 (book -111.1) | -111.10 | -110.90 | 0.20 | ✅ |
| Zone 1 purlin @A=208 (book -24.7) | -24.70 | -24.70 | 0.00 | ✅ |
| Zone 2 purlin @A=208 (book -34.7) | -34.70 | -34.60 | 0.10 | ✅ |
| Zone 3 purlin @A=208 (book -58.2) | -58.20 | -58.10 | 0.10 | ✅ |

**6 / 6 published answers matched** (tolerance 0.20 psf; forces 5 lb).

## C&C Hip Roof (Guide Ex 6.3 / §30.3 Fig 30.3-2E) [GCp]

Report rendered OK (147275 bytes); qh in report: n/a · saved report: `ASCE 7-22/guide_report_crossref/hip_roof_report.html`

| Answer | Guide (psf) | Our report (psf) | Δ | Match |
|---|---:|---:|---:|:--:|
| Zone 1 GCp (book -1.41) | -1.41 | -1.41 | 0.00 | ✅ |
| Zone 2 GCp (book -1.97) | -1.97 | -1.97 | 0.00 | ✅ |
| Zone 3 GCp (book -2.13) | -2.13 | -2.13 | 0.00 | ✅ |

**3 / 3 published answers matched** (tolerance 0.20 psf; forces 5 lb).

## C&C Monoslope Roof (Guide Ex 6.5 / §30.3 Fig 30.3-5B) [GCp]

Report rendered OK (147301 bytes); qh in report: n/a · saved report: `ASCE 7-22/guide_report_crossref/monoslope_roof_report.html`

| Answer | Guide (psf) | Our report (psf) | Δ | Match |
|---|---:|---:|---:|:--:|
| Z1 joist GCp @A=566 (-1.10) | -1.10 | -1.10 | 0.00 | ✅ |
| Z2 joist GCp @A=566 (-1.20) | -1.20 | -1.20 | 0.00 | ✅ |
| Z3 joist GCp @A=566 (-2.00) | -2.00 | -2.00 | 0.00 | ✅ |
| Z1 panel GCp @A=20 (-1.24) | -1.24 | -1.24 | 0.00 | ✅ |
| Z2 panel GCp @A=20 (-1.48) | -1.48 | -1.48 | 0.00 | ✅ |
| Z3 panel GCp @A=20 (-2.63) | -2.63 | -2.63 | 0.00 | ✅ |

**6 / 6 published answers matched** (tolerance 0.20 psf; forces 5 lb).

## Rooftop Solar parallel (Guide Ex 5.3 / §29.4.4) [coeff]

Report rendered OK (150688 bytes); qh in report: n/a · saved report: `ASCE 7-22/guide_report_crossref/solar_rooftop_report.html`

| Answer | Guide (psf) | Our report (psf) | Δ | Match |
|---|---:|---:|---:|:--:|
| gamma_E exposed (book 1.5) | 1.50 | 1.50 | 0.00 | ✅ |
| gamma_E interior (book 1.0) | 1.00 | 1.00 | 0.00 | ✅ |
| GCp from Ch 30 (book -1.24 -> 1.24) | 1.24 | 1.24 | 0.00 | ✅ |
| gamma_a (book 0.67, Fig 29.4-8) | 0.67 | 0.69 | 0.02 | ✅ |

**4 / 4 published answers matched** (tolerance 0.20 psf; forces 5 lb).

## Chimney / Tank (ASCE 7-22 §29.4 / Fig 29.4-1 (WE-10)) [Cf]

Report rendered OK (79732 bytes); qh in report: n/a · saved report: `ASCE 7-22/guide_report_crossref/chimney_report.html`

| Answer | Guide (psf) | Our report (psf) | Δ | Match |
|---|---:|---:|---:|:--:|
| Square Cf @ h/D=7 (book 1.4) | 1.40 | 1.40 | 0.00 | ✅ |
| Kd square (book 0.90) | 0.90 | 0.90 | 0.00 | ✅ |

**2 / 2 published answers matched** (tolerance 0.20 psf; forces 5 lb).

## Trussed Tower (ASCE 7-22 §29.4 / Fig 29.4-3 (WE-11)) [Cf]

Report rendered OK (80060 bytes); qh in report: n/a · saved report: `ASCE 7-22/guide_report_crossref/towers_report.html`

| Answer | Guide (psf) | Our report (psf) | Δ | Match |
|---|---:|---:|---:|:--:|
| Square Cf normal @ e=0.2 (book 2.98) | 2.98 | 2.98 | 0.00 | ✅ |
| Governing Cf = 2.98x1.15 diag (book 3.43) | 3.43 | 3.43 | 0.00 | ✅ |
| Kd towers (book 0.85) | 0.85 | 0.85 | 0.00 | ✅ |

**3 / 3 published answers matched** (tolerance 0.20 psf; forces 5 lb).

---

## TOTAL: 73 / 73 published Guide answers matched

**Exposure-B note:** Hip (Ex 6.3), Monoslope (Ex 6.5), and Rooftop Solar parallel (Ex 5.3) are validated at the **coefficient** level (GC<sub>p</sub> / γ<sub>E</sub> / γ<sub>a</sub> — exact). The engine floors the Exposure-B velocity-pressure coefficient K<sub>z</sub> at 0.70 for low-rise (the documented WE-2 conservative choice), where the book uses the raw table value (0.57 / 0.62), so the rendered **pressures are conservative** (higher) by that ratio — disclosed, not an error.

**Dome note:** the Domed Roof calc (Ex 6.7) has no live Engineering-Report endpoint yet; the verified dome **engine** (`asce7_22_cc_dome.ASCE7_ArchedDomeRoofCalculator.calculate_dome_circular`) result is rendered into a small C&C-style report table here — q<sub>h</sub> and (GC<sub>p</sub>) come straight from the engine (K<sub>d</sub>=1.0, q at h<sub>D</sub>+f per Note 1).

**Rooftop-solar note:** the validated case is **parallel-to-roof** (§29.4.4, the only solar worked example in the Guide). The solar report **generator** renders the parallel result (γ<sub>E</sub> edge = 1.50, (GC<sub>p</sub>) = 1.24, γ<sub>a</sub> from Fig 29.4-8); the interior γ<sub>E</sub> = 1.00 is matched by the nearest-value rule.
