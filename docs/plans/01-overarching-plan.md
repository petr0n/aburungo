# Learning Paths — Overarching Plan

**Spine: JLPT level ladders.** Each learning path is one JLPT level (N5 → N1). Every ladder runs
the *same* retention engine; what changes between levels is the **content** and the **emphasis**
(recognition-heavy at N5 → production/immersion-heavy at N3+). Grounded in
[00-research-foundations.md](00-research-foundations.md).

> **Core principle — AburunGo is NOT a JLPT test-prep app.** We *borrow ideas* from the JLPT
> framework (sensible difficulty ordering, i+1 sequencing, a content scaffold our data already
> uses), but the learner experiences **real-life situations** ("order a coffee," "check into a
> hotel"), never exam drills, vocab-list numbers, or a mock test. JLPT is the **invisible
> skeleton**; "practical Japanese for real life" is what the user sees and feels. Surface UI leads
> with situations; the N-level is backbone, shown lightly if at all. Ladders end in a **can-do
> checkpoint** ("you can do X"), never an exam score. If a design choice starts to feel like
> test-prep, it's wrong.

> **Assessment principle — feedback through what you see next, not what you scored.** A score is
> a reward loop: it creates anxiety on bad sessions and a dopamine hit on good ones. AburunGo
> shows counts ("7 recalled") as a momentary reflection, never a percentage, grade, or pass/fail
> verdict. The real feedback signal is the SRS queue — words a learner struggled with surface
> sooner. That is invisible to the user by design. Assessment lives in lightweight **recognition
> passes** (tap the matching Japanese tile from 3 options) and SRS re-surfacing; not timed tests
> or scored quizzes. **Skip is always available** on every assessment screen — it is the relief
> valve for learners who do not want to be quizzed. The app never tells a learner they failed.
> Language: "recalled" not "correct", "worth another look" not "missed".

> **Furigana principle — kanji is never a wall outside explicit kanji learning.** All Japanese
> text containing kanji must display furigana (via `<ruby>`) everywhere except the `/kanji` route
> and any screen explicitly framed as "read this kanji." This applies to: word tiles, learn cards,
> flashcards, phrases, fill-in-the-blank, conversation history, result/review screens — the full
> app surface. Pure-kana text passes through unchanged. The only exception is the kanji-learning
> path, where reading the character unassisted is the point. Use the `<Furigana>` component
> (`src/components/Furigana.tsx`); never inline `<ruby>` by hand.

> Design rule: we **do not replace** the existing buckets (words, characters, phrases, flashcards,
> audio, Hana). A path is a *sequence and a daily loop* that pulls those buckets into one coherent
> flow. New capabilities (grammar-in-context, graded reading, kanji radicals/mnemonics) are
> additive.

---

## 1. The ladder, mapped to tiers

| Path | Tier | Rough scope | Emphasis shift |
|---|---|---|---|
| **N5 Ladder** | Guest / Free | kana mastery, ~800 words, survival phrases, ~100 kanji, basic patterns | Recognition → Recall. Heavy scaffolding, audio, lots of wins early. |
| **N4 Ladder** | Free account | ~1,500 words, ~300 kanji (radicals kick in), core grammar, short readings | Recall → Produce. First real Hana conversations; reading begins. |
| **N3 Ladder** | Paid | ~3,700 words, ~650 kanji, connective grammar, extensive reading | **The wall.** Output-heavy, sentence mining, longer Hana sessions. Retention design matters most here — it's where learners quit. |
| **N2 Ladder** | Paid | ~6,000 words, ~1,000 kanji, nuanced grammar, native-ish input | Produce → Immerse. Volume reading + discussion with Hana. |
| **N1 Ladder** | Paid | ~10,000+ words, ~2,000 kanji, abstract/formal register | Immerse → Refine. Near-native output, nuance, idiom. |

"Mostly paid" = N3–N1 are the paid heart; N5/N4 are the free on-ramp that proves the method.

---

## 2. The engine (identical across every ladder)

### 2a. Structure: Level → Unit → Item

- A **Level** (e.g. N5) is a path made of ordered **Units**.
- A **Unit** is a small, coherent batch (≈ one sitting's worth of *new* material): a handful of
  words, 1–2 kanji, one grammar pattern, the phrases that use them, and a short reading + a Hana
  prompt that exercises them. Units are the unlock-gated steps of the ladder.
- An **Item** is the atomic SRS unit (a word, a kanji, a grammar pattern, a sentence). Items live
  in the FSRS scheduler and are reused across units (a word taught in Unit 3 keeps coming back).

### 2b. Item lifecycle: Recognize → Recall → Produce

Nothing is "learned" until it can be *produced*. Every item graduates through three gates, and the
review system escalates difficulty as stability grows:

1. **Recognize** — see it, pick/understand the meaning (flashcard front, multiple choice).
2. **Recall** — produce the reading/meaning from a prompt (fill-in-the-blank, type the reading).
3. **Produce** — use it in output (type a sentence, say it to Hana, read it aloud).

This directly operationalizes the **testing effect** and stops items stalling at recognition.

### 2c. The session loop (where the levers live)

Each session is one orchestrated loop, not a menu. The learner taps **Start session** and the
orchestrator assembles it — no step choices, no configuration. Session shape is driven by three
onboarding preferences: `intensity`, `session_length`, and `session_end_check`.

**The six steps:**

1. **Review** — FSRS-due items from all past lessons, interleaved across item types (words, kanji,
   grammar, phrases). Format rotates per item — same word won't surface as a flashcard twice in a
   row. Empty on the very first session; grows as the learner accumulates material.

2. **New unit** (i+1) — introduce the unit's new words, kanji, grammar pattern, and phrases with
   full scaffolding: audio, furigana, kanji component breakdown + mnemonic, example sentence.
   Item count is set by `intensity` × `session_length`:
   - *Casual + short* → fewest new items, slowest unlock pace
   - *Challenging + long* → most new items, fastest unlock pace

3. **Integrate** — scaffolded by level; the orchestrator picks the right format automatically:

   | Stage | Format |
   |---|---|
   | Early N5 (kana + first words) | Characters forming a word — see kana making a real word |
   | Mid N5 | New word in a short phrase (2–3 words) |
   | Late N5 / early N4 | Phrase in a sentence — cloze or short reading |
   | N4+ | Full sentence or short passage |

4. **Produce** — one output beat, also scaffolded by level:
   - Early N5: type or tap a single word/phrase
   - Mid–late N5: type the phrase you just learned
   - N4+: compose a sentence or a 3–5 turn scoped Hana exchange

5. **Close** — progress toward the current can-do goal, a brief summary of what was learned.
   No score, no XP.

6. **Recognition pass** *(only if `session_end_check = true`)* — see the English meaning, tap the
   matching Japanese tile from three options. Lightweight re-encounter; not a quiz, no judgment.

**On session length:** `session_length` sets the item budget, not a clock. Short sessions have
fewer items; long sessions have more. The learner is never cut off mid-item.

**On gaps:** if the learner returns after a break, the orchestrator silently weights the session
toward review and holds back new unit content. Presented as a normal session — never as catch-up.

### 2d. How the buckets plug in

| Bucket | Role in the loop |
|---|---|
| **Words** | Core SRS items; introduced per unit; graduate Recognize→Produce |
| **Kana** | N5 prerequisite mini-ladder before the main path; never gated |
| **Kanji** | Taught via **radical/component breakdown + mnemonic** (new), then SRS; handwriting optional |
| **Phrases** | The "context" layer — items are taught and reviewed *inside* phrases, not bare |
| **Flashcards** | The Recognize/Recall surface for any item type |
| **Audio (VOICEVOX/Hana)** | Every item has audio; listening + read-aloud output |
| **Hana (Claude)** | The Produce finish line — situational conversations scoped to the unit's items and JLPT level |
| **Grammar-in-context** *(new)* | Patterns as first-class SRS items, taught via verified example sentences |
| **Graded reading** *(new)* | Short i+1 passages assembled from verified sentences (Tatoeba) that reuse known items |

### 2e. Retention levers → concrete mechanisms

- **SRS** → FSRS backbone already in place; extend to grammar + sentence items.
- **Active recall** → Recall/Produce gates; default to typing/production over multiple choice once an
  item is past Recognize.
- **Interleaving** → the Review step mixes item types and units, never one bucket.
- **Comprehensible input** → unit ordering + the scaffolded Integrate step keep input at ~95% known.
- **Output** → the Produce beat every session; Hana scoped to current items.
- **Mnemonics** → kanji component stories; vocab hooks where useful.
- **Habit** → one calm session loop, visible mastery, pace-is-self-set — **no XP/streak dark
  patterns** (CLAUDE.md).

---

## 3. Progression & gating

- A unit unlocks **automatically** when FSRS stability for prerequisite items crosses a threshold —
  no learner decision required. This enforces i+1 and prevents the "I unlocked it but can't use
  it" trap. The unlock is invisible: the session simply begins to include the next unit's items.
- **You can never be behind.** There is no fixed schedule, no "overdue," no streak to protect.
  The learner picks up wherever they left off — tomorrow or three weeks from now.
- When returning after a gap, the orchestrator silently rebalances: more review weight, less new
  content. The UI presents this as a normal session, never as catch-up or debt.
- **Item format rotates across sessions.** The orchestrator cycles the activity type on each
  resurfacing (flashcard → fill-in-the-blank → Hana phrase) so the same word is seen in different
  retrieval contexts. Example sentences also rotate per resurfacing.
- Free vs paid: N5/N4 ladders fully playable free; hitting N3 shows a soft upgrade prompt
  (consistent with the existing soft-gate pattern), with the learner's progress preserved.

---

## 4. What exists vs. what's missing (build inventory)

**Already have:** FSRS server + local SRS, words/kana/kanji/phrases/flashcards content (JLPT-tagged),
audio, Hana conversation, progress tracking + widget, tiered access, furigana.

**Missing (new building blocks the paths need):**
1. **Path / Unit / lifecycle data model** — the ladder structure, unit ordering, gate thresholds.
2. **Daily-loop orchestrator** — assembles review + new + integrate + produce into one session.
3. **Grammar-in-context** — grammar patterns as content + SRS items, with verified example sentences.
4. **Graded reading** — short passages from verified sentences, leveled to i+1.
5. **Kanji radical/mnemonic layer** — component breakdown + mnemonic per kanji (KANJIDIC2/KanjiVG have
   the components; mnemonics need sourcing/authoring).
6. **Hana "scoped session"** — start a conversation constrained to a unit's items + JLPT level.
7. **Production grading** — light feedback on typed/spoken output (Hana can do this).

These are sequenced in `99-roadmap.md` (to be written once the paths are locked).

---

## 5. Open design decisions (we'll resolve these iteratively)

**Resolved:**
- *(Q1)* **Spine = JLPT level ladders.**
- *(Q2)* **Guided default + free roam** — one clear "Today's session" button drives the rail; the
  learner can still freely jump into any bucket or revisit anything. Nothing is locked away.

- *(Q3)* **Content sourcing = extend DR-006, verify by N3.** N5/N4 grammar examples + short readings
  may use training-canonical content marked `content-source: training`; before N3 we stand up a
  **Tatoeba (CC BY) ingestion + i+1 leveling pipeline**, and N3+ content must be verified. (This
  also resolves the old "reading content source" question for N3+: Tatoeba assembly, not
  Hana-generated — generated sentences remain disallowed for any stored/SRS content.)

**Still open:**
1. **Daily-loop shape & length** — the 5-step loop is the working model; target ~12–15 min. Confirm
   or adjust when we build the orchestrator.
5. **Mnemonic authoring** — author our own kanji mnemonics, or integrate an existing component
   scheme/license one. (Resolve before the kanji layer build.)
6. **Build sequencing / MVP** — what ships first (see `99-roadmap.md`).

Paths specced: **N5** (`02-path-n5.md`, template), **N4** (`03-path-n4.md`), **N3**
(`04-path-n3.md`, paid flagship). N2/N1 extend the N3 reading+mining+conversation machinery with
harder content — to be outlined once N3 is validated.

---

*Next: build sequencing — see `99-roadmap.md` (written after the MVP-scope decision).*

---

## 6. Build checklist

High-level tracking for the Learning Paths initiative. Check off items as they ship.

### Planning (this doc set)
- [x] Research foundations (`00-research-foundations.md`)
- [x] Overarching plan — engine, session loop, gating, build inventory (`01-overarching-plan.md`)
- [x] N5 path spec — can-do milestones, unit structure, daily session flavor (`02-path-n5.md`)
- [x] N5 unit map — all 35 units across 8 situations (`02b-n5-units.md`)
- [x] N4 path spec (`03-path-n4.md`)
- [x] N3 path spec (`04-path-n3.md`)
- [x] Retention engine — dimensions, mechanisms, rhythm (`05-retention-engine.md`)
- [x] Onboarding flow — 3 questions, first can-do goal, session entry (`06-onboarding.md`)
- [x] Session loop UI — DS agent prompt for 7-screen session flow (`07-session-loop-ui-prompt.md`)
- [x] Build roadmap — phased sequencing (`99-roadmap.md`)
- [ ] Decision records — Path/Unit data model DR; daily-loop orchestration DR

### Design (design system repo)
- [ ] Session loop UI — 7 screens built and reviewed in DS
- [ ] Onboarding screens — 3-question flow + first session entry
- [ ] Can-do milestone moment — editorial card design

### Phase 1 — N5 guided daily loop
- [x] RecognitionPass component (`src/components/RecognitionPass.tsx`)
- [x] WordsPage with browse / learn / drill / recognition flow (`src/pages/WordsPage.tsx`)
- [x] Basics vocabulary YAML schema + 74 N5 words in place
- [ ] ~117 remaining N5 words added to vocabulary YAML files
- [ ] Path / Unit / PathProgress data model (`src/types.ts`)
- [ ] N5 unit content authored (35 units referencing existing item ids)
- [ ] Daily-loop orchestrator (`src/store/` + `src/srs/`)
- [ ] "Today's session" UI — `/learn` route, 7-screen guided flow
- [ ] Recognize → Recall → Produce gating wired up
- [ ] Close screen — can-do progress, session summary, no score
- [ ] Recognition pass wired into session loop (behind `session_end_check`)
- [ ] Guest can complete multiple consecutive N5 sessions end-to-end

### Phase 2 — Kanji mnemonics + grammar + N4
- [ ] Mnemonic authoring decision locked (open decision §5.5)
- [ ] Kanji component + mnemonic layer (KANJIDIC2/KanjiVG)
- [ ] Grammar patterns as first-class SRS items
- [ ] N4 unit content authored
- [ ] Scoped Hana launch (constrained to unit items + JLPT level)

### Phase 3 — N3 paid flagship
- [ ] Tatoeba ingestion + i+1 leveling pipeline
- [ ] Graded reading library + reader UI
- [ ] In-text sentence mining → SRS
- [ ] Hana structured feedback mode
- [ ] Paywall wired (N3 entry behind tier gate)
