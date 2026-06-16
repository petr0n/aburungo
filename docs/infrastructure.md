# AburunGo — Infrastructure Setup

How the app is hosted, where DNS lives, and how email works.

---

## Overview

| Layer | Service | Cost |
|---|---|---|
| Domain | GoDaddy (`aburungo.app`) | ~$20/yr |
| DNS + Email routing | Cloudflare (free) | Free |
| Frontend hosting | Vercel — project **`aburungo-server`** | Free tier |
| Backend hosting | Railway (`aburungo-server-production.up.railway.app`) | Free tier |
| Transactional email | Resend | Free tier |
| Database + Auth | Supabase (`ecwzexrjgnecpfyvrsdb`, East US) | Free tier |

---

## Live deployment — current values

The frontend is the Vercel project **`aburungo-server`** (misleading name — it serves the
frontend SPA, not the API; the API server is on Railway). The `aburungo.app` and
`www.aburungo.app` domains are attached to this project. See DR-013 / DR-014.

> **Stray duplicate project `project-hbbvq`** is wired to the same repo and builds identical
> output. It is unused and should be deleted — do not add config to it.

**Required frontend env vars** — Vercel -> `aburungo-server` -> Settings -> Environment
Variables, scope Production + Preview. All are baked in at build time by Vite, so changing
any requires a redeploy:

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://ecwzexrjgnecpfyvrsdb.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase **publishable** key (`sb_publishable_...`) — safe in frontend; never the secret key |
| `VITE_API_URL` | `https://aburungo-server-production.up.railway.app` (no trailing slash) |

### Troubleshooting: blank / white page on aburungo.app

HTTP 200 but nothing renders is almost always one of these (not a build failure):

1. **Missing env vars.** `src/lib/supabase.ts` and `src/api/client.ts` throw at module load
   if their `VITE_*` vars are unset — before React mounts, so the page is blank and the JS
   bundle can look like a small "stub." Fix: confirm all three vars above exist, then
   **redeploy** (Vite only bakes env vars at build time).
2. **Supabase project paused** (free tier pauses after inactivity). Breaks auth/data even
   with correct env vars; resume it in the Supabase dashboard. Does *not* cause the blank
   page throw.
3. **Duplicate React** (`Cannot read properties of null (reading 'useId')` in console). The
   linked design system ships its own React; `vite.config.ts` must keep
   `resolve.dedupe: ['react','react-dom']` (DR-014).

---

## SSL

Vercel provisions TLS certificates automatically via Let's Encrypt for every
deployment — including custom domains. The SSL product offered by GoDaddy is
redundant and should not be purchased.

---

## Setup sequence

### 1. Buy the domain on GoDaddy

Purchase `aburungo.app`. Skip any add-ons (SSL, email hosting, etc.).

### 2. Create a free Cloudflare account

Go to cloudflare.com and add `aburungo.app` as a site. Cloudflare will scan
your existing DNS records.

### 3. Point GoDaddy nameservers at Cloudflare

In GoDaddy DNS settings, replace the default nameservers with the two
Cloudflare nameservers shown during setup (e.g. `aria.ns.cloudflare.com`).
Propagation takes a few minutes to a few hours.

From this point on, all DNS is managed in Cloudflare — not GoDaddy.

### 4. Set up Cloudflare Email Routing

In Cloudflare dashboard → `aburungo.app` → Email → Email Routing:

1. Enable Email Routing
2. Add a destination address (your Gmail) and verify it
3. Add forwarding rules:

| From | To |
|---|---|
| `test-new@aburungo.app` | `petron@gmail.com` |
| `test-active@aburungo.app` | `petron@gmail.com` |
| `test-admin@aburungo.app` | `petron@gmail.com` |
| `hello@aburungo.app` | `petron@gmail.com` |

Add a catch-all rule (`*@aburungo.app → petron@gmail.com`) so any address
you create in future is automatically forwarded without updating rules.

This is receive-only. Sending from `@aburungo.app` addresses requires Resend
(see below).

### 5. Deploy frontend to Vercel

1. Connect your GitHub repo (`petr0n/aburungo`) to Vercel
2. Set environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL` = `https://ecwzexrjgnecpfyvrsdb.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = your publishable key
   - `VITE_API_URL` = your deployed backend URL (set after step 6)
3. Add `aburungo.app` as a custom domain in Vercel
4. Vercel provides DNS records (A record + CNAME) — add these in Cloudflare
5. Vercel auto-provisions the SSL certificate

### 6. Deploy backend to Railway / Fly.io / Render

TBD — pick one and document here. Required environment variables match
`server/.env.example`:

```
PORT=3000
FRONTEND_URL=https://aburungo.app
SUPABASE_URL=https://ecwzexrjgnecpfyvrsdb.supabase.co
SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...
ANTHROPIC_API_KEY=...
```

Once deployed, update `VITE_API_URL` in Vercel and redeploy the frontend.

### 7. Set up Resend (transactional email)

Needed for: password reset emails, welcome emails, any future notifications.

1. Create a free account at resend.com
2. Add `aburungo.app` as a sending domain
3. Resend provides DNS records (SPF, DKIM) — add these in Cloudflare
4. In Supabase dashboard → Authentication → Email settings, configure the
   SMTP details from Resend
5. Sender address: `hello@aburungo.app`

---

## Test accounts

Created via Supabase dashboard (Authentication → Users → Add user).
Use "Auto Confirm User" so no confirmation email is required on creation.

| Email | Role | Purpose |
|---|---|---|
| `test-new@aburungo.app` | none | First-time user, no history |
| `test-active@aburungo.app` | none | Regular learner, mid-progress |
| `test-admin@aburungo.app` | admin | Admin route coverage |

All three forward to `petron@gmail.com` via Cloudflare Email Routing.

After creating each account, set `app_metadata.role = "admin"` for
`test-admin@aburungo.app` via the Supabase dashboard or API:

```bash
curl -X PUT "https://ecwzexrjgnecpfyvrsdb.supabase.co/auth/v1/admin/users/<uid>" \
  -H "apikey: <service-role-key>" \
  -H "Authorization: Bearer <service-role-key>" \
  -H "Content-Type: application/json" \
  -d '{"app_metadata": {"role": "admin"}}'
```

---

## Admin account

`petron@gmail.com` (UID `f25d41b2-eeaf-4aff-98b4-ded02b914921`) has
`app_metadata.role = "admin"` set. This was applied 2026-05-25.

---

## Current status

- [x] Domain purchased (aburungo.app secured 2026-05-25)
- [x] Cloudflare DNS active (nameservers updated 2026-05-25)
- [x] Cloudflare Email Routing configured (2026-05-26)
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed
- [ ] Resend configured in Supabase
- [x] Test accounts created (2026-05-26)
