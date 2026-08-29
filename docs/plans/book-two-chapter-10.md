# Book Two, Chapter 10 — Trouble: lost, forgotten, broken

**Status: design, not content.** This document specifies every lesson in the chapter in enough
detail that authoring the YAML is mechanical. **No Japanese sentence is composed here.** Existing
words and patterns are cited by id from Book One's inventory; proposed new vocabulary is named and
flagged for JMdict verification; every example *sentence* is a requirement on a later authoring
pass, which follows [03 §9](03-book-two.md) sourcing.

Source brief: [03-book-two.md](03-book-two.md) §1, §2, §4, §8, §9, §10. Worked example and
structural template: [book-two-chapter-01.md](book-two-chapter-01.md) (a *rule* chapter — this one
is a *situation* chapter, so the shape carries over and the content does not).

**Shape landed: 10 teaching lessons + 1 recognition checkpoint, then the book's production
checkpoint.** New words: **7**. New phrases: **32**. New kanji: **~7 candidates**, final call at
authoring. This is the last chapter in the book, and it is deliberately the leanest on new
vocabulary of Book Two's three situation chapters — see §5. **手伝う, originally proposed here too,
is chapter 2's word** (Giving & receiving, lesson 6) — an independent collision between the two
chapter designs, resolved in chapter 2's favour since a favour verb belongs there and chapter 2
comes first. Lesson 7 below reuses it rather than reintroducing it; see the note there.

---

## 1. The chapter header comment

Paste this at the top of the lessons file, in the style of the people-and-clothes chapter that
closed Book One.

```yaml
# Chapter 10 — Trouble: lost, forgotten, broken. Closes Book Two.
#
# Every other chapter in this book taught a rule or a room to stand in. This
# one asks for a bill to come due. Reporting trouble means saying what
# happened (past tense, chapter 1), why it's a problem (a reason clause,
# chapter 3), and often what you need now (wanting, chapter 5; being able to,
# chapter 6) -- in one breath, to a stranger. That combination is the reason
# the book is built the way it is, and this chapter is where it gets used
# for the first time on purpose rather than as an exercise.
#
# It leans on Book One harder than a situation chapter usually does. 困る and
# 無くす have sat in the ladder since the home-and-work chapter, cited zero
# times since -- two verbs the learner has recognised for dozens of lessons
# and never once needed. So do 財布-shaped nouns: お金, かばん, めがね, 鍵 were
# all taught as things you own, never as things you could lose. This chapter
# does not re-teach them. It spends them.
#
#    1  saying you're in trouble     困っています + から／ので, zero new words
#    2  losing something             財布, and the register split on 無くした
#    3  it's not turning up          探す／見つかる, the intransitive partner
#    4  what you left, and where     忘れ物 for free from 忘れる + 物; とき
#    5  it's broken                  壊れています, the clothing chapter's state
#                                     use of ています redirected onto objects
#    6  and now it doesn't work      て-chains into 使えません -- zero new words
#    7  asking for help              直す new, 手伝う reused from chapter 2, both stacked on chapter 6
#    8  what you need now            てほしい／がほしい on what chapter 7 broke
#    9  what you think happened      交番; と思います wrapped around plain past
#   10  if it turns up               番号; 見つかったら closes the loop lesson 3
#                                     opened, and hands straight to the book's
#                                     production checkpoint
#
# Lessons 3 and 10 are a matched pair -- 見つかる taught negative in lesson 3,
# reused affirmative-conditional in lesson 10 -- and lesson 6 cannot precede
# lesson 5, since it chains 5's て-form into a new clause. Otherwise this
# chapter is looser than a rule chapter: the lessons share an inventory more
# than they share a dependency chain.
#
# content-source: n/a for this file -- it references vocabulary/trouble.yaml
#   and phrases/trouble.yaml, whose own provenance markers apply.
```

---

## 2. Naming and ids

Following [book-two-chapter-01.md §2](book-two-chapter-01.md):

