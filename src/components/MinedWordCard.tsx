import { useState } from "react";
import type { GlossaryEntry } from "@/types";
import { Furigana } from "@/components/Furigana";
import { SourceCredit } from "@/components/SourceCredit";
import type { Credit } from "@/content/reading/credits";

type Props = {
  entry: GlossaryEntry;
  /** The sentence's licence credit, shown above it as in the reader. */
  credit: Credit | undefined;
  onRate: (correct: boolean) => void;
};

/**
 * Review for a word kept from a reading: shown in the sentence it came from
 * (04-stage-reading.md section 4), self-judged like the flip card.
 */
export function MinedWordCard({ entry, credit, onRate }: Props) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl border border-border bg-bg p-6 shadow-card">
      <div className="flex flex-col">
        <p className="text-caption text-fg-subtle">From your reading</p>
        {credit !== undefined && <SourceCredit {...credit} />}
      </div>
      <p lang="ja" className="text-jp leading-relaxed text-fg wrap-anywhere" style={{ fontFamily: "var(--font-jp)" }}>
        {entry.sentence}
      </p>
      <p className="text-body text-fg-muted">
        What does <span lang="ja" className="font-semibold text-fg" style={{ fontFamily: "var(--font-jp)" }}>{entry.japanese}</span> mean here?
      </p>
      {revealed ? (
        <>
          <div className="flex flex-col items-center gap-2 border-t border-border pt-4">
            <Furigana japanese={entry.japanese} reading={entry.reading} className="text-jp-display text-fg" />
            <p className="text-center text-heading-sm font-semibold text-fg">{entry.english}</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onRate(false)}
              className="flex min-h-[52px] flex-1 items-center justify-center rounded-2xl border border-border bg-surface text-body font-medium text-fg-muted active:bg-surface-2"
            >
              Didn't know
            </button>
            <button
              type="button"
              onClick={() => onRate(true)}
              className="flex min-h-[52px] flex-1 items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
            >
              Got it
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
        >
          Reveal
        </button>
      )}
    </div>
  );
}
