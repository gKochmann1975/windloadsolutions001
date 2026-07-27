# WindLoadCalc Platform — Authentication & Authorization Model

**Purpose:** Reference for how auth works on this platform, the authorization
patterns to reuse, and the security remediation completed 2026-07-27. Written so
it can be lifted into the owner's other projects (same Flask + JWT + Stripe shape).

> **One-line lesson that drove this whole remediation:** *A read endpoint is just
> as sensitive as a write endpoint.* If cancel/update requires a token but the
> matching read trusts a `user_id` from the request body/path, you have an IDOR.
> Reads and writes must be **symmetric**.

---

## 1. Identity primitives (how a caller proves who they are)

| Mechanism | Where | How it's verified | Used for |
|---|---|---|---|
| **User JWT** | `Authorization: Bearer <jwt>` | `jwt.decode(token, config.JWT_SECRET, ['HS256'])` → `payload['user_id']` | All user-scoped endpoints |
| **Admin key** | `X-Admin-Key` header, or `admin_key` in body/query | `verify_admin_key()` compares to `ADMIN_KEY` env | Admin/ops endpoints |
| **Admin JWT** | Bearer JWT whose user has `role == 'admin'` | decode + DB role lookup | Admin endpoints (stronger than key) |
| **Invite token** | `invite_token` in body | looked up on `team_memberships` row | Team invite accept/verify (capability URL) |
| **Migration token** | `token` in body/URL | `/api/migration/verify-token` → `legacy_customer_id` | Legacy BoA→WLC migration (pre-account) |

**JWT details** (`backend/auth.py:generate_jwt_token`): HS256, claims
`{user_id, email, role, exp, iat}`, **7-day** expiry (`config.JWT_EXPIRATION`).
Signed and verified with `config.JWT_SECRET` (falls back to `SECRET_KEY` if unset).
Minted at `/api/auth/login`, `/api/auth/google`, register, and email-verify.

**Canonical helper** (`backend/app.py`):
```python
def _user_id_from_bearer():
    """Return user_id from a Bearer JWT, or None if missing/invalid/expired."""
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None
    try:
        return jwt.decode(auth[7:], config.JWT_SECRET, algorithms=['HS256']).get('user_id')
    except Exception:
        return None
```

---

## 2. The three authorization patterns (reuse these verbatim)

### A. Owner-scoping (user-data reads/writes)
**Rule:** derive the acting `user_id` **from the token**, never from the request
body/path. Non-admins may only touch their own id; admins may target any.

```python
token_user_id = _user_id_from_bearer()
if not token_user_id:
    return jsonify({'error': 'Authorization required'}), 401
caller = db_session.query(User).filter_by(id=token_user_id).first()
is_admin = bool(caller and caller.role == 'admin')
# path-param style (GET /api/thing/<id>): 403 on mismatch
if int(requested_id) != int(token_user_id) and not is_admin:
    return jsonify({'error': 'Forbidden'}), 403
# body-param style (POST): ignore body id for non-admins, use the token's
user_id = requested_id if (is_admin and requested_id) else token_user_id
```

### B. Admin-gating (ops/admin utilities)
Accept **either** a valid admin JWT **or** the admin key:
```python
def _require_admin():
    uid = _user_id_from_bearer()
    if uid:
        u = db_session.query(User).filter_by(id=uid).first()
        if u and u.role == 'admin':
            return None
    key = request.headers.get('X-Admin-Key') or (request.get_json(silent=True) or {}).get('admin_key') or request.args.get('admin_key')
    if key and key == os.environ.get('ADMIN_KEY'):
        return None
    return jsonify({'error': 'Admin authorization required'}), 403
# at top of each admin route:  g = _require_admin();  if g: return g
```

### C. Capability tokens (invites, migration, Stripe redirect)
The token in the URL/body **is** the authorization (no login required). Verify it
server-side (look it up / check expiry) before acting. Never trust an id that
travels alongside it without re-checking the token owns that id.

---

## 3. Remediation completed 2026-07-27 (what was wrong, what shipped)

Trigger: a customer (Rich Carrier) could see his subscription but not cancel it.
Root cause was the read/write asymmetry above; the investigation then uncovered a
**systemic** pattern — most of the API was unauthenticated.

