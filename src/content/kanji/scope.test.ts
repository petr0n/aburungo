import { describe, expect, it } from "vitest";
import { n5Lessons } from "@/content/lessons";
import { allKanji, kanjiByCharacter } from "./index";
import { kanjiId, isKanji, isGrammarPattern } from "@/types";

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

  it("has a guard that does not match words, phrases or patterns", () => {
    const first = allKanji[0];
    expect(first).toBeDefined();
    if (first === undefined) return;
    expect(isKanji(first)).toBe(true);
    expect(isGrammarPattern(first)).toBe(false);
  });
});
