import type { ReviewState, ReviewRating, ProgressStats } from '@/types'
import { apiFetch } from './client'

type DueResponse = { data: ReviewState[] }
type ReviewResponse = { data: ReviewState }
type StatsResponse = { data: ProgressStats }

type FsrsRating = 'again' | 'hard' | 'good' | 'easy'

function toFsrsRating(rating: ReviewRating): FsrsRating {
  return rating === 'got-it' ? 'good' : 'again'
}

export async function fetchDue(limit?: number): Promise<ReviewState[]> {
  const qs = limit !== undefined ? `?limit=${limit}` : ''
  const res = await apiFetch<DueResponse>(`/api/progress/due${qs}`)
  return res.data
}

export async function submitReview(
  cardId: string,
  rating: ReviewRating,
  reviewedAt: number,
): Promise<ReviewState> {
  const res = await apiFetch<ReviewResponse>('/api/progress/review', {
    method: 'POST',
    body: JSON.stringify({ cardId, rating: toFsrsRating(rating), reviewedAt }),
  })
  return res.data
}

export async function fetchStats(): Promise<ProgressStats> {
  const res = await apiFetch<StatsResponse>('/api/progress/stats')
  return res.data
}
