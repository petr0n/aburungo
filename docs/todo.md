# Todo

## Pending

- [ ] **Verify `VITE_API_URL` in Vercel** — confirm Railway URL is set as an env var; `src/api/client.ts` throws on load if missing, breaking the entire frontend in production
- [ ] **Connect phrase/flashcard progress to server** — `submitReview`/`fetchDue` exist in `src/api/progress.ts` but are never called; `PracticePage` and `FlashcardPage` use local Leitner only; authenticated users should dual-write IndexedDB + server FSRS
- [ ] **Extend progress widget to phrases + kanji** — `ProgressWidget` currently shows kana only; add phrase and kanji rows sourced from `/api/progress/stats`
- [ ] **FSRS migration for session store** — once server sync is live, authenticated sessions should pull due cards from server and post reviews (replacing client-side Leitner for signed-in users)
- [ ] **N4 content** — add YAML scenario files for N4-level phrases; verify JLPT levels against JMdict seed before merging
- [ ] **VOICEVOX pipeline** — pre-generate audio locally with Podman, upload to Supabase Storage
- [ ] **Admin Phase 2** — log viewer (pino ring buffer), learning analytics, content audit
- [ ] **Paywall / Stripe** — flip `isPaid` check in `useUserTier()` when payment is wired
- [ ] **Review all closed PRs** — go through the test checklist on each merged PR and manually verify. None worked through yet.
- [ ] **Sign in with Apple** — requires $99/yr Apple Developer account. Steps: register App ID + Services ID on developer.apple.com, generate Sign in with Apple private key, enter Team ID / Key ID / Services ID / private key in Supabase Auth → Providers → Apple, then add button to `AuthForm` alongside Google.

## In progress

<!-- Move items here when actively working on them -->

## Done

- [x] **Persistent PageShell** — shared two-row header, `max-w-5xl` content width, sidebar always present on desktop (lg); `SectionNav` sub-nav on practice/flashcard/kana pages (DR-008)
- [x] **Profile route** — `/profile` added; guests see sign-in prompt, logged-in users see account info (DR-008)
- [x] **Soft prompt for `/conversation`** — replaced `ProtectedRoute` hard-redirect with inline soft prompt for guests (DR-008)
- [x] **`user_kana_progress` migration** — applied to production (20260530000000_kana_progress.sql)
- [x] **Extend `/api/progress/stats`** — server returns per-tier phrase + kanji + kana breakdowns
- [x] **Progress store (Zustand)** — `src/store/progress.ts`; localStorage for guests, API dual-write for signed-in users; guest data migrated to server on first sign-in
- [x] **Two-tone progress bar widget** — `src/components/ProgressWidget.tsx`; light = reviewed, dark = mastered
- [x] **Profile page progress dashboard** — full stats + per-script kana reset with confirmation dialog
- [x] **Deploy Hono server** — Railway, Node 22, Nixpacks; `/health` endpoint live (PRs #32–#35)
- [x] **Google OAuth** — configured in Supabase, consent screen published, `AuthForm` wired (PR #28)
- [x] **Custom domain** — `aburungo.app` live on Vercel; Cloudflare DNS + email routing
- [x] **Kana route split** — `/kana` = hub page, `/kana/practice` = practice screen
- [x] **Password recovery flow** — `otp_expired` hash error handled; auto-opens forgot-password mode
