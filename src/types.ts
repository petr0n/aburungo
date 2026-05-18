/**
 * Core domain types for AburunGo.
 *
 * Everything in here is data — no React, no IndexedDB, no UI concerns.
 * Anything that touches the user (rendering, persistence, scheduling) is
 * built on top of these types in their own module.
 */

/** Epoch milliseconds. Keeping it as a plain number for cheap comparisons. */
export type EpochMs = number

/**
 * Free-form for now. Once the scenario set stabilizes we can lock this to a
 * union literal, but premature narrowing makes adding content painful.
 */
export type Scenario = string

/**
 * A single phrase the learner is studying.
 *
 * Authored by hand in YAML under src/content/phrases/*.yaml and validated at
 * load time. Keep this shape stable — every part of the app depends on it.
 */
export type Phrase = {
  /** Stable slug, e.g. "transit.station-where". Used as the persistent key. */
  id: string
  /** Native form, may contain kanji. e.g. "駅はどこですか" */
  japanese: string
  /** Hiragana-only reading, used to render furigana via <ruby>. */
  reading: string
  /** Hepburn romaji, for users who haven't learned kana yet. */
  romaji: string
  /** Natural English translation, not a literal gloss. */
  english: string
  /** Optional pronunciation audio. Bundle path or absolute URL. */
  audioUrl?: string
  /** Real-world situation the phrase belongs to. */
  scenario: Scenario
  /** Authoring notes — usage, register, common mistakes. Not used by SRS. */
  notes?: string
}

/**
 * A grouping of phrases that share a scenario or theme.
 *
 * Declared now so the data model is complete; the spine review loop doesn't
 * use lessons directly — that comes later when there's a lesson picker.
 */
export type Lesson = {
  id: string
  title: string
  scenario: Scenario
  phraseIds: string[]
}

/** Leitner boxes 1–5. Box 1 = seen tomorrow, box 5 = seen in a month-ish. */
export type LeitnerBox = 1 | 2 | 3 | 4 | 5

/**
 * Per-phrase review state, persisted in IndexedDB.
 *
 * `box` and `dueAt` are the only fields the scheduler actually reads — keep
 * them that way so swapping Leitner for FSRS later is a localized change.
 */
export type ReviewState = {
  phraseId: string
  box: LeitnerBox
  dueAt: EpochMs
  lastSeenAt?: EpochMs
}

/**
 * What the learner said about a phrase they just saw.
 * Deliberately binary — no "easy / hard / good" middle ground. The first
 * version of the app pushes the learner to commit to one or the other.
 */
export type ReviewRating = 'got-it' | 'didnt'

/**
 * The scheduler interface. Leitner today, FSRS later — same shape.
 * Pure functions, no side effects, fully testable.
 */
export interface Scheduler {
  /**
   * Given the current state (or none, for a phrase never reviewed before),
   * the learner's rating, and the current time, return the next state.
   */
  schedule(
    current: ReviewState | undefined,
    rating: ReviewRating,
    now: EpochMs,
    phraseId: string,
  ): ReviewState

  /** Is this phrase due for review at the given moment? */
  isDue(state: ReviewState, now: EpochMs): boolean
}

export type ProgressStats = {
  streak: number
  reviewedToday: number
  totalReviewed: number
  masteryBreakdown: Record<LeitnerBox, number>
}
