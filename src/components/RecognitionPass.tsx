import { useState, useMemo } from "react";
import type { Word } from "@/types";
import { Furigana } from "@/components/Furigana";

type Props = {
  queue: Word[];
  pool: Word[];
  onDone: () => void;
  /** Label for the closing button. Defaults to the WordsPage context. */
  doneLabel?: string;
};

function buildOptions(current: Word, pool: Word[]): Word[] {
  const distractors = pool
    .filter((w) => w.id !== current.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
  return [current, ...distractors].sort(() => Math.random() - 0.5);
}

export function RecognitionPass({ queue, pool, onDone, doneLabel = "Back to words" }: Props) {
  const [index, setIndex] = useState(0);
  const [missed, setMissed] = useState<Word[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const current = queue[index];

  // Options are stable per card — regenerated only when index changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const options = useMemo(() => (current ? buildOptions(current, pool) : []), [index]);

  function advance(wasCorrect: boolean) {
    if (!current) return;
    const nextMissed = wasCorrect ? missed : [...missed, current];
    const nextIndex = index + 1;
    if (nextIndex >= queue.length) {
      setMissed(nextMissed);
      setDone(true);
    } else {
      setMissed(nextMissed);
      setIndex(nextIndex);
      setSelectedId(null);
    }
  }

  function handleSelect(word: Word) {
    if (selectedId !== null) return;
    setSelectedId(word.id);
    setTimeout(() => advance(word.id === current?.id), 350);
  }

  function handleSkip() {
    if (selectedId !== null) return;
    advance(true);
  }

  if (done) {
    return (
      <div className="flex flex-1 flex-col gap-6 py-8">
        <div className="flex flex-col gap-1">
          <p className="text-heading font-semibold text-fg">Quick check done.</p>
          <p className="text-body text-fg-subtle">Tricky words will come back sooner.</p>
        </div>

        {missed.length > 0 && (
          <section>
            <p className="mb-3 text-body-sm font-medium text-fg-subtle">
              Worth another look · {missed.length}
            </p>
            <div className="flex flex-col gap-2">
              {missed.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
                >
                  <Furigana japanese={w.japanese} reading={w.reading} className="text-jp font-medium text-fg" />
                  <span className="text-body-sm text-fg-subtle">{w.english}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <button
          type="button"
          onClick={onDone}
          className="flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-border bg-surface text-body font-medium text-fg active:bg-surface-2"
        >
          {doneLabel}
        </button>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="flex flex-1 flex-col py-4">
      <div className="flex items-center justify-between">
        <p className="text-body-sm text-fg-subtle">Quick check</p>
        <p className="text-body-sm text-fg-subtle">
          {index + 1} of {queue.length}
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-10">
        <p className="text-heading font-medium text-fg">{current.english}</p>

        <div className="flex flex-wrap justify-center gap-3">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt)}
              className={[
                "flex min-h-[56px] items-center rounded-2xl border px-5 py-3 transition-colors",
                selectedId === opt.id
                  ? "border-brand-300 bg-brand-50 text-fg"
                  : "border-border bg-surface text-fg active:bg-surface-2",
              ].join(" ")}
            >
              <Furigana japanese={opt.japanese} reading={opt.reading} className="text-jp-lg font-medium" />
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSkip}
        className="flex min-h-[44px] items-center justify-center text-body-sm text-fg-subtle active:text-fg"
      >
        skip →
      </button>
    </div>
  );
}
