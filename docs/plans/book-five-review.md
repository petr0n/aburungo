# Book Five — the review volume

**Decision:** [DR-041](../decision-records.md), 2026-09-10. Book Five reviews Books One to Four.
At most **25% of the words it carries are new**; it teaches no new grammar patterns.
**Status:** planned. No content authored, and none should be until Book Three's open scope closes
and Book Four is the book behind us rather than the book beside us (DR-038).

**Stage:** `fluency` (DR-033), the same stage as Book Four. A review volume is still a volume.
**Tier:** the first paid book, unchanged by this decision ([01 §Access](01-overarching-plan.md)).

---

## 1. What the learner has, before this book opens

Measured 2026-09-10 from `src/content/books.ts` rather than asserted. Regenerate with `pnpm ladder`
and read the per-book files; do not copy these totals into other documents.

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

It is not that. **The SRS returns an item as it was taught** — the same word, the same phrase, in
the register and situation it arrived in, alone, when its interval comes due. What it cannot do is
put a Book One word into a Book Four register, or ask for two patterns from different books inside
one sentence, or take a situation the learner met in polite form and run it again in plain.

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

On the ~10 chapters x ~10 lessons skeleton every other book uses, a Book Five carrying roughly
**400 word slots introduces about 100 new words and revisits about 300**. The new quarter exists so
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
10. **A day, end to end** — long-form production over the whole course

Chapter 9 is the one place new *characters* are plausible rather than new words: compounds built
from the 521 kanji already taught. Whether a compound counts against the 25% is a content-authoring
question, and the answer is yes — a compound the learner cannot read is a new word.

## 5. What this does not move

The three items Book Four deferred keep their own blockers and do **not** land here by default:

| Deferred | Blocked on | Still blocked after this decision |
|---|---|---|
| News reading | A reading library; corpus measured thin | Yes |
| Exposition at length | Same library | Yes |
| Formal written production | Compose-then-compare engine, and `buildProductionQueue` has no frame slot | Yes — though DR-039's guided production is the closest thing now built |

If any of them unblocks, it is a scope question for whichever book is being written at the time,
not an inheritance Book Five accepts in advance.

## 6. Open questions

- **Does Book Five end the course?** DR-034 puts the endpoint at roughly N2, and Book Four carries
  the grammar that reaches it. Whether consolidation is the last volume or whether a sixth follows
  is not settled here.
- **How is "already met" decided in authoring?** A word taught in Book One and never seen since is
  differently familiar from one taught in Book Four. The chapter plans need a rule; the obvious
  candidate is the learner's own review state, which would make the book adaptive and is a much
  larger change than this decision makes.
- **Does the 25% ceiling bind per chapter or per book?** Written as per book above. Per chapter is
  stricter and easier to verify mechanically.

## 7. When to write the real plan

After Book Three's reading scope closes and Book Four has been used. DR-038 puts one book in flight
at a time, and this volume's whole premise is that the four before it are finished and settled —
a review of material still being revised would be written twice.
