import type { FsrsState, ReviewRating, ProgressStats } from "@/types";
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

export async function submitReview(cardId: string, rating: ReviewRating, reviewedAt: number): Promise<ReviewResult> {
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
