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
});
