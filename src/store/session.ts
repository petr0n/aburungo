/**
 * Session store — ephemeral, in-memory state for the current review session.
 *
 * Progress is persisted locally via IndexedDB (Dexie). The session is built
 * from a caller-supplied phrase list so tier filtering happens outside this
 * store — see phrasesForTier() in src/content/index.ts.
 *
 * For authenticated users, each rating is also fire-and-forget posted to the
 * server so progress syncs across devices. Guests stay local-only.
 *
 * Queue order:
 *   1. Due cards first, oldest-due first.
 *   2. New cards (never reviewed) in source order.
 */
import { create } from "zustand";
import type { Phrase, Word, ReviewRating } from "@/types";
import { getAll, getOne, upsert } from "@/db/reviewStore";
import { schedule, isDue } from "@/srs/leitner";
import { fetchVocabulary } from "@/api/vocabulary";
import { submitReview } from "@/api/progress";
import { useProgress } from "@/store/progress";

type Status = "idle" | "loading" | "ready" | "empty" | "error";

type SessionState = {
  status: Status;
  error: string | null;
  queue: Array<Phrase | Word>;
  currentIndex: number;
  /** japanese text → server card UUID; populated for authenticated users */
  cardIdMap: Map<string, string>;

  /**
   * Build a review queue from the supplied items (phrases or words).
   * Items already in IndexedDB that are due come first (oldest-due first).
   * Items never reviewed come after, in the order supplied.
   * For authenticated users, also fetches the card ID map from the server.
   */
  initialize: (items: Array<Phrase | Word>, userId: string | null) => Promise<void>;
  rate: (rating: ReviewRating, userId: string | null) => Promise<void>;
  reset: () => void;
};

export const useSession = create<SessionState>((set, get) => ({
  status: "idle",
  error: null,
  queue: [],
  currentIndex: 0,
  cardIdMap: new Map(),

  async initialize(items, userId) {
    set({ status: "loading", error: null, queue: [], currentIndex: 0, cardIdMap: new Map() });

    // Kick off vocabulary fetch in parallel with local queue build so the map
    // is ready before the first card is shown. Failure is non-fatal.
    const cardIdMapPromise: Promise<Map<string, string>> = userId
      ? fetchVocabulary({ limit: 500 })
          .then((cards) => new Map(cards.map((c) => [c.japanese, c.id])))
          .catch(() => new Map())
      : Promise.resolve(new Map());

    try {
      const now = Date.now();
      const stored = await getAll();
      const stateMap = new Map(stored.map((s) => [s.phraseId, s]));
      const itemMap = new Map(items.map((p) => [p.id, p]));

      // Due items: stored state exists and dueAt has passed
      const dueQueue = stored
        .filter((s) => isDue(s, now) && itemMap.has(s.phraseId))
        .sort((a, b) => a.dueAt - b.dueAt)
        .map((s) => itemMap.get(s.phraseId))
        .filter((p): p is Phrase | Word => p !== undefined);

      // New items: never reviewed (no IndexedDB entry)
      const newQueue = items.filter((p) => !stateMap.has(p.id));

      const queue = [...dueQueue, ...newQueue];
      const cardIdMap = await cardIdMapPromise;
      set({ queue, currentIndex: 0, status: queue.length === 0 ? "empty" : "ready", cardIdMap });
    } catch (err) {
      const cardIdMap = await cardIdMapPromise;
      set({ status: "error", error: err instanceof Error ? err.message : "Failed to load", cardIdMap });
    }
  },

  async rate(rating, userId) {
    const { queue, currentIndex, cardIdMap } = get();
    const phrase = queue[currentIndex];
    if (!phrase) return;

    // Local Leitner — always runs for all users
    try {
      const current = await getOne(phrase.id);
      const next = schedule(current, rating, Date.now(), phrase.id);
      await upsert(next);
    } catch {
      // Best-effort — advance the queue even if persistence fails
    }

    // Server sync — fire-and-forget for authenticated users
    if (userId) {
      const cardId = cardIdMap.get(phrase.japanese);
      if (cardId) {
        submitReview(cardId, rating, Date.now())
          .then(() => { useProgress.getState().loadStats(userId); })
          .catch(() => {});
      }
    }

    const nextIndex = currentIndex + 1;
    set({
      currentIndex: nextIndex,
      status: nextIndex >= queue.length ? "empty" : "ready",
    });
  },

  reset() {
    set({ status: "idle", error: null, queue: [], currentIndex: 0, cardIdMap: new Map() });
  },
}));
