# AburunGo

Practical Japanese for English speakers. Real-life scenarios — transit, restaurants, day-to-day interactions — delivered through spaced repetition, fill-in-the-blank drills, flashcards, kana practice, kanji drill, and casual AI conversation practice.

## Philosophy

**No gamification.** No points, streaks, XP, hearts, mascots, level-ups, badges, or reward-loop mechanics. The reward is being able to use the language. Everything in the UI reinforces that — clarity, speed, usability over engagement-hacking.

**Touch first.** Mobile-first design throughout. Every interactive element is ≥ 44px. Hover states are welcome on desktop, but nothing should be *only* discoverable or accessible via hover — every action and label must be visible without it.

**Real content only.** All Japanese content comes from JMdict/Tatoeba/KANJIDIC2 or hand-authored YAML validated at build time. Nothing fabricated.

## Stack

### Frontend
| Concern | Choice |
|---|---|
| Build / dev | Vite + React 19 + TypeScript (strict) |
| Styling | Tailwind v4 via `@tailwindcss/vite` |
| Tokens + components | `aburungo-design-system` (local package) |
| State (in-session) | Zustand |
| State (persistent, local) | IndexedDB via Dexie |
| Auth client | Supabase JS (token management only) |
| Routing | react-router v7 |
| Tests | Vitest |

### API Server
| Concern | Choice |
|---|---|
| Runtime | Node + TypeScript |
| Framework | Hono |
| Auth | Supabase JWT validation on every protected route |
| Routes | `/api/auth`, `/api/vocabulary`, `/api/kanji`, `/api/progress`, `/api/audio`, `/api/stt`, `/api/conversation` |

### Infrastructure
| Concern | Choice |
|---|---|
| Database | Supabase Postgres — vocabulary, kanji, user progress, SRS state, conversation history |
| Auth | Supabase Auth (JWT, validated server-side) |
| Storage | Pre-generated VOICEVOX audio, user assets |
| SRS algorithm | FSRS via `ts-fsrs` (server-side); Leitner (local v1, pending migration) |
| Conversation AI | Claude Haiku (`claude-haiku-4-5-20251001`), streamed |

## Design system

UI primitives, design tokens, and domain components are sourced from a separate package:

```
aburungo-design-system (file:../aburungo-design-system)
```

The app imports components directly from the package:

```tsx
import { Button, Card, Badge, PhraseCard, ProgressBar } from 'aburungo-design-system'
```

Design tokens (`@theme` block) are imported from the package CSS:

```css
@import 'aburungo-design-system/src/tokens.css';
```

See [`../aburungo-design-system`](https://github.com/petr0n/aburungo-design-system) for the full component library and Storybook.

## Folder structure

```
src/
  api/              Fetch wrappers for the Hono server (no direct Supabase calls from components)
  assets/           Static assets (hero image)
  components/       App-specific components; UI primitives re-exported from ADS
    ui/             (empty — primitives now come from aburungo-design-system)
  content/          Hand-authored YAML phrases + build-time validator
  db/               IndexedDB schema (Dexie) + review-state store
  lib/              Pure utilities: kanaData, romajiToKana, compareAnswer
  pages/            Route-level page components
    admin/          Admin dashboard pages (health, users, feedback)
  srs/              Spaced-repetition logic — pure, no React, no DB
  store/            Zustand stores (auth, session)
  types.ts          Shared domain types — single source of truth
  index.css         Tailwind config; imports ADS tokens + app-specific overrides
  App.tsx           Route definitions
  main.tsx          Entry point

server/
  src/
    routes/         Hono route handlers (thin — validate input, call service, return JSON)
    services/       Business logic (vocabulary, kanji, progress, audio, conversation)
    middleware/     JWT auth middleware
    index.ts        Server entry point
```

## Setup

### Prerequisites
- Node.js 20+, pnpm 11+
- Supabase project (or use the existing `AburunGo` project)
- `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`

### Install

```bash
pnpm install
```

pnpm resolves the `aburungo-design-system` local package automatically via the `file:` reference in `package.json`.

## Commands

```bash
pnpm dev             # frontend only (port 5173)
pnpm dev:server      # frontend + API server concurrently
pnpm build           # type-check + bundle
pnpm lint            # eslint
pnpm test            # vitest, one shot
pnpm test:watch      # vitest, watch mode
```

Server commands (from `server/`):

```bash
pnpm dev             # Hono dev server (port 3000)
pnpm build           # compile server TypeScript
```

## Layer rules

- **`src/srs/`** is pure. No React, no DB, no fetch. `now` is always a parameter.
- **`src/api/`** owns all fetch calls to the Hono server. Components never call fetch directly.
- **`src/store/`** is Zustand, in-memory only. Never duplicate server-persisted entities here.
- **`src/components/`** is presentation. Receives props, fires callbacks. No fetch, no SRS calls, no direct Supabase calls.
- **Server routes** are thin. Business logic lives in `server/services/`, not in route handlers.

## Data sources

| Data | Source | License |
|---|---|---|
| Vocabulary / phrases | JMdict for Applications v3.6.2 | CC BY 4.0 |
| Example sentences | Tatoeba TSV + `jpn_indices.csv` | CC BY 2.0 FR |
| Kanji (~2136 Joyo) | KanjiAPI.dev | CC BY-SA 4.0 |
| TTS audio | VOICEVOX (pre-generated) | Per-voice terms |
| Conversation AI | Claude Haiku via Anthropic API | Paid |

## What's not built yet

- VOICEVOX audio pre-generation pipeline
- Audio fill-in-the-blank (Web Speech API → Whisper)
- FSRS migration (DB schema is ready; frontend still uses local Leitner)
- Stats / progress screen (server endpoint exists, no UI)
