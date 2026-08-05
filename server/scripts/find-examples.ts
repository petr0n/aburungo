/**
 * Find verified Tatoeba example sentences for vocabulary words.
 *
 * Content rules forbid composing Japanese sentences, so every `example:` block in
 * vocabulary YAML must come from a real source. This reads the Tatoeba sentences
 * embedded in the JMdict-examples dataset and prints ready-to-paste YAML.
 *
 * Usage:
 *   pnpm tsx server/scripts/find-examples.ts 大きい 小さい
 *   pnpm tsx server/scripts/find-examples.ts --missing   (words in YAML lacking an example)
 *
 * Candidates are ranked by how much of the sentence the learner already knows (the
 * i+1 idea the roadmap uses for graded reading), then by length. Ranking on length
 * alone surfaces sentences like 塩水の方が淡水よりも浮力が大きい for 大きい — short, but
 * full of N2 kanji, so useless to an N5 learner.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.resolve(here, '../..')
const JMDICT = path.join(REPO, 'server/data/jmdict-examples-eng-3.6.2.json')

type Sentence = { jp: string; en: string; id: string }

function loadSentences(): Sentence[] {
  if (!fs.existsSync(JMDICT)) {
    console.error(`Missing ${JMDICT} — see docs/data-sources.md`)
    process.exit(1)
  }
  const dict = JSON.parse(fs.readFileSync(JMDICT, 'utf8')) as {
    words: Array<{ sense?: Array<{ examples?: Array<Record<string, unknown>> }> }>
  }

  const byId = new Map<string, Sentence>()
  for (const w of dict.words) {
    for (const s of w.sense ?? []) {
      for (const ex of s.examples ?? []) {
        const sentences = (ex.sentences ?? []) as Array<{ lang: string; text: string }>
        const jp = sentences.find((x) => x.lang === 'jpn')?.text
        const en = sentences.find((x) => x.lang === 'eng')?.text
        const id = (ex.source as { value?: string } | undefined)?.value
        if (jp && en && id && !byId.has(id)) byId.set(id, { jp, en, id })
      }
    }
  }
  return [...byId.values()]
}

/**
 * Kanji appearing anywhere in the existing N5 vocabulary and phrase content.
 * Read with a regex rather than a YAML parser: only the `japanese:` values are
 * needed, and this keeps the script dependency-free.
 */
function knownKanji(): Set<string> {
  const kanji = new Set<string>()
  for (const dir of ['src/content/vocabulary', 'src/content/phrases']) {
    const full = path.join(REPO, dir)
    if (!fs.existsSync(full)) continue
    for (const f of fs.readdirSync(full).filter((f) => f.endsWith('.yaml'))) {
      const text = fs.readFileSync(path.join(full, f), 'utf8')
      for (const m of text.matchAll(/^\s*japanese:\s*(.+)$/gm)) {
        for (const ch of m[1]!) {
          if (/[一-龯]/.test(ch)) kanji.add(ch)
        }
      }
    }
  }
  return kanji
}

/** Count of kanji in the sentence the learner has not met. Lower is better. */
function unknownCount(sentence: string, known: Set<string>): number {
  let n = 0
  for (const ch of sentence) {
    if (/[一-龯]/.test(ch) && !known.has(ch)) n++
  }
  return n
}

function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Usage: tsx server/scripts/find-examples.ts <word> [word...]')
    process.exit(1)
  }

  const sentences = loadSentences()
  const known = knownKanji()
  console.error(`Loaded ${sentences.length} Tatoeba sentences, ${known.size} known kanji\n`)

  for (const word of args) {
    const hits = sentences
      .filter((s) => s.jp.includes(word))
      .map((s) => ({ s, unknown: unknownCount(s.jp, known) }))
      .sort((a, b) => a.unknown - b.unknown || a.s.jp.length - b.s.jp.length)

    if (hits.length === 0) {
      console.log(`# ${word}: NO EXAMPLE FOUND — leave example: unset rather than inventing one\n`)
      continue
    }
    // Candidates only — the top hit is NOT safe to paste unreviewed. Two traps:
    // substring matches (いつ matches inside そいつ, a different word), and the
    // kanji score favouring kana-heavy sentences, which surfaces things like
    // "I have a lot of phlegm" for たくさん. A human picks from this list.
    console.log(`# ${word} — ${hits.length} candidates, review before use:`)
    for (const { s, unknown } of hits.slice(0, 8)) {
      console.log(`  ${s.jp}`)
      console.log(`      ${s.en}  [tatoeba #${s.id}, ${unknown} unfamiliar kanji]`)
    }
    console.log()
  }
}

main()
