import { describe, expect, it } from "vitest";
import { allKanji, kanjiByCharacter, piecesByCharacter } from "./index";
import { kanjiId, isKanji, isGrammarPattern } from "@/types";

/**
 * Every character any lesson file declares — derived the way the generator
 * derives it (scripts/kanji.mjs), straight off the raw YAML.
 *
 * Deliberately not `n5Lessons`: that list is the *shipping ladder*, filtered by
 * `hanaEnabled` (DR-023), so conversation and can-do checkpoints drop out of it
 * — n5.unit-38 declares 9 kanji and is absent whenever Hana is off, which is
 * the default. Checking the generator's output against a smaller set would make
 * "no entry that no lesson teaches" fail on a correct change the moment a gated
 * lesson is the only one teaching a character, and would make what this file
 * checks depend on VITE_HANA_ENABLED. Globbing also picks up N4+ lesson files
 * without anyone remembering to add them here.
 */
const lessonFiles = import.meta.glob("../lessons/*.yaml", { eager: true, import: "default" });

const taught = new Set<string>();
for (const entries of Object.values(lessonFiles)) {
  if (!Array.isArray(entries)) continue;
  for (const entry of entries) {
    if (typeof entry !== "object" || entry === null || !("kanji" in entry)) continue;
    const { kanji } = entry;
    if (!Array.isArray(kanji)) continue;
    for (const c of kanji) if (typeof c === "string") taught.add(c);
  }
}

describe("kanji content scope", () => {
  it("has characters to check, so the assertions below cannot pass vacuously", () => {
    expect(taught.size).toBeGreaterThan(0);
  });

  it("reads every lesson file, not just the ones the shipping ladder keeps", () => {
    // n5-10-checkpoint.yaml holds n5.unit-38, the conversation checkpoint that
    // drops out of n5Lessons while Hana is off. If the glob stops matching it,
    // `taught` silently narrows and this file goes back to testing the ladder.
    const names = Object.keys(lessonFiles);
    expect(names.length).toBeGreaterThan(20);
    expect(names.some((n) => n.endsWith("n5-10-checkpoint.yaml"))).toBe(true);
  });

  it("has an entry for every character a lesson teaches", () => {
    const missing = [...taught].filter((c) => !kanjiByCharacter.has(c));
    expect(missing).toEqual([]);
  });

  it("has no entry that no lesson teaches", () => {
    const orphans = allKanji.filter((k) => !taught.has(k.character)).map((k) => k.character);
    expect(orphans).toEqual([]);
  });

  it("resolves component states for every character, gated lessons included", () => {
    // piecesByCharacter is built from n5Lessons, which drops Hana lessons
    // while the AI is shelved (DR-023) -- the same hazard this file globs raw
    // YAML to avoid. A gated lesson introducing a character no other lesson
    // teaches would leave it with no component row, and only with Hana off,
    // which is the default and so the quiet case.
    const missing = allKanji.filter((k) => !piecesByCharacter.has(k.character)).map((k) => k.character);
    expect(missing).toEqual([]);
    expect(piecesByCharacter.size).toBe(allKanji.length);
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
