# N5 Ladder — the foundation path

**Tier:** Guest + Free (fully playable without paying). **Goal:** the learner can read all kana
fluently, handle survival situations in Japan (greetings, transit, food, shopping, hotel,
directions), and has the vocabulary/kanji/grammar foundation of JLPT N5. This path's job is to
**prove the method and build the habit** — it must feel rewarding fast, because most drop-off
happens in week one.

This is the **template path**; N4/N3 docs describe how the engine's *emphasis* shifts, not a new
engine. Engine details live in [01-overarching-plan.md](01-overarching-plan.md).

---

## 1. Shape of the ladder

```
[ Kana mini-ladder ]  →  [ N5 Units 1 … ~35 ]  →  N5 "can-do" checkpoint  →  (N4 prompt)
   hiragana, katakana        the main rail
   (always free, never gated)
```

- **Kana mini-ladder** is the prerequisite and stays separate (it's pre-JLPT and always free).
  A learner who already reads kana can test out. The main rail assumes kana fluency so it can show
  readings in kana, not romaji.
- **~35 Units.** Each unit ≈ one guided session of *new* material; the whole level is a few weeks at
  a sustainable pace.
- The ladder ends in a **can-do checkpoint** (not an exam): a short mixed review + one Hana
  situation that requires items from across the level. Passing it surfaces the N4 upgrade prompt.

### N5 can-do moments (19 milestones)

The learner's progress is anchored to these 19 real-life abilities. Each is a milestone on the
ladder — surfaced in the Close step and verified by the two-agent system (Hana + assessor) when
the learner is ready to attempt it.

**Greetings & basics**
1. Greet someone — hello, good morning, goodbye, nice to meet you
2. Introduce yourself — your name and where you're from
3. Thank someone and respond when thanked
4. Say you don't understand and ask someone to speak slowly

**Food & drink**
5. Order a drink at a café
6. Order a meal at a restaurant
7. Ask for the bill
8. Ask what something is on a menu

**Shopping**
9. Ask how much something costs
10. Buy something at a shop — point, ask the price, pay

**Getting around**
11. Buy a train ticket to a destination
12. Ask which platform or exit to use
13. Tell a taxi driver where you want to go

**Hotel**
14. Check into a hotel — give your name and confirm your reservation

**Directions**
15. Ask where something is (bathroom, exit, station) and understand a basic answer (left, right,
    straight ahead)

**Weather**
16. Comment on the weather — "It's hot today, isn't it?" / "It's cold" (暑いですね / 寒いですね)
17. Ask what the weather will be like — "What's the weather tomorrow?" (明日の天気は？)

**Food preferences**
18. Say what food you like or don't like — using すし、ごはん、ラーメン、たまご、やさい
    (〜が好きです / 〜が嫌いです)
19. Say what you want to eat — same vocabulary, pattern 〜が食べたいです
    ("I want to eat ramen" / "I want to eat eggs")

## 2. What's in a unit (N5 emphasis)

A unit bundles a small, coherent batch that all reinforces each other:

- **5–7 words** (from the existing JLPT-N5 vocabulary)
- **1–2 kanji** (with radical/component breakdown + a mnemonic — see §5)
- **1 grammar pattern** (e.g. ～です, ～を ください, ～は どこ ですか) taught via a verified example
- **2–3 phrases** that *use* the unit's words + pattern (from the existing phrase corpus)
- **A short reading**: 2–4 lines reusing this unit's items + earlier ones, at ~95% known
- **An output beat**: a 3-turn Hana exchange scoped to the situation, or type-the-phrase

Units are grouped into **practical situations** (Greetings, Getting Around, Eating, Shopping,
Hotel, Directions) so the JLPT ladder still *feels* like "real-life Japanese," honoring the brand
— the situation is the wrapper, JLPT level is the spine.

## 3. The daily session, N5 flavor

The shared 6-step session loop (review → new unit → integrate → produce → close → recognition
pass), tuned for beginners. Session length and item count are driven by the learner's `intensity`
and `session_length` preferences set during onboarding.

1. **Review:** interleaved due items — words, kana, the odd kanji, a phrase. Empty on the first
   session; grows as the SRS fills. Format rotates per item (flashcard one session, fill-in-blank
   the next — never the same format twice in a row for the same item).
2. **New unit:** introduce the 5–7 words with **audio + furigana**, the kanji with its mnemonic,
   the grammar pattern with one worked example, then the phrases that combine them.
3. **Integrate (scaffolded at N5):**
   - *Early N5:* characters forming a word — see the kana making a real word
   - *Mid N5:* new word in a short 2–3 word phrase
   - *Late N5:* phrase in a sentence — cloze or short reading passage
4. **Produce:** one output beat, forgiving and short at N5:
   - *Early N5:* tap or type a single word
   - *Mid N5:* type the phrase just learned
   - *Late N5:* tiny scoped Hana exchange ("You're at a café. Order something to drink.")
5. **Close:** progress toward the current can-do goal, brief summary of what was learned. No score,
   no XP, no streak.
6. **Recognition pass** *(only if `session_end_check = true`):* see English, tap the matching
   Japanese tile from three options. Not a quiz — no right/wrong feedback, no judgment.

## 4. Recognize → Recall → Produce at N5

| Gate | N5 format | Notes |
|---|---|---|
| **Recognize** | flashcard front, multiple-choice meaning, audio→meaning | Lots of scaffolding; furigana on; generous |
| **Recall** | type the reading (kana), fill-in-the-blank, say it (audio in) | The testing-effect workhorse; unlocks after a few correct Recognizes |
| **Produce** | type the phrase, 3-turn Hana exchange, read-aloud | Light/forgiving feedback; the "I can use this" payoff |

Beginners get more time in Recognize; the gate to Produce is gentle so early wins come fast.

## 5. Kanji at N5 (the new radical/mnemonic layer)

N5 has ~100 kanji — the ideal place to install the **component method** that pays off for the whole
ladder. For each kanji: show its components (KANJIDIC2/KanjiVG already give these), a keyword per
component, and a short vivid mnemonic story, *then* SRS it. Example shape (illustrative):

> 川 ("river") — three flowing strokes like three streams of water. Reading: かわ.

Optional handwriting (stroke order from KanjiVG) adds motor memory for those who want it. (Mnemonic
authoring/sourcing is an open decision — see overarching plan §5.5.)

## 6. Output with Hana at N5 — "scoped sessions"

Hana already exists; the new piece is **scoping**. An N5 unit's output beat launches Hana with a
system prompt constrained to: this situation, N5 grammar/vocab only, slow, lots of modeling. Hana
gently corrects by re-modeling the right form rather than grading harshly. Because comprehension at
N5 is fragile, these are *very* short (3–5 turns) and heavily scaffolded ("you can answer with just
one word").

## 7. Worked example — Unit 4: "At the café"

Using content already in the app (greetings + a café/restaurant slice):

- **Words:** コーヒー (coffee), みず (water), これ (this), おねがいします (please), いくら (how much)
- **Kanji:** 水 (water) — components + mnemonic, reading みず
- **Grammar:** ～を おねがいします ("…please")
- **Phrases (existing, verified):** これを ください / メニューを おねがいします / おかいけい おねがいします
- **Reading (assembled from known items):** a 3-line café exchange reusing the above
- **Produce:** Hana — "You walk into a café. Order something to drink." Expected output uses
  〜を おねがいします + a drink word. Hana models the polite form back.
- **Review tomorrow:** these items interleave with Units 1–3 (greetings, basic は/です).

A learner finishes this unit able to *actually order a drink* — concrete, usable, motivating.

## 8. Retention design specifics at N5

- **Front-load wins:** Unit 1 should produce a real "I said something in Japanese" moment within the
  first session (a one-word Hana greeting). Early success drives habit.
- **Interleave from day one:** even with little material, mix kana + words so the brain practices
  discrimination.
- **No punishment:** missed days = "reviews piled up," never lost streaks/progress. Re-engagement is
  informational and kind.
- **Audio everywhere:** beginners need the sound-to-symbol link; every item is playable.

## 9. Free/paid

Entirely free (guest can do a lot; a free account adds cross-device progress sync — the existing
incentive). The N4 ladder is also free; the first paywall is N3. So a learner experiences the full
method, for weeks, before ever being asked to pay.

## 10. Build notes specific to N5

- Reuses existing kana, N5 words, N5 phrases, audio, Hana, FSRS.
- New for N5: unit/ladder data model, the daily-loop orchestrator, kanji component+mnemonic layer,
  N5 grammar patterns as items, scoped-Hana launch, short assembled readings.
- Grammar + reading content sourcing must follow CLAUDE.md (verified or marked training-canonical;
  see open decision in overarching plan §5).
