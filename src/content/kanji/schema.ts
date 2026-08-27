/**
 * Runtime validator for generated kanji YAML.
 *
 * Hand-written to match src/content/vocabulary/schema.ts. Validation runs at
 * module load, so bad content fails the build loudly rather than shipping.
 */
import type { Kanji } from "@/types";
import { kanjiId } from "@/types";

class KanjiSchemaError extends Error {
  readonly raw: unknown;
  constructor(message: string, raw: unknown) {
    super(message);
    this.name = "KanjiSchemaError";
    this.raw = raw;
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

export function parseKanji(raw: unknown, source: string): Kanji[] {
  if (!Array.isArray(raw)) {
    throw new KanjiSchemaError(`${source}: top-level value must be an array`, raw);
  }
  const seen = new Set<string>();
  return raw.map((entry) => {
    if (!isRecord(entry)) {
      throw new KanjiSchemaError(`${source}: entry is not an object`, entry);
    }
    const character = entry.character;
    if (typeof character !== "string" || character.length === 0) {
      throw new KanjiSchemaError(`${source}: entry missing "character"`, entry);
    }
    const meanings = entry.meanings;
    if (!isStringArray(meanings)) {
      throw new KanjiSchemaError(`${source}: "${character}" has invalid "meanings"`, entry);
    }
    const allMeanings = entry.allMeanings;
    if (!isStringArray(allMeanings)) {
      throw new KanjiSchemaError(`${source}: "${character}" has invalid "allMeanings"`, entry);
    }
    const on = entry.on;
    if (!isStringArray(on)) {
      throw new KanjiSchemaError(`${source}: "${character}" has invalid "on"`, entry);
    }
    const kun = entry.kun;
    if (!isStringArray(kun)) {
      throw new KanjiSchemaError(`${source}: "${character}" has invalid "kun"`, entry);
    }
    const strokes = entry.strokes;
    if (strokes !== null && typeof strokes !== "number") {
      throw new KanjiSchemaError(`${source}: "${character}" has invalid "strokes"`, entry);
    }
    if (seen.has(character)) {
      throw new KanjiSchemaError(`${source}: duplicate kanji "${character}"`, entry);
    }
    seen.add(character);
    return {
      id: kanjiId(character),
      character,
      meanings,
      allMeanings,
      on,
      kun,
      strokes,
    };
  });
}
