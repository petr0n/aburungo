# AburunGo — Roadmap

**Start here for project planning.** This is the single working entry point for build status,
priorities, and unresolved decisions across the app. Detailed requirements stay in the linked
plans and specs; decision records preserve why an agreed direction changed.

**Last reconciled:** 2026-09-06, against repository commit `6714ab4`. This is a code inventory,
not confirmation of production deployment or end-to-end verification. Update the relevant row
and its evidence when work changes; do not maintain competing status lists elsewhere.

## Product direction

**Personal use first; public commercial product intended if it proves effective (DR-037).**
The owner is building AburunGo to learn Japanese now, with the intention of developing it into
an app for other learners that generates revenue. Current personal use is a validation phase,
not a permanent restriction to a private or noncommercial tool.

Keep the current focus on learning quality and reliable progress. Plan a future public/commercial
iteration once the experience proves useful, including validation with other learners, onboarding
and support, account/data lifecycle, operational readiness, content rights for distribution,
and sustainable pricing and service costs. These are future planning topics, not an immediate
implementation checklist or newly settled launch requirements.

No launch date, pricing, billing provider, or final business model is set here. Existing tier
plans remain working requirements until explicitly revised. No-gamification and honest-progress
principles continue to apply. Hana remains shelved under DR-023; a commercial future does not
by itself re-enable a metered feature.

## Current work — reconcile the plans together

We are reviewing the project assessment discussed in this conversation one finding at a
time. Some discrepancies reflect intentional changes; others need correction or clarification.
The assessment records findings and recommendations, **not approved product decisions**. Its
repository snapshot predates the partial Book Four registration now present in code.

For each point: explain the behavior and discrepancy, agree what should stay/change/go, update
the detailed requirement and this roadmap, then proceed to the next point. Record a decision
when the intended product or architecture changes. Code fixes are separate work from this
planning review.

