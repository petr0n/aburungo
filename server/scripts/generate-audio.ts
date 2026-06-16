/**
 * generate-audio.ts
 *
 * Generates VOICEVOX audio for every card in the DB that lacks an audio_url,
 * uploads the WAV to Supabase Storage, and writes the public URL back to
 * cards.audio_url.
 *
 * Prerequisites:
 *   podman run -d -p 50021:50021 voicevox/voicevox_engine:cpu-ubuntu20.04-latest
 *
 * Usage:
 *   SPEAKER_ID=2 npx tsx scripts/generate-audio.ts
 *   npx tsx scripts/generate-audio.ts --all   # re-generate even existing audio
 *
 * Speaker IDs (common):
 *   2  = 四国めたん ノーマル  (female, warm)
 *   3  = ずんだもん ノーマル  (female, distinctive)
 *   8  = 春日部つむぎ ノーマル (female, clear)
 *  11  = 玄野武宏 ノーマル   (male, natural)
 *  30  = No.7 アナウンス     (neutral, announcer)
 */

import 'dotenv/config'
import { supabase } from './db.js'

const VOICEVOX_URL = process.env.VOICEVOX_URL ?? 'http://localhost:50021'
const SPEAKER_ID = parseInt(process.env.SPEAKER_ID ?? '2', 10)
const BUCKET = 'audio'
const REGENERATE_ALL = process.argv.includes('--all')

async function synthesize(text: string): Promise<Buffer> {
  // Step 1: build audio query
  const queryRes = await fetch(
    `${VOICEVOX_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${SPEAKER_ID}`,
    { method: 'POST' },
  )
  if (!queryRes.ok) throw new Error(`audio_query failed: ${queryRes.status}`)
  const query = await queryRes.json()

  // Slow down slightly for clarity
  query.speedScale = 0.9

  // Step 2: synthesize
  const synthRes = await fetch(
    `${VOICEVOX_URL}/synthesis?speaker=${SPEAKER_ID}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    },
  )
  if (!synthRes.ok) throw new Error(`synthesis failed: ${synthRes.status}`)
  return Buffer.from(await synthRes.arrayBuffer())
}

async function uploadAudio(path: string, wav: Buffer): Promise<string> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, wav, {
      contentType: 'audio/wav',
      upsert: true,
    })
  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

async function main() {
  // Check VOICEVOX is reachable
  try {
    const res = await fetch(`${VOICEVOX_URL}/version`)
    const version = await res.text()
    console.log(`VOICEVOX version: ${version.trim()} | speaker: ${SPEAKER_ID}`)
  } catch {
    console.error(`Cannot reach VOICEVOX at ${VOICEVOX_URL}. Is it running?`)
    process.exit(1)
  }

  // Fetch cards that need audio
  const query = supabase.from('cards').select('id, japanese, deck_id, audio_url')
  const { data: cards, error } = REGENERATE_ALL
    ? await query
    : await query.is('audio_url', null)

  if (error) throw new Error(error.message)
  if (!cards || cards.length === 0) {
    console.log('No cards need audio. Run with --all to regenerate existing.')
    return
  }

  console.log(`Generating audio for ${cards.length} card(s)...`)

  let ok = 0
  let failed = 0

  for (const card of cards) {
    const path = `cards/${card.id}.wav`
    try {
      const wav = await synthesize(card.japanese as string)
      const url = await uploadAudio(path, wav)
      const { error: updateError } = await supabase
        .from('cards')
        .update({ audio_url: url })
        .eq('id', card.id)
      if (updateError) throw new Error(updateError.message)
      console.log(`  ✓ ${card.japanese}`)
      ok++
    } catch (err) {
      console.error(`  ✗ ${card.japanese}: ${err instanceof Error ? err.message : err}`)
      failed++
    }

    // Brief pause to avoid overwhelming VOICEVOX
    await new Promise((r) => setTimeout(r, 100))
  }

  console.log(`\nDone. ${ok} succeeded, ${failed} failed.`)
}

main().catch((err: unknown) => {
  console.error('generate-audio failed:', err)
  process.exit(1)
})
