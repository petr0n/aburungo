/**
 * seed-jmdict.ts
 *
 * Source: JMdict for Applications v3.6.2 (CC BY 4.0)
 * File:   server/data/jmdict-examples-eng-3.6.2.json
 *
 * Matches existing cards in the `cards` table to JMdict entries by their
 * `japanese` text (checked against all kanji and kana forms in the entry).
 * Updates `cards.jmdict_id` where a match is found. Safe to re-run.
 *
 * Cards that are full phrases or sentences won't match — that is expected,
 * since JMdict covers words and set phrases, not arbitrary sentences.
 */

import 'dotenv/config'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { supabase } from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '../data')

type JMdictKanji = { text: string; common: boolean; tags: string[] }
type JMdictKana = { text: string; common: boolean; tags: string[]; appliesToKanji: string[] }
type JMdictGloss = { lang: string; gender: string | null; type: string | null; text: string }
type JMdictSense = { partOfSpeech: string[]; gloss: JMdictGloss[]; examples: unknown[] }
type JMdictEntry = {
  id: string
  kanji: JMdictKanji[]
  kana: JMdictKana[]
  sense: JMdictSense[]
}
type JMdictData = {
  version: string
  dictDate: string
  words: JMdictEntry[]
}

function findJMdictFile(): string {
  if (!existsSync(DATA_DIR)) {
    throw new Error(`Data directory not found: ${DATA_DIR}\nDownload jmdict-examples-eng from https://github.com/scriptin/jmdict-simplified/releases`)
  }
  const file = readdirSync(DATA_DIR).find(
    (f) => f.startsWith('jmdict-examples-eng') && f.endsWith('.json'),
  )
  if (!file) {
    throw new Error(
      `No jmdict-examples-eng JSON file found in ${DATA_DIR}\nDownload from https://github.com/scriptin/jmdict-simplified/releases`,
    )
  }
  return join(DATA_DIR, file)
}

function buildIndex(words: JMdictEntry[]): Map<string, number> {
  const index = new Map<string, number>()
  for (const word of words) {
    const id = parseInt(word.id, 10)
    for (const k of word.kanji) {
      if (!index.has(k.text)) index.set(k.text, id)
    }
    for (const k of word.kana) {
      if (!index.has(k.text)) index.set(k.text, id)
    }
  }
  return index
}

export async function seedJmdict(): Promise<void> {
  const jmdictPath = findJMdictFile()
  console.log(`Loading JMdict from ${jmdictPath}...`)
  const raw = JSON.parse(readFileSync(jmdictPath, 'utf8')) as JMdictData
  console.log(`  ${raw.words.length.toLocaleString()} entries (dict date: ${raw.dictDate})`)

  const index = buildIndex(raw.words)
  console.log(`  Index built: ${index.size.toLocaleString()} text forms`)

  const { data: cards, error } = await supabase
    .from('cards')
    .select('id, japanese')
    .is('jmdict_id', null)

  if (error) throw new Error(`Failed to load cards: ${error.message}`)

  const unmatched: string[] = []
  let matched = 0
  let failed = 0

  console.log(`\nMatching ${cards?.length ?? 0} cards...`)

  for (const card of cards ?? []) {
    const japanese = card.japanese as string
    const jmdictId = index.get(japanese)

    if (jmdictId === undefined) {
      unmatched.push(japanese)
      continue
    }

    const { error: updateErr } = await supabase
      .from('cards')
      .update({ jmdict_id: jmdictId })
      .eq('id', card.id as string)

    if (updateErr) {
      console.error(`  Error updating card "${japanese}": ${updateErr.message}`)
      failed++
    } else {
      console.log(`  Matched: ${japanese} → JMdict #${jmdictId}`)
      matched++
    }
  }

  console.log(`\nDone. Matched: ${matched}, Unmatched: ${unmatched.length}, Errors: ${failed}`)

  if (unmatched.length > 0) {
    console.log(
      '\nUnmatched (phrases/sentences not in JMdict — expected):',
    )
    for (const text of unmatched) {
      console.log(`  ${text}`)
    }
  }
}

if (
  process.argv[1]?.endsWith('seed-jmdict.ts') ||
  process.argv[1]?.endsWith('seed-jmdict.js')
) {
  seedJmdict().catch((err: unknown) => {
    console.error('seed-jmdict failed:', err)
    process.exit(1)
  })
}
