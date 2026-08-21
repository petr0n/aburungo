import { describe, expect, it } from "vitest";
import { cleanAozoraText, isJuvenile, parseCsvLine } from "./aozora.mjs";

const FILE = `ウェストミンスター寺院
ワシントン・アーヴィング　Washington Irving
吉田甲子太郎訳

-------------------------------------------------------
【テキスト中に現れる記号について】

《》：ルビ
（例）真鍮《しんちゅう》
-------------------------------------------------------

［＃ここから２字下げ］
真鍮《しんちゅう》や石の記念碑となって
物｜云《い》わぬ石が語りかける。

底本：「スケッチ・ブック」新潮文庫
　　　1957（昭和32）年5月20日発行
`;

describe("cleanAozoraText", () => {
  const out = cleanAozoraText(FILE);

  it("drops the header and its 凡例 block", () => {
    expect(out).not.toContain("テキスト中に現れる記号");
    expect(out).not.toContain("ワシントン・アーヴィング");
  });

  it("drops the 底本 colophon", () => {
    expect(out).not.toContain("底本");
    expect(out).not.toContain("新潮文庫");
  });

  it("strips ruby but keeps the word it glossed", () => {
    expect(out).toContain("真鍮や石の記念碑");
    expect(out).not.toContain("しんちゅう");
  });

  it("strips the ruby-span marker without eating the character before it", () => {
    expect(out).toContain("物云わぬ石");
  });

  it("strips input notes", () => {
    expect(out).not.toContain("＃");
    expect(out).not.toContain("字下げ");
  });

  it("leaves a file with no 凡例 rules intact", () => {
    expect(cleanAozoraText("ただの文です。")).toBe("ただの文です。");
  });
});

describe("parseCsvLine", () => {
  it("keeps commas inside quoted fields", () => {
    expect(parseCsvLine('1,"あ,い",3')).toEqual(["1", "あ,い", "3"]);
  });

  it("unescapes doubled quotes", () => {
    expect(parseCsvLine('"he said ""hi""",x')).toEqual(['he said "hi"', "x"]);
  });
});

describe("isJuvenile", () => {
  it("matches the K-prefixed children's classes", () => {
    expect(isJuvenile("NDC K913")).toBe(true);
    expect(isJuvenile("NDC K912 K913")).toBe(true);
  });

  it("does not match adult classes", () => {
    expect(isJuvenile("NDC 913")).toBe(false);
    expect(isJuvenile("NDC 914")).toBe(false);
  });

  it("survives a missing classification", () => {
    expect(isJuvenile("")).toBe(false);
    expect(isJuvenile(undefined)).toBe(false);
  });
});
