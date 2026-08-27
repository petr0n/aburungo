// @vitest-environment jsdom
/**
 * The card is shared by two callers that disagree about shape and about what
 * the learner should read.
 *
 * KanjiPage hands it the server's KanjiEntry (onReadings/kunReadings) and is an
 * explicitly JLPT-filtered browse surface, so its N-badge belongs. The ladder
 * hands it a content Kanji (on/kun) which carries no level at all, and a level
 * is exactly what a learner in the daily loop must never read (DR-024). The
 * badge disappears because the field is absent, not because of a flag.
 */
import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { KanjiDrillCard } from "./KanjiDrillCard";
import type { Kanji } from "@/types";

const water: Kanji = {
  id: "kanji.水", character: "水", meanings: ["water"], allMeanings: ["water"],
  on: ["スイ"], kun: ["みず"], strokes: 4,
};

const noop = () => {};

describe("KanjiDrillCard with ladder content", () => {
  afterEach(cleanup);

  it("accepts a content Kanji, which has no jlptLevel field", () => {
    render(
      <KanjiDrillCard kanji={water} phase="idle" onReveal={noop} onRate={noop} onEntered={noop} onExited={noop} />,
    );
    expect(screen.getAllByText("水").length).toBeGreaterThan(0);
  });

  it("shows no JLPT badge for ladder content — the learner never reads a level", () => {
    render(
      <KanjiDrillCard kanji={water} phase="idle" onReveal={noop} onRate={noop} onEntered={noop} onExited={noop} />,
    );
    expect(screen.queryByText(/^N[1-5]$/)).toBeNull();
  });

  it("still shows the badge when a level is supplied, as KanjiPage does", () => {
    const withLevel = { ...water, jlptLevel: 5 };
    render(
      <KanjiDrillCard kanji={withLevel} phase="idle" onReveal={noop} onRate={noop} onEntered={noop} onExited={noop} />,
    );
    expect(screen.getAllByText("N5").length).toBeGreaterThan(0);
  });

  it("reads the content shape's on/kun as readily as the server's", () => {
    render(
      <KanjiDrillCard kanji={water} phase="revealed" onReveal={noop} onRate={noop} onEntered={noop} onExited={noop} />,
    );
    expect(screen.getByText("スイ")).toBeTruthy();
    expect(screen.getByText("みず")).toBeTruthy();
  });
});
