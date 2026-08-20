# Book One — the foundation

**Tier:** Guest + Free (fully playable without paying).
**Status: built and shipping.** This doc is a record of what Book One *is*, not a plan for what it
might be. The authority on its contents is [docs/book-one-ladder.md](../book-one-ladder.md), which
is generated from `src/content/` by `pnpm ladder` and fails a test when stale. Numbers below carry
a date because they move; the generated ladder never lies.

**Goal:** the learner reads kana fluently, handles the situations a visitor actually meets, and
comes out with the vocabulary, kanji and grammar foundation a reference would call JLPT N5.
This book's job is to **prove the method and build the habit** — most drop-off happens in week one.

Book One is the **template**. Books Two and up describe how the engine's *emphasis* shifts, not a
new engine.

---

## 1. Naming (DR-024)

**Book → Chapter → Lesson.** A Book is what a reference calls a JLPT level; Book One is N5 and a
learner never reads "N5". A Chapter is a named run of lessons ending in exactly one checkpoint,
which is its last lesson. "Unit" and "sweep" are dead words — do not reintroduce either.

The `jlpt` field stays in the data because the coverage tooling depends on it. It is plumbing,
not a label.

## 2. Shape of the book

```
[ Kana mini-ladder ]  →  [ Chapters 1 … 10 ]  →  production checkpoint  →  (Book Two prompt)
   hiragana, katakana       each closing in its
   (always free, never       own recognition
    gated, pre-JLPT)         checkpoint
```

**As of 2026-08-20:** 87 lessons — 76 teaching, 11 checkpoints — across 10 chapters, covering 19
situations. 423 words, 191 phrases, 39 grammar patterns, 163 kanji.

Pacing runs 5.7 words, 2.5 phrases and 2.3 kanji per teaching lesson. That is the honest rate at
which a lesson can teach without becoming a list, and it is measured from the content rather than
declared in advance.

### Chapters

| # | Chapter | Shape |
|---|---|---|
| 1 | Greetings & ordering | situation |
| 2 | Shopping & getting around | situation |
| 3 | Staying & finding your way | situation |
| 4 | People, days & routines | situation |
| 5 | Home, work & study | situation |
| 6 | Asking someone to do something | **rule** — the te-form |
| 7 | Choosing and counting | situation |
| 8 | Describing things and people | situation |
| 9 | Around town | situation |
| 10 | Talking about yesterday | **rule** — the past tense |

Chapter length varies from 4 to 13 teaching lessons **on purpose**. Padding a chapter to a round
number would put a checkpoint mid-situation, which is exactly what DR-021 exists to prevent.

**Two chapter shapes have emerged.** A *situation* chapter is organised around a place or a task
and teaches the words it needs. A *rule* chapter is organised around a piece of grammar and teaches
verbs that exercise it. Rule chapters pay a retroactive debt: the te-form chapter explained ten
〜てください phrases the ladder had been carrying as memorised lumps, and the past-tense chapter did
the same for five ました sentences. **Grammar is the binding constraint on this book, not
vocabulary** — words and Tatoeba sentences are both oversupplied, grammar patterns exist in no
dataset and must be authored. Only 39 of 76 teaching lessons carry a pattern; alternating rule
chapters into the sequence is how that number moves.

### Can-do moments — derived, not declared

An earlier draft of this doc declared 19 fixed can-dos. **That list is gone** (DR-022). The can-do
set is now the distinct situations of the lessons the learner has actually seen, so it grows with
the content instead of going stale — the same computed-not-declared property DR-021 adopted for
checkpoint positions. 76 distinct can-do lines exist today because there are 76 teaching lessons.

## 3. What a lesson contains

- **~6 words**, each with reading, romaji and a note on the trap it hides
- **~2 kanji**, introduced on the lesson rather than in a silo
- **a grammar pattern** on about half of them, taught through one sentence with a blank in it
- **~3 phrases** that use the lesson's words
- **a grammar note** — plain English, no jargon, explaining why the Japanese is shaped that way

