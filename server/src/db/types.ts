/** DB row types — match the schema in supabase/migrations exactly. */

export type FsrsState = 'new' | 'learning' | 'review' | 'relearning'
export type ReviewRating = 'again' | 'hard' | 'good' | 'easy'

export type DeckRow = {
  id: string
  slug: string
  title_en: string
  title_ja: string
  description: string | null
  display_order: number
  created_at: string
}

export type CardRow = {
  id: string
  deck_id: string
  japanese: string
  reading: string
  romaji: string
  english: string
  notes: string | null
  audio_url: string | null
  jmdict_id: number | null
  display_order: number
  created_at: string
}

export type UserCardProgressRow = {
  id: string
  user_id: string
  card_id: string
  state: FsrsState
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  reps: number
  lapses: number
  due_at: string
  last_review_at: string | null
}

export type FeedbackRow = {
  id: string
  user_id: string | null
  type: 'bug' | 'suggestion' | 'other'
  message: string
  status: 'open' | 'reviewed' | 'resolved'
  screenshot_url: string | null
  created_at: string
}

export type UserKanjiProgressRow = {
  id: string
  user_id: string
  kanji_id: string
  state: FsrsState
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  reps: number
  lapses: number
  due_at: string
  last_review_at: string | null
}
