# Kanji in the Ladder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the 200 kanji Book One introduces into real reviewable items — carrying meanings and readings, entering the SRS queue, and introduced on a real card instead of a bare glyph.

**Architecture:** Follow the `GrammarPattern` precedent exactly. A `Kanji` domain type with a structural guard, static content generated from KANJIDIC2 into `src/content/kanji/kanji.yaml`, inclusion in `buildDailySession`'s `reviewItems` through the existing Leitner `ReviewState`, and a dispatch in `ReviewStep`. `KanjiDrillCard` is reused rather than duplicated; only the introduction card is new.

**Tech Stack:** React 19 + TypeScript strict, Vitest, `@rollup/plugin-yaml` for content imports, Zustand, Dexie. Node scripts are plain `.mjs` under `scripts/`.

**Spec:** [docs/superpowers/specs/2026-08-24-kanji-in-the-ladder-design.md](../specs/2026-08-24-kanji-in-the-ladder-design.md)

## Global Constraints

- **`src/srs/` is pure.** No React, no DB, no fetch, and `now` is always a parameter — never `Date.now()` inside a function there.
- **`src/types.ts` is the single source of truth for domain types.** Update it before changing shape elsewhere.
- **No `any`. No `as` casts** except at validated trust boundaries.
- **`verbatimModuleSyntax` is on** — use `import type` for type-only imports.
- **`erasableSyntaxOnly` is on** — no enums, no parameter properties.
- **Imports use the `@/` alias** for anything under `src/`.
- **Functional components only:** `export function Name(props: Props)` with an explicit `Props` type.
- **The learner never reads a JLPT level (DR-024).** This matters concretely in Task 4.
- **Recognition only.** A kanji review never asks the learner to produce a character.
- **`docs/book-one-ladder.md` must regenerate byte-identical.** Its committed-file test already enforces this and must stay green without being edited.
- **Run `pnpm build` and `pnpm test` before concluding any task.**

## Deliberate divergence from the spec

The spec asks for a staleness test that regenerates `kanji.yaml` in memory and compares, "exactly as `book-one-ladder.md`'s test does." **That is not achievable here and Task 1 does something else instead.** The ladder generates from local content; `kanji.yaml` generates from kanjiapi.dev over HTTP, so a regenerate-and-compare test would need network access in CI and would fail offline.

The replacement is a **scope check**, which catches the same class of bug — a forgotten regeneration — without the network: every character in every lesson's `kanji:` array must have an entry, and every entry must be claimed by some lesson. If a lesson adds 週 and nobody reruns the generator, the first assertion fails. If a lesson drops a character and nobody reruns, the second fails.

## File structure

| File | Responsibility |
|---|---|
| `src/types.ts` (modify) | `Kanji` type, `isKanji` guard, `kanjiId()` helper; widen `isGrammarPattern` |
| `scripts/kanji.mjs` (create) | `build` subcommand: fetch KANJIDIC2 for taught characters, write `kanji.yaml` |
| `src/content/kanji/kanji.yaml` (generated) | The committed kanji content |
| `src/content/kanji/schema.ts` (create) | `parseKanji` runtime validator, mirroring `vocabulary/schema.ts` |
| `src/content/kanji/index.ts` (create) | `allKanji`, `kanjiByCharacter` |
| `src/content/kanji/scope.test.ts` (create) | The scope check described above |
| `src/srs/dailyLoop.ts` (modify) | `newKanji`, kanji in `reviewItems` |
| `src/components/KanjiIntroCard.tsx` (create) | The one genuinely new component |
| `src/components/KanjiDrillCard.tsx` (modify) | Widen the prop type so the ladder can call it |
| `src/pages/LearnPage.tsx` (modify) | Intro card in the new-lesson step, dispatch in `ReviewStep` |

---

### Task 1: The Kanji type and its content pipeline

**Files:**
- Modify: `src/types.ts`
- Create: `scripts/kanji.mjs`
- Create: `src/content/kanji/schema.ts`
- Create: `src/content/kanji/index.ts`
- Create: `src/content/kanji/kanji.yaml` (by running the script)
- Test: `src/content/kanji/scope.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  - `type Kanji = { id: string; character: string; meanings: string[]; allMeanings: string[]; on: string[]; kun: string[]; strokes: number | null }`
  - `function isKanji(item: Phrase | Word | GrammarPattern | Kanji): item is Kanji`
  - `function kanjiId(character: string): string`
  - `const allKanji: readonly Kanji[]`
  - `const kanjiByCharacter: ReadonlyMap<string, Kanji>`

- [ ] **Step 1: Add the domain type and guards to `src/types.ts`**

Add near the existing `GrammarPattern` block. `"character"` is unique across the four item types — `Word` and `Phrase` carry `japanese`, `GrammarPattern` carries `blank` — so the guard needs no discriminant field.

```ts
/**
 * A kanji the ladder introduces and the learner reviews.
 *
 * Distinct from the server's KanjiEntry (src/api/kanji.ts), which serves the
 * JLPT-filtered browse page. This is static content scoped to characters some
 * lesson teaches: the learn flow makes no network calls for lesson content,
 * and it is not going to start.
 *
 * Recognition only, permanently — a review shows the character and asks for
 * meaning and reading. Producing a character is handwriting, which is out of
 * scope, and typing one needs an IME that would answer the question.
 */
