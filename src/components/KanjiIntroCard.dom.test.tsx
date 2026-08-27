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
    expect(screen.getByText("水")).toBeTruthy();
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
    expect(screen.getByText("水")).toBeTruthy();
  });
});
