# Learning Paths — Build Roadmap

Sequenced so each phase ships something usable and de-risks the next. **Decision (Q4): start with
the N5 guided daily loop on existing content** — prove the engine cheaply on the free tier before
building the N3 content pipeline.

Guiding rule: **reuse, don't rebuild.** FSRS, the buckets, audio, Hana, progress, tiers, and
furigana all already exist. Each phase adds the *connective tissue*, not new silos.

---

## Already built (start line for Phase 1)

These exist in the app today and do not need to be built:

- **WordsPage** (`src/pages/WordsPage.tsx`) — browse, learn, drill, and recognition flow for vocabulary; tier-gated content; theme grouping
- **RecognitionPass** (`src/components/RecognitionPass.tsx`) — tile-tap recognition screen (3 options, no judgment); queue + pool props; already wired into WordsPage
- **Basics theme vocabulary** (`src/content/vocabulary/basics.yaml`) — 10 kana-only N5 words (pronouns + demonstratives) with theme field; establishes the YAML schema all vocabulary follows
- **74 N5 words total** across `basics.yaml`, `adjectives.yaml`, `verbs.yaml`, `nouns.yaml` — ~117 more needed to complete the N5 unit map

Phase 1 picks up from here. The loop orchestrator, unit data model, and session UI are what remain.

---

## Phase 1 — N5 guided daily loop (MVP)

**Goal:** a learner opens the app, taps **Today's session**, and gets one orchestrated N5 loop
(review → new unit → integrate → produce → close) built entirely from content we already have.
Validates the core "path" experience and the Recognize→Recall→Produce idea.

**Build:**
1. **Data model** (`src/types.ts` + content): `Path`, `Unit`, and per-user `PathProgress`. A Unit
   references existing item ids (word ids, kanji, phrase ids) — it's an ordering layer, not new
   content. Author N5 units by grouping the existing N5 words/kanji/phrases into ~35 ordered units
   wrapped in the existing situations.
2. **Daily-loop orchestrator** (`src/store/` + `src/srs/`): given PathProgress + FSRS due state,
   assemble today's session = interleaved due review + next unit's new items + an integrate step
   (cloze over today's items) + one produce beat. Pure/where possible; `now` passed in.
3. **"Today's session" UI** (new page/route, e.g. `/learn`): the single guided flow with the
   free-roam escape hatch (links into existing buckets remain).
4. **Recognize→Recall→Produce gating:** reuse existing flashcard (recognize), fill-in-blank/type
   (recall), and a minimal produce beat (type-the-phrase) — Hana scoping can be a fast-follow.
5. **Honest close screen:** "learned today / due tomorrow / mastered" from existing progress stats.
   No XP/streak mechanics.

**Reuse:** FSRS, words/kana/phrases content, flashcard + fill-in-blank components, progress store,
furigana, audio.

**Decision records to add** (`docs/decision-records.md`): DR for the Path/Unit data model; DR for
the daily-loop orchestration + interleaving policy.

**Done when:** a guest can complete several consecutive N5 daily sessions that feel like one coherent
path, with reviews interleaving correctly and visible mastery.

---

## Phase 2 — Kanji mnemonics + grammar-in-context (depth, and N4)

**Goal:** make the *teaching* inside a unit excellent, and extend the ladder to N4.

**Build:**
- **Kanji component + mnemonic layer:** components from KANJIDIC2/KanjiVG; mnemonic per kanji
  (resolve authoring vs. licensed scheme — overarching plan open decision §5.5). Optional handwriting
  via KanjiVG stroke order.
- **Grammar-in-context:** grammar patterns as first-class content + SRS items, taught via a verified
  or marked example sentence; cloze/conjugation review format. Add FSRS support for pattern items.
- **N4 ladder:** author N4 units; turn on the production-default gating and weaning off romaji.
- **Scoped Hana (N5/N4):** launch a conversation constrained to a unit's items + JLPT level for the
  produce beat.

**Content source:** training-canonical, marked `content-source: training` (per Q3).

---

## Phase 3 — N3 paid flagship (the differentiator)

**Goal:** the extensive-reading + mining + real-conversation machine that gets people over the wall.
This is the heaviest phase and the paid value prop.

**Build:**
- **Tatoeba ingestion + i+1 leveling pipeline** (server/seed): import CC BY sentences, tag by
  item/grammar coverage, level by known-item %. Source of the graded library + mining corpus.
- **Graded reading library + reader UI:** serve a learner texts at ~95% known from their SRS state;
  read-for-flow UX.
- **In-text sentence mining → SRS:** tap an unknown item, store it with its sentence, schedule it.
- **Hana structured feedback mode:** open conversation + post-exchange "one thing to tighten."
- **Honest progress counters:** lines read, words mined→mastered, conversation minutes.
- **Paywall:** N3 entry behind the existing tier/`isPaid` slot (soft prompt, preserved progress).

**Content source:** verified only (Tatoeba). No training-canonical sentences at N3+.

---

## Phase 4 — N2 / N1 extension

Extend the Phase 3 reading + mining + conversation machinery with harder, broader content and
discourse/nuance grammar. Mostly content + leveling work, little new engine. Outline once N3 is
validated with real users.

---

## Cross-cutting, anytime

- **Telemetry for retention** (privacy-respecting): are people completing daily sessions? where do
  they drop? Feeds the honest-progress design.
- **Content QA:** the Tatoeba leveling and mnemonic quality both need review passes.

---

## What this does *not* change

The existing buckets and their standalone pages stay exactly as they are — the paths sit *on top*.
A learner who just wants to drill flashcards or browse kanji still can; the path is the guided
default, not a cage.
