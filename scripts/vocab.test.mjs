import { describe, expect, it } from "vitest";
import { roughRomaji, wordTypeFor } from "./vocab.mjs";

describe("wordTypeFor", () => {
  it("maps JMdict parts of speech onto the app's word_type", () => {
    expect(wordTypeFor(["v5k"])).toBe("verb");
    expect(wordTypeFor(["v1"])).toBe("verb");
    expect(wordTypeFor(["adj-i"])).toBe("i-adjective");
    expect(wordTypeFor(["adj-na"])).toBe("na-adjective");
    expect(wordTypeFor(["ctr"])).toBe("counter");
  });

  it("falls back to noun rather than guessing", () => {
    expect(wordTypeFor([])).toBe("noun");
    expect(wordTypeFor(["unclassified"])).toBe("noun");
  });

  it("prefers the verb reading of an entry tagged both", () => {
    expect(wordTypeFor(["n", "vs"])).toBe("noun");
    expect(wordTypeFor(["vs", "n"])).toBe("verb");
  });
});

describe("roughRomaji", () => {
  it("handles plain kana", () => {
    expect(roughRomaji("ばん")).toBe("ban");
    expect(roughRomaji("あお")).toBe("ao");
  });

  it("handles yōon digraphs as one mora", () => {
    expect(roughRomaji("きゃく")).toBe("kyaku");
    expect(roughRomaji("しゅみ")).toBe("shumi");
    expect(roughRomaji("じょせい")).toBe("josei");
  });

  it("doubles the consonant after っ", () => {
    expect(roughRomaji("きって")).toBe("kitte");
  });

  it("returns something usable for unmapped characters rather than throwing", () => {
    expect(() => roughRomaji("ヴ")).not.toThrow();
  });
});
