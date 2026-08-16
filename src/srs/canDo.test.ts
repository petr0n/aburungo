import { describe, it, expect } from "vitest";
import type { Lesson, Word } from "@/types";
import {
  MAX_SCOPE_WORDS,
  buildCanDoScope,
  buildCrossSituationScope,
  canDoMarkerId,
  taughtSituations,
  verifiedCanDos,
  wordsForSituations,
} from "./canDo";

/** Identity "shuffle" so the chosen pair is deterministic. */
const noShuffle = <T,>(items: readonly T[]): T[] => [...items];

function word(id: string, theme: string): Word {
  return { id, japanese: id, reading: id, romaji: id, english: id, wordType: "noun", theme } as Word;
}

function lesson(id: string, order: number, situation: string, wordIds: string[], checkpoint?: Lesson["checkpoint"]): Lesson {
  return {
    id,
    order,
    situation,
    title: id,
    canDo: id,
    wordIds,
    phraseIds: [],
    kanji: [],
    grammarNote: "",
    checkpoint,
  };
}

const lessons: Lesson[] = [
  lesson("u1", 1, "Greetings", ["a", "b"]),
  lesson("u2", 2, "Greetings", ["c"]),
  lesson("u3", 3, "Food & drink", ["d", "e"]),
  lesson("cp", 4, "Integration & checkpoint", [], "recognition"),
  lesson("u4", 5, "Shopping", ["f"]),
];

const words = [
  word("a", "greetings"),
  word("b", "greetings"),
  word("c", "greetings"),
  word("d", "food"),
  word("e", "food"),
  word("f", "shopping"),
];

describe("taughtSituations", () => {
  it("lists distinct situations in ladder order, once each", () => {
    expect(taughtSituations(lessons, ["u1", "u2", "u3"])).toEqual(["Greetings", "Food & drink"]);
  });

  it("ignores lessons the learner has not reached", () => {
    expect(taughtSituations(lessons, ["u1"])).toEqual(["Greetings"]);
  });

  it("never offers a checkpoint as a situation to role-play", () => {
    // A checkpoint has no scene and no vocabulary of its own. Excluded by the
    // `checkpoint` field, not by matching its label, so renaming it is safe.
    expect(taughtSituations(lessons, ["u1", "cp"])).toEqual(["Greetings"]);
  });
});

describe("wordsForSituations", () => {
  it("gathers every word across the situation's lessons", () => {
    expect(wordsForSituations(lessons, ["Greetings"], words).map((w) => w.id)).toEqual(["a", "b", "c"]);
  });

  it("deduplicates a word taught in two lessons", () => {
    const repeated = [...lessons, lesson("u5", 6, "Greetings", ["a"])];
    expect(wordsForSituations(repeated, ["Greetings"], words).map((w) => w.id)).toEqual(["a", "b", "c"]);
  });

  it("skips ids with no matching word rather than emitting holes", () => {
    const dangling = [lesson("x", 1, "Greetings", ["a", "missing"])];
    expect(wordsForSituations(dangling, ["Greetings"], words).map((w) => w.id)).toEqual(["a"]);
  });
});

describe("buildCrossSituationScope", () => {
  it("names both situations so Hana has a scene change to play", () => {
    const scope = buildCrossSituationScope(lessons, ["u1", "u2", "u3"], words, noShuffle);
    expect(scope?.situation).toBe("Greetings, then Food & drink");
  });

  it("draws vocabulary from both situations, not just the first", () => {
    const scope = buildCrossSituationScope(lessons, ["u1", "u2", "u3"], words, noShuffle);
    const japanese = scope?.words.map((w) => w.japanese) ?? [];
    expect(japanese).toContain("a");
    expect(japanese).toContain("d");
  });

  it("returns null when only one situation has been taught", () => {
    // Nothing to cross. The caller shows a continue affordance instead of an
    // exchange that would quietly be single-situation.
    expect(buildCrossSituationScope(lessons, ["u1", "u2"], words, noShuffle)).toBeNull();
  });

  it("returns null on an empty ladder", () => {
    expect(buildCrossSituationScope(lessons, [], words, noShuffle)).toBeNull();
  });

  it("caps the word list, since prompt size is API spend", () => {
    const many = Array.from({ length: 90 }, (_, i) => word(`w${i}`, `theme-${i % 4}`));
    const big = [lesson("b1", 1, "A", many.slice(0, 45).map((w) => w.id)), lesson("b2", 2, "B", many.slice(45).map((w) => w.id))];
    const scope = buildCrossSituationScope(big, ["b1", "b2"], many, noShuffle);
    expect(scope?.words.length).toBe(MAX_SCOPE_WORDS);
  });

  it("asks for a turn count the server will accept", () => {
    const scope = buildCrossSituationScope(lessons, ["u1", "u2", "u3"], words, noShuffle);
    expect(scope?.maxTurns).toBeGreaterThanOrEqual(1);
    expect(scope?.maxTurns).toBeLessThanOrEqual(10);
  });
});

describe("buildCanDoScope", () => {
  it("scopes to the one situation the learner picked", () => {
    const scope = buildCanDoScope(lessons, "Food & drink", words);
    expect(scope?.situation).toBe("Food & drink");
    expect(scope?.words.map((w) => w.japanese).sort()).toEqual(["d", "e"]);
  });

  it("returns null for a situation with no vocabulary", () => {
    // An empty word list makes the server fall back to the *unscoped* prompt,
    // which would quietly turn a verification run into open-ended chat.
    expect(buildCanDoScope(lessons, "Integration & checkpoint", words)).toBeNull();
  });
});

describe("can-do markers", () => {
  it("round-trips a situation through the marker id", () => {
    expect(verifiedCanDos([canDoMarkerId("Food & drink")])).toEqual(new Set(["Food & drink"]));
  });

  it("ignores real lesson ids sharing the list", () => {
    expect(verifiedCanDos(["n5.unit-1", "n5.unit-2", canDoMarkerId("Hotel")])).toEqual(new Set(["Hotel"]));
  });

  it("reads nothing out of a fresh profile", () => {
    expect(verifiedCanDos([])).toEqual(new Set());
  });

  it("keeps markers distinguishable from lesson ids so the ladder ignores them", () => {
    // dailyLoop picks the next lesson by id membership; a marker must never
    // collide with a real lesson id or it would skip that lesson.
    expect(canDoMarkerId("Hotel").startsWith("n5.")).toBe(false);
  });
});
