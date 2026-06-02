/**
 * seed-decks.ts
 *
 * Reads all deck YAML files from server/content/decks/ and upserts the
 * `decks` table. Safe to re-run — upserts on slug.
 */

import 'dotenv/config'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { load as yamlLoad } from 'js-yaml'
import { supabase } from './db.js'
import { DeckFileSchema } from '../content/schema.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DECKS_DIR = join(__dirname, '../content/decks')

function loadDeckFiles() {
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

export async function seedDecks(): Promise<void> {
  const decks = loadDeckFiles()
  console.log(`Upserting ${decks.length} decks...`)

  const rows = decks.map(({ slug, title_en, title_ja, description, display_order, jlpt_level }) => ({
    slug,
    title_en,
    title_ja,
    description,
    display_order,
    jlpt_level: jlpt_level ?? null,
  }))

  const { data, error } = await supabase
    .from('decks')
    .upsert(rows, { onConflict: 'slug' })
    .select('id, slug')

  if (error) {
    console.error('Deck upsert failed:', error.message)
    process.exit(1)
  }

  for (const deck of data ?? []) {
    console.log(`  ${deck.slug} → ${deck.id}`)
  }
  console.log(`Done. ${(data ?? []).length} decks upserted.`)
}

if (process.argv[1]?.endsWith('seed-decks.ts') || process.argv[1]?.endsWith('seed-decks.js')) {
  seedDecks().catch((err: unknown) => {
    console.error('seed-decks failed:', err)
    process.exit(1)
  })
}
