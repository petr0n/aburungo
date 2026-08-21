#!/usr/bin/env node
/**
 * JLPT reference vocabulary: fetch, merge, and measure coverage.
 *
 *   node scripts/jlpt.mjs fetch n5       download raw source files
 *   node scripts/jlpt.mjs build n5       merge them into data/jlpt/reference-n5.json
 *   node scripts/jlpt.mjs coverage n5    diff the reference against what the app teaches
 *   node scripts/jlpt.mjs sentences n5   find Tatoeba sentences we could teach next
 *
 * Every level works the same way, so N4-N1 need no new code — only a run.
 *
 * ── What this is, and what it is not ──────────────────────────────────────
 * There has been no official JLPT vocabulary list since the 2010 reform that
 * created N1-N5. The Japan Foundation published lists for the old four-level
 * test and has published none since, describing the exam as measuring general
 * communicative competence rather than a fixed word set.
 *
 * So this is a *reference*, never an authority. It exists to find gaps and to
 * sanity-check the `jlpt:` tags on our own content, which are training-derived
 * and marked pending verification. It must not drive what gets taught — for a
 * practical-situations app, "can you handle a hotel checkout" beats list
 * coverage every time.
 *
 * ── Why more than one source ──────────────────────────────────────────────
 * Nearly every JLPT word list on the internet traces back to Jonathan Waller's
 * tanos.co.uk, so stacking three of them would add rows and no information.
 * These three are actually different:
 *
 *   tanos       the de-facto reference. Kanji + reading only, no meanings.
 *   open-anki   same lineage, but community-corrected and carrying English.
 *               Where it disagrees with tanos, the disagreement is the signal.
 *   jmdict      not a JLPT list at all — the `common` flag, derived from
 *               newspaper and corpus frequency markers. A genuinely independent
 *               axis: "is this word common in real Japanese", asked of every
 *               candidate regardless of what any list claims.
 */
import {
  readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync,
  openSync, readSync, closeSync, statSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RAW = join(ROOT, "data/jlpt/raw");
const REF = join(ROOT, "data/jlpt");
const LEVELS = ["n5", "n4", "n3", "n2", "n1"];

/**
 * Source registry. Adding a level is a run, not a code change; adding a source
 * is one entry here plus a parser.
 */
const SOURCES = {
  tanos: {
    label: "Tanos (Jonathan Waller)",
    licence: "CC BY 4.0",
    attribution: "Data from https://www.tanos.co.uk/jlpt/ by Jonathan Waller, CC BY",
    via: "https://github.com/Bluskyo/JLPT_Vocabulary (conversion, MIT)",
    url: (l) => `https://raw.githubusercontent.com/Bluskyo/JLPT_Vocabulary/main/data/vocab/parsedData/${l}_vocab_cleaned.csv`,
    file: (l) => `tanos-${l}.csv`,
    parse: (text) =>
      parseCsv(text).map((r) => ({ written: r.Kanji?.trim(), reading: r.Reading?.trim(), english: "" })),
  },
  "open-anki": {
    label: "open-anki-jlpt-decks",
    licence: "MIT (deck data derived from Tanos, CC BY)",
    attribution: "https://github.com/jamsinclair/open-anki-jlpt-decks — decks based on tanos.co.uk",
    via: "",
    url: (l) => `https://raw.githubusercontent.com/jamsinclair/open-anki-jlpt-decks/main/src/${l}.csv`,
    file: (l) => `open-anki-${l}.csv`,
    parse: (text) =>
      parseCsv(text).map((r) => ({
        written: r.expression?.trim(),
        reading: r.reading?.trim(),
        english: r.meaning?.trim() ?? "",
      })),
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────

/** Minimal RFC-4180 reader: the deck source quotes fields containing commas. */
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift() ?? [];
  return rows
    .filter((r) => r.some((v) => v !== ""))
    .map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), r[i] ?? ""])));
}

/**
 * Normalise a reading for comparison.
 *
 * Katakana folds to hiragana, and spacing and interpuncts go. This is the whole
 * reason the coverage report can be trusted: matching on the *written* form
 * reports 朝 as missing when the app already teaches it as あさ. That exact
 * mistake produced two duplicate entries in this repo before (vocab.asa and
 * vocab.noru), so the comparison key is the reading, never the surface.
 */
