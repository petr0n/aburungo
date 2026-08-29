# Book Two, Chapter 1 — the plain-form chapter

**Status: design, not content.** This document specifies every lesson in the chapter in enough
detail that authoring the YAML is mechanical. **No Japanese sentence is composed here.** Words and
verb forms are cited by id from Book One's inventory; every example *sentence* is a requirement on
a later authoring pass, which follows [03 §9](03-book-two.md) sourcing.

Source brief: [03-book-two.md](03-book-two.md) §1, §2, §4, §9, §10. Working template:
[`src/content/lessons/n5-16-te-form.yaml`](../../src/content/lessons/n5-16-te-form.yaml).

**Shape landed: 10 teaching lessons + 1 recognition checkpoint.** New words: **~12**, of which
**zero are verbs**. New phrases: **~34**. New kanji: **~6**, and see §6 — that is a real shortfall
against the book's kanji arithmetic and it is not this chapter's to fix.

---

## 1. The chapter header comment

Paste this at the top of the lessons file, in the style of the te-form and past-tense chapters.

```yaml
# Chapter 1 — Talking like a friend.
#
# The book opens on a debt, not on new material. Every verb card in Book One
# shows a dictionary form -- 食べる, 待つ, 帰る -- so the learner has been
# reading plain form since the first lesson and has never been told it is a
# form, that it has a negative and a past, or that it sits in front of half of
# what Book Two teaches. Ninety lessons of recognition and nothing built on it.
# This chapter is that debt paid, the same way the te-form and past-tense
# chapters paid theirs.
#
# The split is uneven on purpose, because the four forms are not equally hard.
#
# た costs one lesson because the te-form chapter already paid for it. That
# chapter spent three lessons sorting godan verbs into く→いて, う・つ・る→って
# and む・ぬ・ぶ・す→んで. た is that same table with て→た and で→だ, 行った
# exception included. A learner who did chapter 6 of Book One gets the entire
# plain past for the price of one rule.
#
# ない costs two, and they are not the te-form's two. ない ignores the te-form
# grouping entirely: every godan verb moves its last sound to the あ row, one
# rule for all eight endings, which is why the godan half is a single lesson
# rather than three. What it does have is two exceptions the te-form never
# mentioned -- う becomes わない, not あない, and ある becomes ない outright --
# so those get the room the groups do not need.
#
# だ gets its own lesson because dropping ます without it leaves a learner
# saying 学生です to a friend: half-plain, which is worse than either register.
# And the lesson after it is where the forms stop being a table -- when to use
# them, and the うん / ううん that go with them.
#
# The three payoff patterns take a lesson each. They are cheap to build and not
# cheap to use, and this chapter splits by what a learner can say, not by what
# a rule costs to state.
#
#    1  the form, named        dictionary form is a form; plain and polite
#    2  ない, the easy half    ichidan, する, 来る
#    3  ない, godan            the あ row; う→わない and ある→ない
#    4  なかった               ない inflects like an い-adjective
#    5  た                     the te-form table, one substitution
#    6  だ                     です／でした／じゃない, unpoliced
#    7  talking like a friend  register, dropped か, うん and ううん
#    8  ～たことがある          experience, not a past event
#    9  ～たり～たり           listing what you do, and the する at the end
#   10  ～ないでください        the twin of Book One's ～てください
#
# Lessons 8, 9 and 10 depend on 3 and 5, and lesson 7 depends on 6, so this
# chapter must not be split by a checkpoint -- the same constraint as the
# te-form and past-tense chapters.
#
# content-source: n/a for this file -- it references vocabulary/plain-form.yaml
#   and phrases/plain-form.yaml, whose own provenance markers apply.
```

---

## 2. Naming and ids

Book One's ids carry `n5.`, which is legacy and predates DR-033. **Book Two must not repeat it** —
a book is a volume, not a level, and the learner never reads a level (DR-024). Proposed:

