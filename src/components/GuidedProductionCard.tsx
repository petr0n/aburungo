import { useState } from "react";
import { Button, Card } from "aburungo-design-system";
import type { Phrase } from "@/types";
import { FillInput } from "./FillInput";
import { Furigana } from "./Furigana";
import { compareAnswer } from "@/lib/compareAnswer";

type Props = {
  phrase: Phrase & { chunks: readonly string[] };
  onNext: (matched: boolean) => void;
};

/**
 * Practise a sentence with the model in front of you (DR-039).
 *
 * The sentence, its reading and its meaning stay on screen the whole time —
 * while you answer, when you switch method, in the feedback, and through every
 * retry. That is the point of the exercise rather than a concession: this is
 * supported production, and DR-040 is explicit that succeeding with the model
 * visible is not evidence of unaided recall, so it never promotes an item.
 *
 * Two ways to answer, equally available. Typing starts selected because it is
 * the harder one and most learners want it; building is a complete alternative,
 * not a warm-up that then makes you type it anyway.
 */
export function GuidedProductionCard({ phrase, onNext }: Props) {
  const [method, setMethod] = useState<"type" | "build">("type");
  const [placed, setPlaced] = useState<number[]>([]);
  const [result, setResult] = useState<{ answer: string; matched: boolean } | null>(null);

  // Switching method clears the verdict but keeps both drafts, so changing your
  // mind never costs you the chunks you had already placed.
  function chooseMethod(next: "type" | "build") {
    setMethod(next);
    setResult(null);
  }

  function check(answer: string) {
    setResult({ answer, matched: matchesModel(answer, phrase) });
  }

  const complete = placed.length === phrase.chunks.length;

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <p className="text-body-sm text-fg-subtle">Practise with the model</p>
        <p className="text-heading text-fg">{phrase.english}</p>

        <div className="rounded-xl border border-border bg-surface p-4">
          <Furigana japanese={phrase.japanese} reading={phrase.reading} />
        </div>
        <p className="text-body-sm text-fg-subtle">
          The sentence stays here while you work. Type it or build it — whichever helps.
        </p>

        <div className="flex gap-2" role="group" aria-label="Answer method">
          {(["type", "build"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={method === option}
              onClick={() => chooseMethod(option)}
              className={`min-h-[44px] flex-1 rounded-xl border px-3 text-body-sm transition-colors ${
                method === option
                  ? "border-fg-subtle bg-surface-strong text-fg"
                  : "border-border text-fg-subtle hover:bg-surface active:bg-surface"
              }`}
            >
              {option === "type" ? "Type the answer" : "Build the answer"}
            </button>
          ))}
        </div>

        {result === null && method === "type" && (
          <FillInput placeholder="Type the sentence shown above…" onSubmit={check} />
        )}

        {result === null && method === "build" && (
          <>
            <p className="text-body-sm text-fg-subtle">
              Tap the pieces in order. Tap one you have placed to take it back.
            </p>
            <div
              aria-label="Your sentence"
              className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-border bg-surface p-3"
            >
              {placed.length === 0 && (
                <span className="text-body-sm text-fg-faint">Your sentence appears here</span>
              )}
              {placed.map((chunkIndex, position) => (
                <button
                  key={`${chunkIndex}-${position}`}
                  type="button"
                  lang="ja"
                  aria-label={`Remove ${phrase.chunks[chunkIndex]}`}
                  onClick={() => setPlaced(placed.filter((_, i) => i !== position))}
                  className={CHIP}
                >
                  {phrase.chunks[chunkIndex]}
                </button>
              ))}
            </div>

            {/* ponytail: the bank is the sentence reversed, which is enough to
                stop it being a straight read-off. A seeded shuffle would be
                better for long sentences; do it when one is long enough to
                matter. */}
            <div className="flex flex-wrap gap-2">
              {phrase.chunks
                .map((_, i) => i)
                .reverse()
                .map((chunkIndex) => (
                  <button
                    key={chunkIndex}
                    type="button"
                    lang="ja"
                    disabled={placed.includes(chunkIndex)}
                    onClick={() => setPlaced([...placed, chunkIndex])}
                    className={`${CHIP} disabled:opacity-40`}
                  >
                    {phrase.chunks[chunkIndex]}
                  </button>
                ))}
            </div>

            <Button
              fullWidth
              disabled={!complete}
              onClick={() => check(placed.map((i) => phrase.chunks[i]).join(""))}
            >
              Check answer
            </Button>
          </>
        )}

        {result !== null && (
          <div className="flex flex-col gap-3" role="status">
            <p className="text-body font-medium text-fg">
              {result.matched ? "Correct" : "Not quite"}
            </p>
            <p className="text-body-sm text-fg-subtle">
              You wrote <span lang="ja">{result.answer}</span>
            </p>
            {!result.matched && (
              <p className="text-body-sm text-fg-subtle">
                This is not the sentence above. Other Japanese can be right — this exercise only
                checks the model.
              </p>
            )}
            <div className="flex gap-2">
              <Button
                fullWidth
                variant="secondary"
                onClick={() => {
                  setResult(null);
                  setPlaced([]);
                }}
              >
                Try again
              </Button>
              <Button fullWidth onClick={() => onNext(result.matched)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

const CHIP =
  "min-h-[44px] rounded-xl border border-border bg-surface px-3 font-jp text-jp text-fg " +
  "transition-colors hover:bg-surface-strong active:bg-surface-strong";

/**
 * Built answers arrive as the Japanese itself; typed ones arrive as kana or
 * romaji. So the model matches either the sentence exactly or its reading,
 * through the same comparator the rest of the app grades with — which is what
 * makes punctuation and script differences stop mattering here too.
 */
function matchesModel(answer: string, phrase: Phrase): boolean {
  const trimmed = answer.trim();
  if (trimmed === phrase.japanese.trim()) return true;
  return compareAnswer(trimmed, phrase.reading);
}
