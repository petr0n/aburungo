import { describe, it, expect } from "vitest";
import type { Phrase, Word } from "@/types";
import { buildProductionQueue, buildSweepQueue, PRODUCTION_SIZE, SWEEP_SIZE } from "./sweep";

/** Identity "shuffle" so ordering is deterministic and assertions mean something. */
const noShuffle = <T,>(items: readonly T[]): T[] => [...items];

function word(id: string, theme: string): Word {
  return {
    id,
    japanese: id,
    reading: id,
    romaji: id,
    english: id,
    jlpt: "N5",
    wordType: "noun",
    theme,
  } as Word;
}

/** 40 time words against 3 weather words — the lopsided case that matters. */
const lopsided: Word[] = [
  ...Array.from({ length: 40 }, (_, i) => word(`time-${i}`, "time")),
  ...Array.from({ length: 3 }, (_, i) => word(`weather-${i}`, "weather")),
];

describe("buildSweepQueue", () => {
  it("caps the round rather than presenting the whole ladder", () => {
    const queue = buildSweepQueue(lopsided, SWEEP_SIZE, noShuffle);
    expect(queue).toHaveLength(SWEEP_SIZE);
  });

  it("reaches a small theme instead of drowning it in a large one", () => {
    const queue = buildSweepQueue(lopsided, 10, noShuffle);
    const themes = queue.map((w) => w.theme);

    // Taking the first 10 by order would be all "time". Round-robin must not.
    expect(themes.filter((t) => t === "weather").length).toBe(3);
    expect(themes.filter((t) => t === "time").length).toBe(7);
  });

  it("never repeats a word inside one round", () => {
    const queue = buildSweepQueue(lopsided, SWEEP_SIZE, noShuffle);
    expect(new Set(queue.map((w) => w.id)).size).toBe(queue.length);
  });

  it("returns everything available when the pool is smaller than the size", () => {
    const few = [word("a", "time"), word("b", "food")];
    expect(buildSweepQueue(few, SWEEP_SIZE, noShuffle)).toHaveLength(2);
  });

  it("treats words with no theme as their own group rather than dropping them", () => {
    const untagged = { ...word("x", "time"), theme: undefined } as Word;
    const queue = buildSweepQueue([untagged], SWEEP_SIZE, noShuffle);
    expect(queue.map((w) => w.id)).toEqual(["x"]);
  });

  it("returns an empty round for an empty pool or a zero size", () => {
    expect(buildSweepQueue([], SWEEP_SIZE, noShuffle)).toEqual([]);
    expect(buildSweepQueue(lopsided, 0, noShuffle)).toEqual([]);
  });
});

describe("buildProductionQueue", () => {
  const phrase = (id: string, scenario: string): Phrase =>
    ({ id, japanese: id, reading: id, romaji: id, english: id, scenario }) as Phrase;

  const words = [word("w-a", "food"), word("w-b", "food"), word("w-c", "weather")];
  const phrases = [phrase("p-a", "cafe"), phrase("p-b", "cafe")];

  it("draws from words and phrases together", () => {
    // A production gate over vocabulary alone would silently leave out
    // everything situational, which is most of what the ladder teaches.
    const ids = buildProductionQueue(words, phrases, 10, noShuffle).map((i) => i.id);
    expect(ids).toContain("w-a");
    expect(ids).toContain("p-a");
  });

  it("caps the round well below the sweep, since writing costs more than tapping", () => {
    const many = Array.from({ length: 60 }, (_, i) => word(`w${i}`, `theme-${i % 5}`));
    expect(buildProductionQueue(many, [], PRODUCTION_SIZE, noShuffle)).toHaveLength(PRODUCTION_SIZE);
    expect(PRODUCTION_SIZE).toBeLessThan(SWEEP_SIZE);
  });

  it("spreads across groups rather than draining one", () => {
    const lopsidedWords = Array.from({ length: 30 }, (_, i) => word(`t${i}`, "time"));
    const ids = buildProductionQueue(lopsidedWords, [phrase("p-x", "cafe")], 4, noShuffle).map((i) => i.id);
    expect(ids).toContain("p-x");
  });

  it("returns nothing for an empty ladder rather than throwing", () => {
    expect(buildProductionQueue([], [], PRODUCTION_SIZE, noShuffle)).toEqual([]);
  });
});
