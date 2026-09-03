# Book Three, Band 1 — Cause and consequence

**Status: design, not content.** This document specifies every lesson in the band in enough
detail that authoring the YAML is mechanical. **No Japanese sentence is composed here.** Every
example sentence named below is a real Tatoeba pair, cited by id, pulled from
`server/data/jmdict-examples-eng-3.6.2.json` — never invented, per `04-stage-reading.md` §8, which
is stricter here than Books One and Two.

Source brief: `docs/plans/book-three-bands.md` §1–§5 (binding — names this band's seven patterns and
the governing rules). Background: `docs/plans/04-stage-reading.md` §3 (the band model), §5 (the
reading library), §8 (sourcing). Worked example for structure, depth and voice:
`docs/plans/book-two-chapter-01.md`. Rule-chapter template for lesson shape:
`src/content/lessons/n5-16-te-form.yaml` and `src/content/lessons/b2-09-conditionals.yaml`.

**Shape landed: 7 teaching lessons + 1 recognition checkpoint, orders 196–203 — the full range
the brief assigned.** Attestation cleared all seven patterns in the skeleton; none scored zero, so
none is dropped. Three of the seven are thin, though, and that thinness is real — see §1.

**New vocabulary: none. New kanji: none.** Every pattern in this band is written in kana in
ordinary usage (為/所為/お陰 exist as kanji but the corpus overwhelmingly prefers ため/せい/おかげ),
and every pattern attaches to material the learner already owns — a plain-form clause. This band
is grammar, full stop; the reading library carries the words, exactly as `04-stage-reading.md` §3
says it must.

---


> **Orders here are provisional.** `book-three-bands.md` §3a was added after this document was
> written: a passive and causative band opens Book Three, before band 1, because Book Two chapter 7
> tells the learner the passive's conjugation and production "open the next book". That band is not
> sized yet, so every global `order` below shifts by its length, and this band's own number moves.
> Nothing else in this document changes — the patterns, the attestation and the lesson design all
> stand. Settle the numbering before authoring, not after.


## 1. Attestation — what I checked before committing anything

For each pattern I searched every Tatoeba example pair bundled in the local corpus (25,983 pairs)
for the pattern's surface form(s), then split the hits by length (≤30 characters, a rough proxy
for "usable as a first teaching example" rather than "needs the reading library's context to
parse"). Full method in `/private/tmp/.../scratchpad/attest2.mjs` if it needs re-running — it is a
throwaway script, not committed.

| Pattern | Search terms | Total hits | ≤30 chars | Verdict |
|---|---|---:|---:|---|
| ため(に) | ために, ための, ためだ, ため、, ため。, ためです, ためか | **328** | 221 | Rich. No risk. |
| せいで | せいで, せいだ, せいか | **26** | 17 | Solid. |
| おかげで | おかげで, おかげだ, お陰で, お陰だ | **31** | 23 | Solid. |
| によって | によって, により | **157** | 86 | Rich, but see the caveat below — a real share of these need passive voice, which Book Two never taught. |
| から(に)は | からには (strict) | **3** | 1 | Thin. Real, but the lesson will lean on 2 long sentences. |
| ものだから | ものだから, もんだから | 5 raw → **4 genuine** | 0 | Thin, and one of the 5 raw hits is a false positive — see below. |
| ことだから | ことだから | **2** | 2 | Thinnest pattern in the band. Both hits are clean and short, but there are only two. |

**Two things this search caught that a naive grep would have shipped wrong:**

- **`から(に)は` is not attested by searching `からは` alone.** I checked — 24 sentences contain
  からは, but on inspection every one of them is the ordinary particle から ("from") plus the topic
  marker は ("this magazine, though, keeps me..."), not the causal "now that" construction. The
  causal reading only shows up with には attached. Search `からには` specifically, not `からは`; the
  broader search is a false trail.
