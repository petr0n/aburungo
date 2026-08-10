/**
 * Scope and can-do bookkeeping for the two terminal checkpoints (DR-022).
 *
 * Unit 44 runs one unscripted exchange spanning two situations the learner has
 * already worked through; unit 45 verifies can-dos one situation at a time.
 * Both need the same two things — which situations are in play, and which words
 * Hana is allowed to use — so both live here.
 *
 * Pure, like everything else in src/srs/: no React, no DB, no fetch, and
 * randomness injected so tests are deterministic.
 */
import type { ConversationScope, Unit, Word } from "@/types";
import { buildSweepQueue } from "./sweep";

/**
 * Hard ceiling mirrored from the server (MAX_SCOPE_WORDS in
 * conversationPrompt.ts). Prompt size is API spend, and the server truncates
 * silently — better to sample deliberately here than to have the tail of the
 * list dropped for us.
 */
export const MAX_SCOPE_WORDS = 60;

/** Turn budgets. Unit 44 wants 5-7 exchanges; a can-do run gets slightly more. */
export const CONVERSATION_TURNS = 6;
export const CAN_DO_TURNS = 7;

/**
 * Prefix for the marker ids that record a verified can-do.
 *
 * These live in PathProgress.seenUnitIds alongside real unit ids. That list is
 * an append-only set of opaque strings with no foreign key behind it, and every
 * consumer only ever asks "is this id present?" — so a marker that matches no
 * unit is inert. Riding on it means verified can-dos sync to the server, union
 * correctly across devices, and survive an ITP cache wipe, with no migration.
 *
 * The alternative was a second table plus a migration, and `supabase db push`
 * needs a human. That would have left this feature unshippable.
 */
export const CAN_DO_PREFIX = "can-do:";

export function canDoMarkerId(situation: string): string {
  return `${CAN_DO_PREFIX}${situation}`;
}

/** The situations the learner has had verified, read back out of the marker ids. */
export function verifiedCanDos(seenUnitIds: readonly string[]): Set<string> {
  return new Set(
    seenUnitIds.filter((id) => id.startsWith(CAN_DO_PREFIX)).map((id) => id.slice(CAN_DO_PREFIX.length)),
  );
}

/**
 * Distinct situations the learner has actually been taught, in ladder order.
 *
 * Checkpoint units are excluded by their `checkpoint` field rather than by
 * matching their situation label, so renaming "Integration & checkpoint" can
 * never silently turn a checkpoint into something Hana tries to role-play.
 */
export function taughtSituations(units: readonly Unit[], seenUnitIds: readonly string[]): string[] {
  const seen = new Set(seenUnitIds);
  const out: string[] = [];
  for (const unit of units) {
    if (unit.checkpoint !== undefined) continue;
    if (!seen.has(unit.id)) continue;
    if (!out.includes(unit.situation)) out.push(unit.situation);
  }
  return out;
}

/** Every word taught under the given situations, deduplicated, in ladder order. */
export function wordsForSituations(
  units: readonly Unit[],
  situations: readonly string[],
  allWords: readonly Word[],
): Word[] {
  const wanted = new Set(situations);
  const byId = new Map(allWords.map((w) => [w.id, w]));
  const out: Word[] = [];
  const taken = new Set<string>();
  for (const unit of units) {
    if (!wanted.has(unit.situation)) continue;
    for (const id of unit.wordIds) {
      const word = byId.get(id);
      if (word === undefined || taken.has(id)) continue;
      taken.add(id);
      out.push(word);
    }
  }
  return out;
}

function toScope(situation: string, canDo: string, words: readonly Word[], maxTurns: number): ConversationScope {
  return {
    situation,
    canDo,
    // buildSweepQueue round-robins across themes, so capping at MAX_SCOPE_WORDS
    // keeps both situations represented instead of dropping whichever sorts last.
    words: buildSweepQueue(words, MAX_SCOPE_WORDS).map((w) => ({
      japanese: w.japanese,
      reading: w.reading,
      english: w.english,
    })),
    maxTurns,
  };
}

function defaultShuffle<T>(items: readonly T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

/**
 * Scope for unit 44 — two taught situations strung together.
 *
 * The pair is drawn at random rather than fixed. Which two matters far less
 * than that there are two: the point of the unit is that the learner has to
 * carry a thread across a scene change with no single-answer safety net.
 *
 * Returns null when fewer than two situations have been taught, which only
 * happens on a ladder too short to have reached this unit.
 */
export function buildCrossSituationScope(
  units: readonly Unit[],
  seenUnitIds: readonly string[],
  allWords: readonly Word[],
  shuffle: <T>(items: readonly T[]) => T[] = defaultShuffle,
): ConversationScope | null {
  const situations = taughtSituations(units, seenUnitIds);
  if (situations.length < 2) return null;

  const [first, second] = shuffle(situations);
  if (first === undefined || second === undefined) return null;

  const pair = [first, second];
  return toScope(
    `${first}, then ${second}`,
    `Move from ${first.toLowerCase()} to ${second.toLowerCase()} in one conversation without starting over`,
    wordsForSituations(units, pair, allWords),
    CONVERSATION_TURNS,
  );
}

/** Scope for one can-do run in unit 45 — a single situation, played through. */
export function buildCanDoScope(
  units: readonly Unit[],
  situation: string,
  allWords: readonly Word[],
): ConversationScope | null {
  const words = wordsForSituations(units, [situation], allWords);
  if (words.length === 0) return null;
  return toScope(situation, `Handle a whole ${situation.toLowerCase()} exchange unaided`, words, CAN_DO_TURNS);
}
