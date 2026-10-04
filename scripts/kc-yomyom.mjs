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
    // One book (010, 泉州野菜) sets its furigana-bearing kanji as separate text
    // items padded with spaces, so they came out as 泉 州 and 有 名 -- junk to
    // a tokenizer and to a learner mining the sentence. Japanese does not put
    // spaces between its own characters; a space with Japanese on both sides is
    // layout, not text. Latin spacing (SENSHU BOYZ) is left alone.
    .replace(/(?<=[぀-ヿ一-鿿])[ 　]+(?=[぀-ヿ一-鿿])/g, "")
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

// ── unknowns: what the stories need that the books do not teach ─────────────

/** Endings that turn a verb or adjective stem back into its dictionary form. */
const DICT_ENDINGS = ["る", "う", "く", "す", "つ", "ぬ", "ぶ", "む", "ぐ", "い", "する"];

/**
 * Candidate strings for the word an unknown run belongs to, longest first.
 *
 * The levelling reports surface runs -- 逃げ, 勉, 悩 -- because it stops where
 * the text stops being explicable. A glossary needs the word itself: reading
 * forward (勉 -> 勉強), a dictionary ending restored (逃げ -> 逃げる), or one or
 * two characters back in case a taught prefix swallowed its head (大 + 学).
 */
export function candidateForms(sentence, offset, run) {
  const out = [];
  for (let len = Math.min(8, sentence.length - offset); len > run.length; len--) out.push(sentence.slice(offset, offset + len));
  for (const e of DICT_ENDINGS) out.push(run + e);
  out.push(run);
  for (const k of [1, 2]) {
    if (offset - k < 0) continue;
    for (let len = Math.min(8, sentence.length - offset + k); len >= run.length + k; len--) out.push(sentence.slice(offset - k, offset - k + len));
  }
  return out;
}


/** Godan masu-stem endings back to their dictionary endings. */
const I_TO_U = { い: "う", き: "く", ぎ: "ぐ", し: "す", ち: "つ", に: "ぬ", び: "ぶ", み: "む", り: "る" };
const VERB_FOLLOWS = /^(ま[すしせ]|たい|たく|たかっ|ながら|に(行|来|い|き)|て|た)/;

/** Parts of speech that are grammar, not vocabulary: Book Three teaches those as patterns. */
const GRAMMAR_POS = /^(aux|prt|cop|suf|pref|conj)/;

