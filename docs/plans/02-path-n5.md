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
[ Chapters 1 … 11 ]  →  [ + people & clothes ]  →  production checkpoint  →  (Book Two prompt)
  each closing in its       the one chapter
  own recognition           still to author
  checkpoint
```

Kana is the prerequisite, not a ladder segment: hiragana/katakana practice is a standalone,
always-free bucket, and every word on the ladder carries romaji as the crutch for learners who
arrive before finishing it. There is no kana on-ramp from `/learn` today — an earlier draft drew a
"kana mini-ladder" at the head of this diagram that was never built.

**As of 2026-08-20** (including Chapter 11, landed on `feature/chapter-11-meals`, not yet merged):
93 lessons — 81 teaching, 12 checkpoints — across 11 chapters, covering 20 situations. 450 words,
207 phrases, 42 grammar patterns, 181 kanji.

Pacing runs 5.6 words, 2.6 phrases and 2.2 kanji per teaching lesson. That is the honest rate at
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
| 11 | Meals & the kitchen | situation |

Chapter length varies from 4 to 13 teaching lessons **on purpose**. Padding a chapter to a round
number would put a checkpoint mid-situation, which is exactly what DR-021 exists to prevent.

**Two chapter shapes have emerged.** A *situation* chapter is organised around a place or a task
and teaches the words it needs. A *rule* chapter is organised around a piece of grammar and teaches
verbs that exercise it. Rule chapters pay a retroactive debt: the te-form chapter explained ten
〜てください phrases the ladder had been carrying as memorised lumps, and the past-tense chapter did
the same for five ました sentences. **Grammar is the binding constraint on this book, not
vocabulary** — words and Tatoeba sentences are both oversupplied, grammar patterns exist in no
dataset and must be authored. Only 42 of 81 teaching lessons carry a pattern. Two things move that
number: alternating rule chapters into the sequence, and letting small rules ride on situation
chapters — Chapter 11 carries three (verb-stem + 物, the 〜杯 counter, あまり〜ないです) inside an
otherwise word-shaped chapter.

Rule chapters also pay forward: Chapter 11 sits after the past tense on purpose, so its opening
question — did you eat breakfast? — is the first ordinary question a learner can both understand
and take apart. That is the i+1 discipline in placement terms: a new chapter's sentences should be
one new thing on top of taught ground, and sequencing is how that is engineered.

### Sizing against the ~10 × ~10 shape

The endorsed target is ~10 chapters of ~10 lessons — ~100 teaching lessons per book. Where this
book actually lands: **11 chapters shipped, 12 planned; 81 teaching lessons shipped, ~86 after
people & clothes (~99 lessons total with checkpoints).** Chapters run over the target count while
lessons-per-chapter run under it — the average is ~7 teaching lessons, and the chapters authored
since the cadence landed (6 through 11) run 4–5. The two errors roughly cancel: the finished book
lands within ~15% of ~100 teaching lessons.

That is the landing zone working as intended, not a miss to repair. Stretching chapters toward ten
lessons would mean padding situations, which DR-021 forbids; cutting chapters to hit ten would
merge unrelated situations. If the remaining teaching-lesson gap ever needs closing, the honest
mechanism is **more chapters drawn from the coverage queue (§8)**, not longer ones.

### Can-do moments — derived, not declared

An earlier draft of this doc declared 19 fixed can-dos. **That list is gone** (DR-022). The can-do
set is now **the distinct situations of the lessons the learner has actually seen** — 20 today —
computed by `taughtSituations` in `src/srs/canDo.ts`, so it grows with the content instead of
going stale: the same computed-not-declared property DR-021 adopted for checkpoint positions.
Separately, every teaching lesson carries its own one-line can-do ("Order a drink") shown on the
lesson — 81 lines, 73 distinct, because adjacent lessons in one scene legitimately share one. The
per-lesson line is presentation; the situation set is the model.

## 3. What a lesson contains

- **~6 words**, each with reading, romaji and a note on the trap it hides
- **~2 kanji**, introduced on the lesson rather than in a silo
- **a grammar pattern** on about half of them, taught through one sentence with a blank in it
- **~3 phrases** that use the lesson's words
- **a grammar note** — plain English, no jargon, explaining why the Japanese is shaped that way

Lessons are grouped into **situations** so the ladder feels like real-life Japanese, honouring the
brand — the situation is the wrapper, the book is the spine.

## 4. The daily session

Review → new lesson → produce → recognition pass → close. Onboarding preferences (`intensity`,
`session_length`) are designed to shape session size but are **not built** — today the session
serves the full due set plus the next lesson (see [05-retention-engine.md](05-retention-engine.md)).

1. **Review:** interleaved due items. Empty on the first session, grows as the SRS fills. Reviews
   resurface as flashcards today (cloze for grammar patterns); per-item format rotation is
   designed, not built ([05 sync #3](05-retention-engine.md)).
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

Eleven recognition checkpoints and one production checkpoint exist today — one per chapter plus
the close. This recognition-heavy split is the right emphasis for a first book: recognition is
the cheap, high-frequency rep that builds the store, and production is deferred to one gate at
the end rather than sprinkled where it would stall week-one learners. Book Two inverts the
emphasis; this one should not.

Both are **mastery gates, never grades**: the remaining set shrinks to zero as you work, retries
are unlimited, nothing is recorded, and misses rejoin the SRS queue rather than being tallied.
"3 more to place" is fine; "62%" is not.

## 6. Kanji

181 kanji introduced on the lessons that need them, with the component/mnemonic layer still to be
built (`docs/plans/99-roadmap.md`). Stroke order via KanjiVG is bundled. The component method
matters most from Book Two on, where kanji stop being learnable as flat shapes — installing it at
Book One is an investment that pays out later.

Note the count honestly: 181 is well past the ~100 kanji a typical N5 reference lists. That is a
deliberate consequence of introducing kanji where the lesson needs them (料 and 理 arrive with
料理, not in a silo) rather than a scope error — but it raises the stakes on the mnemonic layer,
because the book is already asking for more raw shapes than the flat-memorisation method
comfortably carries.

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

The N5 community reference lists 809 words. Book One teaches 450 words covering 436 of that list,
leaving 373 of it missing — 231 of those attested by both reference lists and flagged common in
JMdict, which is the queue worth authoring against. 56 taught words are ones the book needs and
the list does not have (何曜日, またね, お願いします — compounds and set phrases a situation
demands), which is the normal direction of that disagreement. `node scripts/jlpt.mjs coverage n5`
regenerates the gap file.

The reference lists are **gap-finders, never authorities**: no official JLPT vocabulary list has
existed since 2010, and taking a headword straight from one has already shipped a wrong form once
(終る, which JMdict does not flag common; 終わる is the real word). Verify every headword against
JMdict before it goes in.

The food cluster — the largest hole in the gap list — shipped as Chapter 11 (DR-032). The one
remaining cluster planned for the finish is **people & clothes**. Be honest about what that
closes: a chapter is ~27 words, so the book will finish with roughly 350 reference words untaught,
~200 of them common. Either that remainder is Book Two's opening inventory and review fodder — the
defensible reading, since 450 situation-anchored words beat 800 list-marched ones for a first book
— or it demands more chapters than the current plan holds (see the sizing note in §2). That is an
owner call, not a drift to paper over.

## 9. Free/paid

Entirely free. Guests get a lot; a free account adds cross-device progress sync. Book Two is also
free; the first paywall is Book Three. A learner experiences the full method for weeks before being
asked to pay.

## 10. What is still missing

- **Merging Chapter 11** — landed on `feature/chapter-11-meals` (DR-032), not yet on `main`
- **The people & clothes chapter** — the last planned chapter; closes the book at ~12 chapters
- **Kanji component + mnemonic layer** — kanji are introduced but not decomposed, and at 181
  shapes the flat method is already past its comfortable ceiling (§6)
- **Graded reading** — no assembled passages yet
- **Audio** — VOICEVOX pipeline not built; items are not yet playable
- **~373 words** of the reference gap (§8 — an owner call on whether Book One or Book Two owns
  it), and grammar patterns on the 39 of 81 teaching lessons that carry none — reference N5
  grammar inventories run 50–80 patterns depending on how they count; 42 shipped
