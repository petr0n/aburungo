#!/usr/bin/env node
/**
 * Global Voices 日本語 passages for Book Three's gate texts.
 *
 *   node scripts/global-voices.mjs fetch    download the chosen articles -> data/reading/gv/ (gitignored)
 *   node scripts/global-voices.mjs build    extract, credit, level -> data/reading/gv-passages.json
 *
 * Six of Book Three's eleven bands teach N3 grammar that none of the 26 KC
 * よむよむ stories uses, so they had no gate text (src/content/reading/gates.yaml).
 * Global Voices is CC BY 3.0 -- attribution only, no NC, no ND, verified on its
 * own /about page (docs/text-source-brief.md) -- and its news register is full
 * of exactly that grammar. One paragraph per band, chosen by hand on
 * 2026-10-04 from 300 articles: a genuine use of the band's pattern, readable on
 * its own, as much of it known to a Book Three graduate as the corpus offers.
 *
 * Licence obligations, carried in the output so nothing downstream can drop
 * them: credit the author and translator with a link to the article, at the top
 * of wherever the passage is shown; text only -- embedded photos and video may
 * be under other terms.
 *
 * Text is verbatim. A passage is pinned by article, paragraph index and its
 * opening words, so an edited article fails the build instead of silently
 * becoming a different passage.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sentences } from "./kc-yomyom.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = join(ROOT, "data/reading/gv");
const OUT = join(ROOT, "data/reading/gv-passages.json");
const API = "https://jp.globalvoices.org/wp-json/wp/v2/posts";

export const ATTRIBUTION = {
  source: "Global Voices 日本語",
  sourceUrl: "https://jp.globalvoices.org/",
  licence: "CC BY 3.0",
  licenceUrl: "https://creativecommons.org/licenses/by/3.0/",
  note: "Text only, verbatim. Credit the author and translator with a link to the article at the top of wherever a passage is shown.",
};

/** One paragraph per band. `opens` is the passage's first words, the pin. */
export const PASSAGES = [
  { band: "b3.band-1", post: 65377, para: 13, opens: "10代の私にはこの暗闇から" },
  { band: "b3.band-2", post: 62448, para: 1, opens: "私はこれまでオーストラリアの" },
  { band: "b3.band-3", post: 63643, para: 20, opens: "たとえ日本で永住権を" },
  { band: "b3.band-4", post: 58290, para: 32, opens: "チェコの人たちはよく私たちを" },
  { band: "b3.band-8", post: 58639, para: 14, opens: "親戚や教師、まったくの他人から" },
  { band: "b3.band-10", post: 63627, para: 1, opens: "もうだいぶ前のことだが" },
];

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&[a-z]+;/g, "");
const strip = (h) => decode(h.replace(/<[^>]+>/g, "")).trim();

/** The paragraph at `index`, splitting the rendered article on </p>. */
export function paragraph(rendered, index) {
  return strip(rendered.split(/<\/p>/)[index] ?? "");
}

/**
 * Title and credits from the article page header: 記者 (English) is the author,
 * 翻訳 (日本語) the translator, and the closing contributors block the proofreader.
 * Read from the page, not the API, because the API hides author names.
 */
export function credits(pageHtml) {
  // Start after the container's opening tag closes, not at the class name --
  // slicing at the name made the rest of the tag itself the first "text".
  const at = pageHtml.indexOf("post-header-container");
  const head = pageHtml.slice(pageHtml.indexOf(">", at) + 1);
  const texts = head.split(/<[^>]+>/).map((t) => decode(t).trim()).filter(Boolean);
  const after = (label) => {
    const i = texts.indexOf(label);
    return i >= 0 ? texts[i + 1] : null;
  };
  const proof = pageHtml.match(/class="contributors">\s*校正[：:]\s*(?:<[^>]+>\s*)*([^<]+)/);
  return {
    title: texts[0] ?? null,
    author: after("記者 (English)"),
    translator: after("翻訳 (日本語)"),
    proofreader: proof ? decode(proof[1]).trim() : null,
  };
}

