import { supabase } from '../lib/supabase.js'
import type { CardRow } from '../db/types.js'

export type CardResult = {
  id: string
  japanese: string
  reading: string
  romaji: string
  english: string
  notes: string | null
  audioUrl: string | null
  deck: string
}

function toResult(row: CardRow & { decks: { slug: string } }): CardResult {
  return {
    id: row.id,
    japanese: row.japanese,
    reading: row.reading,
    romaji: row.romaji,
    english: row.english,
    notes: row.notes,
    audioUrl: row.audio_url,
    deck: row.decks.slug,
  }
}

type ListParams = {
  deck?: string
  limit: number
  offset: number
}

export async function listCards(params: ListParams): Promise<CardResult[]> {
  let query = supabase
    .from('cards')
    .select('*, decks(slug)')
    .order('display_order', { ascending: true })
    .range(params.offset, params.offset + params.limit - 1)

  if (params.deck) {
    const { data: deck } = await supabase
      .from('decks')
      .select('id')
      .eq('slug', params.deck)
      .single()

    if (!deck) return []
    query = query.eq('deck_id', deck.id)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return (data ?? []).map((row) => toResult(row as CardRow & { decks: { slug: string } }))
}

export async function getCard(id: string): Promise<CardResult | null> {
  const { data, error } = await supabase
    .from('cards')
    .select('*, decks(slug)')
    .eq('id', id)
    .single()

  if (error) return null
  return toResult(data as CardRow & { decks: { slug: string } })
}
