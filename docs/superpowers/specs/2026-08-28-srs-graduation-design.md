# SRS graduation — design

**Date:** 2026-08-28
**Status:** Approved, implementation pending
**Decision record:** DR-035

## The problem

Leitner's top box is 30 days and nothing graduates past it, so every item the learner has ever
met returns twelve times a year, forever. The steady-state daily review load is therefore
**corpus ÷ 30**, permanently, and it is independent of how well the learner performs — 100%
accuracy produces exactly this floor, because a perfect answer at box 5 schedules another box-5
review.

| Corpus | Items | Reviews/day, forever |
|---|---|---|
| Book One only | 955 | **32** |
| Books One + Two | ~1,900 | **63** |
| The N2 endpoint DR-034 commits to | ~10,000 | **333** |

Inverted: at a tolerable 20 reviews per day, the app can sustain a corpus of **600 items**.
Book One alone is 955 — 484 words, 227 phrases, 44 grammar patterns and 200 kanji.

**The app is already past its own ceiling, and the course is committed to sixteen times it.**

This is not a tuning problem. It is arithmetic that no amount of accuracy, capping or content
restructuring can move, because the divisor is the top interval.

### What was ruled out, and why

Three remedies were simulated before this design was written. All three failed, and the way they
failed is what identified the real constraint.

- **Cap the daily review queue.** Catastrophic. Intake is ~11 new items per lesson-day; clearing
  a fixed 30 reviews cannot keep pace once failures recycle daily. The backlog reaches 1,679
  items and never recovers. Uncapped, the queue self-limits around 100–180 — unpleasant, but
  convergent. The cap is worse than the disease.
- **Cap, and pause new lessons while the backlog is high.** Stalls. 60 of 174 lessons completed
  in 400 simulated days, with new material paused on 340 of them. The learner stops progressing
  rather than drowning, which is a different failure, not a fix.
- **Retirement** (stop scheduling after sustained success). Rejected for now on judgment rather
  than arithmetic: retiring an item asserts the learner will never forget it, and a mistake is
  invisible — the item simply never returns. That claim is far too strong while the top interval
  is 30 days. It becomes reasonable only once intervals are long enough that reaching the top
  box means something.

## Decision

**Extend the Leitner ladder to eight boxes**, adding 60, 120 and 240 days.

```
1 → 1 day     4 → 14 days    7 → 120 days
2 → 3 days    5 → 30 days    8 → 240 days
3 → 7 days    6 → 60 days
```

This raises the sustainable corpus at 20 reviews/day from 600 to **4,800 items**, and lowers the
N2-endpoint floor from 333 reviews/day to 42.

**FSRS is the endpoint, and this is a runway extension rather than the destination.** DR-035
records the trigger: the client moves to FSRS before the corpus passes roughly 5,000 items,
which is somewhere in Book Five. Extending the ladder buys the time to do that migration
carefully rather than under pressure.

## What this does not fix, stated plainly

**The extended ladder helps least early and most late — but "late" arrives inside Book One at a
realistic pace.** Simulated at 80% accuracy across two books of material:

| Day | Current ladder | Extended ladder |
|---|---|---|
| 90 | 110 | 109 |
| 180 | 154 | 115 |
| 365 | 118 | **44** |
| 547 | 107 | **19** |
| 730 | 131 | **32** |

Peak load falls from 182 to 148. The curves are close for the first three months and separate
from there, because early load is box 1–4 churn plus new material arriving, neither of which the
top interval touches.

**Where that lands depends entirely on pace, and Book One is a beginner's book.** Simulated over
Book One's 87 teaching lessons:

| Pace | Book One takes | Average daily queue | Queue at the book's end |
|---|---|---|---|
| 7 lessons/week | 2.9 months | 68 → 67 (1%) | 103 → 101 |
| 4 lessons/week | 5.1 months | 52 → 49 (6%) | 99 → **67** |
| 3 lessons/week | 6.8 months | 46 → 41 (11%) | 83 → **58** |

