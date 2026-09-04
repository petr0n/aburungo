# Book Three, Band 3 — Conditions, sharpened

**Status: design, not content.** No Japanese sentence is composed here. Every example cited below
is either a word/particle named in isolation (fine per the sourcing rule) or a real Tatoeba
sentence quoted verbatim with its id (also fine, and the only sourcing this band's phrases may
use — 04-stage-reading.md §8 is explicit that nothing training-canonical ships at this stage).

Source brief: `docs/plans/book-three-bands.md` §3 (row "3 | Conditions, sharpened"), §4 (what a
band breakdown must add). Grammar dependency: `src/content/lessons/b2-09-conditionals.yaml` and
its plan, `docs/plans/03-book-two.md`. Working templates: `n5-16-te-form.yaml` (rule-chapter
shape) and `b2-09-conditionals.yaml` (the conditionals chapter this band sits on top of).

**Shape landed: 5 teaching lessons + 1 capstone (no new grammar) + 1 recognition checkpoint = 7
lessons, global order 212–218.** The skeleton named six patterns; attestation killed two outright
(§1 below), which is why this band lands at 7 rather than the ~10 the skeleton's own language
expects and explicitly permits ("Pattern counts are targets, not quotas"). New vocabulary: **0**,
by design — see §4. New phrases: **~20–24**, one Tatoeba sentence per phrase, all sourced below.

---


> **Global orders settled.** The passive band (`book-three-band-00-passive.md`) opens
> Book Three with 8 lessons at 196-203, so this band moved from 212 to **219**. Every
> `order` below shifts by 8; no lesson id changes. The band's own number moves too - this is
> the book's chapter 4, not 3.


## 1. Attestation — the part that decides the shape

Counted against `server/data/jmdict-examples-eng-3.6.2.json` (the Tatoeba pairs embedded in the
local JMdict-for-Applications dump), deduped by Tatoeba sentence id across every dictionary entry
that links to it. Method: `Read` the file, `Bash`/`python3` to walk it as JSON Lines (each line is
one dictionary entry; sentences live at `sense[].examples[].sentences[]`), regex over the
deduplicated Japanese text. This is the same file `scripts/reading.mjs` and `scripts/vocab.mjs`
read; nothing here required new tooling, only a throwaway script.

| Pattern | Search | Unique sentences | Verdict |
|---|---|---|---|
| 限り | `限り` | 46 | **Keep.** Genuine mix: general "as long as X holds" (存在する限り, ある限り — dozens), plus 4 clean `ない限り` "unless" (188572, 193204, 124496, 230683). A handful are the unrelated bare-noun sense ("there is no limit," 189885) or the idiom 限りの ("all there is of," 74885) — noted, not taught as the core rule. |
| 次第 | `次第` | 21 | **Keep, but it is two jobs at uneven attestation.** 8 clean noun+次第 "depends on / is up to" (天気次第, 君次第, 腕次第, 結果次第では...). 3 clean masu-stem+次第 "as soon as" (空港に着き次第, 終わり次第, 用意が出来次第). The remaining 10 are 次第に "gradually" (a different, adverbial word — false-friend risk, not this pattern) or fixed formal idioms (〜次第です, こういう次第だ) — named for recognition, not built on. |
| さえ〜ば | `さえ.{0,25}ば` | 19 | **Keep.** Both real shapes attested: masu-stem+さえ+すれば (雨がやみさえすれば, ボタンを押しさえすれば) and N+さえ+V-ば (主体・客体さえ訳せれば). Healthy count, no thin spots. |
| たとえ〜ても | `たとえ.{0,25}(ても\|でも\|とも)` | 10 | **Keep.** Thinner than the others but covers every word class that matters: verb+ても (困っていても, 雨が降っても), i-adj+くても (くだらなくても), i-adj+とも classical (寒くとも), na-adj/noun+でも (多忙でも). The bare て-form+も mechanic underneath is far better attested on its own (79 sentences match a loose `(ても\|でも)、` clause-boundary probe, with the usual caveat that sentence-initial でも "but" pollutes that wider count) — if 10 ever feels thin for exercises, the lesson can draw a bare-ても sentence and let たとえ be optional, since that is linguistically true anyway (see §3, lesson 5). |
| ようでは | `ようでは` (also checked `様では`, `ようじゃ`, `様じゃ` for kana/kanji and colloquial variants) | **0** | **Drop.** No hit under any spelling. The two `ようじゃないか` hits that do exist are a different construction (volitional + じゃないか, "why don't we") and were excluded on inspection, not counted. |
| ものなら | `ものなら` | **2** | **Drop.** 228240 is a genuine idiomatic ものなら ("if she ever caught me..."), but one sentence cannot carry a lesson. 188196 is borderline a different parse (もの as "a thing," なら as its own copula-conditional, not the idiomatic "if you dare" construction) — so really **1** clean hit, not 2. Dropped as instructed. Had it survived, its dependency note would have been: なら is already owned (`b2.cond-ba-adj-noun`, b2-09 lesson 6), so ものなら would have been "one new nominaliser word, もの, bolted onto a conditional already taught" — structurally identical to how §3 below treats さえ〜ば. Worth remembering if a later book revisits it with a bigger corpus. |

