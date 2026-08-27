import type { KanjiComponent, KanjiPiece, Lesson } from "@/types";

/**
 * Resolve every taught kanji's components to taught / met / new, as of the
 * moment that kanji is introduced.
 *
 * Pure and parameterised: the ladder, the decomposition and the keywords all
 * arrive as arguments. That keeps it testable against fixtures and keeps
 * src/content/kanji/ free of an import cycle back through the lesson index.
 *
 * Walks in lesson order. States are relative to earlier *lessons*, never to
 * earlier cards: LearnPage renders a lesson's intro cards into one column, so
 * every kanji the lesson introduces is on screen at once and none of them is
 * something the learner knew before opening it.
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
    // What the learner knew before this lesson opened. Resolving against the
    // live sets would let 三 claim "you know 一" about a card two rows above
    // it on the same screen, and 雪 claim 雨 from the same lesson.
    const knownTaught = new Set(taught);
    const knownMet = new Set(met);

    for (const character of lesson.kanji) {
      const parts = decomposition[character] ?? [];
      const pieces: KanjiPiece[] = [];
      const keywords = new Set<string>();
      for (const glyph of parts) {
        const component = byGlyph.get(glyph);
        // A component with no keyword is skipped rather than rendered blank.
        // The components test fails when one is missing, so this is a
        // rendering safeguard, not a way to tolerate incomplete content.
        if (component === undefined) continue;
        // One row per keyword. 泳 is ⺡ 水 丶, and ⺡ and 水 both read
        // "water" -- two adjacent identical rows look like a rendering bug.
        // First occurrence wins, which keeps the piece KRADFILE listed first.
        if (keywords.has(component.keyword)) continue;
        keywords.add(component.keyword);
        const state = knownTaught.has(glyph) ? "taught" : knownMet.has(glyph) ? "met" : "new";
        pieces.push({ ...component, state });
      }
      // First introduction wins. Fifteen characters are listed by more than
      // one lesson (the day kanji by four), and LearnPage renders this single
      // entry at every introduction -- including the first. Overwriting would
      // make the earliest card claim "you know this" about a shape the learner
      // will not be taught for another eighty lessons.
      if (!index.has(character)) index.set(character, pieces);

      // Accumulated live but read only through the snapshots above, so this
      // lesson's kanji count from the next lesson onward.
      taught.add(character);
      for (const glyph of parts) met.add(glyph);
    }
  }
  return index;
}
