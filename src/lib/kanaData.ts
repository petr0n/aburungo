export type KanaRow = readonly (string | null)[]

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
