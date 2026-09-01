import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";

/**
 * Every content YAML parses.
 *
 * The schema tests only see files an index imports, so a chapter authored but
 * not yet wired is invisible to them — and that is exactly when a file is
 * being edited most. Two separate breakages got past everything today: a bare
 * `: ` inside an unquoted scalar, and an unescaped `"` inside a quoted one.
 *
 * Both make js-yaml throw at load, which takes down whichever test file
 * imports it. That reads as one failure while silently removing every other
 * test in that file from the run — the count drops instead of the suite going
 * red on the real cause.
 *
 * Scanning the directories covers an unwired file from the moment it is
 * written, which is the window the schema tests cannot see.
 */
const CONTENT = join(dirname(fileURLToPath(import.meta.url)), "../src/content");
const DIRS = ["vocabulary", "phrases", "grammar", "lessons", "chapters", "kanji"];

const files = DIRS.flatMap((dir) =>
  readdirSync(join(CONTENT, dir))
    .filter((f) => f.endsWith(".yaml"))
    .map((file) => ({ name: `${dir}/${file}`, path: join(CONTENT, dir, file) })),
);

describe("content YAML", () => {
  it("finds files to check, so the parse assertions cannot pass vacuously", () => {
    expect(files.length).toBeGreaterThan(50);
  });

  it.each(files)("$name parses", ({ path }) => {
    expect(() => load(readFileSync(path, "utf8"))).not.toThrow();
  });
});
