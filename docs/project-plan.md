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
| Fill-in-the-blank | `/practice` | No | Local YAML + IndexedDB + Leitner SRS |
| Flashcards (3D flip) | `/flashcard` | No | Local YAML + IndexedDB + Leitner SRS |
| Kana practice | `/kana` | No | Local only (always has been) |
| Kanji browse + drill | `/kanji` | No | Hono + KANJIDIC2 (N5 tab only for guests) |
| Conversation with Hana | `/conversation` | No (soft prompt for guests) | Hono + Anthropic Haiku, streamed |
| Profile / progress | `/profile` | No (soft prompt for guests) | Hono progress API (when deployed) |
| Admin dashboard | `/admin/*` | Admin role | Hono admin routes |

### Navigation & layout

- `PageShell` (`src/components/PageShell.tsx`) wraps all pages — two-row header (logo + account chip, then nav tabs with active underline), max content width `max-w-5xl` (1024px)
- Right sidebar always present on desktop (lg breakpoint); Practice / Flashcard / Kana pages render a `SectionNav` ("IN THIS SECTION") sub-nav linking to sibling modes; all pages will show progress stats here
- `/conversation` shows an inline soft prompt for guests rather than a hard redirect (see DR-008)

### Content

- **38 N5 phrases** across 6 scenarios: transit, restaurant, greetings, shopping, hotel, directions
- All phrases tagged `jlpt: N5` — JLPT classifications are from training knowledge (canonical N5 vocabulary), pending JMdict seed verification
- Kana: full hiragana + katakana sets (basic, voiced, combinations) — 104 characters

### Infrastructure

- Supabase project live (East US) — schema migrated, RLS enabled on all tables
- Hono server with Supabase JWT auth on all protected routes
- pnpm monorepo: `src/` (Vite + React 19) + `server/` (Hono + Node)
- 228 vocabulary cards across 20 decks seeded to production DB (server-backed; available once Hono server is deployed)
- 2,140 Joyo kanji seeded from KANJIDIC2
- Vercel deployment: frontend SPA, framework preset `vite`, ADS cloned as sibling during install
- CI: GitHub Actions lint + build + test on every PR

---

## Roadmap

### Near term
1. **`user_kana_progress` migration** — new Supabase migration; one row per user per kana character (`recognized`, `recalled`, `lastSeenAt`)
2. **Extend `/api/progress/stats`** — add per-tier phrase + kanji + kana breakdowns (currently returns global counts only)
3. **Progress store (Zustand)** — localStorage for guests, API for signed-in users; single `aburungo_progress` key with versioned envelope (see DR-009)
4. **Two-tone progress bar widget** — sidebar component; light fill = reviewed/seen, dark fill = mastered/recalled; context-sensitive per page section
5. **Profile page progress dashboard** — full stats view + per-script and full reset controls (with confirmation dialog)
6. **Deploy Hono server** — Railway/Fly/Render; set env vars from `server/.env.example`; update `VITE_API_URL` in Vercel
7. **Connect phrase progress to server** — once server is live, dual-write IndexedDB + API; free tier stays local, authenticated tier syncs
8. **Add custom domain** — `aburungo.app` in Vercel after server deploy
9. **Apply admin migration** — run `supabase db push` for `20260523000000_admin_phase1.sql`

### Medium term
10. **Paywall / payment integration** — flip `isPaid` check in `useUserTier()` when Stripe/RevenueCat is wired; architecture is ready
11. **N4 content** — add YAML scenario files for N4-level vocabulary; verify JLPT level against JMdict seed
12. **VOICEVOX audio pipeline** — vet voice licenses, pre-generate TTS locally via Podman, upload to Supabase Storage (see `admin-dashboard-plan.md` for multi-voice strategy)
13. **Admin Phase 2** — log viewer (pino), learning analytics, content audit (see `admin-dashboard-plan.md`)
14. **Audio fill-in-the-blank** — Web Speech API for input, Whisper upgrade path

### Longer term
15. **Admin Phase 3** — feature flags, announcements, rate limiting dashboard
16. **FSRS migration** — session store currently uses Leitner for local SRS; DB schema uses FSRS. Migrate to server-backed FSRS when server is deployed and free-tier sync is in place.
17. **Lesson picker** — structured lesson flow on top of the existing `Lesson` type
18. **Tatoeba example sentences** — seed and surface example sentences per card
19. **Mobile app** — React Native or PWA with offline support

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

See [decision-records.md](decision-records.md) for full rationale on product and architecture decisions.

---

## Related docs

- [Decision records](decision-records.md) — ADR-style log of significant decisions and their rationale
- [Admin dashboard plan](admin-dashboard-plan.md) — full 10-feature plan across 3 phases
- [Data sources](data-sources.md) — JMdict, Tatoeba, KANJIDIC2 licensing details
- [Release & Deployment](release.md) — dev workflow, production release steps, hotfix, rollback plan
- [Todo](todo.md) — active task list
