import { useState, useEffect } from 'react'
import type { Card, ReviewRating } from '@/types'
import { useSession } from '@/store/session'
import { FlashCard } from './FlashCard'
import type { FlashCardPhase } from './FlashCard'

export function FlashcardScreen() {
  const status = useSession((s) => s.status)
  const error = useSession((s) => s.error)
  const queue = useSession((s) => s.queue)
  const currentIndex = useSession((s) => s.currentIndex)
  const initialize = useSession((s) => s.initialize)
  const rate = useSession((s) => s.rate)
  const reset = useSession((s) => s.reset)

  const [phase, setPhase] = useState<FlashCardPhase>('entering')
  const [stagedCard, setStagedCard] = useState<Card | null>(null)
  const [pendingRating, setPendingRating] = useState<ReviewRating | null>(null)

  useEffect(() => {
    void initialize()
  }, [initialize])

  const currentCard = queue[currentIndex]
  // During exit the old card is snapshotted in stagedCard so the right card
  // slides away rather than jumping to the next one mid-animation.
  const displayCard = stagedCard ?? currentCard

  function handleReveal() {
    setPhase('revealed')
  }

  function handleRate(rating: ReviewRating) {
    setStagedCard(currentCard ?? null)
    setPendingRating(rating)
    setPhase('exiting')
  }

  function handleEntered() {
    setPhase('idle')
  }

  function handleExited() {
    void rate(pendingRating ?? 'didnt')
    setPendingRating(null)
    setStagedCard(null)
    setPhase('entering')
  }

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-body-sm text-fg-faint">Loading review queue…</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-heading-sm font-semibold text-fg">Couldn't load cards</p>
        <p className="text-body text-fg-subtle">{error}</p>
        <button
          type="button"
          onClick={() => {
            reset()
            void initialize()
          }}
          className="h-12 rounded-xl border border-border-strong px-6 text-body font-medium text-fg-muted active:bg-surface-2"
        >
          Try again
        </button>
      </div>
    )
  }

  if (status === 'empty') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-heading-sm font-semibold text-fg">All caught up!</p>
        <p className="text-body text-fg-subtle">No cards due for review right now.</p>
        <button
          type="button"
          onClick={() => {
            reset()
            void initialize()
          }}
          className="h-12 rounded-xl border border-border-strong px-6 text-body font-medium text-fg-muted active:bg-surface-2"
        >
          Start over
        </button>
      </div>
    )
  }

  if (!displayCard) return null

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
  )
}
