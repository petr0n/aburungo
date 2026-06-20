# The Honest-Retention Engine

> **Status: collaborative design in progress.** This doc is being worked out *together*, not
> written solo. Sections marked 🟡 are open and get filled as we sync, one decision at a time.

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

1. 🟡 **The daily-return trigger** — what *honestly* makes someone open the app tomorrow, with no
   streak to protect? (Sync #1 — in progress.)
2. 🟡 **Progress made visible** — how we show "you're getting better" using only real signals
   (mastery counts, can-do unlocks, comprehensible-% of a target text) and never points.
3. 🟡 **The reward beat** — the genuine "that felt good" moment at the end of a session.
4. 🟡 **Re-engagement** — notifications/reminders philosophy: kind and informational, never guilt.
5. 🟡 **Handling lapses** — what happens after a week away (the "200 reviews" cliff that kills SRS
   apps) — so coming back feels welcoming, not punishing.
6. 🟡 **Measuring it** — how we *know* it's working without creepy surveillance (ties to doc #9 idea).

## Decisions (filled as we sync)

*(none yet)*

---

*Sources & rationale: see [00-research-foundations.md](00-research-foundations.md) §1 (lever 7,
habit) and §4 (no-gamification constraint).*
