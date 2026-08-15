/**
 * Daily-loop orchestrator — assembles one guided N5 session from Lesson
 * content + FSRS/Leitner due state. Pure: no React, no DB, no fetch. `now`
 * is always a parameter, per the src/srs/ layer boundary in CLAUDE.md.
 *
 * Review-due detection reuses the existing per-item ReviewState (see
 * src/srs/leitner.ts) rather than introducing a second scheduling concept —
 * a Lesson is purely an ordering/grouping layer over already-scheduled items.
 * GrammarPattern ids slot into the same ReviewState/isDue mechanism as
 * words and phrases, so reviewItems interleaves all three by due date (see
 * docs/superpowers/specs/2026-07-21-grammar-in-context-design.md).
 */
import type { EpochMs, GrammarPattern, PathProgress, Phrase, ReviewState, Lesson, Word } from "@/types";
import { isDue } from "./leitner";

export type DailySession = {
  /** The next not-yet-introduced lesson, or null once every lesson has been seen. */
  lesson: Lesson | null;
  /** Due items (words, phrases, and grammar patterns) from seen lessons, oldest-due first. */
  reviewItems: Array<Phrase | Word | GrammarPattern>;
  /** This session's new-lesson words, in lesson order. Empty once `lesson` is null. */
  newWords: Word[];
  /** This session's new-lesson phrases, in lesson order. Empty once `lesson` is null. */
  newPhrases: Phrase[];
  /** The pattern the next lesson introduces, or null. */
  newGrammarPattern: GrammarPattern | null;
};

/**
 * Build today's session from ordered lesson content, the learner's path
 * progress, the full word/phrase/pattern content pools, and per-item review
 * state.
 *
 * `lessons` must be sorted ascending by `order` — parseLessons() guarantees this
 * for content loaded through content/lessons/index.ts.
 */
export function buildDailySession(
  lessons: readonly Lesson[],
  progress: PathProgress,
  allWords: readonly Word[],
  allPhrases: readonly Phrase[],
  allPatterns: readonly GrammarPattern[],
  reviewStates: readonly ReviewState[],
  now: EpochMs,
): DailySession {
  const seenLessonIds = new Set(progress.seenLessonIds);
  const nextUnit = lessons.find((u) => !seenLessonIds.has(u.id)) ?? null;

  const seenItemIds = new Set<string>();
  for (const lesson of lessons) {
    if (!seenLessonIds.has(lesson.id)) continue;
    for (const id of lesson.wordIds) seenItemIds.add(id);
    for (const id of lesson.phraseIds) seenItemIds.add(id);
    if (lesson.patternId !== undefined) seenItemIds.add(lesson.patternId);
  }

  const wordById = new Map(allWords.map((w) => [w.id, w]));
  const phraseById = new Map(allPhrases.map((p) => [p.id, p]));
  const patternById = new Map(allPatterns.map((p) => [p.id, p]));

  // reviewStates has one row per phraseId when it comes from IndexedDB (Dexie's
  // primary key enforces it), but this is a pure function — a future caller
  // that merges local + server due state (like src/store/session.ts already
  // does) could pass duplicates. Dedupe defensively, keeping the earliest due.
  const seenReviewIds = new Set<string>();
  const reviewItems = reviewStates
    .filter((s) => isDue(s, now) && seenItemIds.has(s.phraseId))
    .sort((a, b) => a.dueAt - b.dueAt)
    .filter((s) => {
      if (seenReviewIds.has(s.phraseId)) return false;
      seenReviewIds.add(s.phraseId);
      return true;
    })
    .map((s) => wordById.get(s.phraseId) ?? phraseById.get(s.phraseId) ?? patternById.get(s.phraseId))
    .filter((item): item is Phrase | Word | GrammarPattern => item !== undefined);

  const newWords = nextUnit === null ? [] : nextUnit.wordIds.map((id) => wordById.get(id)).filter((w): w is Word => w !== undefined);
  const newPhrases =
    nextUnit === null ? [] : nextUnit.phraseIds.map((id) => phraseById.get(id)).filter((p): p is Phrase => p !== undefined);
  const newGrammarPattern = nextUnit?.patternId !== undefined ? (patternById.get(nextUnit.patternId) ?? null) : null;

  return { lesson: nextUnit, reviewItems, newWords, newPhrases, newGrammarPattern };
}
