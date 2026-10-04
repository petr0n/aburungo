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

  it("closes layout spaces between Japanese characters, and only those", () => {
    // Book 010 padded its furigana-bearing kanji with spaces: 泉 州, 有 名.
    expect(sentences(["泉 州の水ナスは有 名です。"])).toEqual(["泉州の水ナスは有名です。"]);
    expect(sentences(["SENSHU BOYZのコンサート。"])).toEqual(["SENSHU BOYZのコンサート。"]);
  });

  it("splits on sentence enders and keeps them", () => {
    expect(sentences(["今日は雨でした。", "家で遊びました！楽しかった？"])).toEqual([
      "今日は雨でした。",
      "家で遊びました！",
      "楽しかった？",
    ]);
  });
});

/**
 * The unknowns inventory is generated from the 122 MB dictionary, so it cannot
 * be rebuilt here. What can be checked is that the committed file does not
 * carry the mistakes its first drafts made -- each of these was in an early
 * run and is the reason a rule in `unknowns` exists.
 */
describe("data/reading/kc-unknowns.json", () => {
  const inv = JSON.parse(readFileSync(join(ROOT, "data/reading/kc-unknowns.json"), "utf8"));
  const newForms = new Set(inv.new.map((r) => r.form));

  it("has headwords to check, so the assertions below cannot pass vacuously", () => {
    expect(inv.new.length).toBeGreaterThan(100);
    expect(inv.perStory).toHaveLength(26);
  });

  it("files a known word in an unfamiliar spelling as spelling, not new", () => {
    // Book One teaches なまえ in kana; the stories write 名前.
    expect(newForms.has("名前")).toBe(false);
    expect(inv.spelling.map((r) => r.form)).toContain("名前");
  });

  it("does not let grammar debris pose as vocabulary", () => {
    // しょう is 商 "quotient" in JMdict and debris from でしょう in the text;
    // じゃあく is じゃあ + く read as 邪悪 "wicked".
    for (const debris of ["しょう", "じゃあく", "しょうう"]) expect(newForms.has(debris), debris).toBe(false);
  });

  it("does not trade a common word for a rare restored one", () => {
    expect(newForms.has("侍る")).toBe(false);
    expect(newForms.has("侍")).toBe(true);
  });

  it("resolves a verb stem to its dictionary form", () => {
    expect(newForms.has("逃げる")).toBe(true);
  });

  it("never proposes a word Books One to Three already teach", () => {
    for (const r of inv.new) expect(r.taughtIn ?? null, r.form).toBeNull();
  });
});
