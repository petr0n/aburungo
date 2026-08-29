# Book Two, Chapter 4 — Feeling ill and the doctor

**Status: design, not content.** This document specifies every lesson in the chapter in enough
detail that authoring the YAML is mechanical. **No Japanese sentence is composed here.** Words and
phrases are cited by id from Book One's inventory where they already exist; every new word proposed
is a vocabulary specification, not a sentence, and every new *sentence* is a requirement on a later
authoring pass, which follows [03 §9](03-book-two.md) sourcing.

Source brief: [03-book-two.md](03-book-two.md) §1, §2, §4, §9, §10. Worked example (rule chapter,
structure carries over): [book-two-chapter-01.md](book-two-chapter-01.md). Situation-chapter
template (content shape carries over): [`src/content/lessons/n5-22-people-clothes.yaml`](../../src/content/lessons/n5-22-people-clothes.yaml),
with [`n5-21-meals.yaml`](../../src/content/lessons/n5-21-meals.yaml) and
[`n5-18-describing.yaml`](../../src/content/lessons/n5-18-describing.yaml) as secondary reference —
the describing chapter is the direct ancestor of half this chapter's vocabulary.

**Shape landed: 7 teaching lessons + 1 recognition checkpoint — a deliberate deviation from the
10×10 target.** New words: **~9** (+1 optional). New phrases: **~24**. New kanji: **~7** (+2
optional, both conventionally written in kana). New grammar patterns: **3**. The inventory pass
below is why: Book One's `describing` and `people-clothes` files already cover more of "feeling
ill" than the skeleton's one-line summary credits, and padding to 10 would mean teaching material
the learner already has under a new coat of paint. See §5.1.

---

## 1. The inventory pass

Before any new word, here is everything Book One already teaches that this chapter would otherwise
re-teach. All ids are real, pulled from the 484-word manifest.

**Body parts (`describing.yaml`, `people-clothes.yaml`) — 8 words, plus the pain pattern itself:**
`vocab.atama` 頭 head, `vocab.me` 目 eye, `vocab.mimi` 耳 ear, `vocab.kuchi` 口 mouth,
`vocab.ashi` 足 foot/leg, `vocab.karada` 体 body, `vocab.ha` 歯 tooth, `vocab.hana-nose` 鼻 nose.
`vocab.itai` 痛い (painful, sore) is taught with the が-marking rule spelled out in `n5.desc-body`'s
grammarNote — "the part that hurts takes が, not は" — a full pattern already delivered, just never
assigned a `grammar.*` id.

**Feeling and health vocabulary (`describing.yaml`, `people-clothes.yaml`, `nouns.yaml`,
`home-work.yaml`, `n5.yaml`) — a whole register the skeleton's one-line summary doesn't mention at
all:** `vocab.genki` 元気 (healthy, fine), `vocab.daijoubu` 大丈夫 (OK, alright), `vocab.joubu` 丈夫
(healthy, sturdy), `vocab.tsukareru` 疲れる (to get tired), `vocab.nemui` 眠い (sleepy),
`vocab.warui` 悪い (bad — doing double duty as "unwell" the same way it does in English),
`vocab.yasumu` 休む (to rest / take a day off), `vocab.neru` 寝る (to sleep).

**Places and people:** `vocab.byouin` 病院 (hospital — taught in the directions chapter, but never
used in a sentence; no phrase in the manifest uses it) and `vocab.sensei` 先生 (teacher — also how
you address a doctor, a register point worth one line, not a new word).

**Verbs and a noun this chapter recombines rather than reteaches:** `vocab.naru` なる (to become —
already a plain verb, `home-work.yaml`), `vocab.yoyaku` 予約 (reservation, already a noun),
`vocab.denwa` 電話 (telephone), `vocab.hiku` 引く (to pull), `vocab.nomu` 飲む (to drink),
`vocab.suru` する (to do). All six are reused, not reviewed as filler — see §2's idiom notes.

