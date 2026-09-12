# Book Five — the review volume

**Decision:** [DR-041](../decision-records.md), 2026-09-10. Book Five reviews Books One to Four.
At most **25% of the words it carries are new**; it teaches no new grammar patterns.
**Status:** planned. No content authored, and none should be until Book Three's open scope closes
and Book Four is the book behind us rather than the book beside us (DR-038).

**Stage:** `fluency` (DR-033), the same stage as Book Four. A review volume is still a volume.
**Tier:** the first paid book, unchanged by this decision ([01 §Access](01-overarching-plan.md)).

---

## 1. What the learner has, before this book opens

Read 2026-09-10 from the **generated ladders**, `docs/book-*-ladder.md`, which are where
`bookCounts` in `scripts/ladder.mjs` emits them. That is the reproducible source: `pnpm ladder`
regenerates it and `pnpm test` fails while it is stale, so the numbers cannot drift from the
content behind them. `src/content/books.ts` registers the books but computes nothing.
Do not copy these totals into other documents — cite the ladder.

| Book | Lessons | Words | Phrases | Kanji |
|---|---|---|---|---|
| One | 100 | 484 | 227 | 200 |
| Two | 93 | 231 | 284 | 19 |
| Three | 81 | 126 | 379 | 10 |
| Four | 76 | 447 | 348 | 292 |
| **Course** | **350** | **901 unique** | **1,232 unique** | **521** |

That is the material Book Five draws on. The per-book word counts do not sum to 901 because books
share vocabulary.

## 2. Why a review book, when the SRS already reviews

This is the objection to answer first, and it is a fair one. The daily loop already returns every
item on its own schedule, so a volume whose purpose is "see it again" would be a book competing
with a feature that is already built and works.

It is not that, though the first draft of this paragraph overstated it. **The SRS resurfaces items
one at a time.** `buildDailySession` schedules ids and `ReviewStep` renders each one on a
standalone card; it does not preserve the situation a phrase was taught in, because it never
carries one. What it has no way to do is *deliberate* recombination: put a Book One word into a
Book Four register, ask for two patterns from different books inside one sentence, or run a
situation met in polite form again in plain. Nothing chooses those pairings, because nothing is
choosing at all — the queue is per item and due-date ordered.

Recombination is a content problem. Content is what a book is.

The division of labour, stated so neither side quietly takes the other's job:

- **The SRS** owns per-item coverage. Every one of the 901 words comes back on its own schedule
  whether or not Book Five mentions it.
- **Book Five** owns breadth and recombination. Every prior book and theme represented, in
  combinations the learner has not seen.

**So "reviews all previous content" is a claim about scope, not about a checklist.** Book Five may
draw on anything taught in Books One to Four. It does not have to name all 901 words, and a plan
that promised to would be promising a book roughly three times the size of Book One.

## 3. The 25% rule

At most one word in four is new to the learner.

Counted as **unique word ids first taught in Book Five, over all unique word ids its teaching
lessons carry** — the same `wordIds` sets `bookCounts` already reduces, so the ratio is derivable
rather than estimated. Repetition does not move it: a word referenced by four lessons is one id on
both sides, and a word occurring three times inside one phrase is not counted at all, because
phrases are not the denominator.

On the ~10 chapters x ~10 lessons skeleton every other book uses, a Book Five carrying roughly
**400 unique word ids introduces about 100 new ones and revisits about 300**. The new quarter exists so
the book is not airless — a review volume with no new vocabulary reads as a test, and DR-020 is
explicit that this course does not test.

Three things the rule is not:

- **Not 25% of the course.** It is 25% of what Book Five carries.
- **Not a per-lesson quota.** A lesson may be entirely revision, or may carry three new words, as
  long as the book holds the ratio. Chapter plans state their own split.
- **Not licence to introduce grammar.** The ceiling is on words. New *patterns* are zero: every
  phrase in Book Five composes patterns Books One to Four already taught.

## 4. What the chapters are for

Bands, not commitments — the same status §3 of the fluency stage gives its own list. Each chapter
takes material the learner already has and changes one thing about it.

