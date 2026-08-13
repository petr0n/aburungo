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
import type { Phrase, Word } from "@/types";
import { isWord } from "@/types";

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
 * Take a broad sample across groups rather than a slice of whatever sorts first.
 *
 * Round-robins one item per group at a time, so a learner with 40 time words
 * and 6 weather words still sees weather early. Falls back to whatever exists
 * once a group runs dry.
 *
 * Generic over the item because the production checkpoint (DR-023) samples
 * words *and* phrases, which group by different fields — one round-robin, two
 * callers, rather than the same loop written twice.
 */
export function roundRobinSample<T>(
  items: readonly T[],
  size: number,
  groupOf: (item: T) => string,
  shuffle: <U>(items: readonly U[]) => U[] = defaultShuffle,
): T[] {
  if (size <= 0 || items.length === 0) return [];

  const byGroup = new Map<string, T[]>();
  for (const item of shuffle(items)) {
    const group = groupOf(item);
    const bucket = byGroup.get(group);
    if (bucket === undefined) byGroup.set(group, [item]);
    else bucket.push(item);
  }

  const groups = shuffle([...byGroup.keys()]);
  const queue: T[] = [];
  let exhausted = false;

  while (queue.length < size && !exhausted) {
    exhausted = true;
    for (const group of groups) {
      if (queue.length >= size) break;
      const next = byGroup.get(group)?.shift();
      if (next !== undefined) {
        queue.push(next);
        exhausted = false;
      }
    }
  }

  return queue;
}

/** Build the opening sweep round: a broad sample of taught words, across themes. */
export function buildSweepQueue(
  words: readonly Word[],
  size: number = SWEEP_SIZE,
  shuffle: <T>(items: readonly T[]) => T[] = defaultShuffle,
): Word[] {
  return roundRobinSample(words, size, (w) => w.theme ?? "other", shuffle);
}

/**
 * How many items the production checkpoint opens with.
 *
 * Half the sweep, because writing an item out costs far more than picking it
 * from four options — twelve typed answers is already a longer sitting than
 * twenty-four taps. The pacing target the sweep size exists to protect applies
 * here with more force, not less.
 */
export const PRODUCTION_SIZE = 12;

/**
 * Build the opening production round, sampled across both words and phrases.
 *
 * Phrases belong here in a way they do not in a recognition sweep: "how do you
 * say excuse me" is the question the whole ladder is for, and a production gate
 * over vocabulary alone would quietly leave out everything situational.
 */
export function buildProductionQueue(
  words: readonly Word[],
  phrases: readonly Phrase[],
  size: number = PRODUCTION_SIZE,
  shuffle: <T>(items: readonly T[]) => T[] = defaultShuffle,
): Array<Word | Phrase> {
  return roundRobinSample<Word | Phrase>(
    [...words, ...phrases],
    size,
    (item) => (isWord(item) ? (item.theme ?? "other") : item.scenario),
    shuffle,
  );
}
