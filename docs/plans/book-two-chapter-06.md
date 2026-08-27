# Book Two, Chapter 6 — the potential-forms chapter

**Status: design, not content.** This document specifies every lesson in the chapter in enough
detail that authoring the YAML is mechanical. **No Japanese sentence is composed here.** Words and
verb forms are cited by id from Book One's inventory or from Chapter 1's already-designed new
vocabulary; every example *sentence* is a requirement on a later authoring pass, which follows
[03 §9](03-book-two.md) sourcing.

Source brief: [03-book-two.md](03-book-two.md) §1, §2, §4, §9, §10. Worked example:
[book-two-chapter-01.md](book-two-chapter-01.md), which this document matches in shape. Model
lesson file: [`src/content/lessons/n5-16-te-form.yaml`](../../src/content/lessons/n5-16-te-form.yaml).

**Shape landed: 6 teaching lessons + 1 recognition checkpoint — 7 total, a deliberate deviation
from the ~10 target.** New words: **0**. New verbs: **0**. New phrases: **~21**. New kanji: **0**.
See §5 for why this chapter is smaller than Chapter 1, not padded to match it.

---

## 1. The chapter header comment

Paste this at the top of the lessons file, in the style of the te-form and plain-form chapters.

```yaml
# Chapter 6 — Being able to.
#
# Ability is the third time this book asks a learner to conjugate by verb
# group -- te-form in Book One, plain form in chapter 1, now potential. The
# te-form chapter split godan into three lessons because its five endings
# genuinely sound different: いて, いで, って, んで, して. Chapter 1's ない did
# not repeat that shape -- every godan ending shifts to the あ row and takes
# ない, one rule, one lesson -- because ない's row-shift is uniform where
# te-form's is not. Potential is the same kind of rule as ない, not the same
# kind as te-form: every godan ending shifts to the え row and takes る, no
# exceptions, no group that behaves differently from its neighbours. This
# chapter follows chapter 1's precedent, not te-form's -- one lesson for the
# easy half, one lesson for every godan ending at once. Four lessons of table
# in two, and even う, which ない bends into わ, behaves here with no
# exception at all: 買う becomes 買える, not 買わる.
#
# What that buys back gets spent on what te-form never had to teach: a
# potential verb takes が for the thing you can do, not を. 英語を話します
# becomes 英語が話せます, not 英語を話せます, and the mistake is invisible in an
# isolated conjugation drill -- it only shows up in a sentence, which is why
# it earns a lesson of its own rather than a footnote on lesson 2.
#
# できる, する's irregular potential, turns out to have a second life: it
# attaches straight to a noun of skill with no verb and no conjugation at
# all -- 料理ができる, 英語ができる. 〜ことができる sits beside it as the other
# conjugation-free path, dictionary form plus a fixed phrase, working on any
# verb with no group to sort. Both are placed after the verb-potential
# lessons on purpose: each reads as "another way", which is the point being
# made, not as the first thing a learner reaches for.
#
# 〜やすい and 〜にくい are not potential forms -- they say the thing itself is
# easy or hard, not that the speaker is able -- and the chapter carries them
# anyway because the plan puts them here and because the confusion is real
# enough to be worth one lesson of contrast. They attach to the ます-stem,
# which every verb in this book has had since lesson one, so the mechanics
# cost nothing; the teaching is the distinction, and the trap that 安い --
# already owned, a different word -- happens to share the reading.
#
#   1  the easy half                ichidan, する, 来る -- できる is born here
#   2  every other verb             one え-row rule, all eight godan endings
#   3  what you can, in a sentence  が replaces を; negative; question
#   4  skills without a verb        noun + できる, no conjugation at all
#   5  the other way to say it      ことができる, on the dictionary form
#   6  easy to, hard to             やすい／にくい, and why they are not potential
#
# Lessons 3-5 all stand on できる or the verb-potential existing first, so
# this chapter does not split before its checkpoint -- the same constraint
# the te-form and plain-form chapters carry.
#
# content-source: n/a for this file -- it introduces no new vocabulary file.
#   Every wordId is a Book One citation or a Chapter 1 citation (こと). New
#   phrases follow phrases/being-able-to.yaml's own provenance marker.
```

