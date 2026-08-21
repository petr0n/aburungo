import { useState } from "react";
import type { Word } from "@/types";
import type { CompositionFrame } from "@/lib/composition";
import { frameAnswer } from "@/lib/composition";
import { compareAnswer } from "@/lib/compareAnswer";
import { AnswerResult, Badge, Button, Card } from "aburungo-design-system";
import { FillInput } from "./FillInput";
import { Furigana } from "./Furigana";

type Phase = "pick" | "type" | "result";

type Props = {
  frame: CompositionFrame;
  /** Badge text — the lesson's pattern when the frame realizes one. */
  patternLabel?: string;
  onNext: (correct: boolean) => void;
};

/**
 * The produce beat of a difficulty-shifted book (03 §8): the frame with a
 * slot, a choice of words, and the learner types the whole sentence. The
 * expected answer is mechanical — `frameAnswer(frame, chosen)` — so there is
 * no API and no grader, and any offered word is a valid pick.
 *
 * Deliberately renders no romaji anywhere: this card only exists inside books
 * with the romaji cut (03 §6). Typing romaji still works — FillInput's
 * romaji→kana conversion is an IME, not reading.
 */
export function FrameComposeCard({ frame, patternLabel, onNext }: Props) {
  const [phase, setPhase] = useState<Phase>("pick");
  const [chosen, setChosen] = useState<Word | null>(null);
  const [correct, setCorrect] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  const frameText = `${frame.before}＿＿＿${frame.after}`;

  function handleSubmit(value: string) {
    if (chosen === null) return;
    setUserAnswer(value);
    setCorrect(compareAnswer(value, frameAnswer(frame, chosen)));
    setPhase("result");
  }

  function handleNext() {
    onNext(correct);
    setPhase("pick");
    setChosen(null);
    setUserAnswer("");
    setCorrect(false);
  }

  return (
    <Card className="w-full">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between gap-4">
          <Badge emphasis>{patternLabel ?? "Compose"}</Badge>
        </header>

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-body-sm text-fg-subtle">
            {phase === "pick" ? "Pick a word, then build the sentence" : "Type the whole sentence"}
          </p>
          <p lang="ja" className="font-jp text-jp-lg text-fg">
            {frameText}
          </p>
          <p className="text-body-sm text-fg-subtle">like: “{frame.english}”</p>
        </div>

        {phase === "pick" && (
          <div className="flex flex-col gap-2">
            {frame.options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setChosen(option);
                  setPhase("type");
                }}
                className="flex min-h-[52px] w-full items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-3 text-left active:bg-surface-2"
              >
                <Furigana japanese={option.japanese} reading={option.reading} className="text-jp font-medium text-fg" />
                <span className="text-body-sm text-fg-subtle">{option.english}</span>
              </button>
            ))}
          </div>
        )}

        {phase === "type" && chosen !== null && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-3 rounded-xl bg-surface-2 px-4 py-3">
              <Furigana japanese={chosen.japanese} reading={chosen.reading} className="text-jp font-medium text-fg" />
              <span className="text-body-sm text-fg-subtle">{chosen.english}</span>
            </div>
            <FillInput onSubmit={handleSubmit} placeholder="Type the sentence..." />
            <Button type="button" onClick={() => handleSubmit("")} variant="secondary" fullWidth>
              Show answer
            </Button>
          </div>
        )}

        {phase === "result" && chosen !== null && (
          <div className="flex flex-col gap-4">
            <AnswerResult outcome={correct ? "recalled" : "review"} userAnswer={correct || userAnswer === "" ? undefined : userAnswer}>
              <p lang="ja" className="font-jp text-jp-lg text-fg">
                {frameAnswer(frame, chosen)}
              </p>
            </AnswerResult>
            <Button type="button" onClick={handleNext} fullWidth>
              Next
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