export function normReading(s) {
  if (!s) return "";
  return s
    .replace(/[ァ-ヶ]/g, (c) => String.fromCodePoint(c.codePointAt(0) - 0x60))
    .replace(/[\s・･〜～]/g, "")
    .trim();
}

const HAS_KANJI = /[\u4e00-\u9faf]/;

/**
 * Do two surface forms plausibly write the same word?
 *
 * Coverage matches on the reading (see normReading), which is right for
 * spelling variants — the app teaches あさ, the reference writes 朝 — and wrong
 * for homophones. Adding 晩 (ばん, evening) silently marked the reference entry
 * ～番 (ばん, the ordinal counter) as covered, hiding a real gap. Copilot caught
 * that on PR #88.
 *
 * The rule that separates the two cases: if either side is written without
 * kanji, the reading is all we have and a match stands. If both sides carry
 * kanji, they must share at least one — 昼御飯 and 昼ご飯 do, 晩 and ～番 do not.
 */
export function writtenCompatible(refWritten, ourWritten) {
  const a = (refWritten ?? "").replace(/[\s・･〜～]/g, "");
  const b = (ourWritten ?? "").replace(/[\s・･〜～]/g, "");
  if (!a || !b) return true;
  if (!HAS_KANJI.test(a) || !HAS_KANJI.test(b)) return true;
  const aKanji = new Set(a.match(/[\u4e00-\u9faf]/g) ?? []);
  return (b.match(/[\u4e00-\u9faf]/g) ?? []).some((c) => aKanji.has(c));
}

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const level = (arg) => {
  const l = (arg ?? "").toLowerCase();
  if (!LEVELS.includes(l)) {
    console.error(`level must be one of ${LEVELS.join(", ")}`);
    process.exit(1);
  }
  return l;
};


/**
 * Surface forms JMdict marks as common, scanned out of the local dictionary.
 *
 * This is the third source, and the only one that is not a JLPT list at all.
 * JMdict's `common` flag comes from newspaper and corpus frequency markers, so
 * it answers a question no word list can: is this word actually common in real
 * Japanese? A missing word attested by both lists AND flagged common is the
 * safest thing to author next; one attested by a single list and not common is
 * worth a second look before spending a lesson slot on it.
 *
 * Optional. server/data is gitignored because the dictionary is 128MB, so on a
 * fresh clone this returns null and the reference simply carries no flag rather
 * than failing. Scanned in chunks for the same reason — parsing it whole would
 * cost about a gigabyte of heap to answer a yes/no question.
 */
function jmdictCommonForms() {
  const path = join(ROOT, "server/data/jmdict-examples-eng-3.6.2.json");
  if (!existsSync(path)) return null;

  const forms = new Set();
  const fd = openSync(path, "r");
  const size = statSync(path).size;
  const CHUNK = 8 * 1024 * 1024;
  const buf = Buffer.alloc(CHUNK);
  let pos = 0, carry = "";
  while (pos < size) {
    const read = readSync(fd, buf, 0, Math.min(CHUNK, size - pos), pos);
    const text = carry + buf.toString("utf8", 0, read);
    for (const m of text.matchAll(/"common":true,"text":"((?:[^"\\]|\\.)*)"/g)) forms.add(m[1]);
    // Keep a tail so a match spanning a chunk boundary is not lost.
    carry = text.slice(-200);
    pos += read;
  }
  closeSync(fd);
  return forms;
}

// ── fetch ──────────────────────────────────────────────────────────────────

async function fetchLevel(l) {
  mkdirSync(RAW, { recursive: true });
  for (const [name, src] of Object.entries(SOURCES)) {
    const url = src.url(l);
    const dest = join(RAW, src.file(l));
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`  ${name}: HTTP ${res.status} — ${url}`);
      continue;
    }
    const text = await res.text();
    writeFileSync(dest, text);
    console.log(`  ${name}: ${text.split("\n").length - 1} rows -> data/jlpt/raw/${src.file(l)}`);
  }
}

// ── build ──────────────────────────────────────────────────────────────────

/**
 * Merge the sources into one reference, keyed by normalised reading + written
 * form so homophones stay separate (はし the bridge and はし the chopsticks are
 * different words, and collapsing them would understate the list).
 */
