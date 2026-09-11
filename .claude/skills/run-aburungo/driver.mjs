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
 * Exit status is meaningful: zero only when the thing actually worked, so this
 * can gate automation. Screenshots land in shots/ (gitignored).
 */
import { chromium } from 'playwright'
import { spawn, execSync } from 'node:child_process'
import { connect } from 'node:net'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim()
const SHOTS = join(HERE, 'shots')
const PORT = 4188
const BASE = `http://localhost:${PORT}`

/**
 * Throws rather than exits.
 *
 * `process.exit` here would abort mid-command and skip every `finally`, so a
 * failure after startup would leave Chromium and a preview server running and
 * the next run would inherit the mess it caused.
 */
function fail(message) {
  throw new Error(message)
}

/** Required frontend env, by the two modules that throw at import without it. */
const REQUIRED_ENV = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY', 'VITE_API_URL']

function checkPrerequisites() {
  const envFile = join(ROOT, '.env.local')
  if (!existsSync(envFile)) {
    fail('.env.local is missing. src/lib/supabase.ts and src/api/client.ts throw at ' +
      `import time without ${REQUIRED_ENV.join(', ')}, and the symptom is a blank page.`)
  }
  // Presence is not enough: a key with an empty value throws exactly the same
  // way, and then the driver would report the blank page rather than the cause.
  const env = readFileSync(envFile, 'utf8')
  const missing = REQUIRED_ENV.filter((key) => {
    const line = env.match(new RegExp(`^\\s*${key}\\s*=(.*)$`, 'm'))
    return line === null || line[1].trim() === ''
  })
  if (missing.length > 0) fail(`.env.local has no value for ${missing.join(', ')}`)

  // package.json links the design system as link:../aburungo-design-system,
  // which resolves from a SIBLING directory and not from a nested one.
  if (!existsSync(join(ROOT, 'node_modules/aburungo-design-system/dist/index.js'))) {
    fail('The design system is not built. Clone petr0n/aburungo-design-system as a ' +
      'sibling of this repo, check out the sha pinned in .github/workflows/ci.yml, ' +
      'then run pnpm install && pnpm build in it.')
  }
}

/**
 * Refuse a port something else already holds.
 *
 * Without this the driver lies. `vite preview --strictPort` exits when the port
 * is taken, but the readiness probe then gets its 200 from whatever was already
 * listening — so `smoke` would drive an older bundle, or an unrelated app, and
 * report success for a build it never loaded.
 */
async function requireFreePort(port, what) {
  // Connect, do not bind. Binding probes one interface: a squatter holding ::
  // leaves 127.0.0.1 bindable on macOS, so a bind check passed while an old
  // server was still answering and the smoke then drove ITS bundle. Connecting
  // to "localhost" resolves the same way the driver's own fetch will.
  const answered = await new Promise((resolve) => {
    const socket = connect({ port, host: 'localhost' })
    socket.setTimeout(1000)
    socket.once('connect', () => { socket.destroy(); resolve(true) })
    socket.once('timeout', () => { socket.destroy(); resolve(false) })
    socket.once('error', () => resolve(false))
  })
  if (answered) {
    fail(`port ${port} is already answering, so ${what} cannot be trusted to be the ` +
      `build under test. Free it: lsof -ti:${port} | xargs kill`)
  }
}

/** Wait for a child to answer, and give up if the child dies first. */
async function waitForHttp(url, child, what) {
  let exited = null
  child.once('exit', (code) => { exited = code })
  for (let i = 0; i < 60; i++) {
    if (exited !== null) fail(`${what} exited with code ${exited} before answering`)
    try {
      const res = await fetch(url)
      if (res.ok) return res
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500))
  }
  fail(`${what} never answered ${url}`)
}

