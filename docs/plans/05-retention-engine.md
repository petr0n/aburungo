# Keeping It Interesting (formerly "Retention Engine")

> **Reality-checked against the built code (2026-08-20).** Every mechanism below is labelled
> **built**, **built but shelved**, or **designed, not built** — verified against `src/srs/`,
> `src/pages/LearnPage.tsx`, `src/store/`, the checkpoint components, and DR-015–DR-024. Where an
> earlier draft routed output or verification through **Hana**, the current model is **production
> checkpoints** (DR-023); the two-agent design is preserved below as shelved, not deleted. Naming
> follows DR-024: **Book → Chapter → Lesson**. Doc precedence applies — where this doc and the
> code disagree, the code wins and this doc is wrong; file an issue rather than trusting the prose.

> **Scope recalibration (important):** AburunGo is being built **primarily as a personal learning
> tool for a self-motivated learner**, not a commercial product. So this is **not** about fighting
> churn, conversion, or willingness-to-pay. The question is narrower and nicer: *how does the app
> stay genuinely engaging and effective for a motivated learner over months?* — variety, novelty,
> flow, and the real satisfaction of using Japanese. Commercial-retention concerns (re-engagement
> notifications as anti-churn, the lapse "cliff" as a churn risk, retention telemetry, pricing) are
> **out of scope**. The honest-motivation work that survives does so because it makes learning
> *better*, not because it keeps a customer.

The soul of the whole plan. The brief's #1 ask was **retention**. The hard part: the techniques
that reliably drive daily return — streaks, loss aversion, variable rewards — are exactly the
**gamification CLAUDE.md forbids**. So we have to get the *return behavior* those patterns produce
**without** the dark patterns. This doc designs that, and now also records how much of the design
the shipped engine actually implements.

---

## The tension, stated plainly

- **What drives retention (per research):** a daily habit loop (tiny trigger → small routine →
  immediate reward), loss aversion (streaks), and variable reward schedules. Duolingo is the
  master of this — and is also criticized as manipulative and "too easy."
- **What we've banned (CLAUDE.md):** no XP, hearts, badges, mascots, level-ups, manipulative
  streaks. Reward *loops* are out; honest progress tracking (SRS state, history, real streaks-as-
  information) is fine.
- **The needle to thread:** keep the *habit-forming structure* (a trigger, a small daily routine, a
  genuine reward) but make every piece **honest** — the reward is real ability, the trigger is
  informational not anxiety-inducing, and missing a day costs nothing but accumulated reviews.

## The line we're drawing (working definition)

| ❌ Manipulation (banned) | ✅ Honest motivation (allowed) |
|---|---|
| Streak you *lose* (loss aversion) | Reviews that *accumulate* (informational, like an inbox) |
| XP / points / leaderboards | Visible **mastery** of real things ("42 words you can use") |
| Guilt notifications ("Duo is sad") | Calm, opt-in reminders ("3 readings waiting when you're ready") |
| Variable-reward loot/gems | The **content itself** being the reward (you want the next reading) |
| Artificial difficulty to inflate time | i+1 difficulty tuned to *flow*, not engagement-farming |
| "Level up!" dopamine with no substance | **Can-do moments** ("you just ordered a coffee") |

**Test for any feature:** *would it still make sense if the user could see exactly how it works and
why?* If it relies on the user **not** noticing the trick, it's out.

## Where the engine actually is

The one-table truth, checked against the code. Detail in the numbered sections below.

