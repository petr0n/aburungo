import { useEffect } from "react";
import type { Phrase, Word } from "@/types";
import { useSession } from "@/store/session";
import { useAuth } from "@/store/auth";
import { LoadingPlaceholder, EmptyState, ErrorState } from "aburungo-design-system";
import { FillBlankCard } from "./FillBlankCard";

type Props = { cards: Array<Phrase | Word> };

export function FillBlankScreen({ cards }: Props) {
  const userId = useAuth((s) => s.user?.id ?? null);
  const status = useSession((s) => s.status);
  const error = useSession((s) => s.error);
  const queue = useSession((s) => s.queue);
  const currentIndex = useSession((s) => s.currentIndex);
  const initialize = useSession((s) => s.initialize);
  const rate = useSession((s) => s.rate);
  const reset = useSession((s) => s.reset);

  useEffect(() => {
    void initialize(cards, userId);
  }, [initialize, cards, userId]);

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

  const card = queue[currentIndex];
  if (card === undefined) return null;

  return <FillBlankCard key={card.id} card={card} onNext={(correct) => void rate(correct ? "got-it" : "didnt", userId)} />;
}
