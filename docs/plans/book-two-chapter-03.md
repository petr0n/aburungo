# Book Two, Chapter 3 — Joining sentences

**Status: design, not content.** This document specifies every lesson in the chapter in enough
detail that authoring the YAML is mechanical. **No Japanese sentence is composed here.** Words are
cited by id from Book One's inventory, and grammar rules are illustrated with the minimal
word-plus-particle fragments the app's own content already uses this way (see §1) — never a fused,
independently meaningful clause. Every example *phrase* is specified in English, as a requirement
on a later authoring pass, which follows [03 §9](03-book-two.md) sourcing.

Source brief: [03-book-two.md](03-book-two.md) §1, §2, §4, §7, §9, §10. Prior chapter, the worked
example this document follows: [book-two-chapter-01.md](book-two-chapter-01.md). Working template:
[`src/content/lessons/n5-16-te-form.yaml`](../../src/content/lessons/n5-16-te-form.yaml).

**Shape landed: 7 teaching lessons + 1 recognition checkpoint.** New words: **~1** (とき). New
verbs: **0**. New phrases: **~27**. New kanji: **0** — see §6. This is a deliberate deviation from
the ~10 target; §5.1–§5.3 argue why 7 is the honest count, not a shrink under pressure.

---

## 1. The chapter header comment

Paste this at the top of the lessons file, in the style of the te-form and plain-form chapters.

```yaml
# Chapter 3 — Putting sentences together.
#
# Every sentence the learner has produced through chapter 2 has had one clause.
# This chapter is where that stops being true. It teaches six ways to put two
# ideas in one sentence -- three that connect two full clauses (から, ので, けど),
# two that chain two verbs belonging to the same subject (て, ながら), and one
# that takes the second half of that pair and turns it into something new: a
# clause standing in front of a noun instead of another clause (とき, and then
# any noun at all). That last move is why this chapter exists at the size it
# does. Book Two's reading sets (03-book-two.md §7) start once this chapter
# ships, because before it every eligible sentence is single-clause and a
# "reading set" is just phrases stacked. And chapter 4 -- explaining what hurts,
# to a doctor -- is placed immediately after because it is the first situation
# that genuinely needs a reason clause and a time clause in the same breath.
#
# The three connectors split by trap, not by difficulty of the base rule.
#
# から and ので look interchangeable and are not. Both attach directly after a
# plain-form verb or i-adjective. Both need a linking word before a na-adjective
# or noun -- but a different one. から takes だ, the same だ chapter 1 lesson 6
# just taught. ので takes な. A learner taught both in one lesson will blend
# them; a learner taught だから first, then handed なので as ので's own rule
# right after, keeps them apart. That ordering is the whole reason these are
# two lessons and not one.
#
# けど gets its own lesson because it is the first connector in the chapter
# exercised in both registers side by side -- plain and です／ますけど -- rather
# than one register standing in for the whole rule, the way the reason
# connectors do.
#
# て and ながら both chain two verbs under one subject, and both get compared
# against たり, which chapter 1 lesson 9 already taught and already flagged this
# exact collision: たり lists representative, unordered examples; て reports a
# real sequence; ながら reports two actions at once. Three lessons apart on
# purpose, so each one lands before the next is introduced.
#
# とき is the hinge. It is an ordinary noun -- the learner already has it
# folded inside ときどき -- and it takes exactly the だ／な／の attachment table
# lessons 1-3 just built, applied to a noun instead of a predicate. That is not
# a coincidence this chapter points out once and moves on from: lesson 7 is the
# generalisation of exactly that mechanism, from とき to any noun at all --
# unlocking the single most common shape in ordinary written Japanese, a clause
# sitting in front of a noun the way English uses "that" or "who" or nothing.
# The learner already has one word doing this job -- an i-adjective in front of
# a noun, from Book One's colour-noun lesson (赤いかばん, already shipped). This
# chapter's payoff is that the same slot takes a whole clause, not just one
# adjective.
#
#   1  から               reason, casual; だ from chapter 1 lesson 6 pays off
#   2  ので               reason, careful; な, not だ -- the direct collision
#   3  けど                contrast, both registers side by side
#   4  て as a connector   the te-form's third job; contrast with たり
#   5  ながら              same subject, same moment; contrast with 4 and たり
#   6  とき                a clause in front of one specific noun
#   7  noun-modifying clauses   the same slot, any noun -- the reading unlock
#
# Lesson 2 depends on 1 for the contrast to land, 4 depends on Book One's
# te-form chapter and on chapter 1 lesson 9, 6 depends on 1-3 for the
# attachment table, and 7 depends on 6 directly. This chapter must not be
# split by a checkpoint before lesson 7 -- the same constraint as every rule
# chapter before it.
#
# content-source: n/a for this file -- it references
#   vocabulary/joining-sentences.yaml and phrases/joining-sentences.yaml,
#   whose own provenance markers apply.
```

