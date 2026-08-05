# Grammar-in-context — design

**Status:** implemented (see docs/superpowers/plans/2026-07-21-grammar-in-context.md).
**Scope:** Phase 2 of `docs/plans/99-roadmap.md`, item 2 ("Grammar-in-context"), built and
proven against the existing 35 N5 units before N4 content authoring begins. Kanji
mnemonics, N4 content, and scoped-Hana launch (the other three Phase 2 items) are
explicitly out of scope for this spec — each gets its own design when its turn comes.

## Why this shape

Grammar patterns are currently a flat, non-reviewable string (`Unit.grammarNote`). The
overarching plan (`docs/plans/01-overarching-plan.md` §2d) lists "Grammar-in-context" as
its own bucket, parallel to Words/Phrases/Kanji — not a variant of either. This design
keeps that separation: a new `GrammarPattern` domain type, its own SRS bucket in the
daily-loop orchestrator, and its own review card, rather than widening the existing
`Phrase | Word` union that `FlashCard`/`FillBlankCard`/`RecognitionPass` are built around.
Those three components have real Word-shaped rendering logic (word-type badges, verb
conjugation display) that doesn't extend naturally to a cloze-blank pattern exercise, so
forcing grammar patterns through that union would mean threading a third case through
components that don't conceptually need to know about it.

The proving ground is a retrofit of all 35 existing N5 `grammarNote` strings into real
`GrammarPattern` items, each backed by a phrase that already exists in the content corpus.
This is the cheapest possible proof: no new example-sentence sourcing, just marking up
content that's already there.

## Data model

New type in `src/types.ts`, alongside `Unit`/`PathProgress`:

```ts
export type GrammarPattern = {
  id: string;
  jlpt: JlptLevel;
  /** Display form of the pattern, e.g. "～は～です". */
  pattern: string;
  /** Short English explanation — the existing grammarNote text, verbatim where possible. */
  gloss: string;
  /** An existing Phrase id that demonstrates the pattern. Reused, never duplicated. */
  phraseId: string;
  /**
   * The exact substring of that phrase's `reading` field to blank out for the cloze
   * exercise. Must appear in the phrase's reading exactly once (enforced at load time).
   */
  blank: string;
};
```

`Unit` gains one new optional field:

```ts
export type Unit = {
  // ...existing fields...
  /** The GrammarPattern id this unit introduces, if any. */
  patternId?: string;
};
```

All 35 units get a `patternId` in this retrofit (each already has a `grammarNote`), but the
field is optional in the type since not every future unit is guaranteed to introduce a new
pattern (some N4+ units may only reinforce an existing one).

## Content authoring

New content module, mirroring `src/content/units/`:

- `src/content/grammar/n5.yaml` — 35 entries, one per existing unit.
- `src/content/grammar/schema.ts` — `parseGrammarPatterns(raw, source, phrasesById)`, where
  `phrasesById: Map<string, Phrase>` (not just a `Set<string>` of known ids, unlike
  `parseUnits` — the validator needs the actual `reading` text to check blank uniqueness,
  not just id existence). Validates: required fields present; `jlpt` is a valid level;
  `phraseId` resolves in `phrasesById`; `blank` is a non-empty substring that appears in the
  resolved phrase's `reading` **exactly once** (ambiguous or missing blanks fail the build,
  same philosophy as the existing schema validators); no duplicate `id`s.
- `src/content/grammar/index.ts` — exports `allGrammarPatterns: GrammarPattern[]` and
  `findGrammarPattern(id)`.

`src/content/units/schema.ts`'s `parseUnits` gains a `knownPatternIds: Set<string>`
parameter and validates `patternId` the same way it already validates `wordIds`/`phraseIds`.
`src/content/units/index.ts` loads grammar patterns before units (dependency order:
vocabulary + phrases → grammar patterns → units).

**Retrofit process:** for each of the 35 units, pick the phrase (already in that unit's
`phraseIds`) that most directly demonstrates its `grammarNote`, and mark the blank
substring of that phrase's `reading`. Done by hand in one pass — 35 short, precise entries
that need per-pattern linguistic judgment, not parallelized like the earlier bulk
vocabulary authoring.

