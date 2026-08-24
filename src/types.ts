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
 * A named run of lessons ending in a checkpoint.
 *
 * The unit of commitment a learner actually feels: a ladder of fifty lessons is
 * shapeless, four chapters is a plan. Chapters exist so a checkpoint arrives
 * somewhere meaningful — at the end of a body of related situations — rather
 * than every N lessons regardless of what N lands on (DR-021).
 *
 * A chapter owns no content. Membership lives on the Lesson, so adding a lesson
 * is one edit; the chapter file only names and orders them. Lessons in a chapter
 * must be contiguous in `order` and the last one must be the checkpoint, both
 * enforced in src/content/contentIntegrity.test.ts.
 *
 * Chapters group lessons; a *book* groups chapters. A book is a volume of a
 * coherent shape rather than a JLPT level (DR-033): the `jlpt` tags on content
 * stay as they are, useful and depended on by the coverage tooling, but they no
 * longer decide what a book holds. A learner reads "Book One", not "N5".
 */
export type Chapter = {
  id: string;
  /** Position within the book, 1-indexed. */
  order: number;
  /** Shown to the learner in the session header, e.g. "Shopping & getting around". */
  title: string;
};

/**
 * How hard a book asks the learner to work (DR-033).
 *
 * This is what a JLPT level used to carry. A book declares its stage and the
 * behaviours follow; `reading` and `fluency` are named so the design work in
 * docs/plans has somewhere to attach, and are specified when a book reaches
 * them.
 */
export type Stage = "foundation" | "building" | "reading" | "fluency";

/**
 * A book — a volume of the course (DR-033).
 *
 * Not a JLPT level: about ten chapters of about ten teaching lessons, ending
 * where an arc of situations ends rather than where a reference list runs out.
 * The `jlpt` tags on content stay as they are, because the coverage tooling
 * depends on them, but they no longer say what a book contains. The learner
 * reads "Book One", never "N5" (DR-024).
 */
export type Book = {
  /** Stable id, also the PathProgress pathId. Internal naming, e.g. "n5". */
  id: string;
  /** Position in the course, 1-indexed. */
  order: number;
  /** What the learner reads, e.g. "Book One". */
  title: string;
  chapters: readonly Chapter[];
  /** The book's full lesson ladder, sorted ascending by `order`. */
  lessons: readonly Lesson[];
  /**
   * The stage this book belongs to (DR-033). Two behaviours key off anything
   * past `foundation`:
   * - recall is the default review gate (type it, not flip-and-rate)
   * - romaji display is cut — no item in this book renders romaji, including
   *   earlier books' items reviewed here; romaji-to-kana *input* conversion stays
   *
   * The third behaviour Book Two's plan names, the production-first produce
   * beat, is not
   * wired here: frame-based composition needs frames and their model sentences
   * as authored content, and deriving them at runtime fabricates Japanese.
   */
  stage: Stage;
};

/**
 * A step on the guided N5 daily-loop ladder.
 *
 * Authored in YAML under src/content/lessons/*.yaml. A Lesson does not define new
 * content — it's an ordering layer over existing Word/Phrase ids, per the
 * "reuse, don't rebuild" rule in docs/plans/99-roadmap.md.
 */
export type Lesson = {
  id: string;
  /** Position in the ladder, 1-indexed. Determines introduction order. */
  order: number;
  /**
   * The Chapter this lesson belongs to.
   *
   * Optional, and only a checkpoint may leave it out: the checkpoints that close
   * the *book* (production, and the Hana-gated pair) answer to no chapter, since
   * they review the whole level rather than one body of situations.
   */
  chapterId?: string;
  /** Grouping wrapper shown to the learner, e.g. "Greetings & basics". */
  situation: string;
  title: string;
  /** The can-do milestone this lesson builds toward, shown on the close screen. */
  canDo: string;
  wordIds: string[];
  phraseIds: string[];
  /**
   * Kanji characters introduced by this lesson. Informational only for now —
   * not yet scheduled through SRS (see docs/plans/01-overarching-plan.md §5).
   */
  kanji: string[];
  /** Short training-sourced explanation of the lesson's grammar pattern. */
  grammarNote: string;
  /** The GrammarPattern id this lesson introduces, if any — not every lesson has one. */
  patternId?: string;
  /**
   * Marks a lesson as a checkpoint rather than new material, and says which kind.
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
   * entirely when it is off — see src/content/lessons/index.ts.
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
 * A learner's position on a Lesson ladder, persisted per path (e.g. "n5").
 * IndexedDB-only for now — guests and signed-in users behave the same until
 * server sync for signed-in users is built (tracked in docs/todo.md).
 */
export type PathProgress = {
  pathId: string;
  /** Lesson ids the learner has completed the "new lesson" step for, in order. */
  seenLessonIds: string[];
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
