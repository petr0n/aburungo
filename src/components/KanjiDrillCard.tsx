import type { KanjiEntry } from '@/api/kanji'
import { FlipCard } from 'aburungo-design-system'
import type { FlipCardPhase } from 'aburungo-design-system'

export type DrillPhase = 'entering' | 'idle' | 'revealed' | 'exiting'

function toFlipPhase(p: DrillPhase): FlipCardPhase {
  return p === 'revealed' ? 'idle' : p
}

type Props = {
  kanji: KanjiEntry
  phase: DrillPhase
  onReveal: () => void
  onRate: (correct: boolean) => void
  onEntered: () => void
  onExited: () => void
}

function parseKun(raw: string): { reading: string; okurigana: string } {
  const [reading, okurigana = ''] = raw.split('.')
  return { reading, okurigana }
}

type KunReadingProps = { kanji: string; raw: string }

function KunReading({ kanji, raw }: KunReadingProps) {
  const { reading, okurigana } = parseKun(raw)
  return (
    <span>
      <ruby style={{ fontFamily: 'var(--font-jp)' }}>
        {kanji}
        <rt className="text-caption text-fg-subtle">{reading}</rt>
      </ruby>
      {okurigana && (
        <span style={{ fontFamily: 'var(--font-jp)' }}>{okurigana}</span>
      )}
    </span>
  )
}

export function KanjiDrillCard({ kanji, phase, onReveal, onRate, onEntered, onExited }: Props) {
  const isFlipped = phase === 'revealed' || phase === 'exiting'
  const primaryMeaning = kanji.meanings[0] ?? ''
  const otherMeanings = kanji.meanings.slice(1, 4)

  return (
    <FlipCard
      flipped={isFlipped}
      phase={toFlipPhase(phase)}
      onEntered={onEntered}
      onExited={onExited}
      front={
        <div className="w-full rounded-2xl border border-border bg-bg shadow-card">
          <div className="flex flex-col gap-5 p-6">
            {kanji.jlptLevel != null && (
              <span className="inline-flex w-fit items-center rounded-md bg-surface-2 px-2 py-0.5 text-caption font-medium uppercase tracking-wider text-fg-subtle">
                N{kanji.jlptLevel}
              </span>
            )}
            <div className="flex items-center justify-center py-8">
              <span
                className="text-[6rem] font-medium leading-none text-fg"
                style={{ fontFamily: 'var(--font-jp)' }}
              >
                {kanji.character}
              </span>
            </div>
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
          <div className="flex flex-1 flex-col gap-4 p-6">
            {kanji.jlptLevel != null && (
              <span className="inline-flex w-fit items-center rounded-md bg-surface-2 px-2 py-0.5 text-caption font-medium uppercase tracking-wider text-fg-subtle">
                N{kanji.jlptLevel}
              </span>
            )}
            <div className="flex flex-col items-center gap-1 py-2">
              <span
                className="text-[3.5rem] font-medium leading-none text-fg"
                style={{ fontFamily: 'var(--font-jp)' }}
              >
                {kanji.character}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <p className="mb-1 text-caption font-medium uppercase tracking-wider text-fg-subtle">
                  Meaning
                </p>
                <p className="text-body font-semibold text-fg">{primaryMeaning}</p>
                {otherMeanings.length > 0 && (
                  <p className="text-body-sm text-fg-subtle">{otherMeanings.join(', ')}</p>
                )}
              </div>
              {kanji.onReadings.length > 0 && (
                <div>
                  <p className="mb-1 text-caption font-medium uppercase tracking-wider text-fg-subtle">
                    On
                  </p>
                  <p className="text-body text-fg" style={{ fontFamily: 'var(--font-jp)' }}>
                    {kanji.onReadings.join('、')}
                  </p>
                </div>
              )}
              {kanji.kunReadings.length > 0 && (
                <div>
                  <p className="mb-1 text-caption font-medium uppercase tracking-wider text-fg-subtle">
                    Kun
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {kanji.kunReadings.slice(0, 6).map((r) => (
                      <KunReading key={r} kanji={kanji.character} raw={r} />
                    ))}
                  </div>
                </div>
              )}
              {kanji.strokeCount != null && (
                <p className="text-body-sm text-fg-subtle">{kanji.strokeCount} strokes</p>
              )}
            </div>
            <div className="mt-auto flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => onRate(false)}
                className="flex min-h-[52px] flex-1 items-center justify-center rounded-2xl border border-border bg-surface text-body font-medium text-fg-muted hover:bg-surface-2 active:bg-surface-2"
              >
                Didn't know
              </button>
              <button
                type="button"
                onClick={() => onRate(true)}
                className="flex min-h-[52px] flex-1 items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white hover:bg-brand-700 active:bg-brand-700"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      }
    />
  )
}