async function serve() {
  await requireFreePort(PORT, 'the preview server')
  execSync('pnpm build', { cwd: ROOT, stdio: 'inherit' })
  // vite preview, not the dev server: HMR remounts React mid-session if another
  // agent edits the linked design system, which reads as an app stall.
  const server = spawn('pnpm', ['exec', 'vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: 'ignore',
  })
  try {
    await waitForHttp(BASE, server, 'vite preview')
    return server
  } catch (e) {
    server.kill()
    throw e
  }
}

async function openApp() {
  const browser = await chromium.launch()
  // A phone, because the product is mobile-first.
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const problems = []
  page.on('pageerror', (e) => problems.push(`page error: ${e.message}`))
  page.on('console', (m) => { if (m.type() === 'error') problems.push(`console: ${m.text()}`) })
  return { browser, page, problems }
}

/**
 * Run `body` with a preview server and a browser, and always take both down.
 *
 * The browser is created INSIDE the guard: launching it is the documented
 * failure when chromium is not installed, and creating it outside would leak
 * the server that had already started.
 */
async function withApp(body) {
  checkPrerequisites()
  mkdirSync(SHOTS, { recursive: true })
  const server = await serve()
  let browser = null
  try {
    const app = await openApp()
    browser = app.browser
    return await body(app)
  } finally {
    if (browser !== null) await browser.close()
    server.kill()
  }
}

async function smoke() {
  const problems = await withApp(async ({ page, problems }) => {
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
    return problems
  })

  // A rendered page that logs errors is not a pass. Reported after cleanup so
  // the caller gets both the diagnosis and a usable exit status.
  if (problems.length > 0) {
    fail(`the app rendered but logged ${problems.length} problem(s):\n    ${problems.slice(0, 5).join('\n    ')}`)
  }
  console.log('\n✓ smoke passed, no page or console errors')
}

async function shot(route = '/', name = 'shot') {
  const problems = await withApp(async ({ page, problems }) => {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(600)
    const file = join(SHOTS, `${name}.png`)
    await page.screenshot({ path: file, fullPage: true })
    console.log(`\n  ${route} -> ${file}`)
    return problems
  })
  if (problems.length > 0) console.log(`  ${problems.length} console/page problem(s)`)
}

/**
 * The Hono API. Separate process, separate env file, separate port — and it
 * needs server/.env, not the root .env.local.
 */
async function api() {
  if (!existsSync(join(ROOT, 'server/.env'))) {
    fail('server/.env is missing. Copy server/.env.example and fill it in.')
  }
  // server/src/index.ts reads process.env.PORT, and dotenv does not override an
  // already-exported variable — so an exported PORT wins over the file, and
  // this has to resolve in the same order or it polls the wrong port.
  const fromFile = readFileSync(join(ROOT, 'server/.env'), 'utf8').match(/^\s*PORT\s*=\s*(\d+)/m)
  const port = process.env.PORT ?? fromFile?.[1] ?? '3000'
  await requireFreePort(Number(port), 'the API')
  execSync('pnpm build', { cwd: join(ROOT, 'server'), stdio: 'inherit' })
  const proc = spawn('node', ['dist/index.js'], { cwd: join(ROOT, 'server'), stdio: 'ignore' })
  try {
    const res = await waitForHttp(`http://localhost:${port}/health`, proc, 'the API')
    // Any 2xx would pass a bare res.ok, including a proxy or an unrelated app
    // that happens to answer /health. The route returns {"ok":true}; require it.
    const body = await res.json().catch(() => null)
    if (body?.ok !== true) fail(`/health on :${port} answered ${JSON.stringify(body)}, not {"ok":true}`)
    console.log(`\n✓ API up on :${port} — /health says ${JSON.stringify(body)}`)
  } finally {
    proc.kill()
  }
}

const [command, ...rest] = process.argv.slice(2)
try {
  if (command === 'smoke') await smoke()
  else if (command === 'shot') await shot(rest[0], rest[1])
  else if (command === 'api') await api()
  else {
    console.log('usage: driver.mjs smoke | shot <route> [name] | api')
    process.exitCode = 1
  }
} catch (e) {
  console.error(`\n✗ ${e.message}\n`)
  process.exitCode = 1
}
