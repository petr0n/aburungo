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

## DR-008 — Navigation layout: persistent PageShell with sidebar

**Date:** 2026-05-30
**Status:** Active

**Context:**
Each page was managing its own header and layout independently. As the number of routes
grew (practice, flashcard, kana, kanji, conversation, profile), the lack of a shared shell
produced inconsistent spacing, duplicate header markup, and no obvious place to add
cross-page features like progress stats.

Two content-width constants had also drifted — some pages used `max-w-xl` (576px) and
others used wider values, making the desktop experience inconsistent.

**Decision:**
Introduce `src/components/PageShell.tsx` as the single shared layout wrapper:
- Two-row header: row 1 = logo + account chip; row 2 = main nav tabs with active
  underline indicator.
- Max content width set to `max-w-5xl` (1024px) across all pages.
- Right sidebar column always present on desktop (lg breakpoint). Pages with sibling
  practice modes render a `SectionNav` component in the sidebar ("IN THIS SECTION"
  sub-nav). All pages will eventually show progress stats there.
- `/conversation` no longer uses `ProtectedRoute` hard-redirect for guests; instead
  shows an inline soft prompt — consistent with the product rule "soft inline prompt,
  never a hard redirect".
- `/profile` added as a public route: guests see a sign-in prompt, logged-in users see
  their progress dashboard and account info. Linked from the account chip.

**Consequences:**
- Header and nav changes now happen in one file.
- Sidebar is available as a consistent slot for future widgets (progress bars, tips,
  section links) without per-page scaffold changes.
- `max-w-5xl` gives more breathing room on tablet and desktop without breaking the
  mobile layout.
- Any route that previously relied on `ProtectedRoute` for a hard redirect must be
  audited — the convention is now always a soft inline prompt.

---

## DR-009 — Progress tracking: localStorage-first with server mirror

**Date:** 2026-05-30
**Status:** Active (design locked; implementation in progress)

**Context:**
Progress data was not being tracked in a consistent shape across phrase, kana, and kanji
modes. Guests had no persistence at all for kana. The sidebar needed a progress widget,
the profile page needed a full stats view, and the reset-controls UX required a clear
owner for the data.

Several design questions were resolved:
- Should guests get progress tracking at all? Yes — local-only, with sync as the
  incentive to sign up.
- Single localStorage key or per-feature keys? Single key with a versioned envelope,
  easier to migrate.
- What counts as "mastered" vs "reviewed/seen"? Deliberate two-threshold model: light
  fill = reviewed/seen, dark fill = mastered/recalled.

**Decision:**
Use a single localStorage key `aburungo_progress` (versioned envelope, version 1) as
the canonical store for guests. For signed-in users the same shape is mirrored to the
server via `/api/progress/stats` (extended) and a Zustand progress store that dual-writes.

Data shape:
- `phrases` — per-JLPT-tier: `reviewed`, `mastered`, `total`
- `kana` — per script per set: `correct`, `total` (aggregate); per character:
  `recognized` (threshold 3, multiple-choice mode) and `recalled` (threshold 3,
  type-romaji mode), stored in `user_kana_progress` DB table for signed-in users
- `kanji` — per-JLPT-tier: `seen`, `mastered`, `total`

Progress bar widget is two-tone (light = reviewed/seen, dark = mastered/recalled) and
context-sensitive — shows only the data relevant to the current page section.

Reset controls: per script (hiragana / katakana) + full reset, with confirmation dialog.
For signed-in users the reset wipes the corresponding `user_kana_progress` server rows.

`user_card_progress` and `user_kanji_progress` tables already exist in the schema.
`user_kana_progress` requires a new migration (not yet written).

**Consequences:**
- Guests get persistent, meaningful progress tracking immediately.
- The sync incentive (sign up to keep progress across devices) remains intact.
- `/api/progress/stats` needs extension: currently returns global counts; must return
  per-tier phrase + kanji + kana breakdowns.
- A new `user_kana_progress` migration must be written before kana tracking can be
  server-backed.
- The two-tone progress bar widget is reusable across practice, flashcard, kana, and
  kanji sidebar slots with only the data source changing.

---

*New decisions should be appended with the next DR-NNN number and today's date.*

---

## DR-010 — Vocabulary feature: words-first graduation model

**Date:** 2026-06-05
**Status:** Active

**Context:**
The app had no dedicated vocabulary section. Practice and Flashcards covered phrases and
sentences only. A learner cannot meaningfully practice phrases without a vocabulary
foundation — drilling "駅はどこですか" before knowing what 駅 means produces surface
pattern-matching, not durable retention. Research (i+1 input hypothesis) confirms that
learners retain vocabulary 3–5x longer when new items appear in context where 95–98% of
surrounding words are already known.

**Decision:**
Introduce a words-first graduation model across Practice and Flashcards:
- All users start with vocabulary words only. Phrases do not appear until the learner has
  a word foundation.
