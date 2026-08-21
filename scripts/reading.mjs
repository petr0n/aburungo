#!/usr/bin/env node
/**
 * Tatoeba ingestion + i+1 levelling pipeline (docs/plans/04-path-n3.md §8).
 *
 *   node scripts/reading.mjs ingest   extract Tatoeba pairs -> data/reading/corpus.json
 *   node scripts/reading.mjs tag      level + tag the corpus -> data/reading/tagged.json
 *   node scripts/reading.mjs micro    clustered micro-readings -> data/reading/micro-readings.json
 *
 * corpus.json and tagged.json are gitignored: they regenerate from the local
 * dictionary (itself gitignored, 128MB) and would be several MB of derived
 * data in git. micro-readings.json is committed — it is the small, labelled
 * dev corpus the future reader UI builds against.
 *
 * Attribution: every stored sentence carries its Tatoeba sentence id. That is
 * a licence requirement (Tatoeba, CC BY 2.0 FR), so a sentence without an id
 * is dropped at ingest rather than stored id-less.
 *
 * Selection only, ever: sentences are stored verbatim as they appear in the
 * corpus. Nothing composes, edits, or reorders words inside a sentence;
 * clustering arranges whole sentences.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { jmdictExamples, ourWords, ourLessons } from "./jlpt.mjs";
import { buildLexicon, levelSentence, band, grammarSurface, tagSentence } from "./levelling.mjs";
import { readFileSync, readdirSync } from "node:fs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "data/reading");

const ATTRIBUTION = {
  source: "Tatoeba (https://tatoeba.org), via jmdict-examples-eng-3.6.2",
  licence: "CC BY 2.0 FR",
  note: "Each sentence carries its Tatoeba sentence id (tatoebaId). Sentences are verbatim; this pipeline selects and groups, never composes or edits.",
};

// ── shared loaders ─────────────────────────────────────────────────────────

/** Tatoeba pairs with ids, coarse-language forms filtered out. */
function loadCorpus() {
  const corpus = jmdictExamples();
  if (corpus === null) {
    console.error("\n  server/data/jmdict-examples-eng-3.6.2.json is not present.");
    console.error("  It is gitignored (128MB). Restore it to use this command.\n");
    process.exit(1);
  }
  const blockedForms = [...corpus.blocked].filter((b) => b.length > 1);
  const withId = corpus.examples.filter((s) => s.tatoeba);
  const clean = withId.filter((s) => !blockedForms.some((b) => s.jpn.includes(b)));
  return {
    sentences: clean,
    dictForms: corpus.dictForms,
    stats: {
      raw: corpus.examples.length,
      droppedNoId: corpus.examples.length - withId.length,
      droppedBlocked: withId.length - clean.length,
      kept: clean.length,
    },
  };
}

/**
 * Grammar patterns, line-based like ourWords() and for the same reason: no
 * YAML dependency in a plain script, and the files are regular enough.
 */
function ourGrammar() {
  const dir = join(ROOT, "src/content/grammar");
  const out = [];
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".yaml"))) {
    let cur = null;
    for (const line of readFileSync(join(dir, f), "utf8").split("\n")) {
      const id = line.match(/^-\s+id:\s*(\S+)/);
      if (id) { cur = { id: id[1] }; out.push(cur); continue; }
      if (!cur) continue;
      const p = line.match(/^ {2}pattern: *"?([^"]+)"? *$/);
      if (p) cur.pattern = p[1];
    }
  }
  return out
    .filter((g) => g.pattern)
    .map((g) => ({ ...g, fragments: grammarSurface(g.pattern) }));
}

/** Everything the app currently teaches, indexed for levelling and tagging. */
function loadTaught(dictForms) {
  const words = ourWords();
  const kanji = new Set(ourLessons().flatMap((l) => l.kanji));
  const grammar = ourGrammar();
  return {
    words,
    themeById: new Map(words.map((w) => [w.id, w.theme])),
    kanji,
    grammar,
    lexicon: buildLexicon(words, dictForms),
    knownAll: new Set(words.map((w) => w.id)),
  };
}

const write = (name, data) => {
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, name), JSON.stringify(data, null, 1));
  console.log(`  -> data/reading/${name}`);
};

// ── ingest ─────────────────────────────────────────────────────────────────

