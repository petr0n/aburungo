import { useState } from "react";
import type { Phrase } from "@/types";
import { compareAnswer } from "@/lib/compareAnswer";
import { Badge, Button, Card } from "aburungo-design-system";
import { FillInput } from "./FillInput";
import { VoiceInput } from "./VoiceInput";
import { AudioButton } from "./AudioButton";

type Phase = "input" | "result";
type InputMode = "text" | "voice";

type Props = {
  card: Phrase;
  onNext: (correct: boolean) => void;
};

export function FillBlankCard({ card, onNext }: Props) {
  const [phase, setPhase] = useState<Phase>("input");
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [correct, setCorrect] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  function handleSubmit(value: string) {
    const isCorrect = compareAnswer(value, card.reading);
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

  const footer =
    phase === "result" ? (
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
          <p lang="ja" className="font-jp text-jp-lg text-fg">
            {card.japanese}
          </p>
          <p lang="ja" className="font-jp text-jp text-fg-muted">
            {card.reading}
          </p>
          <p className="text-body-sm italic text-fg-subtle">{card.romaji}</p>
        </div>

        <Button type="button" onClick={handleNext} fullWidth>
          Next
        </Button>
      </div>
    ) : (
      <Button type="button" onClick={() => setPhase("result")} variant="secondary" fullWidth>
        Show answer
      </Button>
    );

  return (
    <Card className="mx-auto w-full max-w-xl">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between gap-4">
          <Badge emphasis>{card.scenario.charAt(0).toUpperCase() + card.scenario.slice(1)}</Badge>
          <AudioButton src={card.audioUrl ?? undefined} />
        </header>

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-body-sm text-fg-subtle">How do you say...</p>
          <p className="text-heading text-fg">{card.english}</p>
          {card.notes != null ? <p className="text-body-sm text-fg-subtle">{card.notes}</p> : null}
        </div>

        <div className="flex flex-col gap-4">
          {phase === "input" && (
            <>
              <div className="flex justify-center gap-2 rounded-xl border border-border bg-surface p-1">
                <button
                  type="button"
                  onClick={() => setInputMode("text")}
                  className={[
                    "min-h-[44px] rounded-lg px-4 text-body-sm font-medium transition-colors",
                    inputMode === "text" ? "bg-bg text-fg shadow-card" : "text-fg-subtle active:bg-surface-2",
                  ].join(" ")}
                >
                  Type
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("voice")}
                  className={[
                    "min-h-[44px] rounded-lg px-4 text-body-sm font-medium transition-colors",
                    inputMode === "voice" ? "bg-bg text-fg shadow-card" : "text-fg-subtle active:bg-surface-2",
                  ].join(" ")}
                >
                  Speak
                </button>
              </div>

              {inputMode === "text" ? (
                <FillInput onSubmit={handleSubmit} placeholder="Type the Japanese..." />
              ) : (
                <VoiceInput onResult={handleSubmit} />
              )}
            </>
          )}
          {footer}
        </div>
      </div>
    </Card>
  );
}