**Net: 4 patterns survive, not 6.** That is the finding this report is most for.

## 2. The chapter header comment

Paste this at the top of `b3-03-conditions-sharpened.yaml` once authored.

```yaml
# Band 3 — Conditions, sharpened.
#
# Book Two's conditionals chapter gave four ways to say "if" and spent three
# lessons just teaching a learner which one a Japanese speaker would reach
# for. This band does not reopen that argument -- it assumes it, and adds
# four connectives that do not compete with たら/と/ば/なら so much as sit on
# top of them: two are literally that machinery plus one new particle, one
# is a second conditional altogether (限り), and one crosses into concession
# rather than condition (たとえ〜ても), which is why it closes the band rather
# than sitting in the middle of it.
#
# The skeleton named six patterns. Two did not survive contact with Tatoeba:
# ようでは returned zero attested sentences under any spelling, and ものなら
# returned one clean hit, not enough to source a lesson's worth of exercises
# without composing Japanese this project does not permit. Both are cut
# rather than padded -- see the band's own plan document, section 1, before
# reopening either.
#
# 限り costs nothing to build and everything to place correctly. It attaches
# straight to the plain non-past or plain negative a learner has owned since
# the plain-form chapter -- no new conjugation, full stop -- and it means
# roughly "as long as X keeps holding" or, negated, "unless." The work is
# that English glosses this the same way it glosses ば and たら, and it is
# not interchangeable with either: 限り requires the condition to be a
# state that persists, not a one-off event, which is exactly the axis the
# next lesson needs.
#
# さえ〜ば is not a new conditional. It is さえ, one new particle meaning
# roughly "even just," dropped in front of the ば a learner already
# conjugates without thinking. Building it costs one word; using it costs
# noticing that さえ narrows ば's condition to "this one thing is sufficient,"
# the same narrowing "限り" does from a different direction -- which sets up
# the contrast lesson that follows immediately, the same way every
# genuinely confusable pair in the conditionals chapter got one.
#
# 次第 is one pattern doing two jobs at uneven attestation, so it gets one
# lesson rather than two: noun + 次第 ("depends on," well attested) is the
# lesson's spine, and masu-stem + 次第 ("as soon as," thinner but real) rides
# with it as the second half. Watch for 次第に, the adverb "gradually" --
# same word, unrelated grammar, and it is common enough in the corpus that a
# careless search would have overcounted this pattern by a third.
#
# たとえ〜ても closes the band because it is the one pattern here that is not
# a variation on "if": it is "even if," where the outcome holds regardless
# of the condition rather than because of it. The mechanic underneath --
# て-form (or くて/で for adjectives and na-adjectives/nouns) plus も -- is
# new; nothing in Book Two taught concessive も. たとえ itself is optional
# emphasis, not the grammar, and the lesson says so plainly rather than
# implying the two words are inseparable.
#
# The capstone teaches no new grammar. It is this band's four patterns plus
# every conditional Book Two built -- たら, と, ば, なら -- put in front of
# the learner together and asked which one a Japanese speaker would reach
# for. That is the same move the conditionals chapter's own closing lesson
# made, one level up.
#
#    1  as long as it holds        限り, affirmative and ない限り
#    2  if only you'd just...      さえ〜ば, built on the ば you already have
#    3  two ways to say as long as 限り vs さえ〜ば, dedicated, no new grammar
#    4  depends on it -- or the    次第, two jobs at uneven attestation
#       moment it's done
#    5  even if it doesn't go      たとえ〜ても, the new mechanic is ても
#       your way
#    6  every "if" at once         all seven conditionals, old and new, no
#                                  new grammar
#
# Lesson 6 depends on everything before it and on the whole of Book Two's
# conditionals chapter, so this band cannot be split by a checkpoint before
# it -- the same constraint b2-09 carried for the same reason.
#
# `wordIds` throughout cite existing Book One/Two vocabulary only. This band
# adds zero new vocabulary.yaml entries -- see the plan document section 4
# for why that is a deliberate reading of "vocabulary does not come from
# lessons," not an oversight.
#
# content-source: every phraseIds entry this band references must carry a
#   Tatoeba sentence id in its `notes` field and cite it in the authoring
#   commit message, per CLAUDE.md. No content-source: training marker is
#   permitted in this file or in phrases/b3-03-conditions-sharpened.yaml --
#   the N5 exemption does not reach this book.
```

