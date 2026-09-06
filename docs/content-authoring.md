# Book content authoring workflow

This is the shared procedure for future book content work (DR-038). The
[roadmap](plans/99-roadmap.md) owns priorities and completion status. This document owns the
procedure; role instructions link here instead of maintaining different versions of it.
Applies whether one contributor performs every role or work is delegated. Roles do not require
multiple agents. Existing user decisions and explicit task scope take precedence.

## 1. Start with the current book

Read, in order:

1. The roadmap, including the current book's content milestone and preceding book's completion
   evidence. Never infer completion from a book number, registered files, or a green build.
2. The current book's actual plan linked there, relevant decision records, and its chapter/band
   breakdown. Do not guess a filename such as `0N-book-*.md`: later books use stage/band plans.
3. This workflow and the applicable role instructions in `.claude/agents/`.
4. Current content schemas, registered book modules, generated ladder, and content manifest.

**Sequence:** write and verify one book's agreed content, expose it for bookmap inspection,
record content completion, then write the next book's content. Planning ahead is allowed;
next-book authoring is gated on the preceding book's content completion. Interface development
can follow. A missing interface is not a reason to omit the content it will consume.

If completion evidence is missing, inspect the preceding book and existing decisions first.
Reconstruct a factual record where possible. Continue independent inventory/planning work; ask
only for unresolved scope or an actual decision. Do not repeatedly request approval already
provided, invent a deferral, or declare historical work invalid just because this template is new.

## 2. Establish the book's content contract

Put the following block in the book's existing plan (not a new competing status document).
Link to it from the roadmap. Fill it with actual evidence, not assumptions.

```markdown
## Content contract

- Book / stage / plan:
- Preceding book completion evidence:
- Included chapters or bands:
- Required assets: vocabulary, phrases, grammar, lessons, checkpoints, kanji/components;
  explicitly state whether reading texts, composition frames, model answers, and audio belong
  to this milestone or a later one.
- Source policy and local datasets:
- Prerequisite gaps and how this book covers them:
- Explicitly agreed deferrals: scope, decision reference, and intended follow-up (or none).
- ID prefix and allocated lesson-order range:
- Map evidence: generated ladder and inspected bookmap chapters/lessons, with date/revision.
- Validation evidence: commands, outcomes, verifier findings and resolutions.
- Remaining content work:
- Content-completion evidence: revision and scope satisfied; do not mark until work is complete.
- Interface work still required: tracked separately, with links.
```

Existing books do not gain invented completion status during template adoption. Book Three's
reading-text/vocabulary scope remains open until settled explicitly. Required guided-production models and chunks
are content even when their interface is not implemented yet. An absent schema slot must
be reported and resolved, not used to silently drop an asset from scope.

