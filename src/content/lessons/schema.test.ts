/**
 * The chapter rules in the lesson validator.
 *
 * Scoped deliberately to the two rules chapters added — the rest of this
 * validator predates them and is covered indirectly by contentIntegrity.test.ts.
 * These two are what keep a lesson from going homeless: a teaching lesson with
 * no chapter would never appear in "Lesson 4 of 9", and a lesson pointing at a
 * chapter that does not exist would drop its header entirely rather than fail.
 */
import { describe, expect, it } from "vitest";
import { parseLessons } from "./schema";

const words = new Set(["vocab.a"]);
const phrases = new Set(["phrase.a"]);
const patterns = new Set(["grammar.a"]);
const chapters = new Set(["n5.chapter-1"]);

const lesson = (over: Record<string, unknown> = {}) => ({
  id: "n5.lesson-1",
  order: 1,
  chapterId: "n5.chapter-1",
  situation: "Greetings & basics",
  title: "Hello",
  canDo: "Say hello",
  wordIds: ["vocab.a"],
  phraseIds: ["phrase.a"],
  kanji: [],
  grammarNote: "A note.",
  ...over,
});

const parse = (raw: unknown) => parseLessons(raw, "test.yaml", words, phrases, patterns, chapters);

describe("parseLessons — chapter rules", () => {
  it("parses a lesson that names a known chapter", () => {
    expect(parse([lesson()])[0]?.chapterId).toBe("n5.chapter-1");
  });

  it("rejects a chapterId no chapter defines", () => {
    expect(() => parse([lesson({ chapterId: "n5.chapter-9" })])).toThrow(/unknown chapter id "n5.chapter-9"/);
  });

  it("rejects a non-string chapterId", () => {
    expect(() => parse([lesson({ chapterId: 1 })])).toThrow(/invalid "chapterId"/);
  });

  it("rejects a teaching lesson with no chapter", () => {
    expect(() => parse([lesson({ chapterId: undefined })])).toThrow(/only a checkpoint may omit it/);
  });

  it("allows a checkpoint to stand outside a chapter", () => {
    // The production checkpoint closes the book, not a chapter.
    expect(parse([lesson({ chapterId: undefined, checkpoint: "production" })])[0]?.chapterId).toBeUndefined();
  });

  it("still allows a checkpoint that does belong to a chapter", () => {
    expect(parse([lesson({ checkpoint: "recognition" })])[0]?.checkpoint).toBe("recognition");
  });
});
