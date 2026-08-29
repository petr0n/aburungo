# Book Two, Chapter 9 — the conditionals chapter

**Status: design, not content.** This document specifies every lesson in the chapter in enough
detail that authoring the YAML is mechanical. **No Japanese sentence is composed here.** Words and
verb forms are cited by id from Book One's inventory or from Book Two Chapter 1's already-designed
new vocabulary; every example *sentence* is a requirement on a later authoring pass, which follows
[03 §9](03-book-two.md) sourcing.

Source brief: [03-book-two.md](03-book-two.md) §1, §2, §4, §9, §10. Worked example:
[book-two-chapter-01.md](book-two-chapter-01.md), which this document matches in shape. Model
lesson file: [`src/content/lessons/n5-16-te-form.yaml`](../../src/content/lessons/n5-16-te-form.yaml).

**Shape landed: 9 teaching lessons + 1 recognition checkpoint — 10 total, within the ~10 target.**
New words: **1** (方, kept in kana). New verbs: **0** — see §5.2, one owner decision away from
changing. New phrases: **~34**. New kanji: **~0** — see §6. Of the 9 teaching lessons, **3 teach no
new grammar at all**; their entire content is choosing correctly among forms already taught. That
ratio is this chapter's answer to its own row in the skeleton: "たら, ば, と — and when each is
wrong."

---

## 1. The chapter header comment

Paste this at the top of the lessons file, in the style of the te-form and plain-form chapters.

```yaml
# Chapter 9 — If and when.
#
# Three forms translate to the same two English words, "if" and "when," and a
# course that teaches them in sequence and trusts the overlap to sort itself
# out has taught three ways to be almost right. English gives a learner no
# reason to reach for one over another, so the reaching has to be taught
# directly -- not as a footnote on each form's lesson, but as its own
# exercise, repeated. This chapter answers that by pairing every new form
# with a lesson that does nothing but contrast it against what came before:
# three of the nine teaching lessons introduce no new grammar at all. Their
# whole job is choosing.
#
# The three forms are not equally expensive, and the chapter's shape follows
# the cost, the same rule chapter 1 and the potential-forms chapter used.
#
# たら costs nothing to build. It is chapter 1's plain past plus ら, on every
# word type without exception -- verb, い-adjective or noun/な-adjective all
# collapse to the same だった／かった shape before ら ever attaches. A learner
# who did chapter 1 owns this form before the lesson starts, which is why it
# is taught first and treated as the default for the rest of the chapter --
# when unsure, たら is very often the safe answer, and later lessons say so
# explicitly. It still gets two lessons, because it does two different jobs
# that fail in different ways: the everyday hypothetical, and a "when"
# reading that arrives mid-book already contested -- chapter 3's とき claims
# "when" first, and this is a second, different "when" that a learner will
# reach for the wrong one of without being told they are different words for
# different things.
#
# と costs almost nothing to build -- dictionary form plus と, no conjugation
# at all -- and almost everything to use correctly, because its one real rule
# is a restriction: the result has to be automatic, never chosen. A request,
# an invitation, a suggestion in the second clause is simply wrong there,
# where たら carries all three without strain. That asymmetry is the lesson,
# and it is followed immediately by the chapter's first dedicated contrast
# lesson, because と-for-たら is the mistake an English-speaking learner makes
# first and most often.
#
# ば is the one genuinely new mechanic in the chapter -- a conditional stem
# nothing in Book One built -- but it is a single uniform rule, the same
# shape as chapter 1's ない and the potential-forms chapter's え-row rule:
# every godan ending shifts to the え row and takes ば, ichidan drops る for
# れば, and unlike ない it has no exceptions of its own -- う verbs are
# regular here (買う → 買えば, not the わ that ない forces), and so is ある
# (あれば). One lesson for verbs, cheap because the rule is uniform; a second
# for adjectives and nouns, where い-adjectives reuse the かった stem a
# learner already owns and nouns/な-adjectives borrow なら -- the only piece
# of a fourth conditional this chapter admits. なら as its own topic-based
# register, "well, if that's the case," is a named leftover, not taught here.
# ば's contrast lesson follows immediately after, mirroring と's.
#
# 〜たほうがいい rides in last, per the book plan's own instruction that
# advice travels with conditionals, and it rides on たら specifically:
# "if you're tired, you should rest" is the sentence this chapter has been
# building toward, made from a form the learner already had (chapter 1's た)
# plus the form they just spent four lessons on (たら). Its negative twin,
# 〜ないほうがいい, reaches back further, to chapter 1's ない, and costs
# nothing extra. Placed last, it reads as the payoff the chapter was for
# rather than a fourth form competing with the other three.
#
# The chapter closes on a capstone that is not the checkpoint: all three
# forms in the same lesson, chosen against each other rather than in pairs.
# A learner who can beat たら against と, and たら against ば, one pair at a
# time, has not yet had to hold all three in mind at once -- this lesson asks
# for that, and folds in lesson 8's advice pattern so the chapter's two
# threads close together. The checkpoint after it is recognition only, per
# DR-021.
#
#    1  if you have time              たら, the everyday hypothetical
#    2  when you get there            たら's other reading, and where it
#                                      differs from とき
#    3  press it, and it opens        と, the automatic consequence
#    4  two ifs that aren't the same  たら vs と, dedicated
#    5  a third way to say if         ば, verbs
#    6  if it were                    ば, adjectives and nouns; なら
#    7  picking the right if          ば vs たら, dedicated
#    8  you'd better                  〜たほうがいい／〜ないほうがいい
#    9  when each is wrong            all three, capstone
#
# Lessons 4, 7 and 9 depend on everything before them and teach no new form,
# so this chapter cannot be split by a checkpoint before lesson 9 -- the same
# constraint chapter 1 and the te-form chapter carry for the same reason.
#
# content-source: n/a for this file -- it references vocabulary/conditionals.yaml
#   and phrases/conditionals.yaml, whose own provenance markers apply.
```