For guided-production exercises, follow
[the selected interaction contract](superpowers/specs/2026-09-06-guided-production-design.md)
(DR-039): visible model, type-or-build choice, authored chunks and accepted forms. Earlier Book
Two frame-substitution briefs are superseded for this per-lesson activity. Chapter checkpoint cadence and SRS behavior follow
[DR-040's spec](superpowers/specs/2026-09-06-checkpoints-and-srs-design.md): midpoint near five
teaching lessons plus chapter end; independent recall contributes review evidence while
visible-model success does not promote. Specify target IDs and assistance behavior per task.
Book-ending activity details remain separate scope decisions.

## 3. Inventory and plan each chapter

- Use the manifest to find IDs and possible reuse. It scans files, including unwired drafts;
  presence there means “authored/reserved,” not necessarily “previously taught.” Establish
  prerequisites from the book/lesson sequence and distinguish new words from reused words.
- Check file status and current source before trusting generated inventory. A stale artifact
  goes to the integration role for regeneration. Avoid unrelated edits or concurrent generation.
- Specify the learner-facing title/can-do, required assets, existing IDs, new vocabulary,
  prerequisites, sourcing feasibility, and checkpoint behavior. A shorter justified chapter is
  preferable to padding. Counts alone do not establish learning quality.
- Assign noncolliding global lesson orders from the existing sequence and any active allocations.
  Check unwired drafts too. Reuse a controller's allocation if given; otherwise establish it from
  evidence and record it. Do not renumber shipped IDs or progress keys.

## 4. Author and verify

| Role | Inputs | Deliverable and handoff |
|---|---|---|
| Planner | Book contract, inventory, prerequisite sequence | Chapter/band breakdown with required assets, dependencies, and open decisions |
| Author | Breakdown, allocated IDs/orders, source policy, schemas | Authored files; source/sense evidence; validation results; explicit missing assets |
| Verifier | Exact authored files and breakdown | File/line findings, source checks, limitations, and ready-to-integrate verdict or blockers |
| Integrator (wirer) | Verified chapter scope | Registration, kanji assignment, generated artifacts, map inspection, and integration evidence |
| Book coordinator (the contributor managing the book) | All chapter handoffs | Reconcile the entire content contract and record the milestone in the roadmap |

The same contributor may perform these roles sequentially. Findings must be resolved and
rechecked before they disappear from the handoff. Keep reports concise, but link to durable
file/line or validation evidence; chat-only “done” is not completion evidence.

**Source policy:** verify each new headword, reading, and intended sense against the actual
local dictionary. A dictionary headword match does not verify a sentence. Training-canonical
sentences are allowed only where the governing book policy explicitly permits them (Books One
and Two), with required markers. Book Three and above require verified source sentences with
citations; a training marker cannot waive that requirement. Check cited Japanese against the
source, and distinguish source attestation from linguistic/translation review. Do not invent
sentences or silently substitute a weaker source policy when a dataset is unavailable.

**Validation boundaries:**

- Run `pnpm exec vitest run scripts/yaml.test.mjs` for YAML parsing and `pnpm manifest:check`
  for collisions. They scan unwired files too. Neither proves full schema conformance or
  linguistic correctness.
- Validate assigned drafts with the real `src/content/*/schema.ts` parsers and appropriate
  reference sets. If no draft-validation runner covers them, report that gap and arrange a
  parser-based check; merely reading a schema or passing unrelated schema tests is insufficient.
- Authors do not edit registration or generated artifacts. Full tests can report stale
  artifacts during handoff; classify and pass these to the integrator. Do not call the branch
  green, suppress failures, or rewrite others' content to make the checks pass.
- The integrator regenerates `pnpm ladder` and `pnpm manifest`, then runs `pnpm build`,
  `pnpm test`, and `pnpm manifest:check`. Shared scans can include other drafts; coordinate
  integration scope and report unrelated failures rather than silently incorporating them.
- For changed/renumbered lessons, run `pnpm walkthrough` and report the actual authenticated
  tier and books/lessons traversed. Guest coverage establishes only Book One. Missing future
  interfaces are recorded separately; a walkthrough proves only the behavior actually exercised.
  No learner-readiness claim is valid without the required interface coverage.

## 5. Make the content reviewable

Run `pnpm bookmap` and inspect the assigned book/chapter entries. Confirm the intended lessons,
words, phrases, grammar, and kanji appear in order and match the contract. Record what was
inspected and the revision; a regenerated Markdown ladder alone is not a visual map review.
Provide the owner the book/chapter location and a concise account of what changed so they can
inspect it. Incorporate corrections from that review. Do not invent an owner sign-off.

**Current limitation:** bookmap and `/learn` share registration. Registering content for map
review can also make it reachable in the current teaching UI. Report that exposure explicitly;
do not treat it as a separate publication action the code already supports. Decoupling review
visibility from learner availability is planned, not implemented. Do not change tier gates or
build new release controls as an incidental content-writing task.

## 6. Close the book, then proceed

The coordinator checks the whole contract, not just the last chapter:

- All included chapters and required assets are written, verified, and represented in the map.
- Source, schema, cross-reference, order, and integration findings are resolved with evidence.
- Required content is not missing under the label “interface work.” Every deferral has an
  actual scope decision and a follow-up location.
- Generated inventories agree with source; distinguish new, reused, and merely quoted items.
- The owner has a reviewable map and outstanding corrections are addressed.
- Record the completed content scope and evidence in the book plan; update the roadmap to
  **content complete**. List interface work separately. Only then begin next-book authoring.

Do not mark **learning experience ready** until required interfaces have their own end-to-end
verification. Do not mark **deployed** from a local build. Existing commit, source-citation, and
release rules still apply; a content milestone does not itself publish or deploy anything.
