/**
 * Structural guarantees for the content tree.
 *
 * These live in a test rather than as a module-load check because `vite build`
 * bundles the content without executing it — a throw at module scope only fires
 * in the browser. Two duplicate-id bugs (vocab.asa, then vocab.noru/oriru) got
 * past a green build that way.
 */
import { describe, expect, it } from "vitest";
import { allWords } from "./vocabulary";
import { allPhrases } from "./index";
import { n5Lessons } from "./lessons";
import { n5Chapters, placeInChapter } from "./chapters";
import { books } from "./books";

/**
 * Every shipped lesson, across every book.
 *
 * The cross-reference checks below have to run on this rather than on
 * `n5Lessons`: the collections they check (`allWords`, `allPhrases`) are one
 * flat list for the whole course, so scoping the ladder side to one book turns
 * "no orphaned content" into "no orphaned content Book One happens to teach" —
 * and every word Book Two brought would have read as an orphan.
 */
const allLessons = books.flatMap((b) => b.lessons);

describe("content integrity", () => {
  it("has no duplicate word ids across files", () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const w of allWords) {
      if (seen.has(w.id)) dupes.push(w.id);
      seen.add(w.id);
    }
    expect(dupes).toEqual([]);
  });

  it("has no duplicate phrase ids across files", () => {
    // The word version of this check has existed since vocab.asa; the phrase
    // version did not, and a duplicate id would make findPhrase return whichever
    // file loaded first. Every chapter adds a phrase file, so the odds only grow.
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const p of allPhrases) {
      if (seen.has(p.id)) dupes.push(p.id);
      seen.add(p.id);
    }
    expect(dupes).toEqual([]);
  });

  it("has no lesson referencing a word that does not exist", () => {
    const ids = new Set(allWords.map((w) => w.id));
    const dangling: string[] = [];
    for (const u of allLessons) {
      for (const id of u.wordIds) if (!ids.has(id)) dangling.push(`${u.id} -> ${id}`);
    }
    expect(dangling).toEqual([]);
  });

  it("teaches every phrase somewhere in the ladder", () => {
    // Added 2026-08-16 after twelve authored phrases were found sitting in the
    // content tree with no lesson referencing them — five about paying in a
    // shop, four about a hotel stay, two about directions. They were valid and
    // sourced, and a learner simply never met them. The word version of this
    // check existed; the phrase version did not, which is exactly why it went
    // unnoticed while the word orphans got fixed twice.
    const taught = new Set(allLessons.flatMap((l) => l.phraseIds));
    const orphans = allPhrases.filter((p) => !taught.has(p.id)).map((p) => p.id);
    expect(orphans).toEqual([]);
  });

  it("teaches every word somewhere in the ladder", () => {
    // A word no lesson references is content the learner never meets. 41 words
    // sat orphaned this way before the depth pass.
    const taught = new Set(allLessons.flatMap((u) => u.wordIds));
    const orphans = allWords.filter((w) => !taught.has(w.id)).map((w) => w.id);
    expect(orphans).toEqual([]);
  });
});

/**
 * The shipped ladder shape.
 *
 * Hana is shelved (DR-023), so these assert what a learner *actually* gets. The
 * conversation lessons are still authored and still tested as components — they
 * are simply filtered out of the ladder, and this is the guard that says so.
 * Flip VITE_HANA_ENABLED and these expectations change by design.
 */
describe("the ladder with Hana shelved", () => {
  it("ends on the production checkpoint", () => {
    const last = n5Lessons[n5Lessons.length - 1];
    expect(last?.checkpoint).toBe("production");
  });

  it("carries no lesson that would need an API call", () => {
    // The failure this guards: a Hana lesson reaching the ladder and becoming a
    // screen that apologises for itself, which is the dead end DR-022 removed.
    const gated = n5Lessons.filter((u) => u.checkpoint === "conversation" || u.checkpoint === "can-do");
    expect(gated.map((u) => u.id)).toEqual([]);
  });

  it("has contiguous orders with no gap left by the filtered lessons", () => {
    expect(n5Lessons.map((u) => u.order)).toEqual(n5Lessons.map((_, i) => i + 1));
  });

  it("puts production after the last recognition checkpoint, not before it", () => {
    // Recognise everything, then produce it. The reverse would gate on the
    // harder skill first and make the recognition checkpoint redundant.
    const lastRecognition = [...n5Lessons].reverse().find((u) => u.checkpoint === "recognition");
    const production = n5Lessons.find((u) => u.checkpoint === "production");
    expect(production?.order).toBeGreaterThan(lastRecognition?.order ?? Infinity);
  });
});