function buildLevel(l) {
  const merged = new Map();

  for (const [name, src] of Object.entries(SOURCES)) {
    const path = join(RAW, src.file(l));
    if (!existsSync(path)) {
      console.error(`  ${name}: no raw file — run fetch first`);
      continue;
    }
    let kept = 0;
    for (const row of src.parse(readFileSync(path, "utf8"))) {
      const reading = normReading(row.reading);
      if (!reading) continue;
      const written = row.written?.trim() || row.reading?.trim() || "";
      const key = `${reading}|${written}`;
      const existing = merged.get(key);
      if (existing) {
        if (!existing.sources.includes(name)) existing.sources.push(name);
        if (!existing.english && row.english) existing.english = row.english;
      } else {
        merged.set(key, { written, reading, english: row.english ?? "", sources: [name] });
      }
      kept++;
    }
    console.log(`  ${name}: ${kept} rows`);
  }

  const common = jmdictCommonForms();
  if (common === null) {
    console.log("  jmdict: dictionary not present — skipping the commonness flag");
  } else {
    let flagged = 0;
    for (const e of merged.values()) {
      e.jmdictCommon = common.has(e.written) || common.has(e.reading);
      if (e.jmdictCommon) flagged++;
    }
    console.log(`  jmdict: ${flagged} of ${merged.size} flagged common`);
  }

  const entries = [...merged.values()].sort((a, b) => a.reading.localeCompare(b.reading, "ja"));
  const out = {
    level: l.toUpperCase(),
    generated: new Date().toISOString().slice(0, 10),
    caveat:
      "No official JLPT vocabulary list has existed since 2010. This is a community reference for finding gaps, not an authority on what to teach.",
    sources: Object.fromEntries(
      Object.entries(SOURCES).map(([k, v]) => [k, { label: v.label, licence: v.licence, attribution: v.attribution }]),
    ),
    counts: {
      total: entries.length,
      bothSources: entries.filter((e) => e.sources.length > 1).length,
      oneSourceOnly: entries.filter((e) => e.sources.length === 1).length,
    },
    entries,
  };
  mkdirSync(REF, { recursive: true });
  const dest = join(REF, `reference-${l}.json`);
  writeFileSync(dest, JSON.stringify(out, null, 1));
  console.log(`  merged ${entries.length} entries (${out.counts.bothSources} in both) -> data/jlpt/reference-${l}.json`);
}

// ── coverage ───────────────────────────────────────────────────────────────

/**
 * Compare the reference against the words the app actually teaches.
 *
 * Reads the vocabulary YAML directly rather than importing the app, so this
 * stays a plain script with no build step and no bundler in the way.
 */
function ourWords() {
  const dir = join(ROOT, "src/content/vocabulary");
  const out = [];
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".yaml"))) {
    const text = readFileSync(join(dir, f), "utf8");
    let cur = null;
    for (const line of text.split("\n")) {
      const id = line.match(/^\s*-\s+id:\s*(\S+)/);
      if (id) { cur = { id: id[1], file: f }; out.push(cur); continue; }
      if (!cur) continue;
      // Exactly two spaces. A word's own fields sit at that depth; an
      // `example:` block nests its own `japanese:` at four, and matching on
      // leading whitespace loosely lets the example sentence overwrite the
      // word it belongs to.
      const jp = line.match(/^ {2}japanese: *(.+?) *$/);
      if (jp) cur.japanese = jp[1];
      const rd = line.match(/^ {2}reading: *(.+?) *$/);
      if (rd) cur.reading = rd[1];
      const jl = line.match(/^ {2}jlpt: *(\S+)/);
      if (jl) cur.jlpt = jl[1];
      const wt = line.match(/^ {2}word_type: *(\S+)/);
      if (wt) cur.wordType = wt[1];
    }
  }
  return out.filter((w) => w.reading);
}

