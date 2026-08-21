/**
 * The levelling rules behind `reading.mjs`.
 *
 * Same discipline as jlpt.test.mjs: each case pins a behaviour the pipeline
 * depends on, several of them inherited traps that already shipped once in
 * the sentences command (compound hiding, prefix inflation).
 */
import { describe, it, expect } from "vitest";
import {
  buildLexicon, tokenize, levelSentence, band, grammarSurface, matchesGrammar, tagSentence,
} from "./levelling.mjs";

const WORDS = [
  { id: "vocab.watashi", japanese: "私", reading: "わたし" },
  { id: "vocab.taberu", japanese: "食べる", reading: "たべる" },
  { id: "vocab.pan", japanese: "パン", reading: "パン" },
  { id: "vocab.nani", japanese: "何", reading: "なに" },
  { id: "vocab.hito", japanese: "人", reading: "ひと" },
];
const lexicon = buildLexicon(WORDS);
const ALL = new Set(WORDS.map((w) => w.id));

describe("tokenize", () => {
  it("matches an inflected verb via its kanji prefix and files the ending as structure", () => {
    const kinds = tokenize("私はパンを食べます。", lexicon).map((t) => `${t.text}:${t.kind}`);
    expect(kinds).toEqual([
      "私:item", "は:structural", "パン:item", "を:structural", "食べ:item", "ます:structural", "。:other",
    ]);
  });

  it("merges an unmatched run into one unknown token, not one per character", () => {
    // An unknown three-character word is one unknown thing, not three.
    const unknown = tokenize("すみません", buildLexicon([])).filter((t) => t.kind === "unknown");
    expect(unknown).toHaveLength(1);
  });

  it("keeps punctuation, digits and latin out of the counted kinds", () => {
    const tokens = tokenize("私は3ＣＤ。", lexicon);
    expect(tokens.filter((t) => t.kind === "other").map((t) => t.text)).toEqual(["3ＣＤ。"]);
  });

  it("rejects a compound whose parts are taught but whose whole is not", () => {
    // The jlpt.mjs trap: 何人 splits into 何 + 人, both taught, so without the
    // guard the tokenizer calls 何人 known. The JMdict common-form guard makes
    // the whole compound one unknown token instead.
    const guarded = buildLexicon(WORDS, new Set(["何人"]));
    const tokens = tokenize("何人", guarded);
    expect(tokens).toEqual([{ text: "何人", kind: "unknown" }]);
    // Without the guard it slips through — documenting the failure mode.
    expect(tokenize("何人", lexicon).every((t) => t.kind === "item")).toBe(true);
  });
});

describe("levelSentence", () => {
  it("returns full coverage when every content token is known", () => {
    const r = levelSentence("私はパンを食べます。", lexicon, ALL);
    expect(r.coverage).toBe(1);
    expect(r.totalTokens).toBe(6);
    expect(r.unknownItemIds).toEqual([]);
    expect(r.unknownRuns).toEqual([]);
  });

  it("names a taught item the learner has not met — the servable i+1 material", () => {
    const known = new Set(ALL);
    known.delete("vocab.pan");
    const r = levelSentence("私はパンを食べます。", lexicon, known);
    expect(r.coverage).toBeCloseTo(5 / 6);
    expect(r.unknownItemIds).toEqual(["vocab.pan"]);
    expect(r.unknownRuns).toEqual([]);
  });

  it("names untaught text as an unknown run, separately from unmet items", () => {
    const r = levelSentence("私は犬です。", lexicon, ALL);
    expect(r.unknownRuns).toEqual(["犬"]);
    expect(r.unknownItemIds).toEqual([]);
    expect(r.coverage).toBeCloseTo(3 / 4);
  });

  it("counts structural machinery in the denominator, per running-word coverage", () => {
    // Hu & Nation's ~98% counts function words; excluding them would deflate
    // every sentence and make the bands lie.
    const r = levelSentence("私です。", lexicon, ALL);
    expect(r.totalTokens).toBe(2);
  });

  it("is pure in the known set: same sentence, different learner, different answer", () => {
    const none = levelSentence("私はパンを食べます。", lexicon, new Set());
    expect(none.coverage).toBeCloseTo(3 / 6); // only は, を, ます remain known
    expect(none.unknownItemIds).toContain("vocab.watashi");
  });

  it("returns zero coverage for a sentence with no countable tokens", () => {
    expect(levelSentence("123.", lexicon, ALL).coverage).toBe(0);
  });
});

describe("band", () => {
  it("buckets at the boundaries the library will query", () => {
    expect(band(1)).toBe("100");
    expect(band(0.97)).toBe("95");
    expect(band(0.92)).toBe("90");
    expect(band(0.5)).toBe("below");
  });
});

describe("grammarSurface", () => {
  it("turns a placeholder pattern into in-order literal fragments", () => {
    expect(grammarSurface("～は～です")).toEqual(["は", "です"]);
    expect(grammarSurface("～をください")).toEqual(["をください"]);
    expect(grammarSurface("いくらですか")).toEqual(["いくらですか"]);
  });

  it("refuses patterns with no single literal surface", () => {
    expect(grammarSurface("number + えん")).toBeNull();
    expect(grammarSurface("ありがとうございます／どういたしまして")).toBeNull();
    expect(grammarSurface("")).toBeNull();
  });

  it("refuses a pattern whose longest fragment is one character — noise, not detection", () => {
    expect(grammarSurface("～と～")).toBeNull();
  });
});

describe("matchesGrammar", () => {
  it("requires the fragments in pattern order", () => {
    expect(matchesGrammar("これは本です。", ["は", "です"])).toBe(true);
    expect(matchesGrammar("ですはこれ", ["は", "です"])).toBe(false);
    expect(matchesGrammar("これです。", ["は", "です"])).toBe(false);
  });
});

describe("tagSentence", () => {
  const grammar = [
    { id: "grammar.wa-desu", fragments: grammarSurface("～は～です") },
    { id: "grammar.kudasai", fragments: grammarSurface("～をください") },
    { id: "grammar.undetectable", fragments: grammarSurface("number + えん") },
  ];

  it("tags by vocabulary ids, taught kanji, and detectable grammar", () => {
    const tags = tagSentence("私はパンです。", lexicon, new Set(["私", "人"]), grammar);
    expect(tags.vocabIds).toEqual(["vocab.watashi", "vocab.pan"]);
    expect(tags.kanji).toEqual(["私"]);
    expect(tags.grammarIds).toEqual(["grammar.wa-desu"]);
  });

  it("never tags an undetectable pattern", () => {
    const tags = tagSentence("五百えんです。", lexicon, new Set(), grammar);
    expect(tags.grammarIds).toEqual([]);
  });
});