| Thing | Value |
|---|---|
| Chapter id | `b2.chapter-10` |
| Chapter title (learner-facing) | **Trouble** |
| Lesson `situation` | `Trouble` |
| Lesson ids | `b2.trouble-in-trouble`, `b2.trouble-lost`, `b2.trouble-not-turning-up`, … |
| Vocabulary file | `src/content/vocabulary/trouble.yaml`, ids `vocab.*` |
| Phrase file | `src/content/phrases/trouble.yaml`, id prefix `trouble.` |
| Lessons file | `src/content/lessons/b2-10-trouble.yaml` |

`order`: **number 1–11 within the chapter**, as instructed. Global order is a book-assembly
decision, not this chapter's.

Most lessons here **combine** patterns from earlier chapters rather than introduce a new one, so
most entries need no new `patternId` — the existing patternIds from chapters 1, 2, 3, 5, 6, 7 and 9
apply directly once those chapters are authored and their ids exist. Two lessons introduce a
combination worth naming in its own right and should get one: lesson 1 (`grammar.b2-trouble-reason`,
困っています + から／ので as a fixed frame) and lesson 6 (`grammar.b2-trouble-te-chain-potential`,
the state-into-consequence chain). Both are flagged in their entries below.

---

## 3. Inventory pass — what Book One already carries

Searched the 484-word, 227-phrase, 44-pattern manifest for 困る, 無くす, and vocabulary around
loss, breakage, forgetting, help-asking, stations and lost property, per the plan's inventory rule.
**The chapter's core verbs are already taught and have never been exercised in a phrase:**

| Found | id | Reading | Gloss | Source |
|---|---|---|---|---|
| 困る | `vocab.komaru` | こまる | to be in trouble, to be stuck | home-work.yaml |
| 無くす | `vocab.nakusu` | なくす | to lose (something) | home-work.yaml |
| 違う | `vocab.chigau` | ちがう | to be different, to be wrong | home-work.yaml |
| 忘れる | `vocab.wasureru` | わすれる | to forget, to leave behind | te-form.yaml |
| 呼ぶ | `vocab.yobu` | よぶ | to call, to summon | te-form.yaml |
| 頼む | `vocab.tanomu` | たのむ | to ask for, to request | home-work.yaml |
| 教える | `vocab.oshieru` | おしえる | to teach, to tell | home-work.yaml |
| 使う | `vocab.tsukau` | つかう | to use | home-work.yaml |
| 取る | `vocab.toru` | とる | to take, to pick up | verbs file |
| お金 | `vocab.okane` | おかね | money | nouns.yaml |
| かばん | `vocab.kaban` | かばん | bag | nouns.yaml |
| 駅 | `vocab.eki` | えき | station | nouns.yaml |
| 電話 | `vocab.denwa` | でんわ | telephone | nouns.yaml |
| めがね | `vocab.megane` | めがね | glasses | people-clothes.yaml |
| 傘 | `vocab.kasa` | かさ | umbrella | people-clothes.yaml |
| 鍵 | `vocab.kagi` | かぎ | key | places-2.yaml |
| 荷物 | `vocab.nimotsu` | にもつ | luggage, baggage | places-2.yaml |
| 切符 | `vocab.kippu` | きっぷ | ticket | transit.yaml |
| 電車 | `vocab.densha` | でんしゃ | train | transit theme |
| ホーム | `vocab.homu` | ホーム | platform | transit theme |
| 何番 | `vocab.nanban` | なんばん | which number | transit theme |
| タクシー | `vocab.takushii` | タクシー | taxi | transit theme |
| 新しい | `vocab.atarashii` | あたらしい | new | adjectives.yaml |
| 大丈夫 | `vocab.daijoubu` | だいじょうぶ | OK, alright, fine | — |
| ごめんなさい | `vocab.gomennasai` | — | I'm sorry | interjection |
| すみません | `greetings.excuse-me` (phrase) | — | Excuse me / I'm sorry | greetings |

Two grammar patterns are already in hand and directly applicable: `grammar.n5-mono-nominaliser`
(verb stem + 物 — the machinery behind 食べ物 applies unchanged to 忘れ物) and `grammar.n5-te-imasu`
(the state use built in the clothing chapter — 帽子をかぶっています — applies unchanged to a broken
object). The transitive/intransitive vocabulary pairing the learner has already met twice
(開ける／開く, 閉める／閉まる, from `home-work.yaml`) is the pattern 見つける／見つかる belongs to,
though that pair itself is not yet taught.

