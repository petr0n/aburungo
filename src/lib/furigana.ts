/**
 * Furigana segmentation — pure, dependency-free.
 *
 * We have a word's surface form (`japanese`, may contain kanji) and its full
 * hiragana `reading`, but no per-kanji alignment. A true per-character split of
 * a compound (日本 -> 日/本) needs a dictionary we don't ship, so instead we:
 *
 *   1. Strip the shared leading kana (e.g. honorific お in お茶 / おちゃ).
 *   2. Strip the shared trailing kana (okurigana, e.g. べる in 食べる / たべる).
 *   3. Put the remaining reading as furigana over the remaining kanji core.
 *
 * That covers the common N5 shapes — kanji stem + kana okurigana, honorific
 * prefix + kanji, bare compound — and degrades to a whole-word reading over a
 * compound rather than a wrong split. Pure kana words get no ruby.
 */

const KANJI_RE = /[㐀-䶿一-鿿豈-﫿]/;

export type FuriganaSegment = {
  /** The surface text for this run. */
  text: string;
  /** Reading to render above `text`. Absent for plain (kana) runs. */
  ruby?: string;
};

function hasKanji(s: string): boolean {
  return KANJI_RE.test(s);
}

/**
 * Split a word into furigana segments. Returns a single plain segment when
 * there is no kanji to annotate (pure kana, katakana loanwords, or a reading
 * that already equals the surface form).
 */
export function splitFurigana(japanese: string, reading: string): FuriganaSegment[] {
  if (!reading || japanese === reading || !hasKanji(japanese)) {
    return [{ text: japanese }];
  }

  const j = japanese;
  const r = reading;

  // Shared leading kana (kanji never equals a hiragana char, so this stops at
  // the first kanji automatically).
  let pre = 0;
  while (pre < j.length && pre < r.length && j[pre] === r[pre]) pre++;

  // Shared trailing kana.
  let suf = 0;
  while (
    suf < j.length - pre &&
    suf < r.length - pre &&
    j[j.length - 1 - suf] === r[r.length - 1 - suf]
  ) {
    suf++;
  }

  const coreJ = j.slice(pre, j.length - suf);
  const coreR = r.slice(pre, r.length - suf);

  // If the core has no kanji or we somehow have no reading for it, bail to plain.
  if (coreJ === "" || coreR === "" || !hasKanji(coreJ)) {
    return [{ text: japanese }];
  }

  const segments: FuriganaSegment[] = [];
  if (pre > 0) segments.push({ text: j.slice(0, pre) });
  segments.push({ text: coreJ, ruby: coreR });
  if (suf > 0) segments.push({ text: j.slice(j.length - suf) });
  return segments;
}
