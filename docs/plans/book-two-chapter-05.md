# Book Two, Chapter 5 — Deciding what to do

**Status: design, not content.** This document specifies every lesson in the chapter in enough
detail that authoring the YAML is mechanical. **No Japanese sentence is composed here.** Words and
verb forms are cited by id from Book One's inventory; every example *sentence* is a requirement on
a later authoring pass, which follows [03 §9](03-book-two.md) sourcing.

Source brief: [03-book-two.md](03-book-two.md) §1, §2, §4, §9, §10. Structural template:
[book-two-chapter-01.md](book-two-chapter-01.md), which this document matches in shape and depth.
Grammar-chapter template: [`src/content/lessons/n5-16-te-form.yaml`](../../src/content/lessons/n5-16-te-form.yaml).

**Shape landed: 8 teaching lessons + 1 recognition checkpoint.** New words: **1** (つもり). New
verbs: **0**. New phrases: **~28**. New kanji: **0** — see §6, and see chapter 1's own §6, which
this chapter's number reinforces rather than repeats.

---

## 1. The chapter header comment

Paste this at the top of the lessons file, in the style of the te-form and plain-form chapters.

```yaml
# Chapter 5 -- Deciding what to do.
#
# Two words have been sitting in the ladder since Book One's food-preferences
# lesson doing almost nothing. 食べたい and 飲みたい were taught as vocabulary --
# "want to eat", "want to drink" -- two memorised i-adjectives, not a rule.
# ほしい arrived in the same lesson (unit 31) and has never appeared in a
# phrase since: a word taught and never used. This chapter turns that
# vocabulary into grammar -- たい as something you build onto any verb, not
# two verbs you happened to be handed pre-built -- and then gives the learner
# two more ways to talk about the future: つもり for what you have decided,
# and ましょう／ませんか for what you propose to someone else.
#
# The four pieces are not equally connected to the rest of the book. たい and
# ほしい need nothing but the ます-stem the learner has used since lesson one
# of Book One -- no dependency on this book's own plain-form chapter at all.
# つもり does: it sits on the plain non-past and the plain negative, so it
# cannot come before chapter 1. ましょう and ませんか are independent again,
# built off the same ます-stem as たい.
#
# The split follows the plan's four named items, plus one lesson that sits
# between the first two and belongs to neither: turning a statement of your
# own want into a question about someone else's. That move matters more than
# it looks. たい and ほしい describe the speaker; declaring what a THIRD
# person wants is a genuine error in Japanese (it needs たがっている, which
# this book does not teach), so the only safe way to talk about what someone
# else wants is to ask them. That is also the exact move chapter 8 needs --
# deciding together starts with asking, not declaring.
#
#   1  wanting to do something     たい as a rule, any verb, the が it keeps
#   2  not wanting to, and having  たくない／たかった -- the same い-adjective
#      wanted to                   machine that already turned 高い into 高かった
#   3  wanting a thing             ほしい, finally used; thing vs. action
#   4  asking what someone wants   the question turn; the third-person trap
#                                  named, not taught around
#   5  what you've decided         つもり, plain form's first payoff outside
#                                  chapter 1 itself
#   6  plans that changed          つもりはない／つもりでした -- でした is the
#                                  same swap chapter 1's だ lesson taught
#   7  let's                      ましょう, proposing together
#   8  would you like to           ませんか, inviting -- softer, and the one
#                                  chapter 8 leans on hardest
#
# Lessons 5 and 6 are the chapter's only hard dependency on chapter 1 (plain
# form). Everything else only needs Book One. No checkpoint splits the
# chapter -- lesson 4 needs 1 and 3, lesson 6 needs 5, and 8 is read directly
# against 7.
#
# content-source: n/a for this file -- it references vocabulary/wanting-intending.yaml
#   and phrases/wanting-intending.yaml, whose own provenance markers apply.
```

---

## 2. Naming and ids

Following chapter 1's convention exactly (`b2.` prefix, no `n5.`/level leakage, DR-033/DR-024).

