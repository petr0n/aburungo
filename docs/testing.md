# AburunGo — Testing Strategy

A living document. Three plans, three jobs. None replaces the others.

## Testing layers

| Plan | What it catches | When it runs | Build when |
|------|----------------|--------------|------------|
| 1 — Claude-in-Chrome | Obvious breakage, visual issues, console errors | Manually, on demand | Now |
| 2 — Custom Agent | Complex flow failures, edge cases, UX friction under real usage | Scheduled nightly | Staging is live + core loop is stable |
| 3 — Shortest | Regressions — things that used to work and now don't | Automatically on every PR | Second contributor or real users on staging |

**The rule:** Plan 1 tells you if something is on fire right now. Plan 2 tells you
if the app holds up over a full session the way a real user would experience it.
Plan 3 stops a bad PR from merging in the first place — add it when the cost of a
regression reaching staging becomes real.

---

## Test Plan 1 — Claude-in-Chrome (Manual AI Session)

**Type:** Ad hoc, manually triggered  
**When to run:** After a significant feature lands or before a release candidate  
**Who runs it:** Ask Claude in a Claude Code session with browser tools active  
**Target:** Local dev server (`localhost:5173` + `localhost:3000`) or staging URL  

### Test accounts

Three dedicated accounts cover different states of the app. Create them once
with the Supabase CLI commands below, then seed each one's DB state.

| Account | Password | Role | Purpose |
|---------|----------|------|---------|
| `test-new@aburungo.app` | set on creation | none | First-time user, no history |
| `test-active@aburungo.app` | set on creation | none | Regular learner, mid-progress |
| `test-admin@aburungo.app` | set on creation | admin | Power user + admin route coverage |

**One-time setup — run these commands then set a password for each:**

```bash
# Create accounts
supabase auth admin create-user --email test-new@aburungo.app --email-confirm
supabase auth admin create-user --email test-active@aburungo.app --email-confirm
supabase auth admin create-user --email test-admin@aburungo.app --email-confirm

# Grant admin role to test-admin (replace <uid> with the UID printed above)
supabase auth admin update-user <uid> --app-metadata '{"role":"admin"}'
```

**DB seed state per account:**

```bash
# test-new: no progress rows needed — empty state is the test

# test-active: seed 8 due cards across 2 decks
# (run after the account exists — set due_at to past so cards are due now)
psql $DATABASE_URL -c "
  INSERT INTO user_card_progress (user_id, card_id, due_at, stability, difficulty, reps)
  SELECT '<test-active-uid>', id, now() - interval '1 day', 1.0, 5.0, 0
  FROM cards LIMIT 8;
"

# test-admin: seed 40 overdue cards
psql $DATABASE_URL -c "
  INSERT INTO user_card_progress (user_id, card_id, due_at, stability, difficulty, reps)
  SELECT '<test-admin-uid>', id, now() - interval '7 days', 1.0, 5.0, 3
  FROM cards LIMIT 40;
"
```

---

### Flow A — First Timer (`test-new@aburungo.app`)

**What this covers:** empty states, onboarding path, first card experience,
zero-progress UI, no SRS history edge cases.

#### 1. Landing + auth
- [ ] Navigate to `/` — landing page renders, "How it works" section visible
- [ ] Sign in with `test-new@aburungo.app`
- [ ] Confirm redirect to `/practice`

#### 2. Empty state
- [ ] Practice screen renders without crashing despite no due cards
- [ ] Empty state component is shown (not a blank screen or JS error)
- [ ] CTA or guidance is present — user isn't stranded

#### 3. First card (browse to any deck manually)
- [ ] Navigate to `/flashcard` — first card loads
- [ ] Flip card — back face shows reading + translation
- [ ] Rate card (Good) — advances to next card without error
- [ ] New card state (reps=0) handled correctly — no stale SRS data shown

#### 4. Kana practice (no prior history)
- [ ] `/kana` loads, hiragana grid renders
- [ ] Answer a multiple-choice question — correct and incorrect paths both work
- [ ] No "undefined" or stale progress shown from previous sessions

#### 5. Kanji (browse only)
- [ ] `/kanji` grid loads, JLPT filter renders
- [ ] Tap a kanji — detail panel opens
- [ ] No prior drill history shown — detail panel handles zero-state

