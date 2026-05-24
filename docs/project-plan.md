# AburunGo — Project Plan

Practical Japanese for English speakers. Focused on real-life situations with spaced repetition, structured drills, and AI conversation practice.

---

## What's built (on main)

| Feature | Route | Backend |
|---|---|---|
| Auth (sign in / sign up) | `/` | Supabase Auth |
| Fill-in-the-blank | `/practice` | FSRS via Hono server |
| Flashcards (3D flip + slide) | `/flashcard` | FSRS via Hono server |
| Kana practice (hiragana + katakana) | `/kana` | Local only |
| Kanji browse + Anki drill | `/kanji` | FSRS via Hono server |
| Conversation with Hana (Claude Haiku, streamed) | `/conversation` | Hono + Anthropic API |
| Admin dashboard Phase 1 | `/admin/*` | Hono admin routes |

### Infrastructure
- Supabase project live (East US) — schema migrated, RLS enabled on all tables
- Hono server with Supabase JWT auth on all protected routes
- pnpm monorepo: `src/` (Vite + React 19) + `server/` (Hono + Node)
- 228 vocabulary cards across 20 decks seeded to production DB
- 2,140 Joyo kanji seeded from KANJIDIC2

---

## Roadmap

### Near term
1. **Apply admin migration** — run `supabase db push` for `20260523000000_admin_phase1.sql`
2. **VOICEVOX audio pipeline** — vet voice licenses, pre-generate TTS locally via Podman, upload to Supabase Storage (see `admin-dashboard-plan.md` for multi-voice strategy)
3. **Stats / progress screen** — `/api/progress/stats` exists, needs a UI
4. **Admin Phase 2** — log viewer (pino), learning analytics, content audit (see `admin-dashboard-plan.md`)

### Medium term
5. **Audio fill-in-the-blank** — Web Speech API for input, Whisper upgrade path
6. **Admin Phase 3** — feature flags, announcements, rate limiting dashboard
7. **FSRS migration** — frontend currently uses Leitner for local SRS; DB schema uses FSRS. Migrate kana practice to server-backed FSRS when ready.

### Longer term
8. **Lesson picker** — structured lesson flow on top of the existing `Lesson` type
9. **Tatoeba example sentences** — seed and surface example sentences per card
10. **Mobile app** — React Native or PWA with offline support

---

## Testing strategy

**User testing is a priority for this app**, alongside unit, functional, and end-to-end tests. The goal is confidence at every layer before shipping to real learners.

### Unit tests
- SRS scheduling logic (`src/srs/`) — pure functions, already tested with Vitest
- API service functions (`server/src/services/`) — test DB query logic with a test Supabase instance or mocked client
- Utility functions (shuffle, parseKun, kana derivation) — fast, isolated

### Functional tests
- API route handlers — test full request/response cycle for each Hono route: auth rejection, valid input, invalid input, edge cases
- FSRS scheduling integration — submit a review, verify the next `due_at` is computed correctly
- Admin middleware — verify non-admins get 403, admins get through

### End-to-end tests
- Full user flows with a real browser (Playwright preferred):
  - Sign up → first fill-in-the-blank review → rate → confirm progress persisted
  - Start kanji drill → reveal → rate → confirm `user_kanji_progress` updated
  - Start conversation → send message → receive streamed reply
  - Submit feedback → verify appears in admin feedback inbox
  - Admin: suspend user → verify suspended flag set

### User testing
- Recruit Japanese learners at beginner (N5) and intermediate (N3) levels
- Test core loop: fill-in-the-blank → flashcard → kanji drill as a daily session
- Measure: time-on-task, error rate, subjective difficulty of UI
- Specific focus areas:
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

- **No training-data phrases.** All Japanese content comes from JMdict, Tatoeba, or KANJIDIC2.
- **Declare source before writing content.** Any new phrase/vocab must cite the source before a single character is written.
- **Source cited in commit message** for any content change.
- See `data-sources.md` for full licensing details.

---

## Key technical decisions

| Decision | Choice | Why |
|---|---|---|
| SRS algorithm | FSRS via ts-fsrs | More accurate than Leitner; industry standard |
| Streaming chat | Hono `streamText` + `ReadableStream` on client | No SSE library needed; works on all targets |
| Admin auth | Supabase `app_metadata.role` | Server-set only; included in JWT; no extra table |
| Audio (V1) | Pre-generated VOICEVOX, stored in Supabase Storage | No real-time hosting cost |
| Fonts | Noto Sans JP (variable, self-hosted) | Full kanji coverage; no external CDN dependency |

---

## Related docs

- [Admin dashboard plan](admin-dashboard-plan.md) — full 10-feature plan across 3 phases
- [Data sources](data-sources.md) — JMdict, Tatoeba, KANJIDIC2 licensing details
- [Todo](todo.md) — active task list
