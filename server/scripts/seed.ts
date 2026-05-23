/**
 * seed.ts — Orchestrator. Runs all seed scripts in dependency order.
 *
 * Run:  npm run seed          (all)
 *       npm run seed:decks    (decks only)
 *       npm run seed:cards    (cards only — requires decks to exist)
 *       npm run seed:kanji    (kanji only)
 *
 * All seeds are idempotent — safe to re-run. Re-seeding updates existing
 * rows and adds new ones; it never deletes.
 */

import 'dotenv/config'
import { seedDecks } from './seed-decks.js'
import { seedCards } from './seed-cards.js'
import { seedKanji } from './seed-kanji.js'
import { seedJmdict } from './seed-jmdict.js'

async function main(): Promise<void> {
  console.log('=== Seeding decks ===')
  await seedDecks()

  console.log('\n=== Seeding cards ===')
  await seedCards()

  console.log('\n=== Matching cards to JMdict ===')
  await seedJmdict()

  console.log('\n=== Seeding kanji ===')
  await seedKanji()

  console.log('\n=== All seeds complete ===')
}

main().catch((err: unknown) => {
  console.error('seed failed:', err)
  process.exit(1)
})
