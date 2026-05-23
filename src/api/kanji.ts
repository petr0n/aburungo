import { apiFetch } from './client'

export type KanjiEntry = {
  id: string
  character: string
  meanings: string[]
  onReadings: string[]
  kunReadings: string[]
  strokeCount: number | null
  jlptLevel: number | null
  joyoGrade: number | null
}

type ListResponse = { data: KanjiEntry[] }
type ItemResponse = { data: KanjiEntry }

export type KanjiListParams = {
  jlpt?: number
  limit?: number
  offset?: number
}

export async function fetchKanjiList(params: KanjiListParams = {}): Promise<KanjiEntry[]> {
  const q = new URLSearchParams()
  if (params.jlpt !== undefined) q.set('jlpt', String(params.jlpt))
  if (params.limit !== undefined) q.set('limit', String(params.limit))
  if (params.offset !== undefined) q.set('offset', String(params.offset))
  const qs = q.size > 0 ? `?${q}` : ''
  const res = await apiFetch<ListResponse>(`/api/kanji${qs}`)
  return res.data
}

export async function fetchKanji(character: string): Promise<KanjiEntry> {
  const res = await apiFetch<ItemResponse>(
    `/api/kanji/${encodeURIComponent(character)}`,
  )
  return res.data
}
