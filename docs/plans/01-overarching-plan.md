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

### 2c. The daily loop (where the levers live)

Each day in a ladder is one orchestrated session, not a menu. Default shape (tunable — see open
decisions):

1. **Warm-up review** (interleaved): the SRS surfaces what's due *across item types* — mix words,
   kanji, grammar, phrases. Interleaving is the point.
2. **New unit** (i+1): introduce the next unit's items with full scaffolding (audio, furigana,
   kanji component breakdown + mnemonic, example sentence).
3. **Integrate**: a short graded reading or cloze that *reuses* today's new items plus recent ones
   (comprehensible input at 95%).
4. **Produce**: one output beat — type a sentence, or a 3–5 turn Hana exchange themed to the unit,
   or read a line aloud (audio in).
5. **Close**: an honest "done for today" with what's now mastered and what's coming due tomorrow.

A session should be completable in a sustainable window (target ~10–15 min; a "short on time"
variant does review + a micro-unit). **Short and repeatable beats long and abandoned.**

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
- **Interleaving** → the warm-up review mixes item types and units, never one bucket.
- **Comprehensible input** → unit ordering + the integrate step keep reading at ~95% known.
- **Output** → the Produce beat every session; Hana scoped to current items.
- **Mnemonics** → kanji component stories; vocab hooks where useful.
- **Habit** → one calm daily loop, visible mastery, gentle re-engagement — **no XP/streak dark
  patterns** (CLAUDE.md).

---

## 3. Progression & gating

- A unit unlocks when its prerequisites are **mastered** (FSRS stability past a threshold), not just
  seen — this enforces i+1 and prevents the "I unlocked it but can't use it" trap.
- The learner always has: **today's due reviews** (always available) + **the next unit** (gated).
- Falling behind surfaces as "reviews due," never as punishment. No streak loss, no lost progress.
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
