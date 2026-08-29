/**
 * Books — the course as data (03 §0a).
 *
 * A separate module rather than an edit to content/lessons/index.ts: the
 * lesson index is the file every content branch touches, and wrapping it here
 * keeps this groundwork conflict-free with in-flight chapter work. Each further
 * book is one more instance here when its content exists.
 */
import type { Book, UserTier } from "@/types";
import { n5Lessons, b2Lessons } from "@/content/lessons";
import { n5Chapters, b2Chapters } from "@/content/chapters";
import { reachable } from "@/content/access";

export const bookOne: Book = {
  id: "book-1",
  // Frozen: every PathProgress row, local and remote, is keyed on this string.
  progressKey: "n5",
  order: 1,
  title: "Book One",
  chapters: n5Chapters,
  lessons: n5Lessons,
  stage: "foundation",
};

export const bookTwo: Book = {
  id: "book-2",
  /**
   * Frozen from the moment this ships, the same way Book One's "n5" is: the
   * first learner to open Book Two writes a PathProgress row keyed on it, and
   * changing it after that orphans them.
   *
   * Not "n4". A book is a volume of the course, not a JLPT level (DR-033), so
   * keying progress on a level would re-assert exactly what that decision
   * dropped. Book One's key is "n5" only because it predates the decision and
   * cannot be renamed.
   */
  progressKey: "book-2",
  order: 2,
  title: "Book Two",
  chapters: b2Chapters,
  lessons: b2Lessons,
  // Past `foundation`: romaji is cut and recall is the default review gate.
  stage: "building",
};

/** Every book, in ladder order. */
export const books: readonly Book[] = [bookOne, bookTwo];

/** The books before this one — whose items keep coming back for review. */
export function priorBooks(book: Book): readonly Book[] {
  return books.filter((b) => b.order < book.order);
}

/**
 * The book the learner is on.
 *
 * The first book, in `order`, that their tier reaches and that still has a
 * lesson they have not seen. If every reachable book is finished they get the
 * last reachable one, so they land on that book's "all caught up" rather than
 * on nothing at all.
 *
 * Pure: books and progress arrive as parameters. Keyed on `progressKey`, never
 * on `id` — the two are allowed to disagree and Book One's already do.
 *
 * `source` is sorted rather than trusted: array position is not the ladder.
 */
export function currentBook(
  source: readonly Book[],
  seenLessonIdsByProgressKey: ReadonlyMap<string, readonly string[]>,
  tier: UserTier,
): Book {
  const inOrder = [...source].sort((a, z) => a.order - z.order).filter((b) => reachable(b.order, tier));
  const unfinished = inOrder.find((b) => {
    const seen = new Set(seenLessonIdsByProgressKey.get(b.progressKey) ?? []);
    return b.lessons.some((l) => !seen.has(l.id));
  });
  const book = unfinished ?? inOrder[inOrder.length - 1];
  // Every tier reaches book order 1, so this is unreachable with a real course.
  if (book === undefined) throw new Error("no book is reachable — the course is empty");
  return book;
}
