import { fsrs, createEmptyCard, Rating, State } from 'ts-fsrs'
import type { Card, Grade } from 'ts-fsrs'
import { supabase } from '../lib/supabase.js'
import type { FsrsState, UserKanjiProgressRow } from '../db/types.js'

const scheduler = fsrs()

type KanjiRating = 'again' | 'good'

const RATING_MAP: Record<KanjiRating, Grade> = {
  again: Rating.Again,
  good: Rating.Good,
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

function progressRowToCard(row: UserKanjiProgressRow): Card {
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

export type KanjiResult = {
  id: string
  character: string
  meanings: string[]
  onReadings: string[]
  kunReadings: string[]
  strokeCount: number | null
  jlptLevel: number | null
  joyoGrade: number | null
  frequency: number | null
  kanjivgSvg: string | null
}

type KanjiRow = {
  id: string
  character: string
  meanings: string[]
  on_readings: string[] | null
  kun_readings: string[] | null
  stroke_count: number | null
  jlpt_level: number | null
  joyo_grade: number | null
  frequency: number | null
  kanjivg_svg: string | null
}

function toResult(row: KanjiRow): KanjiResult {
  return {
    id: row.id,
    character: row.character,
    meanings: row.meanings,
    onReadings: row.on_readings ?? [],
    kunReadings: row.kun_readings ?? [],
    strokeCount: row.stroke_count,
    jlptLevel: row.jlpt_level,
    joyoGrade: row.joyo_grade,
    frequency: row.frequency,
    kanjivgSvg: row.kanjivg_svg,
  }
}

type ListParams = {
  jlpt?: number
  grade?: number
  limit: number
  offset: number
}

export async function listKanji(params: ListParams): Promise<KanjiResult[]> {
  let query = supabase
    .from('kanji')
    .select('*')
    .order('frequency', { ascending: true, nullsFirst: false })
    .range(params.offset, params.offset + params.limit - 1)

  if (params.jlpt !== undefined) query = query.eq('jlpt_level', params.jlpt)
  if (params.grade !== undefined) query = query.eq('joyo_grade', params.grade)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []).map((row) => toResult(row as KanjiRow))
}

export async function getKanji(character: string): Promise<KanjiResult | null> {
  const { data, error } = await supabase
    .from('kanji')
    .select('*')
    .eq('character', character)
    .single()

  if (error) return null
  return toResult(data as KanjiRow)
}

// --- FSRS ---

export type DueKanji = {
  kanjiId: string
  state: FsrsState
  dueAt: string
  reps: number
}

export type KanjiReviewResult = {
  kanjiId: string
  state: FsrsState
  dueAt: string
  stability: number
  difficulty: number
  reps: number
  lapses: number
}

export async function getDueKanji(userId: string, limit: number): Promise<DueKanji[]> {
  const { data, error } = await supabase
    .from('user_kanji_progress')
    .select('kanji_id, state, due_at, reps')
    .eq('user_id', userId)
    .lte('due_at', new Date().toISOString())
    .order('due_at', { ascending: true })
    .limit(limit)

  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => ({
    kanjiId: row.kanji_id as string,
    state: row.state as FsrsState,
    dueAt: row.due_at as string,
    reps: row.reps as number,
  }))
}

export async function submitKanjiReview(
  userId: string,
  kanjiId: string,
  rating: KanjiRating,
  reviewedAt: number,
): Promise<KanjiReviewResult> {
  const now = new Date(reviewedAt)
  const fsrsRating = RATING_MAP[rating]

  const { data: existing } = await supabase
    .from('user_kanji_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('kanji_id', kanjiId)
    .single()

  const current = existing ? progressRowToCard(existing as UserKanjiProgressRow) : createEmptyCard(now)
  const result = scheduler.repeat(current, now)
  const next = result[fsrsRating].card
  const nextState = STATE_TO_DB[next.state]

  const { error: upsertError } = await supabase.from('user_kanji_progress').upsert(
    {
      user_id: userId,
      kanji_id: kanjiId,
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
    { onConflict: 'user_id,kanji_id' },
  )

  if (upsertError) throw new Error(upsertError.message)

  await supabase.from('review_logs').insert({
    user_id: userId,
    kanji_id: kanjiId,
    rating,
    stability_after: next.stability,
    scheduled_days: next.scheduled_days,
    reviewed_at: now.toISOString(),
  })

  return {
    kanjiId,
    state: nextState,
    dueAt: next.due.toISOString(),
    stability: next.stability,
    difficulty: next.difficulty,
    reps: next.reps,
    lapses: next.lapses,
  }
}
