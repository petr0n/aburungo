import type { Kanji, KanjiComponent, KanjiPiece } from "@/types";
import { books } from "@/content/books";
import { buildPieceIndex } from "./pieces";
import decomposition from "./decomposition.json";
import { parseKanji } from "./schema";
import { parseComponents } from "./componentSchema";
import kanjiRaw from "./kanji.yaml";
import componentsRaw from "./components.yaml";

export const allKanji: readonly Kanji[] = parseKanji(kanjiRaw, "kanji.yaml");

/** Lessons store bare characters, so lookup is by character rather than id. */
export const kanjiByCharacter: ReadonlyMap<string, Kanji> = new Map(allKanji.map((k) => [k.character, k]));

export const allComponents: readonly KanjiComponent[] = parseComponents(componentsRaw, "components.yaml");

/** The intro card looks a component up by the glyph KRADFILE gave it. */
export const componentByGlyph: ReadonlyMap<string, KanjiComponent> = new Map(
  allComponents.map((c) => [c.glyph, c]),
);

/**
 * Every taught kanji's shapes, resolved to taught / met / new as of the moment
 * that kanji is introduced. Every book's lessons, because the whole course is
 * the ladder the learner actually walks and the states are relative to that:
 * scoping this to Book One left Book Two's first taught character (伝, on
 * b2.giving-te-ageru) with no component row at all, which scope.test.ts caught.
 * Orders are global across books, and buildPieceIndex sorts by order, so the
 * concatenation walks in the learner's order.
 *
 * The annotation is a checked assignment, not a cast: a JSON import is typed
 * with literal keys and no index signature.
 */
const decompositionMap: Readonly<Record<string, readonly string[]>> = decomposition.map;

export const piecesByCharacter: ReadonlyMap<string, KanjiPiece[]> = buildPieceIndex(
  books.flatMap((b) => b.lessons),
  decompositionMap,
  allComponents,
);
