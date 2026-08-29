/**
 * Books — the course as data (03 §0a).
 *
 * A separate module rather than an edit to content/lessons/index.ts: the
 * lesson index is the file every content branch touches, and wrapping it here
 * keeps this groundwork conflict-free with in-flight chapter work. Each further
 * book is one more instance here when its content exists.
 */
import type { Book } from "@/types";
import { n5Lessons, b2Lessons } from "@/content/lessons";
import { n5Chapters, b2Chapters } from "@/content/chapters";

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