| Thing | Value |
|---|---|
| Chapter id | `b2.chapter-1` |
| Chapter title (learner-facing) | **Talking like a friend** |
| Lesson `situation` | `Talking like a friend` |
| Lesson ids | `b2.plain-dictionary`, `b2.plain-nai-ichidan`, … |
| Pattern ids | `grammar.b2-plain-dictionary`, … |
| Vocabulary file | `src/content/vocabulary/plain-form.yaml`, ids `vocab.*` |
| Phrase file | `src/content/phrases/plain-form.yaml`, id prefix `plain.` |
| Lessons file | `src/content/lessons/b2-01-plain-form.yaml` |

**"Plain form" is the plan's internal label, not a chapter title.** Book One's rule chapters are
titled by what they buy you ("Asking someone to do something", "Talking about yesterday"), and this
one should be too.

`order`: **use 1–11 within the chapter.** Global order numbers are assigned when the book is
assembled — Book One ends at 102, and Book Two's numbering interacts with the `progressKey` freeze
in [03 §0a](03-book-two.md), which is not this chapter's decision.

---

## 3. The lessons

Every `wordIds` entry below is a real Book One id from the manifest. **Prefer them over new
material** — the chapter's whole emotional payload is "you already own these".

### Lesson 1 — The form you have been reading

- **Title:** The form you have been reading
- **Can-do:** Recognise the plain form of any verb you know, and say which register you are in
- **Teaches:** the dictionary form *named* as the plain non-past, and the two-way mapping with ます.
  ます → plain: move the い-row sound before ます to the う row (書きます → 書く, 待ちます → 待つ,
  飲みます → 飲む); ichidan simply restores る (食べます → 食べる); する and 来る stand alone.
  Plus the register frame the rest of the chapter lives in: polite is what you have; plain is what
  goes to friends, to yourself, and — this is the load-bearing half — **in front of other grammar**,
  which is why the chapter exists at all.
- **Exercises (existing ids):** `vocab.kaku` 書く, `vocab.matsu` 待つ, `vocab.nomu` 飲む,
  `vocab.kaeru` 帰る, `vocab.taberu` 食べる, `vocab.miru` 見る, `vocab.suru` する, `vocab.kuru` 来る.
  Deliberately one from each class, all of them among the most-seen verbs in Book One.
- **Exercises (earlier Book Two chapters):** None — this is Book Two's opening chapter;
  there is no earlier Book Two material yet to draw on.
- **New vocabulary:** none. State that in the grammarNote, as `n5.te-imasu` does — "this lesson
  teaches no new words on purpose" is the point being made, not an apology.
- **New phrases:** 3. One plain-form statement about a habit; one about a plan; one where the plain
  form sits in front of something else, so the "half of Book Two" claim is shown rather than
  asserted. If the third cannot be sourced without a pattern this chapter has not taught, cut it to
  2 rather than reaching forward.
- **Depends on:** nothing in Book Two. Assumes ます (Book One chapter 1 onward) and the
  ichidan/godan distinction from `grammar.n5-te-ichidan`/`grammar.n5-te-tte`.

### Lesson 2 — Saying you don't, the easy half

- **Title:** Saying you don't, the easy half
- **Can-do:** Say you do not do something, casually, with ichidan verbs
- **Teaches:** plain negative for ichidan and the two irregulars. Drop る, add ない: 食べる → 食べない,
  見る → 見ない, 忘れる → 忘れない. する → しない, 来る → こない (and flag the reading change on
  来る — 来ない is こない, not くない, which is the one thing that trips people here).
- **Exercises (existing ids):** `vocab.taberu` 食べる, `vocab.miru` 見る, `vocab.neru` 寝る,
  `vocab.okiru` 起きる, `vocab.wasureru` 忘れる, `vocab.oboeru` 覚える, `vocab.deru` 出る,
  `vocab.suru` する, `vocab.kuru` 来る.
- **Exercises (earlier Book Two chapters):** None — this is Book Two's opening chapter;
  there is no earlier Book Two material yet to draw on.
