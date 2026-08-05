# Todo

## Pending

- [ ] **Apply `user_path_progress` migration to production** — `supabase db push` for `20260804000000_path_progress.sql` (DR-016). Needs `SUPABASE_DB_PASSWORD`, which is not stored in `.local/`. Until applied, the `/api/progress/path` endpoints return an error and the client silently falls back to IndexedDB — i.e. current behaviour, no breakage, but ladder position is still evictable.
- [ ] **Delete duplicate Vercel project `project-hbbvq`** — stray project wired to the same repo, builds identical output; only `aburungo-server` (owns the `aburungo.app` domain) is needed. Remove the `VITE_API_URL` mistakenly added there too. (DR-013)
- [ ] **Full FSRS source-of-truth for signed-in users** — currently the session store posts reviews to the server AND merges server `fetchDue()` due cards into the queue (DR-015), but local Leitner still co-drives the queue and "new vs reviewed-not-due" is detected locally. To make the server the sole source of truth cross-device, add a server endpoint returning all card IDs the user has progress on (or "new cards"), then drop local Leitner for signed-in users. Guests stay on local Leitner.
- [ ] **N4 content** — add YAML scenario files for N4-level phrases; verify JLPT levels against JMdict seed before merging
- [ ] **VOICEVOX pipeline** — pre-generate audio locally with Podman, upload to Supabase Storage
- [ ] **Admin Phase 2** — log viewer (pino ring buffer), learning analytics, content audit
- [ ] **Paywall / Stripe** — flip `isPaid` check in `useUserTier()` when payment is wired
- [ ] **Review all closed PRs** — go through the test checklist on each merged PR and manually verify. None worked through yet.
- [ ] **Sign in with Apple** — requires $99/yr Apple Developer account. Steps: register App ID + Services ID on developer.apple.com, generate Sign in with Apple private key, enter Team ID / Key ID / Services ID / private key in Supabase Auth → Providers → Apple, then add button to `AuthForm` alongside Google.

## In progress

<!-- Move items here when actively working on them -->

## Done

- [x] **Phrase/flashcard review sync to server** — `FillBlankScreen`/`FlashcardScreen` pass `userId`; `session.rate()` fire-and-forget posts `submitReview(cardId,…)` for signed-in users and refreshes stats (PRs #37/#38). Server `fetchDue()` due cards now merged into the queue for cross-device due selection (DR-015). (Full server-source-of-truth tracked separately under Pending.)
- [x] **Progress widget shows phrases + kanji** — `ProgressWidget` renders phrases-by-JLPT, kana, and kanji rows from `/api/progress/stats` (not kana-only).
- [x] **aburungo.app live** — set all three frontend env vars on `aburungo-server` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_API_URL`); fixed duplicate-React `useId` crash via `resolve.dedupe` (PR #40, DR-013/DR-014). Blank-page failure modes documented in infrastructure.md.
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
