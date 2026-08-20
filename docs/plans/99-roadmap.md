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
| Grammar-in-context as first-class SRS items | done | PR #50; 39 patterns as of 2026-08-20 |
| ~~Scoped Hana~~ | **shelved (DR-023)** | built and tested, switched off; production checkpoint covers production practice instead |
| Chapters, checkpoints on a cadence | done | DR-021, DR-024 |
| Deepen Book One vocabulary | **in progress** | 423 words as of 2026-08-20, from a reference gap of 809 |
| Kanji component + mnemonic layer | **not started** | the largest remaining Book One gap |

### Finishing Book One

1. **Two more chapters** — food, then people & clothes. Lands the book near the ~100 landing zone.
2. **Kanji component + mnemonic layer.** Components from KANJIDIC2/KanjiVG, a mnemonic per kanji.
   Resolve authoring vs. licensed scheme (overarching plan §5.5). Optional handwriting via KanjiVG
   stroke order. **Build this before Book Two**, where kanji stop being learnable as flat shapes.
3. **VOICEVOX audio pipeline.** Vet voice licences, pre-generate locally via Podman, upload to
   Supabase Storage. See `admin-dashboard-plan.md` for the multi-voice strategy.

## Phase 2b — multi-book support — **not started, blocks Book Two**

The app knows exactly one book. `n5Lessons` is a hardcoded export referenced in eight places in
`LearnPage.tsx`; there is no book-to-book transition and no per-book difficulty shift.

Two pieces, both small now and much larger after a second book's content exists:

1. **Make the book a parameter**, not an import. `Book` gets an id, order, title and chapter list;
   the orchestrator takes one. The chapter helpers are already pure functions over lessons and
   chapters, so they generalise for free.
2. **The per-book difficulty shift.** Recall as the default gate, weaning off romaji,
   production-first formats — all described in the Book Two plan, none implemented. Decide whether
   it is a property of the Book, the lesson, or the learner's progress, and build it once.

See [03-path-n4.md §0](03-path-n4.md).

## Phase 3 — Book Two

Author the chapters, **rule chapters first** — plain form, joining sentences, wanting and
intending, conditionals, giving and receiving. Book One's grammar patterns cover only 39 of its 76
teaching lessons because situation chapters are word-shaped; Book Two's purpose is combining
patterns, so it should invert that ratio.

Content sourcing stays training-canonical and marked, verified headword-by-headword against JMdict.
First graded reading passages, once vocabulary is deep enough for i+1 to mean anything.

## Phase 4 — Book Three, the paid flagship

**The heaviest phase.** New builds: the Tatoeba ingestion and i+1 levelling pipeline, the levelled
reading library and reader UI, in-text mining → SRS, compose-then-compare production, and the
honest progress counters. Then the paywall — flip the `isPaid` stub when payment is wired.

**Open before authoring:** whether chapters survive as grammar/reading bands when vocabulary
arrives by mining rather than curation. See [04-path-n3.md §3](04-path-n3.md).

Content is **verified only** from here up. No training-canonical sentences.

## Phase 5 — Books Four and Five

Extend Book Three's reading, mining and production machinery with harder, broader content and
register/nuance grammar. Mostly content and levelling work, little new engine. Deliberately
unplanned in detail — see [04b-path-n2-n1.md](04b-path-n2-n1.md), including the observation that
**listening has no home anywhere in this plan.**

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
