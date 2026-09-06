# Guided production — visible model, type or build

**Decision:** DR-039, 2026-09-06. The owner selected prototype 4 as the preferred method.
**Status:** interaction direction agreed; local prototype exists; lesson/SRS integration pending.

## Interaction

Keep the full Japanese model sentence, furigana, and its English meaning visible throughout the
exercise: during input, switching methods, feedback, and retry. Provide two equally available
answer methods: **Type the answer** and **Build the answer**. Typing may be the initial selection
as in the prototype; building is a complete alternative, not a step that forces later typing.

Typing uses the existing kana/romaji/native-input facilities. Building uses authored chunks
selected by tap/click or keyboard, in sentence order; tapping a placed chunk removes it. Do not
require dragging. Allow switching methods without losing unfinished drafts. An explicit check
submits the answer; show feedback and allow unlimited retry while the model remains visible.
Reset per-exercise state when changing the target sentence. No grades, timers, or reward loops.

This supersedes the Book Two per-lesson plan for hidden frames, vocabulary-slot substitution,
and compulsory typing from memory. Other prototype styles remain comparison material, not
required phases of this method. Chapter checkpoint behavior follows DR-040; open composition
and exact book-ending activity content remain separate decisions.

## Content contract

Each exercise needs an existing sourced model-sentence ID, its Japanese/reading/English,
target pattern and prerequisites, explicitly authored chunk boundaries, accepted typed forms,
and a short explanation. Refer to existing content rather than duplicating the sentence text.

Chunks must reconstruct the exact model in its intended order; define how punctuation belongs
to them. Never infer boundaries by splitting kana strings or generate arbitrary substitutions.
Follow the governing book's sourcing policy. Prototype Book Two sentences are training-canonical
and pending Tatoeba verification; selection of the interaction does not upgrade their provenance.

Authors and verifiers check the complete model, chunk reconstruction, accepted readings, and
prerequisites. Expose those assets in the bookmap when its exercise support is implemented.
A generic “composition frame” requirement in an older chapter breakdown must be reconciled to
this contract rather than authoring unused substitution combinations.

## Feedback and learning claims

Check reproduction of the supplied model, not unrestricted Japanese correctness. Accept the
authored written variants and defined normalization rules; the current prototype accepts the
stored reading or exact Japanese spelling while ignoring whitespace/common punctuation.
Other valid phrasings can differ from the model: describe a mismatch without asserting that
all nonmatching Japanese is invalid. The model remains visible when explaining the difference.

This is supported production practice. Successful copying or assembly is not evidence of unaided
recall or spontaneous composition. DR-040 settles assisted-attempt scheduling: visible-model success does not promote; new items
receive a first review without promotion and existing schedules are not reset by re-exposure.
See [checkpoint/SRS rules](2026-09-06-checkpoints-and-srs-design.md). The prototype saves nothing.

## Remaining implementation and acceptance work

- Add/validate exercise content references and authored chunks; cover them in bookmap review.
- Integrate the preferred interaction into the appropriate lesson step using existing input,
  furigana, and design-system components. Implement DR-040 scheduling safeguards before persisting ratings.
- Check both methods on mobile and keyboard: model stays present during input, feedback and retry;
  chunks can be removed/reordered; incomplete builds cannot submit; switching preserves drafts;
  switching exercises clears prior answers. Building never forces a subsequent typing task.
- Verify valid variants, neutral mismatch feedback, input normalization, and source reconstruction.
- Keep book-ending checkpoints and later-stage reading/output requirements explicitly unresolved
  until discussed; this choice alone does not redefine what they assess.

Reference implementation: [local prototypes](../../../prototypes/README.md), option 4.
