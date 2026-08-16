/**
 * Rejection paths for the chapter validator.
 *
 * contentIntegrity.test.ts proves the shipped chapters are well-formed, which
 * says nothing about what happens to a malformed one — the valid fixture never
 * reaches a single throw. These do, so a rule that stops working fails here
 * rather than silently in the session header.
 *
 * Mirrors src/content/grammar/schema.test.ts.
 */
import { describe, expect, it } from "vitest";
import { parseChapters } from "./schema";

const valid = [
  { id: "n5.chapter-1", order: 1, title: "Greetings & ordering" },
  { id: "n5.chapter-2", order: 2, title: "Shopping & getting around" },
];

describe("parseChapters", () => {
  it("parses a valid list", () => {
    expect(parseChapters(valid, "test.yaml")).toEqual(valid);
  });

  it("sorts by order rather than trusting file position", () => {
    const shuffled = [valid[1], valid[0]];
    expect(parseChapters(shuffled, "test.yaml").map((c) => c.id)).toEqual(["n5.chapter-1", "n5.chapter-2"]);
  });

  it("rejects a top-level value that is not an array", () => {
    expect(() => parseChapters({ id: "n5.chapter-1" }, "test.yaml")).toThrow(/must be an array/);
  });

  it("rejects an entry that is not an object", () => {
    expect(() => parseChapters(["n5.chapter-1"], "test.yaml")).toThrow(/not an object/);
    expect(() => parseChapters([null], "test.yaml")).toThrow(/not an object/);
  });

  it("rejects a missing or empty id", () => {
    expect(() => parseChapters([{ order: 1, title: "T" }], "test.yaml")).toThrow(/missing or empty field "id"/);
    expect(() => parseChapters([{ id: "", order: 1, title: "T" }], "test.yaml")).toThrow(/missing or empty field "id"/);
  });

  it("rejects a missing or empty title", () => {
    // An untitled chapter renders as "Chapter 2 · " in the session header.
    expect(() => parseChapters([{ id: "c1", order: 1 }], "test.yaml")).toThrow(/missing or empty field "title"/);
    expect(() => parseChapters([{ id: "c1", order: 1, title: "" }], "test.yaml")).toThrow(/missing or empty field "title"/);
  });

  it("rejects a missing or non-numeric order", () => {
    expect(() => parseChapters([{ id: "c1", title: "T" }], "test.yaml")).toThrow(/missing or invalid "order"/);
    expect(() => parseChapters([{ id: "c1", order: "1", title: "T" }], "test.yaml")).toThrow(/missing or invalid "order"/);
    expect(() => parseChapters([{ id: "c1", order: NaN, title: "T" }], "test.yaml")).toThrow(/missing or invalid "order"/);
  });

  it("rejects a duplicate id", () => {
    const dupe = [valid[0], { id: "n5.chapter-1", order: 2, title: "Other" }];
    expect(() => parseChapters(dupe, "test.yaml")).toThrow(/duplicate chapter id/);
  });

  it("rejects a gap in order", () => {
    // The gap is why this check exists: dropping chapter 2 would silently
    // renumber chapter 3 to "Chapter 2" on screen, and the learner reads that
    // number as their position in the book.
    const gap = [valid[0], { id: "n5.chapter-3", order: 3, title: "Third" }];
    expect(() => parseChapters(gap, "test.yaml")).toThrow(/has order 3, expected 2/);
  });

  it("rejects a list that does not start at 1", () => {
    expect(() => parseChapters([{ id: "c2", order: 2, title: "T" }], "test.yaml")).toThrow(/has order 2, expected 1/);
  });

  it("rejects a duplicate order", () => {
    const dupe = [valid[0], { id: "n5.chapter-2", order: 1, title: "Other" }];
    expect(() => parseChapters(dupe, "test.yaml")).toThrow(/expected 2/);
  });
});
