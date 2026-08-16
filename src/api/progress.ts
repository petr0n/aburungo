import type {
  FsrsState,
  ReviewRating,
  ProgressStats,
  KanaProgressEntry,
  KanaScript,
  PathProgress,
  LeitnerBox,
} from "@/types";
import { apiFetch } from "./client";

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

export async function fetchDue(limit?: number): Promise<DueCard[]> {
  const qs = limit !== undefined ? `?limit=${limit}` : "";
  const res = await apiFetch<{ data: DueCard[] }>(`/api/progress/due${qs}`);
  return res.data;
}

export async function submitReview(
  cardId: string,
  rating: ReviewRating,
  reviewedAt: number,
): Promise<ReviewResult> {
  const res = await apiFetch<{ data: ReviewResult }>("/api/progress/review", {
    method: "POST",
    body: JSON.stringify({ cardId, rating: toFsrsRating(rating), reviewedAt }),
  });
  return res.data;
}

export async function fetchStats(): Promise<ProgressStats> {
  const res = await apiFetch<{ data: ProgressStats }>("/api/progress/stats");
  return res.data;
}

export async function fetchKanaProgress(): Promise<KanaProgressEntry[]> {
  const res = await apiFetch<{ data: KanaProgressEntry[] }>("/api/progress/kana");
  return res.data;
}

export async function submitKanaAnswer(
  character: string,
  script: KanaScript,
  mode: "recognized" | "recalled",
  correct: boolean,
): Promise<KanaProgressEntry> {
  const res = await apiFetch<{ data: KanaProgressEntry }>("/api/progress/kana", {
    method: "POST",
    body: JSON.stringify({ character, script, mode, correct }),
  });
  return res.data;
}

export async function resetKanaProgress(script: KanaScript | "all"): Promise<void> {
  await apiFetch(`/api/progress/kana?script=${script}`, { method: "DELETE" });
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

export async function fetchPathProgress(pathId: string): Promise<PathProgress> {
  const res = await apiFetch<{ data: WirePathProgress }>(
    `/api/progress/path?pathId=${encodeURIComponent(pathId)}`,
  );
  return fromWire(res.data);
}

export async function markLessonSeenRemote(pathId: string, lessonId: string): Promise<PathProgress> {
  const res = await apiFetch<{ data: WirePathProgress }>("/api/progress/path", {
    method: "POST",
    body: JSON.stringify({ pathId, unitId: lessonId }),
  });
  return fromWire(res.data);
}

export type ContentProgressEntry = {
  contentId: string;
  box: LeitnerBox;
  dueAt: number;
  lastSeenAt: number | null;
};

export async function fetchContentProgress(): Promise<ContentProgressEntry[]> {
  const res = await apiFetch<{ data: ContentProgressEntry[] }>("/api/progress/content");
  return res.data;
}

export async function saveContentProgress(entries: ContentProgressEntry[]): Promise<void> {
  if (entries.length === 0) return;
  await apiFetch("/api/progress/content", {
    method: "POST",
    body: JSON.stringify({ entries }),
  });
}
