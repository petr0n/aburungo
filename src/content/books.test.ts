import { describe, expect, it } from "vitest";
import { bookOne, books, priorBooks } from "./books";
import { n5Lessons } from "./lessons";
import { n5Chapters } from "./chapters";

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

  it("is the whole ladder until Book Two's content exists", () => {
    expect(books).toEqual([bookOne]);
  });
});
