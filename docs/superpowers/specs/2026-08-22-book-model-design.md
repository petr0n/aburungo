# The book model — design

**Status:** approved, not implemented.
**Depends on:** PR #96 (Chapter 12). Every Book One figure here — 12 chapters, 87 teaching
lessons, 484 words, 352 reference words missing — is the count with that chapter merged.
**Scope:** what a book *is*. Books stop being JLPT levels and become volumes of a fixed
shape, difficulty behaviour moves onto a named stage, and access tiers gate on book order
instead of level. Book One's taught content does not change; this restructures what
surrounds it. Book Two's actual chapters are named but not authored here — that is its own
design when its turn comes.

## Why this shape

Book One shipped as "the N5 book" and finished 352 words short of the 809-word N5 community
reference. That left one question the plans could not answer: does Book One keep going until
it has taught the list, or is it finished?

Both answers were bad. Teaching the remainder means roughly seven more chapters and a
nineteen-chapter book. Declaring it finished leaves a book whose defining premise — *it is
the N5 book* — is visibly false.

The premise was the problem. No official JLPT vocabulary list has existed since 2010; the two
community lists this repo merges disagree on about a quarter of every level, and trusting one
has already shipped a wrong headword (終る, where 終わる is the real word). A level is a
reconstruction of an exam syllabus, and organising a course around it means letting a
reconstruction decide where a book ends.

So: **a book is a volume of a coherent size, not a level.** The reference lists stay exactly
what `data/jlpt/README.md` already calls them — gap-finders. The consequence the owner
accepted explicitly is that there will be more than five books.

## What a book is

Three properties define one. A JLPT level is not among them.

### Shape

About ten chapters of about ten teaching lessons — roughly 100 teaching lessons, which at
Book One's measured pace of 5.7 words per lesson lands near **570 words**.

A chapter deviates when the learning says so. Seven lessons is fine if the situation is worth
seven. Ten is the target to author toward, not a quota to pad to, and CLAUDE.md's existing
instruction not to retrofit the shape against existing situations still stands — Book One
stays exactly as it shipped.

The shape and DR-021 reinforce each other rather than compete. A recognition checkpoint closes
every chapter, so chapters of ~10 teaching lessons *are* DR-021's "roughly every ten teaching
lessons, at a situation boundary." Book One's back half drifted to five-lesson chapters, which
fires checkpoints at twice the intended cadence; authoring toward ten corrects that without a
separate rule.

Measured from Book One as shipped:

| Chapters | Teaching lessons each | Average |
|---|---|---|
| 1–5, authored before the cadence rule | 12, 9, 10, 13, 8 | 10.4 |
| 6–12, authored after it | 5, 5, 5, 4, 5, 5, 6 | 5.0 |

The early chapters are the shape. The later ones drifted, and "chapter length varies on
purpose" had been covering for it.

### Boundary

A book ends where a coherent arc of situations ends, somewhere near 100 teaching lessons. Not
at a level line, and not when a word counter trips. The word count is an *outcome* of the
shape, which is why this document states it as "near 570" rather than as a budget.

### Sequence

What orders content is what already orders chapters: grammar dependency first, situation arcs
second, reference lists only as gap-finders. Book Two opens on the N5 remainder because those
words are genuinely next for a learner who has finished Book One — not because a level says
so.

## Stages replace levels

Difficulty behaviour has to attach to something, and a level was doing that job. A **stage**
does it now: a named phase that a book declares itself in.

| Stage | Books | What it means |
|---|---|---|
| `foundation` | One | Romaji crutch on, recognition-led review, everything scaffolded |
| `building` | Two onward | Romaji cut, typing is the default review gate, production checkpoints |
| `reading` | later | i+1 band model and the reading library switch on |
| `fluency` | later | Listening floor, unassisted native material |

`reading` and `fluency` are **named now and specified when a book reaches them.** Detailing
them today would be writing fiction about books that do not exist. Naming them now is what
gives `04-path-n3.md` and `04b-path-n2-n1.md` somewhere to reattach: their design work — the
band model, the text-source brief, the listening floor — is about where a learner *is*, not
which exam level they are on, and it survives this change intact.

The difficulty shift stays at Book Two. The trigger was never really the level; it was having
finished a whole book. Book Two's vocabulary being N5-ish makes it a gentler place to drop the
crutch, not a worse one.

## How many books

Unknown, deliberately. The reference corpus across all five levels is 9,985 words, which at
~570 a book implies somewhere around seventeen. That number is arithmetic, not a plan, and it
should not appear in the plan docs as a target.

## Code changes

### `src/types.ts`

```ts
export type Stage = "foundation" | "building" | "reading" | "fluency";

export type Book = {
  /** Stable id, e.g. "book-1". Internal naming; the learner reads `title`. */
  id: string;
  /**
   * The PathProgress key, persisted in Dexie and server-side. Book One's is "n5"
   * forever: it is the primary key of every existing progress row, local and remote,
   * and renaming it orphans them. Books from Two on use their own id.
   */
  progressKey: string;
  order: number;
  title: string;
  chapters: readonly Chapter[];
  lessons: readonly Lesson[];
  stage: Stage;
};
```

`stage` replaces `difficultyShift`. The boolean has exactly one consumer
(`src/pages/LearnPage.tsx`), which becomes `book.stage !== "foundation"`. A field named for
what it *is* rather than for one thing it *does* stops the next behaviour from needing a
second boolean.

