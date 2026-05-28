/**
 * Session store — ephemeral, in-memory state for the current review session.
 *
 * Progress is persisted locally via IndexedDB (Dexie). The session is built
 * from a caller-supplied phrase list so tier filtering happens outside this
 * store — see phrasesForTier() in src/content/index.ts.
 *
 * Queue order:
 *   1. Due cards first, oldest-due first.
 *   2. New cards (never reviewed) in source order.
 */
import { create } from "zustand";
import type { Phrase, ReviewRating } from "@/types";
import { getAll, getOne, upsert } from "@/db/reviewStore";
import { schedule, isDue } from "@/srs/leitner";

type Status = "idle" | "loading" | "ready" | "empty" | "error";

type SessionState = {
  status: Status;
  error: string | null;
  queue: Phrase[];
  currentIndex: number;

  /**
   * Build a review queue from the supplied phrases.
   * Phrases already in IndexedDB that are due come first (oldest-due first).
   * Phrases never reviewed come after, in the order supplied.
   */
  initialize: (phrases: Phrase[]) => Promise<void>;
  rate: (rating: ReviewRating) => Promise<void>;
  reset: () => void;
};

export const useSession = create<SessionState>((set, get) => ({
  status: "idle",
  error: null,
  queue: [],
  currentIndex: 0,

  async initialize(phrases) {
    set({ status: "loading", error: null, queue: [], currentIndex: 0 });

    try {
      const now = Date.now();
      const stored = await getAll();
      const stateMap = new Map(stored.map((s) => [s.phraseId, s]));
      const phraseMap = new Map(phrases.map((p) => [p.id, p]));

      // Due phrases: stored state exists and dueAt has passed
      const dueQueue = stored
        .filter((s) => isDue(s, now) && phraseMap.has(s.phraseId))
        .sort((a, b) => a.dueAt - b.dueAt)
        .map((s) => phraseMap.get(s.phraseId))
        .filter((p): p is Phrase => p !== undefined);

      // New phrases: never reviewed (no IndexedDB entry)
      const newQueue = phrases.filter((p) => !stateMap.has(p.id));

      const queue = [...dueQueue, ...newQueue];
      set({ queue, currentIndex: 0, status: queue.length === 0 ? "empty" : "ready" });
    } catch (err) {
      set({ status: "error", error: err instanceof Error ? err.message : "Failed to load" });
    }
  },

  async rate(rating) {
    const { queue, currentIndex } = get();
    const phrase = queue[currentIndex];
    if (!phrase) return;

    try {
      const current = await getOne(phrase.id);
      const next = schedule(current, rating, Date.now(), phrase.id);
      await upsert(next);
    } catch {
      // Best-effort — advance the queue even if persistence fails
    }

    const nextIndex = currentIndex + 1;
    set({
      currentIndex: nextIndex,
      status: nextIndex >= queue.length ? "empty" : "ready",
    });
  },

  reset() {
    set({ status: "idle", error: null, queue: [], currentIndex: 0 });
  },
}));