1. **Plain and polite, the same day** — one situation run in both registers, back to back
2. **Long sentences from short ones** — joining patterns from Books Two and Three into one clause
3. **The same errand, harder** — Book One situations at Book Four's register
4. **Asking, four ways** — request forms across all four books, chosen by relationship
5. **Talking about what someone said** — quotation over material from every prior book
6. **Conditions and consequences** — Book Two's conditionals carrying Book Four's stance patterns
7. **Keigo over familiar ground** — Book Four's honorifics applied to Book One's errands
8. **Explaining yourself** — reason and concession patterns, recombined
9. **Kanji in company** — taught characters in compounds the learner has not met
10. **A day, end to end** — one day's situations run through in sequence, in the guided-production
    format DR-039 already ships (model visible, type or build). Not "long-form written production":
    that is the capability §5 records as still blocked, and a review volume must not quietly
    reintroduce it.

Chapter 9 introduces **no new characters.** It builds compounds out of the 521 kanji already
taught — familiar characters, unfamiliar words. Those compounds are new *vocabulary* and they
**consume the 25% allowance** like any other new word: a compound the learner cannot read is a new
word whatever its parts.

## 5. What this does not move

The three items Book Four deferred keep their own blockers and do **not** land here by default:

| Deferred | Blocked on | Still blocked after this decision |
|---|---|---|
| News reading | A reading library; corpus measured thin | Yes |
| Exposition at length | Same library | Yes |
| Formal written production | Compose-then-compare engine, and `buildProductionQueue` has no frame slot | Yes — though DR-039's guided production is the closest thing now built |

If any of them unblocks, it is a scope question for whichever book is being written at the time,
not an inheritance Book Five accepts in advance.

## 6. The three questions this plan opened, settled

[DR-042](../decision-records.md), 2026-09-11.

### Book Five ends the course

Five volumes, and the course stops. DR-034 puts the endpoint at roughly N2; Book Four carries the
grammar that reaches it and Book Five adds none, so after Book Five the taught spine is complete.

The obvious objection is the three items Book Four deferred — news reading, exposition at length,
formal written production. They do not need a sixth volume, because **none of them is a volume.**
Read what each is actually blocked on ([book-four-bands §5](book-four-bands.md)): two want a
reading library, and one wants a compose-then-compare engine with a frame slot in
`buildProductionQueue`. A library is a surface the learner mines, described by
[the reading stage](04-stage-reading.md); an engine is code. Neither is authored chapters.

So when they unblock they attach to the books that already exist, as surfaces over the material
those books teach. "Book Six" would have been a container invented to hold two features.

### "Already met" is decided by the content, not by the learner

A word is already met if any lesson in Books One to Four teaches it — read from the same
`wordIds` the ladder is generated from, so it is derivable rather than remembered.

The tempting alternative was the learner's own review state, which is genuinely more accurate: a
Book One word never seen since really is less familiar than a Book Four one. It is rejected because
it makes the book different for every learner, and a book whose content varies per learner cannot
be rendered as a fixed ladder — which is the thing that makes content inspectable at all
(CLAUDE.md, "content ships with the book map"). Adaptivity belongs to the SRS, which already has it.

The staleness the review state would have caught is handled in authoring instead, with a rule that
is checkable: **each chapter's revisited words must be drawn from at least three of the four prior
books.** That forbids the failure mode this question was really about — a Book Five chapter that
quietly reviews only Book Four.

### The 25% ceiling binds per chapter

Not per book. A per-book ceiling permits a chapter that is entirely new words as long as another is
entirely revision, and a learner meeting that chapter is not doing review — they are doing a
new-content chapter wearing a review book's cover.

Per chapter also survives contact with a machine: on ~40 word slots a chapter, the ceiling is
**at most 10 new words**, and a chapter that breaks it can be caught the way a bad chunk split is
caught, by a check that reads the content rather than by an author remembering. The check is not
written, because there is no Book Five content for it to read; the shape it takes is a sweep over
each chapter's `wordIds`, counting those absent from Books One to Four.

A book whose every chapter holds the ceiling holds it overall, so the book-level figure in §3 —
roughly 100 new against 300 revisited — is a consequence rather than a second rule.

**The one place this pinches** is chapter 9, kanji in compounds: a compound the learner cannot read
counts as a new word, and ten of them is a thin chapter. That is a real cost and it is accepted
rather than waived. If it turns out to be wrong, it is a chapter plan arguing for an exception with
a reason, not a ceiling quietly raised.

## 7. When to write the real plan

After Book Three's reading scope closes and Book Four has been used. DR-038 puts one book in flight
at a time, and this volume's whole premise is that the four before it are finished and settled —
a review of material still being revised would be written twice.
