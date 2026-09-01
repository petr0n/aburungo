import { describe, expect, it } from "vitest";
import { produceItemsFor } from "./produceItems";
import type { GrammarPattern, Phrase, Word } from "@/types";

/**
 * The produce step types. Some grammar is taught for recognition only.
 *
 * Book Two chapter 7 introduces 〜と言われています so a learner can read it. The
 * chapter never teaches how to build a passive form, so a produce step that
 * asks for one is asking for something the content did not supply. Kanji avoid
 * this by being absent from the produce list entirely (spec decision 4);
 * phrases need it per-phrase, because one chapter carries both kinds.
 */
const phrase = (id: string, recognitionOnly?: boolean): Phrase => ({
  id,
  japanese: "魚は体にいいと言われています。",
  reading: "さかなはからだにいいといわれています。",
  romaji: "sakana wa karada ni ii to iwarete imasu.",
  english: "Fish is said to be good for you.",
  scenario: "quoting",
  ...(recognitionOnly === undefined ? {} : { recognitionOnly }),
});

const word: Word = {
  id: "vocab.omou",
  japanese: "思う",
  reading: "おもう",
  romaji: "omou",
  english: "to think",
  wordType: "verb",
};

const pattern = { id: "grammar.b2-to-omou", phraseId: "quote.x" } as GrammarPattern;

describe("produceItemsFor", () => {
  it("includes an ordinary phrase, so the exclusions below are not vacuous", () => {
    const items = produceItemsFor({ newWords: [], newPhrases: [phrase("quote.plain")], newGrammarPattern: null });
    expect(items.map((i) => i.id)).toEqual(["quote.plain"]);
  });

  it("withholds a recognitionOnly phrase from the typing step", () => {
    const items = produceItemsFor({
      newWords: [],
      newPhrases: [phrase("quote.passive", true)],
      newGrammarPattern: null,
    });
    expect(items).toEqual([]);
  });

  it("keeps the rest of the lesson when one phrase is recognition only", () => {
    // The failure that matters is not "the flag does nothing" but "the flag
    // takes the whole lesson with it" — a lesson mixing both kinds must still
    // produce its words and its producible phrases.
    const items = produceItemsFor({
      newWords: [word],
      newPhrases: [phrase("quote.passive", true), phrase("quote.plain")],
      newGrammarPattern: pattern,
    });
    expect(items.map((i) => i.id)).toEqual(["vocab.omou", "quote.plain", "grammar.b2-to-omou"]);
  });

  it("treats an unmarked phrase as producible", () => {
    // Defaulting the other way would silently mute every phrase in the course.
    const items = produceItemsFor({
      newWords: [],
      newPhrases: [phrase("quote.unmarked"), phrase("quote.explicit-false", false)],
      newGrammarPattern: null,
    });
    expect(items.map((i) => i.id)).toEqual(["quote.unmarked", "quote.explicit-false"]);
  });
});
