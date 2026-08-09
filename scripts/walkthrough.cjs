const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

// Artifacts land in a gitignored sibling dir, not next to the script.
const SCREEN_DIR = path.join(__dirname, ".walkthrough-out");
fs.mkdirSync(SCREEN_DIR, { recursive: true });
const BASE = process.env.BASE || "http://localhost:5173";
const WAIT_SHORT = 500; // generous, per task-6 brief guidance re: timing stalls
const CLICK_TIMEOUT = 10000;
const CLICK_TIMEOUT_RETRY = 20000;
const MAX_SESSIONS = process.env.MAX_SESSIONS ? parseInt(process.env.MAX_SESSIONS, 10) : 42; // 35 expected + buffer

let currentPage = null;

const results = {
  sessionsCompleted: 0,
  grammarClozeScreenshots: [],
  consoleErrors: [],
  pageErrors: [],
  log: [],
};

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  results.log.push(line);
}

async function visible(page, sel) {
  const loc = page.locator(sel);
  if ((await loc.count()) === 0) return false;
  return loc.first().isVisible().catch(() => false);
}

async function clickWhenReady(page, sel, label) {
  const loc = page.locator(sel).first();
  try {
    await loc.waitFor({ state: "visible", timeout: CLICK_TIMEOUT });
  } catch {
    log(`  (retry) '${label}' not visible after ${CLICK_TIMEOUT}ms, waiting longer...`);
    await loc.waitFor({ state: "visible", timeout: CLICK_TIMEOUT_RETRY });
  }
  await page.waitForTimeout(150); // let React settle before clicking
  await loc.click();
}

async function failHard(page, sessionIndex, tag) {
  const shotPath = `${SCREEN_DIR}/FAIL-${tag}-session-${sessionIndex}.png`;
  await page.screenshot({ path: shotPath }).catch(() => {});
  const bodyText = await page.textContent("body").catch(() => "<unavailable>");
  const msg = `STALL DETECTED at session ${sessionIndex}: ${tag}\nBody snippet: ${bodyText.slice(0, 800)}\nScreenshot: ${shotPath}`;
  log(msg);
  fs.writeFileSync(`${SCREEN_DIR}/results.json`, JSON.stringify(results, null, 2));
  throw new Error(`STALL: ${tag} at session ${sessionIndex}`);
}

async function detectNewUnitTerminal(page) {
  if (await visible(page, "button:has-text('Show answer')")) return "produce";
  if (await visible(page, "button:has-text('Check answer')")) return "produce";
  if (await visible(page, "text=Quick check")) return "recognition";
  if (await visible(page, "text=Nice work today.")) return "close";
  return null;
}

async function detectPostProduceTerminal(page) {
  if (await visible(page, "text=Quick check")) return "recognition";
  if (await visible(page, "text=Nice work today.")) return "close";
  return null;
}

async function handleReviewStepIfPresent(page, sessionIndex) {
  let guard = 0;
  let handledAny = false;
  while (guard < 40) {
    if (!(await visible(page, "text=Review ·"))) return handledAny;
    guard++;
    handledAny = true;
    if (await visible(page, "button:has-text('Reveal')")) {
      log(`  (review, defensive) Reveal #${guard}`);
      await clickWhenReady(page, "button:has-text('Reveal')", "Reveal");
      await page.waitForTimeout(WAIT_SHORT);
      await clickWhenReady(page, "button:has-text(\"Got it\")", "Got it (review back)");
      await page.waitForTimeout(WAIT_SHORT);
    } else if (await visible(page, "button:has-text('Check answer')")) {
      log(`  (review, defensive) grammar cloze review item #${guard}`);
      const romajiInput = page.locator('input[placeholder="Type romaji here…"]').first();
      await romajiInput.waitFor({ state: "visible", timeout: CLICK_TIMEOUT });
      await romajiInput.fill("test");
      await page.waitForTimeout(150);
      await clickWhenReady(page, "button:has-text('Check answer')", "Check answer (review)");
      await page.waitForTimeout(WAIT_SHORT);
      await clickWhenReady(page, "button:has-text('Next')", "Next (review)");
      await page.waitForTimeout(WAIT_SHORT);
    } else {
      await page.waitForTimeout(300);
    }
  }
  if (guard >= 40) await failHard(page, sessionIndex, "stuck-in-review-step");
  return handledAny;
}


/**
 * The 41-session sweep never sees the review step: a fresh profile has nothing
 * due, so every session skips straight to the new unit. That blind spot hid a
 * hard deadlock — ratings were persisted from FlipCard's onAnimationEnd, the
 * `animate-card-exit` utility was never generated, and the review card froze
 * with the rating silently dropped (2026-08-09).
 *
 * Seed one overdue item in its own profile and prove the step actually moves.
 */