---

## 2. Naming and ids

| Thing | Value |
|---|---|
| Chapter id | `b2.chapter-6` |
| Chapter title (learner-facing) | **Being able to** — the skeleton's label is already learner-facing; no rename needed, unlike chapter 1's "plain form" |
| Lesson `situation` | `Being able to` |
| Lesson ids | `b2.potential-easy`, `b2.potential-godan`, `b2.potential-ga`, `b2.dekiru-noun`, `b2.koto-dekiru`, `b2.yasui-nikui` |
| Pattern ids | `grammar.b2-potential-ichidan`, `grammar.b2-potential-godan`, `grammar.b2-potential-ga`, `grammar.b2-dekiru-noun`, `grammar.b2-koto-dekiru`, `grammar.b2-yasui-nikui` |
| Vocabulary file | **none.** This chapter needs no new vocabulary file — see §5.3 |
| Phrase file | `src/content/phrases/being-able-to.yaml`, id prefix `dekiru.` |
| Lessons file | `src/content/lessons/b2-06-being-able-to.yaml` |

`order`: **use 1–7 within the chapter.** Global order numbers are assigned at book assembly, per
chapter 1's own note.

---

## 3. The lessons

Every `wordIds` entry is a real Book One id from the manifest, except こと, which is Chapter 1's
own new vocabulary (lesson 8 of [book-two-chapter-01.md](book-two-chapter-01.md)) and has no code
id yet — cited by word, not by fabricated id, until chapter 1 ships.

### Lesson 1 — Saying what you can do, the easy half

- **Title:** Saying what you can do, the easy half
- **Can-do:** Say what you're able to do, for ichidan verbs and the two irregulars
- **Teaches:** the potential form, named and framed against its neighbours — not wanting
  (chapter 5's たい), not permission (Book One's 〜てもいいですか), but ability. Ichidan drops る
  and adds られる: 食べる → 食べられる, 見る → 見られる, 借りる → 借りられる. する is suppletive —
  a different word entirely, できる, worth learning as its own unit rather than a rule. 来る becomes
  来られる, with the same reading trap chapter 1 already flagged for 来ない: 来られる is こられる,
  not くられる. Flag られる's casual contraction — 食べれる, dropping ら — as something the learner
  will hear and read constantly; it is recognition only, not what this lesson teaches for
  production, the same register call chapter 1 made for だ's dropping behaviour.
- **Exercises (existing ids):** `vocab.taberu` 食べる, `vocab.miru` 見る, `vocab.kariru` 借りる,
  `vocab.oboeru` 覚える, `vocab.okiru` 起きる, `vocab.suru` する, `vocab.kuru` 来る.
- **New vocabulary:** none. All 24 ichidan verbs and both irregulars are already owned; できる is
  taught as part of the pattern, the same way 行った was not counted as new vocabulary in chapter 1.
- **New phrases:** 3. One ichidan ability statement, one with できる, one with 来られる so the
  reading trap is met in a sentence rather than asserted.
