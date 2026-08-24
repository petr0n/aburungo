/**
 * What a tier can see, by book (DR-033).
 *
 * Gating used to read an item's own `jlpt` tag. It no longer does: a level
 * stopped being an access control when a book stopped being a level. Book
 * order is a property of the lessons that teach an item, so this needs the
 * book list — which is why these functions live here rather than beside the
 * collections they filter. `src/content/lessons/index.ts` imports `allPhrases`
 * and `allWords`, and `books.ts` imports lessons, so a tier function inside
 * either collection would close the cycle index -> books -> lessons -> index.
 * This module sits above all of them and is imported only by pages.
 *
 * The index builder and the predicate are exported and pure because the
 * behaviour is not provable against the shipped content: there is one book,
 * it teaches everything, and every tier therefore sees the same set. Tests
 * feed them fixtures instead.
 */
import type { Book, Phrase, UserTier, Word } from "@/types";
import { allPhrases } from "@/content/index";
import { allWords } from "@/content/vocabulary";
import { books } from "@/content/books";

/**
 * Highest book order a tier reaches.
 *
 * Roughly today's reach carried over: a guest had N5's 809 reference words and
 * gets Book One; a free account had N5 + N4 and gets four books.
 */
const TIER_BOOK_LIMIT: Record<UserTier, number> = {
  guest: 1,
  free: 4,
  paid: Number.POSITIVE_INFINITY,
};

/** Item id -> the order of the earliest book that teaches it. */
export function bookOrderIndex(source: readonly Book[]): Map<string, number> {
  const index = new Map<string, number>();
  for (const b of [...source].sort((a, z) => a.order - z.order)) {
    for (const l of b.lessons) {
      for (const id of [...l.wordIds, ...l.phraseIds]) {
        if (!index.has(id)) index.set(id, b.order);
      }
    }
  }
  return index;
}

/**
 * `undefined` means no book teaches it, which reads as Book One.
 *
 * Browse surfaces show vocabulary the ladder never references. Hiding those
 * silently would remove content a learner can see today.
 */
export function reachable(bookOrder: number | undefined, tier: UserTier): boolean {
  return (bookOrder ?? 1) <= TIER_BOOK_LIMIT[tier];
}

// Built once: the content tree is static after module load.
const bookOrderByItemId = bookOrderIndex(books);

export function wordsForTier(tier: UserTier): Word[] {
  return allWords.filter((w) => reachable(bookOrderByItemId.get(w.id), tier));
}

export function phrasesForTier(tier: UserTier): Phrase[] {
  return allPhrases.filter((p) => reachable(bookOrderByItemId.get(p.id), tier));
}