- **New vocabulary:** none. All 24 ichidan verbs and all 3 irregulars are already owned.
- **New phrases:** 3. One everyday refusal, one habitual negative, one with する.
- **Depends on:** lesson 1 (the form is named there). Mirrors `n5.te-ichidan` deliberately — same
  easy-half-first shape, so the learner recognises the chapter's method from the previous rule
  chapter.

### Lesson 3 — Saying you don't, the rest

- **Title:** Saying you don't, the rest
- **Can-do:** Say you do not do something, casually, with any verb
- **Teaches:** godan plain negative as **one rule** — move the last sound to the あ row and add ない:
  く→かない, ぐ→がない, す→さない, つ→たない, ぬ→なない, ぶ→ばない, む→まない, る→らない.
  Then the two exceptions that make this lesson worth its length: **う→わない** (買う → 買わない,
  not 買あない) and **ある→ない** (not あらない). Carry forward the te-form chapter's warning that a
  verb ending in る is not automatically ichidan — 帰る → 帰らない, 走る → 走らない.
- **Exercises (existing ids)** — one per ending, all owned: `vocab.kaku` 書く, `vocab.isogu` 急ぐ,
  `vocab.hanasu` 話す, `vocab.matsu` 待つ, `vocab.shinu` 死ぬ, `vocab.yobu` 呼ぶ, `vocab.yomu` 読む,
  `vocab.kaeru` 帰る (godan る trap), `vocab.kau` 買う and `vocab.au` 会う (the わ exception),
  `vocab.aru` ある (the outright exception). Add `vocab.hashiru` 走る and `vocab.wakaru` わかる if
  the lesson wants more of the trap.
- **Exercises (earlier Book Two chapters):** None — this is Book Two's opening chapter;
  there is no earlier Book Two material yet to draw on.
- **New vocabulary:** none. Book One's 60 godan verbs cover every one of the eight endings, ぬ
  included (死ぬ is the only ぬ verb in the language, as the te-form chapter already told them).
- **New phrases:** 4 — this is the biggest form lesson and carries the two exceptions. One should
  use 買う or 会う so わない is met in a sentence, and one should use ある.
- **Depends on:** lesson 2.

### Lesson 4 — Saying you didn't

- **Title:** Saying you didn't
- **Can-do:** Say what you did not do, casually
- **Teaches:** なかった. ない → なかった on every verb without exception, because **ない is an
  い-adjective and inflects like one** — which is the same rule as `grammar.n5-past-katta`
  (高い → 高かった) that the learner already has. Name that link explicitly; it is the cheapest
  lesson in the chapter precisely because Book One already taught the mechanism on adjectives and
  never said it generalised.
- **Exercises (existing ids):** reuse lesson 2 and 3's verbs so the square closes on familiar
  material — `vocab.taberu` 食べる, `vocab.iku` 行く, `vocab.wakaru` わかる, `vocab.aru` ある,
  `vocab.suru` する. Pair with `vocab.takai` 高い and `vocab.samui` 寒い to make the い-adjective
  link visible.
- **Exercises (earlier Book Two chapters):** None — this is Book Two's opening chapter;
  there is no earlier Book Two material yet to draw on.
- **New vocabulary:** none.
- **New phrases:** 3. At least one should place なかった against a Book One time word
  (`vocab.kinou` 昨日, `vocab.kyonen` 去年) so the plain past lands where the polite past already
  lives.
- **Depends on:** lesson 3. Cannot precede it — なかった is built from ない, not from the verb.

### Lesson 5 — Saying you did

- **Title:** Saying you did
- **Can-do:** Say what you did, casually, with any verb
- **Teaches:** the plain past for the entire language in one substitution: **take the te-form and
  swap て for た, で for だ.** 食べて → 食べた, 書いて → 書いた, 泳いで → 泳いだ, 待って → 待った,
  飲んで → 飲んだ, 話して → 話した. 行く keeps its exception, 行って → 行った, at no extra cost.
  The grammarNote should say out loud why this lesson is short: the learner paid for it three
  lessons ago in Book One and is collecting.