- **Depends on:** chapter 1 (plain/dictionary form, and the ichidan/godan class distinction from
  Book One's te-form chapter). Loosely assumes chapter 5's たい exists to contrast against, in the
  grammarNote framing only — not a hard dependency.

### Lesson 2 — Saying what you can do, the rest

- **Title:** Saying what you can do, the rest
- **Can-do:** Say what you're able to do, with any verb
- **Teaches:** godan potential as **one rule** — shift the final sound to the え row and add る:
  く→ける, ぐ→げる, す→せる, つ→てる, ぬ→ねる, ぶ→べる, む→める, う→える, る→れる. Unlike ない, う
  takes no exception here — 買う → 買える, not 買わる, and 行く → 行ける with no exception either,
  which the te-form chapter could not say. Carry forward the godan-る trap one more time: 帰る and
  走る are godan, so 帰れる and 走れる, not the ichidan-shaped 帰られる. Name ある as the one verb
  in the set that resists this rule outright — existence is not something you "can" do, the same
  way English has no way to say a table "can exist" — and skip it rather than force an example.
- **Exercises (existing ids)** — one per ending, all owned: `vocab.kaku` 書く (く), `vocab.oyogu`
  泳ぐ (ぐ), `vocab.hanasu` 話す (す), `vocab.matsu` 待つ (つ), `vocab.shinu` 死ぬ (ぬ), `vocab.yobu`
  呼ぶ (ぶ), `vocab.yomu` 読む (む), `vocab.kau` 買う (う, the ない-exception that isn't one here),
  `vocab.kaeru` 帰る and `vocab.hashiru` 走る (the godan-る trap). `vocab.aru` ある named as the
  exception, not exercised.
- **New vocabulary:** none. Book One's 60 godan verbs cover all eight endings, ぬ included.
- **New phrases:** 4 — the biggest mechanical lesson, one per row family, one of them built on the
  godan-る trap so it is seen in a sentence rather than only in the table.
- **Depends on:** lesson 1 for the naming and register frame.

### Lesson 3 — What you can, and can't, do

- **Title:** What you can, and can't, do
- **Can-do:** Talk about ability in a full sentence, marking the thing you can do correctly
- **Teaches:** the single biggest trap of the whole chapter — a potential verb marks its object
  with が, not を. 英語を話します becomes 英語が話せます, not 英語を話せます, because the sentence
  is no longer about performing an action on an object, it is about a state being possible. This
  does not show up in an isolated conjugation drill; it only shows up in a sentence, which is why
  it is a lesson rather than a note on lesson 2. Then the parts that cost nothing: potential verbs
  conjugate exactly like any other ichidan verb once built, using rules the learner already owns —
  話せる → 話せない is chapter 1 lesson 2's rule, 話せない → 話せなかった is chapter 1 lesson 4's.
  Name that explicitly rather than re-teaching it; the payoff is the register, not the mechanism.
  Cover the question form too — 話せますか — since asking about ability is at least as common as
  stating it.
- **Exercises (existing ids):** `vocab.hanasu` 話す with `vocab.eigo` 英語 (the が example),
  `vocab.oyogu` 泳ぐ, `vocab.yomu` 読む with `vocab.hon` 本, `vocab.tsukau` 使う, adverbs
  `vocab.sukoshi` 少し and `vocab.zenzen` ぜんぜん to soften or sharpen an ability statement, and
  `vocab.mada` まだ for "can't yet".
- **New vocabulary:** none.
- **New phrases:** 4 — one が-marked affirmative, one negative, one question, one using ぜんぜん or
  まだ so the sentence carries more than a bare capability claim.
- **Depends on:** lessons 1 and 2 — needs verb-potential forms built before it can discuss how they
  behave in a sentence.

### Lesson 4 — Skills without a verb

- **Title:** Skills without a verb
- **Can-do:** Say what you're able to do using a noun instead of a verb
- **Teaches:** できる's second life. Introduced in lesson 1 as する's irregular potential, できる is
  also an ordinary verb in its own right that attaches directly to a noun of skill or activity, が
  before it, no conjugation and no verb-potential rule involved: 料理ができる, 英語ができる,
  仕事ができる. This is not in the plan's one-line skeleton for this chapter; it is added because
  it costs nothing once できる already exists, uses only owned nouns, and is arguably closer to how
  ability gets talked about in ordinary speech than the full verb-potential often is. It is also
  the chapter's cheapest lesson to cut if the owner wants the chapter shorter — see §5.4.
- **Exercises (existing ids):** `vocab.eigo` 英語, `vocab.ryouri` 料理, `vocab.shigoto` 仕事, with
  `vocab.sukoshi` 少し and `vocab.zenzen` ぜんぜん carried over from lesson 3 so the two
  "できる" lessons read as one family rather than two unrelated patterns.
- **New vocabulary:** none.
- **New phrases:** 3 — one affirmative, one negative, one question.
- **Depends on:** lesson 1 (できる is introduced there). Not on lessons 2–3 — noun + できる needs
  no verb-potential mechanics at all, and could in principle move earlier; it stays here because it
  reads as "the same word, generalised" rather than "a new thing", which only works placed after.

### Lesson 5 — The other way to say it

- **Title:** The other way to say it
- **Can-do:** Say what you're able to do without conjugating the verb at all
- **Teaches:** 〜ことができる — dictionary form plus a fixed phrase, working on every verb with no
  group to sort, no exception list, nothing built in lessons 1–2 required. こと is not new; it is
  chapter 1 lesson 8's nominaliser, reused here in its second job. Name explicitly that する now has
  two correct paths to the same meaning — できる directly, from lesson 1, or することができる, this
  lesson's shape — and that できる is simply shorter; this is not a contradiction to resolve, it is
  the same kind of choice a learner already makes between plain and polite. Flag register lightly:
  ことができる skews slightly more formal or written, and is the safer choice when a verb's
  potential form has not been drilled.
- **Exercises (existing ids):** `vocab.oyogu` 泳ぐ, `vocab.yomu` 読む, `vocab.tsukau` 使う,
  `vocab.miru` 見る — reused from lessons 1–3 so the "same verb, other construction" contrast is
  visible rather than asserted.
- **New vocabulary:** none. こと is Chapter 1's, not this chapter's — do not double-count it in
  either chapter's totals.
- **New phrases:** 3 — one affirmative, one negative, one that pairs directly against one of
  lesson 1 or 2's phrases using the same verb, so the two constructions sit side by side.
- **Depends on:** chapter 1 lesson 8 (こと) as a hard prerequisite. Only loosely on lessons 1–4 —
  mechanically it could stand alone, and is sequenced here for contrast, not necessity.

### Lesson 6 — Easy to, hard to

- **Title:** Easy to, hard to
- **Can-do:** Say whether something is easy or difficult to do
- **Teaches:** 〜やすい and 〜にくい, together, as the ます-stem plus a suffix — 読む → 読みやすい,
  使う → 使いにくい — mechanics the learner has owned since Book One's first ます verb, so the
  entire cost of this lesson is the distinction, not the form. State the distinction plainly:
  食べられる says the speaker is able to eat something (allergy, availability, skill); 食べやすい
  says the food itself is easy to eat (texture, size) — different subject of the judgement, and the
  two are not substitutable. Name the trap explicitly: 安い, already owned from Book One's price
  vocabulary, is a different word that happens to share the reading やすい — 安い means cheap,
  〜やすい means easy-to, and nothing connects them but the sound. Both suffixes inflect like
  い-adjectives, chapter 1 lesson 4's rule again: 読みやすかった, 使いにくくない.
- **Exercises (existing ids):** `vocab.yomu` 読む with `vocab.hon` 本, `vocab.tsukau` 使う with
  `vocab.kaban` かばん, `vocab.aruku` 歩く with `vocab.kutsu` 靴, `vocab.wakaru` わかる (わかりやすい
  ／わかりにくい, a genuinely common pair, for an example with no object noun at all), and
  `vocab.yasui` 安い cited directly for the reading-collision trap.
- **New vocabulary:** none.
- **New phrases:** 4 — one やすい, one にくい, one past tense (やすかった or にくかった) so the
  い-adjective link is shown rather than asserted, one that pairs a sentence using 安い against one
  using 〜やすい so the trap is heard, not just read in a grammarNote.
- **Depends on:** nothing mechanically — the ます-stem has been available since Book One. Placed
  last so its contrast with ability (lessons 1–4) has something to contrast against.

### Lesson 7 — Chapter 6 checkpoint

- **Title:** Chapter 6 checkpoint
- **Can-do:** Recognise everything taught so far
- **`checkpoint: recognition`**, `wordIds: []`, `phraseIds: []`, `kanji: []`, no `patternId` — same
  shape as `n5.checkpoint-6` and chapter 1's checkpoint.
- **Format:** Book Two's recall-based recognition pass (03 §10), same wording precedent as chapter
  1's checkpoint note. Mastery gate, not a grade (DR-020): shrinks to zero, unlimited retry, nothing
  recorded, misses rejoin the SRS queue.
- **Placement:** chapter boundary, coinciding with the cadence by construction at this chapter size.
  Cannot split earlier — lessons 3–5 all stand on できる or the verb-potential.

---

## 4. Totals

| | Count | Against the book's per-lesson average |
|---|---|---|
| Teaching lessons | 6 | below the ~10 target — see §5 |
| Checkpoints | 1 | one per chapter (DR-021) |
| New words | **0** | 0/lesson vs. 5.7 — deliberate, see §5.3 |
| New verbs | **0** | deliberate, matches chapter 1's call |
| New phrases | **~21** | 3.5/lesson, in line with chapter 1's ~3.4/lesson |
| New grammar patterns | 6 | one per teaching lesson |
| New kanji | **0** | worsens the shortfall chapter 1's §6 already flagged — see §6 |

---

## 5. The open calls

### 5.1 Two lessons for verb-potential, not four — argued in the header

**Answer: two lessons (easy half, then every godan ending at once), not the te-form chapter's
per-group split.**

The counter-argument the brief raises — that a third pass at group-based conjugation may need less
scaffolding, not the same amount — is real, but it is not actually the deciding factor here. The
deciding factor is **what kind of rule potential is**, and it already has a precedent inside this
book: chapter 1's ない.

Te-form splits godan into three lessons because the five endings are **audibly different** — いて,
いで, って, んで, して are not variations on a theme, they are five distinct sound changes, and
Book One's own measured shape (§4 of the te-form header) treats "one row of the table" as one
lesson's worth of content precisely because each row sounds unrelated to its neighbours.

ない does not have that shape. Every godan ending shifts to the あ row and adds ない — one
mechanical operation, applied eight times, with two real exceptions (う→わ, ある→ない) rather than
five different endings. Chapter 1 taught the whole godan negative in one lesson because the rule is
uniform, not because the scaffolding had already been paid for.

Potential is the ない shape, not the te-form shape: every godan ending shifts to the え row and adds
る, uniformly, with **no exception at all** — not even for う, which ない bends into わ. That is a
stronger case for one lesson than ない had, not a weaker one. Splitting it into three or four
lessons the way te-form did would be teaching table structure that does not exist in the rule; it
would be padding, not scaffolding.

What two lessons buys back gets spent on lesson 3, which te-form never needed: が replacing を. That
is where this chapter's real difficulty lives, and it is invisible in a conjugation table regardless
of how many lessons the table gets.

### 5.2 やすい／にくい as one combined lesson, not two, not folded elsewhere

**Answer: one lesson, teaching both together.**

They are mirror-image suffixes with an identical attachment rule (ます-stem + suffix), so splitting
them into two lessons a chapter apart would separate two things that are best taught by contrast —
"this food is やすい" only lands fully next to "this food is にくい" for something else. Chapter 1
made the same call for だ's four re-labelled shapes in one lesson; this is that pattern again.

Folding them into an existing ability lesson (as a footnote on lesson 1 or 3) was considered and
rejected: they are **not** potential forms, and the entire teaching point of this lesson is that
distinction. Placing them inside an ability lesson would blur exactly the line the lesson exists to
draw. They earn their own lesson, placed last, so the ability lessons already exist to contrast
against.

### 5.3 Zero new vocabulary — stronger than chapter 1's claim, and why

**Answer: 0 new words, 0 new verbs, 0 new kanji.**

Chapter 1 argued its way down to ~12 new words, all non-verbs, because its two structural payoffs —
〜たことがある and 〜たり〜たり — needed こと, 一度, 回, うん and ううん to be phraseable at all.
This chapter has no equivalent gap. Its two conjugation-free payoffs, noun + できる and
〜ことができる, both lean on words this book already owns by the time chapter 6 ships:

- **こと** is chapter 1's, already paid for and cited by name in lesson 5.
- **できる's noun-attachment targets** (料理, 英語, 仕事) are all Book One nouns.
- **やすい／にくい's exercise nouns** (本, かばん, 靴) and the trap word (安い) are all Book One.
- **The adverbs that make ability sentences sound natural** (少し, まだ, もう, あまり, ぜんぜん) are
  all Book One, verified against the manifest at design time rather than assumed.

This is the book's own recombination through-line (03 §2) in its purest form: every lesson in this
chapter conjugates or attaches to words the learner already owns, and none of them needed a single
new headword to do it. It is a stronger version of chapter 1's claim, not a coincidence — a
conjugation-only chapter with word-light payoffs will always land here if the prior chapters already
supplied the connective vocabulary, which chapter 1 did.

### 5.4 Lesson 4 is added beyond the skeleton's literal wording — flagged, with a cut

The plan's one-line skeleton names "potential forms, 〜ことができる; 〜やすい／〜にくい" and does not
mention noun + できる. Lesson 4 is added here anyway, on the judgement that it costs nothing (できる
already exists after lesson 1, every noun it needs is already owned) and that it is closer to how
ability actually gets discussed in ordinary Japanese than the verb-potential form often is. That
judgement is mine, not the plan's, and it is the correct place to cut if the owner disagrees or
wants the chapter tighter: **removing lesson 4 takes this chapter to 5 teaching lessons + checkpoint
= 6 total**, with lesson 5 (ことができる) needing no change, since it never depended on lesson 4.

---

## 6. Sensitivity to the open verb-scope question

**This design is somewhat sensitive to it, less than a fresh-material chapter would be, and the
sensitivity is concentrated in one place.**

If Book Two's rule chapters bring **no fresh verbs** (this document's working assumption, matching
chapter 1's call): the design above stands as written. It is worth noting that, unlike te-form's
original justification for bringing new verbs — Book One's ぐ／ぬ／ぶ coverage was thin at that
point in the book — **every godan ending is already well-populated by the time chapter 6 ships**
(う 8, く 11, ぐ 3, す 7, つ 3, ぬ 1, ぶ 3, む 5, る 19 — verified against the manifest). There is no
coverage gap here for fresh verbs to fill, which is a small piece of independent evidence for "no
fresh verbs," offered without re-litigating the decision.

If Book Two's rule chapters **do** bring fresh verbs (te-form's precedent): the natural landing spot
is **lesson 2**, since it is the lesson with room across all eight endings and the one where
te-form's own model would apply most directly — new verbs exercising rows the learner has not yet
conjugated into this particular form. Lesson 1's ichidan set, lesson 4's skill-noun set, and lesson
6's やすい／にくい exercise set would be less natural places to add verbs, since none of them is
organised by conjugation row. Under this variant, §5.3's "0 new words" claim no longer holds — new
verbs bring new kanji with them, which would also partly answer §6 below rather than deepen it — but
the lesson *count and shape* above do not change; only the vocabulary and kanji totals would.

---

## 7. What this chapter does to chapter 1's flagged kanji problem

Chapter 1's §6 flagged that the book's ~200-new-kanji budget, measured at Book One's 2.3/lesson,
does not survive a book that is mostly rule chapters reusing owned vocabulary — te-form and
past-tense in Book One ran at 3.4 and 2.0 kanji per lesson specifically *because* they brought fresh
verbs, and a rule chapter that brings none brings almost no kanji.

This chapter is the sharper version of that same proof, not a new finding: **zero new words means
zero new kanji**, against Book One's 2.3/lesson average. Six lessons contribute nothing to the
kanji arithmetic at all. Chapter 1's recommendation stands unchanged by this chapter — restate the
kanji budget as a post-hoc measurement once the first several chapters ship, rather than a number to
author against — and this chapter is further evidence for taking that recommendation, not a reason
to force kanji into lessons that do not need any.

---

## 8. Authoring checklist

1. **Sourcing.** No new vocabulary to verify (§5.3). All ~21 phrases are composed sentences, which
   JMdict cannot verify — they follow the sanctioned path: training-canonical, marked, pending
   Tatoeba verification (03 §9, CLAUDE.md).
2. **Commit messages** on every content commit must name the source, or the commit is rejected.
3. **The composition frame.** 03 §0b/§8 requires each lesson's frame authored alongside the lesson.
   Six frames, one per teaching lesson, following the same sourcing rules as phrases.
4. **Re-surface before lesson 1:** chapter 1 lesson 8's こと (hard prerequisite for lesson 5) and
   chapter 1 lessons 2–4's ない／なかった (hard prerequisite for lesson 3's "you already own this"
   claim to actually be true at review time). Same queue-weighting request chapter 1 made for the
   te-form patterns before its own lesson 5.
5. **Verify the manifest citations at authoring time**, not just at design time — this document was
   checked against the Book One manifest on 2026-08-27; if chapter 1–5 content has shipped by the
   time this chapter is authored, re-check that こと still carries the id or name used here.
6. **Run `pnpm walkthrough`** before merge.
