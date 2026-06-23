"""
Report-generator fidelity harness — guards the sealed C&C Wind Load Report against
the regressions found in the 2026-06-22 sealed-deliverable pipeline audit:

  RFF-2/RFF-3: the report must DISPLAY the velocity factors it is given (Kz, qh),
    not a hardcoded constant. (The callback bug that passed hardcoded 0.85/30.0 was
    fixed in cc_windows_doors.py; this harness locks the generator's half — if the
    report ever stops reflecting its inputs, these fail.)
  RFF-1: 'Prepared By:' must NOT fabricate "WindLoadCalc.com" as the engineer when
    the engineer field is blank; it must show the real engineer when provided.

Plain-Python harness, house style of tests/test_mwfrs_reference.py.
Run:  C:/Python312/python.exe tests/test_report_generator.py
Exit 0 = all pass, 1 = a failure.
"""
import sys
import os
import re

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import report_generator as rg

results = []


def check(name, cond):
    results.append(bool(cond))
    print(f"  [{'PASS' if cond else 'FAIL'}] {name}")
    return cond


def _prepared_by_cell(html):
    """Return the text of the 'Prepared By:' VALUE cell (the <td> after the label)."""
    m = re.search(r"Prepared By:\s*</td>\s*<td[^>]*>(.*?)</td>", html, re.S)
    return m.group(1).strip() if m else None


def _eng_report(**over):
    args = dict(
        project_name='Test', project_address='123 A St', county='Collier', state='FL',
        job_number='J-1', engineer='', company='Acme Eng', client='Owner LLC',
        wind_speed=140, speed_type='nominal', exposure='C', risk_category='II',
        enclosure='enclosed', building_width=40, building_length=40, mean_roof_height=30,
        height_above_ground=30, edge_strip_a=4.0, qh=41.80, kz=0.98, kd=0.85, ke=1.0,
        components=[], certifications=[],
    )
    args.update(over)
    return rg.generate_engineering_report(**args)


print("\nTEST 1 — report reflects the velocity factors it is GIVEN (RFF-2/RFF-3 lock)")
# Distinct, non-default factors must appear in the output; the OLD hardcoded
# qh=30.0 / Kz=0.85 must NOT be what's shown for this Exposure-C/30ft building.
h = _eng_report(qh=41.80, kz=0.98)
check("passed qh=41.80 appears in report", ('41.8' in h) or ('41.80' in h))
check("passed Kz=0.98 appears in report", '0.98' in h)
# Change the inputs -> output must change (generator is not hardcoding).
# qh renders rounded to 1 decimal, so assert the rounded form.
h2 = _eng_report(qh=55.32, kz=1.13)
check("different qh=55.32 appears (rounded 55.3) when passed", '55.3' in h2)
check("different Kz=1.13 appears when passed", '1.13' in h2)
check("report is input-sensitive (qh 41.8 present only in first report)", ('41.8' in h) and ('41.8' not in h2))

print("\nTEST 2 — 'Prepared By:' does not fabricate a preparer (RFF-1 lock)")
blank = _prepared_by_cell(_eng_report(engineer=''))
check("Prepared-By cell found", blank is not None)
check("blank engineer -> NOT 'WindLoadCalc.com'", blank is not None and 'WindLoadCalc.com' not in blank)
check("blank engineer -> shows em-dash placeholder", blank is not None and '&mdash;' in blank)
named = _prepared_by_cell(_eng_report(engineer='Jane Roe, P.E.'))
check("named engineer shown in Prepared-By", named is not None and 'Jane Roe, P.E.' in named)

print("\nTEST 3 — architectural schedule also reflects passed qh")
sched = rg.generate_architectural_schedule(
    project_name='Test', project_address='123 A St', county='Collier', state='FL',
    job_number='J-1', company='Acme', client='Owner', engineer='Jane Roe, P.E.',
    wind_speed=140, exposure='C', risk_category='II', enclosure='enclosed',
    mean_roof_height=30, building_width=40, building_length=40, edge_strip_a=4.0,
    qh=41.80, components=[], certifications=[],
)
check("schedule reflects passed qh=41.80", '41.8' in sched or '41.80' in sched)

print(f"\n{'='*54}")
ok = all(results)
print(f"{sum(results)}/{len(results)} checks passed — {'ALL GREEN' if ok else 'FAILURES PRESENT'}")
sys.exit(0 if ok else 1)
