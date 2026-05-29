import { useEffect } from "react";
import { useSession } from "@/store/session";
import { useUserTier } from "@/store/auth";
import { phrasesForTier } from "@/content";
import { LoadingPlaceholder, EmptyState, ErrorState } from "aburungo-design-system";
import { FillBlankCard } from "./FillBlankCard";

export function FillBlankScreen() {
  const tier = useUserTier();
  const status = useSession((s) => s.status);
  const error = useSession((s) => s.error);
  const queue = useSession((s) => s.queue);
  const currentIndex = useSession((s) => s.currentIndex);
  const initialize = useSession((s) => s.initialize);
  const rate = useSession((s) => s.rate);
  const reset = useSession((s) => s.reset);

  useEffect(() => {
    void initialize(phrasesForTier(tier));
  }, [initialize, tier]);

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
        description="No phrases due for review right now."
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

  const card = queue[currentIndex];
  if (card === undefined) return null;

  return <FillBlankCard key={card.id} card={card} onNext={(correct) => void rate(correct ? "got-it" : "didnt")} />;
}
