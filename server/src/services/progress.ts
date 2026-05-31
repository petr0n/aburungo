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

// --- Public types ---

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

export type KanaProgressEntry = {
  character: string
  script: 'hiragana' | 'katakana'
  recognizedCount: number
  recalledCount: number
  lastSeenAt: string | null
}

export type KanaScriptStats = { recognized: number; recalled: number }
export type PhraseLevelStats = { reviewed: number; mastered: number }
export type KanjiLevelStats = { reviewed: number; mastered: number }

export type StatsResult = {
  streak: number
  reviewedToday: number
  totalReviewed: number
  masteryBreakdown: Record<FsrsState, number>
  phrases: Record<number, PhraseLevelStats>
  kana: Record<'hiragana' | 'katakana', KanaScriptStats>
  kanji: Record<number, KanjiLevelStats>
}

// --- Card progress ---

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

// --- Kana progress ---

export async function upsertKanaProgress(
  userId: string,
  character: string,
  script: 'hiragana' | 'katakana',
  mode: 'recognized' | 'recalled',
  correct: boolean,
): Promise<KanaProgressEntry> {
  const now = new Date().toISOString()

  const { data: existing } = await supabase
    .from('user_kana_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('character', character)
    .single()

  const currentRecognized = (existing?.recognized_count as number | undefined) ?? 0
  const currentRecalled = (existing?.recalled_count as number | undefined) ?? 0

  const updates = {
    user_id: userId,
    character,
    script,
    recognized_count: mode === 'recognized' && correct ? currentRecognized + 1 : currentRecognized,
    recalled_count: mode === 'recalled' && correct ? currentRecalled + 1 : currentRecalled,
    last_seen_at: now,
  }

  const { data, error } = await supabase
    .from('user_kana_progress')
    .upsert(updates, { onConflict: 'user_id,character' })
    .select()
    .single()

  if (error) throw new Error(error.message)

  return {
    character: data.character as string,
    script: data.script as 'hiragana' | 'katakana',
    recognizedCount: data.recognized_count as number,
    recalledCount: data.recalled_count as number,
    lastSeenAt: data.last_seen_at as string | null,
  }
}

export async function fetchKanaProgress(userId: string): Promise<KanaProgressEntry[]> {
  const { data, error } = await supabase
    .from('user_kana_progress')
    .select('character, script, recognized_count, recalled_count, last_seen_at')
    .eq('user_id', userId)

  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => ({
    character: row.character as string,
    script: row.script as 'hiragana' | 'katakana',
    recognizedCount: row.recognized_count as number,
    recalledCount: row.recalled_count as number,
    lastSeenAt: row.last_seen_at as string | null,
  }))
}

export async function resetKanaProgress(
  userId: string,
  script: 'hiragana' | 'katakana' | 'all',
): Promise<void> {
  const query = supabase.from('user_kana_progress').delete().eq('user_id', userId)
  const { error } = script === 'all' ? await query : await query.eq('script', script)
  if (error) throw new Error(error.message)
}

// --- Stats ---

const MASTERY_THRESHOLD = 3

export async function getStats(userId: string): Promise<StatsResult> {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [
    { count: totalReviewed },
    { count: reviewedToday },
    { data: progressRows },
    { data: phraseRows },
    { data: kanjiRows },
    { data: kanaRows },
    { data: reviewDays },
  ] = await Promise.all([
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
    supabase
      .from('user_card_progress')
      .select('state')
      .eq('user_id', userId)
      .then((r) => ({ data: r.data })),
    supabase
      .from('user_card_progress')
      .select('state, reps, cards!inner(decks!inner(jlpt_level))')
      .eq('user_id', userId)
      .gt('reps', 0)
      .then((r) => ({ data: r.data })),
    supabase
      .from('user_kanji_progress')
      .select('state, reps, kanji!inner(jlpt_level)')
      .eq('user_id', userId)
      .gt('reps', 0)
      .then((r) => ({ data: r.data })),
    supabase
      .from('user_kana_progress')
      .select('script, recognized_count, recalled_count')
      .eq('user_id', userId)
      .then((r) => ({ data: r.data })),
    supabase
      .from('review_logs')
      .select('reviewed_at')
      .eq('user_id', userId)
      .order('reviewed_at', { ascending: false })
      .then((r) => ({ data: r.data })),
  ])

  // FSRS mastery breakdown
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

  // Phrase stats by JLPT level
  const phrases: Record<number, PhraseLevelStats> = {}
  for (const row of phraseRows ?? []) {
    const level = (row as unknown as { cards: { decks: { jlpt_level: number | null } } }).cards?.decks?.jlpt_level
    if (level == null) continue
    if (!phrases[level]) phrases[level] = { reviewed: 0, mastered: 0 }
    phrases[level].reviewed++
    if ((row.state as string) === 'review') phrases[level].mastered++
  }

  // Kanji stats by JLPT level
  const kanji: Record<number, KanjiLevelStats> = {}
  for (const row of kanjiRows ?? []) {
    const level = (row as unknown as { kanji: { jlpt_level: number | null } }).kanji?.jlpt_level
    if (level == null) continue
    if (!kanji[level]) kanji[level] = { reviewed: 0, mastered: 0 }
    kanji[level].reviewed++
    if ((row.state as string) === 'review') kanji[level].mastered++
  }

  // Kana stats by script
  const kana: Record<'hiragana' | 'katakana', KanaScriptStats> = {
    hiragana: { recognized: 0, recalled: 0 },
    katakana: { recognized: 0, recalled: 0 },
  }
  for (const row of kanaRows ?? []) {
    const script = row.script as 'hiragana' | 'katakana'
    if (row.recognized_count as number >= MASTERY_THRESHOLD) kana[script].recognized++
    if (row.recalled_count as number >= MASTERY_THRESHOLD) kana[script].recalled++
  }

  // Streak
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
    phrases,
    kana,
    kanji,
  }
}
