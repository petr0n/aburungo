/**
 * Frame-based composition (03 §8) — the produce beat of a difficulty-shifted
 * book.
 *
 * A frame is a taught sentence with one word lifted out: the learner picks a
 * word and types the whole sentence, and `frame + slotted word` determines the
 * expected answer mechanically — no API, no grader. Everything here is derived
 * at runtime from existing content; nothing is authored and nothing is stored.
 *
 * The frame and its options live in reading kana, not display Japanese:
 * slotting a reading into a kanji sentence would garble it, and the shifted
 * books are kana-first anyway (03 §6). Grammaticality of a swap is guaranteed
 * only as far as word type — options must share the slotted word's `wordType`,
 * which is the mechanical check §8 promises and no more.
 */
import type { Phrase, Word } from "@/types";

/** How many words the learner picks from, the attested one included. */
export const FRAME_OPTIONS_MAX = 4;

export type CompositionFrame = {
  /** Reading text before the slot. May be empty. */
  before: string;
  /** Reading text after the slot. May be empty. */
  after: string;
  /** The word attested in the slot — always present in `options`. */
  slotWordId: string;
  /** Words the learner may slot in. Every one is a valid pick. */
  options: Word[];
  /** English of the attested sentence, shown as context for the frame. */
  english: string;
};

function occurrences(haystack: string, needle: string): number {
  return needle === "" ? 0 : haystack.split(needle).length - 1;
}

/**
 * Derive a composition frame from a phrase and a pool of candidate words.
 *
 * The slot is the first candidate word whose reading appears exactly once in
 * the phrase's reading (ambiguous slots are skipped) without swallowing the
 * whole phrase. Returns null when no candidate fits — callers fall back to the
 * type-the-phrase card.
 */
export function buildCompositionFrame(phrase: Phrase, candidates: readonly Word[]): CompositionFrame | null {
  const slotWord = candidates.find(
    (w) => w.reading !== "" && w.reading !== phrase.reading && occurrences(phrase.reading, w.reading) === 1,
  );
  if (slotWord === undefined) return null;

  const at = phrase.reading.indexOf(slotWord.reading);
  const before = phrase.reading.slice(0, at);
  const after = phrase.reading.slice(at + slotWord.reading.length);

  const options: Word[] = [slotWord];
  for (const w of candidates) {
    if (options.length >= FRAME_OPTIONS_MAX) break;
    if (w.wordType !== slotWord.wordType) continue;
    if (w.reading === "" || options.some((o) => o.reading === w.reading)) continue;
    // A word already sitting in the frame text would appear twice when slotted.
    if (before.includes(w.reading) || after.includes(w.reading)) continue;
    options.push(w);
  }

  return { before, after, slotWordId: slotWord.id, options, english: phrase.english };
}

/** The expected sentence for a chosen word — the whole point of a frame. */
export function frameAnswer(frame: CompositionFrame, word: Word): string {
  return frame.before + word.reading + frame.after;
}
