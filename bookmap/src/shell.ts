import type { Book } from "@/types";
import { books } from "@/content/books";

/**
 * Book Two shell — bookmap-only scaffolding so the book nav can be exercised
 * before the real Book Two exists. Deliberately not in src/content/books.ts:
 * that module feeds access gating and the learn page, and a learner must
 * never meet an empty book. Its progressKey here is a placeholder, not the
 * frozen key the Book Two plan says gets picked once (docs/plans/03-book-two.md).
 */
const bookTwoShell: Book = {
  id: "book-2",
  progressKey: "book-2",
  order: 2,
  title: "Book Two",
  chapters: [],
  lessons: [],
  stage: "building",
};

/**
 * What the book nav shows: every real book, plus the shell only while no real
 * book occupies its slot — the day Book Two lands in books.ts, the shell
 * retires itself and this module is ready to delete.
 */
export const displayBooks: readonly Book[] = books.some((b) => b.order === bookTwoShell.order)
  ? books
  : [...books, bookTwoShell];
