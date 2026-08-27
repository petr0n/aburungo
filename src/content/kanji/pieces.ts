import type { KanjiComponent, KanjiPiece, Lesson } from "@/types";

/**
 * Resolve every taught kanji's components to taught / met / new, as of the
 * moment that kanji is introduced.
 *
 * Pure and parameterised: the ladder, the decomposition and the keywords all
 * arrive as arguments. That keeps it testable against fixtures and keeps
 * src/content/kanji/ free of an import cycle back through the lesson index.
 *
 * Walks in lesson order, then in the order a lesson lists its kanji, because
 * that is the order the learner meets the intro cards.
 */
export function buildPieceIndex(
  lessons: readonly Lesson[],
  decomposition: Readonly<Record<string, readonly string[]>>,
  components: readonly KanjiComponent[],
): Map<string, KanjiPiece[]> {
  const byGlyph = new Map(components.map((c) => [c.glyph, c]));
  const taught = new Set<string>();
  const met = new Set<string>();
  const index = new Map<string, KanjiPiece[]>();

  for (const lesson of [...lessons].sort((a, b) => a.order - b.order)) {
    for (const character of lesson.kanji) {
      const parts = decomposition[character] ?? [];
      const pieces: KanjiPiece[] = [];
      for (const glyph of parts) {
        const component = byGlyph.get(glyph);
        // A component with no keyword is skipped rather than rendered blank.
        // The components test fails when one is missing, so this is a
        // rendering safeguard, not a way to tolerate incomplete content.
        if (component === undefined) continue;
        const state = taught.has(glyph) ? "taught" : met.has(glyph) ? "met" : "new";
        pieces.push({ ...component, state });
      }
      // First introduction wins. Fifteen characters are listed by more than
      // one lesson (the day kanji by four), and LearnPage renders this single
      // entry at every introduction -- including the first. Overwriting would
      // make the earliest card claim "you know this" about a shape the learner
      // will not be taught for another eighty lessons.
      if (!index.has(character)) index.set(character, pieces);

      // Only after resolving: a kanji is not a known piece of itself.
      taught.add(character);
      for (const glyph of parts) met.add(glyph);
    }
  }
  return index;
}