| Mechanism | Status |
|---|---|
| Spaced repetition scheduling | **Built** — Leitner drives the daily loop (see "The scheduler, truthfully") |
| In-session format ladder (learn → produce → recognize) | **Built** — `LearnPage` steps |
| Interleaved review queue (words + phrases + grammar, by due date) | **Built** — `src/srs/dailyLoop.ts` |
| Recognition pass, misses demoted to the SRS queue | **Built** — `RecognitionPass` + `demoteMissedWord` |
| Recognition checkpoints closing each chapter (recurring) | **Built** — DR-020/021, `RecognitionCheckpoint` |
| Production checkpoint closing the book (once) | **Built** — DR-023, `ProductionCheckpoint` |
| Can-dos derived from situations seen | **Built** — DR-022, `src/srs/canDo.ts`; no checklist UI yet |
| No-debt framing: no "overdue", no backlog counts; the profile "Day streak" is informational only (sync #4) | **Built** |
| Two-agent can-do verification (Hana + assessor) | **Built but shelved** — DR-023, off behind `VITE_HANA_ENABLED` |
| Format rotation across sessions (per item) | **Designed, not built** — reviews always resurface as flashcards |
| Contextual variety (rotating example sentences) | **Designed, not built** — a word carries at most one example |
| Stability-gated i+1 unlock | **Designed, not built** — lessons unlock sequentially, unconditionally |
| Gap-return rebalancing (cap reviews, hold back new content) | **Designed, not built** — the full due set arrives |
| User-set rhythm + opt-in reminder (onboarding) | **Designed, not built** — see [06-onboarding.md](06-onboarding.md) |

### The scheduler, truthfully

The retention engine's scheduler **as built** is **Leitner**, not FSRS. `src/srs/leitner.ts` — five
boxes at 1/3/7/14/30 days, a miss drops the item to box 1 due tomorrow — schedules everything in
the `/learn` daily loop: words, phrases, and grammar patterns through one `ReviewState` shape. It
is pure (`now` is always a parameter) and the `Scheduler` interface keeps FSRS a swappable
follow-up rather than a rewrite.

For signed-in users this state is **server-durable** (DR-016/DR-018): the client computes the
schedule, `user_content_progress` stores it keyed by content id, and merge on load is
last-write-wins — so months of review history survive Safari's storage eviction, device loss, and
cross-device use. Guests are local-only and ephemeral, by accepted design.

FSRS (`ts-fsrs`) exists **server-side only**, behind the older practice/flashcard flow
(`src/store/session.ts`, `user_card_progress`), where DR-015 merges server-due cards into the
local queue for signed-in users. Full FSRS source-of-truth for signed-in users — drop local
Leitner, add a server endpoint returning the reviewed/new set — is the standing cross-cutting item
in [99-roadmap.md](99-roadmap.md). Until it lands, any claim that "FSRS powers the daily loop" is
false; Leitner's fixed intervals are a deliberate, debuggable v1 (DR-001), and its retention cost
versus FSRS is accepted.

## The four dimensions

1. **The daily-return trigger** — aspiration-pull + user-set rhythm. *Design settled (sync #1);
   the rhythm half is not built.*
2. **Progress made visible** — can-do framing plus honest gates. *Reworked by DR-022/DR-023
   (sync #2); the checklist-as-hero UI is not built.*
3. **Variety / novelty / flow** — format variety inside the session today; rotation across
   sessions designed but not built (sync #3).
4. **Pace is self-set — you can't be behind** — *substantially built* (sync #4).

~~Re-engagement notifications (anti-churn)~~ and ~~retention telemetry~~ — **dropped** (out of scope
per the recalibration; an optional gentle reminder at the user-set time, from sync #1, is enough).

## Decisions

### Sync #1 — daily-return trigger: aspiration-pull + user-set rhythm

The primary pull is a **combo**, not one mechanic:

- **Aspiration (the *why*):** the learner is always working toward a concrete, near-term **can-do
  goal** ("order food in a café"), and the app shows how close they are. The daily reason to return
  is "get closer to *doing* a real thing," not "protect a streak" or "clear a quota."
- **User-set rhythm (the *when / how much*):** during onboarding the learner sets their own
  cadence — a preferred time and a rough daily size (e.g. "~10 min, mornings"). We honor it.
- **The daily nudge** (opt-in) fires at *their* chosen time and is framed around the goal:
  *"~10 min today gets you closer to ordering food."* Calm, informational, skippable.
- **Missing a day costs nothing punitive:** the goal simply arrives later and reviews accumulate
  (handled honestly in sync #4). No streak, no guilt, no lost progress.

Why honest: passes the test — it works *better* when the user understands it (they literally set
the rhythm and the goal themselves). Reviews are surfaced as "ready," never "overdue."

The first can-do goal is assigned automatically from Book One's first lesson — no learner choice —
and subsequent goals advance with the ladder. See [06-onboarding.md](06-onboarding.md).

**Build status: the aspiration half is built; the rhythm half is not.** Every lesson carries a
can-do shown at the lesson intro and echoed on the close screen ("You worked toward: …"), and the
close screen frames the chapter as work remaining ("2 lessons to go before the checkpoint" —
shrink-to-zero, per DR-020). Onboarding, preferences, and the opt-in reminder do not exist in code:
there is no onboarding flow, no stored rhythm, and no notification of any kind. The trigger today
is entirely the learner's own habit plus the standing "Today's session" entry point.

### Sync #2 — progress made visible: can-dos, gates, and the shelved verifier

**Hero representation = a can-do checklist** of real abilities ("order food," "ask directions").
Two properties survive every revision since this was first drafted:

- **The list is derived, not declared** (DR-022). A can-do is a distinct *situation* from the
  lessons the learner has actually seen (`taughtSituations` in `src/srs/canDo.ts`), so the list
  grows with the content instead of going stale. The old fixed "19 can-dos" is gone.
- **A checkmark must be earned by demonstrated ability, not by grinding cards.** You cannot grind
  your way to a ✓ — you have to perform. This is the anti-gaming core of the whole engine.

**What performs that check today: the production checkpoint (DR-023).** Every gate before it can
be cleared by recognition; the production checkpoint that closes Book One asks the learner to
*write* items from their English — words and phrases sampled round-robin across every situation —
with misses shown, re-queued, and returned to the SRS schedule. It is a mastery gate under
DR-020's test: the only number is how many remain, it only shrinks, retries are unlimited, nothing
is recorded. Production (typed recall) is a real output lever — retrieval-with-production is
better-evidenced than recognition-only review — but it is honest to note it is not *conversation*:
no turn-taking, no comprehension under pressure. That gap is known and accepted while Hana is
shelved.

**Built but shelved: two-agent verification (DR-022, DR-023).** The full design was implemented
and tested — a **partner agent (Hana)** plays the situation in character and never breaks role to
grade, and a separate **assessor** reads the stored transcript out of band and returns verified /
"not yet", instructed to judge generously at Book One level ("コーヒー、お願いします" *is*
ordering a coffee). The separation exists so the judge can't be flattered; the assessor never
accepts a client-supplied transcript. Verified can-dos ride `PathProgress` as `can-do:<situation>`
markers. All of it sits behind `VITE_HANA_ENABLED` (default off) and is filtered off the ladder at
the content export — the owner does not want a metered per-use cost in a fixed-cost tool. **Do not
build new mechanisms that depend on it.** If it ever returns it stays paid-only, and the "adaptive
bar" idea (lenient at Book One, strict by Book Three) returns with it.

**Not built: the checklist as a UI.** No screen renders the derived can-do list outside the
shelved can-do checkpoint. Today the can-do surfaces per lesson (intro + close), and the profile
page shows honest counts (reviewed/mastered breakdowns). A read-only can-do list — situations
seen, no checkmark theater — would be a cheap, honest addition and needs no AI; whether the ✓ tier
returns depends entirely on the Hana decision.

**The reward beat, as built:** an earlier draft made "passing AI verification" the reward beat.
With Hana shelved, the honest reward beats are the ones that exist: a chapter's recognition
checkpoint emptying, the close screen naming what you worked toward, and — once per book — the
production checkpoint. These are real and earned; whether they are *enough* of a beat over months
is an open question the owner can only answer by living with it.

### Sync #3 — variety/novelty/flow: what varies today, what should

**Built — variety inside the session.** A new item is met three ways in its first sitting: taught
(learn card), produced (typed fill-in-the-blank, or a cloze for grammar patterns), then recognized
(tap the matching Japanese from a small line-up). The review queue interleaves **words, phrases,
and grammar patterns in one stream ordered by due date** (`buildDailySession`) — genuine
interleaving, not blocked practice. Checkpoints sample round-robin across themes and situations
(`roundRobinSample`), so a learner with 40 time words and 6 weather words still meets weather
early. And the recognition pass deliberately only *demotes* — a hit does not double-promote an
item that the produce step scheduled minutes earlier.

**Designed, not built — variety across sessions:**

- **Format rotation on resurfacing.** The design: an item reviewed as a flashcard this session
  comes back as fill-in-the-blank next time, never the same format twice running. The code: the
  review step *always* resurfaces words and phrases as flashcards (grammar patterns as cloze).
  The testing-effect rationale is sound — varied retrieval routes strengthen the memory more than
  a repeated identical drill — and the pieces (both card components, per-item state) already
  exist, so this is the highest-value unbuilt mechanism in this doc. The old third format in the
  rotation ("a scoped Hana phrase") is dead with DR-023; rotation is flashcard ↔ fill-blank.
- **Contextual variety.** The design: example sentences rotate on each resurfacing. The code: a
  word carries at most **one** example (`example?: WordExample`, Tatoeba-sourced). Rotating
  examples requires authoring multiple verified sentences per item first — a content cost, not an
  engine cost — so this stays designed-only until the Tatoeba pipeline makes examples cheap.
- **Stability-gated i+1 unlock.** The design: new-lesson introduction gates on SRS stability of
  prerequisite items. The code: `buildDailySession` serves the next unseen lesson
  **unconditionally** — the sequence itself is the only gate, nothing consults review state, and
  nothing stops a learner from taking several lessons in one day. What keeps this honest today is
  lesson sizing (the ~7.5-words-per-lesson pacing target, DR-019) rather than any readiness check.

**Cross-cutting principle (applies to all dimensions, and holds in the built app):** every flow is
frictionless. The app makes all sequencing and format decisions invisibly — there is nothing to
configure and nothing to choose mid-session. (Onboarding's three preference questions, when built,
are the only planned exception, set once and changeable in settings.)

### Sync #4 — pace is self-set: you can never be behind

AburunGo has no fixed schedule. There is no "overdue." You pick up exactly where you left off,
whether that's tomorrow or three weeks from now. **This dimension is substantially built.**

- **No debt framing — built.** No UI shows a backlog count of pending reviews anywhere. The word
  "overdue" appears nowhere. The only queue numbers are in-session position ("Review · 3 / 7"),
  which shrinks as you work, and the empty state is "All caught up!". The close screen reflects
  ("Reviewed 7 item(s)"), never grades.
- **Gap = no penalty — built.** A break of any length costs nothing. Due items surface
  oldest-due-first when the learner returns; a miss costs one box reset (back to box 1, due
  tomorrow), which is the schedule doing its job, not a punishment.
- **Automatic rebalancing — designed, not built.** The design: after a long gap, weight the
  session toward review and hold back new content, presented as a normal session. The code:
  `buildDailySession` returns **everything** due plus the next lesson — no cap on the review
  step, and the new lesson still follows it. After a long break this makes one heavy session
  rather than a quietly rebalanced one. A review cap with new-lesson holdback is the second most
  valuable unbuilt mechanism here (after format rotation), and the fix lives in one pure function.
- **No streak *mechanics* — built, with one honest footnote.** Nothing to lose, no reward loop,
  no consistency requirement anywhere in the engine. The profile page does display an
  informational "Day streak" count alongside review totals — permitted by CLAUDE.md as progress
  tracking (streaks-as-information), and it drives nothing: no feature reads it, nothing resets
  visibly, no notification defends it. If it ever grows teeth (a freeze, a nudge, a celebration),
  it crosses the line this doc draws and comes out.

---

*Sources & rationale: see [00-research-foundations.md](00-research-foundations.md) §1 (lever 7,
habit) and §4 (no-gamification constraint). Decision trail: DR-015/016/018 (state durability),
DR-019 (pacing), DR-020 (gates not grades), DR-021 (checkpoint cadence), DR-022 (derived can-dos,
two-agent design), DR-023 (Hana shelved; production checkpoint), DR-024 (Book → Chapter → Lesson).*
