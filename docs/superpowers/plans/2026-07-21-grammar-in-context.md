# Grammar-in-context Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retrofit the 35 existing N5 `Unit.grammarNote` strings into first-class, reviewable `GrammarPattern` SRS items — proving the grammar-in-context mechanism before N4 content authoring begins.

**Architecture:** A new `GrammarPattern` domain type, its own content module (`src/content/grammar/`) mirroring `src/content/units/`, and its own review card (`GrammarClozeCard`) — kept as a sibling bucket to `Phrase`/`Word`, not merged into that union. Reuses the existing `ReviewState`/Leitner persistence with zero schema changes. Interleaves into the *existing* Review and Produce steps in `LearnPage` (both become item-kind-aware) rather than adding a new loop step.

**Tech Stack:** TypeScript, React 19, Vitest, YAML content files, existing Dexie/IndexedDB persistence.

## Global Constraints

- No fabricated Japanese content — every `GrammarPattern.phraseId` must reference a real, already-existing `Phrase`; blanks are marked on existing content, never new sentences composed from scratch.
- Every new/modified YAML content file needs `content-source: training` / `jlpt-source: training` header comments, matching the existing convention.
- `src/srs/` stays pure — no React, no DB, no fetch; `now` is always a parameter.
- No `any`, no `as` casts except at validated trust boundaries (matching the existing schema.ts convention).
- `verbatimModuleSyntax` is on — use `import type` for type-only imports.
- Run `pnpm build`, `pnpm test`, and `pnpm lint` before considering any task complete — a task isn't done if the build is red, even transiently. (Task 4 below is deliberately sized around this: the orchestrator's widened return type and its `LearnPage` consumer are type-coupled tightly enough that splitting them into separately-buildable tasks isn't possible without a throwaway cast, so they're one task.)
- Reference: `docs/superpowers/specs/2026-07-21-grammar-in-context-design.md` is the approved design this plan implements.

---

## Task 1: GrammarPattern type + content schema validator

**Files:**
- Modify: `src/types.ts`
- Create: `src/content/grammar/schema.ts`
- Test: `src/content/grammar/schema.test.ts`

**Interfaces:**
- Produces: `GrammarPattern` type (`id`, `jlpt`, `pattern`, `gloss`, `phraseId`, `blank`), `isGrammarPattern()` type guard, `Unit.patternId?: string`, `parseGrammarPattern(raw, source, phrasesById)`, `parseGrammarPatterns(raw, source, phrasesById)` where `phrasesById: Map<string, Phrase>`.

- [ ] **Step 1: Add the `GrammarPattern` type, `isGrammarPattern` guard, and `Unit.patternId` field to `src/types.ts`**

Find the `Unit` type (currently ends with `grammarNote: string;` then `};`) and insert the new type immediately before it, then add `patternId` to `Unit`:

```ts
/**
 * A grammar pattern taught and reviewed as its own SRS item, distinct from
 * Word/Phrase. The example is an existing Phrase, referenced not duplicated;
 * `blank` is the substring of that phrase's `reading` blanked out for the
 * cloze review card (see
 * docs/superpowers/specs/2026-07-21-grammar-in-context-design.md).
 */
export type GrammarPattern = {
  id: string;
  jlpt: JlptLevel;
  /** Display form of the pattern, e.g. "～は～です". */
  pattern: string;
  /** Short English explanation. */
  gloss: string;
  /** An existing Phrase id that demonstrates the pattern. Reused, never duplicated. */
  phraseId: string;
  /** Substring of that phrase's `reading` to blank out. Must appear exactly once. */
  blank: string;
};

/** Type guard — distinguishes GrammarPattern from Phrase/Word in a mixed review queue. */
export function isGrammarPattern(item: Phrase | Word | GrammarPattern): item is GrammarPattern {
  return "blank" in item;
}
```

Then in the existing `Unit` type, add one field after `grammarNote: string;`:

```ts
  /** Short training-sourced explanation of the unit's grammar pattern. */
  grammarNote: string;
  /** The GrammarPattern id this unit introduces, if any — not every unit has one. */
  patternId?: string;
};
```

- [ ] **Step 2: Write the failing schema validator test**

Create `src/content/grammar/schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { Phrase } from "@/types";
import { parseGrammarPattern, parseGrammarPatterns } from "./schema";

const phrase = (id: string, reading: string): Phrase => ({
  id,
  japanese: reading,
  reading,
  romaji: reading,
  english: id,
  scenario: "test",
});

const phrasesById = new Map<string, Phrase>([
  ["p1", phrase("p1", "これはほんです")],
  ["p2", phrase("p2", "これはほんですです")], // deliberately has "です" twice, for the ambiguous-blank test
]);

const validRaw = {
  id: "grammar.test-1",
  jlpt: "N5",
  pattern: "～は～です",
  gloss: "X is Y",
  phraseId: "p1",
  blank: "です",
};

describe("parseGrammarPattern", () => {
  it("parses a valid entry", () => {
    const result = parseGrammarPattern(validRaw, "test.yaml", phrasesById);
    expect(result).toEqual({
      id: "grammar.test-1",
      jlpt: "N5",
      pattern: "～は～です",
      gloss: "X is Y",
      phraseId: "p1",
      blank: "です",
    });
  });

  it("throws when phraseId doesn't resolve", () => {
    const raw = { ...validRaw, phraseId: "missing" };
    expect(() => parseGrammarPattern(raw, "test.yaml", phrasesById)).toThrow(/unknown phrase id/);
  });

  it("throws when blank doesn't appear in the phrase's reading", () => {
    const raw = { ...validRaw, blank: "ですね" };
    expect(() => parseGrammarPattern(raw, "test.yaml", phrasesById)).toThrow(/appears 0 time/);
  });

  it("throws when blank appears more than once", () => {
    const raw = { ...validRaw, phraseId: "p2", blank: "です" };
    expect(() => parseGrammarPattern(raw, "test.yaml", phrasesById)).toThrow(/appears 2 time/);
  });

  it("throws on invalid jlpt", () => {
    const raw = { ...validRaw, jlpt: "N9" };
    expect(() => parseGrammarPattern(raw, "test.yaml", phrasesById)).toThrow(/invalid jlpt/);
  });

  it("throws on missing required field", () => {
    const { pattern: _pattern, ...raw } = validRaw;
    expect(() => parseGrammarPattern(raw, "test.yaml", phrasesById)).toThrow(/missing or empty field "pattern"/);
  });
});

describe("parseGrammarPatterns", () => {
  it("parses an array of valid entries", () => {
    const raw = [validRaw, { ...validRaw, id: "grammar.test-2" }];
    const result = parseGrammarPatterns(raw, "test.yaml", phrasesById);
    expect(result.map((p) => p.id)).toEqual(["grammar.test-1", "grammar.test-2"]);
  });

  it("throws on duplicate id", () => {
    const raw = [validRaw, validRaw];
    expect(() => parseGrammarPatterns(raw, "test.yaml", phrasesById)).toThrow(/duplicate grammar pattern id/);
  });

  it("throws when top-level value isn't an array", () => {
    expect(() => parseGrammarPatterns({ not: "an array" }, "test.yaml", phrasesById)).toThrow(/must be an array/);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm test src/content/grammar/schema.test.ts`
Expected: FAIL — `./schema` module doesn't exist yet (`Cannot find module './schema'` or similar).

- [ ] **Step 4: Implement the validator**

Create `src/content/grammar/schema.ts`:

