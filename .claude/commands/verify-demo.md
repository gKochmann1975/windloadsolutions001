---
description: Headless-verify a /demo/<slug> walkthrough — tour callouts never overlap the spotlight + prefill/calc/report work. Never eyeball layout.
argument-hint: "[demo slug(s) or URL, e.g. mwfrs-envelope roof-gable]"
allowed-tools: Bash, Read
---

Verify the public walkthrough demo(s): **$ARGUMENTS**. VERIFY WITH DATA — two hours were once lost guessing pixel positions (memory `feedback_never_theorize_only_accuracy`, `project_interactive_walkthrough_demos`).

Using puppeteer-core (Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`; puppeteer-core in the session scratchpad; harness scripts `measure.js` / `func.js` / `roof_func.js` may already be in the scratchpad — reuse them). Run against the LIVE page (`https://calc.windloadcalc.com/demo/<slug>`) or a local Flask server on a Chrome-safe port (8055 / 5057–5059; **Chrome blocks 5060/5061**).

1. **Tour overlap (`measure.js`)** — for EVERY scene at 3 viewports (1000×800, 1000×650, 1440×820): the callout rect must NOT overlap its spotlight-target rect and every target selector must be found → **ALL CLEAN**. Any overlap or missing target is a bug (usually a whole-panel target that fills the viewport — retarget to an inner group).
2. **Functional (`func.js`)** — the case prefills the verified example and locks it (`ws_locked`), the Calculator step renders live values that match the engine, the report renders, and there are **zero console errors** (a `401 /api/me` is expected/harmless for a public demo).

Report per-viewport CLEAN/overlap + the functional results. Don't claim a demo is good until both pass on the deployed page.
