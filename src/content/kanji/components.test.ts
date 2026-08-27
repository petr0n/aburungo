import { describe, expect, it } from "vitest";
import { allComponents, componentByGlyph } from "./index";
import decomposition from "./decomposition.json";

const used = new Set(Object.values(decomposition.map).flat());

describe("component keywords", () => {
  it("has components to check, so the assertions below cannot pass vacuously", () => {
    expect(used.size).toBeGreaterThan(100);
  });

  it("has a keyword for every component a taught kanji uses", () => {
    const missing = [...used].filter((g) => !componentByGlyph.has(g));
    expect(missing).toEqual([]);
  });

  it("has no keyword for a component nothing uses", () => {
    expect(allComponents.filter((c) => !used.has(c.glyph)).map((c) => c.glyph)).toEqual([]);
  });

  it("gives every component a non-empty keyword", () => {
    for (const c of allComponents) expect(c.keyword.trim().length).toBeGreaterThan(0);
  });

  it("keeps keywords short enough to read on a phone", () => {
    // A keyword is a label, not a definition. Anything long enough to wrap is
    // a note, and belongs in `note`.
    const tooLong = allComponents.filter((c) => c.keyword.length > 24).map((c) => c.glyph);
    expect(tooLong).toEqual([]);
  });
});
