#!/usr/bin/env node
/**
 * KC よむよむ ingestion (docs/plans/04-stage-reading.md §5, source option (a)).
 *
 *   node scripts/kc-yomyom.mjs fetch    download the PDFs -> data/reading/kc/ (gitignored)
 *   node scripts/kc-yomyom.mjs build    extract, level, write data/reading/kc-yomyom.json
 *
 * Twenty-six illustrated graded readers from the Japan Foundation Kansai
 * Center, CC BY-NC 2.1 JP -- the first licence found that permits the
 * modification this pipeline performs (furigana, segmentation, audio). NC is
 * the constraint: fine for the personal-use phase, and a paid app needs their
 * permission first. docs/text-source-brief.md records the search.
 *
 * Text is verbatim. The PDFs carry it as real text with furigana as separate
 * small-font runs, so `build` keeps only body-sized items and drops the rest --
 * furigana, page numbers, the title page's decorative sizes, the colophon.
 * Nothing composes or edits inside a sentence; splitting on 。！？ is the only
 * boundary drawn.
 *
 * Levelling uses the taught inventory through Book Three, because that is the
 * book this library belongs to: a story's coverage is what a learner who has
 * finished Book Three knows. The full-inventory number sits beside it.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = join(ROOT, "data/reading/kc");
const OUT = join(ROOT, "data/reading/kc-yomyom.json");
const BASE = "https://www.jpf.go.jp/j/kansai/clip";

export const ATTRIBUTION = {
  source: "KC よむよむ, The Japan Foundation Japanese-Language Institute, Kansai",
  sourceUrl: `${BASE}/yomyom/`,
  licence: "CC BY-NC 2.1 JP",
  licenceUrl: "https://creativecommons.org/licenses/by-nc/2.1/jp/",
  note: "Text is verbatim from the PDFs, furigana removed. Attribution must appear wherever a story is shown. Non-commercial: a paid release needs the Kansai Center's permission first.",
};

/** The catalogue, as listed on the source page on 2026-09-19. */
export const TITLES = [
  ["001_taro", "太郎くんの夏休み", "A1", "001_taro"],
  ["003_toshokan", "図書館", "A1", "003_toshokan"],
  ["004_tennoji", "天王寺動物園", "A1", "004_tennoji"],
  ["005_watashi", "私の一日", "A1", "005_watashi"],
  ["018_kongozan", "金剛山", "A1", "018_kongoozan"],
  ["024_hajimemashite", "はじめまして、私はアインです", "A1", "024_hajimemashite,watahiwa-aindesu"],
  ["025_anhsaninterview", "アインさんインタビュー", "A1", "025_ainsan-intabyuu"],
  ["002_tsukimi", "月見", "A2", null],
  ["006_kisetsu", "季節", "A2", "006_kisetsu"],
  ["007_obake", "お化け", "A2", "007_obake"],
  ["008_hijoguchi", "非常口", "A2", null],
  ["009_kabocha", "かぼちゃ", "A2", null],
  ["010_senshuyasai", "泉州野菜", "A2", "010_senshuyasai_native"],
  ["011_yadokari", "ヤドカリにげた", "A2", null],
  ["012_ramen", "ラーメン麺太の冒険", "A2", "012_ramen"],
  ["013_okikusan", "お菊さん", "A2", "013_okikusan"],
  ["014_kiyohime", "清姫", "A2", null],
  ["015_manhole", "マンホール", "A2", null],
  ["016_anata", "あなたへの3つのおねがい", "A2", null],
  ["017_concert", "コンサートに行こう！", "A2", null],
  ["019_iwawakisan", "岩湧山", "A2", null],
  ["021_idolnoshigoto", "アイドルの仕事", "A2", null],
  ["023_tsurinikki", "釣り日記 秋の大阪湾編", "A2", null],
  ["026_kekkonshiki", "結婚式", "A2", null],
  ["027_anhsanarbeitwosuru", "アインさんアルバイトをする？", "A2", null],
  ["022_idolyametai", "アイドルやめたい", "A2/B1", null],
].map(([file, title, level, mp3]) => ({
  file,
  title,
  level,
  pdfUrl: `${BASE}/images/page/yomyom/${file}.pdf`,
  mp3Url: mp3 === null ? null : `${BASE}/sound/page/yomyom/${mp3}.mp3`,
}));

