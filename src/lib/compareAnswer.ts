import { finalizeRomaji } from "./romajiToKana";

// Katakana → hiragana so users can type either and be marked correct
function toHiragana(str: string): string {
  return str.replace(/[ァ-ヶ]/g, (c) => String.fromCodePoint(c.codePointAt(0)! - 0x60));
}

/**
 * Punctuation and spacing are not part of what a reading tests, and in the two
 * input modes the app offers they cannot be produced at all: the romaji
 * converter turns a typed "." into a Latin period rather than 。, and the kana
 * keyboard has no 。 or 、 key. Every one of the 851 typed readings in Books Two
 * to Four ends in 。, and 183 carry 、 inside the sentence — so before this,
 * a learner who knew a card perfectly was marked wrong in either mode.
 *
 * Both sides are stripped, so a learner who does type the punctuation with a
 * system IME is still right.
 */
const IGNORED = /[\s。、．，,.！!？?]/g;

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
