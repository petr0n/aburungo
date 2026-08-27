# Book Two, Chapter 7 — reported and quoted speech

**Status: design, not content.** This document specifies every lesson in the chapter in enough
detail that authoring the YAML is mechanical. **No Japanese sentence is composed here.** Words and
patterns are cited by id from Book One's inventory or from Chapter 1's design; every example
*sentence* is a requirement on a later authoring pass, which follows [03 §9](03-book-two.md)
sourcing.

Source brief: [03-book-two.md](03-book-two.md) §1, §2, §4, §7, §9, §10. Worked template:
[book-two-chapter-01.md](book-two-chapter-01.md), matched in structure and voice. Rule-chapter
model: [`src/content/lessons/n5-16-te-form.yaml`](../../src/content/lessons/n5-16-te-form.yaml).

**Shape landed: 9 teaching lessons + 1 recognition checkpoint.** New words: **1** (思う — the
chapter's one structurally unavoidable verb). New phrases: **~29**. New kanji: **1** (思). One
lesson (lesson 4) is recognition-only by design and carries no grammar pattern — see §5.2.

---

## 1. The chapter header comment

Paste this at the top of the lessons file, in the style of the te-form and plain-form chapters.

```yaml
# Chapter 7 — What people are saying.
#
# Ninety percent of a language is not what you did, it's what somebody told
# you somebody else did. Chapter 1 built the four shapes of plain form and
# promised they would sit in front of half of Book Two's patterns; this is
# where that promise is cashed, for real money. Every quote in this chapter
# is a plain-form clause with と stapled to the end of it, and a learner who
# has chapter 1 in hand can already build the clause -- this chapter's whole
# job is teaching them what to staple on.
#
# The chapter runs two families side by side. と言っていました reports what
# someone else said, in something close to their own words; と思います
# reports what you think. English blurs the two constantly -- "she says
# it's expensive" and "I think it's expensive" lean on the same small verb,
# and a learner defaults to whichever one they met first. Japanese keeps
# them apart by definition: 言う always needs a source outside the speaker,
# 思う always needs the speaker's own head. Splitting the chapter along that
# seam, rather than teaching と once and swapping verbs in and out, is what
# makes the distinction stick instead of blurring back together the way it
# does in English.
#
# The report family goes first because it costs less. 言う and 聞く are
# both already owned -- vocab.iu since Book One's home & work chapter,
# vocab.kiku since its verbs set -- so the entire family is built by
# pointing already-known grammar (て-form, ている, た) at already-known
# verbs. The passive lands here too, immediately after 言っていました,
# because と言われています is that same sentence with the source erased --
# "it is said" rather than "she said" -- and a learner who just met the
# sourced version is the one best placed to notice what changed. It is
# recognition only: read it, notice the shift, never build it. Causative,
# and production of both, open the next book (03 §4) -- nothing here asks
# for either.
#
# The opinion family comes second and needs one thing chapter 1 could not
# give it: 思う itself, a verb Book One never taught despite being one of
# the most common in the language, because nothing before this chapter had
# anywhere to put it. Once it lands, its conjugation costs nothing new --
# 思う ends in う, so it takes the same わ exception as 買う and 会う from
# chapter 1's lesson 3, and the same て→た swap as everything else from
# chapter 1's lesson 5. The one genuinely new rule on this side is where
# the negative goes: "I don't think it's expensive" negates the clause,
# not 思う -- high-but-not negative plus と思います, never 思います swapped
# for 思いません -- which is exactly the error an English speaker defaults
# to, and exactly why it earns its own lesson rather than a footnote.
#
# One rule crosses both families and gets its own lesson before either one
# starts building sentences with it: a noun or な-adjective clause keeps だ
# in front of と even though chapter 1's register lesson taught that だ is
# dropped constantly everywhere else. だ stays, です never appears there at
# all -- the one place in the whole book where the plain copula is
# mandatory and the polite one is flatly wrong, in a chapter that is
# otherwise all about choosing plain form on purpose rather than by rule.
#
#    1  what was said              と after a plain verb or い-adjective clause
#    2  the word you can't leave out   noun／な-adjective clauses keep だ
#    3  what she's been saying     と言っていました -- て-form + ている + た
#    4  they say...                と言われています, recognition only
#    5  so I heard                 と聞きました／と聞いています, no new verb
#    6  what I think                と思います -- 思う, new
#    7  saying you don't think so   negate the clause, not 思う
#    8  what I've been thinking     と思っていました／と思っています
#    9  passing it on               a report and an opinion, kept separate
#
# Lessons 3 and 8 both depend on Book One's ている and chapter 1's た;
# lesson 4 depends on lesson 3; lessons 7 and 8 depend on lesson 6; lesson 9
# depends on both families being in hand. This chapter must not be split by
# a checkpoint before lesson 9 -- the same constraint as the plain-form and
# te-form chapters.
#
# content-source: n/a for this file -- it references vocabulary/reported-speech.yaml
#   and phrases/reported-speech.yaml, whose own provenance markers apply.
```

---

## 2. Naming and ids

Following the convention chapters 1, 2, 4, 5, 6 and 8 have already established:

| Thing | Value |
|---|---|
| Chapter id | `b2.chapter-7` |
| Chapter title (learner-facing) | **What people are saying** |
| Lesson `situation` | `What people are saying` |
| Lesson ids | `b2.quote-plain`, `b2.quote-da`, `b2.report-teimashita`, `b2.report-passive`, `b2.report-heard`, `b2.opinion-omou`, `b2.opinion-negative`, `b2.opinion-ongoing`, `b2.report-and-opinion` |
| Pattern ids | `grammar.b2-quote-plain`, `grammar.b2-quote-da`, `grammar.b2-report-teimashita`, *(lesson 4 has none — §5.2)*, `grammar.b2-report-heard`, `grammar.b2-opinion-omou`, `grammar.b2-opinion-negative`, `grammar.b2-opinion-ongoing`, `grammar.b2-report-and-opinion` |
| Vocabulary file | `src/content/vocabulary/reported-speech.yaml`, id `vocab.omou` |
| Phrase file | `src/content/phrases/reported-speech.yaml`, id prefix `report.` |
| Lessons file | `src/content/lessons/b2-07-reported-speech.yaml` |

**"Reported & quoted speech" is the plan's internal label, not a chapter title** — same situation
as chapter 1's "plain form." Book One's rule chapters are titled by what they buy you, and this one
should read the same way: not grammar terms, a plain English sense of what you can now do when
someone tells you something.

`order`: **use 1–10 within the chapter**, matching the "number 1..N within the chapter" rule — 9
teaching lessons plus the checkpoint.

---

## 3. The lessons

Every `wordIds` entry below is a real Book One id, verified against the manifest, except
`vocab.omou`, which this chapter introduces. **Prefer Book One's inventory over new material** —
same instruction chapter 1 followed, and this chapter needs almost none.

### Lesson 1 — What was said

- **Title:** What was said
- **Can-do:** Say what someone else said, in something close to their own words
- **Teaches:** と as the quotation particle, directly after a plain-form clause — no gap, no
  punctuation, nothing else in between. A plain verb clause (dictionary, ない, た or なかった) or a
  plain い-adjective clause slots straight in front of と, then 言いました closes it. This is the
  chapter's entire mechanical payload: everything the learner needs to build the clause was taught
  in chapter 1; this lesson teaches what goes after it. Name the four verb shapes explicitly and
  show all four sitting in front of と, so the "biggest payoff" claim is visible rather than
  asserted — a learner who built 買わない in chapter 1's lesson 3 for its own sake sees it reused
  here for a reason.
- **Exercises (existing ids):** `vocab.iu` 言う (the reporting verb, already known since Book One's
  home & work chapter); embedded-clause material spanning all four shapes — `vocab.iku` 行く
  (dictionary), `vocab.taberu` 食べる (た, echoing chapter 1 lesson 5's own example verb),
  `vocab.kau` 買う (ない, the わ exception from chapter 1 lesson 3 — reused deliberately so the
  exception is drilled a second time in a new context), `vocab.samui` 寒い (い-adjective clause,
  which needs no conversion at all — Book One taught adjectives in plain form from day one, a fact
  worth naming out loud here since it is one less thing this lesson has to build).
- **New vocabulary:** none.
- **New phrases:** 4 — one per plain-form shape (dictionary, た, ない, い-adjective), all reporting
  someone else's words, never the speaker's own (that register nuance is chapter 1 lesson 7's
  territory and does not need re-teaching, but the subject of every phrase here must be a third
  person for the "reported" framing to be genuine).
- **Depends on:** all of chapter 1's form lessons (1 through 5) — the dictionary form, both ない
  halves, なかった and た. This is the chapter's hardest dependency and the reason the plan calls it
  "plain form's biggest payoff": every one of those lessons cashes in here at once.

### Lesson 2 — The word you can't leave out

- **Title:** The word you can't leave out
- **Can-do:** Report what someone said about who or what something is, without the sentence coming
  out wrong
- **Teaches:** a noun or な-adjective clause keeps だ in front of と — 学生 + だ + と, never 学生 + です
  + と. This is the direct exception to chapter 1 lesson 6's own rule that だ is "dropped constantly
  in speech": here it cannot be dropped, and です cannot replace it either, no matter how polite the
  surrounding sentence is. い-adjectives need no だ, exactly as chapter 1 lesson 6 already taught
  (高い + と, not 高い + だ + と) — the rule is not new, only the setting is; this lesson's job is
  showing that it still holds when と is added.
- **Exercises (existing ids):** `vocab.iu` 言う; noun clause `vocab.gakusei` 学生; な-adjective
  clauses `vocab.daijoubu` 大丈夫, `vocab.genki` 元気; い-adjective control case (no だ needed)
  `vocab.takai` 高い, to show the contrast directly rather than by assertion.
  Nouns and な-adjectives with だ: `vocab.suki` 好き and `vocab.kirai` きらい, both na-adjectives, are
  strong candidates too since they recombine naturally into lesson 6's opinion phrases later.
- **New vocabulary:** none.
- **New phrases:** 3 — one noun clause, one な-adjective clause, one past-tense copula (だった)
  under と, to show the rule holds across tense as well as polarity.
- **Depends on:** lesson 1, immediately, plus chapter 1 lesson 6 (だ). Placed second rather than
  bundled into lesson 1 because it is the sharpest single error-point in the chapter and chapter 1's
  own precedent (§5.1 of that chapter's design) is to give a rule its own lesson exactly when it is
  small but costly to get wrong.

### Lesson 3 — What she's been saying

- **Title:** What she's been saying
- **Can-do:** Report what someone has been telling you, the way it is actually said in conversation
- **Teaches:** と言っていました — the headline pattern the plan names directly. Mechanically it is
  nothing new: 言う's te-form (言って, already derivable from chapter 1 lesson 1's ichidan/godan
  distinction and Book One's own te-form chapter) plus ています (Book One's own pattern,
  `grammar.n5-te-imasu`) plus the plain-past swap from chapter 1 lesson 5. What is new is the
  register point: 言いました reports a single utterance at one moment; 言っていました reports what
  someone has been saying, which is how reported speech is actually delivered in natural
  conversation almost all of the time. Name that distinction explicitly rather than presenting
  言っていました as a synonym for 言いました.
- **Exercises (existing ids):** `vocab.iu` 言う; topics — `vocab.ashita` 明日, `vocab.shigoto` 仕事,
  `vocab.isogashii` 忙しい, `vocab.ryokou` 旅行.
- **New vocabulary:** none.
- **New phrases:** 4 — one about a plan or intention someone mentioned, one about a state or fact
  someone described, one negative (〜ないと言っていました, recombining chapter 1's ない a second time
  in this chapter), one with a concrete everyday topic so the pattern is seen doing real work.
- **Depends on:** lesson 1 (と mechanics), Book One's `grammar.n5-te-imasu`, and chapter 1 lesson 5
  (た). This is the chapter's second hard external dependency, alongside lesson 1's — the same
  targeted-resurfacing note chapter 1's design makes about its own lesson 5 applies here too.

### Lesson 4 — They say...

- **Title:** They say...
- **Can-do:** Read a sentence that reports something without naming who said it, and understand what
  it means — without being asked to produce one
- **Teaches:** と言われています, the passive of 言う sitting in the same ている+と frame lesson 3 just
  built, with the subject who said it erased. "It is said that..." / "They say that..." — the
  highest-frequency passive in written Japanese, per [03 §4](03-book-two.md)'s binding decision, and
  placed directly beside lesson 3 on purpose: a learner who has just met 言っていました is best placed
  to notice what changed when the source disappears and れる/られる appears in its place. **This
  lesson is recognition only, and it is built differently from every other lesson in this book — see
  §5.2, which this chapter treats as load-bearing, not a footnote.**
- **Exercises (existing ids):** `vocab.iu` 言う, cited so the passive is anchored to a verb already
  owned rather than presented as a stray new form; `vocab.yuumei` 有名 (な-adjective, so one phrase
  can recombine lesson 2's だ rule inside a passive sentence — 有名 + だ + と言われています — showing
  the rule survives yet another layer).
- **New vocabulary:** none. **No new grammar pattern — see §5.2.**
- **New phrases:** 2, deliberately fewer than every other lesson in the chapter. Exposure, not
  drilling, is the point: one about a well-known fact or common belief (な-adjective clause, showing
  だ survives inside the passive), one about a verb-clause belief. Each must be a sentence a learner
  could plausibly meet reading real Japanese, not a constructed drill sentence.
- **Depends on:** lesson 3. Not on lesson 6 (思う) or anything in the opinion family — passive
  recognition is entirely a report-family matter here.

### Lesson 5 — So I heard

- **Title:** So I heard
- **Can-do:** Say what you heard, without saying who told you
- **Teaches:** と聞きました／と聞いています, reusing 聞く's "to hear" sense — the same headword Book
  One already teaches as "to listen, to ask" (`vocab.kiku`), one sense of which is exactly the one
  this pattern needs. No new grammar beyond と mechanics from lesson 1: 聞く slots into the same
  frame 言う did. The teaching point is pragmatic, not mechanical — と聞きました is vaguer than
  と言っていました on purpose. It does not commit to a named source, which is exactly why it is the
  natural way to pass along something you picked up secondhand or half-remembered. **This is not the
  そう／らしい hearsay-suffix family** ([03 §4](03-book-two.md)'s named leftover) — it is the same
  ordinary quotation と, attached to a verb the learner already owns, and should not be conflated
  with that later, heavier grammar when it is eventually authored.
- **Exercises (existing ids):** `vocab.kiku` 聞く; topics — `vocab.ame` 雨, `vocab.tenki` 天気,
  `vocab.raishuu` 来週.
- **New vocabulary:** none.
- **New phrases:** 3 — one about news or weather heard secondhand, one about someone else's plan
  heard through a third party, one using ています for an ongoing "I've heard/I understand that..."
  sense rather than a one-off report.
- **Depends on:** lesson 1 only. Independent of lessons 3–4; placed here to close out the report
  family as a block before the chapter turns to opinions.

### Lesson 6 — What I think

- **Title:** What I think
- **Can-do:** Say what you think, as an opinion rather than a fact
- **Teaches:** と思います, and with it 思う itself — a verb Book One never taught. Once it lands, its
  conjugation is free: 思う ends in う, so 思わない follows chapter 1 lesson 3's わ exception exactly
  (the same shape as 買わない and 会わない, both already drilled), and 思った follows chapter 1
  lesson 5's て→た swap exactly. The grammarNote should say this out loud — a new verb that costs
  nothing to conjugate because the learner already owns its entire pattern. と attaches to the plain
  clause exactly as in lesson 1, including lesson 2's だ rule for noun and な-adjective clauses.
- **Exercises (existing ids):** i-adjective opinion `vocab.takai` 高い, `vocab.omoshiroi` 面白い;
  na-adjective/noun opinion (だ recombination) `vocab.suki` 好き, `vocab.yuumei` 有名; verb-clause
  opinion `vocab.iku` 行く.
- **New vocabulary:** **1 — 思う** (verb, u-class, "to think, to believe"). Verify against JMdict for
  Applications at authoring; flag `# jlpt-source: training` per CLAUDE.md until verified.
- **New kanji:** **1 — 思**, tied to this lesson. Confirmed absent from every existing Book One word
  (checked against the manifest 2026-08-27) — this is a genuinely new character, not a re-exposure.
- **New phrases:** 4 — one i-adjective opinion, one noun/な-adjective opinion (recombining lesson
  2's だ rule a second time, this time on the opinion side), one verb-clause opinion about a plan or
  future action, one using an already-known verb in plain dictionary form so the connection to
  lesson 1's mechanics is visible.
- **Depends on:** lesson 1 (と mechanics) and lesson 2 (だ, for the noun/な-adjective phrases). Not on
  the report family.

### Lesson 7 — Saying you don't think so

- **Title:** Saying you don't think so
- **Can-do:** Say you don't think something is true — without producing the sentence English
  grammar would suggest
- **Teaches:** the negative goes in the clause, not on 思う. "I don't think it's expensive" negates
  高い itself — 高くない + と思います, never 思います swapped for 思いません. 思いません exists and is
  grammatical, but it reads as blunt and is not how this is normally said. This is exactly the error
  an English speaker's word order predicts, which is why it earns a dedicated lesson rather than a
  line in lesson 6's grammarNote. Mechanically it costs nothing new: chapter 1 lessons 2 and 3 already
  built every ない form this lesson needs, and chapter 1 lesson 4's なかった work covers the
  past-negative case (なかった + と思います) the same way.
- **Exercises (existing ids):** `vocab.omou` 思う (from lesson 6); negated clauses —
  `vocab.kuru` 来る (ichidan-irregular ない, chapter 1 lesson 2's easy half), `vocab.wakaru` わかる
  (godan ない, chapter 1 lesson 3), `vocab.aru` ある (the outright exception, ある → ない, also
  chapter 1 lesson 3 — reused a second time in this chapter after lesson 1).
- **New vocabulary:** none.
- **New phrases:** 3 — one negating a verb clause, one negating ある specifically (so the outright
  exception is seen in a real sentence rather than only as a rule), one using なかった so the past
  negative is shown sitting under と思います as well as under と言っていました.
- **Depends on:** lesson 6, plus chapter 1 lessons 2 and 3 (both ない halves) and, for the past
  case, chapter 1 lesson 4 (なかった).

### Lesson 8 — What I've been thinking

- **Title:** What I've been thinking
- **Can-do:** Say what you've been thinking, or that your opinion has held for a while, rather than
  just now
- **Teaches:** と思っていました／と思っています, built exactly the way lesson 3 built
  と言っていました — て-form of 思う (思って, from the わ-group pattern lesson 6 already fixed) plus
  ている plus, for the past, た. The grammarNote should draw the parallel to lesson 3 explicitly:
  same mechanical move, second verb, and by now the learner should be able to predict the form before
  being told it. The only new content is the register point: 思っています reads as a settled,
  ongoing stance rather than a snap judgement, which is why it is the more natural way to describe an
  opinion you have held for a while rather than one you are forming on the spot.
- **Exercises (existing ids):** `vocab.omou` 思う; topics — `vocab.shigoto` 仕事,
  `vocab.daijoubu` 大丈夫, `vocab.genki` 元気.
- **New vocabulary:** none.
- **New phrases:** 3 — one ongoing personal stance ("I've been thinking that..."), one showing a
  change of mind or realization (と思っていましたが..., contrasting past belief with present fact —
  note: this needs only a comma-level pause in English glossing, not a taught connector, so it stays
  inside a single sourced sentence rather than requiring chapter 3's けど/から), one plain present
  ongoing opinion.
- **Depends on:** lesson 6 (思う), Book One's `grammar.n5-te-imasu`, and chapter 1 lesson 5 (た) —
  the same dependency shape as lesson 3, one verb later.

### Lesson 9 — Passing it on

- **Title:** Passing it on
- **Can-do:** Relay what you heard, then say what you think about it — without mixing the two into
  one claim
- **Teaches:** no new grammar. This lesson is the chapter's capstone: it pairs a report-family phrase
  (と言っていました or と聞きました) with an opinion-family phrase (と思います or と思っています) on
  the same topic, and the teaching point is entirely pragmatic — keeping attribution and opinion
  visibly separate is a real communicative skill, and confusing them (stating someone else's claim as
  your own certainty, or hedging your own view as something you merely heard) is a genuine
  miscommunication risk, not just a grammar nicety. This is the payoff chapter1's own pattern
  established with its register lesson 7 — a lesson built entirely from recombination, teaching a use
  rather than a form. **Each phrase must be an independent single utterance, never a scripted
  back-and-forth** — the same fabrication-risk warning chapter 1's lesson 7 carries, and doubly
  relevant here since pairing two phrases on one topic is an obvious temptation toward writing a
  two-line dialogue.
- **Exercises (existing ids):** `vocab.iu` 言う, `vocab.omou` 思う together; topics reused from
  earlier in the chapter — `vocab.ashita` 明日, `vocab.tenki` 天気, `vocab.isogashii` 忙しい,
  `vocab.yuumei` 有名 — so the chapter's own material recombines with itself at the close, the same
  way chapter 1's checkpoint reused its own verbs.
- **New vocabulary:** none.
- **New phrases:** 3, each pairing a report clause and an opinion clause on a shared topic as two
  independently sourced sentences, not a dialogue.
- **Depends on:** the report family (lesson 3 or 5) and the opinion family (lesson 6 or 8) both being
  in hand. The chapter's most demanding dependency, and the reason it sits last before the
  checkpoint.

### Lesson 10 — Chapter 7 checkpoint

- **Title:** Chapter 7 checkpoint
- **Can-do:** Recognise everything taught so far
- **`checkpoint: recognition`**, `wordIds: []`, `phraseIds: []`, `kanji: []`, no `patternId` — same
  shape as chapter 1's checkpoint and `n5.checkpoint-6`.
- **Format:** Book Two's recall-leaning recognition pass (03 §10). Mastery gate, not a grade: the
  remaining set shrinks to zero, retries unlimited, nothing recorded, misses rejoin the SRS queue
  (DR-020).
- **Placement:** at the chapter boundary. The chapter **must not** be split earlier: lesson 4 depends
  on lesson 3, lessons 7 and 8 depend on lesson 6, and lesson 9 depends on both families.

---

## 4. Totals

| | Count | Against the book's per-lesson average |
|---|---|---|
| Teaching lessons | 9 | within the plan's stated deviation range (03 §4) |
| Checkpoints | 1 | one per chapter (DR-021) |
| New words | **1** (思う) | **0.11/lesson vs. 5.7** — see §5.3 |
| New verbs | **1**, structurally unavoidable | see §6a — distinct from the deferred fresh-verbs question |
| New phrases | **~29** | 3.2/lesson vs. Book One's rule chapters at ~3, chapter 1's 3.4 |
| New grammar patterns | **8**, not 9 | lesson 4 deliberately carries none — see §5.2 |
| New kanji | **1** (思) | **0.11/lesson vs. 2.3** — reinforces chapter 1 §6's flagged concern, see §6 |

---

## 5. The open calls

### 5.1 9 teaching lessons, not 10 — argued, not defaulted

**Answer: 9, and the plan's own allowance ("some chapters may deviate to 7") covers it, though the
honest description is "9 because the content is 9 lessons deep," not "9 chosen as a target."**

The chapter carries exactly two headline patterns (03 §4's own words: "〜と言っていました,
〜と思います") plus one recognition-only add-on (passive) and one mechanical prerequisite (だ before
と). Splitting by what a learner can *say*, chapter 1's own method, yields: と-mechanics (1), だ (1),
言っていました (1), the passive riding beside it (1), 聞きました as the cheap third report verb (1),
思います (1), its negation trap (1), its ている extension (1), and a capstone that costs nothing new
(1). That is 9, and padding to 10 would mean either splitting a lesson that does not need splitting
(と-mechanics could be forced into two, one for verbs and one for adjectives, but adjectives need no
new rule and the split would be content-free) or inventing scope the plan does not ask for
(embedded-question reporting, そう／らしい hearsay — both real N4 grammar, both explicitly out per
§4's named-leftovers list or by omission). 9 is the honest count.

### 5.2 The recognition-only lesson — how it differs, precisely

**This is the section the plan's brief flags as needing care, and it is the single most important
design decision in this chapter.**

Every other lesson in this chapter — and every teaching lesson in Book Two, per 03 §2 and §10 — asks
the learner to *produce*: type the reading or meaning, or (per §8) compose from a frame. That is what
"recall is the default" means at the book level, and it is implemented as a single per-book boolean
(`isShifted` in `src/pages/LearnPage.tsx`) that routes every `Word`/`Phrase` review to a typed
`FillBlankCard` instead of a flip-and-rate `FlashCard`.

Lesson 4 must not do that, and today the engine has no way to say so at the lesson or item level.
**What the card must ask:** given a full sentence containing と言われています, show its English and
have the learner pick or confirm the meaning — recognition, multiple-choice or flip-and-judge, the
same shape `RecognitionPass` and `FlashCard` already use elsewhere. **What it must never ask:** type
the passive form, fill a blank that would require producing れる/られる, or conjugate 言う into its
passive from the dictionary form. There is no cloze card for this lesson's content, which is why
lesson 4 carries no `patternId` at all — a `GrammarPattern`'s blank-and-type cloze mechanic is
production by construction (`GrammarClozeCard` runs regardless of `shifted`, per the code), so giving
this lesson a pattern would force exactly the production this design forbids. Its two phrases are
reviewed as ordinary `Phrase` items, and that is precisely the gap: nothing today stops a `Phrase`
in a `shifted` book from being routed to `FillBlankCard`.

**This needs a small, genuinely new engine primitive**, not just careful authoring. The closest
existing precedent is `Kanji`, whose own type comment says "Recognition only, permanently" —
`ReviewStep` special-cases it ahead of the `shifted` check the same way this lesson needs. The
proposal: an optional `recognitionOnly?: boolean` on `Phrase`, checked in `ReviewStep` before the
`shifted` branch, exactly mirroring how `isKanji(current)` is checked before it today. Two phrases
carry the flag; nothing else in the chapter does. This is scoped narrowly on purpose — it is a
one-field, one-branch change, not a new review mode.

### 5.3 One new word, and it is not optional

**Answer: 1 — 思う — and unlike chapter 1's near-zero vocabulary, this one is structurally forced
rather than a design choice.**

Chapter 1 could reach zero new verbs because its entire premise was retroactive: naming and
conjugating verbs the learner already had. Chapter 7 cannot do the same for 思う, because the pattern
*is* the verb — there is no version of "say what you think" in this pattern family that does not
require it. Notably, `思う` does not appear anywhere in Book One's 484-word inventory (verified
against the manifest 2026-08-27) despite being among the most common verbs in the language; nothing
before this chapter had a grammar slot to hang it on, which is exactly chapter 7's own header-comment
argument. Once introduced, its conjugation is free — see lesson 6's design note — so the cost is one
word and one kanji, not a conjugation lesson.

---

## 6. Things I think the plan is wrong or silent about

**The recognition-only mechanism the passive decision requires does not exist, and the plan does not
flag it.** 03 §4 states the passive-recognition decision as settled ("enters chapter 7 as recognition
only") without noting that today's engine has exactly one item type that behaves that way (`Kanji`,
hardcoded) and no general mechanism for a `Phrase` to opt out of a book's `shifted` default. §5.2
above specifies the fix precisely; it is small, but it is real engineering work this chapter's
authoring is blocked on, not just a content decision.

**Chapter 1's kanji-arithmetic concern (its own §6) gets a second, sharper data point here.** That
chapter shipped 6 kanji over 10 lessons against a 2.3/lesson book average and called the shortfall
structural to word-light rule chapters. This chapter ships 1 kanji over 9 lessons — an even lower
rate, from a chapter that (unlike chapter 1) does bring one genuinely new, high-value word. The
pattern holds across two rule chapters now: a rule chapter that reuses owned vocabulary starves the
book's kanji budget regardless of how much new grammar it teaches, because kanji ride in on nouns and
this family of patterns is built almost entirely on top of one already-known verb apiece. Same
recommendation chapter 1 made: measure after the rule chapters ship rather than trying to force kanji
into chapters that have no natural place for them.

**Book One's own vocabulary gap is worth a note, even though it predates this chapter.** 思う being
absent from 484 words is not a Book Two planning failure — Book One had nowhere to put a verb whose
entire function is heading a quoted clause — but it is a real gap in the base inventory that the
JLPT coverage tooling (`node scripts/jlpt.mjs coverage n4`) should already be surfacing, if the
correct check for "core N5 verbs Book One skipped entirely for structural reasons" exists. Worth
confirming that tool actually catches this class of gap rather than only vocabulary Book One simply
never reached.

---

## 6a. Open, deferred by the owner — fresh verbs (not re-litigated here)

Whether Book Two's rule chapters bring fresh verbs (te-form style) or drill only Book One's 87 verbs
(chapter 1's style) is one decision for all seven rule chapters, deferred by the owner. Not argued
here.

**This chapter's sensitivity is narrow.** The three anchor verbs — 言う, 聞く, 思う — are unaffected
either way: 言う and 聞く are reused zero-new-verb style regardless of how the question resolves
(they are already owned, and the pattern needs no other verb to carry it), and 思う is structurally
mandatory regardless (§5.3) — it is the verb the pattern is built from, not a verb chosen to drill an
existing pattern, so it is not an instance of the deferred question at all.

The question only touches the *embedded-clause* material inside lessons 1, 3, 6, 7, 8 and 9's
example sentences — the content of what is being said, heard or thought about.

- **Variant A (no fresh verbs, matches chapter 1):** every embedded clause draws from Book One's 87
  verbs and existing adjectives. Fully sufficient — nothing in this design is blocked by it, and the
  exercises listed above already assume it.
- **Variant B (fresh verbs, matches the te-form chapter):** 2–3 embedded-clause verbs could be added
  for topical variety in lessons 1, 3, 6 and 9's phrases — candidates worth checking at authoring
  time are 心配する ("to worry," natural in both report and opinion contexts) and 頑張る ("to do
  one's best," a common thing to report someone saying or to have an opinion about). Optional
  richness, not required by any lesson's dependency chain.

---

## 7. Authoring checklist

1. **Sourcing.** `vocab.omou` marked `content-source: training`, verified against JMdict for
   Applications 3.6.2, with `# jlpt-source: training` until checked ([03 §9](03-book-two.md),
   CLAUDE.md). All ~29 phrases are composed sentences, following the sanctioned path:
   training-canonical, marked, pending Tatoeba verification. `node scripts/jlpt.mjs sentences` is a
   *checking* tool, not a supply.
2. **Commit messages** on every content commit must name the source, or the commit is rejected.
3. **No dialogue in lesson 9.** Three independently sourced report-plus-opinion pairs, never a
   scripted exchange — the same risk chapter 1 flags for its own register lesson, sharper here since
   pairing two phrases on one topic is an obvious temptation.
4. **Lesson 4's two phrases need the `recognitionOnly` flag proposed in §5.2** before this chapter
   can ship as designed. If that engine change has not landed, lesson 4 must not be authored against
   `shifted: true` content until it has — flag this dependency to whoever picks up the build step.
5. **The composition frame** (03 §0b/§8) for lessons 1–3 and 5–9 (not lesson 4, which is
   recognition-only and has no produce step): the lesson's pattern with one or two slots and a model
   sentence, authored alongside the lesson, following the same sourcing rules as phrases.
6. **Verify 思う against JMdict** and confirm the 聞く sense used in lesson 5 ("to hear," distinct
   from Book One's displayed gloss "to listen, to ask") is the same headword, not a fabricated sense
   — it is, but authoring should cite the specific JMdict sense number.
7. **Run `pnpm walkthrough`** before merge.
