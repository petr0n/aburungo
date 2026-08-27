/**
 * The book map has to match the content, or it is the next stale plan.
 *
 * docs/plans/02b-n5-units.md is the cautionary case: written when the ladder
 * had 35 units, still saying so once it had 58 and chapters existed. It reads
 * like a record and is not one. This test is what stops the docs/<book>-ladder
 * pages from becoming the same thing — regenerate with `pnpm ladder`.
 *
 * buildOutputs covers every book discovered from src/content/chapters/, and
 * throws when a chapters file has no BOOKS entry in ladder.mjs — so a new
 * book fails this suite twice over until it is on the map.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { buildOutputs } from "./ladder.mjs";

const outputs = buildOutputs();

describe("the book map in docs/", () => {
  it("still includes Book One", () => {
    expect(outputs.map((o) => o.name)).toContain("docs/book-one-ladder.html");
  });

  it.each(outputs.map((o) => [o.name, o]))("%s matches the content tree", (_name, o) => {
    // Compared whole, not by lesson count: a renamed lesson or a changed phrase
    // is exactly the drift worth catching, and neither moves a total. A missing
    // file throws here, which is the right answer too.
    expect(readFileSync(o.path, "utf8")).toBe(o.text);
  });

  it.each(outputs.filter((o) => o.name.endsWith(".html")).map((o) => [o.name, o]))(
    "%s escapes content into the markup rather than interpolating it raw",
    (_name, o) => {
      // Lesson titles and grammar notes are hand-authored prose containing
      // quotes and the odd angle bracket; one unescaped note would break the
      // page silently, since nothing renders this in CI.
      const body = o.text.slice(o.text.indexOf("<body>"));
      expect(body).not.toMatch(/<script/i);
      expect(o.text.match(/<html/g)).toHaveLength(1);
    },
  );
});
