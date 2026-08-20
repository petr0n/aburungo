# Book Three — the flagship ("the wall")

**Tier:** Paid — the first paywall. **Status: not started.** Depends on Book Two, and on a content
pipeline that does not exist yet.

**Goal:** carry the learner over **the intermediate wall**, the level where most learners stall and
quit, to where they can **read real Japanese for pleasure and hold a genuine conversation**.

Book Three is where AburunGo earns its money and its reputation. Beginners have many good free
options; **almost nothing gets people *through* the intermediate stretch well.** The whole design
targets the two things that kill intermediate learners: **the plateau** (progress feels invisible)
and **the input cliff** (real Japanese is suddenly too hard).

---

## 1. Why this book is different

- **The plateau is psychological.** In Books One and Two every session unlocks an obvious new
  ability. Here the gains are diffuse — broader vocabulary, faster reading — and *feel* like
  nothing. The book must **manufacture visible progress out of honest signals**, which is a
  narrow path to walk given the no-gamification rule: counters that reflect real ability, never
  points that reward showing up.
- **The input cliff is real.** Native material is far above i+1 at this level. The book must supply
  a **ladder of graded reading** bridging textbook Japanese to real Japanese.
- **Output must dominate.** Comprehension is no longer the bottleneck — production is.

## 2. What changes from Book Two

| Dimension | Book Two | **Book Three** |
|---|---|---|
| Session balance | review + new + small output | **reading- and output-dominant**; new vocabulary via mining |
| Vocabulary | curated chapter lists | **sentence mining** — the learner takes unknown words from readings into SRS |
| Reading | short graded passages | **extensive reading** — a levelled library, volume over analysis |
| Grammar | patterns, combined | **connective and discourse** grammar in real text |
| Content source | training-canonical (marked) | **verified only** — Tatoeba/CC BY pipeline |
| Output grading | pattern-composition checkpoint | **structured self-review** against a model answer |

