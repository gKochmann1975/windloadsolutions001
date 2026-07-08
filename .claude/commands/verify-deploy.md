---
description: Verify a calc.windloadcalc.com webapp deploy is actually LIVE before claiming fixed (poll /api/health sha + smoke the gates)
argument-hint: "[expected short sha, or blank to use webapp HEAD]"
allowed-tools: Bash, Read
---

Verify the webapp deploy is live — do NOT claim anything fixed/shipped until this passes (memory `feedback_verify_deploy_live_before_claiming_fixed`).

Target sha: **$ARGUMENTS** (blank → `git -C webapp rev-parse --short HEAD`).

1. **Poll health until the sha matches** (Railway build ~1–3 min; poll in the background so you don't block):
   `curl -s https://calc.windloadcalc.com/api/health` → wait until `"sha"` equals the target. If it never matches, the deploy failed — investigate, don't claim success.
2. **Smoke the gates live** (confirm nothing 500s and access rules hold):
   - anon `POST /api/calc/<x>` → **401** (still gated);
   - a gated page (e.g. `/mwfrs`, `/mwfrs-envelope`) anon → **302 → /login**;
   - a public demo (e.g. `/demo/mwfrs-directional`) → **200**.
3. **If auth/entitlement/pricing changed, prove the PASS path too** — the deny path alone is not enough. Options that touch nothing real: an admin/logged-in session reaching the page; a rolled-back prod-DB transaction that grants a temp subscriber and checks `check_calculator_access`; a create-then-expire live Stripe Checkout Session to confirm the charged amount. Never charge a real card without explicit per-product go; Stripe test-mode first.

Report the confirmed sha + each smoke result. Root-cause anything unexpected.