| Order | Discussion | Detailed documents | Resolution |
|---|---|---|---|
| 1 | Eight-box scheduler versus five-box API/database constraints | [Graduation spec](../superpowers/specs/2026-08-28-srs-graduation-design.md), [retention engine](05-retention-engine.md), DR-035 | **Planning resolved 2026-09-06:** keep eight boxes; API validation, database migration, recovery checks, and cross-device round-trip verification added to spec. Implementation pending. |
| 2 | Progress isolation when accounts share a browser | [Account ownership requirements](05-retention-engine.md#account-ownership-and-session-transitions), DR-036 | **Isolation agreed 2026-09-06:** scoped storage, safe auth transitions, legacy recovery, and acceptance checks specified; implementation pending. Guest-import interaction proposed for implementation review. |
| 3 | Book Three reading experience and vocabulary prerequisites | [Reading stage](04-stage-reading.md), [Book Three bands](book-three-bands.md), [Book Four bands](book-four-bands.md), [text sourcing](../text-source-brief.md) | **Sequencing clarified (DR-038):** content first, bookmap review, current-book content complete before next-book authoring. Reading-text/vocabulary scope remains open; interface absence alone is expected sequencing. |
| 4 | Book Two composition and later-book checkpoint behavior | [Book Two](03-book-two.md), [reading stage](04-stage-reading.md), [guided-production prototypes](../../prototypes/README.md) | **Method selected (DR-039):** option 4, full model visible with type/build choice. [Spec](../superpowers/specs/2026-09-06-guided-production-design.md) added; DR-040 adds midpoint/end chapter checkpoints and shared SRS evidence rules; [spec](../superpowers/specs/2026-09-06-checkpoints-and-srs-design.md). Implementation and exact book-ending activity scope remain pending. |
| 5 | Progress reporting for the main course versus legacy practice | [Retention engine](05-retention-engine.md), [admin plan](../admin-dashboard-plan.md) | Awaiting discussion |
| 6 | What shelving Hana must mean on the server | [Decision records](../decision-records.md) — DR-023; [server routes](../../server/src/routes/conversation.ts) | Awaiting discussion |

Additional assessment observations (sync conflicts/retries, testing, authoring handoffs,
performance, and onboarding) remain review inputs. Discuss related sync details with points 1–2;
prioritize the remainder after these six. Their presence in the assessment does not authorize
implementation or settle scope.

## Content-first delivery (DR-038)

**Execution guide:** [Book content authoring workflow](../content-authoring.md). Read it before
planning, writing, verifying, or wiring a chapter. It contains the reusable book content contract,
role handoffs, validation steps, and whole-book completion checklist. The roadmap remains the
status ledger; book plans hold their completed contracts and evidence.

**Author and review the content before building the interfaces that will teach it.** The owner
uses the bookmap to understand what is being added to each book. An unfinished reader or
composition interface can therefore be expected sequencing, not evidence that content should
have waited for the interface.

Work one book at a time: write and verify the current book's agreed content, make it inspectable
in the bookmap, and record content completion before creating/writing the next book's content.
A chapter finishing is not the book finishing. Planning one book ahead may use the preceding
book's measured inventory; it does not authorize next-book content authoring before that book's
content is complete. Missing interfaces do not themselves block next-book authoring.

| Milestone | Meaning and evidence |
|---|---|
| Content reviewable | Authored content is visible in the bookmap, with chapters, lessons, items, and sources available for the owner's inspection. Draft status is explicit. |
| Content complete | The book's agreed content scope is written and verified, reflected in the bookmap, and recorded with evidence in this roadmap. Content dependencies and explicit deferrals are named. This permits next-book authoring. |
| Learning experience ready | The interfaces required to teach that content exist and have been verified end to end. Content completion alone does not establish learner readiness. |

**Bookmap visibility and learner availability are separate milestones.** Today the bookmap and
`/learn` consume the same registered content. That coupling is an implementation limitation:
registration can expose a book to learners before its intended experience is ready. Plan a way
to inspect authored content in the map independently of learner availability; the implementation
approach remains to be designed. Do not report current registration as proof of interface
completion or quietly change existing access behavior during this documentation cleanup.

For every book, record the content scope, map/review evidence, remaining content work or agreed
deferrals, and interface work separately. Do not infer historical content-completion approval
from registration or from the fact that the next book already has files.

**Open for Book Three:** determine whether coherent reading texts and the vocabulary they supply
belong to this book's content-completion milestone or are explicitly deferred. Its grammar
content exists; that does not settle the reading-text scope. Content-first sequencing explains
why the reader/mining interface can remain unbuilt, but does not by itself settle which content
must be written before the next book. This review does not retrospectively declare a book
incomplete or require undoing existing Book Four work.

## Capability inventory

**Status vocabulary:** *planned* means described; *authored* means assets exist; *wired* means
reachable in code; *verified* requires named acceptance evidence; *deployed* requires environment
verification. *Partial* names an incomplete capability; *shelved/deferred* records a decision to
hold work. A wired book does not imply every experience in its plan is complete.

| Capability | Repository state | Requirements and evidence |
|---|---|---|
| Guided daily loop and multi-book routing | Wired | [Shared model](01-overarching-plan.md), [book registry](../../src/content/books.ts), [orchestrator](../../src/srs/dailyLoop.ts), [LearnPage](../../src/pages/LearnPage.tsx) |
| Book One content | Wired | [Book plan](02-book-one.md), [generated map](../book-one-ladder.md) |
| Book Two content and difficulty shift | Content, recall default, and romaji cut wired; preferred guided production is prototyped; lesson integration remains pending | [Book plan](03-book-two.md), [generated map](../book-two-ladder.md); discussion 4 |
| Book Three grammar content and reading stage | Grammar content wired; reader, library, mining, and compose-then-compare remain unbuilt; ingestion/levelling tooling exists | [Stage plan](04-stage-reading.md), [bands](book-three-bands.md), [generated map](../book-three-ladder.md), [pipeline](../../scripts/reading.mjs); discussion 3 |
| Book Four | All nine bands authored, audited and wired (2026-09-07): 352 lessons, 901 words, 1232 phrases, 241 patterns. Kanji placement is the one open item -- every Book Four lesson ships `kanji: []`, and 286 characters appear in its word cards untaught. Bands 4 and 8 of `04b` (news, exposition at length) stay deferred on text sourcing. | [Bands](book-four-bands.md), [generated map](../book-four-ladder.md), [book registry](../../src/content/books.ts) |
| Later books | Planned; retain existing scope pending reconciliation | [Fluency stage](04b-stage-fluency.md), DR-033/034 |
| Kanji introduction, review, and components | Mechanism wired; **placement lags the content**: Book One placed 218, Book Two 19, Book Three 10, Book Four 0, while 286 characters new to Book Four's word cards are read but never taught. Scope is derived from lesson `kanji:` arrays, so placing them is a content decision plus a generator run | [Ladder spec](../superpowers/specs/2026-08-24-kanji-in-the-ladder-design.md), [component spec](../superpowers/specs/2026-08-24-kanji-components-design.md), [content](../../src/content/kanji/index.ts) |
| Scheduling and progress sync | Partial: eight-box client, five-box API/database; compatibility fix approved in plan, implementation pending; legacy server FSRS also exists | [Graduation spec](../superpowers/specs/2026-08-28-srs-graduation-design.md), [retention plan](05-retention-engine.md); discussions 1–2 |
| Account and guest progress isolation | Planned correction; current shared cache remains unsafe across accounts | [Ownership requirements](05-retention-engine.md#account-ownership-and-session-transitions), DR-036; discussion 2 |
| Full FSRS migration | Planned; DR-035 records the migration trigger | [Decision records](../decision-records.md), [retention plan](05-retention-engine.md); reconcile scope after discussion 1 |
| Profile and admin reporting | Screens/services wired; main-course coverage unresolved | [Admin plan](../admin-dashboard-plan.md); discussion 5 |
| Hana | Shelved by DR-023; frontend hidden by default, server routes still mounted | [Frontend flag](../../src/config.ts), [server](../../server/src/index.ts); discussion 6 |
| Audio | Partial: generator for database cards exists; course-wide audio integration remains incomplete | [Generator](../../server/scripts/generate-audio.ts), [admin audio plan](../admin-dashboard-plan.md) |
| Onboarding and session preferences | Planned, not wired | [Onboarding](06-onboarding.md), [retention engine](05-retention-engine.md) |
| Paid access | Stubbed; payment integration deferred | DR-033, [tier implementation](../../src/store/auth.ts); no payment choice settled by this review |

Use generated book maps for counts and ordering; do not copy changing totals into this ledger.
Detailed documents may still contain old status claims. Until reconciled, use this inventory for
implementation status and the discussion queue for unresolved intent.

## Other work retained for later prioritization

- **Future public/commercial iteration (DR-037):** define its scope and readiness criteria after
  personal validation, including trials with other learners and a sustainable business model.
  See Product direction above; this is intended future work, not excluded scope.

These preserve existing backlog items, without assigning them a new priority:

- Deployment housekeeping: verify the migration and duplicate-project notes in the
  [legacy todo](../todo.md). Their production status is unverified; do not act on old assumptions.
- Admin Phase 3: flags, announcements, and rate-limit visibility — [admin plan](../admin-dashboard-plan.md).
- Audio input/Whisper follow-up, Apple Sign-In, and mobile/PWA/offline expansion.
- Content QA, authoring workflow validation, and learner walkthrough coverage.
- Release verification, performance, and monitoring — [testing](../testing.md),
  [release guide](../release.md), and [infrastructure](../infrastructure.md).

## Where requirements live

| Document | Responsibility |
|---|---|
| **This roadmap** | Current status, priorities, open decisions, and links to evidence |
| [Plans directory index](README.md) | Navigation to detailed learning documents; no independent status ledger |
| [Overarching plan](01-overarching-plan.md) | Shared learning model; stale portions are reconciled as their topics are discussed |
| Book, stage, and chapter/band plans | Learning objectives, prerequisites, content scope, and interactions |
| Feature specs in `docs/superpowers/specs/` | Detailed behavior and acceptance criteria; corresponding implementation plans describe execution |
| [Decision records](../decision-records.md) | Agreed changes and rationale; superseded decisions remain historical |
| Generated `docs/book-*-ladder.md` and `bookmap/` | Inventory of registered course content |
| [Testing](../testing.md), [release](../release.md), [infrastructure](../infrastructure.md) | Verification and operational procedures |

Code establishes what runs; agreed requirements establish what should run. When they disagree,
record a gap here and resolve it explicitly rather than treating implementation as automatic
approval of a changed requirement. Existing feature decisions remain in force until revised.

`docs/project-plan.md` and `docs/todo.md` are historical summaries, retained for reference while
we reconcile their details. New status and prioritization updates belong here. `README.md` owns
setup, and `CLAUDE.md` owns contributor instructions; both point here for planning status.
