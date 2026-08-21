import { describe, expect, it } from "vitest";
import { bookOne } from "./books";
import { n5Lessons } from "./lessons";
import { n5Chapters } from "./chapters";
import { allWords } from "./vocabulary";
import { findPhrase } from "./index";
import { buildCompositionFrame } from "@/lib/composition";

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

  it("yields composition frames from real Book One content, so the dev shift is provable (03 §0b)", () => {
    // Mirrors ProduceStep: a lesson's frames are derived from its own phrases
    // with its own words as candidates. If no lesson ever derives one, the
    // ?shift=1 preview silently degrades to type-the-phrase everywhere and the
    // frame beat is unprovable before Book Two content exists.
    const wordById = new Map(allWords.map((w) => [w.id, w]));
    const derivable = bookOne.lessons.filter((lesson) => {
      const words = lesson.wordIds.map((id) => wordById.get(id)).filter((w) => w !== undefined);
      return lesson.phraseIds.some((id) => {
        const phrase = findPhrase(id);
        return phrase !== undefined && buildCompositionFrame(phrase, words) !== null;
      });
    });

    expect(derivable.length).toBeGreaterThan(0);
  });
});
