/**
 * Session store — ephemeral, in-memory state for the current review session.
 *
 * Persistent review state (which box, when due) lives in IndexedDB via
 * reviewStore. This store only holds what's needed to render the current
 * queue: the ordered list of phrase ids, the current index, and a status.
 *
 * On initialize() we build a queue of (due + never-reviewed) phrases. After
 * each rating, we persist the new ReviewState and advance the index.
 */
import { create } from 'zustand'
import type { EpochMs, Phrase, ReviewRating, ReviewState } from '@/types'
import { allPhrases } from '@/content'
import { isDue, schedule } from '@/srs/leitner'
import { getAll, upsert } from '@/db/reviewStore'

type Status = 'idle' | 'loading' | 'ready' | 'empty'

type SessionState = {
  status: Status
  queue: string[]
  currentIndex: number

  initialize: () => Promise<void>
  rate: (rating: ReviewRating) => Promise<void>
  reset: () => void
}

/**
 * Build the ordered review queue:
 *   1. Due phrases first, oldest-due first (the things the learner already
 *      committed to reviewing).
 *   2. Then never-reviewed phrases in authoring order (gentle onramp).
 *
 * Exported separately so tests can call it without going through Zustand.
 */
export function pickReviewQueue(
  phrases: Phrase[],
  states: ReviewState[],
  now: EpochMs,
): string[] {
  const stateById = new Map(states.map((s) => [s.phraseId, s]))

  const due: ReviewState[] = []
  const fresh: string[] = []
  for (const p of phrases) {
    const s = stateById.get(p.id)
    if (s === undefined) {
      fresh.push(p.id)
    } else if (isDue(s, now)) {
      due.push(s)
    }
  }
  due.sort((a, b) => a.dueAt - b.dueAt)
  return [...due.map((s) => s.phraseId), ...fresh]
}

export const useSession = create<SessionState>((set, get) => ({
  status: 'idle',
  queue: [],
  currentIndex: 0,

  async initialize() {
    set({ status: 'loading' })
    const states = await getAll()
    const queue = pickReviewQueue(allPhrases, states, Date.now())
    set({
      queue,
      currentIndex: 0,
      status: queue.length === 0 ? 'empty' : 'ready',
    })
  },

  async rate(rating) {
    const { queue, currentIndex } = get()
    const phraseId = queue[currentIndex]
    if (phraseId === undefined) return

    const now = Date.now()
    const states = await getAll()
    const current = states.find((s) => s.phraseId === phraseId)
    const next = schedule(current, rating, now, phraseId)
    await upsert(next)

    const nextIndex = currentIndex + 1
    set({
      currentIndex: nextIndex,
      status: nextIndex >= queue.length ? 'empty' : 'ready',
    })
  },

  reset() {
    set({ status: 'idle', queue: [], currentIndex: 0 })
  },
}))
