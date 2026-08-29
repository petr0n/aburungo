# Book Two, Chapter 2 — Giving & receiving

**Status: design, not content.** This document specifies every lesson in the chapter in enough
detail that authoring the YAML is mechanical. **No Japanese sentence is composed here.** Words and
verb forms are cited by id from Book One's inventory (or from the chapter's own four new verbs);
every example *sentence* is a requirement on a later authoring pass, which follows
[03 §9](03-book-two.md) sourcing.

Source brief: [03-book-two.md](03-book-two.md) §1, §2, §4, §9, §10. Sibling document:
[book-two-chapter-01.md](book-two-chapter-01.md), the pilot this one matches. Working template for
a rule chapter: [`src/content/lessons/n5-16-te-form.yaml`](../../src/content/lessons/n5-16-te-form.yaml).

**Shape landed: 9 teaching lessons + 1 recognition checkpoint.** New words: **4, unconditionally**
(あげる, もらう, くれる — the chapter's own subject, not padding — plus 手伝う, settled unconditional
by the chapter 10 collision resolved in lesson 6 and §6 below), plus **0–1 favor verb** (見せる)
pending the owner's fresh-verbs call (§6). New phrases: **~29**. New kanji: **1** (伝, from 手伝う,
now unconditional) — see §4 and §7.

---

## 1. The chapter header comment

Paste this at the top of the lessons file, in the style of the te-form and plain-form chapters.

```yaml
# Chapter 2 — Giving & receiving.
#
# English has one verb for this and hands out the direction with a preposition:
# I give it TO you, you give it TO me. Japanese has three verbs, and the
# direction is not optional decoration -- it is which verb you reach for.
# あげる is a gift moving away from the speaker's side. もらう is a gift
# arriving on the speaker's side, named from the receiver's point of view.
# くれる is the same arrival, except someone else is the grammatical subject --
# a friend, a stranger, your own mother can all "kureru" something to you, and
# the verb exists only to mark that the benefit landed on you. Mixing these up
# is not a minor accent; あげる where くれる belongs describes the exchange
# from the wrong side of the table.
#
# This chapter is placed second, not last, because nothing in it is blocked.
# It needs polite verb forms, which every lesson since day one has used, and
# the te-form, which Book One's chapter 6 already paid for in full --
# grammar.n5-te-ichidan, n5-te-tte and n5-te-nde cover every verb this
# chapter touches (nothing here ends in く or ぐ, so n5-te-ku never comes up).
# It does not need plain form, even though it sits directly after the chapter
# that teaches it. That adjacency is convenient, not load-bearing: every
# sentence in this chapter can be built entirely in polite register, and
# none of it is revisited later as a dependency for chapter 1.
#
# There is also a debt here, smaller than chapter 1's but the same shape. The
# learner has typed ください at the end of a request since chapter 1's
# greetings lesson (ひとつください), first as a bare noun-plus-kudasai and
# constantly since te-form arrived. ください is not a magic politeness word --
# it is the imperative of くださる, the honorific stand-in for くれる. Every
# 見てください the learner has ever typed already said, structurally, "kindly
# let the seeing be given to me." This chapter is where that finally gets to
# mean something, in lesson 8.
#
# The split: three base verbs, one lesson to force the choice between them,
# one lesson to fence off a neighbouring confusion that is not this chapter's
# territory, then the three payoff patterns with the request register --
# named in the book plan as the reason this chapter exists at all -- pulled
# out as its own lesson rather than folded into a statement lesson.
#
#   1  あげる                   giving, from the speaker's side
#   2  もらう                   receiving, named from the speaker's side too
#   3  くれる                   receiving, but someone else is the subject
#   4  choosing the right one   the same event, told from either side
#   5  not the same as lending  貸す／借りる／返す already exist and are not this
#   6  ～てあげる                doing something for someone, as a favour
#   7  ～てくれる                someone doing something for you, unprompted
#   8  asking for the favour    ～てくれますか／～てくれませんか -- ください,
#                               named at last
#   9  ～てもらう                getting someone to do it for you
#
# あげる and もらう share a subject before くれる breaks the pattern, the same
# easy-half-first shape as chapter 1's ない split. Lessons 6-9 depend on 1-3;
# lesson 8 depends on 7; lesson 9 does not depend on 8. This chapter must not
# be split by a checkpoint before lesson 9, the same constraint as chapter 1
# and the te-form chapter.
#
# content-source: n/a for this file -- it references vocabulary/giving-receiving.yaml
#   and phrases/giving-receiving.yaml, whose own provenance markers apply.
```

