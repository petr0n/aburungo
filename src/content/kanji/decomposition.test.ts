import { describe, expect, it } from "vitest";
import { allKanji } from "./index";
import decomposition from "./decomposition.json";

describe("kanji decomposition", () => {
  // Annotated (not cast): decomposition.json is inferred as a literal object
  // type from its actual keys, which has no string index signature and fails
  // `tsc -b` on every `map[c]` lookup below. The brief's own interface says
  // this shape is Record<string, string[]> — this makes that binding, rather
  // than casting past it with `as`.
  const map: Record<string, string[]> = decomposition.map;
  const characters = Object.keys(map);

  it("has entries to check, so the assertions below cannot pass vacuously", () => {
    expect(characters.length).toBeGreaterThan(150);
  });

  it("covers every taught kanji", () => {
    const missing = allKanji.filter((k) => map[k.character] === undefined).map((k) => k.character);
    expect(missing).toEqual([]);
  });

  it("has no entry for a character no lesson teaches", () => {
    const taught = new Set(allKanji.map((k) => k.character));
    expect(characters.filter((c) => !taught.has(c))).toEqual([]);
  });

  it("never lists a character as its own component", () => {
    // 水 decomposes to [水] in KRADFILE. A card reading "水 is made of: 水"
    // is noise, so the generator drops self-reference and those kanji render
    // no component row at all.
    const selfReferencing = characters.filter((c) => map[c].includes(c));
    expect(selfReferencing).toEqual([]);
  });

  it("never lists a krad-unicode stand-in glyph", () => {
    // krad-unicode borrows 乞 for the unencoded 𠂉 and 隶 for 彔, so those
    // glyphs name a piece the kanji does not contain. The generator drops
    // them; this keeps a regeneration from quietly letting them back in.
    const standIns = ["乞", "隶"];
    const leaked = characters.filter((c) => map[c].some((p) => standIns.includes(p)));
    expect(leaked).toEqual([]);
  });

  it("carries its licence attribution, which regeneration must not drop", () => {
    expect(decomposition._licence).toContain("CC BY-SA");
    expect(decomposition._source).toContain("KRADFILE");
  });
});