function coverage(l) {
  const ref = readJson(join(REF, `reference-${l}.json`));
  const ours = ourWords();

  const oursByReading = new Map();
  for (const w of ours) {
    const k = normReading(w.reading);
    if (!oursByReading.has(k)) oursByReading.set(k, []);
    oursByReading.get(k).push(w);
  }

  const covered = [], missing = [];
  for (const e of ref.entries) {
    const hits = (oursByReading.get(e.reading) ?? []).filter((w) => writtenCompatible(e.written, w.japanese));
    (hits.length ? covered : missing).push(e);
  }

  const refReadings = new Set(ref.entries.map((e) => e.reading));
  const notInReference = ours.filter((w) => w.jlpt === ref.level && !refReadings.has(normReading(w.reading)));

  console.log(`\n${ref.level} coverage — reference ${ref.entries.length} words, app teaches ${ours.length}\n`);
  console.log(`  covered              ${covered.length}`);
  console.log(`  missing              ${missing.length}`);
  console.log(`  in app, not in list  ${notInReference.length}`);
  const strong = missing.filter((m) => m.sources.length > 1 && m.jmdictCommon !== false);
  const weak = missing.filter((m) => m.sources.length === 1 && m.jmdictCommon === false);
  console.log(`\n  of the missing:`);
  console.log(`    ${strong.length} attested by both lists and common in JMdict — author these first`);
  console.log(`    ${weak.length} single-list and not common in JMdict — check before spending a lesson slot`);

  const dupes = [...oursByReading.entries()].filter(([, v]) => v.length > 1);
  if (dupes.length) {
    console.log(`\n  WARNING — ${dupes.length} reading(s) already duplicated in our own content:`);
    for (const [r, ws] of dupes) console.log(`    ${r}: ${ws.map((w) => `${w.id} (${w.japanese})`).join(", ")}`);
  }

  const out = {
    level: ref.level,
    generated: new Date().toISOString().slice(0, 10),
    summary: { reference: ref.entries.length, taught: ours.length, covered: covered.length, missing: missing.length },
    // Both-source words first: the safest candidates to author next.
    // Ranked: both lists and common first, single-list and uncommon last. That
    // ordering is the whole point of merging sources rather than taking one.
    missing: missing
      .sort(
        (a, b) =>
          b.sources.length - a.sources.length ||
          Number(b.jmdictCommon ?? false) - Number(a.jmdictCommon ?? false) ||
          a.reading.localeCompare(b.reading, "ja"),
      )
      .map((m) => ({
        written: m.written,
        reading: m.reading,
        english: m.english,
        sources: m.sources,
        jmdictCommon: m.jmdictCommon,
      })),
    inAppNotInReference: notInReference.map((w) => ({ id: w.id, japanese: w.japanese, reading: w.reading })),
  };
  const dest = join(REF, `coverage-${l}.json`);
  writeFileSync(dest, JSON.stringify(out, null, 1));
  console.log(`\n  gap list -> data/jlpt/coverage-${l}.json\n`);
}

// ── sentences ──────────────────────────────────────────────────────────────

/**
 * Lessons, as ordered lists of the word ids they teach.
 *
 * Line-based like ourWords() for the same reason: this stays a dependency-free
 * script, and the lesson files are hand-written in a shape regular enough to
 * read without a YAML parser.
 */
function ourLessons() {
  const dir = join(ROOT, "src/content/lessons");
  const out = [];
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".yaml"))) {
    let cur = null, list = null;
    for (const line of readFileSync(join(dir, f), "utf8").split("\n")) {
      const id = line.match(/^-\s+id:\s*(\S+)/);
      if (id) { cur = { id: id[1], order: 0, wordIds: [], phraseIds: [] }; out.push(cur); list = null; continue; }
      if (!cur) continue;
      const order = line.match(/^ {2}order: *(\d+)/);
      if (order) { cur.order = Number(order[1]); list = null; continue; }
      const cp = line.match(/^ {2}checkpoint: *(\S+)/);
      if (cp) { cur.checkpoint = cp[1]; list = null; continue; }
      const key = line.match(/^ {2}(wordIds|phraseIds): *$/);
      if (key) { list = key[1]; continue; }
      if (line.match(/^ {2}\w+:/)) { list = null; continue; }
      const item = list && line.match(/^ {4}-\s*(\S+)/);
      if (item) cur[list].push(item[1]);
    }
  }
  return out.sort((a, b) => a.order - b.order);
}

