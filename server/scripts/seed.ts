/**
 * seed.ts
 *
 * Orchestrator: runs all seed scripts in order.
 * Run with: npm run seed
 */

import 'dotenv/config'
import { seedDecks } from './seed-decks.js'
import { seedKanji } from './seed-kanji.js'

async function main(): Promise<void> {
  console.log('=== Seeding decks ===')
  await seedDecks()

  console.log('\n=== Seeding kanji ===')
  await seedKanji()

  console.log('\n=== All seeds complete ===')
}

main().catch((err: unknown) => {
  console.error('seed failed:', err)
  process.exit(1)
})
