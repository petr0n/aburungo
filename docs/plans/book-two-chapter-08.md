# Book Two, Chapter 8 — Making plans with friends

**Status: design, not content.** This document specifies every lesson in the chapter in enough
detail that authoring the YAML is mechanical. **No Japanese sentence is composed here.** Words are
cited by id from Book One's manifest where they exist; every example *sentence* is a requirement on
a later authoring pass, which follows [03 §9](03-book-two.md) sourcing.

Source brief: [03-book-two.md](03-book-two.md) §1, §2, §4, §9, §10. Worked example and structural
template: [book-two-chapter-01.md](book-two-chapter-01.md) — a *rule* chapter; this is a *situation*
chapter, so the structure carries over and the content shape does not. Situation-chapter shape
reference: [`src/content/lessons/n5-22-people-clothes.yaml`](../../src/content/lessons/n5-22-people-clothes.yaml).

**Assumption, flagged per instructions:** `docs/plans/book-two-chapter-05.md` does not exist yet.
This chapter is designed against 03 §4's description of chapter 5 — "〜たい beyond Book One's one
pattern, 〜がほしい, 〜つもり, 〜ましょう／〜ませんか" — and against confirmation from the manifest
that Book One never taught ましょう／ませんか (it is not among Book One's 44 grammar ids). Same gap
for chapter 3 ("から, ので, けど, て as a connector"), which lesson 4 below leans on for reason-giving.
Neither chapter's pattern ids exist yet; placeholders are marked below.

**Shape landed: 7 teaching lessons + 1 recognition checkpoint — a deliberate deviation from the
~10 target, argued in §3.** New words: **3** (約束, 週末, 都合), all non-negotiable and none of them
optional headroom — see §3 for why there is none to spare. New phrases: **~25**. New kanji: **4**
(束, 末, 都, 合) — thinner than chapter 1's own admitted shortfall, and for a different reason; see
§7.

---

## 1. The chapter header comment

```yaml
# Chapter 8 — Making plans with friends.
#
# Chapter 5 built ましょう and ませんか and had nothing to hang them on but
# food and rooms. This is the situation they were built for: a friend, free
# time, and an actual invitation. Book One already gave this chapter almost
# everything else it needs -- every day of the week, every date, a full
# clock, 友達, 会う, 暇, 忙しい, どこ and every place noun a meeting could
# happen at. Subtract all of that and what is left is genuinely small: one
# word for the arrangement itself, one for the weekend, one for whether a
# day works. This chapter does not pad that back up. It spends its lessons
# on the thing Book One never gave -- the social choreography of asking,
# accepting, declining, negotiating and confirming -- built almost entirely
# out of material the learner already owns.
#
# Two inventions do the real work, and both are recombinations, not new
# grammar. The casual invitation -- 行かない? -- is chapter 1's plain
# negative wearing chapter 1's rising-intonation question, aimed for the
# first time at a specific social act rather than a fact. And 都合がいい／
# 都合が悪い costs one noun, because いい and 悪い have been sitting in the
# ladder since the describing chapter.
#
#    1  約束                    an arrangement, not just free time
#    2  ませんか／ましょう       inviting, politely -- chapter 5's payoff
#    3  ～ない？                inviting, casually -- chapter 1's payoff
#    4  saying yes, saying no   both registers, and から with a real reason
#    5  都合                    is that day good for you
#    6  どこで                  no new words -- everywhere is already named
#    7  わかった、またね         closing the loop
#
# Lessons 3 and 4 lean on chapter 1's plain form and register; lesson 4's
# reasons lean on chapter 3's から／ので. Nothing here depends on chapter 6
# or 7, but a learner who has them can reach for 来られる？ and 〜と言って
# いた in lesson 7's phrases without the lesson requiring it of anyone who
# doesn't.
#
# content-source: n/a for this file -- it references vocabulary/making-plans.yaml
#   and phrases/making-plans.yaml, whose own provenance markers apply.
```

---

## 2. Naming and ids

Following chapter 1's precedent — no `n5.` legacy prefix, no JLPT level surfaced (DR-024).

| Thing | Value |
|---|---|
| Chapter id | `b2.chapter-8` |
| Chapter title (learner-facing) | **Making plans with friends** |
| Lesson `situation` | `Making plans with friends` |
| Lesson ids | `b2.arrangement`, `b2.invite-polite`, `b2.invite-casual`, `b2.yes-and-no`, `b2.does-that-work`, `b2.where-to-meet`, `b2.confirming` |
| New pattern ids | `grammar.b2-casual-invite` (lesson 3), `grammar.b2-tsugou-ii-warui` (lesson 5) |
| Vocabulary file | `src/content/vocabulary/making-plans.yaml`, ids `vocab.*` |
| Phrase file | `src/content/phrases/making-plans.yaml`, id prefix `plans.` |
| Lessons file | `src/content/lessons/b2-08-making-plans.yaml` |

`order`: 1–8 within the chapter, per the task constraint. Global numbering is assigned at book
assembly, same as chapter 1.

---

## 3. Inventory pass — what Book One already owns

This is the mandatory first job for a situation chapter (03 §4), run against the 484-word,
227-phrase, 44-pattern manifest before writing a single lesson. The result governs the lesson
count below, so it is reported in full rather than summarized away.

**Time and dates — completely covered.** Every day of the week (`vocab.getsuyoubi` 月曜日 through
`vocab.nichiyoubi` 日曜日, plus `vocab.nanyoubi` 何曜日), every date-of-month form (`vocab.tsuitachi`
一日 through `vocab.hatsuka` 二十日), and the full relative-time set (`vocab.senshuu`/`konshuu`/
`raishuu`/`maishuu` 先週／今週／来週／毎週, the month and year equivalents, `vocab.kyou` 今日,
`vocab.ashita` 明日, `vocab.ima` 今) are already taught. Clock time is taught too — `vocab.nanji`
何時 plus the phrase `transit.sanji-han` (三時半です) show telling time is already a solved problem.
A chapter about scheduling a meeting needs none of this from scratch.

**The core social vocabulary — already there.** `vocab.tomodachi` 友達 (friend) and `vocab.au` 会う
(to meet) are exactly what the plan brief names. Also already owned and directly usable: `vocab.hima`
暇 (free/not busy), `vocab.isogashii` 忙しい (busy), `vocab.daijoubu` 大丈夫 (OK/fine — see §6 for
its trap), `vocab.gomennasai` ごめんなさい (sorry), `vocab.matane` またね (see you later, casual),
`vocab.wakaru` わかる (to understand/get it), `vocab.ii` いい (good) and `vocab.warui` 悪い (bad).

**Place — already there.** `vocab.doko` どこ (where) plus concrete place nouns `vocab.eki` 駅,
`vocab.kouen` 公園, `vocab.ie` 家, `vocab.mise` 店, and `vocab.issho` 一緒 (together) cover "where
should we meet" without a single new word.

**Activity verbs to invite someone into — already there.** `vocab.iku` 行く, `vocab.taberu` 食べる,
`vocab.miru` 見る, `vocab.nomu` 飲む, `vocab.asobu` 遊ぶ, `vocab.hanasu` 話す, `vocab.matsu` 待つ —
every verb an invitation lesson needs is already conjugatable material from chapters 1, 5, and
Book One itself.

**A kanji bonus the inventory pass turned up:** `vocab.yoyaku` 予約 (reservation) already teaches
the 約 kanji, so 約束's new-kanji cost is 束 alone. `週` is already owned via 先週/今週/来週/毎週, so
週末's new-kanji cost is 末 alone. Neither saving was visible before running the search — this is
exactly the kind of shrinkage the plan warns a situation chapter to expect.

**Sample count:** of roughly 30 candidate words checked against the manifest (days, dates, time
words, meeting/social vocabulary, place nouns, register interjections), **24 were already owned.**
What survives the subtraction is three words: 約束 (an arrangement, as opposed to just being free),
週末 (weekend — surprisingly absent from Book One's otherwise-complete time set), and 都合
(whether a time suits — see lesson 5). **No fourth candidate earned its place**; §7 explains why
that is a real cost rather than a rounding error.

---

## 4. The lessons

### Lesson 1 — An arrangement, not just free time

- **Title:** An arrangement, not just free time
- **Can-do:** Say you have plans with someone, and that it isn't the same as being free
- **Teaches:** 約束 as a noun — a mutual arrangement made with another person, not a synonym for
  "plans" in the vaguer English sense. Contrast with the already-owned 暇 (free) and 忙しい (busy):
  a learner can already say "I'm busy," but not "I'm busy *because* I have plans with someone,"
  which is the sentence this lesson exists for. 約束する uses the already-owned する — no second new
  word for the verb form. Note for the grammarNote: 約 here is the same kanji as `vocab.yoyaku` 予約
  (reservation), already on the ladder — one less kanji to learn cold.
- **Exercises (existing ids):** `vocab.tomodachi` 友達, `vocab.au` 会う, `vocab.hima` 暇,
  `vocab.isogashii` 忙しい, `vocab.suru` する.
- **Exercises (earlier Book Two chapters):** None — depends on nothing new in Book Two;
  opens the chapter.
- **New vocabulary:** **1** — 約束 (やくそく). Verify against JMdict at authoring;
  `content-source: training` until then.
- **New phrases:** 3. One stating the learner has plans with a friend; one asking whether someone
  else has plans; one that puts 約束 directly against 暇 so the distinction is heard, not just
  glossed.
- **Depends on:** nothing new in Book Two. Opens the chapter.

### Lesson 2 — Would you like to? (inviting, politely)

- **Title:** Would you like to?
- **Can-do:** Invite a friend to do something, using the safe default register
- **Teaches:** the chapter's reason for its placement — chapter 5's 〜ませんか (asking) and 〜ましょう
  (proposing) put to immediate social use, plus 一緒に (`vocab.issho`) as the word that makes an
  invitation read as an invitation rather than a factual question. This is deliberately the first
  invitation lesson, not the casual one: per chapter 1's "when in doubt, polite" rule, ませんか is
  correct aimed at anyone — a friend included — while the casual form in lesson 3 is not.
- **Exercises (existing ids):** `vocab.tomodachi` 友達, `vocab.issho` 一緒, `vocab.taberu` 食べる,
  `vocab.miru` 見る, `vocab.asobu` 遊ぶ.
- **Exercises (earlier Book Two chapters):** Chapter 5 (〜ませんか／〜ましょう) — the chapter's reason
  for its placement, put to its first social use.
- **New vocabulary:** **1** — 週末 (しゅうまつ, weekend). Earns its place because it is the
  single most natural time-frame for a friend invitation and, per §3, is the one time word Book
  One's otherwise-complete set is missing. Verify against JMdict; `content-source: training`.
- **New phrases:** 4. One 〜ませんか invitation, one 〜ましょう proposal, one using 一緒に so the
  "together" framing is heard, one anchored on 週末.
- **Depends on:** chapter 5's ませんか／ましょう pattern (`grammar.b2-ch5-*`, id TBD — see the
  assumption noted above §1).

### Lesson 3 — Wanna? (inviting, casually)

- **Title:** Wanna?
- **Can-do:** Invite a close friend to do something, casually
- **Teaches:** the casual counterpart to lesson 2, built with zero new grammar — plain negative
  (chapter 1, lessons 2–3) asked as a question with dropped か and rising intonation (chapter 1,
  lesson 7), aimed for the first time at a specific speech act rather than a general fact. 行かない？
  is structurally "won't we go?" — the same shape as ませんか, one register down. New pattern id
  `grammar.b2-casual-invite` names this explicitly as a construction, since chapter 1 taught the two
  pieces separately and never combined them into an invitation.
- **Exercises (existing ids):** `vocab.iku` 行く, `vocab.taberu` 食べる, `vocab.miru` 見る,
  `vocab.asobu` 遊ぶ — the same small verb set as lesson 2, deliberately, so the register contrast
  is heard on identical material rather than different vocabulary.
- **Exercises (earlier Book Two chapters):** Chapter 1 lessons 2 and 3 (plain negative) and
  lesson 7 (the casual question, dropped か and rising intonation) — 行かない？ is that register
  aimed for the first time at a specific invitation rather than a general fact.
- **New vocabulary:** none.
- **New phrases:** 3, chosen to cover both an ichidan and a godan verb so the ない-form recombination
  is visible across the table chapter 1 built, not just one row.
- **Depends on:** lesson 2 (the register contrast is the point); chapter 1's plain negative and
  casual-question patterns.

### Lesson 4 — Saying yes, saying no

- **Title:** Saying yes, saying no
- **Can-do:** Accept or decline an invitation, with a reason, in either register
- **Teaches:** accepting and declining side by side, both registers. Polite accept and decline
  reuse すみません (already implicit in Book One's greetings) plus a から／ので reason clause
  (chapter 3); casual accept and decline reuse うん／ううん (chapter 1, lesson 7) and ごめん as the
  casual cut of the already-owned ごめんなさい. **The trap worth its own grammarNote paragraph:**
  大丈夫です, aimed at an offer, usually means "I'm fine [without it]" — a soft decline, not an
  affirmative. An English-speaking learner defaults to reading it as "sure, that's okay," which is
  backwards often enough to be worth flagging explicitly rather than leaving to context.
- **Exercises (existing ids):** `vocab.daijoubu` 大丈夫, `vocab.gomennasai` ごめんなさい,
  `vocab.isogashii` 忙しい, `vocab.hima` 暇, `vocab.au` 会う.
- **Exercises (earlier Book Two chapters):** Chapter 1 lesson 7 (うん／ううん) and Chapter 3
  (から／ので) — casual accept/decline reuse the former, both registers' reasons reuse the
  latter.
- **New vocabulary:** none.
- **New phrases:** 5 — polite accept, polite decline with a から／ので reason, casual accept, casual
  decline with a reason, and one demonstrating 大丈夫 used as a decline so the trap is shown in a
  sentence, not just asserted.
- **Depends on:** lessons 2 and 3 (there is nothing to respond to without them); chapter 3's から／
  ので (id TBD — same flagged assumption as chapter 5).

### Lesson 5 — Does that work for you?

- **Title:** Does that work for you?
- **Can-do:** Ask whether a day works, and propose a different one if it doesn't
- **Teaches:** 都合がいい／都合が悪い — the idiomatic way Japanese asks and states whether a time
  suits, built almost free: `vocab.ii` いい and `vocab.warui` 悪い are already owned, so 都合 is the
  only new word carrying the whole construction. New pattern id `grammar.b2-tsugou-ii-warui`.
  Distinct can-do from lesson 4: that lesson responded to an invitation with a flat yes or no; this
  one negotiates a specific day when the answer is "not that day, but—". Recombines the day and
  relative-time vocabulary from §3's inventory (曜日, 週末, 来週) so it reads as scheduling talk, not
  an abstract drill.
- **Exercises (existing ids):** `vocab.ii` いい, `vocab.warui` 悪い, `vocab.getsuyoubi`〜`vocab.doyoubi`
  (any two days), `vocab.raishuu` 来週.
- **Exercises (earlier Book Two chapters):** None beyond this chapter's own lesson 4 —
  negotiates what happens after a decline, in the same conversation.
- **New vocabulary:** **1** — 都合 (つごう). Verify against JMdict; `content-source: training`.
- **New phrases:** 4 — asking 都合はどうですか, stating 都合がいいです, stating 都合が悪いです
  paired with a proposed alternative day, and one recombining 週末 from lesson 2.
- **Depends on:** lesson 4 (this is what happens after a decline, in the same conversation).

### Lesson 6 — Where should we meet?

- **Title:** Where should we meet?
- **Can-do:** Agree on a place to meet
- **Teaches:** pure recombination, zero new vocabulary — the mirror of chapter 1's own
  "this lesson teaches no new words on purpose" lessons, and worth naming as such in the
  grammarNote. どこ, 駅, 公園, 家, 店 are all owned; the only thing this lesson adds is the frame,
  reusing chapter 5's 〜ましょうか to propose a place the same way lesson 2 proposed an activity.
- **Exercises (existing ids):** `vocab.doko` どこ, `vocab.eki` 駅, `vocab.kouen` 公園, `vocab.ie` 家,
  `vocab.mise` 店, `vocab.au` 会う.
- **Exercises (earlier Book Two chapters):** Chapter 5's ましょう and ませんか. **Not ましょうか —
  chapter 5 does not teach it.** Its lesson 7 note *names* ましょうか in passing, but ships no
  phrase and no pattern id for it, and chapter 5's own breakdown never promised one. So this
  chapter must teach ましょうか itself, in its lesson 2, before reusing it here. Budget a phrase
  and a pattern for it rather than assuming an id that does not exist.
- **New vocabulary:** none.
- **New phrases:** 3 — proposing a place with 〜ましょうか, asking どこで会いますか, confirming a
  specific place from the set above.
- **Depends on:** lesson 2's ましょうか pattern — which lesson 2 must introduce, since chapter 5 leaves it untaught.

### Lesson 7 — Confirming the plan

- **Title:** Confirming the plan
- **Can-do:** Confirm an arrangement is settled and close the conversation
- **Teaches:** closing register, entirely recombined — わかりました (polite) and わかった (casual,
  chapter 1's だ-dropping already covers why the form differs) as confirmation, and `vocab.matane`
  またね as the casual sign-off Book One already owns. This is the situation chapter's actual job:
  not new material, but proof the whole script — invite, respond, negotiate, confirm — runs end to
  end on what the learner has. The grammarNote may point out, without requiring it of any phrase,
  that a learner holding chapter 6's potential or chapter 7's quoted speech can extend this into
  "will you be able to come?" or "she said she's coming" — real, but explicitly optional, since
  chapter 8 does not depend on either.
- **Exercises (existing ids):** `vocab.wakaru` わかる, `vocab.matane` またね, `vocab.au` 会う,
  `vocab.yakusoku` 約束 (closing the loop opened in lesson 1).
- **Exercises (earlier Book Two chapters):** Optional only, not required — the grammarNote
  notes that a learner holding Chapter 6 (potential, 来られる？) or Chapter 7 (quoted speech,
  〜と言っていた) can extend the confirmation further, but this chapter does not depend on either
  and no phrase requires them.
- **New vocabulary:** none.
- **New phrases:** 3 — polite confirmation, casual confirmation, and a closing exchange ending in
  またね.
- **Depends on:** lessons 5 and 6 (there must be a day and place settled before confirming one).

### Lesson 8 — Chapter 8 checkpoint

- **Title:** Chapter 8 checkpoint
- **Can-do:** Recognise everything taught so far
- **`checkpoint: recognition`**, `wordIds: []`, `phraseIds: []`, `kanji: []`, no `patternId` — same
  shape as `n5.checkpoint-12` and chapter 1's checkpoint.
- **Format:** Book Two's recall-based recognition pass (03 §10). Mastery gate, not a grade: the
  remaining set shrinks to zero, retries unlimited, nothing recorded, misses rejoin the SRS queue
  (DR-020).
- **Placement:** at the chapter boundary. Lessons 3–7 all depend on something earlier in the
  chapter, so, as with chapter 1, there is no earlier point this chapter could split.

---

## 5. Totals

| | Count | Against the book's per-lesson average |
|---|---|---|
| Teaching lessons | 7 | **below the ~10 target — argued below** |
| Checkpoints | 1 | one per chapter (DR-021) |
| New words | **3** | 0.4/lesson vs. 5.7 — see §3 and §7 |
| New phrases | **~25** | 3.6/lesson — in line with chapter 1's rate |
| New grammar patterns (chapter-original) | 2 | `b2-casual-invite`, `b2-tsugou-ii-warui`; the rest reuse chapters 3 and 5 |
| New kanji | **4** (束, 末, 都, 合) | thinner than chapter 1's own 6 — see §7 |

**Why 7, not ~10 — argued, not defaulted to.** Section 3's inventory pass found 24 of roughly 30
candidate words already owned before authoring began: every day, every date, clock time, the core
social vocabulary (友達, 会う, 暇, 忙しい), every place a meeting could happen at, and the
register vocabulary (大丈夫, ごめんなさい, またね, わかる) needed to run the whole social script
end to end. Four of the seven lessons (3, 4, 6, 7) needed **no new vocabulary at all** once that
subtraction was made. Stretching to ten lessons here would mean inventing situations the can-do
does not call for — exactly what the plan's own warning predicts ("a chapter shrinks from
'adjectives' to 'the body and the pairs' the hard way"). Chapter 1 already established that "some
chapters may deviate to 7" is sanctioned when the inventory says so; this chapter is that case.

**The growth path, if the owner wants more density instead:** split lesson 4 into "saying yes" and
"saying no" as separate lessons — each already carries enough material (two registers, a reason
clause, the 大丈夫 trap) to stand alone, the same granularity chapter 1 used for its own three
payoff patterns. That reaches 8. A ninth is available by adding an explicit "telling someone else
about the plan" lesson that recombines chapter 6's potential (来られる？) and chapter 7's quoted
speech (〜と言っていました) — currently left as an optional aside in lesson 7's grammarNote. Neither
move invents new situations; both make existing recombination opportunities load-bearing instead of
optional. I would not take either by default — see §7 for why padding this particular chapter for
its own sake is the wrong fix.

---

## 6. Register — how far casual goes, and where the chapter stays polite

This is explicitly the first chapter where casual register does real communicative work rather than
being drilled for its own sake (chapter 1 taught the toolkit; this is its first job). The chapter is
built so that **the entire situation is completable in the neutral/polite register alone** —
lessons 1, 2, 5, 6, and the polite half of 4 and 7 — so a learner who has not yet internalised
chapter 1's register split is not stranded. Casual register is layered on top, concentrated in
lesson 3 (which exists *only* to teach it) and the casual halves of lessons 4 and 7.

- **Stays polite/neutral by default:** lesson 1 (約束, no register marked either way), lesson 2
  (ませんか／ましょう — chapter 1's "when in doubt, polite" rule applies directly: this form is
  correct aimed at anyone), lesson 5 (都合 negotiation — scheduling logistics tend to stay a shade
  more neutral even between friends when a real commitment is being pinned down), lesson 6 (place
  negotiation, same reasoning).
- **Goes casual on purpose:** lesson 3 (the whole point — 行かない？ marked explicitly as
  friends-only, contrasted directly against lesson 2's polite form on the same verbs), the casual
  halves of lesson 4 (うん／ううん／ごめん) and lesson 7 (わかった／またね).
- **The one register trap named explicitly:** 大丈夫 as a decline (lesson 4). It is polite-register
  vocabulary that functions as a soft no, which is the opposite of what an English speaker expects
  from "I'm fine" — worth its own sentence in the phrase set, not just the grammarNote.

Net effect: a learner can run the whole "invite → respond → negotiate → confirm" script staying
polite throughout and never be wrong. Casual register is available at every step but never required
to complete the situation — it is the chapter's bonus track, not its gate.

---

## 7. What I think the plan is wrong or underspecified about

**"Immediately" overstates the chapter ordering, though not the payoff.** The brief says invitations
"exercise chapter 5's 〜ましょう／〜ませんか immediately," but chapters 6 (potential) and 7 (reported
speech, plus passive recognition) sit between chapter 5 and this one in the skeleton. "Immediately"
is true in the sense that matters — chapter 8 is the *first* situation to put the pattern to use,
and nothing between chapters 5 and 8 touches it — but a reader could take it to mean chapter 8
follows chapter 5 directly, which it does not. Small, but worth a wording fix since precision about
chapter dependencies is otherwise a strength of this plan.

**The plan is silent on casual volitional (行こう／食べよう), and this chapter's design had to work
around the gap.** The natural casual counterpart to ましょう when *proposing* (as opposed to
*asking*, which ない？ covers) is the plain volitional — 行こうか, "how about we go?". Book Two's
skeleton names it nowhere, not even in §4's "named leftovers" list, which otherwise accounts for
everything cut. I did not add it here: it is a genuine new conjugation rule (stem + おう／よう), which
is rule-chapter material, not something a word-shaped situation chapter should be introducing on its
own. I used the ない？ question form instead, which covers the *inviting* half of this chapter's
job without it. But a fuller casual-invitation register wants the volitional too, and if it is ever
taught, chapter 5 is the natural home — the exact same semantic slot as ましょう, one register down,
alongside the pattern this chapter already exercises. Flagging for whoever authors chapter 5, not
fixing here.

**The kanji shortfall is worse here than in chapter 1, and for a structurally different reason.**
Chapter 1 (a rule chapter) came up short on kanji because it deliberately brought no new verbs. This
chapter (a situation chapter) comes up short for the opposite reason chapter 1's own §6 predicted
situation chapters would *not*: Book One's coverage of the relevant vocabulary domain (time, social
vocabulary, places) turned out to be so complete that the situation itself supplies almost no new
kanji-bearing words. Four new kanji across seven lessons (0.57/lesson) is below even chapter 1's
already-flagged 0.6/lesson. §3's own inventory pass found two of the four "new" kanji were already
half-owned (約 via 予約, 週 via 先週/今週/来週/毎週) before the search even started looking for
savings. Chapter 1's §6 verdict — "flagging, not fixing" — applies here for the same reason: forcing
in 場所 or 誘う to buy two more kanji would be padding a situation chapter with vocabulary its
can-dos do not need, which is a worse outcome than an honest shortfall.

---

## 8. Authoring checklist

1. **Sourcing.** All 3 new words (約束, 週末, 都合) marked `content-source: training`, verified
   headword-by-headword against JMdict for Applications 3.6.2, `# jlpt-source: training` where a
   level is asserted (CLAUDE.md, [03 §9](03-book-two.md)). All ~25 phrases are composed sentences —
   training-canonical, marked, pending Tatoeba verification, same path as chapter 1.
2. **Commit messages** on every content commit must name the source, or the commit is rejected.
3. **No dialogue.** Lessons 2–4 and 7 are the risk — every phrase is a single independent utterance,
   never a scripted back-and-forth exchange (03 §7).
4. **The composition frame.** Seven frames, one per teaching lesson, authored alongside the lesson
   per [03 §0b/§8](03-book-two.md). Same sourcing rules as phrases.
5. **Confirm chapter 5 and chapter 3's pattern ids** before wiring `patternId` references in lessons
   2, 4 and 6 — both are placeholders here pending those chapters' own design docs.
6. **Run `pnpm walkthrough`** before merge.
