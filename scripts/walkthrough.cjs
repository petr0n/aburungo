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
// A stop so a genuine stall cannot loop forever -- not a statement about how
// long the ladder is. It was 60 with a comment reading "44 units", and Chapter 6
// took the ladder to 64: the run then ended at session 60 having passed every
// lesson it saw, reporting ladderEndReached=false with nothing actually broken.
// Keep it comfortably above the lesson count; per-step guards catch real stalls,
// so a generous cap costs nothing.
const MAX_SESSIONS = process.env.MAX_SESSIONS ? parseInt(process.env.MAX_SESSIONS, 10) : 200;

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
 * The 41-session walk never sees the review step: a fresh profile has nothing
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

/**
 * The end-of-ladder checkpoint (unit 42) is a mastery gate, not a teach step:
 * rounds of recognition repeat until nothing is left to place. It has no
 * words/phrases/grammar stages, so the normal stage loop would never find a
 * terminal. Drive it to completion here instead.
 */
async function handleCheckpointIfPresent(page, sessionIndex) {
  if (!(await visible(page, "text=to place"))) return false;
  log(`  recognition checkpoint detected (session ${sessionIndex})`);

  let guard = 0;
  let rounds = 1;
  while (guard < 400) {
    guard++;

    if (await visible(page, "button:has-text('Done — all placed')")) {
      await clickWhenReady(page, "button:has-text('Done — all placed')", "Done — all placed");
      log(`  checkpoint complete after ${rounds} round(s)`);
      return true;
    }
    if (await visible(page, "button:has-text('Place these again')")) {
      await clickWhenReady(page, "button:has-text('Place these again')", "Place these again");
      rounds++;
      await page.waitForTimeout(WAIT_SHORT);
      continue;
    }

    // Answer the current card. Any option is fine — a miss simply re-queues,
    // which is the behaviour under test.
    const option = page.locator("main button, body button").filter({ hasNotText: "skip" }).last();
    if ((await option.count()) === 0) break;
    await option.click({ timeout: CLICK_TIMEOUT }).catch(() => {});
    await page.waitForTimeout(450);
  }

  await failHard(page, sessionIndex, "stuck-in-recognition-checkpoint");
  return true;
}

/**
 * Handle the production checkpoint, unit 44 (DR-023).
 *
 * Unlike a recognition checkpoint, this one cannot be cleared by guessing: the answer is typed,
 * not picked from four options, so a driver that does not know Japanese would
 * miss every card forever and the round would never shrink.
 *
 * It passes the way a learner does. Round one reveals each answer with "Show
 * answer" — which counts as a miss and requeues the card — while recording the
 * kana reading. Round two types those readings back. Both paths of the gate get
 * exercised, and it terminates in two rounds.
 *
 * Two details that cost a stalled 20-minute run each, found with
 * scripts/probe-production.cjs rather than by reading the markup:
 *
 * 1. **Type kana, not romaji.** The app prints romaji as "mizu o kudasai" —
 *    spaced, particle spelled `o` — which converts back to "みず お ください",
 *    never "みずをください". JP-keyboard mode takes the kana reading verbatim.
 * 2. **Verbs render "reading · politeReading" in one node.** Scraping it whole
 *    types both forms. Only the plain form before the separator is the answer.
 */
async function handleProductionCheckpointIfPresent(page, sessionIndex) {
  if (!(await visible(page, "text=to write"))) return false;
  log(`  production checkpoint detected (session ${sessionIndex})`);

  const answers = new Map();
  let guard = 0;

  while (guard < 200) {
    guard++;
    if (!(await visible(page, "text=to write"))) break; // round(s) done, unit closed

    const prompt = await page.locator("p.text-heading").first().textContent().catch(() => null);
    if (prompt === null) break;
    const known = answers.get(prompt.trim());

    if (known === undefined) {
      await clickWhenReady(page, "button:has-text('Show answer')", "Show answer (production)");
      const reading = await page
        .locator("p.font-jp.text-jp.text-fg-muted")
        .first()
        .textContent()
        .catch(() => null);
      if (reading !== null) answers.set(prompt.trim(), reading.split("·")[0].trim());
    } else {
      await clickWhenReady(page, "button:has-text('JP keyboard')", "JP keyboard (production)");
      const input = page.locator('input[placeholder="Type the Japanese..."]').first();
      await input.waitFor({ state: "visible", timeout: CLICK_TIMEOUT });
      await input.fill(known);
      await page.waitForTimeout(150);
      await clickWhenReady(page, "button:has-text('Check answer')", "Check answer (production)");
    }

    await clickWhenReady(page, "button:has-text('Next')", "Next (production)");
    await page.waitForTimeout(300);
  }

  if (guard >= 200) await failHard(page, sessionIndex, "stuck-in-production-checkpoint");
  log(`  production checkpoint complete (${answers.size} distinct items)`);
  return true;
}

/**
 * Handle the two Hana checkpoints (DR-022).
 *
 * These are absent from the ladder unless VITE_HANA_ENABLED is set (DR-023), so
 * this normally does nothing. Kept because the flag-on ladder must still walk.
 *
 * Both are Hana screens. The walkthrough serves a static bundle with no API
 * server behind it, so every conversation call fails — which is precisely the
 * degraded path worth exercising: neither screen may dead-end the ladder when
 * Hana is unreachable. If a server *is* running the chat opens instead, and
 * both branches are handled.
 *
 * Returns "conversation", "can-do", or null.
 */