function ingest() {
  const { sentences, stats } = loadCorpus();
  console.log(`\ningest — ${stats.raw} Tatoeba pairs in the dictionary\n`);
  console.log(`  dropped, no source id   ${stats.droppedNoId}`);
  console.log(`  dropped, blocked form   ${stats.droppedBlocked} (vulg/X/derog/sl)`);
  console.log(`  kept                    ${stats.kept}`);
  write("corpus.json", {
    generated: new Date().toISOString().slice(0, 10),
    attribution: ATTRIBUTION,
    counts: stats,
    sentences: sentences.map((s) => ({ jpn: s.jpn, eng: s.eng, tatoebaId: s.tatoeba })),
  });
  console.log();
}

// ── tag ────────────────────────────────────────────────────────────────────

/** Level and tag one sentence against the full taught inventory. */
function levelAndTag(s, taught) {
  const lvl = levelSentence(s.jpn, taught.lexicon, taught.knownAll);
  const tags = tagSentence(s.jpn, taught.lexicon, taught.kanji, taught.grammar);
  return {
    jpn: s.jpn,
    eng: s.eng,
    tatoebaId: s.tatoeba,
    coverage: Number(lvl.coverage.toFixed(4)),
    band: band(lvl.coverage),
    totalTokens: lvl.totalTokens,
    unknownRuns: lvl.unknownRuns,
    vocabIds: tags.vocabIds,
    kanji: tags.kanji,
    grammarIds: tags.grammarIds,
  };
}

function tag() {
  const { sentences, dictForms, stats } = loadCorpus();
  const taught = loadTaught(dictForms);
  const tagged = sentences.map((s) => levelAndTag(s, taught));

  const byBand = {};
  for (const t of tagged) byBand[t.band] = (byBand[t.band] ?? 0) + 1;
  const detectable = taught.grammar.filter((g) => g.fragments);

  console.log(`\ntag — ${stats.kept} sentences against the full taught inventory\n`);
  console.log(`  taught words            ${taught.words.length}`);
  console.log(`  taught kanji            ${taught.kanji.size}`);
  console.log(`  grammar patterns        ${taught.grammar.length} (${detectable.length} surface-detectable)`);
  for (const b of ["100", "95", "90", "below"]) {
    console.log(`  band ${b.padEnd(6)}            ${byBand[b] ?? 0}`);
  }
  write("tagged.json", {
    generated: new Date().toISOString().slice(0, 10),
    attribution: ATTRIBUTION,
    knownSet: "full taught inventory at generation time — per-learner levelling is levelSentence() at runtime",
    counts: { ...stats, byBand },
    undetectableGrammar: taught.grammar.filter((g) => !g.fragments).map((g) => g.id),
    sentences: tagged,
  });
  console.log();
}

// ── micro ──────────────────────────────────────────────────────────────────

/**
 * Micro-readings: the labelled stopgap of 04 §5 option (c). A handful of
 * verbatim sentences sharing a theme and a coverage band — thematic
 * neighbours, not a story, and the data says so about itself. Themes come
 * from the taught vocabulary's own `theme` field, so a cluster is "sentences
 * exercising the food words", never an authored narrative.
 */
const MICRO = {
  maxLen: 40,        // reading material may run longer than lesson phrases
  clusterSize: 5,    // "a handful"
  minCluster: 3,
  maxPerGroup: 4,    // readings per theme+band; a dev corpus, not the library
  // Flow material and mining material. The 95 band is nearly empty on real
  // data (one unknown in a short sentence lands at 90) but populates as
  // sentences and the taught inventory grow, so it stays in the list.
  bands: ["100", "95", "90"],
};

/**
 * A stray single-hiragana unknown (the い left behind when a kana-written verb
 * fails to match, say) is tokenizer noise, not a word to mine. A below-100
 * sentence whose unknowns are all noise is neither flow material nor mining
 * material, so micro selection requires at least one substantive unknown —
 * multi-character, kanji, or katakana. tagged.json keeps every sentence with
 * its honest coverage; this filter is selection, not correction.
 */
const KANA_NOISE = /^[ぁ-ゖ]$/;
const hasSubstantiveUnknown = (runs) => runs.some((r) => !KANA_NOISE.test(r));

