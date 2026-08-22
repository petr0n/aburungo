import { describe, expect, it } from "vitest";
import { assignIds, bestByGloss, roughRomaji, wordTypeFor } from "./vocab.mjs";

describe("wordTypeFor", () => {
  it("maps JMdict parts of speech onto the app's word_type", () => {
    expect(wordTypeFor(["v5k"])).toBe("verb");
    expect(wordTypeFor(["v1"])).toBe("verb");
    expect(wordTypeFor(["adj-i"])).toBe("i-adj");
    expect(wordTypeFor(["adj-na"])).toBe("na-adj");
    expect(wordTypeFor(["ctr"])).toBe("counter");
  });

  it("stays inside the app's WordType union", () => {
    const allowed = ["noun", "verb", "i-adj", "na-adj", "adverb", "counter", "interjection"];
    for (const pos of ["pn", "exp", "adj-i", "adj-na", "v5k", "adv", "ctr", "int", "n"]) {
      expect(allowed).toContain(wordTypeFor([pos]));
    }
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

  it("reads katakana off the same table", () => {
    expect(roughRomaji("トイレ")).toBe("toire");
    expect(roughRomaji("ラーメン")).toBe("raamen");
  });

  it("spells long vowels out, the way the shipped content does", () => {
    expect(roughRomaji("コーヒー")).toBe("koohii");
    expect(roughRomaji("エレベーター")).toBe("erebeetaa");
  });

  it("handles the katakana-only small-vowel digraphs", () => {
    expect(roughRomaji("チェックイン")).toBe("chekkuin");
    expect(roughRomaji("ウィスキー")).toBe("wisukii");
  });

  it("returns something usable for unmapped characters rather than throwing", () => {
    expect(() => roughRomaji("ヴ")).not.toThrow();
  });
});

describe("assignIds", () => {
  const card = (reading, english) => ({ reading, english });

  it("leaves a word alone when nothing else wants its id", () => {
    expect(assignIds([card("あお", "blue, azure")])[0].id).toBe("vocab.ao");
  });

  it("splits homophones on their lead gloss rather than dropping one", () => {
    const ids = assignIds([card("きる", "to wear, to put on"), card("きる", "to cut")]).map((c) => c.id);
    expect(ids).toEqual(["vocab.kiru-wear", "vocab.kiru-cut"]);
  });

  it("dodges ids the ladder already spends", () => {
    const [c] = assignIds([card("あつい", "hot (thing)")], new Set(["vocab.atsui"]));
    expect(c.id).toBe("vocab.atsui-hot");
  });

  it("never emits the same id twice", () => {
    const ids = assignIds([card("あつい", "hot"), card("あつい", "hot")], new Set(["vocab.atsui-hot"])).map((c) => c.id);
    expect(new Set(ids).size).toBe(2);
    expect(ids).not.toContain("vocab.atsui-hot");
  });
});

describe("bestByGloss", () => {
  const hit = (allGlosses, common = true) => ({ allGlosses, common });

  it("picks the homophone the reference list actually means", () => {
    const sweep = hit(["to sweep", "to brush", "to gather"]);
    const wear = hit(["to put on (lower-body clothing)", "to wear"]);
    expect(bestByGloss([sweep, wear], "to put on (items below your waist)")).toBe(wear);
  });

  it("reads senses past the four a card shows", () => {
    const ageruUp = hit(["to raise", "to elevate", "to fly (a kite)", "to praise", "to give"]);
    const ageruCite = hit(["to raise", "to lift up", "to give (an example)", "to cite"]);
    expect(bestByGloss([ageruUp, ageruCite], "to give")).toBe(ageruUp);
  });

  it("declines to guess when nothing overlaps", () => {
    expect(bestByGloss([hit(["to sweep"])], "to put on")).toBeUndefined();
    expect(bestByGloss([hit(["to sweep"])], "")).toBeUndefined();
  });
});