```ts
/**
 * Runtime validator for hand-authored GrammarPattern YAML.
 *
 * Mirrors the pattern in units/schema.ts. In addition to shape checks,
 * verifies phraseId resolves to an existing phrase and that blank appears
 * in that phrase's reading exactly once — an ambiguous or missing blank is
 * always an authoring mistake, not a runtime concern.
 */
import type { GrammarPattern, JlptLevel, Phrase } from "@/types";

const JLPT_LEVELS = new Set<string>(["N5", "N4", "N3", "N2", "N1"]);

function isString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

class GrammarPatternSchemaError extends Error {
  readonly raw: unknown;
  constructor(message: string, raw: unknown) {
    super(message);
    this.name = "GrammarPatternSchemaError";
    this.raw = raw;
  }
}

export function parseGrammarPattern(raw: unknown, source: string, phrasesById: Map<string, Phrase>): GrammarPattern {
  if (typeof raw !== "object" || raw === null) {
    throw new GrammarPatternSchemaError(`${source}: entry is not an object`, raw);
  }
  const o = raw as Record<string, unknown>;

  for (const key of ["id", "pattern", "gloss", "phraseId", "blank"] as const) {
    if (!isString(o[key])) {
      throw new GrammarPatternSchemaError(`${source}: entry "${String(o.id ?? "?")}" missing or empty field "${key}"`, raw);
    }
  }
  if (typeof o.jlpt !== "string" || !JLPT_LEVELS.has(o.jlpt)) {
    throw new GrammarPatternSchemaError(`${source}: entry "${String(o.id)}" has invalid jlpt "${String(o.jlpt)}"`, raw);
  }

  const phraseId = o.phraseId as string;
  const phrase = phrasesById.get(phraseId);
  if (phrase === undefined) {
    throw new GrammarPatternSchemaError(`${source}: entry "${String(o.id)}" references unknown phrase id "${phraseId}"`, raw);
  }

  const blank = o.blank as string;
  const occurrences = phrase.reading.split(blank).length - 1;
  if (occurrences !== 1) {
    throw new GrammarPatternSchemaError(
      `${source}: entry "${String(o.id)}" blank "${blank}" appears ${occurrences} time(s) in phrase "${phraseId}" reading "${phrase.reading}" — must appear exactly once`,
      raw,
    );
  }

  return {
    id: o.id as string,
    jlpt: o.jlpt as JlptLevel,
    pattern: o.pattern as string,
    gloss: o.gloss as string,
    phraseId,
    blank,
  };
}

export function parseGrammarPatterns(raw: unknown, source: string, phrasesById: Map<string, Phrase>): GrammarPattern[] {
  if (!Array.isArray(raw)) {
    throw new GrammarPatternSchemaError(`${source}: top-level value must be an array`, raw);
  }
  const patterns = raw.map((entry) => parseGrammarPattern(entry, source, phrasesById));

  const seen = new Set<string>();
  for (const p of patterns) {
    if (seen.has(p.id)) {
      throw new GrammarPatternSchemaError(`${source}: duplicate grammar pattern id "${p.id}"`, p);
    }
    seen.add(p.id);
  }
  return patterns;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test src/content/grammar/schema.test.ts`
Expected: PASS, 9 tests.

- [ ] **Step 6: Full verification and commit**

Run: `pnpm build && pnpm lint && pnpm test`
Expected: all pass (the new test file adds to the existing suite; nothing else references the new type/module yet, so build/lint should be clean).

```bash
git add src/types.ts src/content/grammar/schema.ts src/content/grammar/schema.test.ts
git commit -m "feat(grammar): add GrammarPattern type and content schema validator"
```

---

## Task 2: Grammar content loader + author Units 1-2, wire Unit.patternId validation

**Files:**
- Create: `src/content/grammar/n5.yaml`
- Create: `src/content/grammar/index.ts`
- Modify: `src/content/units/schema.ts`
- Modify: `src/content/units/index.ts`
- Modify: `src/content/units/n5.yaml`

**Interfaces:**
- Consumes: `parseGrammarPatterns` from Task 1; `allPhrases` from `@/content/index`; `allWords` from `@/content/vocabulary`.
- Produces: `allGrammarPatterns: GrammarPattern[]`, `findGrammarPattern(id): GrammarPattern | undefined` from `src/content/grammar/index.ts`; `parseUnits` gains a `knownPatternIds: Set<string>` parameter.

- [ ] **Step 1: Author grammar patterns for Units 1 and 2**

Create `src/content/grammar/n5.yaml`. Unit 1's phrase `basics.this-is-a-book` (reading `これはほんです`) directly demonstrates its `～は～です` pattern. Unit 2's `grammarNote` is `～ですね`, but none of its four phrases end in ですね (they end in です/ですか) — per the design spec's fallback rule, use the closest representative phrase (`basics.hello-how-are-you`, reading `こんにちは、おげんきですか`) and blank the shared `です` rather than forcing an exact ですね match. Unit 3 deliberately gets no entry here — neither of its phrases (`greetings.nice-to-meet-you`, `greetings.yoroshiku`) demonstrates its `わたしは～です` pattern, so its `patternId` stays unset, proving the fallback-to-unset path works end to end:

```yaml
# N5 grammar patterns — retrofit of Unit grammarNotes into first-class,
# reviewable GrammarPattern items. See
# docs/superpowers/specs/2026-07-21-grammar-in-context-design.md for the
# design and docs/plans/02b-n5-units.md for the source unit map. Each
# pattern references an existing phrase rather than composing new Japanese
# content — no new example sentences are authored here.
# content-source: training — N5 canonical vocabulary, pending JMdict seed verification
# jlpt-source: training

- id: grammar.n5-unit-1
  jlpt: N5
  pattern: "～は～です"
  gloss: "X is Y — the fundamental copula."
  phraseId: basics.this-is-a-book
  blank: です

- id: grammar.n5-unit-2
  jlpt: N5
  pattern: "～ですね"
  gloss: "Confirmation / softening (\"It is, isn't it?\")"
  # No unit-2 phrase ends in ですね specifically (they end in ですか) — using
  # the closest representative phrase per the fallback rule in the design
  # spec; blanks the shared です rather than forcing an exact ですね match.
  phraseId: basics.hello-how-are-you
  blank: です
```

- [ ] **Step 2: Create the content loader**

Create `src/content/grammar/index.ts`:

```ts
/**
 * Compiles grammar-pattern YAML into a single typed, validated list.
 *
 * Add a new pattern file by creating src/content/grammar/<path>.yaml and
 * pushing it into `allGrammarPatterns` below (or a new export, for N4+
 * ladders later) — mirrors src/content/units/index.ts.
 */
import type { GrammarPattern } from "@/types";
import { parseGrammarPatterns } from "./schema";
import { allPhrases } from "@/content/index";

import n5Raw from "./n5.yaml";

const phrasesById = new Map(allPhrases.map((p) => [p.id, p]));

export const allGrammarPatterns: GrammarPattern[] = [...parseGrammarPatterns(n5Raw, "grammar/n5.yaml", phrasesById)];

export function findGrammarPattern(id: string): GrammarPattern | undefined {
  return allGrammarPatterns.find((p) => p.id === id);
}
```

- [ ] **Step 3: Wire `patternId` validation into the Unit schema**

In `src/content/units/schema.ts`, add a `patternId` check inside `parseUnit` — insert immediately after the existing `wordIds`/`phraseIds`/`kanji` loop (before the `return`):

```ts
  if (o.patternId !== undefined && !isString(o.patternId)) {
    throw new UnitSchemaError(`${source}: entry "${String(o.id)}" has invalid "patternId"`, raw);
  }
```

Add `patternId: o.patternId as string | undefined,` to the object returned by `parseUnit`.

Change `parseUnits`'s signature to accept a fourth set, and validate it inside the existing per-unit loop (alongside the `wordIds`/`phraseIds` checks):

```ts
export function parseUnits(
  raw: unknown,
  source: string,
  knownWordIds: Set<string>,
  knownPhraseIds: Set<string>,
  knownPatternIds: Set<string>,
): Unit[] {
```

```ts
    if (u.patternId !== undefined && !knownPatternIds.has(u.patternId)) {
      throw new UnitSchemaError(`${source}: unit "${u.id}" references unknown pattern id "${u.patternId}"`, u);
    }
```

- [ ] **Step 4: Wire the loader into `content/units/index.ts`**

Add the import and build the new set; pass it to all 9 existing `parseUnits(...)` calls:

