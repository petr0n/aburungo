import { useState } from "react";
import type { Unit, Word } from "@/types";
import { buildSweepQueue } from "@/srs/sweep";
import { RecognitionPass } from "./RecognitionPass";

type Props = {
  /** The checkpoint unit, for the intro screen. */
  unit: Unit;
  /** Everything the learner has already been taught. */
  words: Word[];
  /** Reported per miss so the caller can return the word to the SRS queue. */
  onMissed?: (word: Word) => void;
  onDone: () => void;
};

/**
 * The end-of-ladder checkpoint (DR-020) — a mastery gate, not a grade.
 *
 * Runs a wide recognition round over everything learned. Anything missed comes
 * straight back in the next round, and the checkpoint finishes only when the
 * remaining set empties. Unlimited retry, nothing recorded, no score anywhere:
 * the only number shown is how much work is left, and it can only shrink.
 *
 * That is the distinction CLAUDE.md draws — "does the number shrink to zero as
 * you work, or does it stand as a verdict on you?" — so this screen never shows
 * a total, a ratio or a percentage.
 *
 * The retry loop is composition rather than a new card UI: each round is a
 * RecognitionPass over the words still to place.
 */
export function CheckpointSweep({ unit, words, onMissed, onDone }: Props) {
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState<Word[]>(() => buildSweepQueue(words));
  const [missedThisRound, setMissedThisRound] = useState<Word[]>([]);
  const [roundNumber, setRoundNumber] = useState(1);

  function handleMissed(word: Word) {
    // Re-queue for this checkpoint *and* hand it back to the caller for the SRS
    // queue. The gate and the schedule are separate concerns.
    setMissedThisRound((m) => (m.some((w) => w.id === word.id) ? m : [...m, word]));
    onMissed?.(word);
  }

  function handleRoundDone() {
    if (missedThisRound.length === 0) {
      onDone();
      return;
    }
    setRound(missedThisRound);
    setMissedThisRound([]);
    setRoundNumber((n) => n + 1);
  }

  if (!started) {
    return (
      <div className="flex w-full flex-col gap-6 py-8">
        <div className="flex flex-col gap-2">
          <p className="text-body-sm uppercase tracking-widest text-fg-faint">{unit.situation}</p>
          <p className="text-heading font-semibold text-fg">{unit.title}</p>
          <p className="text-body text-fg-subtle">{unit.canDo}</p>
        </div>
        <p className="text-body-sm text-fg-subtle">{unit.grammarNote}</p>
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
        >
          Start
        </button>
      </div>
    );
  }

  if (round.length === 0) {
    // Nothing to place — a learner reaching the checkpoint with no taught words
    // is only possible in a broken ladder, but the screen must not hang.
    return (
      <div className="flex w-full flex-col gap-6 py-8">
        <p className="text-heading font-semibold text-fg">Nothing to place yet.</p>
        <button
          type="button"
          onClick={onDone}
          className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 py-4">
      <div className="flex flex-col gap-1">
        <p className="text-body-sm text-fg-subtle">
          {roundNumber === 1 ? "Checkpoint" : `Checkpoint · round ${roundNumber}`}
        </p>
        <p className="text-body-sm text-fg-subtle">
          {round.length === 1 ? "1 more to place" : `${round.length} to place`}
        </p>
      </div>
      <RecognitionPass
        key={`round-${roundNumber}`}
        queue={round}
        pool={words}
        onMissed={handleMissed}
        onDone={handleRoundDone}
        doneLabel={missedThisRound.length > 0 ? "Place these again" : "Done — all placed"}
      />
    </div>
  );
}