**What is genuinely missing**, checked against JMdict-shaped candidates: a word for *wallet*
(財布), a verb for *turning up / being found* (見つかる) and its natural partner *to search*
(探す), a verb for *being broken* (壊れる), a verb *to fix* (直す), a noun for the practical,
non-dramatic place a lost-item report actually happens in Japan (交番, a police box — not 警察, a
police station, which reads as the crime-drama register the plan rules out), and a noun for
*number* (番号, needed to leave a phone number, and built on the 番 kanji the learner already has
from 何番). A verb *to help* (手伝う) is also genuinely missing from Book One, but not from Book
Two: it collided with an independent proposal in chapter 2 (Giving & receiving), which owns the
introduction — see lesson 7.

**The chapter is what remains after that subtraction: 7 new words, not 25.** Every lesson below
names which side of the ledger it draws from.

---

## 4. The lessons

### Lesson 1 — Saying you're in trouble

- **Title:** Saying you're in trouble
- **Can-do:** Say you're in trouble, and why
- **Teaches:** 困っています as the frame for reporting trouble, with から or ので attaching a
  reason built entirely from already-owned material — a plain-past verb (無くした) acting on an
  already-owned object (お金 or かばん). This is the chapter's flagship: Book Two chapter 1's plain
  past supplies the reason; chapter 3's から／ので attaches it to 困る. **No new vocabulary is
  needed to make the point, because the point is that the learner already owns every piece** —
  this lesson is the clearest instance in the chapter of "combine, don't add."
- **Exercises (existing ids):** `vocab.komaru` 困る, `vocab.nakusu` 無くす, `vocab.okane` お金,
  `vocab.kaban` かばん.
- **Exercises (earlier Book Two chapters):** Chapter 1 (plain past た, and だ／なので for the
  ので half); Chapter 3 (から／ので as a reason clause) — the two chapters this whole chapter is
  named for combining.
- **New vocabulary:** none.
- **New phrases:** 3. One with から, one with ので, one in plain form to a friend rather than a
  stranger (Chapter 1's register split), so the frame is shown working across registers rather
  than asserted.
- **Depends on:** nothing within this chapter — it opens it. Hard prerequisite: Book Two chapters
  1 and 3 both authored and shipped.

### Lesson 2 — Losing something

- **Title:** Losing something
- **Can-do:** Report that you've lost something
- **Teaches:** 無くしました (polite report, to a stranger — station staff, a shop clerk) beside
  plain 無くした (Chapter 1, to a friend), now with a concrete, losable object rather than the
  generic reason-clause use in lesson 1. The register split is not new grammar; it is lesson 1's
  だ/です distinction put to its first real use.
- **Exercises (existing ids):** `vocab.nakusu` 無くす, `vocab.kaban` かばん, `vocab.okane` お金,
  `vocab.megane` めがね, `vocab.kagi` 鍵 — deliberately one lesson naming several losable things
  the learner has owned as vocabulary for months without ever losing.
- **Exercises (earlier Book Two chapters):** Chapter 1 (plain vs. polite past, the register split
  lesson 7 built).
- **New vocabulary:** **1** — 財布 (wallet). Needed because "I lost my wallet" is the chapter's own
  named example and none of Book One's owned objects carries that specific weight (money and a bag
  are recoverable in different ways than the thing that holds your cards and ID).