- **One of the five raw `ものだから` hits is a false positive.** Tatoeba #229619,
  「あわてものだから彼はたぶん早合点するだろう。」("Being a hasty person, he is likely to jump to
  conclusions"), matches the string ものだから because あわてもの ("a hasty person") is itself a noun
  that happens to end in もの — this is [noun]+だから, not the [clause]+ものだから construction the
  lesson teaches. It is the one hit under 30 characters, which is exactly why it is dangerous: it
  looks like the easy first example and it is not one. **Do not use #229619.** The four genuine
  hits (#76862, #76840, #222287, #149685) are all 32–43 characters — there is no short, simple
  ものだから sentence in this corpus at all. The lesson has to open on a real-length sentence.

**Net read: this band is authorable, but three of its seven lessons (から(に)は, ものだから,
ことだから) will each run on a handful of sentences, not a bank.** That is not a reason to cut
them — none scored zero, and the brief's rule is "no attestation" is the cut line, not "thin
attestation." It is a reason to author them differently, which §3 and §6 say explicitly.

---

## 2. Naming and ids

Following `book-two-chapter-01.md` §2's convention, extended to Book Three:

| Thing | Value |
|---|---|
| Chapter (band) id | `b3.band-1` |
| Chapter title (learner-facing) | **Cause and consequence** |
| Lesson `situation` | `Cause and consequence` |
| Lesson ids | `b3.tame-ni`, `b3.sei-de`, `b3.okage-de`, `b3.niyotte`, `b3.kara-niwa`, `b3.mono-dakara`, `b3.koto-dakara` |
| Checkpoint id | `b3.checkpoint-1`, `situation: Integration & checkpoint` |
| Pattern ids | `grammar.b3-tame-ni`, `grammar.b3-sei-de`, … one per lesson |
| Lessons file | `src/content/lessons/b3-01-cause-and-consequence.yaml` |

**On `order`, a deliberate departure from the book-two-chapter-01 template.** That document used
local numbering 1–11 and left global assignment to book assembly, because at design time Book
Two's own position in the ladder wasn't nailed down yet. This band's brief pre-assigns the global
slot — **196–203** — because three sibling bands are being planned in parallel at 204+ and a
collision there is a worse failure mode than a plan that names its own global numbers. I use
196–203 directly below rather than 1–8. If book assembly ever needs to renumber this band, the
renumbering is mechanical (every id above is stable; only `order` moves).

---

## 3. The chapter header comment

Paste this at the top of the lessons file, in the style of the plain-form and conditionals
chapters.

```yaml
# Band 1 — Cause and consequence.
#
# Book Two already gave the learner two ways to state a reason -- から and ので,
# taught back to back in the joining-sentences chapter as the same idea in two
# registers. This band does not replace either. It adds four more words for
# "because," and the whole point is that they are not interchangeable: English
# collapses blame, credit, mechanism and commitment into one word, and a
# learner who reaches for せいで when they mean おかげで has said something
# backwards, not something clumsy.
#
# The four richly-attested patterns come first, in the order a learner will
# actually reach for them. ため(に) opens because it does two jobs neither から
# nor ので does at all -- purpose ("in order to") as well as cause -- and
# because Tatoeba backs it harder than anything else in the band (328 sentences
# against ので's near neighbours). せいで and おかげで are taught as a pair
# immediately after: same shape, opposite stance -- blame and credit -- and
# teaching them apart would hide the one thing that makes them worth having,
# which is that a learner has to choose. によって closes the strong half: the
# most formal of the four, doing triple duty as "by," "according to" and "the
# agent of a passive sentence" -- a job this band cannot fully cash out, because
# passive voice is not built yet. See lesson 4 and section 6.
#
# The last three are a different kind of lesson. から(に)は, ものだから and
# ことだから are real, attested, and genuinely thin in this corpus -- three,
# five and two sentences respectively, against the first four's dozens. They
# are placed last on purpose: a learner who has just spent four lessons
# choosing between blame and credit is ready for finer, rarer distinctions,
# and a thin lesson lands better as a refinement than as an opener. からには
# upgrades から itself -- "now that X is true, Y follows" -- and is taught
# against b2-join-kara directly. ものだから is the apologetic cousin of ので,
# explaining yourself rather than stating a fact. ことだから reuses a
# nominaliser the learner already has from ~たことがある, pointed at a new job:
# not "an experience," but "the kind of thing this person does," which is what
# lets it predict rather than report.
#
#    1  ため(に)      because, and in order to
#    2  せいで        whose fault it is
#    3  おかげで      who gets the credit
#    4  によって      by, according to, and what a lesson short of passive
#                      voice can and can't say about it
#    5  からには       now that
#    6  ものだから     explaining yourself
#    7  ことだから     knowing them
#
# No lesson in this band depends on another's *form* -- each pattern attaches
# to a plain-form clause the same way から and ので do, and that is the whole
# band's shared prerequisite, not a chain between lessons. The checkpoint
# still closes the band rather than sitting mid-way (DR-021), because that is
# where its gate text belongs -- see section 6.
#
# content-source: every phrase in this file is a verified Tatoeba pair, cited
#   by id in the grammarNote. No training-canonical sentence is used anywhere
#   in this band (04-stage-reading.md §8).
```

---

## 4. The lessons

### Lesson 1 — Because, and in order to

- **Order:** 196
- **Title:** Because, and in order to
- **Can-do:** Explain what something is for, and what caused it
- **Teaches:** ため(に), both senses. The purpose sense — dictionary-form or volitional verb + ため
  に, "in order to" — is genuinely new territory; nothing in Books One or Two says "in order to."
  The cause sense — any plain clause + ため(に), "because of, due to" — sits next to から/ので and
  needs the contrast stated directly: ため carries a whiff of formality and a whiff of "for the
  sake of," which から and ので do not. Also worth a line: ため alone (no に) as a bare noun is its
  own idiom, ためになる, "to be instructive/of benefit" — attested (#219716) and worth flagging so
  a learner doesn't over-generalise the に as obligatory.
- **Attestation:** 328 hits, 221 at ≤30 characters — the richest pattern in the band by a wide
  margin. Representative, both senses: #191316 「安全のために御守りを持って行きなさい。」("Take an
  amulet for safety's sake" — purpose), #151231 「私達みんなは芝居を見るためにシアターへ行った。」
  ("All of us went to the theater to see a play" — purpose), #137673
  「大雨のためにダムが決壊した。」("The dam burst owing to the heavy rain" — cause). The corpus is
  deep enough that authoring here is a quality choice, not a scarcity problem.
- **Depends on:** Book Two `grammar.b2-plain-dictionary` (the volitional/dictionary form the
  purpose sense sits on) and, as contrast rather than prerequisite, `grammar.b2-join-kara` and
  `grammar.b2-join-node` — this lesson's grammarNote should name both and say plainly what ため
  adds that they don't.
- **New vocabulary:** none.
- **Reading-library slice:** any Band-1-level text tagged with this pattern should use ため(に) at
  least twice, ideally once in each sense, so the split the lesson teaches is reinforced rather
  than left as a single example.

### Lesson 2 — Whose fault it is

- **Order:** 197
- **Title:** Whose fault it is
- **Can-do:** Blame something for how things turned out
- **Teaches:** せいで (and でした/だ predicate forms せいだ, せいだった), plain clause or noun +の+
  せいで, "because of — and it's not good." The evaluative charge is the entire lesson: せいで
  frames the result as unwelcome, which から/ので/ため never do. The variant せいか ("maybe because
  of," a hedged cousin, attested twice in the sample set: #85717, #76786) is worth a line as a
  softer sibling, not a separate pattern.
- **Attestation:** 26 hits, 17 at ≤30 characters. Clean short examples exist:
  #183261 「気のせいだよ。」("It's just your imagination" — 7 chars), #233064
  「あなたの頭痛は過労のせいだ。」("Your headache comes from overwork"), #493157
  「彼は勉強不足のせいで試験に落ちました。」("He failed the exam because he had not studied enough").
- **Depends on:** Book Two `grammar.b2-plain-dictionary`. Paired with lesson 3 by design — see the
  header comment.
- **New vocabulary:** none.
- **Reading-library slice:** at least one text should place せいで next to a neutral-cause から/ので
  sentence so the evaluative charge is visible by contrast, not just asserted.

### Lesson 3 — Who gets the credit

- **Order:** 198
- **Title:** Who gets the credit
- **Can-do:** Give something the credit for how things turned out
- **Teaches:** おかげで, the positive mirror of lesson 2 — same grammatical shape (clause/noun+の+
  おかげで), opposite stance: the result is welcome, and there is real gratitude in the word (it
  is used in polite thanks — おかげさまで — though that fixed idiom is a step past this lesson's
  scope, worth a one-line flag rather than a teaching point). Bare おかげで opening a sentence
  ("thanks to that...") is common and attested — teach it as the pattern's most natural start,
  not an edge case.
- **Attestation:** 31 hits, 23 at ≤30 characters — the deepest of the three "evaluative cause"
  patterns after ため. Clean examples: #167729 「私が今日あるのは両親のおかげである。」("I owe what I
  am to my parents"), #213327 「そのおかげで誤解が解ける。」("It removes misunderstandings" — 13
  chars), #178562 「あなたのおかげで仕事がうまく行きました。」("Thanks to you, the job went well").
- **Depends on:** lesson 2, directly — this lesson's grammarNote should open by naming what
  changed (blame → credit, nothing else) rather than re-deriving the grammar from scratch.
- **New vocabulary:** none.
- **Reading-library slice:** as lesson 2 — a text carrying both せいで and おかげで, ideally in the
  same passage, is the strongest possible reinforcement for this pair and should be prioritised
  if the eventual text source can supply it.

### Lesson 4 — By, and according to

- **Order:** 199
- **Title:** By, and according to
- **Can-do:** Say what a difference comes from — a method, a rule, or who did something
- **Teaches:** によって (and its more written register-mate により — same job, cite both forms and
  flag the register shift), noun +によって/により, covering three related jobs: **means**
  ("by reading books, I get knowledge" — #152802), **variation** ("table manners vary by country"
  — #202379, "decided by money" — #144586), and — the one this lesson must handle carefully — the
  **agent of a passive sentence** ("determined by," "made by"). That third job is by far the most
  textbook-canonical use of によって, and this band cannot teach it honestly: **passive voice is
  not built anywhere in Book One or Book Two**, and — see section 6 — it is not clearly built
  anywhere in the rest of the Book Three skeleton either. Source this lesson's teaching sentences
  from the means/variation sense only (决まる, 異なる, 決める-family predicates, not a passive verb
  form); a passive-agent によって sentence met in the reading library should be treated as
  incidental exposure the learner is not expected to parse yet, not a lesson failure.
- **Attestation:** 157 hits (によって + により combined), 86 at ≤30 characters — rich, but a
  meaningful share of the deeper hits are passive-voice sentences that must be screened out at
  authoring for exactly the reason above. Safe, non-passive examples: #202379
  「テーブルマナーは国によって異なる。」("Table manners vary from one country to another"), #144586
  「人の生活様式の大半はお金によって決まる。」("One's lifestyle is largely determined by money"),
  #152802 「私は本を読むことによって知識を得る。」("I get knowledge by reading books" — also a clean
  callback to `grammar.b2-ta-koto-ga-aru`'s こと-nominaliser, worth naming).
- **Depends on:** `grammar.b2-plain-dictionary`; incidentally exercises `grammar.n5-mono-nominaliser`
  through こと + によって sentences (different nominaliser, same idea of "clause becomes noun" —
  worth a one-line bridge, not a re-teach).
- **New vocabulary:** none.
- **Reading-library slice:** tag only means/variation-sense によって sentences as this pattern's
  reinforcement at Band 1. Passive-agent によって sentences should wait for whichever later band
  or book actually builds passive voice — see section 6's recommendation.

### Lesson 5 — Now that

- **Order:** 200
- **Title:** Now that
- **Can-do:** Say what follows, now that something is already true
- **Teaches:** から(に)は — plain non-past + からには, "now that X is the case, [it follows that /
  you'd better / I intend to] Y." This is から itself, narrowed: not "because," but "given that
  this is now settled, here's the consequence" — usually carrying resolve or obligation in the
  second clause. Teach it explicitly against `grammar.b2-join-kara`, which the learner already
  owns, rather than as a fresh particle chain: からには is から plus a commitment reading, not a
  new word to memorize from zero.
- **Attestation: thin. 3 sentences total, 1 under 30 characters.** #228488
  「いやしくもやるからには上手くやれ。」("If you do it at all, do it well" — 17 chars) is the clean
  teaching example. The other two, #75551 and #185034, are 37 and 44 characters and read as real
  connected text rather than isolated teaching sentences — use them as the lesson's "here it is
  in the wild" examples rather than the opener, and do not invent a fourth. **Do not search
  からは as a substitute** — see section 1's false-trail note; it does not attest this pattern.
- **Depends on:** `grammar.b2-join-kara`, directly and by name.
- **New vocabulary:** none.
- **Reading-library slice:** with only 3 corpus sentences total, this pattern's real reinforcement
  has to come from the reading library, not the lesson. Prioritise sourcing at least one further
  からには sentence for the library if the eventual text corpus allows it — this is the band's
  single point most exposed to "the pattern was taught once and never seen again."

### Lesson 6 — Explaining yourself

- **Order:** 201
- **Title:** Explaining yourself
- **Can-do:** Explain why you did what you did, the way you'd explain it to a friend
- **Teaches:** ものだから (colloquial もんだから) — plain clause + ものだから, "that's why, you
  see" — the apologetic, self-justifying cousin of ので. Where ので states a reason, ものだから
  reads as excusing or accounting for something the listener might otherwise judge. Both an
  na-adjective/noun route (なものだから) and a plain-past route (past + ものだから) are attested —
  show both.
- **Attestation: thin, and one trap.** 5 raw hits, **1 is a false positive — #229619 must not be
  used** (section 1). The 4 genuine hits (#76862, #76840, #222287, #149685) run 32–43 characters;
  there is no short opener in this corpus, so the lesson opens on real-length material rather than
  a minimal-pair sentence, which is a legitimate choice for a band whose whole premise is
  "connective grammar in real text," not a compromise to apologize for.
- **Depends on:** `grammar.b2-plain-da` (the なものだから route needs だ's noun/な-adjective
  behaviour) and, as contrast, `grammar.b2-join-node`.
- **New vocabulary:** none.
- **Reading-library slice:** same caution as lesson 5 — 4 sentences is not a bank. This pattern
  needs the reading library to carry real weight, not just the lesson.

### Lesson 7 — Knowing them

- **Order:** 202
- **Title:** Knowing them
- **Can-do:** Predict what someone will do, because you know them
- **Teaches:** ことだから, in its two real shapes. The idiomatic core — [person]+の+ことだから,
  "knowing them as I do" — predicts behaviour from character (#233557
  「あなたのことだから上々でしょう。」, "I hope and I know you did great!" is the textbook case). The
  second, more literal shape — plain-past clause + ことだから, "since it's [the fact that]..." —
  is a straightforward extension of the こと-nominaliser the learner already has from
  `grammar.b2-ta-koto-ga-aru` (#149963 「自分でやったことだから仕方がないね。」, "You brought it on
  yourself"), pointed at a new job. Name the bridge explicitly: same こと, same "turn a clause
  into a noun" move, different predicate stapled on.
- **Attestation: the thinnest pattern in the band — exactly 2 sentences, and no more exist in
  this corpus.** Both are clean and both are short (16 and 18 characters), which is the one thing
  in this pattern's favour: the lesson has no length problem, only a quantity problem. There is no
  margin here for a held-back checkpoint item distinct from the teaching sentences — see section 6
  for how the checkpoint should handle that honestly rather than papering over it.
- **Depends on:** `grammar.b2-ta-koto-ga-aru`, directly — the grammarNote should open by naming
  the shared nominaliser rather than presenting ことだから as unrelated new material.
- **New vocabulary:** none.
- **Reading-library slice:** essential for this pattern specifically. With 2 corpus sentences and
  no headroom, whatever the eventual text source is (§5's open decision), it needs to be checked
  for ことだから coverage before this lesson ships, not after.

### Lesson 8 — Band 1 checkpoint

- **Order:** 203
- **Title:** Band 1 checkpoint
- **Can-do:** Recognise everything Band 1 taught
- **`checkpoint: recognition`**, `wordIds: []`, `phraseIds: []`, `kanji: []`, no `patternId` — same
  shape as `b2.checkpoint-1`. Mastery gate, not a grade (DR-020): the remaining set shrinks to
  zero, retries unlimited, nothing recorded, misses rejoin the SRS queue.
- **The shrinking set, honestly sized.** For ため(に), せいで, おかげで and によって, the
  recognition pool should hold back sentences the learner has not seen in the teaching lesson —
  the corpus is deep enough on all four that this costs nothing. For からには, ものだから and
  ことだから, it cannot: the corpus does not contain enough sentences to teach with some and test
  with others held back. **The honest choice is to reuse the teaching sentence in the checkpoint
  for these three rather than manufacture a fourth example that doesn't exist.** A recognition
  pass on a familiar sentence is still a real mastery gate — it asks "do you know what this word
  is doing," not "have you never seen this exact string" — and reusing attested material is a
  smaller cost than inventing one, which this book cannot do at all.
- **The gate text** closes the band. See section 6 for what it must contain — that section, not
  this one, is where the requirement lives, because it applies to the whole band's close, not to
  this lesson entry alone.
- **Placement:** at the band boundary, coinciding with the ~10-lesson cadence by construction at
  this band's size (DR-021). No lesson in this band gates another's form (see the header comment),
  so there is no earlier point the checkpoint could sensibly move to.

---

## 5. Totals

| | Count | Note |
|---|---|---|
| Teaching lessons | 7 | matches the skeleton's pattern list exactly — none dropped |
| Checkpoints | 1 | band boundary (DR-021) |
| New words | **0** | mining carries vocabulary at this stage (04-stage-reading.md §3); nothing in this band's material needs an exception — see section 6 |
| New kanji | **0** | every pattern is written in kana in ordinary usage |
| New grammar patterns | 7 | one per teaching lesson |
| Attested example sentences available | 328 + 26 + 31 + 157 + 3 + 4 + 2 = **551 raw**, with real usable depth concentrated in 4 of the 7 patterns | see section 1 |
| Global order | 196–203 | pre-assigned by the brief; full range used |

---

## 6. Judgment calls — where I think the plan needs a decision, or is silent

### 6.1 によって's canonical use needs passive voice, and nothing in the ten-band skeleton clearly builds it

**This is the band's most consequential finding, and it isn't really about Band 1 — it's about
the skeleton.** によって's single most common textbook use is marking the agent of a passive
sentence ("this novel was written by Natsume Sōseki," 〜によって書かれた) — Genki and every other
mainstream course teach によって *as* the passive lesson's companion. Book One and Book Two never
build passive voice. I checked whether a later band picks it up: scanning every pattern listed
across all ten bands in `book-three-bands.md` §3, **passive-voice mechanics do not appear
anywhere as their own pattern.** Band 10 lists "passive as formality" as one bullet among six, but
that bullet is framed as a register phenomenon (how written Japanese leans on the passive for
distance and objectivity), not as the conjugation lesson a learner needs before that register
point means anything. A learner cannot be taught "passive reads as formal" without first being
taught how to form and parse a passive verb at all.

**What I did about it in this band:** lesson 4 sources only the means/variation sense of によって
and explicitly defers the agent-marking sense (see the lesson's own note). That keeps this band
honest without needing the fix to land first.

**What I think should happen, which is not mine to decide:** either passive/causative-passive
voice needs its own band inserted into the skeleton — most naturally near band 5 (speaker stance)
or as an early band 7/8 neighbour, given how much of the obligation/permission band's material
(ざるを得ない, てはならない) also leans on verb forms a learner without causative-passive will
struggle to parse — or band 10's "passive as formality" bullet needs to be expanded and moved
earlier, with a note that it now carries the mechanical lesson too. I'd rather flag this loudly
than quietly work around it in every later band that touches によって, 〜られる, or the causative.

### 6.2 ため(に) is claimed by both this band and band 7 — resolve it in this band's favour

Band 7 (purpose and intent) lists `ために` again in its own pattern set (`ように / ために / 〜べく /
〜まい / つもり / ことにする / ことになる`). This band already teaches ために's purpose sense in full
(lesson 1). **Band 7's author should drop ために from that list when band 7 is planned** — nothing
is left for it to add. I'm noting this here rather than silently letting band 7 re-teach material;
this band-01 document is the place a band-07 author will check before assuming ために is unclaimed.

### 6.3 No vocabulary exception is worth arguing for

Two of this band's words — せい and おかげ — have independent JMdict entries as standalone nouns
(所為, お陰) and could, in principle, be taught as freestanding vocabulary. I considered it and
decided against it: せい almost never appears outside 〜のせい in ordinary use, and おかげ's
freestanding use is dominated by the fixed idiom おかげさまで, which is its own teaching point, not
a vocabulary card. Neither earns the exception `04-stage-reading.md`'s vocabulary rule allows for.
This band ships zero new words, cleanly, and that is the right number rather than a shortfall.

### 6.4 Three lessons are thin, and I chose not to merge them to hide it

からには, ものだから and ことだから could be folded into two lessons instead of three — pairing
ものだから with ことだから, say, pooling six sentences instead of stretching four and two
separately. I decided against it. `04-stage-reading.md` §3 is explicit that a lesson teaches one
pattern, and these three are genuinely different pragmatically (resolve/commitment vs.
self-justification vs. character-based prediction) even though they share a family resemblance.
Merging them would read as a contradiction the way `book-three-bands.md` warns ながら's two senses
would if taught as one thing. The honest fix for thinness is not fewer lessons — it's saying, in
each lesson entry and in the checkpoint note (§4, lesson 8), exactly how thin the material is and
what an author should and shouldn't do about it. That is what sections 1 and 4 do.

---

## 7. The gate text (band close)

`04-stage-reading.md` §3 promises this checkpoint something Book Two's never had: **a passage the
learner could not have read when the band opened, now readable.** The actual text is not this
document's call — the text-source decision (`book-three-bands.md` §2) is still open, and nothing
here depends on which way it resolves. What the gate text must satisfy, whichever source supplies
it:

- **It must be unreadable without this band.** At least one sentence's causal relationship must
  turn on a pattern this band taught — remove the reader's knowledge of that pattern and the
  sentence's cause-and-effect logic breaks, not just its fluency.
- **It should draw on at least two of this band's patterns, preferably three,** so the checkpoint
  tests recognition across the band rather than one lucky pattern. **Require this only from the
  four richly-attested patterns** (ため(に), せいで, おかげで, によって) — demanding からには,
  ものだから or ことだから appear is not realistic given how rarely they occur in any short passage
  (their own attestation numbers, section 1, are the evidence for this). If one of the three thin
  patterns shows up, credit it; do not require it.
- **Vocabulary must sit inside the same ~98% known target every Band-1 text carries** — 2–3
  unknowns per ~150 words, the fixed number `04-stage-reading.md` §5 sets for the whole reading
  library, not a number this band gets to renegotiate.
- **It should read as connected text**, a paragraph, not a single isolated sentence — this is what
  makes it a gate rather than one more recognition item, and it's the reason the text-source
  decision (graded-reader licensing vs. Aozora vs. clustered sentences) matters as much as it
  does. A gate built from a clustered-sentence stopgap should say so rather than dress itself up
  as a passage the Tadoku principles would recognise.
- **No score, no pass mark.** Consistent with DR-020: the gate text is presented once the
  checkpoint's shrinking recognition set empties, framed as "you can read this now" — the honest
  motivator `04-stage-reading.md` §5 and §9 both name — never as a test the learner can fail.

---

## 8. Authoring checklist

1. **Sourcing.** Every phrase in this band is a verified Tatoeba pair, cited by its numeric id in
   the `grammarNote`. No training-canonical sentence anywhere — `04-stage-reading.md` §8 is
   stricter than Books One and Two and this band has no exemption.
2. **Do not use Tatoeba #229619** (ものだから false positive, section 1) or search `からは` as a
   substitute for `からには` (also section 1) — both are documented traps, not open questions.
3. **Screen lesson 4's によって sentences for passive voice** and exclude them at this band
   (section 6.1). A passive-agent によって sentence met later in the reading library is fine
   incidental exposure; one used as this lesson's own teaching example is not.
4. **Commit messages** on every content commit must name the source, or the commit is rejected
   (CLAUDE.md).
5. **Re-surface `grammar.b2-join-kara` and `grammar.b2-ta-koto-ga-aru`** in the SRS queue before
   lessons 5 and 7 respectively — both lessons are built explicitly as extensions of those
   patterns, not fresh material, and the grammarNote's bridge only lands if the prerequisite is
   actually fresh in review.
6. **Run `pnpm walkthrough`** before merge — it exists for exactly this: content that adds or
   renumbers lessons. Note its own caveat: as a guest run it will not reach Book Three at all
   (`TIER_BOOK_LIMIT`); a signed-in run is required to verify this band specifically.
7. **The text-source decision** (`book-three-bands.md` §2) blocks the reading-library slice and
   the gate text, not the seven teaching lessons — those can be authored and shipped from the
   attested sentences in section 1 alone, same as any Book Two chapter. Do not let the open
   text-source question stall lesson authoring.
