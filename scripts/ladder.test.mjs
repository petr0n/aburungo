/**
 * The book map has to match the content, or it is the next stale plan.
 *
 * docs/plans/02b-n5-units.md is the cautionary case: written when the ladder
 * had 35 units, still saying so once it had 58 and chapters existed. It reads
 * like a record and is not one. This test is what stops docs/book-one-ladder.md
 * from becoming the same thing — regenerate with `pnpm ladder`.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { buildMarkdown } from "./ladder.mjs";

describe("docs/book-one-ladder.md", () => {
  it("matches the content tree", () => {
    const committed = readFileSync(new URL("../docs/book-one-ladder.md", import.meta.url), "utf8");
    // Compared whole, not by lesson count: a renamed lesson or a changed phrase
    // is exactly the drift worth catching, and neither moves a total.
    expect(committed).toBe(buildMarkdown());
  });
});
