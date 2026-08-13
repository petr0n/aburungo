import { useState } from "react";
import type { Phrase, Unit, Word } from "@/types";
import { buildProductionQueue } from "@/srs/sweep";
import { FillBlankCard } from "./FillBlankCard";

type Props = {
  /** The checkpoint unit, for the intro screen. */
  unit: Unit;
  /** Words the learner has already been taught. */
  words: Word[];
  /** Phrases the learner has already been taught. */
  phrases: Phrase[];
  /** Reported per miss so the caller can return the item to the SRS queue. */
  onMissed?: (item: Word | Phrase) => void;
  onDone: () => void;
};

/**
 * The production checkpoint that closes the level (DR-023).
 *
 * Same gate as the sweeps, one rung harder: instead of picking an item out of a
 * line-up, the learner writes it from its English. Recognising コーヒー and
 * producing it are different skills, and the ladder had only ever gated the
 * first — every checkpoint before this one could be cleared by recognition.
 *
 * A gate, not a grade, by the same test as everywhere else: the only number is
 * how many are left in the round, it can only shrink, retries are unlimited,
 * nothing is recorded and there is no total or ratio anywhere on screen.
 *
 * Reuses FillBlankCard rather than introducing a fifth card UI — the same
 * composition CheckpointSweep does with RecognitionPass. Answers are checked
 * against the reading, so kana and romaji both count; the point is recall, not
 * orthography.
 */
export function ProductionCheckpoint({ unit, words, phrases, onMissed, onDone }: Props) {
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState<Array<Word | Phrase>>(() => buildProductionQueue(words, phrases));
  const [index, setIndex] = useState(0);
  const [missedThisRound, setMissedThisRound] = useState<Array<Word | Phrase>>([]);
  const [roundNumber, setRoundNumber] = useState(1);

  function handleNext(correct: boolean) {
    const item = round[index];
    if (item !== undefined && !correct) {
      // Re-queue for this checkpoint *and* hand it back for the SRS queue. The
      // gate and the schedule are separate concerns.
      setMissedThisRound((m) => (m.some((i) => i.id === item.id) ? m : [...m, item]));
      onMissed?.(item);
    }

    const nextIndex = index + 1;
    if (nextIndex < round.length) {
      setIndex(nextIndex);
      return;
    }

    // Round over. Anything missed comes straight back; an empty miss list ends
    // the checkpoint. `missedThisRound` may not include this last item yet —
    // the setState above has not flushed — so account for it directly.
    const finalMissed =
      item !== undefined && !correct && !missedThisRound.some((i) => i.id === item.id)
        ? [...missedThisRound, item]
        : missedThisRound;

    if (finalMissed.length === 0) {
      onDone();
      return;
    }
    setRound(finalMissed);
    setMissedThisRound([]);
    setIndex(0);
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

  const current = round[index];
  if (current === undefined) {
    // Only reachable on a ladder that taught nothing at all. The screen must
    // not hang, so it offers a way on rather than rendering nothing.
    return (
      <div className="flex w-full flex-col gap-6 py-8">
        <p className="text-heading font-semibold text-fg">Nothing to write yet.</p>
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

  const left = round.length - index;

  return (
    <div className="flex w-full flex-col gap-4 py-4">
      <div className="flex flex-col gap-1">
        <p className="text-body-sm text-fg-subtle">
          {roundNumber === 1 ? "Checkpoint" : `Checkpoint · round ${roundNumber}`}
        </p>
        <p className="text-body-sm text-fg-subtle">{left === 1 ? "1 more to write" : `${left} to write`}</p>
      </div>
      <FillBlankCard key={`${roundNumber}-${current.id}`} card={current} onNext={handleNext} />
    </div>
  );
}