Lessons are grouped into **situations** so the ladder feels like real-life Japanese, honouring the
brand — the situation is the wrapper, the book is the spine.

## 4. The daily session

Review → new lesson → produce → recognition pass → close. Session length and item count follow
the learner's `intensity` and `session_length` preferences from onboarding.

1. **Review:** interleaved due items. Empty on the first session, grows as the SRS fills. Format
   rotates per item — never the same format twice running for the same item.
2. **New lesson:** the words with audio and reading, the kanji, the pattern with a worked example,
   then the phrases that combine them.
3. **Produce:** type the phrase, forgiving and short.
4. **Recognition pass:** see English, tap the matching Japanese tile. Not a quiz — no right/wrong
   theatre.
5. **Close:** what was learned, and where the learner sits in the chapter. No score, no XP, no
   streak.

## 5. Checkpoints (DR-021, DR-020, DR-023)

Two kinds, and they are **not** the same thing:

**Recognition checkpoints** close each chapter. They consolidate: a wide pass over everything the
book has taught so far, recurring. Roughly every ten lessons, placed at the next *situation
boundary* — never mid-situation, since a checkpoint between "at the café" and "how much & paying"
consolidates nothing.

**The production checkpoint** closes the book, once. Everything before it asks the learner to
recognise Japanese; this asks them to produce it, from English, drawn across every situation.

Both are **mastery gates, never grades**: the remaining set shrinks to zero as you work, retries
are unlimited, nothing is recorded, and misses rejoin the SRS queue rather than being tallied.
"3 more to place" is fine; "62%" is not.

## 6. Kanji

163 kanji introduced on the lessons that need them, with the component/mnemonic layer still to be
built (`docs/plans/99-roadmap.md`). Stroke order via KanjiVG is bundled. The component method
matters most from Book Two on, where kanji stop being learnable as flat shapes — installing it at
Book One is an investment that pays out later.

## 7. Production practice without Hana (DR-023)

An earlier draft routed every output beat through Hana, a scoped AI conversation. **Hana is built,
tested, and switched off** behind `VITE_HANA_ENABLED`, which defaults to off: the owner does not
want a per-use API cost in an otherwise fixed-cost tool.

The replacement is the **production checkpoint** — write each item from its English, no API
involved. This is not a downgrade dressed up as a decision: production practice was the point, and
typing from meaning tests recall harder than a conversation the learner can steer around what they
do not know.

Do not plan new work that depends on Hana without asking.

## 8. Content coverage

The N5 community reference lists 809 words. Book One teaches 423 words, 409 of which are on that
list, leaving 400 of it missing — 257 of those attested by both reference lists and flagged common
in JMdict, which is the queue worth authoring against. The other 14 are words the book needs and
the list does not have, which is the normal direction of that disagreement. `node scripts/jlpt.mjs coverage n5` regenerates the gap file.

The reference lists are **gap-finders, never authorities**: no official JLPT vocabulary list has
existed since 2010, and taking a headword straight from one has already shipped a wrong form once
(終る, which JMdict does not flag common; 終わる is the real word). Verify every headword against
JMdict before it goes in.

Remaining clusters for the finish: food, people & clothes. Either makes a clean chapter and lands
the book near the endorsed ~100 landing zone — which is a landing zone, not a quota.

## 9. Free/paid

Entirely free. Guests get a lot; a free account adds cross-device progress sync. Book Two is also
free; the first paywall is Book Three. A learner experiences the full method for weeks before being
asked to pay.

## 10. What is still missing

- **Kanji component + mnemonic layer** — kanji are introduced but not decomposed
- **Graded reading** — no assembled passages yet
- **Audio** — VOICEVOX pipeline not built; items are not yet playable
- **~400 words** of the reference gap, and grammar patterns on the other half of the lessons
