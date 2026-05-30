import { create } from "zustand";
import type { ProgressStats, KanaProgressEntry, KanaScript } from "@/types";
import {
  fetchStats,
  fetchKanaProgress,
  submitKanaAnswer,
  resetKanaProgress as apiResetKana,
} from "@/api/progress";

// --- localStorage keys (guest fallback) ---

const LS_KANA_KEY = "aburungo:kana_progress";

function lsReadKana(): KanaProgressEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KANA_KEY) ?? "[]") as KanaProgressEntry[];
  } catch {
    return [];
  }
}

function lsWriteKana(entries: KanaProgressEntry[]): void {
  localStorage.setItem(LS_KANA_KEY, JSON.stringify(entries));
}

function lsUpsertKana(
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
  stats: ProgressStats | null;
  kanaProgress: KanaProgressEntry[];
  statsLoading: boolean;
  kanaLoading: boolean;

  loadStats: (userId: string | null) => Promise<void>;
  loadKana: (userId: string | null) => Promise<void>;
  recordKanaAnswer: (
    userId: string | null,
    character: string,
    script: KanaScript,
    mode: "recognized" | "recalled",
    correct: boolean,
  ) => Promise<void>;
  resetKana: (userId: string | null, script: KanaScript | "all") => Promise<void>;
  clearProgress: () => void;
};

export const useProgress = create<ProgressState>((set, get) => ({
  stats: null,
  kanaProgress: [],
  statsLoading: false,
  kanaLoading: false,

  async loadStats(userId) {
    if (!userId) return;
    set({ statsLoading: true });
    try {
      const stats = await fetchStats();
      set({ stats });
    } catch {
      // non-fatal — widget stays empty
    } finally {
      set({ statsLoading: false });
    }
  },

  async loadKana(userId) {
    if (!userId) {
      // Guest: read from localStorage
      set({ kanaProgress: lsReadKana() });
      return;
    }
    set({ kanaLoading: true });
    try {
      const entries = await fetchKanaProgress();
      // Dual-write: merge any local guest data into server on first sign-in
      const local = lsReadKana();
      if (local.length > 0) {
        // Guest had progress — upload it, then clear local
        await Promise.allSettled(
          local.map((e) => {
            const promises: Promise<unknown>[] = [];
            for (let i = 0; i < e.recognizedCount; i++) {
              promises.push(submitKanaAnswer(e.character, e.script, "recognized", true));
            }
            for (let i = 0; i < e.recalledCount; i++) {
              promises.push(submitKanaAnswer(e.character, e.script, "recalled", true));
            }
            return Promise.all(promises);
          }),
        );
        localStorage.removeItem(LS_KANA_KEY);
        const merged = await fetchKanaProgress();
        set({ kanaProgress: merged });
      } else {
        set({ kanaProgress: entries });
      }
    } catch {
      set({ kanaProgress: lsReadKana() });
    } finally {
      set({ kanaLoading: false });
    }
  },

  async recordKanaAnswer(userId, character, script, mode, correct) {
    // Optimistic local update
    const next = lsUpsertKana(get().kanaProgress, character, script, mode, correct);
    set({ kanaProgress: next });

    if (!userId) {
      // Guest: persist to localStorage only
      lsWriteKana(next);
      return;
    }

    // Signed-in: fire-and-forget to server
    submitKanaAnswer(character, script, mode, correct).then((updated) => {
      set((s) => ({
        kanaProgress: s.kanaProgress.map((e) =>
          e.character === updated.character ? updated : e,
        ),
      }));
    }).catch(() => {
      // Server write failed — local state already updated, will sync on next load
    });
  },

  async resetKana(userId, script) {
    if (!userId) {
      const filtered =
        script === "all"
          ? []
          : get().kanaProgress.filter((e) => e.script !== script);
      lsWriteKana(filtered);
      set({ kanaProgress: filtered });
      return;
    }
    await apiResetKana(script);
    const filtered =
      script === "all"
        ? []
        : get().kanaProgress.filter((e) => e.script !== script);
    set({ kanaProgress: filtered });
  },

  clearProgress() {
    set({ stats: null, kanaProgress: [], statsLoading: false, kanaLoading: false });
  },
}));
