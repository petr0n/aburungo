# Keeping It Interesting (formerly "Retention Engine")

> **Scope recalibration (important):** AburunGo is being built **primarily as a personal learning
> tool for a self-motivated learner**, not a commercial product. So this is **not** about fighting
> churn, conversion, or willingness-to-pay. The question is narrower and nicer: *how does the app
> stay genuinely engaging and effective for a motivated learner over months?* — variety, novelty,
> flow, and the real satisfaction of using Japanese. Commercial-retention concerns (re-engagement
> notifications as anti-churn, the lapse "cliff" as a churn risk, retention telemetry, pricing) are
> **out of scope**. The honest-motivation work that survives does so because it makes learning
> *better*, not because it keeps a customer.

> **Status: collaborative design in progress.** Worked out *together*, not solo. 🟡 = open.

The soul of the whole plan. The brief's #1 ask was **retention**. The hard part: the techniques
that reliably drive daily return — streaks, loss aversion, variable rewards — are exactly the
**gamification CLAUDE.md forbids**. So we have to get the *return behavior* those patterns produce
**without** the dark patterns. This doc designs that.

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

## The dimensions we need to design (our sync agenda)

1. ✅ **The daily-return trigger** — **resolved (sync #1):** a combo of **aspiration-pull +
   user-set rhythm** (see Decisions below).
2. ✅ **Progress made visible** — **resolved (sync #2):** the **can-do checklist** is the hero,
   and a ✓ is **AI-verified** by a two-agent setup (see Decisions). Mastery counts support it on the
   profile; comprehensible-% arrives at N3.
3. ✅ **The reward beat** — **substantially resolved:** passing the AI can-do verification *is* the
   reward beat ("I actually did it"). Honest, earned, situational. Revisit only for micro-rewards
   inside a normal (non-verification) session.
4. 🟢 **Variety / novelty / flow** — *the real lever for a solo motivated learner.* How the app
   stays fresh over months: rotating activities (not the same drill daily), new + surprising
   content, the right challenge (i+1 flow), content the learner actually cares about, and
   genuinely fun Hana conversations. **This is now the priority open dimension.** (Sync #3 next.)
5. 🟢 **Don't make it a chore** — *reframed from the "lapse cliff."* Not about churn — about
   self-respect of the learner's time/interest: after a break, coming back to 200 piled-up reviews
   is miserable for anyone, including you. Sensible review-load management (caps, catch-up,
   "what matters most today") so the tool never feels like a punishing backlog.

~~Re-engagement notifications (anti-churn)~~ and ~~retention telemetry~~ — **dropped** (out of scope
per the recalibration; an optional gentle reminder at the user-set time, from sync #1, is enough).

## Decisions (filled as we sync)

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
  (handled honestly in dimension 5). No streak, no guilt, no lost progress.

Why honest: passes the test — it works *better* when the user understands it (they literally set
the rhythm and the goal themselves). Reviews are surfaced as "ready," never "overdue."

**Open thread for later:** *where the goal comes from* — does the learner explicitly pick a can-do
goal, or does the app surface the next can-do from the ladder automatically? Defer to the
**onboarding** pass (refinement #2), since that's where the first goal gets set.

### Sync #2 — progress hero: the AI-verified can-do checklist

**Hero representation = a can-do checklist** of real abilities ("order food," "ask directions,"
"check into a hotel"). But the key idea (the owner's): a checkmark must be **earned by demonstrated
ability, not by grinding cards** — otherwise it's dishonest. So progress is **two-tier**:

| State | Earned by | Means |
|---|---|---|
| **Learned** | SRS mastery of the can-do's underlying items (automatic) | "You know the pieces — *ready to attempt*" |
| **Can-do ✓** | **AI verification** of an actual performance | "You *did* it" — the real checkmark |

You **cannot grind your way to a ✓** — you have to perform. This is the anti-gaming mechanism and
the honest core of the whole engine.

**Verification = two AI agents (deliberately separated so the judge can't be flattered):**

- **Partner agent (Hana)** — plays the situation in character (the waiter, the clerk), supportive,
  rooting for the learner, never breaks role to grade.
- **Assessor agent** — impartial examiner. Reads the transcript, judges it against the **adaptive
  rubric** for that can-do + level, returns ✓ / "not yet" + specific, honest, kind feedback. It has
  no incentive to be nice, which is what makes the ✓ trustworthy.

**Adaptive bar (sync, this dimension):** lenient early → strict later. **N5** = a one-word success
counts ("you communicated — ✓"); by **N3** the bar is "this would actually work with a real
Japanese person." Matches the ladder's recognition→production emphasis shift.

**On-brand check:** this is situational *performance* ("you're at a café, order something"), never a
quiz or exam — stays out of test-prep land (see overarching plan's core principle).

**Cost:** verification is a deliberate **milestone** the learner attempts when ready (not every
session), so the extra assessor call is bounded. Full sizing in the Hana-cost pass (refinement #4).

**North-star (not now): the Coach agent.** A persistent AI tutor that knows the learner's history,
decides readiness, picks the next can-do, remembers weak spots, and personalizes the path —
orchestrating partner + assessor. Biggest differentiator ("AI sensei") but the biggest build +
ongoing cost; revisit as a later phase once the loop is proven. Two-agent verification ships first.

This one mechanic does triple duty: it's the **progress hero** (dim 2), the **reward beat** (dim 3),
and it reinforces the **aspiration trigger** (dim 1, "you're ready to attempt X").

---

*Sources & rationale: see [00-research-foundations.md](00-research-foundations.md) §1 (lever 7,
habit) and §4 (no-gamification constraint).*