export type Kanji = {
  /** "kanji.水" — the ReviewState key. Built by kanjiId(). */
  id: string;
  character: string;
  /** Display slice, at most four. */
  meanings: string[];
  /** Every meaning KANJIDIC2 carries, for search and for component keywords. */
  allMeanings: string[];
  on: string[];
  kun: string[];
  strokes: number | null;
};

/** The ReviewState key for a kanji. Lessons store bare characters. */
export function kanjiId(character: string): string {
  return `kanji.${character}`;
}

export function isKanji(item: Phrase | Word | GrammarPattern | Kanji): item is Kanji {
  return "character" in item;
}
```

Then widen the existing guard, which currently cannot accept a `Kanji`:

```ts
export function isGrammarPattern(item: Phrase | Word | GrammarPattern | Kanji): item is GrammarPattern {
  return "blank" in item;
}
```

- [ ] **Step 2: Write the failing scope test**

Create `src/content/kanji/scope.test.ts`. The `expect(taught.size).toBeGreaterThan(0)` line is not decoration — without it, an empty lesson set would make both assertions pass over nothing.

```ts
import { describe, expect, it } from "vitest";
import { n5Lessons } from "@/content/lessons";
import { allKanji, kanjiByCharacter } from "./index";
import { kanjiId } from "@/types";

describe("kanji content scope", () => {
  const taught = new Set(n5Lessons.flatMap((l) => l.kanji));

  it("has characters to check, so the assertions below cannot pass vacuously", () => {
    expect(taught.size).toBeGreaterThan(0);
  });

  it("has an entry for every character a lesson teaches", () => {
    const missing = [...taught].filter((c) => !kanjiByCharacter.has(c));
    expect(missing).toEqual([]);
  });

  it("has no entry that no lesson teaches", () => {
    const orphans = allKanji.filter((k) => !taught.has(k.character)).map((k) => k.character);
    expect(orphans).toEqual([]);
  });

  it("gives every entry the id the ladder will look it up by", () => {
    for (const k of allKanji) expect(k.id).toBe(kanjiId(k.character));
  });

  it("caps the display slice at four meanings", () => {
    for (const k of allKanji) expect(k.meanings.length).toBeLessThanOrEqual(4);
  });
});
```

- [ ] **Step 3: Run it and confirm it fails for the right reason**

```bash
cd /Users/peterabeln/Documents/japanese/aburungo-kanji-ladder
pnpm exec vitest run src/content/kanji/scope.test.ts
```

Expected: FAIL resolving `./index` — the module does not exist yet. A failure for any other reason means something else is wrong; stop and read it.

- [ ] **Step 4: Write the generator**

Create `scripts/kanji.mjs`. Scope is **derived** from lesson content, never passed in as a list — a generator handed what to include has a hole in it the day a lesson adds a character. The batching mirrors `server/scripts/seed-kanji.ts`, which already calls this API politely.

```js
#!/usr/bin/env node
/**
 * Kanji content generator (docs/superpowers/specs/2026-08-24-kanji-in-the-ladder-design.md).
 *
 *   node scripts/kanji.mjs build   fetch KANJIDIC2 -> src/content/kanji/kanji.yaml
 *
 * Scope is derived: every character in every lesson's `kanji:` array, and
 * nothing else. Rerun after any lesson adds or drops a character —
 * src/content/kanji/scope.test.ts fails if you forget.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src/content/kanji/kanji.yaml");
const API = "https://kanjiapi.dev/v1/kanji";
const BATCH = 20;
const DELAY_MS = 300;

/** Every character any lesson introduces, in first-taught order. */
export function taughtCharacters() {
  const dir = join(ROOT, "src/content/lessons");
  const seen = new Set();
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort()) {
    const text = readFileSync(join(dir, f), "utf8");
    let inKanji = false;
    for (const line of text.split("\n")) {
      if (/^ {2}kanji:\s*$/.test(line)) { inKanji = true; continue; }
      const item = line.match(/^ {4}- (.+?)\s*$/);
      if (inKanji && item) { seen.add(item[1]); continue; }
      if (!/^\s*$/.test(line)) inKanji = false;
    }
  }
  return [...seen];
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchOne(character) {
  const res = await fetch(`${API}/${encodeURIComponent(character)}`);
  if (!res.ok) throw new Error(`${character}: HTTP ${res.status}`);
  return res.json();
}

