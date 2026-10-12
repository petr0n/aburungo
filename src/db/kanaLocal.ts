/**
 * Guest kana progress in localStorage. Signed-in kana lives on the server, so
 * this is the guest's alone (DR-036).
 *
 * The pre-DR-036 key held the same thing: only guests ever wrote it, and the
 * old sign-in path uploaded and removed it. Unlike the shared IndexedDB, its
 * owner is known, so it moves to the guest key rather than to legacy recovery.
 */
import type { KanaProgressEntry } from "@/types";

const GUEST_KEY = "aburungo:kana_progress:guest";
const PRE_DR036_KEY = "aburungo:kana_progress";

export function readGuestKana(): KanaProgressEntry[] {
  try {
    const old = localStorage.getItem(PRE_DR036_KEY);
    if (old !== null) {
      if (localStorage.getItem(GUEST_KEY) === null) localStorage.setItem(GUEST_KEY, old);
      localStorage.removeItem(PRE_DR036_KEY);
    }
    return JSON.parse(localStorage.getItem(GUEST_KEY) ?? "[]") as KanaProgressEntry[];
  } catch {
    return [];
  }
}

export function writeGuestKana(entries: KanaProgressEntry[]): void {
  try {
    if (entries.length === 0) localStorage.removeItem(GUEST_KEY);
    else localStorage.setItem(GUEST_KEY, JSON.stringify(entries));
  } catch {
    /* storage unavailable (private mode): guest kana just is not kept */
  }
}
