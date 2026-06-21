# AburunGo — Project Plan

Practical Japanese for English speakers. Focused on real-life situations with spaced repetition, structured drills, and AI conversation practice.

---

## Access tiers

| Tier | Auth | Content | Features |
|---|---|---|---|
| Guest | None | JLPT N5 | Fill-in-blank, Flashcards, Kana practice, Kanji browse (N5 only) |
| Free account | Sign-up (free) | N5 + N4 | Same + progress sync across devices |
| Paid | Subscription | N5–N1 | All features + Conversation with Hana |

- Kana (hiragana / katakana) is always fully free — it is pre-JLPT.
- Conversation with Hana is paid-only because it carries a real Anthropic API cost.
- Paywall enforcement is stubbed; any authenticated user is treated as free tier until payment is wired. The `UserTier` type in `src/types.ts` carries the slot.
- See [decision-records.md](decision-records.md) for the rationale behind this model.

---

## What's built (on main / feature branch)

| Feature | Route | Auth required | Backend |
|---|---|---|---|
| Landing + auth | `/` | — | Supabase Auth |
| Fill-in-the-blank | `/practice` | No | Local YAML + IndexedDB + Leitner SRS (server sync pending) |
| Flashcards (3D flip) | `/flashcard` | No | Local YAML + IndexedDB + Leitner SRS (server sync pending) |
| Kana hub | `/kana` | No | — |
| Kana practice | `/kana/practice` | No | Guest: localStorage. Signed-in: Hono progress API (dual-write) |
| Kanji browse + drill | `/kanji` | No | Hono + KANJIDIC2 (N5 tab only for guests) |
| Conversation with Hana | `/conversation` | No (soft prompt for guests) | Hono + Anthropic Haiku, streamed |
| Profile / progress | `/profile` | No (soft prompt for guests) | Hono progress API (stats + kana) |
| Admin dashboard | `/admin/*` | Admin role | Hono admin routes |

### Navigation & layout

- `PageShell` (`src/components/PageShell.tsx`) wraps all pages — two-row header (logo + account chip, then nav tabs with active underline), max content width `max-w-5xl` (1024px)
- Right sidebar always present on desktop (lg breakpoint); Practice / Flashcard / Kana pages render a `SectionNav` ("IN THIS SECTION") sub-nav linking to sibling modes; all pages will show progress stats here
- `/conversation` shows an inline soft prompt for guests rather than a hard redirect (see DR-008)

### Progress system

- **Kana:** fully wired — guest progress in localStorage, signed-in users sync via Hono API + `user_kana_progress` table; dual-write on first sign-in migrates guest data
- **Kanji:** drill reviews sync via Hono API + `user_kanji_progress` table
- **Phrases (fill-in-blank / flashcard):** reviews sync to server for signed-in users (`session.rate()` posts `submitReview`); due queue merges server `fetchDue()` with local Leitner so due cards surface cross-device (DR-015). Guests stay local Leitner + IndexedDB. Full server-source-of-truth (dropping local Leitner for signed-in users) is a follow-up needing a server endpoint.
- **Progress widget:** `src/components/ProgressWidget.tsx` — two-tone bar (reviewed/mastered); renders phrases-by-JLPT, kana, and kanji from `/api/progress/stats`
- **Profile page:** full stats view with kana breakdown and per-script reset controls

### Auth

- Email + password with forgot-password / recovery flow — live
- Google OAuth — live (consent screen published)
- Apple Sign-In — deferred (requires $99/yr Apple Developer account; see `todo.md`)

### Content

- **38 N5 phrases** across 6 scenarios: transit, restaurant, greetings, shopping, hotel, directions
- All phrases tagged `jlpt: N5` — JLPT classifications are from training knowledge (canonical N5 vocabulary), pending JMdict seed verification
- Kana: full hiragana + katakana sets (basic, voiced, combinations) — 104 characters

### Infrastructure

