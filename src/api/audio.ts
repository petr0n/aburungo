import { apiFetch } from './client'

type AudioResponse = { url: string | null }

export async function fetchAudioUrl(phraseId: string): Promise<string | null> {
  const res = await apiFetch<AudioResponse>(`/api/audio/${encodeURIComponent(phraseId)}`)
  return res.url
}