- **Free accounts:** manual toggle (Words / Phrases) — user decides when to add phrases.
  Default is Words.
- **Paid accounts:** smart unlock — a phrase enters the review queue automatically once
  the user's FSRS state for a threshold percentage (~80%) of that phrase's vocabulary
  dependencies reaches "learning" or better. No manual toggle needed; the algorithm
  surfaces phrases when the learner is ready.
- A `/words` page will be added to the nav before Kana — it is the entry point to the
  language and should appear first.

**Consequences:**
- Paid smart unlock requires a vocab → phrase dependency map: each phrase must list the
  vocabulary items it draws on. This can be authored in YAML or auto-derived via a
  server-side tokenizer (kuromoji/sudachi).
- Smart unlock requires FSRS server sync for vocabulary items to be live. The free toggle
  works without server state and can ship first.
- The `card_type: "word" | "phrase"` field must be added to the card schema to enable
  filtering in Practice and Flashcards.

---

## DR-011 — Vocabulary word card schema and content rules

**Date:** 2026-06-05
**Status:** Active

**Context:**
The existing `Card` type and deck YAML schema were designed for phrase-level content.
Vocabulary words need additional structure: word type (for browse filtering and eventual
grammar integration), verb display form, and a clear content sourcing rule.

**Decision:**

**Card schema additions:**
- `word_type`: `"noun" | "verb" | "i-adj" | "na-adj" | "adverb" | "counter" | "particle" | "expression"`
  Required for vocabulary cards; omitted for phrase cards.
- `verb_class`: `"ru" | "u" | "irregular"` — hidden data field, never displayed to the
  learner. Used by the system to auto-generate the polite form (食べます from 食べる).
  Not taught as a grammar concept until a grammar section exists.

**Verb display:**
Show both dictionary form and polite form on every verb card:
```
食べる · 食べます
to eat
```
Dictionary form is the linguistic reference standard (JMdict headword). Polite form is
what learners will actually produce in everyday speech. Showing both eliminates the
"I know the word but not how to say it politely" gap without requiring a grammar lesson.

**Content rules:**
- Primary English meaning only (no lists of 6 equivalents). Alternatives go in `notes`.
- No particles (は, が, を, etc.) as standalone vocabulary cards — they are grammar items,
  not content words, and cannot be drilled meaningfully in isolation.
- Content words only: nouns, verbs, adjectives, adverbs, counters.
- Content sourced from JMdict per existing CLAUDE.md rules. Mark N5 training-knowledge
  items with `# content-source: training` until JMdict seed verifies.

**Content organization:**
- Frequency-ordered to determine which words to include and in what priority (top
  frequency words first), filtered to content words only.
- Presented in thematic clusters as the surface structure (food words together, transport
  words together) — the ordering logic is frequency, the UI grouping is thematic.
- Same framework at all JLPT levels (no switching from frequency to thematic between
  levels).

**Consequences:**
- `verb_class` must be authored in all verb YAML entries. It is a required field for verbs
  even though it is never shown to the learner.
- The polite form is auto-generated at render time; it is not stored in the DB.
- Particle-type words in JMdict are excluded from the vocabulary section and deferred to
  a future grammar section.
- `card_type` distinguishes vocabulary cards from phrase cards in the existing `cards` table.

---

## DR-012 — Vocabulary progress mechanics and session sizing

**Date:** 2026-06-05
**Status:** Active

**Context:**
Three questions needed resolving before building the vocabulary review loop: (1) in what
order to test meaning vs. reading; (2) what constitutes "knowing" a word for the phrase
graduation system; (3) how many new words to introduce per session.

**Decision:**

**Review direction:**
Test recognition before production for every new word:
1. JP → EN (recognition): see the Japanese word, recall the English meaning. Self-rated.
   Mapped to the Flashcards mechanic.
2. EN → JP (production): see the English meaning, produce the Japanese reading. Type-in.
   Mapped to the Practice (fill-in-blank) mechanic.
A word does not enter the EN→JP queue until it has passed JP→EN at least once.

**Progress tracking:**
Correct answers feed FSRS state exclusively — no separate correct-answer counter.
"Knowing" a word for the phrase-unlock graduation system means reaching FSRS state
"review" or better, not a raw count of correct responses. This prevents short-term
memory masquerading as retention.

**Session sizing:**
- 10 new words per day cap for all tiers. Research shows spacing and retrieval frequency
  matter more than volume; more than 10–15 new words/day without proportional review time
  leads to review pile-up and learner dropout.
- The cap is per day, not per session. Multiple sessions in a day still share the 10-word
  daily limit.
- Paid users get smart word selection: instead of the next N words in sequence, the system
  prioritizes words that are vocabulary dependencies of phrases the user is close to
  unlocking. This is a meaningful quality difference, not just "more words."

