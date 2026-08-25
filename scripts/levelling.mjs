/**
 * i+1 levelling: tokenize a sentence against taught items, measure how much of
 * it a given learner knows, and tag it by the items it uses. Pure functions
 * only — no fs, no clock, no CLI. The CLI lives in scripts/reading.mjs.
 *
 * ── How coverage works, and what it honestly is ───────────────────────────
 * The flow target for extensive reading is ~98% known tokens (Hu & Nation;
 * docs/plans/04-stage-reading.md §5). That research counts *running words*, function
 * words included, so structural machinery (particles, polite endings) counts
 * in the denominator here too — a learner who can read は and ます is exactly
 * what "function words are known" means at this level.
 *
 * Tokenization is greedy longest-match against the taught vocabulary, the same
 * approach as scripts/jlpt.mjs, because a real morphological analyzer is a
 * heavy dependency this pipeline does not need yet. Known limitations, found
 * on real corpus runs rather than guessed:
 *
 *   - Inflection is handled by kanji-prefix matching (食べます matches via 食べ),
 *     so a verb written entirely in kana (あらいます for 洗う) is missed unless
 *     the kana dictionary form appears verbatim. Same limit as jlpt.mjs.
 *   - Compounds hiding in plain sight (何人 = 何 + 人, both taught) are caught
 *     by the JMdict common-form guard, but only for compounds JMdict flags
 *     common. A rare compound still segments into its taught parts.
 *   - An unknown compound whose *first* character fails to match splits into
 *     an unknown run plus any taught tail (外国 with only 国 taught tags 国),
 *     slightly inflating coverage.
 *   - The structural list marks grammar machinery as known unconditionally, so
 *     coverage cannot see an unknown *grammar pattern* — only unknown words.
 *     Grammar readiness is a tagging question (grammarIds), not a coverage one.
 *   - A form shared by several taught items credits the sentence if *any* of
 *     them is known; itemIds carries every candidate rather than guessing.
 *
 * ponytail: heuristic tokenizer with documented misses; swap in a real
 * analyzer (e.g. a WASM kuromoji build) only if measured error on real
 * corpus runs proves too high for the reader UI.
 */

const KANJI = /[一-龯々]/;
const JAPANESE = /[ぁ-ゖァ-ヺー一-龯々]/;
export const hasKanji = (s) => KANJI.test(s);

/**
 * Grammar machinery treated as known structure: particles, the copula and
 * polite endings, and the conjugation fragments left behind once a verb's
 * kanji stem has matched (行って leaves って, 買った leaves った). Curated, not
 * exhaustive — anything missing shows up as a small unknown run, which
 * understates coverage rather than overstating it, the safe direction.
 */
export const STRUCTURAL = [
  // particles
  "は", "が", "を", "に", "で", "と", "も", "の", "へ", "や", "か", "ね", "よ", "な", "わ",
  "から", "まで", "より", "だけ", "しか", "ぐらい", "くらい", "でも", "には", "では", "とは", "にも", "かも",
  // copula and polite machinery
  "です", "でした", "でしょう", "ですか", "ではありません", "じゃありません", "ではない", "じゃない",
  "ます", "ました", "ません", "ませんでした", "ましょう", "ませんか",
  // endings and connectives left after a matched stem
  "る", "て", "た", "だ", "って", "った", "ない", "なかった", "なくて", "ないで",
  "たい", "たかった", "ている", "ています", "ていました", "ていた", "てください", "ください",
  "そう", "よう", "ので", "のに", "けど", "けれど", "たら", "なら", "ば", "ても",
];
const STRUCTURAL_SET = new Set(STRUCTURAL);
const STRUCT_MAX = Math.max(...STRUCTURAL.map((s) => s.length));
const COMPOUND_MAX = 8; // same cap as jlpt.mjs runCovered

/**
 * Index taught words for segmentation: every surface form and reading, plus
 * kanji-initial prefixes so inflected forms match their stem — the same trick
 * as segmentationVocab in jlpt.mjs, but keeping *which* item each form belongs
 * to, because levelling needs to name the unknown, not just count it.
 */
export function buildLexicon(words, dictForms) {
  const forms = new Map();
  const add = (form, id) => {
    const ids = forms.get(form);
    if (ids) { if (!ids.includes(id)) ids.push(id); }
    else forms.set(form, [id]);
  };
  for (const w of words) {
    for (const f of [w.japanese, w.reading]) {
      const t = f?.trim();
      if (!t) continue;
      add(t, w.id);
      // Prefixes only for kanji forms: 食 stands for 食べます, but a loanword
      // must match whole — a katakana prefix would wave anything through.
      if (hasKanji(t)) for (let i = 1; i < t.length; i++) add(t.slice(0, i), w.id);
    }
  }
  let maxLen = 0;
  for (const f of forms.keys()) if (f.length > maxLen) maxLen = f.length;
  return { forms, maxLen, dictForms: dictForms ?? null };
}

/**
 * Greedy longest-match tokenizer. At each position: the longest taught form,
 * else the longest structural fragment, else an unknown character (adjacent
 * unknowns merge into one run, because an unknown three-character word is one
 * unknown thing, not three).
 *
 * Before accepting a taught match, the compound guard from jlpt.mjs runs: if a
 * longer JMdict-common word starts here, the reader meets a compound they do
 * not know (何人 must not pass as 何 + 人), and that whole span is one unknown.
 *
 * Kinds: item (taught, with candidate itemIds) / structural / unknown /
 * other (punctuation, digits, latin — outside the coverage denominator).
 */