- **Exercises (existing ids)** — one per te-form row, so the substitution is seen across the whole
  table: `vocab.taberu` 食べる (ichidan), `vocab.kaku` 書く (く), `vocab.oyogu` 泳ぐ (ぐ),
  `vocab.matsu` 待つ / `vocab.kau` 買う / `vocab.toru` 取る (う・つ・る), `vocab.nomu` 飲む /
  `vocab.yobu` 呼ぶ / `vocab.shinu` 死ぬ (む・ぬ・ぶ), `vocab.hanasu` 話す (す), `vocab.iku` 行く
  (the exception), `vocab.suru` する and `vocab.kuru` 来る.
- **Exercises (earlier Book Two chapters):** None — this is Book Two's opening chapter;
  there is no earlier Book Two material yet to draw on.
- **New vocabulary:** none, and this is the strongest place in the chapter to say so.
- **New phrases:** 4. Lessons 8 and 9 both stand on this form, so it needs enough sentences to be
  solid before they arrive.
- **Depends on:** lesson 1 for the naming; **Book One's `grammar.n5-te-ku`, `n5-te-tte`,
  `n5-te-nde`, `n5-te-ichidan`** for the table itself. This is the chapter's hardest external
  dependency: a learner who skipped or has decayed the te-form chapter gets nothing here. Worth a
  targeted re-surfacing of those four patterns in the SRS queue in the lessons before it.

### Lesson 6 — Sentences without です

- **Title:** Sentences without です
- **Can-do:** Say what something is, casually
- **Teaches:** だ, the plain copula, as a re-labelling of four things already owned —
  です → だ, でした → だった, じゃないです → じゃない, じゃなかったです → じゃなかった.
  Then the two rules that are genuinely new: **だ is dropped constantly in speech**, especially
  before ね and よ and in questions, so hearing no だ does not mean the sentence is polite; and
  **い-adjectives never take it** — 高い stands alone, 高いだ is wrong — while な-adjectives and
  nouns do.
- **Exercises (existing ids):** nouns `vocab.gakusei` 学生, `vocab.sensei` 先生,
  `vocab.tomodachi` 友達, `vocab.nihon` 日本; な-adjectives `vocab.genki` 元気, `vocab.hima` 暇,
  `vocab.yuumei` 有名, `vocab.shizuka` 静か; い-adjectives for the negative rule `vocab.takai` 高い,
  `vocab.omoshiroi` 面白い, `vocab.samui` 寒い.
- **Exercises (earlier Book Two chapters):** None — this is Book Two's opening chapter;
  there is no earlier Book Two material yet to draw on.
- **New vocabulary:** none.
- **New phrases:** 4 — one noun, one な-adjective, one past (だった), one negative (じゃない). The
  い-adjective rule is taught as a prohibition in the grammarNote and needs no phrase of its own.
- **Depends on:** lessons 1–5 only loosely — だ is independent of the verb forms. It is placed here
  rather than first because it reads as an afterthought before the verb table is complete, and as
  the missing piece immediately after. See §5.1.

### Lesson 7 — Talking like a friend

- **Title:** Talking like a friend
- **Can-do:** Hold a short casual exchange without ます or です
- **Teaches:** where the forms actually land. Plain form with friends, family and people younger or
  junior; polite with everyone else, and **when in doubt, polite** — the asymmetry matters, since
  plain form aimed at a stranger is a real error and polite form aimed at a friend is only slightly
  stiff. A plain question drops か and rises in intonation. うん and ううん replace はい and いいえ.
  だ's dropping behaviour from lesson 6 is what makes these sentences sound right.
- **Exercises (existing ids):** `vocab.hai` はい and `vocab.iie` いいえ as the polite counterparts;
  `vocab.tomodachi` 友達, `vocab.sensei` 先生 as the register anchors; verbs already drilled —
  `vocab.iku` 行く, `vocab.taberu` 食べる, `vocab.miru` 見る.