---

## 2. Naming and ids

| Thing | Value |
|---|---|
| Chapter id | `b2.chapter-9` |
| Chapter title (learner-facing) | **If and when** — the skeleton's label, "Conditionals," is a grammarian's name; see §6 |
| Lesson `situation` | `If and when` |
| Lesson ids | `b2.cond-tara-if`, `b2.cond-tara-when`, `b2.cond-to`, `b2.cond-tara-to-contrast`, `b2.cond-ba-verbs`, `b2.cond-ba-adj-noun`, `b2.cond-ba-tara-contrast`, `b2.cond-hougaii`, `b2.cond-three-way` |
| Pattern ids | `grammar.b2-cond-tara-if`, `grammar.b2-cond-tara-when`, `grammar.b2-cond-to`, `grammar.b2-cond-ba-verbs`, `grammar.b2-cond-ba-adj-noun`, `grammar.b2-cond-hougaii` — lessons 4, 7 and 9 teach no new pattern and need none |
| Vocabulary file | `src/content/vocabulary/conditionals.yaml`, ids `vocab.*` (same id space as Book One and Chapter 1, not book-scoped) |
| Phrase file | `src/content/phrases/conditionals.yaml`, id prefix `cond.` |
| Lessons file | `src/content/lessons/b2-09-conditionals.yaml` |

`order`: **use 1–10 within the chapter.** Global order numbers are assigned at book assembly, per
chapter 1's own note.

---

## 3. The lessons

Every `wordIds` entry below is a real Book One id from the manifest, except とき, which is cited by
word only — it belongs to Book Two Chapter 3, not yet authored, and gets no fabricated id here,
following the same convention chapter 6 used for chapter 1's こと before chapter 1 shipped.

### Lesson 1 — If you have time

