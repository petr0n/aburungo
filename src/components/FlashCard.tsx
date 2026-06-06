import type { Phrase, Word, WordType, ReviewRating } from "@/types";
import { isWord } from "@/types";
import { toPoliteJapanese, toPoliteReading } from "@/lib/verbForms";
import { Badge, FlipCard } from "aburungo-design-system";
import type { FlipCardPhase } from "aburungo-design-system";

export type FlashCardPhase = "entering" | "idle" | "revealed" | "exiting";

const WORD_TYPE_LABELS: Record<WordType, string> = {
  noun: "Noun",
  verb: "Verb",
  "i-adj": "Adjective",
  "na-adj": "Adjective",
  adverb: "Adverb",
  counter: "Counter",
};

function toFlipPhase(p: FlashCardPhase): FlipCardPhase {
  return p === "revealed" ? "idle" : p;
}

type Props = {
  card: Phrase | Word;
  phase: FlashCardPhase;
  onReveal: () => void;
  onRate: (rating: ReviewRating) => void;
  onEntered: () => void;
  onExited: () => void;
};

export function FlashCard({ card, phase, onReveal, onRate, onEntered, onExited }: Props) {
  const isFlipped = phase === "revealed" || phase === "exiting";

  const badgeLabel = isWord(card)
    ? WORD_TYPE_LABELS[card.wordType]
    : card.scenario.charAt(0).toUpperCase() + card.scenario.slice(1);

  const politeJapanese = isWord(card) && card.verbClass !== undefined
    ? toPoliteJapanese(card.japanese, card.reading, card.verbClass)
    : null;
  const politeReading = isWord(card) && card.verbClass !== undefined
    ? toPoliteReading(card.reading, card.verbClass)
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
            <div className="flex items-start justify-between">
              <Badge emphasis>{badgeLabel}</Badge>
            </div>
            {politeJapanese !== null ? (
              <div className="flex flex-col items-center gap-1 py-8">
                <p lang="ja" className="text-center text-jp-display font-medium text-fg">
                  {card.japanese}
                </p>
                <p lang="ja" className="text-center text-jp text-fg-muted">
                  {politeJapanese}
                </p>
                <p lang="ja" className="text-center text-body-sm text-fg-subtle">
                  {card.reading} · {politeReading}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-8">
                <p lang="ja" className="text-center text-jp-display font-medium text-fg">
                  {card.japanese}
                </p>
                <p lang="ja" className="text-center text-jp text-fg-muted">
                  {card.reading}
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={onReveal}
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white hover:bg-brand-700 active:bg-brand-700"
            >
              Reveal
            </button>
          </div>
        </div>
      }
      back={
        <div className="flex h-full w-full flex-col rounded-2xl border border-border bg-bg shadow-card">
          <div className="flex flex-1 flex-col gap-5 p-6">
            <div className="flex items-start justify-between">
              <Badge emphasis>{badgeLabel}</Badge>
            </div>
            <div className="flex flex-col items-center gap-3 py-4">
              <p lang="ja" className="text-center text-jp text-fg-muted">
                {card.japanese}
              </p>
              <p lang="ja" className="text-center text-body-sm text-fg-subtle">
                {card.reading}
              </p>
              <hr className="my-2 w-full border-border" />
              <p className="text-center text-heading-sm font-semibold text-fg">{card.english}</p>
              {card.notes != null && <p className="text-center text-body-sm text-fg-subtle">{card.notes}</p>}
            </div>
            <div className="mt-auto flex gap-3">
              <button
                type="button"
                onClick={() => onRate("didnt")}
                className="flex min-h-[52px] flex-1 items-center justify-center rounded-2xl border border-border bg-surface text-body font-medium text-fg-muted hover:bg-surface-2 active:bg-surface-2"
              >
                Didn't know
              </button>
              <button
                type="button"
                onClick={() => onRate("got-it")}
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