---

## 2. Naming and ids

Following [chapter 1's](book-two-chapter-01.md) convention exactly.

| Thing | Value |
|---|---|
| Chapter id | `b2.chapter-3` |
| Chapter title (learner-facing) | **Putting sentences together** |
| Lesson `situation` | `Putting sentences together` |
| Lesson ids | `b2.join-kara`, `b2.join-node`, `b2.join-kedo`, `b2.join-te`, `b2.join-nagara`, `b2.join-toki`, `b2.join-noun-clause` |
| Pattern ids | `grammar.b2-join-kara`, `grammar.b2-join-node`, `grammar.b2-join-kedo`, `grammar.b2-join-te`, `grammar.b2-join-nagara`, `grammar.b2-join-toki`, `grammar.b2-join-noun-clause` |
| Vocabulary file | `src/content/vocabulary/joining-sentences.yaml`, id `vocab.toki` |
| Phrase file | `src/content/phrases/joining-sentences.yaml`, id prefix `join.` |
| Lessons file | `src/content/lessons/b2-03-joining-sentences.yaml` |

**"Joining sentences" is the plan's internal label and, unlike chapter 1's "plain form," it survives
as the chapter title with minor softening** — "Putting sentences together" says the same thing in
words a learner reads as a promise, not a category.

`order`: **use 1–8 within the chapter.** Global order is assigned at book assembly, same as chapter
1 — Book Two's own numbering depends on chapters 1 and 2 shipping first.

---

## 3. The lessons

Every `wordIds` entry is a real Book One id, verified against the manifest. As in chapter 1: prefer
them over new material.

### Lesson 1 — Saying why, casually

- **Title:** Saying why, casually
- **Can-do:** Give a reason for something, the way you would to a friend
- **Teaches:** から as a reason marker — a second job for a word the learner already has. Book One's
  `grammar.n5-unit-4` (〜から来ました) is から meaning "from"; this lesson is から meaning "because,"
  attaching after a *complete* plain-form predicate rather than a place name. It attaches directly
  after a verb or i-adjective in plain form. A na-adjective or noun needs だ first — the exact だ
  chapter 1 lesson 6 taught for exactly this reason. から can also close an answer on its own, as
  the reason and nothing else.
- **Exercises (existing ids):** `vocab.iku` 行く, `vocab.tsukareru` 疲れる (verbs);
  `vocab.samui` 寒い, `vocab.isogashii` 忙しい (i-adjectives); `vocab.shizuka` 静か,
  `vocab.hima` 暇 (na-adjectives, exercising the だから attachment); `vocab.gakusei` 学生,
  `vocab.ame` 雨 (nouns, same だから attachment).
- **Exercises (earlier Book Two chapters):** Chapter 1 (plain form generally, and
  specifically lesson 6's だ for the na-adjective/noun case) — から's reason sense attaches to
  the same plain predicate chapter 1 built.
- **New vocabulary:** none.
- **New phrases:** 3 — one verb + から reason, one i-adjective + から reason, one だから reason built
  on a na-adjective or noun, so the chapter 1 だ callback is demonstrated rather than asserted. Each
  should read as an answer to an implicit "why," not a standalone statement.
- **Depends on:** Book Two chapter 1 in full — plain form generally, and specifically lesson 6 (だ)
  for the na-adjective/noun case.

### Lesson 2 — Saying why, more carefully

- **Title:** Saying why, more carefully
- **Can-do:** Give a reason the softer way — to a stranger, in an explanation, in an apology
- **Teaches:** ので, から's near-twin, on two axes worth the lesson. Attachment: verb and
  i-adjective plain form take ので directly, same as から — but na-adjective and noun take な, not
  だ (静かな*ので*, not 静かだ*ので*), a direct collision with lesson 1's だから worth naming as a
  trap rather than discovering by error. Register: ので reads as more objective and less personal
  than から, which is why announcements, apologies to strangers, and explanations that should sound
  reasonable rather than self-serving reach for it — から can sound like an excuse, ので rarely does.
- **Exercises (existing ids):** `vocab.wakaru` わかる (typically negative — "since I don't
  understand"), `vocab.tsukareru` 疲れる; `vocab.samui` 寒い, `vocab.chikai` 近い;
  `vocab.shizuka` 静か, `vocab.benri` 便利 (the なので attachment); `vocab.gakusei` 学生,
  `vocab.byouin` 病院 (noun + なので).
- **Exercises (earlier Book Two chapters):** Chapter 1 lesson 6 (だ) — な replaces だ before
  ので, the direct collision this lesson is built to teach.
- **New vocabulary:** none.
- **New phrases:** 4 — one verb + ので, one i-adjective + ので, one na-adjective + なので, one noun +
  なので. Pair the na-adjective or noun phrase against lesson 1's だから phrase in review so the
  だ／な contrast is checkable, not just stated in a grammarNote.
- **Depends on:** lesson 1 — the contrast is the point — and chapter 1 lesson 6 for na-adjective/noun
  predicate forms generally.

### Lesson 3 — Saying "but"

- **Title:** Saying "but"
- **Can-do:** Contradict, soften, or add a complication to what you just said
- **Teaches:** けど as a casual contrast marker, attaching after a complete predicate in either
  register — plain or polite (です／ますけど) — making this the first lesson in the chapter where
  both registers sit side by side rather than one standing in for the whole rule. Na-adjective and
  noun predicates take だけど in the plain register, the same だ lesson 1 used. Flagged but not
  drilled: けど also trails off before a request, softening it — that use returns properly once
  giving and receiving (chapter 2) supplies something worth softening a request about.
- **Exercises (existing ids):** `vocab.takai` 高い, `vocab.oishii` おいしい (i-adjectives, both
  registers); `vocab.suki` 好き (na-adjective, だけど and ですけど); `vocab.wakaru` わかる (verb,
  plain and polite).
- **Exercises (earlier Book Two chapters):** Chapter 1 lesson 6 (だ) — だけど reuses it for the
  na-adjective/noun case, the same way lesson 1 did for から.
- **New vocabulary:** none.
- **New phrases:** 3 — one plain contrast (adjective or verb + けど), one polite contrast
  (です／ますけど), one だけど built on a na-adjective, closing the lesson 1 callback.
- **Depends on:** chapter 1 lesson 6 (だ) for the na-adjective/noun case. Otherwise independent of
  lessons 1–2, though it sits beside them because it is the same shape — predicate plus particle.

### Lesson 4 — Doing one thing, then another

- **Title:** Doing one thing, then another
- **Can-do:** Describe two things you did, in order, as one sentence
- **Teaches:** the te-form's third job. The learner already has 〜てください (a request, Book One
  chapter 6) and 〜ています (an ongoing state, `grammar.n5-te-imasu`); this is 〜て as a bare
  connector between two verbs under one subject, read as "and then." No new conjugation — it is the
  same て the te-form chapter already built, so the lesson's whole cost is the new job, not the old
  table. The grammarNote must draw the line chapter 1 lesson 9 already flagged when it introduced
  たり: たり lists representative, unordered examples ("things like reading, things like cooking");
  て here reports a real sequence, in the order it happened. A learner who just spent a lesson on
  たり is exactly the learner who will blur the two.
- **Exercises (existing ids):** `vocab.okiru` 起きる, `vocab.taberu` 食べる, `vocab.neru` 寝る
  (ichidan); `vocab.kaeru` 帰る, `vocab.yasumu` 休む (godan る／む); `vocab.kaku` 書く,
  `vocab.oyogu` 泳ぐ, `vocab.matsu` 待つ, `vocab.nomu` 飲む, `vocab.hanasu` 話す — one verb from
  each te-form group, so the whole conjugation table is seen doing this new job, not only its
  easiest rows.
- **Exercises (earlier Book Two chapters):** Chapter 1 lesson 9 (たり) — contrasted directly:
  たり lists representative, unordered examples, while て here reports a real sequence.
- **New vocabulary:** none.
- **New phrases:** 4 — two same-subject action sequences (each pairing two verbs from different
  te-form groups, in order), and at least one phrase deliberately built to pair against a chapter 1
  lesson 9 たり phrase in review — same two verbs, different connector — so the sequential/
  representative contrast is checkable rather than asserted.
- **Depends on:** Book One chapter 6 in full (`grammar.n5-te-ichidan`, `n5-te-ku`, `n5-te-tte`,
  `n5-te-nde`) and chapter 1 lesson 9 (たり) for the contrast. This is the chapter's hardest
  external dependency — the same role lesson 5 played in chapter 1 — and deserves the same targeted
  SRS resurfacing of the four te-form patterns before it lands.

### Lesson 5 — Doing two things at once

- **Title:** Doing two things at once
- **Can-do:** Say you are doing two things simultaneously, as one person
- **Teaches:** 〜ながら, attached to the same pre-ます stem the learner has produced since the first
  polite verb in Book One (話します → stem 話し, 食べます → stem 食べ) — plus ながら, no new
  conjugation, only a new place to stop before ます. Two constraints earn their own sentence in the
  grammarNote: both actions need the same subject (ながら cannot join "I read while she cooks"), and
  the ながら-marked action is grammatically the secondary one, even though English translation hides
  that. Contrast explicitly against lesson 4's て (a sequence, one after another) and chapter 1's
  たり (a representative list) — three ways to put two verbs in one sentence, three different
  relationships between them, spaced across the chapter on purpose.
- **Exercises (existing ids):** `vocab.aruku` 歩く, `vocab.hanasu` 話す (a simultaneous pair);
  `vocab.taberu` 食べる, `vocab.yomu` 読む with `vocab.hon` 本 as the second clause's object, so it
  reads as a real clause rather than a bare verb; `vocab.utau` 歌う, `vocab.aruku` 歩く — the same
  two verbs lesson 4 chained with て, reused here with ながら so the difference is felt, not told.
- **Exercises (earlier Book Two chapters):** Chapter 1 lesson 9 (たり), continuing lesson 4's
  three-way contrast — て, ながら and たり as three different relationships between two verbs.
- **New vocabulary:** none.
- **New phrases:** 3 — two simultaneous-action pairs from different exercise sets, and one built as
  the direct ながら counterpart of a lesson 4 て phrase using the same two verbs, for the reason
  above.
- **Depends on:** lesson 4 (the contrast). Book One's ます-stem needs no separate citation — it
  underlies every polite verb the learner has already produced.

### Lesson 6 — Saying when

- **Title:** Saying when
- **Can-do:** Say when something happens or happened, as its own clause
- **Teaches:** とき, "time," used the way English uses "when" — a plain-form clause placed in front
  of it. This is the mechanism the whole chapter has been building toward: とき is an ordinary noun,
  and it takes exactly the attachment rules lessons 1–3 already built for turning a predicate into
  something that can sit in front of a word — a verb or i-adjective attaches directly, a
  na-adjective takes な (the same な as lesson 2's ので), and a noun takes の — ordinary possession,
  the same の the learner already uses for ownership, here applied to a moment in time rather than
  an object. One genuine new trap: tense inside the とき-clause is relative to the event, not to the
  moment of speaking — a non-past verb means "before/as it happens," a past verb means "once it has
  happened." Teach this as a working heuristic (non-past = not yet, past = already done), not as an
  exhaustive rule — the full picture is a later book's problem, and this lesson should say so.
  Worth naming out loud: the learner already has とき's sound sitting inside `vocab.tokidoki`
  ときどき ("sometimes") — this lesson is that syllable standing alone as its own word.
- **Exercises (existing ids):** `vocab.noru` のる with `vocab.basu` バス (non-past clause);
  `vocab.tsuku` 着く with `vocab.ie` 家 (past clause); `vocab.samui` 寒い (i-adjective);
  `vocab.shizuka` 静か (na-adjective, なとき); `vocab.kodomo` 子供 (noun, のとき — the most common
  shape of this pattern in ordinary speech).
- **Exercises (earlier Book Two chapters):** Chapter 1 in full — とき takes a plain-form
  clause built from chapter 1's conjugation work, plus lessons 1 through 3's だ／な attachment
  table.
- **New vocabulary:** **1** — とき itself, as a standalone noun.
- **New phrases:** 5 — one non-past verb clause, one past verb clause (shown as a pair, so the tense
  heuristic is demonstrated rather than asserted), one i-adjective clause, one na-adjective clause,
  one noun clause. The chapter's largest phrase set, because the lesson does double duty: teaching
  とき and rehearsing the だ／な／の attachment table lessons 1–3 built.
- **Depends on:** lessons 1–3 for the attachment pattern, and chapter 1 in full for the plain-form
  clause itself.

### Lesson 7 — The book, the person, the place

- **Title:** The book, the person, the place
- **Can-do:** Understand — and build — a noun described by a whole sentence, not just one word
- **Teaches:** the generalisation lesson 6 was quietly rehearsing. The learner has had a single word
  modify a noun since Book One's colour-noun lesson — an i-adjective sitting directly in front of a
  noun (`grammar.n5-colour-noun`, already shipped as 赤いかばん). とき just showed that same slot
  accepting a full plain-form clause instead of one adjective, but only in front of one specific
  noun. This lesson makes the move explicit: that slot is not special to とき. Any plain-form
  clause — with its own object, its own particles, as long as it ends in a verb or adjective,
  plain — sits in front of *any* noun and describes it, the way English uses "that," "who," or
  nothing at all. Scope held deliberately tight: verb-clause and i-adjective-clause modification are
  drilled fully; na-adjective-clause modification is mentioned as the same な lesson 6 already used
  (transfer, not new drill); noun-predicate modification ("the person who *was* a student," which
  cannot just take だ) is a real N4 corner with its own complications and is named here as a
  leftover for a later book, not folded in under time pressure.
- **Exercises (existing ids):** `vocab.hon` 本, modified by a past-tense clause built on
  `vocab.kau` 買う and `vocab.kinou` 昨日; `vocab.hito` 人, modified by a plain non-past clause
  built on `vocab.hanasu` 話す with `vocab.eigo` 英語 as its object; `vocab.ie` 家, modified by a
  clause using `vocab.sumu` 住む plus `grammar.n5-te-imasu` (ています) — the noun-modification
  mechanism landing directly on Book One's own progressive form, exactly the recombination this book
  is built to produce; `vocab.mise` 店, modified by a negative clause built on `vocab.takai` 高い,
  exercising chapter 1's plain negative inside a modifier rather than as a sentence's main predicate;
  `vocab.tomodachi` 友達, modified by a past clause built on `vocab.au` 会う.
- **Exercises (earlier Book Two chapters):** Chapter 1's plain form generally, and
  specifically its plain negative (lessons 2 and 3) — exercised here inside a noun-modifying
  clause rather than as a sentence's main predicate.
- **New vocabulary:** none.
- **New phrases:** 5 — one per exercise above, each specified by the clause type it must carry (past
  verb, non-past verb with an object, 〜ている, plain negative, another past verb), so the five
  together exercise every plain form chapter 1 built, this time inside a modifier rather than as a
  sentence's main predicate.
- **Depends on:** lesson 6 directly. This lesson does not introduce a new attachment rule — it
  removes とき as the only noun the rule works on.

### Lesson 8 — Chapter 3 checkpoint

- **Title:** Chapter 3 checkpoint
- **Can-do:** Recognise everything taught so far
- **`checkpoint: recognition`**, `wordIds: []`, `phraseIds: []`, `kanji: []`, no `patternId` — same
  shape as chapter 1's checkpoint and `n5.checkpoint-6`.
- **Format (03 §10):** recall, not tile-tap — type the reading or meaning. Mastery gate, not a
  grade: the remaining set shrinks to zero, retries unlimited, nothing recorded, misses rejoin the
  SRS queue (DR-020).
- **Placement:** at the chapter boundary. **Cannot be split earlier** — lesson 7 depends on 6, which
  depends on 1–3, which is the same "no earlier checkpoint" constraint every rule chapter in this
  book carries.

---

## 4. Totals

| | Count | Against the book's per-lesson average |
|---|---|---|
| Teaching lessons | 7 | below the ~10 target — see §5.1–§5.2 for why |
| Checkpoints | 1 | one per chapter (DR-021) |
| New words | **~1** (とき) | far below the 5.7/lesson book average — deliberate, see §5.4 |
| New verbs | **0** | deliberate, see §5.4 and §5.5 |
| New phrases | **~27** | 3.9/lesson — above chapter 1's 3.4, because most lessons here carry a register or attachment trap on top of the base rule |
| New grammar patterns | 7 | one per teaching lesson |
| New kanji | **0** | 時 is already taught (Book One's `n5-04-transit.yaml`) — see §6 |

---

## 5. The open calls

### 5.1 Noun-modifying clauses live inside this chapter, as lesson 7

**Answer: inside, immediately after とき, as its own lesson.** This is the most consequential call
in this document, so the argument in full:

The plan names noun-modifying clauses "the biggest reading unlock on this list, and implicit the
moment 〜とき is taught," and asks this document to decide whether it lands inside chapter 3 or right
after. **Right after would mean a fourth situation-shaped delay before it exists at all** — chapter
4 is fixed as the doctor situation, and nothing in the ~10-chapter skeleton has room for an extra
rule chapter without displacing something the plan already committed to (§4's owner decisions,
settled 2026-08-24). Deferring it to Book Three is the real alternative, and it collides directly
with [03 §7](03-book-two.md): the reading sets start "from roughly chapter 4 on, once
joining-sentences exists," drawing on Tatoeba sentences that will contain relative clauses
constantly — "the book I bought," "a person who speaks X" are not exotic constructions, they are
ordinary prose. Shipping chapter 4's reading surface to a learner who cannot parse the single most
common clause-modification shape in the language undercuts the exact feature this chapter exists to
unlock.

It is also, as the plan itself half-argues, genuinely cheap here and nowhere else. とき is not a
special case built for a keyword — it is an ordinary noun taking the だ／な／の attachment table
lessons 1–3 already built. The learner already owns the single-word version of this exact slot
(`grammar.n5-colour-noun`'s 赤いかばん, i-adjective in front of a noun). Lesson 7 does not teach a
new mechanism; it removes とき as the only noun the mechanism works on. That is one lesson's worth
of generalisation, not a new chapter's worth of new material — the same shape as chapter 1's だ
lesson being "exactly one lesson's worth and no more."

### 5.2 One lesson each for から, ので and けど — no merge

**Answer: three lessons.** から and ので share a base rule (attach after plain form; だ/な before a
na-adjective or noun) and differ in exactly the two ways that make them worth separating: which
linking particle the na-adjective/noun case takes, and which register each reads as. Teaching both
in one lesson risks exactly the blend the header comment warns about — a learner who cannot
reliably produce だから vs なので after one combined lesson is a predictable failure mode, and it is
cheaper to prevent it with lesson ordering than to re-teach it later. けど earns separation for a
different reason: it is the first connector exercised in both registers side by side, which
から/ので are not (から's polite register barely differs and gets no separate drill; ので's default
reading already leans polite-adjacent).

**If the chapter must shrink**, the merge that costs the least is から and ので into one lesson —
one base rule, two linking-particle sub-cases — which mirrors how chapter 1's だ lesson held four
shapes in one lesson. That takes the chapter to 6 teaching lessons. I would not take it further:
merging in けど loses the register-contrast drilling entirely, and merging て/ながら erases the
exact three-way contrast (て / ながら / たり) the header comment argues is worth three lessons of
separation.

### 5.3 とき and noun-modification, scoped rather than exhaustive

**Answer: teach the working heuristic, name the rest as a leftover.** Two corners are deliberately
cut in this chapter, both flagged in their lesson entries rather than discovered at authoring:

- **とき's tense agreement** (lesson 6) is taught as a heuristic — non-past means "before/as," past
  means "once it has happened" — not as the exhaustive rule N4 textbooks eventually give it. The
  heuristic covers the large majority of natural usage and is teachable in one lesson; the full rule
  is not.
- **Noun-predicate clause modification** (lesson 7) — "the person who *was* a student" — is named
  and skipped. A noun predicate cannot simply take だ inside a modifier the way it does as a main
  predicate (学生だ人 is not grammatical), and the workarounds belong with という and other N3-
  adjacent machinery this book does not carry. Verb-clause and i-adjective-clause modification, the
  high-frequency cases, are drilled fully; na-adjective-clause modification transfers for free from
  lesson 6's なとき.

Both are the same kind of call chapter 1 made when it scoped 〜たことがある to what "the concept, not
the construction" needed. Neither corner-cut should surprise an authoring pass that reads the lesson
entries above.

### 5.4 Near-zero vocabulary, zero new kanji — deliberate, and it held up under checking

**Answer: ~1 new word, 0 new kanji.** This chapter is connective tissue, not content — its whole job
is machinery for combining words the learner already owns, and unlike chapter 1 it did not need to
manufacture that claim: I checked it against the manifest lesson by lesson. Every situational noun,
adjective and verb this chapter's example phrases need — weather (`vocab.ame`, `vocab.tenki`),
time (`vocab.kinou`, and `vocab.kodomo` for "when I was a child"), tiredness and business
(`vocab.tsukareru`, `vocab.isogashii`), places (`vocab.mise`, `vocab.ie`, `vocab.byouin`), the verbs
that give とき and the noun-modifying-clause lesson their variety — already exists in Book One's 484
words. The one gap found across the whole chapter is とき itself, needed as a standalone word
because lesson 7 generalises away from it and a learner needs it as a real noun, not only a bound
pattern piece, exactly as chapter 1 treated こと.

Kanji follows the same logic to zero rather than near-zero: every exercise word is Book One's own,
carrying kanji Book One already taught, and とき's own kanji (時) was already introduced in Book
One's `n5-04-transit.yaml`. This chapter could ship with `kanji: []` on every lesson.

### 5.5 Sensitivity to the deferred fresh-verbs question

**This chapter is not sensitive to it, and that is worth stating plainly rather than assuming.**
The open question — whether Book Two's rule chapters bring fresh verbs, as the te-form chapter did,
or drill only Book One's 87 — matters most where a rule has verb-group structure a fresh verb is
needed to fill (te-form's く/ぐ/う・つ・る/む・ぬ・ぶ・す rows). None of this chapter's six items has
that shape: から, ので, けど, ながら and とき all attach uniformly to the plain form chapter 1 already
built, with no verb-ending-specific behaviour, and て-as-connector reuses Book One's existing
te-form table rather than adding a new one. There is no "row" here a fresh verb is needed to fill.

**Both variants, stated:**

- **If the owner decides no fresh verbs** (the default this document was authored against): ship as
  designed — 0 new verbs, the ~27 phrases built entirely from Book One's 87.
- **If the owner decides yes, uniformly across all seven rule chapters**: this chapter absorbs it at
  no structural cost. Swap a handful of the reused verbs in lessons 4, 5 and 7's example pools — the
  lessons with the most exercise slots — for fresh ones; the lesson count, the phrase count, and
  every dependency in §3 stay exactly as written.

---

## 6. Things I think the plan is wrong or silent about

**The skeleton's row for chapter 3 undercounts its own chapter by the thing it calls the biggest
reading unlock on the list.** [03 §4](03-book-two.md)'s table lists "から, ので, けど, て as a
connector; 〜ながら, 〜とき" as chapter 3's content — six items — while noun-modifying clauses sits
one section down, filed as a "named leftover" with a note that it "belongs inside or right after
chapter 3." §5.1 above resolves the placement question the plan asked this document to resolve, but
the skeleton table itself should be corrected to list it as chapter 3 content once this ships,
rather than leaving the next reader of §4 to discover that the row they can see is missing its most
important line.

**とき's tense-agreement nuance is compressed into a few words on a shared row, with nothing
signalling it costs more than から/ので's re-labelling.** It doesn't cost a chapter, and §5.3 scopes
it to something teachable in one lesson — but a skeleton reader who sizes chapter 3 purely from its
row (six comma-separated items, same visual weight as chapter 1's four-item row that needed 10
lessons) would reasonably expect more lessons here than the content turned out to need once actually
designed. Not a wrong call, a flag: skeleton rows are not a reliable proxy for lesson count, in
either direction.

**Continuing chapter 1's flagged kanji-arithmetic concern, with a fresher number.** Chapter 1 asked
for "a measurement to take after chapter 3 ships." Here it is: this chapter ships **0** new kanji,
lower than chapter 1's already-low ~6. Two rule chapters into the book, roughly seventeen teaching
lessons have shipped against [03 §3](03-book-two.md)'s ~2.3-kanji-per-lesson budget, and delivered
about six kanji total against a pro-rated ~39. This is not a new finding — it is chapter 1 §6's flag
holding, not resolving — but it is worth restating with the actual chapter 3 numbers now that they
exist, since two of the book's seven rule chapters are the ones least likely to close that gap on
their own, and situation chapters 4 and beyond will need to carry more of it than §3's flat average
assumes.

---

## 7. Authoring checklist

1. **Sourcing.** とき marked `content-source: training`, verified against JMdict for Applications
   3.6.2 headword-by-headword, with `# jlpt-source: training` if a level is asserted
   ([03 §9](03-book-two.md), CLAUDE.md). All ~27 phrases are composed, not sourced — they follow the
   sanctioned path: training-canonical, marked, pending Tatoeba verification. `node scripts/jlpt.mjs
   sentences` is a checking tool here, not a supply, same as chapter 1.
2. **Commit messages** on every content commit must name the source, or the commit is rejected.
3. **No fused clauses in this document became fused clauses in the YAML by accident.** Several
   lessons above (4, 5, 7 especially) describe phrases by clause type rather than composing them,
   deliberately — that discipline should carry into authoring: build each phrase from the cited
   words at authoring time, not by lifting a fragment out of this design doc.
4. **The composition frame.** [03 §0b/§8](03-book-two.md) requires each lesson's frame authored
   alongside it. Seven frames, one per teaching lesson, following the same sourcing rules as
   phrases.
5. **Re-surface prerequisites before the lessons that need them.** Book One's four te-form patterns
   (`grammar.n5-te-ichidan`, `n5-te-ku`, `n5-te-tte`, `n5-te-nde`) before lesson 4 — chapter 1 asked
   for the same resurfacing before its own lesson 5, so if both chapters have shipped this is now a
   shared queue-weighting need, not two separate asks. Chapter 1 lesson 6 (だ) before lesson 1, and
   chapter 1 lesson 9 (たり) before lesson 4.
6. **Run `pnpm walkthrough`** before merge — content that adds or renumbers lessons.