---

## 2. Naming and ids

Following [chapter 1's convention](book-two-chapter-01.md#2-naming-and-ids) exactly — no `n5.`-style
legacy prefix, no JLPT level anywhere the learner can read it (DR-024).

| Thing | Value |
|---|---|
| Chapter id | `b2.chapter-2` |
| Chapter title (learner-facing) | **Giving & receiving** |
| Lesson `situation` | `Giving & receiving` |
| Lesson ids | `b2.giving-ageru`, `b2.giving-morau`, `b2.giving-kureru`, `b2.giving-choose`, `b2.giving-not-lending`, `b2.giving-te-ageru`, `b2.giving-te-kureru`, `b2.giving-te-kureru-request`, `b2.giving-te-morau` |
| Pattern ids | `grammar.b2-giving-ageru`, … (same slug per lesson, `grammar.` prefix) |
| Vocabulary file | `src/content/vocabulary/giving-receiving.yaml`, ids `vocab.*` |
| Phrase file | `src/content/phrases/giving-receiving.yaml`, id prefix `giving.` |
| Lessons file | `src/content/lessons/b2-02-giving-receiving.yaml` |
| Checkpoint id | `b2.checkpoint-2`, `chapterId: b2.chapter-2` (checkpoints carry their chapter's id — confirmed against `n5.checkpoint-3`, which does the same for Book One) |

**"Giving & receiving" needs no relabelling.** Unlike "plain form," the skeleton's internal name for
this chapter is already what a learner would want to read — it names the can-do, not the grammar
category. Kept as-is.

`order`: **use 1–10 within the chapter** (9 teaching + 1 checkpoint). Global order numbers are
assigned when the book is assembled, per [03 §0a](03-book-two.md) — not this document's decision.

---

## 3. The lessons

Every `wordIds` entry below is a real Book One id from the manifest, or one of this chapter's own
four new verbs once they exist. **Prefer Book One material for everything except the verbs the
chapter is actually about.**

### Lesson 1 — Giving something to someone

- **Title:** Giving something to someone
- **Can-do:** Say that you give something to someone
- **Teaches:** あげる as the direction-of-giving verb when the gift moves away from the speaker's
  side — the giver is the grammatical subject, structurally "I do the giving." Covered: the basic
  sentence shape (giver は, recipient に, thing を, あげます), and one caution stated plainly rather
  than derived: **avoid
  aiming あげる at someone clearly above you** — a teacher, a boss. It is not ungrammatical, but it
  reads as presumptuous, the same register instinct as choosing plain form for a stranger in
  chapter 1. There is a more careful word for that direction and it is not this chapter's job to
  teach it (§7).
- **Exercises (existing ids):** `vocab.tomodachi` 友達, `vocab.imouto` 妹, `vocab.otouto` 弟,
  `vocab.kodomo` 子供 as recipients — all people a learner can give to without the caution above
  applying; `vocab.hana` 花, `vocab.hon` 本, `vocab.okashi` お菓子, `vocab.kutsushita` 靴下 as
  things given; `vocab.tanjoubi` 誕生日 to give the exchange a reason.
- **Exercises (earlier Book Two chapters):** None — depends on nothing in Book Two; built
  from は／に／を and polite verb conjugation, in hand since Book One's first lesson.
- **New vocabulary:** **1** — あげる. Unavoidable; it is the lesson.
- **New phrases:** 3. One giving 花 to a friend for a stated reason (誕生日); one giving something
  to a younger sibling; one negative or question, so the form is seen inflected and not only in
  its bare polite statement.
- **Depends on:** nothing in Book Two. Needs only は／に／を and polite verb conjugation, all in
  hand since Book One's first lesson.

### Lesson 2 — Receiving something from someone

- **Title:** Receiving something from someone
- **Can-do:** Say that you received something from someone
- **Teaches:** もらう, named from the same side as あげる — the speaker is still the grammatical
  subject, but now on the receiving end. The source is marked with から or に (だれから, だれに);
  から is not new — Book One's `greetings.where-from` (どこから来ましたか) and `greetings.from-america`
  (アメリカから来ました) already taught it for places, and this lesson extends it to people, exactly
  the recombination [03 §2](03-book-two.md) asks for. No caution is needed here in either
  direction — receiving from a teacher or a stranger is unmarked, unlike giving to one.
- **Exercises (existing ids):** `vocab.tomodachi` 友達, `vocab.haha` 母, `vocab.dare` 誰 (for
  「誰から」questions), `vocab.hon` 本, `vocab.tanjoubi` 誕生日.
- **Exercises (earlier Book Two chapters):** None — から here extends Book One's
  greetings-chapter usage from places to people; no Book Two chapter is drawn on.
- **New vocabulary:** **1** — もらう.
- **New phrases:** 3. One receiving from a friend; one receiving from a family member marked with
  に rather than から, so both markers are seen; one だれから question.
- **Depends on:** lesson 1, loosely — shares its sentence shape, not its content. Reuses から from
  Book One's greetings chapter.

### Lesson 3 — When someone gives it to you

- **Title:** When someone gives it to you
- **Can-do:** Say that someone gave you something
- **Teaches:** くれる — the verb that breaks the pattern the first two lessons set up. The subject
  is not the speaker; a friend, a parent, a teacher can all be the one doing the giving. What makes
  it くれる rather than another あげる is that the benefit lands on the speaker (or the speaker's
  side — a family member counts). This is the lesson's whole difficulty and the grammarNote should
  say so directly: **the form is not the hard part, the perspective is.** The caution from lesson 1
  does not apply in reverse — a teacher giving to the speaker via くれる is completely ordinary.
- **Exercises (existing ids):** `vocab.tomodachi` 友達, `vocab.haha` 母, `vocab.chichi` 父,
  `vocab.sensei` 先生, `vocab.hon` 本, `vocab.kasa` 傘 (an umbrella lent in the rain is a familiar
  enough scene to carry the sentence).
- **Exercises (earlier Book Two chapters):** None — contrasts only against this chapter's
  own lessons 1 and 2.
- **New vocabulary:** **1** — くれる.
- **New phrases:** 4 — the largest allotment of the base-verb trio, because this is where the
  chapter's real cost sits. One from a friend; one from a family member; one **deliberate minimal
  pair against a lesson 1 phrase** — same person, same object, direction reversed, so the choice of
  verb is visibly the only variable between the two; one question.
- **Depends on:** lessons 1 and 2, for contrast. This is the lesson the chapter is built to get
  right.

### Lesson 4 — Choosing the right one

- **Title:** Choosing the right one
- **Can-do:** Pick the right giving verb for who is on each side of an exchange
- **Teaches:** no new form. The same event, told from either side of the table, requires a
  different verb depending only on whose perspective the sentence takes — the single most-cited
  difficulty in this entire area of the grammar, and it earns its own lesson the way chapter 1 gave
  だ its own slot despite being a re-labelling: cheap to build, not cheap to get right. Framed as a
  decision procedure, not a rule: *is the speaker doing the giving? あげる. Is the speaker
  receiving, told from the speaker's side? もらう. Is someone else doing the giving, and the
  speaker benefits? くれる.*
- **Exercises (existing ids):** reuses lessons 1–3's set so the contrast lands on familiar material
  — `vocab.tomodachi` 友達, `vocab.haha` 母, `vocab.imouto` 妹, `vocab.sensei` 先生, `vocab.hon` 本,
  `vocab.hana` 花.
- **Exercises (earlier Book Two chapters):** None — contrasts only against this chapter's
  own lessons 1 through 3.
- **New vocabulary:** none.
- **New phrases:** 3, all minimal pairs — each pair holds the people and the object constant and
  changes only the direction, so the correct verb is forced by the situation rather than
  recognisable from the vocabulary in the sentence.
- **Depends on:** lessons 1, 2 and 3.

### Lesson 5 — Not the same as lending

- **Title:** Not the same as lending
- **Can-do:** Ask to borrow something without accidentally asking to keep it
- **Teaches:** the boundary between this chapter's verbs and a **different family that already
  exists** — 貸す (lend), 借りる (borrow), 返す (give back), all three taught in Book One's te-form
  chapter and all three still owned. English "give," "lend" and "borrow" sit close enough together
  that a learner reaching for もらう when they mean 借りる asks to keep something that was only
  ever offered as a loan. The teaching point is the boundary, not new material — the same shape as
  chapter 1's warning that a る-ending verb is not automatically ichidan: a genuine trap named
  cheaply because the pieces are already in hand.
- **Exercises (existing ids):** `vocab.kasu` 貸す, `vocab.kariru` 借りる, `vocab.kaesu` 返す,
  `vocab.kasa` 傘, `vocab.hon` 本, `vocab.okane` お金 — all classic loan objects, all owned.
- **Exercises (earlier Book Two chapters):** None — the boundary drawn is against 貸す／借りる／返す,
  taught in Book One's te-form chapter, not against any earlier Book Two chapter.
- **New vocabulary:** none. **New kanji:** none — 貸, 借 and 返 were all introduced in Book One's
  te-form chapter (`n5-16-te-form.yaml`).
- **New phrases:** 3. One contrastive pair on the same object — asking to borrow it versus asking
  to be given it — so the two requests are visibly different sentences; one using 返す to close the
  loop; one review question mixing both families.
- **Depends on:** lessons 1 and 2. Does not need lesson 3.

### Lesson 6 — Doing something for someone

- **Title:** Doing something for someone
- **Can-do:** Offer to do something for someone, as a favour
- **Teaches:** 〜てあげる — te-form plus あげる, the favour version of lesson 1's direction. The
  form costs nothing new (it is lesson 1's verb, conjugated the way every te-form payoff in this
  app is built); what is new is that the thing changing hands is an action rather than an object,
  and the same caution from lesson 1 carries over unchanged — offering 手伝ってあげます to a
  teacher has the same presumptuous edge as offering them a gift with あげる.
- **Exercises (existing ids):** `vocab.oshieru` 教える, `vocab.tsukuru` 作る,
  `vocab.kau` 買う, `vocab.motsu` 持つ — all already own their kanji and all read naturally as a
  favour done for someone (teaching someone something, making something for them, buying something
  for them, carrying something for them).
- **Exercises (earlier Book Two chapters):** None — 手伝う is introduced here, not reused from
  anywhere earlier.
- **New vocabulary:** **1 — 手伝う** ("to help," てつだう), settled unconditional. This is decoupled
  from §6's general fresh-verbs question: chapter 10 (Trouble) independently proposed the same word
  for its own favour-asking lesson, and the collision is resolved by having chapter 2 own the
  introduction — a favour verb belongs with giving-and-receiving, and chapter 2 comes first. That
  downstream need is what makes 手伝う worth teaching regardless of how §6 eventually resolves for
  見せる, the chapter's other, still-conditional candidate. See §6.
- **New phrases:** 3.
- **Depends on:** lesson 1; Book One's `grammar.n5-te-ichidan` (教える) and `n5-te-tte` (作る, 買う,
  持つ, 手伝う) for the te-form itself. Worth a targeted re-surfacing of those
  patterns before this lesson, the same recommendation chapter 1 makes before its own plain-past
  lesson.

### Lesson 7 — When someone does something for you

- **Title:** When someone does something for you
- **Can-do:** Say that someone did something for you, as a favour
- **Teaches:** 〜てくれる — the payoff of lesson 3's perspective flip, and the lesson that finally
  cashes in the chapter's opening hook. **ください, typed at the end of every request since
  n5.te-ichidan, is the imperative of くださる, the honorific stand-in for くれる.** The
  grammarNote should say this in as many words: every 見てください the learner has ever produced
  already meant, underneath, "kindly do the seeing as a favour to me" — they have been using half
  of this pattern since lesson one without a name for it.
- **Exercises (existing ids):** `vocab.oshieru` 教える, `vocab.tsukuru` 作る, `vocab.kasu` 貸す
  (貸してくれる — lending as a favour, a direct callback to lesson 5), `vocab.matsu` 待つ.
- **Exercises (earlier Book Two chapters):** None — built on Book One's te-form patterns and
  this chapter's own lessons 3 and 6.
- **New vocabulary:** 0, or **1** (見せる, "to show" — 見せてくれる is the other canonical example
  alongside 手伝ってくれる) if fresh verbs are sanctioned. See §6.
- **New phrases:** 3.
- **Depends on:** lesson 3; lesson 6's `grammar.n5-te-ichidan`/`n5-te-tte`, plus `n5-te-nde` newly
  needed here for 貸す (貸してくれる).

### Lesson 8 — Asking for the favour

- **Title:** Asking for the favour
- **Can-do:** Ask someone, gently, to do something for you
- **Teaches:** turning lesson 7's statement into a question — 〜てくれますか and the softer
  〜てくれませんか, a negative question that reads as more polite precisely because it leaves room
  for "no." This is the pattern the book plan names as the reason the whole chapter is pulled
  early: a request that is not 〜てください. Both forms use only question formation the learner has
  had since Book One's first chapter — ます-form and ません-form questions are part of the basic
  polite paradigm every verb card has shown since lesson one — with no dependency on chapter 5's
  〜ましょう／〜ませんか, which has not been taught yet and is not needed here.
- **Exercises (existing ids):** the same favour verbs as lesson 7 — `vocab.oshieru` 教える,
  `vocab.tsukuru` 作る, `vocab.matsu` 待つ, `vocab.kasu` 貸す.
- **Exercises (earlier Book Two chapters):** None — explicitly needs no chapter 5 material:
  ます-form and ません-form questions are Book One's basic polite paradigm, not chapter 5's
  〜ましょう／〜ませんか, which has not been taught yet and is not needed here.
- **New vocabulary:** none.
- **New phrases:** 4 — the chapter's payoff deserves solid coverage: one 〜てくれますか request;
  one 〜てくれませんか request; one paired against an existing `phrases/te-form.yaml`
  〜てください phrase (the same request, softer), so the register difference is reviewable rather
  than asserted, exactly as chapter 1's ないでください lesson pairs against its てください twin;
  one more in a different context.
- **Depends on:** lesson 7, directly — the question is meaningless without the statement it softens.

### Lesson 9 — Having someone do it for you

- **Title:** Having someone do it for you
- **Can-do:** Say that you got someone to do something for you
- **Teaches:** 〜てもらう — te-form plus もらう, the trickiest of the three payoff patterns because
  the grammatical subject (the speaker) is not the one performing the action; the verb belongs to
  whoever did the favour, but the sentence is still built from the receiver's side. 教えてもらいま
  した is "I got taught," not "I taught." Flag forward, do not build: the natural next step,
  〜てもらえますか ("could I get you to...?"), needs もらえる — the potential form of もらう — which
  is chapter 6's material, not this chapter's. Naming that link now costs nothing and saves chapter
  6 from having to rediscover it.
- **Exercises (existing ids):** `vocab.oshieru` 教える, `vocab.tsukuru` 作る, `vocab.kasu` 貸す.
- **Exercises (earlier Book Two chapters):** None — flags forward to chapter 6's もらえる rather
  than drawing on any earlier chapter.
- **New vocabulary:** none (見せる, if brought in lesson 7 under the fresh-verb variant, is reused
  here rather than reintroduced).
- **New phrases:** 3.
- **Depends on:** lesson 2, for the receiving-side sentence shape; the same te-form patterns as
  lessons 6–7. Does **not** depend on lesson 8.

### Lesson 10 — Chapter 2 checkpoint

- **Title:** Chapter 2 checkpoint
- **Can-do:** Recognise everything taught so far
- **`checkpoint: recognition`**, `chapterId: b2.chapter-2`, `wordIds: []`, `phraseIds: []`,
  `kanji: []`, no `patternId` — same shape as `n5.checkpoint-3` and chapter 1's own checkpoint.
- **Format:** recall (type the reading or meaning), per [03 §10](03-book-two.md). Mastery gate, not
  a grade: the remaining set shrinks to zero, retries unlimited, nothing recorded, misses rejoin
  the SRS queue (DR-020).
- **Placement:** at the chapter boundary. The chapter **must not** be split earlier — lessons 6–9
  depend on lessons 1–3, and lesson 8 depends on lesson 7.

---

## 4. Totals

| | Count | Against the book's per-lesson average |
|---|---|---|
| Teaching lessons | 9 | slightly under the ~10 target (03 §4) — argued in §5.1 |
| Checkpoints | 1 | one per chapter (DR-021) |
| New words | **4** unconditional + **0–1** decision-dependent | far under 5.7/lesson; 3 of the 4 unconditional words *are* the chapter's subject, and the 4th (手伝う) is unconditional because chapter 10 needs it, not because it is overhead |
| New verbs | **4** (the chapter itself, 手伝う now settled) + **0–1** favour verb (見せる) | see §6 |
| New phrases | **~29** | 3.2/lesson, in line with chapter 1's rule-chapter rate |
| New grammar patterns | 9 | one per teaching lesson |
| New kanji | **1** (伝, from 手伝う, now unconditional) | far under the book's 2.3/lesson measured rate — see §7 |

---

## 5. Design calls

### 5.1 Nine teaching lessons, not ten

**Answer: 9, and I would not pad it to 10.**

The skeleton names six things — three base verbs, three payoff patterns — and the honest count
after splitting by what a learner can *say* (this chapter's inherited method from the te-form and
plain-form chapters) is nine: three base-verb lessons, one contrastive lesson forced by how
genuinely hard the three-way perspective choice is, one boundary lesson against a neighbouring
verb family that costs nothing to teach because the vocabulary already exists, and three payoff
lessons split into four because the request register is named in the book plan as this chapter's
entire reason for existing early. A tenth lesson would have to invent a teaching point that is not
there — the closest candidate, an offer-question form built on あげる (〜てあげましょうか), collides
with chapter 5's 〜ましょう／〜ませんか, which has not been taught yet. Reaching forward for it
would be the exact mistake chapter 1's own register lesson was written to avoid.

If the chapter needs to shrink further, lesson 5 (not the same as lending) is the designed merge
point — it could fold into lesson 4's contrastive practice as one more pair, at the cost of blurring
two genuinely different confusions (perspective vs. permanence of transfer) into one lesson.

### 5.2 Reordering the skeleton's own list

**Answer: あげる, もらう, くれる — not the skeleton's あげる／くれる／もらう.**

The skeleton's ordering is an enumeration, not a teaching sequence — the same distinction chapter 1
draws when it explains why だ is placed sixth rather than where the skeleton happens to mention it.
あげる and もらう share a subject (the speaker is always the grammatical subject in both; only the
direction of the transfer changes), so a learner can compare them directly before meeting the verb
that breaks the pattern. くれる goes last because it is where the actual difficulty lives — the
subject stops being the speaker and the verb exists solely to mark who benefits. This is the
standard order in nearly every N4 textbook for exactly this reason, and it is also this chapter's
version of chapter 1's easy-half-first split (ichidan before godan, ない before た).

### 5.3 The request register earns its own lesson

**Answer: yes, split from the くれる statement lesson, not folded into it.**

The book plan's own words for why this chapter sits second are "it unlocks the favour-asking
register everything social sits on." That sentence describes lesson 8, specifically —
〜てくれますか／〜てくれませんか — not the chapter's other eight lessons, which teach who benefits
from an exchange rather than how to ask for one. Giving the request register its own slot is what
makes that claim in the plan actually true of the shipped chapter, rather than true in spirit.

One real gap this creates, worth stating plainly: 〜てもらえますか — arguably the more common polite
request in service and formal registers — is not available here, because もらえる is the potential
form of もらう and potential is chapter 6's material. Lesson 9's grammarNote names this forward
link explicitly (§3) so it is a planned sequel rather than a gap chapter 6 has to notice on its own.

---

## 6. Open, deferred by the owner — sensitivity to the fresh-verbs decision

[03 §4](03-book-two.md) defers, once, whether Book Two's rule chapters bring fresh verbs the way
the te-form chapter did, or drill only Book One's 87. Not re-litigated here. **手伝う is no longer
part of that question.** See lesson 6: chapter 10 (Trouble) independently proposed the same word,
unconditionally, for its own favour-asking lesson. The collision is resolved by having chapter 2
own the introduction, so 手伝う is taught here regardless of how this deferred question resolves —
its inclusion follows from chapter 10's downstream need, not from this chapter's own fresh-verbs
call. What remains genuinely open is narrower than before: only **見せる**, the chapter's other,
still-optional favour verb.

This chapter's design **is mildly sensitive** to the remaining question, but less than a
conjugation-table chapter would be, and the reason is structural: the te-form chapter needed fresh
verbs because its rule is per-group — each lesson drills one row of a conjugation table, and a thin
row (ぐ, ぬ, ぶ) needed supplying. Nothing here is per-group. The favour patterns (lessons 6, 7, 9)
need verbs that make a natural favour, not verbs that fill a linguistic slot, and Book One already
supplies six of them with their kanji already introduced: `vocab.oshieru` 教える, `vocab.tsukuru` 作
る, `vocab.kau` 買う, `vocab.motsu` 持つ, `vocab.matsu` 待つ, `vocab.kasu` 貸す (the last a direct
callback to lesson 5). The chapter ships completely on owned material plus 手伝う either way.

**If 見せる is also sanctioned,** it pairs naturally with 見せてくれる / 見せてもらう in lesson 7,
adds no new kanji (見 is already known from 見る), and is reused without reintroduction in lesson 9.
Total under this variant: 5 new words (the 4 unconditional plus 見せる), still 1 new kanji.

**If 見せる is not sanctioned,** the chapter ships on 4 new words and 1 new kanji (伝) — no longer
the zero-kanji data point chapter 1's §6 observation could once point to, since 手伝う's settlement
now guarantees this chapter at least one. The underlying observation — a rule chapter reusing owned
vocabulary structurally underdelivers against the book's kanji budget — still holds for the rest of
the chapter's material, just not for lesson 6 anymore.

---

## 7. Things I think the plan is silent about for this chapter

**The plan is right that nothing blocks this chapter — checked, not just trusted.** "It needs only
polite forms and the te-form, both in hand from Book One's first chapter onward" is verified against
the manifest: `grammar.n5-te-ichidan`, `n5-te-ku`, `n5-te-tte`, `n5-te-nde` all exist, から already
carries a people-as-source usage precedent (`greetings.where-from`), and none of this chapter's nine
lessons touch plain form, ましょう／ませんか, or potential — all material that arrives in later
chapters. The claim holds.

**The plan does not connect this chapter to chapter 6, and it should, once chapter 6 is designed.**
The favour-asking register this chapter is built to unlock has two natural forms in real usage —
〜てくれますか (built here) and 〜てもらえますか (needs potential, chapter 6's territory). §4's
skeleton entry for chapter 6 lists "potential forms, 〜ことができる; 〜やすい／〜にくい" with no
mention that もらえる closes a loop this chapter deliberately left open. Not a defect in this
chapter — lesson 9's grammarNote already names the link — but worth carrying into chapter 6's own
design pass as a named dependency rather than rediscovering it there.

**This chapter is another low-kanji data point for chapter 1's §6 flag**, though less stark than it
would have been before the 手伝う collision was settled: it now contributes at least 1 new kanji
(伝) against a ~23-kanji-per-chapter share of the book's ~200-kanji budget, and at most 1 either way
(見せる adds none). Flagging alongside chapter 1's, not re-arguing it — the fix chapter 1 already
proposed (measure the budget after several chapters ship rather than force kanji into chapters that
have none to give) applies here unchanged.

---

## 8. Authoring checklist

1. **Sourcing.** The 4 unconditional words (あげる, もらう, くれる, 手伝う), plus 0–1 favour verb
   (見せる) if sanctioned, marked `content-source: training`, verified headword-by-headword against JMdict for
   Applications 3.6.2, `# jlpt-source: training` where a level is asserted
   ([03 §9](03-book-two.md), CLAUDE.md). All ~29 phrases are composed sentences: training-canonical,
   marked, pending Tatoeba verification, same as chapter 1.
2. **Kana, not kanji, for the three giving verbs.** あげる, くれる, もらう are conventionally written
   in kana in the giving/receiving sense (JMdict lists 上げる and 貰う as valid kanji forms, but the
   kana form is standard usage here, and 上げる risks confusion with the already-taught `vocab.ue`
   上 "on, above"). Verify this against JMdict for Applications at authoring rather than assuming it.
3. **Commit messages** on every content commit must name the source, or the commit is rejected.
4. **No dialogue.** Lesson 8 is this chapter's risk, the same way lesson 7 was chapter 1's — a
   request-and-response is a scripted exchange, which [03 §7](03-book-two.md) rules out. Each of
   lesson 8's 4 phrases is an independent single utterance, sourced independently, never a
   two-turn exchange.
5. **The composition frame.** [03 §0b/§8](03-book-two.md) requires each lesson's frame authored
   alongside the lesson. Nine frames, one per teaching lesson, following the same sourcing rules as
   phrases.
6. **Re-surface the te-form patterns** before lesson 6. `grammar.n5-te-ichidan`, `n5-te-tte`,
   `n5-te-nde` are hard prerequisites for lessons 6, 7 and 9 — the same recommendation as chapter 1
   makes before its plain-past lesson, and for the same reason.
7. **Run `pnpm walkthrough`** before merge.