```ts
import type { Unit } from "@/types";
import { parseUnits } from "./schema";
import { allWords } from "@/content/vocabulary";
import { allPhrases } from "@/content/index";
import { allGrammarPatterns } from "@/content/grammar";

import n5Raw from "./n5.yaml";
import n5GreetingsContRaw from "./n5-01-greetings-cont.yaml";
import n5FoodDrinkRaw from "./n5-02-food-drink.yaml";
import n5ShoppingRaw from "./n5-03-shopping.yaml";
import n5TransitRaw from "./n5-04-transit.yaml";
import n5HotelRaw from "./n5-05-hotel.yaml";
import n5DirectionsRaw from "./n5-06-directions.yaml";
import n5WeatherRaw from "./n5-07-weather.yaml";
import n5IntegrationRaw from "./n5-08-integration.yaml";

const knownWordIds = new Set(allWords.map((w) => w.id));
const knownPhraseIds = new Set(allPhrases.map((p) => p.id));
const knownPatternIds = new Set(allGrammarPatterns.map((p) => p.id));

export const n5Units: Unit[] = [
  ...parseUnits(n5Raw, "units/n5.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5GreetingsContRaw, "units/n5-01-greetings-cont.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5FoodDrinkRaw, "units/n5-02-food-drink.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5ShoppingRaw, "units/n5-03-shopping.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5TransitRaw, "units/n5-04-transit.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5HotelRaw, "units/n5-05-hotel.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5DirectionsRaw, "units/n5-06-directions.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5WeatherRaw, "units/n5-07-weather.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
  ...parseUnits(n5IntegrationRaw, "units/n5-08-integration.yaml", knownWordIds, knownPhraseIds, knownPatternIds),
].sort((a, b) => a.order - b.order);

export function findUnit(id: string): Unit | undefined {
  return n5Units.find((u) => u.id === id);
}
```

- [ ] **Step 5: Add `patternId` to Units 1 and 2 in `src/content/units/n5.yaml`**

In the `n5.unit-1` entry, add a line after `grammarNote: "～は～です — X is Y, the fundamental copula."`:

```yaml
  patternId: grammar.n5-unit-1
```

In the `n5.unit-2` entry, add a line after its `grammarNote` line:

```yaml
  patternId: grammar.n5-unit-2
```

`n5.unit-3` gets no `patternId` line — leave it exactly as-is.

- [ ] **Step 6: Verify and commit**

Run: `pnpm build && pnpm lint && pnpm test`
Expected: all pass. `pnpm build` is the real proof here — it exercises the full validation chain end to end (grammar schema checks blank-uniqueness against real phrase content; unit schema checks `patternId` resolves).

```bash
git add src/content/grammar/n5.yaml src/content/grammar/index.ts src/content/units/schema.ts src/content/units/index.ts src/content/units/n5.yaml
git commit -m "feat(grammar): wire grammar content loader, author Units 1-2 patterns"
```

---

## Task 3: `GrammarClozeCard` component

**Files:**
- Create: `src/components/GrammarClozeCard.tsx`

**Interfaces:**
- Consumes: `GrammarPattern`, `Phrase` types; `compareAnswer` from `@/lib/compareAnswer`; `FillInput` from `./FillInput`; `Furigana` from `./Furigana`; `Badge`/`Button`/`Card` from `aburungo-design-system`.
- Produces: `GrammarClozeCard({ pattern: GrammarPattern; phrase: Phrase; onNext: (correct: boolean) => void })`.

- [ ] **Step 1: Implement the component**

Create `src/components/GrammarClozeCard.tsx`:

```tsx
import { useState } from "react";
import type { GrammarPattern, Phrase } from "@/types";
import { compareAnswer } from "@/lib/compareAnswer";
import { Badge, Button, Card } from "aburungo-design-system";
import { FillInput } from "./FillInput";
import { Furigana } from "./Furigana";

type Phase = "input" | "result";

type Props = {
  pattern: GrammarPattern;
  phrase: Phrase;
  onNext: (correct: boolean) => void;
};

export function GrammarClozeCard({ pattern, phrase, onNext }: Props) {
  const [phase, setPhase] = useState<Phase>("input");
  const [correct, setCorrect] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  // Schema guarantees pattern.blank appears in phrase.reading exactly once,
  // so a first-occurrence replace is safe and correct.
  const blankedReading = phrase.reading.replace(pattern.blank, "＿＿＿");

  function handleSubmit(value: string) {
    const isCorrect = compareAnswer(value, pattern.blank);
    setUserAnswer(value);
    setCorrect(isCorrect);
    setPhase("result");
  }

  function handleNext() {
    onNext(correct);
    setPhase("input");
    setUserAnswer("");
    setCorrect(false);
  }

  return (
    <Card className="w-full">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between gap-4">
          <Badge emphasis>{pattern.pattern}</Badge>
        </header>

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-body-sm text-fg-subtle">{pattern.gloss}</p>
          <p lang="ja" className="font-jp text-jp-lg text-fg">
            {blankedReading}
          </p>
          <p className="text-body-sm text-fg-subtle">{phrase.english}</p>
        </div>

        <div className="flex flex-col gap-4">
          {phase === "input" && <FillInput onSubmit={handleSubmit} placeholder="Fill in the blank..." />}

          {phase === "result" && (
            <div className="flex flex-col gap-4">
              <div className={["rounded-xl p-4 text-center", correct ? "bg-success-bg" : "bg-error-bg"].join(" ")}>
                <p className={["text-heading-sm font-semibold", correct ? "text-success-fg" : "text-error-fg"].join(" ")}>
                  {correct ? "Recalled!" : "Worth another look"}
                </p>
                {!correct && userAnswer !== "" && (
                  <p className="mt-1 font-jp text-body-sm text-error-fg">You answered: {userAnswer}</p>
                )}
              </div>

              <div className="flex flex-col items-center gap-1 rounded-xl bg-surface-2 p-4 text-center">
                <Furigana japanese={phrase.japanese} reading={phrase.reading} className="font-jp text-jp-lg text-fg" />
                <p className="text-body-sm italic text-fg-subtle">{phrase.romaji}</p>
              </div>

              <Button type="button" onClick={handleNext} fullWidth>
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm build && pnpm lint`
Expected: both pass. This codebase has no component-level unit test infrastructure (no React Testing Library/jsdom — confirmed absent from `package.json` and every other component ships without one); interactive/visual verification happens in Task 4's live browser walkthrough once this is wired into `LearnPage`, not here in isolation.

- [ ] **Step 3: Commit**

```bash
git add src/components/GrammarClozeCard.tsx
git commit -m "feat(grammar): add GrammarClozeCard review component"
```

---

## Task 4: Orchestrator + `LearnPage` wiring

This task is intentionally not split further: `DailySession.reviewItems` widens from `Array<Phrase | Word>` to `Array<Phrase | Word | GrammarPattern>` in the orchestrator, and that type flows directly into `ReviewStep`/`ProduceStep`'s props in `LearnPage.tsx`. A version of this plan that put the orchestrator change in its own task left `pnpm build` broken until the consumer caught up — not a real checkpoint. The orchestrator logic still gets full TDD treatment (failing tests first) as the opening steps; the UI wiring follows in the same task, and the build/test/lint gate at the end covers both together.

**Files:**
- Modify: `src/srs/dailyLoop.ts`
- Modify: `src/srs/dailyLoop.test.ts`
- Modify: `src/pages/LearnPage.tsx`

**Interfaces:**
- Consumes: `GrammarPattern`, `isGrammarPattern` from `@/types` (Task 1); `GrammarClozeCard` from Task 3; `allGrammarPatterns` from `@/content/grammar` (Task 2); `findPhrase` from `@/content` (already exists).
- Produces: `buildDailySession(units, progress, allWords, allPhrases, allPatterns, reviewStates, now)` (new `allPatterns` parameter inserted after `allPhrases`); `DailySession.reviewItems: Array<Phrase | Word | GrammarPattern>`; `DailySession.newGrammarPattern: GrammarPattern | null`. No new exports from `LearnPage.tsx` — page behavior only.

### Part A — orchestrator (TDD)

- [ ] **Step 1: Write the failing orchestrator tests**

