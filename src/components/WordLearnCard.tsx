import type { Word, WordType } from "@/types";
import { toPoliteJapanese, toPoliteReading } from "@/lib/verbForms";
import { Furigana } from "@/components/Furigana";

const WORD_TYPE_LABELS: Record<WordType, string> = {
  noun: "Noun",
  verb: "Verb",
  "i-adj": "i-adjective",
  "na-adj": "na-adjective",
  adverb: "Adverb",
  counter: "Counter",
};

type Props = {
  word: Word;
  index: number;
  total: number;
  onNext: () => void;
};

export function WordLearnCard({ word, index, total, onNext }: Props) {
  const typeLabel = WORD_TYPE_LABELS[word.wordType];
  const politeJapanese = word.verbClass !== undefined
    ? toPoliteJapanese(word.japanese, word.reading, word.verbClass)
    : null;
  const politeReading = word.verbClass !== undefined
    ? toPoliteReading(word.reading, word.verbClass)
    : null;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onNext}
          className="text-body-sm text-fg-subtle active:text-fg"
        >
          Skip
        </button>
        <p className="text-body-sm text-fg-subtle">{index + 1} / {total}</p>
        <div className="w-10" />
      </div>

      <div className="w-full rounded-2xl border border-border bg-bg shadow-card">
        <div className="flex flex-col gap-5 p-6">
          <span className="inline-flex w-fit items-center rounded-md bg-surface-2 px-2 py-0.5 text-caption font-medium uppercase tracking-wider text-fg-subtle">
            {typeLabel}
          </span>

          <div className="flex flex-col items-center gap-3 py-4">
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
                <p lang="ja" className="text-center text-body-sm text-fg-subtle" style={{ fontFamily: "var(--font-jp)" }}>
                  {word.reading} · {word.romaji}
                </p>
              </>
            )}
          </div>

          <div className="rounded-xl bg-surface-2 px-4 py-3 text-center">
            <p className="text-body font-semibold text-fg">{word.english}</p>
            {politeJapanese !== null && (
              <div className="mt-2 flex justify-center gap-4 text-body-sm text-fg-subtle">
                <span>plain &nbsp;<span lang="ja" style={{ fontFamily: "var(--font-jp)" }}>{word.japanese}</span></span>
                <span>polite &nbsp;<span lang="ja" style={{ fontFamily: "var(--font-jp)" }}>{politeJapanese}</span></span>
              </div>
            )}
            {word.notes != null && (
              <p className="mt-1 text-body-sm text-fg-subtle">{word.notes}</p>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
      >
        {index + 1 < total ? "Got it — Next" : "Got it — Start test"}
      </button>
    </div>
  );
}
