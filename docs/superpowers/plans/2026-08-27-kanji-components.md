# Kanji Component Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce each new kanji as its recombined parts — "you already know these pieces" — with every claim about what the learner knows derived from lesson order rather than asserted.

**Architecture:** A generated decomposition table from KRADFILE, a hand-authored keyword per component, and a pure resolver that walks the ladder in order to label each piece *taught*, *met*, or *new*. The resolver takes the ladder as a parameter and imports no content, so it stays testable and cycle-free. The surface is one row added to the existing `KanjiIntroCard`.

**Tech Stack:** React 19 + TypeScript strict, Vitest, `@rollup/plugin-yaml` for content imports. Node scripts are plain `.mjs` under `scripts/`.

**Spec:** [docs/superpowers/specs/2026-08-24-kanji-components-design.md](../specs/2026-08-24-kanji-components-design.md)

## Global Constraints

- **`src/content/` is data and pure derivation.** No React, no fetch at runtime.
- **`src/components/` is presentation only** — receives props, fires callbacks.
- `src/types.ts` is the single source of truth for domain types.
- No `any`. No `as` casts except at validated trust boundaries.
- `verbatimModuleSyntax` — `import type` for type-only imports. `erasableSyntaxOnly` — no enums, no parameter properties.
- Imports use the `@/` alias for anything under `src/`.
- **The learner never reads a JLPT level (DR-024).**
- **Components are annotations, not reviewable items.** They get no id, no `ReviewState`, no place in the daily loop.
- **Keywords are original work.** Never adapted from Heisig's *Remembering the Kanji* or WaniKani — both copyrighted. Write from KANJIDIC2 meanings and from plain shape description.
- **Scope is derived, never listed** — read every `kanji:` array in `src/content/lessons/*.yaml`, exactly as `scripts/kanji.mjs build` and `src/content/kanji/scope.test.ts` already do.
- **Components never reorder lessons.** Kanji arrive when a situation calls for them; the gaps report is advisory output, never a failing check.
- `docs/book-one-ladder.md` must regenerate byte-identical.
- Run `pnpm build` and `pnpm test` before concluding any task.

## Measured facts this plan is built on

All verified against the real KRADFILE and the shipped 200-kanji content on 2026-08-27. Use these numbers; do not re-derive them from the spec, which predates the measurement.

| Fact | Value |
|---|---|
| Book One kanji missing from KRADFILE | **0** — coverage is complete |
| Kanji whose only component is themselves (水 → 水) | **31** — these render no component row |
| Distinct components needing a keyword | **131** |
| …of those, themselves taught kanji (easy keywords) | 24 |
| …radical-only, needing a shape description | **107** |
| Components per kanji | mean 2.7, max 8 (顔) |

**Two corrections to the spec, which was written before the data was inspected:**

1. **The spec says the authoring job is ~253 keywords. It is 131.** KRADFILE holds 254 components in total, but Book One's 200 kanji draw on only 131 once self-references are dropped.
2. **The spec's worked example is wrong.** It says 時 decomposes into 日 + 寺. KRADFILE gives `寸, 土, 日` — it decomposes to *primitives*, not intermediate kanji. Do not expect intermediate-kanji decompositions anywhere.

**KRADFILE is lookup-oriented and sometimes misleading.** 海 comes back as `⺡, 母, 毋, 乞` — listing both 母 and 毋, and 乞, which is not really a part of it. The spec anticipated this in the abstract; Task 4's gaps report makes it visible so an author can override the worst entries later. Do not attempt to clean the data in this plan.

## File structure

| File | Responsibility |
|---|---|
| `src/types.ts` (modify) | `KanjiComponent`, `ComponentState`, `KanjiPiece` |
| `scripts/kanji.mjs` (modify) | new `decompose` and `gaps` subcommands |
| `src/content/kanji/decomposition.json` (generated) | character → component list, CC BY-SA 4.0 |
| `src/content/kanji/components.yaml` (authored) | 131 keywords — the whole authoring job |
| `src/content/kanji/componentSchema.ts` (create) | `parseComponents` validator |
| `src/content/kanji/pieces.ts` (create) | the pure taught/met/new resolver |
| `src/content/kanji/index.ts` (modify) | wires the resolver to real content |
| `src/components/KanjiIntroCard.tsx` (modify) | the component row |

---

### Task 1: Decomposition data from KRADFILE