- Supabase project live (East US) — 5 migrations applied, RLS enabled on all tables
- **Hono server deployed on Railway** — Node 22, Nixpacks build, `/health` endpoint
- pnpm monorepo: `src/` (Vite + React 19) + `server/` (Hono + Node)
- 228 vocabulary cards across 20 decks seeded to production DB
- 2,140 Joyo kanji seeded from KANJIDIC2
- Vercel deployment: frontend SPA at `aburungo.app`, ADS cloned as sibling during install
- CI: GitHub Actions lint + build + test on every PR
- **`VITE_API_URL`** must be set in Vercel env vars pointing to the Railway service URL

---

## Roadmap

### Done (was near-term)
- ~~Verify `VITE_API_URL` in Vercel~~ — all three frontend env vars set; site live (DR-013/014)
- ~~Connect phrase/flashcard progress to server~~ — reviews sync for signed-in users; server due cards merged into the queue (DR-015)
- ~~Extend progress widget to phrases + kanji~~ — widget renders all three from `/api/progress/stats`

### Near term
1. **Full FSRS source-of-truth for signed-in users** — today the session store posts reviews to the server and merges server `fetchDue()` due cards, but local Leitner still co-drives the queue and new-card detection is local (DR-015). To make the server authoritative cross-device, add a server endpoint returning the user's reviewed/new card set, then drop local Leitner for signed-in users. Guests stay on local Leitner.
2. **N4 content** — add YAML scenario files for N4-level vocabulary; verify JLPT level against JMdict seed before merging
3. **VOICEVOX audio pipeline** — vet voice licenses, pre-generate TTS locally via Podman, upload to Supabase Storage (see `admin-dashboard-plan.md` for multi-voice strategy)
4. **Admin Phase 2** — log viewer (pino ring buffer), learning analytics, content audit (see `admin-dashboard-plan.md`)
5. **Paywall / payment integration** — flip `isPaid` check in `useUserTier()` when Stripe/RevenueCat is wired; slot in `UserTier` type is ready

### Longer term
6. **Audio fill-in-the-blank** — Web Speech API for STT input; Whisper API upgrade path
7. **Admin Phase 3** — feature flags, announcements, rate limiting dashboard
8. **Lesson picker** — structured lesson flow on top of the existing `Lesson` type
9. **Tatoeba example sentences** — seed and surface example sentences per card
10. **Apple Sign-In** — when $99/yr Apple Developer account is obtained (see `todo.md`)
11. **Mobile app** — React Native or PWA with offline support

---

## Testing strategy

**User testing is a priority for this app**, alongside unit, functional, and end-to-end tests. The goal is confidence at every layer before shipping to real learners.

### Unit tests
- SRS scheduling logic (`src/srs/`) — pure functions, already tested with Vitest
- API service functions (`server/src/services/`) — test DB query logic with a test Supabase instance or mocked client
- Utility functions (shuffle, parseKun, kana derivation) — fast, isolated
- Content validation — `parsePhrases` throws on bad YAML; covered by build

### Functional tests
- API route handlers — test full request/response cycle for each Hono route: auth rejection, valid input, invalid input, edge cases
- FSRS scheduling integration — submit a review, verify the next `due_at` is computed correctly
- Admin middleware — verify non-admins get 403, admins get through

### End-to-end tests
- Full user flows with a real browser (Playwright preferred):
  - Guest → fill-in-the-blank review → rate → confirm progress stored in IndexedDB
  - Sign up → confirm tier upgrades to free → N4 content now visible
  - Start kanji drill → reveal → rate → confirm `user_kanji_progress` updated
  - Start conversation (authenticated) → send message → receive streamed reply
  - Submit feedback → verify appears in admin feedback inbox
  - Admin: suspend user → verify suspended flag set

### User testing
- Recruit Japanese learners at beginner (N5) and intermediate (N3) levels
- Test core loop: fill-in-the-blank → flashcard → kanji drill as a daily session
- Measure: time-on-task, error rate, subjective difficulty of UI
- Specific focus areas:
  - Guest onboarding — does the landing page CTA make the free tier obvious?
  - Furigana readability on small screens
  - Kana keyboard usability on mobile
  - Conversation pacing (is streaming too fast/slow?)
  - JLPT level selector discoverability

### Before each release
- All unit and functional tests passing
- E2E smoke tests covering the golden path
- Manual walkthrough of any new feature on a real mobile device (iOS Safari priority)
- PR checklist items verified (see [todo.md](todo.md))