| Thing | Value |
|---|---|
| Chapter id | `b2.chapter-5` |
| Chapter title (learner-facing) | **Deciding what to do** |
| Lesson `situation` | `Deciding what to do` |
| Lesson ids | `b2.tai-rule`, `b2.tai-negative-past`, `b2.hoshii`, `b2.asking-what-you-want`, `b2.tsumori`, `b2.tsumori-changed`, `b2.mashou`, `b2.masenka` |
| Pattern ids | `grammar.b2-tai`, `grammar.b2-tai-negative-past`, `grammar.b2-hoshii`, … (one per teaching lesson) |
| Vocabulary file | `src/content/vocabulary/wanting-intending.yaml`, ids `vocab.*` |
| Phrase file | `src/content/phrases/wanting-intending.yaml`, id prefix `want.` |
| Lessons file | `src/content/lessons/b2-05-wanting-intending.yaml` |

**"Wanting & intending" is the plan's internal label.** The learner-facing chapter title is
**Deciding what to do** — concrete, and it sets up chapter 8 ("Making plans with friends")
without duplicating it: chapter 5 is where you learn to say what you want and decide what to do;
chapter 8 is where you do it with someone.

`order`: use **1–9 within the chapter** (8 teaching + 1 checkpoint). Global order numbers are
assigned at book assembly, per chapter 1 §2.

---

## 3. The lessons

Every `wordIds` entry below is a real Book One id from the manifest. Two are cited *because* they
are already owned and under-used — `vocab.tabetai`, `vocab.nomitai` and, especially, `vocab.hoshii`,
which exists in Book One and has never appeared in a phrase.

### Lesson 1 — Wanting to do something

- **Title:** Wanting to do something
- **Can-do:** Say you want to do something, with any verb
- **Teaches:** the general 〜たい rule, generalising `grammar.n5-unit-31` rather than replacing it.
  たい attaches to the polite ます-stem — the part of the verb the learner has produced since Book
  One's first lesson, for every verb, every time they used ます. 食べます → 食べたい and
  飲みます → 飲みたい are not two special vocabulary items anymore; they are the rule's first two
  instances. Extend it across classes: 行きます → 行きたい, 買います → 買いたい,
  泳ぎます → 泳ぎたい (godan, spanning endings); 見ます → 見たい (ichidan, already the same stem
  that builds て/た); irregulars する → したい and 来ます → 来たい — flag that 来たい reads きたい,
  not くたい, the same reading trap chapter 1's lesson 2 names for 来ない. Carry forward が: the
  thing or action wanted is marked with が, not を — the same が that already marks what is liked
  or disliked (`grammar.n5-unit-30`) and the が that was already sitting in front of ラーメン and 水
  in unit 31's own phrases.
- **Exercises (existing ids):** `vocab.taberu` 食べる, `vocab.nomu` 飲む, `vocab.iku` 行く,
  `vocab.kau` 買う, `vocab.oyogu` 泳ぐ, `vocab.miru` 見る, `vocab.suru` する, `vocab.kuru` 来る,
  `vocab.au` 会う.
- **Exercises (earlier Book Two chapters):** None — depends on nothing in Book Two; たい
  attaches to the ます-stem the learner has had since Book One's first lesson.
- **New vocabulary:** none. State it directly, chapter-1 style: `vocab.tabetai` and `vocab.nomitai`
  are not being taught here, they are being explained.
- **New phrases:** 4. One ichidan, one godan (an ending not covered by the existing たべたい／のみたい
  pair, so the "any verb" claim is shown, not asserted), one irregular, one that reuses が against a
  Book One noun so the callback to units 30 and 31 lands in a sentence rather than only in prose.
- **Depends on:** nothing in Book Two. Assumes the ます-stem (Book One, every lesson) and
  `grammar.n5-unit-30`, `grammar.n5-unit-31`.

### Lesson 2 — Not wanting to, and having wanted to

- **Title:** Not wanting to, and having wanted to
- **Can-do:** Say you don't want to do something, or that you did or didn't want to
- **Teaches:** たい conjugates exactly like an い-adjective, because it is one — the same rule Book
  One already used to turn 高い into 高かった (`grammar.n5-past-katta`). たべたい → たべたくない →
  たべたくなかった. Say directly in the grammarNote that nothing new is being learned mechanically,
  only where an existing rule now points — the same move chapter 1's lesson 4 makes for ない.
- **Exercises (existing ids):** `vocab.taberu` 食べる, `vocab.iku` 行く, `vocab.kau` 買う,
  `vocab.kinou` 昨日 (the past-time anchor). `vocab.takai` 高い is named in the grammarNote as the
  rule's original example, not exercised as a new phrase target here.
- **Exercises (earlier Book Two chapters):** None — reconjugates this chapter's own lesson 1
  with Book One's い-adjective past rule.
