/**
 * Profile statistics and kana progress for the current learner.
 *
 * DR-036: the store holds one owner's state at a time. The auth store calls
 * `resetFor` on every identity change, before the new owner is visible, and
 * every load or write applies its result only if that owner is still the one
 * held -- so a late response for account A never shows up in B's session.
 */
import { create } from "zustand";
import type { KanaProgressEntry, KanaScript, Owner, ProgressStats } from "@/types";
import { GUEST_OWNER } from "@/types";
import {
  fetchStats,
  fetchKanaProgress,
  submitKanaAnswer,
  resetKanaProgress as apiResetKana,
} from "@/api/progress";
import { readGuestKana, writeGuestKana } from "@/db/kanaLocal";

function upsertKana(
  entries: KanaProgressEntry[],
  character: string,
  script: KanaScript,
  mode: "recognized" | "recalled",
  correct: boolean,
): KanaProgressEntry[] {
  const existing = entries.find((e) => e.character === character);
  const base: KanaProgressEntry = existing ?? {
    character,
    script,
    recognizedCount: 0,
    recalledCount: 0,
    lastSeenAt: null,
  };
  const updated: KanaProgressEntry = {
    ...base,
    recognizedCount: mode === "recognized" && correct ? base.recognizedCount + 1 : base.recognizedCount,
    recalledCount: mode === "recalled" && correct ? base.recalledCount + 1 : base.recalledCount,
    lastSeenAt: new Date().toISOString(),
  };
  return existing
    ? entries.map((e) => (e.character === character ? updated : e))
    : [...entries, updated];
}

// --- Store ---

type ProgressState = {
  /** Whose state this is; null until auth has resolved. */
  owner: Owner | null;
  stats: ProgressStats | null;
  kanaProgress: KanaProgressEntry[];
  statsLoading: boolean;
  kanaLoading: boolean;

  loadStats: (owner: Owner) => Promise<void>;
  loadKana: (owner: Owner) => Promise<void>;
  recordKanaAnswer: (
    owner: Owner,
    character: string,
    script: KanaScript,
    mode: "recognized" | "recalled",
    correct: boolean,
  ) => Promise<void>;
  resetKana: (owner: Owner, script: KanaScript | "all") => Promise<void>;
  /** Drop everything held and start holding `owner`'s state. Called on identity change. */
  resetFor: (owner: Owner) => void;
};

export const useProgress = create<ProgressState>((set, get) => {
  /** Apply `patch` only while `owner` is still the learner this store holds. */
  const setFor = (owner: Owner, patch: Partial<ProgressState>) => {
    if (get().owner === owner) set(patch);
  };

  return {
    owner: null,
    stats: null,
    kanaProgress: [],
    statsLoading: false,
    kanaLoading: false,

    async loadStats(owner) {
      if (owner === GUEST_OWNER) return;
      setFor(owner, { statsLoading: true });
      try {
        const stats = await fetchStats(owner);
        setFor(owner, { stats });
      } catch {
        // non-fatal — widget stays empty
      } finally {
        setFor(owner, { statsLoading: false });
      }
    },

    async loadKana(owner) {
      if (owner === GUEST_OWNER) {
        setFor(owner, { kanaProgress: readGuestKana() });
        return;
      }
      setFor(owner, { kanaLoading: true });
      try {
        setFor(owner, { kanaProgress: await fetchKanaProgress(owner) });
      } catch {
        // Offline: show nothing rather than another owner's kana (DR-036 rule 5).
      } finally {
        setFor(owner, { kanaLoading: false });
      }
    },

    async recordKanaAnswer(owner, character, script, mode, correct) {
      if (get().owner !== owner) return;
      const next = upsertKana(get().kanaProgress, character, script, mode, correct);
      set({ kanaProgress: next });

      if (owner === GUEST_OWNER) {
        writeGuestKana(next);
        return;
      }

      // Signed-in: fire-and-forget to server, bound to this owner's token.
      submitKanaAnswer(owner, character, script, mode, correct)
        .then((updated) => {
          if (get().owner !== owner) return;
          set((s) => ({
            kanaProgress: s.kanaProgress.map((e) => (e.character === updated.character ? updated : e)),
          }));
        })
        .catch(() => {
          // Server write failed — the optimistic count is shown until the next load.
        });
    },

    async resetKana(owner, script) {
      if (owner !== GUEST_OWNER) await apiResetKana(owner, script);
      if (get().owner !== owner) return;
      const filtered = script === "all" ? [] : get().kanaProgress.filter((e) => e.script !== script);
      if (owner === GUEST_OWNER) writeGuestKana(filtered);
      set({ kanaProgress: filtered });
    },

    resetFor(owner) {
      set({ owner, stats: null, kanaProgress: [], statsLoading: false, kanaLoading: false });
    },
  };
});