**Kanji already drilled that this chapter's new words recombine:** 気 (from 天気, weather chapter)
and 風 (same chapter) — both resurface inside this chapter's new words without costing a kanji slot.

**What this leaves:** naming the sickness itself (病気), one more body word (お腹) and a short,
concrete symptom list, plus the doctor's half of the conversation, which Book One has zero words
for. That is a real chapter, but it is not a ten-lesson one. See §5.1.

---

## 2. The chapter header comment

Paste this at the top of the lessons file, in the style of the people-clothes and describing
chapters.

```yaml
# Chapter 4 — Feeling ill and the doctor.
#
# Book One already did more of this chapter's work than the plan credits.
# 頭が痛いです has been on the ladder since the describing chapter, and 疲れる,
# 休む, 寝る, 元気, 大丈夫 and 丈夫 came in alongside it -- a whole register of
# feeling-unwell and getting-better vocabulary, built for a different purpose
# and sitting here unused. This chapter's job is narrower than "the body and
# illness": it is the handful of words that register cannot reach on its own
# -- naming the sickness, not just its symptom -- plus the doctor's half of
# the conversation, which nothing in Book One touches at all.
#
#   1  not feeling well      病気, 気分, and noun+になる -- to become
#   2  where else it hurts   お腹, 喉, on the が痛いです pattern you already own
#   3  a fever, and a cold   熱, 風邪, and the 風／風邪 near-homophone
#   4  a cough, and how long 咳, いつから, and the first sentence that needs
#                            chapter 3's connectors to say what it means
#   5  what's wrong?         医者, and どうしましたか built from words you have
#   6  what the doctor says  薬, てください and 飲む recombined, then booking
#   7  getting better        い-adjective+くなる, the mirror of lesson 1
#
# Register default: polite. A doctor is a stranger, and chapter 1's own rule
# -- plain with friends, polite with everyone else, when in doubt polite --
# points this chapter at です／ます even though plain form now exists on the
# ladder. Practicing plain form here is not wrong; the model sentences
# default polite because the situation calls for it.
#
# Two idioms carry real weight and both recombine an owned verb instead of
# teaching a new one: 風邪を引く, to catch a cold, built on 引く (already
# known as "to pull"); and 薬を飲む, to take medicine, built on 飲む (already
# known as "to drink"). Neither needs more than the one line that names the
# reuse -- this is what the book's recombination through-line looks like
# from inside a situation chapter rather than a rule chapter.
#
# Lesson 4 depends on chapter 3's joining-sentences grammar for its reason
# clause, and lesson 5 depends on lesson 4's sentences to answer the
# doctor's question. Both are hard dependencies -- this chapter cannot be
# authored ahead of chapter 3, unlike chapter 1.
#
# content-source: n/a for this file -- it references vocabulary/doctor.yaml
#   and phrases/doctor.yaml, whose own provenance markers apply.
```

---

## 3. Naming and ids

| Thing | Value |
|---|---|
| Chapter id | `b2.chapter-4` |
| Chapter title (learner-facing) | **Feeling ill and the doctor** |
| Lesson `situation` | `Feeling ill and the doctor` |
| Lesson ids | `b2.ill-not-feeling-well`, `b2.ill-where-else`, `b2.ill-fever-cold`, `b2.ill-cough-how-long`, `b2.ill-whats-wrong`, `b2.ill-doctor-says`, `b2.ill-getting-better`, `b2.checkpoint-4` |
| Pattern ids | `grammar.b2-naru-noun`, `grammar.b2-naru-i-adj`, `grammar.b2-doushimashita` |
| Vocabulary file | `src/content/vocabulary/doctor.yaml`, ids `vocab.*` (no book prefix — Book One's vocab ids don't carry one either) |
| Phrase file | `src/content/phrases/doctor.yaml`, id prefix `doctor.*` |
| Lessons file | `src/content/lessons/b2-04-doctor.yaml` |