- **New phrases:** 3. One polite report, one plain report to a friend, one question form
  (asking someone else whether they've lost something) so the pattern is not only ever
  first-person.
- **Depends on:** lesson 1, loosely — same verb, first named object.

### Lesson 3 — It's not turning up

- **Title:** It's not turning up
- **Can-do:** Say you can't find something, and that you're looking
- **Teaches:** 見つかる (to turn up, to be found — intransitive) in the negative, 見つかりません／
  見つからない, as the natural partner to 探す (to search, to look for). Paired with the
  already-known continuous state ています: 探しています, "I'm looking [for it]." Framed explicitly
  as a third instance of the intransitive/transitive pairing pattern the learner has already met
  twice (開ける／開く, 閉める／閉まる) — the teaching point is recognising the *shape* of the pair,
  not learning a new mechanic from scratch.
- **Exercises (existing ids):** `grammar.n5-te-imasu` for 探しています; `vocab.kaban` かばん,
  `vocab.megane` めがね, `vocab.kagi` 鍵, `vocab.okane` お金 as the things being searched for.
- **Exercises (earlier Book Two chapters):** loosely Chapter 6 (being able to) as a recognition-only
  aside — 見つけられません (can't manage to find it) is a valid alternate phrasing worth naming in
  the grammarNote, though the lesson's drilled form is the plain intransitive negative, not the
  potential.
- **New vocabulary:** **2** — 見つかる (to turn up, to be found) and 探す (to search, to look for).
  Both verified against JMdict at authoring. This pair is reused, affirmative and conditional, in
  lesson 10 — the chapter's one long-range internal dependency.
- **New phrases:** 3. One negative report (見つかりません), one ongoing search (探しています), one
  question (見つかりましたか, asked of someone else).
- **Depends on:** nothing new within the chapter; independent of lesson 1 and 2's specific objects,
  though it reuses them.

### Lesson 4 — What you left, and where

- **Title:** What you left, and where
- **Can-do:** Say what you left behind, and where
- **Teaches:** 忘れ物 (a forgotten/left-behind item), built for free from `grammar.n5-mono-nominaliser`
  (verb stem + 物) applied to the already-known 忘れる — exactly the construction that already gave
  the learner 食べ物 from 食べる, redirected onto trouble. Paired with とき (Chapter 3) to place the
  loss in a location and a moment — on the train, on the platform, in the taxi.
- **Exercises (existing ids):** `grammar.n5-mono-nominaliser`, `vocab.wasureru` 忘れる,
  `vocab.eki` 駅, `vocab.densha` 電車, `vocab.homu` ホーム, `vocab.takushii` タクシー,
  `vocab.nanban` 何番 (for "which platform").
  {No new noun is needed to name the trouble — that is the whole point of citing the pattern.}
- **Exercises (earlier Book Two chapters):** Chapter 3 (とき, joining a location clause to a main
  clause) and its own mono-nominaliser recognition, which is a Book One grammar pattern surfaced
  here for the first time since it was taught.
- **New vocabulary:** none. The lesson's teaching point is explicitly that 忘れ物 costs nothing.
- **New phrases:** 3. One naming what was left (using 忘れ物 as a noun on its own, e.g. as the
  subject of "it's not here"), one with とき placing it at a station or on a train, one question
  (asking where something was left).
- **Depends on:** lesson 1 loosely (shared 忘れる family); hard prerequisite is Chapter 3's とき.

### Lesson 5 — It's broken

- **Title:** It's broken
- **Can-do:** Say something is broken
- **Teaches:** 壊れる (to break, to be broken — intransitive) in its ています state form —
  `grammar.n5-te-imasu` redirected from "what someone is wearing" (帽子をかぶっています, the
  clothing chapter) to "what condition something is in." The grammarNote should name that
  redirection explicitly: same mechanism, new subject.
- **Exercises (existing ids):** `grammar.n5-te-imasu`, `vocab.denwa` 電話, `vocab.kagi` 鍵,
  `vocab.megane` めがね — a phone, a key, a pair of glasses, three plausible things to break.
- **Exercises (earlier Book Two chapters):** none new — this lesson's whole argument is that the
  state-ています mechanic from Book One does the work unaided.
- **New vocabulary:** **1** — 壊れる (to break, to be broken). 壊す (the transitive partner, "to
  break something") is a candidate for recognition-only mention in the grammarNote, not drilled —
  it would double the pairing work in a lesson that is otherwise deliberately light.
- **New phrases:** 3, one per object (phone, key, glasses), so ています's redirection is shown
  across more than one noun rather than asserted on a single example.
- **Depends on:** nothing new; independent of lessons 1–4.

### Lesson 6 — And now it doesn't work

- **Title:** And now it doesn't work
- **Can-do:** Say you can't use something because it's broken
- **Teaches:** chains lesson 5's 壊れて (て-form) into a potential-negative consequence built on
  the already-known 使う — 使えません, "it broke, so I can't use it." Combines Chapter 3's
  て-connector with Chapter 6's potential negative in a single sentence, and this is the lesson
  where **zero new vocabulary is the actual teaching point**: every word is either already owned
  (使う) or was taught two lessons ago (壊れる) — worth naming in the grammarNote the same way
  Chapter 1's lesson 5 did for た.
- **Exercises (existing ids):** `vocab.tsukau` 使う, plus lesson 5's `vocab.denwa` 電話 as the
  carried-forward object.
- **Exercises (earlier Book Two chapters):** Chapter 3 (て as connector, joining two clauses —
  the first time this chapter uses て for *sequence* rather than for ています) and Chapter 6
  (potential negative).
- **New vocabulary:** none.
- **New phrases:** 3. One chaining 壊れて…使えません on the phone, one on a different object
  carried from lesson 5 (key or glasses), one question form.
- **Depends on:** lesson 5, directly — cannot precede it, since it chains 5's verb. Hard
  prerequisite: Chapter 3 (て-connector) and Chapter 6 (potential).

### Lesson 7 — Asking for help

- **Title:** Asking for help
- **Can-do:** Ask someone for help
- **Teaches:** the favour-asking register — Chapter 2's giving-and-receiving (〜てもらえますか)
  stacked on Chapter 6's potential — applied first to 手伝う (to help, taught in Book Two chapter 2
  and reused here rather than reintroduced — see the collision note below), then to an
  already-known one, 教える (to tell, to show), so the learner sees the frame is general rather
  than tied to any one word. Also introduces 直す (to fix, to repair) as this lesson's one new verb,
  since "could you fix it" (直してもらえますか) is the collocation this trouble chapter actually
  needs — repair, not generic help, is what lesson 8 stands on.
- **Exercises (existing ids):** `vocab.tanomu` 頼む as a named contrast in the grammarNote — the
  simpler, already-known "to ask for/request" verb, next to the more indirect てもらえますか the
  learner is about to prefer; `vocab.oshieru` 教える, exercised directly in a phrase.
- **Exercises (earlier Book Two chapters):** Chapter 2 (giving and receiving, 〜てもらう／〜てくれる
  — and, specifically, 手伝う itself, taught in chapter 2's lesson 6) and Chapter 6 (potential,
  もらえますか as a request built on potential ability) — the first time this chapter stacks two
  rule chapters explicitly inside one construction rather than one chapter per clause. **手伝う was
  independently proposed as new vocabulary by this chapter's own first draft; the collision with
  chapter 2's proposal was resolved in chapter 2's favour, since a favour verb belongs with
  giving-and-receiving and chapter 2 comes first.** Reusing it here is not a shortfall against the
  chapter's original word count — it is exactly the designed repetition this whole reuse-field
  exercise exists to make visible: a word taught four chapters earlier, doing real work in a new
  situation.
- **New vocabulary:** **1** — 直す (to fix, to repair). Book One never supplied a repair verb.
  頼む covers "ask for" but not "help," which is why 手伝う (now chapter 2's word, reused above)
  was wanted here in the first place.
- **New phrases:** 4. This is the chapter's other register lesson (after lesson 1), and per Chapter
  1's own precedent for register lessons, each should be an **independent single utterance, not a
  dialogue**: one もらえますか request with 手伝う, one with 直す, one くれますか variant, one plain
  friend-register version.
- **Depends on:** loosely lesson 5/6 (直す answers what 6 broke). Hard prerequisite: Chapter 2
  (now including 手伝う itself, not only its grammar) and Chapter 6, both authored.

### Lesson 8 — What you need now

- **Title:** What you need now
- **Can-do:** Say what you need to put things right
- **Teaches:** Chapter 5's wanting patterns — 〜てほしい (wanting someone else to do something) and
  〜がほしい (wanting a thing) — turned toward the objects and repairs this chapter has been
  building: wanting someone to fix something, wanting a replacement. **No new vocabulary**: 直す
  arrived in lesson 7, 新しい (new) was already Book One's, and the nouns are all recalled from
  lessons 2 and 5.
- **Exercises (existing ids):** `vocab.atarashii` 新しい, plus recalled `vocab.kaban` かばん,
  `vocab.megane` めがね, `vocab.kagi` 鍵.
- **Exercises (earlier Book Two chapters):** Chapter 5 (wanting: 〜がほしい, 〜てほしい) —
  first genuine use of the *asking someone else* half of that chapter, since Book One's single
  〜たい pattern only ever pointed at the speaker's own action.
- **New vocabulary:** none.
- **New phrases:** 3. One 〜てほしい (wanting a repair), one 〜がほしい (wanting a replacement
  object), one negative ("I don't need a new one, just fix it") so the two constructions are
  contrasted rather than presented as interchangeable.
- **Depends on:** lesson 7 (直す) and loosely lesson 5 (the broken object). Hard prerequisite:
  Chapter 5.

### Lesson 9 — What you think happened

- **Title:** What you think happened
- **Can-do:** Tell someone what you think happened
- **Teaches:** と思います (Chapter 7) wrapped around a plain-past clause (Chapter 1) — reporting an
  uncertain memory rather than a stated fact: "I think I left it on the train," not "I left it on
  the train." This is the nesting Chapter 7's own header names as plain form's biggest payoff, and
  the first time this chapter puts a full clause, not a single verb, inside another pattern.
- **Exercises (existing ids):** `vocab.densha` 電車, `vocab.eki` 駅, `vocab.homu` ホーム, recalled
  `vocab.wasureru` 忘れる / `vocab.nakusu` 無くす from lessons 2 and 4.
- **Exercises (earlier Book Two chapters):** Chapter 7 (と思います, quoted/reported speech) and
  Chapter 1 (plain past, now embedded rather than standing alone — the clearest instance in the
  chapter of "the exact combination the book is built to produce").
- **New vocabulary:** **1** — 交番 (a police box). The calm, practical, non-dramatic place this
  conversation happens in Japan — where a traveller is actually told to report a lost item — not
  警察 (a police station), which reads as the crime-drama register the plan rules out.
- **New phrases:** 3. One affirmative uncertain report, one question form (asking a staff member
  whether they remember something), one recognition-only use of と言っていました (what someone else
  said — Chapter 7's other pattern) so both halves of that chapter are touched without drilling
  both equally.
- **Depends on:** lessons 2 and 4 (the objects and locations being reported on). Hard prerequisite:
  Chapter 7.

### Lesson 10 — If it turns up

- **Title:** If it turns up
- **Can-do:** Leave contact information in case something turns up
- **Teaches:** 見つかったら (Chapter 9's たら) reusing lesson 3's 見つかる — now affirmative and
  conditional rather than negative — paired with Book One's てください to leave an instruction:
  call this number if it turns up. This closes the loop lesson 3 opened and is the chapter's
  clearest example of a pattern learned once and used twice in different moods within the same
  chapter.
- **Exercises (existing ids):** `vocab.denwa` 電話, Book One's てください request pattern
  (established well before Chapter 6 of Book One).
- **Exercises (earlier Book Two chapters):** Chapter 9 (conditionals, たら) — the chapter
  immediately before this one, so this is the freshest possible callback — plus lesson 3's own
  vocabulary, reused rather than re-taught.
- **New vocabulary:** **1** — 番号 (number), needed to leave a phone number concretely. Shares the
  番 kanji already seen in `vocab.nanban` 何番, so it is a recombination, not a cold introduction.
- **New phrases:** 4. This is the chapter's capstone and the lesson closest to the production
  checkpoint's own shape, so it earns an extra phrase: one 見つかったら…ください instruction, one
  question form, one using ば instead of たら (Chapter 9's own contrast, touched lightly here), one
  putting the whole exchange in polite register end to end.
- **Depends on:** lesson 3, directly (reuses 見つかる). Hard prerequisite: Chapter 9.

### Lesson 11 — Chapter 10 checkpoint

- **Title:** Chapter 10 checkpoint
- **Can-do:** Recognise everything taught so far
- **`checkpoint: recognition`**, `wordIds: []`, `phraseIds: []`, `kanji: []`, no `patternId` — same
  shape as `n5.checkpoint-12` and Chapter 1's own checkpoint.
- **Placement:** closes the chapter and the book's teaching content. Recall-style format per Book
  Two's shift (§10): type the reading or meaning, mastery gate not grade, remaining set shrinks to
  zero, retries unlimited, nothing recorded, misses rejoin the SRS queue.
- **What comes after it is not part of this chapter:** the book's production checkpoint, specified
  in §6, is a separate book-level lesson (own file, no `chapterId`), the same way
  `n5.checkpoint-production` sits outside Book One's chapter 12. Consolidation and completion stay
  separate things (DR-021) — this lesson is consolidation; §6 is completion.

---

## 5. Totals

| | Count | Against the book's chapter-1 rule-chapter baseline |
|---|---|---|
| Teaching lessons | 10 | on target (03 §4) |
| Checkpoints | 1 (recognition) | one per chapter (DR-021), plus the book's production checkpoint outside this chapter |
| New words | **7** | ~0.7/lesson vs. chapter 1's 1.2/lesson — leaner still, see below |
| New verbs | **4** (見つかる, 探す, 壊れる, 直す; 財布, 交番, 番号 are nouns; 手伝う is reused from chapter 2, not counted here) | deliberate |
| New phrases | **32** | 3.2/lesson, in line with both chapter 1 (~3.4) and the people-clothes chapter (~3.3) |
| New grammar patterns worth an id | 2 (`grammar.b2-trouble-reason`, `grammar.b2-trouble-te-chain-potential`) | the rest are reuse |
| New kanji (candidates) | **~6** (財, 布, 壊, 直, 交, 号) | 0.6/lesson — see note; 伝 (手伝う's kanji) now belongs to chapter 2 |

**Why a situation chapter comes in this lean.** Book Two's other two situation chapters (feeling
ill, making plans) each add vocabulary to a domain the learner has no footing in. This chapter is
different in kind: the plan itself names its two headline verbs — 無くす, 困る — as already taught,
and the inventory pass in §3 found nineteen more owned words that fit the domain directly. A
situation chapter is normally where new nouns arrive; this one is where old nouns finally get used
for something. Padding it to a Book One-style ~33 words (Chapter 12's count) would mean inventing
trouble vocabulary nobody asked for — a second wallet-shaped word, a second way to say broken — at
the exact moment the task is proving the learner can combine four books' worth of material on real
sentences. The 7 that remain (財布, 見つかる, 探す, 壊れる, 直す, 交番, 番号) were each kept
because a specific lesson's phrase cannot be sourced without it, not because the chapter needed a
round number. An eighth candidate, 手伝う, was kept for the same reason right up until the collision
with chapter 2's independent proposal surfaced — it did not drop because the chapter had too many
words, it dropped because chapter 2 already teaches it and lesson 7 needed the verb, not a second
introduction of it.

**Kanji note, same shape as Chapter 1's §6.** At ~0.7 new kanji per lesson this chapter runs well
under Book One's 2.3/lesson measured average, for the identical reason Chapter 1 flagged: a chapter
that recombines owned vocabulary structurally cannot carry the same kanji load as one that
introduces fresh nouns. This is not this chapter's shortfall to fix — see [03 §3](03-book-two.md)
and Chapter 1 §6 for the book-wide arithmetic. Flagging, not fixing, again.

---

## 6. The production checkpoint — content it must draw on

Per [03 §8](03-book-two.md), Book Two's production checkpoint asks the learner to **compose from a
pattern and a situation**, not reproduce a remembered phrase — unlike Book One's
`n5.checkpoint-production`, which shows an English gloss and asks for the matching Japanese from
memory. This chapter is its immediate feeder, being the last chapter before it, and the plan says
so explicitly in the skeleton row. What follows is a content specification, not UI: the checkpoint
lesson itself lives in its own file (e.g. `src/content/lessons/b2-11-production-checkpoint.yaml`),
`checkpoint: production`, no `wordIds`/`phraseIds`/`kanji` of its own, same shape as
`n5.checkpoint-production` — only the *behaviour* differs, per the Book Two shift.

**What it should draw on:**

- **Situations, primarily from this chapter's inventory.** The 7 new words plus the 19 Book One
  words the inventory pass surfaced in §3 (plus 手伝う, reused from chapter 2) give a self-contained
  trouble domain: a lost wallet, a bag that won't turn up, a phone that broke, a key left on a
  train, asking a stranger for help, leaving a number at a police box. Each checkpoint prompt
  should present a **situation description in English** (never a Japanese sentence to reproduce)
  plus a **named pattern or pattern pair**, and let the learner choose from a small candidate
  vocabulary set — the same mechanically checkable frame model the per-lesson produce beat already
  uses (§8), just requiring two patterns stacked rather than one.
- **Patterns, from across the whole book.** Because this chapter's own design is "combine, don't
  add," it touches all seven rule chapters that precede it. The checkpoint's prompt pool should
  include **at minimum one prompt anchored to each**: Chapter 1 (plain past + だ), Chapter 2
  (giving/receiving), Chapter 3 (から／ので or て-as-connector or とき), Chapter 5 (てほしい／
  がほしい), Chapter 6 (potential), Chapter 7 (と思います), Chapter 9 (たら／ば) — seven baseline
  prompts — plus **3–5 explicit two-pattern prompts** modelled on this chapter's own flagship
  combinations (lesson 1's past-plus-reason, lesson 6's te-chain-plus-potential, lesson 7's
  giving-plus-potential), for roughly **10–12 prompts total**. That count is a floor, not a target
  to pad past — size it against what the pattern pool actually supports once chapters 2–9 are
  authored, the same caution §7 of the book plan applies to reading-set volume.
- **New situations, not the taught phrases verbatim.** A prompt that restates lesson 2's exact
  wallet sentence tests recall, not composition. Each prompt should place a familiar pattern against
  a situation the lesson phrases did not already cover — a different object, a different person
  asking, a different register — while staying inside vocabulary the learner has actually met.
- **No free composition.** Per §8, "write anything about X" is unchecked and explicitly deferred to
  Book Three's compose-then-compare. Every prompt here resolves to a frame with a determinable
  expected output once the pattern and the chosen word are fixed.
- **Mastery gate, not grade** (DR-020, unchanged from the recognition checkpoints): the remaining
  set shrinks to zero, retries are unlimited, nothing is recorded, and a miss rejoins the SRS queue
  rather than being tallied.

This document does not compose the prompts themselves — that is authored content under
[03 §9](03-book-two.md), same as every phrase above.

---

## 7. Authoring checklist

1. **Sourcing.** All 7 new words marked `content-source: training`, verified headword-by-headword
   against JMdict for Applications 3.6.2, with `# jlpt-source: training` where a level is asserted
   ([03 §9](03-book-two.md), CLAUDE.md). All 32 phrases are composed sentences and follow the
   sanctioned path: training-canonical, marked, pending Tatoeba verification. 手伝う needs no fresh
   sourcing pass here — it is verified and sourced as part of chapter 2's own content.
2. **Commit messages** on every content commit must name the source, or the commit is rejected.
3. **No dialogue in lesson 7.** Four independent single utterances, exactly as Chapter 1's own
   register lesson required — never a scripted exchange.
4. **The composition frame.** Ten frames, one per teaching lesson, authored alongside the lesson
   per [03 §0b/§8](03-book-two.md). The two flagged combination patterns (lessons 1 and 6) need
   their own `patternId`; the rest reference the existing ids from chapters 1, 2, 3, 5, 6, 7 and 9,
   which must exist before this chapter can be authored — **this chapter cannot be authored out of
   order**, unlike Chapter 1, since every lesson here leans on a rule chapter shipping first.
5. **Keep the register calm.** 交番 (police box), not 警察 (police station); a broken phone and a
   lost wallet, not a theft or an emergency. This is stated as a constraint above and is easy to
   drift from once "trouble" is the theme — check phrases against it at review time.
6. **Run `pnpm walkthrough`** before merge, and note that this is the chapter that first exercises
   the book's production checkpoint end to end — walk that lesson too, not just the ladder.