/** Japanese text of every phrase we already teach, so we never re-propose one. */
function ourPhraseText() {
  const dir = join(ROOT, "src/content/phrases");
  const out = new Set();
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".yaml"))) {
    for (const line of readFileSync(join(dir, f), "utf8").split("\n")) {
      const jp = line.match(/^ {2}japanese: *(.+?) *$/);
      if (jp) out.add(jp[1]);
    }
  }
  return out;
}

const KANJI_RUN = /[一-龯々]+/g;
const KATAKANA_RUN = /[ァ-ヺー]{2,}/g;
const hasKanji = (s) => /[一-龯]/.test(s);

/**
 * Every surface form a learner would have met, plus the kanji-initial prefixes
 * of each one.
 *
 * The prefixes are what make this work without a morphological analyser. A
 * sentence says 食べます, not 食べる, but the *kanji run* in it is 食 — always a
 * prefix of the dictionary form. Matching prefixes therefore accepts inflection
 * without pretending to conjugate. Prefixes are added only for forms containing
 * kanji, so katakana still has to match exactly and a loanword cannot be waved
 * through by its first character.
 */
export function segmentationVocab(words) {
  const forms = new Set();
  for (const w of words) {
    for (const f of [w.japanese, w.reading]) if (f) forms.add(f.trim());
  }
  const out = new Set(forms);
  for (const f of forms) {
    if (!hasKanji(f)) continue;
    for (let i = 1; i < f.length; i++) out.add(f.slice(0, i));
  }
  return out;
}

/**
 * Greedy longest-match, with a check for compounds hiding in plain sight.
 *
 * Character segmentation alone is not enough, and the failure is the exact one
 * this command exists to prevent. 何人 splits into 何 + 人 and 兄弟 into 兄 + 弟 —
 * every character taught, so a naive pass calls 何人兄弟がいますか teachable. But
 * 何人 is its own word and no lesson teaches it. That is the word that got
 * caught by hand in the family batch, and it walked straight back in here.
 *
 * So at each position we ask JMdict for the longest *common* word starting
 * there. If it is longer than the longest form the learner has met, the reader
 * would run into a compound they do not know, and the run is not covered.
 */
export function runCovered(run, vocab, dictForms) {
  for (let i = 0; i < run.length; ) {
    let matched = 0;
    for (let len = Math.min(8, run.length - i); len >= 1; len--) {
      if (vocab.has(run.slice(i, i + len))) { matched = len; break; }
    }
    if (matched === 0) return false;
    if (dictForms) {
      for (let len = Math.min(8, run.length - i); len > matched; len--) {
        if (dictForms.has(run.slice(i, i + len))) return false;
      }
    }
    i += matched;
  }
  return true;
}

/** The runs a learner would not recognise. Empty means the sentence is teachable. */
export const uncoveredRuns = (jpn, vocab, dictForms) =>
  [...(jpn.match(KANJI_RUN) ?? []), ...(jpn.match(KATAKANA_RUN) ?? [])].filter((r) => !runCovered(r, vocab, dictForms));

export const allRunsCovered = (jpn, vocab, dictForms) => uncoveredRuns(jpn, vocab, dictForms).length === 0;

/**
 * The substring to search a sentence for when looking for a given word.
 *
 * Never the dictionary form itself. A corpus sentence says 洗って or 洗います, and
 * neither contains the string 洗う, so searching for the headword finds only the
 * rare sentence that happens to use the plain form — which silently hid most of
 * the corpus on the first run of this command. Trailing kana is okurigana, so
 * dropping it leaves the invariant stem: 洗う -> 洗, 食べる -> 食.
 *
 * Only verbs and i-adjectives inflect, so only they get trimmed. Trimming
 * everything is worse than useless: 私たち becomes 私, which then matches every
 * sentence containing "I" and attributes it to the wrong word.
 *
 * A kana-only word has no stem to find, so it is searched for whole and an
 * inflected kana verb will be missed. That is the known limit of doing this
 * without a morphological analyser.
 */
const INFLECTS = new Set(["verb", "i-adj"]);
export function searchStem(form, wordType) {
  if (!form) return "";
  const f = form.trim();
  if (!hasKanji(f) || (wordType !== undefined && !INFLECTS.has(wordType))) return f;
  return f.replace(/[ぁ-ゖァ-ヺー]+$/, "") || f;
}