## 3. Lessons

Chapter id: `b3.chapter-3`. File stem: `b3-03-conditions-sharpened.yaml` (lessons, phrases, and
grammar directories all take this stem). `situation` on every entry: "Conditions, sharpened."

Global lesson `order` is assigned here as 212–218 per the brief; band assembly may renumber if
bands 1/2/4 land at different final counts, but the *relative* order within this band (6 teaching
positions, checkpoint last) should not change.

---

### Lesson 1 — As long as it holds
`id: b3.cond-kagiri` · `order: 212` · `patternId: grammar.b3-cond-kagiri`

**Can-do:** Say that something is true only as long as some other state keeps holding, and its
flip side, unless.

**What it teaches, and how it's built:** 限り attaches directly to a plain non-past or plain
negative verb — no conjugation to teach, because the plain form is Book Two's own
(`b2.plain-dictionary`, `b2.plain-nai-ichidan`/`b2.plain-nai-godan`). The rule is entirely about
*when* to reach for it: the clause in front of 限り has to name a state that persists, not a
one-time event — ある限り, 続く限り, 元気な限り (via である/plain copula) read naturally; a single
finished action does not fit here the way it fits たら. Negated, ない限り flips the reading to
"unless" and is common enough in its own right (4 clean hits below) to teach as the pattern's
second half rather than as an afterthought. One footnote worth stating rather than hiding: 限り
is also an ordinary noun meaning "limit" (宇宙には限りはない, "there is no limit to the universe")
and appears in a "to the full extent of" idiom (力の限り, 声を限りに) that this lesson does not
teach — flagged so a learner meeting it in reading does not assume it is a broken version of the
grammar they just learned.

**Exercises (Tatoeba, existing/attested — copy-ready):**
- 180502 — 強大な権力を有する大国が存在する限り、戦争は避け難い。 / "As long as there are sovereign nations possessing great power, war is inevitable."
- 189964 — 飲み食いするものが十分ある限り彼は何も気にしない。 / "He doesn't care, provided he has enough to eat and drink."
- 188572 — 汚さない限り、この本を持ち帰ってもいいですよ。 / "You may take this book as long as you keep it clean."
- 193204 — もっと勉強しない限り落第しますよ。 / "You will fail unless you work harder."

**Exercises (existing manifest ids):** the plain-form ids above are cited for retention, not
vocabulary — this lesson brings no situational word list. Content words inside the attested
sentences above (存在する, 戦争, 勉強する, 落第する) are new-to-mining, not curated here; an author
should not add them as `wordIds` unless they already exist in the manifest.

**Exercises (earlier chapters of this book):** none — this is band 3's first lesson. Bands 1 and 2
are being designed in parallel and carry no committed ids yet to cite.

**New vocabulary needed:** 0. See §4.

