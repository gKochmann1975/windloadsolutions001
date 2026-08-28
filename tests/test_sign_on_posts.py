"""
Sign-on-posts COMPOSITION verification harness.

Verifies webapp/flask_app/calc_api.py::_augment_sign_with_posts, which composes the
book-verified §29.3 signs engine (asce7_22_other_signs.py, Fig 29.3-1) with the
Fig 29.4-1 pole engine (asce7_22_other_pole.py) into the full base reactions of an
elevated sign on support posts. This harness checks the COMPOSITION only — every
expected value is derived by calling the two engines directly and doing the
arithmetic here (the engines' own values are verified by test_engine_signs.py /
test_engine_pole.py). No hardcoded force numbers.

Run from repo root:
    C:/Python312/python.exe tests/test_sign_on_posts.py
Exit code 0 = all pass, 1 = at least one failure.
"""
import copy
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

from flask_app.calc_api import _augment_sign_with_posts
from asce7_22_other_signs import ASCE7_SignsCalculator
from asce7_22_other_pole import ASCE7_PoleCalculator

results = []


def check(name, got, expected, tol):
    try:
        ok = got is not None and abs(float(got) - float(expected)) <= tol
    except (TypeError, ValueError):
        ok = False
    results.append(ok)
    print(f"  [{'PASS' if ok else 'FAIL'}] {name}: got {got}, expected {expected} (tol {tol})")
    return ok


def check_true(name, cond):
    results.append(bool(cond))
    print(f"  [{'PASS' if cond else 'FAIL'}] {name}")
    return bool(cond)


def governing_sign_force(r):
    """Independent recompute: F_sign = max(Case A, Case B, sum of Case C regions)."""
    F_a = float(r['case_a']['force_lbs'])
    F_b = float(r['case_b']['force_lbs'])
    cc = r.get('case_c') or {}
    F_c = 0.0
    if cc.get('applicable'):
        F_c = sum(float(rv['force_lbs']) for rv in cc['regions'].values())
    return max(F_a, F_b, F_c)


V, SPEED, EXP = 115, 'ultimate', 'C'

# ---------------------------------------------------------------------------
# TEST 1 — Backward compatibility
# ---------------------------------------------------------------------------
print("\nTEST 1 — backward compatibility (no post inputs)")

# 1a. Elevated sign (h=20, s=8 -> clearance 12), NO post args: result unchanged
#     except for the post_load_warning.
sign_elev = ASCE7_SignsCalculator().calculate_sign_forces(V, SPEED, EXP, 20, 8, 12, 0, 1.0)
baseline = copy.deepcopy(sign_elev)
d_noposts = {'wind_speed': V, 'speed_type': SPEED, 'exposure_category': EXP,
             'sign_height_h': 20, 'sign_vertical_s': 8, 'sign_horizontal_B': 12}
out = _augment_sign_with_posts(d_noposts, copy.deepcopy(sign_elev))
check_true("elevated/no-posts: NO 'support_posts' key", 'support_posts' not in out)
check_true("elevated/no-posts: NO 'combined_base_reactions' key", 'combined_base_reactions' not in out)
check_true("elevated/no-posts: HAS 'post_load_warning'", bool(out.get('post_load_warning')))
out_minus_warning = {k: v for k, v in out.items() if k != 'post_load_warning'}
check_true("elevated/no-posts: everything else byte-identical", out_minus_warning == baseline)

# 1b. GROUND sign (s == h, clearance 0): neither posts nor warning; fully unchanged.
sign_ground = ASCE7_SignsCalculator().calculate_sign_forces(V, SPEED, EXP, 10, 10, 12, 0, 1.0)
baseline_g = copy.deepcopy(sign_ground)
d_ground = {'wind_speed': V, 'speed_type': SPEED, 'exposure_category': EXP,
            'sign_height_h': 10, 'sign_vertical_s': 10, 'sign_horizontal_B': 12}
out_g = _augment_sign_with_posts(d_ground, copy.deepcopy(sign_ground))
check_true("ground: NO 'support_posts'", 'support_posts' not in out_g)
check_true("ground: NO 'combined_base_reactions'", 'combined_base_reactions' not in out_g)
check_true("ground: NO 'post_load_warning'", 'post_load_warning' not in out_g)
check_true("ground: result byte-identical", out_g == baseline_g)

# 1c. Ground sign WITH post args (clearance 0): still no additions (posts buried/not exposed).
out_g2 = _augment_sign_with_posts(dict(d_ground, num_posts=2, post_dimension_D=0.5),
                                  copy.deepcopy(sign_ground))
check_true("ground + post args: still unchanged (clearance 0)", out_g2 == baseline_g)

