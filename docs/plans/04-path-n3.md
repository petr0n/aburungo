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

## 3. Does the chapter structure survive?

**Partly, and this needs deciding before authoring.** Chapters exist to bound a run of lessons and
place a checkpoint at a situation boundary. Book Three's vocabulary is too broad to pre-curate and
comes largely from mining, so "the lessons in this chapter" stops being the unit of progress.

The likely answer: chapters survive as **grammar and reading-level bands** rather than situations —
a chapter is a set of connective patterns plus the reading level that exercises them, and its
checkpoint asks the learner to read something they could not read at the start of it. That keeps
the shrinking-set mastery gate intact while letting vocabulary arrive by mining.

This is the single biggest open question in this doc. Do not author Book Three content until it is
answered, or the content will be shaped for a structure that turns out wrong.

## 4. The daily loop

1. **Review (interleaved, cumulative):** a large, well-mixed retrieval set — the consolidation
   engine. Production formats by default.
2. **Read:** a short passage from the levelled library at ~95% known. The goal is *flow*, not
   dissection. This is the comprehensible-input core.
3. **Mine:** the learner taps 1–3 genuinely unknown items from the reading; each enters SRS **in
   its original sentence**, which is the research-backed "one unknown per sentence" atom.
4. **Produce:** write a few sentences about the reading, checked against a model answer rather than
   graded (see §7).
5. **Close:** progress as **lines read, words mined and now recalled, passages now comprehensible**
   — concrete counters that move daily even when "level" does not.

## 5. Extensive reading — the flagship feature

A **levelled reading library** is the heart of this book and its clearest differentiator. The
Tadoku principles: many easy texts beat few hard ones; 95%+ known; no dictionary mid-read; volume
builds fluency and motivation. Each text is tagged by the items and grammar it uses, so the library
can serve something the learner is ~95% ready for, drawn from their actual SRS state.

**The "you can read this now" moment** belongs here: periodically resurface a text that was too
hard weeks ago and let the learner feel it click. That is a true motivator built from a real
signal, which is the only kind this product allows.

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
Spoken back-and-forth does not.

The workable replacement for *written* output is **compose-then-compare**: the learner writes about
the passage, then sees a model answer built from the same known items and marks their own against
it. No API, no grading, and it exercises production honestly. It is not conversation, and this doc
should not pretend it is.

**If the paid tier ever needs conversation to justify its price, that is the moment to revisit
DR-023** — with a cost model, not a wish. A paid tier changes the economics that shelved Hana in
the first place, and this is the one place in the plan where that argument is worth making.

## 8. Content source — the line where verified starts

Book Three is where content must be **verified**. Before it ships, stand up the **Tatoeba (CC BY)
ingestion and i+1 levelling pipeline**: filter sentences by known-item coverage, tag by grammar and
kanji, assemble the library and the mining corpus from real, attributed sentences.

**No training-canonical sentences at Book Three and above.** The N5 exemption exists because N5
vocabulary is canonical and well documented; that argument does not extend upward.

The raw material is already on disk — Tatoeba examples are embedded in
`server/data/jmdict-examples-eng-3.6.2.json` with source ids. What is missing is the levelling
pipeline, not the sentences.

## 9. Retention design — the core of this book

- **Manufacture visible progress from honest signals.** Counters that move daily: lines read, words
  mined and now recalled, share of a target text now comprehensible. Real ability, never points.
- **Mining is agency.** Personally relevant material beats a forced list at exactly the level where
  motivation fails.
- **Output as proof.** "I wrote a paragraph about what I read" is a concrete identity win that
  recognition cannot supply.
- **Calm, never punishing.** At the wall especially, re-engagement is informational: "3 readings
  waiting when you're ready", not guilt.

## 10. Pricing rationale

This is where the value is highest and the alternatives weakest, so it is the right first paywall.
The learner arrives having used the full method free through Book Two — they are paying to get
*over the wall*, which is when motivation and willingness to pay peak.

Enforcement is still aspirational: `isPaid` is stubbed false until payment is wired, and the `tier`
field in user metadata holds the slot. Gated content shows a soft inline prompt, never a redirect.

## 11. Build notes

**The heaviest phase.** New builds: the levelled reading library, the Tatoeba ingestion and
levelling pipeline, in-text mining → SRS, compose-then-compare, and the honest progress counters.
Everything below it is reused.

Open before authoring: the chapter question in §3.
