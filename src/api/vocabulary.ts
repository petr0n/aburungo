import type { Card } from "@/types";
import { apiFetch } from "./client";

type ListParams = {
  deck?: string;
  limit?: number;
  offset?: number;
};

type VocabularyListResponse = { data: Card[] };
type VocabularyItemResponse = { data: Card };

export async function fetchVocabulary(params: ListParams = {}): Promise<Card[]> {
  const query = new URLSearchParams();
  if (params.deck) query.set("deck", params.deck);
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.offset !== undefined) query.set("offset", String(params.offset));

  const qs = query.size > 0 ? `?${query}` : "";
  const res = await apiFetch<VocabularyListResponse>(`/api/vocabulary${qs}`);
  return res.data;
}

export async function fetchCard(id: string): Promise<Card> {
  const res = await apiFetch<VocabularyItemResponse>(`/api/vocabulary/${encodeURIComponent(id)}`);
  return res.data;
}
