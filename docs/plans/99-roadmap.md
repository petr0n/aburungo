# Learning Paths — Build Roadmap

Sequenced so each phase ships something usable and de-risks the next.

Guiding rule: **reuse, don't rebuild.** FSRS, the buckets, audio, progress, tiers and furigana
already exist. Each phase adds *connective tissue*, not new silos.

Naming follows DR-024 — **Book → Chapter → Lesson**. Phases below were originally written against
JLPT level names; Book One is N5, Book Two is N4, and so on.

---

## Phase 1 — the guided daily loop — **DONE**

A learner opens the app, taps **Today's session**, and gets one orchestrated loop built from
existing content. Shipped: the lesson data model, the daily-loop orchestrator, `/learn`, the
Recognize→Recall→Produce gating, and the honest close screen.

## Phase 2 — depth first — **mostly done**

**Goal:** make the teaching inside a lesson excellent before extending the ladder upward.
Resequenced 2026-08-04 (DR-017).

| | | |
|---|---|---|
| Server-durable learning state (DR-016) | done | IndexedDB alone could not survive Safari's ITP |
| Grammar-in-context as first-class SRS items | done | PR #50; 42 patterns |
| ~~Scoped Hana~~ | **shelved (DR-023)** | built and tested, switched off; production checkpoint covers production practice instead |
| Chapters, checkpoints on a cadence | done | DR-021, DR-024 |
| Deepen Book One vocabulary | **in progress** | 451 words as of 2026-08-21, from a reference gap of 809 |
| Kanji component + mnemonic layer | **not started** | the largest remaining Book One gap |

### Finishing Book One

1. **One more chapter** — people & clothes (food shipped as Chapter 11). Lands the book
   near the ~100 landing zone.
2. **Kanji component + mnemonic layer.** Components from KANJIDIC2/KanjiVG, a mnemonic per kanji.
   Resolve authoring vs. licensed scheme (overarching plan §5.5). Optional handwriting via KanjiVG
   stroke order. **Build this before Book Two**, where kanji stop being learnable as flat shapes.
3. **VOICEVOX audio pipeline.** Vet voice licences, pre-generate locally via Podman, upload to
   Supabase Storage. See `admin-dashboard-plan.md` for the multi-voice strategy.

## Phase 2b — multi-book support — **mostly done** (PR #90)

1. **Make the book a parameter** — **done.** `Book` carries id, order, title, chapters and
   lessons; `bookOne` lives in `src/content/books.ts` and the orchestrator takes a book rather
   than importing `n5Lessons`. Review eligibility spans prior books while new material stays
   scoped to the current one, so Book One's items keep surfacing once Book Two opens.
2. **The per-book difficulty shift** — **two of three built**, as a `Book` field. Recall as the
   default review gate and the romaji display cut both work (provable against Book One via a
   dev-only `?shift=1`). The production-first produce beat does **not** ship: frame-based
   composition needs frames and their model sentences as *authored content* (03 §8), and an
   attempt to derive them at runtime both broke on kana word boundaries and synthesised
   unverified Japanese. It lands with Book Two's content, not with the field.

See [03-path-n4.md §0](03-path-n4.md).

## Phase 3 — Book Two

Author the chapters, **rule chapters first** — plain form, giving and receiving, joining
sentences, wanting and intending, being able to, quoted speech, conditionals, per the
dependency-ordered skeleton in [03 §4](03-path-n4.md). Book One's grammar patterns cover only 42
of its 81 teaching lessons (with Chapter 11) because situation chapters are word-shaped; Book
Two's purpose is combining patterns, so it should invert that ratio.

Content sourcing stays training-canonical and marked, verified headword-by-headword against JMdict.
First graded reading passages, once vocabulary is deep enough for i+1 to mean anything.

## Phase 4 — Book Three, the paid flagship

**The heaviest phase.** New builds: the Tatoeba ingestion and i+1 levelling pipeline, the levelled
reading library and reader UI, in-text mining → SRS, compose-then-compare production, and the
honest progress counters. Then the paywall — flip the `isPaid` stub when payment is wired.

**Decided (2026-08-20):** chapters survive as grammar/reading **bands** ([04 §3](04-path-n3.md)).
Still open before authoring: the reading-library **text source** ([04 §5](04-path-n3.md)).

Content is **verified only** from here up. No training-canonical sentences.

## Phase 5 — Books Four and Five

Extend Book Three's reading, mining and production machinery with harder, broader content and
register/nuance grammar. Mostly content and levelling work, little new engine. Planned to band
level only — see [04b-path-n2-n1.md](04b-path-n2-n1.md). Listening now has a **floor** inside the
books (library passages with pre-generated audio — [04 §5](04-path-n3.md), [04b §6](04b-path-n2-n1.md));
unscripted real-speech listening remains the named ceiling.

---

## Cross-cutting, anytime

- **Full FSRS source-of-truth for signed-in users.** Local Leitner still co-drives the queue and
  new-card detection is local (DR-015). Add a server endpoint returning the reviewed/new card set,
  then drop local Leitner for signed-in users. Guests stay local.
- **Admin Phase 3** — feature flags, announcements, rate-limiting dashboard.
- **Audio fill-in-the-blank** — Web Speech API for input, Whisper upgrade path. Warn before
  shipping anything that triggers a microphone permission prompt.
- **Apple Sign-In** — when the developer account exists.
- **Mobile app** — React Native or PWA with offline support.
- **Content QA** — levelling and mnemonic quality both need review passes.

---

## What this does *not* change

The existing buckets and their standalone pages stay exactly as they are — the paths sit *on top*.
A learner who just wants to drill flashcards or browse kanji still can. The path is the guided
default, not a cage.