async function unknowns() {
  const { ourWords, ourLessons } = await import("./jlpt.mjs");
  const { buildLexicon, tokenize } = await import("./levelling.mjs");
  const src = join(ROOT, "server/data/jmdict-examples-eng-3.6.2.json");
  if (!existsSync(src)) {
    console.error("\n  server/data/jmdict-examples-eng-3.6.2.json is not present (gitignored). Restore it to run this.\n");
    process.exit(1);
  }
  const jm = JSON.parse(readFileSync(src, "utf8"));
  // Every entry a form belongs to. Forms are shared -- 前 is both まえ and
  // ぜん, はし both bridge and chopsticks -- and picking one blind is how the
  // first draft of this report read 前 as ぜん.
  const byForm = new Map();
  const dictForms = new Set();
  for (const e of jm.words) {
    const common = [...e.kanji, ...e.kana].some((f) => f.common);
    const entry = {
      seq: e.id,
      form: e.kanji[0]?.text ?? e.kana[0]?.text,
      reading: e.kana[0]?.text ?? "",
      gloss: e.sense[0]?.gloss.slice(0, 3).map((g) => g.text).join("; ") ?? "",
      pos: e.sense[0]?.partOfSpeech ?? [],
      common,
      hasKanji: e.kanji.length > 0,
      usuallyKana: e.sense.some((x) => (x.misc ?? []).includes("uk")),
    };
    for (const f of [...e.kanji, ...e.kana]) {
      if (f.common) dictForms.add(f.text);
      if (!byForm.has(f.text)) byForm.set(f.text, []);
      byForm.get(f.text).push(entry);
    }
  }

  // The verb a stem stands for, when the text says it is one.
  const verbFor = (f, next) => {
    let candidates = [];
    if (VERB_FOLLOWS.test(next)) {
      const last = f.at(-1);
      if (I_TO_U[last]) candidates.push(f.slice(0, -1) + I_TO_U[last]);
      candidates.push(f + "る");
    } else if (/[てで]$/.test(f) && f.length > 2) {
      candidates.push(f.slice(0, -1) + "る");
    }
    for (const c of candidates) {
      const v = (byForm.get(c) ?? []).find((e) => e.common && e.pos.some((p) => /^v/.test(p)));
      if (v) return { form: c, entry: v };
    }
    return null;
  };

  const words = ourWords();
  const lexicon = buildLexicon(words, dictForms);
  const bookOf = (id) => ({ n5: 1, b2: 2, b3: 3, b4: 4 })[id.split(".")[0]] ?? 9;
  const firstBook = new Map();
  for (const l of ourLessons()) for (const w of l.wordIds) {
    const b = bookOf(l.id);
    if (!firstBook.has(w) || b < firstBook.get(w)) firstBook.set(w, b);
  }
  // Which JMdict entry each taught word stands for. A kana-only word is
  // ambiguous -- はく is to wear shoes and to vomit -- and mapping it to every
  // entry spelled that way is how the first draft filed 吐く as "already taught".
  // Resolve by the word's own JMdict citation, which most of Book One carries;
  // failing that, by an English word the entry's gloss shares; failing that,
  // only when the spelling is unambiguous.
  const { citations } = await import("./jmdict.mjs");
  const ownSeq = new Map();
  for (const c of citations()) {
    const id = c.item?.id;
    if (!id) continue;
    const forms = new Set((byForm.get(c.item.japanese?.trim()) ?? []).concat(byForm.get(c.item.reading?.trim()) ?? []).map((e) => e.seq));
    if (forms.has(c.seq) && !ownSeq.has(id)) ownSeq.set(id, c.seq);
  }
  const glossWords = (s) => new Set((s ?? "").toLowerCase().match(/[a-z]{3,}/g) ?? []);
  const taughtBySeq = new Map();
  const taughtForm = new Map();
  for (const w of words) {
    const book = firstBook.get(w.id);
    if (book === undefined) continue;
    for (const f of [w.japanese, w.reading].map((x) => x?.trim()).filter(Boolean)) {
      if (!taughtForm.has(f) || book < taughtForm.get(f).book) taughtForm.set(f, { id: w.id, book });
    }
    const candidates = byForm.get(w.japanese?.trim()) ?? [];
    let seqs;
    if (ownSeq.has(w.id)) seqs = [ownSeq.get(w.id)];
    else if (candidates.length === 1) seqs = [candidates[0].seq];
    else {
      const mine = glossWords(w.english);
      seqs = candidates.filter((e) => [...glossWords(e.gloss)].some((g) => mine.has(g))).map((e) => e.seq);
    }
    for (const seq of seqs) {
      const prev = taughtBySeq.get(seq);
      if (!prev || book < prev.book) taughtBySeq.set(seq, { id: w.id, book, japanese: w.japanese });
    }
  }

  const lib = JSON.parse(readFileSync(OUT, "utf8"));
  const buckets = { new: new Map(), spelling: new Map(), bookFour: new Map() };
  const unresolved = new Map();
  const gained = new Map();
  const note = (bucket, key, base, story, jpn) => {
    const w = bucket.get(key) ?? { ...base, count: 0, stories: new Set(), example: jpn, sentences: {} };
    w.count++; w.stories.add(story); w.sentences[story] ??= jpn; bucket.set(key, w);
    if (bucket !== unresolved) gained.set(story, (gained.get(story) ?? 0) + 1);
  };

  /**
   * The dictionary word standing at `at`, given the run the tokenizer saw
   * there. Returns { pick } with the entry, "taught" when Books One to Three
   * already teach it, "grammar" when only a grammar entry fits, or null.
   */
  const resolve = (jpn, at, run) => {
    const forms = candidateForms(jpn, at, run);
    // A taught word the tokenizer missed -- おいし before そう, a kana-only
    // adjective with no kanji stem to match -- is a tokenizer limit, not a gap.
    if (forms.some((f) => (taughtForm.get(f)?.book ?? 9) <= 3)) return "taught";
    let grammarOnly = false;
    for (const f of forms) {
      const all = byForm.get(f) ?? [];
      if (!all.length) continue;
      const entries = all.filter((e) => !e.pos.some((p) => GRAMMAR_POS.test(p)));
      if (!entries.length) { grammarOnly = true; continue; }
      // A candidate reaching past the run into hiragana is only a word if
      // it carries kanji (okurigana: 逃げる, 大好き). A kana-only reach is
      // two words glued together -- じゃあ + く read as 邪悪, "wicked".
      const reachedKana = f.length > run.length && /[ぁ-ゖ]/.test(f.slice(run.length)) && !/\p{Script=Han}/u.test(f);
      if (reachedKana) continue;
      if (f.length < 2 && !/\p{Script=Han}/u.test(f)) continue;
      // A hiragana-only form counts only for a word normally written that
      // way. しょう is 商, "quotient", in JMdict -- and debris from でしょう
      // in every story. かぼちゃ is usually kana, so it passes.
      const kanaOnly = /^[ぁ-ゖー]+$/.test(f);
      const usable = kanaOnly ? entries.filter((e) => !e.hasKanji || e.usuallyKana) : entries;
      if (!usable.length) continue;
      const taught = usable.find((e) => (taughtBySeq.get(e.seq)?.book ?? 9) <= 4);
      const entry = taught ?? usable.find((e) => e.common) ?? usable[0];
      // A restored ending must not beat the run itself when the run is a
      // common word and the restoration is not: 侍 (samurai) over 侍る.
      const bare = (byForm.get(run) ?? []).find((e) => e.common && !e.pos.some((p) => GRAMMAR_POS.test(p)));
      if (f !== run && f.startsWith(run) && !entry.common && bare) return { pick: { form: run, entry: bare } };
      // A particle straight after the run means the run was the word: 光の
      // is the noun 光, not the verb 光る restored from it.
      if (f !== run && f.startsWith(run) && bare && jpn.startsWith(run, at) && /^[のがをにでとはもへや]/.test(jpn.slice(at + run.length))) {
        return { pick: { form: run, entry: bare } };
      }
      if (jpn.startsWith(f, at)) {
        const next = jpn.slice(at + f.length);
        // A stem followed by ます, たい or ながら is a verb, whatever noun JMdict
        // also spells that way: 動きます is 動く, not 動き "movement"; 流れます is
        // 流れる, not 流れ "flow". て after a stem is the same verb's te-form.
        const verb = verbFor(f, next);
        if (verb) return { pick: verb };
      }
      return { pick: { form: f, entry } };
    }
    return grammarOnly ? "grammar" : null;
  };

  const classify = (pick, jpn, at, storyId) => {
    const { form, entry } = pick;
    const taught = taughtBySeq.get(entry.seq);
    // 珍さま, アインさん: a form followed by an honorific is someone's name
    // in this story, whatever JMdict says the characters mean.
    const probableName = /^(さま|さん|くん|ちゃん|様)/.test(jpn.slice(jpn.indexOf(form, Math.max(0, at - 2)) + form.length));
    const base = { form, seq: entry.seq, reading: entry.reading, gloss: entry.gloss, pos: entry.pos, common: entry.common, probableName };
    if (taught && taught.book <= 3) note(buckets.spelling, entry.seq, { ...base, taughtAs: taught.japanese, taughtId: taught.id, taughtIn: taught.book }, storyId, jpn);
    else if (taught && taught.book === 4) note(buckets.bookFour, taught.id, { id: taught.id, form, reading: entry.reading, seq: entry.seq }, storyId, jpn);
    else note(buckets.new, entry.seq, base, storyId, jpn);
  };

  const wordById = new Map(words.map((w) => [w.id, w]));
  for (const story of lib.stories) {
    for (const { jpn } of story.sentences) {
      let offset = 0;
      for (const t of tokenize(jpn, lexicon)) {
        const at = offset;
        offset += t.text.length;

        if (t.kind === "item") {
          // A token matched only by a taught word's kanji stem may be some
          // other word entirely: 多 is the head of Book Four's 多才, and of the
          // untaught 多い. Ask what word actually stands here. Found 2026-10-04
          // when 多い, 広い, 動く, 始まる and 必ず turned out to be taught nowhere
          // in the course and invisible to the first version of this report.
          const exact = t.itemIds.some((id) => {
            const w = wordById.get(id);
            return w && (w.japanese?.trim() === t.text || w.reading?.trim() === t.text);
          });
          // A one-kanji word followed by kana may be the stem of another word:
          // 数 is Book Four's "number", 数えて is the untaught 数える.
          const stemOfOther = exact && t.text.length === 1 && /\p{Script=Han}/u.test(t.text) && /^[ぁ-ゖ]/.test(jpn.slice(at + 1));
          if ((!exact || stemOfOther) && /\p{Script=Han}/u.test(t.text)) {
            const r = resolve(jpn, at, t.text);
            if (r === "taught" || r === "grammar") continue;
            if (r) {
              const known = taughtBySeq.get(r.pick.entry.seq);
              if (known && known.book <= 3) continue; // the word is known, under another id
              classify(r.pick, jpn, at, story.id);
              continue;
            }
          }
          // Book Four words tokenize as known items against the full lexicon,
          // so they never surface as unknown runs. Catch them here.
          const books = t.itemIds.map((id) => firstBook.get(id)).filter((b) => b !== undefined);
          if (books.length && Math.min(...books) === 4) {
            const id = t.itemIds.find((i) => firstBook.get(i) === 4);
            const w = wordById.get(id);
            // A short kana reading -- 身 read み, 背 read せ -- matches inside
            // any word that happens to contain that kana. Only the written word is the word.
            if (t.text !== w?.japanese?.trim()) continue;
            note(buckets.bookFour, id, { id, form: w?.japanese, reading: w?.reading }, story.id, jpn);
          }
          continue;
        }
        if (t.kind !== "unknown") continue;
        if (/^[ぁ-ゖー]{1,2}$/.test(t.text)) continue; // segmentation debris, measured in #136

        const r = resolve(jpn, at, t.text);
        if (r === "taught" || r === "grammar") continue;
        if (!r) { note(unresolved, t.text, { run: t.text }, story.id, jpn); continue; }
        classify(r.pick, jpn, at, story.id);
      }
    }
  }

  const rank = (m) =>
    [...m.values()]
      .map((w) => ({ ...w, stories: [...w.stories] }))
      .sort((a, b) => b.stories.length - a.stories.length || b.count - a.count || Number(b.common ?? 0) - Number(a.common ?? 0));
  const fresh = rank(buckets.new);
  const spelling = rank(buckets.spelling);
  const bookFour = rank(buckets.bookFour);
  const names = rank(unresolved);
  // What a glossary buys: each story's coverage if every word it resolves
  // were known. Proper nouns and debris stay unknown, so this is a floor.
  const perStory = lib.stories.map((st) => {
    const tokens = st.sentences.reduce((n, x) => n + x.totalTokens, 0);
    const known = st.sentences.reduce((n, x) => n + Math.round(x.coverage * x.totalTokens), 0);
    const glossary = new Set([...fresh, ...spelling, ...bookFour].filter((r) => r.stories.includes(st.id)).map((r) => r.seq ?? r.id)).size;
    return { id: st.id, title: st.title, level: st.level, now: st.passageCoverage, withGlossary: Number(Math.min(1, (known + (gained.get(st.id) ?? 0)) / tokens).toFixed(4)), glossaryWords: glossary };
  });
  const out = join(ROOT, "data/reading/kc-unknowns.json");
  writeFileSync(
    out,
    JSON.stringify(
      {
        generated: new Date().toISOString().slice(0, 10),
        note:
          "Generated by `node scripts/kc-yomyom.mjs unknowns`. What the KC yomu yomu stories need that Books One to Three do not supply, resolved to JMdict entries. Candidates for the Book Three reading glossary, not authored content.",
        buckets: {
          new: "no book teaches this JMdict entry",
          spelling: "Books One-Three teach the word, but in another written form (usually kana); the story writes it in kanji",
          bookFour: "Book Four teaches it; a glossary entry should reuse that id",
          unresolved: "runs with no JMdict entry -- mostly proper nouns and onomatopoeia",
        },
        counts: { new: fresh.length, newCommon: fresh.filter((r) => r.common).length, spelling: spelling.length, bookFour: bookFour.length, unresolved: names.length },
        perStory,
        new: fresh,
        spelling,
        bookFour,
        unresolved: names,
      },
      null,
      1,
    ),
  );
  console.log(`\n  new ${fresh.length} (${fresh.filter((r) => r.common).length} common) · spelling ${spelling.length} · Book Four ${bookFour.length} · unresolved ${names.length}  -> ${out}\n`);
  const show = (title, rows, fmt) => { console.log(`  ── ${title}`); for (const r of rows) console.log("  " + fmt(r)); console.log(); };
  show("NEW, top 40", fresh.slice(0, 40), (r) => `${String(r.stories.length).padStart(2)}st ${String(r.count).padStart(2)}x ${r.common ? "C" : " "} ${r.form}\t${r.reading}\t${r.seq}\t${r.gloss.slice(0, 44)}`);
  show("SPELLING (taught in another form)", spelling.slice(0, 15), (r) => `${String(r.stories.length).padStart(2)}st ${r.form} <- taught as ${r.taughtAs} (Book ${r.taughtIn})`);
  show("BOOK FOUR (reuse id)", bookFour.slice(0, 12), (r) => `${String(r.stories.length).padStart(2)}st ${r.form}\t${r.id}`);
  show("UNRESOLVED, top 15", names.slice(0, 15), (r) => `${String(r.stories.length).padStart(2)}st ${r.count}x ${r.run}`);
}


