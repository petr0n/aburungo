import type { ReviewRating } from "@/types";

/**
 * What one learning session has already done to each item (DR-040 rule 5).
 *
 * Session-start reviews and chapter checkpoints feed the same schedule, so the
 * safeguards have to be shared between them rather than enforced twice. This is
 * the one place that decides whether an answer is allowed to move an item.
 *
 * Pure, like everything in src/srs/: no React, no clock, no storage. The caller
 * holds one of these per session and hands every answered attempt to it.
 */
export type SessionEvidence = {
  /**
   * The rating to apply for this attempt, or null to leave the schedule alone.
   *
   * - A miss always applies, and marks the item for the rest of the session.
   * - A first independent success promotes.
   * - A success after a miss does not, because a retry cannot erase the miss
   *   that preceded it (rule 4) — completing a checkpoint means the learner
   *   worked through it, not that every item was recalled unaided.
   * - A second success does not, because an item advances at most once per
   *   session however many activities it appears in (rule 5).
   *
   * Assisted success is covered without a flag: revealing an answer leaves
   * `correct` false in every card that offers it, so it arrives here as a miss
   * and cannot promote. `FillBlankCard`'s "Show answer" sets the result phase
   * without setting `correct`, and a test pins that.
   */
  ratingFor: (itemId: string, correct: boolean) => ReviewRating | null;
};

export function createSessionEvidence(): SessionEvidence {
  const promoted = new Set<string>();
  const missed = new Set<string>();

  return {
    ratingFor(itemId, correct) {
      if (!correct) {
        missed.add(itemId);
        // A later miss overrides an earlier success: the item is due again
        // regardless of how the session started.
        return "didnt";
      }
      if (missed.has(itemId) || promoted.has(itemId)) return null;
      promoted.add(itemId);
      return "got-it";
    },
  };
}
