/**
 * Prove, by execution, whether each practice flow persists what it records.
 *
 * Reading imports produced two wrong answers during the 2026-08-09 audit, so
 * this asserts against real storage after driving the real UI: IndexedDB
 * ("aburungo" -> reviewStates) for word/phrase review state, and localStorage
 * ("aburungo:kana_progress") for guest kana progress.
 *
 * Run it against the current build and against the pre-fix commit. A fix is
 * only demonstrated if the same script fails before it and passes after.
 *
 * Usage:  BASE=http://localhost:4173 node scripts/verify-persistence.cjs
 */
const { chromium } = require("playwright");

const BASE = process.env.BASE || "http://localhost:4173";
const results = [];

function record(name, expected, actual, detail) {
  const pass = expected === actual;
  results.push({ name, expected, actual, pass, detail });
  const mark = pass ? "PASS" : "FAIL";
  console.log(`${mark}  ${name}\n      expected ${expected}, got ${actual}${detail ? ` — ${detail}` : ""}`);
}

/** Rows in IndexedDB aburungo.reviewStates. Read in-page, not inferred. */
async function reviewStateCount(page) {
  return page.evaluate(
    () =>
      new Promise((resolve) => {
        const req = indexedDB.open("aburungo");
        req.onsuccess = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains("reviewStates")) return resolve(0);
          const tx = db.transaction("reviewStates", "readonly");
          const count = tx.objectStore("reviewStates").count();
          count.onsuccess = () => resolve(count.result);
          count.onerror = () => resolve(-1);
        };
        req.onerror = () => resolve(-1);
      }),
  );
}

async function kanaEntryCount(page) {
  return page.evaluate(() => {
    try {
      return JSON.parse(localStorage.getItem("aburungo:kana_progress") ?? "[]").length;
    } catch {
      return -1;
    }
  });
}

async function freshPage(browser) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  return { ctx, page };
}

async function clickText(page, text, timeout = 8000) {
  const loc = page.getByText(text, { exact: false }).first();
  await loc.waitFor({ state: "visible", timeout });
  await loc.click();
}

// ── WordsPage: browse -> learn -> recognition ────────────────────────────────
async function wordsFlow(browser) {
  const { ctx, page } = await freshPage(browser);
  await page.goto(`${BASE}/words`, { waitUntil: "networkidle" });

  const before = await reviewStateCount(page);

  await clickText(page, "Learn words");

  // Advance every intro card. The last one is labelled "Start test".
  for (let i = 0; i < 15; i++) {
    const next = page.getByRole("button", { name: /Got it — (Next|Start test)/ }).first();
    if ((await next.count()) === 0) break;
    await next.click();
    await page.waitForTimeout(120);
  }

  // Recognition pass: answer every card WRONG on purpose by taking an option
  // that is not the prompt's match — a miss is the only outcome that must write.
  let answered = 0;
  for (let i = 0; i < 12; i++) {
    const quickCheck = await page.getByText("Quick check", { exact: false }).count();
    if (quickCheck === 0) break;
    const opts = page.locator("button").filter({ hasNot: page.locator("text=skip") });
    const n = await opts.count();
    if (n === 0) break;
    // Deliberately pick the LAST option; over 5 cards this guarantees misses.
    await opts.nth(n - 1).click();
    answered++;
    await page.waitForTimeout(600);
  }

  const after = await reviewStateCount(page);
  const drillReachable = (await page.getByText("Review again", { exact: false }).count()) > 0;

  await ctx.close();
  return { before, after, answered, drillReachable };
}

// ── KanaPracticePage: setup -> multiple choice ───────────────────────────────
async function kanaFlow(browser) {
  const { ctx, page } = await freshPage(browser);
  await page.goto(`${BASE}/kana/practice`, { waitUntil: "networkidle" }).catch(() => {});
  if ((await page.getByText("Kana Practice", { exact: false }).count()) === 0) {
    await page.goto(`${BASE}/kana`, { waitUntil: "networkidle" });
    const practice = page.getByText("Practice", { exact: false }).first();
    if ((await practice.count()) > 0) await practice.click().catch(() => {});
  }

  const before = await kanaEntryCount(page);

  const start = page.getByRole("button", { name: /^Start — / }).first();
  await start.waitFor({ state: "visible", timeout: 8000 });
  await start.click();

  // Answer a few cards; correctness does not matter, both outcomes must record.
  for (let i = 0; i < 4; i++) {
    const choices = page.locator("button").filter({ hasNotText: "←" });
    const n = await choices.count();
    if (n === 0) break;
    await choices.nth(Math.min(1, n - 1)).click().catch(() => {});
    await page.waitForTimeout(900);
  }

  const after = await kanaEntryCount(page);
  await ctx.close();
  return { before, after };
}

// ── FlashcardPage: rate one card ─────────────────────────────────────────────
async function flashcardFlow(browser) {
  const { ctx, page } = await freshPage(browser);
  await page.goto(`${BASE}/flashcard`, { waitUntil: "networkidle" });
  const before = await reviewStateCount(page);

  for (let i = 0; i < 3; i++) {
    const reveal = page.getByRole("button", { name: /Show|Reveal|Tap/ }).first();
    if ((await reveal.count()) > 0) await reveal.click().catch(() => {});
    await page.waitForTimeout(250);
    const got = page.getByRole("button", { name: /Got it/ }).first();
    if ((await got.count()) === 0) break;
    await got.click();
    await page.waitForTimeout(700);
  }

  const after = await reviewStateCount(page);
  await ctx.close();
  return { before, after };
}

// ── PracticePage: answer one fill-in-the-blank ───────────────────────────────
async function practiceFlow(browser) {
  const { ctx, page } = await freshPage(browser);
  await page.goto(`${BASE}/practice`, { waitUntil: "networkidle" });
  const before = await reviewStateCount(page);

  for (let i = 0; i < 3; i++) {
    const input = page.locator("input[type=text]").first();
    if ((await input.count()) === 0) break;
    await input.fill("zzz");
    const submit = page.getByRole("button", { name: /Check|Submit|Answer/ }).first();
    if ((await submit.count()) > 0) await submit.click().catch(() => {});
    await page.waitForTimeout(400);
    const next = page.getByRole("button", { name: /Next|Continue/ }).first();
    if ((await next.count()) > 0) await next.click().catch(() => {});
    await page.waitForTimeout(500);
  }

  const after = await reviewStateCount(page);
  await ctx.close();
  return { before, after };
}

async function main() {
  const browser = await chromium.launch();
  console.log(`Verifying against ${BASE}\n`);

  const words = await wordsFlow(browser);
  record(
    "WordsPage recognition writes review state",
    true,
    words.after > words.before,
    `reviewStates ${words.before} -> ${words.after}, ${words.answered} cards answered`,
  );
  record("WordsPage drill screen is reachable", false, words.drillReachable, "no UI path reaches startTest()");

  const kana = await kanaFlow(browser);
  record(
    "Kana practice writes progress",
    true,
    kana.after > kana.before,
    `kana entries ${kana.before} -> ${kana.after}`,
  );

  const fc = await flashcardFlow(browser);
  record(
    "FlashcardPage writes review state",
    true,
    fc.after > fc.before,
    `reviewStates ${fc.before} -> ${fc.after}`,
  );

  const pr = await practiceFlow(browser);
  record(
    "PracticePage writes review state",
    true,
    pr.after > pr.before,
    `reviewStates ${pr.before} -> ${pr.after}`,
  );

  await browser.close();

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} assertions matched expectation`);
  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("DRIVER FAILED:", err);
  process.exit(2);
});
