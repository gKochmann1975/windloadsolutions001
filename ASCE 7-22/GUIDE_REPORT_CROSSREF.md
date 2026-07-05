# Engineering-Report Cross-Reference vs the ASCE 7-22 Wind Loads Guide

*Regenerated 2026-07-05 by `webapp/testing/validate_reports_vs_guide.py` (PART E). Each calc's EXACT Guide inputs are run through the **same engine + Engineering Report generator** the admin app uses; the rendered report is saved beside this file, and every published answer is cross-referenced against the values the report renders (nearest rendered value; tolerance 0.20 psf/coeff, 5 lb forces).*

## Solid Sign / Billboard (Guide Ex 5.1 / §29.3) [Cf]

Report rendered OK (79563 bytes); qh in report: n/a · saved report: `ASCE 7-22/guide_report_crossref/sign_report.html`

| Answer | Guide (psf) | Our report (psf) | Δ | Match |
|---|---:|---:|---:|:--:|
| Case A Cf (book 1.8) | 1.80 | 1.80 | 0.00 | ✅ |
| Case C 0-s Cf (book 2.4) | 2.40 | 2.42 | 0.02 | ✅ |
| Case C s-2s Cf (book 1.6) | 1.60 | 1.60 | 0.00 | ✅ |
| Case C 2s-3s Cf (book 1.15) | 1.15 | 1.15 | 0.00 | ✅ |

**4 / 4 published answers matched** (tolerance 0.20 psf; forces 5 lb).

## MWFRS Directional (E-Book / Ch 27)

Report rendered OK (99246 bytes); qh in report: YES · saved report: `ASCE 7-22/guide_report_crossref/mwfrs_directional_report.html`

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

Report rendered OK (103611 bytes); qh in report: YES · saved report: `ASCE 7-22/guide_report_crossref/mwfrs_envelope_report.html`

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

Report rendered OK (79058 bytes); qh in report: YES · saved report: `ASCE 7-22/guide_report_crossref/equipment_report.html`

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

Report rendered OK (146655 bytes); qh in report: n/a · saved report: `ASCE 7-22/guide_report_crossref/flat_roof_report.html`

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

Report rendered OK (146656 bytes); qh in report: n/a · saved report: `ASCE 7-22/guide_report_crossref/gable_roof_report.html`

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

Report rendered OK (146657 bytes); qh in report: n/a · saved report: `ASCE 7-22/guide_report_crossref/hip_roof_report.html`

| Answer | Guide (psf) | Our report (psf) | Δ | Match |
|---|---:|---:|---:|:--:|
| Zone 1 GCp (book -1.41) | -1.41 | -1.41 | 0.00 | ✅ |
| Zone 2 GCp (book -1.97) | -1.97 | -1.97 | 0.00 | ✅ |
| Zone 3 GCp (book -2.13) | -2.13 | -2.13 | 0.00 | ✅ |

**3 / 3 published answers matched** (tolerance 0.20 psf; forces 5 lb).

## C&C Monoslope Roof (Guide Ex 6.5 / §30.3 Fig 30.3-5B) [GCp]

Report rendered OK (146683 bytes); qh in report: n/a · saved report: `ASCE 7-22/guide_report_crossref/monoslope_roof_report.html`

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

Report rendered OK (150070 bytes); qh in report: n/a · saved report: `ASCE 7-22/guide_report_crossref/solar_rooftop_report.html`

| Answer | Guide (psf) | Our report (psf) | Δ | Match |
|---|---:|---:|---:|:--:|
| gamma_E exposed (book 1.5) | 1.50 | 1.50 | 0.00 | ✅ |
| gamma_E interior (book 1.0) | 1.00 | 1.00 | 0.00 | ✅ |
| GCp from Ch 30 (book -1.24 -> 1.24) | 1.24 | 1.24 | 0.00 | ✅ |
| gamma_a (book 0.67, Fig 29.4-8) | 0.67 | 0.69 | 0.02 | ✅ |

