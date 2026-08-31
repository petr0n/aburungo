import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build, collisions } from "./manifest.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The manifest is the file every content author reads before proposing a word.
 * These tests exist so it is trustworthy: current, and free of the two
 * collisions the schema validators structurally cannot catch.
 *
 * parseWords dedupes within one file. Two chapters authored in parallel each
 * add a clean file, and the duplicate only appears in the concatenated pool.
 */
describe("content manifest", () => {
  const manifest = build();

  it("has content to check, so the assertions below cannot pass vacuously", () => {
    expect(manifest.counts.words).toBeGreaterThan(400);
    expect(manifest.counts.phrases).toBeGreaterThan(200);
  });

  it("teaches no id twice across the whole course", () => {
    // A duplicate id survives every per-file validator and fails at
    // integration, long after both authors have moved on.
    expect(collisions(manifest).duplicateIds).toEqual([]);
  });

  it("teaches no word twice under two different ids", () => {
    // This one never fails a build at all. It just teaches the learner the
    // same word twice under different names, and only a human reading both
    // files would notice.
    expect(collisions(manifest).duplicateWords).toEqual([]);
  });

  it("is committed and current", () => {
    // Same contract as docs/book-one-ladder.md: regenerate after any content
    // change, or this fails. An author reading a stale manifest proposes
    // duplicates of words added since it was written.
    const committed = JSON.parse(readFileSync(join(ROOT, "data/content-manifest.json"), "utf8"));
    expect(committed.counts).toEqual(manifest.counts);
  });
});
