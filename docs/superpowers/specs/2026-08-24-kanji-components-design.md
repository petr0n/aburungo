# Kanji component layer — design

**Date:** 2026-08-24
**Status:** Approved, implementation pending
**Depends on:** [2026-08-24-kanji-in-the-ladder-design.md](2026-08-24-kanji-in-the-ladder-design.md)
**Plan section:** `docs/plans/03-book-two.md` §5

## Why this is second

`03-book-two.md` §5 promises that new kanji arrive as "you already know these pieces", which makes
each one cheaper than the last. That promise is only honest if the pieces were taught. Until the
prerequisite spec ships, Book One's 200 kanji are displayed once and never reviewed, so telling a
learner they already know 日 would be a false claim in the one place the system's credibility
lives. This document assumes that spec has landed: kanji are a domain type, they carry meanings
and readings, they enter the review queue, and `KanjiIntroCard` exists.

## Decisions

All four were settled with the owner on 2026-08-24.

**1. Component keywords only. No per-kanji mnemonics.**
Each *component* gets one English keyword; no kanji gets an authored story. 時 shows as sun +
temple, and the composition is the memory aid. The alternative — a written mnemonic per kanji — is
roughly 400 pieces of original prose today and another ~570 every book after, permanently. The two
best-known keyword sets, Heisig's and WaniKani's, are copyrighted, so nothing can be adapted and
every line would be fresh work. Keywords are ~253 words written once and reused by every book
forever.

Learner-authored mnemonics were considered. The generation effect is real, but it needs storage, a
UI and a text-entry moment, and it asks for effort exactly when the learner is already loaded.
Available later as an addition; not the foundation.

**2. KRADFILE is the decomposition source.**
6,355 kanji decomposed into 253 visual components — flat, purpose-built, kanji in and component
list out. Its 253 elements land almost exactly on the keyword budget. KANJIDIC2, already in the
repo's data path, carries only a single *classifying* radical per kanji, which is a different
thing and insufficient. KanjiVG carries recursive decomposition but its groupings are drawn for
stroke order rather than for teaching, and it costs XML parsing and a tree where a list suffices.

**Licensing.** KRADFILE is copyright Jim Breen and the EDRDG under the EDRDG Licence, CC BY-SA
4.0. Share-alike attaches to adaptations of the work, so the derived decomposition table ships
under CC BY-SA with attribution. Creative Commons explicitly permits collections, so it does not
reach the application code. This is the standard reading and what comparable dictionaries do; it
is a judgment call and is recorded here as one. Note the contrast with CLAUDE.md's dictionary
choice — JMdict for Applications was picked over base JMdict specifically to avoid share-alike on
*vocabulary content*. That reasoning does not transfer: nothing about a share-alike decomposition
table constrains what the app may charge for.

**The licence boundary is a file boundary.** Keywords are original work and live in one file;
KRADFILE-derived decomposition is generated into another. Neither file mixes provenance, so the
attribution header on `decomposition.json` covers exactly what it should.

**3. Book One is backfilled — data and surface.**
Its 200 kanji *are* the component vocabulary Book Two compounds on. Decomposition costs nothing to
backfill because it is a lookup rather than authoring, and the surface already exists once the
prerequisite ships. Adding components changes presentation, not curriculum: no word joins the
ladder, so DR-033's "Book One's taught content does not change" holds, and
`docs/book-one-ladder.md` regenerating byte-identical proves it.

**4. Components never reorder lessons.**
時 decomposes into 日 and 寺. 日 is taught in Book One's first lesson; 寺 is taught nowhere and is
not a useful beginner kanji. Ordering the curriculum by component is Heisig's trade — it decouples
kanji from the situations that need them, and AburunGo orders by situation. So kanji keep arriving
when a situation calls for them, and a script *reports* which components are untaught at each
point. The author reads the report and decides. Gaps become visible instead of being designed
away.

## Data

### `src/content/kanji/components.yaml` — authored, ~253 entries

The entire authoring job for this layer, shared by every book.

```yaml
# Keywords are original work, written from KANJIDIC2 meanings and from shape
# description. Never adapted from Heisig or WaniKani, both copyrighted.

- glyph: 日
  keyword: sun
- glyph: 氵
  keyword: water
  note: the flowing form of 水
```

`note` is optional and exists for the radical-only forms, where a keyword alone leaves the learner
wondering what they are looking at. Standalone-kanji components need no note — their keyword and
the kanji's own meaning agree.

The split between components that are themselves kanji and components that are radical-only forms
is reported by the generator rather than asserted here. The radical-only ones are the slower half
to write: a keyword for 亻 or 辶 is a description of a shape, not a translation.

### `src/content/kanji/decomposition.json` — generated, committed

```
node scripts/kanji.mjs decompose
```

Reads KRADFILE, scopes to characters some lesson teaches, emits character → component list with a
CC BY-SA 4.0 attribution header. Same subcommand pattern as `scripts/jlpt.mjs` and
`scripts/reading.mjs`, and the same script the prerequisite spec adds `build` to.