// ── text ────────────────────────────────────────────────────────────────────

/** Lines that are apparatus, not story: credits, colophon, page furniture. */
const APPARATUS = /https?:|発行|図版|写真|監修|製作|素材|KCよむよむ|^\s*-\s*\d+\s*-\s*$/;

/**
 * Body sentences from one page's text items.
 *
 * Every item carries the font height it was set in. Body text is one size
 * throughout a book, furigana half of it, page numbers and the title page
 * other sizes again -- so "keep the modal height" is the whole rule, and it
 * needs no knowledge of which run is a reading. A title page has no body
 * items and yields nothing, which is right: the title comes from the catalogue.
 */
export function bodyLines(items, bodyHeight) {
  const lines = [];
  let line = "";
  for (const it of items) {
    if (!it.str.trim()) continue;
    if (Math.abs(it.height - bodyHeight) > 0.5) continue;
    line += it.str;
    if (it.hasEOL) { lines.push(line); line = ""; }
  }
  if (line) lines.push(line);
  return lines.map((l) => l.trim()).filter((l) => l && !APPARATUS.test(l));
}

/** The one height most characters on a page are set in. */
function pageMode(items) {
  const count = new Map();
  for (const it of items) {
    const n = it.str.trim().length;
    if (n) count.set(it.height, (count.get(it.height) ?? 0) + n);
  }
  let best = 0, bestH = 0;
  for (const [h, n] of count) if (n > best) { best = n; bestH = h; }
  return bestH;
}

/**
 * The body height: the size that wins the most pages.
 *
 * Not the size with the most characters in the book. The colophon is one
 * dense page of credits at 16pt, and in four of the twenty-six books it
 * outweighed nine pages of 20pt story -- so the whole story was filtered as
 * "not body" and those books came out empty. One page, one vote.
 */
export function modalHeight(pages) {
  const votes = new Map();
  for (const items of pages) {
    const h = pageMode(items);
    if (h) votes.set(h, (votes.get(h) ?? 0) + 1);
  }
  let best = 0, bestH = 0;
  for (const [h, n] of votes) if (n > best) { best = n; bestH = h; }
  return bestH;
}

/**
 * Split on sentence enders, keeping them. A diary heading like 7月24日（金）晴れ
 * has no ender and runs into the sentence after it; that is how the book
 * prints it, and nothing here invents a boundary the author did not draw.
 */
