/**
 * Runtime validator for hand-authored Unit YAML.
 *
 * Mirrors the pattern in content/schema.ts and vocabulary/schema.ts. In
 * addition to shape checks, verifies every wordIds/phraseIds entry resolves
 * against the existing content — a Unit is an ordering layer, not new
 * content, so a dangling reference is always an authoring mistake.
 */
import type { Unit } from "@/types";

function isString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function isNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

class UnitSchemaError extends Error {
  readonly raw: unknown;
  constructor(message: string, raw: unknown) {
    super(message);
    this.name = "UnitSchemaError";
    this.raw = raw;
  }
}

export function parseUnit(raw: unknown, source: string): Unit {
  if (typeof raw !== "object" || raw === null) {
    throw new UnitSchemaError(`${source}: entry is not an object`, raw);
  }
  const o = raw as Record<string, unknown>;

  for (const key of ["id", "situation", "title", "canDo", "grammarNote"] as const) {
    if (!isString(o[key])) {
      throw new UnitSchemaError(`${source}: entry "${String(o.id ?? "?")}" missing or empty field "${key}"`, raw);
    }
  }
  if (!isNumber(o.order)) {
    throw new UnitSchemaError(`${source}: entry "${String(o.id)}" missing or invalid "order"`, raw);
  }
  for (const key of ["wordIds", "phraseIds", "kanji"] as const) {
    if (!isStringArray(o[key])) {
      throw new UnitSchemaError(`${source}: entry "${String(o.id)}" has invalid "${key}" — must be a string array`, raw);
    }
  }

  return {
    id: o.id as string,
    order: o.order as number,
    situation: o.situation as string,
    title: o.title as string,
    canDo: o.canDo as string,
    wordIds: o.wordIds as string[],
    phraseIds: o.phraseIds as string[],
    kanji: o.kanji as string[],
    grammarNote: o.grammarNote as string,
  };
}

/**
 * Validate an array of raw entries plus cross-references against the known
 * word/phrase id sets. Also checks for duplicate ids and duplicate order.
 */
export function parseUnits(raw: unknown, source: string, knownWordIds: Set<string>, knownPhraseIds: Set<string>): Unit[] {
  if (!Array.isArray(raw)) {
    throw new UnitSchemaError(`${source}: top-level value must be an array`, raw);
  }
  const units = raw.map((entry) => parseUnit(entry, source));

  const seenIds = new Set<string>();
  const seenOrders = new Set<number>();
  for (const u of units) {
    if (seenIds.has(u.id)) {
      throw new UnitSchemaError(`${source}: duplicate unit id "${u.id}"`, u);
    }
    seenIds.add(u.id);

    if (seenOrders.has(u.order)) {
      throw new UnitSchemaError(`${source}: duplicate unit order ${u.order} (unit "${u.id}")`, u);
    }
    seenOrders.add(u.order);

    for (const wordId of u.wordIds) {
      if (!knownWordIds.has(wordId)) {
        throw new UnitSchemaError(`${source}: unit "${u.id}" references unknown word id "${wordId}"`, u);
      }
    }
    for (const phraseId of u.phraseIds) {
      if (!knownPhraseIds.has(phraseId)) {
        throw new UnitSchemaError(`${source}: unit "${u.id}" references unknown phrase id "${phraseId}"`, u);
      }
    }
  }

  return units.sort((a, b) => a.order - b.order);
}
