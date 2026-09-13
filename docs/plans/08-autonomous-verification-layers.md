# Autonomous Verification Layers

**Status:** Draft — for review before implementation.

These layers are a **complement to CI**, not a replacement. CI already runs `lint`/`build`/`test` on every PR (via `.github/workflows/ci.yml`). These layers add: (1) an agent's read of the diff + intent, and (2) a runtime smoke test (walkthrough) and a Japanese-content audit that CI itself doesn't do.

---

## Layer 1 — Code review agent

### What it is

A review that runs on your machine when you start a Hermes session, using two AI
coding agents (Claude and Codex) working independently over the diff + intent +
test output + walkthrough result. Each posts findings in a consistent shape, with a
`blocking` / `advisory` tag and file+line+reason. A combined verdict is written to
`/tmp/aburungo-review-*.json`; a summary is printed in the session.

This is a **CLI-only review**, not a GitHub Actions workflow. There is no in-repo
workflow file for Layer 1. The review runs in your local Hermes session via the
shell hook; it does not touch GitHub until you push. If you want an automated
PR-side review later, that is a separate workflow to add on top of this — but the
current scope is local, semi-automatic, on-session-start.

### Trigger

Hermes `on_session_start` shell hook (SemiAuto medium). The hook fires once per
session start, detects whether there are any uncommitted changes, and runs the
review only if there are. If the session starts with a clean tree, the hook skips
without running either agent.

### What runs (per review)

1. **Change detection**: `git status --porcelain` (and `git diff --stat` for the
   summary). If nothing changed, skip.
2. **Gate runs**: `pnpm lint`, `pnpm build`, `pnpm test`. Capture stdout/stderr +
   exit codes (pass/fail, not just "did CI pass" — the agent sees the actual
   failure output).
