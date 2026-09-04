# Book Three, Band 9 — Nominalisation and reference

**Status: design, not content.** This document specifies every lesson in the band in enough
detail that authoring the YAML is mechanical. **No Japanese sentence is composed here.** Every
example sentence named below is a real Tatoeba pair, cited by id, pulled from
`server/data/jmdict-examples-eng-3.6.2.json` — never invented, per `04-stage-reading.md` §8.

Source brief: `docs/plans/book-three-bands.md` §3 (band 9's row), §3b (raw attestation ceilings,
re-derived below, not trusted — this band's are, by the skeleton's own admission, "the most
inflated in the book"). Background: `docs/plans/04-stage-reading.md` §3 (the band model), §5 (the
reading library), §8 (sourcing). Worked examples for structure, depth and voice:
`docs/plans/book-two-chapter-01.md`, `docs/plans/book-three-band-07.md`,
`docs/plans/book-three-band-08.md` (the two most recent siblings — this document matches their
shape). Load-bearing background this band cannot be designed without: `src/content/lessons/b2-01-plain-form.yaml`
(lesson 8 — こと is already a taught word, `vocab.koto`, glossed "it turns a whole action into a
noun," and already carries `grammar.b2-ta-koto-ga-aru`); `src/content/lessons/b2-06-potential.yaml`
(lesson 5 — `grammar.b2-koto-dekiru`, the other fixed phrase built on the same word);
`src/content/grammar/b2-07-quoted-speech.yaml` (the と-quoting family という and とは must be told
apart from, by name, not by accident); `docs/plans/book-three-band-07.md` §1.4 and §4 lesson 5
(ことにする/ことになる, band 7's slice of こと, confirmed here rather than re-litigated); and
`docs/plans/book-three-band-10.md` §4 lesson 4 and §11 (において, における's own clausal twin,
planned in parallel from order 274 — its instruction to this band is corrected, not just followed;
see §1.6).

**Shape landed: 7 teaching lessons + 1 recognition checkpoint = 8 lessons, orders 266–273 — the
full range assigned, spent in full.** Every one of the six named patterns (ところ, という, とは,
に関して, について, における) clears attestation, several of them extremely richly, and こと earns
the seventh lesson on the strength of its own narrowed, genuinely new slice. Two of this band's raw
ceilings — という at 423 and とは at 499 — turn out to be the two richest or messiest single
numbers this book has produced, and both needed the full hand-classification the brief asked for
before either could be trusted. の, though named in the skeleton's own band-9 row, is deliberately
left out; see §6.1 for why.

**New vocabulary: 1** — ところ itself, never taught anywhere in this ladder (§1.2, §5). **New
kanji: 1** — 関, from に関して, confirmed absent from `data/content-manifest.json`'s kanji set
(§1.6). Every other pattern in this band is written in kana in ordinary usage and attaches to
material the learner already owns — mostly Book Two's plain form, already paid for twice.

---

## 1. Attestation — what I checked before committing anything

Counted directly against `server/data/jmdict-examples-eng-3.6.2.json` (25,983 unique Tatoeba
sentences), reading `ex.sentences[]` under `lang: "jpn"` — not the `text` headword field, the trap
`book-three-bands.md` §3b names by name. Every raw count below matched the brief's own ceiling
exactly, confirming the field is read correctly. Method scripts (throwaway, not committed):
`/private/tmp/.../scratchpad/{extract,search}.mjs` plus a set of targeted classification passes,
one per pattern, described inline below. Where a bucket was large enough that reading all of it by
hand was disproportionate (こと's 1,570 raw hits; とは's 499), I used targeted regex sweeps against
the *shape* of each construction rather than a keyword search, and spot-checked every bucket by
eye — the same discipline band 7 used for まい's fourteen-way contamination and band 8 used for
てはならない's opposite-polarity trap, scaled to buckets an order of magnitude larger.

Every pattern's JMdict sense list, pulled from the same examples file's own entries (not a separate
dictionary — this file carries full entries, not just sentences), independently confirms the jobs I
hand-classified below. I checked this *after* classifying, not before, so it is a second source
agreeing with the first rather than a shortcut that replaced hand-reading.

### 1.1 こと — the job the skeleton flagged as needing narrowing, narrowed

The learner already owns two fixed phrases built on こと: `grammar.b2-ta-koto-ga-aru` (～たことが
ある, "have done before") and `grammar.b2-koto-dekiru` (～ことができる, potential). Band 7 already
claimed two more: ことにする and ことになる (`grammar.b3-koto-ni-naru`; ことにする itself never
cleared one attested sentence and is cited once, not taught). What none of those four teaches is
こと's own, general, productive job: **attach it to any plain clause and the whole clause becomes a
noun** — usable as the subject, object, or topic of a *different* predicate, one that has nothing
to do with ある, できる, にする or になる. That is the slice that is genuinely this band's, and it
turns out to be the richest teaching pool in the entire book so far.

A direct substring search on こと returns 1,570 raw hits — far too many, and far too dominated by
ordinary uses of the word ("thing, matter") and the four already-taught fixed phrases, to read one
by one. Instead I searched for the *shape* of the new job: a plain non-past verb ending in one of
the eight godan/ichidan endings, immediately followed by こと, immediately followed by one of the
three particles that mark subject, object or topic — が, を, は — with the two already-taught fixed
phrases (ことができる/ことがある, both spellings, kana and 出来る) explicitly excluded.

| Slot | Search | Hits | What it shows |
|---|---|---:|---|
| Subject (こと + が) | `[verb]ことが`, excluding ことができ/ことが出来/ことがある/ことがない | **84** | 見ることが好き, 避けることが必要, 話すことが多い — the clause is the subject of a new predicate |
| Object (こと + を) | `[verb]ことを` | **130** | 祈ることを, 決めることを禁じる, 誇りにすることを — the clause is the object of a new predicate |
| Topic (こと + は) | `[verb]ことは` | **267** | 彼の言うことは正しい, 試合に勝つことは重要だ — see below, this is also とは's largest single contaminant |
| **Total, confirmed genuine** | | **481** | Richer than every single-lesson pool this book has shipped, ように (413, band 7) included |

**とは's own 499-hit ceiling (§1.4) hands this lesson 267 of its citations for free.** Any noun
ending in と, followed directly by は, produces the literal substring とは — and こと is exactly
such a noun. Every one of those 267 ことは sentences is genuine, well-formed material for *this*
lesson, not for とは. Nothing is wasted; it simply belongs to a different pattern than its raw count
suggested, the same shape of finding band 8 made for てはならない's 31 "lost" なくてはならない hits.

**A second, smaller but genuinely useful trap sits inside こと itself, and it is a real teaching
point rather than a footnote:** ことがある in the *non-past* is not the learner's already-owned
たことがある. 24 genuine, clean hits split into two flavors — a generic tendency ("X sometimes
happens," [#170281] 細菌が病気を引き起こすことがある, "germs can cause sickness"; [#220798]
この川は雪解けの後氾濫することがある, "this river sometimes overflows after the thaw") and an
existential "there's something that..." ([#142069] 折り入って頼みたいことがある, "there's something
I'd like to ask you as a special favor"; [#109458] 彼は何か気にかかることがあるようだ, "he seems to
have something on his mind"). Same three words, different tense on the verb in front, a different
claim entirely from "I have done this before" — worth naming directly, the same shape of trap band
8 built lesson 4 around for てはならない/なくてはならない, at much lower stakes.

**JMdict confirms the shape independently** (seq 1313580, the same entry `b2-01-plain-form.yaml`
already cited for `vocab.koto`): its sense list includes "nominalizing suffix" and "after an
inflectable word, creates a noun phrase indicating something the speaker does not feel close to" —
exactly the job this lesson teaches, worded by the dictionary before I ever searched a single
sentence. Book Two's own gloss for `vocab.koto` already told the learner こと "turns a whole action
into a noun" — this lesson is where that sentence, written a whole book ago, is finally cashed in.

Two further こと senses the same JMdict entry lists — "you should..., I advise that you..." (a
grammarian would call this ことだ, 98 raw hits found in passing) and "pretending to..." — are real
but are a different job from the nominaliser this lesson teaches, and are left out; see §6.4.

### 1.2 ところ — one word, at least four real jobs, room in the budget for one lesson

Raw 220. ところ is not currently taught as vocabulary at all (checked against
`data/content-manifest.json` — absent), which the brief's ceiling table does not flag, because a
substring count cannot tell a taught word from an untaught one. Hand-classifying the 220 by the
shape of what precedes/follows ところ:

| Bucket | Count | What it is |
|---|---:|---|
| るところだ／でした (about to, or a near-miss that didn't happen) | 17 | [#161315] 忘れるところだったわ, "I almost forgot"; [#227385] 窒息するところだった, "almost choked" |
| ているところだ／です (in the middle of) + ているところを + a "catch" verb (見た／捕まった／押さえた) | 13 | [#91414] メーキャップを落としているところですよ, "she's cleaning off the make-up"; [#225632] 巣を張るところを見たことがありますか, "have you ever seen it spinning its web" |
| たところだ／です (just did) | 13 | [#160570] スーパーマーケットへ行ってきたところです, "I have just been to the supermarket"; [#194804] ただいま戻ったところです, "has just come home" |
| **Aspectual triad, teaching core** | **43** | the pattern this lesson is built on |
| ところで (topic change, "by the way") + ところが (however) + Vたところで (concessive, "even if") + Vたところ、(narrative, "and then/when") + ところによれば (according to) | ~40+ | real, common, a different grammatical category (discourse connective, not a noun) — recognition footnote, not taught here; see §6.2 |
| Xな／Vところがある／もある (there's a [quality] side/some [places] that...) | ~10 | [#183654] 結構かわいいところもあるじゃない, "he actually has a cute side" — recognition footnote |
| 今のところ／このところ／ここのところ／結局のところ／実のところ／正直なところ (fixed adverbial idioms: so far, lately, in the end, actually, honestly) | 26 | recognition footnote, not taught as a rule |
| ふところ (懐, bosom/purse) and ひところ (一頃, "once, at one time") | 3 | **false positives** — different words that happen to contain the substring ところ |
| Bare noun "place" (私のところ, いいところ, etc.) | remainder | ordinary vocabulary use, not this lesson's grammar |

**JMdict independently confirms every bucket** (seq 1343100, headword 所/処/處): senses 8
("whereupon, as a result" — the narrative Vたところ、 job), 9 ("about to, on the verge of"), 10
("was just doing... have just done, just finished doing" — the dictionary folds mid-doing and
just-did into one sense; the corpus supports teaching them as two, distinguished by ている vs た),
11 ("approximately, around, about" — the idiomatic-adverbial family), and 4 ("point, aspect, side,
facet" — the personality-trait family). Nothing here is invented; every job is dictionary-attested.

**Decision: one lesson, built on the 43-strong aspectual triad, with the discourse-connective and
idiom families carried as a rich recognition footnote rather than a second lesson.** See §6.2 for
why, given that the footnote family is, by raw count, comparably large to the taught core.

### 1.3 という — richer than ように, and close to contamination-free

Raw 423. I read roughly 300 of the 423 by hand across every distinguishable job and found **zero**
false positives — no lexicalized word collides with the three-kana string という the way すばらしい
collided with らしい or うまい collided with まい. This is, on the evidence sampled, the second
pattern in this book (after ように, band 7) to clear its full raw ceiling essentially untouched, and
at 423 it is nominally larger than ように's 413. Distinct jobs found, all genuine, all attested many
times over:

- **Naming/labeling, N という N2 — "an N called/named N2":** [#170949] 佐藤さんという方があなたの
  留守中にお見えになりました ("a person named Sato came to visit while you were out"), [#236464]
  「バイオテクノロジー」という言葉が普通に使われるようになったのは、いつ頃ですか ("when did the word
  'biotechnology' come into common use"), [#74579] 「むくろじ」という大木の種 ("the seeds of a large
  tree called soapberry"). The single most productive job, and the one no other pattern in this
  ladder supplies.
- **Appositive, "the fact/claim/rumor that S":** [#215508] ジョンソンがトレードされるという噂がある
  ("there's a rumor Johnson is going to be traded"), [#116623] 彼の息子が死んだという知らせは、とても
  ショッキングだった ("the news of his son's death was a great shock").
- **Sentence-final という/ということだ (hearsay, "I hear that / it means that"):** [#219760]
  この本によれば、最初の人工橋梁は新石器時代にさかのぼるという ("this book says the earliest
  man-made bridges date back to the New Stone Age"), [#123238] 内閣は倒れるだろうということだ ("they
  say the cabinet will fall").
- **というのは (explanatory opener, "that is to say"):** [#77794] 倫理学というのは、行動の規範を意味
  する ("ethics means the rules of conduct") — close enough to とは's own defining job that the two
  lessons must name the overlap directly rather than let it surface as a contradiction; see §1.4 and
  lesson 4.
- **何百／何千という (quantifier emphasis, "hundreds/thousands of"):** [#187315] 何百というバッファ
  ローが湖のほうへ移動した ("hundreds of buffaloes moved toward the lake").
- **あっという間に (fixed idiom, "in the blink of an eye"):** [#182679] 休暇はあっという間に終わった.

**JMdict confirms it directly** (seq 1922760, headword と言う, "exp"): senses "called, named, that
says, that" / "as many as, as much as" / "all..., every single..." — matching the naming job, the
quantifier job, and the emphatic-totality flavor exactly.

**The lesson's spine is the boundary against `grammar.b2-quote-plain`/`grammar.b2-quote-da`
(Book Two chapter 7), and it must be named directly.** と + 言う, as chapter 7 taught it, always
*closes a full sentence*, reporting an utterance, with a tensed verb of saying at the very end
(明日行くと言いました). という never does that job here — it sits *inside* a sentence, modifying a
following noun (Nという N2) or forming a fixed clause-final tag (ということだ). A learner who has
chapter 7 in hand and meets という cold could plausibly read it as "and X said," which is wrong for
every citation above. Naming the difference in one sentence — *と言う reports what was said; という
names what something is called* — is cheap and load-bearing.

### 1.4 とは — the messiest ceiling in the band, and where all 499 hits actually go

Raw 499, and the brief's own warning ("とは counts every topic-と plus は") turns out to
understate the mess. Hand-classified in full, in buckets ordered from largest to smallest:

| Bucket | Count | What it is | Where it goes |
|---|---:|---|---|
| こと + は | 267 | bare こと nominaliser + topic は | **Lesson 1 (こと)**, §1.1 |
| た/だ + ことは(ない/あった) | 17 | Book Two's ～たことがある, negated/emphasized with は instead of が | resurface `grammar.b2-ta-koto-ga-aru`, not new |
| unrelated noun + は (あとは, そとは, しごとは, 内緒ごとは — nouns that happen to end in と/ご+と) | 10 | false positives | excluded |
| unrelated verb + と + (something starting は) (もっとはやく, ぽんとはじいた, 彼とはぐれる, ひょうひょうとはぐらかされる) | 4 | false positives — different words, different と | excluded |
| とはいえ／とはいうものの／とは言っても | 12 | **Band 2's territory**, `grammar.b3-tohaie`, already taught | excluded, cross-referenced |
| adverb/volitional + と + は + negative predicate (もっとは, やすやすとは, しかとは, 判然とは, 二度とは, ようとは+しない/しなかった, とは言わない/言い難い/言われた) | 16 | compositional — と (already owned in other jobs) + は (emphatic topic) + an already-taught negative predicate | one-line recognition note, not core |
| relational/comparison とは (X と Y は…／Xとは違う／異なる／関係ない／対照的) | 37 | compositional と ("with/and," already owned since Book One) + は (topic/contrast) | one-line recognition note, not core |
| とはこのことだ／とはよく言ったものだ (proverb-citing idiom) | 8 | fixed frame for citing a saying | one-line recognition note |
| とは限らない ("not necessarily") | 12 | genuine, common, fixed idiom | recognition footnote, not primary teaching |
| **Core とは: defining a term + reacting with surprise** | **≈116** | the two jobs this lesson actually teaches | **Lesson 4** |

Two genuine jobs make up that core, and — matching how band 1 kept ため's two senses together and
band 7 kept ように's family together — they belong in one lesson, because とは always does the same
underlying thing: it sets X up as a topic and then says something definitive about it, whether that
is a dictionary-style definition or a reaction to a surprising fact.

- **Defining a term, "X とは, [explanation]":** [#74486] クエーサーとは、非常に遠方にある、まぶしい
  輝きを放つ天体だ ("quasars are brilliantly shining heavenly bodies that are extremely far away"),
  [#216374] ジェントルマンとは独立した財産のある人のことだ ("a gentleman is a man of independent
  means"), [#236156] 「文化相対主義」とはどういう意味ですか ("what does 'cultural relativism' mean"),
  [#214594] ストライキとは従業員の集団が一体となって就労を拒否することです ("a strike is a mass
  refusal to work by a body of employees" — also reuses lesson 1's こと nominaliser inside the
  definition, worth pointing out).
- **Exclamatory surprise, "[clause] とは, [reaction]!":** [#198179] バスに傘を忘れるとは彼女はそそっ
  かしい ("it was careless of her to leave her umbrella on the bus"), [#2280958] iPadアプリを作るの
  がこんなに大変だとは思ってもみなかった ("I never thought it'd be this hard to create an iPad app"),
  [#229538] あんな男に金を貸すとは、君はどうかしているよ ("lending money to a guy like that, you must
  be out of your mind").

**JMdict confirms every one of these buckets independently** (seq 2028950, headword none listed,
"exp, prt"): "indicates word or phrase being defined" (defining), "the fact that, to think that,
such a thing as" (exclamatory), "used for quoting (thoughts, speech, etc.)" (the と-quote overlap
that explains the relational bucket's kinship to Book Two chapter 7), "with" (the relational
bucket, directly), "(not) as much as, (not) so much as" (the adverb+とは+negative and とは限らない
families). Five dictionary senses, five buckets I found independently by hand-reading — the
strongest confirmation any pattern in this band got.

### 1.5 について — about it, and the 付く trap

Raw 180. Read in full. **8 false positives, all one collision:** に + 付いて／付いている (the verb
付く, "to attach, stick, arrive, follow, set out"), which is written in kana and produces the exact
substring について whenever it follows に. [#215782] シャツについている、べとべとしたものは何ですか
("what is that greasy stuff on your shirt" — attached), [#155840] 私は床についてからも… ("even
after I went to bed..." — 床につく, idiom, "to go to bed"), [#108591] 彼は帰国の途についている ("he
is homeward bound" — 途につく, idiom, "to set out"), [#163673] 私の後について各文を復唱しなさい
("repeat each sentence after me" — 付いて, "follow"), plus four more of the same shape. **172
genuine.** Representative: [#96491] 彼らは天気についておしゃべりした ("they chatted about the
weather"), [#114283] 彼はエレクトロニクスについて何も知らない ("he knows nothing about
electronics"), [#219941] これは、ある猫についての物語です ("this is a story about a cat" —
についての, attributive before a noun).

JMdict (seq 1009780, headword に就いて／に就て): "about, on, regarding, concerning" plus a minor
"per, for every" sense, not pursued here (thin, and not needed against the clean core).

### 1.6 に関して and における — two clean, thin, formal cousins, and a real ordering problem with band 10

**に関して: 28 raw, 28 genuine.** Every hit clean — no collision found. [#216718] サムは仕事に関して
まじめです ("Sam is serious about his work"), [#112406] 彼はその本に関していくつかの所見を述べた
("he made a few remarks on the book"). Built from 関する ("to concern, to be related," JMdict seq
1215790, not separately taught as vocabulary — folded into the pattern's own gloss, the same call
band 8 made for 必要).

**における: 25 raw, 25 genuine.** Also clean. [#235879] 建築におけるもっとも権威ある賞 ("architecture's
most prestigious award"), [#220542] この町における犯罪の発生率は高い ("the frequency of crime in
this town is high"). JMdict (seq 1009560, headword に於ける): a single sense, "in, at, on, as for,
regarding, with regards to."

Both are thin by this band's own standards (28 and 25, against こと's 481 and という's 423), but
both clear this book's established floor by a wide margin — band 1 kept からには at 3, band 8 kept
ざるを得ない at 3. Band 6's own precedent (`book-three-band-08.md` §6.5 citing it) is to keep two
similarly thin, distinct patterns *separate* rather than merge them once each is confirmed clean —
に比べて (5) and 反面 (4) both shipped as their own lessons rather than being folded together. That
precedent argues directly against merging に関して and における here, where the material is
considerably richer than either of band 6's examples; see §6.3.

**A genuine cross-band ordering problem, found while checking における against its own family.**
`book-three-band-10.md` (band 10, drafted in parallel, orders 274–281 — *after* this band's
266–273) teaches において as its own lesson 4 (47 genuine hits, three jobs: locative "in/at,"
domain/respect "in terms of," the fixed idiom 責任において) and names における as "において's own
noun-modifying twin... assigned to band 9." Its own authoring checklist then instructs: **"re-surface
`grammar.b3-ni-oite` in the SRS queue before における's own lesson."**

That instruction has the sequencing backwards. Band 10 comes *after* this band in the book —
において (order 277) is taught roughly five lessons after における would be (order ~272). A learner
cannot have `grammar.b3-ni-oite` "fresh in the SRS queue" before a lesson that comes first. Band
10's own document elsewhere states it knows this ("directly after band 9's assumed close at 273"),
which makes the instruction not a wrong assumption about the ladder but a direction error inside a
correct one. **The fix: reverse it.** における is taught here, self-contained, on its own 25
genuine citations, with no dependency on において. It is band 10's *own* において lesson that should
resurface `grammar.b3-niokeru` (this band's id) before *its* lesson, the same "resurface for
contrast" move band 7 made for ために before ように. This is flagged for whoever authors band 10 in
§8, and it is the reason this band's における lesson is written below with **no** hard dependency on
band 10 material.

---

## 2. Naming and ids

Following `book-three-band-07.md` §2 and `book-three-band-08.md` §2's convention (id keeps the
band's own number, independent of position once the passive band and bands 1–8 are counted):

| Thing | Value |
|---|---|
| Chapter (band) id | `b3.chapter-9` — **its position in the book is chapter 10**, not 9 (passive=1, band1=2, band2=3, band3=4, band4=5, band5=6, band6=7, band7=8, band8=9, band9=10) — the same discrepancy every sibling band since band 6 has already named and explained for its own band |
| Chapter title (internal/planning) | Nominalisation and reference |
| Lesson `situation` (learner-facing) | **What you mean, exactly** |
| Lesson ids | `b3.koto`, `b3.tokoro`, `b3.toiu`, `b3.towa`, `b3.nitsuite`, `b3.nikanshite`, `b3.niokeru` |
| Checkpoint id | `b3.checkpoint-9`, `situation: Integration & checkpoint` |
| Pattern ids | `grammar.b3-koto`, `grammar.b3-tokoro`, `grammar.b3-toiu`, `grammar.b3-towa`, `grammar.b3-nitsuite`, `grammar.b3-nikanshite`, `grammar.b3-niokeru` |
| Lessons/grammar/phrases file stem | `b3-09-nominalisation-and-reference.yaml` |

**On global `order`.** The brief assigns **266–273**, an 8-slot range, following directly after
band 8's 260–265 (which returned its own last slot, 266, unused). This band's shape spends the
full range: 7 teaching lessons at 266–272, checkpoint at 273. Nothing is returned. Band 10 is
being planned in parallel from a fixed 274, so spending the full range here creates no collision.

---

## 3. The chapter header comment

Paste this at the top of `src/content/lessons/b3-09-nominalisation-and-reference.yaml`.

```yaml
# Band 9 -- What you mean, exactly.
#
# Two things this band does, in order. The first two lessons turn a whole
# sentence into a single noun -- こと turns an action or a fact into "the
# thing," ところ turns a moment into "the point you're at." You already
# half-own the first word: Book Two taught you こと as the noun inside
# ~たことがある and ~ことができる, and told you outright that it "turns a
# whole action into a noun." What it never let you do is put that noun
# anywhere except in front of ある or できる. This band is where こと stops
# being a fixed phrase and starts being a tool -- the same move band 7 made
# for その word's cousins, ことにする and ことになる, which this band does
# not reopen.
#
# The next two lessons name and define things. という gives something its
# name -- a person, a rumor, a word, a claim -- and it is not the と+言う
# you already know from Book Two's reported-speech chapter. That one always
# closes a sentence, reporting what was said; という sits in the middle of
# one, saying what something is called. とは goes one step further and asks
# what a name actually means, either as a real definition or as a reaction
# to something surprising enough to comment on. Both words are wildly
# common in real writing, and both hide behind a raw search that is almost
# entirely made of something else -- とは in particular is mostly bare こと
# with は tacked on, which this band already has a lesson for by the time
# you reach it.
#
# The last three lessons all mean roughly "about" or "in," at three
# different registers, from the one you'd use with a friend to the one
# you'd use in a report. について is the everyday one. に関して is its
# formal cousin, the one you reach for in writing rather than speech.
# における is different in kind, not just in register -- it doesn't mark a
# topic of conversation, it modifies a noun directly, the way "in" does in
# "the best restaurant in Tokyo" rather than in "let's talk about Tokyo."
#
#    1  こと      turning what you do into a thing
#    2  ところ    right about now -- about to, mid-way, just done
#    3  という    what it's called
#    4  とは      what that word actually means
#    5  について  talking about it
#    6  に関して  the same thing, in writing
#    7  における  "in," when it's describing a noun instead of a sentence
#
# No lesson in this band depends on another's form -- each attaches to
# plain-form material Book Two already built -- but lessons 3 and 4 are
# taught as a deliberate pair (both name/define something), and lessons 5
# and 6 are taught as a deliberate pair (the same job, two registers). The
# checkpoint closes the band rather than splitting it (DR-021).
#
# content-source: every phrase in this file is a verified Tatoeba pair,
#   cited by id in the grammarNote and in the phrase's own tatoebaId field.
#   No training-canonical sentence is used anywhere in this band
#   (04-stage-reading.md §8).
```

---

## 4. The lessons

### Lesson 1 — Anything can be a thing (order 266)

- **Title:** Anything can be a thing
- **Can-do:** Turn what you do, think, or feel into a noun you can be the subject or object of
  another sentence
- **Pattern id:** `grammar.b3-koto`, `pattern: "～こと"`
- **Teaches:** [plain non-past clause] + こと, which turns the whole clause into a noun that then
  takes が (subject of a new predicate — 見ることが好き, "watching is [something I] like"), を
  (object — 決めることを禁じる, "forbids deciding"), or は (topic — 彼の言うことは正しい, "what he
  says is correct"). Open by naming what the learner already has: Book Two's own gloss for
  `vocab.koto` already says こと "turns a whole action into a noun" — this lesson is that promise,
  cashed. Attachment for a noun/な-adjective goes through である first (彼は理想的な夫であることが
  分かった, "he found out he was an ideal husband"), the same slot `grammar.b3-beki` (band 8)
  already established; an い-adjective needs nothing extra. **A second, sharper point, worth its
  own line:** this is the same three characters as `grammar.b2-ta-koto-ga-aru`, but non-past
  + ことがある is *not* "have done before" — it is either a generic tendency ([#170281]
  細菌が病気を引き起こすことがある, "germs can cause sickness") or "there's something that..."
  ([#142069] 折り入って頼みたいことがある, "there's something I'd like to ask you as a special
  favor"). Same phrase, different tense on the clause in front, a different claim entirely.
- **Attestation:** 481 genuine across が (84) / を (130) / は (267), plus 24 more for the
  ことがある tense-trap — 505 total, the richest single pool this book has produced (§1.1). とは's
  own raw ceiling (§1.4) is dominated by 267 of these ことは sentences; nothing about that number
  is wasted, it simply belongs here.
- **Depends on:** `grammar.b2-plain-dictionary`, `grammar.b2-plain-da` (for である attachment).
  Cross-referenced, not hard prerequisites: `grammar.b2-ta-koto-ga-aru`, `grammar.b2-koto-dekiru`
  (the two fixed phrases built on the same word, resurfaced for direct contrast), `grammar.b3-koto-ni-naru`
  (band 7, resurfaced lightly — "you've already used this word to close two other patterns").
- **Exercises (earlier books):** `grammar.b2-ta-koto-ga-aru`, `grammar.b2-koto-dekiru` resurfaced
  deliberately, as the direct contrast the lesson's spine depends on.
- **Exercises (this band):** none — opening lesson.
- **New vocabulary:** none — `vocab.koto` already exists (Book Two chapter 1). **New kanji:** none.
- **Reading-library slice:** at least one text should carry non-past ことがある in its generic-
  tendency sense alongside an already-familiar たことがある sentence, so the tense contrast is
  reinforced on real material rather than only asserted in the grammarNote.

### Lesson 2 — Right about now (order 267)

- **Title:** Right about now
- **Can-do:** Say you're about to do something, right in the middle of it, or just finished — no
  clock required
- **Pattern id:** `grammar.b3-tokoro`, `pattern: "～ところ"`
- **Teaches:** [plain clause] + ところ(だ), in its aspectual triad: **dictionary form + ところだ**,
  "about to" ([#157888] 私は角にある劇場に行くところです, "I am going to the theater on the corner")
  or, in the past, a near-miss that didn't happen ([#161315] うっかりそれを忘れるところだったわ,
  "I almost forgot"; [#227385] お菓子で赤ちゃんが窒息するところだった, "the baby almost choked on a
  piece of candy"); **ている + ところだ**, "in the middle of" ([#91414] メーキャップを落としている
  ところですよ, "she's cleaning off the make-up"; also as an object with を before a "catch" verb —
  [#225632] クモが巣を張るところを見たことがありますか, "have you ever seen a spider spinning its
  web," a nice callback to lesson 1's neighbour `grammar.b2-ta-koto-ga-aru`); **た + ところだ**,
  "just did" ([#160570] スーパーマーケットへ行ってきたところです, "I have just been to the
  supermarket"; [#194804] メアリーはただいま戻ったところです, "Mary has just come home"). Open by
  naming that ところ itself is a new word — it has never been taught, though the kanji 所 is
  already known from `vocab.daidokoro` (台所). **One well-developed recognition footnote, not
  taught for production:** ところ also opens a sentence to mean "by the way" (ところで) or "however"
  (ところが), and Vたところで means "even if" while Vたところ、 means "and then, as it turned out" —
  real, common in reading, and a different grammatical category (a connective, not a noun); a
  learner who meets these should recognise the family without being tested on producing it. Flag
  ふところ (懐, "purse/bosom") and ひところ (一頃, "once, at one time") as unrelated words that
  merely contain the same three characters.
- **Attestation:** 220 raw; the aspectual triad this lesson teaches is 43 genuine (17 about-to/
  near-miss, 13 mid-doing, 13 just-did); the discourse-connective family flagged above is a
  further ~40+, cited but not drilled (§1.2, §6.2).
- **Depends on:** `grammar.b2-plain-dictionary`, `grammar.b2-plain-ta`, `grammar.n5-te-imasu`
  (the three verb forms the triad is built on).
- **Exercises (earlier books):** `grammar.n5-te-imasu` resurfaced for the mid-doing job.
- **Exercises (this band):** `grammar.b3-koto` — light cross-reference only ("こと turns an action
  into a thing; ところ turns a moment into a point in time"), not a hard dependency.
- **New vocabulary:** **1** — ところ itself, glossed "place; point (in time, or in the middle of
  doing something)," the same double life `vocab.koto` already has. **New kanji:** none — the
  aspectual grammar is written in kana in this corpus without exception; 所 is available if a
  concrete "place" citation is ever wanted, and is already known.
- **Reading-library slice:** essential — 43 sentences across three jobs is not a deep bank, and this
  is the pattern in this band most exposed to "taught once, never seen again." Prioritise sourcing
  further ところ material, the same flag band 7 raised for まい.

### Lesson 3 — What it's called (order 268)

- **Title:** What it's called
- **Can-do:** Give something its name, and say what a rumor, a claim, or a fact actually was
- **Pattern id:** `grammar.b3-toiu`, `pattern: "～という"`
- **Teaches:** N という N2, "an N called/named N2" — [#170949] 佐藤さんという方があなたの留守中に
  お見えになりました ("a person named Sato came to visit while you were out"), [#236464]
  「バイオテクノロジー」という言葉が普通に使われるようになったのは、いつ頃ですか ("when did the word
  'biotechnology' come into common use"). The same word closes a clause into an appositive, "the
  fact/claim/rumor that S" — [#215508] ジョンソンがトレードされるという噂がある ("there's a rumor
  Johnson is going to be traded"); and, sentence-final, reports hearsay — [#219760] この本によれば、
  最初の人工橋梁は新石器時代にさかのぼるという ("this book says the earliest man-made bridges date
  back to the New Stone Age"), often closed with ということだ ([#123238] 内閣は倒れるだろうという
  ことだ, "they say the cabinet will fall"). **The lesson's spine is the boundary against
  `grammar.b2-quote-plain`/`grammar.b2-quote-da` (Book Two chapter 7), named directly:** と + 言う
  always closes a full sentence, reporting an utterance with a tensed verb of saying at the very
  end (明日行くと言いました); という never does that — it sits inside a sentence, naming what
  something is called, or closes it as a fixed tag, never as the chapter 7 shape. **Worth one line,
  not a re-teach:** というのは ("that is to say," [#77794] 倫理学というのは、行動の規範を意味する,
  "ethics means the rules of conduct") comes close enough to lesson 4's とは that the two should be
  named side by side rather than left to collide silently. Also worth naming for reading fluency:
  何百／何千という ("hundreds/thousands of," [#187315] 何百というバッファローが湖のほうへ移動した),
  というか ("or rather"), and the fixed idiom あっという間に ("in the blink of an eye," [#182679]
  休暇はあっという間に終わった).
- **Attestation:** 423 raw, effectively all genuine — no lexical contamination found across
  extensive hand-reading of every job (§1.3), the second pattern in this book (after ように, band 7)
  to clear its full raw ceiling nearly untouched.
- **Depends on:** `grammar.b2-plain-dictionary`, `grammar.b2-plain-da`. **`grammar.b2-quote-plain`
  and `grammar.b2-quote-da` (Book Two chapter 7), directly and by name — resurface both in the SRS
  queue before this lesson, since the grammarNote opens by contrasting against them.**
- **Exercises (earlier books):** `grammar.b2-quote-plain`, `grammar.b2-quote-da` resurfaced
  deliberately, as the direct contrast the lesson's spine depends on.
- **Exercises (this band):** none yet — lesson 4 depends on this one, not the reverse.
- **New vocabulary:** none — built from と (owned) + いう, the dictionary form of `vocab.iu` (owned
  since Book Two chapter 7). **New kanji:** none — always written in kana in this job.
- **Reading-library slice:** at least one text should carry the naming job (Nという N2) next to a
  chapter-7-shaped と + 言った sentence, so the boundary the lesson teaches is reinforced on real
  material rather than only asserted.

### Lesson 4 — What that word means (order 269)

- **Title:** What that word means
- **Can-do:** Define a term the way a dictionary would, or react to something surprising enough to
  comment on
- **Pattern id:** `grammar.b3-towa`, `pattern: "～とは"`
- **Teaches:** N とは、[explanation] — defining a term, the way an encyclopedia entry or a
  glossary opens: [#74486] クエーサーとは、非常に遠方にある、まぶしい輝きを放つ天体だ ("quasars are
  brilliantly shining heavenly bodies that are extremely far away"), [#216374] ジェントルマンとは
  独立した財産のある人のことだ ("a gentleman is a man of independent means" — reuses lesson 1's
  こと inside its own definition, worth pointing out), [#236156] 「文化相対主義」とはどういう意味です
  か ("what does 'cultural relativism' mean" — the question form). The same word, attached to a
  full clause instead of a bare noun, reacts to something surprising: [#198179] バスに傘を忘れると
  は彼女はそそっかしい ("it was careless of her to leave her umbrella on the bus"), [#2280958]
  iPadアプリを作るのがこんなに大変だとは思ってもみなかった ("I never thought it'd be this hard to
  create an iPad app"). **The lesson's first and sharpest job is a boundary, not new material:**
  267 of とは's own 499 raw hits are bare こと (lesson 1) plus は — ことは is not this pattern,
  full stop, and the grammarNote should say so before a single new example. **The second boundary:**
  `grammar.b3-tohaie` (とはいえ, band 2) is a different word — a concessive "although," not this
  lesson's defining/reacting job — resurface it briefly as "you've met a cousin of this already,
  and it means something else." **One line, not a lesson:** とは限らない, "not necessarily" —
  [#191137] 偉人が必ずしも賢いとは限らない ("great men are not always wise") — genuine, common,
  fixed, worth recognising on sight.
- **Attestation:** 499 raw; the two core jobs this lesson teaches total **≈116 genuine** once the
  ことは (267), band-2 とはいえ overlap (12), Book Two's たことは(ない) callback (17), and several
  smaller compositional buckets are set aside (§1.4's full table). 116 is comfortably above this
  book's kept-thin floor and confirmed by JMdict's own five-sense entry (seq 2028950) matching
  every bucket found by hand.
- **Depends on:** lesson 1 (`grammar.b3-koto`), directly, for the ことは boundary. Lesson 3
  (`grammar.b3-toiu`), for the というのは near-synonym. `grammar.b3-tohaie` (band 2), resurfaced as
  the exclusion boundary.
- **Exercises (earlier books):** `grammar.b3-tohaie` (band 2) resurfaced deliberately.
- **Exercises (this band):** `grammar.b3-koto`, `grammar.b3-toiu` — both boundaries are the
  lesson's actual content, not incidental review.
- **New vocabulary:** none — built entirely from と and は, both owned since Book One. **New
  kanji:** none.
- **Reading-library slice:** a text carrying a defining-とは sentence next to an ordinary ことは
  sentence (lesson 1's shape) is the single most useful pairing this band's library can supply,
  given how directly the raw ceilings collide.

### Lesson 5 — Talking about it (order 270)

- **Title:** Talking about it
- **Can-do:** Say what you're talking, thinking, reading, or asking about
- **Pattern id:** `grammar.b3-nitsuite`, `pattern: "～について"`
- **Teaches:** [noun] + について, "about, concerning" — [#96491] 彼らは天気についておしゃべりした
  ("they chatted about the weather"), [#114283] 彼はエレクトロニクスについて何も知らない ("he knows
  nothing about electronics"), and its attributive form についての directly before a noun —
  [#219941] これは、ある猫についての物語です ("this is a story about a cat"). **Flag the trap before
  a single example is sourced:** about 4% of the raw hits are the ordinary verb 付く ("to attach,
  stick, follow, set out on a journey") in its て-form after に, spelled identically once written in
  kana — [#215782] シャツについている、べとべとしたものは何ですか ("what is that greasy stuff on your
  shirt"), [#108591] 彼は帰国の途についている ("he is homeward bound," 途につく, an idiom). None of
  these are this lesson's grammar.
- **Attestation:** 180 raw, **172 genuine**, 8 false positives all one collision (§1.5).
- **Depends on:** basic に (Book One, already owned) as the particle this pattern is built from; no
  hard dependency within Book Two or this book.
- **Exercises (earlier books):** none new.
- **Exercises (this band):** none yet — lesson 6 depends on this one, not the reverse.
- **New vocabulary:** none. **New kanji:** none — always kana in this job.
- **Reading-library slice:** curate against 付く/付いている in any automatic tagging (§1.5) — the
  single highest-volume curation risk in this band after とは's own contamination.

### Lesson 6 — On the subject of (order 271)

- **Title:** On the subject of
- **Can-do:** Mark a topic in writing or formal speech, the way について does in conversation
- **Pattern id:** `grammar.b3-nikanshite`, `pattern: "～に関して"`
- **Teaches:** [noun] + に関して, "regarding, concerning" — に関しては (topic-marked) and に関しても
  both attested and natural. [#216718] サムは仕事に関してまじめです ("Sam is serious about his
  work"), [#112406] 彼はその本に関していくつかの所見を述べた ("he made a few remarks on the book").
  Built from 関する ("to concern, to relate"), taught here as part of the pattern's own gloss rather
  than as a separate vocabulary card, the same call band 8 made for 必要 — 関する has no independent
  life outside this construction and its attributive twin に関する that a beginner is likely to
  meet. **Register, named directly against lesson 5:** について is what a learner already has for
  ordinary speech and writing; に関して is what the same idea looks like in a report, a formal
  letter, or a news article. Reach for について by default; に関して is what to *recognise*, not
  necessarily reach for, until formal writing is the actual task.
- **Attestation:** 28 raw, 28 genuine — clean, no contamination found (§1.6).
- **Depends on:** lesson 5, directly — the register contrast is the lesson's whole content.
- **Exercises (earlier books):** none new.
- **Exercises (this band):** `grammar.b3-nitsuite` — the direct register comparison is the lesson's
  spine.
- **New vocabulary:** none (関する folded into the pattern's gloss, not shipped as a card). **New
  kanji: 関** — confirmed absent from the manifest's kanji set; every genuine hit writes it in
  kanji, no honest kana-only fallback the way this book's earlier bands sometimes had.
- **Reading-library slice:** a text pairing について and に関して on the same or a closely related
  topic would show the register contrast on real material rather than only asserted.

### Lesson 7 — In, before a noun (order 272)

- **Title:** In, before a noun
- **Can-do:** Say where, or in what respect, something is true — when it describes a noun rather
  than a whole clause
- **Pattern id:** `grammar.b3-niokeru`, `pattern: "～における"`
- **Teaches:** [noun A] + における + [noun B], "B, in the context of A" — modifying a following
  noun directly, unlike about/regarding's job of marking a topic of discussion. [#235879] １９９５
  年、安藤氏は建築におけるもっとも権威ある賞を受賞した ("in 1995, Andou received architecture's most
  prestigious award" — 建築における賞, "an award in [the field of] architecture," a noun phrase, not
  a full clause about architecture), [#220542] この町における犯罪の発生率は高い ("the frequency of
  crime in this town is high"), [#233151] あなたの人間関係における最も大きな危険の一つは自己中心的に
  なることです ("one of the greatest dangers in your human relations is self-centeredness"). This
  lesson is self-contained and does **not** depend on band 10's において, despite the two words
  sharing an origin — see §1.6 for why the reverse dependency band 10's own document proposed has
  the book's actual order backwards. A learner who later meets において (band 10, formal locative
  "in/at" and "in terms of," attaching to a whole clause rather than modifying a noun) should
  recognise it as this word's cousin, not the other way around.
- **Attestation:** 25 raw, 25 genuine — clean, no contamination found (§1.6).
- **Depends on:** basic locative に (Book One, already owned) as the register this word replaces in
  formal, written contexts. No dependency within this band or on band 10.
- **Exercises (earlier books):** none new.
- **Exercises (this band):** `grammar.b3-nikanshite`, light cross-reference only (same register
  family), not a hard dependency — における modifies a noun, に関して marks a topic, and the two
  should not be presented as interchangeable.
- **New vocabulary:** none. **New kanji:** none — always written in kana in this job (於, the
  archaic kanji behind おける, does not surface in modern usage and is not taught).
- **Reading-library slice:** a text using における directly before a noun, ideally alongside an
  ordinary locative に sentence, so the "modifies a noun, not a clause" distinction is visible on
  real material.

### Lesson 8 — Band 9 checkpoint (order 273)

- **Id:** `b3.checkpoint-9`. `checkpoint: recognition`, `wordIds: []`, `phraseIds: []`, `kanji: []`,
  no `patternId` — same shape as every prior band's checkpoint.
- **Can-do:** Recognise everything this band taught, tell こと's job apart from とは's on sight, and
  read the gate text (§7).
- **The shrinking set.** こと (505 genuine across its two jobs) and という (423) both have deep
  margin to hold back recognition items never seen in teaching. とは's own core (116) and について
  (172) are comfortable. に関して (28), における (25) and ところ's aspectual triad (43) have real
  but thinner margin — enough to hold back 3–5 items each, distinct from their teaching sets,
  without falling into this book's "reuse the teaching sentence" fallback the way band 7's まishest
  patterns did.
- **What the checkpoint should test that no single lesson can:** the こと／とは boundary (§1.4,
  lesson 4) is this band's sharpest single point — a checkpoint item that gives an ordinary ことは
  sentence and asks whether it is "defining a term" or "just こと plus は" tests real understanding
  in a way an isolated gloss cannot. A second worthwhile item type: について vs に関して vs における,
  given a short passage, asking which register or grammatical slot fits — the same "family
  boundary, not isolated gloss" test band 5's checkpoint pioneered for はず/わけ/かもしれない.
- **とは限らない, とはこのことだ, and ところ's discourse-connective family (ところで／ところが／
  Vたところで／Vたところ) are not tested** — each is a recognition-only footnote inside a lesson,
  not a taught pattern in the DR-020 sense, and testing any of them would misrepresent a citation as
  mastered material.
- **Placement:** at the band boundary (DR-021). No lesson in this band gates another's *form*
  except lessons 3–4's shared dependence on lesson 1 and each other (§4's header comment), so there
  is no earlier point the checkpoint could sensibly move to.

---

## 5. Totals

| | Count | Note |
|---|---|---|
| Teaching lessons | 7 | six of the brief's named patterns (ところ, という, とは, に関して, について, における) plus こと, narrowed and confirmed genuinely new per the brief's own instruction — の deliberately excluded, see §6.1 |
| Checkpoints | 1 | band boundary (DR-021) |
| New words | **1** | ところ (§1.2, §5) — every other pattern attaches to already-owned material or is built from already-owned particles |
| New kanji | **1** | 関, from に関して (§1.6) — every other lesson in the band is kana-only in ordinary use |
| New grammar patterns | 7 | one per teaching lesson |
| New phrases (estimate) | **~38–45** | lesson 1 (richest, three jobs plus the tense trap) ~8–9; lesson 2 ~6–7; lesson 3 (rich, five jobs) ~7–8; lesson 4 (two jobs, one hard boundary) ~5–6; lesson 5 ~4–5; lesson 6 ~3–4; lesson 7 ~3–4 |
| Genuine attested example sentences | 505 (こと) + 43 (ところ core, +~40 footnote) + 423 (という) + 116 (とは core) + 172 (について) + 28 (に関して) + 25 (における) = **1,312 genuine, over 1,600 raw** | by a wide margin the richest attestation pool of any band in this book so far — see §1 throughout |
| Global order | **266–273** | the full assigned range, spent in full (§2) — the first band since band 5 not to return a slot |

---

## 6. Judgment calls — where I think the plan needs a decision, or is silent

### 6.1 の is named in the skeleton's own band-9 row and is deliberately left out of this band

`book-three-bands.md` §3's table lists band 9's patterns as "こと / の / ところ / 〜という / 〜とは
/ 〜に関して / 〜について / 〜における" — の is there. The commissioning brief for this document
names six patterns explicitly and discusses こと's narrowing at length, but never mentions の, and
gives no ceiling for it in §3b's table alongside こと/ところ/という/とは/に関して/について/における.
I take that omission as deliberate scoping, and I agree with it on the merits, not just on
deference: の is the single most frequent word in the corpus by a wide margin — a raw substring
search would return a number close to "most of the 25,983 sentences," which is not a ceiling, it is
a statement that the search does not work for this word the same way it fails for こと (also
excluded from §3b's ceiling table, for the same reason). の's own grammar is a large, genuinely
separate topic — a productive clause-nominaliser competing directly with こと (見るのが好き vs
見ることが好き, with real, textbook-standard restrictions on which verbs prefer which), plus a
question-final particle, plus the seed of んです/んだ (which this ladder also does not teach
anywhere, checked directly — see below), plus a "one"-substitution use (赤いの, "the red one").
Folding all of that into a band that already carries こと, ところ, という, とは and three
regarding/in markers would either blow this band's size well past a defended 7–8 or force の's own
real content down to a single under-taught line, neither of which serves the learner. **の, and the
こと-vs-の boundary specifically, is real, valuable, out of scope here, and worth its own future
pass** — the same shape of finding band 7 made for the plain volitional and band 5 made for
だろう/でしょう/そう: a genuine gap, correctly not this band's to close.

**A related gap, checked while I was there and not this band's to fix either:** んです/んだ (the
explanatory extension built on の) is taught nowhere in Books One or Two — checked directly against
every grammar file, string not found. It is closely related to の's own gap above and should be
swept for alongside it whenever that future pass happens, not folded in here.

### 6.2 ところ ships as one lesson, not two, despite a discourse-connective family nearly as large as its taught core

The aspectual triad (43 genuine) and the ところで/ところが/Vたところで/Vたところ family (~40+
genuine, not exhaustively counted the way the smaller patterns in this band were, given the
recognition-only decision made before counting it precisely) are close enough in raw size that
splitting ところ into two lessons, the way band 7 split ように into three once the order budget had
slack, is a real option I considered. I did not take it, for a reason specific to this band's
budget rather than to ところ's own richness: **this band's seven patterns already spend the full
assigned range with nothing returned** (§2). Splitting ところ would require either exceeding
266–273 — not available, since band 10 is fixed at a parallel-drafted 274 — or cutting one of this
band's other seven patterns to make room, and none of the other six is a defensible cut: に関して
and における are both clean and thin exactly the way band 6's kept-separate に比べて/反面 were, とは
and という are two of the richest patterns in the book, について is clean at 172, and こと is the
richest pool this book has produced. There is no thin lesson here to sacrifice the way band 7 found
slack from べく/ことにする/ために dying to attestation. Given that constraint, folding the discourse
family into lesson 2 as a well-developed recognition footnote — matching exactly how band 7 lesson
1 folded べく and ように's "like, as" job into one lesson without becoming their own — is the
honest shape, not a corner cut.

### 6.3 に関して and における stay separate lessons, not merged into one "the formal ones"

Both are thin relative to this band's other five patterns (28 and 25 against こと's 505 and とは's
116), and both are clean. I considered a single combined lesson — "two formal ways to say 'about/
in'" — given how band 7 folded ようになる and ようにする's shared base into adjacent lessons. I
decided against it, on the strength of a direct precedent from the sibling immediately before this
one: `book-three-band-08.md` §6.5 (citing band 6) kept に比べて (5 genuine) and 反面 (4 genuine) —
both thinner than either of my two patterns — as **separate** lessons once each cleared
hand-classification, reasoning that a low ceiling means "look carefully," not "expect a merge."
Applying that same standard here: に関して and における do genuinely different jobs (one marks a
topic before a verb clause; one modifies a following noun directly, and cannot be swapped for the
other without producing an ungrammatical sentence), and at 25–28 genuine hits each, both clear this
book's kept-thin floor by nearly an order of magnitude. Merging them would save one order slot this
band does not need to save (§2), at the cost of blurring a real syntactic distinction the learner
will need in order to read either one correctly.

### 6.4 ことだ ("you should...") is named by JMdict inside こと's own entry, and is left out anyway

こと's JMdict entry (seq 1313580, §1.1) lists "you should..., I advise that you..., it's important
to..." as one of its own senses — the grammarian's ことだ, roughly 98 raw hits found while sweeping
for lesson 1's material. I considered folding a line of it into lesson 1 the way lesson 3 folds in
というのは and 何百という as one-line asides. I did not, for a reason of kind rather than of
richness: ことだ is advice/obligation ("you should do X"), which is band 8's territory (べき,
なければならない, 必要がある) by function, not this band's (turning a clause into a noun that can be
a subject, object or topic). Citing it here risks exactly the confusion band 8 built lesson 4
around avoiding for てはならない/なくてはならない — two things that look related because they share
a word, presented as though they were the same idea. ことだ is real, common, and worth a future
band or revision's attention; it is not this lesson's job to half-teach it as a footnote.

### 6.5 The band's near-zero vocabulary and near-zero kanji are the honest consequence of a mining-stage band, not an oversight

This band ships 1 new word and 1 new kanji across seven lessons and roughly 1,300 genuine attested
sentences — a vocabulary rate far below even Book Two's lightest rule chapters (`book-two-chapter-01.md`
shipped ~12 words over 10 lessons). That is correct, not thin: `04-stage-reading.md` §3 states
vocabulary at this stage arrives by mining, not by lessons, and every one of this band's seven
patterns is either a particle combination (という, とは, について, に関して, における, all built
from already-owned words) or a word Book Two already taught for a narrower job (こと). ところ is
the single exception, and it earns its one word honestly — no existing vocabulary card covers it,
and the aspectual grammar cannot be taught without naming the word it is built on.

---

## 7. The gate text (band close)

Per `04-stage-reading.md` §3 and matching every sibling band's equivalent section: **specify what it
must contain, not which text it is** — the text-source decision (`book-three-bands.md` §2) is still
open and this band's design does not depend on which way it resolves.

- **It must be unreadable without this band, and specifically without the こと／とは boundary.** At
  least one sentence's claim should turn on correctly reading a bare-こと clause as a subject,
  object or topic (not just glossing こと as "thing"), and at least one should turn on recognising a
  defining or exclamatory とは rather than misreading it as ordinary こと+は or as chapter 7's
  と+言う. A reader who cannot tell these apart should visibly fail to extract the passage's actual
  claim, not just read more slowly.
- **It should draw on at least four of this band's seven `grammarIds`**, given how deep the pool is
  (§5) — a considerably higher bar than bands 7 or 8 could realistically set, and a fair one here.
  こと and という should both be expected to appear naturally in any passage of reasonable length at
  this level, given their raw richness; に関して, における and ところ's aspectual triad should not
  all be required in the same short passage, the same restraint every sibling band's gate-text
  section already holds itself to for its own thinnest patterns.
- **Vocabulary coverage at or above the flow line (~98%, `04-stage-reading.md` §5)** once Books
  One–Two and this band's own material (plus ところ, the one new word) are in the known set.
- **Curated by a human for the とは／ことは collision specifically, not accepted from automatic
  tagging alone** (§1.4) — a gate-text candidate auto-tagged `grammar.b3-towa` needs a person to
  confirm it is not actually bare こと+は before it ships, the single highest-volume curation risk
  in this band given that 267 of とは's 499 raw hits are exactly that collision.
- **If the interim text source is the clustered-sentence stopgap**
  (`data/reading/micro-readings.json`'s model), the checkpoint's own copy must say so rather than
  present it as a story — the same restraint every sibling band's gate-text section already holds
  itself to.
- **No score, no pass mark.** Consistent with DR-020: presented once the shrinking recognition set
  empties, framed as "you can read this now," never as a test the learner can fail.
- **The schema gap is inherited, not new.** `src/content/lessons/schema.ts` has no field for a
  reading passage at all, first found by `book-three-band-03.md` §3 lesson 7 and confirmed again by
  every sibling band since. Not re-solved here — recorded, per that shared finding, as one gap
  shared across every band's checkpoint.

---

## 8. Authoring checklist

1. **Every phrase's source is a real Tatoeba id**, cited in the commit message per CLAUDE.md, and in
   the `Phrase.tatoebaId` field.
2. **Write every `pattern:` field as a bare Japanese literal** (no Latin characters —
   `grammarSurface` in `scripts/levelling.mjs` rejects any pattern string containing one): `～こと`,
   `～ところ`, `～という`, `～とは`, `～について`, `～に関して`, `～における`. All seven clear the
   two-character minimum after splitting on ～.
3. **Do not source lesson 1's core teaching examples from ことができる or ことがある in the
   already-taught (past-tense) sense** — both belong to `grammar.b2-koto-dekiru`/`grammar.b2-ta-koto-ga-aru`,
   already taught, and citing them here would misrepresent owned material as new.
4. **Do not source lesson 4's teaching examples from anything preceded by こと** — a plain
   literal-substring search on とは will return 267 ことは sentences that belong to lesson 1, not
   lesson 4 (§1.1, §1.4). Check the two characters immediately before every とは hit by hand.
5. **Do not source lesson 5's teaching examples from anything that is 付く's て-form** —
   について⊃付いて/ついている is this band's second-sharpest curation trap (§1.5).
6. **Do not source lesson 2's core examples from ふところ or ひところ** — both are unrelated words
   that happen to contain the substring ところ (§1.2).
7. **Re-surface `grammar.b2-quote-plain`/`grammar.b2-quote-da` before lesson 3**, and
   `grammar.b2-ta-koto-ga-aru`/`grammar.b2-koto-dekiru` before lesson 1 — both callbacks are the
   lessons' actual spine, and only land if the prerequisite is fresh.
8. **Commit messages** on every content commit must name the source, or the commit is rejected
   (CLAUDE.md).
9. **Run `pnpm walkthrough`** before merge, signed in — as a guest run it will not reach Book Three
   at all (`TIER_BOOK_LIMIT`).
10. **Run `pnpm ladder`** once this content lands, regenerating the book's ladder doc — `pnpm test`
    fails on a stale one.
11. **Flag for whoever authors band 10:** its own document instructs this band to resurface
    `grammar.b3-ni-oite` before における's lesson (`book-three-band-10.md` §4 lesson 4, §11). That
    instruction has the book's actual order backwards — band 10 (274–281) comes *after* this band
    (266–273). **Reverse it:** band 10's において lesson should resurface `grammar.b3-niokeru` (this
    band's id) before its own lesson, not the other way around. This band's における lesson (§4,
    lesson 7) is written with no dependency on band 10 material specifically because of this.
12. **The text-source decision** (`book-three-bands.md` §2) blocks the reading-library slice and the
    gate text, not the seven teaching lessons — those can be authored and shipped from the attested
    sentences in §1 alone, same as every band in this book so far.
