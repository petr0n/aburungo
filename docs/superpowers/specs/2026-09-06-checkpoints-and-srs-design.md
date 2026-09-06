# Chapter checkpoints and SRS reviews

**Decision:** DR-040, 2026-09-06. Owner accepted the complementary checkpoint/SRS approach.
**Status:** planning agreed; cadence, content, and shared scheduling safeguards require implementation.

## Session and chapter sequence

Start each learning session with due SRS items from completed lessons, including earlier chapters
and books, then proceed to the next teaching lesson or checkpoint. SRS follows elapsed time per
item; checkpoints follow curriculum position. Neither requires studying on consecutive days.

For a chapter of about ten teaching lessons:

**Lessons 1–5 → midpoint checkpoint → lessons 6–10 → chapter-end checkpoint.**

Count teaching lessons, not checkpoint entries. Aim for approximately one checkpoint after five
teaching lessons and one at the chapter end, normally two per chapter. Place the midpoint at a
coherent situation/topic boundary near that point. For shorter or longer chapters, justify the
placement in the chapter plan; do not pad lessons or place two checkpoints at the same endpoint.
The approximate cadence is guidance, not a requirement to interrupt a coherent teaching sequence.

## Complementary purposes

- **SRS:** brief retrieval of individual words, phrases, grammar patterns, and kanji, scheduled
  from prior review evidence. It maintains learning after the chapter ends.
- **Midpoint checkpoint:** consolidate the first half, apply its material, and find what needs
  another encounter. Use only prerequisites taught before this checkpoint.
- **Chapter-end checkpoint:** cover the whole chapter, including applying its patterns together.
  Avoid merely replaying the opening SRS queue. Use appropriately sourced tasks and model answers.
- **Guided production:** keep the full model visible with type-or-build choice (DR-039). This
  is supported practice between retrieval opportunities, not an independent recall check.

For checkpoint recall tasks, the model answer is hidden until the learner submits or requests
help. Task context and previously taught vocabulary can be provided; assistance that supplies
an answer makes the attempt assisted. The exact mix of task formats must be authored per chapter
and labelled by the skill assessed: recognition is not evidence of productive recall.

## One review history, with honest evidence

Checkpoint outcomes and session-start reviews feed the same per-item history and scheduler.
A checkpoint must not create a second schedule for the same content ID. Record the item, session,
attempt time, activity, assistance, and outcome needed to apply the following rules; exact storage
and API design are implementation work.

1. An independently correct response may advance an existing item's interval under the selected
   scheduler, subject to the session safeguard below.
2. A miss brings the item back sooner (currently box 1, due in one day). Explain the answer and
   allow immediate retries inside the checkpoint; that later SRS follow-up is separate.
3. Success after revealing the answer or using answer-supplying help does not advance the interval.
   Successful visible-model guided production likewise does not promote the item.
4. A successful retry cannot erase the initial miss. Completion of the checkpoint means the
   learner worked through it, not that every item was independently recalled.
5. **At most one upward promotion per item per learning session**, shared across opening reviews
   and checkpoints. An independent miss later in the session overrides an earlier success;
   subsequent retries cannot promote it again that session. Repeated misses must not keep moving
   the due date later. Use durable event/session identity so request retries and reloads do not
   count as new independent successes.
6. A newly introduced item still needs its first scheduled review even if its only exposure was
   supported practice: initialize it without promotion (box 1, first review in one day). Do not
   reset an existing item's progress simply because it appears in a guided exercise again.

Persist useful learning evidence, not a checkpoint grade. Keep the shrinking-set, unlimited-retry
experience; no aggregate pass/fail label, percentages, or rewards. “Nothing recorded” in older
checkpoint prose means no persistent grade, not that review evidence should be discarded.

## Content and integration work

Authors specify checkpoint placement, target IDs, prerequisites, sourced prompts/models,
accepted responses, explanations, and the skill each task assesses. Distinguish independent
attempts from assisted practice in the interface and scheduling contract. Do not claim a complex
whole-sentence error identifies every constituent word as forgotten; provide explicit target-item
mapping for each task rather than rating every word in the sentence automatically.

Existing books have older checkpoint placement and stable lesson IDs/orders. Audit chapter plans,
lesson registrations, progress compatibility, bookmap output, and tests before retrofitting.
Do not blindly renumber shipped IDs or insert checkpoints that silently invalidate completion.
Document rollout and existing-learner behavior in the implementation plan. The intended new
cadence is agreed; a bulk content migration has not been performed by this documentation update.

This chapter policy does not eliminate separately planned book-ending activities. Their precise
content, and Book Three's reading-text inclusion/deferral, remain separate scope questions.

## Acceptance evidence

- About-ten-lesson chapter has midpoint and end checkpoints with correct prerequisite coverage;
  short chapters do not acquire adjacent duplicate checkpoints.
- Due items from older books appear before a new lesson or checkpoint. Later reviews continue
  after the learner finishes the chapter.
- Independent success in opening review followed by checkpoint success promotes only once.
- Success followed by a miss ends at the miss schedule; a corrected retry cannot undo it.
- Assisted success never promotes; a fresh assisted-only item receives its first review date.
- Reload/retry does not duplicate scheduling events; account identity remains isolated (DR-036).
- Guided production keeps its model visible; checkpoint recall hides it until submission/help.
- Checkpoint completion records no grade but preserves valid per-item scheduling evidence.
- Existing-learner progress survives any chapter retrofit, and bookmap reflects the chosen scope.

Run appropriate scheduler, persistence/API, and browser tests; source-level component tests alone
cannot establish shared history across activities. The eight-box compatibility fix remains a
prerequisite for durable higher-box storage, not a replacement for these scheduling safeguards.
