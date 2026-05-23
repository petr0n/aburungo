export type KanaRow = readonly (string | null)[]

export type KanaPracticeCard = {
  kana: string
  romaji: string
  alts?: readonly string[]
  group: 'basic' | 'voiced' | 'combos'
  script: 'hiragana' | 'katakana'
}

// Gojuuon order: a-i-u-e-o columns, consonant rows
export const HIRAGANA_BASIC: readonly KanaRow[] = [
  ['あ', 'い', 'う', 'え', 'お'],
  ['か', 'き', 'く', 'け', 'こ'],
  ['さ', 'し', 'す', 'せ', 'そ'],
  ['た', 'ち', 'つ', 'て', 'と'],
  ['な', 'に', 'ぬ', 'ね', 'の'],
  ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  ['ま', 'み', 'む', 'め', 'も'],
  ['や',  null, 'ゆ',  null, 'よ'],
  ['ら', 'り', 'る', 'れ', 'ろ'],
  ['わ',  null,  null, 'を', 'ん'],
]

export const HIRAGANA_VOICED: readonly KanaRow[] = [
  ['が', 'ぎ', 'ぐ', 'げ', 'ご'],
  ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
  ['だ', 'ぢ', 'づ', 'で', 'ど'],
  ['ば', 'び', 'ぶ', 'べ', 'ぼ'],
  ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
]

export const HIRAGANA_SMALL: readonly KanaRow[] = [
  ['ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ'],
  ['っ', 'ゃ', 'ゅ', 'ょ',  null],
]

// Katakana: each character is exactly U+0060 above its hiragana equivalent
function hiraToKata(rows: readonly KanaRow[]): readonly KanaRow[] {
  return rows.map((row) =>
    row.map((cell) =>
      cell === null ? null : String.fromCodePoint(cell.codePointAt(0)! + 0x60),
    ),
  )
}

export const KATAKANA_BASIC = hiraToKata(HIRAGANA_BASIC)
export const KATAKANA_VOICED = hiraToKata(HIRAGANA_VOICED)
export const KATAKANA_SMALL = hiraToKata(HIRAGANA_SMALL)

function toKatakanaStr(s: string): string {
  return s.replace(/[ぁ-ゖ]/g, (c) =>
    String.fromCodePoint(c.codePointAt(0)! + 0x60),
  )
}

