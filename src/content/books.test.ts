import { describe, expect, it } from "vitest";
import { bookOne } from "./books";
import { n5Lessons } from "./lessons";
import { n5Chapters } from "./chapters";

describe("bookOne", () => {
  it("keeps the existing PathProgress pathId so no learner loses progress", () => {
    expect(bookOne.id).toBe("n5");
  });

  it("is the first book and reads as 'Book One', never 'N5' (DR-024)", () => {
    expect(bookOne.order).toBe(1);
    expect(bookOne.title).toBe("Book One");
  });

  it("wraps the existing ladder and chapter list without copying", () => {
    expect(bookOne.lessons).toBe(n5Lessons);
    expect(bookOne.chapters).toBe(n5Chapters);
  });

  it("does not carry the difficulty shift — Book One keeps its defaults (03 §0b)", () => {
    expect(bookOne.difficultyShift).toBe(false);
  });
});
