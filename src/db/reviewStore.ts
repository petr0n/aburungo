/**
 * Persistence boundary for review state.
 *
 * Everything that reads or writes ReviewState in IndexedDB goes through here.
 * The rest of the app (SRS, components, session store) never touches Dexie
 * directly — that keeps the data layer swappable and the SRS pure.
 *
 * Every function takes the Owner whose cache it reads or writes (DR-036). It
 * is bound when the operation starts, so a write that lands after a sign-out
 * or account switch still goes to its own owner's cache and server record.
 */
import type { EpochMs, Owner, ReviewRating, ReviewState } from "@/types";
import { GUEST_OWNER } from "@/types";
import { dbFor } from "./dexie";
import { fetchContentProgress, saveContentProgress } from "@/api/progress";
import { schedule } from "@/srs/leitner";

/** Fetch every stored ReviewState. Use sparingly — fine at session start. */
export function getAll(owner: Owner): Promise<ReviewState[]> {
  return dbFor(owner).reviewStates.toArray();
}

/** Fetch one phrase's state, or undefined if it's never been reviewed. */
export function getOne(owner: Owner, phraseId: string): Promise<ReviewState | undefined> {
  return dbFor(owner).reviewStates.get(phraseId);
}

/**
 * Phrases whose dueAt is at or before `now`.
 *
 * Returns them in dueAt-ascending order so the oldest-overdue phrase is
 * reviewed first. Phrases never reviewed have no row here and are surfaced
 * separately (see session store / pickReviewQueue).
 */
export function getDue(owner: Owner, now: EpochMs): Promise<ReviewState[]> {
  return dbFor(owner).reviewStates.where("dueAt").belowOrEqual(now).sortBy("dueAt");
}

/** Insert or replace a phrase's review state. Keyed by phraseId. */
export async function upsert(owner: Owner, state: ReviewState): Promise<void> {
  await dbFor(owner).reviewStates.put(state);
}

/**
 * Same as upsert, but also sends the state to the server for signed-in users
 * (DR-018). IndexedDB is a cache; Safari clears it after 7 days without site
 * interaction, and until now the whole /learn history lived only there.
 *
 * Fire-and-forget: a failed write must not interrupt a lesson, and
 * hydrateFromServer's merge on next load repairs anything that was lost.
 */
export async function upsertSynced(owner: Owner, state: ReviewState): Promise<void> {
  await upsert(owner, state);
  if (owner === GUEST_OWNER) return;
  void saveContentProgress(owner, [
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
export async function hydrateFromServer(owner: Owner): Promise<ReviewState[]> {
  const local = await getAll(owner);
  if (owner === GUEST_OWNER) return local;

  try {
    const remote = await fetchContentProgress(owner);
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
        await upsert(owner, remoteState);
      }
    }

    const remoteById = new Map(remote.map((r) => [r.contentId, r]));
    for (const s of byId.values()) {
      const theirs = remoteById.get(s.phraseId);
      if (theirs === undefined || (theirs.lastSeenAt ?? 0) < (s.lastSeenAt ?? 0)) toPush.push(s);
    }

    if (toPush.length > 0) {
      await saveContentProgress(
        owner,
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
export async function reset(owner: Owner): Promise<void> {
  await dbFor(owner).reviewStates.clear();
}

/**
 * Record one review outcome for any schedulable item — word, phrase or grammar
 * pattern — and sync it when signed in.
 *
 * Exists because every practice surface needs the identical read-schedule-write
 * triple, and the ones that open-coded it mostly forgot the write: until
 * 2026-08-09 the whole WordsPage drill/recognition flow only moved local
 * component state, so drilling never reached the review queue. Callers should
 * reach for this rather than reassembling the steps.
 *
 * `now` is read here, at the db boundary, so src/srs/ stays pure per CLAUDE.md.
 */
export async function recordRating(owner: Owner, itemId: string, rating: ReviewRating): Promise<void> {
  const existing = await getOne(owner, itemId);
  await upsertSynced(owner, schedule(existing, rating, Date.now(), itemId));
}

/** Boolean-outcome convenience for surfaces that only know correct/incorrect. */
export async function recordReview(owner: Owner, itemId: string, correct: boolean): Promise<void> {
  return recordRating(owner, itemId, correct ? "got-it" : "didnt");
}
