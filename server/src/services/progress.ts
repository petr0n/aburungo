import { fsrs, createEmptyCard, Rating, State } from 'ts-fsrs'
import type { Card, Grade } from 'ts-fsrs'
import { supabase } from '../lib/supabase.js'
import type { FsrsState, ReviewRating, UserCardProgressRow } from '../db/types.js'

const scheduler = fsrs()

// --- Type mappings ---

const RATING_MAP: Record<ReviewRating, Grade> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
}

const STATE_TO_DB: Record<number, FsrsState> = {
  [State.New]: 'new',
  [State.Learning]: 'learning',
  [State.Review]: 'review',
  [State.Relearning]: 'relearning',
}

const STATE_FROM_DB: Record<FsrsState, number> = {
  new: State.New,
  learning: State.Learning,
  review: State.Review,
  relearning: State.Relearning,
}

function rowToCard(row: UserCardProgressRow): Card {
  return {
    due: new Date(row.due_at),
    stability: row.stability,
    difficulty: row.difficulty,
    elapsed_days: row.elapsed_days,
    scheduled_days: row.scheduled_days,
    reps: row.reps,
    lapses: row.lapses,
    state: STATE_FROM_DB[row.state],
    last_review: row.last_review_at ? new Date(row.last_review_at) : new Date(0),
  }
}

// --- Public API ---

export type DueCard = {
  cardId: string
  state: FsrsState
  dueAt: string
  reps: number
}

export type ReviewResult = {
  cardId: string
  state: FsrsState
  dueAt: string
  stability: number
  difficulty: number
  reps: number
  lapses: number
}

export type StatsResult = {
  streak: number
  reviewedToday: number
  totalReviewed: number
  masteryBreakdown: Record<FsrsState, number>
}

export async function getDueCards(userId: string, limit: number): Promise<DueCard[]> {
  const { data, error } = await supabase
    .from('user_card_progress')
    .select('card_id, state, due_at, reps')
    .eq('user_id', userId)
    .lte('due_at', new Date().toISOString())
    .order('due_at', { ascending: true })
    .limit(limit)

  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => ({
    cardId: row.card_id as string,
    state: row.state as FsrsState,
    dueAt: row.due_at as string,
    reps: row.reps as number,
  }))
}

export async function submitReview(
  userId: string,
  cardId: string,
  rating: ReviewRating,
  reviewedAt: number,
): Promise<ReviewResult> {
  const now = new Date(reviewedAt)
  const fsrsRating = RATING_MAP[rating]

  // Load existing progress or start fresh
  const { data: existing } = await supabase
    .from('user_card_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('card_id', cardId)
    .single()

  const currentCard = existing ? rowToCard(existing as UserCardProgressRow) : createEmptyCard(now)
  const result = scheduler.repeat(currentCard, now)
  const next = result[fsrsRating].card

  const nextState = STATE_TO_DB[next.state]

  // Upsert progress
  const { error: upsertError } = await supabase.from('user_card_progress').upsert(
    {
      user_id: userId,
      card_id: cardId,
      state: nextState,
      stability: next.stability,
      difficulty: next.difficulty,
      elapsed_days: next.elapsed_days,
      scheduled_days: next.scheduled_days,
      reps: next.reps,
      lapses: next.lapses,
      due_at: next.due.toISOString(),
      last_review_at: now.toISOString(),
    },
    { onConflict: 'user_id,card_id' },
  )

  if (upsertError) throw new Error(upsertError.message)

  // Append review log
  await supabase.from('review_logs').insert({
    user_id: userId,
    card_id: cardId,
    rating,
    stability_after: next.stability,
    scheduled_days: next.scheduled_days,
    reviewed_at: now.toISOString(),
  })

  return {
    cardId,
    state: nextState,
    dueAt: next.due.toISOString(),
    stability: next.stability,
    difficulty: next.difficulty,
    reps: next.reps,
    lapses: next.lapses,
  }
}

export async function getStats(userId: string): Promise<StatsResult> {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  // Total and today counts
  const [{ count: totalReviewed }, { count: reviewedToday }] = await Promise.all([
    supabase
      .from('review_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .then((r) => ({ count: r.count ?? 0 })),
    supabase
      .from('review_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('reviewed_at', todayStart.toISOString())
      .then((r) => ({ count: r.count ?? 0 })),
  ])

  // Mastery breakdown by FSRS state
  const { data: progressRows } = await supabase
    .from('user_card_progress')
    .select('state')
    .eq('user_id', userId)

  const masteryBreakdown: Record<FsrsState, number> = {
    new: 0,
    learning: 0,
    review: 0,
    relearning: 0,
  }
  for (const row of progressRows ?? []) {
    const s = row.state as FsrsState
    masteryBreakdown[s] = (masteryBreakdown[s] ?? 0) + 1
  }

  // Streak: consecutive days with at least one review, ending today
  const { data: reviewDays } = await supabase
    .from('review_logs')
    .select('reviewed_at')
    .eq('user_id', userId)
    .order('reviewed_at', { ascending: false })

  const uniqueDays = [
    ...new Set(
      (reviewDays ?? []).map((r) => new Date(r.reviewed_at as string).toDateString()),
    ),
  ]

  let streak = 0
  const today = new Date()
  for (let i = 0; i < uniqueDays.length; i++) {
    const expected = new Date(today)
    expected.setDate(expected.getDate() - i)
    if (uniqueDays[i] === expected.toDateString()) {
      streak++
    } else {
      break
    }
  }

  return {
    streak,
    reviewedToday: reviewedToday as number,
    totalReviewed: totalReviewed as number,
    masteryBreakdown,
  }
}