async function verifyReviewStep(browser) {
  const ctx = await browser.newContext({ viewport: { width: 420, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/learn`, { waitUntil: "networkidle" });

  await page.evaluate(
    () =>
      new Promise((resolve) => {
        const req = indexedDB.open("aburungo");
        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction(["reviewStates", "pathProgress"], "readwrite");
          tx.objectStore("reviewStates").put({
            phraseId: "vocab.kyou",
            box: 2,
            dueAt: Date.now() - 86400000,
            lastSeenAt: Date.now() - 172800000,
          });
          tx.objectStore("pathProgress").put({
            pathId: "n5",
            seenUnitIds: Array.from({ length: 41 }, (_, i) => `n5.unit-${i + 1}`),
          });
          tx.oncomplete = () => resolve(true);
        };
      }),
  );

  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  const body = await page.locator("body").innerText();
  if (!body.includes("Review \u00b7")) {
    await ctx.close();
    throw new Error("REVIEW CHECK: seeded a due item but the review step never appeared");
  }

  const reveal = page.locator("button:has-text('Reveal')").first();
  if ((await reveal.count()) > 0) await reveal.click().catch(() => {});
  await page.waitForTimeout(300);
  await clickWhenReady(page, "button:has-text('Got it')", "Got it (review step)");
  await page.waitForTimeout(1200);

  const after = await page.locator("body").innerText();
  const stuck = after.includes("Review \u00b7 1 / 1");
  const box = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const req = indexedDB.open("aburungo");
        req.onsuccess = () => {
          const get = req.result
            .transaction("reviewStates", "readonly")
            .objectStore("reviewStates")
            .get("vocab.kyou");
          get.onsuccess = () => resolve(get.result ? get.result.box : "missing");
        };
      }),
  );
  await ctx.close();

  if (stuck) throw new Error("REVIEW CHECK: rating did not advance the card — review step is deadlocked");
  if (box !== 3) throw new Error(`REVIEW CHECK: rating not persisted — box is ${box}, expected 3`);
  log(`  review step OK — card advanced and vocab.kyou moved to box ${box}`);
}

async function main() {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  log("=== Pre-flight: review step ===");
  await verifyReviewStep(browser);

  const context = await browser.newContext({ viewport: { width: 420, height: 900 } });
  const page = await context.newPage();
  currentPage = page;

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      results.consoleErrors.push({ text: msg.text(), sessionsCompleted: results.sessionsCompleted });
      log(`CONSOLE ERROR: ${msg.text()}`);
    }
  });
  page.on("pageerror", (err) => {
    results.pageErrors.push({ text: String(err), sessionsCompleted: results.sessionsCompleted });
    log(`PAGE ERROR: ${String(err)}`);
  });

  let sessionIndex = 0;
  let grammarClozeCount = 0;
  let allCaughtUpReached = false;

  while (sessionIndex < MAX_SESSIONS) {
    sessionIndex++;
    log(`=== Session ${sessionIndex}: navigating to /learn ===`);
    await page.goto(`${BASE}/learn`, { waitUntil: "networkidle" });

    // Wait out the "Preparing today's session..." loading placeholder.
    let loadGuard = 0;
    while ((await visible(page, "text=Preparing today")) && loadGuard < 30) {
      await page.waitForTimeout(200);
      loadGuard++;
    }
    await page.waitForTimeout(WAIT_SHORT);

    if (await visible(page, "text=All caught up!")) {
      log(`All caught up! reached at session ${sessionIndex} — walkthrough complete.`);
      allCaughtUpReached = true;
      sessionIndex--; // this iteration did not consume a real session
      break;
    }

    await handleReviewStepIfPresent(page, sessionIndex);

    // Unit intro
    if (await visible(page, "button:has-text('Start')")) {
      log(`  Unit intro visible, clicking Start`);
      await clickWhenReady(page, "button:has-text('Start')", "Start");
      await page.waitForTimeout(WAIT_SHORT);
    } else {
      log(`  No Start button immediately visible — proceeding to terminal detection`);
    }

    // Click through words / phrases / grammar-teach stages
    let stageGuard = 0;
    let terminal = null;
    while (stageGuard < 60) {
      stageGuard++;
      terminal = await detectNewUnitTerminal(page);
      if (terminal) break;
      if (await visible(page, "button:has-text('Got it')")) {
        await clickWhenReady(page, "button:has-text('Got it')", "Got it (new-unit)");
        await page.waitForTimeout(WAIT_SHORT);
        continue;
      }
      if (await visible(page, "button:has-text('Start')")) {
        await clickWhenReady(page, "button:has-text('Start')", "Start (fallback)");
        await page.waitForTimeout(WAIT_SHORT);
        continue;
      }
      await page.waitForTimeout(300);
    }
    if (!terminal) await failHard(page, sessionIndex, "stuck-in-new-unit-stage");
    log(`  new-unit stages resolved -> ${terminal} (after ${stageGuard} stage-loop iterations)`);

    if (terminal === "produce") {
      let produceGuard = 0;
      let produceTerminal = null;
      while (produceGuard < 40) {
        produceGuard++;
        if (await visible(page, "button:has-text('Show answer')")) {
          await clickWhenReady(page, "button:has-text('Show answer')", "Show answer");
          await page.waitForTimeout(WAIT_SHORT);
          await clickWhenReady(page, "button:has-text('Next')", "Next (produce word/phrase)");
          await page.waitForTimeout(WAIT_SHORT);
          continue;
        }
        if (await visible(page, "button:has-text('Check answer')")) {
          grammarClozeCount++;
          if (grammarClozeCount === 1 || grammarClozeCount % 10 === 0) {
            const blankedLocator = page.locator("p.font-jp.text-jp-lg").first();
            const blankedText = await blankedLocator.textContent().catch(() => null);
            const shotPath = `${SCREEN_DIR}/grammar-cloze-${String(grammarClozeCount).padStart(2, "0")}-session-${sessionIndex}.png`;
            await page.screenshot({ path: shotPath });
            results.grammarClozeScreenshots.push({ path: shotPath, blankedText, session: sessionIndex, occurrence: grammarClozeCount });
            log(`  SCREENSHOT grammar cloze #${grammarClozeCount} (session ${sessionIndex}): blanked="${blankedText}" -> ${shotPath}`);
          }
          const romajiInput = page.locator('input[placeholder="Type romaji here…"]').first();
          await romajiInput.waitFor({ state: "visible", timeout: CLICK_TIMEOUT });
          await romajiInput.fill("test");
          await page.waitForTimeout(150);
          await clickWhenReady(page, "button:has-text('Check answer')", "Check answer (produce grammar cloze)");
          await page.waitForTimeout(WAIT_SHORT);
          await clickWhenReady(page, "button:has-text('Next')", "Next (produce grammar cloze)");
          await page.waitForTimeout(WAIT_SHORT);
          continue;
        }
        produceTerminal = await detectPostProduceTerminal(page);
        if (produceTerminal) break;
        await page.waitForTimeout(300);
      }
      if (!produceTerminal) await failHard(page, sessionIndex, "stuck-in-produce-step");
      terminal = produceTerminal;
      log(`  produce step resolved -> ${terminal} (after ${produceGuard} produce-loop iterations)`);
    }

    if (terminal === "recognition") {
      let recGuard = 0;
      let closed = false;
      while (recGuard < 30) {
        recGuard++;
        if (await visible(page, "button:has-text('Finish session')")) {
          await clickWhenReady(page, "button:has-text('Finish session')", "Finish session");
          closed = true;
          break;
        }
        if (await visible(page, "button:has-text('skip →')")) {
          await clickWhenReady(page, "button:has-text('skip →')", "skip (recognition)");
          await page.waitForTimeout(WAIT_SHORT);
          continue;
        }
        await page.waitForTimeout(300);
      }
      if (!closed) await failHard(page, sessionIndex, "stuck-in-recognition-pass");
      log(`  recognition pass resolved -> clicked Finish session`);
    }

    // Confirm close step landed regardless of path
    try {
      await page.locator("text=Nice work today.").first().waitFor({ state: "visible", timeout: CLICK_TIMEOUT });
    } catch {
      await failHard(page, sessionIndex, "close-step-not-shown");
    }
    log(`  Session ${sessionIndex} CLOSED (Nice work today.)`);
    results.sessionsCompleted++;
  }

  log(
    `=== SUMMARY: sessionsCompleted=${results.sessionsCompleted}, allCaughtUpReached=${allCaughtUpReached}, ` +
      `grammarClozeCardsSeen=${grammarClozeCount}, consoleErrors=${results.consoleErrors.length}, pageErrors=${results.pageErrors.length} ===`,
  );
  results.allCaughtUpReached = allCaughtUpReached;
  results.grammarClozeCardsSeen = grammarClozeCount;
  fs.writeFileSync(`${SCREEN_DIR}/results.json`, JSON.stringify(results, null, 2));

  await browser.close();

  if (!allCaughtUpReached || results.consoleErrors.length > 0 || results.pageErrors.length > 0) {
    process.exitCode = 2;
  }
}

main().catch(async (err) => {
  console.error("DRIVER FAILED:", err);
  if (currentPage) {
    // Capture the live DOM at the hang: which buttons actually exist beats guessing.
    await currentPage.screenshot({ path: `${SCREEN_DIR}/DRIVERFAIL.png` }).catch(() => {});
    const html = await currentPage.content().catch(() => "<unavailable>");
    fs.writeFileSync(`${SCREEN_DIR}/DRIVERFAIL.html`, html);
    const buttons = await currentPage
      .locator("button")
      .allTextContents()
      .catch(() => []);
    console.error("BUTTONS ON PAGE AT FAILURE:", JSON.stringify(buttons));
    const body = await currentPage.textContent("body").catch(() => "");
    console.error("BODY TEXT AT FAILURE:", body.slice(0, 1200));
  }
  fs.writeFileSync(`${SCREEN_DIR}/results.json`, JSON.stringify(results, null, 2));
  process.exit(1);
});
