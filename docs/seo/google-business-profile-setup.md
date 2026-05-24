# Google Business Profile — Setup & Review Collection Playbook

**Purpose:** Stand up a verifiable, third-party review channel so future testimonials don't depend solely on the email-outreach pipeline. Google reviews carry trust + SEO weight that on-site testimonials cannot match (rich snippets, Map Pack visibility, schema-eligible aggregateRating from a verified source).

**Status as of 2026-05-24:** You already have a GBP listing — confirmed by the 2026-05-16 Gmail email "WindLoad.Solutions, are you open on Memorial Day?" from `businessprofile-noreply@google.com`. So this is **activate + optimize**, not from-scratch claim.

---

## Why this matters — beyond email outreach

| Channel | Pros | Cons |
|---|---|---|
| **Email outreach (current)** | High intent, longer quotes, custom permission | Slow, you do all the work, no SEO benefit, customer's word for it |
| **Google Business Profile reviews** | Verified by Google, public + permanent, Map Pack ranking signal, FTC-safe (no fabrication risk per [[feedback_never_fake_schema_ratings]]), eligible for aggregateRating schema once you cross 5+ reviews | Customer needs Google account, can't edit or curate negatives |

You want **both**. Email outreach for the homepage hero quotes; GBP for scale + SEO + the schema rating you've been told NEVER to fake.

---

## Step 1 — Audit current listing

1. Sign in at https://business.google.com with the Google account that owns the listing (likely `windloadsolutions@gmail.com` since that's where the GBP notification went)
2. Confirm these fields are accurate and complete:
   - **Business name:** "WindLoad Solutions" or "WindLoadCalc" — pick the customer-facing brand
   - **Primary category:** "Engineering consultant" or "Software company" (test both; primary category drives Map Pack visibility)
   - **Secondary categories:** add "Structural engineer," "Permit service"
   - **Address:** Naples, FL (the 2002 origin — leans into the local Florida authority [[feedback_wlc_timeline_truth]])
   - **Service area:** Florida (statewide) + add other states where you've been active
   - **Phone:** (833) 272-3946
   - **Website:** https://windloadcalc.com (NOT windload.solutions or windload.co — point traffic to the main product)
   - **Hours:** confirm accurate (the Memorial Day prompt suggests Google thinks you might have inconsistent hours)