// ── draft: starter glossary files for src/content/reading/ ──────────────────

/**
 * One starter YAML per story from the inventory, for an author to verify.
 *
 * The english is JMdict's FIRST sense, which is a guess: the author's job is to
 * check every entry against its sentence and replace it with the sense the story
 * means. `draft-senses.txt` beside the output lists every sense of every entry so
 * that check does not need the dictionary open. Names are not drafted -- there
 * is no entry to draft from -- and debris is never vocabulary.
 *
 * Refuses to overwrite: a drafted file that has been reviewed is authored
 * content, and regenerating over it would silently undo the review.
 */
async function draftGlossaries() {
  const inv = JSON.parse(readFileSync(join(ROOT, "data/reading/kc-unknowns.json"), "utf8"));
  const lib = JSON.parse(readFileSync(OUT, "utf8"));
  const jm = JSON.parse(readFileSync(join(ROOT, "server/data/jmdict-examples-eng-3.6.2.json"), "utf8"));
  const bySeq = new Map(jm.words.map((e) => [e.id, e]));
  const dir = join(ROOT, "src/content/reading");
  mkdirSync(dir, { recursive: true });
  const q = (v) => JSON.stringify(v);
  const review = [];
  let written = 0;

  for (const story of lib.stories) {
    const slug = story.id.replace(/^kc\./, "");
    const file = join(dir, `kc-${slug}.yaml`);
    if (existsSync(file)) { console.log(`  keep    kc-${slug}.yaml (exists)`); continue; }
    const rows = [
      ...inv.new.map((r) => ({ ...r, kind: "new" })),
      ...inv.spelling.map((r) => ({ ...r, kind: "spelling" })),
      ...inv.bookFour.map((r) => ({ ...r, kind: "book-four", taughtId: r.id })),
    ].filter((r) => r.stories.includes(story.id) && r.seq);
    const lines = [
      `# Reading glossary: KC よむよむ — ${story.title} (${story.id}, ${story.level})`,
      "# Words this story uses that Books One to Three do not teach. Not lesson vocabulary:",
      "# Book Three's words arrive by mining from the library (book-three-bands.md section 1).",
      "# Text: KC よむよむ, Japan Foundation Kansai Center, CC BY-NC 2.1 JP, sentences verbatim.",
      "# Entries: JMdict for Applications 3.6.2 (CC BY 4.0), seq cited per entry, sense checked",
      "# against the sentence it came from.",
      "",
    ];
    review.push(`\n==== ${story.id} — ${story.title}`);
    for (const r of rows) {
      const e = bySeq.get(r.seq);
      const senses = (e?.sense ?? []).map((x, i) => `${i + 1}. ${x.gloss.map((g) => g.text).join("; ")}`);
      const sentence = r.sentences?.[story.id] ?? r.example;
      lines.push(
        `- id: gloss.${slug}.${r.seq}`,
        `  story: ${story.id}`,
        `  kind: ${r.kind}`,
        `  japanese: ${q(r.form)}`,
        `  reading: ${q(r.reading)}`,
        `  english: ${q((e?.sense[0]?.gloss ?? []).slice(0, 3).map((g) => g.text).join("; "))}`,
        `  sentence: ${q(sentence)}`,
        ...(r.taughtId ? [`  taughtId: ${r.taughtId}`] : []),
        `  notes: ${q(`JMdict seq ${r.seq}.`)}`,
        "",
      );
      review.push(`${r.kind.padEnd(9)} ${r.form} [${r.reading}] seq ${r.seq}  «${sentence}»`, ...senses.slice(0, 6).map((x) => `      ${x}`));
    }
    writeFileSync(file, lines.join("\n"));
    written++;
  }
  writeFileSync(join(ROOT, "data/reading/draft-senses.txt"), review.join("\n") + "\n");
  console.log(`\n  drafted ${written} files; every sense listed in data/reading/draft-senses.txt\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cmd = process.argv[2];
  if (cmd === "fetch") await fetchAll();
  else if (cmd === "build") await build();
  else if (cmd === "unknowns") await unknowns();
  else if (cmd === "draft") await draftGlossaries();
  else { console.log("usage: node scripts/kc-yomyom.mjs <fetch | build | unknowns | draft>"); process.exitCode = 1; }
}