**Scope, data-side (a learner never sees these numbers):** a reference would call this level JLPT
N3 — roughly **3,700 cumulative words** (~2,200 new past Book Two's ~1,500), **~650 cumulative
kanji** (~350 new), and the **connective and discourse grammar** that turns sentences into text,
a set commonly put near **100 patterns**. The word figure is a coverage reference for levelling
the library, never a syllabus — mining decides the learner's actual set. Grammar and kanji stay
curated: patterns exist in no dataset and must be authored (the binding constraint Book One
measured), and ~350 new kanji is a heavier per-lesson rate than Book One's measured 2.3 — tractable
only with the component layer built underneath it first.

## 3. Does the chapter structure survive?

**Decided (owner sign-off, 2026-08-20): yes — chapters survive as grammar and reading-level
bands, not situations.**

Chapters exist to bound a run of lessons and place a checkpoint at a boundary (DR-021). Book
Three's vocabulary is too broad to pre-curate and arrives by mining, so "the lessons in this
chapter" can no longer be a word list. But the connective grammar set is finite and must be
authored anyway, which makes it the natural spine:

- **A chapter is a band:** ~10 connective patterns plus the slice of the library that exercises
  them. A lesson teaches one pattern through verified sentences, then sends the learner into
  readings at that band.
- **The checkpoint stays a shrinking-set gate** (DR-020): the band's patterns in production
  formats, plus one honest test no earlier book could offer — **a gate text the learner could not
  have read at the start of the chapter**, now readable. Band boundaries are this book's situation
  boundaries; DR-021's cadence maps onto them unchanged. The book still closes with one production
  checkpoint — consolidation recurring, completion once.
- **Can-dos keep the computed-not-declared property** (DR-022), rederived for a reading book: from
  passages actually read and patterns actually produced, not from situations, which this book no
  longer has.

**Does the ~10 chapters × ~10 lessons shape hold?** For grammar, yes — ~100 connective patterns is
10 bands of ~10 single-pattern lessons, and the shape falls out rather than being imposed. For
vocabulary it cannot and must not: ~2,200 new words over ~100 lessons would be ~22 words per
lesson, four times the honest teaching rate Book One measured (5.7). **Mining is what makes the
10×10 shape possible at all** — lessons carry patterns, the library carries words, and lesson
count decouples from word count. If the shape breaks anywhere it will be band granularity (a
chapter whose patterns are learned before its texts feel comfortable); let the levelling
pipeline's behaviour on real text decide that, not this doc.

With the band model locked, the one remaining pre-authoring blocker is the text source (§5).

## 4. The daily loop

1. **Review (interleaved, cumulative):** a large, well-mixed retrieval set — the consolidation
   engine. Production formats by default.
2. **Read:** a short passage from the levelled library at **~98% known** (see §5). The goal is
   *flow*, not dissection. This is the comprehensible-input core.
3. **Mine:** while reading, a tap only **marks** an unknown — no definition mid-flow, so the read
   stays a read. After the passage, the marked sentences return with definitions and the learner
   keeps 1–3; each enters SRS **in its original sentence**, the research-backed "one unknown per
   sentence" atom. The budget is per passage, not per day — another passage is always there.
4. **Produce:** compose-then-compare against a verified sentence, or free writing about the
   reading with self-review — never graded, never a generated model answer (see §7).
5. **Close:** progress as **lines read, words mined and now recalled, passages now comprehensible**
   — concrete counters that move daily even when "level" does not.

## 5. Extensive reading — the flagship feature

A **levelled reading library** is the heart of this book and its clearest differentiator. The
Tadoku principles: many easy texts beat few hard ones; no dictionary mid-read; volume builds
fluency and motivation. **The flow target is ~98% known**, not the often-quoted 95% — the research
(Hu & Nation) puts unassisted comprehension at ~98% coverage, and 95% sounds generous but is one
unknown word in twenty, roughly one per two lines, which is dissection, not flow. At ~98% a
150-word passage carries 2–3 unknowns — exactly the mining budget, so one number serves both flow
and mining. Each text is tagged by the items and grammar it uses, so the library serves what the
learner's **actual SRS state** says they are ~98% ready for.

**The "you can read this now" moment** belongs here: periodically resurface a text that was too
hard weeks ago and let the learner feel it click. That is a true motivator built from a real
signal, which is the only kind this product allows.

**Where do coherent texts come from?** This must be answered honestly: Tatoeba is
sentence-grained, and a shelf of isolated sentences is not extensive reading — Tadoku is about
*texts*, narrative continuity included. The free Tadoku graded readers are CC BY-NC-ND, unusable
in a paid product. Realistic sources, best first: **(a)** license a graded-reader corpus — a paid
book can pay for content; **(b)** public-domain Aozora Bunko folk and children's tales, levelled
by the same pipeline, for the upper bands; **(c)** thematically clustered sentence sequences as a
stopgap "micro-reading" — weaker, and the UI should not dress it up as a story. The sentence
corpus still earns its keep regardless: it feeds mining, levelling, and compose-then-compare.
This is a pre-authoring decision alongside §3.

Once the VOICEVOX pipeline exists, every passage is verified text with pre-generated audio, so the
library doubles as a **listening** library — listen-while-reading, then listen-first — at near-zero
marginal cost. That is the first honest home listening has anywhere in this plan.

## 6. Sentence mining

Vocabulary acquisition shifts from curated lists to **learner-driven mining**: tap an unknown word,
it enters SRS with its sentence, and recurs in review. This scales past any hand-authored list and
keeps every item in context. It also restores **agency** — choosing what to learn is what
intermediate learners want and what a fixed list denies them.

## 7. Production without Hana (DR-023)

The previous version of this doc made Hana the output engine: open conversation, discussion of
readings, structured correction after each exchange, conversation minutes as a headline counter.
**All of that is blocked.** Hana is shelved behind `VITE_HANA_ENABLED` and this book cannot be
planned on the assumption that decision reverses.

That leaves a real hole, and it should be named rather than papered over: **conversation practice
has no offline substitute.** Reading, mining, and written production all work without an API.
Spoken back-and-forth does not. What *does* work offline for the mouth is **read-aloud and
shadowing** over the library's pre-generated audio — real spoken-production practice at zero
marginal cost. It builds fluency and pronunciation, not interaction; the hole is interaction.

The workable replacement for *written* output is **compose-then-compare**, and its model answers
must obey the content rule: they are **verified sentences selected from the corpus**, never
composed — the app cannot generate Japanese, so it cannot generate a model answer either. The
honest shape: show the English of a Tatoeba sentence drawn from the learner's known items, the
learner writes the Japanese, then compares against the real sentence and marks their own.
Free-form writing about a passage can sit alongside, but it gets self-review prompts only, no
model answer. No API, no grading, and it exercises production honestly. It is not conversation,
and this doc should not pretend it is.

**If the paid tier ever needs conversation to justify its price, that is the moment to revisit
DR-023** — with a cost model, not a wish. A paid tier changes the economics that shelved Hana in
the first place, and this is the one place in the plan where that argument is worth making.

## 8. Content source — the line where verified starts

Book Three is where content must be **verified**. Before it ships, stand up the **Tatoeba (CC BY)
ingestion and i+1 levelling pipeline**: filter sentences by known-item coverage, tag by grammar
and kanji, and assemble the **mining corpus and the compose-then-compare pool** from real,
attributed sentences. Coherent library *texts* come from the §5 text-source decision — the
pipeline levels them, it cannot conjure them.

**No training-canonical sentences at Book Three and above, and no generated sentences ever
stored.** The N5 exemption exists because N5 vocabulary is canonical and well documented; that
argument does not extend upward.

The sentence raw material already exists locally — Tatoeba examples are embedded in
`server/data/jmdict-examples-eng-3.6.2.json` with source ids (gitignored, not in the repo;
`scripts/jlpt.mjs` errors helpfully when it is absent). What is missing is the levelling pipeline,
not the sentences.

## 9. Retention design — the core of this book

- **Manufacture visible progress from honest signals.** Counters that move daily: lines read, words
  mined and now recalled, share of a target text now comprehensible. Real ability, never points.
- **Mining is agency.** Personally relevant material beats a forced list at exactly the level where
  motivation fails.
- **Output as proof.** "I wrote a paragraph about what I read" is a concrete identity win that
  recognition cannot supply.
- **Schedule the "you can read this now" moment (§5); do not leave it to chance.** It is the
  single strongest honest signal this book has against the plateau — the orchestrator should
  resurface a formerly-too-hard text on a cadence, roughly whenever the SRS state says one has
  newly crossed the ~98% line.
- **Calm, never punishing.** At the wall especially, re-engagement is informational: "3 readings
  waiting when you're ready", not guilt.

## 10. Pricing rationale

This is where the value is highest and the alternatives weakest, so it is the right first paywall.
The learner arrives having used the full method free through Book Two — they are paying to get
*over the wall*, which is when motivation and willingness to pay peak.

Enforcement is still aspirational: `isPaid` is stubbed false until payment is wired, and the `tier`
field in user metadata holds the slot. Gated content shows a **soft inline prompt, never a
redirect**, and it appears where Book Three would begin — at the close of Book Two and on Book
Three's door — described in terms of what the book *does* (read real Japanese, mine your own
vocabulary), never in terms of what is locked. **Everything the learner built stays theirs:** SRS
state, progress, and both free books remain fully usable whether or not they ever pay.

## 11. Build notes

**The heaviest phase.** New builds: the levelled reading library and reader UI, the Tatoeba
ingestion and levelling pipeline, in-text mining → SRS, compose-then-compare, and the honest
progress counters — then the paywall wiring when payment lands. Everything below it is reused.

Open before authoring: the text source (§5). The band model (§3) was signed off 2026-08-20.
