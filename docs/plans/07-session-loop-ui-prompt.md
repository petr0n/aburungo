# N5 Session Loop UI — Design System Agent Prompt

This is a ready-to-run prompt for a design agent working in the AburunGo design system repo.
Hand it the full content below as the task.

---

You are working in the AburunGo design system repo. Your job is to design and build the
learner-facing UI for the N5 guided daily session loop. Read `docs/design-direction.md` and
the existing components in `src/components/` before starting — use what's there, extend only
where something is genuinely missing.

**Brand direction (from design-direction.md):** Calm, minimal, adult. "Quiet form, warm
intelligence." No gamification, no scores, no mascots. Playfulness lives in copy and small
accents, not in structure.

---

## The session loop has 7 screens

### 1. Home / Session Entry

A single "Start today's session" tap. Show the learner's current can-do goal (e.g. "Order a
drink at a café") and a simple indication of how close they are — not a percentage, not a grade.
Something editorial and calm, like "3 words away" or "One more review." Below that, a secondary
option to free-roam (browse words, practice kana) — present it as available, not locked.

### 2. Review

Interleaved SRS due items — could be a word, a kana, a kanji, or a phrase. The format rotates
per item: FlipCard for recognition, FillInput for recall. Show audio on every card (AudioButton).
Furigana on. No streak counter, no item count visible during review — just the item. When the
queue empties, transition automatically.

### 3. New Unit

Introduce 5–7 words with audio + furigana, the unit's 1–2 kanji with a component mnemonic, and
the grammar pattern with one example phrase. This is the "lesson" screen — it should feel like
opening a well-designed page, not a drill. Words appear one at a time or in a scannable list;
the learner taps audio to hear each one. The kanji gets a small visual moment — its components
labeled, the mnemonic beneath. The grammar pattern is shown as a formula + one phrase, not as
a rule.

### 4. Integrate

Scaffolded context cards that bridge new items into real usage. Three stages depending on where
in N5 the learner is:

- **Early N5:** characters forming a word (kana tiles assembling)
- **Mid N5:** new word used in a short 2–3 word phrase
- **Late N5:** phrase in a sentence (cloze or short passage)

The screen adapts to stage — design all three states. Use PhraseCard where applicable.

### 5. Produce

One output beat. Three states:

- **Early N5:** tap or type a single word (KanaKeyboard available)
- **Mid N5:** type the phrase just learned (FillInput)
- **Late N5:** a 3-turn Hana exchange scoped to the situation ("You're at a café. Order
  something to drink.")

The Hana exchange uses the existing conversation UI pattern — keep it short, scaffolded,
forgiving. Hana models the correct form back; there is no "wrong answer" state, only a gentle
re-model.

### 6. Close

Progress toward the current can-do goal. Show what was learned in this session — words, the
grammar pattern — in a calm summary. Copy should feel like a satisfying close, not a
celebration: "You can now ask for the bill in Japanese." No XP, no score, no badge. If a can-do
milestone was reached, give it a distinct editorial moment — a pull quote-style card, not a
confetti animation.

### 7. Recognition Pass

Optional final screen (only shown if the learner has `session_end_check = true`). See an English
meaning, tap the matching Japanese tile from three options. Three tiles, large touch targets
(≥44px), clean. No right/wrong feedback shown — no green flash, no red X. When all items are
tapped, the session ends quietly. Frame it as "one last look," not a quiz.

---

## Constraints

- Mobile-first. Touch targets ≥44px everywhere.
- No hover-only affordances.
- Use existing DS tokens (colors, type, spacing from `src/tokens.css` and `src/brand.css`).
- Reuse existing components (FlipCard, FillInput, AudioButton, PhraseCard, ProgressBar,
  KanaKeyboard, Button, Card) before building new ones.
- No scores shown as numbers or percentages at any point.
- No pass/fail language. Use "recalled" not "correct," "worth another look" not "missed."
- The session should feel like it ends, not like it stops. The Close and Recognition Pass
  screens are the landing, not an abrupt cut.
