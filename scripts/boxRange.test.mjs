/**
 * The box ceiling is written down in three places that cannot import each
 * other, and they disagreed.
 *
 * `src/srs/leitner.ts` has scheduled eight boxes since the graduation change
 * (DR-035). The API validator and the database check constraint still said
 * five. Nothing failed loudly, because the client suppresses a rejected sync
 * with a comment promising the next hydrate will repair it.
 *
 * It could not. `hydrateFromServer` pushes every unsynced item in ONE request
 * and the API validates the whole array, so a single box-6 item rejected every
 * other item alongside it — and the next hydrate rebuilt the same batch and got
 * the same rejection. Six correct answers on any one card stopped review-state
 * sync for that account permanently, and silently.
 *
 * This is the check that was missing. It reads all three out of the repository
 * rather than restating their numbers, so widening one side alone fails here.
 * It lives with the other repo-invariant checks rather than in `src/`, because
 * it reads files: the frontend tsconfig carries no node types.
 */
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

function clientMax() {
  const src = readFileSync("src/srs/leitner.ts", "utf8");
  const match = src.match(/const MAX_BOX:\s*LeitnerBox\s*=\s*(\d+)/);
  if (match === null) throw new Error("no MAX_BOX found in src/srs/leitner.ts");
  return Number(match[1]);
}

function apiMax() {
  const src = readFileSync("server/src/routes/progress.ts", "utf8");
  const match = src.match(/box:\s*z\.number\(\)\.int\(\)\.min\(1\)\.max\((\d+)\)/);
  if (match === null) throw new Error("no box validator found in server/src/routes/progress.ts");
  return Number(match[1]);
}

function databaseMax() {
  const dir = "supabase/migrations";
  // Migrations are append-only and timestamp-named, so the last file that
  // mentions the constraint is the one in force.
  let max = null;
  for (const file of readdirSync(dir).sort()) {
    const found = readFileSync(join(dir, file), "utf8").match(/box\s+between\s+1\s+and\s+(\d+)/i);
    if (found !== null) max = Number(found[1]);
  }
  if (max === null) throw new Error("no box check constraint found in supabase/migrations");
  return max;
}

describe("the box ceiling agrees across the three places that hold it", () => {
  it("the API accepts every box the scheduler can produce", () => {
    expect(apiMax()).toBe(clientMax());
  });

  it("the database accepts every box the scheduler can produce", () => {
    expect(databaseMax()).toBe(clientMax());
  });
});
