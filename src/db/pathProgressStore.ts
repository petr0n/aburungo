/**
 * Persistence boundary for PathProgress — mirrors reviewStore.ts. The rest
 * of the app never touches Dexie directly for path progress.
 *
 * DR-016: for signed-in users the server is the source of truth. IndexedDB is
 * a cache — Safari's ITP clears it after 7 days without site interaction, so
 * ladder position cannot live there alone. Guests remain local-only, which is
 * inherent to being a guest.
 */
import type { PathProgress } from "@/types";
import { db } from "./dexie";
import { fetchPathProgress, markUnitSeenRemote } from "@/api/progress";

async function readLocal(pathId: string): Promise<PathProgress> {
  const existing = await db.pathProgress.get(pathId);
  return existing ?? { pathId, seenUnitIds: [] };
}

/**
 * Fetch progress for a path, or a fresh empty record if none exists yet.
 *
 * When signed in, local and server sets are unioned: seeing a unit is monotonic,
 * so a union is always correct and it covers three cases at once — guest progress
 * migrating on first sign-in, a second device with an empty cache, and writes that
 * failed to reach the server on a previous session (they get pushed here).
 */
export async function getPathProgress(pathId: string, signedIn = false): Promise<PathProgress> {
  const local = await readLocal(pathId);
  if (!signedIn) return local;

  try {
    const remote = await fetchPathProgress(pathId);
    const merged = [...new Set([...remote.seenUnitIds, ...local.seenUnitIds])];

    // Push anything the server is missing (guest history, or a failed earlier write).
    const missingOnServer = local.seenUnitIds.filter((id) => !remote.seenUnitIds.includes(id));
    for (const unitId of missingOnServer) {
      await markUnitSeenRemote(pathId, unitId);
    }

    const next: PathProgress = { pathId, seenUnitIds: merged };
    await db.pathProgress.put(next);
    return next;
  } catch {
    // Offline or server down: the cache is still usable, just not authoritative.
    return local;
  }
}

export async function markUnitSeen(
  pathId: string,
  unitId: string,
  signedIn = false,
): Promise<PathProgress> {
  const current = await readLocal(pathId);
  if (current.seenUnitIds.includes(unitId)) return current;

  const next: PathProgress = { pathId, seenUnitIds: [...current.seenUnitIds, unitId] };
  await db.pathProgress.put(next);

  if (signedIn) {
    // A failed write is recovered by the union in getPathProgress on next load,
    // so this must not break the session the learner is in the middle of.
    try {
      await markUnitSeenRemote(pathId, unitId);
    } catch {
      /* retried on next load */
    }
  }

  return next;
}