function dominantTheme(vocabIds, themeById) {
  const counts = new Map();
  for (const id of vocabIds) {
    const theme = themeById.get(id);
    if (theme) counts.set(theme, (counts.get(theme) ?? 0) + 1);
  }
  let best = null, bestN = 0;
  for (const [theme, n] of counts) if (n > bestN) { best = theme; bestN = n; }
  // One themed word is coincidence; two is a theme.
  return bestN >= 2 ? best : null;
}

function micro() {
  const { sentences, dictForms, stats } = loadCorpus();
  const taught = loadTaught(dictForms);

  const eligible = sentences
    .filter((s) => s.jpn.length <= MICRO.maxLen)
    .map((s) => levelAndTag(s, taught))
    .filter((t) => MICRO.bands.includes(t.band))
    .filter((t) => t.band === "100" || hasSubstantiveUnknown(t.unknownRuns))
    .map((t) => ({ ...t, theme: dominantTheme(t.vocabIds, taught.themeById) }))
    .filter((t) => t.theme);

  const groups = new Map();
  for (const t of eligible) {
    const key = `${t.theme}|${t.band}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(t);
  }

  const readings = [];
  for (const [key, members] of [...groups].sort()) {
    const [theme, bandName] = key.split("|");
    // Shortest first within the group; chunking whole sentences is selection
    // and arrangement, never editing inside one.
    members.sort((a, b) => a.jpn.length - b.jpn.length || a.jpn.localeCompare(b.jpn, "ja"));
    for (let i = 0, n = 0; i + MICRO.minCluster <= members.length && n < MICRO.maxPerGroup; i += MICRO.clusterSize, n++) {
      const chunk = members.slice(i, i + MICRO.clusterSize);
      if (chunk.length < MICRO.minCluster) break;
      const tokens = chunk.reduce((sum, s) => sum + s.totalTokens, 0);
      const knownTokens = chunk.reduce((sum, s) => sum + Math.round(s.coverage * s.totalTokens), 0);
      readings.push({
        id: `reading.${theme}-${bandName}-${n + 1}`,
        theme,
        band: bandName,
        passageCoverage: Number((knownTokens / tokens).toFixed(4)),
        sentences: chunk.map((s) => ({
          jpn: s.jpn,
          eng: s.eng,
          tatoebaId: s.tatoebaId,
          coverage: s.coverage,
          unknownRuns: s.unknownRuns,
          vocabIds: s.vocabIds,
          grammarIds: s.grammarIds,
        })),
      });
    }
  }

  console.log(`\nmicro — ${stats.kept} sentences, ${eligible.length} eligible (<= ${MICRO.maxLen} chars, banded, themed)\n`);
  const byBand = {};
  for (const r of readings) byBand[r.band] = (byBand[r.band] ?? 0) + 1;
  console.log(`  readings                ${readings.length} (${Object.entries(byBand).map(([b, n]) => `${n} at band ${b}`).join(", ")})`);
  console.log(`  themes                  ${new Set(readings.map((r) => r.theme)).size}`);

  write("micro-readings.json", {
    generated: new Date().toISOString().slice(0, 10),
    stopgap:
      "This is 04-path-n3.md section 5 option (c), the labelled stopgap: thematically clustered verbatim Tatoeba sentences at a shared coverage band. Thematic neighbours, NOT coherent texts — the reader UI must not dress these up as stories. Replace with licensed graded readers or levelled Aozora texts when the section 5 text-source decision lands.",
    attribution: ATTRIBUTION,
    knownSet: "full taught inventory at generation time",
    bands: {
      "100": "every token known — flow material",
      "95": "coverage in [0.95, 1) — long sentences with one unknown; sparse until the taught inventory grows",
      "90": "coverage in [0.90, 0.95) — typically one unknown token, mining material",
    },
    counts: { readings: readings.length, byBand, eligibleSentences: eligible.length },
    readings,
  });
  console.log();
}

// ── main ───────────────────────────────────────────────────────────────────

const invokedDirectly = process.argv[1]?.endsWith("reading.mjs") ?? false;
const cmd = invokedDirectly ? process.argv[2] : "__imported__";
if (cmd === "__imported__") { /* imported as a module */ }
else if (cmd === "ingest") ingest();
else if (cmd === "tag") tag();
else if (cmd === "micro") micro();
else {
  console.log("usage: node scripts/reading.mjs <ingest|tag|micro>");
  process.exit(1);
}