- **Exercises (earlier Book Two chapters):** None — this is Book Two's opening chapter;
  there is no earlier Book Two material yet to draw on.
- **New vocabulary:** **2** — うん (yes, casual) and ううん (no, casual). Both are interjections; the
  file already has 9, so the type is established.
- **New phrases:** 4. These must be **single utterances, not a dialogue.** A multi-turn authored
  exchange is the fabrication surface [03 §7](03-book-two.md) rejects, and a register lesson is
  exactly where an author will be tempted to write one. Specify: one plain question, one うん
  answer, one ううん answer, one plain statement to a friend — each sourced independently.
- **Depends on:** lesson 6, immediately. Without だ the learner cannot produce a complete casual
  non-verb sentence, which is most of a casual exchange.

### Lesson 8 — Things you have done

- **Title:** Things you have done
- **Can-do:** Say whether you have ever done something
- **Teaches:** 〜たことがある. Plain past + ことがある for experience-at-some-point; ことがない for
  never. **The concept, not the construction, is the lesson.** English collapses "I went to Japan"
  and "I have been to Japan" into the same past tense, so a learner reaches for 行きました when they
  mean 行ったことがあります; the grammarNote's job is that distinction, and the form is one line.
  Teach both registers — ことがある plain, ことがあります polite — since this is the first pattern the
  learner will actually want to use with a stranger.
- **Exercises (existing ids):** `vocab.iku` 行く, `vocab.taberu` 食べる, `vocab.miru` 見る,
  `vocab.au` 会う, `vocab.noboru` 登る, `vocab.oyogu` 泳ぐ, with the nouns already owned —
  `vocab.nihon` 日本, `vocab.sushi` すし, `vocab.eiga` 映画, `vocab.yama` 山, `vocab.umi` 海,
  `vocab.ryokou` 旅行.
- **Exercises (earlier Book Two chapters):** None — this is Book Two's opening chapter;
  there is no earlier Book Two material yet to draw on.
- **New vocabulary:** **3** — こと (the nominaliser, written kana; Book One handled 物 as
  `grammar.n5-mono-nominaliser` and never introduced こと), 一度 (once) and the counter 回, which
  the pattern needs to say how many times. Verify all three against JMdict at authoring.
- **New phrases:** 4 — one affirmative, one ことがない, one question, one counted (一度／二回).
- **Depends on:** lesson 5 (た). Not on lesson 4 — ことがある does not negate through なかった.

### Lesson 9 — Doing this and that

- **Title:** Doing this and that
- **Can-do:** List a couple of things you do, without listing all of them
- **Teaches:** 〜たり〜たり. Plain past + り on each verb, and **the whole thing ends in する** —
  the trap, because nothing in the pattern looks like it needs a verb of its own. Two traps
  worth naming: it lists *representative* actions, not sequential ones (that is て's job, and て as
  a connector arrives in chapter 3), and two items is the natural count, not a limit.
- **Exercises (existing ids):** `vocab.yomu` 読む, `vocab.miru` 見る, `vocab.kaku` 書く,
  `vocab.arau` 洗う, `vocab.yasumu` 休む, `vocab.asobu` 遊ぶ, `vocab.utau` 歌う, with
  `vocab.kaimono` 買い物, `vocab.ryouri` 料理, `vocab.shigoto` 仕事 as the nouns.
- **Exercises (earlier Book Two chapters):** None — this is Book Two's opening chapter;
  there is no earlier Book Two material yet to draw on.
- **New vocabulary:** **0–2.** Book One's leisure and chore nouns are thin (買い物, 料理, 仕事 and
  little else), so authoring may want one or two of 掃除 / 洗濯 / 音楽. Take them only if a sourced
  sentence needs them — do not pad to a number.
- **New phrases:** 3 — one about a day off, one about a routine, one question.
- **Depends on:** lesson 5 (た).

### Lesson 10 — Asking someone not to

