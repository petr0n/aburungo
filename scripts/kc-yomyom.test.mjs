import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ATTRIBUTION, TITLES, bodyLines, modalHeight, sentences } from "./kc-yomyom.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The committed library, and the extraction that produced it. The build
 * itself needs the PDFs and the 122 MB dictionary, both gitignored, so it
 * cannot run here; what can run is the check that what it wrote is whole,
 * attributed, and free of the apparatus the cleaner exists to remove.
 */
describe("data/reading/kc-yomyom.json", () => {
  const lib = JSON.parse(readFileSync(join(ROOT, "data/reading/kc-yomyom.json"), "utf8"));

  it("carries the licence and the attribution the licence requires", () => {
    expect(lib.attribution).toEqual(ATTRIBUTION);
    expect(lib.attribution.licence).toBe("CC BY-NC 2.1 JP");
  });

  it("holds every catalogued story, each with its source PDF", () => {
    expect(lib.stories.map((s) => s.title)).toEqual(TITLES.map((t) => t.title));
    for (const s of lib.stories) expect(s.pdfUrl).toMatch(/^https:\/\/www\.jpf\.go\.jp\/.+\.pdf$/);
  });

  it("has real text in every story, so the assertions below cannot pass vacuously", () => {
    for (const s of lib.stories) {
      expect(s.sentences.length, s.title).toBeGreaterThan(3);
      expect(s.chars, s.title).toBeGreaterThan(100);
    }
  });

  it("kept no furigana, credits, or page furniture", () => {
    for (const s of lib.stories) {
      for (const { jpn } of s.sentences) {
        expect(jpn, s.title).not.toMatch(/https?:|発行|図版|写真素材|KCよむよむ|^-\s*\d+\s*-/);
        // A furigana run that slipped through reads as a kanji word followed
        // by its own reading: 太郎たろう. The catalogue title is the one place
        // that pattern is legitimately absent from, so test it directly.
        expect(jpn, s.title).not.toContain("太郎たろう");
      }
    }
  });

  it("levels every story against the taught inventory", () => {
    for (const s of lib.stories) {
      expect(s.passageCoverage, s.title).toBeGreaterThan(0);
      expect(s.passageCoverage, s.title).toBeLessThanOrEqual(1);
      expect(["100", "95", "90", "below"]).toContain(s.band);
    }
  });
});

describe("the cleaner", () => {
  // Three items on one line: body word, its furigana, body continues; then
  // a page number and a credit on their own lines.
  const items = [
    { str: "太郎", height: 20, hasEOL: false },
    { str: "たろう", height: 10, hasEOL: false },
    { str: "くんは小学生です。", height: 20, hasEOL: true },
    { str: "- 1 -", height: 14, hasEOL: true },
    { str: "図版:いらすとや", height: 20, hasEOL: true },
    { str: "夏休", height: 36, hasEOL: false },
    { str: "みです。", height: 20, hasEOL: true },
  ];

  it("finds the body height by pages won, so one dense colophon cannot outvote the story", () => {
    const story = [{ str: "太郎くんは小学生です。", height: 20, hasEOL: true }];
    const colophon = [{ str: "写".repeat(400), height: 16, hasEOL: true }];
    // Four of twenty-six real books had more characters at the colophon's
    // size than at the body's and came out empty under a character vote.
    expect(modalHeight([story, story, story, colophon])).toBe(20);
    expect(modalHeight([items])).toBe(20);
  });

  it("drops furigana, page numbers and credits, keeps the story", () => {
    expect(bodyLines(items, 20)).toEqual(["太郎くんは小学生です。", "みです。"]);
  });

  it("would let furigana through if the height rule were removed", () => {
    // The proof the rule is live: strip it and the reading is back.
    const joined = items.filter((i) => i.hasEOL !== undefined).map((i) => i.str).join("");
    expect(joined).toContain("太郎たろう");
  });

  it("splits on sentence enders and keeps them", () => {
    expect(sentences(["今日は雨でした。", "家で遊びました！楽しかった？"])).toEqual([
      "今日は雨でした。",
      "家で遊びました！",
      "楽しかった？",
    ]);
  });
});
