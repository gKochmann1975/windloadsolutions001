---
description: Deploy windload.co (or windload.solutions) to Vercel and PROVE the change is live via CLEAN URLs — these sites do NOT reliably auto-deploy on push.
argument-hint: "[co|solutions] [a short string that must appear on the live page]"
allowed-tools: Bash, Read
---

Deploy + verify a **Vercel marketing site** and prove the new build is live before claiming shipped
(memory `dev_windload_co_solutions_vercel_deploy`, `feedback_verify_deploy_live_before_claiming_fixed`,
`feedback_never_assume_ever`).

**Why this command exists:** `git push` alone does NOT deploy these. On 2026-07-19 a push to
windload.co `master` sat undeployed for 10+ min (its `daily-deploy.yml` is paused, no push→Vercel hook)
while windload.solutions DID auto-deploy. And a `.html`-URL curl **without `-L`** read a `cleanUrls`
redirect stub and falsely reported the change was missing. Both traps are handled below.

Args: `$ARGUMENTS` → first token = site (`co` or `solutions`), second token = a unique string that must
appear on the live page after deploy (e.g. `Try the Free ASCE 7-22 Calculator`).

1. **Pick the repo + branch:**
   - `co`  → `c:/Dev/windload-co` (branch `master`, host `windload.co`)
   - `solutions` → `c:/Dev/windload-solutions-parent` (branch `main`, host `windload.solutions`)
2. **Confirm the commit is pushed** (stage only YOUR files — never `git add -A`; `.gitignore`/`.env.local`
   from `vercel link` are gitignored, leave them): `git -C <repo> status --short` then push the branch.
3. **Deploy to production explicitly** (do NOT wait for auto-deploy):
   `cd <repo> && vercel --prod --yes`  (CLI is authed as `gkochmann1975`, team `windload-solutions`,
   project `windload-co`/`windload-solutions`. If not linked: `vercel link --yes --project <project>
   --scope windload-solutions`.) The build normally finishes in ~15–25s; if `vercel ls` shows it stuck
   "Building" for minutes, check `vercel inspect <url> --logs` — the state can lag while it's actually done.
4. **VERIFY LIVE via CLEAN URLs with `-L`** — NEVER trust a `.html` curl without redirect-follow:
   `curl -sL "https://<host>/<clean-path>?cb=$RANDOM" | grep -c "<the second arg string>"`
   (e.g. `/vs-omni`, NOT `/vs-omni.html`). Expect ≥1. If 0, the deploy is NOT live — investigate, don't claim success.
5. Report the production URL + which pages verified the marker string live.
