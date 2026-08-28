# Poles / Light Poles — Cf & Modeling Reference (ASCE 7-22 §29.4, Fig 29.4-1)

Engine: `webapp/asce7_22_other_pole.py` — `ASCE7_PoleCalculator`, a **subclass** of the
book-verified `ASCE7_ChimneysTanksCalculator`. A freestanding pole is a "similar
structure" under Fig 29.4-1 and uses the identical force-coefficient method
`F = q_z · G · C_f · A_f`.

**No Cf values are defined in the pole engine.** Every C_f, the K_d-by-cross-section
map (Table 26.6-1), the h/D breakpoints, and the round-section Reynolds regime split
are INHERITED unchanged from the chimney engine. For the full Cf tables and their
book sign-off, see **`CHIMNEYS_TANKS_Cf_REFERENCE.md`** (verified 2026-07-12, physical
book, G. Kochmann). Do not duplicate the tables here.

---

## 1. Book RE-TICK gate before shipping the pole calculator (HUMAN, physical book)

The pole calculator leans on two Cf rows harder than a typical chimney does (small
diameters → round subcritical, and multi-sided decorative poles → octagonal). Re-tick
these two rows against ASCE 7-22 Fig 29.4-1 as a pole-specific release gate. Values as
currently coded (inherited from the verified chimney engine):

| Cross section | h/D = 1 | h/D = 7 | h/D = 25 | Book? |
|---|---|---|---|---|
| **Round, subcritical** (D·√q_z ≤ 2.5), "All surfaces" row | 0.7 | 0.8 | 1.2 | ☐ |
| **Octagonal** (coded as the "Hexagonal or octagonal" row) | 1.0 | 1.2 | 1.4 | ☐ |

Also confirm (already checked for chimneys, re-affirm for poles):
- ☐ K_d: Round **1.0**, Square **0.90**, Hexagonal **0.95**, Octagonal **1.0** (Table 26.6-1).
- ☐ The D·√q_z = **2.5** subcritical/supercritical threshold, and that the ≤ 2.5 boundary
  bins to **subcritical** (higher Cf = conservative).
- ☐ h/D breakpoints **1 / 7 / 25** with linear interpolation (Note 2) and clamp to [1, 25].

If any cell differs from the book, correct the value in the **chimney** engine
(`_cf_data`) — never the pole engine — so both stay in sync. Then re-run
`tests/test_engine_pole.py` and `tests/test_engine_chimneys_tanks.py`.

---

## 2. Pole-specific modeling decisions (conservative defaults — sign off or override)

These are engineering-modeling choices, **not** ASCE coefficient values. Each default is
conservative and is surfaced in the calculator output. Confirm or direct a change:

- ☐ **Tapered-shaft h/D basis.** For a base→tip tapered pole, the Cf-row h/D uses the
  **tip (smallest) diameter** → largest h/D → largest Cf. (Alternative: average D — less
  conservative; requires a decision.)
- ☐ **Sign-post h/D basis.** For the support post of an elevated sign, the post Cf uses
  h/D = **full sign height / post D** (larger than the post's own length/D). Conservative.
- ☐ **Top-fixture load.** A luminaire/arm/camera is entered as the manufacturer **EPA
  (C_d·A, ft²)**; the calculator applies `F = q_z · G · EPA` (drag is inside the EPA, so
  **no ASCE Cf is invented**). Fixture **K_d = 1.0** (conservative). A "bare area × assumed
  Cf" mode is intentionally NOT offered (its Cf would require book verification).
- ☐ **Shielding.** No shielding is assumed between a sign panel and its post(s), or
  between multiple posts — forces are summed. ASCE 7-22 gives no combined panel+post Cf.

---

## 3. Worked example (validates the engine; matches `tests/test_engine_pole.py`)

Round tapered light pole — h = 25 ft, D_base = 0.667 ft, D_tip = 0.333 ft, V = 115 mph
(ultimate), Exposure C, flat terrain (K_zt = 1.0), sea level (K_e = 1.0), round → K_d = 1.0.

- Top: K_z(25, C) = **0.94** (Table 26.10-1) → q_h = 0.00256·0.94·1.0·1.0·1.0·115² = **31.82 psf**.
- D_tip·√q_h = 0.333·√31.82 = 1.88 ≤ 2.5 → **subcritical**; h/D clamps to 25 → **C_f = 1.2**.
- Conservative shaft force (q_h over trapezoid area A_f = ((0.667+0.333)/2)·25 = 12.5 ft²):
  F = 31.82·0.85·1.2·12.5 = **≈ 405.8 lb**.
- Per-segment (accurate) shaft: **base shear ≈ 310.8 lb**, **overturning moment ≈ 3,785 ft·lb**,
  resultant height ≈ 12.2 ft. (Lower than the conservative single-point value, as expected.)
- Add a top fixture EPA = 1.5 ft²: F_fix = 31.82·0.85·1.5 = **40.6 lb** → base shear ≈ 351.4 lb.

**Sign-on-posts** (from `tests/test_sign_on_posts.py`): sign h = 20, s = 8, B = 12, V = 115U,
Exp C, with 2 round posts D = 0.5 ft. Governing panel force F_sign = 3,724.91 lb (Case A);
per-post F_post = 132.09 lb, M_post = 792.54 ft·lb (pole engine, h/D = 40 conservative).
Combined: **V_total = 3,724.91 + 2·132.09 = 3,989.09 lb**;
**M_total = 3,724.91·(20 − 8/2) + 2·792.54 = 61,183.64 ft·lb**.

---

## 4. Ship-gate checklist (completeness — no silent unconservative defaults)

- ☑ Engine subclasses the verified chimney engine; `tests/test_engine_pole.py` 27/27.
- ☑ Sign-on-posts composition; `tests/test_sign_on_posts.py` 25/25; signs regression 230/230.
- ☑ Elevated sign with **no posts** emits a visible "post load NOT included" warning.
- ☑ Report says "Engineering Report" — never "sealed."
- ☑ App boots; `/api/calc/pole`, `/api/report/pole`, `/structures/poles` register; endpoint
  gates 401 unauthenticated (no 500).
- ☐ **§1 book re-tick complete** (two Cf rows).
- ☐ **Backend entitlement** grants `asce7_22_other_pole.py` under the Other-Structures tiers
  on api.windloadcalc.com (else subscribers 402). Deploy-time; verify with `deploy-verify-backend`.
- ☐ Deploy `feat/flask-migration` (calc.windloadcalc.com) and live authed smoke test
  (`verify-deploy` / `login-as-customer`).
- ☐ Shop copy: `shop/other-structures.html` "seven calculators" → "eight" (+ pole card);
  `add-calculators.js` / `account_proxy.py` blurbs.