3. **Runtime smoke test**: `pnpm walkthrough` — builds, serves the static bundle on
   :4173, drives headless Chromium through the `/learn` ladder to "All caught up",
   reports console + page errors. This is the one check that exercises the actual
   app (CI's gates are compile+test; walkthrough is the real user path). Runs as a
   guest, so it stays in Book One — that's correct, not a bug.
4. **Diff**: `git diff --unified=20` against the merge base (or `HEAD~1` if no
   tracking branch) → changed files + added/removed lines.
5. **Review context assembly**:
   - `CLAUDE.md` (project rules, product direction, conventions).
   - `docs/plans/99-roadmap.md` (current status, priorities, open decisions).
   - `docs/content-authoring.md` (content procedure — included when the diff touches `src/content/`).
   - `docs/superpowers/specs/2026-09-06-checkpoints-and-srs-design.md` (SRS/checkpoint spec — included when the diff touches `src/srs/` or checkpoint/review behavior).
   - The relevant detailed plan file(s) when their domain is in the diff (e.g. a Book Two chapter plan when content for that chapter changes) — included only if in play, to keep context bounded.
   - The diff.
   - Gate outputs (lint/build/test/walkthrough — pass or failure logs).
6. **Agent reviews**:
   - **Claude review**: call Claude Code CLI (`claude`, authenticated with your
     existing account) over the assembled context → findings tagged `blocking` or
     `advisory`, file+line+reason. Writes its findings to
     `/tmp/aburungo-review-<ts>-claude.json`.
   - **Codex review**: call Codex CLI (`codex`, authenticated with your existing
     account) over the same context → same shape, independently. Writes to
     `/tmp/aburungo-review-<ts>-codex.json`.
7. **Overall verdict**: `/tmp/aburungo-review-<ts>.json` = combined findings. Fails
   if any `blocking` finding is present across either review. Passes if no blocking
   finding.
8. **Output (in-session)**: the hook prints a one-line summary — which agents ran,
   how many findings total, how many blocking — and where the combined JSON lives.
   You read the JSON (or the per-agent files) when you want detail.

### Review prompt

The review instructions live in `~/.hermes/agent-hooks/aburungo-review-prompt.md`.
Both agents get the same prompt. The prompt tells each agent:
- What aburungo is (from CLAUDE.md's product + scope lines).
- What changed (the diff).
- What passed/failed (the gate outputs + walkthrough result).
- The rubric: what is `blocking` vs `advisory`.
- The output shape: one JSON object per finding, with `file`, `line`, `type`
  (`blocking` / `advisory`), `summary`, `why`.
- The rule: apply the rubric, don't invent new blocking criteria.

The prompt is part of the repo's automation surface — if the rubric changes, the
prompt changes with it. It is not in the repo yet (it lives under `~/.hermes/`),
but treat it as repo-adjacent config: when you tune the rubric, update the prompt.

### Blocking rubric (start — tune over time)

`blocking`:
- Build fails.
- Tests fail (a previously-passing test is now red, or a new test fails).
- Lint violations on new or changed code.
- A content change without a source citation in the commit message (CLAUDE.md rule).
- `pnpm walkthrough` does not reach "All caught up" (the app is actually broken in a way a guest experiences).
- Any finding the rubric explicitly classifies as blocking (extensible — add here as rules crystallize).

`advisory`:
- Naming/style niceties.
- DRY opportunities, potential edge cases.
- "This could be clearer."
- Non-blocking warnings from lint/test output.
- Any judgment call that is not a rule violation.

The boundary is the rubric. The agents **apply** the rubric; you **define and tune** it.
"Leave it to agents" means you trust the rubric enough to let it block merges; you do not
mean agents invent blocking criteria ad hoc on each PR.

### Why two agents

Independent judgment — Claude and Codex catch different things. The verdict fails on a
blocking finding from **either**, but "blocking" is defined by the rubric, so the
strictness is controlled by the rubric, not by which agent fires. If you'd rather one
agent per review, the architecture doesn't change — just which calls are made.

### Hard parts

- **Existing accounts, no new API spend**: you already have Claude and Codex accounts.
  Both CLIs run headlessly/non-interactively with your existing auth — no API tokens
  to provision, no new billing. The review cost is whatever your accounts already
  charge for the prompts; budget it like any other Claude/Codex use.
- **Context size**: CLAUDE.md + roadmap + relevant plan files + diff + gate outputs +
  walkthrough output is a lot. The "include a plan file only if its domain is in the
  diff" rule keeps it bounded, but large content diffs still cost. If context exceeds a
  window, the implementation should chunk or trim — decide during build.
- **Walkthrough on the local machine**: the walkthrough already runs locally via
  `pnpm walkthrough`. No runner provisioning needed. First run may need
  `pnpm exec playwright install chromium` (the walkthrough script already handles this).
- **Hermes hook reliability**: the review runs via a shell hook on `on_session_start`.
  If the hook fails to fire or fails mid-run, the session starts without a review. The
  combined JSON is the record; if it's absent, the review didn't run. You can also run
  the review script directly: `~/.hermes/agent-hooks/aburungo-session-review.sh`.

### What it doesn't catch

Subtle behavioural bugs with no clear failing assertion, performance, security beyond
what the agent can infer from source. Out of scope for an automated reviewer; those
belong to a human review or a dedicated audit.

---

## Layer 2 — Japanese content verification + open eval

### What it is

Two automated checks that run on PRs (or locally) and cover the Japanese-language
side of the app:
- **2a — Structural / rule audit**: rule compliance, provenance, scope, JLPT,
  access tier, source citation. Blocking candidate.
- **2b — Naturalness review**: does the Japanese read as something a person would
  actually say or write? Advisory only, flag for human.
- **Open eval**: a one-line `pnpm open-eval` that runs an LLM-judge harness over a
  fixed set of evals against a Claude-hosted MCP server. Separate from 2a/2b;
  covers generic capability regressions, not content-specific rules.

### Trigger

`pull_request` **when content changes**. Detect via the diff — if the diff touches
`src/content/` (or the content manifest), the layer fires. If the PR is only
frontend/server code with no content change, this layer skips.

For local runs, `pnpm open-eval` is a standalone command; the content audit
(`scripts/aburungo-content-audit.py`) runs on demand or via the Layer 1 hook. The
2b naturalness review runs via the same CLI agents as Layer 1 when content changes.

### What the agent knows

- The book ladder (`docs/book-*-ladder.md` = `pnpm ladder` output) — the
  progression of what's been taught per position.
- The content model (`src/content/` — books, units, lessons, items) and the
  access/tier rules (`src/content/access.ts`, `TIER_BOOK_LIMIT`).
- The source rules: JMdict (JMdict for Applications, CC BY 4.0), Tatoeba (CC BY 2.0
  FR), KANJIDIC2/KanjiAPI.dev (CC BY-SA 4.0), KRADFILE (CC BY-SA 3.0), KanjiVG (CC
  BY-SA 3.0).
- The JLPT rules and content-source rules from CLAUDE.md.
- The citation rule from CLAUDE.md.
- The seed data: `server/data/jmdict-examples-eng-3.6.2.json` is present locally (122
  MB) but too large to commit to GitHub (GitHub rejects files >100 MB), so it stays
  local and is gitignored. Provenance verification is realistic in principle (the
  scripts already read the file), but CI can't run it without the file — see the index
  approach below.

### Two sub-layers

#### 2a — Structural / rule audit (blocking candidate)

For each Japanese item changed in the PR:

- **Source citation present** on every Japanese item (CLAUDE.md rule).
- **Source points to a real entry** — verify the citation references an actual JMdict
  entry / Tatoeba sentence / KANJIDIC2 kanji in the seed data. (Real verification, not
  format check — seed data is present locally.)
- **Scope per ladder**: the item's vocabulary / kanji / JLPT is appropriate for its
  position in the ladder. Doesn't introduce kanji/vocab the book hasn't taught yet,
  unless the lesson's job is to introduce it. The ladder gives the progression; the
  agent checks the item against what's been taught up to that point.
- **JLPT rule compliance**: N5 from training OK (with `# jlpt-source: training` mark
  until JMdict seed complete); N4+ needs verification against JMdict; marks follow the
  CLAUDE.md rules.
- **Content-source rule compliance**: N5 phrase content may be added from training
  knowledge (canonical, well-documented); N4+ new phrases must eventually be verified
  against JMdict; marked with `# content-source: training` until then.
- **Access tier fit**: the item's gate (first book that teaches it) is consistent with
  `TIER_BOOK_LIMIT` and the book ordering. No item placed past what the tier should
  reach; no orphan item that no book teaches (reads as Book One per the rule).
- **No fabricated Japanese**: every Japanese sentence comes from a verified source
  (JMdict/Tatoeba/KANJIDIC2), not composed from scratch (CLAUDE.md rule).

**Blocking findings here = real errors**: missing citation, citation to a
non-existent entry, out-of-scope content, JLPT rule violation, tier inconsistency,
fabricated sentence. Provable against the seed data and the ladder.

#### 2b — Naturalness review (advisory only, flag for human)

For each sentence/phrase in the changed lessons:

- Does the Japanese read naturally — particles, word choice, collocations, register —
  as something a person would actually say or write, given the lesson's context?
- Is it consistent with the lesson's stated topic/goal?
- Flag suspicious items with explanation, for human review.

**This is flagging, not pass/fail.** The agent posts flagged items per lesson as an
advisory comment. A human decides each.

**Why advisory only**: an LLM judging naturalness can be wrong both ways — flagging
natural sentences as off, or missing genuinely awkward ones. For a language-learning
app, both failure modes hurt learners. The output is "here are the candidates worth a
human look," not "this passes/fails the naturalness bar."

### Open eval (`pnpm open-eval`)

A thin wrapper around an LLM-judge harness: `package.json` has
`"open-eval": "npx agent-in-the-loop eval ./open-evals"`. The harness reads
`./open-evals/` and calls your Claude MCP server for judgment. The eval set lives in
`docs/open-evals/` — it is the model-calibration layer, distinct from the content
audit. Start at ~5 evals (length, classification, extraction, instruction-following,
one aburungo-specific prompt) and add more as the app's prompt surface grows.

### Context scope (as specified)

Two axes, each with its own scope:

- **Place-in-the-book context (2a)**: where the lesson sits in the chapter/book
  progression; what's been taught before it (the ladder); what the lesson's stated
  topic/goal is. 2a uses the ladder for scope — reliable, rule-based.
- **Japanese-semantics context (2b)**: does the sentence read as natural Japanese a
  person would actually say or write, given the lesson's register and intent; are
  particles, word choice, collocations, and usage plausible. 2b uses the **lesson
  context** (lesson + stated topic/goal), not the full book progression — as
  specified.

### Output

- 2a findings: blocking (if any) → job fails + comment; advisory 2a findings → comment.
- 2b findings: advisory comment only, per lesson, flagged items + why.
- Open eval: human-readable pass/fail + notes per eval.

### Trigger and scope note

Runs per-PR when content changes (lesson scope for 2b). Not a scheduled/per-book audit
— tighter coupling to the change. If drift across books matters later (cross-lesson
consistency, contradictions), that's a separate scope; not in this layer as specified.

---

## Dependencies and secrets

### Layer 1

- **Local Hermes hook** (`on_session_start`), not a GitHub Actions workflow:
  `~/.hermes/agent-hooks/aburungo-session-review.sh` runs the review when you start a
  Hermes session, and skips when the tree is clean. The `pull_request` review is a later
  add-on — not in this layer.
- `pnpm jmdict check` (the content citation check) is the one part of this plan that has
  landed — `scripts/jmdict.mjs` + `data/jmdict-index.json` (PR #131, merged,
  693 citations verified, 0 bad, 106 tests). It runs as a gate in CI and as a
  source-citation check in the audit.
- Everything else in Layer 1 — Claude/Codex CLI review, combined verdict JSON, blocking
  rubric, review prompt — is still spec. Use the current text as the spec for that work.

### Layer 2

- **Seed data**: `server/data/jmdict-examples-eng-3.6.2.json` — present locally (122
  MB). Too large to commit to GitHub (GitHub rejects files >100 MB), so it stays local
  and is gitignored.
- **Index + provenance check**: the provenance verification in this layer is currently
  a spec hook, not yet wired for CI. When a CI path is needed, build a generated index
  from the seed file (building on the existing `scripts/jmdict.mjs`
  `build`/`check` path, which already validates every `JMdict seq NNNNNNN` marker
  against the seed and reports conjugation-stem mismatches using `conjugationStem` from
  `scripts/jlpt.mjs`). The raw seed file is the source of truth for the index build;
  the index is what CI and the agent consume. Today, `node scripts/jmdict.mjs check`
  reports 693 citations, 0 bad locally.
- **Source markers**: content files carry `# content-source`, `# jlpt-source`, or
  `# Source:` markers. The audit (`scripts/aburungo-content-audit.py`) accepts any of
  the three. Today it is ~60 lines, trimmed from a longer form that duplicated checks
  already covered by `pnpm test` (lesson reference integrity, JLPT consistency, ladder
  regeneration).
- **Open eval harness**: `npx agent-in-the-loop` is fetched on first `pnpm open-eval`.
  No dependency to commit — it's a dev-time npx. The eval set (`docs/open-evals/`) is
  committed.
- If a future JMdict version update lands, regenerate the index and re-run the
  provenance check.

### Shared

- Both layers are independent of the primary build agent's context. They have their own
  runs, own agent calls, own findings.
- Neither layer is a substitute for CI; both complement it.

---

## Open questions

### Layer 1

- **Blocking rubric**: the start above is the initial rubric. Tune over time — add rules
  as they crystallize, remove or re-classify as they prove too strict/lenient. The
  rubric is the control; the agents apply it.
- **One agent or two per review**: Claude + Codex both per review (independent) is the
  current design. If you'd rather one agent, the architecture doesn't change — just
  which calls are made.
- **Combined JSON vs. per-agent files**: the current design writes per-agent files plus
  a combined verdict. If you'd rather a single merged file, the assembly step changes.
- **Chunking/trimming for large diffs**: if context exceeds a window, the implementation
  should chunk or trim — not specified yet.

### Layer 2

- **2b naturalness rubric**: what counts as "flag this for human review"? Too loose →
  everything flagged; too tight → real problems slip. This is the tuning lever; not
  specified yet. Start conservative (flag clearly awkward / register-mismatched /
  implausible-usage items) and tune.
- **2a scope rule wording**: "appropriate for its position in the ladder" is the intent;
  the exact rule (e.g. "item's kanji must be in the set taught up to and including this
  lesson, unless the lesson is a kanji-intro lesson") should be written down during build
  so the agent applies it consistently.
- **Which agent(s)** for Layer 2: not yet specified. Same Claude+Codex as Layer 1, or
  one agent, or a different one — architecture doesn't change either way.
- **Open eval set size and coverage**: start at ~5 evals; what to add first? Length,
  classification, extraction, instruction-following, and one aburungo-specific prompt
  are the suggested first cut.

---

## Rollout and tuning

- **Start advisory-heavy, then tighten**: ship the rubric with more advisory than
  blocking at first; watch false positives on real PRs; promote findings to blocking as
  they prove reliable. Don't start maximally strict — that breaks real PRs and teaches
  you nothing about which rules actually matter.
- **Read the first few reviews yourself**: before trusting the layer to block merges,
  read the first several reviews and the blocking decisions. Tune the rubric to match
  your judgment. The agent is the mechanism; you are the standard.
- **Layer 1 first, Layer 2 second**: Layer 1 has no precondition and is the more clearly
  scopable one. Layer 2 depends on the seed data being present locally (confirmed) and
  the 2b rubric being written down. Build Layer 1, then Layer 2.
- **Treat 2b as flagging forever**: don't promote naturalness flagging to auto-block,
  even as the model improves. The risk profile (both error directions hurt learners)
  stays. If you want a naturalness gate later, it's a human-gated step, not an auto-block.
- **Open eval early, add slow**: ship the harness + first 5 evals early so you have a
  regression signal; add evals as the app's prompt surface grows. Don't wait for a
  "complete" eval set to ship the harness.

---

## Not in scope

- Security audit beyond what the agent can infer from source.
- Performance review.
- Cross-book drift / consistency audit (contradictions across books) — a separate scope
  if it becomes a need.
- A gate that blocks on naturalness judgment — advisory only, by design.
- Any manual checklist or skill the primary agent has to remember — these layers are
  automated, independent, and post visible artifacts.
- A GitHub Actions workflow for Layer 1 — that's a later add-on, not this layer. This
  layer is local, semi-automatic, on-session-start.