The skeleton's `&` becomes "and" in the learner-facing title, matching Book One's own convention —
every existing chapter title ("People and what they wear", "Meals and the kitchen") writes it out.

`order`: **use 1–8 within the chapter.** Global order numbers are assigned at book assembly, not here.

---

## 4. The lessons

### Lesson 1 — Not feeling well

- **Title:** Not feeling well
- **Can-do:** Say that you're sick, or that you're fine
- **Teaches:** 病気 as the headline new noun, landed with **noun + になる** — to become/turn into a
  state — reusing the already-known verb なる (`home-work.yaml`) rather than teaching a new one:
  病気になる, to get sick. New word 気分 (feeling, mood) pairs with the **already-known** adjective
  悪い for "I feel unwell" — same が-marking Book One taught for 頭が痛いです, applied to a new noun,
  not a new rule. The trap worth naming: 元気 describes ongoing health/energy, 病気 the ailment
  itself, 気分 a passing feeling — English "well" blurs all three where Japanese keeps them apart.
- **Exercises (existing ids):** `vocab.genki` 元気, `vocab.daijoubu` 大丈夫, `vocab.warui` 悪い,
  `vocab.naru` なる.
- **Exercises (earlier Book Two chapters):** Chapter 1 lesson 7 — the register frame (plain
  with friends, polite with strangers, when in doubt polite) that sets this whole chapter's
  default to です／ます.
- **New vocabulary:** **2** — 病気 (びょうき, illness/sickness) and 気分 (きぶん, feeling/mood). Both
  nouns. Mark `content-source: training`, pending JMdict verification at authoring ([03 §9](03-book-two.md)).
- **New phrases:** 3. One stating you got sick (病気になる, past); one saying you don't feel well
  (気分が悪い); one reassurance reusing 大丈夫 ("I'm fine" / "are you OK?").
- **Depends on:** nothing in this chapter. Assumes Book One's 元気／大丈夫／なる and the register
  frame from Book Two chapter 1's lesson 7 (polite default with strangers — see the header comment).

### Lesson 2 — Where else it hurts

- **Title:** Where else it hurts
- **Can-do:** Say your stomach or throat hurts
- **Teaches:** nothing new grammatically — this lesson is entirely "the が痛いです pattern you
  already own, on two more nouns." お腹 (stomach/belly) and 喉 (throat) join the eight body words
  from the describing chapter. Flag that お腹 keeps its お always — unlike 頭/足/歯/鼻, which never
  take one — the same kind of fixed-prefix note Book One gave お茶 and お弁当.
- **Exercises (existing ids):** `vocab.atama` 頭, `vocab.ashi` 足, `vocab.ha` 歯, `vocab.itai` 痛い,
  and the が-marking pattern from `n5.desc-body`.
- **Exercises (earlier Book Two chapters):** None — built entirely on Book One's
  `n5.desc-body` が-marking pattern.
- **New vocabulary:** **2** — お腹 (おなか, stomach/belly) and 喉 (のど, throat). Both nouns, both
  body parts. 喉's kanji is uncommon at this level; author may keep it kana-only, matching how Book
  One left several words in kana (はく, かぶる).
- **New phrases:** 3. One for お腹が痛い, one for 喉が痛い, one recognition-mixing phrase that
  reuses one of Book One's own body words alongside a new one, so the pattern reads as continuous
  rather than restarted.
- **Depends on:** Book One's `n5.desc-body` pattern only. No dependency on lesson 1.

### Lesson 3 — A fever, and a cold

- **Title:** A fever, and a cold
- **Can-do:** Say you have a fever or caught a cold
- **Teaches:** 熱 (fever) on the **already-known** あります existence pattern — 熱があります, "I
  have a fever," literally "fever exists," the same construction behind Book One's ～はありますか.
  風邪 (a cold) pairs with the **already-known** verb 引く (to pull) in the fixed idiom 風邪を引く,
  to catch a cold — a new collocation on an owned verb, not a new verb. **Flag the homophone trap
  directly:** 風 (wind, from the weather chapter) and 風邪 (a cold) share the reading かぜ and the
  first kanji but are different words; only what follows separates them, the same kind of trap Book
  One flagged for 歯／葉 and 鼻／花.