- **Title:** If you have time
- **Can-do:** Say what you'll do if something happens
- **Teaches:** たら, built from Chapter 1's plain past (た／だった／かった) plus ら, on every word
  type with no exception — the cheapest form in the chapter, because it reuses a table the learner
  already owns in full. Frame it as the default: when a learner is unsure which conditional to
  reach for, たら is very often the safe answer, and the rest of the chapter refers back to that
  framing. This lesson covers only the ordinary hypothetical "if" reading — an uncertain or
  not-yet-true condition. The "when" reading is lesson 2's job, kept separate on purpose: the two
  readings fail differently, and conflating them is a more common error than missing either alone.
- **Exercises (existing ids):** `vocab.jikan` 時間, `vocab.aru` ある, `vocab.yasui` 安い,
  `vocab.kau` 買う, `vocab.tenki` 天気, `vocab.ii` いい, `vocab.gakusei` 学生 — one verb-based, one
  い-adjective-based, and one noun-based (だったら) hypothetical, so the "everything collapses to
  the same shape" claim is shown, not just told.
- **Exercises (earlier Book Two chapters):** Chapter 1 lessons 4 through 6 (なかった's
  い-adjective link, た, and だ／だった) — たら is built directly from chapter 1's plain-past table
  across every word type.
- **New vocabulary:** none.
- **New phrases:** 3. One verb たら hypothetical (built on `vocab.aru` or a similarly owned verb);
  one い-adjective たら hypothetical (安かったら or equivalent); one noun/な-adjective たら
  hypothetical via だったら. All three word types must appear across the three phrases.
