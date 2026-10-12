import type {
  FsrsState,
  ReviewRating,
  ProgressStats,
  KanaProgressEntry,
  KanaScript,
  PathProgress,
  LeitnerBox,
  Owner,
} from "@/types";
import { apiFetch } from "./client";

// Every call here is learner state, so each takes the Owner it is for and
// apiFetch refuses to send it under any other account's token (DR-036).

export type DueCard = {
  cardId: string;
  state: FsrsState;
  dueAt: string;
  reps: number;
};

export type ReviewResult = {
  cardId: string;
  state: FsrsState;
  dueAt: string;
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
};

type FsrsRating = "again" | "hard" | "good" | "easy";

function toFsrsRating(rating: ReviewRating): FsrsRating {
  return rating === "got-it" ? "good" : "again";
}

export async function fetchDue(owner: Owner, limit?: number): Promise<DueCard[]> {
  const qs = limit !== undefined ? `?limit=${limit}` : "";
  const res = await apiFetch<{ data: DueCard[] }>(`/api/progress/due${qs}`, {}, owner);
  return res.data;
}

export async function submitReview(
  owner: Owner,
  cardId: string,
  rating: ReviewRating,
  reviewedAt: number,
): Promise<ReviewResult> {
  const res = await apiFetch<{ data: ReviewResult }>("/api/progress/review", {
    method: "POST",
    body: JSON.stringify({ cardId, rating: toFsrsRating(rating), reviewedAt }),
  }, owner);
  return res.data;
}

export async function fetchStats(owner: Owner): Promise<ProgressStats> {
  const res = await apiFetch<{ data: ProgressStats }>("/api/progress/stats", {}, owner);
  return res.data;
}

export async function fetchKanaProgress(owner: Owner): Promise<KanaProgressEntry[]> {
  const res = await apiFetch<{ data: KanaProgressEntry[] }>("/api/progress/kana", {}, owner);
  return res.data;
}

export async function submitKanaAnswer(
  owner: Owner,
  character: string,
  script: KanaScript,
  mode: "recognized" | "recalled",
  correct: boolean,
): Promise<KanaProgressEntry> {
  const res = await apiFetch<{ data: KanaProgressEntry }>("/api/progress/kana", {
    method: "POST",
    body: JSON.stringify({ character, script, mode, correct }),
  }, owner);
  return res.data;
}

export async function resetKanaProgress(owner: Owner, script: KanaScript | "all"): Promise<void> {
  await apiFetch(`/api/progress/kana?script=${script}`, { method: "DELETE" }, owner);
}

/**
 * The server's wire shape, which still says "unit".
 *
 * The app now calls these lessons, but the database column is `seen_unit_ids`
 * and renaming it means a migration someone has to run by hand for a purely
 * cosmetic gain. So the old name stops at this boundary and nothing above it
 * needs to know. Renaming without this mapping typechecks perfectly and fails
 * at runtime — the POST 400s and the GET reads an undefined field.
 */
type WirePathProgress = { pathId: string; seenUnitIds: string[] };

function fromWire(wire: WirePathProgress): PathProgress {
  return { pathId: wire.pathId, seenLessonIds: wire.seenUnitIds ?? [] };
}

export async function fetchPathProgress(owner: Owner, pathId: string): Promise<PathProgress> {
  const res = await apiFetch<{ data: WirePathProgress }>(
    `/api/progress/path?pathId=${encodeURIComponent(pathId)}`,
    {},
    owner,
  );
  return fromWire(res.data);
}

export async function markLessonSeenRemote(owner: Owner, pathId: string, lessonId: string): Promise<PathProgress> {
  const res = await apiFetch<{ data: WirePathProgress }>("/api/progress/path", {
    method: "POST",
    body: JSON.stringify({ pathId, unitId: lessonId }),
  }, owner);
  return fromWire(res.data);
}

export type ContentProgressEntry = {
  contentId: string;
  box: LeitnerBox;
  dueAt: number;
  lastSeenAt: number | null;
};

export async function fetchContentProgress(owner: Owner): Promise<ContentProgressEntry[]> {
  const res = await apiFetch<{ data: ContentProgressEntry[] }>("/api/progress/content", {}, owner);
  return res.data;
}

// The route rejects a batch over 500 whole, so hydrateFromServer's catch-up
// push for a large history must go in pieces or none of it lands.
const SAVE_BATCH = 500;

export async function saveContentProgress(owner: Owner, entries: ContentProgressEntry[]): Promise<void> {
  for (let i = 0; i < entries.length; i += SAVE_BATCH) {
    await apiFetch("/api/progress/content", {
      method: "POST",
      body: JSON.stringify({ entries: entries.slice(i, i + SAVE_BATCH) }),
    }, owner);
  }
}
