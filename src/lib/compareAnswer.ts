import { finalizeRomaji } from "./romajiToKana";

// Katakana → hiragana so users can type either and be marked correct
function toHiragana(str: string): string {
  return str.replace(/[ァ-ヶ]/g, (c) => String.fromCodePoint(c.codePointAt(0)! - 0x60));
}

function normalize(str: string): string {
  return toHiragana(str.trim());
}

/**
 * Returns true if userInput matches the expected reading.
 * Accepts hiragana, katakana, or romaji that converts to the correct kana.
 */
export function compareAnswer(userInput: string, expected: string): boolean {
  const input = normalize(userInput);
  const target = normalize(expected);

  if (input === target) return true;

  // Try treating input as romaji
  return normalize(finalizeRomaji(input)) === target;
}
