import type { Kanji, KanjiComponent } from "@/types";
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
