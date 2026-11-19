import { describe, expect, it } from "vitest";
import { findText, glossaryFor, passages, stories } from "./library";

const texts = [...stories, ...passages];

describe("reading library", () => {
  it("carries every story and passage, each credited", () => {
    expect(stories.length).toBeGreaterThan(0);
    expect(passages.length).toBeGreaterThan(0);
    for (const t of texts) {
      expect(t.sentences.length, t.id).toBeGreaterThan(0);
      expect(t.credit.link, t.id).toMatch(/^https:\/\//);
    }
  });

  // A glossary word no sentence surfaces can only be found in the list at the end.
  it("shows every glossary word under some sentence of its text", () => {
    const unreachable = texts.flatMap((t) =>
      t.glossary
        .filter((e) => !t.sentences.some((s) => glossaryFor(s, t.glossary).includes(e)))
        .map((e) => `${t.id}: ${e.japanese} (${e.sentence})`),
    );
    expect(unreachable).toEqual([]);
  });

  it("finds texts by id and nothing else", () => {
    expect(findText("kc.taro")?.title).toBe("太郎くんの夏休み");
    expect(findText("no-such-text")).toBeUndefined();
  });
});