Replace `src/srs/dailyLoop.test.ts` entirely with this (extends every existing test's fixtures and call sites with pattern data, since the function signature changes):

```ts
import { describe, expect, it } from "vitest";
import type { GrammarPattern, PathProgress, Phrase, ReviewState, Unit, Word } from "@/types";
import { buildDailySession } from "./dailyLoop";

const NOW = Date.UTC(2026, 4, 16, 12, 0, 0);
const DAY_MS = 24 * 60 * 60 * 1000;

const word = (id: string): Word => ({
  id,
  japanese: id,
  reading: id,
  romaji: id,
  english: id,
  wordType: "noun",
});

const phrase = (id: string): Phrase => ({
  id,
  japanese: id,
  reading: id,
  romaji: id,
  english: id,
  scenario: "test",
});

const grammarPattern = (id: string, phraseId: string): GrammarPattern => ({
  id,
  jlpt: "N5",
  pattern: id,
  gloss: id,
  phraseId,
  blank: "x",
});

const units: Unit[] = [
  {
    id: "unit-1",
    order: 1,
    situation: "s",
    title: "t",
    canDo: "c",
    wordIds: ["w1", "w2"],
    phraseIds: ["p1"],
    kanji: [],
    grammarNote: "g",
    patternId: "g1",
  },
  {
    id: "unit-2",
    order: 2,
    situation: "s",
    title: "t",
    canDo: "c",
    wordIds: ["w3"],
    phraseIds: ["p2"],
    kanji: [],
    grammarNote: "g",
    patternId: "g2",
  },
];

const allWords = ["w1", "w2", "w3"].map(word);
const allPhrases = ["p1", "p2"].map(phrase);
const allPatterns = [grammarPattern("g1", "p1"), grammarPattern("g2", "p2")];

const emptyProgress: PathProgress = { pathId: "n5", seenUnitIds: [] };

describe("buildDailySession", () => {
  it("returns the first unit as new when nothing has been seen", () => {
    const session = buildDailySession(units, emptyProgress, allWords, allPhrases, allPatterns, [], NOW);

    expect(session.unit?.id).toBe("unit-1");
    expect(session.newWords.map((w) => w.id)).toEqual(["w1", "w2"]);
    expect(session.newPhrases.map((p) => p.id)).toEqual(["p1"]);
    expect(session.reviewItems).toEqual([]);
  });

  it("advances to the next unseen unit", () => {
    const progress: PathProgress = { pathId: "n5", seenUnitIds: ["unit-1"] };
    const session = buildDailySession(units, progress, allWords, allPhrases, allPatterns, [], NOW);

    expect(session.unit?.id).toBe("unit-2");
    expect(session.newWords.map((w) => w.id)).toEqual(["w3"]);
  });

  it("returns null unit once every unit has been seen", () => {
    const progress: PathProgress = { pathId: "n5", seenUnitIds: ["unit-1", "unit-2"] };
    const session = buildDailySession(units, progress, allWords, allPhrases, allPatterns, [], NOW);

    expect(session.unit).toBeNull();
    expect(session.newWords).toEqual([]);
    expect(session.newPhrases).toEqual([]);
  });

  it("surfaces due items only from already-seen units, oldest-due first", () => {
    const progress: PathProgress = { pathId: "n5", seenUnitIds: ["unit-1"] };
    const reviewStates: ReviewState[] = [
      { phraseId: "w1", box: 2, dueAt: NOW - DAY_MS },
      { phraseId: "w2", box: 2, dueAt: NOW - 2 * DAY_MS },
      { phraseId: "w3", box: 2, dueAt: NOW - DAY_MS }, // due, but unit-2 not seen yet
      { phraseId: "p1", box: 2, dueAt: NOW + DAY_MS }, // not due yet
    ];

    const session = buildDailySession(units, progress, allWords, allPhrases, allPatterns, reviewStates, NOW);

    expect(session.reviewItems.map((i) => i.id)).toEqual(["w2", "w1"]);
  });

  it("dedupes review items by phraseId, keeping the earliest due", () => {
    const progress: PathProgress = { pathId: "n5", seenUnitIds: ["unit-1"] };
    const reviewStates: ReviewState[] = [
      { phraseId: "w1", box: 1, dueAt: NOW - 2 * DAY_MS },
      { phraseId: "w1", box: 3, dueAt: NOW - DAY_MS },
    ];

    const session = buildDailySession(units, progress, allWords, allPhrases, allPatterns, reviewStates, NOW);

    expect(session.reviewItems.map((i) => i.id)).toEqual(["w1"]);
  });

  it("interleaves a due grammar pattern into reviewItems by dueAt, not appended after", () => {
    const progress: PathProgress = { pathId: "n5", seenUnitIds: ["unit-1"] };
    const reviewStates: ReviewState[] = [
      { phraseId: "w1", box: 2, dueAt: NOW - DAY_MS }, // due, newer
      { phraseId: "g1", box: 2, dueAt: NOW - 2 * DAY_MS }, // due, older — should sort first
    ];

    const session = buildDailySession(units, progress, allWords, allPhrases, allPatterns, reviewStates, NOW);

    expect(session.reviewItems.map((i) => i.id)).toEqual(["g1", "w1"]);
  });

  it("does not surface a due grammar pattern from a unit that hasn't been seen yet", () => {
    const progress: PathProgress = { pathId: "n5", seenUnitIds: [] };
    const reviewStates: ReviewState[] = [{ phraseId: "g1", box: 2, dueAt: NOW - DAY_MS }];

    const session = buildDailySession(units, progress, allWords, allPhrases, allPatterns, reviewStates, NOW);

    expect(session.reviewItems).toEqual([]);
  });

  it("returns the next unit's grammar pattern as newGrammarPattern", () => {
    const session = buildDailySession(units, emptyProgress, allWords, allPhrases, allPatterns, [], NOW);

    expect(session.newGrammarPattern?.id).toBe("g1");
  });

  it("returns null newGrammarPattern when the next unit has no patternId", () => {
    const unitsWithoutPattern: Unit[] = [{ ...units[0]!, patternId: undefined }];
    const session = buildDailySession(unitsWithoutPattern, emptyProgress, allWords, allPhrases, allPatterns, [], NOW);

    expect(session.newGrammarPattern).toBeNull();
  });

  it("returns null newGrammarPattern once every unit has been seen", () => {
    const progress: PathProgress = { pathId: "n5", seenUnitIds: ["unit-1", "unit-2"] };
    const session = buildDailySession(units, progress, allWords, allPhrases, allPatterns, [], NOW);

    expect(session.newGrammarPattern).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/srs/dailyLoop.test.ts`
Expected: FAIL — `buildDailySession` doesn't accept a 5th `allPatterns` parameter yet (type error, or the new assertions fail since `newGrammarPattern` doesn't exist on the returned object).

- [ ] **Step 3: Implement the orchestrator changes**

Replace `src/srs/dailyLoop.ts` entirely:

