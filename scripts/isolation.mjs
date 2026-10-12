// Account isolation acceptance check (DR-036, docs/plans/05-retention-engine.md,
// "Account ownership and session transitions" -- its first required check).
//
// A starts a lesson, signs out; B signs in on the same browser. B's server rows
// and local cache must carry none of A's activity, and A's must survive.
//
// Written before the fix, when the browser kept one shared IndexedDB that
// hydrateFromServer pushed into whoever signed in next; it failed then. Each
// owner now has its own database, `aburungo:<user id>` (src/db/dexie.ts).
//
// Local only, like the signed-in walk: needs the API server and two throwaway
// accounts (WALKTHROUGH_* and WALKTHROUGH_B_* in .env.local). Both are wiped first.
//
//   BASE=http://localhost:4173 node scripts/isolation.mjs
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { WALK_ACCOUNTS, db, findUserId, resetAccount } from "./walkthrough-reset.mjs";

const BASE = process.env.BASE ?? "http://localhost:4173";
const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .map((l) => l.match(/^([A-Z_]+)=(.*)$/))
    .filter(Boolean)
    .map(([, k, v]) => [k, v.replace(/^"|"$/g, "")]),
);
const A = { email: WALK_ACCOUNTS.a, password: env.WALKTHROUGH_PASSWORD };
const B = { email: WALK_ACCOUNTS.b, password: env.WALKTHROUGH_B_PASSWORD };
if (!A.password || !B.password) throw new Error("set WALKTHROUGH_PASSWORD and WALKTHROUGH_B_PASSWORD in .env.local");

// The first lesson teaches 日, and opening it seeds kanji.日 for whoever is signed in.
const MARK = "kanji.日";
const results = [];
const check = (ok, what) => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${what}`);
};

async function serverIds(email) {
  const { data, error } = await db
    .from("user_content_progress")
    .select("content_id")
    .eq("user_id", await findUserId(email));
  if (error) throw error;
  return data.map((r) => r.content_id);
}

const hasSession = (page) =>
  page.evaluate(() => Object.keys(localStorage).some((k) => k.includes("auth-token")));

async function until(page, cond, what) {
  for (let i = 0; i < 60; i++) {
    if (await cond()) return;
    await page.waitForTimeout(250);
  }
  throw new Error(`timed out waiting for ${what}`);
}

async function signIn(page, who) {
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.fill("#auth-email", who.email);
  await page.fill("#auth-password", who.password);
  await page.click('button[type="submit"]:has-text("Sign in")');
  await until(page, () => hasSession(page), `${who.email} to sign in`);
}

async function signOut(page) {
  await page.click("button:has-text('Sign out')");
  await until(page, async () => !(await hasSession(page)), "sign-out");
}

/** Review-state ids in one owner's local database ("guest" or an email); empty if it has none. */
const localIds = async (page, who) => {
  const name = `aburungo:${who === "guest" ? "guest" : await findUserId(who)}`;
  return page.evaluate(
    (name) =>
      new Promise((resolve, reject) => {
        const req = indexedDB.open(name);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains("reviewStates")) return resolve([]);
          const all = db.transaction("reviewStates", "readonly").objectStore("reviewStates").getAllKeys();
          all.onsuccess = () => resolve(all.result.map(String));
        };
      }),
    name,
  );
};

await resetAccount(A.email);
await resetAccount(B.email);

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 420, height: 900 } })).newPage();

// A opens the first lesson and gets as far as the kanji being seeded.
await signIn(page, A);
await page.goto(`${BASE}/learn`, { waitUntil: "networkidle" });
await page.click("button:has-text('Start')");
// The seed lands when the teach stages hand off to the produce step.
await until(
  page,
  async () => {
    if (await page.locator("button:has-text('Show answer'), button:has-text('Check answer')").first().isVisible()) return true;
    const gotIt = page.locator("button:has-text('Got it')").first();
    if (await gotIt.isVisible()) await gotIt.click().catch(() => {});
    return false;
  },
  "the produce step",
);
await until(page, async () => (await serverIds(A.email)).includes(MARK), `${MARK} to reach A's server`);
check(true, `A's activity reached A's server (${MARK}) -- the check has something to look for`);

// A signs out; B signs in on the same browser and opens /learn.
await signOut(page);
check(!(await localIds(page, "guest")).includes(MARK), `signing out leaves none of A's activity to the guest`);
await signIn(page, B);
await page.goto(`${BASE}/learn`, { waitUntil: "networkidle" });
await page.waitForTimeout(2000); // let hydrate push whatever it is going to push

check(!(await serverIds(B.email)).includes(MARK), `B's server records hold none of A's activity`);
check(!(await localIds(page, B.email)).includes(MARK), `B's local cache holds none of A's activity`);

// Back to A: A's activity is still A's.
await signOut(page);
await signIn(page, A);
check((await serverIds(A.email)).includes(MARK), `returning to A restores A's activity`);
check((await localIds(page, A.email)).includes(MARK), `A's local cache kept A's activity through B's visit`);

await browser.close();
const failed = results.filter((ok) => !ok).length;
console.log(failed ? `\n${failed} check(s) failed` : "\nall isolation checks pass");
process.exit(failed ? 1 : 0);
