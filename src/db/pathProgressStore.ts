/**
 * Persistence boundary for PathProgress — mirrors reviewStore.ts. The rest
 * of the app never touches Dexie directly for path progress.
 *
 * DR-016: for signed-in users the server is the source of truth. IndexedDB is
 * a cache — Safari's ITP clears it after 7 days without site interaction, so
 * ladder position cannot live there alone. Guests remain local-only, which is
 * inherent to being a guest.
 *
 * Every call names its Owner (DR-036), and reads and writes only that owner's
 * cache: guest lessons are not merged into an account on sign-in -- that is
 * the explicit choice in adoption.ts.
 */
import type { Owner, PathProgress } from "@/types";
import { GUEST_OWNER } from "@/types";
import { dbFor } from "./dexie";
import { fetchPathProgress, markLessonSeenRemote } from "@/api/progress";

/**
 * Read the cached record, tolerating the pre-rename field name.
 *
 * Rows written before lessons were called lessons hold `seenUnitIds`. Reading
 * only the new name off one of those yields undefined, which reads as "no
 * progress" and silently sends the learner back to lesson 1 — a data loss the
 * typechecker cannot see, because the stored value never passed through TypeScript.
 *
 * The next write normalises the row, so this shim only matters until each
 * device has completed one lesson. Cheap enough to leave in place.
 */
async function readLocal(owner: Owner, pathId: string): Promise<PathProgress> {
  const existing = await dbFor(owner).pathProgress.get(pathId);
  if (existing === undefined) return { pathId, seenLessonIds: [] };
  return { pathId, seenLessonIds: seenLessonIdsOf(existing) };
}

/** A stored row's lessons, under either field name. Shared with adoption.ts, which copies raw rows. */
export function seenLessonIdsOf(row: PathProgress): string[] {
  const legacy = (row as Partial<PathProgress> & { seenUnitIds?: string[] }).seenUnitIds;
  return row.seenLessonIds ?? legacy ?? [];
}

/**
 * Fetch progress for a path, or a fresh empty record if none exists yet.
 *
 * When signed in, local and server sets are unioned: seeing a lesson is monotonic,
 * so a union is always correct and it covers both a second device with an empty
 * cache and this account's writes that failed to reach the server on a previous
 * session (they get pushed here).
 */
export async function getPathProgress(owner: Owner, pathId: string): Promise<PathProgress> {
  const local = await readLocal(owner, pathId);
  if (owner === GUEST_OWNER) return local;

  try {
    const remote = await fetchPathProgress(owner, pathId);
    const merged = [...new Set([...remote.seenLessonIds, ...local.seenLessonIds])];

    // Push anything the server is missing (a failed earlier write).
    const missingOnServer = local.seenLessonIds.filter((id) => !remote.seenLessonIds.includes(id));
    for (const lessonId of missingOnServer) {
      await markLessonSeenRemote(owner, pathId, lessonId);
    }

    const next: PathProgress = { pathId, seenLessonIds: merged };
    await dbFor(owner).pathProgress.put(next);
    return next;
  } catch {
    // Offline or server down: the cache is still usable, just not authoritative.
    return local;
  }
}

export async function markLessonSeen(owner: Owner, pathId: string, lessonId: string): Promise<PathProgress> {
  const current = await readLocal(owner, pathId);
  if (current.seenLessonIds.includes(lessonId)) return current;

  const next: PathProgress = { pathId, seenLessonIds: [...current.seenLessonIds, lessonId] };
  await dbFor(owner).pathProgress.put(next);

  if (owner !== GUEST_OWNER) {
    // A failed write is recovered by the union in getPathProgress on next load,
    // so this must not break the session the learner is in the middle of.
    try {
      await markLessonSeenRemote(owner, pathId, lessonId);
    } catch {
      /* retried on next load */
    }
  }

  return next;
}