3. **Add ≥10 photos** before requesting reviews — listings with photos get 35% more clicks per Google's own data:
   - Logo (square + landscape)
   - 1–2 calculator UI screenshots (the dial workflow, a finished report)
   - 1 PE stamp example (anonymized — no Bob's name per [[feedback_bob_anonymous_no_name]])
   - 1 office/team photo if available
4. **Write a 750-character "From the business" description** with the bold positioning:
   > WindLoadCalc — Florida wind load calculations since 2002, online since 2006. Among the very first online wind load calculators on the web. We serve architects, engineers, contractors, and permit specialists across Florida and the U.S. with ASCE 7-16 / 7-22 wind load calculations, Components & Cladding pressure reports, MWFRS analysis, and architectural schedule reports for permit submittal. In-house Florida-licensed Professional Engineer available for sign-and-seal on residential and light commercial projects up to 3 stories.

---

## Step 2 — Generate your review link

GBP gives every listing a short review URL: `https://g.page/r/{shortcode}/review`

1. From your GBP dashboard → **Customers → Reviews → "Get more reviews"**
2. Copy the **direct review link** (looks like `https://g.page/r/CWindLoadCalc/review` or similar)
3. Save it here:
   - [ ] Review link: `___________________________________` ← fill in after generating

---

## Step 3 — Embed the review link everywhere relevant

### 3a. Add to post-delivery automation
Per `memory/file-delivery-process.md`, the automated "your files are ready" email already triggers when a customer pays. Add a P.S. to that email:

> P.S. If the calculator and report worked well for you, a quick Google review means a lot — takes 30 seconds: **[Leave a review]({{ GBP_REVIEW_URL }})**

Location in code: search `backend/` for the email template that fires on delivery completion.

### 3b. Add to in-app success states
On the Wind Load Report download page (`webapp/`) — after a customer downloads their `.xlsx` or PDF, show a small banner:

> Loved it? **[Leave a quick Google review →]({{ GBP_REVIEW_URL }})**

### 3c. Add to invoice / receipt emails
SendGrid template for Stripe receipts — append the same review CTA below the receipt summary.

### 3d. QR code for in-person handoffs
For Dan Smith / threshold inspection partnership scenarios where you're meeting customers in person — print a small QR code linking to the GBP review URL on the back of your business card.

---

## Step 4 — First-30-day review-collection sprint

Target: **10 reviews in 30 days** → unlocks `aggregateRating` JSON-LD (per [[feedback_never_fake_schema_ratings]] this can ONLY be added once the rating is real and from a verifiable source — Google reviews qualify).

### Week 1 — Active customer ask (highest yield)
- Send a one-line follow-up to every customer whose project completed in the last 90 days:
  > "Hi {{Name}} — glad your {{project}} went through. If you have 30 seconds, a Google review would mean a lot: {{GBP_REVIEW_URL}}"
- Target: Manuel, Eduardo (and team), Alex, plus any Stripe customer with completed project last 90d.
- Expect: 3–5 reviews if 15–20 sent.

### Week 2 — Email blast to broader customer list
- One email to all active subscribers (BCC for privacy):
  > Subject: Quick favor — Google review for WindLoadCalc?
  > Body: short, friendly, single review link, no pressure.
- Expect: 2–4 reviews from a list of 50+.

### Week 3 — In-product nudge launch
- Ship the in-app banner (Step 3b)
- Ship the post-delivery email P.S. (Step 3a)
- Passive collection from here on.

### Week 4 — Measure + adjust
- Pull review count, average rating, review velocity
- If <5 reviews: more direct asks needed (text message? phone call to top 3 customers?)
- If ≥10 reviews and ≥4.5 avg: ship `aggregateRating` JSON-LD to homepage with real numbers pulled from GBP API

---

## Step 5 — When reviews come in

For each new review:

1. **Respond within 48 hours.** Google ranks listings with active owner-responses higher. Template:
   > "Thanks {{Name}} — really appreciate you taking the time. Glad the {{project type}} worked out!"
2. **Negative reviews:** respond calmly, factually, offer to take it offline. Never delete (you can't — Google won't let you). Never argue.
3. **Track in `docs/seo/google-business-profile-reviews-log.md`** (new file, create when first review lands) — date, name, project type, rating, your response date.
4. **Quote the best ones** with author permission for the homepage. Always link "via Google" with a small "Verified Google review" badge — this is your defensible aggregateRating source.

---

## Step 6 — Schema upgrade (only after ≥5 reviews, ≥4.0 avg)

Once you've earned real review data, you can finally ship `aggregateRating` JSON-LD without violating [[feedback_never_fake_schema_ratings]].

Add to `website/index.html` and the main service pages:

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "WindLoad Solutions",
  "url": "https://windloadcalc.com",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{{REAL_VALUE_FROM_GBP}}",
    "reviewCount": "{{REAL_COUNT_FROM_GBP}}",
    "bestRating": "5",
    "worstRating": "1"
  }
}
```

**Pull values from GBP, don't make them up.** If GBP says 4.8 stars from 12 reviews, ship 4.8 + 12. Update quarterly.

---

## Anti-patterns to avoid

| Don't | Why |
|---|---|
| Ask for reviews before delivering value | Spam-tier, hurts the relationship |
| Offer discount for review | Violates Google's review policy → reviews get removed, listing penalized |
| Self-review or family-review | Google detects same IP / device fingerprint → removes reviews, can suspend listing |
| Bulk-ask hundreds at once | Velocity spike triggers Google spam filter, reviews get nuked |
| Ship `aggregateRating` schema before reviews exist | Already-documented hard rule — see [[feedback_never_fake_schema_ratings]] |
| Name "Bob" in any GBP response | [[feedback_bob_anonymous_no_name]] applies to GBP responses too — those are public |

---

## Related

- [[feedback_never_fake_schema_ratings]] — Why this matters (the rule that made fake-review schema off-limits in the first place)
- [[feedback_bob_anonymous_no_name]] — Applies to GBP responses, which are public
- `docs/seo/2026-testimonial-outreach-campaign.md` — Email-channel parallel effort
- `docs/seo/real-testimonials-from-gmail.md` — Existing testimonial audit trail
- `memory/file-delivery-process.md` — Post-payment automation that will carry the review-link P.S.

---

## Owner action items (you, not Claude)

These need you because they're tied to your Google account:

- [ ] Sign in to https://business.google.com and audit Step 1
- [ ] Generate review link (Step 2), paste back here so it can be embedded across surfaces
- [ ] Approve any text changes to delivery emails before they ship (those are customer-facing)

Once you have the review link, I can wire it into the delivery email + in-app banner code.
