import { describe, expect, it } from "vitest";
import { parseWord } from "./schema";

const base = {
  id: "vocab.test",
  japanese: "大きい",
  reading: "おおきい",
  romaji: "ookii",
  english: "big",
  word_type: "i-adj",
};

describe("word example provenance", () => {
  it("accepts a fully sourced example", () => {
    const w = parseWord(
      {
        ...base,
        example: { japanese: "町は村よりも大きい。", english: "Towns are larger.", tatoeba_id: "126109" },
      },
      "test",
    );
    expect(w.example?.tatoebaId).toBe("126109");
  });

  it("rejects an example with no tatoeba_id", () => {
    // An unsourced sentence is indistinguishable from a fabricated one, which
    // the content rules forbid — so this must fail the build, not pass silently.
    expect(() =>
      parseWord({ ...base, example: { japanese: "これはペンです。", english: "This is a pen." } }, "test"),
    ).toThrow(/tatoeba_id/);
  });

  it("rejects an example missing its translation", () => {
    expect(() =>
      parseWord({ ...base, example: { japanese: "大きい。", tatoeba_id: "1" } }, "test"),
    ).toThrow(/english/);
  });

  it("leaves example undefined when absent", () => {
    expect(parseWord(base, "test").example).toBeUndefined();
  });
});
