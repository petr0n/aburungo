import { describe, expect, it } from "vitest";
import type { Book, Lesson } from "@/types";
import { bookOne, bookThree, bookTwo, books, currentBook, priorBooks } from "./books";
import { n5Lessons, b2Lessons } from "./lessons";
import { n5Chapters, b2Chapters } from "./chapters";

describe("bookOne", () => {
  it("has an id that does not claim the book is a JLPT level (DR-033)", () => {
    expect(bookOne.id).toBe("book-1");
  });

  it("keeps the persisted progress key so no learner loses progress", () => {
    // "n5" is the primary key of every PathProgress row, in Dexie and on the
    // server. It is frozen regardless of what the book is called.
    expect(bookOne.progressKey).toBe("n5");
  });

  it("gives every book a progress key", () => {
    for (const b of books) expect(b.progressKey.length).toBeGreaterThan(0);
  });

  it("is the first book and reads as 'Book One', never 'N5' (DR-024)", () => {
    expect(bookOne.order).toBe(1);
    expect(bookOne.title).toBe("Book One");
  });

  it("wraps the existing ladder and chapter list without copying", () => {
    expect(bookOne.lessons).toBe(n5Lessons);
    expect(bookOne.chapters).toBe(n5Chapters);
  });

  it("is a foundation book — romaji stays, recognition is the default gate", () => {
    expect(bookOne.stage).toBe("foundation");
  });

  it("has nothing before it, so its sessions review its own items only", () => {
    expect(priorBooks(bookOne)).toEqual([]);
  });

});

describe("bookTwo", () => {
  it("has an id that does not claim the book is a JLPT level (DR-033)", () => {
    expect(bookTwo.id).toBe("book-2");
  });

  it("keys progress on the book, not on a level", () => {
    // Frozen from the moment this ships: the first learner to open Book Two
    // writes a PathProgress row on this string. "n4" would key progress on a
    // JLPT level, which is the thing DR-033 stopped a book from being; Book
    // One's "n5" survives only because it predates the decision.
    expect(bookTwo.progressKey).toBe("book-2");
  });

  it("is the second book and reads as 'Book Two', never 'N4' (DR-024)", () => {
    expect(bookTwo.order).toBe(2);
    expect(bookTwo.title).toBe("Book Two");
  });

  it("wraps its own ladder and chapter list without copying", () => {
    expect(bookTwo.lessons).toBe(b2Lessons);
    expect(bookTwo.chapters).toBe(b2Chapters);
  });

  it("is a building book — romaji is cut, recall is the default gate", () => {
    expect(bookTwo.stage).toBe("building");
  });

  it("carries Book One behind it, so its sessions keep surfacing Book One items", () => {
    expect(priorBooks(bookTwo)).toEqual([bookOne]);
  });
});

describe("the course", () => {
  it("runs Book One, then Book Two, then Book Three", () => {
    expect(books).toEqual([bookOne, bookTwo, bookThree]);
  });

  it("gives every book a distinct progress key", () => {
    const keys = books.map((b) => b.progressKey);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("orders books 1..N with no gap", () => {
    expect(books.map((b) => b.order)).toEqual(books.map((_, i) => i + 1));
  });
});

/**
 * Against fixtures, never the shipped ladder.
 *
 * There are two books and Book Two is one chapter long, so an assertion made
 * against real content passes for the wrong reason far too easily — "the
 * learner is on Book One" is true whether the selection works or is hard-wired.
 * Fixtures make the two outcomes distinguishable.
 */
const fixtureLesson = (id: string): Lesson => ({
  id,
  order: 1,
  situation: "s",
  title: "t",
  canDo: "c",
  wordIds: [],
  phraseIds: [],
  kanji: [],
  grammarNote: "g",
});

const fixtureBook = (order: number, lessonIds: string[]): Book => ({
  id: `book-${order}`,
  // Deliberately unequal to `id`: passing `id` where a progress key belongs
  // type-checks and silently orphans the learner's progress.
  progressKey: `key-${order}`,
  order,
  title: `Book ${order}`,
  chapters: [],
  lessons: lessonIds.map(fixtureLesson),
  stage: order === 1 ? "foundation" : "building",
});

const one = fixtureBook(1, ["a1", "a2"]);
const two = fixtureBook(2, ["b1"]);
const three = fixtureBook(3, ["c1"]);

const seen = (entries: Array<[string, string[]]>): ReadonlyMap<string, readonly string[]> => new Map(entries);

describe("currentBook", () => {
  it("keeps a learner with unseen lessons in the book they are in", () => {
    expect(currentBook([one, two], seen([["key-1", ["a1"]]]), "free")).toBe(one);
  });

  it("hands a learner who has finished Book One on to Book Two", () => {
    // The whole feature in one assertion. Before the hand-off existed, the
    // page pinned Book One and this learner had nowhere left to go.
    expect(currentBook([one, two], seen([["key-1", ["a1", "a2"]]]), "free")).toBe(two);
  });

  it("keeps a guest on Book One even once they have finished it", () => {
    // TIER_BOOK_LIMIT.guest is 1. They land on Book One's "all caught up",
    // where the soft prompt lives, rather than walking into gated content.
    expect(currentBook([one, two], seen([["key-1", ["a1", "a2"]]]), "guest")).toBe(one);
  });

  it("returns the last reachable book when every reachable book is finished", () => {
    const chosen = currentBook([one, two], seen([["key-1", ["a1", "a2"]], ["key-2", ["b1"]]]), "free");
    expect(chosen).toBe(two);
  });

  it("returns the last book the tier reaches, not the last book there is", () => {
    // A paid-only third book must not be handed to a free account that has
    // run out of its own.
    const finished = seen([["key-1", ["a1", "a2"]], ["key-2", ["b1"]]]);
    expect(currentBook([one, two, three], finished, "paid")).toBe(three);
  });

  it("selects by order, not by array position", () => {
    // Out of order on purpose: `books` is documented as ordered, and a
    // find-first over the raw array would pass every test above while
    // depending on that documentation instead of on `order`.
    expect(currentBook([two, one], seen([]), "free")).toBe(one);
    expect(currentBook([two, one], seen([["key-1", ["a1", "a2"]]]), "free")).toBe(two);
  });

  it("reads progress by progressKey, not by id", () => {
    // `id` is "book-1" and `progressKey` is "key-1". Keyed on `id`, the
    // finished learner below looks untouched and never leaves Book One.
    expect(currentBook([one, two], seen([["book-1", ["a1", "a2"]]]), "free")).toBe(one);
    expect(currentBook([one, two], seen([["key-1", ["a1", "a2"]]]), "free")).toBe(two);
  });

  it("ignores progress rows for lessons the book does not contain", () => {
    // seenLessonIds also carries can-do markers, which are not lesson ids.
    expect(currentBook([one, two], seen([["key-1", ["a1", "a2", "can-do:cafe"]]]), "free")).toBe(two);
  });
});