At three or four lessons a week — the realistic case — a beginner's queue **at the end of Book
One is about a third lighter**, and that is the heaviest it ever gets: the moment they would open
Book Two carrying the largest backlog they have had. Only a learner sprinting a lesson a day sees
no benefit, and that is the three-month path rather than the normal one.

**The early-months load is still a real and separate problem.** Roughly 50–100 items a day during
Book One is not comfortable, it is not addressed here, and it is not addressed by capping (see
above). But it is smaller than the raw two-book simulation suggests, and it should not be
described as untouched by this change.

## Code changes

### `src/types.ts`

```ts
export type LeitnerBox = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
```

### `src/srs/leitner.ts`

```ts
export const BOX_DURATION_DAYS: Readonly<Record<LeitnerBox, number>> = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
  6: 60,
  7: 120,
  8: 240,
};

const MAX_BOX: LeitnerBox = 8;
```

`nextBox`, `dueAtForBox`, `schedule` and `isDue` need no other change — they are written against
`MAX_BOX` and the duration table rather than against literal box numbers.

### No data migration

`reviewStates` stores `box` as a number (`src/db/dexie.ts`: `"phraseId, dueAt"`), so every
existing row remains valid and simply becomes eligible to climb further. A learner mid-Book-One
keeps their progress and their next review lands exactly where it would have.

This is the whole reason the ladder extension is worth doing before the FSRS migration: it is
the only version of this fix that touches no persisted shape.

## Testing

- **The duration table is complete and monotonic.** Every `LeitnerBox` has a duration, and each
  is strictly greater than the one before. Assert over the type's full range rather than a
  hardcoded list, so widening the type again cannot silently leave a hole.
- **An item climbs past 5.** Schedule "got-it" repeatedly from a fresh state and assert the box
  reaches 8 and the interval reaches 240 days. This is the behaviour that did not exist before;
  it needs a test that fails against the old ladder.
- **The top box is stable.** "got-it" at box 8 stays at box 8 rather than overflowing to 9 or
  wrapping.
- **A failure still drops to box 1** from every box including the three new ones, with a 1-day
  interval. The recovery path must not change.
- **Existing box 1–5 behaviour is unchanged.** The current Leitner tests must pass untouched —
  if any of them needs editing, the change is bigger than intended and that is the signal.
- **A persisted box-5 row keeps working.** Construct a `ReviewState` at box 5 as an existing
  learner would have it, and assert it schedules to box 6 rather than erroring or capping.

## Consequences

- **The ceiling moves from 600 items to 4,800.** Book One (955) and Book Two (~1,900 cumulative)
  both fit comfortably; the fix buys roughly through Book Four.
- **Nothing changes for existing learners except that their reviews eventually space out
  further.** No migration, no reset, no lost progress.
- **The two-scheduler split remains.** `ts-fsrs` 4.4.0 already runs server-side in
  `server/services/progress.ts` and `kanji.ts` with four-grade ratings, while `/learn` runs local
  Leitner with binary ratings and never reads server due state. This design does not unify them;
  DR-035 records it as the known state and FSRS as where it resolves.
- **A beginner's load improves modestly through Book One and substantially at its end** — about
  a third lighter at the book's close at a realistic pace, as set out above. The early months
  remain uncomfortable and unaddressed.

## Deliberately not solved

- **The early-months load** (roughly 50–100 items/day through Book One). Capping makes it worse; gating new material
  stalls progress. It needs a different kind of answer — probably session-level, possibly just
  accepting it — and it should be designed against real usage rather than simulation.
- **Retirement.** Revisit once intervals are long enough that the top box means something.
- **The client/server scheduler split**, and the binary-versus-four-grade rating mismatch. Both
  belong to the FSRS migration.
- **Per-item difficulty.** Fixed intervals treat every item the same. This is the substantive
  thing FSRS buys and the ladder cannot.
