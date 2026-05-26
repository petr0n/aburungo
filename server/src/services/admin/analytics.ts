import { supabase } from '../../lib/supabase.js'

export type DailyReviews = {
  date: string   // YYYY-MM-DD
  count: number
}

export type MissedCard = {
  id: string
  japanese: string
  english: string
  deck: string
  againCount: number
  totalCount: number
  againRatio: number
}

export type MissedKanji = {
  id: string
  character: string
  meanings: string[]
  againCount: number
  totalCount: number
  againRatio: number
}

export type FsrsDistribution = {
  new: number
  learning: number
  review: number
  relearning: number
}

export type AnalyticsResult = {
  reviewsPerDay: DailyReviews[]
  mostMissedCards: MissedCard[]
  mostMissedKanji: MissedKanji[]
  cardFsrsDistribution: FsrsDistribution
  kanjiFsrsDistribution: FsrsDistribution
  totalUsers: number
  totalReviews: number
  cachedAt: string
}

// Simple 5-minute cache
let cache: { data: AnalyticsResult; expiresAt: number } | null = null

export async function getAnalytics(): Promise<AnalyticsResult> {
  if (cache && Date.now() < cache.expiresAt) return cache.data

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [
    reviewLogsRes,
    cardProgressRes,
    kanjiProgressRes,
    usersRes,
    kanjiLogsRes,
  ] = await Promise.all([
    supabase
      .from('review_logs')
      .select('reviewed_at, rating, card_id')
      .gte('reviewed_at', since)
      .order('reviewed_at', { ascending: true }),
    supabase
      .from('user_card_progress')
      .select('state'),
    supabase
      .from('user_kanji_progress')
      .select('state'),
    supabase
      .from('users')
      .select('id', { count: 'exact', head: true }),
    supabase
      .from('review_logs')
      .select('reviewed_at, rating, kanji_id')
      .not('kanji_id', 'is', null)
      .gte('reviewed_at', since),
  ])

  // Reviews per day
  const dayMap = new Map<string, number>()
  for (const row of reviewLogsRes.data ?? []) {
    const day = (row.reviewed_at as string).slice(0, 10)
    dayMap.set(day, (dayMap.get(day) ?? 0) + 1)
  }
  const reviewsPerDay: DailyReviews[] = Array.from(dayMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // Most missed vocabulary cards
  const cardAgain = new Map<string, { again: number; total: number }>()
  for (const row of reviewLogsRes.data ?? []) {
    if (!row.card_id) continue
    const id = row.card_id as string
    const cur = cardAgain.get(id) ?? { again: 0, total: 0 }
    cur.total++
    if (row.rating === 'again') cur.again++
    cardAgain.set(id, cur)
  }
  const topMissedCardIds = Array.from(cardAgain.entries())
    .filter(([, v]) => v.total >= 3)
    .sort((a, b) => b[1].again / b[1].total - a[1].again / a[1].total)
    .slice(0, 10)
    .map(([id]) => id)

  let mostMissedCards: MissedCard[] = []
  if (topMissedCardIds.length > 0) {
    const { data: cardRows } = await supabase
      .from('cards')
      .select('id, japanese, english, decks(slug)')
      .in('id', topMissedCardIds)
    mostMissedCards = (cardRows ?? []).map((r) => {
      const stats = cardAgain.get(r.id as string)!
      return {
        id: r.id as string,
        japanese: r.japanese as string,
        english: r.english as string,
        deck: ((r.decks as unknown) as { slug: string } | null)?.slug ?? '',
        againCount: stats.again,
        totalCount: stats.total,
        againRatio: stats.again / stats.total,
      }
    }).sort((a, b) => b.againRatio - a.againRatio)
  }

  // Most missed kanji
  const kanjiAgain = new Map<string, { again: number; total: number }>()
  for (const row of kanjiLogsRes.data ?? []) {
    if (!row.kanji_id) continue
    const id = row.kanji_id as string
    const cur = kanjiAgain.get(id) ?? { again: 0, total: 0 }
    cur.total++
    if (row.rating === 'again') cur.again++
    kanjiAgain.set(id, cur)
  }
  const topMissedKanjiIds = Array.from(kanjiAgain.entries())
    .filter(([, v]) => v.total >= 3)
    .sort((a, b) => b[1].again / b[1].total - a[1].again / a[1].total)
    .slice(0, 10)
    .map(([id]) => id)

  let mostMissedKanji: MissedKanji[] = []
  if (topMissedKanjiIds.length > 0) {
    const { data: kanjiRows } = await supabase
      .from('kanji')
      .select('id, character, meanings')
      .in('id', topMissedKanjiIds)
    mostMissedKanji = (kanjiRows ?? []).map((r) => {
      const stats = kanjiAgain.get(r.id as string)!
      return {
        id: r.id as string,
        character: r.character as string,
        meanings: r.meanings as string[],
        againCount: stats.again,
        totalCount: stats.total,
        againRatio: stats.again / stats.total,
      }
    }).sort((a, b) => b.againRatio - a.againRatio)
  }

  // FSRS distribution
  const cardFsrsDistribution: FsrsDistribution = { new: 0, learning: 0, review: 0, relearning: 0 }
  for (const row of cardProgressRes.data ?? []) {
    const s = row.state as keyof FsrsDistribution
    if (s in cardFsrsDistribution) cardFsrsDistribution[s]++
  }

  const kanjiFsrsDistribution: FsrsDistribution = { new: 0, learning: 0, review: 0, relearning: 0 }
  for (const row of kanjiProgressRes.data ?? []) {
    const s = row.state as keyof FsrsDistribution
    if (s in kanjiFsrsDistribution) kanjiFsrsDistribution[s]++
  }

  const totalReviews = (reviewLogsRes.data?.length ?? 0) + (kanjiLogsRes.data?.length ?? 0)

  const result: AnalyticsResult = {
    reviewsPerDay,
    mostMissedCards,
    mostMissedKanji,
    cardFsrsDistribution,
    kanjiFsrsDistribution,
    totalUsers: usersRes.count ?? 0,
    totalReviews,
    cachedAt: new Date().toISOString(),
  }

  cache = { data: result, expiresAt: Date.now() + 5 * 60 * 1000 }
  return result
}