```ts
/**
 * Daily-loop orchestrator — assembles one guided N5 session from Unit
 * content + FSRS/Leitner due state. Pure: no React, no DB, no fetch. `now`
 * is always a parameter, per the src/srs/ layer boundary in CLAUDE.md.
 *
 * Review-due detection reuses the existing per-item ReviewState (see
 * src/srs/leitner.ts) rather than introducing a second scheduling concept —
 * a Unit is purely an ordering/grouping layer over already-scheduled items.
 * GrammarPattern ids slot into the same ReviewState/isDue mechanism as
 * words and phrases, so reviewItems interleaves all three by due date (see
 * docs/superpowers/specs/2026-07-21-grammar-in-context-design.md).
 */
import type { EpochMs, GrammarPattern, PathProgress, Phrase, ReviewState, Unit, Word } from "@/types";
import { isDue } from "./leitner";

export type DailySession = {
  /** The next not-yet-introduced unit, or null once every unit has been seen. */
  unit: Unit | null;
  /** Due items (words, phrases, and grammar patterns) from seen units, oldest-due first. */
  reviewItems: Array<Phrase | Word | GrammarPattern>;
  /** This session's new-unit words, in unit order. Empty once `unit` is null. */
  newWords: Word[];
  /** This session's new-unit phrases, in unit order. Empty once `unit` is null. */
  newPhrases: Phrase[];
  /** The pattern the next unit introduces, or null. */
  newGrammarPattern: GrammarPattern | null;
};

/**
 * Build today's session from ordered unit content, the learner's path
 * progress, the full word/phrase/pattern content pools, and per-item review
 * state.
 *
 * `units` must be sorted ascending by `order` — parseUnits() guarantees this
 * for content loaded through content/units/index.ts.
 */
export function buildDailySession(
  units: readonly Unit[],
  progress: PathProgress,
  allWords: readonly Word[],
  allPhrases: readonly Phrase[],
  allPatterns: readonly GrammarPattern[],
  reviewStates: readonly ReviewState[],
  now: EpochMs,
): DailySession {
  const seenUnitIds = new Set(progress.seenUnitIds);
  const nextUnit = units.find((u) => !seenUnitIds.has(u.id)) ?? null;

  const seenItemIds = new Set<string>();
  for (const unit of units) {
    if (!seenUnitIds.has(unit.id)) continue;
    for (const id of unit.wordIds) seenItemIds.add(id);
    for (const id of unit.phraseIds) seenItemIds.add(id);
    if (unit.patternId !== undefined) seenItemIds.add(unit.patternId);
  }

  const wordById = new Map(allWords.map((w) => [w.id, w]));
  const phraseById = new Map(allPhrases.map((p) => [p.id, p]));
  const patternById = new Map(allPatterns.map((p) => [p.id, p]));

  // reviewStates has one row per phraseId when it comes from IndexedDB (Dexie's
  // primary key enforces it), but this is a pure function — a future caller
  // that merges local + server due state (like src/store/session.ts already
  // does) could pass duplicates. Dedupe defensively, keeping the earliest due.
  const seenReviewIds = new Set<string>();
  const reviewItems = reviewStates
    .filter((s) => isDue(s, now) && seenItemIds.has(s.phraseId))
    .sort((a, b) => a.dueAt - b.dueAt)
    .filter((s) => {
      if (seenReviewIds.has(s.phraseId)) return false;
      seenReviewIds.add(s.phraseId);
      return true;
    })
    .map((s) => wordById.get(s.phraseId) ?? phraseById.get(s.phraseId) ?? patternById.get(s.phraseId))
    .filter((item): item is Phrase | Word | GrammarPattern => item !== undefined);

  const newWords = nextUnit === null ? [] : nextUnit.wordIds.map((id) => wordById.get(id)).filter((w): w is Word => w !== undefined);
  const newPhrases =
    nextUnit === null ? [] : nextUnit.phraseIds.map((id) => phraseById.get(id)).filter((p): p is Phrase => p !== undefined);
  const newGrammarPattern = nextUnit?.patternId !== undefined ? (patternById.get(nextUnit.patternId) ?? null) : null;

  return { unit: nextUnit, reviewItems, newWords, newPhrases, newGrammarPattern };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/srs/dailyLoop.test.ts`
Expected: PASS, 10 tests.

### Part B — `LearnPage` wiring

- [ ] **Step 5: Update imports**

At the top of `src/pages/LearnPage.tsx`, change:

```ts
import type { Phrase, ReviewRating, Unit, Word } from "@/types";
```

to:

```ts
import type { GrammarPattern, Phrase, ReviewRating, Unit, Word } from "@/types";
import { isGrammarPattern } from "@/types";
```

Add after the existing `import { phrasesForTier } from "@/content";` line:

```ts
import { findPhrase } from "@/content";
```

Add after the existing `import { buildDailySession, type DailySession } from "@/srs/dailyLoop";` line:

```ts
import { allGrammarPatterns } from "@/content/grammar";
```

Add after the existing `import { FillBlankCard } from "@/components/FillBlankCard";` line:

```ts
import { GrammarClozeCard } from "@/components/GrammarClozeCard";
```

- [ ] **Step 6: Make `ReviewStep` item-kind-aware**

Replace the entire `ReviewStep` function with:

```tsx
function ReviewStep({ items, onDone }: { items: Array<Phrase | Word | GrammarPattern>; onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<FlashCardPhase>("entering");
  const [staged, setStaged] = useState<Phrase | Word | null>(null);
  const [pendingRating, setPendingRating] = useState<ReviewRating | null>(null);

  const current = staged ?? items[index] ?? null;

  function handleRate(rating: ReviewRating) {
    const item = items[index];
    setStaged(item !== undefined && !isGrammarPattern(item) ? item : null);
    setPendingRating(rating);
    setPhase("exiting");
  }

  async function handleExited() {
    const item = items[index];
    if (item !== undefined) {
      const existing = await getOne(item.id);
      const next = schedule(existing, pendingRating ?? "didnt", Date.now(), item.id);
      await upsert(next);
    }
    setPendingRating(null);
    setStaged(null);
    const nextIndex = index + 1;
    if (nextIndex >= items.length) {
      onDone();
      return;
    }
    setIndex(nextIndex);
    setPhase("entering");
  }

  async function handleGrammarNext(correct: boolean) {
    const item = items[index];
    if (item !== undefined) {
      const existing = await getOne(item.id);
      const next = schedule(existing, correct ? "got-it" : "didnt", Date.now(), item.id);
      await upsert(next);
    }
    const nextIndex = index + 1;
    if (nextIndex >= items.length) {
      onDone();
      return;
    }
    setIndex(nextIndex);
  }

  if (current === null) return null;

  if (isGrammarPattern(current)) {
    const phrase = findPhrase(current.phraseId);
    if (phrase === undefined) return null;
    return (
      <div className="flex w-full flex-col gap-4 py-4">
        <p className="text-body-sm text-fg-subtle">
          Review · {index + 1} / {items.length}
        </p>
        <ProgressBar value={(index + 1) / items.length} />
        <GrammarClozeCard key={current.id} pattern={current} phrase={phrase} onNext={(correct) => void handleGrammarNext(correct)} />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 py-4">
      <p className="text-body-sm text-fg-subtle">
        Review · {index + 1} / {items.length}
      </p>
      <ProgressBar value={(index + 1) / items.length} />
      <FlashCard
        key={current.id}
        card={current}
        phase={phase}
        onReveal={() => setPhase("revealed")}
        onRate={handleRate}
        onEntered={() => setPhase("idle")}
        onExited={() => void handleExited()}
      />
    </div>
  );
}
```