/**
 * A tighter stem, for when JMdict can tell us how the verb conjugates.
 *
 * An ichidan verb keeps everything but its final る through every form — 開ける
 * gives 開け, which 開けます and 開けて share and 開きます does not. Cutting at the
 * kanji boundary instead gives 開, and on the first real run that matched
 * 開きます (a different verb), お手洗い for 洗う, and お風呂に入ります for 入れる.
 *
 * A godan verb changes the kana right after its stem (洗います, 洗って), so there
 * is nothing tighter to cut to and it falls back to the kanji stem.
 */
export function conjugationStem(form, partsOfSpeech) {
  const f = (form ?? "").trim();
  if (!f) return "";
  const isIchidan = (partsOfSpeech ?? []).some((p) => p === "v1" || p === "v1-s");
  if (isIchidan && f.endsWith("る") && f.length > 1) return f.slice(0, -1);
  return searchStem(f, "verb");
}

/**
 * Does the sentence end in a です/ます form?
 *
 * Tatoeba is a corpus of real speech, so plain and imperative forms are
 * everywhere — 好きにしろよ is authentic Japanese and useless here, because every
 * phrase this level teaches is polite. Sorting on this puts the usable half of
 * the list at the top; --polite drops the rest entirely.
 */
const POLITE_ENDING = /(?:で(?:す|した)|ま(?:す|した|せん|しょう))(?:か|ね|よ)?[。！？]*$/;
export const isPolite = (jpn) => POLITE_ENDING.test(jpn.trim());

/**
 * Every Tatoeba example in the local dictionary, plus the forms to keep away
 * from learners.
 *
 * JMdict ships one entry per line, so this reads the 128MB file a line at a
 * time and parses each entry on its own — full structure, almost no heap.
 *
 * The blocklist matters more than it looks. JMdict's own tag glossary defines
 * `X` as "rude or X-rated term (not displayed in educational software)", and
 * these sentences are real-world text: a first pass over this corpus surfaced
 * anatomical crudity inside the first twenty hits. Blocking is by *form*, not
 * by the entry an example hangs off, because the offending word usually arrives
 * as some other word's example sentence. A word with one coarse sense is
 * blocked whole, which is blunt, and deliberately so.
 */
function jmdictExamples() {
  const path = join(ROOT, "server/data/jmdict-examples-eng-3.6.2.json");
  if (!existsSync(path)) return null;

  const BLOCK = new Set(["vulg", "X", "derog", "sl"]);
  const examples = new Map();
  const blocked = new Set();
  // Multi-character common words, used to catch compounds that would otherwise
  // segment into taught characters. Common only: every rare compound in JMdict
  // would reject nearly every sentence for a word no learner will meet.
  const dictForms = new Set();
  // Part of speech per surface form, so --for can cut an ichidan verb at its
  // real stem rather than at the kanji boundary.
  const posByForm = new Map();

  const fd = openSync(path, "r");
  const size = statSync(path).size;
  const CHUNK = 8 * 1024 * 1024;
  const buf = Buffer.alloc(CHUNK);
  let pos = 0, carry = "";
  while (pos < size) {
    const read = readSync(fd, buf, 0, Math.min(CHUNK, size - pos), pos);
    const lines = (carry + buf.toString("utf8", 0, read)).split("\n");
    carry = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith('{"id":"')) continue;
      let entry;
      try { entry = JSON.parse(line.replace(/,$/, "")); } catch { continue; }
      const forms = [...(entry.kanji ?? []), ...(entry.kana ?? [])].map((k) => k.text);
      for (const k of entry.kanji ?? []) if (k.common && k.text.length > 1) dictForms.add(k.text);
      const partsOfSpeech = entry.sense?.[0]?.partOfSpeech ?? [];
      if (partsOfSpeech.length) for (const f of forms) if (!posByForm.has(f)) posByForm.set(f, partsOfSpeech);
      if (entry.sense?.some((s) => (s.misc ?? []).some((m) => BLOCK.has(m)))) {
        for (const f of forms) blocked.add(f);
      }
      for (const sense of entry.sense ?? []) {
        for (const ex of sense.examples ?? []) {
          const jpn = ex.sentences?.find((s) => s.lang === "jpn")?.text;
          const eng = ex.sentences?.find((s) => s.lang === "eng")?.text;
          if (jpn && eng && !examples.has(jpn)) {
            examples.set(jpn, { jpn, eng, tatoeba: ex.source?.value ?? "" });
          }
        }
      }
    }
    pos += read;
  }
  closeSync(fd);
  return { examples: [...examples.values()], blocked, dictForms, posByForm };
}