# ---------------------------------------------------------------------------
# TEST 2 — Composition math (h=20, s=8, B=12, V=115U Exp C; 2 round posts D=0.5)
#   Expected values built INDEPENDENTLY from the two engines:
#     F_sign  = max(caseA, caseB, sum caseC)              (signs engine)
#     F_post/M_post = pole engine, clearance=12, hD=20/0.5=40 (conservative full-h basis)
#     V_total = F_sign + 2*F_post
#     M_total = F_sign*(h - s/2) + 2*M_post
# ---------------------------------------------------------------------------
print("\nTEST 2 — composition math (2 round posts, D=0.5 ft)")
h, s, B, D, n_posts = 20.0, 8.0, 12.0, 0.5, 2
clearance = h - s  # 12 ft exposed post

F_sign = governing_sign_force(sign_elev)
pole = ASCE7_PoleCalculator().calculate_pole_force(
    V, SPEED, EXP, clearance, D, cross_section='round', surface_type='rough',
    fixture_epa_sqft=0, hD_for_cf=h / D)   # hD = 40, same conservative basis
F_post = float(pole['base_reactions']['base_shear_V_lbs'])
M_post = float(pole['base_reactions']['base_moment_M_ft_lbs'])

d_posts = dict(d_noposts, num_posts=n_posts, post_cross_section='round',
               post_dimension_D=D, post_surface_type='rough')
out_p = _augment_sign_with_posts(d_posts, copy.deepcopy(sign_elev))
check_true("posts: HAS 'support_posts'", 'support_posts' in out_p)
check_true("posts: HAS 'combined_base_reactions'", 'combined_base_reactions' in out_p)
check_true("posts: NO 'post_load_warning'", 'post_load_warning' not in out_p)

sp = out_p.get('support_posts') or {}
cbr = out_p.get('combined_base_reactions') or {}
check("num_posts echoed", sp.get('num_posts'), n_posts, 0)
check("post exposed height = h - s", sp.get('post_exposed_height_ft'), clearance, 0.01)
check("per-post force == pole engine base shear", sp.get('per_post_force_lbs'), F_post, 0.02)
check("per-post moment == pole engine base moment", sp.get('per_post_moment_ft_lbs'), M_post, 0.02)
check("sign_force == independent governing F_sign", cbr.get('sign_force_lbs'), F_sign, 0.02)
check("sign lever arm == h - s/2", cbr.get('sign_lever_arm_ft'), h - s / 2.0, 0.01)
check("V_total == F_sign + n*F_post", cbr.get('V_total_lbs'),
      F_sign + n_posts * F_post, 0.05)
check("M_total == F_sign*(h - s/2) + n*M_post", cbr.get('M_total_ft_lbs'),
      F_sign * (h - s / 2.0) + n_posts * M_post, 0.05)
check("M_total_kip_ft == M_total/1000", cbr.get('M_total_kip_ft'),
      (F_sign * (h - s / 2.0) + n_posts * M_post) / 1000.0, 0.001)

# The untouched parts of the sign result must still be byte-identical.
out_p_core = {k: v for k, v in out_p.items()
              if k not in ('support_posts', 'combined_base_reactions')}
check_true("posts: sign-engine portion untouched", out_p_core == baseline)

# ---------------------------------------------------------------------------
# TEST 3 — Conservative basis + shielding note surfaced
# ---------------------------------------------------------------------------
print("\nTEST 3 — conservative hD basis + shielding note")
check_true("shielding note present and mentions no shielding / conservative",
           'No shielding' in sp.get('shielding_note', '')
           and 'conservative' in sp.get('shielding_note', ''))
# Conservative hD basis: the pole call above used hD_for_cf = h/D = 40; prove the helper
# used the SAME basis by checking a shorter-basis pole (hD = clearance/D = 24) would give
# a different (<=) force — i.e. the helper matched the FULL-height pole, not the short one.
pole_short = ASCE7_PoleCalculator().calculate_pole_force(
    V, SPEED, EXP, clearance, D, cross_section='round', surface_type='rough',
    fixture_epa_sqft=0, hD_for_cf=clearance / D)
F_post_short = float(pole_short['base_reactions']['base_shear_V_lbs'])
check_true("helper per-post force matches FULL-h/D pole (conservative), not clearance/D",
           abs(float(sp.get('per_post_force_lbs')) - F_post) <= 0.02
           and F_post >= F_post_short - 0.01)
check_true("hD basis actually conservative (F_post[hD=40] >= F_post[hD=24])",
           F_post >= F_post_short - 0.01)

# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
n = len(results)
p = sum(1 for x in results if x)
print(f"SIGN-ON-POSTS COMPOSITION: {p}/{n} checks passed")
sys.exit(0 if p == n else 1)
