/**
 * Runtime validator for hand-authored Chapter YAML.
 *
 * Mirrors content/lessons/schema.ts. Chapters carry no content references, so
 * this only checks shape, uniqueness, and that `order` runs 1..N without a gap —
 * a missing chapter would silently renumber every chapter after it in the
 * session header, which the learner reads as their position in the book.
 */
import type { Chapter } from "@/types";

class ChapterSchemaError extends Error {
  readonly raw: unknown;
  constructor(message: string, raw: unknown) {
    super(message);
    this.name = "ChapterSchemaError";
    this.raw = raw;
  }
}

export function parseChapters(raw: unknown, source: string): Chapter[] {
  if (!Array.isArray(raw)) {
    throw new ChapterSchemaError(`${source}: top-level value must be an array`, raw);
  }

  const chapters = raw.map((entry): Chapter => {
    if (typeof entry !== "object" || entry === null) {
      throw new ChapterSchemaError(`${source}: entry is not an object`, entry);
    }
    const o = entry as Record<string, unknown>;
    for (const key of ["id", "title"] as const) {
      if (typeof o[key] !== "string" || o[key] === "") {
        throw new ChapterSchemaError(`${source}: entry "${String(o.id ?? "?")}" missing or empty field "${key}"`, entry);
      }
    }
    if (typeof o.order !== "number" || !Number.isFinite(o.order)) {
      throw new ChapterSchemaError(`${source}: entry "${String(o.id)}" missing or invalid "order"`, entry);
    }
    return { id: o.id as string, order: o.order as number, title: o.title as string };
  });

  const seen = new Set<string>();
  for (const c of chapters) {
    if (seen.has(c.id)) throw new ChapterSchemaError(`${source}: duplicate chapter id "${c.id}"`, c);
    seen.add(c.id);
  }

  const sorted = chapters.sort((a, b) => a.order - b.order);
  sorted.forEach((c, i) => {
    if (c.order !== i + 1) {
      throw new ChapterSchemaError(`${source}: chapter "${c.id}" has order ${c.order}, expected ${i + 1}`, c);
    }
  });

  return sorted;
}
