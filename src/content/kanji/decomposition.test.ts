import { describe, expect, it } from "vitest";
import { allKanji } from "./index";
import decomposition from "./decomposition.json";
import filters from "./filters.json";

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
    const leaked = characters.filter((c) => map[c].some((p) => filters.standIns.includes(p)));
    expect(leaked).toEqual([]);
  });

  it("drops the elements that are spurious for one host kanji", () => {
    // 毋 is real in 毎 and 海, but it is 母's entire row -- "mother is made
    // of: do not". ⺭ is real in 社, but 杯 is 木 + 不 and has no altar in it.
    // 囗 and ハ are the same shape as their host at another codepoint, which
    // the generator's self-reference check compares past.
    const drops: Record<string, string[]> = filters.perKanjiDrop;
    const leaked = Object.entries(drops)
      .filter(([c, dropped]) => map[c].some((p) => dropped.includes(p)))
      .map(([c]) => c);
    expect(leaked).toEqual([]);
  });

  it("keeps the drop table honest, so neither guard above passes vacuously", () => {
    // Both tests above read src/content/kanji/filters.json, the same file the
    // generator reads, so adding a drop guards it in one edit. What is left
    // to catch is an emptied table, or a host key that matches no kanji and
    // so drops nothing while looking like it does.
    expect(filters.standIns.length).toBeGreaterThan(0);
    const hosts = Object.keys(filters.perKanjiDrop);
    expect(hosts.length).toBeGreaterThan(0);
    expect(hosts.filter((c) => map[c] === undefined)).toEqual([]);
  });

  it("carries its licence attribution, which regeneration must not drop", () => {
    // The immediate source is krad-unicode, whose LICENSE is 3.0 Unported.
    // Naming 4.0 here asserted something false about the source, so the
    // version, the conversion credit, the modification notice and the
    // outbound grant are all pinned.
    expect(decomposition._source).toContain("KRADFILE");
    expect(decomposition._source).toContain("krad-unicode");
    expect(decomposition._licence).toContain("CC BY-SA 3.0");
    expect(decomposition._licence).toContain("creativecommons.org/licenses/by-sa/3.0/");
    expect(decomposition._licence).toContain("offered under CC BY-SA 4.0");
    expect(decomposition._modifications).toContain("self-references dropped");
  });
});
