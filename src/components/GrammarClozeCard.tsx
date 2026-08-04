import { useState } from "react";
import type { GrammarPattern, Phrase } from "@/types";
import { compareAnswer } from "@/lib/compareAnswer";
import { Badge, Button, Card } from "aburungo-design-system";
import { FillInput } from "./FillInput";
import { Furigana } from "./Furigana";

type Phase = "input" | "result";

type Props = {
  pattern: GrammarPattern;
  phrase: Phrase;
  onNext: (correct: boolean) => void;
};

export function GrammarClozeCard({ pattern, phrase, onNext }: Props) {
  const [phase, setPhase] = useState<Phase>("input");
  const [correct, setCorrect] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  // Schema guarantees pattern.blank appears in phrase.reading exactly once,
  // so a first-occurrence replace is safe and correct.
  const blankedReading = phrase.reading.replace(pattern.blank, "＿＿＿");

  function handleSubmit(value: string) {
    const isCorrect = compareAnswer(value, pattern.blank);
    setUserAnswer(value);
    setCorrect(isCorrect);
    setPhase("result");
  }

  function handleNext() {
    onNext(correct);
    setPhase("input");
    setUserAnswer("");
    setCorrect(false);
  }

  return (
    <Card className="w-full">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between gap-4">
          <Badge emphasis>{pattern.pattern}</Badge>
        </header>

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-body-sm text-fg-subtle">{pattern.gloss}</p>
          <p lang="ja" className="font-jp text-jp-lg text-fg">
            {blankedReading}
          </p>
          <p className="text-body-sm text-fg-subtle">{phrase.english}</p>
        </div>

        <div className="flex flex-col gap-4">
          {phase === "input" && <FillInput onSubmit={handleSubmit} placeholder="Fill in the blank..." />}

          {phase === "result" && (
            <div className="flex flex-col gap-4">
              <div className={["rounded-xl p-4 text-center", correct ? "bg-success-bg" : "bg-error-bg"].join(" ")}>
                <p className={["text-heading-sm font-semibold", correct ? "text-success-fg" : "text-error-fg"].join(" ")}>
                  {correct ? "Correct!" : "Not quite"}
                </p>
                {!correct && userAnswer !== "" && (
                  <p className="mt-1 font-jp text-body-sm text-error-fg">You answered: {userAnswer}</p>
                )}
              </div>

              <div className="flex flex-col items-center gap-1 rounded-xl bg-surface-2 p-4 text-center">
                <Furigana japanese={phrase.japanese} reading={phrase.reading} className="font-jp text-jp-lg text-fg" />
                <p className="text-body-sm italic text-fg-subtle">{phrase.romaji}</p>
              </div>

              <Button type="button" onClick={handleNext} fullWidth>
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
