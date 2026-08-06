/**
 * Persistence boundary for review state.
 *
 * Everything that reads or writes ReviewState in IndexedDB goes through here.
 * The rest of the app (SRS, components, session store) never touches Dexie
 * directly — that keeps the data layer swappable and the SRS pure.
 */
import type { EpochMs, ReviewState } from "@/types";
import { db } from "./dexie";
import { fetchContentProgress, saveContentProgress } from "@/api/progress";

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

/**
 * Same as upsert, but also sends the state to the server for signed-in users
 * (DR-018). IndexedDB is a cache; Safari clears it after 7 days without site
 * interaction, and until now the whole /learn history lived only there.
 *
 * Fire-and-forget: a failed write must not interrupt a lesson, and
 * hydrateFromServer's merge on next load repairs anything that was lost.
 */
export async function upsertSynced(state: ReviewState, signedIn: boolean): Promise<void> {
  await upsert(state);
  if (!signedIn) return;
  void saveContentProgress([
    {
      contentId: state.phraseId,
      box: state.box,
      dueAt: state.dueAt,
      lastSeenAt: state.lastSeenAt ?? null,
    },
  ]).catch(() => {
    /* repaired by the next hydrateFromServer */
  });
}

/**
 * Merge server review state into the local cache at session start.
 *
 * Unlike path progress, review state is not monotonic — the same card can be
 * reviewed on two devices — so the newer `lastSeenAt` wins rather than a union.
 * Anything the server has not seen, or holds an older version of, is pushed back
 * in one batch, which also recovers writes that failed mid-lesson.
 *
 * Returns the merged set so callers can use it without a second read.
 */
export async function hydrateFromServer(signedIn: boolean): Promise<ReviewState[]> {
  const local = await getAll();
  if (!signedIn) return local;

  try {
    const remote = await fetchContentProgress();
    const byId = new Map(local.map((s) => [s.phraseId, s]));
    const toPush: ReviewState[] = [];

    for (const r of remote) {
      const mine = byId.get(r.contentId);
      const remoteState: ReviewState = {
        phraseId: r.contentId,
        box: r.box,
        dueAt: r.dueAt,
        ...(r.lastSeenAt !== null ? { lastSeenAt: r.lastSeenAt } : {}),
      };
      if (mine === undefined || (mine.lastSeenAt ?? 0) < (r.lastSeenAt ?? 0)) {
        byId.set(r.contentId, remoteState);
        await upsert(remoteState);
      }
    }

    const remoteById = new Map(remote.map((r) => [r.contentId, r]));
    for (const s of byId.values()) {
      const theirs = remoteById.get(s.phraseId);
      if (theirs === undefined || (theirs.lastSeenAt ?? 0) < (s.lastSeenAt ?? 0)) toPush.push(s);
    }

    if (toPush.length > 0) {
      await saveContentProgress(
        toPush.map((s) => ({
          contentId: s.phraseId,
          box: s.box,
          dueAt: s.dueAt,
          lastSeenAt: s.lastSeenAt ?? null,
        })),
      );
    }

    return [...byId.values()];
  } catch {
    // Offline or server down: the cache still works, it just is not authoritative.
    return local;
  }
}

/** Wipe everything. Only meant for dev/debug — no UI hook yet. */
export async function reset(): Promise<void> {
  await db.reviewStates.clear();
}
