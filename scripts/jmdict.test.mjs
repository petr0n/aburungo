import { describe, expect, it } from "vitest";
import { check, citations, loadIndex, spellings } from "./jmdict.mjs";

/**
 * The content cites JMdict by sequence number and nothing read those numbers
 * back until now, because the dictionary is a 122 MB local download CI has
 * never had. data/jmdict-index.json is the committed slice that closes it.
 *
 * Half of these tests run against the real content, and half feed the checker
 * citations that are wrong on purpose -- a guard nobody has watched fail is a
 * guard nobody knows the shape of.
 */
describe("the committed JMdict index", () => {
  const index = loadIndex();

  it("covers the whole dictionary, not the entries we happen to cite", () => {
    // A slice built only from current citations would pass every check today
    // and reject the first word authored tomorrow.
    expect(Object.keys(index.entries).length).toBeGreaterThan(200_000);
    expect(index.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("keeps every spelling of an entry, kanji and kana alike", () => {
    // 父 is cited by family.yaml; a reading-only or kanji-only index would
    // half-work and fail on whichever form the content happened to use.
    expect(index.entries["1497610"]).toEqual(expect.arrayContaining(["父", "ちち"]));
  });
});

describe("citations in the content", () => {
  const found = citations();

  it("are there to be checked, so the assertion below cannot pass vacuously", () => {
    expect(found.length).toBeGreaterThan(600);
  });

  it("every one names a real dictionary entry, and every entry its own word", () => {
    expect(check()).toEqual([]);
  });
});

describe("the check itself", () => {
  const item = { id: "vocab.chichi", japanese: "父", reading: "ちち" };
  const cite = (seq, extra = {}) => ({
    file: "src/content/vocabulary/family.yaml",
    line: 30,
    dir: "vocabulary",
    item,
    seq,
    ...extra,
  });

  it("catches a sequence number that is not in the dictionary", () => {
    // Not 9999999, which looks invented and is not: JMdict ships its own
    // version marker under it, reading ＪＭｄｉｃｔ. 1234567 is genuinely unused.
    expect(check([cite("1234567")])).toEqual([
      "src/content/vocabulary/family.yaml:30: seq 1234567 is not a JMdict entry",
    ]);
  });

  it("catches a real entry that has nothing to do with the word it sits on", () => {
    // 1514990 is 母. Real number, wrong word -- the shape a citation takes when
    // it is copied off the line above.
    expect(check([cite("1514990")])).toHaveLength(1);
    expect(check([cite("1514990")])[0]).toContain("none of them its own entry");
  });

  it("allows a note that cites its own word and then a word it contrasts with", () => {
    // ステーキ cites itself, then ステッキ to say which one is the walking stick.
    expect(check([cite("1497610"), cite("1514990")])).toEqual([]);
  });

  it("still rejects an entry whose citations are all about other words", () => {
    expect(check([cite("1514990"), cite("1249900")])).toHaveLength(1);
  });

  it("lets a sentence contain the word it cites rather than equal it", () => {
    const sentence = {
      file: "src/content/phrases/b4-01-meaning.yaml",
      line: 12,
      dir: "phrases",
      item: { id: "p", japanese: "父は本を読みます。", reading: "ちちはほんをよみます。" },
      seq: "1497610",
    };
    expect(check([sentence])).toEqual([]);
  });
});

describe("spellings", () => {
  /**
   * The three the content actually needs. searchStem() in jlpt.mjs returns a
   * kana-only word untouched by design, which is exactly these.
   */
  it("finds a godan verb under its inflected stem", () => {
    expect(spellings("せびる")).toContain("せび"); // せびろう
    expect(spellings("たがる")).toContain("たが"); // 買いたがっている
  });

  it("shortens する, which does not inflect like anything else", () => {
    expect(spellings("とする")).toContain("とし"); // 盗もうとして
  });

  it("leaves a word with no trailing kana alone", () => {
    expect(spellings("父")).toEqual(["父"]);
  });
});
