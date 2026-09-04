#!/usr/bin/env node
/**
 * Generate the book map: every book, chapter, lesson, checkpoint, word and phrase.
 *
 *   node scripts/ladder.mjs            write docs/<book>-ladder.md for every book
 *   node scripts/ladder.mjs --check    exit 1 if any file is out of date
 *
 * Books are discovered from src/content/chapters/*.yaml — one file per book,
 * lessons attached to a book by the prefix on their chapterId (or their own id,
 * for the checkpoints that close a book). A new book renders nothing until it
 * has a BOOKS entry below: generation throws instead, which fails `pnpm test`,
 * so new content cannot land without appearing on the map.
 *
 * This writes the diff-able record only. The browsable map is the bookmap/
 * SPA (`pnpm bookmap`), which renders the app's own content modules and so
 * cannot go stale; the Markdown here is what renders on GitHub and shows a
 * readable diff in a content PR. It also lists the shelved Hana checkpoints,
 * which the SPA never sees — the app's modules filter them out (DR-023).
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
  b2: { order: 2, title: "Book Two" },
  b3: { order: 3, title: "Book Three" },
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


/** Every file the map is made of — one Markdown record per book. */
export function buildOutputs() {
  const ctx = readContent();
  return ctx.books.map((book) => ({
    path: join(ROOT, "docs", `${book.slug}-ladder.md`),
    name: `docs/${book.slug}-ladder.md`,
    text: buildMarkdown(book, ctx),
  }));
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