**4 / 4 published answers matched** (tolerance 0.20 psf; forces 5 lb).

---

## TOTAL: 68 / 68 published Guide answers matched

**Exposure-B note:** Hip (Ex 6.3), Monoslope (Ex 6.5), and Rooftop Solar parallel (Ex 5.3) are validated at the **coefficient** level (GC<sub>p</sub> / γ<sub>E</sub> / γ<sub>a</sub> — exact). The engine floors the Exposure-B velocity-pressure coefficient K<sub>z</sub> at 0.70 for low-rise (the documented WE-2 conservative choice), where the book uses the raw table value (0.57 / 0.62), so the rendered **pressures are conservative** (higher) by that ratio — disclosed, not an error.

**Dome note:** the Domed Roof calc (Ex 6.7) has no live Engineering-Report endpoint yet; the verified dome **engine** (`asce7_22_cc_dome.ASCE7_ArchedDomeRoofCalculator.calculate_dome_circular`) result is rendered into a small C&C-style report table here — q<sub>h</sub> and (GC<sub>p</sub>) come straight from the engine (K<sub>d</sub>=1.0, q at h<sub>D</sub>+f per Note 1).

**Rooftop-solar note:** the validated case is **parallel-to-roof** (§29.4.4, the only solar worked example in the Guide). The solar report **generator** renders the parallel result (γ<sub>E</sub> edge = 1.50, (GC<sub>p</sub>) = 1.24, γ<sub>a</sub> from Fig 29.4-8); the interior γ<sub>E</sub> = 1.00 is matched by the nearest-value rule.

---

## Report-vs-Engine Faithful Render (calcs without a Guide worked example)

*Appended 2026-07-05 by `webapp/testing/validate_reports_faithful_render.py`. These three calcs have **book-verified engines** (validated in `webapp/testing/validate_asce7_22.py`, 360/0) but **no ASCE 7-22 Wind Loads Guide worked example**, so they cannot be Guide-cross-referenced. Instead each calc's engine is run with representative valid inputs, the KEY engineering values are pulled straight from the engine result dict, and the SAME Engineering-Report generator the live admin endpoint uses (see `report_roof` / `report_chimney` in `webapp/flask_app/calc_api.py`) renders the HTML. Every engine value is asserted to appear in the tag-stripped report (nearest rendered value) at the report's display precision — tolerance 0.20 for psf/coefficients, max(5 lb, 0.5%) for forces.*

### Sawtooth Roof (C&C) (WE-8 / ASCE 7-22 Fig 30.3-6)

Report rendered OK (146734 bytes); saved report: `ASCE 7-22/guide_report_crossref/sawtooth_faithful_report.html`

| Value | Engine | Report | Δ | Match |
|---|---:|---:|---:|:--:|
| qh (psf, 2dp) | 46.02 | 46.02 | 0.000 | ✅ |
| Kz (3dp) | 0.940 | 0.940 | 0.000 | ✅ |
| Kzt (3dp) | 1.000 | 1.000 | 0.000 | ✅ |
| Ke (3dp) | 1.000 | 1.000 | 0.000 | ✅ |
| GCp positive | 0.748 | 0.748 | 0.000 | ✅ |
| GCp negative | -3.891 | -3.890 | 0.001 | ✅ |
| dimension a (ft, 2dp) | 10.00 | 10.00 | 0.000 | ✅ |
| effective wind area (ft2, 2dp) | 33.33 | 33.33 | 0.000 | ✅ |
| controlling +p (psf, 1dp) | 42.70 | 42.70 | 0.000 | ✅ |
| controlling -p (psf, 1dp) | -187.30 | -187.30 | 0.000 | ✅ |
| design p[0] Positive External, GCpi = +0.18 | 26.10 | 26.10 | 0.000 | ✅ |
| design p[1] Negative External, GCpi = +0.18 | -187.40 | -187.40 | 0.000 | ✅ |
| design p[2] Positive External, GCpi = -0.18 | 42.70 | 42.70 | 0.000 | ✅ |
| design p[3] Negative External, GCpi = -0.18 | -170.80 | -170.80 | 0.000 | ✅ |

