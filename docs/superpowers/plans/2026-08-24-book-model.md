# Book Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make a book a volume of a coherent shape rather than a JLPT level — in the types, in the tier gating, and in the plan documents' names.

**Architecture:** `Book` gains a `stage` (replacing the `difficultyShift` boolean) and a `progressKey` (splitting the persisted path key away from the book's id). Tier gating moves off JLPT sets onto book order, which requires a new module above the content graph because the obvious homes would create an import cycle. The level-named plan documents are renamed with `git mv` and their cross-links updated.

**Tech Stack:** TypeScript (strict, `verbatimModuleSyntax`, `erasableSyntaxOnly`), Vitest, React 19, YAML content.

**Spec:** `docs/superpowers/specs/2026-08-22-book-model-design.md` — read it before starting. DR-033 in `docs/decision-records.md` is the standing decision.

## Global Constraints

- **No `any`. No `as` casts** except at validated trust boundaries.
- **`import type`** for type-only imports (`verbatimModuleSyntax` is on).
- **No enums, no parameter properties** (`erasableSyntaxOnly` is on). Union types only.
- **`@/` alias** for anything under `src/`.
- **Book One's taught content must not change.** `docs/book-one-ladder.md` must regenerate byte-identical; `scripts/ladder.test.mjs` enforces it. If that test fails, you changed content.
- **`bookOne.progressKey` must stay the exact string `"n5"`.** It is the primary key of every `PathProgress` row in Dexie and on the server. Changing it orphans every learner's progress.
- **The learner never reads a JLPT level** (DR-024). Nothing in this plan puts one on screen.
- **Run `pnpm build`, `pnpm test` and `pnpm lint` before every commit.** Vitest does not typecheck; `tsc -b` runs in the pre-commit hook and in `pnpm build`.
- **Commits:** Conventional Commits, imperative mood, subject ≤ 50 chars, no trailing period, ASCII only, no AI footers.

---

### Task 1: `Book.stage` replaces `difficultyShift`

A boolean named for one of its effects cannot carry a third behaviour without a second boolean. `stage` names what the book *is*.

**Files:**
- Modify: `src/types.ts` (the `Book` type, ~line 165-190)
- Modify: `src/content/books.ts:20`
- Modify: `src/content/books.test.ts:22`
- Modify: `src/pages/LearnPage.tsx:83`
- Modify: `src/srs/dailyLoop.test.ts:73` and `:188`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `export type Stage = "foundation" | "building" | "reading" | "fluency"` in `src/types.ts`; `Book.stage: Stage` replacing `Book.difficultyShift: boolean`.

- [ ] **Step 1: Write the failing test**

In `src/content/books.test.ts`, replace the existing `difficultyShift` case:

```ts
  it("is a foundation book — romaji stays, recognition is the default gate", () => {
    expect(bookOne.stage).toBe("foundation");
  });
```

- [ ] **Step 2: Run it and watch it fail**

Run: `pnpm test -- src/content/books.test.ts`
Expected: FAIL — `expected undefined to be "foundation"`.

- [ ] **Step 3: Add the type**

In `src/types.ts`, above `export type Book`:

```ts
/**
 * How hard a book asks the learner to work (DR-033).
 *
 * This is what a JLPT level used to carry. A book declares its stage and the
 * behaviours follow; `reading` and `fluency` are named so the design work in
 * docs/plans has somewhere to attach, and are specified when a book reaches
 * them.
 */
export type Stage = "foundation" | "building" | "reading" | "fluency";
```

- [ ] **Step 4: Replace the field on `Book`**

In `src/types.ts`, delete the whole `difficultyShift` field including its doc comment, and add in its place:

```ts
  /**
   * The stage this book belongs to (DR-033). Two behaviours key off anything
   * past `foundation`:
   * - recall is the default review gate (type it, not flip-and-rate)
   * - romaji display is cut — no item in this book renders romaji, including
   *   earlier books' items reviewed here; romaji-to-kana *input* conversion stays
   *
   * The third behaviour 03 named, the production-first produce beat, is not
   * wired here: frame-based composition needs frames and their model sentences
   * as authored content, and deriving them at runtime fabricates Japanese.
   */
  stage: Stage;
```

- [ ] **Step 5: Retire the two comments that call a book a level**

Still in `src/types.ts`. The header comment on `Book` currently opens "A book — the run of
chapters an outside reference would call a JLPT level". That is the sentence DR-033 exists to
retire, and it sits on the type this task is changing. Replace the whole comment with:

```ts
/**
 * A book — a volume of the course (DR-033).
 *
 * Not a JLPT level: about ten chapters of about ten teaching lessons, ending
 * where an arc of situations ends rather than where a reference list runs out.
 * The `jlpt` tags on content stay as they are, because the coverage tooling
 * depends on them, but they no longer say what a book contains. The learner
 * reads "Book One", never "N5" (DR-024).
 */
```

The `Chapter` comment above it makes the same claim in its last paragraph. Replace that
paragraph — the one beginning "Chapters group lessons" — with:

```ts
 * Chapters group lessons; a *book* groups chapters. A book is a volume of a
 * coherent shape rather than a JLPT level (DR-033): the `jlpt` tags on content
 * stay as they are, useful and depended on by the coverage tooling, but they no
 * longer decide what a book holds. A learner reads "Book One", not "N5".
```

- [ ] **Step 6: Update the book**

In `src/content/books.ts`, replace `difficultyShift: false,` with:

```ts
  stage: "foundation",
```

- [ ] **Step 7: Update the one runtime consumer**

In `src/pages/LearnPage.tsx:83`, inside `isShifted`:

```ts
  if (book.stage !== "foundation") return true;
```

- [ ] **Step 8: Update the two test fixtures**

In `src/srs/dailyLoop.test.ts:73`, in `bookOf`, replace `difficultyShift: false,` with `stage: "foundation",`.

At `:188`, replace the `bookTwo` line with:

```ts
    const bookTwo: Book = { ...bookOf([laterLesson]), id: "n4", order: 2, stage: "building" };
```

- [ ] **Step 9: Verify**

Run: `pnpm build && pnpm test && pnpm lint`
Expected: build succeeds (`tsc -b` proves no `difficultyShift` reference survives), all tests pass.

Then confirm no comment still calls a book a level:

```bash
grep -n 'call a JLPT level' src/types.ts
```

Expected: no output. Grep for the affirmative claim, not the bare phrase "JLPT level" — the
replacement comments this task writes all *deny* that a book is a level ("Not a JLPT level",
"rather than a JLPT level", "what a JLPT level used to carry"), so a bare-phrase grep matches
the fix and can never pass.

- [ ] **Step 10: Commit**

```bash
git add src/types.ts src/content/books.ts src/content/books.test.ts src/pages/LearnPage.tsx src/srs/dailyLoop.test.ts
git commit -m "refactor(types): a book declares a stage"
```

---

### Task 2: split `Book.progressKey` from `Book.id`

`bookOne.id` is `"n5"` *because* it doubles as the persisted `PathProgress` key. Splitting them lets the id stop claiming a book is a level, without a data migration.

**Files:**
- Modify: `src/types.ts` (the `Book` type)
- Modify: `src/content/books.ts`
- Modify: `src/content/books.test.ts`
- Modify: `src/pages/LearnPage.tsx:612`, `:614`, `:639`, `:642`, `:743`
- Modify: `src/srs/dailyLoop.test.ts:69`

**Interfaces:**
- Consumes: `Stage` and `Book.stage` from Task 1.
- Produces: `Book.progressKey: string`. `bookOne.id === "book-1"`, `bookOne.progressKey === "n5"`.

- [ ] **Step 1: Write the failing tests**

In `src/content/books.test.ts`, replace the existing `"keeps the existing PathProgress pathId..."` case with both of these:

```ts
  it("has an id that does not claim the book is a JLPT level (DR-033)", () => {
    expect(bookOne.id).toBe("book-1");
  });

  it("keeps the persisted progress key so no learner loses progress", () => {
    // "n5" is the primary key of every PathProgress row, in Dexie and on the
    // server. It is frozen regardless of what the book is called.
    expect(bookOne.progressKey).toBe("n5");
  });

  it("gives every book a progress key", () => {
    for (const b of books) expect(b.progressKey.length).toBeGreaterThan(0);
  });
```

- [ ] **Step 2: Run them and watch them fail**

Run: `pnpm test -- src/content/books.test.ts`
Expected: FAIL — `expected "n5" to be "book-1"`, and `progressKey` undefined.

- [ ] **Step 3: Add the field to the type**

In `src/types.ts`, replace the `id` field's comment and add `progressKey` directly beneath it:

```ts
  /** Stable id, e.g. "book-1". Internal naming; the learner reads `title`. */
  id: string;
  /**
   * The PathProgress key, persisted in Dexie and server-side.
   *
   * Book One's is "n5" forever: it is the primary key of every existing
   * progress row, local and remote, and renaming it orphans them. Books from
   * Two on use their own id. Never derive this from `id` — the whole point is
   * that they are allowed to disagree.
   */
  progressKey: string;
```

- [ ] **Step 4: Update the book**

In `src/content/books.ts`, replace the `id` line and its comment:

```ts
  id: "book-1",
  // Frozen: every PathProgress row, local and remote, is keyed on this string.
  progressKey: "n5",
```

- [ ] **Step 5: Point the progress calls at the key, not the id**

In `src/pages/LearnPage.tsx`, **five** sites — four calls and one dependency array. Line 612:

```ts
        getPathProgress(book.progressKey, userId !== null),
```

Line 614, the prior-books fetch. This one is dormant — `priorBooks(bookOne)` is empty, so the
map never runs — and it is the most dangerous line in the file for exactly that reason: nothing
you can run today will catch it, and it fires the moment Book Two exists and Book One becomes a
prior book, reading every learner's Book One progress as empty.

```ts
        ...earlier.map((b) => getPathProgress(b.progressKey, userId !== null)),
```

Line 639:

```ts
      await markLessonSeen(book.progressKey, session.lesson.id, userId !== null);
```

Line 642, the dependency array — replace `book.id` with `book.progressKey`:

```ts
  }, [book.progressKey, session, userId]);
```

Line 743:

```ts
          void markLessonSeen(book.progressKey, marker, userId !== null);
```

Verify you got all four:

```bash
grep -n 'getPathProgress\|markLessonSeen' src/pages/LearnPage.tsx
grep -rn '\bbook\.id\b\|\bb\.id\b' src/ || echo "none"
```

Expected: five lines from the first grep — the import, and four calls all passing a
`progressKey`. The second must print `none`. **No call may pass `book.id` or `b.id`** — that is
the bug this task exists to prevent, and neither the compiler nor any test can catch it.

- [ ] **Step 6: Update the test fixture**

In `src/srs/dailyLoop.test.ts:69`, in `bookOf`, add `progressKey` beside the id:

```ts
  id: "n5",
  progressKey: "n5",
```

- [ ] **Step 7: Verify**

Run: `pnpm build && pnpm test && pnpm lint`
Expected: all pass.

- [ ] **Step 8: Commit**

```bash
git add src/types.ts src/content/books.ts src/content/books.test.ts src/pages/LearnPage.tsx src/srs/dailyLoop.test.ts
git commit -m "refactor(types): split progress key from book id"
```

---

### Task 3: tier gating by book order

Tiers gate on which book teaches an item, not on the item's JLPT tag.

**This task creates a new module, and the reason is an import cycle.** `src/content/lessons/index.ts` imports `allPhrases` from `@/content/index` and `allWords` from `@/content/vocabulary`. `books.ts` imports lessons. So a tier function living in `content/index.ts` that needs `books` would close the loop: `index.ts → books.ts → lessons/index.ts → index.ts`. The tier functions move to a module that sits above all of them and is imported only by pages.

**Files:**
- Create: `src/content/access.ts`
- Create: `src/content/access.test.ts`
- Modify: `src/content/index.ts` — delete `TIER_LEVELS` and `phrasesForTier`
- Modify: `src/content/vocabulary/index.ts` — delete `TIER_LEVELS` and `wordsForTier`
- Modify: `src/pages/FlashcardPage.tsx:5-6`, `src/pages/PracticePage.tsx:6-7`, `src/pages/LearnPage.tsx:26-27`, `src/pages/WordsPage.tsx:4`
- Modify: `src/types.ts` (Step 5), `src/store/session.ts:6` (a doc comment pointing at the old home)

**Interfaces:**
- Consumes: `books` from `@/content/books` (Task 2 shape).
- Produces: `wordsForTier(tier: UserTier): Word[]` and `phrasesForTier(tier: UserTier): Phrase[]`, both from `@/content/access`. Same signatures as the functions they replace, so call sites only change their import path.

- [ ] **Step 1: Write the failing test**

**Read this before writing it.** Today there is one book, every item in the content tree is taught
by it, and no Book One word carries a tag above N5. So every assertion phrased against real
content — "a guest gets less than a paid tier", "an untaught item stays visible", "an N4 tag does
not gate" — passes whether the code is right or wrong, because the sets it compares are empty or
identical. The behaviour is only provable against fixtures until Book Two exists. That is why the
module below exports a pure index builder and a pure predicate, rather than only the two
convenience functions the pages call.

Create `src/content/access.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { bookOrderIndex, reachable, phrasesForTier, wordsForTier } from "./access";
import type { Book, Lesson } from "@/types";
import { allWords } from "./vocabulary";
import { allPhrases } from "./index";

const lesson = (id: string, wordIds: string[], phraseIds: string[] = []): Lesson => ({
  id,
  order: 1,
  situation: "test",
  title: "t",
  canDo: "c",
  wordIds,
  phraseIds,
  kanji: [],
  grammarNote: "g",
});

const book = (order: number, lessons: Lesson[]): Book => ({
  id: `book-${order}`,
  progressKey: `book-${order}`,
  order,
  title: `Book ${order}`,
  chapters: [],
  lessons,
  stage: order === 1 ? "foundation" : "building",
});

describe("bookOrderIndex", () => {
  it("maps an item to the book that teaches it", () => {
    const index = bookOrderIndex([book(1, [lesson("l1", ["a"])]), book(2, [lesson("l2", ["b"])])]);
    expect(index.get("a")).toBe(1);
    expect(index.get("b")).toBe(2);
  });

  it("credits the earliest book when two teach the same item", () => {
    // A later book reviewing an earlier book's word must not push it behind a
    // paywall the learner has already walked through.
    const index = bookOrderIndex([book(2, [lesson("l2", ["a"])]), book(1, [lesson("l1", ["a"])])]);
    expect(index.get("a")).toBe(1);
  });

  it("indexes phrases as well as words", () => {
    const index = bookOrderIndex([book(1, [lesson("l1", [], ["p"])])]);
    expect(index.get("p")).toBe(1);
  });
});

describe("reachable", () => {
  it("gives a guest the first book and nothing past it", () => {
    expect(reachable(1, "guest")).toBe(true);
    expect(reachable(2, "guest")).toBe(false);
  });

  it("gives a free account four books", () => {
    expect(reachable(4, "free")).toBe(true);
    expect(reachable(5, "free")).toBe(false);
  });

  it("gives a paid account everything, however many books there end up being", () => {
    expect(reachable(17, "paid")).toBe(true);
  });

  it("treats an item no book teaches as Book One rather than hiding it", () => {
    // Browse surfaces show vocabulary the ladder never references. Those are
    // visible today, and silently removing content a learner can currently see
    // is a worse failure than leaving it open.
    expect(reachable(undefined, "guest")).toBe(true);
  });
});

describe("the shipped content", () => {
  it("reaches every tier, because one book is all there is", () => {
    // Not a claim that gating works — it cannot be, with a single book. It is
    // a guard that nothing in Book One became unreachable to a guest.
    expect(wordsForTier("guest")).toHaveLength(allWords.length);
    expect(phrasesForTier("guest")).toHaveLength(allPhrases.length);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `pnpm test -- src/content/access.test.ts`
Expected: FAIL — cannot resolve `./access`.

- [ ] **Step 3: Write the module**

Create `src/content/access.ts`:

```ts
/**
 * What a tier can see, by book (DR-033).
 *
 * Gating used to read an item's own `jlpt` tag. It no longer does: a level
 * stopped being an access control when a book stopped being a level. Book
 * order is a property of the lessons that teach an item, so this needs the
 * book list — which is why these functions live here rather than beside the
 * collections they filter. `src/content/lessons/index.ts` imports `allPhrases`
 * and `allWords`, and `books.ts` imports lessons, so a tier function inside
 * either collection would close the cycle index -> books -> lessons -> index.
 * This module sits above all of them and is imported only by pages.
 *
 * The index builder and the predicate are exported and pure because the
 * behaviour is not provable against the shipped content: there is one book,
 * it teaches everything, and every tier therefore sees the same set. Tests
 * feed them fixtures instead.
 */
import type { Book, Phrase, UserTier, Word } from "@/types";
import { allPhrases } from "@/content/index";
import { allWords } from "@/content/vocabulary";
import { books } from "@/content/books";

/**
 * Highest book order a tier reaches.
 *
 * Roughly today's reach carried over: a guest had N5's 809 reference words and
 * gets Book One; a free account had N5 + N4 and gets four books.
 */
const TIER_BOOK_LIMIT: Record<UserTier, number> = {
  guest: 1,
  free: 4,
  paid: Number.POSITIVE_INFINITY,
};

/** Item id -> the order of the earliest book that teaches it. */
export function bookOrderIndex(source: readonly Book[]): Map<string, number> {
  const index = new Map<string, number>();
  for (const b of [...source].sort((a, z) => a.order - z.order)) {
    for (const l of b.lessons) {
      for (const id of [...l.wordIds, ...l.phraseIds]) {
        if (!index.has(id)) index.set(id, b.order);
      }
    }
  }
  return index;
}

/**
 * `undefined` means no book teaches it, which reads as Book One.
 *
 * Browse surfaces show vocabulary the ladder never references. Hiding those
 * silently would remove content a learner can see today.
 */
export function reachable(bookOrder: number | undefined, tier: UserTier): boolean {
  return (bookOrder ?? 1) <= TIER_BOOK_LIMIT[tier];
}

// Built once: the content tree is static after module load.
const bookOrderByItemId = bookOrderIndex(books);

export function wordsForTier(tier: UserTier): Word[] {
  return allWords.filter((w) => reachable(bookOrderByItemId.get(w.id), tier));
}

export function phrasesForTier(tier: UserTier): Phrase[] {
  return allPhrases.filter((p) => reachable(bookOrderByItemId.get(p.id), tier));
}
```

- [ ] **Step 4: Run the test and watch it pass**

Run: `pnpm test -- src/content/access.test.ts`
Expected: PASS, 8 tests.

- [ ] **Step 5: Retire the two comments that say JLPT drives access**

In `src/types.ts`, the `UserTier` comment lists levels per tier and `Phrase.jlpt` opens "JLPT
difficulty level. Drives access tier gating". Both become false the moment this task lands.

Replace the `UserTier` comment with:

```ts
/**
 * Access tier for a user session.
 *
 * Gates on book order, not on a JLPT level (DR-033) — see src/content/access.ts.
 *
 * guest      — unauthenticated; Book One
 * free       — signed-in free account; Books One through Four
 * paid       — subscriber; every book, plus Conversation
 */
```

Replace the `Phrase.jlpt` comment with:

```ts
  /**
   * JLPT level of the phrase. Metadata only: the coverage and queue tooling in
   * scripts/ is built on it, and it no longer gates access (DR-033 — gating
   * reads book order, see src/content/access.ts). Omit only for content that
   * predates JLPT tagging; treat as N5 until resolved.
   */
```

`Word.jlpt` in the same file carries no comment, so there is nothing to correct there.

- [ ] **Step 6: Delete the old gating**

In `src/content/index.ts`, delete the `TIER_LEVELS` constant, its doc comment (the block starting `Allowed JLPT levels per user tier.`), and the `phrasesForTier` function. Remove `JlptLevel` and `UserTier` from that file's type imports **only if nothing else there uses them** — check with `grep -n 'JlptLevel\|UserTier' src/content/index.ts` before editing the import line.

In `src/content/vocabulary/index.ts`, delete the same three things and run the same check.

- [ ] **Step 7: Repoint the four consumers**

`src/pages/FlashcardPage.tsx`, replace lines 5-6:

```ts
import { phrasesForTier, wordsForTier } from "@/content/access";
```

`src/pages/PracticePage.tsx`, replace lines 6-7 with the same single import.

`src/pages/LearnPage.tsx`, replace lines 26-27 with the same single import.

`src/pages/WordsPage.tsx`, replace line 4:

```ts
import { wordsForTier } from "@/content/access";
```

- [ ] **Step 8: Verify nothing still imports the old names from the old places**

```bash
grep -rn 'TIER_LEVELS' src || echo "clean"
grep -rn 'ForTier' src | grep -v 'content/access'
```

Expected: `clean`, and every remaining `ForTier` line is either an import from `@/content/access`
or a call site inside a page — with one exception you must fix rather than ignore.
`src/store/session.ts:6` carries a doc comment reading "see phrasesForTier() in
src/content/index.ts", which stops being true at Step 6. Repoint it to `src/content/access.ts`.

- [ ] **Step 9: Verify**

Run: `pnpm build && pnpm test && pnpm lint`
Expected: all pass. `tsc -b` proves no stale import survived.

Then confirm no comment still says a level gates access:

```bash
grep -n 'Drives access\|N5 content only\|N5 + N4' src/types.ts
```

Expected: no output.

- [ ] **Step 10: Commit**

```bash
git add src/content/access.ts src/content/access.test.ts src/content/index.ts src/content/vocabulary/index.ts src/types.ts src/store/session.ts src/pages/FlashcardPage.tsx src/pages/PracticePage.tsx src/pages/LearnPage.tsx src/pages/WordsPage.tsx
git commit -m "feat(content): gate tiers on the book, not level"
```

---

### Task 4: rename the level-named plan documents

Four filenames still assert that a book is a level.

**Files:**
- Rename: `docs/plans/02-path-n5.md` → `docs/plans/02-book-one.md`
- Rename: `docs/plans/03-path-n4.md` → `docs/plans/03-book-two.md`
- Rename: `docs/plans/04-path-n3.md` → `docs/plans/04-stage-reading.md`
- Rename: `docs/plans/04b-path-n2-n1.md` → `docs/plans/04b-stage-fluency.md`
- Modify: every file containing a link to one of them (list produced in Step 1)

**Interfaces:**
- Consumes: nothing.
- Produces: the four new paths, used by Task 5's prose.

- [ ] **Step 1: List every file that links to the old names**

```bash
git grep -I -l -E '02-path-n5|03-path-n4|04-path-n3|04b-path-n2-n1'
```

Grep the whole repository, not a hand-picked set of directories: `data/reading/micro-readings.json`
and `server/src/services/conversationPrompt.ts` both carry these links and sit outside
`docs`/`src`/`scripts`.

Expected, at time of writing: `docs/project-plan.md`, `docs/text-source-brief.md`, `docs/plans/01-overarching-plan.md`, `docs/plans/02b-n5-units.md`, `docs/plans/03-path-n4.md`, `docs/plans/04b-path-n2-n1.md`, `docs/plans/99-roadmap.md`, `docs/plans/README.md`, both files under `docs/superpowers/specs/`, `src/content/phrases/meals.yaml`, `src/content/phrases/people-clothes.yaml`, `scripts/aozora.mjs`, `scripts/reading.mjs`, `scripts/levelling.mjs`.

Keep this list — Step 4 verifies against it.

- [ ] **Step 2: Rename with git so history follows**

```bash
git mv docs/plans/02-path-n5.md docs/plans/02-book-one.md
git mv docs/plans/03-path-n4.md docs/plans/03-book-two.md
git mv docs/plans/04-path-n3.md docs/plans/04-stage-reading.md
git mv docs/plans/04b-path-n2-n1.md docs/plans/04b-stage-fluency.md
```

- [ ] **Step 3: Rewrite every link**

**Two files must be excluded, and blindly rewriting them is the trap this step exists to warn
about.** This plan and the design spec both name the old paths *as rename records* — the spec has a
`| Today | Becomes |` table whose left column is the old name by definition, and this task's own
body lists the `git mv` sources. Rewriting them produces
`git mv docs/plans/02-book-one.md docs/plans/02-book-one.md` and a table reading
`| 04b-stage-fluency.md | 04b-stage-fluency.md |` — the same class of damage as the
"Chapter 11, Chapter 11" lines a sweep left in the roadmap two days ago.

```bash
git grep -I -l -E '02-path-n5|03-path-n4|04-path-n3|04b-path-n2-n1' \
  -- ':!docs/superpowers/plans/2026-08-24-book-model.md' \
     ':!docs/superpowers/specs/2026-08-22-book-model-design.md' | while read -r f; do
  perl -pi -e 's/04b-path-n2-n1/04b-stage-fluency/g; s/04-path-n3/04-stage-reading/g; s/03-path-n4/03-book-two/g; s/02-path-n5/02-book-one/g' "$f"
done
```

The order matters: `04b-path-n2-n1` is rewritten before `04-path-n3` so the longer pattern wins.

The design spec has exactly one *link* to update, in the `reading` and `fluency` stage paragraph.
Edit that line by hand and leave the table alone. If you script it, bind the line-number guard to
a block — `if ($. == N) { s/…/…/g; s/…/…/g }` — because in `perl -pi -e 's/…/…/g if $. == N'` the
modifier applies only to the last statement and the rest run on every line.

- [ ] **Step 4: Verify no reference to an old name survives**

```bash
git grep -I -n -E '02-path-n5|03-path-n4|04-path-n3|04b-path-n2-n1' \
  -- ':!docs/superpowers/plans/2026-08-24-book-model.md' \
     ':!docs/superpowers/specs/2026-08-22-book-model-design.md' || echo "clean"
```

Expected: `clean`. Run it unscoped too: every surviving hit must be inside those two files and must
be a rename *record* — a `git mv` source or the left column of the spec's mapping table — never a
link someone could follow.

- [ ] **Step 5: Check the prose still reads correctly**

The renames change filenames, not sentences. Read every changed line:

```bash
git diff -U0 | grep '^+' | grep -v '^+++'
```

Expected: each line names a new path and otherwise reads exactly as before. Where a sentence
describes a document *as* a level — `**N3** (04-stage-reading.md, paid flagship)`, or a checklist
item reading `N3 path spec` — fix the label to name the book or stage. Do not leave a sentence
that says "level" pointing at a file named "stage". `01-overarching-plan.md` has several of these.

Fix the document *references*; do not rewrite that document's level vocabulary wholesale. It is
banner-flagged as superseded and its premise is the level model — reworking it is Task 5's job.

- [ ] **Step 6: Verify**

Run: `pnpm build && pnpm test && pnpm lint`
Expected: all pass. `pnpm build` is the typecheck gate and the Global Constraints require it before
every commit — these are docs, but `scripts/*.mjs` and two content YAML files carry links this task
rewrote. `scripts/decisionRecords.test.mjs` scans these files, so a mangled DR citation surfaces
here too.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "docs(plans): name the docs for books and stages"
```

---

### Task 5: write the rule where the plans can see it

The rule lives in the overarching plan, because a second document competing with it is how `02b` went stale.

**Files:**
- Modify: `docs/plans/01-overarching-plan.md`
- Modify: `docs/plans/README.md` — the naming paragraph that currently ends "Book One is N5"
- Modify: `docs/plans/99-roadmap.md` — the line "Book One is N5, Book Two is N4, and so on"
- Modify: `docs/plans/00-research-foundations.md` — §4's "Guest = N5, free = N5+N4" line
- Modify: `CLAUDE.md` — the Access tiers table

**Interfaces:**
- Consumes: the four renamed paths from Task 4; `Stage` from Task 1; `TIER_BOOK_LIMIT` semantics from Task 3.
- Produces: nothing code depends on.

- [ ] **Step 1: Add the rule to the overarching plan**

In `docs/plans/01-overarching-plan.md`, add a section titled `## What a book is` covering, in prose matching the document's existing voice:

- **Shape** — about ten chapters of about ten teaching lessons, roughly 100 teaching lessons, near 570 words at the measured pace of 5.7 words per lesson. A chapter deviates when the learning says so; the number is a target to author toward, never a quota to pad to.
- **Why the shape and DR-021 agree** — a recognition checkpoint closes every chapter, so chapters of ~10 teaching lessons *are* "roughly every ten teaching lessons, at a situation boundary".
- **Boundary** — a book ends where an arc of situations ends, near 100 teaching lessons. Not at a level line, not when a word counter trips.
- **Sequence** — grammar dependency first, situation arcs second, reference lists as gap-finders only.
- **Stages** — the four-row table from the spec, with `reading` and `fluency` marked as named-now, specified-when-reached.
- **Cite DR-033.**

Do not restate the spec wholesale. This is the rule, not the reasoning; the reasoning is in the DR and the spec.

- [ ] **Step 2: Fix the three level-equals-book claims**

`docs/plans/README.md` — the naming paragraph asserts a book *is* a level. Rewrite so it says a book is a volume and the `jlpt` field survives in the data for the coverage tooling.

`docs/plans/99-roadmap.md` — delete the sentence "Phases below were originally written against JLPT level names; Book One is N5, Book Two is N4, and so on." Replace with a note that phases predate DR-033 and that book numbers below mean volumes, not levels.

`docs/plans/00-research-foundations.md` §4 — the bullet reading "Tiered access. Guest = N5, free = N5+N4, paid = N3–N1 + Hana" becomes guest = Book One, free = Books One through Four, paid = everything, with Hana still noted as shelved.

- [ ] **Step 3: Update the CLAUDE.md tier table**

Replace the Content column of the Access tiers table:

| Tier | Content |
|---|---|
| Guest | Book One |
| Free account | Books One through Four |
| Paid | Every book |

Then update the bullets under it: the line about kana being free stays; add one saying tiers gate on book order, that a book is not a JLPT level (DR-033), and that the `jlpt` field survives in the data for the coverage tooling.

- [ ] **Step 4: Verify nothing still says a book is a level**

Both greps need the same exclusions Task 4's does, and one more: this plan quotes the sentences
it orders deleted, the spec's tables record the before state, and DR-033 describes the old reach
in the past tense. Those are records, not claims, and rewriting them is the self-corrupting sweep
Task 4 warns about.

```bash
EX=(':(exclude)docs/superpowers/plans/2026-08-24-book-model.md'
    ':(exclude)docs/superpowers/specs/2026-08-22-book-model-design.md'
    ':(exclude)docs/decision-records.md')
git grep -I -n -iE 'Book (One|Two|Three|Four|Five) is (N[1-5]|the N[1-5])' -- . "${EX[@]}" || echo "clean"
git grep -I -n -E 'guest.*N5|free.*N5 \+ N4' -- docs CLAUDE.md "${EX[@]}" || echo "clean"
```

Expected: `clean` for both. Use `:(exclude)` rather than the `:!` shorthand — the short form does
not expand reliably through a shell variable in zsh.

Then run them unscoped and read every hit. Each must be a record of what the old model said, never
a live claim.

**The greps do not catch every phrasing.** Both require the literal word "is", so
`AburunGo · Book One · internally N5` — the HTML ladder's header, `scripts/ladder.mjs:374` —
passes them while saying exactly what this task retires. Grep for the bare level names too and
read the hits:

```bash
git grep -I -n -E 'Book One[^.]{0,30}N5' -- . "${EX[@]}" || echo "clean"
```

Four live claims sit outside this task's file list and must be fixed:
`scripts/ladder.mjs` — **both** of them, the markdown header near line 73 and the HTML `eyebrow`
near line 374 — `docs/plans/02-book-one.md` (its opening definition), and `docs/project-plan.md`
(a second tier table duplicating CLAUDE.md's). Fixing the
ladder header means `pnpm ladder` regenerates `docs/book-one-ladder.md` — that is allowed here,
because the constraint protects Book One's *taught content*, and only the generated header prose
moves.

- [ ] **Step 5: Verify**

Run: `pnpm build && pnpm test && pnpm lint`
Expected: all pass. Docs-only changes still run the full gate, per the Global Constraints.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "docs(plans): state what a book is"
```

---

### Task 6: prove the whole ladder still runs

The type changes touch the page that drives every session. Nothing in Tasks 1-5 exercises it end to end.

**Files:** none modified — this task is verification, and it either passes or sends you back to a previous task.

- [ ] **Step 1: Confirm Book One's content is untouched**

```bash
pnpm ladder
git diff --stat docs/book-one-ladder.md docs/book-one-ladder.html
```

Expected: no diff. A diff here means content changed, which this plan forbids — find out which task did it before continuing.

- [ ] **Step 2: Drive the ladder**

Run: `pnpm walkthrough`
Expected: `sessionsCompleted=100`, `ladderEndReached=true`, `allCaughtUpReached=true`, `consoleErrors=0`, `pageErrors=0`.

First run on a machine needs `pnpm exec playwright install chromium`. Do not run two walkthroughs at once — both bind port 4173 and the second kills the first.

- [ ] **Step 3: Confirm progress still keys on "n5"**

```bash
grep -n 'getPathProgress\|markLessonSeen' src/pages/LearnPage.tsx
grep -rn '\bbook\.id\b\|\bb\.id\b' src/ || echo "none"
```

Expected: five lines from the first — the import plus four calls, every one passing a
`progressKey` — and `none` from the second. If any call passes `book.id` or `b.id`, learners'
progress is orphaned on deploy. The prior-books call on line 613 is the one to check hardest:
it is dormant while there is one book, so nothing you can run proves it right.

- [ ] **Step 4: Open the PR**

```bash
git push -u origin HEAD
gh pr create --title "feat: a book is a volume, not a JLPT level" --body "$(cat <<'BODY'
Implements DR-033 and `docs/superpowers/specs/2026-08-22-book-model-design.md`. No content changes: `docs/book-one-ladder.md` regenerates byte-identical.

- **`Book.stage` replaces `difficultyShift`** — `foundation` / `building` / `reading` / `fluency`. A boolean named for one of its effects could not carry a third behaviour without a second boolean.
- **`Book.progressKey` splits from `Book.id`.** The id is now `book-1`; the progress key stays `"n5"` forever, because it is the primary key of every `PathProgress` row in Dexie and on the server. Renaming it would orphan every learner's progress.
- **Tiers gate on book order**, not JLPT sets: guest gets Book One, a free account gets Books One through Four, paid gets everything. An item no book teaches reads as Book One rather than being hidden — browse content visible today stays visible.
- **New `src/content/access.ts`** rather than editing the two collections in place: `lessons/index.ts` imports `allPhrases` and `allWords`, and `books.ts` imports lessons, so a tier function inside either collection would close an import cycle.
- **The four level-named plan docs are renamed** with `git mv`, and the rule for what a book is now lives in `01-overarching-plan.md`.

**On the tests:** the tier behaviour is not provable against the shipped content — there is one book, it teaches everything, and every tier sees the same set, so any assertion phrased against real content passes whether the code is right or wrong. The index builder and the predicate are exported pure and tested against fixtures for that reason.

`pnpm walkthrough`: 100 sessions, ladder end reached, 0 console errors, 0 page errors.
BODY
)"
```

---

## Notes for the executor

**The one irreversible mistake** in this plan is a `getPathProgress` or `markLessonSeen` call left passing `book.id` after Task 2. It typechecks, every test passes, the walkthrough passes — and on deploy every existing learner's progress reads as empty, because the row is keyed `"n5"` and the lookup asks for `"book-1"`. Step 3 of Task 6 exists solely for that.

**Not in this plan, deliberately:** authoring any of Book Two's content; specifying the `reading` and `fluency` stages beyond their names; renaming lesson files or chapter ids (they keep their `n5` prefixes as legacy naming — renaming churns every content file and risks the same class of key breakage); the kanji component and mnemonic layer.
