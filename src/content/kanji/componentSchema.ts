/**
 * Runtime validator for the hand-written component keyword YAML.
 *
 * Hand-written to match src/content/kanji/schema.ts. Validation runs at module
 * load, so a bad entry fails the build loudly rather than shipping.
 */
import type { KanjiComponent } from "@/types";

class ComponentSchemaError extends Error {
  readonly raw: unknown;
  constructor(message: string, raw: unknown) {
    super(message);
    this.name = "ComponentSchemaError";
    this.raw = raw;
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export function parseComponents(raw: unknown, source: string): KanjiComponent[] {
  if (!Array.isArray(raw)) {
    throw new ComponentSchemaError(`${source}: top-level value must be an array`, raw);
  }
  const seen = new Set<string>();
  return raw.map((entry) => {
    if (!isRecord(entry)) throw new ComponentSchemaError(`${source}: entry is not an object`, entry);
    const glyph = entry.glyph;
    const keyword = entry.keyword;
    const note = entry.note;
    if (typeof glyph !== "string" || glyph.length === 0) {
      throw new ComponentSchemaError(`${source}: entry missing "glyph"`, entry);
    }
    if (typeof keyword !== "string" || keyword.length === 0) {
      throw new ComponentSchemaError(`${source}: "${glyph}" missing "keyword"`, entry);
    }
    if (note !== undefined && typeof note !== "string") {
      throw new ComponentSchemaError(`${source}: "${glyph}" has invalid "note"`, entry);
    }
    if (seen.has(glyph)) throw new ComponentSchemaError(`${source}: duplicate component "${glyph}"`, entry);
    seen.add(glyph);
    return note === undefined ? { glyph, keyword } : { glyph, keyword, note };
  });
}
