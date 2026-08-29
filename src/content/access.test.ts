import { describe, expect, it } from "vitest";
import { bookOrderIndex, reachable, phrasesForTier, wordsForTier } from "./access";
import type { Book, Lesson } from "@/types";
import { bookOne, bookTwo } from "./books";

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

/**
 * Gating against the tree the app actually ships.
 *
 * These were a tautology while Book One was the whole course: every tier saw
 * everything, so the assertions passed however wrong the predicate was. Book
 * Two is the first content a guest must not reach, which is what makes them
 * mean something.
 */
describe("the shipped content", () => {
  const taughtBy = (book: Book) => book.lessons.flatMap((l) => [...l.wordIds, ...l.phraseIds]);
  const bookOneTaught = new Set(taughtBy(bookOne));
  // Book Two re-lists Book One's verbs on purpose — the ladder's only way to
  // repeat a word in the lesson that conjugates it — so what it *introduces* is
  // the smaller set, and the only set gating should hold back.
  const bookTwoIntroduces = [...new Set(taughtBy(bookTwo))].filter((id) => !bookOneTaught.has(id));

  const guestVisible = () => new Set([...wordsForTier("guest"), ...phrasesForTier("guest")].map((x) => x.id));

  it("has something for Book Two to gate, so the check below cannot pass empty", () => {
    expect(bookTwoIntroduces.length).toBeGreaterThan(0);
  });

  it("leaves everything Book One teaches within a guest's reach", () => {
    const visible = guestVisible();
    expect([...bookOneTaught].filter((id) => !visible.has(id))).toEqual([]);
  });

  it("holds back what only Book Two teaches", () => {
    const visible = guestVisible();
    expect(bookTwoIntroduces.filter((id) => visible.has(id))).toEqual([]);
  });
});