/**
 * Chapter shape.
 *
 * A chapter is a promise to the learner: this many lessons, then a checkpoint.
 * Every rule here is that promise made checkable, because the session header
 * reads "Lesson 4 of 10" straight off this structure — get it wrong and the app
 * lies about how much is left.
 */
describe("chapters", () => {
  const chaptered = n5Lessons.filter((l) => l.chapterId !== undefined);

  it("gives every teaching lesson a chapter", () => {
    const homeless = n5Lessons.filter((l) => l.chapterId === undefined && l.checkpoint === undefined);
    expect(homeless.map((l) => l.id)).toEqual([]);
  });

  it("leaves only the book-closing checkpoints outside a chapter", () => {
    // The production checkpoint reviews the whole level, not one chapter's
    // situations, so it answers to the book instead.
    const outside = n5Lessons.filter((l) => l.chapterId === undefined);
    expect(outside.map((l) => l.checkpoint)).toEqual(["production"]);
  });

  it("references only chapters that exist", () => {
    const known = new Set(n5Chapters.map((c) => c.id));
    const dangling = chaptered.filter((l) => !known.has(l.chapterId ?? ""));
    expect(dangling.map((l) => l.id)).toEqual([]);
  });

  it("keeps each chapter's lessons contiguous in order", () => {
    // A chapter split around another chapter's lessons would make "Lesson 4 of
    // 10" meaningless and put the checkpoint somewhere the learner never
    // reaches in one run.
    for (const chapter of n5Chapters) {
      const orders = n5Lessons.filter((l) => l.chapterId === chapter.id).map((l) => l.order);
      expect(orders).toEqual(orders.map((_, i) => (orders[0] ?? 0) + i));
    }
  });

  it("runs chapters in ascending order down the ladder", () => {
    const firstOrders = n5Chapters.map((c) => n5Lessons.find((l) => l.chapterId === c.id)?.order ?? 0);
    expect(firstOrders).toEqual([...firstOrders].sort((a, b) => a - b));
  });

  it("ends every chapter with exactly one checkpoint, as its last lesson", () => {
    // The whole point of a chapter: the checkpoint is the close, and there is
    // only one. A checkpoint mid-chapter consolidates nothing (DR-021).
    for (const chapter of n5Chapters) {
      const lessons = n5Lessons.filter((l) => l.chapterId === chapter.id);
      const checkpoints = lessons.filter((l) => l.checkpoint !== undefined);
      expect(checkpoints).toHaveLength(1);
      expect(lessons[lessons.length - 1]?.checkpoint).toBeDefined();
    }
  });

  it("has no empty chapter", () => {
    for (const chapter of n5Chapters) {
      expect(n5Lessons.filter((l) => l.chapterId === chapter.id).length).toBeGreaterThan(1);
    }
  });

  it("counts a lesson's position within its chapter, checkpoint excluded", () => {
    const first = n5Lessons[0];
    expect(first).toBeDefined();
    const placement = placeInChapter(first!, n5Lessons, n5Chapters);
    expect(placement?.chapter.order).toBe(1);
    expect(placement?.lessonNumber).toBe(1);
    expect(placement?.remaining).toBe((placement?.lessonCount ?? 0) - 1);
  });

  it("numbers a chapter's checkpoint as the close rather than a lesson", () => {
    const checkpoint = n5Lessons.find((l) => l.checkpoint !== undefined && l.chapterId !== undefined);
    expect(checkpoint).toBeDefined();
    const placement = placeInChapter(checkpoint!, n5Lessons, n5Chapters);
    expect(placement?.lessonNumber).toBeNull();
    expect(placement?.remaining).toBe(0);
  });

  it("places no book-level checkpoint in a chapter", () => {
    const production = n5Lessons.find((l) => l.checkpoint === "production");
    expect(production).toBeDefined();
    expect(placeInChapter(production!, n5Lessons, n5Chapters)).toBeNull();
  });
});
