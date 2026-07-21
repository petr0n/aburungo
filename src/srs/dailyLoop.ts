/**
 * Daily-loop orchestrator — assembles one guided N5 session from Unit
 * content + FSRS/Leitner due state. Pure: no React, no DB, no fetch. `now`
 * is always a parameter, per the src/srs/ layer boundary in CLAUDE.md.
 *
 * Review-due detection reuses the existing per-item ReviewState (see
 * src/srs/leitner.ts) rather than introducing a second scheduling concept —
 * a Unit is purely an ordering/grouping layer over already-scheduled items.
 */
import type { EpochMs, PathProgress, Phrase, ReviewState, Unit, Word } from "@/types";
import { isDue } from "./leitner";

export type DailySession = {
  /** The next not-yet-introduced unit, or null once every unit has been seen. */
  unit: Unit | null;
  /** Due items from units already introduced, oldest-due first. */
  reviewItems: Array<Phrase | Word>;
  /** This session's new-unit words, in unit order. Empty once `unit` is null. */
  newWords: Word[];
  /** This session's new-unit phrases, in unit order. Empty once `unit` is null. */
  newPhrases: Phrase[];
};

/**
 * Build today's session from ordered unit content, the learner's path
 * progress, the full word/phrase content pools, and per-item review state.
 *
 * `units` must be sorted ascending by `order` — parseUnits() guarantees this
 * for content loaded through content/units/index.ts.
 */
export function buildDailySession(
  units: readonly Unit[],
  progress: PathProgress,
  allWords: readonly Word[],
  allPhrases: readonly Phrase[],
  reviewStates: readonly ReviewState[],
  now: EpochMs,
): DailySession {
  const seenUnitIds = new Set(progress.seenUnitIds);
  const nextUnit = units.find((u) => !seenUnitIds.has(u.id)) ?? null;

  const seenItemIds = new Set<string>();
  for (const unit of units) {
    if (!seenUnitIds.has(unit.id)) continue;
    for (const id of unit.wordIds) seenItemIds.add(id);
    for (const id of unit.phraseIds) seenItemIds.add(id);
  }

  const wordById = new Map(allWords.map((w) => [w.id, w]));
  const phraseById = new Map(allPhrases.map((p) => [p.id, p]));

  const reviewItems = reviewStates
    .filter((s) => isDue(s, now) && seenItemIds.has(s.phraseId))
    .sort((a, b) => a.dueAt - b.dueAt)
    .map((s) => wordById.get(s.phraseId) ?? phraseById.get(s.phraseId))
    .filter((item): item is Phrase | Word => item !== undefined);

  const newWords = nextUnit === null ? [] : nextUnit.wordIds.map((id) => wordById.get(id)).filter((w): w is Word => w !== undefined);
  const newPhrases =
    nextUnit === null ? [] : nextUnit.phraseIds.map((id) => phraseById.get(id)).filter((p): p is Phrase => p !== undefined);

  return { unit: nextUnit, reviewItems, newWords, newPhrases };
}
