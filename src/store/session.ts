/**
 * Session store — ephemeral, in-memory state for the current review session.
 *
 * Progress is persisted locally via IndexedDB (Dexie). The session is built
 * from a caller-supplied phrase list so tier filtering happens outside this
 * store — see phrasesForTier() in src/content/access.ts.
 *
 * For authenticated users, each rating is also fire-and-forget posted to the
 * server so progress syncs across devices. Guests stay local-only.
 *
 * Queue order:
 *   1. Due cards first, oldest-due first.
 *   2. New cards (never reviewed) in source order.
 *
 * DR-036: a session belongs to the owner it was initialized for. Ratings are
 * written under that owner, `reset` (called by the auth store on identity
 * change) invalidates it, and an initialize that finishes after a newer one
 * or a reset is discarded.
 */
import { create } from "zustand";
import type { Owner, Phrase, Word, ReviewRating } from "@/types";
import { GUEST_OWNER } from "@/types";
import { getAll, getOne, upsert } from "@/db/reviewStore";
import { schedule, isDue } from "@/srs/leitner";
import { fetchVocabulary } from "@/api/vocabulary";
import { submitReview, fetchDue } from "@/api/progress";
import { useProgress } from "@/store/progress";

type Status = "idle" | "loading" | "ready" | "empty" | "error";

type SessionState = {
  status: Status;
  error: string | null;
  queue: Array<Phrase | Word>;
  currentIndex: number;
  /** japanese text → server card UUID; populated for authenticated users */
  cardIdMap: Map<string, string>;
  /** Whose session this is; ratings are recorded for this owner only. */
  owner: Owner | null;

  /**
   * Build a review queue from the supplied items (phrases or words).
   * Items already in IndexedDB that are due come first (oldest-due first).
   * Items never reviewed come after, in the order supplied.
   * For authenticated users, also fetches the card ID map from the server.
   */
  initialize: (items: Array<Phrase | Word>, owner: Owner) => Promise<void>;
  rate: (rating: ReviewRating) => Promise<void>;
  reset: () => void;
};

/** Bumped by every initialize and reset; an initialize whose number is stale drops its result. */
let generation = 0;

export const useSession = create<SessionState>((set, get) => ({
  status: "idle",
  error: null,
  queue: [],
  currentIndex: 0,
  cardIdMap: new Map(),
  owner: null,

  async initialize(items, owner) {
    const mine = ++generation;
    const current = () => mine === generation;
    const userId = owner === GUEST_OWNER ? null : owner;
    set({ status: "loading", error: null, queue: [], currentIndex: 0, cardIdMap: new Map(), owner });

    // Kick off vocabulary fetch in parallel with local queue build so the map
    // is ready before the first card is shown. Failure is non-fatal.
    const cardIdMapPromise: Promise<Map<string, string>> = userId
      ? fetchVocabulary({ limit: 500 })
          .then((cards) => new Map(cards.map((c) => [c.japanese, c.id])))
          .catch(() => new Map())
      : Promise.resolve(new Map());

    try {
      const now = Date.now();
      const stored = await getAll(owner);
      const stateMap = new Map(stored.map((s) => [s.phraseId, s]));
      const itemMap = new Map(items.map((p) => [p.id, p]));

      // Local due items (Leitner): stored state exists and dueAt has passed.
      // Primary source of "due" on the device where the reviews happened.
      const localDue = stored
        .filter((s) => isDue(s, now) && itemMap.has(s.phraseId))
        .sort((a, b) => a.dueAt - b.dueAt)
        .map((s) => itemMap.get(s.phraseId))
        .filter((p): p is Phrase | Word => p !== undefined);

      const cardIdMap = await cardIdMapPromise;

      // Server due items (FSRS), for authenticated users only. Closes the
      // cross-device gap: on a device with empty IndexedDB, the server still
      // knows which cards are due. Mapped server cardId -> japanese -> item.
      // Non-fatal: a failed/empty fetch just falls back to local-only.
      let serverDue: Array<Phrase | Word> = [];
      if (userId && cardIdMap.size > 0) {
        try {
          const due = await fetchDue(owner, 100);
          const dueCardIds = new Set(due.map((d) => d.cardId));
          serverDue = items.filter((p) => {
            const cardId = cardIdMap.get(p.japanese);
            return cardId !== undefined && dueCardIds.has(cardId);
          });
        } catch {
          // ignore — local due queue still applies
        }
      }

      // Merge due (local first, then any server-only due), de-duped by item id.
      const dueIds = new Set<string>();
      const dueQueue: Array<Phrase | Word> = [];
      for (const item of [...localDue, ...serverDue]) {
        if (!dueIds.has(item.id)) {
          dueIds.add(item.id);
          dueQueue.push(item);
        }
      }

      // New items: never reviewed locally and not already queued as due.
      const newQueue = items.filter((p) => !stateMap.has(p.id) && !dueIds.has(p.id));

      const queue = [...dueQueue, ...newQueue];
      if (!current()) return;
      set({ queue, currentIndex: 0, status: queue.length === 0 ? "empty" : "ready", cardIdMap });
    } catch (err) {
      const cardIdMap = await cardIdMapPromise;
      if (!current()) return;
      set({ status: "error", error: err instanceof Error ? err.message : "Failed to load", cardIdMap });
    }
  },

  async rate(rating) {
    const { queue, currentIndex, cardIdMap, owner } = get();
    const phrase = queue[currentIndex];
    if (!phrase || owner === null) return;
    const mine = generation;

    // Local Leitner — always runs for all users
    try {
      const existing = await getOne(owner, phrase.id);
      await upsert(owner, schedule(existing, rating, Date.now(), phrase.id));
    } catch {
      // Best-effort — advance the queue even if persistence fails
    }

    // Server sync — fire-and-forget for authenticated users
    if (owner !== GUEST_OWNER) {
      const cardId = cardIdMap.get(phrase.japanese);
      if (cardId) {
        submitReview(owner, cardId, rating, Date.now())
          .then(() => useProgress.getState().loadStats(owner))
          .catch(() => {});
      }
    }

    if (mine !== generation) return; // reset or replaced while the write was in flight
    const nextIndex = currentIndex + 1;
    set({
      currentIndex: nextIndex,
      status: nextIndex >= queue.length ? "empty" : "ready",
    });
  },

  reset() {
    generation++;
    set({ status: "idle", error: null, queue: [], currentIndex: 0, cardIdMap: new Map(), owner: null });
  },
}));
