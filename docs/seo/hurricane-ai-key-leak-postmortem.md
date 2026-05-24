# Hurricane AI / Gemini Key Leak — Post-mortem + Fix

**Date discovered:** 2026-05-24
**Trigger:** Google Cloud Trust & Safety email "HURRICANE AI SYSTEM is Being Suspended" (project ID `gen-lang-client-0061389970`), received 2026-05-20.
**Impact:** Hurricane Risk Intelligence natural-language search on BIP (`building-intelligence-platform.html`) returned errors from 2026-05-20 until fix deployed.
**Status of leaked key:** Permanently burned — DO NOT REUSE. Project suspended by Google.

---

## What happened

The "Hurricane AI" feature in BIP called Gemini directly from the browser:

```javascript
// website/hurricane-ai-complete.js (BEFORE)
const GEMINI_API_KEY = 'REDACTED-LEAKED-GEMINI-KEY-2026-05-24';  // LEAKED
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
```

This file shipped to every browser that loaded a BIP page. View Source → grep `AIza` → key extracted in seconds. Bots routinely scrape public JS for `AIza...` patterns. Someone harvested it and used it for abuse (Google detected "activity consistent with hijacked resources"). Google nuked the project.

---

## The fix (deployed in this commit)

**1. New backend endpoint `/api/bip/hurricane-ai/ask`** (`backend/app.py`)
- Reads `GEMINI_API_KEY` from `os.getenv()` — server-only, never reaches the browser
- Rate-limited at 60/hr per IP via existing `@limiter.limit(...)` pattern
- Validates prompt length (max 16,000 chars ≈ 4K tokens)
- Returns generic error messages so Gemini failures don't leak details
- Returns 503 if the env var isn't set yet (graceful degradation)

**2. Frontend rewrite** (`website/hurricane-ai-complete.js`)
- Removed hardcoded `GEMINI_API_KEY` and `GEMINI_API_URL`
- New constant: `HURRICANE_AI_ENDPOINT = 'https://api.windloadcalc.com/api/bip/hurricane-ai/ask'`
- `callGemini(prompt)` now POSTs `{ prompt }` to the backend and reads `data.text` from the response
- Everything else (TrialManager checks, UI, response formatting) unchanged

**3. Pending: delete root-level duplicate**
- `hurricane-ai-complete.js` at repo root is byte-identical to the website/ copy
- Currently still contains the leaked key string in working tree
- Action: delete (pending user confirmation)

**4. Pending: git history purge**
- The leaked key string remains in every old commit on every branch
- Even though Google burned the key, scrapers can still extract it from GitHub
- Action: `git filter-repo` to scrub the key from all history + force-push (pending user confirmation)

---

## Deployment steps — YOU must do these

These can't be automated because they require the Railway dashboard + Google AI Studio:

### Step 1 — Get a new Gemini API key
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with `windloadsolutions@gmail.com` (or whichever Google account owns the suspended HURRICANE AI SYSTEM project — but **don't try to revive the suspended project**, create a NEW one)
3. Click **"Create API key"** → select **"Create new project"** (don't reuse the suspended one)
4. Copy the new key (starts with `AIza...`)

### Step 2 — Add to Railway env vars
1. Go to https://railway.app and sign in
2. Open the **windloadsolutions-backend** project (or whatever the windloadcalc.com API service is called)
3. **Variables** tab → **+ New Variable**
4. Name: `GEMINI_API_KEY`
5. Value: paste the new key from Step 1
6. Save — Railway will redeploy automatically (~1-2 minutes)

### Step 3 — Verify
1. After Railway redeploys, open https://windloadcalc.com/building-intelligence-platform.html
2. Click the Hurricane Risk Intelligence tile open
3. Type a natural-language question (e.g., "Show me Category 4 hurricanes that hit Florida")
4. Should return a proper AI response within ~5 seconds
5. If you get an error: check Railway logs for `Hurricane AI error:` or `Gemini API error` lines

---

## Anti-recurrence rules — going forward

These have been added to project memory:

- **❌ NEVER** put any API key (Gemini, OpenAI, Stripe live, SendGrid, etc.) in client-side JavaScript, HTML, or any file served to browsers
- **✅ ALWAYS** put third-party API keys in Railway environment variables and proxy through `backend/app.py`
- **✅ ALWAYS** grep new code for `AIza`, `sk_live_`, `xoxb-`, `SG.` patterns before merging — these prefixes catch most leaked-key incidents

If you build another AI-powered feature, follow the same shape as `/api/bip/hurricane-ai/ask`:
1. Endpoint takes the prompt/payload from frontend
2. Reads API key from `os.getenv()`
3. Calls the third-party service
4. Returns sanitized response (don't pass through provider error messages)

---

## Related

- The original Google Trust & Safety email is deleted (Gregory deleted it 2026-05-24). It's recoverable from Gmail Trash for ~30 days if needed.
- This file's existence is itself the audit trail — no need to recover the email.
- See `CLAUDE.md` for the SEO/security rules (added: never put API keys in client code).