Some units' `grammarNote` won't have an exact match in their existing phrases (e.g. Unit
2's note is "～ですね" but its phrases end in "ですか", not "ですね" — the note describes
the pattern family, not a literal string every phrase contains). Decision rule: use the
closest representative phrase and blank the closest corresponding substring (here, ですか's
です) rather than forcing an exact morpheme match; if a unit genuinely has no phrase that
can carry a sensible blank, leave that unit's `patternId` unset — `Unit.patternId` is
optional specifically to allow this rather than authoring a misleading cloze.

**Cloze rendering scope decision:** the blank is defined against `reading` (pure kana),
not `japanese` (which may contain kanji). The cloze prompt is rendered from `reading` only
— e.g. reading "これはほんです" with blank "です" renders as "これはほん＿＿＿". This
sidesteps kanji/furigana offset-alignment complexity (a kana substring doesn't map 1:1
onto character offsets in a kanji-bearing string) for v1. The learner sees a kana-only
prompt during grammar-cloze review; the kanji form is still shown during the "teach"
moment and everywhere else the phrase appears.

## Persistence — no schema change

`ReviewState`, `schedule`, `isDue`, `getOne`/`upsert` in `src/db/reviewStore.ts` are already
keyed by a generic string id (`phraseId` in name only). `GrammarPattern.id` slots into the
exact same Leitner scheduling with zero Dexie/DB changes.

## Orchestrator (`src/srs/dailyLoop.ts`)

`buildDailySession` gains one new parameter (`allPatterns: readonly GrammarPattern[]`).
`reviewItems`'s type widens in place — **no separate `dueGrammarPatterns` field** — plus one
new field for the freshly-taught pattern:

```ts
export type DailySession = {
  unit: Unit | null;
  /** Due items (words, phrases, AND grammar patterns) from seen units, oldest-due first — true interleaving, not just adjacency. */
  reviewItems: Array<Phrase | Word | GrammarPattern>;
  newWords: Word[];
  newPhrases: Phrase[];
  /** The pattern the next unit introduces, or null. */
  newGrammarPattern: GrammarPattern | null;
};
```

`seenItemIds` (already built from seen units' `wordIds`/`phraseIds`) also collects each seen
unit's `patternId`, using the exact same `Set`. The existing due/sort/dedupe pipeline for
`reviewItems` is otherwise unchanged — it already does `wordById.get(id) ?? phraseById.get(id)`
as its final lookup; widen that one line to `?? patternById.get(id)`. Because the sort is by
`dueAt` before the lookup, this yields genuine interleaving (a due grammar pattern can sort
between two due words), not grammar items merely clustered at the end of the same UI step.
`newGrammarPattern` comes from `nextUnit.patternId` if set, looked up in `patternById` — same
shape as `newWords`/`newPhrases` construction.

This is simpler than an earlier draft that kept a separate `dueGrammarPatterns` field: no new
dedup pass, no second `seenReviewIds`-style Set, and the initial step-routing in `LearnPage`
(`reviewItems.length > 0 ? "review" : ...`) needs no changes at all, since grammar patterns
already count as review items.

## UI

**New presentational component**, `src/components/GrammarClozeCard.tsx`:
- Props: `pattern: GrammarPattern`, `phrase: Phrase`, `onNext: (correct: boolean) => void`.
- Shows `pattern.gloss` and the phrase's `reading` with `pattern.blank` replaced by a blank
  marker, then reuses `src/components/FillInput.tsx` directly for the answer input
  (romaji/kana-grid/JP-keyboard entry) — it's already a standalone component (`onSubmit`/
  `placeholder`/`disabled` props) with no `FillBlankCard`-specific coupling (no word-type
  badge, no verb conjugation display), so this is a straight reuse, not a new input widget.
  Answer checking via `compareAnswer(userInput, pattern.blank)`, same as `FillBlankCard`.
  Whether to also offer `FillBlankCard`'s voice-input mode is an implementation-time call,
  not a design decision — it doesn't affect data model or architecture either way.

