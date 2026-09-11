import { describe, it, expect } from "vitest";
import { compareAnswer } from "./compareAnswer";
import { allPhrases } from "@/content/index";

describe("compareAnswer", () => {
  it("accepts the exact reading", () => {
    expect(compareAnswer("ねこです。", "ねこです。")).toBe(true);
  });

  it("accepts katakana typed as hiragana", () => {
    expect(compareAnswer("こーひーをください。", "コーヒーをください。")).toBe(true);
  });

  it("rejects a wrong reading", () => {
    expect(compareAnswer("いぬです", "ねこです。")).toBe(false);
  });

  // The bug this file exists to pin: every typed reading in Books Two to Four
  // ends in 。, and neither input mode can produce that character.
  it("does not require the final 。", () => {
    expect(compareAnswer("ねこです", "ねこです。")).toBe(true);
  });

  it("does not require an internal 、", () => {
    expect(compareAnswer("あしたえいがをみる", "あした、えいがをみる。")).toBe(true);
  });

  it("accepts romaji that cannot produce the punctuation", () => {
    expect(compareAnswer("nekodesu", "ねこです。")).toBe(true);
  });

  it("still accepts punctuation typed on a system IME", () => {
    expect(compareAnswer("あした、えいがをみる。", "あした、えいがをみる。")).toBe(true);
  });

  it("ignores a stray space, now the pad has a space key", () => {
    expect(compareAnswer("ねこ です", "ねこです。")).toBe(true);
  });

  // The whole point: a learner who knows the card is marked right.
  it("marks a perfectly answered Book Three card correct in romaji", () => {
    const card = allPhrases.find((p) => p.id === "band0.english-is-spoken-in-canada")!;
    expect(compareAnswer("eigohakanadadehanasareteiru", card.reading)).toBe(true);
  });

  // Every case above was written by thinking of a character. That is exactly
  // how the first version of this rule shipped with 。 and 、 and missed … and
  // 「」, which are really in the content. So this one derives its own scope:
  // strip each reading down to kana by a definition the comparator does not
  // share, and require that a learner typing only that is marked right. A
  // punctuation mark added to any card in future fails here by itself.
  it("accepts the kana alone for every reading in the content", () => {
    const NOT_KANA = /[^\u3041-\u309F\u30A0-\u30FF]/gu;
    const rejected = allPhrases
      .filter((phrase) => typeof phrase.reading === "string" && phrase.reading !== "")
      .filter((phrase) => !compareAnswer(phrase.reading.replace(NOT_KANA, ""), phrase.reading))
      .map((phrase) => `${phrase.id}: ${phrase.reading}`);
    expect(rejected).toEqual([]);
  });

  // The two the enumerated list missed, named so a regression says which.
  it("does not require a trailing …", () => {
    const card = allPhrases.find((p) => p.id === "plans.tomorrow-is-a-bit-difficult")!;
    expect(compareAnswer("あしたはちょっと", card.reading)).toBe(true);
    expect(compareAnswer("ashitahachotto", card.reading)).toBe(true);
  });

  it("does not require the 「」 around a quoted word", () => {
    const card = allPhrases.find((p) => p.id === "b4band2.this-is-what-we-call-tempura")!;
    expect(compareAnswer("これがいわゆるてんぷらというものです", card.reading)).toBe(true);
  });

  // Stripping by Unicode category keeps LETTERS, kana and Latin alike. That is
  // load-bearing: romaji that only half converts leaves Latin behind, and a
  // rule that swept every non-kana character away would mark it correct.
  it("still rejects romaji that only half converts", () => {
    expect(compareAnswer("nekodesuzzz", "ねこです。")).toBe(false);
  });
});
