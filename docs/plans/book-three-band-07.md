# Book Three, Band 7 — Purpose and intent

**Status: design, not content.** This document specifies every lesson in the band in enough
detail that authoring the YAML is mechanical. **No Japanese sentence is composed here.** Every
example sentence named below is a real Tatoeba pair, cited by id, pulled from
`server/data/jmdict-examples-eng-3.6.2.json` — never invented, per `04-stage-reading.md` §8.

Source brief: `docs/plans/book-three-bands.md` §3 (band 7's row), §3b (raw attestation ceilings,
re-derived below, not trusted), §3c (the だろう/でしょう/そう gap — checked, not this band's to
fix, see §6.4), §4 (what a band breakdown must add). Background: `docs/plans/04-stage-reading.md`
§3 (the band model), §5 (the reading library), §8 (sourcing). Worked examples for structure, depth
and voice: `docs/plans/book-two-chapter-01.md`, `docs/plans/book-three-band-05.md`,
`docs/plans/book-three-band-06.md` (the two most recent siblings — this document matches their
shape). Load-bearing background this band cannot be designed without:
`docs/plans/book-three-band-01.md` (cause/consequence — its lesson 1 already teaches ため(に)'s
purpose sense in full, and its §6.2 tells band 7 to drop ために; verified independently below, not
taken on faith), `docs/plans/book-three-band-05.md` (its lesson 2 teaches ようだ/ような and defers
ように's own uses here by name), `src/content/lessons/b2-05-deciding.yaml` (つもり, already struck
from this band by the skeleton and confirmed below not worth restoring).

**Shape landed: 5 teaching lessons + 1 recognition checkpoint = 6 lessons, orders 252–257 — two
slots short of the brief's pre-assigned 252–259 range, and returned rather than spent.** Of the
brief's six named patterns, two die outright to attestation (べく, ことにする) and one — ために —
turns out to already be fully taught by band 1, confirmed by direct classification of its own raw
hits, not just cited secondhand. What survives (ように, まい, ことになる) is genuinely strong
where it survives: ように alone is **the richest single pattern attested anywhere in this book so
far**, 413 raw hits with essentially none lost to contamination, rich enough to earn three lessons
rather than one. See §1 for the full accounting and §6.1–6.3 for why the pre-assigned range is not
spent in full.

**New vocabulary: none. New kanji: none.** Every genuine citation sourced below spells its pattern
in kana — confirmed against the corpus, not assumed (§1) — and every pattern attaches to a plain
non-past clause the learner already owns from Book Two's plain-form chapter. This band is grammar,
full stop, per `04-stage-reading.md` §3.

---

## 1. Attestation — what I checked before committing anything, and where the brief's own list needed correcting rather than just trimming

`book-three-bands.md` §3b gives raw substring ceilings for this band's six named patterns: ように
413 · ために 259 · べく 12 · まい 117 · ことにする 1 · ことになる 29. I re-extracted all 25,983
unique Japanese sentences from `server/data/jmdict-examples-eng-3.6.2.json` (reading
`ex.sentences[]` under `lang: "jpn"`, the field §3b's own trap note warns about, not the `text`
headword field) and searched each pattern's literal string. Every raw count matched §3b exactly,
confirming I am reading the right field. Method script (throwaway, not committed):
`/private/tmp/.../scratchpad/{extract,search}.mjs`.

| Pattern | Raw hits | Genuine, after hand-classification | Verdict |
|---|---:|---:|---|
| ように | 413 | **~413 — essentially no contamination found** | **Richest pattern in the book so far.** Three lessons, not one — see §6.1. |
| ために | 259 | n/a — **already fully taught by band 1** | **Dropped from this band.** See below. |
| べく | 12 | **1** | **Dropped as a lesson.** Folded into lesson 1 as a one-line recognition citation. |
| まい | 117 | **14** | **Kept, thin.** The worst contamination ratio in the band, exactly as the brief warned. |
| ことにする | 1 | **1** | **Dropped as a lesson**, matching the brief's own expectation. Folded into lesson 5 as a citation. |
| ことになる | 29 | **28** (1 is a different idiom, see below) | **Kept, solid.** Carries its lesson alone, as the brief hoped. |

### 1.1 ために — not thin, not contaminated, simply already spent

The brief's framing for this band says "ために here is the purposive sense only. Band 1 owns the
causal sense." That framing is narrower than what actually happened: **band 1's lesson 1 does not
teach the causal sense alone — its own text says "ため(に), both senses," and cites the purpose
sense as "genuinely new territory; nothing in Books One or Two says 'in order to.'"** Band 1's own
§6.2 states this plainly and tells this band to drop ために. I did not take that on faith; I
reclassified all 259 raw ために hits myself, bucketing by what precedes the string:

| Bucket | Count | What it shows |
|---|---:|---|
| Noun + の + ために | 105 | Mostly benefactive ("for X's sake") or causal ("because of X") — band 1's territory |
| Verb dictionary-form (no past marker) + ために | 148 | Overwhelmingly the purpose sense, "in order to" |
| Verb past-form + ために | 6 | Causal — band 1's territory |

The 148-strong dictionary-form bucket is deep and clean: #151231 「私達みんなは芝居を見るために
シアターへ行った。」("we all went to the theater to see a play") — **already cited by band 1's own
lesson 1** — sits alongside dozens more of the same shape (#76899 茶道具を清めるために使う, #108264
筋肉をつけるためにトレーニングしている, #197565 自転車をこいでいた人を避けるためにハンドルをきった).
There is no second, untouched vein of purposive ために material waiting for this band — band 1
already drew from exactly this bucket, and there is nothing distinct left to teach as a fresh
lesson. **Verdict: ために is not this band's pattern. It is dropped, not merged, not renamed** —
see §6.1 for what I do keep, which is the boundary against ように, taught inside that lesson rather
than as a lesson of its own.

### 1.2 べく — the brief's ceiling hides three different jobs of one classical auxiliary, and only one is this band's

The 12 raw べく hits split three ways on inspection, and only one way is the purposive sense this
band wants:

- **9 of 12 are なるべく** ("as much as possible"), a fixed adverb with its own JMdict headword,
  unrelated to the auxiliary — #199061 「なるべく安いほうがいいです。」("I would like the least
  expensive one").
- **2 are べし's other classical job** — necessity/obligation, not purpose: #147415
  「書籍が学問に従うべく、学問が書籍に従うべからず。」pairs べく with べからず ("must not"), the same
  auxiliary's "must" sense (a cousin of `grammar` band 8's べき, already assigned there); #76244
  「起こるべくして起こった事故だった。」("an accident that was waiting to happen") is the fixed
  fatalistic idiom べくして〜べく, "bound to happen as it was destined to" — also not purpose.