- **Title:** Asking someone not to
- **Can-do:** Ask someone not to do something
- **Teaches:** 〜ないでください — the exact twin of Book One's 〜てください, with the ない form
  slotted in where the te-form goes. 忘れる → 忘れないでください, 押す → 押さないでください. The
  form is free; what the lesson carries is that this is a **request, not a prohibition** — it is
  softer than English "don't", and it is the polite way to stop someone, which the learner has had
  no way to say for a hundred lessons.
- **Exercises (existing ids)** — all owned, chosen so both ない halves are exercised:
  `vocab.wasureru` 忘れる and `vocab.akeru` 開ける (ichidan), `vocab.osu` 押す, `vocab.hashiru` 走る,
  `vocab.hairu` 入る, `vocab.kesu` 消す (godan, る-trap included), `vocab.suru` する.
- **Exercises (earlier Book Two chapters):** None — this is Book Two's opening chapter;
  there is no earlier Book Two material yet to draw on.
- **New vocabulary:** none.
- **New phrases:** 3. Pair at least one against its Book One 〜てください counterpart in
  `phrases/te-form.yaml` so the twin relationship is reviewable rather than asserted.
- **Depends on:** lessons 2 and 3 (ない). Explicitly **not** on lesson 5.

### Lesson 11 — Chapter 1 checkpoint

- **Title:** Chapter 1 checkpoint
- **Can-do:** Recognise everything taught so far
- **`checkpoint: recognition`**, `wordIds: []`, `phraseIds: []`, `kanji: []`, no `patternId` —
  same shape as `n5.checkpoint-6`.
- **Format shift (03 §10):** Book Two's recognition pass leans on **recall** — type the reading or
  meaning — rather than tile-tap. Mastery gate, not a grade: the remaining set shrinks to zero,
  retries unlimited, nothing recorded, misses rejoin the SRS queue (DR-020). Wording follows the
  te-form checkpoint's note.
- **Placement:** at the chapter boundary, which is also the ~10-lesson cadence — they coincide by
  construction at this chapter size (DR-021). The chapter **must not** be split earlier: lessons
  8–10 depend on 3 and 5, and lesson 7 on 6.

---

## 4. Totals