- **Exercises (existing ids):** `vocab.kaze` 風 (for the contrast), `vocab.hiku` 引く,
  `vocab.aru` ある (existence pattern).
- **Exercises (earlier Book Two chapters):** None — built entirely on Book One's あります
  existence pattern and 引く.
- **New vocabulary:** **2** — 熱 (ねつ, fever) and 風邪 (かぜ, a cold). Both nouns.
- **New phrases:** 3. One stating a fever (熱があります); one stating "I caught a cold"
  (風邪を引きました, past); one negated, to show the pattern isn't fixed to the affirmative
  (熱はありません).
- **Depends on:** nothing new — the あります pattern and 引く are both Book One. Independent of
  lessons 1–2.

### Lesson 4 — A cough, and how long

- **Title:** A cough, and how long
- **Can-do:** Describe a cough, and say how long you've felt this way
- **Teaches:** 咳 (cough) — cheap on its own, which is why this lesson carries the chapter's real
  payload: **duration and reason together.** いつから (since when) reuses から exactly as Book One
  already taught it (`grammar.n5-unit-4`, ～から来ました — から marking a starting point), not a new
  use of the particle. Then the lesson does the job the skeleton names it for: putting a symptom
  sentence in front of a **reason clause**, using Book Two chapter 3's connectors (から／て). This is
  the chapter's one hard external dependency, and the grammarNote should say so outright — the same
  way the plain-form pilot's lesson 5 said out loud it was collecting a debt paid earlier.
- **Exercises (existing ids):** `vocab.itsu` いつ, symptom vocabulary from lessons 1–3, chapter 3's
  connector patterns (external).
- **Exercises (earlier Book Two chapters):** Chapter 3 (から／ので and て as connectors) — a
  symptom sentence placed in front of a reason clause, this chapter's one hard external Book
  Two dependency.
- **New vocabulary:** **1** — 咳 (せき, cough). Noun. Kanji optional, commonly written in kana.
- **New phrases:** 4. One stating a cough; one giving duration with いつから／から; **at least two**
  combining a symptom with a reason clause (e.g. a symptom plus its consequence), since this is the
  lesson the chapter exists to justify and it needs more than a token example.
- **Depends on:** **Book Two chapter 3** (joining sentences) — hard dependency, external to this
  chapter. Within the chapter, loosely on lessons 1–3 for symptom vocabulary to combine.

### Lesson 5 — What's wrong?

- **Title:** What's wrong?
- **Can-do:** Understand "what's wrong?" and explain your symptoms
- **Teaches:** 医者 (doctor, the person — distinct from 病院, the building) and どうしましたか, the
  doctor's stock opening question, built entirely from **already-known pieces**: どう (how) + した
  (past of する) + か (question particle). Worth stating as a no-new-words moment for that one
  phrase, the same way `n5.te-imasu` and the pilot's lesson 1 both call out a zero-new-words lesson
  as the point rather than an apology. The learner answers using the symptom-plus-reason sentences
  built in lesson 4. Review 先生 here as the address term for a doctor — a register note, not a new
  word — and reuse 病院, which has never appeared in a Book One phrase despite being taught since
  the directions chapter.
- **Exercises (existing ids):** `vocab.dou` どう, `vocab.suru` する (past), `vocab.sensei` 先生,
  `vocab.byouin` 病院, plus lesson 4's reason-clause sentences.
- **Exercises (earlier Book Two chapters):** Chapter 3, carried forward from lesson 4 — the
  learner answers どうしましたか using lesson 4's reason-clause sentences.
- **New vocabulary:** **1** — 医者 (いしゃ, doctor). Noun. Note the more polite spoken form お医者さん
  in the grammarNote rather than teaching it as a second word.
