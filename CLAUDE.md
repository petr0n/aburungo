# AburunGo

Practical Japanese for English speakers, focused on real-life situations. Multi-user app with progress tracking, spaced repetition, and AI conversation practice.

## Shared memory

All sessions (including worktrees) must read and write memories to:

```
/Users/peterabeln/.claude/projects/-Users-peterabeln-Documents-japanese-aburungo/memory/
```

Check `MEMORY.md` there at the start of every conversation. Write updated memories there at the end of any session where decisions were made or code was built. Never write memories to a worktree-specific path.

## Product rules

- **No gamification.** No XP, hearts, badges, mascots, level-ups. Progress tracking (SRS state, review history, streaks) is fine — reward loops are not.
- **Scores are reflection, not judgment.** A score may be shown as a momentary snapshot ("7 recalled") but must never drive anxiety or dopamine — no percentages, no pass/fail framing, no persistent grade. The signal of what needs more work lives in the SRS queue (what surfaces next), not in a number. Use language like "recalled" and "worth another look" rather than "correct" and "missed."
- **No exams or drills.** Assessment lives in lightweight recognition passes and SRS re-surfacing, not timed tests or scored quizzes. The app never tells a learner they failed.
- **Touch first.** Mobile-first design. No hover-only affordances. Touch targets ≥ 44px.
- **No fabricated Japanese sentences.** Do not invent novel Japanese phrases or sentences. All Japanese sentence content must come from JMdict/Tatoeba/KANJIDIC2 or a verified source — never composed from scratch.
- **JLPT level assignments** may be applied from training knowledge to well-established vocabulary. N5 and N4 vocabulary is canonical and consistent across all references. Mark any training-derived JLPT classification with `# jlpt-source: training` in YAML until the JMdict seed is complete and levels can be verified against the dataset.
- **N5 phrase content** may be added from training knowledge given the canonical, well-documented nature of N5 vocabulary. N4+ new phrases must eventually be verified against JMdict. Mark with `# content-source: training` in YAML until then.
- **Content changes require source citation in the commit message.** Any commit that adds or modifies Japanese content must name the source (e.g. "Source: JMdict for Applications, entry seq 1234567", "Source: Tatoeba sentence #98765", or "Source: training/N5 canonical — pending JMdict verification"). A commit without a source citation on content changes must be rejected.

## Access tiers

| Tier | Auth required | Content | Features |
|------|--------------|---------|----------|
| Guest | None | JLPT N5 | Fill-in-blank, Flashcards, Kana practice, Kanji browse |
| Free account | Sign-up (free) | N5 + N4 | Same as guest + progress sync across devices |
| Paid | Subscription | N5–N1 | All features + Conversation with Hana |

- Kana practice (hiragana/katakana) is fully free — it is pre-JLPT and prerequisite to all levels.
- Conversation with Hana is paid-only (Anthropic API cost).
- Paywall enforcement is aspirational; stub `isPaid = false` until payment is wired. The `tier` field in user metadata carries the slot.
- When a guest or free-tier user hits gated content, show a soft inline prompt — never a hard redirect.

## Stack

### Frontend

- **Build:** Vite + React 19 + TypeScript (strict; `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnusedLocals`)
- **Styling:** Tailwind v4 via `@tailwindcss/vite` (theme tokens in `src/index.css`)
- **State (in-session, transient):** Zustand
- **Auth client:** Supabase JS client (token management only — all data calls go through the API server)
- **Tests:** Vitest

### API Server

- **Runtime:** Node + TypeScript
- **Framework:** Hono
- **Auth:** Validate Supabase JWTs on every protected route
- **Routes:** `/api/auth`, `/api/vocabulary`, `/api/kanji`, `/api/progress`, `/api/audio`, `/api/stt`, `/api/conversation`

### Repo & Deployment

- **Structure:** Monorepo — `src/` (frontend) + `server/` (Hono API) in one repo
- **Deployment:** Separate — frontend on Vercel/Netlify, server on Railway/Fly.io/Render
- **Containers:** Podman preferred over Docker Desktop. Use `podman run` / `podman-compose` wherever Docker commands appear.
- **VOICEVOX:** Pre-generate audio locally with Podman, upload to Supabase Storage. Do not host VOICEVOX in production for V1.

### Infrastructure (Supabase)

- **Database:** Postgres — JMdict vocabulary, KANJIDIC2 kanji, user progress, SRS state, conversation history
- **Auth:** Supabase Auth (JWT, OAuth) — validated server-side, never trusted client-side
- **Storage:** Pre-generated VOICEVOX audio files, user assets

### SRS

- **Algorithm:** FSRS via `ts-fsrs`. State per card: `stability`, `difficulty`, `due_at`, `last_review`, `reps`.
- **Interface:** `Scheduler` in `src/types.ts` — keep function signatures stable so the algorithm is swappable.

### Learning Mechanics

1. Flashcards (vocabulary + phrases)
2. Fill-in-the-blank (text)
3. Hiragana / katakana practice
4. Kanji learning set (~2000 Joyo kanji)
5. Audio output (VOICEVOX TTS) + audio input fill-in-the-blank (Web Speech API → Whisper upgrade path)
6. Casual conversation sessions (Claude Haiku, streamed, persona + JLPT difficulty level set via system prompt)