**Files:**
- Modify: `src/types.ts`
- Modify: `scripts/kanji.mjs`
- Create: `src/content/kanji/decomposition.json` (by running the script)
- Test: `src/content/kanji/decomposition.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  - `type KanjiComponent = { glyph: string; keyword: string; note?: string }`
  - `decomposition.json` shaped `{ "_source": string, "_licence": string, "map": Record<string, string[]> }`

- [ ] **Step 1: Add the authored-component type to `src/types.ts`**

Place it next to the existing `Kanji` type.

```ts
/**
 * One visual component of a kanji, with the keyword the learner reads.
 *
 * Authored in src/content/kanji/components.yaml. An annotation on a kanji, not
 * a reviewable item: no id, no ReviewState, no place in the daily loop. A
 * component worth reviewing is a kanji worth teaching.
 */
export type KanjiComponent = {
  glyph: string;
  keyword: string;
  /**
   * Optional shape description, for radical-only forms where a keyword alone
   * leaves the learner wondering what they are looking at. Components that are
   * themselves kanji need no note.
   */
  note?: string;
};
```

- [ ] **Step 2: Write the failing test**

Create `src/content/kanji/decomposition.test.ts`. The `expect(characters.length).toBeGreaterThan(150)` guard is not decoration — without it every assertion below would pass over an empty map.

```ts
import { describe, expect, it } from "vitest";
import { allKanji } from "./index";
import decomposition from "./decomposition.json";

describe("kanji decomposition", () => {
  const map = decomposition.map;
  const characters = Object.keys(map);

  it("has entries to check, so the assertions below cannot pass vacuously", () => {
    expect(characters.length).toBeGreaterThan(150);
  });

  it("covers every taught kanji", () => {
    const missing = allKanji.filter((k) => map[k.character] === undefined).map((k) => k.character);
    expect(missing).toEqual([]);
  });

  it("has no entry for a character no lesson teaches", () => {
    const taught = new Set(allKanji.map((k) => k.character));
    expect(characters.filter((c) => !taught.has(c))).toEqual([]);
  });

  it("never lists a character as its own component", () => {
    // 水 decomposes to [水] in KRADFILE. A card reading "水 is made of: 水"
    // is noise, so the generator drops self-reference and those kanji render
    // no component row at all.
    const selfReferencing = characters.filter((c) => map[c].includes(c));
    expect(selfReferencing).toEqual([]);
  });

  it("carries its licence attribution, which regeneration must not drop", () => {
    expect(decomposition._licence).toContain("CC BY-SA");
    expect(decomposition._source).toContain("KRADFILE");
  });
});
```

- [ ] **Step 3: Run it and confirm it fails**

```bash
cd /Users/peterabeln/Documents/japanese/aburungo-kanji-components
pnpm exec vitest run src/content/kanji/decomposition.test.ts
```

Expected: FAIL resolving `./decomposition.json` — it does not exist yet.

- [ ] **Step 4: Add the `decompose` subcommand to `scripts/kanji.mjs`**

Add this above the existing `const cmd = process.argv[2];` dispatch line. `taughtCharacters()` already exists in this file from the previous plan — reuse it, do not write a second scanner.

```js
const KRAD = "https://raw.githubusercontent.com/hoffmannjp/krad-unicode/master/krad.json";
const DECOMP_OUT = join(ROOT, "src/content/kanji/decomposition.json");