/** YAML string quoting: only what this data can actually contain. */
function q(s) {
  return `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

async function build() {
  const characters = taughtCharacters();
  if (characters.length === 0) throw new Error("no kanji found in src/content/lessons — refusing to write an empty file");
  console.log(`building ${characters.length} kanji`);

  const entries = [];
  for (let i = 0; i < characters.length; i += BATCH) {
    const batch = characters.slice(i, i + BATCH);
    const details = await Promise.all(batch.map(fetchOne));
    for (const d of details) {
      entries.push({
        character: d.kanji,
        meanings: d.meanings.slice(0, 4),
        allMeanings: d.meanings,
        on: d.on_readings,
        kun: d.kun_readings,
        strokes: d.stroke_count ?? null,
      });
    }
    process.stdout.write(`  ${Math.min(i + BATCH, characters.length)}/${characters.length}\n`);
    if (i + BATCH < characters.length) await sleep(DELAY_MS);
  }

  const lines = [
    "# Generated by `node scripts/kanji.mjs build`. Do not edit.",
    "# Source: KANJIDIC2 via kanjiapi.dev. KANJIDIC2 is CC BY-SA 4.0,",
    "# (c) Electronic Dictionary Research and Development Group.",
    "",
  ];
  for (const e of entries) {
    lines.push(`- character: ${q(e.character)}`);
    lines.push(`  meanings: [${e.meanings.map(q).join(", ")}]`);
    lines.push(`  allMeanings: [${e.allMeanings.map(q).join(", ")}]`);
    lines.push(`  on: [${e.on.map(q).join(", ")}]`);
    lines.push(`  kun: [${e.kun.map(q).join(", ")}]`);
    lines.push(`  strokes: ${e.strokes === null ? "null" : e.strokes}`);
  }
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, lines.join("\n") + "\n");
  console.log(`wrote ${entries.length} entries to src/content/kanji/kanji.yaml`);
}

const cmd = process.argv[2];
if (cmd === "build") await build();
else if (cmd !== undefined) { console.error(`unknown command: ${cmd}`); process.exit(1); }
```

- [ ] **Step 5: Write the schema validator**

Create `src/content/kanji/schema.ts`, mirroring `src/content/vocabulary/schema.ts` — hand-written, no zod, same reason: the schema is small and one file does not justify a dependency.

```ts
/**
 * Runtime validator for generated kanji YAML.
 *
 * Hand-written to match src/content/vocabulary/schema.ts. Validation runs at
 * module load, so bad content fails the build loudly rather than shipping.
 */
import type { Kanji } from "@/types";
import { kanjiId } from "@/types";

class KanjiSchemaError extends Error {
  readonly raw: unknown;
  constructor(message: string, raw: unknown) {
    super(message);
    this.name = "KanjiSchemaError";
    this.raw = raw;
  }
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

export function parseKanji(raw: unknown, source: string): Kanji[] {
  if (!Array.isArray(raw)) {
    throw new KanjiSchemaError(`${source}: top-level value must be an array`, raw);
  }
  const seen = new Set<string>();
  return raw.map((entry) => {
    if (typeof entry !== "object" || entry === null) {
      throw new KanjiSchemaError(`${source}: entry is not an object`, entry);
    }
    const o = entry as Record<string, unknown>;
    const character = o.character;
    if (typeof character !== "string" || character.length === 0) {
      throw new KanjiSchemaError(`${source}: entry missing "character"`, entry);
    }
    for (const key of ["meanings", "allMeanings", "on", "kun"] as const) {
      if (!isStringArray(o[key])) {
        throw new KanjiSchemaError(`${source}: "${character}" has invalid "${key}"`, entry);
      }
    }
    if (o.strokes !== null && typeof o.strokes !== "number") {
      throw new KanjiSchemaError(`${source}: "${character}" has invalid "strokes"`, entry);
    }
    if (seen.has(character)) {
      throw new KanjiSchemaError(`${source}: duplicate kanji "${character}"`, entry);
    }
    seen.add(character);
    return {
      id: kanjiId(character),
      character,
      meanings: o.meanings,
      allMeanings: o.allMeanings,
      on: o.on,
      kun: o.kun,
      strokes: o.strokes,
    };
  });
}
```

- [ ] **Step 6: Write the content index**

Create `src/content/kanji/index.ts`.

```ts
import type { Kanji } from "@/types";
import { parseKanji } from "./schema";
import kanjiRaw from "./kanji.yaml";

export const allKanji: readonly Kanji[] = parseKanji(kanjiRaw, "kanji.yaml");

/** Lessons store bare characters, so lookup is by character rather than id. */
export const kanjiByCharacter: ReadonlyMap<string, Kanji> = new Map(allKanji.map((k) => [k.character, k]));
```

- [ ] **Step 7: Generate the content**

```bash
cd /Users/peterabeln/Documents/japanese/aburungo-kanji-ladder
node scripts/kanji.mjs build
```

Expected: `building 200 kanji`, progress lines, then `wrote 200 entries`. If the count is not 200, the `taughtCharacters()` parser is wrong — read `src/content/lessons/n5-02-food-drink.yaml` and check the indentation it expects against what is there before going further.

- [ ] **Step 8: Run the test and confirm it passes**

```bash
pnpm exec vitest run src/content/kanji/scope.test.ts
```

Expected: PASS, 5 tests.

- [ ] **Step 9: Prove the scope test can actually fail**

A guard nobody has watched fail is a guess. Add a character to a lesson, confirm the *right* assertion fires, then revert.

```bash
# add 週 to the first lesson's kanji list by hand, then:
pnpm exec vitest run src/content/kanji/scope.test.ts
# Expected: FAIL on "has an entry for every character a lesson teaches", listing ["週"]
git checkout src/content/lessons/
pnpm exec vitest run src/content/kanji/scope.test.ts   # back to PASS
```

- [ ] **Step 10: Full check and commit**

```bash
pnpm build && pnpm test
git add src/types.ts scripts/kanji.mjs src/content/kanji/
git commit -m "feat(kanji): add the Kanji type and its generated content"
```

---

### Task 2: Kanji in the daily loop

**Files:**
- Modify: `src/srs/dailyLoop.ts`
- Test: `src/srs/dailyLoop.test.ts`

**Interfaces:**
- Consumes: `Kanji`, `kanjiId` from Task 1.
- Produces:
  - `buildDailySession(book, progress, allWords, allPhrases, allPatterns, allKanji, reviewStates, now, prior?)` — note `allKanji` is the **sixth** positional parameter, inserted after `allPatterns`.
  - `DailySession.newKanji: Kanji[]`
  - `DailySession.reviewItems: Array<Phrase | Word | GrammarPattern | Kanji>`

**Note for the reviewer:** kanji are deliberately **not** tier-filtered the way words and phrases are. They are looked up by id from lessons the learner has seen, and `book.lessons` is already book-scoped, so the lesson graph does the scoping. `allKanji` is a lookup table, not a permission surface.

- [ ] **Step 1: Write the failing tests**

Append to `src/srs/dailyLoop.test.ts`. These use a **pure fixture**, not real content, and that is the point: written against Book One they would pass for the wrong reason, because every lesson teaches kanji and the assertions could never distinguish "wired up" from "coincidence".

```ts
describe("kanji in the daily session", () => {
  const kanjiSun: Kanji = {
    id: "kanji.日", character: "日", meanings: ["day"], allMeanings: ["day", "sun"],
    on: ["ニチ"], kun: ["ひ"], strokes: 4,
  };
  const kanjiWater: Kanji = {
    id: "kanji.水", character: "水", meanings: ["water"], allMeanings: ["water"],
    on: ["スイ"], kun: ["みず"], strokes: 4,
  };

  const seenLesson: Lesson = {
    id: "l1", order: 1, situation: "s", title: "seen", canDo: "c",
    wordIds: [], phraseIds: [], kanji: ["日"], grammarNote: "",
  };
  const nextLesson: Lesson = {
    id: "l2", order: 2, situation: "s", title: "next", canDo: "c",
    wordIds: [], phraseIds: [], kanji: ["水"], grammarNote: "",
  };
  const book = { ...bookOne, lessons: [seenLesson, nextLesson] };
  const progress = { pathId: "n5", seenLessonIds: ["l1"] } as PathProgress;

  it("puts an unseen lesson's kanji in newKanji", () => {
    const s = buildDailySession(book, progress, [], [], [], [kanjiSun, kanjiWater], [], 1000);
    expect(s.newKanji).toEqual([kanjiWater]);
  });

  it("puts a seen lesson's due kanji in reviewItems", () => {
    const due: ReviewState = { phraseId: "kanji.日", box: 1, dueAt: 500, lastReviewedAt: 0 };
    const s = buildDailySession(book, progress, [], [], [], [kanjiSun, kanjiWater], [due], 1000);
    expect(s.reviewItems).toEqual([kanjiSun]);
  });

  it("leaves an unseen lesson's kanji out of reviewItems even when due", () => {
    const due: ReviewState = { phraseId: "kanji.水", box: 1, dueAt: 500, lastReviewedAt: 0 };
    const s = buildDailySession(book, progress, [], [], [], [kanjiSun, kanjiWater], [due], 1000);
    expect(s.reviewItems).toEqual([]);
  });

  it("leaves a not-yet-due kanji out of reviewItems", () => {
    const notDue: ReviewState = { phraseId: "kanji.日", box: 3, dueAt: 9000, lastReviewedAt: 0 };
    const s = buildDailySession(book, progress, [], [], [], [kanjiSun, kanjiWater], [notDue], 1000);
    expect(s.reviewItems).toEqual([]);
  });
});
```

Import `Kanji` and `Lesson` as types at the top of the file if they are not already imported, and `bookOne` from `@/content/books`.

- [ ] **Step 2: Run and confirm the failure**

```bash
pnpm exec vitest run src/srs/dailyLoop.test.ts
```

Expected: FAIL — a TypeScript arity error on `buildDailySession` (it takes 8 parameters, these calls pass 9). That is the right failure.

- [ ] **Step 3: Widen the types in `src/srs/dailyLoop.ts`**

Add `Kanji` and `kanjiId` to the existing type import from `@/types` — `kanjiId` is a value, so it needs a separate non-type import.

```ts
import type { Book, EpochMs, GrammarPattern, Kanji, PathProgress, Phrase, ReviewState, Lesson, Word } from "@/types";
import { kanjiId } from "@/types";
```

Then the session shape:

```ts
export type DailySession = {
  lesson: Lesson | null;
  /** Due items (words, phrases, grammar patterns, and kanji) from seen lessons, oldest-due first. */
  reviewItems: Array<Phrase | Word | GrammarPattern | Kanji>;
  newWords: Word[];
  newPhrases: Phrase[];
  newGrammarPattern: GrammarPattern | null;
  /** This session's new-lesson kanji, in lesson order. Empty once `lesson` is null. */
  newKanji: Kanji[];
};
```

- [ ] **Step 4: Wire kanji through the function body**

Add the parameter after `allPatterns`:

```ts
  allPatterns: readonly GrammarPattern[],
  allKanji: readonly Kanji[],
  reviewStates: readonly ReviewState[],
```

Inside the `seenItemIds` loop, alongside the existing `wordIds`/`phraseIds`/`patternId` lines:

```ts
      for (const c of lesson.kanji) seenItemIds.add(kanjiId(c));
```

Add the lookup map beside the existing three:

```ts
  const kanjiById = new Map(allKanji.map((k) => [k.id, k]));
```

Extend the `reviewItems` resolution and its type predicate:

```ts
    .map((s) => wordById.get(s.phraseId) ?? phraseById.get(s.phraseId) ?? patternById.get(s.phraseId) ?? kanjiById.get(s.phraseId))
    .filter((item): item is Phrase | Word | GrammarPattern | Kanji => item !== undefined);
```

Add `newKanji` beside `newWords`, resolving through a character map since lessons store bare characters:

```ts
  const kanjiByCharacter = new Map(allKanji.map((k) => [k.character, k]));
  const newKanji =
    nextUnit === null ? [] : nextUnit.kanji.map((c) => kanjiByCharacter.get(c)).filter((k): k is Kanji => k !== undefined);
```

And return it:

```ts
  return { lesson: nextUnit, reviewItems, newWords, newPhrases, newGrammarPattern, newKanji };
}
```

- [ ] **Step 5: Update the one production call site**

In `src/pages/LearnPage.tsx` around line 620, add the import and the argument:

```ts
import { allKanji } from "@/content/kanji";
```

```ts
      const built = buildDailySession(book, progress, words, phrases, allGrammarPatterns, allKanji, reviewStates, Date.now(), prior);
```

- [ ] **Step 6: Run tests and confirm they pass**

```bash
pnpm exec vitest run src/srs/dailyLoop.test.ts
```

Expected: PASS, including the four new tests. Existing `dailyLoop` tests will also need the extra argument — pass `[]` for `allKanji` in any that do not care about kanji.

- [ ] **Step 7: Full check and commit**

```bash
pnpm build && pnpm test
git add src/srs/dailyLoop.ts src/srs/dailyLoop.test.ts src/pages/LearnPage.tsx
git commit -m "feat(kanji): schedule lesson kanji through the daily loop"
```

---

### Task 3: The introduction surface

**Files:**
- Create: `src/components/KanjiIntroCard.tsx`
- Test: `src/components/KanjiIntroCard.dom.test.tsx`
- Modify: `src/pages/LearnPage.tsx:301-315`

**Interfaces:**
- Consumes: `Kanji` from Task 1, `DailySession.newKanji` from Task 2.
- Produces: `function KanjiIntroCard(props: { kanji: Kanji })`

**Design note:** this card is presentation only and carries **no rating**. An introduction is not a review; the item's first review arrives on its own schedule through Task 2. It is deliberately thin so the follow-on component layer has somewhere to land.

- [ ] **Step 1: Write the failing test**

Create `src/components/KanjiIntroCard.dom.test.tsx`, following the naming of the existing `.dom.test.tsx` files.

```tsx
import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { KanjiIntroCard } from "./KanjiIntroCard";
import type { Kanji } from "@/types";

const water: Kanji = {
  id: "kanji.水", character: "水", meanings: ["water"], allMeanings: ["water"],
  on: ["スイ"], kun: ["みず"], strokes: 4,
};

describe("KanjiIntroCard", () => {
  afterEach(cleanup);

  it("shows the character", () => {
    render(<KanjiIntroCard kanji={water} />);
    expect(screen.getByText("水")).toBeTruthy();
  });

  it("shows the meaning and both readings", () => {
    render(<KanjiIntroCard kanji={water} />);
    expect(screen.getByText("water")).toBeTruthy();
    expect(screen.getByText("スイ")).toBeTruthy();
    expect(screen.getByText("みず")).toBeTruthy();
  });

  it("renders a kanji with no readings without crashing", () => {
    const bare: Kanji = { ...water, on: [], kun: [] };
    render(<KanjiIntroCard kanji={bare} />);
    expect(screen.getByText("水")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run and confirm it fails**

```bash
pnpm exec vitest run src/components/KanjiIntroCard.dom.test.tsx
```

Expected: FAIL resolving `./KanjiIntroCard`.

- [ ] **Step 3: Write the component**

```tsx
import type { Kanji } from "@/types";

type Props = { kanji: Kanji };

/**
 * Introduces one kanji in the new-lesson step.
 *
 * Presentation only — no rating. An introduction is not a review; the item's
 * first review arrives on its own schedule via the daily loop. No JLPT level
 * is shown: the learner never reads one (DR-024).
 */
export function KanjiIntroCard({ kanji }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center gap-4">
        <span
          lang="ja"
          className="text-[4rem] font-medium leading-none text-fg"
          style={{ fontFamily: "var(--font-jp)" }}
        >
          {kanji.character}
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-body font-semibold text-fg">{kanji.meanings.join(", ")}</p>
          {kanji.strokes !== null && (
            <p className="text-caption text-fg-subtle">{kanji.strokes} strokes</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {kanji.on.length > 0 && (
          <p className="text-body-sm text-fg-subtle">
            On: <span lang="ja" style={{ fontFamily: "var(--font-jp)" }}>{kanji.on.join("、")}</span>
          </p>
        )}
        {kanji.kun.length > 0 && (
          <p className="text-body-sm text-fg-subtle">
            Kun: <span lang="ja" style={{ fontFamily: "var(--font-jp)" }}>{kanji.kun.join("、")}</span>
          </p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run and confirm it passes**

```bash
pnpm exec vitest run src/components/KanjiIntroCard.dom.test.tsx
```

Expected: PASS, 3 tests.

- [ ] **Step 5: Replace the bare-glyph block in `LearnPage.tsx`**

The block at lines 301-315 currently maps `lesson.kanji` (bare strings) into styled spans. Replace it so it maps `newKanji` (real `Kanji` objects) into cards. The `NewLessonStep` component needs `newKanji` passed down from the session — add it to that component's props alongside the existing `pattern` prop.

```tsx
        {newKanji.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-body-sm font-medium text-fg-subtle">New kanji today</p>
            <div className="flex flex-col gap-2">
              {newKanji.map((k) => (
                <KanjiIntroCard key={k.id} kanji={k} />
              ))}
            </div>
          </div>
        )}
```

Add the import:

```tsx
import { KanjiIntroCard } from "@/components/KanjiIntroCard";
```

- [ ] **Step 6: Full check and commit**

```bash
pnpm build && pnpm test
git add src/components/KanjiIntroCard.tsx src/components/KanjiIntroCard.dom.test.tsx src/pages/LearnPage.tsx
git commit -m "feat(kanji): introduce lesson kanji on a real card"
```

---

### Task 4: The review surface

**Files:**
- Modify: `src/components/KanjiDrillCard.tsx:1-18`
- Modify: `src/pages/LearnPage.tsx` (`ReviewStep`)
- Test: `src/components/KanjiDrillCard.dom.test.tsx`

**Interfaces:**
- Consumes: `Kanji` and `isKanji` from Task 1, `reviewItems` from Task 2.
- Produces: `KanjiDrillCard` accepting either a server `KanjiEntry` or a content `Kanji`.

**The JLPT trap, and why this task exists at all:** `KanjiDrillCard` currently renders an `N{jlptLevel}` badge on both faces. That is correct on `KanjiPage`, which is an explicitly JLPT-filtered browse surface. It is **wrong in the ladder**, where the learner never reads a level (DR-024). Widening the prop with an optional `jlptLevel` and passing content kanji that simply lack the field makes the badge disappear on its own — no conditional, no flag.

- [ ] **Step 1: Write the failing test**

Create `src/components/KanjiDrillCard.dom.test.tsx`.

```tsx
import { describe, expect, it, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { KanjiDrillCard } from "./KanjiDrillCard";
import type { Kanji } from "@/types";

const water: Kanji = {
  id: "kanji.水", character: "水", meanings: ["water"], allMeanings: ["water"],
  on: ["スイ"], kun: ["みず"], strokes: 4,
};

const noop = () => {};

describe("KanjiDrillCard with ladder content", () => {
  afterEach(cleanup);

  it("accepts a content Kanji, which has no jlptLevel field", () => {
    render(
      <KanjiDrillCard kanji={water} phase="idle" onReveal={noop} onRate={noop} onEntered={noop} onExited={noop} />,
    );
    expect(screen.getAllByText("水").length).toBeGreaterThan(0);
  });

  it("shows no JLPT badge for ladder content — the learner never reads a level", () => {
    render(
      <KanjiDrillCard kanji={water} phase="idle" onReveal={noop} onRate={noop} onEntered={noop} onExited={noop} />,
    );
    expect(screen.queryByText(/^N[1-5]$/)).toBeNull();
  });

  it("still shows the badge when a level is supplied, as KanjiPage does", () => {
    const withLevel = { ...water, jlptLevel: 5 };
    render(
      <KanjiDrillCard kanji={withLevel} phase="idle" onReveal={noop} onRate={noop} onEntered={noop} onExited={noop} />,
    );
    expect(screen.getAllByText("N5").length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run and confirm it fails**

```bash
pnpm exec vitest run src/components/KanjiDrillCard.dom.test.tsx
```

Expected: FAIL — a TypeScript error that `Kanji` is not assignable to `KanjiEntry` (missing `meanings` shape is fine, but `onReadings`, `kunReadings`, `strokeCount`, `jlptLevel`, `joyoGrade` are absent).

- [ ] **Step 3: Widen the prop to the structural minimum the card actually reads**

Replace the top of `src/components/KanjiDrillCard.tsx`. The card reads only `character`, `meanings`, `onReadings`/`kunReadings` and `jlptLevel`, so the prop describes exactly that — and accepts both naming shapes, since the server type and the content type disagree on reading field names.

```tsx
import { FlipCard } from "aburungo-design-system";
import type { FlipCardPhase } from "aburungo-design-system";

export type DrillPhase = "entering" | "idle" | "revealed" | "exiting";

/**
 * The minimum a drill card needs, satisfied by both the server's KanjiEntry
 * (src/api/kanji.ts) and the ladder's Kanji (src/types.ts). The two disagree
 * on reading field names, so both are accepted and normalised below.
 *
 * jlptLevel is optional on purpose: ladder content omits it, so the badge
 * disappears without a conditional. The learner never reads a level (DR-024);
 * KanjiPage is the one surface that legitimately shows one.
 */
export type DrillableKanji = {
  character: string;
  meanings: string[];
  onReadings?: string[];
  kunReadings?: string[];
  on?: string[];
  kun?: string[];
  jlptLevel?: number | null;
};

type Props = {
  kanji: DrillableKanji;
  phase: DrillPhase;
  onReveal: () => void;
  onRate: (correct: boolean) => void;
  onEntered: () => void;
  onExited: () => void;
};
```

Inside the component body, normalise the two shapes once, before the return:

```tsx
  const onReadings = kanji.onReadings ?? kanji.on ?? [];
  const kunReadings = kanji.kunReadings ?? kanji.kun ?? [];
```

Then replace every `kanji.onReadings` / `kanji.kunReadings` usage in the JSX with the local `onReadings` / `kunReadings`, and change both badge guards from `kanji.jlptLevel != null` to the same expression — it already handles `undefined` correctly, so no edit is needed there.

- [ ] **Step 4: Run and confirm it passes**

```bash
pnpm exec vitest run src/components/KanjiDrillCard.dom.test.tsx
```

Expected: PASS, 3 tests. Then confirm `KanjiPage` still compiles: `pnpm build`.

- [ ] **Step 5: Dispatch kanji in `ReviewStep`**

In `src/pages/LearnPage.tsx`, widen the `ReviewStep` `items` prop and add the branch. Place it **before** the `isGrammarPattern` branch for readability; the guards are mutually exclusive so order does not affect behaviour.

```tsx
  items: Array<Phrase | Word | GrammarPattern | Kanji>;
```

Add a handler beside the existing `handleGrammarNext`, which it mirrors exactly:

```tsx
  function handleKanjiNext(correct: boolean) {
    const item = items[index];
    if (item !== undefined) void recordReview(item.id, correct, signedIn);
    advance();
  }
```

And the branch, above `if (isGrammarPattern(current))`:

```tsx
  if (isKanji(current)) {
    return (
      <div className="flex w-full flex-col gap-4 py-4">
        <p className="text-body-sm text-fg-subtle">
          Review · {index + 1} / {items.length}
        </p>
        <ProgressBar value={(index + 1) / items.length} />
        <KanjiDrillCard
          key={current.id}
          kanji={current}
          phase={phase === "entering" ? "entering" : "idle"}
          onReveal={() => setPhase("idle")}
          onRate={(correct) => handleKanjiNext(correct)}
          onEntered={() => setPhase("idle")}
          onExited={() => {}}
        />
      </div>
    );
  }
```

Update the imports:

```tsx
import type { Book, GrammarPattern, Kanji, Phrase, ReviewRating, Lesson, Word } from "@/types";
import { isGrammarPattern, isKanji } from "@/types";
import { KanjiDrillCard } from "@/components/KanjiDrillCard";
```

Also widen the `staged` state, which currently holds `Phrase | Word | null` and is set from a non-grammar item — a kanji must not be staged into the flashcard path:

```tsx
      setStaged(!isGrammarPattern(item) && !isKanji(item) ? item : null);
```

- [ ] **Step 6: Full check**

```bash
pnpm build && pnpm test
```

Expected: all tests pass.

- [ ] **Step 7: Walk the whole ladder**

This is the check that the loop still terminates now that sessions carry 200 more items.

```bash
pnpm walkthrough
```

Expected: reaches "All caught up" with no console or page errors. First run needs `pnpm exec playwright install chromium`. If it stalls, the kanji branch is not advancing — check that `onRate` reaches `advance()`.

- [ ] **Step 8: Confirm the ladder doc is untouched**

```bash
pnpm ladder && git diff --exit-code docs/book-one-ladder.md && echo "ladder byte-identical"
```

Expected: no diff. A diff here means lesson content changed, which this plan never intends.

- [ ] **Step 9: Commit**

```bash
git add src/components/KanjiDrillCard.tsx src/components/KanjiDrillCard.dom.test.tsx src/pages/LearnPage.tsx
git commit -m "feat(kanji): review lesson kanji in the daily loop"
```

---

## Self-review

**Spec coverage.** Decision 1 (type, lesson YAML unchanged) → Task 1 + Step 8 of Task 4. Decision 2 (static, generated, client-side) → Task 1. Decision 3 (no new scheduling concept) → Task 2, which reuses `ReviewState`/`isDue` untouched. Decision 4 (recognition only) → Task 4; nothing in the plan adds a production path. Decision 5 (reuse `KanjiDrillCard`) → Task 4. Decision 6 (`KanjiPage` out of scope) → no task touches it beyond keeping it compiling, asserted in Task 4 Step 4.

Spec testing section: "every taught character resolves" → Task 1 Step 2; "not stale" → replaced by the scope check, divergence documented above; "kanji reach `reviewItems`" and "reach `newKanji`" → Task 2 Step 1, on fixtures; "guard is exclusive" → partly covered by TypeScript arity and the `staged` fix, and asserted directly by Task 4's badge tests; "ladder unchanged" → Task 4 Step 8; "walkthrough" → Task 4 Step 7.

**Gap found and closed:** the spec asks for an explicit guard-exclusivity test that no task asserted directly. Add this to `src/content/kanji/scope.test.ts` in Task 1 Step 2:

```ts
  it("has a guard that does not match words, phrases or patterns", () => {
    const first = allKanji[0];
    expect(first).toBeDefined();
    if (first === undefined) return;
    expect(isKanji(first)).toBe(true);
    expect(isGrammarPattern(first)).toBe(false);
  });
```

with `isKanji, isGrammarPattern` added to the `@/types` import.

**Placeholder scan.** No TBD, no "handle edge cases", no "similar to Task N". Every code step carries runnable code.

**Type consistency.** `Kanji` fields are `on`/`kun` throughout Tasks 1–3; Task 4 accepts both those and the server's `onReadings`/`kunReadings` and says why. `kanjiId()` is defined in Task 1 and used in Tasks 1 and 2. `allKanji` is the sixth positional parameter in Task 2 and at the Task 2 Step 5 call site. `newKanji` is produced in Task 2 and consumed in Task 3.
