/**
 * Session store — ephemeral, in-memory state for the current review session.
 *
 * Cards and progress come from the server. The queue is ordered:
 *   1. Due cards first, oldest-due first.
 *   2. New cards (never reviewed) in server display order.
 */
import { create } from 'zustand'
import type { Card, ReviewRating } from '@/types'
import { fetchVocabulary } from '@/api/vocabulary'
import { fetchDue, submitReview } from '@/api/progress'

type Status = 'idle' | 'loading' | 'ready' | 'empty' | 'error'

type SessionState = {
  status: Status
  error: string | null
  queue: Card[]
  currentIndex: number

  initialize: () => Promise<void>
  rate: (rating: ReviewRating) => Promise<void>
  reset: () => void
}

async function fetchAllCards(): Promise<Card[]> {
  const pages = await Promise.all([
    fetchVocabulary({ limit: 100, offset: 0 }),
    fetchVocabulary({ limit: 100, offset: 100 }),
    fetchVocabulary({ limit: 100, offset: 200 }),
  ])
  return pages.flat()
}

export const useSession = create<SessionState>((set, get) => ({
  status: 'idle',
  error: null,
  queue: [],
  currentIndex: 0,

  async initialize() {
    set({ status: 'loading', error: null })

    try {
      const [allCards, dueProgress] = await Promise.all([
        fetchAllCards(),
        fetchDue(100),
      ])

      const cardMap = new Map(allCards.map((c) => [c.id, c]))
      const dueIds = new Set(dueProgress.map((d) => d.cardId))

      const dueCards = dueProgress
        .slice()
        .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
        .map((d) => cardMap.get(d.cardId))
        .filter((c): c is Card => c !== undefined)

      const newCards = allCards.filter((c) => !dueIds.has(c.id))
      const queue = [...dueCards, ...newCards]

      set({ queue, currentIndex: 0, status: queue.length === 0 ? 'empty' : 'ready' })
    } catch (err) {
      set({ status: 'error', error: err instanceof Error ? err.message : 'Failed to load' })
    }
  },

  async rate(rating) {
    const { queue, currentIndex } = get()
    const card = queue[currentIndex]
    if (!card) return

    try {
      await submitReview(card.id, rating, Date.now())
    } catch {
      // Best-effort — advance the queue even if the server call fails
    }

    const nextIndex = currentIndex + 1
    set({
      currentIndex: nextIndex,
      status: nextIndex >= queue.length ? 'empty' : 'ready',
    })
  },

  reset() {
    set({ status: 'idle', error: null, queue: [], currentIndex: 0 })
  },
}))