**Consequences:**
- FSRS server sync for vocabulary must be live before the graduation system can function.
  The 10/day cap and review direction work without server state and can ship first.
- Smart word selection for paid users requires the vocab → phrase dependency map
  (see DR-010) and server-side readiness computation.
- The daily cap must be enforced server-side for authenticated users to prevent
  multi-device circumvention.

---

## DR-013 — Frontend on a single Vercel project; env vars are deploy-critical

**Date:** 2026-06-16
**Status:** Active

**Context:**
`aburungo.app` was returning HTTP 200 but rendering a blank page. Diagnosis revealed
two compounding issues:
1. **Two Vercel projects** were wired to the `petr0n/aburungo` repo — `aburungo-server`
   (which owns the `aburungo.app` + `www` domains) and a stray auto-named `project-hbbvq`.
   Both built identical output, causing confusion about where config belonged; an env var
   was even set on the wrong one.
2. **Missing frontend env vars.** `src/lib/supabase.ts` and `src/api/client.ts` throw at
   module load if their `VITE_*` vars are unset. The throw fires before React mounts, so
   the page is blank — which masqueraded as a "build produces a stub" problem when it was
   actually a runtime env-var problem. A separate Supabase free-tier pause was also found.

**Decision:**
- The frontend is served by exactly one Vercel project, `aburungo-server` (keep the
  misleading name — renaming risks breaking the domain/Git wiring). Delete the duplicate
  `project-hbbvq`.
- Treat the three frontend env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`,
  `VITE_API_URL`) as deploy-critical config, documented with exact values in
  `infrastructure.md` -> "Live deployment". Vite bakes them at build time, so any change
  requires a redeploy.

**Consequences:**
- A blank live page is now a documented failure mode with a checklist (env vars present
  + redeployed; Supabase not paused) rather than a multi-hour mystery.
- Single frontend project removes the "which project?" ambiguity for future config.
- The throw-on-missing-env-var behaviour is intentionally kept — it fails loud and early;
  the cost (a missing var white-screens the app) is acceptable now that it's documented.

---

## DR-014 — Dedupe React for the linked design system

**Date:** 2026-06-16
**Status:** Active

**Context:**
After the env vars were fixed, the live app threw at runtime:
`Uncaught TypeError: Cannot read properties of null (reading 'useId')`. The design system
`aburungo-design-system` is consumed via `link:../aburungo-design-system` and ships its own
`node_modules/react`. ADS components import `useId` from `react` and `jsx` from
`react/jsx-runtime`; without deduping, the bundle resolved those to ADS's React copy while
the app used its own — two React instances, null hook dispatcher, crash on first render of
any ADS component (immediate, since the landing AuthForm uses ADS `TextInput`).

**Decision:**
Add `resolve.dedupe: ['react', 'react-dom']` to `vite.config.ts` so all React imports
resolve to a single instance.

**Consequences:**
- Hooks work; ADS components render. Verified locally (dev server, clean console) and live.
- Only React *core* was duplicated (ADS never imports `react-dom`), so bundle size barely
  changed — bundle size is not a reliable signal of this bug; the runtime console is.
- Any future linked workspace package that bundles its own React is covered by the same
  dedupe entry.

---

## DR-015 — Phrase due selection: merge server FSRS into the local queue (incremental)

**Date:** 2026-06-16
**Status:** Active

**Context:**
Phrase/flashcard *reviews* already sync to the server for signed-in users (`session.rate()`
posts `submitReview`), but the *due queue* was built only from local Leitner/IndexedDB. On a
second device (empty IndexedDB) a signed-in user saw no due cards even though the server had
their full FSRS history — writes synced, the schedule did not.

The "correct" end state (per DR-001/DR-005) is: for signed-in users the server FSRS is the
sole source of truth and local Leitner is dropped. But the server `/api/progress/due` only
returns cards with a progress row that are *due now* (`getDueCards`) — it cannot tell the
client which cards are *new* (never reviewed) vs *reviewed-but-not-due*. Doing the full
migration correctly therefore needs a new server endpoint, which expands scope + a deploy.

**Decision:**
Ship the incremental, frontend-only step: in `session.initialize()`, for signed-in users
fetch `fetchDue(100)`, map server `cardId -> japanese -> item`, and **merge** those into the
due queue alongside the local-Leitner due cards (de-duped by item id). New-card detection
stays local (`!stateMap.has(id)`). Guests are unchanged.

**Consequences:**
- Primary device: behaviour is unchanged (local due already covers everything; merge adds
  nothing new). No regression.
- Second device: server-due cards now surface — the cross-device gap is closed for *due*
  cards. Reviewed-but-not-due cards may still re-appear as "new" there (same as the existing
  kanji behaviour), since the client can't yet distinguish them without a server endpoint.
- Full server-source-of-truth (drop local Leitner for signed-in users) remains a follow-up,
  gated on a server endpoint that returns the user's reviewed/new card set. Tracked in todo.md.
