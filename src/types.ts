/**
 * Core domain types for AburunGo.
 *
 * Everything in here is data — no React, no IndexedDB, no UI concerns.
 * Anything that touches the user (rendering, persistence, scheduling) is
 * built on top of these types in their own module.
 */

/** Epoch milliseconds. Keeping it as a plain number for cheap comparisons. */
export type EpochMs = number;

/**
 * Free-form for now. Once the scenario set stabilizes we can lock this to a
 * union literal, but premature narrowing makes adding content painful.
 */
export type Scenario = string;

/** JLPT proficiency levels, N5 = beginner, N1 = advanced. */
export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

/**
 * Access tier for a user session.
 *
 * guest      — unauthenticated; N5 content only
 * free       — signed-in free account; N5 + N4
 * paid       — subscriber; all content + Conversation
 */
export type UserTier = "guest" | "free" | "paid";

/**
 * A single phrase the learner is studying.
 *
 * Authored by hand in YAML under src/content/phrases/*.yaml and validated at
 * load time. Keep this shape stable — every part of the app depends on it.
 */
export type Phrase = {
  /** Stable slug, e.g. "transit.station-where". Used as the persistent key. */
  id: string;
  /** Native form, may contain kanji. e.g. "駅はどこですか" */
  japanese: string;
  /** Hiragana-only reading, used to render furigana via <ruby>. */
  reading: string;
  /** Hepburn romaji, for users who haven't learned kana yet. */
  romaji: string;
  /** Natural English translation, not a literal gloss. */
  english: string;
  /** Optional pronunciation audio. Bundle path or absolute URL. */
  audioUrl?: string;
  /** Real-world situation the phrase belongs to. */
  scenario: Scenario;
  /** Authoring notes — usage, register, common mistakes. Not used by SRS. */
  notes?: string;
  /**
   * JLPT difficulty level. Drives access tier gating:
   *   N5 — guest (no account)
   *   N4 — free account
   *   N3/N2/N1 — paid
   * Omit only for content that predates JLPT tagging; treat as N5 until resolved.
   */
  jlpt?: JlptLevel;
};

export type WordType = "noun" | "verb" | "i-adj" | "na-adj" | "adverb" | "counter" | "interjection";
export type VerbClass = "ru" | "u" | "irregular";

/**
 * A single vocabulary word the learner is studying.
 *
 * Authored in YAML under src/content/vocabulary/*.yaml. Distinct from Phrase:
 * a Word is a recombineable lexical item; a Phrase is a fixed situational expression.
 *
 * verbClass is stored but never surfaced to the learner directly — it is used
 * to auto-generate the polite form for display (食べる → 食べます).
 */
/**
 * A verified example sentence. `tatoebaId` is required so provenance is carried
 * by the data rather than by a comment — content rules forbid composed Japanese,
 * and an example without a source id cannot be checked.
 */
export type WordExample = {
  japanese: string;
  english: string;
  tatoebaId: string;
};

export type Word = {
  id: string;
  japanese: string;
  reading: string;
  romaji: string;
  english: string;
  audioUrl?: string;
  notes?: string;
  jlpt?: JlptLevel;
  wordType: WordType;
  verbClass?: VerbClass;
  theme?: string;
  example?: WordExample;
};

/** Type guard — distinguishes vocabulary words from situational phrases. */
export function isWord(card: Phrase | Word): card is Word {
  return "wordType" in card;
}

/**
 * A grouping of phrases that share a scenario or theme.
 *
 * Declared now so the data model is complete; the spine review loop doesn't
 * use lessons directly — that comes later when there's a lesson picker.
 */
export type Lesson = {
  id: string;
  title: string;
  scenario: Scenario;
  phraseIds: string[];
};

/**
 * A grammar pattern taught and reviewed as its own SRS item, distinct from
 * Word/Phrase. The example is an existing Phrase, referenced not duplicated;
 * `blank` is the substring of that phrase's `reading` blanked out for the
 * cloze review card (see
 * docs/superpowers/specs/2026-07-21-grammar-in-context-design.md).
 */
export type GrammarPattern = {
  id: string;
  jlpt: JlptLevel;
  /** Display form of the pattern, e.g. "～は～です". */
  pattern: string;
  /** Short English explanation. */
  gloss: string;
  /** An existing Phrase id that demonstrates the pattern. Reused, never duplicated. */
  phraseId: string;
  /** Substring of that phrase's `reading` to blank out. Must appear exactly once. */
  blank: string;
};

/** Type guard — distinguishes GrammarPattern from Phrase/Word in a mixed review queue. */
export function isGrammarPattern(item: Phrase | Word | GrammarPattern): item is GrammarPattern {
  return "blank" in item;
}

/**
 * A step on the guided N5 daily-loop ladder.
 *
 * Authored in YAML under src/content/units/*.yaml. A Unit does not define new
 * content — it's an ordering layer over existing Word/Phrase ids, per the
 * "reuse, don't rebuild" rule in docs/plans/99-roadmap.md.
 */