---

## Content rules (non-negotiable)

- **No fabricated Japanese sentences.** Do not invent novel phrases from training data. All Japanese sentence content must be traceable to JMdict, Tatoeba, KANJIDIC2, or a verified source.
- **JLPT level assignments** may use training knowledge for N5/N4 vocabulary (canonical and consistent across all references). Mark with `# jlpt-source: training` in YAML until the JMdict seed is complete.
- **N5 phrase content** may be added from training knowledge given the canonical nature of N5 vocabulary. Mark with `# content-source: training`. N4+ new phrases must be verified against JMdict.
- **Declare source before writing content.** Any new phrase/vocab must cite the source before a single character is written.
- **Source cited in commit message** for any content change.
- See [data-sources.md](data-sources.md) for full licensing details.

## Display rules (non-negotiable)

- **Furigana everywhere outside kanji-learning paths.** Any Japanese text containing kanji must use the `<Furigana>` component (renders `<ruby>`) so learners are never blocked by an unfamiliar character. This applies to: word tiles, learn cards, drill cards, flashcards, fill-in-the-blank, phrase displays, result/review screens, conversation history. Pure-kana text passes through unchanged — the component handles this automatically.
- **Furigana off in kanji-learning paths.** The `/kanji` route and any future explicit kanji-reading exercises must not show furigana — the point of those screens is to read the character.
- **Use `<Furigana>` not raw `<ruby>`.** Segmentation logic lives in `src/lib/furigana.ts`; the component is `src/components/Furigana.tsx`. Never inline a `<ruby>` tag manually.
- **Assessment language is non-judgmental.** Use "recalled" not "correct", "worth another look" not "missed", "review again" not "retest". A score is a momentary reflection, never a grade. See assessment principles below.

## Assessment principles (non-negotiable)

- **No exams or drills.** The app never tells a learner they failed. Assessment lives in lightweight recognition passes (tap-to-match from 3 options) and SRS re-surfacing.
- **Scores are reflection, not judgment.** Show counts ("7 recalled") but never percentages, pass/fail verdicts, or persistent grades. The real feedback is what the SRS surfaces next — not a number.
- **Skip is always available.** Every assessment screen must have a visible skip/pass option. It is the relief valve for users who do not want to be quizzed.
- **The SRS queue is the signal.** Words a learner struggled with surface again sooner — that is the feedback mechanism, invisible to the user. Do not surface SRS state as a score.

---

## Key technical decisions

| Decision | Choice | Why |
|---|---|---|
| SRS algorithm | Leitner (local), FSRS (server) | Leitner for offline/guest simplicity; FSRS when server sync is live |
| Content tiering | JLPT levels (N5/N4/N3/N2/N1) | Well-known standard; JMdict has JLPT data built in |
| Guest session storage | IndexedDB (Dexie) | Works offline, no account needed, same data model as server |
| Streaming chat | Hono `streamText` + `ReadableStream` on client | No SSE library needed; works on all targets |
| Admin auth | Supabase `app_metadata.role` | Server-set only; included in JWT; no extra table |
| Audio (V1) | Pre-generated VOICEVOX, stored in Supabase Storage | No real-time hosting cost |
| Fonts | Noto Sans JP (variable, self-hosted) | Full kanji coverage; no external CDN dependency |
| Furigana | `<Furigana>` (`<ruby>`) on all kanji outside `/kanji` route | Learners should never be blocked by an unfamiliar character; kanji-learning path is the only exception |
| Assessment | Recognition pass (3-option tap) + SRS re-surfacing; no scored drills | A score is a reward loop — feedback lives in what surfaces next, not a number |

See [decision-records.md](decision-records.md) for full rationale on product and architecture decisions.

---

## Related docs

- [Decision records](decision-records.md) — ADR-style log of significant decisions and their rationale
- [Admin dashboard plan](admin-dashboard-plan.md) — full 10-feature plan across 3 phases
- [Data sources](data-sources.md) — JMdict, Tatoeba, KANJIDIC2 licensing details
- [Release & Deployment](release.md) — dev workflow, production release steps, hotfix, rollback plan
- [Todo](todo.md) — active task list
