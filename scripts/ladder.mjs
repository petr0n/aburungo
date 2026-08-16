#!/usr/bin/env node
/**
 * Generate the book map: every chapter, lesson, checkpoint, word and phrase.
 *
 *   node scripts/ladder.mjs            write docs/book-one-ladder.md
 *   node scripts/ladder.mjs --check    exit 1 if that file is out of date
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
const DEST = join(ROOT, "docs/book-one-ladder.md");

const loadDir = (dir) =>
  readdirSync(join(ROOT, "src/content", dir))
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

export function buildMarkdown() {
  const lessons = loadDir("lessons").sort((a, b) => a.order - b.order);
  const chapters = yaml.load(readFileSync(join(ROOT, "src/content/chapters/n5.yaml"), "utf8"));
  const words = new Map(loadDir("vocabulary").map((w) => [w.id, w]));
  const phrases = new Map(loadDir("phrases").map((p) => [p.id, p]));
  const patterns = new Map(loadDir("grammar").map((g) => [g.id, g]));

  const shipping = lessons.filter((l) => !isShelved(l));
  const teaching = shipping.filter((l) => !l.checkpoint);
  const kanji = new Set(shipping.flatMap((l) => l.kanji ?? []));

  const out = [];
  const w = (line = "") => out.push(line);

  w("# Book One");
  w();
  w("Every chapter, lesson and checkpoint a learner meets, in order, with the words and");
  w("phrases each one teaches.");
  w();
  w("**Generated — do not edit.** Run `pnpm ladder` after any content change; `pnpm test`");
  w("fails if this file is out of date. Book One is N5 internally; a learner never reads that.");
  w();
  w("| | |");
  w("|---|---|");
  w(`| Chapters | ${chapters.length} |`);
  w(`| Lessons | ${shipping.length} (${teaching.length} teaching, ${shipping.length - teaching.length} checkpoints) |`);
  w(`| Words | ${words.size} |`);
  w(`| Phrases | ${phrases.size} |`);
  w(`| Grammar patterns | ${patterns.size} |`);
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

// Guarded so importing buildMarkdown for the staleness test does not rewrite
// the file the test is about to compare against.
const invokedDirectly = process.argv[1]?.endsWith("ladder.mjs") ?? false;
const markdown = invokedDirectly ? buildMarkdown() : "";

if (!invokedDirectly) {
  /* imported as a module */
} else if (process.argv.includes("--check")) {
  let current = "";
  try {
    current = readFileSync(DEST, "utf8");
  } catch {
    /* missing counts as out of date */
  }
  if (current !== markdown) {
    console.error("docs/book-one-ladder.md is out of date — run `pnpm ladder`");
    process.exit(1);
  }
  console.log("docs/book-one-ladder.md is current");
} else {
  writeFileSync(DEST, markdown);
  console.log(`wrote docs/book-one-ladder.md (${markdown.split("\n").length} lines)`);
}
