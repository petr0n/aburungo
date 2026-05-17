import { useEffect } from 'react'
import { useSession } from '@/store/session'
import { findPhrase } from '@/content'
import { FillBlankCard } from './FillBlankCard'

export function FillBlankScreen() {
  const status = useSession((s) => s.status)
  const queue = useSession((s) => s.queue)
  const currentIndex = useSession((s) => s.currentIndex)
  const initialize = useSession((s) => s.initialize)
  const rate = useSession((s) => s.rate)
  const reset = useSession((s) => s.reset)

  useEffect(() => {
    void initialize()
  }, [initialize])

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-zinc-400">Loading review queue…</p>
      </div>
    )
  }

  if (status === 'empty') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-xl font-semibold text-zinc-900">All caught up!</p>
        <p className="text-zinc-500">No phrases due for review right now.</p>
        <button
          type="button"
          onClick={() => {
            reset()
            void initialize()
          }}
          className="h-12 rounded-xl border border-zinc-300 px-6 text-base font-medium text-zinc-700 active:bg-zinc-100"
        >
          Start over
        </button>
      </div>
    )
  }

  const phraseId = queue[currentIndex]
  const phrase = phraseId !== undefined ? findPhrase(phraseId) : undefined

  if (phrase === undefined) return null

  return (
    <FillBlankCard
      key={phrase.id}
      phrase={phrase}
      onNext={(correct) => void rate(correct ? 'got-it' : 'didnt')}
    />
  )
}
