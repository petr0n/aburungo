import type { Word, WordType } from "@/types";
import { toPoliteJapanese, toPoliteReading } from "@/lib/verbForms";
import { Furigana } from "@/components/Furigana";
import { FlipCard } from "aburungo-design-system";
import type { FlipCardPhase } from "aburungo-design-system";

export type DrillPhase = "entering" | "idle" | "revealed" | "exiting";

const WORD_TYPE_LABELS: Record<WordType, string> = {
  noun: "Noun",
  verb: "Verb",
  "i-adj": "i-adjective",
  "na-adj": "na-adjective",
  adverb: "Adverb",
  counter: "Counter",
};

function toFlipPhase(p: DrillPhase): FlipCardPhase {
  return p === "revealed" ? "idle" : p;
}

type Props = {
  word: Word;
  phase: DrillPhase;
  onReveal: () => void;
  onRate: (correct: boolean) => void;
  onEntered: () => void;
  onExited: () => void;
};

export function WordDrillCard({ word, phase, onReveal, onRate, onEntered, onExited }: Props) {
  const isFlipped = phase === "revealed" || phase === "exiting";
  const typeLabel = WORD_TYPE_LABELS[word.wordType];

  const politeJapanese = word.verbClass !== undefined
    ? toPoliteJapanese(word.japanese, word.reading, word.verbClass)
    : null;
  const politeReading = word.verbClass !== undefined
    ? toPoliteReading(word.reading, word.verbClass)
    : null;

  return (
    <FlipCard
      flipped={isFlipped}
      phase={toFlipPhase(phase)}
      onEntered={onEntered}
      onExited={onExited}
      front={
        <div className="w-full rounded-2xl border border-border bg-bg shadow-card">
          <div className="flex flex-col gap-5 p-6">
            <span className="inline-flex w-fit items-center rounded-md bg-surface-2 px-2 py-0.5 text-caption font-medium uppercase tracking-wider text-fg-subtle">
              {typeLabel}
            </span>
            <div className="flex flex-col items-center gap-2 py-6">
              {politeJapanese !== null ? (
                <>
                  <Furigana
                    japanese={word.japanese}
                    reading={word.reading}
                    className="block text-center text-jp-display font-medium text-fg lg:text-jp-display-lg"
                  />
                  <p lang="ja" className="text-center text-jp text-fg-muted" style={{ fontFamily: "var(--font-jp)" }}>
                    {politeJapanese}
                  </p>
                  <p lang="ja" className="text-center text-body-sm text-fg-subtle" style={{ fontFamily: "var(--font-jp)" }}>
                    {word.reading} · {politeReading}
                  </p>
                </>
              ) : (
                <>
                  <Furigana
                    japanese={word.japanese}
                    reading={word.reading}
                    className="block text-center text-jp-display font-medium text-fg lg:text-jp-display-lg"
                  />
                  <p lang="ja" className="text-center text-jp text-fg-muted" style={{ fontFamily: "var(--font-jp)" }}>
                    {word.reading}
                  </p>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={onReveal}
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white hover:bg-brand-700 active:bg-brand-700"
            >
              Reveal meaning
            </button>
          </div>
        </div>
      }
      back={
        <div className="flex h-full w-full flex-col rounded-2xl border border-border bg-bg shadow-card">
          <div className="flex flex-1 flex-col gap-4 p-6">
            <span className="inline-flex w-fit items-center rounded-md bg-surface-2 px-2 py-0.5 text-caption font-medium uppercase tracking-wider text-fg-subtle">
              {typeLabel}
            </span>
            <div className="flex flex-col gap-4 py-2">
              <div>
                <p className="mb-1 text-caption font-medium uppercase tracking-wider text-fg-subtle">Meaning</p>
                <p className="text-body font-semibold text-fg">{word.english}</p>
              </div>
              {politeJapanese !== null ? (
                <div>
                  <p className="mb-1 text-caption font-medium uppercase tracking-wider text-fg-subtle">Forms</p>
                  <div className="flex flex-col gap-0.5" style={{ fontFamily: "var(--font-jp)" }}>
                    <p lang="ja" className="text-body text-fg">
                      <span className="text-fg-subtle text-body-sm mr-2">plain</span>{word.japanese} ({word.reading})
                    </p>
                    <p lang="ja" className="text-body text-fg">
                      <span className="text-fg-subtle text-body-sm mr-2">polite</span>{politeJapanese} ({politeReading})
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="mb-1 text-caption font-medium uppercase tracking-wider text-fg-subtle">Reading</p>
                  <p lang="ja" className="text-body text-fg" style={{ fontFamily: "var(--font-jp)" }}>
                    {word.japanese} ({word.reading})
                  </p>
                  <p className="text-body-sm text-fg-subtle">{word.romaji}</p>
                </div>
              )}
              {word.notes != null && (
                <p className="text-body-sm text-fg-subtle">{word.notes}</p>
              )}
            </div>
            <div className="mt-auto flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => onRate(false)}
                className="flex min-h-[52px] flex-1 items-center justify-center rounded-2xl border border-border bg-surface text-body font-medium text-fg-muted hover:bg-surface-2 active:bg-surface-2"
              >
                Didn't know
              </button>
              <button
                type="button"
                onClick={() => onRate(true)}
                className="flex min-h-[52px] flex-1 items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white hover:bg-brand-700 active:bg-brand-700"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      }
    />
  );
}
