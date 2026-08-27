/**
 * A DR reference has to point at a record, or it is decoration.
 *
 * Eight chapters cited the numbers 025 through 032 in their YAML headers. None
 * of those records existed, and none was ever a decision: the first chapter to
 * do it invented the tag, and every chapter after copied the previous header and
 * incremented. Nothing noticed for eight chapters, because nothing was looking.
 *
 * This is what looks. It is the same shape as contentIntegrity's check that a
 * lesson's wordIds resolve to real words — a cross-reference with no referent is
 * a bug whether it points at a word or at a decision.
 *
 * `docs/decision-records.md` is the registry, so a number is known if that file
 * mentions it at all: either as a `## DR-NNN` heading or in the note recording
 * the eight retired tags as never having been decisions. Numbers are declared in
 * one file, on purpose. Carving out whole directories instead would hide exactly
 * the drift this exists to catch.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const ROOT = new URL("..", import.meta.url).pathname;
const REGISTRY = "docs/decision-records.md";
const DR = /\bDR-(\d{3})\b/g;

const numbersIn = (text) => [...text.matchAll(DR)].map((m) => m[1]);
const registry = readFileSync(new URL(`../${REGISTRY}`, import.meta.url), "utf8");

/**
 * Every citation outside the registry, as `path -> number`.
 *
 * `git grep -I` rather than a list of extensions: the first draft of this test
 * listed the ones it expected and silently skipped `docs/book-one-ladder.html`
 * and the two `supabase/migrations/*.sql` files, which between them cite DR-016,
 * DR-018, DR-021 and DR-023. A guard that picks which files to guard is a guard
 * with a hole in it. `-I` asks git to skip binaries, which is the actual
 * question — the file list follows from the repo rather than from this file.
 */
function citations() {
  let out;
  try {
    out = execFileSync("git", ["grep", "-I", "-n", "-E", "DR-[0-9]{3}", "--", ".", `:!${REGISTRY}`], {
      cwd: ROOT,
      encoding: "utf8",
    });
  } catch (e) {
    // git grep exits 1 with no output when nothing matches, which is a pass.
    if (e.status === 1 && !e.stdout) return [];
    throw e;
  }
  return out
    .split("\n")
    .filter(Boolean)
    .flatMap((line) => {
      const [path, , ...rest] = line.split(":");
      return numbersIn(rest.join(":")).map((n) => ({ path, n }));
    });
}

describe("decision records", () => {
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
    // Named rather than counted: the fix is per-citation, so the failure has to
    // say which file invented which number.
    const dangling = [
      ...new Set(citations().filter(({ n }) => !known.has(n)).map(({ path, n }) => `${path} cites DR-${n}`)),
    ];
    expect(dangling).toEqual([]);
  });

  it("scans the file types that actually carry citations", () => {
    // Regression guard on the guard: this failed to look at .html and .sql
    // while both cited real records. The .html check went with the generated
    // book map page (replaced by the bookmap/ SPA, whose .tsx citations the
    // src scan already covers); .sql still only appears in migrations.
    const extensions = new Set(citations().map(({ path }) => path.split(".").pop()));
    expect(extensions).toContain("sql");
  });
});