## Data Sources

| Data                 | Source                                     | License               |
| -------------------- | ------------------------------------------ | --------------------- |
| Vocabulary / phrases | JMdict ("JMdict for Applications" variant) | CC BY 4.0             |
| Example sentences    | Tatoeba TSV download + `jpn_indices.csv`   | CC BY 2.0 FR          |
| Kanji (~2136 Joyo)   | KANJIDIC2 / KanjiAPI.dev                   | CC BY-SA 4.0          |
| Stroke order SVGs    | KanjiVG (bundled)                          | CC BY-SA 3.0          |
| TTS audio (static)   | VOICEVOX (self-hosted, pre-generated)      | Per-voice terms       |
| TTS audio (dynamic)  | Google Neural2 / Azure Nanami              | Paid                  |
| STT                  | Web Speech API (V1) → OpenAI Whisper API   | Free / $0.006/min     |
| Conversation AI      | Claude Haiku via Anthropic API             | $0.80/$4 per M tokens |

**Licensing note:** Use "JMdict for Applications" (CC BY 4.0) not base JMdict (CC BY-SA 4.0) — avoids share-alike if the app is monetized.

## Git workflow and commits

- **Branching**: Before committing, check branch with `git branch --show-current`. If on `main`, create and switch to `claude/<short-slug>`.
- **Review before writing message**: Always run `git status` and `git diff` before crafting the commit message.
- **Staging**: Stage selectively. Prefer `git add -p` for broad diffs; avoid committing unrelated files.
- **Atomic commits**: Commit at logical boundaries; do not bundle unrelated changes.
- **Commit format**: Use Conventional Commits: `<type>(<scope>): <description>`.
- **Commit message rules**:
  - Use imperative mood.
  - Subject max 50 chars, no trailing period.
  - Wrap body at 72 chars with a blank line after subject.
  - Explain why in the body when needed.
  - Use ASCII only in all commit messages; never use non-ASCII characters.
  - Do not include AI-generated footers or watermarks.
- **Push safety**: After commit, stop and ask before `git push`. Never push without explicit user confirmation.

## Commands

```
pnpm dev             frontend dev server
pnpm build           type-check + bundle
pnpm lint            eslint
pnpm test            vitest, one shot
pnpm test:watch      vitest, watch mode
```

## Layer boundaries

- **`src/srs/`** is pure. No React, no DB, no fetch. `now` is always a parameter — never `Date.now()` inside functions. Exports a `Scheduler` implementation.
- **`src/api/`** owns all fetch calls to the Hono server. Components never call fetch directly.
- **`src/store/`** is Zustand, in-memory only. Never duplicate server-persisted entities into Zustand. Session store holds ordered queue of IDs + index, not full objects.
- **`src/components/`** is presentation. Receives props, fires callbacks. No fetch, no SRS calls, no direct Supabase client calls.
- **`src/types.ts`** is the single source of truth for domain types. Update it before changing shape elsewhere.
- **Server:** Hono routes are thin — validate input, call a service function, return JSON. Business logic lives in `server/services/`, not in route handlers.

## TypeScript conventions

- Functional components only: `export function Name(props: Props)` with explicit `Props` type.
- No `any`. No `as` casts except at validated trust boundaries.
- Prefer `type` over `interface` except when extending. Re-export domain types from `src/types.ts`.
- Imports use `@/` alias for anything under `src/`.
- `verbatimModuleSyntax` on — use `import type` for type-only imports.
- `erasableSyntaxOnly` on — no parameter properties, no enums. Use explicit field declarations and union types.

## Workflow rules

- **No worktrees.** Work directly on main or a named branch. Do not create git worktrees unless the user explicitly requests it.
- **Branch names must be descriptive.** Never use auto-generated or random string names. Use short, readable names like `feature/kana-keyboard` or `fix/hero-image`.
- **Warn before requesting OS permissions.** Microphone, camera, location, contacts — flag it before writing code that triggers a permission prompt.

## Hard constraints

- **Do not call the Supabase client directly from components** — all data goes through the API server. The Supabase JS client in the frontend is for auth token management only.
- **Do not couple `useLiveQuery`-style reactive reads to components that also drive writes** — re-render storms during review sessions.
- **Do not store `Date.now()` inside SRS functions.** Pass `now` in.
- **Do not generate placeholder Japanese content.**
- **Do not read binary image files** (`.png`, `.jpg`, `.gif`, `.webp`) with the Read tool — causes conversation context errors. Reference image paths as strings only.
- **Always run `pnpm build` and `pnpm test` before concluding code changes.**

## Not built yet (planned)

- Database schema + Supabase migrations
- Hono server scaffold
- JMdict / Tatoeba / KANJIDIC2 seed scripts
- VOICEVOX audio pre-generation pipeline
- All learning mechanic UIs (flashcard, fill-in-the-blank, kana practice, kanji, audio, conversation)
- Routing — add `react-router` when first multi-view need arises
- Furigana via `<ruby>` — needs kana tokenizer; show reading as separate line for now
