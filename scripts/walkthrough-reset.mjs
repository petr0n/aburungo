// Wipe the walkthrough account's lesson progress so a signed-in walk teaches the
// whole ladder again instead of reaching "All caught up" having taught nothing.
//
// The email is a constant, not an argument, on purpose: this deletes rows with
// the server's secret key, and the only account it may ever touch is the
// throwaway one that exists for the walk. Never point it at a real learner.
//
//   node scripts/walkthrough-reset.mjs          reset (walkthrough.sh runs this)
//   node scripts/walkthrough-reset.mjs create   one-off: create the account, print its password
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";

const WALK_EMAIL = "walkthrough@aburungo.app";

// The two tables /learn builds a session from: seen units and review states.
const PROGRESS_TABLES = ["user_path_progress", "user_content_progress"];

const env = Object.fromEntries(
  readFileSync(new URL("../server/.env", import.meta.url), "utf8")
    .split("\n")
    .map((l) => l.match(/^([A-Z_]+)=(.*)$/))
    .filter(Boolean)
    .map(([, k, v]) => [k, v.replace(/^"|"$/g, "")]),
);
const db = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function findUserId() {
  for (let page = 1; ; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email === WALK_EMAIL);
    if (hit) return hit.id;
    if (data.users.length < 200) return null;
  }
}

if (process.argv[2] === "create") {
  if (await findUserId()) throw new Error(`${WALK_EMAIL} already exists`);
  const password = randomBytes(18).toString("base64url");
  const { error } = await db.auth.admin.createUser({ email: WALK_EMAIL, password, email_confirm: true });
  if (error) throw error;
  console.log(`created ${WALK_EMAIL}\nWALKTHROUGH_EMAIL=${WALK_EMAIL}\nWALKTHROUGH_PASSWORD=${password}`);
} else {
  const id = await findUserId();
  if (!id) throw new Error(`${WALK_EMAIL} does not exist -- run with 'create' first`);
  for (const table of PROGRESS_TABLES) {
    const { count, error } = await db.from(table).delete({ count: "exact" }).eq("user_id", id);
    if (error) throw error;
    console.log(`reset ${WALK_EMAIL}: ${count} row(s) from ${table}`);
  }
}
