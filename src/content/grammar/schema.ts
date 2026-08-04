/**
 * Runtime validator for hand-authored GrammarPattern YAML.
 *
 * Mirrors the pattern in units/schema.ts. In addition to shape checks,
 * verifies phraseId resolves to an existing phrase and that blank appears
 * in that phrase's reading exactly once — an ambiguous or missing blank is
 * always an authoring mistake, not a runtime concern.
 */
import type { GrammarPattern, JlptLevel, Phrase } from "@/types";

const JLPT_LEVELS = new Set<string>(["N5", "N4", "N3", "N2", "N1"]);

function isString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

class GrammarPatternSchemaError extends Error {
  readonly raw: unknown;
  constructor(message: string, raw: unknown) {
    super(message);
    this.name = "GrammarPatternSchemaError";
    this.raw = raw;
  }
}

export function parseGrammarPattern(raw: unknown, source: string, phrasesById: Map<string, Phrase>): GrammarPattern {
  if (typeof raw !== "object" || raw === null) {
    throw new GrammarPatternSchemaError(`${source}: entry is not an object`, raw);
  }
  const o = raw as Record<string, unknown>;

  for (const key of ["id", "pattern", "gloss", "phraseId", "blank"] as const) {
    if (!isString(o[key])) {
      throw new GrammarPatternSchemaError(`${source}: entry "${String(o.id ?? "?")}" missing or empty field "${key}"`, raw);
    }
  }
  if (typeof o.jlpt !== "string" || !JLPT_LEVELS.has(o.jlpt)) {
    throw new GrammarPatternSchemaError(`${source}: entry "${String(o.id)}" has invalid jlpt "${String(o.jlpt)}"`, raw);
  }

  const phraseId = o.phraseId as string;
  const phrase = phrasesById.get(phraseId);
  if (phrase === undefined) {
    throw new GrammarPatternSchemaError(`${source}: entry "${String(o.id)}" references unknown phrase id "${phraseId}"`, raw);
  }

  const blank = o.blank as string;
  const occurrences = phrase.reading.split(blank).length - 1;
  if (occurrences !== 1) {
    throw new GrammarPatternSchemaError(
      `${source}: entry "${String(o.id)}" blank "${blank}" appears ${occurrences} time(s) in phrase "${phraseId}" reading "${phrase.reading}" — must appear exactly once`,
      raw,
    );
  }

  return {
    id: o.id as string,
    jlpt: o.jlpt as JlptLevel,
    pattern: o.pattern as string,
    gloss: o.gloss as string,
    phraseId,
    blank,
  };
}

export function parseGrammarPatterns(raw: unknown, source: string, phrasesById: Map<string, Phrase>): GrammarPattern[] {
  if (!Array.isArray(raw)) {
    throw new GrammarPatternSchemaError(`${source}: top-level value must be an array`, raw);
  }
  const patterns = raw.map((entry) => parseGrammarPattern(entry, source, phrasesById));

  const seen = new Set<string>();
  for (const p of patterns) {
    if (seen.has(p.id)) {
      throw new GrammarPatternSchemaError(`${source}: duplicate grammar pattern id "${p.id}"`, p);
    }
    seen.add(p.id);
  }
  return patterns;
}
