# Marketing Copy — Platform Advantages ("Any device" + benefits)
*2026-06-27. Truthful, GEO-optimized, NO competitor names (legal-safe + on-strategy). Security framing = "always secure / future-proofed," never "most secure" (we hold no SOC 2/ISO). "Most up to date" → phrased as "always the latest ASCE 7-22," not "more current than everyone" (some tools also do 7-22).*

## ✅ Already applied to `why-us.html`
- New **4th pillar** in the "Why engineers stay with us" grid: *"Any device, always current — Modern web, not a desktop install."*
- **3 FAQ entries** (+ matching FAQPage JSON-LD schema): tablet/phone, no-install, secure & up-to-date. These are GEO/AEO assets (answer-engine-friendly Q&A).
- **"Learn more" target = `why-us.html#reasons`** (the pillar grid, which now includes the platform pillar).

## Shop / product page badge (ready to drop in — self-contained, brand-aligned)
Place under the product title or near the pricing cards on each shop page. Self-contained inline styles so it works on any page without depending on that page's CSS. Truthful; links to the benefits page.

```html
<!-- Any-device badge for shop/product pages -->
<div style="display:inline-flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:13px;font-weight:600;color:#cdd6f5;margin:10px 0">
  <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.35);color:#34D399;border-radius:999px;padding:5px 12px;font-weight:700">🖥️ 📱 Works on any device · no install</span>
  <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:5px 12px">↻ Always the latest ASCE 7</span>
  <a href="why-us.html#reasons" style="color:#34D399;font-weight:700;text-decoration:none">Learn more →</a>
</div>
```

Plain-text version (if a page wants copy, not a chip):
> **Works on any device — desktop, tablet or phone. Nothing to install, always the latest ASCE 7.** [Learn more →](why-us.html#reasons)

## The platform pillar copy (reference / reuse)
**Any device, always current — Modern web, not a desktop install.**
*Open a browser on any device and you're working.* WindLoadCalc runs entirely in your browser. Nothing to download, install, license to one PC, or keep patched — and it works the same on a desktop, a tablet on site, or your phone.
- **Any device** — desktop, tablet or phone, no app to install
- **Always the latest ASCE 7** — updated instantly, never a version that falls behind
- **Always secure & future-proofed** for the AI age, continuously maintained
- **Your projects in the cloud** — start on one device, finish on another
> Many wind tools are Windows-only desktop software you install and update by hand — some won't open on a tablet or phone at all. Ours just needs a browser.

## Generic buyer-education block — "What to look for in a wind load calculator"
*(Optional — for the generic `wind-load-calculator-comparison.html` page or a section. The "where others are lacking" framing, with ZERO names. Each line is true and applies to one or more incumbents without singling any out.)*

**Before you commit to a wind load tool, check these:**
- **Does it run on any device, or only a Windows PC?** Some tools are desktop-only installs; a few "cloud" versions are just a Windows desktop app streamed to your browser — and still aren't usable on a tablet or phone.
- **Is it on the current code?** Make sure it's **ASCE 7-22**, not stuck on an older edition you'd have to explain to a plan reviewer.
- **Do you have to install and maintain it?** Local installs mean updates, license files, and a version that drifts out of date. A browser tool is always current.
- **Can you trace every number?** Look for **per-coefficient citations to the ASCE 7-22 section** — not black-box output.
- **Does the wind tool stop at the math?** WindLoadCalc pairs the calculation with **permit-ready Engineering Reports** and, when a project needs it, a **separate PE sign-and-seal service** — one vendor from wind speed to stamped deliverable.

> We don't name competitors — we just tell you what to look for. If a tool checks every box, great. Ours does.

## Guardrails (locked rules — do not violate)
- **NO competitor names anywhere on the site** (legal-safe; the site already scrubbed them; `vs-*` pages parked). Speak generically.
- **Security = "always secure, future-proofed for the AI age."** Never "more/most secure." We hold no SOC 2/ISO.
- **"Always the latest ASCE 7"** — not "more up to date than everyone" (incumbents also do 7-22; the honest win is *native + instant updates + any device*).
- Truthful/defensible only — no fabricated stats. (See `feedback_security_framing_and_support_phone`, `project_competitor_strategy`, `feedback_defensible_scale_claims`.)

## Coordination note
The marketing site is being actively redesigned (dark-glass) by another agent. The `why-us.html` edits above are additive and committed. The **shop-page badge is provided as a snippet** rather than force-inserted into every shop page, to avoid colliding with that redesign — drop it into the shop pages when the redesign settles (or hand to the redesign agent). Re-verify security wording at publish time.
