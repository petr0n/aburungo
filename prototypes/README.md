# Guided production prototypes

Run `pnpm prototype:production` from the repository root. Opens
`http://127.0.0.1:5187/prototypes/guided-production.html`.
Alternatively, visit `/prototypes/guided-production.html` on an existing Vite dev server.
This separate HTML entry is for local review; it is not registered in the learning app or
included as an entry in the production app build. It requires no account or API server.

Compare four interactions using the same three existing Book Two sentences:

1. **With a frame:** retain the sentence beginning while typing the whole sentence.
2. **Build, then write:** tap chunks in order, remove/reorder as needed, then type from memory.
3. **Meaning first:** type from an English meaning and register/tense instruction, with optional
   cues, a frame, and model comparison.

4. **Model stays visible:** keep the full Japanese sentence visible while choosing either typed
   input or chunk building. Switching methods preserves unfinished drafts; building does not
   require a subsequent typing step.

The first three start with a separate model step; the fourth keeps the model alongside the answer. Try a mismatch, a correct response, hints, model reveal, retry, and
switching examples. Review at a narrow mobile width as well as desktop. Keyboard input, native
Japanese input, and the existing kana grid are available through the app's FillInput.

The prototype imports existing `b2-01-plain-form.yaml` sentences unchanged. Their provenance is
training-canonical, pending Tatoeba verification; they are not presented as verified quotations.
Chunk boundaries are explicit and checked against the stored sentence. New Japanese sentences
and runtime substitutions are not generated. No progress is saved and no SRS ratings are sent.

Answer checking accepts the stored reading or exact Japanese spelling, ignoring whitespace and
common punctuation. Other valid phrasings or mixed kana/kanji spellings may not match. A mismatch
is described as differing from the model, not a judgment that the learner's Japanese is wrong.
This is deliberately model practice: it does not establish transfer to unfamiliar sentences.

Implementation reuses design-system Card/Button, app FillInput, Furigana, romaji conversion,
answer comparison, and app tokens. Layout CSS is scoped under `.gp-*` and loaded only by this
entry. The style selector and source notes are review controls, not proposed lesson navigation.

**Selected direction (DR-039):** option 4 is the preferred guided-production method and default
selection. Options 1–3 remain available for comparison. See the
[interaction spec](../docs/superpowers/specs/2026-09-06-guided-production-design.md).
Lesson integration, assisted-attempt SRS behavior, and checkpoint scope remain pending.