**Teach moment** — a small addition inside `NewUnitStep` (`src/pages/LearnPage.tsx`): the
existing stage sequence `intro → words → phrases` gains a fourth stage, `grammar`, shown
only if the unit has a `patternId`. It displays `pattern.pattern` + `pattern.gloss` + the
full phrase (kanji + furigana, unblanked) — same shape as the existing word/phrase intro
cards, no new visual pattern.

**No new loop step — interleaved into Review and Produce instead.** An earlier version of
this spec added a separate `GrammarStep` positioned after New Unit and before Produce, with
one combined queue (due patterns + the new pattern). That's wrong: routing to it directly
from initial page load (when nothing is due in the word/phrase queue) would surface the next
unit's pattern before the learner has been taught it, since the teach moment only happens
partway through New Unit. Untangling that correctly needed extra state (a queue plus an
entry-context flag) just to make one step safe to enter from two different places.

The plan doc already says what to do instead (`01-overarching-plan.md` §2c, step 1): Review
should be "interleaved across item types (words, kanji, **grammar**, phrases)" — grammar was
never supposed to be its own step. So:

- **`ReviewStep`'s queue becomes `Array<Phrase | Word | GrammarPattern>`** — it's now exactly
  `session.reviewItems` (see Orchestrator above, which already widened to include due grammar
  patterns, sorted in with everything else by `dueAt`). Renders `FlashCard` for `Phrase`/`Word`
  items and `GrammarClozeCard` for `GrammarPattern` items — one more case in an item-kind
  branch, not a widened `FlashCard` union.
- **`ProduceStep`'s queue becomes `Array<Phrase | Word | GrammarPattern>`** the same way,
  assembled at the call site as `[...newWords, ...newPhrases, ...(newGrammarPattern ? [newGrammarPattern] : [])]`
  — Produce is already "type what you just learned," so practicing the just-taught pattern
  belongs there, not in a new step.

Net effect: **no new `Step` value, no new state, less code than the original design**, and
because `reviewItems` already includes grammar patterns, `LearnPage`'s initial step-routing
(`reviewItems.length > 0 ? "review" : ...`) needs no changes.

**`afterNewUnit`'s transition logic** (decides produce vs. recognition vs. close) needs one
surgical change: its `produceItems` count must also include `newGrammarPattern` so a unit
that introduces *only* a new pattern (no new words/phrases — not expected in the N5 retrofit,
but the type allows it) still routes to Produce instead of skipping it.

**Close screen:** the existing "Reviewed N item(s)" / "Learned N item(s)" counts on
`CloseStep` already count `session.reviewItems.length` (now inclusive of grammar patterns
with zero changes) and gain `newGrammarPattern ? 1 : 0` folded into the learned count.

## Testing

- `src/content/grammar/schema.ts` validation exercised at build time (same as existing
  content validators) — a bad blank/dangling phraseId fails `pnpm build` loudly.
- `src/srs/dailyLoop.test.ts` gains tests for due-pattern selection and new-pattern
  selection, mirroring the existing `reviewItems`/`newWords` test cases.
- A light sanity check (temporary test file, same pattern used for the Phase 1
  content-count verification) asserting all 35 units resolve a valid `patternId` after the
  retrofit, deleted after the PR is verified — not kept as permanent test debt.
- Full scripted browser walkthrough of all 35 units (extending the Phase 1 verification
  script), confirming `GrammarClozeCard` renders and advances correctly wherever it appears
  in Review or Produce, zero console errors — the same rigor applied to the Phase 1 content
  PR. Also decided during that walkthrough's earlier run (Phase 1): test-script timing, not
  the app, is the usual suspect for a stall — see the debugging note in that PR before
  assuming a new content bug.

## Explicitly out of scope

- Kanji component/mnemonic layer, N4 content authoring, scoped-Hana launch — separate
  Phase 2 items, separate specs.
- Conjugation-drill review format (te-form, plain-form) — N5 patterns are all
  particle/copula shaped and fit cloze; conjugation drilling is an N4-era concern per
  `docs/plans/03-path-n4.md` and will need its own review-format design when N4 arrives.
- Server-side sync of grammar-pattern review state for signed-in users — inherits the same
  guest-local-only scope cut already made for `PathProgress` and words/phrases.
