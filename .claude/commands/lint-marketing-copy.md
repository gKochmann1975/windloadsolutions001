---
description: Lint ALL marketing repos (windloadcalc.com + windload.co + windload.solutions) for locked copy-rule violations — ASCE 7-16 product positioning + "sealed/stampable software output".
argument-hint: "(no args)"
allowed-tools: Bash, Read
---

Scan every live marketing page across the three sites for the two locked copy-rule classes. Built
after 2026-07-19, when windload.co shipped live with "ASCE 7-16/7-22" and "PE-stampable/PE-sealed"
software claims that violated `feedback_asce_version_positioning` + `feedback_no_sealed_reports_in_software`
(and were factually wrong — there is NO 7-16 engine, `audit_no_asce716_engine_confirmed`).
Complements the `/check-report-copy` skill (which covered only the main repo).

**Repos:** `c:/Dev/windload-solutions` (windloadcalc.com), `c:/Dev/windload-co`,
`c:/Dev/windload-solutions-parent` (windload.solutions).

1. **ASCE version positioning** — flag only where the *product/software* is positioned as 7-16
   (should be **7-22 ONLY**). **Do NOT flag bare "ASCE 7-16"** — that catches thousands of LEGITIMATE
   educational/historical mentions and state pages correctly reporting a state's adopted edition (many
   states still reference 7-16 — see `reference_state_building_code_status`,
   `reference_state_code_adoption_schedule`). Use the TIGHT positioning signatures only:
   `grep -rniE "7-16/7-22|7-16 and 7-22|ASCE 7-16 (&|and) 7-22|7-16 compliance|follows? ASCE 7-16|ASCE 7-16 compliant" <repo> --include=*.html | grep -viE "deployed-pages|staged-pages|backup"`
   Even these need triage: on a **state page**, "ASCE 7-16/7-22" describing that STATE's requirements is
   legitimate if the state is genuinely still on 7-16; it's only a violation when it claims the SOFTWARE
   supports/uses 7-16 (schema desc, "our calculator follows…", software landing-page titles/taglines).
2. **Sealed / stampable SOFTWARE output** — flag any claim the *software* output is sealed/stampable
   (output is an **Engineering Report**; PE sign-and-seal is a SEPARATE service):
   `grep -rniE "PE-stampable|PE-sealed report|sealed report|stampable pdf|PE-stamped (pdf|report|deliverable)" <repo> --include=*.html | grep -viE "deployed-pages|staged-pages|backup"`
3. **Triage each hit — violation vs. legitimate:**
   - VIOLATION → product/software positioned as 7-16, or software output called sealed/stampable. FIX.
   - LEGIT (leave): historical/comparison content ("ASCE 7-22 vs 7-16", code-evolution timelines);
     the PE **service** deliverable ("PE-stamped documents" on the PE-service page — advertising the
     separate service is allowed).
4. **Fix violations** with substring replacements (`7-16/7-22`→`7-22`, `7-16 and 7-22`→`7-22`,
   `PE-sealed reports`→`PE sign-and-seal services`, `PE-stampable PDF`→`Engineering Report PDF`),
   re-run steps 1–2 to confirm zero real violations remain, then deploy via `/deploy-windload-co` and
   verify live. Report the clean/violation counts per repo.
