/**
 * Runtime validator for hand-authored phrase YAML.
 *
 * Hand-written intentionally — zod would be cleaner but the schema is small
 * and adding a dep for one file isn't worth it. If the schema grows or we
 * add nested objects, swap this for zod and the call sites stay the same.
 *
 * Validation runs at module load (see index.ts). Bad content fails the build
 * loudly rather than silently shipping garbage.
 */
import type { JlptLevel, Phrase } from "@/types";

const JLPT_LEVELS = new Set<string>(["N5", "N4", "N3", "N2", "N1"]);

function isString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function isOptionalString(v: unknown): v is string | undefined {
  return v === undefined || isString(v);
}

class PhraseSchemaError extends Error {
  readonly raw: unknown;
  constructor(message: string, raw: unknown) {
    super(message);
    this.name = "PhraseSchemaError";
    this.raw = raw;
  }
}

/**
 * Validate a single raw entry. Throws with a clear pointer to what's wrong
 * and which entry caused it.
 */
export function parsePhrase(raw: unknown, source: string): Phrase {
  if (typeof raw !== "object" || raw === null) {
    throw new PhraseSchemaError(`${source}: entry is not an object`, raw);
  }
  const o = raw as Record<string, unknown>;

  const required: Array<keyof Phrase> = ["id", "japanese", "reading", "romaji", "english", "scenario"];
  for (const key of required) {
    if (!isString(o[key])) {
      throw new PhraseSchemaError(`${source}: entry "${String(o.id ?? "?")}" missing or empty field "${key}"`, raw);
    }
  }
  if (!isOptionalString(o.audioUrl)) {
    throw new PhraseSchemaError(`${source}: entry "${String(o.id)}" has invalid audioUrl`, raw);
  }
  if (!isOptionalString(o.notes)) {
    throw new PhraseSchemaError(`${source}: entry "${String(o.id)}" has invalid notes`, raw);
  }
  if (o.jlpt !== undefined && (typeof o.jlpt !== "string" || !JLPT_LEVELS.has(o.jlpt))) {
    throw new PhraseSchemaError(
      `${source}: entry "${String(o.id)}" has invalid jlpt "${String(o.jlpt)}" — must be N5/N4/N3/N2/N1`,
      raw,
    );
  }

  return {
    id: o.id as string,
    japanese: o.japanese as string,
    reading: o.reading as string,
    romaji: o.romaji as string,
    english: o.english as string,
    scenario: o.scenario as string,
    audioUrl: o.audioUrl as string | undefined,
    notes: o.notes as string | undefined,
    jlpt: o.jlpt as JlptLevel | undefined,
  };
}

/**
 * Validate an array of raw entries. Also checks for duplicate ids so the
 * SRS doesn't end up with two entries claiming the same key.
 */
export function parsePhrases(raw: unknown, source: string): Phrase[] {
  if (!Array.isArray(raw)) {
    throw new PhraseSchemaError(`${source}: top-level value must be an array`, raw);
  }
  const phrases = raw.map((entry) => parsePhrase(entry, source));

  const seen = new Set<string>();
  for (const p of phrases) {
    if (seen.has(p.id)) {
      throw new PhraseSchemaError(`${source}: duplicate phrase id "${p.id}"`, p);
    }
    seen.add(p.id);
  }
  return phrases;
}