- **Depends on:** Book Two Chapter 1 lesson 5 (plain past た) directly. The noun and adjective
  halves depend on Chapter 1 lessons 4 and 6 (なかった's い-adjective link, and だ／だった).

### Lesson 2 — When you get there

- **Title:** When you get there
- **Can-do:** Tell someone what to do once something happens, and tell たら's "when" apart from とき
- **Teaches:** the same たら form doing a different job — a specific, expected future event
  ("when," not "if"), typically paired with a request or suggestion in the second clause. This is
  the form's real superpower: と cannot carry a request there, and ば strains under one, but たら
  does it without effort. This lesson also covers たら's **discovery reading** — 家に帰ったら〜が
  あった-shaped, where the first clause's completion reveals the second rather than causing it, a
  genuinely non-English pattern worth naming rather than leaving a learner to absorb by accident.
  The grammarNote must distinguish this "when" from Book Two Chapter 3's とき: とき marks the time a
  state or event holds (若いとき, "when [I was] young") with no implication that the first clause's
  completion matters to the second; たら's "when" implies the opposite — the first happening is
  what makes the second relevant or possible. Both translate to English "when," which is exactly
  why the distinction has to be said, not assumed, and exactly why it belongs in this lesson rather
  than chapter 3's, since chapter 3 will not know this form exists yet.
- **Exercises (existing ids):** `vocab.ie` 家, `vocab.kaeru` 帰る, `vocab.tsuku` 着く — paired with
  Book One's 〜てください (`grammar.n5-te-ichidan` family) for the request-combination phrase.
- **Exercises (earlier Book Two chapters):** Chapter 3 (とき) — contrasted directly in the
  grammarNote so the two competing "when"s don't blur: とき marks a time a state holds, while
  たら's "when" implies the first clause's completion makes the second relevant.
- **New vocabulary:** none.
- **New phrases:** 3. One たら clause with a request or suggestion in the main clause (the
  compatibility point that lesson 4 will lean on); one discovery-reading たら with a past-tense main
  clause; one plain "when this specific future thing happens" statement without a request, so the
  reading is shown to survive outside the request context too.
- **Depends on:** lesson 1.

### Lesson 3 — Press it, and it opens

- **Title:** Press it, and it opens
- **Can-do:** Describe something that always happens as a result of something else
- **Teaches:** と — dictionary form (or negative dictionary form) plus と, no conjugation at all,
  the cheapest form to build in the whole chapter. What the lesson actually carries is the
  restriction that makes と narrower than たら: the second clause has to be automatic — a mechanical
  result, a natural law, a habitual or repeated pattern — never a request, invitation, suggestion,
  or a one-off plan the speaker is choosing. State the restriction as a rule with teeth, not a
  footnote, since it is the single most useful fact in the chapter for telling と and たら apart.
- **Exercises (existing ids):** `vocab.osu` 押す and `vocab.aku` 開く — a mechanical push/open pair
  already sitting in Book One's vocabulary, so the textbook と example needs no new noun for
  "button" or "door"; `vocab.haru` 春, `vocab.naru` なる, `vocab.hana` 花, `vocab.saku` 咲く —
  spring-becomes-flowers-bloom, the other textbook と example, also fully owned.
- **Exercises (earlier Book Two chapters):** Chapter 1 lesson 1 (the dictionary form, named)
  — と attaches to it directly, with no conjugation needed.
- **New vocabulary:** none.
- **New phrases:** 4. One mechanical cause-and-effect (押す／開く); one seasonal or habitual natural
  pattern (春／なる／咲く); one repeated-habit statement carrying a frequency sense. The fourth item
  is **not a phrase to source** — it is a grammarNote example of what と cannot do (a request in the
  result clause), stated as prose, since an ungrammatical sentence is not content.
- **Depends on:** Book Two Chapter 1 lesson 1 (the dictionary form, named).

### Lesson 4 — Two ifs that aren't the same

- **Title:** Two ifs that aren't the same
- **Can-do:** Choose between たら and と for a given situation, and say why the other one is wrong
- **Teaches:** no new form. The lesson is two minimal pairs, each pair sharing a real-world setup
  and differing only in which conditional fits. **Pair one:** the same push-open action, once as a
  general or mechanical statement (と fits) and once as a specific one-time future plan (たら fits)
  — "when you press it, it opens" against "if you press it, tell me" is the *shape* of the pair, not
  the wording; sourcing decides the words. **Pair two:** a habitual or repeated statement that takes
  と, against a version of the same real-world content that ends in a request or suggestion and
  therefore must take たら — so lesson 3's restriction is seen working, not just repeated as a rule.
- **Exercises (existing ids):** reuse of lessons 1–3 — `vocab.osu` 押す, `vocab.aku` 開く,
  `vocab.jikan` 時間, `vocab.kaeru` 帰る.
- **Exercises (earlier Book Two chapters):** None beyond this chapter's own lessons 1
  through 3 — a dedicated contrast lesson between them.
- **New vocabulary:** none.
- **New phrases:** 4 — two matched pairs, as described above. **Each pair must be two independently
  sourced sentences, not one sentence edited to produce its "partner."** [03 §7](03-book-two.md)'s
  ban on editing inside a sentence applies exactly here, and this is the lesson where an author is
  most likely to be tempted to break it — see §7 below.
- **Depends on:** lessons 1–3.

### Lesson 5 — A third way to say if

- **Title:** A third way to say if
- **Can-do:** Build the conditional form of any verb
- **Teaches:** ば, the one genuinely new mechanic in the chapter. Godan verbs move their last sound
  to the え row and add ば — 書く→書けば, 読む→読めば, 急ぐ→急げば — one rule across all eight
  endings, the same shape as chapter 1's ない rule, and with no exceptions of its own: う-ending
  verbs take けば regularly (会う→会えば, not the わ that ない forces), and ある is regular too
  (あれば). This lesson is cheaper than either of chapter 1's ない lessons despite being genuinely
  new material. Ichidan drops る and adds れば; する becomes すれば, 来る becomes くれば. This
  lesson is form only — what ば is *for* is lesson 6's job, once both conjugation classes are on
  the table.
- **Exercises (existing ids):** `vocab.isogu` 急ぐ, `vocab.kaku` 書く, `vocab.yomu` 読む,
  `vocab.au` 会う (the う-ending verb, shown regular here on purpose — a direct callback to chapter
  1's う→わ exception for ない, so the learner sees ば does not repeat it), `vocab.taberu` 食べる,
  `vocab.suru` する, `vocab.kuru` 来る.
- **Exercises (earlier Book Two chapters):** Chapter 1 lesson 3 (the う→わ exception under ない)
  — 会う is shown regular under ば (買えば, not 買わる) as a direct callback showing ば does not
  repeat that exception.
- **New vocabulary:** none.
- **New phrases:** 4 — one per conjugation class (godan, ichidan, する, 来る), plain mechanical
  demonstrations of the form with no flavour attached yet.
- **Depends on:** the godan/ichidan distinction (Book One's te-form chapter, reused throughout
  Book Two Chapter 1). Not dependent on lessons 1–4.

### Lesson 6 — If it were

- **Title:** If it were
- **Can-do:** Talk about hypothetical situations and general truths
- **Teaches:** the rest of ば's shape — い-adjectives drop い and add ければ (高い→高ければ), reusing
  the same stem chapter 1's かった already taught, so the mechanism is a recognition, not a new
  rule; いい is the one irregular, taking よければ, not いければ, worth flagging since いい's past
  (よかった) already shares the irregular stem. Nouns and な-adjectives use なら in ば's place
  (学生なら, 元気なら) — the only piece of a fourth conditional this chapter admits; なら as its own
  topic-highlighting register ("well, if that's the case...") is a named leftover, not taught here.
  Then the flavour lesson 5 deferred: ば reads as hypothetical or as a general-truth/proverb-shaped
  statement, and sits awkwardly on a concrete one-time plan — which lesson 7 drills directly.
- **Exercises (existing ids):** `vocab.takai` 高い, `vocab.yasui` 安い, `vocab.ii` いい,
  `vocab.genki` 元気, `vocab.gakusei` 学生, `vocab.isogu` 急ぐ (reused for a general-truth-shaped
  statement).
- **Exercises (earlier Book Two chapters):** Chapter 1 lesson 4 (the かった stem) — reused
  unchanged for い-adjectives' ければ conjugation under ば.
- **New vocabulary:** none.
- **New phrases:** 4 — one い-adjective ば; one よければ specifically (いい's irregular); one なら
  with a noun or な-adjective; one general-truth or proverb-flavoured statement built from owned
  vocabulary, sourced from Tatoeba if one exists at this vocabulary band. **If it cannot be sourced,
  cut to 3** rather than reaching for an unsourceable proverb — the same rule chapter 1 applies to
  its own optional third phrase.
- **Depends on:** lesson 5.

### Lesson 7 — Picking the right if

- **Title:** Picking the right if
- **Can-do:** Choose between ば and たら for a given situation, and say why
- **Teaches:** no new form — ば's dedicated contrast lesson, mirroring lesson 4's shape exactly.
  **Pair one:** a general, hypothetical or proverb-shaped statement (ば fits) against the same
  real-world content stated as a concrete, one-time future plan (たら fits; ば reads odd or overly
  formal there). **Pair two:** a statement with a request or suggestion in the result clause, where
  たら carries it comfortably and ば strains. と is **not** this lesson's target and gets at most a
  one-line callback in the grammarNote: the productive confusion in real use is と-against-たら and
  ば-against-たら, not と-against-ば directly, which is why this chapter puts たら at the centre of
  both dedicated contrast lessons rather than covering all three pairings.
- **Exercises (existing ids):** reuse of lessons 1, 5 and 6 — `vocab.takai` 高い, `vocab.yasui` 安い,
  `vocab.isogu` 急ぐ, `vocab.jikan` 時間, `vocab.kaeru` 帰る.
- **Exercises (earlier Book Two chapters):** None beyond this chapter's own lessons 1, 2, 5
  and 6 — a dedicated contrast lesson between them, mirroring lesson 4's shape.
- **New vocabulary:** none.
- **New phrases:** 4 — two matched pairs, same sourcing constraint as lesson 4: each half
  independently sourced, never one sentence edited into its partner.
- **Depends on:** lessons 1–2 and 5–6.

### Lesson 8 — You'd better

- **Title:** You'd better
- **Can-do:** Recommend what someone should or shouldn't do
- **Teaches:** 〜たほうがいい, built from Chapter 1's plain past (た) plus ほう (side, alternative)
  plus いい — advice framed as "this side is the better one," softer than a command and distinct
  from chapter 5's 〜ましょう／〜ませんか, which proposes doing something *together* rather than
  recommending what the listener alone should do. The negative twin, 〜ないほうがいい, is built from
  Chapter 1's plain negative (ない) directly with no further change — the cheaper half, and it gets
  equal room, since "you'd better not" is at least as useful as "you'd better." Deliberately pair at
  least one example with a たら clause — 疲れたら、休んだほうがいいです-shaped — since that sentence
  is what the whole chapter has been building toward, and the reason the book plan places advice
  here rather than anywhere earlier.
- **Exercises (existing ids):** `vocab.tsukareru` 疲れる, `vocab.yasumu` 休む, `vocab.taberu` 食べる,
  `vocab.nomu` 飲む.
- **Exercises (earlier Book Two chapters):** Chapter 1 lessons 3 and 5 (ない and た) —
  〜たほうがいい／〜ないほうがいい are built directly from both; loosely this chapter's own lesson 1 (たら)
  for the combination phrase.
- **New vocabulary:** **1** — ほう (方), the head noun of the pattern, with no independent life
  outside it. Kept in kana rather than given the 方 kanji — the same treatment chapter 1 gave こと,
  a grammatical noun this common conventionally staying in hiragana even where a kanji exists.
- **New phrases:** 4 — one affirmative たほうがいい; one negative ないほうがいい; one combined with a
  たら clause (the advice-rides-with-conditionals sentence); the fourth is a grammarNote contrast
  against ましょう／ませんか stated as prose, not a phrase, so the register distinction is said once
  rather than demonstrated twice.
- **Depends on:** Book Two Chapter 1 lessons 3 and 5 (ない and た). Loosely on lesson 1 (たら) for
  the combination phrase — not a hard dependency.

### Lesson 9 — When each is wrong

- **Title:** When each is wrong
- **Can-do:** Recognise which conditional a native speaker would actually use, out of all three
- **Teaches:** no new form — the capstone, and deliberately not shaped like lessons 4 and 7. Those
  pit two forms against each other; this one gives a situation and asks which of all three fits,
  which is a different and harder task than either binary choice, and the first time the chapter
  asks for it. Also the first lesson to fold in lesson 8's advice pattern, closing the chapter on
  the combination it was built around: a situation, the right conditional, and — where it fits —
  the recommendation that follows from it.
- **Exercises (existing ids):** the chapter's full working set — `vocab.osu` 押す, `vocab.aku` 開く,
  `vocab.jikan` 時間, `vocab.kaeru` 帰る, `vocab.isogu` 急ぐ, `vocab.takai` 高い,
  `vocab.tsukareru` 疲れる, `vocab.yasumu` 休む.
- **Exercises (earlier Book Two chapters):** None beyond this chapter's own lessons 1
  through 8 — the capstone draws on all of them without adding new earlier-chapter material.
- **New vocabulary:** none.
- **New phrases:** 5. Three parallel situations, each correctly resolved by a *different* one of
  the three forms, so all three appear used correctly inside the same lesson rather than only
  referenced; one item where a plausible-looking wrong form is named and rejected in the
  grammarNote — not authored as a phrase, since a wrong sentence is not content to source; one that
  chains a conditional into 〜たほうがいい, closing the chapter's two threads together.
- **Depends on:** lessons 1–8.

### Lesson 10 — Chapter 9 checkpoint

- **Title:** Chapter 9 checkpoint
- **Can-do:** Recognise everything taught so far
- **`checkpoint: recognition`**, `wordIds: []`, `phraseIds: []`, `kanji: []`, no `patternId` — same
  shape as `n5.checkpoint-6` and Chapter 1's own checkpoint.
- **Format (03 §10):** recall — type the reading or meaning — not tile-tap. Mastery gate, not a
  grade: the remaining set shrinks to zero, retries unlimited, nothing recorded, misses rejoin the
  SRS queue (DR-020).
- **Placement:** chapter boundary, coinciding with the ~10-lesson cadence (DR-021). The chapter
  **must not** be split earlier — lessons 4, 7 and 9 depend on everything before them.

---

## 4. Totals

| | Count | Against the book's per-lesson average |
|---|---|---|
| Teaching lessons | 9 | within the ~10 target (03 §4) |
| Checkpoints | 1 | one per chapter (DR-021) |
| New words | **1** (方) | far below 5.7 — deliberate, mirrors chapter 1; see §5 |
| New verbs | **0** | deliberate; see §5.2 for sensitivity to the owner's open call |
| New phrases | **~34** | 3.8/lesson vs. Book One's rule chapters at ~3 — higher because the three contrast lessons need paired sentences, not single ones |
| New grammar patterns | **6** (of 9 teaching lessons) | lessons 4, 7 and 9 teach no new form — that ratio is the chapter's answer to "when each is wrong" |
| New kanji | **~0** | see §6 |

---

## 5. Design calls

### 5.1 なら is scoped narrowly, as ば's noun/な-adjective shape only

Japanese teaching materials often present four conditionals — たら, ば, と, なら — but the plan's
own skeleton names exactly three: "たら, ば, と — and when each is wrong." なら appears in this
chapter anyway, because there is no way to say "if [noun/な-adjective]" using ば's own conjugation —
copulas do not take ば, they take なら instead, so a chapter that taught ば's verb and い-adjective
shapes but skipped nouns and な-adjectives would leave a real gap. What this chapter does **not**
do is teach なら as its own fourth pattern with its own topic-highlighting register ("ああ、頭が痛い
なら、休んだほうがいいですよ" — responding to what the listener just said, rather than stating a
hypothesis). That is a named leftover, and a real one — worth flagging to the owner since the plan's
"named leftovers" paragraph does not mention it, unlike 〜たほうがいい, which it names explicitly.

### 5.2 Fresh verbs — sensitivity flagged, not argued

The open owner decision — whether Book Two's rule chapters bring fresh verbs, as the te-form
chapter did, or drill only Book One's 87 — is one decision for all seven rule chapters, and this
document does not re-argue it. This chapter's design is **moderately sensitive** to the answer:
the lesson sequence, the contrast method, and 〜たほうがいい's placement do not change either way —
only the `wordIds` lists and the "new vocabulary" counts would. Unlike the te-form chapter, this
chapter has no structural need for fresh verbs: ば's rule is uniform across every godan ending (no
row is under-covered the way て-form's ぐ／ぬ／ぶ were), and Book One's 87 verbs already span every
conjugation class the chapter touches. Both variants, stated concretely:

- **No fresh verbs (this document's default):** 1 new word (方), 0 new verbs, ~34 phrases built
  entirely from Book One's existing 87 verbs and its noun/adjective inventory, as specified in §3.
- **Fresh verbs, te-form style:** 2–3 new verbs per formation lesson (1, 3, 5) so the rule is
  practised on unfamiliar material — likely candidates from outside Book One's coverage (none
  identified here, since this document does not select them; that is the fresh-verb variant's own
  authoring task). Contrast lessons (4, 7, 9) should stay on the shared, already-established set
  regardless, since a contrast lesson's job is recognising a *situation*, not learning a new verb.

### 5.3 Why every contrast lesson centres on たら

Lessons 4 and 7 both pit a new form against たら, never against each other. This is deliberate: たら
is the form a learner reaches for by default (per lesson 1's framing), so the productive confusion
is always "why not たら here" — と-vs-ば confusion is comparatively rare in practice, since the two
occupy different registers (mechanical/habitual vs. hypothetical/general) that rarely compete for
the same sentence. Putting たら at the centre of both contrast lessons means every dedicated
contrast lesson answers the question a learner is actually likely to ask.

### 5.4 Why 〜たほうがいい is placed last, not with たら

たほうがいい needs only Chapter 1's た and ない — nothing forces it after と or ば. It is placed
last anyway because the plan's instruction is that advice *rides with* conditionals, not that it
is one, and placing it after all three are secure means a learner meets it as an application of
what they just built (a conditional clause, followed by a recommendation) rather than a fourth,
competing grammar point. It also gives lesson 9's capstone real material: an advice-flavoured
scenario is the single best test of "which conditional fits," since たら is almost always the right
answer there and the capstone can show why.

---

## 6. Things I think the plan is wrong or silent about

**The kanji shortfall Chapter 1 flagged (§6 of that document) gets worse here, not better.** This
chapter contributes roughly **zero** new kanji — 方, the one candidate, is conventionally kept in
kana in this construction, the same call Chapter 1 made for こと. A chapter this kanji-light,
following one that was already kanji-light, is a second data point for the same concern Chapter 1
raised: rule chapters structurally cannot carry Book One's measured 2.3-kanji-per-lesson average
unless they bring fresh vocabulary, which most of them are not doing. Flagging, not fixing, same as
Chapter 1 — but worth restating because it is now two chapters running the same way, not one.

**"Conditionals" is a grammarian's label, same issue Chapter 1 found with "Plain form."** The
skeleton's row name should not reach the learner; §2 above renames it "If and when" for the
surface. Not a design flaw, a label that should not leak.

**なら is used but not named as a leftover.** See §5.1 — the plan's "named leftovers" paragraph
lists 〜たほうがいい explicitly as riding with conditionals but says nothing about なら, even though
teaching ば without it would leave nouns and な-adjectives unable to form a conditional at all. Worth
the owner knowing this was a required addition, not a scope creep the author invented.

**The とき／たら "when" overlap crosses a chapter boundary the plan does not flag.** Chapter 3
teaches とき for "when"; this chapter's lesson 2 teaches たら's competing "when." Both chapters are
correct on their own terms, and the skeleton's dependency ordering (chapter 3 before chapter 9)
means a learner meets とき first — but nothing in the plan names this as an interface between the
two chapters, and a learner who is not told the two "when"s differ will guess. §3's lesson 2 handles
it locally; a future chapter 3 author should know it is coming.

---

## 7. Authoring checklist

1. **Sourcing.** The 1 new word (方) marked `content-source: training`, verified against JMdict for
   Applications 3.6.2, `# jlpt-source: training` if a level is asserted ([03 §9](03-book-two.md),
   CLAUDE.md). All ~34 phrases are composed sentences, sourced training-canonical pending Tatoeba
   verification, per the sanctioned path.
2. **Commit messages** on every content commit must name the source, or the commit is rejected.
3. **No synthesized minimal pairs — this chapter's biggest risk.** Lessons 4 and 7 each require two
   independently sourced sentences per pair. [03 §7](03-book-two.md) bans editing inside a sentence;
   the specific temptation here is taking one real, sourced sentence and swapping only its
   conditional particle to manufacture a "contrasting" partner. That partner is not a cited
   sentence, it is a fabrication wearing a citation, and this chapter is where an author is most
   likely to reach for it because the lesson design asks for pairs. Source each half on its own
   merits, or cut the pair down to whichever half survives.
4. **The composition frame.** [03 §0b/§8](03-book-two.md) requires each lesson's frame authored
   alongside the lesson. Nine frames, one per teaching lesson. Lessons 1, 2, 3, 5, 6 and 8 frame
   normally — the lesson's pattern with a slot and a model sentence. Lessons 4, 7 and 9 teach no new
   pattern, so their frame should present a **situation** and ask the learner to select and build
   the correct conditional — testing the choice itself, which is what those lessons are for.
5. **Re-surface Chapter 1's plain past (た) and plain negative (ない)** before lessons 1 and 8
   respectively, the same re-surfacing chapter 1 asked for the te-form chapter's patterns before its
   own lesson 5.
6. **Run `pnpm walkthrough`** before merge. It exists for exactly this: content that adds or
   renumbers lessons.
