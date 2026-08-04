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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
