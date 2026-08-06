/**
 * Verify every example: in vocabulary YAML against the Tatoeba source.
 *
 * The schema only checks that a tatoeba_id is present, not that it is real or
 * that the sentence matches it. That gap let a wrong id and a paraphrased
 * translation through during authoring, so this closes it: each example's id
 * must exist in the dataset and its Japanese must match that sentence exactly.
 *
 * Usage: pnpm tsx server/scripts/verify-examples.ts
 * Exits non-zero on any mismatch, so it can gate a commit.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.resolve(here, '../..')
const JMDICT = path.join(REPO, 'server/data/jmdict-examples-eng-3.6.2.json')

const dict = JSON.parse(fs.readFileSync(JMDICT, 'utf8')) as {
  words: Array<{ sense?: Array<{ examples?: Array<Record<string, unknown>> }> }>
}

const byId = new Map<string, { jp: string; en: string }>()
for (const w of dict.words) {
  for (const s of w.sense ?? []) {
    for (const ex of s.examples ?? []) {
      const sentences = (ex.sentences ?? []) as Array<{ lang: string; text: string }>
      const jp = sentences.find((x) => x.lang === 'jpn')?.text
      const en = sentences.find((x) => x.lang === 'eng')?.text
      const id = (ex.source as { value?: string } | undefined)?.value
      if (jp && en && id) byId.set(id, { jp, en })
    }
  }
}

const dir = path.join(REPO, 'src/content/vocabulary')
let checked = 0
const problems: string[] = []

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.yaml'))) {
  const text = fs.readFileSync(path.join(dir, file), 'utf8')
  // Examples are a fixed three-line block; a YAML parser would be overkill here.
  const re = /example:\s*\n\s*japanese:\s*(.+)\n\s*english:\s*(.+)\n\s*tatoeba_id:\s*"(\d+)"/g
  for (const m of text.matchAll(re)) {
    checked++
    const [, jp, en, id] = m
    const src = byId.get(id!)
    if (!src) {
      problems.push(`${file}: tatoeba #${id} not found in dataset  (${jp})`)
    } else if (src.jp !== jp!.trim()) {
      problems.push(`${file}: #${id} japanese mismatch\n    yaml: ${jp!.trim()}\n    src:  ${src.jp}`)
    } else if (src.en !== en!.trim()) {
      problems.push(`${file}: #${id} english mismatch\n    yaml: ${en!.trim()}\n    src:  ${src.en}`)
    }
  }
}

console.log(`Checked ${checked} examples`)
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`)
  for (const p of problems) console.error(`  ${p}`)
  process.exit(1)
}
console.log('All examples match their Tatoeba source.')
