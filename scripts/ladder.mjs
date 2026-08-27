#!/usr/bin/env node
/**
 * Generate the book map: every book, chapter, lesson, checkpoint, word and phrase.
 *
 *   node scripts/ladder.mjs            write docs/<book>-ladder.{md,html} for every book
 *   node scripts/ladder.mjs --check    exit 1 if any file is out of date
 *
 * Books are discovered from src/content/chapters/*.yaml — one file per book,
 * lessons attached to a book by the prefix on their chapterId (or their own id,
 * for the checkpoints that close a book). A new book renders nothing until it
 * has a BOOKS entry below: generation throws instead, which fails `pnpm test`,
 * so new content cannot land without appearing on the map. Each book's HTML
 * page links to every other book's, so the map is one browsable set.
 *
 * Two formats from one pass. The Markdown renders on GitHub and diffs
 * meaningfully in a content PR; the HTML is the one to actually read, with each
 * lesson's words and phrases behind a native <details> so the whole book still
 * fits on one screen at a glance.
 *
 * Generated, never hand-written. docs/plans/02b-n5-units.md is what happens
 * otherwise: authored when the ladder had 35 units, still saying so long after
 * the ladder had 58 and chapters existed. A map that drifts is worse than none,
 * because it still reads like a record.
 *
 * Committing the Markdown is the point. It renders on GitHub, it opens in the
 * phone editor, and every content PR shows a readable diff of exactly which
 * words and phrases changed — which reviewing YAML across six files does not.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Title and order for each book, keyed by the id prefix its chapters carry.
 * Deliberately the only hand-written piece: a chapters file whose prefix has
 * no entry here makes generation throw, so a new book cannot land invisible.
 */
const BOOKS = {
  n5: { order: 1, title: "Book One" },
};

const loadDir = (dir) =>
  readdirSync(join(ROOT, "src/content", dir), { recursive: true })
    .map(String)
    .filter((f) => f.endsWith(".yaml"))
    .flatMap((f) => {
      const parsed = yaml.load(readFileSync(join(ROOT, "src/content", dir, f), "utf8"));
      return Array.isArray(parsed) ? parsed : [];
    });

const CHECKPOINT_LABEL = {
  recognition: "Recognition checkpoint",
  production: "Production checkpoint",
  conversation: "Conversation with Hana",
  "can-do": "Can-do review",
};

/** Hana is shelved (DR-023), so its lessons are not part of the shipped ladder. */
const isShelved = (l) => l.checkpoint === "conversation" || l.checkpoint === "can-do";

function readContent() {
  const words = new Map(loadDir("vocabulary").map((w) => [w.id, w]));
  const phrases = new Map(loadDir("phrases").map((p) => [p.id, p]));
  const patterns = new Map(loadDir("grammar").map((g) => [g.id, g]));

  const books = readdirSync(join(ROOT, "src/content/chapters"))
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => {
      const chapters = yaml.load(readFileSync(join(ROOT, "src/content/chapters", f), "utf8"));
      const prefixes = [...new Set(chapters.map((c) => c.id.split(".")[0]))];
      if (prefixes.length !== 1) {
        throw new Error(`chapters/${f}: chapter ids mix prefixes (${prefixes.join(", ")})`);
      }
      const key = prefixes[0];
      const meta = BOOKS[key];
      if (!meta) {
        throw new Error(
          `chapters/${f}: no BOOKS entry for id prefix "${key}" — add the book's title and order to BOOKS in scripts/ladder.mjs so the book map renders it`,
        );
      }
      const slug = meta.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return { key, ...meta, slug, chapters, lessons: [] };
    })
    .sort((a, b) => a.order - b.order);

  const byKey = new Map(books.map((b) => [b.key, b]));
  for (const lesson of loadDir("lessons").sort((a, b) => a.order - b.order)) {
    const key = (lesson.chapterId ?? lesson.id).split(".")[0];
    const book = byKey.get(key);
    if (!book) {
      throw new Error(`lesson "${lesson.id}": id prefix "${key}" matches no book — the book map cannot place it`);
    }
    book.lessons.push(lesson);
  }

  return { books, words, phrases, patterns };
}

/** Unique word/phrase/pattern ids a book's lessons reach — its content, counted. */
function bookCounts(lessons) {
  return {
    words: new Set(lessons.flatMap((l) => l.wordIds ?? [])).size,
    phrases: new Set(lessons.flatMap((l) => l.phraseIds ?? [])).size,
    patterns: new Set(lessons.flatMap((l) => (l.patternId ? [l.patternId] : []))).size,
  };
}

