# AburunGo

AburunGo helps English speakers feel ready to use Japanese in real life — practical phrases for the situations you actually run into (transit, restaurants, day-to-day interactions), short focused reviews, and nothing in the way.

## Philosophy

**No gamification.** No points, streaks, XP, hearts, mascots, level-ups, badges, or any reward-loop mechanics. The reward is being able to use the language. Everything in the UI should reinforce that — clarity, speed, usability over engagement-hacking.

Other anti-goals (today):

- No backend. The app runs entirely in the browser; review state lives in IndexedDB.
- No auth, accounts, or sync. Add them only when there's a concrete reason.
- No content treadmill. Phrases are hand-authored, kept small and good.

## Stack

| Concern | Choice | Why |
|---|---|---|
| Build / dev | Vite + React 19 + TypeScript | Standard, fast, no surprises. |
| Styling | Tailwind v4 (`@tailwindcss/vite`) | Utility-first, mobile-first, zero CSS file sprawl. |
| State (in-session) | Zustand | Tiny, no Provider, no Context boilerplate. |
| State (persistent) | IndexedDB via Dexie | Survives reloads, no server needed. |
| Spaced repetition | Leitner (5 boxes) | Simple, swap to FSRS later behind the same interface. |
| Content | Hand-authored YAML, validated at module load | Treats content as code, fails the build on bad data. |
| Tests | Vitest | Pure-function SRS module is fully tested. |

## Folder structure

```
src/
  components/       UI primitives — Card, AudioButton, ...
  content/          Phrase YAML and the validator that loads it
    phrases/        One file per scenario (transit.yaml, restaurant.yaml, ...)
    schema.ts       Hand-rolled validator — bad content fails the build
    index.ts        Aggregates all phrases into a typed list
  db/               IndexedDB schema + review-state store
    dexie.ts        Schema only (versioned)
    reviewStore.ts  CRUD helpers for ReviewState
  srs/              Spaced-repetition logic — pure, no React, no DB
    leitner.ts      Default scheduler
    leitner.test.ts
  store/            Zustand stores for ephemeral session state
    session.ts      Current queue + index + rating handler
  types.ts          Shared domain types — single source of truth
  App.tsx           The review loop
  main.tsx          Entry point
```

## Adding a phrase

1. Open the right scenario file under `src/content/phrases/` (or create a new one — `<scenario>.yaml`).
2. Add an entry. Every field is required except `audioUrl` and `notes`:

   ```yaml
   - id: transit.ticket-machine
     japanese: 券売機はどこですか
     reading: けんばいきはどこですか
     romaji: kenbaiki wa doko desu ka
     english: Where is the ticket machine?
     scenario: transit
     notes: Used at unstaffed stations. "Kippu uriba" is the staffed counter.
   ```
3. If you created a new file, import it from `src/content/index.ts` and push its parsed phrases into `allPhrases`.

The validator will fail `npm run build` if anything's missing or duplicated.

## Commands

```
npm run dev          # local dev server
npm run build        # type-check + bundle
npm run lint         # eslint
npm test             # vitest, one shot
npm run test:watch   # vitest, watch mode
```

## Conventions

- **SRS stays pure.** No DB or React imports in `src/srs/`. The scheduler must be deterministic and testable.
- **DB stays behind a store.** Components and the SRS never touch Dexie directly; everything goes through `src/db/reviewStore.ts`.
- **Content is validated, not trusted.** Anything coming out of YAML passes through `parsePhrases` first.
- **Touch first.** No hover-only affordances. Touch targets ≥ 44px.
- **Japanese typography.** `font-jp` for native text (Noto Sans JP with Hiragino/Yu Gothic fallbacks).

## What's intentionally not here

- Routing — there's one view (the review loop). Add `react-router` when a second view exists.
- Furigana via `<ruby>` — the current Card renders the reading as a separate line. Switching to inline ruby needs segmented authoring or a kana-aware tokenizer.
- Audio — `audioUrl` is wired through; nothing is bundled yet. Decision pending (recording vs TTS vs licensed).
- Settings / scenario picker / kana-vs-romaji toggle — coming when there's enough content to make them earn their keep.