- **New vocabulary:** none.
- **New phrases:** 4 — one たくない, one たかった (a genuinely new communicative move: "I wanted
  to…", a mild-regret register English speakers reach for constantly), one たくなかった, one that
  places たかった against `vocab.kinou` so the plain-desiderative past sits next to a time word the
  learner already places past tense against.
- **Depends on:** lesson 1; Book One's `grammar.n5-past-katta`.

### Lesson 3 — Wanting a thing

- **Title:** Wanting a thing
- **Can-do:** Say you want something, not to do something
- **Teaches:** ほしい as an い-adjective in its own right — 欲しい → 欲しくない → 欲しかった, the
  same machine as lesson 2, now pointed at a different word. Names the boundary the two lessons
  together set up: たい sits on a VERB (an action you want to do); ほしい sits on a NOUN (a thing
  you want), marked with the same が as lesson 1. A learner reaching for "食べたい水" instead of
  "水がほしいです" is the exact error this lesson exists to head off. Say plainly that ほしい has
  been in the learner's vocabulary since Book One's food-preferences lesson and has never been used
  — this lesson is the payoff, not new material.
- **Exercises (existing ids):** `vocab.hoshii` ほしい, `vocab.okane` お金, `vocab.jikan` 時間,
  `vocab.kuruma` 車, `vocab.hon` 本.
- **Exercises (earlier Book Two chapters):** None — contrasts against this chapter's own
  lessons 1 and 2.
- **New vocabulary:** none.
- **New phrases:** 3 — one affirmative with a concrete thing, one negative (欲しくないです), one
  that pairs a wanted thing against a lesson-1 wanted action in the same sentence so the boundary is
  shown twice rather than asserted once.
- **Depends on:** lesson 1 (the contrast is the point) and lesson 2 (reuses the い-adjective
  negative/past machinery on ほしい rather than teaching it twice).

### Lesson 4 — Asking what someone wants

- **Title:** Asking what someone wants
- **Can-do:** Ask a friend what they want to do, or what they want
- **Teaches:** turning lessons 1 and 3's statements into questions with 何 — 何が食べたいですか,
  何がほしいですか. This is the lesson that makes both patterns usable in conversation rather than
  only as monologue, and it is where the third-person restriction gets named directly rather than
  quietly avoided: a learner cannot say "she wants sushi" with たい — that needs たがっている, out of
  scope for this book — but can always ASK. That is not a workaround for a gap; it is the actual
  register. Deciding what to do together starts with a question, which is precisely what chapter 8
  needs on arrival.
- **Exercises (existing ids):** `vocab.nani` 何, `vocab.taberu` 食べる, `vocab.nomu` 飲む,
  `vocab.hoshii` ほしい, `vocab.tomodachi` 友達.
- **Exercises (earlier Book Two chapters):** None — turns this chapter's own lessons 1 and 3
  into questions.
- **New vocabulary:** none.
- **New phrases:** 3 — one 何＋たい question, one 何＋ほしい question, one answer to either, sourced
  as an independent single utterance, not a scripted exchange (see chapter 1's lesson 7 rule and §7
  of this document).
- **Depends on:** lessons 1 and 3.

### Lesson 5 — What you've decided

- **Title:** What you've decided
- **Can-do:** Say what you plan to do
- **Teaches:** つもり — plain non-past + つもりです, e.g. the shape of 行くつもりです. This is the
  chapter's one new vocabulary word. Distinguish it from たい explicitly: たい is a want, つもり is a
  decision — you can want something you have no plan to do, and plan something you don't
  particularly want to. Name the dependency out loud: this is the first Book Two chapter outside
  chapter 1 itself to stand directly on the plain non-past form.
- **Exercises (existing ids):** `vocab.iku` 行く, `vocab.kau` 買う, `vocab.au` 会う,
  `vocab.rainen` 来年, `vocab.raishuu` 来週.
- **Exercises (earlier Book Two chapters):** Chapter 1 (the lesson naming the plain
  dictionary form) — a hard dependency; つもり sits directly on the plain non-past.
- **New vocabulary:** **1** — つもり (a formal-noun-like word, kana-only; state it plainly, the way
  chapter 1 states its zero-word lessons — this is the one word the whole chapter structurally
  needs).
- **New phrases:** 3 — one with a future time word, one with a different verb class, one plain
  statement of intent with no time word (negation and past wait for lesson 6).
- **Depends on:** chapter 1's lesson that names the plain dictionary form. Hard dependency — a
  learner without the plain non-past gets nothing here, the same shape as chapter 1's own lesson 5
  depending on the te-form chapter.

### Lesson 6 — Plans that changed

- **Title:** Plans that changed
- **Can-do:** Say you don't plan to do something, or that you had planned to and it changed
- **Teaches:** つもりはない as the primary negative. つもり is a noun, and it pairs with ある／ない as
  an existence predicate — "the intention doesn't exist" — the exact same ある／ない the learner
  already uses for money and time (`vocab.aru`; お金がある、時間がない are Book One sentences).
  This is not a new construction, it is a new noun slotted into an existence pattern already owned.
  Flag 〜ないつもり (行かないつもり, built on chapter 1's ない form) as an alternate the learner will
  meet in the wild — a decided non-plan versus simply having none — in the grammarNote only, no
  phrase required. Then つもりでした: the exact です → でした swap chapter 1's だ lesson already
  taught, now applied to つもり — the recombination this book is built around, a new word slotted
  into a rule the learner owns outright.
- **Exercises (existing ids):** `vocab.iku` 行く, `vocab.kaeru` 帰る (the godan る trap, echoing
  chapter 1's recurring warning that a verb ending in る is not automatically ichidan), `vocab.au`
  会う.
- **Exercises (earlier Book Two chapters):** Chapter 1 lesson 6 (だ／でした) — the same です→でした
  swap, now applied to つもり; chapter 1's ない lessons are named only for an alternate form in
  the grammarNote, not exercised in a phrase.
- **New vocabulary:** none.
- **New phrases:** 3 — one つもりはない, one つもりでした, one that contrasts the two in sequence
  (had planned to, no longer intends to) — still each a single sourced sentence, never an authored
  two-turn exchange.
- **Depends on:** lesson 5; chapter 1's だ lesson (でした) directly; chapter 1's ない lessons only
  for the alternate form named in the grammarNote.

### Lesson 7 — Let's

- **Title:** Let's
- **Can-do:** Propose doing something together
- **Teaches:** ましょう off the ます-stem — 行きましょう, 食べましょう — presented as an assumption
  of agreement, not a request for one: you are proposing, the listener is expected to come along.
  That register point is exactly what chapter 8 needs sharp. 一緒に (`vocab.issho`, already owned)
  is the natural partner word and belongs here for that reason.
- **Exercises (existing ids):** `vocab.iku` 行く, `vocab.taberu` 食べる, `vocab.yasumu` 休む,
  `vocab.issho` 一緒, `vocab.nichiyoubi` 日曜日.
- **Exercises (earlier Book Two chapters):** None — built entirely on Book One's ます-stem.
- **New vocabulary:** none.
- **New phrases:** 4. Chapter 8 stands on this pattern directly, so it needs range: one with 一緒に,
  one with a time word, one plain proposal, one response accepting it — a single independent
  utterance answering the proposal, not a scripted turn-pair.
- **Depends on:** nothing beyond Book One's ます-stem.

### Lesson 8 — Would you like to

- **Title:** Would you like to
- **Can-do:** Invite someone to do something, more softly than lesson 7
- **Teaches:** ませんか off the same ます-stem, built from ません (already known since Book One's
  polite negative) plus か. Taught directly against lesson 7 rather than in isolation: ましょう
  assumes the answer, ませんか asks it — same verb, same stem, different register, and the
  difference *is* the lesson. This is the pattern chapter 8 leans on hardest per the plan's own
  wording ("invitations exercise chapter 5's 〜ましょう／〜ませんか immediately"), so it gets the
  same room lesson 7 got, not less.
- **Exercises (existing ids):** `vocab.iku` 行く, `vocab.taberu` 食べる, `vocab.miru` 見る,
  `vocab.eiga` 映画, `vocab.nichiyoubi` 日曜日.
- **Exercises (earlier Book Two chapters):** None — read directly against this chapter's own
  lesson 7.
- **New vocabulary:** none.
- **New phrases:** 4 — one a direct twin of a lesson 7 phrase (same verb, both forms, so the
  contrast is reviewable rather than asserted, mirroring chapter 1 lesson 10's pairing against its
  own 〜てください twin), one with a different verb, one with 映画 as a natural invitation object,
  one response.
- **Depends on:** lesson 7, read against it directly.

### Lesson 9 — Chapter 5 checkpoint

- **Title:** Chapter 5 checkpoint
- **Can-do:** Recognise everything taught so far
- **`checkpoint: recognition`**, `wordIds: []`, `phraseIds: []`, `kanji: []`, no `patternId` — same
  shape as chapter 1's lesson 11 and `n5.checkpoint-6`.
- **Format** (03 §10): recall, not tile-tap. Mastery gate: the remaining set shrinks to zero,
  retries unlimited, nothing recorded, misses rejoin the SRS queue (DR-020).
- **Placement:** chapter boundary, which is also the cadence point. The chapter **cannot** split
  earlier — lesson 4 depends on 1 and 3, lesson 6 on 5, and lesson 8 is read directly against 7.

---

## 4. Totals

| | Count | Against the book's per-lesson average |
|---|---|---|
| Teaching lessons | 8 | see §5.1 for why not 10 |
| Checkpoints | 1 | one per chapter (DR-021) |
| New words | **1** (つもり) | 0.1/lesson vs. 5.7 — see §5.2 |
| New verbs | **0** | deliberate under the reuse default; see §5.3 |
| New phrases | **~28** | 3.5/lesson vs. chapter 1's 3.4/lesson |
| New grammar patterns | 8 | one per teaching lesson |
| New kanji | **0** | see §6 |

---

## 5. The open calls

### 5.1 Eight teaching lessons, not ten

**Answer: 8, and I think it is the right number rather than a shortfall against the target.**

Chapter 1's conjugation table had real per-class variation to teach — eight godan endings, two
exceptions, a separate lesson for ichidan versus godan because the rule genuinely differs by class.
たい has none of that: it is one substitution, on one stem, uniform across every verb class, so
splitting it by verb class the way chapter 1 split ない would be manufacturing lessons the rule does
not need — exactly what this document's constraints warn against ("make this about learning, not
about strict 10×10").

What the chapter has instead is four named grammar items from the plan's own row, plus one
connective lesson I added and want to be upfront about: **lesson 4, asking what someone wants, is
not named in the plan's skeleton row.** I think it earns its place — it is the lesson that turns two
declarative patterns into something usable in a two-person conversation, and it is where the
third-person restriction on たい/ほしい gets named rather than silently avoided — but it is my
addition, not the plan's, and worth flagging as exactly that.

Mapped against the four named items, the shape is two lessons each: たい (1–2), ほしい (3, plus its
half of lesson 4), つもり (5–6), ましょう／ませんか (7–8). That is a clean, legible split, and eight
lessons is the honest count of what this material asks for. A shrink path exists if the chapter
needs one: lesson 4 is the first thing I would cut, folding its two question phrases into lessons 1
and 3 respectively — but the third-person boundary would then have nowhere to live, and I would
argue against making that cut.

### 5.2 Almost no new vocabulary, and it compounds with chapter 1's own finding

**Answer: 1 new word.** This is even lighter than chapter 1's ~12, and for the same underlying
reason chapter 1 named in its own §5.3: a chapter that reconjugates verbs the learner already owns
does not need new verbs to teach a rule that applies to all of them uniformly. Book One's 87 verbs
already span every ending たい needs to demonstrate, exactly as they did for ない.

What is different here is that even the *structural* vocabulary is mostly already present. Chapter
1 needed five structural words (こと, 一度, 回, うん, ううん) because its payoff patterns
(〜たことがある, 〜たり〜たり) named concepts Book One's nouns didn't cover. This chapter's
payoff patterns don't: ほしい already exists as a word, thing-nouns (お金, 時間, 車, 本) are already
plentiful, 一緒に is already owned, and the question word 何 has been available since early Book
One. Only つもり itself — the concept "a decided intention" — has no existing home in the
vocabulary, so it is the chapter's one genuinely new word.

### 5.3 Sensitivity to the fresh-verbs decision (deferred, not re-litigated)

> **Settled 2026-08-29 — no fresh verbs.** The reuse-only variant below is the one that ships. The policy and its reasoning are in [03 §4](03-book-two.md); this section is kept for the analysis that informed it.


This chapter's design **is** sensitive to whether Book Two's rule chapters bring fresh verbs, more
than chapter 1's was, and it is worth naming precisely where.

- **Reuse-only (as designed above):** lesson 1 needs zero new verbs, because Book One's 87 already
  span every class たい needs to demonstrate — the same argument chapter 1 made for ない. This is
  what the tables in §3 and §4 assume.
- **Fresh verbs (te-form-style):** lesson 1 is the only lesson that would plausibly take them, and
  the case for it is different from chapter 1's own case. Chapter 1 argued fresh verbs matter when a
  *table* needs filling per row; たい needs no such filling, so the argument here would instead be
  about staleness — the same 87 verbs get reused in every rule chapter, and proving "this rule works
  on any verb" is a stronger demonstration on unfamiliar material than on verbs already drilled in
  four other chapters. If the owner decides yes, this chapter would want it small: 2–3 fresh verbs
  at lesson 1 is enough to make the point, not a table's worth, since the rule itself needs no
  per-ending coverage. Each fresh verb likely brings its own kanji, which would move §4's new-kanji
  total off zero.

Nothing else in the chapter is sensitive to this call — lessons 3 through 8 use nouns, an existing
adjective, and already-known verbs regardless of which way lesson 1 goes.

---

## 6. What chapter 8 can assume

Per the plan, chapter 8 ("Making plans with friends") exercises 〜ましょう／〜ませんか immediately.
After this chapter, it can assume, without re-teaching:

- The learner produces **ましょう** and **ませんか** off the ます-stem for any verb, across all
  classes, without support.
- The learner holds the **register distinction** between them — ましょう proposes and assumes
  agreement; ませんか asks and leaves room for no — because lesson 8 is built as a direct contrast
  against lesson 7, not taught in isolation.
- The learner already has 一緒に (`vocab.issho`) paired with both forms from lesson 7's phrases.
- The learner can also reach for たい, ほしい, and つもり — chapter 8 does not need to introduce "what
  do you want to do" as a concept, only its own new vocabulary (約束 and the invitation register) and
  the situational frame. Deciding-together vocabulary (何が食べたいですか-style questions) is already
  in hand from lesson 4.

What chapter 8 should **not** assume: this chapter teaches no third-person desire forms
(たがっている), so any content describing what a friend wants, rather than asking them, is out of
this chapter's reach and chapter 8's own problem if it needs that register.

---

## 7. Things worth flagging, not re-arguing

**This chapter's zero new kanji is a sharper data point for the concern chapter 1 already raised in
its own §6, not a new one.** Chapter 1 argued that rule chapters which reuse owned vocabulary
structurally cannot hit 03 §3's ~2.3-kanji-per-lesson budget, and shipped 6 against a target of 23.
This chapter ships 0 against a target of ~18 — because つもり, ほしい's negative/past forms, and both
volitional endings are all built on kana, not new characters. I am not re-arguing chapter 1's
proposed fix (measure after chapter 3 ships); this chapter is simply more evidence that the
measurement, when it happens, should expect rule chapters to run near zero rather than near the
average.

**`vocab.hoshii` sitting unused since Book One is worth surfacing beyond this chapter.** 03 §1 lists
"one 〜たい pattern" among what a Book One graduate has and says nothing about ほしい, even though
the word exists in the same lesson and has never appeared in a phrase. It is not wrong, just silent
— and it is exactly the kind of dormant vocabulary this chapter exists to activate. Worth checking
whether other chapters have similar dormant words sitting in Book One before they get treated as
purely new material.

---

## 8. Authoring checklist

1. **Sourcing.** The 1 new word (つもり) marked `content-source: training`, verified against JMdict
   for Applications 3.6.2, `# jlpt-source: training` where a level is asserted ([03 §9](03-book-two.md),
   CLAUDE.md). All ~28 phrases are composed sentences, following the sanctioned path:
   training-canonical, marked, pending Tatoeba verification.
2. **Commit messages** on every content commit must name the source, or the commit is rejected.
3. **No dialogue.** Lessons 4, 7 and 8 each specify a "response" phrase — every one of those is a
   single independent utterance, sourced on its own, never a scripted two-turn exchange (see [03
   §7](03-book-two.md); chapter 1's lesson 7 note on the same risk).
4. **The composition frame.** [03 §0b/§8](03-book-two.md) requires each lesson's frame authored
   alongside the lesson. Eight frames, one per teaching lesson, following the same sourcing rules as
   phrases.
5. **Re-surface chapter 1's plain non-past pattern** before lesson 5 — the same reasoning chapter 1
   gives for re-surfacing the te-form patterns before its own lesson 5. Without the plain dictionary
   form in the review queue, lessons 5 and 6 land on nothing.
6. **Run `pnpm walkthrough`** before merge.
