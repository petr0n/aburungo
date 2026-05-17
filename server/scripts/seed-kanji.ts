import 'dotenv/config'
import { supabase } from './db.js'

const KANJI_API = 'https://kanjiapi.dev/v1'
const BATCH_SIZE = 20
const BATCH_DELAY_MS = 300

type KanjiApiDetail = {
  kanji: string
  grade: number | null
  stroke_count: number
  meanings: string[]
  kun_readings: string[]
  on_readings: string[]
  name_readings: string[]
  jlpt: number | null
  unicode: string
  heisig_en: string | null
}

type KanjiRow = {
  character: string
  meanings: string[]
  on_readings: string[]
  kun_readings: string[]
  stroke_count: number | null
  jlpt_level: number | null
  joyo_grade: number | null
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`)
  }
  return res.json() as Promise<T>
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchKanjiDetail(char: string): Promise<KanjiRow | null> {
  try {
    const encoded = encodeURIComponent(char)
    const detail = await fetchJson<KanjiApiDetail>(`${KANJI_API}/kanji/${encoded}`)
    return {
      character: detail.kanji,
      meanings: detail.meanings,
      on_readings: detail.on_readings,
      kun_readings: detail.kun_readings,
      stroke_count: detail.stroke_count,
      jlpt_level: detail.jlpt,
      joyo_grade: detail.grade,
    }
  } catch (err) {
    console.warn(`  Skipping ${char}: ${err instanceof Error ? err.message : String(err)}`)
    return null
  }
}

async function main(): Promise<void> {
  console.log('Fetching Joyo kanji list...')
  const joyoList = await fetchJson<string[]>(`${KANJI_API}/kanji/joyo`)
  console.log(`  Found ${joyoList.length} Joyo kanji`)

  let upserted = 0
  let skipped = 0

  const totalBatches = Math.ceil(joyoList.length / BATCH_SIZE)

  for (let batchStart = 0; batchStart < joyoList.length; batchStart += BATCH_SIZE) {
    const batchChars = joyoList.slice(batchStart, batchStart + BATCH_SIZE)
    const batchNum = Math.floor(batchStart / BATCH_SIZE) + 1
    console.log(`Seeding kanji batch ${batchNum}/${totalBatches}...`)

    const rows: KanjiRow[] = []
    for (const char of batchChars) {
      const row = await fetchKanjiDetail(char)
      if (row !== null) {
        rows.push(row)
      } else {
        skipped++
      }
    }

    if (rows.length > 0) {
      const { error } = await supabase
        .from('kanji')
        .upsert(rows, { onConflict: 'character' })

      if (error) {
        console.error(`  Upsert error in batch ${batchNum}:`, error.message)
      } else {
        upserted += rows.length
      }
    }

    if (batchStart + BATCH_SIZE < joyoList.length) {
      await sleep(BATCH_DELAY_MS)
    }
  }

  console.log(`\nDone. Upserted: ${upserted}, Skipped: ${skipped}`)
}

export { main as seedKanji }

if (process.argv[1]?.endsWith('seed-kanji.ts') || process.argv[1]?.endsWith('seed-kanji.js')) {
  main().catch((err: unknown) => {
    console.error('seed-kanji failed:', err)
    process.exit(1)
  })
}