async function handleTerminalCheckpointIfPresent(page, sessionIndex) {
  // Detected by title, not by button label: the button reads "Start
  // conversation" when signed in and "Continue" for a guest, and the
  // walkthrough runs as a guest.
  if (await visible(page, "text=Cross-situation conversation")) {
    log(`  cross-situation conversation detected (session ${sessionIndex})`);

    if (await visible(page, "button:has-text('Start conversation')")) {
      await clickWhenReady(page, "button:has-text('Start conversation')", "Start conversation");
      await page.waitForTimeout(WAIT_SHORT * 2);
    }

    // Chat opened (server up), or the screen offers a way past (guest / server down).
    if (await visible(page, "button:has-text('← Finish')")) {
      await clickWhenReady(page, "button:has-text('← Finish')", "Finish (conversation)");
    } else if (await visible(page, "button:has-text('Continue')")) {
      await clickWhenReady(page, "button:has-text('Continue')", "Continue (Hana unavailable)");
    } else {
      await failHard(page, sessionIndex, "conversation-checkpoint-dead-end");
    }
    return "conversation";
  }

  if (await visible(page, "text=Come back to this later")) {
    log(`  can-do checkpoint detected (session ${sessionIndex})`);
    // Leaving without verifying must NOT complete the unit — the checkpoint has
    // to still be there tomorrow. That is why this is the end of the walk
    // rather than a session that rolls on to "All caught up!".
    await clickWhenReady(page, "button:has-text('Come back to this later')", "Come back to this later");
    return "can-do";
  }

  return null;
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
  /**
   * The ladder now ends at the can-do checkpoint rather than at "All caught
   * up!". That checkpoint is a standing one — leaving it unverified does not
   * complete it — so a walk with no API server behind it can never exhaust the
   * ladder. Either terminus counts as reaching the end; stopping before both
   * still fails.
   */
  let ladderEndReached = false;

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
      ladderEndReached = true;
      sessionIndex--; // this iteration did not consume a real session
      break;
    }

    await handleReviewStepIfPresent(page, sessionIndex);

    // The Hana checkpoints have no unit intro and no cards, so they are
    // detected before the generic Start click ("Start conversation" would match it).
    const terminalCheckpoint = await handleTerminalCheckpointIfPresent(page, sessionIndex);
    if (terminalCheckpoint !== null) {
      await page.locator("text=Nice work today.").first().waitFor({ state: "visible", timeout: CLICK_TIMEOUT });
      log(`  Session ${sessionIndex} CLOSED (${terminalCheckpoint} checkpoint)`);
      results.sessionsCompleted++;
      if (terminalCheckpoint === "can-do") {
        log(`Ladder end reached at session ${sessionIndex} — can-do checkpoint is the last unit.`);
        ladderEndReached = true;
        break;
      }
      continue;
    }

    // Unit intro
    if (await visible(page, "button:has-text('Start')")) {
      log(`  Unit intro visible, clicking Start`);
      await clickWhenReady(page, "button:has-text('Start')", "Start");
      await page.waitForTimeout(WAIT_SHORT);
    } else {
      log(`  No Start button immediately visible — proceeding to terminal detection`);
    }

    // The production checkpoint replaces the teach stages, like a recognition checkpoint, but is
    // reached through the same Start button so it is detected after that click.
    if (await handleProductionCheckpointIfPresent(page, sessionIndex)) {
      await page.locator("text=Nice work today.").first().waitFor({ state: "visible", timeout: CLICK_TIMEOUT });
      log(`  Session ${sessionIndex} CLOSED (production checkpoint)`);
      results.sessionsCompleted++;
      continue;
    }

    // The checkpoint replaces the teach stages entirely.
    if (await handleCheckpointIfPresent(page, sessionIndex)) {
      await page.locator("text=Nice work today.").first().waitFor({ state: "visible", timeout: CLICK_TIMEOUT });
      log(`  Session ${sessionIndex} CLOSED (checkpoint)`);
      results.sessionsCompleted++;
      // No sessionIndex++ here — the loop increments at the top, and doing it
      // again made every checkpoint skip a number (43 sessions labelled up to 46).
      continue;
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
    `=== SUMMARY: sessionsCompleted=${results.sessionsCompleted}, ladderEndReached=${ladderEndReached}, ` +
      `allCaughtUpReached=${allCaughtUpReached}, grammarClozeCardsSeen=${grammarClozeCount}, ` +
      `consoleErrors=${results.consoleErrors.length}, pageErrors=${results.pageErrors.length} ===`,
  );
  results.ladderEndReached = ladderEndReached;
  results.allCaughtUpReached = allCaughtUpReached;
  results.grammarClozeCardsSeen = grammarClozeCount;
  fs.writeFileSync(`${SCREEN_DIR}/results.json`, JSON.stringify(results, null, 2));

  await browser.close();

  if (!ladderEndReached || results.consoleErrors.length > 0 || results.pageErrors.length > 0) {
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
