import { describe, it, expect } from "vitest";
import { splitFurigana } from "./furigana";

describe("splitFurigana", () => {
  it("returns a single plain segment for pure kana", () => {
    expect(splitFurigana("りんご", "りんご")).toEqual([{ text: "りんご" }]);
  });

  it("returns plain when reading equals surface form", () => {
    expect(splitFurigana("コーヒー", "コーヒー")).toEqual([{ text: "コーヒー" }]);
  });

  it("rubies a bare single kanji", () => {
    expect(splitFurigana("水", "みず")).toEqual([{ text: "水", ruby: "みず" }]);
  });

  it("strips trailing okurigana (verb)", () => {
    expect(splitFurigana("食べる", "たべる")).toEqual([
      { text: "食", ruby: "た" },
      { text: "べる" },
    ]);
  });

  it("strips a shared honorific prefix", () => {
    expect(splitFurigana("お茶", "おちゃ")).toEqual([
      { text: "お" },
      { text: "茶", ruby: "ちゃ" },
    ]);
  });

  it("rubies a whole compound when there is no internal kana to split on", () => {
    expect(splitFurigana("日本", "にほん")).toEqual([{ text: "日本", ruby: "にほん" }]);
  });

  it("handles both a prefix and a suffix around a kanji core", () => {
    // お + 願 (ねが) + いします
    expect(splitFurigana("お願いします", "おねがいします")).toEqual([
      { text: "お" },
      { text: "願", ruby: "ねが" },
      { text: "いします" },
    ]);
  });

  it("returns plain when there is no kanji", () => {
    expect(splitFurigana("ありがとう", "ありがとう")).toEqual([{ text: "ありがとう" }]);
  });

  it("returns plain for an empty reading", () => {
    expect(splitFurigana("猫", "")).toEqual([{ text: "猫" }]);
  });
});
