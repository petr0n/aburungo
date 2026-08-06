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
import { n5Units } from "./units";

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

  it("has no unit referencing a word that does not exist", () => {
    const ids = new Set(allWords.map((w) => w.id));
    const dangling: string[] = [];
    for (const u of n5Units) {
      for (const id of u.wordIds) if (!ids.has(id)) dangling.push(`${u.id} -> ${id}`);
    }
    expect(dangling).toEqual([]);
  });

  it("teaches every word somewhere in the ladder", () => {
    // A word no unit references is content the learner never meets. 41 words
    // sat orphaned this way before the depth pass.
    const taught = new Set(n5Units.flatMap((u) => u.wordIds));
    const orphans = allWords.filter((w) => !taught.has(w.id)).map((w) => w.id);
    expect(orphans).toEqual([]);
  });
});
