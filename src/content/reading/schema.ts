/**
 * Runtime validator for the reading-library glossaries.
 *
 * Hand-written to match the other content schemas. Validation runs at module
 * load, so a bad entry fails the build loudly rather than shipping.
 */
import type { GateText, GlossaryEntry, GlossaryKind } from "@/types";

const KINDS = new Set<string>(["new", "spelling", "book-four", "name"]);
const CITATION = /JMdict seq \d{7}/;

class GlossarySchemaError extends Error {
  readonly raw: unknown;
  constructor(message: string, raw: unknown) {
    super(message);
    this.name = "GlossarySchemaError";
    this.raw = raw;
  }
}

function isString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

export function parseGlossaryEntry(raw: unknown, source: string): GlossaryEntry {
  if (typeof raw !== "object" || raw === null) {
    throw new GlossarySchemaError(`${source}: entry is not an object`, raw);
  }
  const o = raw as Record<string, unknown>;
  const id = String(o.id ?? "?");

  for (const key of ["id", "story", "kind", "japanese", "reading", "english", "sentence"] as const) {
    if (!isString(o[key])) {
      throw new GlossarySchemaError(`${source}: entry "${id}" missing or empty field "${key}"`, raw);
    }
  }
  const kind = o.kind as string;
  if (!KINDS.has(kind)) {
    throw new GlossarySchemaError(`${source}: entry "${id}" has invalid kind "${kind}"`, raw);
  }
  if (o.notes !== undefined && !isString(o.notes)) {
    throw new GlossarySchemaError(`${source}: entry "${id}" has invalid notes`, raw);
  }
  if (o.taughtId !== undefined && !isString(o.taughtId)) {
    throw new GlossarySchemaError(`${source}: entry "${id}" has invalid taughtId`, raw);
  }
  // A word is only ever a JMdict entry; a name never is. Requiring the citation
  // here is what lets `pnpm jmdict check` read every glossary word back.
  if (kind !== "name" && !CITATION.test(String(o.notes ?? ""))) {
    throw new GlossarySchemaError(`${source}: entry "${id}" needs "JMdict seq NNNNNNN" in notes`, raw);
  }
  if ((kind === "spelling" || kind === "book-four") && o.taughtId === undefined) {
    throw new GlossarySchemaError(`${source}: ${kind} entry "${id}" must point at the taught word with taughtId`, raw);
  }
  if ((kind === "new" || kind === "name") && o.taughtId !== undefined) {
    throw new GlossarySchemaError(`${source}: ${kind} entry "${id}" cannot carry a taughtId`, raw);
  }
  // The sentence is the attestation: a glossary word the story does not contain
  // is a word nobody can mine from it.
  const sentence = o.sentence as string;
  const japanese = o.japanese as string;
  if (!sentence.includes(japanese) && !sentence.includes(stemOf(japanese))) {
    throw new GlossarySchemaError(`${source}: entry "${id}" — "${japanese}" does not appear in its sentence`, raw);
  }

  return {
    id: o.id as string,
    story: o.story as string,
    kind: kind as GlossaryKind,
    japanese,
    reading: o.reading as string,
    english: o.english as string,
    sentence,
    taughtId: o.taughtId as string | undefined,
    notes: o.notes as string | undefined,
  };
}

/**
 * What an inflecting word keeps in running text: 逃げる appears as 逃げて, 悩む
 * as 悩んで, 美しい as 美しく. Dropping the one final kana covers all three;
 * する verbs drop the whole する. Deliberately no further -- a looser stem would
 * let this check pass on a word the sentence does not contain.
 */
export function stemOf(word: string): string {
  if (word.endsWith("する") && word.length > 2) return word.slice(0, -2);
  return word.length > 1 ? word.replace(/[ぁ-ゖ]$/, "") : word;
}

export function parseGlossary(raw: unknown, source: string): GlossaryEntry[] {
  if (!Array.isArray(raw)) {
    throw new GlossarySchemaError(`${source}: top-level value must be an array`, raw);
  }
  const entries = raw.map((e) => parseGlossaryEntry(e, source));
  const seen = new Set<string>();
  for (const e of entries) {
    if (seen.has(e.id)) throw new GlossarySchemaError(`${source}: duplicate id "${e.id}"`, e);
    seen.add(e.id);
  }
  const stories = new Set(entries.map((e) => e.story));
  if (stories.size > 1) {
    throw new GlossarySchemaError(`${source}: one file holds one story's glossary, found ${[...stories].join(", ")}`, raw);
  }
  return entries;
}

/**
 * Gate texts: one per band, either a story with the verbatim sentences that use
 * the band's grammar, or an explicit reason no story does. A band with neither
 * is the silent gap this shape exists to prevent.
 */
export function parseGates(raw: unknown, source: string): GateText[] {
  if (!Array.isArray(raw)) throw new GlossarySchemaError(`${source}: top-level value must be an array`, raw);
  return raw.map((r): GateText => {
    const o = r as Record<string, unknown>;
    if (!isString(o.band)) throw new GlossarySchemaError(`${source}: gate missing band`, r);
    if (o.story === null) {
      if (!isString(o.reason)) throw new GlossarySchemaError(`${source}: ${o.band} has no story and no reason`, r);
      return { band: o.band, story: null, reason: o.reason };
    }
    const patterns = o.patterns as unknown[];
    const evidence = o.evidence as unknown[];
    if (!isString(o.story) || !Array.isArray(patterns) || !patterns.every(isString) || !Array.isArray(evidence) || !evidence.length || !evidence.every(isString)) {
      throw new GlossarySchemaError(`${source}: ${o.band} needs story, patterns and at least one evidence sentence`, r);
    }
    return { band: o.band, story: o.story, patterns: patterns as string[], evidence: evidence as string[] };
  });
}
