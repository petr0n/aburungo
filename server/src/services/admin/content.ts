import { supabase } from '../../lib/supabase.js'

export type CardAuditRow = {
  id: string
  japanese: string
  english: string
  deck: string
  issues: string[]
}

export type KanjiAuditRow = {
  id: string
  character: string
  issues: string[]
}

export type AudioCoverage = {
  total: number
  withAudio: number
  withoutAudio: number
  coveragePercent: number
}

export type ContentAuditResult = {
  cards: CardAuditRow[]
  kanji: KanjiAuditRow[]
  audioCoverage: AudioCoverage
  checkedAt: string
}

export async function getContentAudit(): Promise<ContentAuditResult> {
  const [cardsRes, kanjiRes] = await Promise.all([
    supabase
      .from('cards')
      .select('id, japanese, english, romaji, jmdict_id, audio_url, decks(slug)')
      .order('display_order', { ascending: true }),
    supabase
      .from('kanji')
      .select('id, character, stroke_count, jlpt_level')
      .order('jlpt_level', { ascending: false, nullsFirst: true }),
  ])

  const cards: CardAuditRow[] = []
  let withAudio = 0
  const total = (cardsRes.data ?? []).length

  for (const row of cardsRes.data ?? []) {
    const issues: string[] = []
    if (!row.romaji) issues.push('missing romaji')
    if (!row.jmdict_id) issues.push('no JMdict ID')
    if (!row.audio_url) issues.push('no audio')
    else withAudio++

    if (issues.length > 0) {
      cards.push({
        id: row.id as string,
        japanese: row.japanese as string,
        english: row.english as string,
        deck: ((row.decks as unknown) as { slug: string } | null)?.slug ?? '',
        issues,
      })
    }
  }

  const kanji: KanjiAuditRow[] = []
  for (const row of kanjiRes.data ?? []) {
    const issues: string[] = []
    if (!row.stroke_count) issues.push('missing stroke count')
    if (!row.jlpt_level) issues.push('missing JLPT level')

    if (issues.length > 0) {
      kanji.push({
        id: row.id as string,
        character: row.character as string,
        issues,
      })
    }
  }

  const audioCoverage: AudioCoverage = {
    total,
    withAudio,
    withoutAudio: total - withAudio,
    coveragePercent: total > 0 ? Math.round((withAudio / total) * 100) : 0,
  }

  return {
    cards,
    kanji,
    audioCoverage,
    checkedAt: new Date().toISOString(),
  }
}
