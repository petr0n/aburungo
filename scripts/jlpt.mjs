#!/usr/bin/env node
/**
 * JLPT reference vocabulary: fetch, merge, and measure coverage.
 *
 *   node scripts/jlpt.mjs fetch n5       download raw source files
 *   node scripts/jlpt.mjs build n5       merge them into data/jlpt/reference-n5.json
 *   node scripts/jlpt.mjs coverage n5    diff the reference against what the app teaches
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
function normReading(s) {
  if (!s) return "";
  return s
    .replace(/[ァ-ヶ]/g, (c) => String.fromCodePoint(c.codePointAt(0) - 0x60))
    .replace(/[\s・･〜～]/g, "")
    .trim();
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
    const hits = oursByReading.get(e.reading) ?? [];
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

// ── main ───────────────────────────────────────────────────────────────────

const [cmd, arg] = process.argv.slice(2);
if (cmd === "fetch") await fetchLevel(level(arg));
else if (cmd === "build") buildLevel(level(arg));
else if (cmd === "coverage") coverage(level(arg));
else {
  console.log("usage: node scripts/jlpt.mjs <fetch|build|coverage> <n5|n4|n3|n2|n1>");
  process.exit(1);
}
