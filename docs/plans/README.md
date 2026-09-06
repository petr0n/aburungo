# AburunGo — Learning Plans Index

**Start with the [roadmap](99-roadmap.md)** for current implementation status, priorities, and
open decisions. This page is a directory of detailed plans, not a separate status ledger.

Research-grounded plan turning AburunGo's buckets (words, characters, phrases, flashcards, audio)
into retention-optimised **learning paths**, without replacing those buckets.

**Spine:** a ladder of **Books**, each a volume of a coherent shape rather than a JLPT level
(DR-033), all running one shared retention engine. Emphasis shifts from recognition (Book One) to
production and immersion (Book Three up). Tiers gate on book order: a guest gets Book One, a free
account Books One through Four, paid gets everything.

**Naming (DR-024):** Book → Chapter → Lesson. A learner never reads "N5". "Unit" and "sweep" are
dead words. A book is a volume, not a level (DR-033) — the rule for its shape lives in
[01-overarching-plan.md](01-overarching-plan.md). The `jlpt` field survives in the data because the
coverage tooling needs it, and gates nothing.

## Documents

For future book work, follow the [shared content authoring workflow](../content-authoring.md).

| Document | Purpose |
|---|---|
| [Roadmap](99-roadmap.md) | **Single working planning entry point** |
| [Research foundations](00-research-foundations.md) | Evidence and design rationale |
| [Overarching plan](01-overarching-plan.md) | Shared learning model; see its staleness banner |
| [Book One](02-book-one.md) | Foundation requirements |
| [Book Two](03-book-two.md) | Bridge to composing sentences |
| [Reading stage](04-stage-reading.md) | Reading, mining, and output requirements |
| [Book Three bands](book-three-bands.md) | Grammar spine and detailed band briefs |
| [Fluency stage](04b-stage-fluency.md) | Later-stage requirements |
| [Book Four bands](book-four-bands.md) | Book Four scope and vocabulary policy |
| [Retention engine](05-retention-engine.md) | Scheduling, review, and session behavior |
| [Onboarding](06-onboarding.md) | Proposed first-session preferences |
| [Old N5 unit map](02b-n5-units.md) | Historical; superseded by generated book maps |
| [Session UI prompt](07-session-loop-ui-prompt.md) | Historical implementation prompt |

Actual course inventories live in the generated `docs/book-*-ladder.md` files and the `bookmap/`
SPA. See the roadmap for how implementation evidence, requirements, and decisions relate.
Status claims within older detailed plans are being reconciled one topic at a time.

## Decisions locked

- **Q1 — Spine:** a ladder of books, each a volume rather than a JLPT level (DR-033).
- **Q2 — Session model:** guided default plus free roam. One "Today's session" button; nothing
  locked away.
- **Q3 — Content sourcing:** training-canonical marked content through Book Two; verified only
  (Tatoeba) from Book Three.
- **Q4 — First build:** the Book One guided daily loop on existing content. **Done.**

## What has changed since these docs were first written

Five decisions reshaped the plans and are reflected in the rewritten path docs:

- **DR-021** — checkpoints run on a cadence at situation boundaries, not at a declared "mid-way".
- **DR-020** — mastery gates are allowed, grades are not. A number that shrinks to zero is a gate;
  one that stands is a verdict.
- **DR-022** — the can-do list is derived from the situations a learner has seen, not declared. The
  fixed list of 19 is gone.
- **DR-023** — **Hana is shelved.** Every path doc originally routed production practice through
  Hana; all of them now route it through production checkpoints instead. Do not plan work that
  depends on Hana without asking.
- **DR-033** — **a book is a volume, not a JLPT level.** About ten chapters of about ten teaching
  lessons, ending where an arc of situations ends. Difficulty rides on a stage the book declares,
  and tiers gate on book order. See *What a book is* in
  [01-overarching-plan.md](01-overarching-plan.md).