export function sentences(lines) {
  return lines
    .join("")
    .split(/(?<=[。！？])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function extract(pdfPath) {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await getDocument({ data: new Uint8Array(readFileSync(pdfPath)) }).promise;
  const pages = [];
  for (let p = 1; p <= doc.numPages; p++) {
    pages.push((await (await doc.getPage(p)).getTextContent()).items);
  }
  const bodyHeight = modalHeight(pages);
  return { pages: doc.numPages, lines: pages.flatMap((items) => bodyLines(items, bodyHeight)) };
}

// ── commands ────────────────────────────────────────────────────────────────

async function fetchAll() {
  mkdirSync(CACHE, { recursive: true });
  for (const t of TITLES) {
    const dest = join(CACHE, `${t.file}.pdf`);
    if (existsSync(dest)) { console.log(`  have    ${t.file}`); continue; }
    const res = await fetch(t.pdfUrl);
    if (!res.ok) throw new Error(`${t.pdfUrl}: HTTP ${res.status}`);
    writeFileSync(dest, new Uint8Array(await res.arrayBuffer()));
    console.log(`  fetched ${t.file}`);
  }
}

async function build() {
  const { jmdictExamples, ourWords, ourLessons } = await import("./jlpt.mjs");
  const { buildLexicon, levelSentence, band } = await import("./levelling.mjs");
  const corpus = jmdictExamples();
  if (corpus === null) {
    console.error("\n  server/data/jmdict-examples-eng-3.6.2.json is not present (gitignored). Restore it to build.\n");
    process.exit(1);
  }
  const words = ourWords();
  const lexicon = buildLexicon(words, corpus.dictForms);
  const knownAll = new Set(words.map((w) => w.id));
  // Book Three's library: what a learner who has finished it knows.
  const throughBookThree = new Set(
    ourLessons().filter((l) => /^(n5|b2|b3)\./.test(l.id)).flatMap((l) => l.wordIds),
  );

  const stories = [];
  for (const t of TITLES) {
    const pdf = join(CACHE, `${t.file}.pdf`);
    if (!existsSync(pdf)) throw new Error(`${pdf} missing -- run \`fetch\` first`);
    const { pages, lines } = await extract(pdf);
    const sents = sentences(lines);
    const levelled = sents.map((jpn) => {
      const b3 = levelSentence(jpn, lexicon, throughBookThree);
      const all = levelSentence(jpn, lexicon, knownAll);
      return {
        jpn,
        coverage: Number(b3.coverage.toFixed(4)),
        coverageAllBooks: Number(all.coverage.toFixed(4)),
        totalTokens: b3.totalTokens,
        unknownRuns: b3.unknownRuns,
        unknownItemIds: b3.unknownItemIds,
      };
    });
    const tokens = levelled.reduce((n, s) => n + s.totalTokens, 0);
    const known = levelled.reduce((n, s) => n + Math.round(s.coverage * s.totalTokens), 0);
    const knownAllBooks = levelled.reduce((n, s) => n + Math.round(s.coverageAllBooks * s.totalTokens), 0);
    const passageCoverage = tokens ? Number((known / tokens).toFixed(4)) : 0;
    const unknownRuns = [...new Set(levelled.flatMap((s) => s.unknownRuns))];
    stories.push({
      id: `kc.${t.file.replace(/^\d+_/, "")}`,
      title: t.title,
      level: t.level,
      pdfUrl: t.pdfUrl,
      mp3Url: t.mp3Url,
      pages,
      chars: sents.reduce((n, s) => n + s.length, 0),
      sentences: levelled,
      passageCoverage,
      passageCoverageAllBooks: tokens ? Number((knownAllBooks / tokens).toFixed(4)) : 0,
      band: band(passageCoverage),
      unknownRuns,
    });
    console.log(
      `  ${t.file.padEnd(24)} ${t.level.padEnd(5)} ${String(sents.length).padStart(3)} sent ` +
        `${String(passageCoverage.toFixed(3)).padStart(6)} b3  ${String(stories.at(-1).passageCoverageAllBooks.toFixed(3)).padStart(6)} all  ` +
        `unknown: ${unknownRuns.slice(0, 6).join(" ")}${unknownRuns.length > 6 ? " …" : ""}`,
    );
  }

  const byBand = {};
  for (const s of stories) byBand[s.band] = (byBand[s.band] ?? 0) + 1;
  writeFileSync(
    OUT,
    JSON.stringify(
      {
        generated: new Date().toISOString().slice(0, 10),
        attribution: ATTRIBUTION,
        knownSet: "words taught by Book One through Book Three at generation time; coverageAllBooks uses every taught word",
        counts: { stories: stories.length, sentences: stories.reduce((n, s) => n + s.sentences.length, 0), chars: stories.reduce((n, s) => n + s.chars, 0), byBand },
        stories,
      },
      null,
      1,
    ),
  );
  console.log(`\n  ${stories.length} stories, ${byBand["100"] ?? 0} at band 100, ${byBand["95"] ?? 0} at 95, ${byBand["90"] ?? 0} at 90, ${byBand.below ?? 0} below -> ${OUT}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cmd = process.argv[2];
  if (cmd === "fetch") await fetchAll();
  else if (cmd === "build") await build();
  else { console.log("usage: node scripts/kc-yomyom.mjs <fetch | build>"); process.exitCode = 1; }
}
