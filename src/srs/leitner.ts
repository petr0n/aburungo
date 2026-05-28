/**
 * Leitner-box spaced repetition scheduler.
 *
 * This is the deliberate "v1, swap later" SRS. The algorithm is simple enough
 * to debug in your head, and the interface matches `Scheduler` from types.ts
 * so swapping to FSRS later is a single-file change with no caller updates.
 *
 * Rules:
 *   - New phrase (no state)              → box 1, due now.
 *   - Got it                             → box+1 (capped at 5), due in N days.
 *   - Didn't                             → box 1, due in 1 day.
 *
 * Day durations per box are deliberately on the gentle side — this app is for
 * learners who feel ready to *use* phrases, not for medical-school cramming.
 */
import type { EpochMs, LeitnerBox, ReviewRating, ReviewState, Scheduler } from "@/types";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Days until next review for each box. Exported so tests can reference the
 * same source of truth instead of duplicating magic numbers.
 */
export const BOX_DURATION_DAYS: Readonly<Record<LeitnerBox, number>> = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
};

const MAX_BOX: LeitnerBox = 5;
const MIN_BOX: LeitnerBox = 1;

function nextBox(current: LeitnerBox): LeitnerBox {
  return Math.min(current + 1, MAX_BOX) as LeitnerBox;
}

function dueAtForBox(box: LeitnerBox, now: EpochMs): EpochMs {
  return now + BOX_DURATION_DAYS[box] * ONE_DAY_MS;
}

/**
 * Compute the new ReviewState after a learner rates a phrase.
 *
 * Pure: no side effects, no Date.now() — `now` is always passed in so tests
 * are deterministic and the function is trivially mockable.
 */
export function schedule(
  current: ReviewState | undefined,
  rating: ReviewRating,
  now: EpochMs,
  phraseId: string,
): ReviewState {
  const previousBox: LeitnerBox = current?.box ?? MIN_BOX;

  const newBox: LeitnerBox = rating === "got-it" ? nextBox(previousBox) : MIN_BOX;

  return {
    phraseId,
    box: newBox,
    dueAt: dueAtForBox(newBox, now),
    lastSeenAt: now,
  };
}

/** Phrase is due if its scheduled time has arrived. */
export function isDue(state: ReviewState, now: EpochMs): boolean {
  return state.dueAt <= now;
}

/**
 * The default Leitner scheduler instance. Callers should depend on this
 * rather than the individual functions when they want the Scheduler shape.
 */
export const leitner: Scheduler = { schedule, isDue };
