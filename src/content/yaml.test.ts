import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";

/**
 * Every content YAML parses.
 *
 * The schema tests only see files an index imports, so a chapter authored but
 * not yet wired is invisible to them — and that is exactly when a file is being
 * edited most. Two separate breakages got this far: a bare `: ` inside an
 * unquoted scalar, and an unescaped `"` inside a quoted one. Both make js-yaml
 * throw at load, which takes down whichever test file imports it and silently
 * removes those tests from the run rather than failing them.
 *
 * This scans the directories instead, so an unwired file is covered from the
 * moment it is written.
 */
const DIRS = ["vocabulary", "phrases", "grammar", "lessons", "chapters", "kanji"];
const ROOT = new URL(".", import.meta.url).pathname;

const files = DIRS.flatMap((dir) =>
  readdirSync(join(ROOT, dir))
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => ({ dir, file: f, path: join(ROOT, dir, f) })),
);

describe("content YAML", () => {
  it("finds files to check, so the parse assertions cannot pass vacuously", () => {
    expect(files.length).toBeGreaterThan(50);
  });

  it.each(files)("$dir/$file parses", ({ path }) => {
    expect(() => load(readFileSync(path, "utf8"))).not.toThrow();
  });
});