#### 6. Conversation (fresh session)
- [ ] `/conversation` loads — no prior session history visible
- [ ] Start N5 session, confirm Hana replies
- [ ] Session history shows only current session

### Report
File as `docs/test-runs/YYYY-MM-DD-flow-a-new.md`

---

### Flow B — Regular Learner (`test-active@aburungo.app`)

**What this covers:** normal review loop, all three FillInput modes, flashcard
SRS cycle, kana and kanji drill, conversation, typical daily-use path.

#### 1. Auth + practice queue
- [ ] Sign in, confirm due cards are waiting on `/practice`
- [ ] Card count and queue order look correct

#### 2. Fill-in-the-blank — all three input modes
- [ ] **Romaji:** type `sushi` → preview shows `すし`, submit
- [ ] **Kana grid:** switch mode, tap す → し → accumulates correctly, backspace removes last char, submit
- [ ] **System IME:** switch mode, type directly in Japanese, submit
- [ ] Correct answer: correct state renders
- [ ] Wrong answer: wrong state renders with expected answer shown
- [ ] Complete 8 cards — session ends, score screen appears

#### 3. Flashcard full cycle
- [ ] Load `/flashcard`, flip a card
- [ ] Rate Again — card comes back later in session
- [ ] Rate Easy — card scheduled far out, doesn't reappear this session
- [ ] Complete session — result screen shows correct/total breakdown

#### 4. Kana practice — both scripts
- [ ] Hiragana multiple-choice: answer 5 questions
- [ ] Switch to katakana, answer 5 questions
- [ ] Type-romaji mode: type romaji for displayed kana, confirm validation

#### 5. Kanji drill
- [ ] Browse grid with N5 filter
- [ ] Enter drill mode — kanji card shows, self-rate works
- [ ] Missed kanji appear in result set at end

#### 6. Conversation
- [ ] Start N4 session (one level up from N5)
- [ ] Send 3 messages, confirm Hana replies in appropriate difficulty
- [ ] Reload page — session history persists

### Report
File as `docs/test-runs/YYYY-MM-DD-flow-b-active.md`

---

### Flow C — Power User + Admin (`test-admin@aburungo.app`)

**What this covers:** large overdue queue, admin routes, stress on SRS state,
error recovery, edge cases under load.

#### 1. Auth + overdue queue
- [ ] Sign in, confirm 40 overdue cards shown
- [ ] Practice screen handles large queue without layout breaking
- [ ] Scroll/pagination (if any) works correctly

#### 2. Rapid review — stress test
- [ ] Complete 10 cards back-to-back as fast as possible
- [ ] No race conditions — answers from card N don't bleed into card N+1
- [ ] Progress persists correctly after each submission (check network tab)

#### 3. Admin routes
- [ ] Navigate to `/admin/users` — user list loads, test accounts visible
- [ ] `/admin/feedback` — inbox renders (empty state if no feedback)
- [ ] `/admin/health` — DB ping green, all service statuses visible
- [ ] Non-admin account (`test-active`) cannot access `/admin/*` — redirected

#### 4. Error recovery
- [ ] Mid-session: kill the Hono server
- [ ] Submit an answer — error state renders gracefully, no blank screen
- [ ] Restart server — resume session without full page reload
- [ ] Confirm answer submitted before kill was saved (check DB)

#### 5. Edge cases
- [ ] Switch FillInput modes mid-answer — previous input clears correctly
- [ ] Submit answer then immediately navigate away and back — no ghost state
- [ ] Open two tabs, complete a card in tab 1 — tab 2 reflects updated queue

#### 6. Console audit
- [ ] Zero unhandled errors in browser console across entire flow
- [ ] No 4xx/5xx network requests except the intentional server-kill test

### Report
File as `docs/test-runs/YYYY-MM-DD-flow-c-admin.md`

---

### Running a flow

```bash
# Start the app
pnpm dev

# Then in a Claude Code session:
# "Run Flow A using test-new@aburungo.app against localhost:5173"
```

Claude follows the checklist above, files a report in `docs/test-runs/`, and
flags any failures with console output and screenshots.

### Report folder

```bash
mkdir -p docs/test-runs
echo "# Test Runs" > docs/test-runs/README.md
```

---

