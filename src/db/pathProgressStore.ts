/**
 * Persistence boundary for PathProgress — mirrors reviewStore.ts. The rest
 * of the app never touches Dexie directly for path progress.
 */
import type { PathProgress } from "@/types";
import { db } from "./dexie";

/** Fetch progress for a path, or a fresh empty record if none exists yet. */
export async function getPathProgress(pathId: string): Promise<PathProgress> {
  const existing = await db.pathProgress.get(pathId);
  return existing ?? { pathId, seenUnitIds: [] };
}

export async function markUnitSeen(pathId: string, unitId: string): Promise<PathProgress> {
  const current = await getPathProgress(pathId);
  if (current.seenUnitIds.includes(unitId)) return current;
  const next: PathProgress = { pathId, seenUnitIds: [...current.seenUnitIds, unitId] };
  await db.pathProgress.put(next);
  return next;
}
