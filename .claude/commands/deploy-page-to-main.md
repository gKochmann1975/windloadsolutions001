---
description: Deploy a root static-page / sitemap change to main (GitHub Pages) via a worktree cherry-pick, without dragging an unrelated feature branch onto main
argument-hint: "[commit-sha to cherry-pick] [live-page-path to verify, e.g. free-mwfrs-wind-load-calculator.html]"
allowed-tools: Bash, Read, Edit
---

Deploy a **root static page or sitemap change** to production. windloadcalc.com (GitHub Pages)
serves from **`main`** at the repo root (CNAME + `.nojekyll` at root). Feature branches do NOT deploy.
The working branch is usually a `fix/*` branch that is many commits diverged from `main`, so you must
**cherry-pick just your commit onto main in a throwaway worktree** — never merge the whole branch.

Inputs: `$ARGUMENTS` = the commit SHA to deploy, then the live page path to verify.

Steps:
1. **Commit on the working branch first** (so the commit is safe), staging ONLY your files —
   `git add <specific files>`, **never `git add -A`** (the tree carries unrelated pre-existing modified
   files that are not yours). Push the working branch.
2. `git fetch origin`
3. `git worktree add -B main "C:/tmp/wls-deploy" origin/main`  (isolated checkout at origin/main tip)
4. `cd "C:/tmp/wls-deploy" && git cherry-pick <SHA>`
5. **If `sitemap.xml` conflicts** (common — main adds entries too): open it, keep **BOTH** sides'
   `<url>` blocks, remove the conflict markers, then
   `python -c "import xml.dom.minidom;xml.dom.minidom.parse('sitemap.xml')"` to confirm well-formed,
   then `git add sitemap.xml && git -c core.editor=true cherry-pick --continue`.
6. `git push origin main`
   ⚠️ **Put the push on its OWN line.** Do NOT write `grep -c ... && git push` — `grep -c` exits 1 when
   the count is 0, which silently skips the push (this bit twice in one session).
7. Clean up: `git worktree remove "C:/tmp/wls-deploy" --force; git worktree prune`
   (if "Permission denied", `sleep 2; rm -rf "C:/tmp/wls-deploy"; git worktree prune`).
8. **Verify LIVE** (Pages rebuild ≈ 45–90s). Poll the served file, cache-busted:
   `for i in $(seq 1 16); do curl -s -L "https://windloadcalc.com/$ARGUMENTS?cb=$RANDOM" | grep -q "<marker>" && { echo live; break; }; sleep 15; done`
   For interactive behavior (popups, calc output, CTA targets), also drive it with `/verify-page`
   (headless puppeteer-core) — never assume a marketing-page change is live from the source alone.

**Backend is a DIFFERENT deploy.** `backend/` is its own nested repo (`windload-backend`) that Railway
auto-deploys on push to its `main`. To ship an API change: `cd backend && git add <files> && git commit
&& git push origin main`, then poll `https://api.windloadcalc.com/api/health` or hit the changed endpoint
until it returns the new behavior. `webapp/` engine files must be mirrored into `backend/` in the same
change (see memory `dev_duplicated_velocity_engine`).