## Test Plan 2 — Custom AburunGo Test Agent (Scheduled Deep Runs)

**Type:** Automated, goal-driven, exploratory  
**When to run:** Nightly cron + manually before any release  
**Who maintains it:** Developers — scenarios grow as features ship  
**Target:** Staging deployment  
**Repo:** Main AburunGo repo — `tests/agent/`

### What it is

A Node.js/TypeScript program that drives a real browser (Playwright) using Claude
Haiku as the decision-making brain. Given a **persona** (a user archetype with
described behavior) and a **scenario** (a seeded DB state + a goal), the agent
navigates the app as that person would — making decisions, handling unexpected
states, and logging what it observes at every step.

Unlike Shortest (Plan 3), which checks that flows you wrote still work, the agent
*explores*. It finds failures in paths nobody anticipated.

### Structure

```
tests/
  agent/
    runner.ts               ← generic agent loop (browser + Claude brain)
    personas/
      beginner.ts           ← day-3 learner, slow, makes mistakes
      returner.ts           ← coming back after a week away
    scenarios/
      practice-session.ts   ← seeds due cards, goal: complete a session
      first-time-flow.ts    ← no prior progress, goal: complete first card
      conversation.ts       ← goal: have a 5-turn N5 conversation with Hana
    fixtures/
      seed-test-user.ts     ← reset + seed Supabase test account before each run
    reports/                ← gitignored, output lands here
```

`runner.ts` is generic — it takes a persona + scenario and produces a report.
Scenarios are what's specific to AburunGo and grow as features ship.

### Personas

Personas describe *how* the agent behaves, not just *what* it does. This exercises
different code paths and surfaces different UX issues.

**Beginner (`beginner.ts`)**
> "You are a Japanese learner on day 3. You read slowly. You make romaji spelling
> mistakes. You sometimes tap the wrong kana key. You get confused if the UI doesn't
> give clear feedback after an action."

**Returner (`returner.ts`)**
> "You haven't used the app in 8 days. You have 40 overdue cards. You want to get
> through your review queue as fast as possible. You are impatient with animations."

### Scenarios

Each scenario seeds a specific Supabase state before the agent runs so results
are reproducible.

| Scenario | Seeded state | Goal |
|----------|-------------|------|
| `practice-session` | 8 due cards across 2 decks | Complete a full session |
| `first-time-flow` | No progress records | Complete the first card in any deck |
| `conversation` | Clean session history | Have a 5-turn N5 conversation |
| `overdue-queue` | 40 cards all past due | Work through as many as possible in 10 min |

### What a report looks like

```markdown
## Run: beginner × practice-session — 2026-05-24 04:00 UTC
**SHA:** a1b2c3d  **Duration:** 4m 12s  **Cards completed:** 5/8

### Issues found
- [BUG] Kana value clears when kanaSection changes mid-entry (step 3)
- [UX] Section toggle has ~400ms lag on first tap (step 2)

### Step log
1. /practice loaded in 340ms ✓
2. Switched to kana grid — 420ms visual lag on section toggle ⚠
3. Tapped は then switched section — kana cleared unexpectedly ✗
...
```

Reports are written to `tests/agent/reports/`. Nightly runs post a summary as a
GitHub issue tagged `test-agent` so failures surface without checking logs.

### Running it

```bash
# single scenario, specific persona
pnpm test:agent --scenario practice-session --persona beginner

# all scenarios, all personas (pre-release full run)
pnpm test:agent --all
```

### GitHub Actions — nightly cron

