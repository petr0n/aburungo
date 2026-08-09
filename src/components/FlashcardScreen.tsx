import { useState, useEffect } from "react";
import type { Phrase, Word, ReviewRating } from "@/types";
import { useSession } from "@/store/session";
import { useAuth } from "@/store/auth";
import { LoadingPlaceholder, EmptyState, ErrorState } from "aburungo-design-system";
import { FlashCard } from "./FlashCard";
import type { FlashCardPhase } from "./FlashCard";

type Props = { cards: Array<Phrase | Word> };

export function FlashcardScreen({ cards }: Props) {
  const userId = useAuth((s) => s.user?.id ?? null);
  const status = useSession((s) => s.status);
  const error = useSession((s) => s.error);
  const queue = useSession((s) => s.queue);
  const currentIndex = useSession((s) => s.currentIndex);
  const initialize = useSession((s) => s.initialize);
  const rate = useSession((s) => s.rate);
  const reset = useSession((s) => s.reset);

  const [phase, setPhase] = useState<FlashCardPhase>("entering");
  const [stagedCard, setStagedCard] = useState<Phrase | Word | null>(null);

  useEffect(() => {
    void initialize(cards, userId);
  }, [initialize, cards, userId]);

  const currentCard = queue[currentIndex];
  const displayCard = stagedCard ?? currentCard;

  function handleReveal() {
    setPhase("revealed");
  }

  /**
   * Rate on the click, not on the exit animation. FlipCard fires onExited from
   * onAnimationEnd, and `animate-card-exit` is not generated in this project's
   * Tailwind build, so the callback never ran and every rating was silently
   * dropped — the card sat there and nothing reached the review queue.
   * Correctness must not ride on an animation that prefers-reduced-motion is
   * also entitled to disable.
   */
  function handleRate(rating: ReviewRating) {
    setStagedCard(currentCard ?? null);
    void rate(rating, userId);
    setStagedCard(null);
    setPhase("entering");
  }

  function handleEntered() {
    setPhase("idle");
  }

  // Visual only — see handleRate. Kept so the animation, when it does run,
  // still settles the card into its idle state.
  function handleExited() {
    setPhase("idle");
  }

  if (status === "idle" || status === "loading") {
    return <LoadingPlaceholder label="Loading review queue…" />;
  }

  if (status === "error") {
    return (
      <ErrorState
        message="Couldn't load cards"
        description={error ?? undefined}
        action={
          <button
            type="button"
            onClick={() => {
              reset();
              void initialize(cards, userId);
            }}
            className="h-12 rounded-xl border border-border-strong px-6 text-body font-medium text-fg-muted hover:bg-surface-2 active:bg-surface-2"
          >
            Try again
          </button>
        }
      />
    );
  }

  if (status === "empty") {
    return (
      <EmptyState
        message="All caught up!"
        description="No cards due for review right now."
        action={
          <button
            type="button"
            onClick={() => {
              reset();
              void initialize(cards, userId);
            }}
            className="h-12 rounded-xl border border-border-strong px-6 text-body font-medium text-fg-muted hover:bg-surface-2 active:bg-surface-2"
          >
            Start over
          </button>
        }
      />
    );
  }

  if (!displayCard) return null;

  return (
    <FlashCard
      key={displayCard.id}
      card={displayCard}
      phase={phase}
      onReveal={handleReveal}
      onRate={handleRate}
      onEntered={handleEntered}
      onExited={handleExited}
    />
  );
}
