# AburunGo UI — Design System Agent Brief

Hand the whole of this file to an agent working in the **AburunGo design system repo**
(`aburungo-design-system`, linked into the app as `link:../aburungo-design-system`).

Rewritten 2026-08-07. The original version of this file described the N5 session loop as
unbuilt; it shipped in PR #47 and has been extended since. What follows is current.

---

You are working in the AburunGo design system repo (ADS). Your job is the learner-facing UI
for a practical Japanese learning app. Read `docs/design-direction.md`, `DESIGN.md`, and the
existing components in `src/components/` before starting. **Reuse before you build** — the
app is a solo project and every new component is one more thing to keep alive.

## Brand

Calm, precise, adult. "Serious object, lively mind" — a Muji notebook or a Leica, with an
editorial voice on top: sharp pull quotes, intelligent captions, satisfying progress language.
Playfulness lives in copy and small accents, never in structure. No gamification, no mascots,
no confetti.

---

## What already exists

**In ADS** (`src/components/`): `Button`, `TextInput`, `Card` (+Header/Body/Footer), `Badge`,
`IconButton`, `PhraseCard`, `KanaGrid`, `ProgressBar`, `AudioButton`, `AppHeader`,
`LoadingPlaceholder`, `EmptyState`, `ErrorState`, `ScoreCard`, `FlipCard`, `KanaKeyboard`,
`VoiceInput`, `FillInput`, `Maru`, `AnswerResult`. Tokens in `src/tokens.css`, brand classes
in `src/brand.css`.

`Maru` and `AnswerResult` are the app's **correctness vocabulary**, landed 2026-08-06. Every
new feedback surface should be built on them rather than inventing a second visual language
for the same idea. Check the approved verdict wording already committed to this repo before
writing any new result copy.

**In the app**: the guided daily session lives at `/learn` (`src/pages/LearnPage.tsx`) with
steps `review → new-unit → produce → recognition → close`. Content is 232 N5 words, 87
phrases, 29 grammar patterns, 35 units, all in YAML. FSRS scheduling, kana practice, kanji
browse/drill, and a streamed Hana conversation screen are all live.

---

## Task 0 — the highest-value thing, do this first

**`LearnPage.tsx` is 518 lines of hand-rolled Tailwind that reimplements ADS.** It builds
cards as `rounded-2xl border border-border bg-surface p-4` and buttons as
`min-h-[52px] w-full rounded-2xl bg-brand-600 ... active:bg-brand-700`, inline, in five
separate step components. That is `Card` and `Button` retyped by hand.

Before designing anything new: audit that file against the ADS surface and report what it
should be importing. If a step needs something ADS genuinely lacks, that gap is a real
component request — but most of it is not. This is the single biggest return available and
it removes code rather than adding it.

---

## Unbuilt flows, in priority order

### 1. Checkpoint / two-agent verification (blocks ladder units 37-38)

The app's central honesty mechanism, specced in `docs/plans/05-retention-engine.md` sync #2.
Progress is **two-tier** and you cannot grind your way to the second tier:

| State | Earned by | Means |
|---|---|---|
| **Learned** | SRS mastery of the underlying items, automatic | "You know the pieces — ready to attempt" |
| **Can-do ✓** | AI verification of an actual performance | "You did it" |

Verification is two separated agents: **Hana** plays the situation in character (waiter,
clerk), supportive, never breaks role to grade; an **assessor** reads the transcript and
returns ✓ or "not yet" with specific, kind feedback. The bar is adaptive — at N5 a one-word
success counts.

**Design needed:** the in-character exchange (reuse the existing conversation pattern), and a
**verdict surface** that is honest without being punitive. "Not yet" must read as a real,
informative answer — not a failure state, not a soft lie. This is the hardest copy and
feedback problem in the app and it is where `AnswerResult` may need to grow.

### 2. Can-do checklist — the progress hero

