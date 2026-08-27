// @vitest-environment jsdom
import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { KanjiIntroCard } from "./KanjiIntroCard";
import type { Kanji, KanjiPiece } from "@/types";

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

/**
 * The component row. One keyword serves every kanji that uses a glyph, so the
 * heading claims visual presence ("shapes in this kanji") rather than
 * composition — KRADFILE is a radical lookup file, not an etymology, and 鳥's
 * only piece is ⺣ "fire" where those strokes are tail feathers.
 */
const pieces: KanjiPiece[] = [
  { glyph: "日", keyword: "sun", state: "taught" },
  { glyph: "⺡", keyword: "water", note: "the flowing form of 水", state: "met" },
  { glyph: "寸", keyword: "thumb", state: "new" },
];

describe("KanjiIntroCard component row", () => {
  afterEach(cleanup);

  it("heads the row with visual presence, not composition", () => {
    // Pinned deliberately: "made of" would be false wherever one keyword
    // serves a glyph that plays a different role in this host.
    render(<KanjiIntroCard kanji={water} pieces={pieces} />);
    expect(screen.getByText(/shapes in this kanji/i)).toBeTruthy();
  });

  it("shows each piece with its keyword", () => {
    render(<KanjiIntroCard kanji={water} pieces={pieces} />);
    expect(screen.getByText("sun")).toBeTruthy();
    // Twice: the kanji's own meaning, and ⺡'s keyword.
    expect(screen.getAllByText("water").length).toBe(2);
    expect(screen.getByText("thumb")).toBeTruthy();
  });

  it("says you know the pieces you were taught", () => {
    render(<KanjiIntroCard kanji={water} pieces={pieces} />);
    expect(screen.getByText(/you know this/i)).toBeTruthy();
  });

  it("says you have seen a met piece, without claiming you know it", () => {
    render(<KanjiIntroCard kanji={water} pieces={pieces} />);
    expect(screen.getByText(/you've seen this/i)).toBeTruthy();
  });

  it("gives a new piece no label, since its keyword is the introduction", () => {
    const { container } = render(<KanjiIntroCard kanji={water} pieces={[pieces[2]]} />);
    const text = container.textContent ?? "";
    expect(text).toContain("thumb");
    expect(text).not.toMatch(/you know this|you've seen this|\bnew\b/i);
  });

  it("renders the note that stops a keyword misleading", () => {
    render(<KanjiIntroCard kanji={water} pieces={pieces} />);
    expect(screen.getByText("the flowing form of 水")).toBeTruthy();
  });

  it("renders no component row at all when there are no pieces", () => {
    render(<KanjiIntroCard kanji={water} pieces={[]} />);
    expect(screen.queryByText(/shapes in this kanji/i)).toBeNull();
  });

  it("renders without a pieces prop, since the row is additive", () => {
    render(<KanjiIntroCard kanji={water} />);
    expect(screen.getAllByText("水").length).toBeGreaterThan(0);
  });
});
