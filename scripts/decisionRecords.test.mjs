/**
 * A DR reference has to point at a record, or it is decoration.
 *
 * Eight chapters cited DR-025 through DR-032 in their YAML headers. None of
 * those records existed, and none was ever a decision: the first chapter to do
 * it invented the tag, and every chapter after copied the previous header and
 * incremented. Nothing noticed for eight chapters, because nothing was looking.
 *
 * This is what looks. It is the same shape as contentIntegrity's check that a
 * lesson's wordIds resolve to real words — a cross-reference with no referent
 * is a bug whether it points at a word or at a decision.
 *
 * `docs/decision-records.md` is the registry, so a number is known if that file
 * mentions it at all: either as a `## DR-NNN` heading or in the note recording
 * the eight retired tags as never having been decisions. Numbers are declared
 * in one file, on purpose. Carving out whole directories instead would hide
 * exactly the drift this exists to catch.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const ROOT = new URL("..", import.meta.url).pathname;
const REGISTRY = "docs/decision-records.md";
const DR = /\bDR-(\d{3})\b/g;
const SCANNED = /\.(md|ts|tsx|mjs|cjs|js|yaml|yml|json|sh)$/;

const read = (path) => readFileSync(new URL(path, new URL("..", import.meta.url)), "utf8");
const numbersIn = (text) => [...text.matchAll(DR)].map((m) => m[1]);

describe("decision records", () => {
  const registry = read(REGISTRY);
  // Tracked files only: node_modules and build output cite nothing of ours.
  const files = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" })
    .split("\n")
    .filter((f) => f && SCANNED.test(f) && f !== REGISTRY);

  it("declares every number it uses under a heading or the retired-tags note", () => {
    const headings = new Set([...registry.matchAll(/^## DR-(\d{3})\b/gm)].map((m) => m[1]));
    expect(headings.size).toBeGreaterThan(0);
    // The retired eight are named in prose rather than given headings, because
    // they were never decisions. That note is the declaration.
    expect(new Set(numbersIn(registry))).toEqual(
      new Set([...headings, "025", "026", "027", "028", "029", "030", "031", "032"]),
    );
  });

  it("has a record for every DR cited anywhere in the repo", () => {
    const known = new Set(numbersIn(registry));
    const dangling = [];
    for (const file of files) {
      for (const n of new Set(numbersIn(read(file)))) {
        if (!known.has(n)) dangling.push(`${file} cites DR-${n}`);
      }
    }
    // Named rather than counted: the fix is per-citation, so the failure has to
    // say which file invented which number.
    expect(dangling).toEqual([]);
  });
});
