/**
 * seed-decks.ts
 *
 * Seeds the `decks` table with practical scenario decks.
 * Upserts on slug so re-running is safe.
 */

import 'dotenv/config'
import { supabase } from './db.js'

type DeckRow = {
  slug: string
  title_en: string
  title_ja: string
  description: string
  display_order: number
}

const DECKS: DeckRow[] = [
  {
    slug: 'restaurant',
    title_en: 'Restaurant',
    title_ja: 'レストランで',
    description: 'Ordering food, asking for the bill, dietary needs',
    display_order: 1,
  },
  {
    slug: 'transit',
    title_en: 'Transit & Transport',
    title_ja: '交通機関',
    description: 'Trains, buses, taxis, asking for directions',
    display_order: 2,
  },
  {
    slug: 'shopping',
    title_en: 'Shopping',
    title_ja: '買い物',
    description: 'Prices, sizes, finding items, checkout',
    display_order: 3,
  },
  {
    slug: 'greetings',
    title_en: 'Greetings',
    title_ja: 'あいさつ',
    description: 'Meeting people, introductions, small talk',
    display_order: 4,
  },
  {
    slug: 'emergency',
    title_en: 'Emergency',
    title_ja: '緊急時',
    description: 'Getting help, medical, police, lost items',
    display_order: 5,
  },
  {
    slug: 'hotel',
    title_en: 'Hotel',
    title_ja: 'ホテルで',
    description: 'Check-in, requests, room issues',
    display_order: 6,
  },
  {
    slug: 'directions',
    title_en: 'Directions',
    title_ja: '道案内',
    description: 'Asking and giving directions on foot',
    display_order: 7,
  },
  {
    slug: 'workplace',
    title_en: 'Workplace',
    title_ja: '職場で',
    description: 'Basic office and work interactions',
    display_order: 8,
  },
]

async function main(): Promise<void> {
  console.log(`Upserting ${DECKS.length} decks...`)

  const { data, error } = await supabase
    .from('decks')
    .upsert(DECKS, { onConflict: 'slug' })
    .select('id, slug')

  if (error) {
    console.error('Upsert failed:', error.message)
    process.exit(1)
  }

  console.log('Upserted decks:')
  for (const deck of data ?? []) {
    console.log(`  ${deck.slug} → ${deck.id}`)
  }
  console.log('Done.')
}

export { main as seedDecks }

if (process.argv[1]?.endsWith('seed-decks.ts') || process.argv[1]?.endsWith('seed-decks.js')) {
  main().catch((err: unknown) => {
    console.error('seed-decks failed:', err)
    process.exit(1)
  })
}