**New phrases needed:** ~4, sourced one-for-one from the four sentences above (two affirmative,
two ない限り), each demonstrating a different subject/register so the pattern reads as general
rather than tied to one example.

**Dependencies:** `b2.plain-dictionary`, `b2.plain-nai-ichidan`, `b2.plain-nai-godan` (Book Two,
plain-form chapter) — the entire conjugation this lesson needs.

---

### Lesson 2 — If only you'd just...
`id: b3.cond-saeba` · `order: 213` · `patternId: grammar.b3-cond-saeba`

**Can-do:** Say that one thing alone is enough to guarantee something else.

**What it teaches, and how it's built:** This is not a new conditional — the task brief's framing
holds exactly. さえ is one new particle, "even just" / "if only," and it sits in front of the ば a
learner already conjugates from `b2.cond-ba-verbs` and `b2.cond-ba-adj-noun`. Two shapes, both
attested: masu-stem + さえ + すれば when there is no natural object (押しさえすれば, "if only you'd
just press it"), and N + さえ + V-ば when there is (客体さえ訳せれば, "if only you can translate the
object"). Framed to the learner as: "you already know how to build ば. さえ is the only new thing
here, and all it does is narrow the condition to 'this much is sufficient.'"

**Exercises (Tatoeba, existing/attested — copy-ready):**
- 232397 — あなたはボタンを押しさえすればいい。 / "All you have to do is press the button."
- 140286 — 走りさえすれば、どんな車でもよいのです。 / "Any car will do, as long as it runs."
- 224132 — コツさえ覚えれば、朝飯前ですよ。 / "It's a snap once you get the hang of it."
- 75273 — 主体・客体さえ訳せればあとはそこまで難しくないです。 / "If you can translate the subject and object then after that it isn't so difficult."

**Exercises (existing manifest ids):** none curated — same reasoning as lesson 1.

**Exercises (earlier chapters of this book):** none yet available (see lesson 1).

**New vocabulary needed:** 0.

**New phrases needed:** ~4, one per sentence above, chosen to show both the stem+さえ+すれば shape
and the noun+さえ+V-ば shape so the lesson doesn't quietly teach only one of them.

**Dependencies:** `b2.cond-ba-verbs`, `b2.cond-ba-adj-noun` (Book Two, conditionals chapter,
lessons 5–6) — the ば conjugation this lesson reuses without re-teaching.

---

### Lesson 3 — Two ways to say "as long as"
`id: b3.cond-kagiri-saeba-contrast` · `order: 214` · no `patternId` (no new grammar)

**Can-do:** Choose between 限り and さえ〜ば for a given "as long as," and say why the other is
wrong.

**What it teaches, and how it's built:** Nothing new — this is the band's one dedicated contrast
lesson, in the same spirit as b2-09's と-vs-たら and ば-vs-たら lessons: "three of the nine teaching
lessons introduce no new grammar at all. Their whole job is choosing." Both patterns gloss to
English "as long as," and that is precisely the trap. 限り says a *state must keep holding* —
存在する限り, ある限り — and reads naturally with conditions the speaker has no control over. さえ〜ば
says *this one thing is sufficient* — a minimal, often controllable condition (押しさえすれば, "if
only you press it"). Swap them and the sentence still parses but the emphasis is wrong: 限り on a
trivial, controllable action reads oddly formal and detached (the same "reads stiff" problem
b2-09 flagged for ば on a settled one-off plan); さえ〜ば on an ongoing state a person has no lever
over reads as if the speaker is offering a solution nobody asked for. The test to give the
learner: is the condition something you *do* once (さえ〜ば) or something that has to *keep being
true* (限り)?

**Exercises (Tatoeba, existing/attested — copy-ready):** reuses the eight sentences from lessons 1
and 2 above, paired for contrast (e.g. 189964 against 140286, both "as long as/if only" glossed in
English, opposite logic underneath). No new sentences needed for this lesson specifically, though
an author may want one more minimal pair if the eight above don't split cleanly enough in
practice — that is an authoring-time call, not a planning one.

**Exercises (earlier chapters of this book):** none yet available.

**New vocabulary needed:** 0. **New phrases needed:** 0 (reuses lessons 1–2's phrases).

**Dependencies:** `b3.cond-kagiri`, `b3.cond-saeba` — both patterns fully taught first.

---

### Lesson 4 — Depends on it — or the moment it's done
`id: b3.cond-shidai` · `order: 215` · `patternId: grammar.b3-cond-shidai`

**Can-do:** Say that one thing depends on another, and that something happens the instant
something else is finished.

**What it teaches, and how it's built:** One word, two jobs, taught in one lesson because the
second job's attestation (3 sentences) doesn't carry a lesson of its own. Noun + 次第 is the
spine — 天気次第, 君次第, 腕次第, "depends on the weather / it's up to you / it depends on your
skill" — a bare noun with no copula, which is worth calling out explicitly since a learner fresh
off ば/なら will expect one. Masu-stem + 次第 is the second, thinner job — 着き次第, 終わり次第,
出来次第, "the moment X is done" — and should be taught as recognition-first given only 3 clean
attestations, with a note that band 4 (Time and sequence) owns a family of "as soon as" forms
including たとたん and will sharpen this further; this lesson does not need to, and should not try
to, pre-empt that band's contrast work. **False-friend warning, stated plainly in the
grammarNote:** 次第に is a separate adverb meaning "gradually" (日が経つにつれて、天気は次第に悪化しつつ
あった) — same characters, unrelated grammar, and common enough in the corpus that it is worth a
learner's while to be told directly rather than discover it by confusion.

**Exercises (Tatoeba, existing/attested — copy-ready):**
- 197729 — ビアガーデンに客がたくさんいるかどうかは天気次第だ。 / "Whether or not beer gardens get a lot of customers depends on the weather."
- 141009 — 選択は全く君次第だ。 / "The choice is all up to you."
- 233808 — あなたにいくら給料を支払うかは、あなたの腕次第ですね。 / "How much we pay you depends on your skill."
- 179349 — 空港に着き次第、電話します。 / "I'll phone you as soon as I get to the airport."
- 183007 — あなたの用意が出来次第出発しましょう。 / "We'll leave as soon as you are ready."

**Exercises (existing manifest ids):** none curated.

**Exercises (earlier chapters of this book):** none yet available.

**New vocabulary needed:** 0.

**New phrases needed:** ~5, three for noun+次第 (the well-attested job) and two for masu-stem+次第
(the thinner one, kept to recognition-weight exercises rather than open production given the
attestation gap).

**Dependencies:** none within Book Two specifically — 次第 attaches to a bare noun or a masu-stem,
both of which are N5-level material the learner has owned since Book One.

---

### Lesson 5 — Even if it doesn't go your way
`id: b3.cond-tatoe-temo` · `order: 216` · `patternId: grammar.b3-cond-tatoe-temo`

**Can-do:** Say that something stays true no matter what happens, including the worst case.

**What it teaches, and how it's built:** Unlike lessons 1–4, this one is not a compound of owned
machinery — nothing in Book One or Two taught concessive も. The mechanic: て-form + も for verbs
(雨が降っても), くても for i-adjectives (くだらなくても), で(も) for na-adjectives and nouns
(多忙でも). た-form's own conjugation is Book Two's (`b2.join-te`), so the only genuinely new piece
is も landing where the second half of a te-form clause usually would, plus the reading that this
now means "even if/though" rather than "and." たとえ itself is optional emphasis — the lesson
should say so directly rather than implying the two words are inseparable, since a learner reading
real text will meet bare ても doing this same job constantly. Worth one explicit false-friend
footnote: たとえ ("even if") and 例えば ("for example") are not the same word, though they share a
root and a learner will see both in the same paragraph of real text.

**Exercises (Tatoeba, existing/attested — copy-ready):**
- 203527 — たとえ雨が降っても、その試合は行われるだろう。 / "The game will be played even if it rains."
- 203482 — たとえ多忙でも彼は来るだろう。 / "Even if he is busy, he will come."
- 203493 — たとえ困っていても、マックはいつも楽天的だ。 / "Even if he is in trouble, Mac is always optimistic."
- 114395 — (くだらなくても clause, embedded in a longer sentence) たとえどんなにくだらなくてもそのまま認めることにしている。 / "...no matter how dumb, he agrees with every idea they suggest." — usable in full or, if the surrounding sentence is judged too long for this lesson's level, held back for the reading library instead.

**Exercises (existing manifest ids):** none curated.

**Exercises (earlier chapters of this book):** none yet available.

**New vocabulary needed:** 0.

**New phrases needed:** ~4, one per word class (verb, i-adj, na-adj/noun), plus one showing bare
ても without たとえ so the "たとえ is optional" claim isn't only asserted, it's shown.

**Dependencies:** `b2.join-te` (Book Two, joining-sentences chapter) for the te-form itself; no
other Book Two dependency.

---

### Lesson 6 — Every "if" at once
`id: b3.cond-capstone` · `order: 217` · no `patternId` (no new grammar)

**Can-do:** Pick the right conditional — old or new — out of the full set, for a given situation.

**What it teaches, and how it's built:** Nothing new, and everything at stake. This mirrors
b2-09's own closing lesson (`b2.cond-three-way`, "When each is wrong") one level up: that lesson
held たら/と/ば apart; this one adds 限り, さえ〜ば and たとえ〜ても to the same board and asks the
learner to place all seven. なら rides along as the fourth Book Two form (owned since
`b2.cond-ba-adj-noun`) since a full accounting needs it, though it was never this band's to teach.
The questions that settle it, in order: (1) is the second half a request/decision? と is out, ば is
out if the first half is a chosen action — たら or 限り carry it, and 限り only if the first clause
names a persisting state. (2) Does the outcome hold *regardless* of the condition rather than
*because of* it? That is たとえ〜ても alone; every other form in this set says the opposite. (3) Is
the condition a minimal, one-off sufficiency ("just this") rather than an ongoing state? さえ〜ば.
Anything left over falls back to たら, the default b2-09 already established. `ほうがいい`
(`b2.cond-hougaii`) should appear in this lesson's phrases as texture — a conditional feeding
advice, e.g. an attested-sentence pairing where a 限り or さえ〜ば clause sets up a recommendation —
but it is not itself one of the seven the learner is choosing between.

**Exercises (Tatoeba, existing/attested — copy-ready):** draws from the full pool gathered across
lessons 1–5 above (17 sentences total once duplicates across lessons 1/3 are collapsed), plus
b2-09's own attested phrase set for たら/と/ば/なら review. No new Tatoeba sourcing needed for this
lesson specifically.

**Exercises (existing manifest ids):** `cond.if-i-have-time-ill-go`, `cond.press-it-and-it-opens`,
`cond.if-its-expensive-i-wont-buy-it`, `cond.you-should-go-to-bed-early` and similar — any of
b2-09's phrase ids are fair game here; an author should pick a spread across all four Book Two
forms rather than favouring one.

**Exercises (earlier chapters of this book):** none from bands 1–2 (not yet authored); this
lesson's entire "earlier material" callback is to Book Two's conditionals chapter, which is why
its dependency list is unusually long for a capstone.

**New vocabulary needed:** 0. **New phrases needed:** 0 — recombines existing phrase ids from
lessons 1–5 of this band and from `b2-09-conditionals.yaml`.

**Dependencies:** `b3.cond-kagiri`, `b3.cond-saeba`, `b3.cond-shidai`, `b3.cond-tatoe-temo` (this
band, in full) plus `b2.cond-tara-if`, `b2.cond-tara-when`, `b2.cond-to`, `b2.cond-ba-verbs`,
`b2.cond-ba-adj-noun`, `b2.cond-hougaii` (Book Two, conditionals chapter, in full). This lesson
cannot be reached early, and the band cannot be split by a checkpoint before it — same constraint
b2-09 itself carried and stated for the same reason.

---

### Lesson 7 — Band 3 checkpoint
`id: b3.checkpoint-3` · `order: 218` · `checkpoint: recognition`

**Can-do:** Recognise everything this band taught, plus read the gate text (§5).

Recognition-only pass over the band's four patterns, the same shrinking-set mechanics as every
earlier checkpoint (DR-020): type the reading or the meaning, retry unlimited, nothing recorded,
misses resurface sooner. `wordIds`/`phraseIds`: empty, per precedent (`b2.checkpoint-9`).

**What makes this checkpoint different from every one before it, and the one open build gap it
exposes:** book-three-bands.md §2 asks for a **gate text** — a passage unreadable when the band
opened, now readable. §5 below specifies what it must contain. The current `Lesson` schema
(`src/content/lessons/schema.ts`) has no field for a reading passage at all — `wordIds`,
`phraseIds`, `kanji`, `checkpoint` are the whole shape. **This is a real gap, not a detail to wave
past:** either the schema needs a `readingIds`/`gateTextId` field before this checkpoint can be
authored as more than a recognition drill, or the gate text lives outside the lesson record
entirely (e.g. surfaced by the reader UI once `b3.checkpoint-3`'s pattern set is satisfied,
keyed by chapter rather than stored on the lesson). Both are plausible; neither exists today. Flag
for whoever owns the reading-library build (04-stage-reading.md §11's "heaviest phase" list) —
this band's checkpoint is the first place the gap actually blocks something.

## 4. Why this band adds zero new vocabulary

限り and 次第 are real nouns — by b2-09's own precedent (ほう got a `vocab.hou` entry because it is
an ordinary noun doing grammatical work), they could be added to `vocabulary.yaml` the same way.
**Judgment call: don't.** Three reasons. First, neither と/たら/ば/なら/ので/けど/し — every
connective particle Book Two actually taught — was ever given a vocabulary entry; only ほう was,
specifically because ほうがいい needed a *content* word (ほう means "side," and the grammar rides on
that meaning). 限り and 次第 are functioning purely as connectives here, not as content nouns a
sentence is *about*. Second, and decisively: 04-stage-reading.md is explicit that Book Three
retires lesson-curated vocabulary in favour of mining — adding these four words as authored
flashcards would quietly reintroduce the exact model this stage exists to replace. Third, it costs
nothing: a learner who meets 限り or 次第 in a library text after this band will have it offered by
the mining flow like any other unknown word, in its actual sentence, which is a strictly better
acquisition path than a decontextualised flashcard. さえ and たとえ are particles/adverbs with no
Book One/Two precedent for a vocab entry regardless (は/も/が/ば never got one either) — same
conclusion, easier call.

## 5. The gate text

**What it must contain, not which text:** a passage whose comprehension depends on recognising at
least 2 of this band's 4 surviving patterns (限り, 次第, さえ〜ば, たとえ〜ても) in context, sitting at
the stage's flow target of ~98% known vocabulary (04-stage-reading.md §5 — 2–3 unknown tokens in a
~150-word passage).

**The mechanism, and its real limit — checked against the actual tooling rather than assumed:**
`scripts/levelling.mjs` already computes both halves separately, and they do not combine the way
the skeleton's language ("unreadable, now readable") implies:

- **Vocabulary coverage** (`levelSentence`) is the 98% number. It is *blind to grammar by
  construction* — the module's own comment says so: "the structural list marks grammar machinery
  as known unconditionally, so coverage cannot see an unknown grammar pattern — only unknown
  words." A passage using 限り could already score 98%+ before this band exists, because 限り isn't
  penalised as an unknown token in the first place.
- **Grammar tagging** (`tagSentence` → `grammarIds`) is the half that actually names which
  patterns a sentence uses, via literal surface-fragment matching against every `pattern:` field in
  `src/content/grammar/*.yaml` (`ourGrammar()` in `scripts/reading.mjs`). Before this band is
  authored, `限り`/`さえ〜ば`/`次第`/`たとえ〜ても` simply do not exist as patterns anywhere in that
  directory, so a sentence using them tags with *nothing* for those constructions — not a
  block, not a warning, just silence.

**So the honest spec for the gate text is a conjunction, not a single number:** ≥98% vocabulary
coverage **and** `grammarIds` naming at least 2 of `grammar.b3-cond-kagiri`,
`grammar.b3-cond-saeba`, `grammar.b3-cond-shidai`, `grammar.b3-cond-tatoe-temo`. The second half is
what makes the text "unreadable, now readable" true in a way the tooling can actually check — a
passage meeting the first condition alone was never blocked by this band in the first place, so it
would be a false gate.

**One authoring note for whoever writes the `pattern:` field, since it decides whether tagging
works at all:** `grammarSurface()` splits on `〜`/`～` and requires every fragment to appear in
order. `"限り"` and `"次第"` as single fragments will tag correctly but will also fire on the
unrelated bare-noun/adverb senses named in lessons 1 and 4 above (次第に especially) — a known,
accepted imprecision, not a bug to chase. `"さえ〜ば"` and `"たとえ〜ても"` should tag cleanly as
two-fragment patterns; note the ても search that sourced lesson 5 also matched でも/とも variants
that a literal `"ても"` fragment won't catch, so a `ても`-tagged gate text may undercount slightly
against the fuller attestation in §1 — acceptable, since the gate only needs 2 of 4 patterns
represented, not full coverage of every variant.

**Text source:** unresolved at the book level (book-three-bands.md §2), and this document does not
resolve it — the requirement above (98% coverage + ≥2 tagged patterns) holds regardless of whether
the eventual text comes from a licensed graded reader, levelled Aozora Bunko, or a clustered
`micro-readings.json`-style stopgap. If the stopgap is what ships first, the "gate text" is
honestly a gate *sentence-set* rather than a single coherent passage, and the reader UI must not
dress it up as more than that (04-stage-reading.md §5's own instruction, restated here because
this is exactly the checkpoint where the temptation to fake coherence is highest).

## 6. Open questions I'm answering rather than leaving blank

- **Should 限り and さえ〜ば really get a dedicated contrast lesson when the skeleton budgeted this
  band at ~10 lessons for 6 patterns, not 7 for 4?** Yes. Both patterns gloss to the same English
  "as long as," which is precisely the condition that earned たら/と and ば/たら their own dedicated
  lessons in b2-09 — an English speaker has no lexical signal telling them apart, so the
  contrast has to be taught directly, not left to infer. Skipping it to hit a rounder number would
  repeat the mistake DR-021 and the b2-09 plan both warn against: coherence over arithmetic.
- **Should 次第's two jobs split into two lessons, matching how b2-09 gave たら two lessons for its
  two jobs?** No — b2-09 had budget (9 lessons for 3 forms) and even attestation for both of たら's
  jobs. Here the second job (masu-stem+次第, "as soon as") has only 3 clean sentences, not enough
  to sustain its own lesson's worth of production exercises. One lesson, uneven weight between the
  two jobs, stated explicitly rather than smoothed over.
- **Is the skeleton's band description right to group these six patterns as "conditions"?**
  Mostly, with one real seam: たとえ〜ても is a *concession*, not a *condition* — the outcome holds
  *despite* the clause, not *because of* it. It is grouped here anyway because Tatoeba supports it
  at this band's difficulty and because the capstone lesson needs a "when does the if-logic break
  down entirely" case to be a real test rather than a rehash — but a future author should not be
  surprised to find it filed under band 2 (Contrast and concession) in some later revision. Noted,
  not fought.
- **Does this band's placement risk colliding with band 4's たととん and うちに ("as soon
  as"/"while")?** Yes, specifically at 次第's masu-stem job. Band 4 is being designed in parallel
  and has no committed lesson ids to cite yet, so this document cannot point to a specific
  cross-reference — but whoever authors band 4 should read lesson 4 above before writing its
  "as soon as" material, the same way b2-09 pre-emptively flagged its たら-vs-時 collision before
  band 4's equivalent existed.
- **Should the checkpoint's gate-text requirement block authoring this band's YAML at all?** No.
  The four teaching lessons and the capstone are fully specified and buildable today from the
  Tatoeba sentences cited above — none of them depend on the reading library. Only the checkpoint's
  gate text depends on the schema gap in §3, lesson 7, and on the §2 text-source decision. Author
  lessons 1–6 now; lesson 7 can ship as a recognition-only checkpoint immediately and gain the gate
  text once the reading library exists, without renumbering anything.

## 7. Global order note

212–218, contiguous, 7 slots — matches the brief exactly (6 teaching + 1 checkpoint, where the
brief's own budget allowed up to 7). No collision to flag against bands 1 (196–203), 2 (204–211) or
4 (219–226).
