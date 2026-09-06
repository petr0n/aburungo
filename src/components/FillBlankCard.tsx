import { useState } from "react";
import type { SVGProps } from "react";
import type { Phrase, Word, WordType } from "@/types";
import { isWord } from "@/types";
import { compareAnswer } from "@/lib/compareAnswer";
import { toPoliteJapanese, toPoliteReading } from "@/lib/verbForms";
import { AnswerResult, Badge, Button, Card, MicIcon } from "aburungo-design-system";
import { FillInput } from "./FillInput";
import { VoiceInput } from "./VoiceInput";
import { AudioButton } from "./AudioButton";

type Phase = "input" | "result";
type InputMode = "text" | "voice";

const WORD_TYPE_LABELS: Record<WordType, string> = {
  noun: "Noun",
  verb: "Verb",
  "i-adj": "Adjective",
  "na-adj": "Adjective",
  adverb: "Adverb",
  counter: "Counter",
  interjection: "Interjection",
};

type Props = {
  card: Phrase | Word;
  /**
   * Whether the result reveals romaji. Defaults on; a difficulty-shifted book
   * (03 §6) passes false — kana only, and every book's items obey the book
   * the learner is in, not the book the item came from.
   */
  showRomaji?: boolean;
  onNext: (correct: boolean) => void;
};

/**
 * The design system ships MicIcon but no keyboard glyph, and one icon is not
 * a component library. Same conventions as its set: 24x24, currentColor,
 * aria-hidden -- the label belongs on the button that wraps it.
 */
function KeyboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"
      />
    </svg>
  );
}

const INPUT_MODES = [
  { mode: "text" as const, label: "Type your answer", Icon: KeyboardIcon },
  { mode: "voice" as const, label: "Speak your answer", Icon: MicIcon },
];

export function FillBlankCard({ card, showRomaji = true, onNext }: Props) {
  const [phase, setPhase] = useState<Phase>("input");
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [correct, setCorrect] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  const badgeLabel = isWord(card)
    ? WORD_TYPE_LABELS[card.wordType]
    : card.scenario.charAt(0).toUpperCase() + card.scenario.slice(1);

  const politeJapanese = isWord(card) && card.verbClass !== undefined
    ? toPoliteJapanese(card.japanese, card.reading, card.verbClass)
    : null;
  const politeReading = isWord(card) && card.verbClass !== undefined
    ? toPoliteReading(card.reading, card.verbClass)
    : null;

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
        <AnswerResult
          outcome={correct ? "correct" : "review"}
          userAnswer={correct ? undefined : userAnswer}
        >
          {politeJapanese !== null ? (
            <>
              <p lang="ja" className="font-jp text-jp-lg text-fg">
                {card.japanese} · {politeJapanese}
              </p>
              <p lang="ja" className="font-jp text-jp text-fg-muted">
                {card.reading} · {politeReading}
              </p>
            </>
          ) : (
            <>
              <p lang="ja" className="font-jp text-jp-lg text-fg">
                {card.japanese}
              </p>
              <p lang="ja" className="font-jp text-jp text-fg-muted">
                {card.reading}
              </p>
            </>
          )}
          {showRomaji && <p className="text-body-sm italic text-fg-subtle">{card.romaji}</p>}
        </AnswerResult>

        <Button type="button" onClick={handleNext} fullWidth>
          Next
        </Button>
      </div>
    ) : (
      <Button type="button" onClick={() => setPhase("result")} variant="secondary" fullWidth>
        Show answer
      </Button>
    );

  const modeToggle =
    phase === "input" ? (
      <div className="flex justify-end">
        <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
          {INPUT_MODES.map(({ mode, label, Icon }) => (
            <button
              key={mode}
              type="button"
              onClick={() => setInputMode(mode)}
              aria-label={label}
              aria-pressed={inputMode === mode}
              title={label}
              className={[
                "flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-colors",
                inputMode === mode ? "bg-bg text-fg shadow-card" : "text-fg-subtle active:bg-surface-2",
              ].join(" ")}
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <div className="flex w-full flex-col gap-3">
      {modeToggle}
      <Card className="w-full">
        <div className="flex flex-col gap-6">
          <header className="flex items-center justify-between gap-4">
            <Badge emphasis>{badgeLabel}</Badge>
            <AudioButton src={card.audioUrl ?? undefined} />
          </header>

          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-body-sm text-fg-subtle">How do you say...</p>
            <p className="text-heading text-fg">{card.english}</p>
            {card.notes != null ? <p className="text-body-sm text-fg-subtle">{card.notes}</p> : null}
          </div>

          <div className="flex flex-col gap-4">
            {phase === "input" &&
              (inputMode === "text" ? <FillInput onSubmit={handleSubmit} /> : <VoiceInput onResult={handleSubmit} />)}
            {footer}
          </div>
        </div>
      </Card>
    </div>
  );
}