async function decompose() {
  const characters = taughtCharacters();
  if (characters.length === 0) throw new Error("no kanji found in src/content/lessons — refusing to write an empty file");

  const res = await fetch(KRAD);
  if (!res.ok) throw new Error(`KRADFILE fetch failed: HTTP ${res.status}`);
  const raw = await res.json();
  const byLiteral = new Map(raw.map((e) => [e.literal, e.components]));

  const map = {};
  const missing = [];
  for (const c of characters) {
    const parts = byLiteral.get(c);
    if (parts === undefined) { missing.push(c); continue; }
    // Drop self-reference: KRADFILE gives 水 -> ["水"], and "水 is made of 水"
    // is noise. Such kanji end up with an empty list and render no row.
    map[c] = parts.filter((p) => p !== c);
  }
  if (missing.length > 0) throw new Error(`not in KRADFILE: ${missing.join(" ")}`);

  const out = {
    _source: "KRADFILE via hoffmannjp/krad-unicode",
    _licence: "CC BY-SA 4.0, (c) James William Breen and The Electronic Dictionary Research and Development Group",
    map,
  };
  writeFileSync(DECOMP_OUT, JSON.stringify(out, null, 2) + "\n");

  const comps = new Set(Object.values(map).flat());
  const empty = Object.values(map).filter((v) => v.length === 0).length;
  console.log(`wrote ${Object.keys(map).length} entries to src/content/kanji/decomposition.json`);
  console.log(`  ${comps.size} distinct components, ${empty} kanji with no component row`);
}
```

Then extend the dispatch at the bottom of the file:

```js
const cmd = process.argv[2];
if (cmd === "build") await build();
else if (cmd === "decompose") await decompose();
else { console.error(`usage: kanji.mjs build|decompose`); process.exit(1); }
```

Note the `else` is now unconditional — running the script with no argument previously exited 0 in silence, leaving a maintainer with a stale file and no error.

- [ ] **Step 5: Generate the data**

```bash
node scripts/kanji.mjs decompose
```

Expected: `wrote 200 entries`, then `131 distinct components, 31 kanji with no component row`. If those numbers differ, stop and report it — they were measured against this exact content and a mismatch means the scope scan or the self-reference filter is wrong.

- [ ] **Step 6: Run the test and confirm it passes**

```bash
pnpm exec vitest run src/content/kanji/decomposition.test.ts
```

Expected: PASS, 5 tests.

- [ ] **Step 7: Prove the coverage test can fail**

```bash
# Delete one entry from decomposition.json by hand (e.g. the "日" key), then:
pnpm exec vitest run src/content/kanji/decomposition.test.ts
# Expected: FAIL on "covers every taught kanji", listing ["日"]
node scripts/kanji.mjs decompose   # regenerate
pnpm exec vitest run src/content/kanji/decomposition.test.ts   # back to PASS
```

- [ ] **Step 8: Full check and commit**

```bash
pnpm build && pnpm test
git add src/types.ts scripts/kanji.mjs src/content/kanji/decomposition.json src/content/kanji/decomposition.test.ts
git commit -m "feat(kanji): decompose taught kanji from KRADFILE"
```

Include a source citation line in the commit body — the project rejects content commits without one:
`Source: KRADFILE via hoffmannjp/krad-unicode (CC BY-SA 4.0), for src/content/kanji/decomposition.json`

---

### Task 2: The component keywords

**Files:**
- Create: `src/content/kanji/components.yaml`
- Create: `src/content/kanji/componentSchema.ts`
- Modify: `src/content/kanji/index.ts`
- Test: `src/content/kanji/components.test.ts`

**Interfaces:**
- Consumes: `KanjiComponent` and `decomposition.json` from Task 1.
- Produces:
  - `function parseComponents(raw: unknown, source: string): KanjiComponent[]`
  - `const allComponents: readonly KanjiComponent[]`
  - `const componentByGlyph: ReadonlyMap<string, KanjiComponent>`

**This is the authoring task.** 131 keywords, of which 24 are components that are themselves taught kanji (write the kanji's own plain meaning) and 107 are radical-only forms that need a short shape description. Budget your care accordingly.

- [ ] **Step 1: Write the failing test**

Create `src/content/kanji/components.test.ts`.

```ts
import { describe, expect, it } from "vitest";
import { allComponents, componentByGlyph } from "./index";
import decomposition from "./decomposition.json";

const used = new Set(Object.values(decomposition.map).flat());

