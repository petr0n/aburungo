/**
 * Books — the course as data (03 §0a).
 *
 * A separate module rather than an edit to content/lessons/index.ts: the
 * lesson index is the file every content branch touches, and wrapping it here
 * keeps this groundwork conflict-free with in-flight chapter work. Book Two
 * is one more instance here when its content exists.
 */
import type { Book } from "@/types";
import { n5Lessons } from "@/content/lessons";
import { n5Chapters } from "@/content/chapters";

export const bookOne: Book = {
  // Also the PathProgress pathId — must stay "n5" so existing progress keeps.
  id: "n5",
  order: 1,
  title: "Book One",
  chapters: n5Chapters,
  lessons: n5Lessons,
  difficultyShift: false,
};

/** Every book, in ladder order. Book Two joins here when its content exists. */
export const books: readonly Book[] = [bookOne];

/** The books before this one — whose items keep coming back for review. */
export function priorBooks(book: Book): readonly Book[] {
  return books.filter((b) => b.order < book.order);
}