`JlptLevel` stays. It remains a property of a word or phrase — the coverage and queue tooling
in `scripts/jlpt.mjs` and `scripts/vocab.mjs` is built on it, the reference data is organised
by it, and none of that is wrong. What changes is that it no longer defines a book or gates
anything.

### Tiers

`TIER_LEVELS` — the JLPT sets in `src/content/index.ts` and `src/content/vocabulary/index.ts` —
is deleted and replaced by book order:

```ts
const TIER_BOOK_LIMIT: Record<UserTier, number> = { guest: 1, free: 4, paid: Infinity };
```

This roughly preserves today's generosity. A guest currently gets N5 (809 reference words);
they will get Book One (484 taught words). A free account currently gets N5 + N4 (1,579
reference words); it will get Books One through Four (~2,200 taught words once they exist).

`phrasesForTier` and its vocabulary twin currently filter on the item's own `jlpt` tag. Gating
by book needs an item→book-order index built from `books` — every book's lessons list the
word and phrase ids it teaches, so the index is a fold over content already loaded.

That raises a case that does not exist today: **content no book teaches.** The vocabulary and
phrase files carry entries the ladder never references, and those surface only in browse. The
rule: an item's gate is the order of the first book that teaches it, and an item no book
teaches is treated as Book One. Silently hiding browse content that is visible today would be
a worse outcome than leaving it open.

### Deliberately not changing

Lesson filenames (`n5-22-people-clothes.yaml`) and chapter ids (`n5.chapter-1`). They are
internal strings; renaming them churns every content file, risks the same class of progress-key
breakage, and buys nothing a comment cannot. They get documented as legacy naming.

## Plan documents

| Today | Becomes | What happens to it |
|---|---|---|
| `01-overarching-plan.md` | unchanged name | Gains the book rule — shape, boundary, sequence, stages. The rule lives here rather than in a new document, because a second doc competing with the overarching plan is exactly how `02b` went stale |
| `02-path-n5.md` | `02-book-one.md` | Record of a shipped book; level framing removed |
| `03-path-n4.md` | `03-book-two.md` | Rewritten against the new model. Its N4 grammar skeleton survives |
| `04-path-n3.md` | `04-stage-reading.md` | Band model, text-source brief and i+1 work intact, reattached to a stage |
| `04b-path-n2-n1.md` | `04b-stage-fluency.md` | Same treatment for the listening floor |
| `00-research-foundations.md` | unchanged name | §4's "Guest = N5, free = N5+N4" line updated |
| `99-roadmap.md` | unchanged name | Drops "Book One is N5, Book Two is N4, and so on" |
| `02b-n5-units.md` | unchanged name | Already a tombstone; its link to the renamed `02` is fixed |
| `CLAUDE.md` | — | Access tier table moves off JLPT onto books |
| `docs/decision-records.md` | — | Gains DR-033 |

Renames use `git mv` so history follows.

## Book Two

Named here, designed in its own document.

Stage `building`, so romaji is gone and typing is the default review gate from its first
lesson. Ten chapters, ~100 teaching lessons, ~570 words, a recognition checkpoint closing each
chapter and a production checkpoint closing the book.

It opens on the N5 remainder — but as **situations Book One never staged**, not as a list to
clear. The 352 leftover reference words are the raw material those situations can be built
from, and `data/jlpt/candidates-n5.json` already holds 295 of them JMdict-matched, most with an
attested Tatoeba example. That is roughly six chapters' worth. The back four pick up the N4
grammar skeleton the current `03` works out in dependency order, which survives this
restructure unchanged and simply sits after the situation chapters rather than opening the
book.

Grammar remains the binding constraint, as it was for Book One: words are oversupplied and
patterns must be authored.

## DR-033, and the numbering gap

This is a decision record, written as **DR-033**. `docs/decision-records.md` ended at DR-023
while the code and plans cited DR-024 through DR-032, and those turned out to be two different
things:

- **DR-024 was a real decision nobody logged** — Book → Chapter → Lesson naming, cited in
  `src/types.ts`, two test files and six plan documents. It is now written, marked as recorded
  after the fact from the convention as implemented rather than reconstructed as a
  deliberation.
- **DR-025 through DR-032 were never decisions.** They are chapter serial numbers, one per
  chapter from 4 through 11, stamped into that chapter's own YAML headers and incremented by
  copying the previous header. Nothing outside those files cited DR-025 through DR-031. The
  tags are removed in favour of naming the chapter; Chapter 12 was authored without one.

The numbers are not reused, because they appear in merged commit subjects. A record claiming
one of them would be a worse ambiguity than a gap.

## Verification

- `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm ladder --check`
- `pnpm walkthrough` — the full ladder end to end
- New tests for tier gating by book order, including the untaught-item fallback. This is the
  one behaviour change with a user-visible consequence
- **Book One's taught content must come out byte-identical.** This design changes what a book
  *means*, not what Book One *teaches*. `docs/book-one-ladder.md` regenerating unchanged is the
  cheapest proof of that, and its committed-file test already enforces it

## Out of scope

- Authoring any of Book Two's content
- Specifying the `reading` and `fluency` stages beyond their names
- Renaming lesson files or chapter ids
- Reconstructing the deliberation behind DR-024, beyond recording the convention as built
- The kanji component/mnemonic layer, which `02` names as the largest risk to Book One working
