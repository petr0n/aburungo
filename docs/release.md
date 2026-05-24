# Release & Deployment

Rough deployment plan for AburunGo. Details to be refined as the app matures.

---

## Environments

| Environment | Frontend | API Server | Database |
|---|---|---|---|
| **Dev** | `localhost:5173` (Vite) | `localhost:3000` (Hono) | Supabase local or shared dev project |
| **Staging** | Vercel preview URL | Railway/Fly.io preview | Supabase dev project |
| **Production** | Vercel (main branch) | Railway/Fly.io | Supabase production project |

---

## Dev workflow

1. Pull latest main: `git pull origin main`
2. Install deps: `pnpm install`
3. Start both servers: `pnpm dev` (runs frontend + API concurrently)
4. Work on a feature branch: `git checkout -b feature/<name>`
5. Run tests before pushing: `pnpm test && pnpm build`
6. Open a PR against main — CI should run lint + tests
7. Merge after review

---

## Production release

### Prerequisites
- All tests passing on the branch
- PR checklist items manually verified
- Any new migrations reviewed and tested against a copy of prod data

### Steps
1. Merge PR to main
2. **Database first** — run any pending migrations: `supabase db push`
3. **API server** — Railway/Fly.io auto-deploys from main; confirm deploy completes and `/health` returns `ok: true`
4. **Frontend** — Vercel auto-deploys from main; confirm preview looks correct before promoting
5. Smoke test the golden path on production:
   - Sign in → fill-in-the-blank review
   - Kanji drill → rate a card
   - Conversation → send a message
6. Check admin health dashboard (`/admin/health`) — DB latency green, uptime reset

### Environment variables to confirm before each release
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` (frontend)
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` (server)
- `ANTHROPIC_API_KEY` (server)
- `FRONTEND_URL` (server CORS origin)
- `PORT` (server)

---

## Hotfix

For urgent production bugs that can't wait for the normal release cycle.

1. Branch off main: `git checkout -b fix/<short-description>`
2. Make the minimal fix — no unrelated changes
3. Test locally: `pnpm test && pnpm build`
4. Open a PR, get at least one review (or self-review with extra care)
5. Merge and follow the normal production release steps above
6. Post a note in the feedback inbox or announce to affected users if the bug was user-facing

---

## Rollback plan

### Frontend rollback
Vercel keeps all previous deployments. In the Vercel dashboard, find the last good deployment and click **Promote to Production**. Takes ~30 seconds.

### API server rollback
Railway and Fly.io both keep deployment history. Redeploy the previous image from the dashboard or CLI:
```bash
# Railway
railway rollback

# Fly.io
fly releases list
fly deploy --image <previous-image-ref>
```

### Database rollback
Supabase migrations are append-only — there is no automatic down migration. Plan ahead:

- **Before any destructive migration** (dropping columns, changing types), write a compensating migration and keep it ready but uncommitted
- **For additive migrations** (new tables, new columns with defaults), rollback is usually not needed — the old code still works against the new schema
- **If data was corrupted**, restore from a Supabase point-in-time backup (available in the Supabase dashboard under Database → Backups)

General rule: **prefer additive, non-breaking migrations**. Never drop a column in the same migration that removes it from the codebase — do it in a follow-up migration after the code has been deployed.

---

## Checklist templates

### Standard release
- [ ] Tests passing (`pnpm test`)
- [ ] Build clean (`pnpm build`)
- [ ] PR checklist items verified manually
- [ ] Migrations applied (`supabase db push`)
- [ ] API server healthy (`/health`)
- [ ] Frontend deployed and smoke-tested
- [ ] Admin health dashboard green

### Hotfix release
- [ ] Minimal change — no scope creep
- [ ] Tested locally
- [ ] Reviewed (self or peer)
- [ ] Deployed and verified in production within 30 min of merge

---

## To be detailed later

- CI/CD pipeline (GitHub Actions) — lint, test, build on every PR
- Staging environment promotion flow
- Load testing before any marketing push
- Monitoring and alerting (uptime checks, error rate thresholds)
- On-call rotation if the app grows to need one
