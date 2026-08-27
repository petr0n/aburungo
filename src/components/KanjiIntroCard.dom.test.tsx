// @vitest-environment jsdom
import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { KanjiIntroCard } from "./KanjiIntroCard";
import type { Kanji } from "@/types";

const water: Kanji = {
  id: "kanji.水", character: "水", meanings: ["water"], allMeanings: ["water"],
  on: ["スイ"], kun: ["みず"], strokes: 4,
};

describe("KanjiIntroCard", () => {
  afterEach(cleanup);

  it("shows the character", () => {
    render(<KanjiIntroCard kanji={water} />);
    // Twice: the headline glyph, and the ruby base carrying the kun reading.
    expect(screen.getAllByText("水").length).toBeGreaterThan(0);
  });

  it("shows the meaning and both readings", () => {
    render(<KanjiIntroCard kanji={water} />);
    expect(screen.getByText("water")).toBeTruthy();
    expect(screen.getByText("スイ")).toBeTruthy();
    expect(screen.getByText("みず")).toBeTruthy();
  });

  it("renders a kanji with no readings without crashing", () => {
    const bare: Kanji = { ...water, on: [], kun: [] };
    render(<KanjiIntroCard kanji={bare} />);
    expect(screen.getAllByText("水").length).toBeGreaterThan(0);
  });
});

/**
 * KANJIDIC2 kun readings are lexicographic notation. The dot splitting reading
 * from okurigana and the hyphen marking an affix are not Japanese, and 38 of
 * the 200 ladder entries carry one — this card is the first thing a beginner
 * ever sees for a new character, on a phone.
 *
 * 生 is the worst case in the set: 18 kun readings, including both なま and
 * なま-, which collapse to one entry once the marker is stripped.
 */
describe("KanjiIntroCard reading notation", () => {
  afterEach(cleanup);

  const life: Kanji = {
    id: "kanji.生",
    character: "生",
    meanings: ["life"],
    allMeanings: ["life"],
    on: ["セイ"],
    kun: ["い.きる", "い.かす", "う.まれる", "は.える", "なま", "なま-", "き", "-う"],
    strokes: 5,
  };

  it("never prints the raw notation", () => {
    const { container } = render(<KanjiIntroCard kanji={life} />);
    const text = container.textContent ?? "";
    expect(text).not.toContain("い.きる");
    expect(text).not.toContain("なま-");
    expect(text).not.toContain("-う");
  });

  it("splits a dotted reading into a ruby reading and its okurigana", () => {
    render(<KanjiIntroCard kanji={life} />);
    expect(screen.getAllByText("い", { selector: "rt" }).length).toBeGreaterThan(0);
    expect(screen.getByText("きる")).toBeTruthy();
  });

  it("caps the list so an 18-reading entry cannot bury the card", () => {
    const { container } = render(<KanjiIntroCard kanji={life} />);
    expect(container.querySelectorAll("ruby").length).toBe(6);
  });
});
