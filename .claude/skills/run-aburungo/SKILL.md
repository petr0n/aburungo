---
name: run-aburungo
description: Build, run, screenshot and drive the AburunGo Japanese-learning app and its Hono API. Use when asked to run, start, launch, build, test, smoke-test or screenshot AburunGo, /learn, the book map, or the API server.
---

# Running AburunGo

A Vite + React 19 frontend (`src/`) and a Hono API (`server/`) in one repo.
Both are driven headlessly by the committed driver:

```
.claude/skills/run-aburungo/driver.mjs
```

**All paths below are relative to the repo root.** Verified on macOS 26.6.2
(Darwin 25.6.0), Node v24.7.0, pnpm 11.1.3. The Linux specifics are in
`.github/workflows/ci.yml`; this skill documents what was actually run here.

## Prerequisites

The frontend compiles against a **sibling** checkout of the design system.
`package.json` declares it as `link:../aburungo-design-system`, which resolves
from a sibling directory and not from a nested one.

```bash
git clone https://github.com/petr0n/aburungo-design-system ../aburungo-design-system
grep -m1 'ref:' .github/workflows/ci.yml          # the pinned sha
git -C ../aburungo-design-system checkout <that-sha>
pnpm -C ../aburungo-design-system install
pnpm -C ../aburungo-design-system build           # produces dist/index.js
```

Then the app itself, and the browser the driver uses:

```bash
pnpm install
pnpm exec playwright install chromium
```

`pnpm install` is the one command in this file that was not run while writing
it, on purpose: it rewrites the design-system symlink (see Gotchas), and this
checkout had it pointed at a worktree. On a clean machine it is required.

`.env.local` (gitignored) must exist **with real values** — an empty value
throws at import exactly like a missing key, so the driver rejects both:

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
VITE_API_URL=http://localhost:3000
WALKTHROUGH_EMAIL=<account>          # optional; lets pnpm walkthrough sign in
WALKTHROUGH_PASSWORD=<password>
```

Take the Supabase values from the project dashboard. The placeholders above are
not usable as written.

`server/.env` is separate — copy `server/.env.example`.

## Run: the driver (agent path)

```bash
node .claude/skills/run-aburungo/driver.mjs smoke
```

Builds, serves the bundle on :4188 with `vite preview`, opens `/learn` at a
390x844 phone viewport, clicks forward to the first card that takes typed
input, types an answer, submits it, and reports the verdict. Screenshots land
in `.claude/skills/run-aburungo/shots/` (gitignored).

**Exit status is meaningful** — zero only when it actually worked, so it can
gate automation. A page that renders but logs a console error is a failure, not
a warning. Output when it passes:

```
  reached: aburungoアブルンゴSign inTodayWordsKanaFlashcardsPracticeKanjiHow to useTry…
  screenshot: .../shots/learn.png
  typed an answer, app said "Not quite"
  screenshot: .../shots/answered.png

✓ smoke passed, no page or console errors
```

Any route, full page:

```bash
node .claude/skills/run-aburungo/driver.mjs shot /kana kana
```

The API — builds `server/`, starts it, waits for `/health`, stops it:

```bash
node .claude/skills/run-aburungo/driver.mjs api
# ✓ API up on :3000 — /health says {"ok":true}

