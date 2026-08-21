/**
 * The matching rules behind `jlpt.mjs sentences`.
 *
 * Every case here is a bug that actually shipped into a run of the command, not
 * a hypothetical. The segmentation rules look obvious and are not: each one was
 * written, run against 26,000 real sentences, and found wrong.
 */
import { describe, it, expect } from "vitest";
import {
  normReading, searchStem, conjugationStem, runCovered, uncoveredRuns, segmentationVocab, isPolite,
  writtenCompatible,
} from "./jlpt.mjs";

describe("normReading", () => {
  it("folds katakana to hiragana so a word matches whichever way it is written", () => {
    expect(normReading("コーヒー")).toBe("こーひー");
    expect(normReading("あさ")).toBe("あさ");
  });

  it("strips the spacing and interpuncts the source lists use", () => {
    expect(normReading("お・かあ さん")).toBe("おかあさん");
  });
});

describe("searchStem", () => {
  it("drops okurigana from verbs, because sentences inflect them", () => {
    // The corpus says 洗って and 洗います; neither contains the string 洗う.
    expect(searchStem("洗う", "verb")).toBe("洗");
    expect(searchStem("食べる", "verb")).toBe("食");
    expect(searchStem("大きい", "i-adj")).toBe("大");
  });

  it("leaves non-inflecting words whole", () => {
    // 私たち trimmed to 私 matched every sentence containing "I".
    expect(searchStem("私たち", "noun")).toBe("私たち");
    expect(searchStem("子供", "noun")).toBe("子供");
  });

  it("returns kana-only words unchanged", () => {
    expect(searchStem("おばあさん", "noun")).toBe("おばあさん");
    expect(searchStem("あらう", "verb")).toBe("あらう");
  });
});

describe("conjugationStem", () => {
  it("cuts an ichidan verb at its real stem, not the kanji boundary", () => {
    // 開 also begins 開きます, a different verb. 開け does not.
    expect(conjugationStem("開ける", ["v1", "vt"])).toBe("開け");
    expect(conjugationStem("入れる", ["v1", "vt"])).toBe("入れ");
    expect(conjugationStem("教える", ["v1", "vt"])).toBe("教え");
  });

  it("falls back to the kanji stem for a godan verb", () => {
    // 洗います and 洗って differ right after 洗, so there is nothing tighter.
    expect(conjugationStem("洗う", ["v5u", "vt"])).toBe("洗");
    expect(conjugationStem("知る", ["v5r", "vt"])).toBe("知");
  });

  it("cuts a kana reading the same way, so kana-written sentences match", () => {
    // A sentence may write the verb as あけます where the headword is 開ける;
    // searching only the written form misses every one of them.
    expect(conjugationStem("あける", ["v1", "vt"])).toBe("あけ");
    expect(conjugationStem("いれる", ["v1", "vt"])).toBe("いれ");
    // Godan kana has no safe cut — あら would match あります and much else.
    expect(conjugationStem("あらう", ["v5u", "vt"])).toBe("あらう");
  });

  it("falls back when JMdict says nothing about the verb", () => {
    expect(conjugationStem("開ける", undefined)).toBe("開");
    expect(conjugationStem("", ["v1"])).toBe("");
  });
});

describe("runCovered", () => {
  const vocab = segmentationVocab([
    { japanese: "何", reading: "なに" },
    { japanese: "人", reading: "ひと" },
    { japanese: "兄", reading: "あに" },
    { japanese: "弟", reading: "おとうと" },
    { japanese: "洗う", reading: "あらう" },
  ]);

  it("accepts a run built only from taught words", () => {
    expect(runCovered("人", vocab)).toBe(true);
  });

  it("accepts an inflected verb via its stem", () => {
    // 洗います appears in text as the kanji run 洗.
    expect(runCovered("洗", vocab)).toBe(true);
  });

  it("rejects a run containing an untaught word", () => {
    expect(runCovered("犬", vocab)).toBe(false);
  });

  it("rejects a compound whose parts are taught but whose whole is not", () => {
    // The bug this command exists to prevent: 何人 splits into 何 + 人 and 兄弟
    // into 兄 + 弟, so character segmentation alone calls both teachable.
    const dictForms = new Set(["何人", "兄弟"]);
    expect(runCovered("何人", vocab, dictForms)).toBe(false);
    expect(runCovered("何人兄弟", vocab, dictForms)).toBe(false);
    expect(runCovered("何人", vocab)).toBe(true); // without the guard, it slips through
  });

  it("still accepts the compound once it is taught", () => {
    const taught = segmentationVocab([{ japanese: "何人", reading: "なんにん" }]);
    expect(runCovered("何人", taught, new Set(["何人"]))).toBe(true);
  });
});

describe("uncoveredRuns", () => {
  const vocab = segmentationVocab([{ japanese: "洗う", reading: "あらう" }]);

  it("names the words blocking a sentence", () => {
    expect(uncoveredRuns("このセーターは洗っても大丈夫です。", vocab)).toEqual(["大丈夫", "セーター"]);
  });

  it("is empty when nothing blocks", () => {
    expect(uncoveredRuns("洗いますか。", vocab)).toEqual([]);
  });

  it("ignores single katakana characters, which are rarely whole words", () => {
    expect(uncoveredRuns("ア", vocab)).toEqual([]);
  });
});

describe("isPolite", () => {
  it("accepts the です/ます forms every lesson at this level teaches", () => {
    for (const s of ["いいお天気ですね。", "予約席はありますか。", "六時に起きます。", "行きました。"]) {
      expect(isPolite(s)).toBe(true);
    }
  });

  it("rejects the plain and imperative forms the corpus is full of", () => {
    for (const s of ["好きにしろよ。", "すごいじゃん。", "もうだめだ。", "白黒つけろ。"]) {
      expect(isPolite(s)).toBe(false);
    }
  });
});

/**
 * Every case here is a real pair from the N5 reference. The homophone cases were
 * all silently counted as covered until PR #88 -- adding 晩 hid ～番, and the
 * regeneration revealed thirteen more the tool had been masking for months.
 */
describe("writtenCompatible", () => {
  it("matches a kanji reference against a kana-only teaching form", () => {
    // The original reason coverage keys on the reading: the app teaches あさ.
    expect(writtenCompatible("朝", "あさ")).toBe(true);
    expect(writtenCompatible("夜", "よる")).toBe(true);
  });

  it("matches spelling variants of the same word", () => {
    expect(writtenCompatible("昼御飯", "昼ご飯")).toBe(true);
    expect(writtenCompatible("朝御飯", "朝ご飯")).toBe(true);
  });

  it("separates homophones written with different kanji", () => {
    expect(writtenCompatible("～番", "晩")).toBe(false);   // ordinal counter vs evening
    expect(writtenCompatible("箸", "橋")).toBe(false);     // chopsticks vs bridge
    expect(writtenCompatible("鼻", "花")).toBe(false);     // nose vs flower
    expect(writtenCompatible("熱い", "暑い")).toBe(false); // hot to touch vs hot weather
    expect(writtenCompatible("撮る", "取る")).toBe(false); // to photograph vs to take
    expect(writtenCompatible("～語", "五")).toBe(false);   // language suffix vs five
  });

  it("keeps kana-written homophones matching, since the reading is all there is", () => {
    expect(writtenCompatible("そば", "そば")).toBe(true);
    expect(writtenCompatible("カレー", "カレー")).toBe(true);
  });

  it("treats a missing side as compatible rather than inventing a gap", () => {
    expect(writtenCompatible("", "晩")).toBe(true);
    expect(writtenCompatible("晩", undefined)).toBe(true);
  });
});