async function fetchAll() {
  mkdirSync(CACHE, { recursive: true });
  for (const { post } of PASSAGES) {
    const json = join(CACHE, `${post}.json`);
    const page = join(CACHE, `${post}.html`);
    if (!existsSync(json)) {
      const res = await fetch(`${API}/${post}?_fields=id,link,date,title,content`);
      if (!res.ok) throw new Error(`${post}: HTTP ${res.status}`);
      writeFileSync(json, await res.text());
    }
    if (!existsSync(page)) {
      const { link } = JSON.parse(readFileSync(json, "utf8"));
      const res = await fetch(link);
      if (!res.ok) throw new Error(`${link}: HTTP ${res.status}`);
      writeFileSync(page, await res.text());
    }
    console.log(`  have ${post}`);
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
  const throughBookThree = new Set(ourLessons().filter((l) => /^(n5|b2|b3)\./.test(l.id)).flatMap((l) => l.wordIds));

  const stories = [];
  for (const p of PASSAGES) {
    const json = join(CACHE, `${p.post}.json`);
    if (!existsSync(json)) throw new Error(`${json} missing -- run \`fetch\` first`);
    const post = JSON.parse(readFileSync(json, "utf8"));
    const text = paragraph(post.content.rendered, p.para);
    if (!text.startsWith(p.opens)) {
      throw new Error(`${p.post}#${p.para} no longer opens "${p.opens}" -- the article changed; choose the passage again`);
    }
    const c = credits(readFileSync(join(CACHE, `${p.post}.html`), "utf8"));
    if (!c.author || !c.translator) throw new Error(`${p.post}: could not read the author and translator credit`);
    const sents = sentences([text]).map((jpn) => {
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
    const tokens = sents.reduce((n, s) => n + s.totalTokens, 0);
    const known = sents.reduce((n, s) => n + Math.round(s.coverage * s.totalTokens), 0);
    const knownAllBooks = sents.reduce((n, s) => n + Math.round(s.coverageAllBooks * s.totalTokens), 0);
    const passageCoverage = tokens ? Number((known / tokens).toFixed(4)) : 0;
    stories.push({
      id: `gv.${p.post}-${p.para}`,
      title: c.title ?? strip(post.title.rendered),
      level: "news",
      link: post.link,
      date: post.date.slice(0, 10),
      author: c.author,
      translator: c.translator,
      proofreader: c.proofreader,
      gateFor: p.band,
      chars: sents.reduce((n, s) => n + s.jpn.length, 0),
      sentences: sents,
      passageCoverage,
      passageCoverageAllBooks: tokens ? Number((knownAllBooks / tokens).toFixed(4)) : 0,
      band: band(passageCoverage),
      unknownRuns: [...new Set(sents.flatMap((s) => s.unknownRuns))],
    });
    console.log(`  ${p.band.padEnd(11)} gv.${p.post}-${p.para}  ${sents.length} sent  ${passageCoverage.toFixed(3)}  ${c.author} / ${c.translator}`);
  }

  writeFileSync(
    OUT,
    JSON.stringify(
      {
        generated: new Date().toISOString().slice(0, 10),
        attribution: ATTRIBUTION,
        knownSet: "words taught by Book One through Book Three at generation time; coverageAllBooks uses every taught word",
        counts: { stories: stories.length, sentences: stories.reduce((n, s) => n + s.sentences.length, 0), chars: stories.reduce((n, s) => n + s.chars, 0) },
        stories,
      },
      null,
      1,
    ),
  );
  console.log(`\n  ${stories.length} passages -> ${OUT}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cmd = process.argv[2];
  if (cmd === "fetch") await fetchAll();
  else if (cmd === "build") await build();
  else { console.log("usage: node scripts/global-voices.mjs <fetch | build>"); process.exitCode = 1; }
}
