#!/usr/bin/env node
/**
 * driver — build, serve and actually drive AburunGo, headlessly.
 *
 * The project already has `pnpm walkthrough`, which walks every lesson to the
 * end of the ladder. That is the thorough check and it takes ~10 minutes. This
 * is the fast one: does the app boot, render, take input and survive a real
 * interaction — in under a minute, with a screenshot to look at.
 *
 *   node .claude/skills/run-aburungo/driver.mjs smoke
 *   node .claude/skills/run-aburungo/driver.mjs shot /kana kana
 *   node .claude/skills/run-aburungo/driver.mjs api
 *
 * Screenshots land in .claude/skills/run-aburungo/shots/ (gitignored).
 */
import { chromium } from 'playwright'
import { spawn, execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim()
const SHOTS = join(HERE, 'shots')
const PORT = 4188
const BASE = `http://localhost:${PORT}`

function fail(message) {
  console.error(`\n✗ ${message}\n`)
  process.exit(1)
}

/**
 * The two things that make the app come up blank rather than error, both of
 * which cost time to diagnose from the symptom alone.
 */
function checkPrerequisites() {
  // src/lib/supabase.ts throws at module scope without these, which Playwright
  // reports as a dead page rather than a missing file.
  if (!existsSync(join(ROOT, '.env.local'))) {
    fail('.env.local is missing. The app throws at import time without ' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY, and the symptom is a blank page.')
  }
  // package.json links the design system as link:../aburungo-design-system,
  // which resolves from a SIBLING directory and not from a nested one.
  const ds = join(ROOT, 'node_modules/aburungo-design-system/dist/index.js')
  if (!existsSync(ds)) {
    fail('The design system is not built. Clone petr0n/aburungo-design-system as a ' +
      'sibling of this repo, check out the sha pinned in .github/workflows/ci.yml, ' +
      'then run pnpm install && pnpm build in it.')
  }
}

async function serve() {
  execSync('pnpm build', { cwd: ROOT, stdio: 'inherit' })
  // vite preview, not the dev server: HMR remounts React mid-session if another
  // agent edits the linked design system, which reads as an app stall.
  const server = spawn('pnpm', ['exec', 'vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: 'ignore',
  })
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(BASE)
      if (res.ok) return server
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500))
  }
  server.kill()
  fail(`vite preview never answered on ${BASE}`)
}

async function openApp() {
  const browser = await chromium.launch()
  // A phone, because the product is mobile-first and the keyboard only makes
  // sense at this width.
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const problems = []
  page.on('pageerror', (e) => problems.push(`page error: ${e.message}`))
  page.on('console', (m) => { if (m.type() === 'error') problems.push(`console: ${m.text()}`) })
  return { browser, page, problems }
}

async function smoke() {
  checkPrerequisites()
  mkdirSync(SHOTS, { recursive: true })
  const server = await serve()
  const { browser, page, problems } = await openApp()
  try {
    await page.goto(`${BASE}/learn`, { waitUntil: 'networkidle' })

    // A guest reaches Book One (TIER_BOOK_LIMIT in src/content/access.ts), and
    // its first lesson opens with a run of word-introduction cards. The typed
    // card is about ten clicks in, so the smoke has to walk to it rather than
    // expect it on arrival. "Got it — Next" changes its own label along the way
    // ("Start test", "Continue"), which is why this matches on the prefix.
    // "Skip" is deliberately not in the pattern: clicking it leaves the lesson.
    const forward = /^(Start|Got it)/
    let input = null
    for (let step = 0; step < 20; step++) {
      const candidate = page.locator('input[type="text"], input:not([type])').first()
      if (await candidate.isVisible().catch(() => false)) { input = candidate; break }
      const next = page.getByRole('button', { name: forward }).first()
      if (!(await next.isVisible().catch(() => false))) break
      await next.click()
      await page.waitForTimeout(400)
    }

    const body = await page.textContent('body')
    if (body === null || body.trim() === '') fail('the page rendered nothing at all')
    await page.screenshot({ path: join(SHOTS, 'learn.png') })
    console.log(`\n  reached: ${body.trim().slice(0, 70).replace(/\s+/g, ' ')}…`)
    console.log(`  screenshot: ${join(SHOTS, 'learn.png')}`)

    if (input === null) fail('never reached a card that takes typed input')

    // The interaction that proves the loop is live end to end: type, submit,
    // and get a verdict back. The answer is deliberately wrong -- a smoke test
    // should not depend on knowing today's card, and "Not quite" exercises the
    // same path as "Correct".
    await input.fill('てすと')
    await page.getByRole('button', { name: 'Check answer' }).first().click()
    await page.waitForTimeout(600)
    const verdict = await page.getByText(/^(Correct|Not quite)$/).first().textContent().catch(() => null)
    if (verdict === null) fail('typed an answer but the app returned no verdict')
    await page.screenshot({ path: join(SHOTS, 'answered.png') })
    console.log(`  typed an answer, app said "${verdict}"`)
    console.log(`  screenshot: ${join(SHOTS, 'answered.png')}`)

    console.log(problems.length === 0
      ? '\n✓ smoke passed, no page or console errors'
      : `\n! smoke rendered, with ${problems.length} problem(s):\n    ${problems.slice(0, 5).join('\n    ')}`)
  } finally {
    await browser.close()
    server.kill()
  }
}

async function shot(route = '/', name = 'shot') {
  checkPrerequisites()
  mkdirSync(SHOTS, { recursive: true })
  const server = await serve()
  const { browser, page, problems } = await openApp()
  try {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(600)
    const file = join(SHOTS, `${name}.png`)
    await page.screenshot({ path: file, fullPage: true })
    console.log(`\n  ${route} -> ${file}`)
    if (problems.length > 0) console.log(`  ${problems.length} console/page problem(s)`)
  } finally {
    await browser.close()
    server.kill()
  }
}

/**
 * The Hono API. Separate process, separate env file, separate port — and it
 * needs server/.env, not the root .env.local.
 */
async function api() {
  if (!existsSync(join(ROOT, 'server/.env'))) {
    fail('server/.env is missing. Copy server/.env.example and fill it in.')
  }
  execSync('pnpm build', { cwd: join(ROOT, 'server'), stdio: 'inherit' })
  const port = (readFileSync(join(ROOT, 'server/.env'), 'utf8').match(/^PORT=(\d+)/m) ?? [, '3000'])[1]
  const proc = spawn('node', ['dist/index.js'], { cwd: join(ROOT, 'server'), stdio: 'ignore' })
  try {
    for (let i = 0; i < 40; i++) {
      try {
        const res = await fetch(`http://localhost:${port}/health`)
        if (res.ok) {
          console.log(`\n✓ API up on :${port} — /health says ${await res.text()}`)
          return
        }
      } catch { /* not up yet */ }
      await new Promise((r) => setTimeout(r, 500))
    }
    fail(`the API never answered /health on :${port}`)
  } finally {
    proc.kill()
  }
}

const [command, ...rest] = process.argv.slice(2)
if (command === 'smoke') await smoke()
else if (command === 'shot') await shot(rest[0], rest[1])
else if (command === 'api') await api()
else {
  console.log('usage: driver.mjs smoke | shot <route> [name] | api')
  process.exit(1)
}