const HIRAGANA_PRACTICE_CARDS: readonly KanaPracticeCard[] = [
  // Basic hiragana (46)
  { kana: 'あ', romaji: 'a', group: 'basic', script: 'hiragana' },
  { kana: 'い', romaji: 'i', group: 'basic', script: 'hiragana' },
  { kana: 'う', romaji: 'u', group: 'basic', script: 'hiragana' },
  { kana: 'え', romaji: 'e', group: 'basic', script: 'hiragana' },
  { kana: 'お', romaji: 'o', group: 'basic', script: 'hiragana' },
  { kana: 'か', romaji: 'ka', group: 'basic', script: 'hiragana' },
  { kana: 'き', romaji: 'ki', group: 'basic', script: 'hiragana' },
  { kana: 'く', romaji: 'ku', group: 'basic', script: 'hiragana' },
  { kana: 'け', romaji: 'ke', group: 'basic', script: 'hiragana' },
  { kana: 'こ', romaji: 'ko', group: 'basic', script: 'hiragana' },
  { kana: 'さ', romaji: 'sa', group: 'basic', script: 'hiragana' },
  { kana: 'し', romaji: 'shi', alts: ['si'], group: 'basic', script: 'hiragana' },
  { kana: 'す', romaji: 'su', group: 'basic', script: 'hiragana' },
  { kana: 'せ', romaji: 'se', group: 'basic', script: 'hiragana' },
  { kana: 'そ', romaji: 'so', group: 'basic', script: 'hiragana' },
  { kana: 'た', romaji: 'ta', group: 'basic', script: 'hiragana' },
  { kana: 'ち', romaji: 'chi', alts: ['ti'], group: 'basic', script: 'hiragana' },
  { kana: 'つ', romaji: 'tsu', alts: ['tu'], group: 'basic', script: 'hiragana' },
  { kana: 'て', romaji: 'te', group: 'basic', script: 'hiragana' },
  { kana: 'と', romaji: 'to', group: 'basic', script: 'hiragana' },
  { kana: 'な', romaji: 'na', group: 'basic', script: 'hiragana' },
  { kana: 'に', romaji: 'ni', group: 'basic', script: 'hiragana' },
  { kana: 'ぬ', romaji: 'nu', group: 'basic', script: 'hiragana' },
  { kana: 'ね', romaji: 'ne', group: 'basic', script: 'hiragana' },
  { kana: 'の', romaji: 'no', group: 'basic', script: 'hiragana' },
  { kana: 'は', romaji: 'ha', group: 'basic', script: 'hiragana' },
  { kana: 'ひ', romaji: 'hi', group: 'basic', script: 'hiragana' },
  { kana: 'ふ', romaji: 'fu', alts: ['hu'], group: 'basic', script: 'hiragana' },
  { kana: 'へ', romaji: 'he', group: 'basic', script: 'hiragana' },
  { kana: 'ほ', romaji: 'ho', group: 'basic', script: 'hiragana' },
  { kana: 'ま', romaji: 'ma', group: 'basic', script: 'hiragana' },
  { kana: 'み', romaji: 'mi', group: 'basic', script: 'hiragana' },
  { kana: 'む', romaji: 'mu', group: 'basic', script: 'hiragana' },
  { kana: 'め', romaji: 'me', group: 'basic', script: 'hiragana' },
  { kana: 'も', romaji: 'mo', group: 'basic', script: 'hiragana' },
  { kana: 'や', romaji: 'ya', group: 'basic', script: 'hiragana' },
  { kana: 'ゆ', romaji: 'yu', group: 'basic', script: 'hiragana' },
  { kana: 'よ', romaji: 'yo', group: 'basic', script: 'hiragana' },
  { kana: 'ら', romaji: 'ra', group: 'basic', script: 'hiragana' },
  { kana: 'り', romaji: 'ri', group: 'basic', script: 'hiragana' },
  { kana: 'る', romaji: 'ru', group: 'basic', script: 'hiragana' },
  { kana: 'れ', romaji: 're', group: 'basic', script: 'hiragana' },
  { kana: 'ろ', romaji: 'ro', group: 'basic', script: 'hiragana' },
  { kana: 'わ', romaji: 'wa', group: 'basic', script: 'hiragana' },
  { kana: 'を', romaji: 'wo', alts: ['o'], group: 'basic', script: 'hiragana' },
  { kana: 'ん', romaji: 'n', alts: ['nn'], group: 'basic', script: 'hiragana' },
  // Voiced hiragana (25)
  { kana: 'が', romaji: 'ga', group: 'voiced', script: 'hiragana' },
  { kana: 'ぎ', romaji: 'gi', group: 'voiced', script: 'hiragana' },
  { kana: 'ぐ', romaji: 'gu', group: 'voiced', script: 'hiragana' },
  { kana: 'げ', romaji: 'ge', group: 'voiced', script: 'hiragana' },
  { kana: 'ご', romaji: 'go', group: 'voiced', script: 'hiragana' },
  { kana: 'ざ', romaji: 'za', group: 'voiced', script: 'hiragana' },
  { kana: 'じ', romaji: 'ji', alts: ['zi'], group: 'voiced', script: 'hiragana' },
  { kana: 'ず', romaji: 'zu', group: 'voiced', script: 'hiragana' },
  { kana: 'ぜ', romaji: 'ze', group: 'voiced', script: 'hiragana' },
  { kana: 'ぞ', romaji: 'zo', group: 'voiced', script: 'hiragana' },
  { kana: 'だ', romaji: 'da', group: 'voiced', script: 'hiragana' },
  { kana: 'ぢ', romaji: 'di', alts: ['ji'], group: 'voiced', script: 'hiragana' },
  { kana: 'づ', romaji: 'du', alts: ['zu'], group: 'voiced', script: 'hiragana' },
  { kana: 'で', romaji: 'de', group: 'voiced', script: 'hiragana' },
  { kana: 'ど', romaji: 'do', group: 'voiced', script: 'hiragana' },
  { kana: 'ば', romaji: 'ba', group: 'voiced', script: 'hiragana' },
  { kana: 'び', romaji: 'bi', group: 'voiced', script: 'hiragana' },
  { kana: 'ぶ', romaji: 'bu', group: 'voiced', script: 'hiragana' },
  { kana: 'べ', romaji: 'be', group: 'voiced', script: 'hiragana' },
  { kana: 'ぼ', romaji: 'bo', group: 'voiced', script: 'hiragana' },
  { kana: 'ぱ', romaji: 'pa', group: 'voiced', script: 'hiragana' },
  { kana: 'ぴ', romaji: 'pi', group: 'voiced', script: 'hiragana' },
  { kana: 'ぷ', romaji: 'pu', group: 'voiced', script: 'hiragana' },
  { kana: 'ぺ', romaji: 'pe', group: 'voiced', script: 'hiragana' },
  { kana: 'ぽ', romaji: 'po', group: 'voiced', script: 'hiragana' },
  // Combos / youon (33)
  { kana: 'きゃ', romaji: 'kya', group: 'combos', script: 'hiragana' },
  { kana: 'きゅ', romaji: 'kyu', group: 'combos', script: 'hiragana' },
  { kana: 'きょ', romaji: 'kyo', group: 'combos', script: 'hiragana' },
  { kana: 'しゃ', romaji: 'sha', alts: ['sya'], group: 'combos', script: 'hiragana' },
  { kana: 'しゅ', romaji: 'shu', alts: ['syu'], group: 'combos', script: 'hiragana' },
  { kana: 'しょ', romaji: 'sho', alts: ['syo'], group: 'combos', script: 'hiragana' },
  { kana: 'ちゃ', romaji: 'cha', alts: ['tya', 'cya'], group: 'combos', script: 'hiragana' },
  { kana: 'ちゅ', romaji: 'chu', alts: ['tyu', 'cyu'], group: 'combos', script: 'hiragana' },
  { kana: 'ちょ', romaji: 'cho', alts: ['tyo', 'cyo'], group: 'combos', script: 'hiragana' },
  { kana: 'にゃ', romaji: 'nya', group: 'combos', script: 'hiragana' },
  { kana: 'にゅ', romaji: 'nyu', group: 'combos', script: 'hiragana' },
  { kana: 'にょ', romaji: 'nyo', group: 'combos', script: 'hiragana' },
  { kana: 'ひゃ', romaji: 'hya', group: 'combos', script: 'hiragana' },
  { kana: 'ひゅ', romaji: 'hyu', group: 'combos', script: 'hiragana' },
  { kana: 'ひょ', romaji: 'hyo', group: 'combos', script: 'hiragana' },
  { kana: 'みゃ', romaji: 'mya', group: 'combos', script: 'hiragana' },
  { kana: 'みゅ', romaji: 'myu', group: 'combos', script: 'hiragana' },
  { kana: 'みょ', romaji: 'myo', group: 'combos', script: 'hiragana' },
  { kana: 'りゃ', romaji: 'rya', group: 'combos', script: 'hiragana' },
  { kana: 'りゅ', romaji: 'ryu', group: 'combos', script: 'hiragana' },
  { kana: 'りょ', romaji: 'ryo', group: 'combos', script: 'hiragana' },
  { kana: 'ぎゃ', romaji: 'gya', group: 'combos', script: 'hiragana' },
  { kana: 'ぎゅ', romaji: 'gyu', group: 'combos', script: 'hiragana' },
  { kana: 'ぎょ', romaji: 'gyo', group: 'combos', script: 'hiragana' },
  { kana: 'じゃ', romaji: 'ja', alts: ['jya', 'zya'], group: 'combos', script: 'hiragana' },
  { kana: 'じゅ', romaji: 'ju', alts: ['jyu', 'zyu'], group: 'combos', script: 'hiragana' },
  { kana: 'じょ', romaji: 'jo', alts: ['jyo', 'zyo'], group: 'combos', script: 'hiragana' },
  { kana: 'びゃ', romaji: 'bya', group: 'combos', script: 'hiragana' },
  { kana: 'びゅ', romaji: 'byu', group: 'combos', script: 'hiragana' },
  { kana: 'びょ', romaji: 'byo', group: 'combos', script: 'hiragana' },
  { kana: 'ぴゃ', romaji: 'pya', group: 'combos', script: 'hiragana' },
  { kana: 'ぴゅ', romaji: 'pyu', group: 'combos', script: 'hiragana' },
  { kana: 'ぴょ', romaji: 'pyo', group: 'combos', script: 'hiragana' },
]

const KATAKANA_PRACTICE_CARDS: readonly KanaPracticeCard[] = HIRAGANA_PRACTICE_CARDS.map(
  (card) => ({ ...card, kana: toKatakanaStr(card.kana), script: 'katakana' as const }),
)

export const KANA_PRACTICE_CARDS: readonly KanaPracticeCard[] = [
  ...HIRAGANA_PRACTICE_CARDS,
  ...KATAKANA_PRACTICE_CARDS,
]
