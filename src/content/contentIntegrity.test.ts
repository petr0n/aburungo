/**
 * Structural guarantees for the content tree.
 *
 * These live in a test rather than as a module-load check because `vite build`
 * bundles the content without executing it — a throw at module scope only fires
 * in the browser. Two duplicate-id bugs (vocab.asa, then vocab.noru/oriru) got
 * past a green build that way.
 */
import { describe, expect, it } from "vitest";
import { allWords } from "./vocabulary";
import { n5Lessons } from "./lessons";

describe("content integrity", () => {
  it("has no duplicate word ids across files", () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const w of allWords) {
      if (seen.has(w.id)) dupes.push(w.id);
      seen.add(w.id);
    }
    expect(dupes).toEqual([]);
  });

  it("has no lesson referencing a word that does not exist", () => {
    const ids = new Set(allWords.map((w) => w.id));
    const dangling: string[] = [];
    for (const u of n5Lessons) {
      for (const id of u.wordIds) if (!ids.has(id)) dangling.push(`${u.id} -> ${id}`);
    }
    expect(dangling).toEqual([]);
  });

  it("teaches every word somewhere in the ladder", () => {
    // A word no lesson references is content the learner never meets. 41 words
    // sat orphaned this way before the depth pass.
    const taught = new Set(n5Lessons.flatMap((u) => u.wordIds));
    const orphans = allWords.filter((w) => !taught.has(w.id)).map((w) => w.id);
    expect(orphans).toEqual([]);
  });
});

/**
 * The shipped ladder shape.
 *
 * Hana is shelved (DR-023), so these assert what a learner *actually* gets. The
 * conversation lessons are still authored and still tested as components — they
 * are simply filtered out of the ladder, and this is the guard that says so.
 * Flip VITE_HANA_ENABLED and these expectations change by design.
 */
describe("the ladder with Hana shelved", () => {
  it("ends on the production checkpoint", () => {
    const last = n5Lessons[n5Lessons.length - 1];
    expect(last?.checkpoint).toBe("production");
  });

  it("carries no lesson that would need an API call", () => {
    // The failure this guards: a Hana lesson reaching the ladder and becoming a
    // screen that apologises for itself, which is the dead end DR-022 removed.
    const gated = n5Lessons.filter((u) => u.checkpoint === "conversation" || u.checkpoint === "can-do");
    expect(gated.map((u) => u.id)).toEqual([]);
  });

  it("has contiguous orders with no gap left by the filtered lessons", () => {
    expect(n5Lessons.map((u) => u.order)).toEqual(n5Lessons.map((_, i) => i + 1));
  });

  it("puts production after the last recognition checkpoint, not before it", () => {
    // Recognise everything, then produce it. The reverse would gate on the
    // harder skill first and make the recognition checkpoint redundant.
    const lastRecognition = [...n5Lessons].reverse().find((u) => u.checkpoint === "recognition");
    const production = n5Lessons.find((u) => u.checkpoint === "production");
    expect(production?.order).toBeGreaterThan(lastRecognition?.order ?? Infinity);
  });
});