- **1 is genuinely purposive**, modern, and clean: #96580 「彼らは男を逮捕すべく追いかけた。」("they
  chased the man to arrest him") — する's irregular すべく, verb + べく = "in order to," exactly the
  job this band wants, and the only clean hit for it.

One sentence cannot support a lesson — it is thinner than every pattern this book has kept so far,
including band 1's ことだから (2, both used, one reused for the checkpoint). **Verdict: dropped as
a lesson.** #96580 is cited once, in lesson 1's grammarNote, as a "you'll meet this in formal
writing" recognition note next to ように — the two do the same job at different registers, and
naming that relationship costs one line, not a lesson.

### 1.3 まい — the brief's warning was right, and worse than it looked before hand-reading

117 raw hits, and the string まい turns out to be one of the most overloaded searches in this
book: うまい ("skillful/delicious," dozens of hits), しまう/てしまう ("end up ~ing," the single
largest contaminant by far), めまい ("dizziness"), まいる/参る (humble "come/go," and its idiom
まいった, "I give up"), しまい/おしまい ("the end," a noun), あいまい (曖昧, "ambiguous"), じまい
(a suffix, "closing without having done"), 撒く conjugated まいた/まいて ("scatter/sow"), 邁進
(まいしん, "forge ahead"), and 枚 (まい, the flat-object counter — 片道２まい, "two tickets"). None
of these fourteen-plus collision classes are the auxiliary. I read all 117 by hand and confirmed
the genuine set with a second, targeted regex pass to catch anything missed (`まいと|まいし|まいか`
plus `なるまい|わかるまい`) — both passes converged on the same 14.

**14 genuine hits, and roughly half of those are two frozen idioms built on まい rather than free
production of it:**

- **Negative volitional, "I will not / I'm determined not to"** (the auxiliary's core, clean
  production examples): #98295 「彼らは１語も聞きもらすまいと傾聴した。」("they listened
  attentively so as not to miss a single word"), #209047 / #90506 「彼女は泣くまいと気を張った。」
  ("she steeled herself not to cry" — two independent sentences, same verb), #2500602
  「彼女は行かせまいとして私に縋った。」("she held on to me to prevent me from going" — causative
  base, 行かせる → 行かせまい), #140454 「相手チームはラインを越えさせまいとしたのです。」("the
  other team tried to keep them from crossing the line" — causative again). **5 sentences, 4
  distinct verbs.**
- **Negative conjecture, "probably won't / surely isn't," any subject** (the auxiliary's other
  core job, epistemic rather than volitional): #172429 …推進されなければなるまい ("cannot ...
  without external pressure" — なければなるまい, double-negative obligation), #213193
  「そのことですぐに何か手を打たねばなるまい。」("something must be done about it in no time" — same
  なるまい shape), #213894 「そうしたところで君には何もなるまい。」("you will gain nothing from
  doing that"), #201384 「どうせ日本文化の粋などは連中には絶対わかるまい。」("they'll never truly
  understand the essence of Japanese culture"). **4 sentences.**
- **じゃあるまいし, a fixed idiom** ("since it's not as if...," a rhetorical dismissal): #140730,
  #191228, #168607. **3 sentences, one shape.**
- **Vようと(も)Vまいと, a fixed concessive idiom** ("whether or not"): #145736
  「信じようと信じまいと、それは真実だ。」("believe it or not, that is true"), #178919
  「君が同意しようとしまいと、ぼくはやる。」("whether you agree or not, I'm doing it"). **2
  sentences, one shape.**

**Net read: まい clears the floor, but it is the thinnest full lesson in this book to date on
genuine production material** — 9 clean sentences split across 6 distinct verbs for the two core
jobs, plus 5 more locked into two fixed idioms worth teaching as color rather than free
production. This is thinner than band 6's どころか (9, all one job) and closer to band 1's
からには (3) in spirit, if not in raw count — a real pattern, honestly thin, not a mirage. See §6.2
for why it still earns a lesson rather than a footnote.

### 1.4 ことになる — richer than feared, and one hit is a different idiom wearing the same string

29 raw hits, 28 genuine. The one exclusion: #202199 「テニスのことになると彼女は水を得た魚のようだ。」
("she is in her element when it comes to tennis") is の+こと+になると functioning as the fixed
idiom "when it comes to the topic of X," not the result/consequence construction this lesson
teaches — mechanically built from the same three morphemes, doing different work, the same shape
of trap `book-three-band-01.md` §1 found in ものだから (あわてもの+だから is not [clause]+ものだから).
Worth a one-line flag for reading recognition, not sourced as a teaching example.

The 28 genuine hits split into two real jobs, neither of which is the "arrangement decided by an
institution" flavor most textbooks lead with — that flavor simply is not well attested in this
corpus, and I say so rather than force a citation that doesn't fit:

- **Consequence/inference — "that means," "it follows that," "will end up meaning"** (the
  dominant job, ~20 hits): #204924 「それは彼の人格を阻害することになる。」("it runs against his
  character"), #213932 「そういう言葉は不信感を生むことになるだろう。」("such words will give rise
  to suspicion"), #221119 「この証拠から、彼は犯人ではないということになる。」("from this evidence,
  it follows that he is not the criminal" — the clearest textbook-shaped example), #145918
  「食べ過ぎると、消化不良に苦しむことになる。」("when we eat too much, we suffer from
  indigestion").
- **The idiomatic close, 大変な/困ったことになる — "things get serious/into a fix"** (~2 hits, worth
  naming as its own recognizable collocation): #218776 「これでさらに困ったことになるだろう。」
  ("this will add to our troubles"), #193739 「もし期限切れになったら、大変なことになるよ。」
  ("there will be hell to pay if I don't make this deadline").
- **The circumstance/outcome flavor** that contrasts most directly with ことにする's "I decided" —
  thinner in this corpus than the two jobs above, but present: #193010 「やれやれ、女を選んで結婚す
  ることになるのか・・・。」("so, it's come to this — I'll end up marrying a woman I chose") reads as
  resignation to how things worked out, not a decision the speaker made outright. Stated plainly:
  this corpus does not hand me a crisp "my company decided to transfer me" sentence, and I am not
  forcing one — #193010 is cited with that caveat attached, the same honesty band 5 practiced for
  はず's noun/な-adjective attachment.
- **A narrow duration-calculation variant, worth one line, not primary teaching content:** #99128
  「彼は来月の末でここに１０年間住むことになる。」("he will have lived here for ten years by the end
  of next month") uses ことになる to total up a span of time rather than mark a decision or
  consequence — real, attested, but a narrower job than the two above.

**Net read: ことになる carries a full lesson on its own, exactly as the brief hoped it might.** 28
genuine hits is comfortably richer than band 1's せいで (26) or おかげで (31)'s neighbors, and far
past every thin-but-kept pattern this book has shipped.

---

## 2. Naming and ids

Following `book-three-band-05.md` §3 and `book-three-band-06.md` §2's convention (the most recent
sibling naming, superseding band 1's earlier `b3.band-N`):

| Thing | Value |
|---|---|
| Chapter (band) id | `b3.chapter-7` |
| Chapter title (internal/planning) | **Purpose and intent** |
| Lesson `situation` (learner-facing) | **Making it happen** |
| Lesson ids | `b3.you-ni`, `b3.you-ni-naru`, `b3.you-ni-suru`, `b3.mai`, `b3.koto-ni-naru` |
| Checkpoint id | `b3.checkpoint-7`, `situation: Integration & checkpoint` |
| Pattern ids | `grammar.b3-you-ni`, `grammar.b3-you-ni-naru`, `grammar.b3-you-ni-suru`, `grammar.b3-mai`, `grammar.b3-koto-ni-naru` |
| Lessons/grammar/phrases file stem | `b3-07-purpose-and-intent.yaml` (band's own number, matching band 6 §2's confirmed convention — the position in the book is chapter 8, not 7, since band 0 opens the book; the filename tracks the band, not the position) |

**On global `order`.** The brief pre-assigns **252–259**, an 8-slot range, following directly after
band 6's 244–251. This band's actual shape needs **252–257**, 6 slots. **I am not spending
258–259, and I am not asking book assembly to shift band 8 down to reclaim them.** Band 8 is being
planned in parallel from order 260 per the commissioning brief; renumbering it while it is being
drafted elsewhere risks exactly the collision the brief's own pre-assignment exists to prevent.
258–259 are reported here as returned, unused slack — book assembly's call whether to compact the
range later, not mine to force now. See §6.3 for the full reasoning.

---

## 3. The chapter header comment

Paste this at the top of `src/content/lessons/b3-07-purpose-and-intent.yaml`.

```yaml
# Band 7 -- Purpose and intent.
#
# Band 1 already gave the learner ために for "in order to" -- both of ため's
# senses, cause and purpose, taught side by side and contrasted against
# から/ので. This band does not reopen that lesson. Its brief named ために
# again, and hand-checking every one of its 259 attested sentences confirmed
# what band 1's own header already said: there is no second, untouched vein
# of purpose-ために material left. What this band actually teaches is the
# word that takes over exactly where ために stops working -- ように, used
# whenever the goal is not something the same speaker can simply decide to
# do. You can say "study in order to pass the exam" with ために, because
# passing the exam is your own controllable action. You cannot say "speak
# louder in order that everyone can hear" with ために, because "everyone
# hearing" is not something you do -- it is a state you can only aim at. That
# is what ように is for, and telling the two apart is this band's real
# content, not a footnote to it.
#
# ように turned out to be the richest single pattern attested anywhere in
# this book so far -- 413 sentences, almost none of them noise, doing five
# jobs that are genuinely one continuous idea rather than five different
# facts: aim at a goal ("study so you'll pass"), aim at avoiding one ("write
# it down so you don't forget"), wish for one with no main clause at all
# ("may your dreams come true"), and report someone else's instruction
# ("the doctor told her to rest"). One lesson carries all four, the same way
# band 1 kept ため's two senses in one lesson rather than splitting a single
# word into artificial pieces. A fifth, older job -- ように as "like, as,"
# the same idea as みたい/ようだ's simile sense but modifying a verb instead
# of standing as a predicate -- gets a line and a citation, not a full
# re-teaching, because band 5 already built it.
#
# Two more lessons cash out what ように pays for once a verb comes after it.
# ようになる is the change a learner will use constantly and never see
# collected in one place until now -- "I've become able to," "it's come to
# be that" -- built the same way potential verbs already were, one auxiliary
# verb bolted onto the goal clause. ようにする is its partner in effort
# rather than result -- "I make it a point to," "try to" -- the same
# attachment, a different auxiliary, a genuinely different meaning, which is
# why it earns its own lesson rather than a shared one the way Band 6's だけ
# and ばかり did.
#
# The last two lessons are unrelated to ように and to each other, and stand
# on their own. まい is the negative mirror of intent -- "I will not," and,
# just as often, "surely won't" -- real, but the thinnest lesson in this
# book to date: a handful of clean sentences and two frozen idioms worth
# knowing on sight. ことになる closes the band with the flip side of a
# decision -- not what you decided, but what the situation decided for you,
# or what a fact implies. Its own quieter cousin, ことにする, never clears
# more than a single attested sentence in this corpus and is named once,
# not taught -- a learner who meets both should at least recognise which
# one they're looking at.
#
#    1  ように          so that -- and the one already-owned idea it
#                        borrows a line from (comparison, band 5)
#    2  ようになる      coming to be able to
#    3  ようにする      making it your practice
#    4  まい            won't -- and surely won't
#    5  ことになる      that's how it turned out
#
# ために is not on this list on purpose -- see the note above and section 1
# of the planning document for the full accounting. べく and ことにする are
# named once each, inside lessons 1 and 5, and are not taught as their own
# patterns -- one attested sentence apiece is not a lesson, and pretending
# otherwise would be inventing depth the corpus does not have.
#
# content-source: every phrase in this file is a verified Tatoeba pair,
#   cited by id in the grammarNote and in the phrase's own tatoebaId field.
#   No training-canonical sentence is used anywhere in this band
#   (04-stage-reading.md §8).
```

---

## 4. The lessons

### Lesson 1 — So that (order 252)

- **Title:** So that
- **Can-do:** Say what you're aiming for when the goal isn't something you can just decide to do —
  and wish for something out loud
- **Pattern id:** `grammar.b3-you-ni`, `pattern: "～ように"`
- **Teaches:** ように attaching to a plain non-past clause (often potential, negative, or a
  state-change verb — わかる, できる, 治る, 聞こえる) to mark a goal. **The lesson's spine is the
  boundary against `grammar.b3-tame-ni` (band 1), named directly, not left implicit:** ために needs
  a same-subject, controllable action the speaker is undertaking on purpose (勉強するために, "in
  order to study" — the speaker's own act). ように is what takes over the moment that condition
  breaks, in three distinct ways, all attested: **(a) the predicate is not something anyone can
  simply decide to do** — a potential or state-change verb, [#213661] そこに行く道がわかるように、
  近くの目印を教えて下さい ("so I can find my way there, tell me a landmark" — わかる, not
  controllable), [#160195] 私はその犬を芸当ができるように訓練した ("I trained the dog so it could do
  tricks" — できる); **(b) the goal is negative** — [#83924] 風邪引かないようにコートを着た ("I wore
  a coat lest I catch a cold"), [#145625] 寝坊しないように注意しなさい ("take care not to
  oversleep") — Japanese does not say ×風邪引かないためにコートを着た; ように is the only idiomatic
  choice once the goal clause is negative; **(c) the goal belongs to someone other than the person
  acting** — [#194963] みんなに聞こえるようにもっと大きな声で話しなさい ("speak louder so everyone
  can hear you" — the speaker acts, but "hearing" happens to みんな, not the speaker), [#109592]
  彼は駅までの道がわかるように略図を書いてくれた ("he drew me a rough map so I could find the way" —
  same shape). A fourth family, structurally the same clause with nothing following it: **the
  wish/warning idiom, sentence-final ように。** — positive as a wish, [#80969] 夢がすべて叶いますよ
  うに ("may all my dreams come true"), [#144927] 神の御加護がありますように ("may God keep you"),
  [#140539] 早く病気がよくなりますように ("I hope you'll get well soon"); negative as a warning,
  [#121415] 白タクには乗らないように ("keep away from the unlicensed taxis"), [#124860]
  電器設備に近づかないように ("keep away from the electrical equipment"). A fifth, distinct job:
  **indirect commands** — [#82968] 母は私に芝を刈るように言った ("mother told me to mow the lawn"),
  [#190778] 医者は彼に休養するように命令した ("his doctor ordered him to rest"), [#225839]
  キャプテンは静かにするように命じた ("the captain commanded silence") — a plain clause + ように +
  a speech verb (言う, 命じる, 注意する), reporting what someone was told to do.
  **One line of recognition, not a re-teach:** ように doing the same "like, as" job as `grammar.b3-youda`
  (band 5) — [#98886] 彼は烈火のように怒った ("he was raging mad," literally "angry like a raging
  fire") — modifying a verb instead of standing as a predicate. Also worth naming for reading
  fluency, not production: どのように ("how, in what way," [#226891] お宅の暖房はどのようにしていま
  すか), このように/そのように/次のように ("in this way / that way / as follows," [#205515]
  それはこのようにして起きた) — a small, high-frequency explanatory family built on the same word.
  **A second recognition-only line: べく**, the formal, low-frequency cousin doing the same
  purposive job at a literary register — [#96580] 彼らは男を逮捕すべく追いかけた ("they chased the
  man to arrest him," する's irregular すべく). Not sourced as a production example — one attested
  sentence, cited once, named as "you may meet this in writing."
- **Attestation:** 413 raw, essentially all genuine (§1) — no meaningful contamination found across
  extensive sampling of every bucket. This is the richest teaching pool of any single lesson in the
  book to date; the citations above are a fraction of what is available.
- **Depends on:** `grammar.b2-plain-dictionary` and `grammar.b2-plain-nai-ichidan`/`-godan` (the
  negative clause the goal often sits on); **`grammar.b3-tame-ni` (band 1), directly and by name —
  resurface it in the SRS queue before this lesson, since the whole grammarNote opens by contrasting
  against it**; `grammar.b3-youda` (band 5), by cross-reference for the one-line comparison
  callback, not a hard prerequisite.
- **Exercises (earlier books):** `grammar.b3-tame-ni` re-surfaced deliberately, as the direct
  contrast rather than a content dependency — the same move band 5 made for `grammar.b2-tai` against
  `grammar.b3-mitai`.
- **Exercises (this band):** none — opening lesson.
- **New vocabulary:** none (mining).
- **Reading-library slice:** at least one text should carry a ように sentence where the goal clearly
  belongs to someone other than the acting subject (the #194963 shape) alongside a same-subject
  ために sentence, so the boundary the lesson teaches is reinforced on real material, not just
  asserted.

### Lesson 2 — Coming to be able to (order 253)

- **Title:** Coming to be able to
- **Can-do:** Say you've reached a new ability or state, gradually, over time
- **Pattern id:** `grammar.b3-you-ni-naru`, `pattern: "～ようになる"`
- **Teaches:** [plain non-past clause] + ようになる — most often a potential verb, marking a change
  of state reached over time rather than a single decision: 泳げるようになる, "become able to
  swim." Open by naming what this is built from — lesson 1's ように plus なる, "come to be" — a
  familiar verb doing familiar work, not a new word to memorise from zero. The tense that carries
  the meaning is usually た: なった says the change has already happened. **Worth a direct line on
  why ために cannot do this job either:** becoming able to do something is not a controllable action
  in the moment ために needs — it is exactly the kind of state-change goal lesson 1 flagged ように
  for.
- **Attestation:** 48 raw, 48 genuine — clean across the whole set, no contamination found.
  Representative: [#214803] すぐ泳げるようになりますよ ("you'll soon be able to swim" — 12 chars,
  clean opener, textbook-canonical shape), [#125857] 長年の練習のおかげで、私は簡単に簿記ができるよ
  うになった ("years of practice enabled me to keep accounts without difficulty" — also a callback
  to `grammar.b3-okage-de`, band 1), [#74057] いつから日本人は精白米を食べるようになったのですか
  ("when did the Japanese start eating polished rice" — non-potential change of habit, worth citing
  to show the pattern is not limited to potential verbs), [#171407] 今年になってやっとこれらの記録が
  みんなに利用できるようになった ("it was not until this year that these documents were made
  available").
- **Depends on:** lesson 1, directly (the base word). `grammar.b2-potential-ichidan`/`-godan` — the
  large majority of clean citations pair ようになる with a potential verb, and re-surfacing both
  potential patterns before this lesson lets the callback land.
- **New vocabulary:** none.
- **Exercises (earlier books):** `grammar.b2-potential-ichidan`, `grammar.b2-potential-godan`
  re-surfaced deliberately.
- **Exercises (this band):** `grammar.b3-you-ni` — the direct "built from what you just learned"
  callback.
- **Reading-library slice:** at least one text pairing a potential verb + ようになる with a plain
  habit-change use (the #74057 shape) so the pattern is not silently narrowed to "only follows
  potential verbs" in the learner's mind.

### Lesson 3 — Making it your practice (order 254)

- **Title:** Making it your practice
- **Can-do:** Say you make an effort to do something, or try to make it a habit
- **Pattern id:** `grammar.b3-you-ni-suru`, `pattern: "～ようにする"`
- **Teaches:** [plain non-past clause] + ようにする — the same ように base as lessons 1–2, this
  time paired with する rather than なる: not a change that happens to you, but a deliberate,
  ongoing effort you make happen. 早く寝るようにする, "I make it a point to go to bed early."
  Contrasted directly against lesson 2: ようになる reports a result (you can now do X); ようにする
  reports an effort (you are trying to / make a practice of doing X), and the two commonly appear
  back to back in real speech — a person describes the effort (ようにする) and, later, the result it
  produced (ようになる). Most natural in imperative or volitional register: しなさい, してください,
  しましょう all attested and already owned (`grammar.n5-te-ichidan` for てください;
  `grammar.b2-mashou` for ましょう). **One citation uses the plain volitional しよう, a conjugation
  this ladder has not taught anywhere (see §6.4) — do not source the lesson's core teaching set from
  it; treat any しよう citation as incidental reading exposure, not a production target, and build
  the lesson's spine from ましょう/してください/しなさい forms instead.**
- **Attestation:** 45 raw, ~42 genuine after excluding 2–3 stray どのようにする ("how do you...")
  and Nのようになめらか ("smooth like N") hits my bucketing regex mis-caught (these belong to lesson
  1's comparison/manner family, not this lesson — flag for authoring, not a contamination problem
  the way まい's was). Representative: [#80226] 迷惑にならないようにしなさい ("never make a nuisance
  of yourself"), [#214793] すぐ決心するようにしてください ("try to make up your mind soon"),
  [#138554] 他人には辛抱するようにしなさい ("try to be patient with others"), [#143513]
  数日は絶食するようにしてください ("you must not eat anything for a few days" — negative-clause
  variant), [#148272] 収入内で生活をするようにしなさい ("try to live within your income"), [#81579]
  本題からそれないようにしましょう ("let's not deviate from the subject" — already-owned ましょう).
- **Depends on:** lesson 1, directly. `grammar.n5-te-ichidan` (てください), `grammar.b2-mashou`
  (ましょう) for the register the citation pool leans on.
- **New vocabulary:** none.
- **Exercises (earlier books):** `grammar.n5-te-ichidan`, `grammar.b2-mashou` re-surfaced.
- **Exercises (this band):** `grammar.b3-you-ni-naru` — the direct effort-vs-result contrast is the
  lesson's spine.
- **Reading-library slice:** a text pairing ようにする (the effort) with ようになる (the eventual
  result) in the same short passage would be the strongest possible reinforcement for the contrast,
  if the text source can supply it.

### Lesson 4 — Won't, and surely won't (order 255)

- **Title:** Won't, and surely won't
- **Can-do:** Say you're determined not to do something, or that something surely won't happen
- **Pattern id:** `grammar.b3-mai`, `pattern: "～まい"`
- **Teaches:** まい, the classical negative auxiliary, attaching most reliably to the plain
  dictionary form for every verb class (行くまい, 食べるまい, するまい, 来るまい) — ichidan verbs and
  causative/passive forms are also met attached to the stem instead (食べまい, 行かせまい, as this
  corpus's own citations show), a colloquial/literary variant worth flagging for reading, not
  building the lesson's production rule on. **Two real jobs, both attested, both worth naming
  directly rather than presented as one vague "negative":** (1) **negative volitional**, first-person
  resolve — "I will not," [#98295] 彼らは１語も聞きもらすまいと傾聴した ("they listened attentively
  so as not to miss a single word"), [#90506] 彼女は泣くまいと気を張った ("she steeled herself not to
  cry"); (2) **negative conjecture**, any subject — "surely won't, probably isn't," [#201384]
  どうせ日本文化の粋などは連中には絶対わかるまい ("they'll never truly understand the essence of
  Japanese culture"), [#213894] そうしたところで君には何もなるまい ("you will gain nothing from
  doing that"). **Two fixed idioms worth recognising, not producing:** じゃあるまいし ("since it's
  not as if...," a rhetorical dismissal) — [#140730] 禅坊主じゃあるまいし ("I'm not a Zen monk...");
  Vようと(も)Vまいと ("whether or not") — [#145736] 信じようと信じまいと、それは真実だ ("believe it or
  not, that is true").
- **Attestation: the thinnest lesson in this band, and the worst contamination ratio in the book —
  117 raw, 14 genuine.** Of those 14, 9 support free production across the two core jobs (6 distinct
  verbs) and 5 are locked into the two fixed idioms above. See §1.3 and §6.2 for why this still ships
  as a full lesson rather than a footnote.
- **Depends on:** `grammar.b2-plain-dictionary`; incidentally, `grammar.b3-causative` (band 0) for
  the two citations built on causative verbs (行かせまい, 越えさせまい) — worth a one-line note that
  these two examples lean on material from earlier in this book, not Book Two.
- **New vocabulary:** none.
- **Exercises (earlier books):** none new beyond `grammar.b2-plain-dictionary`, already fresh from
  lessons 1–3.
- **Exercises (this band):** none — this lesson is unrelated to lessons 1–3 in form, only in theme
  (see the header comment).
- **Reading-library slice:** essential for this pattern specifically — 14 sentences split across two
  jobs and two idioms is not a bank, and this is the pattern most exposed in the whole band to
  "taught once, never seen again." Prioritise sourcing further まい material for the library before
  this lesson's checkpoint pool is finalised.

### Lesson 5 — That's how it turned out (order 256)

- **Title:** That's how it turned out
- **Can-do:** Say what a fact implies, or that something turned out a certain way rather than by
  your own choice
- **Pattern id:** `grammar.b3-koto-ni-naru`, `pattern: "～ことになる"`
- **Teaches:** [plain clause] + ことになる, in its two attested real jobs: **(1) consequence/
  inference** — "that means, it follows that, will end up meaning" — [#221119] この証拠から、彼は犯
  人ではないということになる ("from this evidence, it follows that he is not the criminal"),
  [#204924] それは彼の人格を阻害することになる ("it runs against his character"), [#145918]
  食べ過ぎると、消化不良に苦しむことになる ("when we eat too much, we suffer from indigestion");
  **(2) the idiomatic close** 大変な/困ったことになる, "things get serious/into a fix" — [#193739]
  もし期限切れになったら、大変なことになるよ ("there will be hell to pay if I don't make this
  deadline"). **The textbook-standard contrast against ことにする** (see below) is named directly:
  ことにする is a decision you make; ことになる is what happens whether you decided it or not —
  a result, a fact's implication, or something that simply came to be. This corpus's best
  illustration of that last flavor is imperfect and cited with that caveat attached, not smoothed
  over: [#193010] やれやれ、女を選んで結婚することになるのか・・・ ("so, it's come to this — I'll
  end up marrying a woman I chose") reads as resignation to how things worked out, the closest this
  corpus gets to the "arranged by circumstance" textbook flavor. **One line of recognition, not a
  re-teach: ことにする**, "I decide to do X" — a distinct word (する, not なる), one attested
  sentence total in this corpus, cited once: [#74578] ここで迷わず迂回路を取ることにする。 ("here I
  decide, without hesitating, to take the alternative route"). Named so a learner meets both halves
  of the textbook pair, not taught as its own pattern — one sentence is not a lesson. **One more
  line worth flagging for reading, not production:** ことになると can also mean "when it comes to
  the topic of X" — [#202199] テニスのことになると彼女は水を得た魚のようだ — a different idiom built
  from the same three morphemes, not this lesson's construction (§1.4).
- **Attestation:** 29 raw, **28 genuine** (§1.4) — one exclusion is a different idiom, not a false
  positive in the usual sense. Comfortably the second-richest lesson in this band after ように.
- **Depends on:** `grammar.b2-ta-koto-ga-aru` and `grammar.b2-koto-dekiru` — both already put the
  learner's plain-clause-becomes-noun move through こと twice; this lesson is a third job for the
  same nominaliser, worth naming as a bridge rather than fresh material (matching band 1 lesson 7's
  own move for ことだから). Band 9 (nominalisation, not yet planned) will eventually formalise bare
  こと on its own; this lesson does not need to wait for that, per `book-three-bands.md` §3's
  "already taught" table (row "こと"), which names ことにする/ことになる as band 7's job specifically.
- **New vocabulary:** none.
- **Exercises (earlier books):** `grammar.b2-ta-koto-ga-aru`, `grammar.b2-koto-dekiru` re-surfaced
  as the shared-nominaliser bridge.
- **Exercises (this band):** none new — closes the band's teaching content; the checkpoint follows.
- **Reading-library slice:** a text carrying the consequence sense and the 大変な/困ったことになる
  idiom in the same passage would show the pattern's range; given the corpus's own thinness on the
  "arranged by circumstance" flavor, the library is this pattern's best chance to supply a cleaner
  example of it than #193010 if the text source allows sourcing beyond this fixed corpus.

### Lesson 6 — Band 7 checkpoint (order 257)

- **Id:** `b3.checkpoint-7`. `checkpoint: recognition`, `wordIds: []`, `phraseIds: []`, `kanji: []`,
  no `patternId` — same shape as every prior band's checkpoint.
- **Can-do:** Recognise everything this band taught, and read the gate text (§7).
- **The shrinking set.** ように, ようになる and ようにする are all deep enough to hold back
  recognition items the learner never saw in teaching — no reuse needed. ことになる (28 genuine) has
  the same margin. まい (14 genuine, 9 of them free production across two jobs) has just enough
  margin to hold back 2–3 items distinct from its teaching set — thinner than the band's other four
  patterns, but not forced into band 1's or band 6's "reuse the teaching sentence" fallback the way
  their thinnest patterns were.
- **What the checkpoint should test that no single lesson can:** the ために/ように boundary itself,
  the same way band 5's checkpoint tested family boundaries rather than isolated glosses. A
  recognition item that gives a situation and asks "would a Japanese speaker reach for ために or
  ように here" is a stronger test of lesson 1 than "recognise this string means 'so that.'" A second
  worthwhile item type: ようになる vs ようにする, result vs effort, given how easily the two are
  confused by their shared base.
- **べく and ことにする are not tested.** Each is named once, inside a lesson, as a single-sentence
  recognition citation — not a taught pattern in the DR-020 sense, and testing either would
  misrepresent a one-line footnote as mastered material.
- **Placement:** at the band boundary (DR-021). No lesson in this band gates another's form except
  lessons 2 and 3's shared dependence on lesson 1 (§4's header comment), so there is no earlier
  point the checkpoint could sensibly move to.

---

## 5. Totals

| | Count | Note |
|---|---|---|
| Teaching lessons | 5 | of the brief's 6 named patterns: 2 die to attestation (べく, ことにする), 1 is already fully taught by band 1 (ために) and dropped rather than re-taught; ように is split into 3 lessons on its own merit (§6.1) |
| Checkpoints | 1 | band boundary (DR-021) |
| New words | **0** | mining carries vocabulary at this stage (`04-stage-reading.md` §3) |
| New kanji | **0** | every genuine citation sourced spells its pattern in kana; confirmed against the corpus, not assumed (§1) |
| New grammar patterns | 5 | one per teaching lesson; べく and ことにする are named, not shipped as patterns |
| New phrases (estimate) | **~28–32** | lesson 1 (richest, several jobs) ~9–10; lessons 2–3 ~5–6 each; lesson 4 (thin, honestly) ~4–5; lesson 5 ~5–6; every one cited with a real Tatoeba id, several already named above |
| Attested example sentences available (genuine) | 413 (ように) + 48 (ようになる) + 42 (ようにする) + 14 (まい) + 28 (ことになる) = **545**, concentrated overwhelmingly in ように | §1 |
| Global order | **252–257** | 6 of the brief's pre-assigned 8 slots; 258–259 returned, not spent (§2, §6.3) |

---

## 6. Judgment calls — where I think the plan needs a decision, or is silent

### 6.1 ように earns three lessons, not one, because I have the room band 5 didn't

Band 5's わけ lesson (`book-three-band-05.md` §7.1) crammed four distinct jobs into one lesson and
said so plainly: *"the brief names わけ as a single line item in an eight-pattern band assigned
exactly nine global order slots... there is no thin one to cut to make room."* That constraint does
not hold here — the opposite constraint does. Two of this band's six named patterns die to
attestation and a third (ために) is redundant with band 1, which leaves real order-budget slack
against the pre-assigned range. Given that slack, and given how much distinct, well-attested
material ように actually carries (413 genuine hits doing at least five nameable jobs — purpose,
negative purpose, wish, warning, indirect command, plus the auxiliary-verb extensions ようになる and
ようにする), collapsing all of it into one lesson the way band 5 was forced to would either bury a
lot of real content or artificially thin the citations to fit. I split ように into three: the base
word's own purpose/wish/report family (lesson 1, genuinely one continuous idea, kept together the
way band 1 kept ため's two senses together); then its two auxiliary-verb extensions, ようになる and
ようにする, each its own lesson because each adds a **different verb** (なる vs する) carrying a
**different core meaning** (result vs effort) — closer in shape to band 1's decision to keep せいで
and おかげで as two lessons despite being "the same shape, opposite stance" than to band 6's decision
to keep くらい's three senses in one lesson because they were genuinely the same word doing
continuous work with no new verb attached. Every reference grammar I know of treats よう(に),
ようにする and ようになる as three separately nameable grammar points, which is independent
confirmation this split tracks real structure in the language, not an attempt to pad a lesson count.

### 6.2 まい ships as a full lesson despite being the thinnest production material in the book, and I want to say why rather than just report the number

Nine sentences across two jobs and six distinct verbs is less than every "thin but kept" pattern
this book has shipped so far in absolute production depth — band 1's からには (3) and ことだから (2)
are thinner in raw count but each is one job, not two, so the material-per-job ratio is actually
comparable. I considered dropping まい the way べく was dropped, and decided against it for a reason
that does not apply to べく: べく's genuine hit (1) demonstrates one job with no depth at all; まい's
9 genuine hits demonstrate **two distinct, real, still-productive jobs** (negative volitional and
negative conjecture) with multiple distinct verbs each, plus two idioms common enough in ordinary
speech that a learner meeting them unglossed in the reading library would be genuinely stuck (じゃ
あるまいし and Vようと(も)Vまいと are not rare literary flourishes — they are ordinary conversational
Japanese). The honest shape, matching band 6's own precedent for に比べて and 反面 (§6.1 there):
**a low ceiling means look carefully, not expect a cut.** まい looked carefully and survived, thin
but real.

### 6.3 The pre-assigned 8-slot range is not fully spent, and I am reporting that rather than padding to fill it

The brief anticipated "six patterns plus a checkpoint is 7" against an assigned range of 8, already
one slot of slack before any attestation work happened. Attestation removed two more patterns
outright and made a third redundant, which could have been absorbed by inventing content that isn't
there — stretching べく or ことにする into full lessons on a single sentence each, or splitting
ように into more pieces than the language actually supports, or manufacturing a sixth pattern this
band's brief never named. I did none of that. `book-three-bands.md`'s own words license this
directly: *"Pattern counts are targets, not quotas — Book Two proved a defended 7 beats a padded
10."* A defended 5 beats a padded 6 for the same reason. 252–257 is the honest range; 258–259 is
reported as returned rather than silently left ambiguous.

### 6.4 The plain volitional (行こう／食べよう) is not taught anywhere in this ladder, and this band is where its absence first bites, even though it doesn't block anything here

Checking まい's classical relationship to the volitional (it is traditionally described as the
volitional's negative mirror) and sourcing lesson 3's ようにする citations, I confirmed: **the plain
volitional form — 行こう, 食べよう, "let's / I shall," casual register — does not appear as a taught
pattern anywhere in Books One or Two, or in Bands 0 through 6 of this book.** `grammar.b2-mashou`
teaches only the polite register (ましょう); its plain-register counterpart was never built.
`book-three-band-03.md`'s own text independently confirms the gap exists (it excludes two ようじゃ
ないか hits specifically because they use "volitional + じゃないか," a construction outside anything
taught). This does not block any lesson in this band — まい attaches to the plain dictionary form,
already owned, and lesson 3's core teaching set is sourced from already-taught ましょう/てください/
しなさい forms rather than the one attested しよう citation. I am flagging it because it is the same
shape of gap `book-three-band-01.md` §6.1 found for the passive and `book-three-band-05.md` §7.2
found for だろう/でしょう/そう: a genuinely standard, high-frequency piece of ordinary Japanese that
fell through the skeleton's own net because it isn't a connective pattern. Unlike those two, this
one is minor enough that I don't think it blocks authoring anywhere yet — but a learner who finishes
this book able to build a passive sentence, hedge with はず, and mark purpose with ように, while
still unable to say "let's go" in casual register, has a real, specific hole, and it is cheap to fix
whenever a register/casual-speech pass gets planned.

### 6.5 No vocabulary exception is worth arguing for

None of this band's five words carry an independent standalone life worth a vocabulary card the way
Band 1 considered for せい/おかげ. よう (様) as a bare noun ("way, manner," 出鱈目なやり方) exists in
JMdict but did not surface in this corpus attached to any of this band's constructions in a way that
would justify teaching it separately from ように. This band ships zero new words, cleanly.

---

## 7. The gate text (band close)

Per `04-stage-reading.md` §3 and matching every sibling band's equivalent section: **specify what it
must contain, not which text it is** — the text-source decision (`book-three-bands.md` §2) is still
open and this band's design does not depend on which way it resolves.

- **It must be unreadable without this band.** At least one sentence's claim must turn on correctly
  reading a purpose clause, a change-of-state, an effort, a negative intention, or a stated
  consequence this band taught — not just fluency, but whether the reader can tell what the goal or
  outcome actually is.
- **It should draw on at least two of this band's five `grammarIds`, and ように should be one of
  them if at all possible** — given ように's depth (§1), any reasonably long passage at this band's
  level is likely to carry it naturally; requiring a second (ようになる, ようにする, まい, or
  ことになる) alongside it is realistic. Do not require まい specifically — its own attestation
  (§1.3) makes that an unrealistic ask for a short passage, the same reasoning band 1 applied to its
  own thinnest three patterns and band 6 applied to どころか/に比べて/反面.
- **Vocabulary coverage at or above the flow line (~98%, `04-stage-reading.md` §5)** once Books
  One–Two and this band's own material are in the known set — this is a reading checkpoint, not a
  vocabulary stress test.
- **If the interim text source is the clustered-sentence stopgap** (`data/reading/micro-readings.json`'s
  model), the checkpoint's own copy must say so rather than present it as a story — the restraint
  every sibling band's gate-text section already holds itself to.
- **No score, no pass mark.** Consistent with DR-020: presented once the shrinking recognition set
  empties, framed as "you can read this now," never as a test the learner can fail.
- **The schema gap is inherited, not new.** `src/content/lessons/schema.ts` has no field for a
  reading passage at all, first found by `book-three-band-03.md` §3 lesson 7 and confirmed again by
  every sibling band since (`book-three-band-00-passive.md` §6.6, `book-three-band-06.md` §7). I am
  not re-solving it — recording, per that shared finding, that whoever owns the reading-library build
  should treat this as one gap shared across every band's checkpoint, not a fresh one for this band.

---

## 8. Authoring checklist

1. **Every phrase's source is a real Tatoeba id**, cited in the commit message per CLAUDE.md, and in
   the `Phrase.tatoebaId` field.
2. **Write every `pattern:` field as a bare Japanese literal** (no Latin characters —
   `grammarSurface` in `scripts/levelling.mjs` rejects any pattern string containing one):
   `～ように`, `～ようになる`, `～ようにする`, `～まい`, `～ことになる`. All five clear the two-kana
   minimum after splitting on ～ (`まい` is exactly 2 characters, the tightest fit in this band).
3. **Do not source lesson 3's core teaching examples from #225647** (the one しよう citation, §6.4)
   — use it only as an incidental "you'll meet this" aside if at all, never as a primary example.
4. **Do not cite #202199 as ことになる's teaching example** — it demonstrates a different idiom built
   from the same three morphemes (§1.4), not the taught construction.
5. **Do not cite #147415 or #76244 as べく's example if べく is mentioned at all** — both are べし's
   necessity/fatalism jobs, not the purposive sense this band names (§1.2). Only #96580 is genuine.
6. **Re-surface `grammar.b3-tame-ni` (band 1) in the SRS queue before lesson 1** — the entire
   grammarNote opens by contrasting against it, and the callback only lands if it's fresh.
7. **Commit messages** on every content commit must name the source, or the commit is rejected
   (CLAUDE.md).
8. **Run `pnpm walkthrough`** before merge, signed in — as a guest run it will not reach Book Three
   at all (`TIER_BOOK_LIMIT`).
9. **Run `pnpm ladder`** once this content lands, regenerating the book's ladder doc — `pnpm test`
   fails on a stale one.
10. **The text-source decision** (`book-three-bands.md` §2) blocks the reading-library slice and the
    gate text, not the five teaching lessons — those can be authored and shipped from the attested
    sentences in §1 alone, same as every band in this book so far.
11. **Flag for whoever assembles the book:** orders 258–259 are unused by this band (§2, §6.3). Do
    not assume they are free for band 8 without confirming band 8's own document, drafted in
    parallel from order 260, hasn't already locked that starting point in a way a shift would break.
