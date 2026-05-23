import type { Card } from '@/types'
import type { ReviewRating } from '@/types'
import { Badge } from './ui/Badge'

export type FlashCardPhase = 'entering' | 'idle' | 'revealed' | 'exiting'

type Props = {
  card: Card
  phase: FlashCardPhase
  onReveal: () => void
  onRate: (rating: ReviewRating) => void
  onEntered: () => void
  onExited: () => void
}

export function FlashCard({ card, phase, onReveal, onRate, onEntered, onExited }: Props) {
  const isFlipped = phase === 'revealed' || phase === 'exiting'

  const slideClass =
    phase === 'entering'
      ? 'animate-card-enter'
      : phase === 'exiting'
        ? 'animate-card-exit'
        : ''

  function handleAnimationEnd() {
    if (phase === 'entering') onEntered()
    if (phase === 'exiting') onExited()
  }

  return (
    <div
      className={slideClass}
      onAnimationEnd={handleAnimationEnd}
      style={{ perspective: '1200px' }}
    >
      {/* flip wrapper */}
      <div
        className="relative w-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* FRONT — Japanese */}
        <div
          className="w-full rounded-2xl border border-border bg-bg shadow-card"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex flex-col gap-5 p-6">
            <div className="flex items-start justify-between">
              <Badge emphasis>{card.deck}</Badge>
            </div>

            <div className="flex flex-col items-center gap-2 py-8">
              <p
                lang="ja"
                className="text-center text-jp-display font-medium text-fg"
              >
                {card.japanese}
              </p>
              <p lang="ja" className="text-center text-jp text-fg-muted">
                {card.reading}
              </p>
            </div>

            <button
              type="button"
              onClick={onReveal}
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
            >
              Reveal
            </button>
          </div>
        </div>

        {/* BACK — English + rating */}
        <div
          className="absolute inset-0 w-full rounded-2xl border border-border bg-bg shadow-card"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex flex-col gap-5 p-6">
            <div className="flex items-start justify-between">
              <Badge emphasis>{card.deck}</Badge>
            </div>

            <div className="flex flex-col items-center gap-3 py-4">
              <p lang="ja" className="text-center text-jp text-fg-muted">
                {card.japanese}
              </p>
              <p lang="ja" className="text-center text-body-sm text-fg-subtle">
                {card.reading}
              </p>
              <hr className="my-2 w-full border-border" />
              <p className="text-center text-heading-sm font-semibold text-fg">
                {card.english}
              </p>
              {card.notes != null && (
                <p className="text-center text-body-sm text-fg-subtle">{card.notes}</p>
              )}
            </div>

            <div className="mt-auto flex gap-3">
              <button
                type="button"
                onClick={() => onRate('didnt')}
                className="flex min-h-[52px] flex-1 items-center justify-center rounded-2xl border border-border bg-surface text-body font-medium text-fg-muted active:bg-surface-2"
              >
                Didn't know
              </button>
              <button
                type="button"
                onClick={() => onRate('got-it')}
                className="flex min-h-[52px] flex-1 items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