A checklist of real abilities ("order food," "ask directions," "check into a hotel") carrying
the two states above. Nothing in the app renders this today; `Unit.canDo` exists in the
content YAML and is shown only as one line on the close screen. This is meant to be the
app's primary progress representation, replacing nothing — the existing `ProgressWidget`
counts items, which is a different and lesser thing.

Needs a distinct visual difference between "ready to attempt" and "verified," and a
**milestone moment** when one is earned: a pull-quote-style editorial card, per the brand
direction. Not a celebration.

### 3. Onboarding

Full spec in `docs/plans/06-onboarding.md`. Welcome screen (one line, one CTA), then three
questions presented **one at a time, not as a form**, each with 2–3 tile options:

- intensity — casual / intermediate / challenging
- end-of-session check — yes / no (a recognition pass, never called a quiz)
- session length — short / medium / long

Then the first can-do goal is revealed as *a moment, not a screen*, and the session starts.
No account required. Needs a choice-tile component and a single-question step frame; ADS has
neither.

### 4. Integrate step — the missing screen

The session loop was specced with an **integrate** beat between new-unit and produce; it was
never built. Three stages by ladder position: kana tiles assembling into a word (early N5),
the new word inside a 2–3 word phrase (mid), the phrase inside a cloze sentence (late).
Design all three states.

### 5. Settings

The four onboarding preferences are meant to be editable at any time, plus an opt-in daily
nudge at a user-chosen time. There is no settings page — `ProfilePage` holds stats and a kana
reset only.

### 6. Kanji mnemonic moment

Currently a bare 56px bordered box per kanji on the unit intro. The plan calls for the kanji's
components labeled with a mnemonic beneath — a small visual moment. Note this is scheduled
last in the roadmap and one decision is still open (author mnemonics vs. license a set), so
treat it as exploratory.

### 7. Time-grid unit presentation

DR-019 extends the ladder to 40 units. Units 39-40 teach time expressions as a **grid** —
先/今/来/毎 crossed with 週/月/年 — so the learner acquires two axes rather than twelve words,
with 去年 (not 先年) as the single irregularity taught as the exception. A word-list layout
would throw away the whole point. This may warrant a genuine grid component; `KanaGrid` is
the nearest existing precedent.

---

## Hard constraints

These come from the app's `CLAUDE.md` and are not negotiable design preferences.

- **No gamification.** No XP, hearts, badges, mascots, level-ups, streaks. Progress state is
  fine; reward loops are not.
- **Scores are reflection, not judgment.** A momentary snapshot ("7 recalled") is allowed. No
  percentages, no pass/fail framing, no persistent grade. What needs work is signalled by what
  the SRS surfaces next, not by a number.
- **No exams or drills.** The app never tells a learner they failed.
- **Vocabulary:** "recalled" not "correct," "worth another look" not "missed."
- **No debt framing.** Never show a count of pending or overdue reviews. Reviews are "ready."
  A gap of any length costs nothing.
- **Mobile-first.** Touch targets ≥44px. No hover-only affordances.
- **ADS components are stateless.** The app owns every stateful adapter. This is the standing
  architectural decision that keeps ADS portable and testable in isolation.
- Use the tokens. No new raw hex values.

---

## Reading list for the agent

In the app repo (`aburungo`):

- `docs/plans/01-overarching-plan.md` — the engine: Level → Unit → Item, Recognize → Recall →
  Produce, where the levers sit
- `docs/plans/05-retention-engine.md` — can-do checklist, two-agent verification, format
  rotation, self-set pace
- `docs/plans/06-onboarding.md` — the three questions, verbatim
- `docs/plans/99-roadmap.md` — phase sequencing
- `docs/decision-records.md` — DR-008 (navigation shell), DR-010/011/012 (vocabulary model,
  card schema, session sizing), DR-019 (ladder extension to 40 units, the two checkpoints,
  and the time grid)
- `src/pages/LearnPage.tsx` — what the loop actually is today
- `src/components/` — the app-side components that would consume anything you build

## Return path

Shipping a component back into the app is covered by the `handoff-to-app` skill. Follow it
rather than improvising the integration.
