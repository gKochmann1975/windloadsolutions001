# Retention & Reactivation Strategy — Self-Serve Subscription Lifecycle

**Established:** 2026-07-20
**Trigger:** A paying customer (American Dreams Studios) emailed to cancel because she "couldn't find
an option to unsubscribe" and only needed the tool "in the months I need it." Investigation confirmed
there was **no self-serve cancel path anywhere** — the `cancel_subscription()` function existed in code
but was wired to no route. Every cancellation was a manual support + Stripe-dashboard task.

---

## The strategy in one line

**Make it easy to leave, so it's easy to come back.** Convert cancellations from a hard *churn* event
(delete the subscription, lose the customer, eat a support ticket) into a soft *pause* the customer
controls — and make the return path frictionless. Occasional-use customers become recurring
month-to-month customers instead of one-time losses.

## Why this was applied

1. **The customer explicitly asked for month-to-month.** Fighting that (retention walls, "call to
   cancel") would have burned goodwill and still lost the sale. Serving it turns her into a likely
   repeat buyer who returns whenever a project comes up.
2. **Churn ≠ loss when the door stays open.** A customer who cancels but keeps their account, data, and
   a one-click way back is a warm lead, not a dead one. The lifetime value of an occasional-use
   customer who returns 3–4 months a year beats a frustrated cancel-and-never-return.
3. **Support-load reduction.** Manual cancellations don't scale. Every self-serve cancel is a support
   ticket and a Stripe-dashboard action that no longer needs a human.
4. **Trust as a moat.** "Cancel anytime, no phone calls, no questions asked" is a credibility signal
   that lowers the barrier to the *first* purchase — people buy more readily when leaving is painless.

## What it comprises (the mechanics)

| Piece | Behavior | Retention purpose |
|-------|----------|-------------------|
| **Cancel-at-period-end** | Keeps paid access through `current_period_end`, then stops. Never an immediate cut-off. | Customer feels treated fairly (uses what they paid for) → leaves on good terms. |
| **Resume (one click)** | Undo the scheduled cancel any time before it ends. | Catches second-thoughts and mis-clicks before they become lost revenue. |
| **Account stays intact** | Login, saved projects, and details persist after the sub ends. | The return is "resubscribe," not "start over" — near-zero friction to come back. |
| **Every dead-end → shop on-ramp** | Locked calculator → explaining banner → shop; ended sub → "Browse Products"; cancel email → soft "Resubscribe when you're ready." | No blocked moment is a dead end; each is a routed opportunity to re-purchase. |
| **Win-back email** | Cancellation confirmation reframes the moment: no penalty to stop/restart, resubscribe link, self-serve controls. | Turns the exit into a relationship touchpoint and a standing invitation to return. |

## Purpose it serves for the platform

- **Reduces churn-to-loss ratio** — cancellations become pauses; a share convert back to active revenue.
- **Serves the occasional-use segment** (contractors/firms with sporadic project needs) that a rigid
  monthly-only-or-nothing model would push away entirely.
- **Cuts operational cost** — removes manual Stripe/support work from the cancellation and re-purchase
  paths.
- **Strengthens conversion** at the top of the funnel — painless exit lowers first-purchase risk.

## What to watch (proof it's working)

- Cancel → resubscribe rate (returning customers within 1–4 months of cancel).
- Support tickets mentioning "cancel/unsubscribe" (should trend to ~zero).
- Resume-button usage (mis-click / second-thought saves).
- Shop-arrivals sourced from the `?need=` lock banner and the account "Browse Products" state.

## Implementation reference

See `CLAUDE.md` → "Subscription Cancellation — Self-Serve" for the technical wiring (endpoints, files,
webhook sync, lock→shop routing). Shipped live 2026-07-20 (backend `1.0.17-self-serve-cancel`).