- **New phrases:** 4. One どうしましたか question; two or three patient answers that each combine a
  symptom with a reason clause, demonstrating the lesson 4 dependency in a real exchange (single
  utterances, not a scripted back-and-forth — see [03 §7](03-book-two.md)).
- **Depends on:** lesson 4 directly (the reason-clause sentences), and lessons 1–3 for the symptom
  vocabulary being explained.

### Lesson 6 — What the doctor says

- **Title:** What the doctor says
- **Can-do:** Understand simple instructions, and say you'll book a visit
- **Teaches:** 薬 (medicine) slotted into the **fully-known** ～てください request pattern for an
  instruction to rest — 休んでください, reusing 休む with zero new grammar — and into the
  **already-known** 飲む (to drink) for the idiom 薬を飲む, to take medicine (literally "to drink
  medicine") — the second idiom-on-an-owned-verb in this chapter, same move as lesson 3's 風邪を引く.
  Then booking: 予約 (already known, "reservation") + する (already known) = 予約します, and
  電話します reusing 電話 (already known noun). **No new grammar at all** — this lesson is the
  chapter's other "you already have this" moment. **Practical, not clinical**: no dosages
  (how much, how often), no diagnosis language — the instruction taught is "rest" and "take
  medicine," not a prescription.
- **Exercises (existing ids):** `vocab.yasumu` 休む, `vocab.nomu` 飲む, `vocab.yoyaku` 予約,
  `vocab.denwa` 電話, `vocab.suru` する, the Book One ～てください pattern (`grammar.n5-te-ichidan`
  and siblings).
- **Exercises (earlier Book Two chapters):** None — built entirely on Book One's てください
  request pattern, 飲む, 予約 and する.
- **New vocabulary:** **1**, optionally 2 — 薬 (くすり, medicine), noun. Optional: 薬局 (やっきょく,
  pharmacy), take only if a sourced phrase needs it — do not add it to hit a round number.
- **New phrases:** 4. One instruction to rest; one instruction to take medicine; one booking an
  appointment (予約します); one phone statement (電話します).
- **Depends on:** lesson 5 for context (this is what the doctor says back), and Book One's te-form
  chapter for ～てください.

### Lesson 7 — Getting better

- **Title:** Getting better
- **Can-do:** Say you're getting better or worse
- **Teaches:** the mirror of lesson 1's pattern — **い-adjective + くなる** — the adverbial-く
  mechanic the chapter hasn't needed until now: drop the adjective's final い, add く, then なる.
  良くなる (get better, from いい) and 悪くなる (get worse, from the already-known 悪い). Unlike だ
  in the pilot, this mechanism genuinely isn't free — nothing in Book One or Book Two so far teaches
  an adjective's adverbial form — but it is small, and it closes the chapter's arc: got sick (1),
  said what hurt (2–4), saw the doctor (5–6), now recovering (7).
- **Exercises (existing ids):** `vocab.ii` いい, `vocab.warui` 悪い, `vocab.genki` 元気,
  `vocab.naru` なる.
- **Exercises (earlier Book Two chapters):** None — mirrors this chapter's own lesson 1
  (noun＋になる), not any earlier chapter.
- **New vocabulary:** **0.** Every word in this lesson is reused; only the construction is new.
  State that in the grammarNote as a deliberate mirror of lesson 1, not an oversight.
- **New phrases:** 3. One getting better; one getting worse; one closing reassurance reusing 元気に
  なりました (I've recovered — the noun+になる construction from lesson 1, now in the past).
- **Depends on:** lesson 1, for the parallel construction (noun+になる there, い-adjective+くなる
  here) to read as one system rather than two unrelated rules.

### Lesson 8 — Chapter 4 checkpoint

- **Title:** Chapter 4 checkpoint
- **Can-do:** Recognise everything taught so far
- **`checkpoint: recognition`**, `wordIds: []`, `phraseIds: []`, `kanji: []`, no `patternId` — same
  shape as `n5.checkpoint-8` and the pilot chapter's lesson 11.
- **Format:** recall, not tile-tap, per [03 §10](03-book-two.md) — type the reading or meaning.
  Mastery gate: the remaining set shrinks to zero, retries unlimited, nothing recorded, misses
  rejoin the SRS queue (DR-020).
- **Placement:** chapter boundary. Nothing in this chapter blocks an earlier split by dependency —
  lessons 1–3 are mutually independent — but the chapter is short enough that splitting it would
  produce a checkpoint too small to be worth its own screen.

---

## 5. Totals

| | Count | Against the book's per-lesson average |
|---|---|---|
| Teaching lessons | **7** | below the ~10 target — see §5.1 |
| Checkpoints | 1 | one per chapter (DR-021) |
| New words | **~9** (+1 optional: 薬局) | **1.3/lesson vs. 5.7** — see §5.1 |
| New phrases | **~24** | 3.4/lesson, in line with Book One's situation chapters |
| New grammar patterns | 3 | `b2-naru-noun`, `b2-naru-i-adj`, `b2-doushimashita` |
| New kanji | **~7** (+2 optional, kana-preferred: 喉, 咳) | well under Book One's 2.3/lesson average |

Mandatory new kanji: 病 (病気), 腹 (お腹), 熱, 邪 (風邪), 医, 者 (医者), 薬. 気 and 風 recombine from
the weather chapter and are **not** relisted, matching how `n5.people-tops` excluded 着 because it
was already in use.

---

## 6. The open calls

### 6.1 Seven lessons, not ten

**Answer: 7 teaching lessons, and the inventory pass in §1 is the argument.**

The skeleton's one-line summary — "Book One teaches 痛い and 頭; this adds 病気, お腹 and the
symptom vocabulary" — undersells how much ground Book One already covers. It isn't two words the
learner already has; it's eight body-part words, the が-marking pattern for pain, and an entire
adjacent register of feeling-unwell and recovery vocabulary (元気, 大丈夫, 丈夫, 疲れる, 眠い, 悪い,
休む, 寝る) built in the describing and home-and-work chapters for a different purpose and sitting
here, unused, exactly on topic. A chapter that starts from that position and still tries to fill ten
lessons has to either invent clinical vocabulary this chapter is explicitly told to avoid (no
dosages, no diagnoses) or pad with review dressed as new material.

Ten lessons' worth of *genuinely* new content isn't there. Seven is. The plan explicitly allows
this ("some chapters may deviate to 7. Make this about learning not about strict 10x10") and this
is the case it was written for.

**Where the material could stretch, if the owner wants it back to 8 or 9:** 薬局 (pharmacy) as its
own lesson rather than an optional word in lesson 6 — a genuinely useful resident scenario (getting
over-the-counter medicine without a doctor visit) that stays on the right side of "practical, not
clinical." I'd take this over inventing symptom vocabulary the chapter doesn't need, if the owner
wants the count higher. I did not take it by default, because "take only what a sourced sentence
needs" (03 §4's own rule for situation chapters) argues against manufacturing an eighth lesson to
hit a number.

### 6.2 The なる pattern, split across lessons 1 and 7 rather than taught together

**Answer: split, on purpose.**

Noun+になる (病気になる) and い-adjective+くなる (悪くなる) are the same underlying idea — become —
but teaching both conjugation rules back-to-back in lesson 1 would front-load a mechanical grammar
point onto the lesson that's supposed to be about naming the sickness, and it would leave nothing
for the chapter's back half to teach beyond vocabulary. Splitting them lets lesson 1 stay about 病気
and lesson 7 close the chapter's narrative arc (sick → symptoms → doctor → recovering) with a
construction the learner already half-owns from lesson 1, which is a stronger recognition moment
than teaching both halves cold in one sitting.

### 6.3 Register defaults to polite, breaking from chapter 1's plain-form momentum

**Answer: polite, and it's worth stating explicitly rather than leaving it implicit.**

Book Two chapter 1 spends ten lessons building plain form and ends on "talking like a friend." This
chapter's situation is the opposite case chapter 1's own lesson 7 named: a doctor is a stranger, and
"when in doubt, polite" points every model sentence here at です／ます. A learner is free to apply
plain form in an informal telling-a-friend-you're-sick context, but the chapter's sourced phrases
should default polite — otherwise the two chapters read as contradicting each other rather than
each covering the register it's actually for.

---

## 7. Two things I think the plan is wrong or silent about

**The skeleton's blurb is silent about the doctor entirely.** "Book One teaches 痛い and 頭; this
adds 病気, お腹 and the symptom vocabulary" describes a chapter about symptoms, not one about a
doctor visit — but the chapter title is "Feeling ill **& the doctor**," and nothing in the skeleton
names 医者 or 薬, or a doctor's-side vocabulary at all. That's not a contradiction, but it means the
skeleton's word list can't be read as complete, and an author working from the blurb alone would
build a chapter that never reaches the doctor. Lessons 5–6 exist to close that gap; they aren't
implied by anything in 03 §4.

**This chapter is proof that §4's overshoot assumption doesn't hold, and it's worse than the rule
chapter that first exposed the problem.** The pilot chapter's own §5.3 flagged that Book Two's rule
chapters will underdeliver on vocabulary and kanji against §3's targets, and leaned on situation
chapters to make it up — "the three situation chapters are word-dense by nature and will overshoot."
This chapter doesn't overshoot; at ~9 words over 7 lessons it undershoots Book One's situation-
chapter norm (5.7/lesson) far harder than the pilot's own rule chapter did (1.2/lesson). Not because
the situation is thin in real life — colds and doctor visits are ordinary — but because Book One
front-loaded an unusual amount of this exact vocabulary for other reasons (describing chapter's body
words, home-and-work chapter's rest/tired words). If the other two situation chapters (making plans,
trouble) turn out anywhere near this thin after their own inventory pass, the book's ~570-word and
~200-kanji targets in §3 are at real risk from both directions at once, and the fix can't be "the
situation chapters will cover it" — that lever may not be there. Worth measuring after chapter 8
ships, the same way §6 of the pilot asked for the kanji arithmetic to be re-measured after chapter 3.

**Smaller: this chapter cannot be authored out of order, unlike the pilot.** The pilot's §6 flagged
its own chapter as a good candidate to author ahead of the kanji component layer, since it needed
almost no kanji. This chapter is similarly kanji-light (~7 against Book One's 2.3/lesson average),
which might suggest the same move — but lesson 4's reason clauses and lesson 5's answers both hang
on Book Two chapter 3's joining-sentences grammar shipping first. Kanji-lightness and authoring
order are separate questions, and for this chapter they point in different directions.

---

## 8. Authoring checklist

1. **Sourcing.** All ~9 words marked `content-source: training`, verified headword-by-headword
   against JMdict for Applications 3.6.2, and `# jlpt-source: training` where a level is asserted
   ([03 §9](03-book-two.md), CLAUDE.md). All ~24 phrases are composed sentences, which JMdict cannot
   verify — training-canonical, marked, pending Tatoeba verification.
2. **Commit messages** on every content commit must name the source, or the commit is rejected.
3. **No dialogue.** Lesson 5's どうしましたか exchange is the risk, same shape as the pilot's lesson
   7 — independent single utterances (a question, a couple of answers), never a scripted
   back-and-forth ([03 §7](03-book-two.md)).
4. **Stay practical, not clinical.** No dosages, no frequency-of-use instructions, no diagnosis
   language. "Rest" and "take medicine" are the ceiling of what the doctor tells the learner to do.
5. **Confirm chapter 3 has shipped** before authoring lessons 4 and 5 — the reason-clause dependency
   is real, not decorative.
6. **The composition frame.** [03 §0b/§8](03-book-two.md) requires each lesson's frame authored
   alongside the lesson. Seven frames, one per teaching lesson.
7. **Run `pnpm walkthrough`** before merge.