/**
 * Rank Tatoeba sentences we could teach without introducing an unmet word.
 *
 * This exists because of a near-miss. The obvious family sentence — "how many
 * people are in your family" — needs 何人, which no lesson teaches, and it took
 * a manual read to catch before it shipped. The rule against inventing Japanese
 * already pointed at Tatoeba; what was missing was a way to *find* the sentence
 * that fits a given point in the ladder. That is this.
 *
 *   --upto N      only words taught by lesson order N or earlier
 *   --for 洗う     require the sentence to contain this form, and treat it as
 *                 taught (the word you are about to write a lesson around)
 */
function sentences(l, opts) {
  const corpus = jmdictExamples();
  if (corpus === null) {
    console.error("\n  server/data/jmdict-examples-eng-3.6.2.json is not present.");
    console.error("  It is gitignored (128MB). Restore it to use this command.\n");
    process.exit(1);
  }

  const words = ourWords();
  const byId = new Map(words.map((w) => [w.id, w]));
  const lessons = ourLessons();

  let universe = words;
  if (opts.upto !== null) {
    const taught = new Set(lessons.filter((u) => u.order <= opts.upto).flatMap((u) => u.wordIds));
    universe = words.filter((w) => taught.has(w.id));
  }

  // Words we are about to teach count as met — that is the point of --for.
  const targets = [];
  if (opts.for.length) {
    const ref = readJson(join(REF, `reference-${l}.json`));
    for (const form of opts.for) {
      const hit = ref.entries.find((e) => e.written === form || e.reading === normReading(form));
      const reading = hit?.reading ?? form;
      const partsOfSpeech = corpus.posByForm.get(form) ?? corpus.posByForm.get(reading);
      // Both spellings. A corpus sentence may write the verb in kana (あけます)
      // where the headword is kanji (開ける), and searching only the written
      // form would miss every one of them. The reading goes through the same
      // conjugation-aware cut, so あける gives あけ rather than the whole word.
      const stems = [...new Set([conjugationStem(form, partsOfSpeech), conjugationStem(reading, partsOfSpeech)])];
      targets.push({ id: `--for:${form}`, japanese: form, reading, stems: stems.filter(Boolean) });
    }
    universe = [...universe, ...targets];
  }

  const vocab = segmentationVocab(universe);
  const known = ourPhraseText();

  const usable = corpus.examples
    .filter((s) => s.jpn.length <= opts.maxLen)
    .filter((s) => !known.has(s.jpn))
    .filter((s) => ![...corpus.blocked].some((b) => b.length > 1 && s.jpn.includes(b)))
    .filter((s) => allRunsCovered(s.jpn, vocab, corpus.dictForms))
    .filter((s) => !targets.length || targets.some((t) => t.stems.some((st) => s.jpn.includes(st))))
    .filter((s) => !opts.polite || isPolite(s.jpn))
    .map((s) => ({ ...s, polite: isPolite(s.jpn) }))
    .sort((a, b) => Number(b.polite) - Number(a.polite) || a.jpn.length - b.jpn.length || a.jpn.localeCompare(b.jpn, "ja"));

  // Attach each sentence to the words it exercises, so authoring a lesson is a
  // lookup by the word you are teaching rather than a scan of the whole list.
  const byWord = new Map();
  for (const w of universe) {
    const forms = [...new Set([w.japanese, w.reading].map((f) => searchStem(f, w.wordType)).filter(Boolean))];
    const hits = usable.filter((s) => forms.some((f) => s.jpn.includes(f)));
    if (hits.length) byWord.set(w.id, hits.slice(0, opts.perWord));
  }

  console.log(`\n${l.toUpperCase()} sentence candidates — corpus ${corpus.examples.length} Tatoeba pairs\n`);
  console.log(`  vocabulary universe  ${universe.length} words${opts.upto !== null ? ` (taught by lesson ${opts.upto})` : ""}`);
  console.log(`  blocked forms        ${corpus.blocked.size} (vulg/X/derog/sl)`);
  console.log(`  compound guard       ${corpus.dictForms.size} common multi-char words`);
  console.log(`  usable, <= ${opts.maxLen} chars ${usable.length}  (${usable.filter((s) => s.polite).length} polite)`);
  console.log(`  words with a hit     ${byWord.size}`);

  const out = {
    level: l.toUpperCase(),
    generated: new Date().toISOString().slice(0, 10),
    caveat:
      "Candidates, not content. Every kanji and katakana word is checked against the taught set, but hiragana-only vocabulary is not — a sentence can still carry an unmet kana word. Read before authoring, and cite the Tatoeba id.",
    options: opts,
    summary: { corpus: corpus.examples.length, universe: universe.length, usable: usable.length, wordsWithHit: byWord.size },
    byWord: Object.fromEntries(
      [...byWord].map(([id, hits]) => [
        id,
        { japanese: byId.get(id)?.japanese ?? id, reading: byId.get(id)?.reading ?? "", candidates: hits },
      ]),
    ),
  };
  const dest = join(REF, `sentences-${l}.json`);
  writeFileSync(dest, JSON.stringify(out, null, 1));
  console.log(`\n  candidates -> data/jlpt/sentences-${l}.json\n`);

  for (const s of usable.slice(0, 15)) console.log(`  ${s.jpn.padEnd(20)} ${s.eng}  [tatoeba ${s.tatoeba}]`);

  // A bare zero is a dead end; the blocking word is the actionable part. When a
  // target turns up nothing, show what each near-miss is waiting on — often one
  // word, which is then a decision about the lesson rather than a search.
  if (targets.length) {
    const near = corpus.examples
      .filter((s) => s.jpn.length <= opts.maxLen && !known.has(s.jpn))
      .filter((s) => ![...corpus.blocked].some((b) => b.length > 1 && s.jpn.includes(b)))
      .filter((s) => targets.some((t) => t.stems.some((st) => s.jpn.includes(st))))
      .map((s) => ({ ...s, blockers: uncoveredRuns(s.jpn, vocab, corpus.dictForms) }))
      .filter((s) => s.blockers.length > 0 && s.blockers.length <= 2)
      .sort((a, b) => a.blockers.length - b.blockers.length || a.jpn.length - b.jpn.length)
      .slice(0, 10);
    if (near.length) {
      console.log(`\n  near misses — teachable once these words are:\n`);
      for (const s of near) console.log(`  ${s.blockers.join(" ").padEnd(10)} ${s.jpn.padEnd(22)} ${s.eng}`);
    }
  }
  console.log();
}