(Note `staged` stays typed `Phrase | Word | null` — a `GrammarPattern` is never staged for the flip-card exit animation since it doesn't use one; `handleRate` guards this with `!isGrammarPattern(item)` before staging.)

- [ ] **Step 7: Make `ProduceStep` item-kind-aware**

Replace the entire `ProduceStep` function with:

```tsx
function ProduceStep({ items, onDone }: { items: Array<Phrase | Word | GrammarPattern>; onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const current = items[index];

  async function handleNext(correct: boolean) {
    if (current === undefined) return;
    const existing = await getOne(current.id);
    const next = schedule(existing, correct ? "got-it" : "didnt", Date.now(), current.id);
    await upsert(next);
    const nextIndex = index + 1;
    if (nextIndex >= items.length) {
      onDone();
      return;
    }
    setIndex(nextIndex);
  }

  if (current === undefined) return null;

  if (isGrammarPattern(current)) {
    const phrase = findPhrase(current.phraseId);
    if (phrase === undefined) return null;
    return (
      <div className="flex w-full flex-col gap-4 py-4">
        <p className="text-body-sm text-fg-subtle">
          Try it · {index + 1} / {items.length}
        </p>
        <ProgressBar value={(index + 1) / items.length} />
        <GrammarClozeCard key={current.id} pattern={current} phrase={phrase} onNext={(correct) => void handleNext(correct)} />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 py-4">
      <p className="text-body-sm text-fg-subtle">
        Try it · {index + 1} / {items.length}
      </p>
      <ProgressBar value={(index + 1) / items.length} />
      <FillBlankCard key={current.id} card={current} onNext={(correct) => void handleNext(correct)} />
    </div>
  );
}
```

(`handleNext` gained a `current === undefined` guard since the closure now needs it — the original relied on `current` being defined by the time `handleNext` could fire, which still holds, but the explicit guard matches `GrammarClozeCard`'s and `FlashCard`'s own defensive style elsewhere in this file.)

- [ ] **Step 8: Add the grammar teach stage to `NewUnitStep`**

Change the `NewUnitStep` function signature (currently `function NewUnitStep({ unit, words, phrases, onDone }: { unit: Unit; words: Word[]; phrases: Phrase[]; onDone: () => void })`) to:

```tsx
function NewUnitStep({
  unit,
  words,
  phrases,
  pattern,
  onDone,
}: {
  unit: Unit;
  words: Word[];
  phrases: Phrase[];
  pattern: GrammarPattern | null;
  onDone: () => void;
}) {
  const [stage, setStage] = useState<"intro" | "words" | "phrases" | "grammar">("intro");
  const [index, setIndex] = useState(0);
  const currentPhrase = stage === "phrases" ? phrases[index] : undefined;

  useEffect(() => {
    // Defensive only: real unit content always has at least one phrase, so
    // this only fires if a unit is authored with an empty phraseIds list.
    if (stage === "phrases" && currentPhrase === undefined) {
      if (pattern !== null) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- bounded
        // to this defensive branch (never fires for real content), matches
        // the existing disable precedent in RecognitionPass.tsx.
        setStage("grammar");
      } else {
        onDone();
      }
    }
  }, [stage, currentPhrase, pattern, onDone]);
```

(This replaces the existing `const [stage, setStage] = useState<"intro" | "words" | "phrases">("intro");` through the existing `useEffect` block — everything after stays the same shape but gets extended below.)

In the `"words"` stage block, replace the `onNext` handler:

```tsx
          onNext={() => {
            const next = index + 1;
            if (next >= words.length) {
              setIndex(0);
              if (phrases.length > 0) {
                setStage("phrases");
              } else if (pattern !== null) {
                setStage("grammar");
              } else {
                onDone();
              }
            } else {
              setIndex(next);
            }
          }}
```

(This replaces the existing `if (next >= words.length) { setIndex(0); setStage("phrases"); if (phrases.length === 0) onDone(); }` block — same intent, but now routes through `grammar` when phrases are empty and a pattern exists, instead of always going straight to `onDone`.)

The `"phrases"` stage block currently reads `const phrase = currentPhrase; if (phrase === undefined) return null;` followed by its `return (...)`. **This guard must be scoped to `stage === "phrases"` explicitly** — left as an unconditional `if (phrase === undefined) return null;`, it fires for the new `"grammar"` stage too (since `currentPhrase` is only ever defined when `stage === "phrases"`, it's `undefined` for every other stage), making the grammar block added below permanently unreachable dead code. Replace the whole phrases-stage block with:

```tsx
  if (stage === "phrases") {
    const phrase = currentPhrase;
    if (phrase === undefined) return null;
    return (
      <div className="flex w-full flex-col gap-4 py-4">
        <ProgressBar value={(index + 1) / phrases.length} />
        <PhraseIntroCard
          key={phrase.id}
          phrase={phrase}
          index={index}
          total={phrases.length}
          onNext={() => {
            const next = index + 1;
            if (next >= phrases.length) {
              if (pattern !== null) {
                setStage("grammar");
              } else {
                onDone();
              }
            } else {
              setIndex(next);
            }
          }}
        />
      </div>
    );
  }
```

(Only the `onNext` handler's body is new — the guard is now scoped with `if (stage === "phrases") { ... }` wrapping the whole block instead of an unconditional early return, so control falls through to the `"grammar"` check below instead of returning `null` first.)

Finally, add a new `"grammar"` stage render block. Insert it right after the `"phrases"` stage's closing block above (i.e., as the new final block before the function's closing `}`):

```tsx
  if (stage === "grammar" && pattern !== null) {
    const patternPhrase = findPhrase(pattern.phraseId);
    return (
      <div className="flex w-full flex-col gap-6 py-4">
        <div className="flex flex-col gap-1">
          <p className="text-body-sm font-medium text-brand-700">Grammar pattern</p>
          <p className="text-heading-sm font-semibold text-fg">{pattern.pattern}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-body text-fg">{pattern.gloss}</p>
        </div>
        {patternPhrase !== undefined && (
          <div className="w-full rounded-2xl border border-border bg-bg shadow-card">
            <div className="flex flex-col items-center gap-3 p-6 py-8">
              <Furigana
                japanese={patternPhrase.japanese}
                reading={patternPhrase.reading}
                className="block text-center text-jp-display font-medium text-fg"
              />
              <p className="text-center text-body font-semibold text-fg">{patternPhrase.english}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={onDone}
          className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
        >
          Got it — Continue
        </button>
      </div>
    );
  }

  return null;
}
```

(The final `return null;` replaces the function's previous implicit fall-through — every prior stage already returns, so this is purely a defensive fallback for a stage value not yet handled, mirroring the file's existing style.)

- [ ] **Step 9: Update `LearnPage`'s load effect, transitions, and render branches**

In the `load()` function inside the `useEffect`, update the `buildDailySession` call to pass `allGrammarPatterns`:

```ts
      const built = buildDailySession(n5Units, progress, words, phrases, allGrammarPatterns, reviewStates, Date.now());
```

(Replaces `buildDailySession(n5Units, progress, words, phrases, reviewStates, Date.now())`. No other change needed in `load()` — the `built.reviewItems.length > 0 ? "review" : ...` routing already works unchanged, per the design spec, since `reviewItems` now naturally includes due grammar patterns.)

Update `afterNewUnit` to include `newGrammarPattern` in the produce-items count:

```ts
  const afterNewUnit = useCallback(() => {
    if (session === null) return;
    const produceItems = [...session.newWords, ...session.newPhrases, ...(session.newGrammarPattern ? [session.newGrammarPattern] : [])];
    if (produceItems.length > 0) {
      setStep("produce");
    } else if (session.newWords.length > 0) {
      setStep("recognition");
    } else {
      void finishUnitAndClose();
    }
  }, [session, finishUnitAndClose]);
```

(Only the `produceItems` line changes — everything else in this function is unchanged.)

Update the render branches. Change:

```tsx
  } else if (step === "new-unit" && session.unit !== null) {
    content = (
      <NewUnitStep unit={session.unit} words={session.newWords} phrases={session.newPhrases} onDone={afterNewUnit} />
    );
  } else if (step === "produce") {
    content = <ProduceStep items={[...session.newWords, ...session.newPhrases]} onDone={afterProduce} />;
```

to:

```tsx
  } else if (step === "new-unit" && session.unit !== null) {
    content = (
      <NewUnitStep
        unit={session.unit}
        words={session.newWords}
        phrases={session.newPhrases}
        pattern={session.newGrammarPattern}
        onDone={afterNewUnit}
      />
    );
  } else if (step === "produce") {
    content = (
      <ProduceStep
        items={[...session.newWords, ...session.newPhrases, ...(session.newGrammarPattern ? [session.newGrammarPattern] : [])]}
        onDone={afterProduce}
      />
    );
```

- [ ] **Step 10: Update `CloseStep`'s learned count**

Change:

```tsx
function CloseStep({ session }: { session: DailySession }) {
  const learnedCount = session.newWords.length + session.newPhrases.length;
```

to:

```tsx
function CloseStep({ session }: { session: DailySession }) {
  const learnedCount = session.newWords.length + session.newPhrases.length + (session.newGrammarPattern !== null ? 1 : 0);
```

(`session.reviewItems.length` — used for the "Reviewed N item(s)" line — needs no change; it already includes grammar patterns per Part A.)

- [ ] **Step 11: Update the file's top-of-file doc comment**

The comment block at the top of `LearnPage.tsx` currently says: "Sequences: review (due items from already-seen units) -> new unit intro -> produce (type what you just learned) -> recognition pass -> close." Update it:

```tsx
/**
 * "Today's session" — the guided N5 daily loop.
 *
 * Sequences: review (due items from already-seen units, including due
 * grammar patterns interleaved by due date) -> new unit intro (words,
 * phrases, then the unit's grammar pattern if it has one) -> produce (type
 * what you just learned, including the freshly-taught pattern) ->
 * recognition pass -> close. Reuses existing presentational cards
 * (FlashCard, WordLearnCard, FillBlankCard, GrammarClozeCard,
 * RecognitionPass) driven by local queue state, the same pattern
 * WordsPage/KanaPracticePage already use — the daily-loop orchestrator
 * (src/srs/dailyLoop.ts) only decides *what* goes in the queues.
 *
 * Scope note: review-step ratings persist to local Leitner state only (no
 * server sync yet) — full FSRS source-of-truth for signed-in users is
 * tracked separately in docs/todo.md. Kanji introduced by a unit are shown
 * informationally only, not yet scheduled through SRS (see
 * docs/plans/01-overarching-plan.md open decision #5).
 */
```

- [ ] **Step 12: Full verification and commit**

Run: `pnpm build && pnpm lint && pnpm test`
Expected: all pass.

Then do a live browser check of Units 1-2 specifically (the only units with real `patternId`s so far): start the dev server (`pnpm dev:server`), open `/learn` as a guest, and click through Unit 1 — confirm the grammar teach card appears after the phrase intro (showing `～は～です` / the gloss / これは本です), and the produce step includes a cloze card testing です. Take a screenshot to confirm the blanked reading renders correctly (これはほん＿＿＿).

```bash
git add src/srs/dailyLoop.ts src/srs/dailyLoop.test.ts src/pages/LearnPage.tsx
git commit -m "feat(grammar): interleave GrammarPattern into daily-loop Review/Produce"
```

---

## Task 5: Author grammar patterns for Units 4-33, skip 6/21/29/34/35

**Files:**
- Modify: `src/content/grammar/n5.yaml`
- Modify: `src/content/units/n5-01-greetings-cont.yaml`
- Modify: `src/content/units/n5-02-food-drink.yaml`
- Modify: `src/content/units/n5-03-shopping.yaml`
- Modify: `src/content/units/n5-04-transit.yaml`
- Modify: `src/content/units/n5-05-hotel.yaml`
- Modify: `src/content/units/n5-06-directions.yaml`
- Modify: `src/content/units/n5-07-weather.yaml`
- Modify: `src/content/units/n5-08-integration.yaml`

**Interfaces:** none — content-only task, no code changes.

Units 3, 6, 21, and 29 already established (or, for 6/21/29, establish here) the fallback rule from the design spec: no phrase in that unit demonstrates its stated `grammarNote` closely enough to blank without being misleading, so their `patternId` stays unset. Units 34-35 have no phrases at all (`phraseIds: []`, review-only/checkpoint units by design) and also get no `patternId`. This is not an oversight — leave all five as-is with no `patternId` line.

- [ ] **Step 1: Append the remaining 27 grammar patterns to `src/content/grammar/n5.yaml`**

Append (after the existing Unit 1/2 entries):

```yaml
- id: grammar.n5-unit-4
  jlpt: N5
  pattern: "～から来ました"
  gloss: "I came from ~ (origin pattern)"
  phraseId: greetings.from-america
  blank: きました

- id: grammar.n5-unit-5
  jlpt: N5
  pattern: "ありがとうございます／どういたしまして"
  gloss: "the thanks exchange"
  phraseId: greetings.youre-welcome
  blank: どういたしまして

- id: grammar.n5-unit-7
  jlpt: N5
  pattern: "～つ"
  gloss: "counting small things (ひとつ, ふたつ, みっつ...)"
  phraseId: greetings.one-please
  blank: ひとつ

- id: grammar.n5-unit-8
  jlpt: N5
  pattern: "～をおねがいします"
  gloss: "~ please (ordering pattern)"
  phraseId: restaurant.coffee-please
  blank: おねがいします

- id: grammar.n5-unit-9
  jlpt: N5
  pattern: "～をください"
  gloss: "please give me ~ (receiving pattern)"
  phraseId: restaurant.this-please
  blank: ください

- id: grammar.n5-unit-10
  jlpt: N5
  pattern: "これは何ですか"
  gloss: "What is this?"
  phraseId: restaurant.what-is-this
  blank: なんですか

- id: grammar.n5-unit-11
  jlpt: N5
  pattern: "いくらですか"
  gloss: "How much is it?"
  phraseId: shopping.how-much
  blank: いくら

- id: grammar.n5-unit-12
  jlpt: N5
  pattern: "number + えん"
  gloss: "price expressions (さんびゃくえん、いちまんえん)"
  phraseId: restaurant.price-300
  blank: えん

- id: grammar.n5-unit-13
  jlpt: N5
  pattern: "～てもいいですか"
  gloss: "may I ~? (permission request)"
  phraseId: shopping.may-i-look
  blank: てもいいですか

- id: grammar.n5-unit-14
  jlpt: N5
  pattern: "～をひとつください"
  gloss: "one ~ please"
  # grammarNote's example uses ひとつ specifically; the closest authored
  # phrase uses ふたつ (same counter+ください shape, different number) —
  # the pattern being taught (counter directly before ください) transfers.
  phraseId: shopping.two-please
  blank: ください

- id: grammar.n5-unit-15
  jlpt: N5
  pattern: "～はありますか"
  gloss: "Do you have ~?"
  phraseId: shopping.other-colors
  blank: ありますか

- id: grammar.n5-unit-16
  jlpt: N5
  pattern: "～までいくらですか"
  gloss: "How much to ~? (まで marks the destination)"
  phraseId: transit.shinjuku-how-much
  blank: いくらですか

- id: grammar.n5-unit-17
  jlpt: N5
  pattern: "～はどこですか"
  gloss: "Where is ~? (the general location-question pattern)"
  phraseId: transit.deguchi-where
  blank: どこですか

- id: grammar.n5-unit-18
  jlpt: N5
  pattern: "～じ～ふんです"
  gloss: "It is ~ o'clock, ~ minutes."
  # Closest authored phrase uses 半 (han, "half past") rather than a literal
  # ふん(minutes) count, but it's the same hour+time-word+です predicate
  # shape the pattern teaches.
  phraseId: transit.sanji-han
  blank: さんじはん

- id: grammar.n5-unit-19
  jlpt: N5
  pattern: "～までお願いします"
  gloss: "Please take me to ~ (the taxi destination pattern)"
  phraseId: transit.eki-made-onegaishimasu
  blank: おねがいします

- id: grammar.n5-unit-20
  jlpt: N5
  pattern: "～でおりてください"
  gloss: "Please get off at ~"
  # Closest authored phrase is the statement form (おります) rather than the
  # てください imperative the pattern names, but it's the same おりる verb
  # in the same でおりる construction.
  phraseId: transit.getting-off-here
  blank: おります

- id: grammar.n5-unit-22
  jlpt: N5
  pattern: "～はなんかいですか"
  gloss: "What floor is ~?"
  phraseId: hotel.bath-floor
  blank: なんかいですか

- id: grammar.n5-unit-23
  jlpt: N5
  pattern: "～をもってきてください"
  gloss: "Please bring me ~"
  phraseId: hotel.bring-towel
  blank: もってきてください

- id: grammar.n5-unit-24
  jlpt: N5
  pattern: "～に曲がってください"
  gloss: "Please turn ~ (direction + magaru pattern)"
  phraseId: directions.turn-right
  blank: まがってください

- id: grammar.n5-unit-25
  jlpt: N5
  pattern: "～はどこにありますか"
  gloss: "Where is ~? (location question)"
  # Closest authored phrase is the shorter どこですか form rather than the
  # full どこにありますか the pattern names, but it's the same どこ-question
  # construction over the same topic-marker shape.
  phraseId: transit.station-where
  blank: どこですか

- id: grammar.n5-unit-26
  jlpt: N5
  pattern: "～ふんくらいです"
  gloss: "It's about ~ minutes"
  phraseId: directions.walking-distance
  blank: ふんくらいです

- id: grammar.n5-unit-27
  jlpt: N5
  pattern: "～ですね"
  gloss: "isn't it ~? (weather small talk pattern)"
  phraseId: weather.hot-today
  blank: ですね

- id: grammar.n5-unit-28
  jlpt: N5
  pattern: "～の天気はどうですか"
  gloss: "What's the weather like ~?"
  phraseId: weather.tomorrow-forecast
  blank: どうですか

- id: grammar.n5-unit-30
  jlpt: N5
  pattern: "～がすきです／～がきらいです"
  gloss: "I like ~ / I don't like ~"
  phraseId: food-preferences.like-sushi
  blank: すきです

- id: grammar.n5-unit-31
  jlpt: N5
  pattern: "～がたべたいです"
  gloss: "I want to eat ~"
  phraseId: food-preferences.want-ramen
  blank: たべたいです

- id: grammar.n5-unit-32
  jlpt: N5
  pattern: "～も～もすきです"
  gloss: "I like both ~ and ~"
  phraseId: food-preferences.like-both
  blank: すきです

- id: grammar.n5-unit-33
  jlpt: N5
  pattern: "frequency adverbs + ～ます"
  gloss: "あまり and ぜんぜん require a negative verb ending (～ません)"
  phraseId: food-preferences.not-at-all
  blank: たべません
```

- [ ] **Step 2: Add `patternId` to the corresponding unit entries**

In `src/content/units/n5-01-greetings-cont.yaml`: add `patternId: grammar.n5-unit-4` after `n5.unit-4`'s `grammarNote` line, and `patternId: grammar.n5-unit-5` after `n5.unit-5`'s. Add `patternId: grammar.n5-unit-7` after `n5.unit-7`'s. Leave `n5.unit-6` unchanged (fallback — no phrase demonstrates ～をおねがいします; its phrases all use ～てください instead).

In `src/content/units/n5-02-food-drink.yaml`: add `patternId: grammar.n5-unit-8` through `patternId: grammar.n5-unit-12` after each of `n5.unit-8` through `n5.unit-12`'s `grammarNote` lines respectively.

In `src/content/units/n5-03-shopping.yaml`: add `patternId: grammar.n5-unit-13` through `patternId: grammar.n5-unit-15` after each of `n5.unit-13` through `n5.unit-15`'s `grammarNote` lines respectively.

In `src/content/units/n5-04-transit.yaml`: add `patternId: grammar.n5-unit-16` through `patternId: grammar.n5-unit-20` after each of `n5.unit-16` through `n5.unit-20`'s `grammarNote` lines respectively.

In `src/content/units/n5-05-hotel.yaml`: add `patternId: grammar.n5-unit-22` after `n5.unit-22`'s `grammarNote` line, and `patternId: grammar.n5-unit-23` after `n5.unit-23`'s. Leave `n5.unit-21` unchanged (fallback — neither phrase demonstrates ～のなまえで).

In `src/content/units/n5-06-directions.yaml`: add `patternId: grammar.n5-unit-24` through `patternId: grammar.n5-unit-26` after each of `n5.unit-24` through `n5.unit-26`'s `grammarNote` lines respectively.

In `src/content/units/n5-07-weather.yaml`: add `patternId: grammar.n5-unit-27` after `n5.unit-27`'s `grammarNote` line, and `patternId: grammar.n5-unit-28` after `n5.unit-28`'s. Leave `n5.unit-29` unchanged (fallback — neither phrase uses そうです).

In `src/content/units/n5-08-integration.yaml`: add `patternId: grammar.n5-unit-30` through `patternId: grammar.n5-unit-33` after each of `n5.unit-30` through `n5.unit-33`'s `grammarNote` lines respectively. Leave `n5.unit-34` and `n5.unit-35` unchanged (no phrases at all, by design).

- [ ] **Step 3: Verify and commit**

Run: `pnpm build && pnpm lint && pnpm test`
Expected: all pass. `pnpm build` is the real check — every `blank`/`phraseId` pair above gets validated against the real phrase content; a typo in any blank string (wrong reading, wrong occurrence count) fails loudly here.

```bash
git add src/content/grammar/n5.yaml src/content/units/n5-01-greetings-cont.yaml src/content/units/n5-02-food-drink.yaml src/content/units/n5-03-shopping.yaml src/content/units/n5-04-transit.yaml src/content/units/n5-05-hotel.yaml src/content/units/n5-06-directions.yaml src/content/units/n5-07-weather.yaml src/content/units/n5-08-integration.yaml
git commit -m "feat(grammar): author grammar patterns for Units 4-33"
```

---

## Task 6: Full regression verification

**Files:** none created or modified — verification only.

- [ ] **Step 1: Run the full check gate**

Run: `pnpm build && pnpm test && pnpm lint`
Expected: all pass. Confirm the test count includes the new `schema.test.ts` (9 tests) and the expanded `dailyLoop.test.ts` (10 tests) on top of the existing suite.

- [ ] **Step 2: Sanity-check the consolidated content**

Write a temporary test file (same throwaway pattern used for the Phase 1 content consolidation — write it, run it, then delete it, since it's a one-off structural check, not a permanent regression test):

```ts
// src/content/grammar/_verify.test.ts (temporary — delete after running)
import { describe, expect, it } from "vitest";
import { allGrammarPatterns } from "./index";
import { n5Units } from "@/content/units";

describe("consolidated grammar content sanity", () => {
  it("has 29 patterns (35 units minus 3, 6, 21, 29, 34, 35)", () => {
    expect(allGrammarPatterns.length).toBe(29);
  });

  it("every unit's patternId (if set) resolves to a real pattern", () => {
    for (const unit of n5Units) {
      if (unit.patternId === undefined) continue;
      const found = allGrammarPatterns.find((p) => p.id === unit.patternId);
      expect(found, `unit ${unit.id} references missing pattern ${unit.patternId}`).toBeDefined();
    }
  });

  it("exactly units 3, 6, 21, 29, 34, 35 have no patternId", () => {
    const withoutPattern = n5Units.filter((u) => u.patternId === undefined).map((u) => u.id);
    expect(withoutPattern.sort()).toEqual(
      ["n5.unit-3", "n5.unit-6", "n5.unit-21", "n5.unit-29", "n5.unit-34", "n5.unit-35"].sort(),
    );
  });
});
```

Run: `pnpm test src/content/grammar/_verify.test.ts`
Expected: PASS, 3 tests. Then delete the file: `rm src/content/grammar/_verify.test.ts`.

- [ ] **Step 3: Full scripted browser walkthrough of all 35 units**

Extend the Phase 1 verification script (the one used for the N5 units PR — search recent scratchpad history or rebuild it following the same shape: launch a headless browser, sign in as guest, drive `/learn` through all 35 sessions via `Start` → `Got it` (words/phrases) → `Got it — Continue` (grammar teach, when present) → `Show answer`/`Next` (produce, including grammar cloze items) → recognition pass tiles → `Finish session`, repeat until `All caught up!`). Confirm:
- All 35 sessions complete with zero console/page errors.
- At least one screenshot during a unit with a grammar pattern shows the blanked cloze prompt rendering correctly (e.g. Unit 1: これはほん＿＿＿).
- If a run appears to stall, remember the earlier N5-units PR's own finding: test-script timing (clicking before React settles) is the far more likely cause than a real content bug — increase wait times and retry before concluding there's an app defect.

- [ ] **Step 4: Update the design spec's status line**

In `docs/superpowers/specs/2026-07-21-grammar-in-context-design.md`, change the header line from:

```
**Status:** approved, pending implementation plan.
```

to:

```
**Status:** implemented (see docs/superpowers/plans/2026-07-21-grammar-in-context.md).
```

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/specs/2026-07-21-grammar-in-context-design.md
git commit -m "docs(plans): mark grammar-in-context spec as implemented"
```

At this point the branch is ready for the same push/PR flow used for the daily-loop engine and N5-units PRs — stop here and let the user decide when to push.
