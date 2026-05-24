# Admin Dashboard Plan

A backend admin dashboard for site admins to manage users, feedback, service health, and more.

## Architecture

**Where it lives:** Same Vite app, lazy-loaded under `/admin/*`. No separate deployment. Admin pages only bundle into the JS if visited — code-split via React lazy + Suspense.

**Auth model:** Supabase stores `app_metadata: { role: 'admin' }` on admin users. This field is set server-side only (not writable by the user) and is included in the JWT. The Hono server gets a new `adminAuth` middleware that checks `app_metadata.role === 'admin'` — all admin API routes live under `/api/admin/*`. The frontend `AdminRoute` component reads the same claim from the Supabase session and redirects non-admins.

**Setting admin role (CLI):**
```bash
supabase auth admin update-user <uid> --app-metadata '{"role":"admin"}'
```

---

## Phase 1 — Core (must-haves from day one)

### 1. Admin role + middleware
- `adminAuth` middleware — extends existing `auth`, checks `app_metadata.role === 'admin'`, returns 403 if not
- `AdminRoute` component — wraps all admin pages, redirects non-admins to `/practice`
- `AdminLayout` — shared sidebar/nav for all admin pages

### 2. User management (`/admin/users`)
- Table: all users with email, joined date, last active, total reviews, streak
- Tap a row → user detail: FSRS breakdown (new/learning/review/relearning counts), review history, deck progress
- Actions: suspend account (toggle `users.suspended` flag, enforced on auth middleware), delete account
- Server: `GET /api/admin/users`, `GET /api/admin/users/:id`, `PATCH /api/admin/users/:id`

### 3. Feedback inbox (`/admin/feedback`)
- New DB table `feedback`: `id`, `user_id`, `type` (bug/suggestion/other), `message`, `status` (open/reviewed/resolved), `screenshot_url`, `created_at`
- In-app: "Send feedback" button in the practice nav → bottom sheet with type selector + text area → `POST /api/feedback`
- Admin view: filterable list by status and type, mark reviewed/resolved, see submitting user
- Server: `POST /api/feedback` (any authenticated user), `GET /api/admin/feedback`, `PATCH /api/admin/feedback/:id`

### 4. Service health (`/admin/health`)
- Extend existing `GET /health` endpoint to return: DB ping latency, uptime ms, Node version, environment
- Dashboard cards: API server, Supabase DB, Supabase Auth, Anthropic API (last successful call timestamp)
- Auto-refreshes every 30s
- Color-coded: green (ok), yellow (slow/degraded), red (unreachable)

---

## Phase 2 — Observability

### 5. Log viewer (`/admin/logs`)
- Add `pino` structured logging to Hono — replaces the default `logger()` middleware
- Logs written as JSON to stdout; a rolling in-memory ring buffer (last 500 entries) exposed at `GET /api/admin/logs?level=error&limit=100`
- Frontend: filterable by level (info/warn/error), searchable by route or message, auto-refreshes
- V2 upgrade path: ship logs to Better Stack / Logtail — just swap the pino transport

### 6. Learning analytics (`/admin/analytics`)
- Reviews per day across all users (chart, last 30 days)
- Most-missed vocabulary cards — highest `again` rating ratio
- Most-missed kanji — same for `user_kanji_progress`
- FSRS state distribution across all users
- New user signups per week
- Day-7 and day-30 retention (users who reviewed on day 7/30 after signup)
- Server: `GET /api/admin/analytics` — aggregated DB queries, cached 5 min

### 7. Content audit (`/admin/content`)
- All cards flagged for: missing audio, missing romaji, no JMdict ID matched
- All kanji flagged for: missing stroke count, missing JLPT level
- Audio pipeline status: cards with `audio_url` set vs null — breakdown by voice once VOICEVOX is live
- Links to raw DB record for quick inspection

---

## Phase 3 — Operations

### 8. Feature flags (`/admin/flags`)
- New DB table `feature_flags`: `key` (text PK), `enabled` (bool), `description`, `updated_at`
- Server reads flag state at request time — no restart needed to toggle features
- Toggle from dashboard: disable conversation for maintenance, hide kanji drill during content updates, etc.
- Frontend checks flags via `GET /api/flags` (unauthenticated ok) on app init

### 9. Announcements (`/admin/announcements`)
- New DB table `announcements`: `id`, `message`, `active` (bool), `starts_at`, `ends_at`
- Non-intrusive banner at the top of the app when an active announcement exists
- Use cases: "DB migration tonight — some features may be slow", "New N3 kanji added!"

### 10. Rate limiting dashboard
- Track per-user API call counts (in-memory or a `request_counts` table)
- Surface users hitting unusually high rates (potential abuse or runaway clients)
- Pairs with actual rate limiting middleware on Hono — especially `/api/conversation` (each message costs money)

---

## New DB tables (full set)

```sql
-- Phase 1
alter table users add column suspended boolean not null default false;

create table feedback (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references users(id) on delete set null,
  type           text not null check (type in ('bug', 'suggestion', 'other')),
  message        text not null,
  status         text not null default 'open' check (status in ('open', 'reviewed', 'resolved')),
  screenshot_url text,
  created_at     timestamptz not null default now()
);

-- Phase 3
create table feature_flags (
  key         text primary key,
  enabled     boolean not null default false,
  description text,
  updated_at  timestamptz not null default now()
);

create table announcements (
  id         uuid primary key default gen_random_uuid(),
  message    text not null,
  active     boolean not null default false,
  starts_at  timestamptz,
  ends_at    timestamptz,
  created_at timestamptz not null default now()
);
```

---

## Build order and what each phase unblocks

| Phase | Build when | Unblocks |
|---|---|---|
| 1 — Core | First real users | User management, issue triage, uptime visibility |
| 2 — Observability | First real traffic | Debug production issues, identify bad content |
| 3 — Operations | Pre-launch / marketing push | Safe deployments, rate abuse protection |
