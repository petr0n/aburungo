import type { GrammarPattern, Phrase, Word } from "@/types";

/**
 * What the produce step may ask the learner to type.
 *
 * Every new word, phrase and pattern, minus the phrases marked
 * `recognitionOnly` — grammar a chapter teaches for reading only. Without the
 * filter, Book Two chapter 7's 〜と言われています lands in a text box and asks
 * for a passive form the chapter never taught anyone to produce.
 *
 * Exported and pure because the same list is needed twice, once to decide
 * whether the produce step runs at all and once to feed it. It used to be
 * written out inline in both places, which is exactly how a filter ends up
 * applied to one of them.
 */
export function produceItemsFor(session: {
  newWords: Word[];
  newPhrases: Phrase[];
  newGrammarPattern: GrammarPattern | null;
}): Array<Phrase | Word | GrammarPattern> {
  return [
    ...session.newWords,
    ...session.newPhrases.filter((p) => p.recognitionOnly !== true),
    ...(session.newGrammarPattern ? [session.newGrammarPattern] : []),
  ];
}
