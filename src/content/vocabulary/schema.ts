import type { JlptLevel, Word, WordType, VerbClass, WordExample } from "@/types";

const JLPT_LEVELS = new Set<string>(["N5", "N4", "N3", "N2", "N1"]);
const WORD_TYPES = new Set<string>(["noun", "verb", "i-adj", "na-adj", "adverb", "counter", "interjection"]);
const VERB_CLASSES = new Set<string>(["ru", "u", "irregular"]);

class WordSchemaError extends Error {
  readonly raw: unknown;
  constructor(message: string, raw: unknown) {
    super(message);
    this.name = "WordSchemaError";
    this.raw = raw;
  }
}

function isString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function isOptionalString(v: unknown): v is string | undefined {
  return v === undefined || isString(v);
}

/**
 * Examples must carry a Tatoeba id. Content rules forbid composed Japanese, and
 * an unsourced sentence is indistinguishable from a fabricated one — so a missing
 * id is a schema error rather than a missing optional field.
 */
function parseExample(v: unknown, id: string, source: string): WordExample | undefined {
  if (v === undefined) return undefined;
  if (typeof v !== "object" || v === null) {
    throw new WordSchemaError(`${source}: entry "${id}" has a non-object example`, v);
  }
  const e = v as Record<string, unknown>;
  for (const key of ["japanese", "english", "tatoeba_id"] as const) {
    if (!isString(e[key])) {
      throw new WordSchemaError(`${source}: entry "${id}" example is missing "${key}"`, v);
    }
  }
  return {
    japanese: e.japanese as string,
    english: e.english as string,
    tatoebaId: e.tatoeba_id as string,
  };
}

export function parseWord(raw: unknown, source: string): Word {
  if (typeof raw !== "object" || raw === null) {
    throw new WordSchemaError(`${source}: entry is not an object`, raw);
  }
  const o = raw as Record<string, unknown>;

  for (const key of ["id", "japanese", "reading", "romaji", "english", "word_type"] as const) {
    if (!isString(o[key])) {
      throw new WordSchemaError(`${source}: entry "${String(o.id ?? "?")}" missing or empty field "${key}"`, raw);
    }
  }

  const wordType = o.word_type as string;
  if (!WORD_TYPES.has(wordType)) {
    throw new WordSchemaError(`${source}: entry "${String(o.id)}" has invalid word_type "${wordType}"`, raw);
  }

  if (wordType === "verb" && !isString(o.verb_class)) {
    throw new WordSchemaError(`${source}: verb entry "${String(o.id)}" is missing verb_class`, raw);
  }
  if (o.verb_class !== undefined && !VERB_CLASSES.has(o.verb_class as string)) {
    throw new WordSchemaError(`${source}: entry "${String(o.id)}" has invalid verb_class "${String(o.verb_class)}"`, raw);
  }

  if (o.jlpt !== undefined && (typeof o.jlpt !== "string" || !JLPT_LEVELS.has(o.jlpt))) {
    throw new WordSchemaError(`${source}: entry "${String(o.id)}" has invalid jlpt "${String(o.jlpt)}"`, raw);
  }

  if (!isOptionalString(o.notes)) {
    throw new WordSchemaError(`${source}: entry "${String(o.id)}" has invalid notes`, raw);
  }
  if (!isOptionalString(o.theme)) {
    throw new WordSchemaError(`${source}: entry "${String(o.id)}" has invalid theme`, raw);
  }

  const example = parseExample(o.example, String(o.id), source);

  return {
    id: o.id as string,
    japanese: o.japanese as string,
    reading: o.reading as string,
    romaji: o.romaji as string,
    english: o.english as string,
    notes: o.notes as string | undefined,
    jlpt: o.jlpt as JlptLevel | undefined,
    wordType: wordType as WordType,
    verbClass: o.verb_class as VerbClass | undefined,
    theme: o.theme as string | undefined,
    example,
  };
}

export function parseWords(raw: unknown, source: string): Word[] {
  if (!Array.isArray(raw)) {
    throw new WordSchemaError(`${source}: top-level value must be an array`, raw);
  }
  const words = raw.map((entry) => parseWord(entry, source));
  const seen = new Set<string>();
  for (const w of words) {
    if (seen.has(w.id)) {
      throw new WordSchemaError(`${source}: duplicate word id "${w.id}"`, w);
    }
    seen.add(w.id);
  }
  return words;
}