**Frontend (`account.html`, live on GitHub Pages `main`):** the account page
rendered a Cancel button whenever *any* token string existed in `localStorage`,
but the cancel endpoint requires a *valid* JWT → stale sessions saw a button that
always 401'd. Fixed: gate on `exp` (decode client-side), redirect to login on
expired/invalid token or any 401, and unify the token-key lookup
(`windload_auth_token` vs legacy `windload_token`).

**Backend (`windload-backend` → Railway `main`), 4 commits:**
1. Owner-scoped the subscription reads: `GET /api/subscriptions/<id>`, `POST /api/auth/user-subscriptions`.
2. Owner-scoped `GET /api/user/<id>` (leaked email/name/role/status) and `GET /api/permissions/user-calculators/<id>`.
3. Admin-gated **12** previously-unauthenticated `/admin/*` + `/api/admin/*` routes in `app.py` — most critically **`POST /admin/delete-user`** (anyone could hard-delete any customer by email), plus `test-user/set-subscription` (grant free access), `beta-toggle`, `clear-test-users` (mass delete), etc. Added `_require_admin()`.
4. Admin-gated `POST /api/admin/update-pricing` + `usage-report`/`heavy-users`/`scheduler-status`/`trigger-heavy-user-report`, and migration data reads `GET /api/migration/{stats,list-pending,export-urls}`.
5. Owner-scoped `POST /api/team/*` (info, invite, remove-member, resend-invite, my-teams, check-access) — bound the body `user_id` to the Bearer token (`_token_user_id()` + reject mismatch), so the handlers' existing `verify_owner` checks are now trustworthy. **Coordinated deploy:** `team-management.html` was updated to send the Bearer token and deployed to Pages *first* (account.html already did); then the backend began requiring it.

Every fix verified against **live prod** with a real login token (throwaway user →
real `/api/auth/login` → matrix: own-id 200, other-id 403, no-token 401 →
delete throwaway). Never with a self-minted token — the local `.env` `JWT_SECRET`
does **not** match the live Railway secret, so a hand-minted token is rejected;
only a token the live backend issued proves the allow-path.

### Still open (documented, not yet fixed)
- **`/api/migration/create-checkout` + `/complete`:** guarded only by the client-side
  migration-token flow; the endpoints don't re-verify the token. Low active risk
  (Stripe payment still required), legacy one-off. Should re-verify the migration
  token server-side.
- **`ADMIN_KEY` hardcoded default** `'WindLoadAdmin2026'` in `admin_routes.py`. Prod
  has been rotated to a real value (verified — the default is rejected), but the
  fallback should be removed from source (fail closed if the env is unset).
- **No HTTP access logs.** `gunicorn app:app` runs without `--access-logfile`, and
  there's no request-logging middleware. Whether the leaks were exploited before the
  fix is **not determinable**. Add `--access-logfile -` going forward.

---

## 4. Reusable checklist for the owner's other projects

1. **Audit every route file, not just the main one.** Holes hid in `admin_routes.py`,
   `team_routes.py`, `migration_routes.py` — not just `app.py`.
2. **Test each endpoint with no token AND a wrong token.** An endpoint that returns
   200 to a bogus token is unauthenticated — don't assume a `verify_*` call gates it.
   (Two endpoints here *looked* gated but were wide open.)
3. **Never authorize off a body/path `user_id`.** Derive identity from the token.
4. **Reads == writes.** If the mutation needs auth, so does the matching read.
5. **Verify against prod with a real issued token,** not a self-signed one (secrets
   differ between local `.env` and the deployment).
6. **Deploy order for coordinated fixes:** frontend that *sends* the credential ships
   **before** the backend that *requires* it, or you self-inflict an outage.
7. **Enable access logging on day one** so incidents are forensically reviewable.
8. **No secrets/keys as source-committed defaults.** Fail closed when the env is unset.

---
*Last updated 2026-07-27 by the security-remediation session. See git history of
`windload-backend` (commits owner-scoping subscriptions → `/api/user` → admin routes
→ admin_routes/migration) for the exact diffs.*
