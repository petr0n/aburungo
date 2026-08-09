/**
 * Queue builder for the end-of-ladder checkpoint (DR-020).
 *
 * The checkpoint is a *gate*, not a grade: it finishes when the remaining set
 * empties, with unlimited retry and nothing recorded. This module only decides
 * what goes into the first round — the retry loop lives in the component.
 *
 * Pure, like everything else in src/srs/: no React, no DB, and randomness is
 * injected so tests are deterministic.
 */
import type { Word } from "@/types";

/**
 * How many items the checkpoint opens with.
 *
 * Deliberately a sample, not the whole ladder. "Everything learned" is 271
 * words and climbing; presenting all of them would make the milestone the
 * heaviest sitting in the app by an order of magnitude, which is the exact
 * failure the ~7.5-words-per-session pacing target exists to prevent. Wide
 * means *touches every theme*, not *exhausts every word*.
 */
export const SWEEP_SIZE = 24;

function defaultShuffle<T>(items: readonly T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

/**
 * Build the opening round: a broad sample across themes rather than a slice of
 * whichever words happen to sort first.
 *
 * Round-robins one word per theme at a time, so a learner with 40 time words
 * and 6 weather words still sees weather early. Falls back to whatever exists
 * when a theme runs dry.
 */
export function buildSweepQueue(
  words: readonly Word[],
  size: number = SWEEP_SIZE,
  shuffle: <T>(items: readonly T[]) => T[] = defaultShuffle,
): Word[] {
  if (size <= 0 || words.length === 0) return [];

  const byTheme = new Map<string, Word[]>();
  for (const w of shuffle(words)) {
    const theme = w.theme ?? "other";
    const bucket = byTheme.get(theme);
    if (bucket === undefined) byTheme.set(theme, [w]);
    else bucket.push(w);
  }

  const themes = shuffle([...byTheme.keys()]);
  const queue: Word[] = [];
  let exhausted = false;

  while (queue.length < size && !exhausted) {
    exhausted = true;
    for (const theme of themes) {
      if (queue.length >= size) break;
      const next = byTheme.get(theme)?.shift();
      if (next !== undefined) {
        queue.push(next);
        exhausted = false;
      }
    }
  }

  return queue;
}