// ── main ───────────────────────────────────────────────────────────────────

/** Long options only, so a flag never collides with the level argument. */
function parseOpts(argv) {
  const opts = { upto: null, maxLen: 16, perWord: 3, for: [], polite: false };
  for (let i = 0; i < argv.length; i++) {
    const [flag, inline] = argv[i].split("=");
    if (flag === "--polite") { opts.polite = true; continue; }
    const value = inline ?? argv[++i];
    if (flag === "--upto") opts.upto = Number(value);
    else if (flag === "--max-len") opts.maxLen = Number(value);
    else if (flag === "--per-word") opts.perWord = Number(value);
    else if (flag === "--for") opts.for.push(...value.split(",").map((s) => s.trim()).filter(Boolean));
    else { console.error(`unknown option ${flag}`); process.exit(1); }
  }
  return opts;
}

// Guarded so importing this file for its helpers does not run the CLI.
const invokedDirectly = process.argv[1]?.endsWith("jlpt.mjs") ?? false;
const [cmd, arg, ...rest] = invokedDirectly ? process.argv.slice(2) : ["__imported__"];
if (cmd === "__imported__") { /* imported as a module */ }
else if (cmd === "fetch") await fetchLevel(level(arg));
else if (cmd === "build") buildLevel(level(arg));
else if (cmd === "coverage") coverage(level(arg));
else if (cmd === "sentences") sentences(level(arg), parseOpts(rest));
else {
  console.log("usage: node scripts/jlpt.mjs <fetch|build|coverage|sentences> <n5|n4|n3|n2|n1>");
  console.log("       sentences [--upto <lesson order>] [--max-len 16] [--per-word 3] [--for 洗う,使う] [--polite]");
  process.exit(1);
}
