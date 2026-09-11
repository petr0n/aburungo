import { finalizeRomaji } from "./romajiToKana";

// Katakana → hiragana so users can type either and be marked correct
function toHiragana(str: string): string {
  return str.replace(/[ァ-ヶ]/g, (c) => String.fromCodePoint(c.codePointAt(0)! - 0x60));
}

/**
 * Punctuation and spacing are not part of what a reading tests, and the romaji
 * converter cannot produce them anyway — a typed "." becomes a Latin period,
 * never 。. Of the 2133 readings in the content, 1129 end in 。 and 270 carry 、
 * inside the sentence, so before this a learner who knew a card perfectly was
 * marked wrong.
 *
 * By Unicode category rather than by a list of characters. The list this
 * replaced was written from the two marks anyone thinks of and silently missed
 * three more that are really in the content: … in three readings and 「」 in
 * two. Scanning every reading finds exactly seven non-kana characters — 。、
 * ？！…「」 — and the next one added to a card would have gone unnoticed the
 * same way.
 *
 * Letters are deliberately kept, kana and Latin alike. ー is a modifier letter
 * rather than punctuation, so it survives; and a romaji answer that only half
 * converts leaves Latin behind, which has to stay wrong.
 *
 * Both sides are stripped, so a learner who does type the punctuation with a
 * system IME is still right.
 */
const IGNORED = /[\s\p{P}\p{S}]/gu;

function normalize(str: string): string {
  return toHiragana(str.trim()).replace(IGNORED, "");
}

/**
 * Returns true if userInput matches the expected reading.
 * Accepts hiragana, katakana, or romaji that converts to the correct kana.
 */
export function compareAnswer(userInput: string, expected: string): boolean {
  const input = normalize(userInput);
  const target = normalize(expected);

  if (input === target) return true;

  // Try treating input as romaji. The raw input is converted, not the
  // normalized one: stripping first would merge "n." into "n" and change what
  // the converter sees.
  return normalize(finalizeRomaji(userInput.trim())) === target;
}