**Scope is derived, never listed** — the generator reads every `kanji:` array in
`src/content/lessons/*.yaml`, exactly as the prerequisite's `build` step does. A generator handed
a list of what to include has a hole in it the day a lesson adds a character.

### `src/types.ts`

```ts
export type KanjiComponent = {
  glyph: string;
  keyword: string;
  note?: string;
};
```

Components are annotations on a kanji, not reviewable items. They get no `id`, no `ReviewState`
and no place in the daily loop. If a component ever needs reviewing in its own right, it is
because it should have been taught as a kanji.

## The three states of a piece

The card's claim has to be true, so each piece resolves to exactly one of three states, all
**derived** from lesson order plus decomposition — no extra authoring, no stored flags:

| State | Means | Shown as |
|---|---|---|
| **Taught** | The piece is itself a kanji an earlier lesson introduced | "you know this" |
| **Met** | Not taught as a kanji, but appeared inside an earlier kanji | "you've seen this" |
| **New** | First appearance anywhere in the ladder | keyword introduced here |

The *met* state is what makes the layer pay off without distorting the curriculum. 氵 is never
taught as a kanji and never will be, but by its third appearance the learner has met it three
times, and the card can say so honestly. Under decision 4 this is the whole mechanism: rather than
forcing 寺 into the syllabus so 時 can claim known pieces, the card tells the truth about what the
learner has actually met.

A kanji whose pieces are all *new* still renders — it simply introduces two keywords instead of
recalling them. Nothing is hidden for having no history.

## Surface

`KanjiIntroCard`, thin by design in the prerequisite spec, gains the component row: the character,
then its pieces with keywords and their state. That is the whole UI change. The review card
(`KanjiDrillCard`, reused) is untouched — components are an introduction aid, and putting them on
the review side would turn a recognition prompt into a hint.

## The gaps report

```
node scripts/kanji.mjs gaps
```

Per lesson, in ladder order: which kanji it introduces, and which of their components are *new* at
that point. Advisory output for an author, never a failing check — a lesson introducing a kanji
with two new components is a legitimate authoring choice, and the report exists so it is a choice
rather than an accident.

It also reports two things the author cannot see by reading content: components referenced by
taught kanji that have no keyword yet, and the standalone-kanji versus radical-only split of the
keyword file.

## Testing

Written so each fails if the wiring is absent, rather than passing over an empty set:

- **Every component referenced has a keyword.** Collect components from `decomposition.json` for
  every taught kanji, assert each resolves in `components.yaml`. Assert the collected count is
  non-zero first, so an empty decomposition cannot pass.
- **The generated file is not stale.** Regenerate in-memory and compare, as
  `book-one-ladder.md`'s test does.
- **State resolution is correct.** Against a pure fixture ladder, not real content: a piece taught
  earlier resolves *taught*, a piece only ever seen inside another kanji resolves *met*, and a
  first appearance resolves *new*. Real content would make at least one of these vacuous.
- **State is order-sensitive.** The same component resolves *new* at its first lesson and *met*
  at a later one. This is the assertion that catches a resolver ignoring lesson order.
- **The ladder is unchanged.** `docs/book-one-ladder.md` regenerates byte-identical, via the
  existing committed-file test, untouched.
- **Attribution survives.** `decomposition.json` carries its CC BY-SA header. A generated file
  that loses its licence header on regeneration is a licensing bug, so it is a test.

## Consequences

- **~253 keywords to write**, once, reused by every book. The radical-only half is the slow half.
- **Book Two's §5 becomes true.** New kanji can honestly be introduced as recombined parts,
  because Book One's 200 were both taught and decomposed.
- **A second CC BY-SA data file enters the repo**, alongside whatever the prerequisite's KANJIDIC2
  extract carries. Both are data files with their own headers; neither reaches app code.
- **The gaps report will show real gaps** and that is the intent. Book One was authored without
  any of this, so its early lessons will introduce kanji with new components. Nothing is
  retrofitted against it.

## Deliberately not solved

- **Per-kanji mnemonics.** Decision 1. Learner-authored ones remain available as a later addition.
- **Recursive decomposition.** KRADFILE is flat: 時 gives 日 and 寺, not 寺's own pieces. Recursion
  needs KanjiVG or IDS data and buys little when the deepest useful claim is one level.
- **Components as reviewable items.** They are annotations. A component worth reviewing is a kanji
  worth teaching.
- **Stroke order and KanjiVG.** Still absent from the repo despite CLAUDE.md listing it as
  bundled. Unrelated to decomposition now that KRADFILE carries it.
- **Which components a beginner is best shown.** KRADFILE's decompositions are lookup-oriented and
  occasionally unhelpful for teaching. Overriding individual entries is possible later by hand; it
  is not worth doing before the gaps report shows which ones actually mislead.
