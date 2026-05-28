import { useState, useEffect } from "react";
import type { Phrase, ReviewRating } from "@/types";
import { useSession } from "@/store/session";
import { useUserTier } from "@/store/auth";
import { phrasesForTier } from "@/content";
import { LoadingPlaceholder, EmptyState, ErrorState } from "aburungo-design-system";
import { FlashCard } from "./FlashCard";
import type { FlashCardPhase } from "./FlashCard";

export function FlashcardScreen() {
  const tier = useUserTier();
  const status = useSession((s) => s.status);
  const error = useSession((s) => s.error);
  const queue = useSession((s) => s.queue);
  const currentIndex = useSession((s) => s.currentIndex);
  const initialize = useSession((s) => s.initialize);
  const rate = useSession((s) => s.rate);
  const reset = useSession((s) => s.reset);

  const [phase, setPhase] = useState<FlashCardPhase>("entering");
  const [stagedCard, setStagedCard] = useState<Phrase | null>(null);
  const [pendingRating, setPendingRating] = useState<ReviewRating | null>(null);

  useEffect(() => {
    void initialize(phrasesForTier(tier));
  }, [initialize, tier]);

  const currentCard = queue[currentIndex];
  const displayCard = stagedCard ?? currentCard;

  function handleReveal() {
    setPhase("revealed");
  }

  function handleRate(rating: ReviewRating) {
    setStagedCard(currentCard ?? null);
    setPendingRating(rating);
    setPhase("exiting");
  }

  function handleEntered() {
    setPhase("idle");
  }

  function handleExited() {
    void rate(pendingRating ?? "didnt");
    setPendingRating(null);
    setStagedCard(null);
    setPhase("entering");
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
              void initialize(phrasesForTier(tier));
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
              void initialize(phrasesForTier(tier));
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
