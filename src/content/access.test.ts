import { describe, expect, it } from "vitest";
import { bookOrderIndex, reachable, phrasesForTier, wordsForTier } from "./access";
import type { Book, Lesson } from "@/types";
import { allWords } from "./vocabulary";
import { allPhrases } from "./index";

const lesson = (id: string, wordIds: string[], phraseIds: string[] = []): Lesson => ({
  id,
  order: 1,
  situation: "test",
  title: "t",
  canDo: "c",
  wordIds,
  phraseIds,
  kanji: [],
  grammarNote: "g",
});

const book = (order: number, lessons: Lesson[]): Book => ({
  id: `book-${order}`,
  progressKey: `book-${order}`,
  order,
  title: `Book ${order}`,
  chapters: [],
  lessons,
  stage: order === 1 ? "foundation" : "building",
});

describe("bookOrderIndex", () => {
  it("maps an item to the book that teaches it", () => {
    const index = bookOrderIndex([book(1, [lesson("l1", ["a"])]), book(2, [lesson("l2", ["b"])])]);
    expect(index.get("a")).toBe(1);
    expect(index.get("b")).toBe(2);
  });

  it("credits the earliest book when two teach the same item", () => {
    // A later book reviewing an earlier book's word must not push it behind a
    // paywall the learner has already walked through.
    const index = bookOrderIndex([book(2, [lesson("l2", ["a"])]), book(1, [lesson("l1", ["a"])])]);
    expect(index.get("a")).toBe(1);
  });

  it("indexes phrases as well as words", () => {
    const index = bookOrderIndex([book(1, [lesson("l1", [], ["p"])])]);
    expect(index.get("p")).toBe(1);
  });
});

describe("reachable", () => {
  it("gives a guest the first book and nothing past it", () => {
    expect(reachable(1, "guest")).toBe(true);
    expect(reachable(2, "guest")).toBe(false);
  });

  it("gives a free account four books", () => {
    expect(reachable(4, "free")).toBe(true);
    expect(reachable(5, "free")).toBe(false);
  });

  it("gives a paid account everything, however many books there end up being", () => {
    expect(reachable(17, "paid")).toBe(true);
  });

  it("treats an item no book teaches as Book One rather than hiding it", () => {
    // Browse surfaces show vocabulary the ladder never references. Those are
    // visible today, and silently removing content a learner can currently see
    // is a worse failure than leaving it open.
    expect(reachable(undefined, "guest")).toBe(true);
  });
});

describe("the shipped content", () => {
  it("reaches every tier, because one book is all there is", () => {
    // Not a claim that gating works — it cannot be, with a single book. It is
    // a guard that nothing in Book One became unreachable to a guest.
    expect(wordsForTier("guest")).toHaveLength(allWords.length);
    expect(phrasesForTier("guest")).toHaveLength(allPhrases.length);
  });
});
