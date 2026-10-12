// Wipe the walkthrough account's lesson progress so a signed-in walk teaches the
// whole ladder again instead of reaching "All caught up" having taught nothing.
//
// The email is a constant, not an argument, on purpose: this deletes rows with
// the server's secret key, and the only account it may ever touch is the
// throwaway one that exists for the walk. Never point it at a real learner.
//
//   node scripts/walkthrough-reset.mjs [b]          reset (walkthrough.sh runs this)
//   node scripts/walkthrough-reset.mjs create [b]   one-off: create the account, print its password
//
// "b" selects the second account, which exists so scripts/isolation.mjs can sign two
// learners in on one browser (DR-036). The list is closed: nothing else is reachable.
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const WALK_ACCOUNTS = { a: "walkthrough@aburungo.app", b: "walkthrough-b@aburungo.app" };

// The two tables /learn builds a session from: seen units and review states.
const PROGRESS_TABLES = ["user_path_progress", "user_content_progress"];

const env = Object.fromEntries(
  readFileSync(new URL("../server/.env", import.meta.url), "utf8")
    .split("\n")
    .map((l) => l.match(/^([A-Z_]+)=(.*)$/))
    .filter(Boolean)
    .map(([, k, v]) => [k, v.replace(/^"|"$/g, "")]),
);
export const db = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export async function findUserId(email) {
  for (let page = 1; ; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email === email);
    if (hit) return hit.id;
    if (data.users.length < 200) return null;
  }
}

export async function resetAccount(email) {
  if (!Object.values(WALK_ACCOUNTS).includes(email)) throw new Error(`${email} is not a walk account`);
  const id = await findUserId(email);
  if (!id) throw new Error(`${email} does not exist -- run with 'create' first`);
  for (const table of PROGRESS_TABLES) {
    const { count, error } = await db.from(table).delete({ count: "exact" }).eq("user_id", id);
    if (error) throw error;
    console.log(`reset ${email}: ${count} row(s) from ${table}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const email = args.includes("b") ? WALK_ACCOUNTS.b : WALK_ACCOUNTS.a;
  if (args[0] === "create") {
    if (await findUserId(email)) throw new Error(`${email} already exists`);
    const password = randomBytes(18).toString("base64url");
    const { error } = await db.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) throw error;
    console.log(`created ${email}\nPASSWORD=${password}`);
  } else {
    await resetAccount(email);
  }
}
