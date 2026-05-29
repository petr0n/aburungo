# Decision Records

Architecture and product decisions for AburunGo, logged in the order they were made.
Format: context → decision → consequences. Each record is permanent — superseded decisions
are marked but not deleted, so the reasoning trail is preserved.

---

## DR-001 — SRS algorithm: Leitner for V1, FSRS when server is live

**Date:** 2026-05 (initial build)
**Status:** Active

**Context:**
The app needed a spaced repetition scheduler from day one, but the server-backed FSRS
pipeline (ts-fsrs + Postgres progress tables) wasn't built yet. Two options: block on the
full FSRS implementation, or ship something simpler that the interface could swap out later.

**Decision:**
Use Leitner boxes (5 levels, configurable day intervals) for the local/guest session.
The `Scheduler` interface in `src/types.ts` was kept stable so the algorithm is a
single-file swap. The server schema uses FSRS columns (`stability`, `difficulty`,
`due_at`, `reps`) ready for when the server is deployed.

**Consequences:**
- Guests get a working SRS immediately, without any server.
- Leitner is less accurate than FSRS for long-term retention — this is an acceptable
  trade-off for V1 simplicity.
- Migration path: once the Hono server is live, authenticated sessions switch to
  server-backed FSRS; guest sessions stay on Leitner locally.

---

## DR-002 — Admin auth: Supabase `app_metadata.role`

**Date:** 2026-05 (initial build)
**Status:** Active

**Context:**
The admin dashboard needs to distinguish admin users from regular users. Options considered:
a separate `admins` table, a `profiles` table with a role column, or Supabase's built-in
`app_metadata` (server-set JWT claims).

**Decision:**
Use `app_metadata.role = "admin"` set via Supabase service role. This field is only writable
by the service role (never by client-side calls), is included in every JWT, and requires no
extra DB table or join. The Hono middleware reads it directly from the verified JWT.

**Consequences:**
- Admin role assignment requires Supabase dashboard or service-role API call — no
  self-service elevation possible, which is the desired security posture.
- Role is available in every authenticated request without an extra DB lookup.
- If finer-grained roles are needed later (e.g. "content editor"), `app_metadata` can
  hold an array; no schema change required.

---

## DR-003 — Guest-first access model

**Date:** 2026-05-28
**Status:** Active

**Context:**
The original app required a login for all learning interaction. This created a friction wall
before a new user had experienced any value. The goal of the app is to help people learn
practical Japanese — that is undermined if the first thing they see is a sign-up form.

**Decision:**
Remove the auth wall from all learning routes (`/practice`, `/flashcard`, `/kana`, `/kanji`,
`/how-to`). Any visitor can start learning immediately with no account. Auth is only required
for Conversation with Hana (paid Anthropic API cost) and the admin dashboard.

The landing page CTA was redesigned to lead with "Start learning — it's free" rather than
an auth form. The auth form remains below the fold for returning users.

**Consequences:**
- New users experience the core loop (fill-in-blank, flashcards, kana) before committing.
- Local progress is stored in IndexedDB — it persists across sessions on the same device
  but is not synced. Sync is an incentive to create a free account.
- The session store was rewritten to use local YAML + IndexedDB + Leitner, removing the
  dependency on the Hono server API that wasn't yet deployed.

---

## DR-004 — JLPT-based content tiering

**Date:** 2026-05-28
**Status:** Active

**Context:**
With guest access enabled, we needed a content boundary that:
1. Gives guests enough content to experience real value.
2. Creates a clear, meaningful incentive to sign up or pay.
3. Aligns with a standard that Japanese learners already understand.
4. Maps naturally to the data sources we use (JMdict has JLPT classifications built in).

Three schemes were considered:
- **Scenario-level** (e.g. transit = free, restaurant = paid) — arbitrary, hard to explain.
- **Session depth** (first N cards free, then a gate) — common but interrupts flow mid-session.
- **JLPT levels** — standard, learner-understood, aligned with JMdict data.

**Decision:**
Use JLPT levels as the tier boundary:
- **Guest (no account):** N5 content across all modes.
- **Free account:** N5 + N4.
- **Paid:** N3, N2, N1 + Conversation with Hana.

Kana practice (hiragana/katakana) is always fully free — it is pre-JLPT and prerequisite
to all levels. Gating it would be counterproductive.

Conversation with Hana is paid-only regardless of JLPT level, because every session
incurs Anthropic API cost.

**Consequences:**
- N5 is ~800 vocabulary words — substantial enough for real travel utility (greetings,
  transit, shopping, hotels, restaurants, directions). Guests get a complete experience,
  not a teaser.
- JLPT levels are a recognized benchmark; users immediately understand what "N4 unlocked"
  means for their learning progression.
