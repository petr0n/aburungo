/**
 * seed-cards.ts
 *
 * Reads all deck YAML files from server/content/decks/ and upserts the
 * `cards` table. Safe to re-run — upserts on (deck_id, japanese).
 * Preserves audio_url on existing rows.
 */

import 'dotenv/config'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { load as yamlLoad } from 'js-yaml'
import { supabase } from './db.js'
import { DeckFileSchema } from '../content/schema.js'
import type { DeckFile } from '../content/schema.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DECKS_DIR = join(__dirname, '../content/decks')

function loadDeckFiles(): DeckFile[] {
  const files = readdirSync(DECKS_DIR)
    .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
    .sort()

  return files.map((file) => {
    const raw = yamlLoad(readFileSync(join(DECKS_DIR, file), 'utf8'))
    const result = DeckFileSchema.safeParse(raw)
    if (!result.success) {
      throw new Error(`Invalid deck file ${file}:\n${result.error.toString()}`)
    }
    return result.data
  })
}

export async function seedCards(): Promise<void> {
  const decks = loadDeckFiles()

  // Load deck id map (slug → id) — decks must exist first
  const { data: deckRows, error: deckErr } = await supabase
    .from('decks')
    .select('id, slug')

  if (deckErr) throw new Error(`Failed to load decks: ${deckErr.message}`)

  const deckIdMap = new Map((deckRows ?? []).map((r) => [r.slug as string, r.id as string]))

  let totalUpserted = 0
  let totalSkipped = 0

  for (const deck of decks) {
    const deckId = deckIdMap.get(deck.slug)
    if (!deckId) {
      console.warn(`  Deck "${deck.slug}" not found in DB — run seed:decks first`)
      totalSkipped += deck.cards.length
      continue
    }

    const rows = deck.cards.map((card, index) => ({
      deck_id: deckId,
      japanese: card.japanese,
      reading: card.reading,
      romaji: card.romaji,
      english: card.english,
      notes: card.notes ?? null,
      display_order: index + 1,
    }))

    const { data, error } = await supabase
      .from('cards')
      .upsert(rows, { onConflict: 'deck_id,japanese', ignoreDuplicates: false })
      .select('id')

    if (error) {
      console.error(`  Error upserting cards for "${deck.slug}": ${error.message}`)
      totalSkipped += rows.length
    } else {
      const count = (data ?? []).length
      console.log(`  ${deck.slug}: ${count} cards upserted`)
      totalUpserted += count
    }
  }

  console.log(`\nDone. Upserted: ${totalUpserted}, Skipped: ${totalSkipped}`)
}

if (process.argv[1]?.endsWith('seed-cards.ts') || process.argv[1]?.endsWith('seed-cards.js')) {
  seedCards().catch((err: unknown) => {
    console.error('seed-cards failed:', err)
    process.exit(1)
  })
}
