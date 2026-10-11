import { describe, expect, it } from "vitest";
import { books } from "@/content/books";
import { findPhrase } from "@/content";
import { allWords, findWord } from "@/content/vocabulary";
import { findGrammarPattern } from "@/content/grammar";
import { buildLexicon, tokenize } from "../../scripts/levelling.mjs";
import baselineText from "./wordScope.baseline.txt?raw";

/**
 * A lesson's sentences should not lean on a word the course teaches later
 * (Layer 2a scope, docs/plans/08-autonomous-verification-layers.md).
 *
 * Checked: each lesson's phrases and its grammar pattern's example, against
 * every word taught up to and including that lesson, across books in order.
 *
 * Only kanji-written tokens that equal a later word's written form, reading or
 * stem (written form minus trailing kana) count. Measured 2026-10-11, kana
 * matching is noise -- は reads as 葉 "leaf" inside こんにちは -- and bare prefix
 * matching blames 話して on 話し合う when 話す is taught. What is left is high
 * precision; text the course never teaches at all is not this check's job.
 *
 * The cases found when the check landed are frozen in the baseline as known
 * and accepted for now (owner decision 2026-10-11): some are chunk-phrases
 * taught whole before their parts, most are Tatoeba sentences. A NEW case
 * fails, and so does a baseline line that no longer occurs, so the list only
 * shrinks. A failure prints the exact lines to add or delete in
 * wordScope.baseline.txt -- add only for a case you have decided to accept.
 */

const KANJI = /[一-鿿]/u;
const stem = (written: string) => written.replace(/[぀-ゟ]+$/u, "");

function findEarlyWords(): string[] {
  const lexicon = buildLexicon(allWords, null);
  const taught = new Set<string>();
  const found = new Set<string>();

  for (const book of books) {
    for (const lesson of [...book.lessons].sort((a, b) => a.order - b.order)) {
      for (const id of lesson.wordIds) taught.add(id);

      const sentenceIds = [...lesson.phraseIds];
      const pattern = lesson.patternId ? findGrammarPattern(lesson.patternId) : undefined;
      if (pattern && !sentenceIds.includes(pattern.phraseId)) sentenceIds.push(pattern.phraseId);

      for (const sentenceId of sentenceIds) {
        const phrase = findPhrase(sentenceId);
        if (!phrase) continue;
        for (const token of tokenize(phrase.japanese, lexicon)) {
          if (token.kind !== "item" || !KANJI.test(token.text)) continue;
          const ids = token.itemIds ?? [];
          if (ids.some((id) => taught.has(id))) continue;
          const later = ids.filter((id) => {
            const w = findWord(id);
            return w !== undefined && [w.japanese, w.reading, stem(w.japanese)].includes(token.text);
          });
          if (later.length) found.add(`${lesson.id} ${sentenceId} ${token.text}=${later.sort().join("/")}`);
        }
      }
    }
  }
  return [...found].sort();
}

const baseline = baselineText.split("\n").filter((l) => l.trim() && !l.startsWith("#"));

describe("word scope", () => {
  const current = findEarlyWords();

  it("finds a known case, so an empty result means clean and not broken", () => {
    // これは本です opens Book One before 本 is taught: a deliberate chunk.
    expect(current).toContain("n5.unit-1 basics.this-is-a-book 本=vocab.hon");
  });

  it("adds no sentence that uses a word the course teaches later", () => {
    const accepted = new Set(baseline);
    expect(current.filter((c) => !accepted.has(c))).toEqual([]);
  });

  it("keeps no baseline line that no longer occurs, so the list only shrinks", () => {
    const now = new Set(current);
    expect(baseline.filter((b) => !now.has(b))).toEqual([]);
  });
});
