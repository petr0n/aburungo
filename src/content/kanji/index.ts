import type { Kanji } from "@/types";
import { parseKanji } from "./schema";
import kanjiRaw from "./kanji.yaml";

export const allKanji: readonly Kanji[] = parseKanji(kanjiRaw, "kanji.yaml");

/** Lessons store bare characters, so lookup is by character rather than id. */
export const kanjiByCharacter: ReadonlyMap<string, Kanji> = new Map(allKanji.map((k) => [k.character, k]));
