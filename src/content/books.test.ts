import { describe, expect, it } from "vitest";
import { bookOne, bookTwo, books, priorBooks } from "./books";
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
  it("runs Book One then Book Two", () => {
    expect(books).toEqual([bookOne, bookTwo]);
  });

  it("gives every book a distinct progress key", () => {
    const keys = books.map((b) => b.progressKey);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("orders books 1..N with no gap", () => {
    expect(books.map((b) => b.order)).toEqual(books.map((_, i) => i + 1));
  });
});
