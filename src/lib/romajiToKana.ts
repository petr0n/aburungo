/**
 * Romaji → hiragana converter.
 *
 * Processes left-to-right, greedy longest match. Returns a split result so
 * callers can style the pending (uncommitted) suffix differently in the UI.
 *
 * n-before-vowel:   na/ni/nu/ne/no → な/に/ぬ/ね/の  (MAP match)
 * n-before-consonant: 'n' + non-n consonant → ん + consonant
 * nn-before-vowel:  'nn' + vowel → ん + na/ni row (first n = ん, second starts new syllable)
 * nn alone/before consonant: → ん  (MAP match)
 * double-consonant: CC (not n) → っ + second C
 */

export type ConversionResult = {
  /** Fully converted hiragana. */
  converted: string
  /** Trailing romaji not yet committed — partial syllable in progress. */
  pending: string
}

// Ordered longest → shortest so greedy match always picks the right entry.
const ROMAJI_MAP: readonly [string, string][] = [
  // 3-char compound sounds
  ['sha', 'しゃ'], ['shi', 'し'], ['shu', 'しゅ'], ['she', 'しぇ'], ['sho', 'しょ'],
  ['sya', 'しゃ'], ['syu', 'しゅ'], ['syo', 'しょ'],
  ['chi', 'ち'],   ['cha', 'ちゃ'], ['chu', 'ちゅ'], ['che', 'ちぇ'], ['cho', 'ちょ'],
  ['tya', 'ちゃ'], ['tyu', 'ちゅ'], ['tyo', 'ちょ'],
  ['tsu', 'つ'],
  ['kya', 'きゃ'], ['kyu', 'きゅ'], ['kyo', 'きょ'],
  ['nya', 'にゃ'], ['nyu', 'にゅ'], ['nyo', 'にょ'],
  ['hya', 'ひゃ'], ['hyu', 'ひゅ'], ['hyo', 'ひょ'],
  ['mya', 'みゃ'], ['myu', 'みゅ'], ['myo', 'みょ'],
  ['rya', 'りゃ'], ['ryu', 'りゅ'], ['ryo', 'りょ'],
  ['gya', 'ぎゃ'], ['gyu', 'ぎゅ'], ['gyo', 'ぎょ'],
  ['zya', 'じゃ'], ['zyu', 'じゅ'], ['zyo', 'じょ'],
  ['bya', 'びゃ'], ['byu', 'びゅ'], ['byo', 'びょ'],
  ['pya', 'ぴゃ'], ['pyu', 'ぴゅ'], ['pyo', 'ぴょ'],
  ['dya', 'ぢゃ'], ['dyu', 'ぢゅ'], ['dyo', 'ぢょ'],
  // 2-char
  ['ka', 'か'], ['ki', 'き'], ['ku', 'く'], ['ke', 'け'], ['ko', 'こ'],
  ['sa', 'さ'], ['si', 'し'], ['su', 'す'], ['se', 'せ'], ['so', 'そ'],
  ['ta', 'た'], ['ti', 'ち'], ['tu', 'つ'], ['te', 'て'], ['to', 'と'],
  ['na', 'な'], ['ni', 'に'], ['nu', 'ぬ'], ['ne', 'ね'], ['no', 'の'],
  ['ha', 'は'], ['hi', 'ひ'], ['fu', 'ふ'], ['hu', 'ふ'], ['he', 'へ'], ['ho', 'ほ'],
  ['ma', 'ま'], ['mi', 'み'], ['mu', 'む'], ['me', 'め'], ['mo', 'も'],
  ['ya', 'や'], ['yu', 'ゆ'], ['yo', 'よ'],
  ['ra', 'ら'], ['ri', 'り'], ['ru', 'る'], ['re', 'れ'], ['ro', 'ろ'],
  ['wa', 'わ'], ['wi', 'ゐ'], ['we', 'ゑ'], ['wo', 'を'],
  ['ga', 'が'], ['gi', 'ぎ'], ['gu', 'ぐ'], ['ge', 'げ'], ['go', 'ご'],
  ['za', 'ざ'], ['zi', 'じ'], ['zu', 'ず'], ['ze', 'ぜ'], ['zo', 'ぞ'],
  ['ji', 'じ'], ['ja', 'じゃ'], ['ju', 'じゅ'], ['je', 'じぇ'], ['jo', 'じょ'],
  ['da', 'だ'], ['di', 'ぢ'], ['du', 'づ'], ['de', 'で'], ['do', 'ど'],
  ['ba', 'ば'], ['bi', 'び'], ['bu', 'ぶ'], ['be', 'べ'], ['bo', 'ぼ'],
  ['pa', 'ぱ'], ['pi', 'ぴ'], ['pu', 'ぷ'], ['pe', 'ぺ'], ['po', 'ぽ'],
  ['xa', 'ぁ'], ['xi', 'ぃ'], ['xu', 'ぅ'], ['xe', 'ぇ'], ['xo', 'ぉ'],
  ['nn', 'ん'],
  // 1-char vowels
  ['a', 'あ'], ['i', 'い'], ['u', 'う'], ['e', 'え'], ['o', 'お'],
]

const CONSONANTS = new Set('bcdfghjklmnpqrstvwxyz')
const VOWELS = new Set('aeiou')

export function convertRomaji(input: string): ConversionResult {
  const lower = input.toLowerCase()
  let pos = 0
  let converted = ''

  while (pos < lower.length) {
    const remaining = lower.slice(pos)

    // Double-consonant (not 'n'): CC... → っ + second C...
    if (
      remaining.length >= 2 &&
      remaining[0] === remaining[1] &&
      CONSONANTS.has(remaining[0]) &&
      remaining[0] !== 'n'
    ) {
      converted += 'っ'
      pos += 1
      continue
    }

    // 'nn' before a vowel: first 'n' → ん, leave second 'n' to start next syllable
    if (
      remaining.length >= 3 &&
      remaining[0] === 'n' &&
      remaining[1] === 'n' &&
      VOWELS.has(remaining[2])
    ) {
      converted += 'ん'
      pos += 1
      continue
    }

    // Single 'n' before a non-n consonant → ん
    if (
      remaining[0] === 'n' &&
      remaining.length >= 2 &&
      CONSONANTS.has(remaining[1]) &&
      remaining[1] !== 'n' &&
      !VOWELS.has(remaining[1])
    ) {
      converted += 'ん'
      pos += 1
      continue
    }

    // Greedy MAP match (longest first)
    let matched = false
    for (const [romaji, kana] of ROMAJI_MAP) {
      if (remaining.startsWith(romaji)) {
        converted += kana
        pos += romaji.length
        matched = true
        break
      }
    }
    if (matched) continue

    // Remaining string is a prefix of a valid sequence → pending, stop
    const isPending = ROMAJI_MAP.some(([romaji]) => romaji.startsWith(remaining))
    if (isPending) break

    // Unknown — pass through as-is
    converted += remaining[0]
    pos += 1
  }

  return { converted, pending: lower.slice(pos) }
}

/** Finalize: commit trailing 'n' as ん (called on submit, not on every keystroke). */
export function finalizeRomaji(input: string): string {
  const { converted, pending } = convertRomaji(input)
  if (pending === 'n') return converted + 'ん'
  return converted + pending
}