export function tokenize(jpn, lexicon) {
  const { forms, maxLen, dictForms } = lexicon;
  const tokens = [];
  let i = 0;
  while (i < jpn.length) {
    if (!JAPANESE.test(jpn[i])) {
      let j = i + 1;
      while (j < jpn.length && !JAPANESE.test(jpn[j])) j++;
      tokens.push({ text: jpn.slice(i, j), kind: "other" });
      i = j;
      continue;
    }
    let matched = 0, itemIds = null;
    for (let len = Math.min(maxLen, jpn.length - i); len >= 1; len--) {
      const hit = forms.get(jpn.slice(i, i + len));
      if (hit) { matched = len; itemIds = hit; break; }
    }
    if (matched) {
      let compound = 0;
      if (dictForms) {
        for (let len = Math.min(COMPOUND_MAX, jpn.length - i); len > matched; len--) {
          if (dictForms.has(jpn.slice(i, i + len))) { compound = len; break; }
        }
      }
      if (compound) {
        tokens.push({ text: jpn.slice(i, i + compound), kind: "unknown" });
        i += compound;
      } else {
        tokens.push({ text: jpn.slice(i, i + matched), kind: "item", itemIds });
        i += matched;
      }
      continue;
    }
    let struct = 0;
    for (let len = Math.min(STRUCT_MAX, jpn.length - i); len >= 1; len--) {
      if (STRUCTURAL_SET.has(jpn.slice(i, i + len))) { struct = len; break; }
    }
    if (struct) {
      tokens.push({ text: jpn.slice(i, i + struct), kind: "structural" });
      i += struct;
      continue;
    }
    const last = tokens[tokens.length - 1];
    if (last?.kind === "unknown") last.text += jpn[i];
    else tokens.push({ text: jpn[i], kind: "unknown" });
    i++;
  }
  return tokens;
}

/**
 * The core levelling function: how much of this sentence does a learner with
 * this known-item set know, and what exactly is unknown?
 *
 * `knownIds` is arbitrary — the full taught inventory, one learner's SRS
 * state, anything. Tokenization always runs against the full lexicon so
 * segmentation stays stable; knownness is decided per token afterwards.
 *
 * Unknowns come back in two honest flavours: unknownItemIds (taught items this
 * learner has not met — the servable i+1 material) and unknownRuns (text no
 * taught item explains — untaught territory).
 */
export function levelSentence(jpn, lexicon, knownIds) {
  const tokens = tokenize(jpn, lexicon);
  let total = 0, known = 0;
  const unknownItemIds = [], unknownRuns = [];
  for (const t of tokens) {
    if (t.kind === "other") continue;
    total++;
    if (t.kind === "structural") { known++; continue; }
    if (t.kind === "item") {
      if (t.itemIds.some((id) => knownIds.has(id))) known++;
      else for (const id of t.itemIds) if (!unknownItemIds.includes(id)) unknownItemIds.push(id);
      continue;
    }
    if (!unknownRuns.includes(t.text)) unknownRuns.push(t.text);
  }
  return {
    coverage: total ? known / total : 0,
    totalTokens: total,
    knownTokens: known,
    unknownItemIds,
    unknownRuns,
    tokens,
  };
}

/**
 * Coverage band for the library. Per-sentence granularity makes fine bands
 * (the 98 flow target) meaningless here: a 12-token sentence is either
 * perfect or at ~92, so one-unknown sentences land in the 90 band and the 95
 * band only populates once sentences run past ~20 tokens — on the current
 * corpus it is nearly empty, measured, not a bug. The ~98 flow target lives
 * at the *passage* level, where a handful of 100-band sentences plus one
 * carrying an unknown lands the aggregate at 96-99.
 */
export function band(coverage) {
  if (coverage >= 1) return "100";
  if (coverage >= 0.95) return "95";
  if (coverage >= 0.9) return "90";
  return "below";
}

/**
 * The literal fragments that make a grammar pattern detectable in text, or
 * null when it is not. "～は～です" gives [は, です] to find in order;
 * "number + えん" and "ありがとうございます／どういたしまして" have no single
 * literal surface and return null — those patterns are simply not taggable,
 * which the tag output states rather than hides.
 */
export function grammarSurface(pattern) {
  if (!pattern || /[A-Za-z0-9０-９／・+…]/.test(pattern)) return null;
  const frags = pattern.split(/[～〜]/).map((f) => f.trim()).filter(Boolean);
  if (!frags.length) return null;
  // A pattern whose longest fragment is one character (bare ～と, say) would
  // tag nearly every sentence; that is noise, not detection.
  if (Math.max(...frags.map((f) => f.length)) < 2) return null;
  return frags;
}

/** Do the fragments appear in the sentence, in pattern order? */
export function matchesGrammar(jpn, fragments) {
  let pos = 0;
  for (const f of fragments) {
    const at = jpn.indexOf(f, pos);
    if (at === -1) return false;
    pos = at + f.length;
  }
  return true;
}

/**
 * Tag a sentence by the taught items it uses: vocabulary ids via the
 * tokenizer, taught kanji by character, grammar patterns whose surface
 * fragments appear in order. This is the index the future library queries —
 * "sentences at band N for learner state S" is a filter over these tags plus
 * levelSentence against S.
 */
export function tagSentence(jpn, lexicon, taughtKanji, grammar) {
  const vocabIds = [];
  for (const t of tokenize(jpn, lexicon)) {
    if (t.kind !== "item") continue;
    for (const id of t.itemIds) if (!vocabIds.includes(id)) vocabIds.push(id);
  }
  const kanji = [...new Set([...jpn].filter((c) => taughtKanji.has(c)))];
  const grammarIds = grammar
    .filter((g) => g.fragments && matchesGrammar(jpn, g.fragments))
    .map((g) => g.id);
  return { vocabIds, kanji, grammarIds };
}