describe("component keywords", () => {
  it("has components to check, so the assertions below cannot pass vacuously", () => {
    expect(used.size).toBeGreaterThan(100);
  });

  it("has a keyword for every component a taught kanji uses", () => {
    const missing = [...used].filter((g) => !componentByGlyph.has(g));
    expect(missing).toEqual([]);
  });

  it("has no keyword for a component nothing uses", () => {
    expect(allComponents.filter((c) => !used.has(c.glyph)).map((c) => c.glyph)).toEqual([]);
  });

  it("gives every component a non-empty keyword", () => {
    for (const c of allComponents) expect(c.keyword.trim().length).toBeGreaterThan(0);
  });

  it("keeps keywords short enough to read on a phone", () => {
    // A keyword is a label, not a definition. Anything long enough to wrap is
    // a note, and belongs in `note`.
    const tooLong = allComponents.filter((c) => c.keyword.length > 24).map((c) => c.glyph);
    expect(tooLong).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

```bash
pnpm exec vitest run src/content/kanji/components.test.ts
```

Expected: FAIL — `allComponents` is not exported from `./index` yet.

- [ ] **Step 3: List the components that need keywords**

```bash
node -e '
const d = require("./src/content/kanji/decomposition.json");
const taught = new Set(Object.keys(d.map));
const used = [...new Set(Object.values(d.map).flat())].sort();
const isKanji = (g) => taught.has(g);
console.log("# components that are themselves taught kanji (" + used.filter(isKanji).length + ")");
console.log(used.filter(isKanji).join(" "));
console.log("# radical-only, need a shape description (" + used.filter((g) => !isKanji(g)).length + ")");
console.log(used.filter((g) => !isKanji(g)).join(" "));
'
```

Use this list as your worklist. Cross-reference the kanji ones against `src/content/kanji/kanji.yaml`, which already holds their meanings — a component that is itself a taught kanji should get a keyword agreeing with that kanji's own primary meaning, so the learner does not meet two names for one shape.

- [ ] **Step 4: Write the keyword file**

Create `src/content/kanji/components.yaml`. Every component from Step 3 gets exactly one entry. Format:

```yaml
# Component keywords for the kanji intro card.
#
# Keywords are original work, written from KANJIDIC2 meanings and from plain
# shape description. Never adapted from Heisig's Remembering the Kanji or from
# WaniKani -- both are copyrighted keyword sets.
#
# A keyword is a label, not a definition. `note` carries the extra sentence a
# radical-only form needs; components that are themselves taught kanji take the
# same meaning that kanji already carries, so one shape never has two names.

- glyph: 日
  keyword: sun
- glyph: ⺡
  keyword: water
  note: the flowing form of 水, written down the left side
- glyph: 亻
  keyword: person
  note: the standing form of 人, written down the left side
```

Rules while authoring:
- One entry per component in Step 3's list, no more and no fewer. Both directions are tested.
- Keyword under 24 characters, lowercase unless it is a proper noun.
- `note` only where the shape genuinely needs explaining — most kanji-components need none.
- Never invent a meaning to make a story work. If a component's meaning is genuinely obscure, describe the shape (`"a lid"`, `"three strokes like grass"`) rather than guessing.

- [ ] **Step 5: Write the schema validator**

Create `src/content/kanji/componentSchema.ts`, mirroring the structure of the existing `src/content/kanji/schema.ts`.

```ts
import type { KanjiComponent } from "@/types";

class ComponentSchemaError extends Error {
  readonly raw: unknown;
  constructor(message: string, raw: unknown) {
    super(message);
    this.name = "ComponentSchemaError";
    this.raw = raw;
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export function parseComponents(raw: unknown, source: string): KanjiComponent[] {
  if (!Array.isArray(raw)) {
    throw new ComponentSchemaError(`${source}: top-level value must be an array`, raw);
  }
  const seen = new Set<string>();
  return raw.map((entry) => {
    if (!isRecord(entry)) throw new ComponentSchemaError(`${source}: entry is not an object`, entry);
    const glyph = entry.glyph;
    const keyword = entry.keyword;
    const note = entry.note;
    if (typeof glyph !== "string" || glyph.length === 0) {
      throw new ComponentSchemaError(`${source}: entry missing "glyph"`, entry);
    }
    if (typeof keyword !== "string" || keyword.length === 0) {
      throw new ComponentSchemaError(`${source}: "${glyph}" missing "keyword"`, entry);
    }
    if (note !== undefined && typeof note !== "string") {
      throw new ComponentSchemaError(`${source}: "${glyph}" has invalid "note"`, entry);
    }
    if (seen.has(glyph)) throw new ComponentSchemaError(`${source}: duplicate component "${glyph}"`, entry);
    seen.add(glyph);
    return note === undefined ? { glyph, keyword } : { glyph, keyword, note };
  });
}
```

- [ ] **Step 6: Wire it into `src/content/kanji/index.ts`**

Append to the existing file, keeping the current exports untouched.

```ts
import type { KanjiComponent } from "@/types";
import { parseComponents } from "./componentSchema";
import componentsRaw from "./components.yaml";

export const allComponents: readonly KanjiComponent[] = parseComponents(componentsRaw, "components.yaml");

export const componentByGlyph: ReadonlyMap<string, KanjiComponent> = new Map(
  allComponents.map((c) => [c.glyph, c]),
);
```

- [ ] **Step 7: Run the test and confirm it passes**

```bash
pnpm exec vitest run src/content/kanji/components.test.ts
```

Expected: PASS, 5 tests. If "has a keyword for every component" fails, the failure message lists exactly which glyphs you missed — add those entries rather than relaxing the test.

- [ ] **Step 8: Full check and commit**

```bash
pnpm build && pnpm test
git add src/content/kanji/components.yaml src/content/kanji/componentSchema.ts src/content/kanji/index.ts src/content/kanji/components.test.ts
git commit -m "feat(kanji): add component keywords"
```

Commit body must carry: `Source: original keywords written from KANJIDIC2 meanings and shape description; not adapted from any copyrighted keyword set.`

---

### Task 3: The taught / met / new resolver

**Files:**
- Modify: `src/types.ts`
- Create: `src/content/kanji/pieces.ts`
- Test: `src/content/kanji/pieces.test.ts`

**Interfaces:**
- Consumes: `KanjiComponent` from Task 1, `componentByGlyph` from Task 2.
- Produces:
  - `type ComponentState = "taught" | "met" | "new"`
  - `type KanjiPiece = KanjiComponent & { state: ComponentState }`
  - `function buildPieceIndex(lessons, decomposition, components): Map<string, KanjiPiece[]>`

**This resolver imports no content.** It takes the ladder, the decomposition and the keywords as parameters. That keeps it pure, keeps it testable against fixtures, and avoids the `content/index → books → lessons → content/index` import cycle this codebase has hit before.

- [ ] **Step 1: Add the state types to `src/types.ts`**

```ts
/**
 * What the learner already knows about one piece of a kanji, at the moment
 * that kanji is introduced. Derived from lesson order — never stored.
 *
 * "met" is what makes this layer honest without distorting the curriculum:
 * ⺡ is never taught as a kanji and never will be, but by its third appearance
 * the learner has met it three times and the card can say so.
 */
export type ComponentState = "taught" | "met" | "new";

export type KanjiPiece = KanjiComponent & { state: ComponentState };
```

- [ ] **Step 2: Write the failing test**

Create `src/content/kanji/pieces.test.ts`. These use **pure fixtures**, not real content — against the shipped ladder several of these assertions could pass by coincidence.

```ts
import { describe, expect, it } from "vitest";
import type { KanjiComponent, Lesson } from "@/types";
import { buildPieceIndex } from "./pieces";

const lesson = (id: string, order: number, kanji: string[]): Lesson => ({
  id, order, situation: "s", title: id, canDo: "c",
  wordIds: [], phraseIds: [], kanji, grammarNote: "",
});

const components: KanjiComponent[] = [
  { glyph: "日", keyword: "sun" },
  { glyph: "月", keyword: "moon" },
  { glyph: "⺡", keyword: "water" },
];

describe("buildPieceIndex", () => {
  it("labels a piece taught when an earlier lesson taught it as a kanji", () => {
    const lessons = [lesson("l1", 1, ["日"]), lesson("l2", 2, ["明"])];
    const index = buildPieceIndex(lessons, { 明: ["日", "月"], 日: [] }, components);
    expect(index.get("明")?.find((p) => p.glyph === "日")?.state).toBe("taught");
  });

  it("labels a piece new on its first appearance anywhere", () => {
    const lessons = [lesson("l1", 1, ["海"])];
    const index = buildPieceIndex(lessons, { 海: ["⺡"] }, components);
    expect(index.get("海")?.[0]?.state).toBe("new");
  });

  it("labels a piece met once it has appeared inside an earlier kanji", () => {
    // ⺡ is never taught as a kanji. It is new in 海 and met in 池.
    const lessons = [lesson("l1", 1, ["海"]), lesson("l2", 2, ["池"])];
    const index = buildPieceIndex(lessons, { 海: ["⺡"], 池: ["⺡"] }, components);
    expect(index.get("海")?.[0]?.state).toBe("new");
    expect(index.get("池")?.[0]?.state).toBe("met");
  });

  it("is order sensitive — the same piece is new then met", () => {
    // The assertion that catches a resolver ignoring lesson order entirely.
    const forward = buildPieceIndex(
      [lesson("l1", 1, ["海"]), lesson("l2", 2, ["池"])],
      { 海: ["⺡"], 池: ["⺡"] }, components,
    );
    const reversed = buildPieceIndex(
      [lesson("l1", 1, ["池"]), lesson("l2", 2, ["海"])],
      { 海: ["⺡"], 池: ["⺡"] }, components,
    );
    expect(forward.get("海")?.[0]?.state).toBe("new");
    expect(reversed.get("海")?.[0]?.state).toBe("met");
  });

  it("counts a kanji taught earlier in the same lesson as taught", () => {
    // Intro cards render in lesson order, so by the time 明 is on screen the
    // learner has just met 日 on the card before it.
    const index = buildPieceIndex([lesson("l1", 1, ["日", "明"])], { 日: [], 明: ["日"] }, components);
    expect(index.get("明")?.[0]?.state).toBe("taught");
  });

  it("gives a kanji with no components an empty list, not undefined", () => {
    const index = buildPieceIndex([lesson("l1", 1, ["水"])], { 水: [] }, components);
    expect(index.get("水")).toEqual([]);
  });

  it("skips a component that has no keyword rather than rendering a blank", () => {
    const index = buildPieceIndex([lesson("l1", 1, ["謎"])], { 謎: ["言", "日"] }, components);
    expect(index.get("謎")?.map((p) => p.glyph)).toEqual(["日"]);
  });

  it("sorts lessons by order rather than trusting array position", () => {
    const index = buildPieceIndex(
      [lesson("l2", 2, ["明"]), lesson("l1", 1, ["日"])],
      { 日: [], 明: ["日"] }, components,
    );
    expect(index.get("明")?.[0]?.state).toBe("taught");
  });
});
```

- [ ] **Step 3: Run and confirm it fails**

```bash
pnpm exec vitest run src/content/kanji/pieces.test.ts
```

Expected: FAIL resolving `./pieces`.

- [ ] **Step 4: Write the resolver**

Create `src/content/kanji/pieces.ts`.

```ts
import type { KanjiComponent, KanjiPiece, Lesson } from "@/types";

/**
 * Resolve every taught kanji's components to taught / met / new, as of the
 * moment that kanji is introduced.
 *
 * Pure and parameterised: the ladder, the decomposition and the keywords all
 * arrive as arguments. That keeps it testable against fixtures and keeps
 * src/content/kanji/ free of an import cycle back through the lesson index.
 *
 * Walks in lesson order, then in the order a lesson lists its kanji, because
 * that is the order the learner meets the intro cards.
 */
export function buildPieceIndex(
  lessons: readonly Lesson[],
  decomposition: Readonly<Record<string, readonly string[]>>,
  components: readonly KanjiComponent[],
): Map<string, KanjiPiece[]> {
  const byGlyph = new Map(components.map((c) => [c.glyph, c]));
  const taught = new Set<string>();
  const met = new Set<string>();
  const index = new Map<string, KanjiPiece[]>();

  for (const lesson of [...lessons].sort((a, b) => a.order - b.order)) {
    for (const character of lesson.kanji) {
      const parts = decomposition[character] ?? [];
      const pieces: KanjiPiece[] = [];
      for (const glyph of parts) {
        const component = byGlyph.get(glyph);
        // A component with no keyword is skipped rather than rendered blank.
        // The components test fails when one is missing, so this is a
        // rendering safeguard, not a way to tolerate incomplete content.
        if (component === undefined) continue;
        const state = taught.has(glyph) ? "taught" : met.has(glyph) ? "met" : "new";
        pieces.push({ ...component, state });
      }
      index.set(character, pieces);

      // Only after resolving: a kanji is not a known piece of itself.
      taught.add(character);
      for (const glyph of parts) met.add(glyph);
    }
  }
  return index;
}
```

- [ ] **Step 5: Run and confirm it passes**

```bash
pnpm exec vitest run src/content/kanji/pieces.test.ts
```

Expected: PASS, 8 tests.

- [ ] **Step 6: Prove the order-sensitivity test can fail**

The order test is the one that catches the most likely wrong implementation. Break the resolver deliberately by moving the two `taught.add` / `met.add` lines above the `for (const glyph of parts)` resolution loop, re-run, and confirm the "order sensitive" and "labels a piece new" tests fail. Then restore.

- [ ] **Step 7: Full check and commit**

```bash
pnpm build && pnpm test
git add src/types.ts src/content/kanji/pieces.ts src/content/kanji/pieces.test.ts
git commit -m "feat(kanji): resolve component states from ladder order"
```

---

### Task 4: The card row and the gaps report

**Files:**
- Modify: `src/content/kanji/index.ts`
- Modify: `src/components/KanjiIntroCard.tsx`
- Modify: `scripts/kanji.mjs`
- Modify: `package.json`
- Test: `src/components/KanjiIntroCard.dom.test.tsx`

**Interfaces:**
- Consumes: `buildPieceIndex` from Task 3, `allComponents` from Task 2, `decomposition.json` from Task 1.
- Produces: `const piecesByCharacter: ReadonlyMap<string, KanjiPiece[]>`, and a `pieces?: readonly KanjiPiece[]` prop on `KanjiIntroCard`.

- [ ] **Step 1: Wire the real index in `src/content/kanji/index.ts`**

Append. `n5Lessons` is the shipping ladder here — correct for this use, because it is what the learner actually walks. This import direction is safe: `content/kanji` is not part of the `content/index → books → lessons` cycle.

```ts
import type { KanjiPiece } from "@/types";
import { n5Lessons } from "@/content/lessons";
import { buildPieceIndex } from "./pieces";
import decomposition from "./decomposition.json";

export const piecesByCharacter: ReadonlyMap<string, KanjiPiece[]> = buildPieceIndex(
  n5Lessons,
  decomposition.map,
  allComponents,
);
```

If this import produces a cycle warning at build time, stop and report it rather than restructuring — the fallback is to resolve in `LearnPage` instead, and that is a decision for the controller.

- [ ] **Step 2: Write the failing test**

Append to `src/components/KanjiIntroCard.dom.test.tsx`.

```tsx
const pieces: KanjiPiece[] = [
  { glyph: "日", keyword: "sun", state: "taught" },
  { glyph: "⺡", keyword: "water", note: "the flowing form of 水", state: "met" },
  { glyph: "寸", keyword: "thumb", state: "new" },
];

describe("KanjiIntroCard component row", () => {
  afterEach(cleanup);

  it("shows each piece with its keyword", () => {
    render(<KanjiIntroCard kanji={water} pieces={pieces} />);
    expect(screen.getByText("sun")).toBeTruthy();
    expect(screen.getByText("water")).toBeTruthy();
    expect(screen.getByText("thumb")).toBeTruthy();
  });

  it("says you know the pieces you were taught", () => {
    render(<KanjiIntroCard kanji={water} pieces={pieces} />);
    expect(screen.getByText(/you know this/i)).toBeTruthy();
  });

  it("says you have seen a met piece, without claiming you know it", () => {
    render(<KanjiIntroCard kanji={water} pieces={pieces} />);
    expect(screen.getByText(/you've seen this/i)).toBeTruthy();
  });

  it("renders no component row at all when there are no pieces", () => {
    render(<KanjiIntroCard kanji={water} pieces={[]} />);
    expect(screen.queryByText(/made of/i)).toBeNull();
  });

  it("renders without a pieces prop, since the row is additive", () => {
    render(<KanjiIntroCard kanji={water} />);
    expect(screen.getByText("水")).toBeTruthy();
  });
});
```

- [ ] **Step 3: Run and confirm it fails**

```bash
pnpm exec vitest run src/components/KanjiIntroCard.dom.test.tsx
```

Expected: FAIL — `KanjiIntroCard` takes no `pieces` prop yet.

- [ ] **Step 4: Add the row to `KanjiIntroCard`**

Change the props type and add the row below the existing readings block.

```tsx
type Props = { kanji: Kanji; pieces?: readonly KanjiPiece[] };
```

```tsx
      {pieces !== undefined && pieces.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-border pt-3">
          <p className="text-caption font-medium uppercase tracking-wider text-fg-subtle">Made of</p>
          <ul className="flex flex-col gap-1">
            {pieces.map((p) => (
              <li key={p.glyph} className="flex items-baseline gap-2 text-body-sm">
                <span lang="ja" className="text-body text-fg" style={{ fontFamily: "var(--font-jp)" }}>
                  {p.glyph}
                </span>
                <span className="text-fg">{p.keyword}</span>
                {p.state === "taught" && <span className="text-caption text-fg-subtle">you know this</span>}
                {p.state === "met" && <span className="text-caption text-fg-subtle">you've seen this</span>}
                {p.note !== undefined && <span className="text-caption text-fg-subtle">{p.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
```

A *new* piece gets no label — its keyword is the introduction, and a "new" badge would be noise on the one thing the learner is actually here to learn.

- [ ] **Step 5: Pass the pieces from `LearnPage`**

In `src/pages/LearnPage.tsx`, at the `KanjiIntroCard` call site inside the new-lesson step:

```tsx
import { piecesByCharacter } from "@/content/kanji";
```

```tsx
<KanjiIntroCard key={k.id} kanji={k} pieces={piecesByCharacter.get(k.character)} />
```

- [ ] **Step 6: Run tests and confirm they pass**

```bash
pnpm exec vitest run src/components/KanjiIntroCard.dom.test.tsx
```

Expected: PASS, all tests including the five new ones.

- [ ] **Step 7: Add the gaps report**

Add to `scripts/kanji.mjs`, above the dispatch. Advisory output only — it never exits non-zero, because a lesson introducing a kanji with two new components is a legitimate authoring choice (spec decision 4).

```js
async function gaps() {
  const decomp = JSON.parse(readFileSync(DECOMP_OUT, "utf8")).map;
  const taught = new Set(Object.keys(decomp));

  console.log("# Kanji whose components are all new at introduction\n");
  const seen = new Set();
  const met = new Set();
  for (const c of taughtCharacters()) {
    const parts = decomp[c] ?? [];
    const known = parts.filter((p) => seen.has(p) || met.has(p));
    if (parts.length > 0 && known.length === 0) console.log(`  ${c} — ${parts.join(" ")}`);
    seen.add(c);
    for (const p of parts) met.add(p);
  }

  console.log("\n# Decompositions worth an author's eye\n");
  for (const [c, parts] of Object.entries(decomp)) {
    // KRADFILE is built for radical lookup, not teaching. Long lists and
    // near-duplicate parts (母 beside 毋) are where it misleads.
    if (parts.length >= 5) console.log(`  ${c} — ${parts.length} parts: ${parts.join(" ")}`);
  }

  const used = new Set(Object.values(decomp).flat());
  console.log(`\n# Totals\n`);
  console.log(`  ${taught.size} kanji, ${used.size} distinct components`);
  console.log(`  ${[...used].filter((g) => taught.has(g)).length} components are themselves taught kanji`);
  console.log(`  ${Object.values(decomp).filter((v) => v.length === 0).length} kanji render no component row`);
}
```

Extend the dispatch:

```js
if (cmd === "build") await build();
else if (cmd === "decompose") await decompose();
else if (cmd === "gaps") await gaps();
else { console.error(`usage: kanji.mjs build|decompose|gaps`); process.exit(1); }
```

Add the script entry to `package.json` alongside the existing `ladder` and `reading` entries:

```json
"kanji": "node scripts/kanji.mjs",
```

- [ ] **Step 8: Run the report and read it**

```bash
node scripts/kanji.mjs gaps
```

Expected: a list of all-new-component kanji, the long decompositions (顔 with 8 parts, 頭 and 塩 with 7, 難 with 6), and the totals. Paste the totals block into your report — it is the measurement the spec asks for, and nobody has seen it yet.

- [ ] **Step 9: Confirm the ladder doc is untouched and walk the ladder**

```bash
pnpm ladder && git diff --exit-code docs/book-one-ladder.md && echo "ladder byte-identical"
pnpm walkthrough
```

The walkthrough takes ~45 minutes and must reach "All caught up" with zero console and page errors. The intro card now renders more per kanji, and `n5.people-body` introduces 7 at once — this is the check that the new-lesson step still fits and still advances.

- [ ] **Step 10: Commit**

```bash
pnpm build && pnpm test
git add src/content/kanji/index.ts src/components/KanjiIntroCard.tsx src/components/KanjiIntroCard.dom.test.tsx src/pages/LearnPage.tsx scripts/kanji.mjs package.json
git commit -m "feat(kanji): show what a new kanji is made of"
```

---

## Self-review

**Spec coverage.** Decision 1 (keywords, no per-kanji mnemonics) → Task 2; nothing in the plan authors a per-kanji story. Decision 2 (KRADFILE, licence in its own file) → Task 1, with the attribution asserted by a test so regeneration cannot silently drop it. Decision 3 (Book One backfilled, data and surface) → Tasks 1 and 4; the decomposition covers all 200 and the row renders for every lesson. Decision 4 (no reordering; a tool reports gaps) → Task 4 Step 7, advisory and never failing. The three states → Task 3. `KanjiComponent` type → Task 1 Step 1. Components as annotations with no id and no `ReviewState` → held throughout; no task adds one.

Spec testing section: "every component referenced has a keyword" → Task 2 Step 1, both directions; "not stale" → Task 1's coverage and orphan tests; "state resolution is correct" and "state is order-sensitive" → Task 3 Step 2 on fixtures; "ladder unchanged" → Task 4 Step 9; "attribution survives" → Task 1 Step 2.

**Gap found and closed:** the spec never says what happens to a kanji whose only KRADFILE component is itself — 31 of the 200. Left unhandled, every such card would read "水 is made of: 水". Task 1's generator drops self-reference, Task 1's test asserts it never appears, and Task 4's test asserts an empty list renders no row.

**Second gap closed:** the spec never says what a *new* piece looks like on screen. Task 4 Step 4 states it explicitly — no label, because the keyword is the introduction.

**Placeholder scan.** No TBD, no "handle edge cases", no "similar to Task N". Every code step carries runnable code.

**Type consistency.** `KanjiComponent` is defined in Task 1 and consumed in Tasks 2, 3, 4. `KanjiPiece = KanjiComponent & { state }` in Task 3, consumed in Task 4. `buildPieceIndex(lessons, decomposition, components)` has the same three-parameter signature in its definition (Task 3 Step 4), its tests (Task 3 Step 2) and its call site (Task 4 Step 1). `decomposition.json` is `{ _source, _licence, map }` in Task 1 and read as `decomposition.map` in Tasks 3 and 4. `componentByGlyph` (Task 2) and `piecesByCharacter` (Task 4) are distinct maps with distinct purposes and are never confused.
