/**
 * Review card — the central UI of a review session.
 *
 * Flow:
 *   1. Show the Japanese (with reading + romaji underneath).
 *   2. Learner tries to recall the meaning.
 *   3. Learner taps "Show answer" → English appears.
 *   4. Learner taps one of two rating buttons → onRate fires → next card.
 *
 * Two-button rating is deliberate. The first version of the app pushes the
 * learner to commit to "got it" or "didn't" — no easy/medium/hard slider.
 *
 * No hover-only affordances; everything works on a touch screen.
 * Touch targets are ≥ 44px (h-12 / py-3 on text buttons).
 */
import { useState } from "react";
import type { Phrase, ReviewRating } from "@/types";
import { AudioButton } from "./AudioButton";

type Props = {
  phrase: Phrase;
  onRate: (rating: ReviewRating) => void;
};

export function Card({ phrase, onRate }: Props) {
  const [revealed, setRevealed] = useState(false);

  // Reset reveal state when the phrase changes (parent re-keys this component
  // by phrase.id, so this effect-free reset is implicit — but we still keep
  // the state local for clarity).

  return (
    <article className="flex w-full flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <header className="flex items-start justify-between gap-4">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">{phrase.scenario}</span>
        <AudioButton src={phrase.audioUrl} />
      </header>

      <div className="flex flex-col gap-3 text-center">
        <p className="font-jp text-3xl leading-tight text-zinc-900 sm:text-4xl">{phrase.japanese}</p>
        <p className="font-jp text-base text-zinc-600 sm:text-lg" lang="ja">
          {phrase.reading}
        </p>
        <p className="text-sm italic text-zinc-500">{phrase.romaji}</p>
      </div>

      {revealed ? (
        <>
          <hr className="border-zinc-200" />
          <p className="text-center text-lg text-zinc-900">{phrase.english}</p>
          {phrase.notes !== undefined ? <p className="text-center text-sm text-zinc-500">{phrase.notes}</p> : null}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => onRate("didnt")}
              className="h-12 rounded-xl border border-zinc-300 text-base font-medium text-zinc-700 active:bg-zinc-100"
            >
              Didn{"’"}t
            </button>
            <button
              type="button"
              onClick={() => onRate("got-it")}
              className="h-12 rounded-xl bg-zinc-900 text-base font-medium text-white active:bg-zinc-800"
            >
              Got it
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="h-12 w-full rounded-xl border border-zinc-300 text-base font-medium text-zinc-700 active:bg-zinc-100"
        >
          Show answer
        </button>
      )}
    </article>
  );
}