```yaml
name: Agent Tests (nightly)
on:
  schedule:
    - cron: "0 4 * * *"   # 4 AM UTC

jobs:
  agent:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - run: pnpm install
      - run: pnpm test:agent --all
        env:
          STAGING_URL: ${{ secrets.STAGING_URL }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

### Cost

Each scenario run (30–50 agent steps) uses Claude Haiku at ~$0.02–0.05 per run.
Running 3 scenarios × 2 personas nightly ≈ $0.30/night → under $10/month.

### Maintenance rule

**Every major feature ships with one new scenario or an update to an existing one.**
The agent is only as useful as its scenario coverage. Treat `tests/agent/scenarios/`
like a product spec — it should reflect how real users actually use the app.

### When to build it

Build Plan 2 after:
1. Staging deployment is live
2. At least 3 decks with real content are seeded
3. The core practice loop (fill-in-the-blank + flashcard) is stable

It's most valuable once there's enough app to have real multi-step sessions.
Building it too early means the scenarios change constantly as the app is still
being shaped.

---

## Test Plan 3 — Shortest (AI-native, in-repo, CI-integrated)

**Type:** Automated, runs on every PR via GitHub Actions  
**When to run:** On push to any branch + nightly against staging  
**Who maintains it:** Developers — tests live in the repo alongside the code  
**Target:** Staging deployment (Vercel preview or Railway staging URL)  
**Repo:** Main AburunGo repo — tests under `tests/shortest/`  
**Build when:** Second contributor joins, or real users are on staging

### What it is

[Shortest](https://github.com/antiwork/shortest) is an open-source AI-native test
framework by Antiwork. Tests are written in plain English inside `.test.ts` files.
The runner uses a real browser (Playwright under the hood) and an LLM (Claude) to
interpret each natural-language step and execute it against your live app.

No generated boilerplate. No selector maintenance. The test file is the spec.

Plans 1 and 2 cover most quality needs for a solo project. Add Plan 3 when the
cost of a regression reaching staging becomes real — a second contributor whose
PR can break your code, or users who will actually notice.

### Prerequisites

- Staging deployment live (Vercel preview or Railway)
- `SHORTEST_ANTHROPIC_API_KEY` secret in GitHub repo settings
- `STAGING_URL` secret pointing to the staging base URL
- Test account credentials in secrets: `TEST_EMAIL`, `TEST_PASSWORD`
- `@antiwork/shortest` added to `devDependencies`

### Setup (one-time)

```bash
pnpm add -D @antiwork/shortest
```

Add `shortest.config.ts` at repo root:

```ts
import type { ShortestConfig } from "@antiwork/shortest"

export default {
  baseUrl: process.env.STAGING_URL ?? "http://localhost:5173",
  anthropicApiKey: process.env.SHORTEST_ANTHROPIC_API_KEY,
} satisfies ShortestConfig
```

Add to `package.json` scripts:
```json
"test:e2e": "shortest"
```

### Test file — `tests/shortest/flows.test.ts`

```ts
import { test } from "@antiwork/shortest"

// Auth
test("user can sign in with email and password and land on the practice page")

// Fill-in-the-blank — all three input modes
test("user can answer a practice card using romaji input and see kana preview update live")
test("user can switch to kana grid mode, tap kana keys to build an answer, and submit it")
test("user can switch to system IME mode and type a Japanese answer directly")

// Wrong answer path
test("submitting an incorrect answer shows the wrong state without crashing")

// Flashcard
test("user can flip a flashcard and self-rate it as Good to advance to the next card")

// Kana practice
test("user can toggle between hiragana and katakana on the kana practice screen")
test("user can answer a multiple-choice kana question correctly")

// Kanji
test("user can browse the kanji grid and open the detail panel for a single kanji")

// Conversation
test("user can start an N5 conversation session and receive a streamed reply from Hana")

// Error resilience
test("when the API server is unreachable the app shows an error state instead of a blank screen")
```

### GitHub Actions — `.github/workflows/e2e.yml`

```yaml
name: E2E (Shortest)
on:
  push:
    branches: ["**"]
  schedule:
    - cron: "0 4 * * *"   # nightly at 4 AM UTC

jobs:
  shortest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - run: pnpm install
      - run: pnpm test:e2e
        env:
          STAGING_URL: ${{ secrets.STAGING_URL }}
          SHORTEST_ANTHROPIC_API_KEY: ${{ secrets.SHORTEST_ANTHROPIC_API_KEY }}
          TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
```

### What you get

- Pass/fail per test with a plain-English description of what failed
- Screenshot on failure
- Tests that read like a feature checklist — easy to audit, easy to extend
- New feature = add one line to the test file

### Cost model

Each test run makes LLM API calls against your Anthropic key. A full suite of
~12 tests costs roughly $0.05–0.15 per run at Haiku pricing. Nightly + per-PR
at modest PR volume is well under $10/month.

### Maintenance rule

**Every new user-facing feature gets one Shortest test.** Add it to `flows.test.ts`
in the same PR that ships the feature. Tests drift when they're added retroactively.