| | Count | Against the book's per-lesson average |
|---|---|---|
| Teaching lessons | 10 | on target (03 §4) |
| Checkpoints | 1 | one per chapter (DR-021) |
| New words | **~12** (2 + 3 + 0–2, plus headroom) | **1.2/lesson vs. 5.7** — deliberate, see §5.3 |
| New verbs | **0** | deliberate, see §5.3 |
| New phrases | **~34** | 3.4/lesson vs. Book One's rule chapters at ~3 |
| New grammar patterns | 10 | one per teaching lesson |
| New kanji | **~6** (度, 回, and whatever §5.3's optional nouns bring) | **0.6/lesson vs. 2.3** — see §6 |

Book One's own rule chapters ran light on vocabulary — te-form 18 words over 5 lessons, past-tense
14 over 5, both well under the 5.7 book average — so a word-light rule chapter is the established
shape, not a new liberty. This chapter is lighter still, and §5.3 argues why.

---

## 5. The three open calls

### 5.1 だ gets its own lesson, placed sixth

**Answer: its own lesson, after た, before the register lesson.**

It is not a verb form, and that is the argument for keeping it rather than against. The chapter's
promise is *plain form* as a register, not as a conjugation table, and a learner who drops ます but
keeps です produces half-plain sentences — worse than either register, and the single most common
thing that gives away a learner talking to a friend. Dropping だ from the chapter would leave
lesson 7 unable to build a complete casual sentence about anything that is not an action.

It is also exactly one lesson's worth of material and no more. Four shapes, all of them
re-labellings of things Book One taught (です／でした／じゃないです／じゃなかったです), plus two
rules that are new and have nowhere else to live: だ is dropped constantly in speech, and it never
follows an い-adjective.

Placing it sixth rather than first is deliberate. Before the verb table is complete it reads as a
digression; immediately after, it reads as the last missing piece — and it sits directly against
lesson 7, which is where its dropping behaviour actually bites.

### 5.2 One lesson each for the three payoffs

**Answer: three lessons, one each.**

The plan's phrase is "the payoffs needing nothing else", which is a statement about **dependency,
not cost** — they need no grammar beyond plain form, so they can live in chapter 1. It does not
follow that they are cheap to teach, and the te-form chapter's rule is to split by what a learner
can say rather than by what a rule costs to state.

- **〜たことがある** is a genuinely new concept and the most expensive of the three. English has no
  separate form for experience, so the learner's default output is the plain past — the error is
  systematic, not occasional, and correcting it takes a lesson.
- **〜たり〜たり** is cheap to build and has two traps that are not visible in the form: the
  terminal する, and *representative* rather than *sequential* listing. The second is the one that
  matters, because て-as-connector arrives in chapter 3 and a learner who has conflated them will
  use the wrong one for the rest of the book.
- **〜ないでください** is the cheapest, and is the one I would merge first if the chapter had to
  shrink. **It would merge into lesson 3**, as the payoff of the ない form — precisely the shape
  `n5.te-imasu` has as the payoff of the te-form. I kept it separate because lesson 3 is already
  the largest form lesson (eight endings plus two exceptions), and because the negative-request
  register is a real teaching point rather than a form note.

That merge is the chapter's designed shrink path: it takes the chapter to 9 teaching lessons with
no other change.

### 5.3 Almost no new vocabulary, and no new verbs at all

**Answer: ~12 new words, zero of them verbs. This chapter deliberately does not do what the
te-form chapter did.**

The te-form chapter brought fresh verbs because its rule is **per-group**: each lesson taught one
row of a table, and a row needs verbs sitting in it — Book One's coverage of ぐ, ぬ and ぶ was thin
at that point, so the chapter had to supply them. Neither condition holds here. ない is one rule
across all eight godan endings, so no lesson needs an ending-specific verb; and Book One's 87
verbs already cover every ending, ぬ included.

The deeper reason is the chapter's whole premise. This is a **retroactive** chapter: its payload is
"the shape you have been reading for a hundred lessons is a form, and here is its family". Bringing
fresh verbs would dilute exactly that — the learner would be conjugating strangers instead of
discovering that they already own the material. It is also what [03 §2](03-book-two.md)'s
recombination through-line asks for: verbs the learner already owns, conjugated into forms they
don't.

The 12 words that do come in are not there to exercise the rule. They are there because the payoff
patterns cannot be phrased naturally without them:

- **Structural, non-negotiable (5):** こと, 一度, 回 (lesson 8); うん, ううん (lesson 7).
- **Optional, up to ~7:** free-time and chore nouns for lessons 8 and 9, where Book One's inventory
  is genuinely thin — candidates to check at authoring are 音楽, 週末, 掃除, 洗濯, 温泉, 神社, 外国.
  **Take only what a sourced sentence needs.** If six survive, the chapter ships eleven words; if
  two do, it ships seven. Do not pad to a number.

**The cost, stated plainly:** at ~12 words this chapter contributes about 2% of the book's ~570-word
target while consuming 10% of its lessons. The remaining ~90 teaching lessons must then average
~6.2 words rather than 5.7. That is absorbable — the three situation chapters are word-dense by
nature and will overshoot — but it should be a conscious carry, not a surprise discovered at
chapter 9. If the owner would rather the chapter pull its weight, the lever is **more phrases, not
more verbs**: raise the phrase count from ~34 to ~45 and let the nouns inside them come in. Adding
verbs to a chapter about verbs the learner already has would be the wrong fix.

---

## 6. Two things I think the plan is wrong or silent about

**The kanji arithmetic does not survive a rule-chapter-heavy book, and this chapter is the proof.**
[03 §3](03-book-two.md) budgets ~200 new kanji over ~100 lessons at Book One's measured 2.3 per
teaching lesson. But that 2.3 was measured over a book that is *mostly situation chapters*, and
§4 explicitly inverts the ratio to seven rule chapters against three situations. A rule chapter
that reuses owned vocabulary introduces almost no kanji: this one brings about six, against a
budget of twenty-three. Extrapolated, the seven rule chapters will underdeliver by well over a
hundred kanji and the three situation chapters cannot make it up. The fix is not to force kanji
into this chapter — that would be padding a rule chapter with unrelated glyphs — but §3's
"roughly 200 more" should be restated as a measurement to take after chapter 3 ships, the same way
§7 treats the reading yield. **Flagging, not fixing.**

**The chapter is also blocked on §5's prerequisite in a way the skeleton does not show.** §12 puts
"kanji in the ladder, then the component layer" as build step 2 and chapter authoring as step 4.
This chapter needs almost no kanji, so it is one of the few that could be authored *before* that
work lands without incurring debt. If the owner wants content moving while the kanji work is in
flight, **this is the chapter to author out of order** — a genuinely useful property of a chapter
that brings six kanji, and worth saying out loud since the build order implies otherwise.

**Smaller: the skeleton's chapter label.** "Plain form" is a grammarian's name. Book One's rule
chapters are titled by what they buy — the learner should see "Talking like a friend". Not a
design flaw, just a label that should not leak to the surface.

---

## 6a. Open, deferred by the owner (2026-08-27)

**Does this chapter bring fresh verbs?** §5.3 argues no — all 87 of Book One's verbs are
already owned, and the chapter's premise is "you already own this". The te-form chapter, which
03 §4 names as this chapter's template, made the opposite call for a stated reason in its own
header: it brings new verbs "so the rule is practised on fresh material rather than only on
half-remembered verbs".

The measured evidence favours the template. Book One's two rule chapters are not light on
kanji — Chapter 6 (te-form) runs 3.4 kanji per teaching lesson and Chapter 10 (past tense)
2.0, against a book average of 2.4. Chapter 6 is *above* average, because fresh verbs carry
fresh kanji. So §6's claim that rule chapters structurally cannot meet 03 §3's kanji budget
does not hold as stated: this chapter's shortfall follows from §5.3's own choice to bring no
verbs, rather than from anything about rule chapters.

Accepted as written for now. Revisit before authoring, and settle it for the other six rule
chapters at the same time — it is one decision, not seven.

## 7. Authoring checklist

1. **Sourcing.** All ~12 words marked `content-source: training`, verified headword-by-headword
   against JMdict for Applications 3.6.2, and `# jlpt-source: training` where a level is asserted
   ([03 §9](03-book-two.md), CLAUDE.md). All ~34 phrases are composed sentences, which JMdict
   cannot verify — they follow the sanctioned path: training-canonical, marked, pending Tatoeba
   verification. `node scripts/jlpt.mjs sentences` is a *checking* tool here, not a supply.
2. **Commit messages** on every content commit must name the source, or the commit is rejected.
3. **No dialogue.** Lesson 7 is the risk. Four independent single utterances, never a scripted
   exchange (see [03 §7](03-book-two.md) on why multi-sentence authored text is out).
4. **The composition frame.** [03 §0b/§8](03-book-two.md) requires each lesson's frame to be
   authored *alongside* the lesson, not derived at runtime. Ten frames, one per teaching lesson;
   each is the lesson's pattern with one or two slots and a model sentence. They follow the same
   sourcing rules as phrases.
5. **Re-surface the te-form patterns** before lesson 5. `grammar.n5-te-ichidan`, `n5-te-ku`,
   `n5-te-tte`, `n5-te-nde` are hard prerequisites for the entire plain past, and review
   eligibility already spans prior books ([03 §0a](03-book-two.md)) — this only needs the queue
   weighting, not a mechanism.
6. **Run `pnpm walkthrough`** before merge. It exists for exactly this: content that adds or
   renumbers lessons.