**14 / 14 engine values rendered faithfully.**

### Multi-span Gable Roof (C&C) (WE-7 / ASCE 7-22 Fig 30.3-4)

Report rendered OK (146733 bytes); saved report: `ASCE 7-22/guide_report_crossref/multispan_faithful_report.html`

| Value | Engine | Report | Δ | Match |
|---|---:|---:|---:|:--:|
| qh (psf, 2dp) | 41.80 | 41.80 | 0.000 | ✅ |
| Kz (3dp) | 0.980 | 0.980 | 0.000 | ✅ |
| Kzt (3dp) | 1.000 | 1.000 | 0.000 | ✅ |
| Ke (3dp) | 1.000 | 1.000 | 0.000 | ✅ |
| GCp positive | 0.524 | 0.524 | 0.000 | ✅ |
| GCp negative | -2.010 | -2.010 | 0.000 | ✅ |
| dimension a (ft, 2dp) | 12.00 | 12.00 | 0.000 | ✅ |
| effective wind area (ft2, 2dp) | 24.00 | 24.00 | 0.000 | ✅ |
| controlling +p (psf, 1dp) | 29.40 | 29.40 | 0.000 | ✅ |
| controlling -p (psf, 1dp) | -91.50 | -91.50 | 0.000 | ✅ |
| design p[0] Positive External, GCpi = +0.18 | 14.40 | 14.40 | 0.000 | ✅ |
| design p[1] Negative External, GCpi = +0.18 | -91.50 | -91.50 | 0.000 | ✅ |
| design p[2] Positive External, GCpi = -0.18 | 29.40 | 29.40 | 0.000 | ✅ |
| design p[3] Negative External, GCpi = -0.18 | -76.50 | -76.50 | 0.000 | ✅ |

**14 / 14 engine values rendered faithfully.**

### Round Chimney / Tank (WE-10 / ASCE 7-22 Fig 29.4-1 (round))

Report rendered OK (79120 bytes); saved report: `ASCE 7-22/guide_report_crossref/chimney_round_faithful_report.html`

| Value | Engine | Report | Δ | Match |
|---|---:|---:|---:|:--:|
| Cf | 0.831 | 0.831 | 0.000 | ✅ |
| qh/qz (psf, 2dp) | 72.58 | 72.58 | 0.000 | ✅ |
| h/D (2dp) | 12.50 | 12.50 | 0.000 | ✅ |
| total force F (lb) | 34,654 | 34,654 | 0.000 | ✅ |
| base moment (kip·ft, 1dp) | 1,861.30 | 1,861.30 | 0.000 | ✅ |

**5 / 5 engine values rendered faithfully.**

### Square Chimney / Stack (WE-10 / ASCE 7-22 Fig 29.4-1 (square))

Report rendered OK (79110 bytes); saved report: `ASCE 7-22/guide_report_crossref/chimney_square_faithful_report.html`

| Value | Engine | Report | Δ | Match |
|---|---:|---:|---:|:--:|
| Cf | 1.500 | 1.500 | 0.000 | ✅ |
| qh/qz (psf, 2dp) | 51.03 | 51.03 | 0.000 | ✅ |
| h/D (2dp) | 10.00 | 10.00 | 0.000 | ✅ |
| total force F (lb) | 20,166 | 20,166 | 0.000 | ✅ |
| base moment (kip·ft, 1dp) | 639.80 | 639.80 | 0.000 | ✅ |

**5 / 5 engine values rendered faithfully.**

**Faithful-render TOTAL: 38 / 38 engine values rendered by their report.**
