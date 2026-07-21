import { describe, expect, it } from "vitest";
import type { PathProgress, Phrase, ReviewState, Unit, Word } from "@/types";
import { buildDailySession } from "./dailyLoop";

const NOW = Date.UTC(2026, 4, 16, 12, 0, 0);
const DAY_MS = 24 * 60 * 60 * 1000;

const word = (id: string): Word => ({
  id,
  japanese: id,
  reading: id,
  romaji: id,
  english: id,
  wordType: "noun",
});

const phrase = (id: string): Phrase => ({
  id,
  japanese: id,
  reading: id,
  romaji: id,
  english: id,
  scenario: "test",
});

const units: Unit[] = [
  {
    id: "unit-1",
    order: 1,
    situation: "s",
    title: "t",
    canDo: "c",
    wordIds: ["w1", "w2"],
    phraseIds: ["p1"],
    kanji: [],
    grammarNote: "g",
  },
  {
    id: "unit-2",
    order: 2,
    situation: "s",
    title: "t",
    canDo: "c",
    wordIds: ["w3"],
    phraseIds: ["p2"],
    kanji: [],
    grammarNote: "g",
  },
];

const allWords = ["w1", "w2", "w3"].map(word);
const allPhrases = ["p1", "p2"].map(phrase);

const emptyProgress: PathProgress = { pathId: "n5", seenUnitIds: [] };

describe("buildDailySession", () => {
  it("returns the first unit as new when nothing has been seen", () => {
    const session = buildDailySession(units, emptyProgress, allWords, allPhrases, [], NOW);

    expect(session.unit?.id).toBe("unit-1");
    expect(session.newWords.map((w) => w.id)).toEqual(["w1", "w2"]);
    expect(session.newPhrases.map((p) => p.id)).toEqual(["p1"]);
    expect(session.reviewItems).toEqual([]);
  });

  it("advances to the next unseen unit", () => {
    const progress: PathProgress = { pathId: "n5", seenUnitIds: ["unit-1"] };
    const session = buildDailySession(units, progress, allWords, allPhrases, [], NOW);

    expect(session.unit?.id).toBe("unit-2");
    expect(session.newWords.map((w) => w.id)).toEqual(["w3"]);
  });

  it("returns null unit once every unit has been seen", () => {
    const progress: PathProgress = { pathId: "n5", seenUnitIds: ["unit-1", "unit-2"] };
    const session = buildDailySession(units, progress, allWords, allPhrases, [], NOW);

    expect(session.unit).toBeNull();
    expect(session.newWords).toEqual([]);
    expect(session.newPhrases).toEqual([]);
  });

  it("surfaces due items only from already-seen units, oldest-due first", () => {
    const progress: PathProgress = { pathId: "n5", seenUnitIds: ["unit-1"] };
    const reviewStates: ReviewState[] = [
      { phraseId: "w1", box: 2, dueAt: NOW - DAY_MS }, // due, seen unit
      { phraseId: "w2", box: 2, dueAt: NOW - 2 * DAY_MS }, // due, seen unit, older
      { phraseId: "w3", box: 2, dueAt: NOW - DAY_MS }, // due, but unit-2 not seen yet
      { phraseId: "w1", box: 2, dueAt: NOW + DAY_MS }, // not due yet — won't happen (dup id) but exercises isDue
    ];
    // Use distinct phraseIds instead of a duplicate to keep the fixture realistic.
    reviewStates[3] = { phraseId: "p1", box: 2, dueAt: NOW + DAY_MS };

    const session = buildDailySession(units, progress, allWords, allPhrases, reviewStates, NOW);

    expect(session.reviewItems.map((i) => i.id)).toEqual(["w2", "w1"]);
  });

  it("dedupes review items by phraseId, keeping the earliest due", () => {
    // Simulates a future caller that merges local + server due state (like
    // src/store/session.ts already does) and passes the same phraseId twice.
    const progress: PathProgress = { pathId: "n5", seenUnitIds: ["unit-1"] };
    const reviewStates: ReviewState[] = [
      { phraseId: "w1", box: 1, dueAt: NOW - 2 * DAY_MS },
      { phraseId: "w1", box: 3, dueAt: NOW - DAY_MS },
    ];

    const session = buildDailySession(units, progress, allWords, allPhrases, reviewStates, NOW);

    expect(session.reviewItems.map((i) => i.id)).toEqual(["w1"]);
  });
});