export type Unit = {
  id: string;
  /** Position in the ladder, 1-indexed. Determines introduction order. */
  order: number;
  /** Grouping wrapper shown to the learner, e.g. "Greetings & basics". */
  situation: string;
  title: string;
  /** The can-do milestone this unit builds toward, shown on the close screen. */
  canDo: string;
  wordIds: string[];
  phraseIds: string[];
  /**
   * Kanji characters introduced by this unit. Informational only for now —
   * not yet scheduled through SRS (see docs/plans/01-overarching-plan.md §5).
   */
  kanji: string[];
  /** Short training-sourced explanation of the unit's grammar pattern. */
  grammarNote: string;
  /** The GrammarPattern id this unit introduces, if any — not every unit has one. */
  patternId?: string;
  /**
   * Marks a unit as a checkpoint rather than new material, and says which kind.
   *
   * "recognition" is the recurring mastery gate from DR-020/021: a wide recognition
   * pass over everything already learned, complete when the remaining set
   * empties. Unlimited retry, nothing recorded, misses rejoin the SRS queue —
   * a gate, not a grade.
   *
   * "production" is the gate that closes the level (DR-023): the same shape as
   * a recognition checkpoint, but the learner writes each item from its English rather than
   * picking it out of a line-up. Recognition and production are different
   * skills, so it is its own checkpoint rather than a harder recognition round.
   *
   * "conversation" and "can-do" hand the learner to Hana instead of a card UI
   * (DR-022). Both are gated behind `hanaEnabled` and drop out of the ladder
   * entirely when it is off — see src/content/units/index.ts.
   */
  checkpoint?: "recognition" | "production" | "conversation" | "can-do";
};

/**
 * A conversation constrained to one situation and one set of taught words.
 *
 * Mirrored on the server in server/src/services/conversationPrompt.ts, which
 * turns it into a system prompt, and re-validated there — this shape crosses a
 * trust boundary, so the client copy is a convenience, never the enforcement.
 */
export type ConversationScope = {
  situation: string;
  canDo: string;
  words: Array<{ japanese: string; reading: string; english: string }>;
  maxTurns: number;
};

/**
 * A learner's position on a Unit ladder, persisted per path (e.g. "n5").
 * IndexedDB-only for now — guests and signed-in users behave the same until
 * server sync for signed-in users is built (tracked in docs/todo.md).
 */
export type PathProgress = {
  pathId: string;
  /** Unit ids the learner has completed the "new unit" step for, in order. */
  seenUnitIds: string[];
};

/** Leitner boxes 1–5. Box 1 = seen tomorrow, box 5 = seen in a month-ish. */
export type LeitnerBox = 1 | 2 | 3 | 4 | 5;

/**
 * Per-phrase review state, persisted in IndexedDB.
 *
 * `box` and `dueAt` are the only fields the scheduler actually reads — keep
 * them that way so swapping Leitner for FSRS later is a localized change.
 */
export type ReviewState = {
  phraseId: string;
  box: LeitnerBox;
  dueAt: EpochMs;
  lastSeenAt?: EpochMs;
};

/**
 * What the learner said about a phrase they just saw.
 * Deliberately binary — no "easy / hard / good" middle ground. The first
 * version of the app pushes the learner to commit to one or the other.
 */
export type ReviewRating = "got-it" | "didnt";

/**
 * The scheduler interface. Leitner today, FSRS later — same shape.
 * Pure functions, no side effects, fully testable.
 */
export interface Scheduler {
  /**
   * Given the current state (or none, for a phrase never reviewed before),
   * the learner's rating, and the current time, return the next state.
   */
  schedule(current: ReviewState | undefined, rating: ReviewRating, now: EpochMs, phraseId: string): ReviewState;

  /** Is this phrase due for review at the given moment? */
  isDue(state: ReviewState, now: EpochMs): boolean;
}

/**
 * A card as returned by the server. Mirrors the DB `cards` table shape.
 * Use this for all server-backed data flow; `Phrase` is the legacy local type.
 */
export type Card = {
  id: string;
  japanese: string;
  reading: string;
  romaji: string;
  english: string;
  notes: string | null;
  audioUrl: string | null;
  deck: string;
};

/** FSRS card states as returned by the server. */
export type FsrsState = "new" | "learning" | "review" | "relearning";

export type KanaScript = "hiragana" | "katakana";

export type KanaProgressEntry = {
  character: string;
  script: KanaScript;
  recognizedCount: number;
  recalledCount: number;
  lastSeenAt: string | null;
};

export type KanaScriptStats = {
  recognized: number;
  recalled: number;
};

export type PhraseLevelStats = {
  reviewed: number;
  mastered: number;
  total: number;
};

export type KanjiLevelStats = {
  reviewed: number;
  mastered: number;
  total: number;
};

export type ProgressStats = {
  streak: number;
  reviewedToday: number;
  totalReviewed: number;
  masteryBreakdown: Record<FsrsState, number>;
  phrases: Record<number, PhraseLevelStats>;
  kana: Record<KanaScript, KanaScriptStats>;
  kanji: Record<number, KanjiLevelStats>;
};
