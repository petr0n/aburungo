/**
 * Persistence boundary for review state.
 *
 * Everything that reads or writes ReviewState in IndexedDB goes through here.
 * The rest of the app (SRS, components, session store) never touches Dexie
 * directly — that keeps the data layer swappable and the SRS pure.
 */
import type { EpochMs, ReviewState } from "@/types";
import { db } from "./dexie";

/** Fetch every stored ReviewState. Use sparingly — fine at session start. */
export function getAll(): Promise<ReviewState[]> {
  return db.reviewStates.toArray();
}

/** Fetch one phrase's state, or undefined if it's never been reviewed. */
export function getOne(phraseId: string): Promise<ReviewState | undefined> {
  return db.reviewStates.get(phraseId);
}

/**
 * Phrases whose dueAt is at or before `now`.
 *
 * Returns them in dueAt-ascending order so the oldest-overdue phrase is
 * reviewed first. Phrases never reviewed have no row here and are surfaced
 * separately (see session store / pickReviewQueue).
 */
export function getDue(now: EpochMs): Promise<ReviewState[]> {
  return db.reviewStates.where("dueAt").belowOrEqual(now).sortBy("dueAt");
}

/** Insert or replace a phrase's review state. Keyed by phraseId. */
export async function upsert(state: ReviewState): Promise<void> {
  await db.reviewStates.put(state);
}

/** Wipe everything. Only meant for dev/debug — no UI hook yet. */
export async function reset(): Promise<void> {
  await db.reviewStates.clear();
}
