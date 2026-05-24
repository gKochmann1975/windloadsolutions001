# 2026 Testimonial Outreach Campaign

**Purpose:** Refresh + expand the homepage testimonials beyond Tracy Lape + Rich Badders. Build a verifiable testimonial library from current paying customers (2024–2026) before relying on Google Business Profile reviews to scale.

**Last campaign:** 2024-09-18 "We want your feedback" → 2 of N replies usable (Tracy + Rich). Worth a fresh wave 18 months later.

---

## Strategy

Personalized, not BCC blast. Two-stage funnel:

1. **Warm relationship customers first** (more likely to reply, replies tend to be longer/better): Manuel Roubicek, Alex Macris, Eduardo Zegarra, Dan Smith.
2. **Recent calculator-only customers second** (broader reach, shorter replies but more volume): pulled from Stripe customer list.

Goal: **5–8 new testimonials in 30 days** to add to homepage + a `/testimonials.html` page.

---

## Email Template (polished, Outlook-compatible, brand-as-sender)

> **Subject:** A quick favor — your wind load calculator experience
>
> **From:** Wind Load Calculator <gregory@windloadcalc.com>
> **Reply-To:** gregory@windloadcalc.com
>
> Hi {{FirstName}},
>
> Hope your projects are going well. Quick favor — we're refreshing the WindLoadCalc website and would love to feature a short testimonial from you.
>
> A sentence or two on what you like about the calculator (or the PE sign/seal service, or the schedule reports — whatever you actually use) is plenty. We'll add it to the homepage with your name and company.
>
> If you'd like your company logo displayed alongside, just attach a PNG or JPG and we'll do the rest.
>
> Don't have time? No worries at all — totally optional. Just thought I'd ask since you've been with us {{X}} {{years|months}}.
>
> Thanks either way,
>
> **Greg Kochmann**
> Wind Load Calculator (since 2002)
> gregory@windloadcalc.com · (833) 272-3946

### Why this works better than the 2024 version

| 2024 version | 2026 version | Why the change |
|---|---|---|
| "We wanted to follow up to see how you like your wind load calculator" | "Hope your projects are going well. Quick favor…" | Warmer, doesn't sound like a survey |
| BCC undisclosed-recipients blast | Personalized name + tenure | 3–5× reply rate per industry data |
| "We would love to have a testimonial" | "A sentence or two… is plenty" | Lowers the friction bar |
| No opt-out grace | "No worries at all — totally optional" | Preserves the relationship if they don't reply |
| No brand identity in From | "Wind Load Calculator <gregory@windloadcalc.com>" | Per [[feedback_email_from_brand_name]] — brand leads, person secondary |

---

## Target list — 2026 Wave 1 (relationship customers)

Send these personalized — each gets a tweaked line referencing what they actually use.

### Manuel Roubicek / Damar Development Inc
- **Tenure line:** "since you've been with us through several Naples projects (Tigris Lane, Bertron, the 5760 work)"
- **Custom hook:** "especially curious what you think about the Schedule Report format vs. the standard Engineering Report"
- **Email:** {needs lookup from Stripe/dashboard}

### Alex Macris / Drafting By IDs
- **Tenure line:** "since you've been a recurring PE sign/seal customer"
- **Custom hook:** "anything about the sign/seal turnaround time or accuracy would be especially helpful"
- **Email:** draftingbyids@yahoo.com (lowercase per memory)

### Eduardo Zegarra / Door Stryles, Inc (Pro plan, 5 users)
- **Tenure line:** "since Door Stryles has been on Pro plan with your team of five"
- **Custom hook:** "anything you'd want a fellow door-shop owner to know about how the team workflow has worked out"
- **Email:** info@doorstylesinc.com

### Dan Smith / Threshold Inspections (DS Permit Services?)
- **Tenure line:** "after we met in April about threshold inspection work"
- **Note:** Skip if no completed projects yet — premature ask.
- **Email:** dspermit.services@gmail.com

### Rich Badders / Shorelines Design Group
- **Tenure line:** "since you originated the Architectural Schedule Report feature and have been with us 3+ years"
- **Custom hook:** "since you've now been using the Schedule format for a while — any updated thoughts beyond your 2024 reply?"
- **Email:** rich@sdgfl.com
- **Note:** ALREADY shipped his 2024 testimonial — only ask if you want a refreshed/longer one.

### Tracy Lape / Encompass Storm Defense
- **Note:** ALREADY shipped her 2024 testimonial — same as Rich, only refresh-ask if you want a longer/updated one.
- **Email:** tracy@encompassstormdefense.com

---

## Target list — 2026 Wave 2 (broad reach, send 7–14 days after Wave 1)

Pull from Stripe customers list (any subscription active in last 12 months). Send the same template, slightly more generic:

- Skip "since you've been with us {{X}} months" if tenure < 60 days
- Skip if customer ever opened a support ticket complaining (don't poke a bear)
- Skip Lockheed Martin / Jessica Plummer — enterprise PO customer, requires different approach (formal case study, not email testimonial)
- Skip Ryan McCauley until his project ships — premature
- Skip Nick Weber until delivery completes

---

## Send protocol — non-destructive, requires your approval

I will NOT bulk-send these on your behalf. Per [[feedback_bypass_mode_still_be_careful]], sending external messages to customers is exactly the kind of action that needs your sign-off each time.

**Recommended flow:**

1. ✅ Template approved (this doc)
2. → You review the Gmail draft I create (no recipients on it — just the body)
3. → For each Wave 1 customer, you (or I, with your green light per send):
   - Duplicate the draft
   - Personalize the `{{FirstName}}`, tenure line, custom hook
   - Add the recipient
   - Send
4. → Replies route to gregory@windloadcalc.com inbox
5. → As they come in, I add to:
   - `docs/seo/real-testimonials-from-gmail.md` (audit trail, source thread ID)
   - `website/index.html` testimonials section
   - Eventually `website/testimonials.html` (new dedicated page) once you have 6+

---

## Tracking + measurement

| Metric | Target | How to check |
|---|---|---|
| Reply rate Wave 1 | ≥50% (3–4 of 6) | Gmail search `subject:"Re: A quick favor"` |
| Usable testimonials (≥1 sentence, on-message) | ≥3 of replies | Manual review |
| Reply rate Wave 2 | ≥15% (industry baseline for warm-list) | Gmail search same subject line |
| Time to homepage shipment | ≤48 hrs per usable reply | Audit trail in `real-testimonials-from-gmail.md` |

---

## Related

- [[feedback_email_format]] — Branded template, full HTML, logo + footer
- [[feedback_email_from_brand_name]] — Brand as sender, not personal name
- [[feedback_email_outlook_compatibility]] — MSO namespaces + VML bulletproof buttons
- [[feedback_email_no_vendor_bio]] — Don't add "25 years experience" filler to body text
- `docs/seo/real-testimonials-from-gmail.md` — Audit trail for shipped testimonials
- `docs/seo/google-business-profile-setup.md` — Parallel channel for verifiable third-party reviews