- JMdict JLPT data will automatically populate the `jlpt` field on `Phrase` when the seed
  script is built — no manual re-tagging needed.
- The `UserTier` type and `phrasesForTier()` helper are the single place to change if the
  tier boundaries are ever adjusted.

---

## DR-005 — Local YAML + IndexedDB as the primary phrase backend

**Date:** 2026-05-28
**Status:** Active

**Context:**
The session store was originally written to fetch phrases from the Hono API server, which
had not yet been deployed. This meant the fill-in-blank and flashcard screens always errored
in production for all users, even after removing the auth wall.

Meanwhile, the infrastructure to run locally was already present:
- `src/content/phrases/*.yaml` — hand-authored, validated phrase content
- `src/db/reviewStore.ts` — Dexie IndexedDB persistence for `ReviewState`
- `src/srs/leitner.ts` — pure Leitner scheduler

**Decision:**
Rewrite the session store to use local YAML + IndexedDB + Leitner as the primary backend.
The server API is retained as the target for authenticated progress sync (when the server
is deployed), but it is not required for the app to function.

The `Phrase` type replaces `Card` in the session flow. `Card` is kept in `src/types.ts`
for the future server integration.

**Consequences:**
- The app works end-to-end for guests and logged-in users with no server running.
- Progress is per-device until server sync is added — an acceptable V1 trade-off.
- When the server is deployed, authenticated sessions can dual-write (IndexedDB + API)
  to give offline resilience and cross-device sync simultaneously.
- The `Scheduler` interface remains stable, so swapping Leitner → FSRS in the local
  session is a localized change.

---

## DR-006 — Content rule relaxation for JLPT classification

**Date:** 2026-05-28
**Status:** Active (supersedes original "no training data" blanket rule)

**Context:**
CLAUDE.md originally had a blanket rule: "Do not write Japanese phrases, sentences, or
vocabulary from memory or training data." This was correct for novel sentence composition
but was too broad — it also blocked JLPT level assignments and prevented adding well-known
N5 vocabulary without first completing the JMdict seed pipeline (which is not yet built).

The original intent was to prevent incorrect Japanese content from being fabricated.
That risk is real for novel sentences but not for JLPT level metadata or for vocabulary
that appears canonically in every Japanese learning reference.

**Decision:**
Split the rule into two:
1. **No fabricated sentences** — the original prohibition stays. Novel Japanese phrases
   or sentences must come from JMdict/Tatoeba/KANJIDIC2. This protects against incorrect
   grammar or unnatural phrasing.
2. **JLPT classification from training knowledge is permitted** for existing phrases and
   well-established N5/N4 vocabulary. Mark with `# jlpt-source: training` in YAML until
   the JMdict seed verifies the classification. N5 phrase content may also be added from
   training knowledge with `# content-source: training`.

The JMdict seed, when built, will serve as the verification pass that removes these
caveats from the YAML.

**Consequences:**
- N5 content can be expanded immediately without blocking on the JMdict seed pipeline.
- The caveats in the YAML provide an explicit audit trail of what needs verification.
- The sentence-fabrication prohibition remains intact — the most important safety guardrail.

---

## DR-007 — Vercel: inline installCommand over script file

**Date:** 2026-05-27
**Status:** Active

**Context:**
The app uses `link:../aburungo-design-system` in `package.json`, which requires the ADS
sibling repo to be present before `pnpm install` runs. On Vercel, only the app repo is
checked out. Two approaches were tried:

1. A `scripts/vercel-install.sh` shell script — committed, but Vercel's build cache
   restored stale state where the scripts directory didn't exist, causing `bash:
   scripts/vercel-install.sh: No such file or directory`.
2. Inline `installCommand` in `vercel.json`.

**Decision:**
Use an inline `installCommand` in `vercel.json` that:
- Installs pnpm 11 via `npm i -g pnpm@11.1.3` (Vercel's bundled pnpm is older and
  cannot read the pnpm 11 lockfile format).
- Prepends `$(npm config get prefix)/bin` to PATH (replaces deprecated `npm bin -g`).
- Clones ADS as a sibling repo.
- Builds ADS so its `dist/` is present when the app imports from it.
- Runs `pnpm install --frozen-lockfile`.

The command was kept to 237 characters, under Vercel's 256-character schema limit.

**Consequences:**
- No external script file needed — the install logic is self-contained in `vercel.json`
  and is immune to build cache stale-file issues.
- If the ADS repo URL or branch changes, `vercel.json` is the single place to update.
- The 256-character limit means significant refactoring of the command requires
  re-evaluating whether a script file approach (with cache busting) is worth revisiting.

---

*New decisions should be appended with the next DR-NNN number and today's date.*