function buildMarkdown(book, ctx) {
  const { lessons, chapters, title } = book;
  const { words, phrases, patterns } = ctx;
  const shipping = lessons.filter((l) => !isShelved(l));
  const teaching = shipping.filter((l) => !l.checkpoint);
  const kanji = new Set(shipping.flatMap((l) => l.kanji ?? []));
  const counts = bookCounts(lessons);

  const out = [];
  const w = (line = "") => out.push(line);

  w(`# ${title}`);
  w();
  w("Every chapter, lesson and checkpoint a learner meets, in order, with the words and");
  w("phrases each one teaches.");
  w();
  w("**Generated — do not edit.** Run `pnpm ladder` after any content change; `pnpm test`");
  w(`fails if this file is out of date. Ids carry the book's \`${book.key}\` prefix; a learner`);
  w("never reads it.");
  w();
  if (ctx.books.length > 1) {
    w(ctx.books.map((b) => (b.key === book.key ? `**${b.title}**` : `[${b.title}](${b.slug}-ladder.md)`)).join(" · "));
    w();
  }
  w("| | |");
  w("|---|---|");
  w(`| Chapters | ${chapters.length} |`);
  w(`| Lessons | ${shipping.length} (${teaching.length} teaching, ${shipping.length - teaching.length} checkpoints) |`);
  w(`| Words | ${counts.words} |`);
  w(`| Phrases | ${counts.phrases} |`);
  w(`| Grammar patterns | ${counts.patterns} |`);
  w(`| Kanji introduced | ${kanji.size} |`);
  w();

  for (const chapter of chapters) {
    const own = shipping.filter((l) => l.chapterId === chapter.id);
    const chapterTeaching = own.filter((l) => !l.checkpoint);
    const situations = [...new Set(chapterTeaching.map((l) => l.situation))];

    w("---");
    w();
    w(`## Chapter ${chapter.order} — ${chapter.title}`);
    w();
    w(`*${situations.join(" · ")}*`);
    w();
    w(
      `${chapterTeaching.length} lessons · ` +
        `${chapterTeaching.reduce((n, l) => n + (l.wordIds ?? []).length, 0)} words · ` +
        `${chapterTeaching.reduce((n, l) => n + (l.phraseIds ?? []).length, 0)} phrases`,
    );
    w();

    let n = 0;
    for (const lesson of own) {
      if (lesson.checkpoint) {
        w(`### ${lesson.order}. ${CHECKPOINT_LABEL[lesson.checkpoint]} — closes the chapter`);
        w();
        w(`> ${lesson.grammarNote}`);
        w();
        continue;
      }
      n += 1;
      w(`### ${lesson.order}. ${lesson.title}`);
      w();
      w(`**Lesson ${n} of ${chapterTeaching.length}** · ${lesson.situation}`);
      w(`**Can do:** ${lesson.canDo}`);
      if (lesson.patternId) {
        const pattern = patterns.get(lesson.patternId);
        if (pattern) w(`**Grammar:** \`${pattern.pattern}\` — ${pattern.gloss}`);
      }
      if ((lesson.kanji ?? []).length) w(`**New kanji:** ${lesson.kanji.join(" ")}`);
      w();

      if ((lesson.wordIds ?? []).length) {
        w("| Word | Reading | Meaning |");
        w("|---|---|---|");
        for (const id of lesson.wordIds) {
          const word = words.get(id);
          if (!word) continue;
          w(`| ${word.japanese} | ${word.reading} | ${word.english} |`);
        }
        w();
      }
      for (const id of lesson.phraseIds ?? []) {
        const phrase = phrases.get(id);
        if (!phrase) continue;
        w(`- ${phrase.japanese} — ${phrase.english}`);
      }
      if ((lesson.phraseIds ?? []).length) w();
    }
  }

  const closers = shipping.filter((l) => l.chapterId === undefined);
  if (closers.length) {
    w("---");
    w();
    w("## Closing the book");
    w();
    w("Belongs to no chapter — reviews every situation in the book rather than one chapter's worth.");
    w();
    for (const lesson of closers) {
      w(`### ${lesson.order}. ${CHECKPOINT_LABEL[lesson.checkpoint]}`);
      w();
      w(`> ${lesson.grammarNote}`);
      w();
    }
  }

  const shelved = lessons.filter(isShelved);
  if (shelved.length) {
    w("---");
    w();
    w("## Shelved — not on the ladder");
    w();
    w("Built and tested, switched off behind `VITE_HANA_ENABLED` (DR-023). Filtered out of the");
    w(`ladder entirely, so the orders above run 1–${shipping.length} with no gap.`);
    w();
    for (const lesson of shelved) w(`- ${lesson.title} — ${CHECKPOINT_LABEL[lesson.checkpoint]}`);
    w();
  }

  return out.join("\n");
}