PORT=3901 node .claude/skills/run-aburungo/driver.mjs api
# ✓ API up on :3901 — /health says {"ok":true}
```

An exported `PORT` wins over `server/.env`, because `server/src/index.ts` reads
`process.env.PORT` and dotenv does not override an already-exported variable.
`/health` must answer `{"ok":true}`; any other 2xx is treated as something else
listening, not the API.

## Run: the full walkthrough

The project's own end-to-end driver, already committed. Walks every `/learn`
unit to "All caught up!":

```bash
pnpm walkthrough
```

Takes about ten minutes. **It exits 2 on any console error even when the
ladder completes** — read the `=== SUMMARY:` line rather than the exit code:

```
=== SUMMARY: walkedAs=signed-in (reaches Book Four), sessionsCompleted=76,
ladderEndReached=true, allCaughtUpReached=true, consoleErrors=42, pageErrors=0 ===
```

`walkedAs=guest` means it reached Book One only; put `WALKTHROUGH_EMAIL` and
`WALKTHROUGH_PASSWORD` in `.env.local` to lift it to Book Four.

## Run: human path

```bash
pnpm dev          # frontend on :5173
pnpm dev:api      # API on :3000
pnpm dev:server   # both, via concurrently
pnpm bookmap      # the content review SPA, opens a browser
```

Useless for an agent: they block and open windows. `pnpm dev:api` refuses to
start if :3000 is already taken and says so.

## Build and test

```bash
pnpm build        # tsc -b && vite build
pnpm test         # vitest run — 661 tests, 43 files
pnpm lint         # eslint .
pnpm ladder       # regenerate docs/<book>-ladder.md; pnpm test fails if stale
```

## Gotchas

- **A blank page is almost always a missing `.env.local`.** `src/lib/supabase.ts`
  throws at module scope, so Playwright reports a dead page rather than a
  missing file. The driver checks for it first and says so.
- **The design system link is a symlink that `pnpm install` silently resets.**
  You can point it at a worktree — `ln -sfn ../../aburungo-ds-<slug>
  node_modules/aburungo-design-system` — and the next `pnpm install` puts it
  back to `../aburungo-design-system` without a word. If the UI reverts to an
  older version, that is why.
- **The pre-commit hook compiles against whatever that symlink points at.**
  `.githooks/pre-commit` runs `pnpm lint` and `pnpm typecheck`, so a branch
  written against a *different* design-system version cannot be committed until
  the symlink matches it. Check out the sha that branch pins, rebuild the
  design system, then commit.
- **The design-system sha is pinned in two files and they must move together:**
  `.github/workflows/ci.yml` (`ref:`) and `scripts/vercel-install.sh`
  (`DS_SHA`). Half a move builds one thing locally and another on Vercel.
- **The pin must be an ancestor of the design system's `main`**, not merely
  resolvable — a squash-merged branch head disappears when the branch is
  deleted. Check with
  `git -C ../aburungo-design-system merge-base --is-ancestor <sha> origin/main`.
- **Do not drive the app through `pnpm dev`.** HMR remounts React mid-session
  if anything edits the linked design system, which reads as an app stall. The
  driver and `pnpm walkthrough` both use a preview build for this reason.
- **The first typed card is about ten clicks into the first lesson**, and the
  button changes its own label as you go — "Got it — Next", then "Start test",
  then "Continue". The driver matches on the `Got it` prefix and deliberately
  never clicks "Skip", which leaves the lesson.
- **The driver refuses a port that is already answering**, both :4188 and the
  API's. Not fussiness: `vite preview --strictPort` *exits* when the port is
  taken, so a readiness probe gets its 200 from whatever was already there, and
  the smoke would drive an older bundle and report success for a build it never
  loaded. It checks by connecting rather than binding — a squatter holding `::`
  still leaves `127.0.0.1` bindable on macOS, and a bind check misses it.
- **A guest only reaches Book One.** That is `TIER_BOOK_LIMIT` in
  `src/content/access.ts` working correctly, not a bug, but it means an
  unauthenticated run says nothing about Books Two to Four.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `✗ .env.local is missing` | Create it with the variables above. |
| `✗ The design system is not built` | `pnpm -C ../aburungo-design-system install && pnpm -C ../aburungo-design-system build` |
| `error TS2305: Module 'aburungo-design-system' has no exported member …` | The symlink points at a design-system version this branch was not written against. Check out the sha in `.github/workflows/ci.yml` and rebuild it. |
| `Error: port 3000 is already in use` from `pnpm dev:api` | `lsof -ti:3000 \| xargs kill` |
| `✗ port 4188 is already answering` | `lsof -ti:4188 \| xargs kill` |
| `✗ .env.local has no value for VITE_…` | Fill that key in; an empty value throws like a missing one. |
| `✗ the app rendered but logged N problem(s)` | A real console or page error. The screenshots are still written — look at them. |
| `pnpm walkthrough` exits 2 with `ladderEndReached=true` | The ladder finished; the exit code is console errors. Read the SUMMARY line. |
| `browserType.launch: Executable doesn't exist` | `pnpm exec playwright install chromium` |
