# AburunGo

Practical Japanese for English speakers, focused on real-life situations. Multi-user app with progress tracking, spaced repetition, and AI conversation practice.

## Product rules

- **No gamification.** No XP, hearts, badges, mascots, level-ups. Progress tracking (SRS state, review history, streaks) is fine — reward loops are not.
- **Touch first.** Mobile-first design. No hover-only affordances. Touch targets ≥ 44px.
- **Real content only.** All Japanese content comes from JMdict/Tatoeba/KANJIDIC2 or verified sources. Never fabricate, simulate, or placeholder phrase content.

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

| Data | Source | License |
|---|---|---|
| Vocabulary / phrases | JMdict ("JMdict for Applications" variant) | CC BY 4.0 |
| Example sentences | Tatoeba TSV download + `jpn_indices.csv` | CC BY 2.0 FR |
| Kanji (~2136 Joyo) | KANJIDIC2 / KanjiAPI.dev | CC BY-SA 4.0 |
| Stroke order SVGs | KanjiVG (bundled) | CC BY-SA 3.0 |
| TTS audio (static) | VOICEVOX (self-hosted, pre-generated) | Per-voice terms |
| TTS audio (dynamic) | Google Neural2 / Azure Nanami | Paid |
| STT | Web Speech API (V1) → OpenAI Whisper API | Free / $0.006/min |
| Conversation AI | Claude Haiku via Anthropic API | $0.80/$4 per M tokens |

**Licensing note:** Use "JMdict for Applications" (CC BY 4.0) not base JMdict (CC BY-SA 4.0) — avoids share-alike if the app is monetized.

## Commands

```
npm run dev          frontend dev server
npm run build        type-check + bundle
npm run lint         eslint
npm test             vitest, one shot
npm run test:watch   vitest, watch mode
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

## Hard constraints

- **Do not call the Supabase client directly from components** — all data goes through the API server. The Supabase JS client in the frontend is for auth token management only.
- **Do not couple `useLiveQuery`-style reactive reads to components that also drive writes** — re-render storms during review sessions.
- **Do not store `Date.now()` inside SRS functions.** Pass `now` in.
- **Do not generate placeholder Japanese content.**
- **Always run `npm run build` and `npm test` before concluding code changes.**

## Not built yet (planned)

- Database schema + Supabase migrations
- Hono server scaffold
- JMdict / Tatoeba / KANJIDIC2 seed scripts
- VOICEVOX audio pre-generation pipeline
- All learning mechanic UIs (flashcard, fill-in-the-blank, kana practice, kanji, audio, conversation)
- Routing — add `react-router` when first multi-view need arises
- Furigana via `<ruby>` — needs kana tokenizer; show reading as separate line for now