// ── HTML ──────────────────────────────────────────────────────────────────────

const esc = (v) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * The readable version.
 *
 * Palette and type come from the Zuihoden design system in
 * aburungo-design-system/src/tokens.css rather than being invented here: warm
 * paper and sumi ink, Ai-iro for structure, Rokusho for checkpoints, Ogon for
 * kanji chips. Akane is deliberately unused -- it is reserved for the brand mark
 * and errors, and a chapter heading is neither.
 *
 * Each lesson's content sits behind a native <details>, so the page opens as the
 * whole book at a glance and expands to the words and phrases on demand. No
 * script, so it works from a file:// URL and inside GitHub's raw view.
 */
function buildHtml(book, ctx) {
  const { lessons, chapters, title } = book;
  const { words, phrases, patterns } = ctx;
  const shipping = lessons.filter((l) => !isShelved(l));
  const teaching = shipping.filter((l) => !l.checkpoint);
  const kanji = new Set(shipping.flatMap((l) => l.kanji ?? []));
  const counts = bookCounts(lessons);

  const lessonBlock = (lesson, n, total) => {
    if (lesson.checkpoint) {
      return `<li class="row row--cp">
      <span class="ord">${lesson.order}</span>
      <span class="cp-body">
        <span class="cp-title">${esc(CHECKPOINT_LABEL[lesson.checkpoint])}</span>
        <span class="cp-note">${esc(lesson.canDo)}</span>
      </span>
      <span class="cp-tag">${lesson.chapterId === undefined ? "closes the book" : "closes the chapter"}</span>
    </li>`;
    }
    const wordRows = (lesson.wordIds ?? [])
      .map((id) => words.get(id))
      .filter(Boolean)
      .map((word) => `<tr><td lang="ja">${esc(word.japanese)}</td><td lang="ja">${esc(word.reading)}</td><td>${esc(word.english)}</td></tr>`)
      .join("");
    const phraseRows = (lesson.phraseIds ?? [])
      .map((id) => phrases.get(id))
      .filter(Boolean)
      .map((phrase) => `<li><span lang="ja">${esc(phrase.japanese)}</span> <em>${esc(phrase.english)}</em></li>`)
      .join("");
    const pattern = lesson.patternId ? patterns.get(lesson.patternId) : null;

    return `<li class="row">
      <span class="ord">${lesson.order}</span>
      <div class="body">
        <span class="head"><span class="n">Lesson ${n} of ${total}</span><span class="sit">${esc(lesson.situation)}</span></span>
        <span class="title">${esc(lesson.title)}</span>
        <span class="cando">${esc(lesson.canDo)}</span>
        ${pattern ? `<span class="pat"><span lang="ja">${esc(pattern.pattern)}</span> — ${esc(pattern.gloss)}</span>` : ""}
        <details>
          <summary>${(lesson.wordIds ?? []).length} words · ${(lesson.phraseIds ?? []).length} phrases${(lesson.kanji ?? []).length ? ` · ${lesson.kanji.length} kanji` : ""}</summary>
          <div class="detail">
            ${wordRows ? `<table><thead><tr><th>Word</th><th>Reading</th><th>Meaning</th></tr></thead><tbody>${wordRows}</tbody></table>` : ""}
            ${phraseRows ? `<ul class="phrases">${phraseRows}</ul>` : ""}
            ${(lesson.kanji ?? []).length ? `<p class="kanji">${lesson.kanji.map((k) => `<span class="k" lang="ja">${esc(k)}</span>`).join("")}</p>` : ""}
            <p class="note">${esc(lesson.grammarNote)}</p>
          </div>
        </details>
      </div>
    </li>`;
  };

  const chapterBlocks = chapters
    .map((chapter) => {
      const own = shipping.filter((l) => l.chapterId === chapter.id);
      const chapterTeaching = own.filter((l) => !l.checkpoint);
      const situations = [...new Set(chapterTeaching.map((l) => l.situation))];
      let n = 0;
      const rows = own.map((l) => lessonBlock(l, l.checkpoint ? null : (n += 1), chapterTeaching.length)).join("");
      return `<section class="chapter" aria-labelledby="ch${chapter.order}">
    <header class="ch-head">
      <span class="ch-num">${chapter.order}</span>
      <span class="ch-meta">
        <h2 id="ch${chapter.order}">${esc(chapter.title)}</h2>
        <p class="sits">${situations.map(esc).join(" · ")}</p>
      </span>
      <span class="ch-stats">
        <span><b>${chapterTeaching.length}</b> lessons</span>
        <span><b>${chapterTeaching.reduce((a, l) => a + (l.wordIds ?? []).length, 0)}</b> words</span>
        <span><b>${chapterTeaching.reduce((a, l) => a + (l.phraseIds ?? []).length, 0)}</b> phrases</span>
      </span>
    </header>
    <ol class="rows">${rows}</ol>
  </section>`;
    })
    .join("\n");

  const closers = shipping.filter((l) => l.chapterId === undefined).map((l) => lessonBlock(l, null, 0)).join("");
  const shelvedRows = lessons
    .filter(isShelved)
    .map((l) => `<li><span class="ord">${l.order}</span><span>${esc(l.title)} — ${esc(CHECKPOINT_LABEL[l.checkpoint])}</span></li>`)
    .join("");
  const bookNav = ctx.books
    .map((b) =>
      b.key === book.key
        ? `<span class="bk bk--on" aria-current="page">${esc(b.title)}</span>`
        : `<a class="bk" href="${b.slug}-ladder.html">${esc(b.title)}</a>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} Ladder</title>
<style>
:root{
  --paper:#F7F6F1; --card:#FFFDF8; --ink:#2D2D2D; --ink-2:#57534C; --ink-3:#6B665E;
  --line:#E2DED2; --line-2:#CFC9B9;
  --ai:#1F3A66; --ai-soft:#eff3f9; --rok:#4F9C8D; --rok-deep:#33685e; --rok-soft:#eef6f4;
  --ogon:#8a6a2b; --ogon-soft:#fbf6ea; --ogon-line:#ecd9a5;
  --serif:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,"Times New Roman",serif;
  --sans:ui-sans-serif,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  --jp:"Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP","Yu Gothic",sans-serif;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --paper:#14140f; --card:#1c1b17; --ink:#EFEDE5; --ink-2:#CFC9B9; --ink-3:#A4A4A4;
  --line:#33322c; --line-2:#403D38;
  --ai:#8fa5c7; --ai-soft:#101d34; --rok:#85bfb3; --rok-deep:#b3d7cf; --rok-soft:#18322d;
  --ogon:#dfc074; --ogon-soft:#2a2313; --ogon-line:#654d1f;
}}
:root[data-theme="dark"]{
  --paper:#14140f; --card:#1c1b17; --ink:#EFEDE5; --ink-2:#CFC9B9; --ink-3:#A4A4A4;
  --line:#33322c; --line-2:#403D38;
  --ai:#8fa5c7; --ai-soft:#101d34; --rok:#85bfb3; --rok-deep:#b3d7cf; --rok-soft:#18322d;
  --ogon:#dfc074; --ogon-soft:#2a2313; --ogon-line:#654d1f;
}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);font-size:15px;line-height:1.5;-webkit-text-size-adjust:100%}
.wrap{max-width:920px;margin:0 auto;padding:clamp(20px,5vw,56px) clamp(14px,4vw,32px) 72px}
header.book{border-bottom:2px solid var(--ink);padding-bottom:22px;margin-bottom:34px}
nav.bks{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 16px}
.bk{font-size:12px;letter-spacing:.04em;padding:4px 12px;border:1px solid var(--line-2);border-radius:99px;text-decoration:none;color:var(--ink-2);min-height:28px;display:inline-flex;align-items:center}
a.bk:hover{border-color:var(--ai);color:var(--ai)}
.bk--on{background:var(--ai-soft);border-color:var(--ai);color:var(--ai);font-weight:600}
.eyebrow{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3);margin:0 0 10px}
h1{font-family:var(--serif);font-weight:600;font-size:clamp(30px,6vw,46px);line-height:1.08;margin:0 0 6px;text-wrap:balance;letter-spacing:-.01em}
.sub{margin:0;color:var(--ink-2);max-width:62ch}
.totals{display:flex;flex-wrap:wrap;gap:8px 26px;margin-top:20px;font-variant-numeric:tabular-nums}
.totals div{display:flex;flex-direction:column}
.totals b{font-family:var(--serif);font-size:24px;font-weight:600;line-height:1.1}
.totals span{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-3)}
.chapter{background:var(--card);border:1px solid var(--line);border-radius:12px;margin-bottom:26px;overflow:hidden}
.ch-head{display:flex;align-items:flex-start;gap:16px;padding:18px 20px;border-bottom:1px solid var(--line);background:var(--ai-soft)}
.ch-num{font-family:var(--serif);font-size:38px;line-height:.9;font-weight:600;color:var(--ai);min-width:34px}
.ch-meta{flex:1 1 auto;min-width:0}
.ch-meta h2{font-family:var(--serif);font-size:21px;font-weight:600;margin:0 0 3px;letter-spacing:-.01em}
.sits{margin:0;font-size:12.5px;color:var(--ink-3)}
.ch-stats{display:flex;flex-direction:column;align-items:flex-end;gap:1px;font-size:12px;color:var(--ink-3);font-variant-numeric:tabular-nums;white-space:nowrap}
.ch-stats b{color:var(--ink);font-weight:600}
ol.rows{list-style:none;margin:0;padding:0}
.row{display:flex;gap:14px;padding:13px 20px;border-bottom:1px solid var(--line);align-items:flex-start}
.row:last-child{border-bottom:0}
.ord{font-variant-numeric:tabular-nums;font-size:12px;color:var(--ink-3);min-width:22px;padding-top:3px;text-align:right;flex:0 0 auto}
.body{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px}
.head{display:flex;gap:9px;align-items:baseline;flex-wrap:wrap}
.n{font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:var(--ai);font-weight:600}
.sit{font-size:11.5px;color:var(--ink-3)}
.title{font-family:var(--serif);font-size:17px;font-weight:600;line-height:1.25}
.cando{font-size:13px;color:var(--ink-2)}
.pat{font-size:12.5px;color:var(--ogon);margin-top:2px}
.pat span{font-family:var(--jp)}
details{margin-top:7px}
summary{cursor:pointer;font-size:11.5px;color:var(--ink-3);font-variant-numeric:tabular-nums;
  list-style:none;display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border:1px solid var(--line-2);border-radius:99px;min-height:26px}
summary::-webkit-details-marker{display:none}
summary::before{content:"+";font-weight:600;color:var(--ai)}
details[open] summary::before{content:"−"}
summary:hover{color:var(--ink-2)}
.detail{padding:10px 0 4px}
.detail table{border-collapse:collapse;width:100%;font-size:13px;margin-bottom:8px}
.detail th{text-align:left;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3);font-weight:600;padding:3px 8px 3px 0;border-bottom:1px solid var(--line)}
.detail td{padding:4px 8px 4px 0;border-bottom:1px solid var(--line);vertical-align:top}
.detail td:first-child{font-family:var(--jp);font-size:15px;white-space:nowrap}
.detail td:nth-child(2){font-family:var(--jp);color:var(--ink-3);white-space:nowrap}
ul.phrases{list-style:none;margin:0 0 8px;padding:0;font-size:13px}
ul.phrases li{padding:3px 0;border-bottom:1px solid var(--line)}
ul.phrases span{font-family:var(--jp);font-size:15px}
ul.phrases em{color:var(--ink-2);font-style:normal}
p.kanji{display:flex;gap:4px;flex-wrap:wrap;margin:0 0 8px}
.k{font-family:var(--jp);font-size:14px;line-height:1;padding:5px 6px;border-radius:4px;background:var(--ogon-soft);border:1px solid var(--ogon-line)}
p.note{margin:0;font-size:12.5px;color:var(--ink-2);background:var(--paper);border-left:2px solid var(--line-2);padding:8px 10px;border-radius:0 6px 6px 0}
.row--cp{background:var(--rok-soft);border-top:2px solid var(--rok);align-items:center}
.cp-body{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:1px}
.cp-title{font-family:var(--serif);font-size:16px;font-weight:600;color:var(--rok-deep)}
.cp-note{font-size:12.5px;color:var(--ink-2)}
.cp-tag{font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:var(--rok-deep);border:1px solid var(--rok);border-radius:99px;padding:3px 9px;white-space:nowrap;flex:0 0 auto}
section.closers{background:var(--card);border:1px solid var(--line-2);border-radius:12px;padding:4px 0;margin-bottom:26px}
.closers h3,.shelf h3{font-family:var(--serif);font-size:15px;margin:14px 20px 2px;font-weight:600}
.closers p,.shelf p{margin:0 20px 8px;font-size:12.5px;color:var(--ink-3);max-width:64ch}
.closers ol{list-style:none;margin:0;padding:0}
.shelf{border:1px dashed var(--line-2);border-radius:12px;padding:4px 0 12px;opacity:.75}
.shelf ul{list-style:none;margin:0;padding:0 20px}
.shelf li{display:flex;gap:14px;font-size:13px;color:var(--ink-3);padding:3px 0}
footer{margin-top:30px;font-size:12px;color:var(--ink-3);border-top:1px solid var(--line);padding-top:14px}
code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.92em;color:var(--ink-2)}
@media (max-width:620px){.ch-head{flex-wrap:wrap}.ch-stats{flex-direction:row;gap:12px;align-items:flex-start}.detail{overflow-x:auto}}
</style>
</head>
<body>
<div class="wrap">
<header class="book">
  <nav class="bks" aria-label="Books">${bookNav}</nav>
  <p class="eyebrow">AburunGo · ${esc(title)} · id prefix ${esc(book.key)}</p>
  <h1>${esc(title)} Ladder</h1>
  <p class="sub">Every chapter, lesson and checkpoint a learner meets, in order. Expand any lesson for
    the words and phrases it teaches. Generated from <code>src/content/</code> by <code>pnpm ladder</code>,
    so it is what the app ships — not a plan of what it might.</p>
  <div class="totals">
    <div><b>${shipping.length}</b><span>lessons</span></div>
    <div><b>${chapters.length}</b><span>chapters</span></div>
    <div><b>${shipping.length - teaching.length}</b><span>checkpoints</span></div>
    <div><b>${counts.words}</b><span>words</span></div>
    <div><b>${counts.phrases}</b><span>phrases</span></div>
    <div><b>${counts.patterns}</b><span>patterns</span></div>
    <div><b>${kanji.size}</b><span>kanji</span></div>
  </div>
</header>

${chapterBlocks}

${closers ? `<section class="closers">
  <h3>Closing the book</h3>
  <p>Belongs to no chapter: it reviews every situation in the book rather than one chapter's worth.</p>
  <ol class="rows">${closers}</ol>
</section>` : ""}

${shelvedRows ? `<section class="shelf">
  <h3>Shelved — not on the ladder</h3>
  <ul>${shelvedRows}</ul>
  <p style="margin-top:8px">Built and tested, switched off behind <code>VITE_HANA_ENABLED</code> (DR-023).
    Filtered out of the ladder entirely, so orders run 1–${shipping.length} with no gap.</p>
</section>` : ""}

<footer>Chapter length varies on purpose. Padding a chapter to a round number would put a checkpoint
mid-situation, which is what DR-021 exists to prevent.</footer>
</div>
</body>
</html>
`;
}

/** Every file the map is made of — one Markdown and one HTML page per book. */
export function buildOutputs() {
  const ctx = readContent();
  return ctx.books.flatMap((book) => [
    { path: join(ROOT, "docs", `${book.slug}-ladder.md`), name: `docs/${book.slug}-ladder.md`, text: buildMarkdown(book, ctx) },
    { path: join(ROOT, "docs", `${book.slug}-ladder.html`), name: `docs/${book.slug}-ladder.html`, text: buildHtml(book, ctx) },
  ]);
}

// Guarded so importing buildOutputs for the staleness test does not rewrite
// the files the test is about to compare against.
const invokedDirectly = process.argv[1]?.endsWith("ladder.mjs") ?? false;
if (invokedDirectly) {
  const outputs = buildOutputs();
  if (process.argv.includes("--check")) {
    const stale = outputs.filter((o) => {
      try {
        return readFileSync(o.path, "utf8") !== o.text;
      } catch {
        return true; // missing counts as out of date
      }
    });
    if (stale.length) {
      console.error(`out of date — run \`pnpm ladder\`: ${stale.map((o) => o.name).join(", ")}`);
      process.exit(1);
    }
    console.log("book map is current");
  } else {
    for (const o of outputs) {
      writeFileSync(o.path, o.text);
      console.log(`wrote ${o.name} (${o.text.split("\n").length} lines)`);
    }
  }
}
