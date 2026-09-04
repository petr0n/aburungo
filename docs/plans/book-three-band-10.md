# Book Three, Band 10 — Register and the written voice

**Status: design, not content.** This document specifies every lesson in the band in enough detail
that authoring the YAML is mechanical, or explains why the band ships nothing. **No Japanese
sentence is composed here.** Every example sentence named below is a real Tatoeba pair, cited by
id, pulled from `server/data/jmdict-examples-eng-3.6.2.json` — never invented, per
`04-stage-reading.md` §8.

Source brief: `docs/plans/book-three-bands.md` §3 (band 10's row), §3b (raw attestation ceilings,
re-derived below, not trusted), §4 (what a band breakdown must add). Background:
`docs/plans/04-stage-reading.md` §3 (the band model), §5 (the reading library), §8 (sourcing).
Worked examples for structure, depth and voice: `docs/plans/book-two-chapter-01.md`,
`docs/plans/book-three-band-07.md`, `docs/plans/book-three-band-08.md` (the two most recent
siblings — this document matches their shape). Load-bearing background this band cannot be scoped
without: `docs/plans/book-three-band-00-passive.md` §6.4 (found and named the honorific/敬語
collision, recommended it stay out of scope, and flagged band 10 by name as the place someone might
wrongly try to absorb it — checked directly below, not taken on faith); `src/content/lessons/b2-01-plain-form.yaml`
(だ, the plain copula, already fully taught — the pattern this band's biggest number has to be
measured against); `docs/plans/book-three-band-02.md` §3 (found bare concessive ながら has **zero**
freely-produced attestation in this corpus — relevant to how つつ's own concessive citations are
framed below, and confirmed independently, not assumed).

**Verdict: the band survives, but not the six-entry list the skeleton wrote down.** Of band 10's
six named entries, two were never patterns — `passive as formality` is a register observation about
grammar band 0 already teaches, and `noun-heavy style` is a description of prose, not a form a
lesson can drill (the skeleton's own commissioning brief says this in as many words, and hand
inspection below confirms it, it does not just repeat it). That leaves four real, attestable
patterns: である, つつ, ゆえ, において. All four survive contact with the corpus — even the
skeleton's own weakest number, ゆえ's ceiling of 6, turns out to be undercounted by one (§1.3). What
does not survive is the band's *size*: four patterns is a defended four, not a padded ten, and the
document says so rather than inventing a fifth teaching lesson to look more like its siblings.

**Shape landed: 4 teaching lessons + 1 recognition checkpoint = 5 lessons, orders 274–278 — three
slots short of the assigned 274–281.** 279–281 are reported as returned, matching the precedent
band 7 (§6.3 there) and band 8 both already set: a defended smaller number over an invented larger
one.

**New vocabulary: none. New kanji: none.** Every genuine citation sourced below spells its pattern
in kana, with one interesting near-exception documented in §1.3 that still resolves to zero. This
band is grammar and register, full stop, per `04-stage-reading.md` §3.

---

## 1. Should this band exist at all? — taking the skeleton's suspicion seriously before designing anything

The brief does not want this band defended reflexively. It wants the question actually asked: is
"register" a grammar family a lesson can teach, or is it a lens that belongs smeared across the
other nine bands as "here is how this looks in writing"? Three sub-questions, answered in order.

### 1.1 Are である, つつ, ゆえ, において teachable patterns, or is "register" doing all the work?

Yes, and the corpus is what settles it, not intuition. Each of the four attaches to a form the
learner already owns (plain non-past for である and ゆえ, ます-stem for つつ, a bare noun for
において) and each does one identifiable job a Tatoeba sentence either does or does not demonstrate.
That is exactly the test every other band in this book has passed its patterns through. "Register"
by itself would not clear that bar — there is no lesson called "register" the way there is a lesson
called "ように." But four specific words that happen to share a register do clear it, individually,
below.

### 1.2 Is である really 761 sentences' worth of new teaching, given the learner already has だ and です?

This is the number the brief asked me to interrogate first, and the honest answer is: **no, and
that is exactly why である earns one lesson rather than several.** `grammar.b2-plain-da` already
taught the whole spoken paradigm in one lesson — "The plain copula. だった, じゃない, じゃなかった —
and never after an i-adjective." である is not a new grammatical fact sitting on top of that; it is
the same fact's formal-register twin, and its own paradigm collapses into the same shape: である
(non-past), であった (past, 111 raw), ではない (negative, 195 raw), all clean, high-volume, and
structurally identical to what Book Two already drilled once. Textbooks that give である its own
chapter are not describing a richer grammar than だ's — they are describing a *register-restricted*
copula, and a register restriction is one fact, not many. Measured against Book Two's own precedent
(one copula, one lesson, whatever the raw sentence count backing it), である should not become two
or three lessons just because its raw count dwarfs every other pattern in this book — see §1.4 for
what the sampling actually found and §6.1 for why the count is high without the *content* being
proportionally larger.

The number is not empty, though. Two things in である's paradigm are genuinely new, not a repaint of
だ, and they are what the lesson is actually for: **the register boundary itself** (a learner who
has only ever met だ has no way to know である cannot be said out loud to a friend — Book Two never
had to teach that boundary because everything it taught was spoken), and **であり**, the copula's
continuative/linking form (20+ raw hits joining two nominal-predicate clauses without a separate
conjunction — 「Xであり、Yである」). Checking the manifest for a spoken equivalent of that second
piece turned up nothing: no lesson anywhere teaches で as a copula-linking form either. であり is not
"だ's linking form, but formal" — it is arguably the *first* time this course teaches copula clause-
linking in either register. That is real, new, teachable content, and it is the reason である is not
just a vocabulary footnote wearing a big number.

### 1.3 A number worth correcting before anything else: ゆえ's ceiling is 7, not 6, and the miss is instructive

`book-three-bands.md` §3b gives ゆえ a raw ceiling of 6, searching the kana string ゆえ. That search
cannot see the pattern's own kanji spelling, 故に, which does exist in the corpus and does show up
doing real work: **#75231** 「しかし、天才であるが故に一般ピーポーから理解され難いというのは宿命とも
言えるわ。」("you could say it's fate that being a genius makes you hard for ordinary people to
understand") — が故に, "precisely because," the same construction as がゆえに, spelled with 故
instead of ゆえ. I checked every raw hit for 故に and が故 (17 combined, after removing overlap) by
hand rather than trusting the string match: 15 of 17 are 事故 ("accident," a completely unrelated
word that happens to contain 故) or 故障 ("breakdown"), and exactly **one** is the genuine causal
construction. **Corrected ceiling: 7 genuine sentences (6 kana + 1 kanji), not 6** — thin either
way, but the miss itself is worth recording: a substring search keyed to one script misses a
pattern's own kanji variant, the same shape of gap band 07 found in ために's causal/purposive split
and band 08 found in てはならない's polarity trap. #75231 is also a gift for the checkpoint: it
combines ゆえ with である in one sentence, which is exactly the kind of "these patterns cooperate in
real text" citation §7 asks the gate text to supply. I recommend teaching ゆえ from its kana form (6
sentences carry the lesson) and naming 故に once as "the same word, sometimes written with a kanji,"
citing #75231 — not spending a kanji-teaching budget on one sentence, the same call band 07 made for
its own one-hit citations (べく, ことにする).

### 1.4 What sampling actually found for the other three

**である (761 raw).** Too large to hand-read exhaustively the way ゆえ's 6 could be — the same
posture band 07 took with ように's 413, "extensive sampling of every bucket," not a full manual
pass. I bucketed by what immediately follows the string: 630 of 761 (83%) end the sentence outright
(である。), 30 precede こと (nominalized), 15 precede という/と言 combined, 5 precede が (concessive),
2 precede べき. No bucket showed a collision pattern the way おいて (§1.6) or まい (band 07 §1.3)
did — である has no common homograph the way 置く collides with おいて, because で+ある does not
happen to be the tail of any other frequent word or conjugation. I treat this as clean based on
sampling depth comparable to what band 07 accepted for ように, not as an exhaustive claim.

**つつ (36 raw, 25 genuine).** Hand-read in full — small enough to. Eleven of the 36 are homograph
noise, and it is a wide spread of unrelated words, not one repeat offender: つつじ ("azalea," a
noun, #174037), a boundary artefact where づつ ("each") runs into 詰める's imperative つめ (#78480,
"づつつめ" reads as つつ only by accident of where the strings touch), the verb つつく ("to poke/peck"
— four separate hits, #197445, #76788 [which also contains きつつき, "woodpecker"], #77078, #195367),
つつむ's passive つつまれる ("to be wrapped/shrouded," #219470), the fixed adverb つつがなく ("without
incident," #76078), the fixed noun 夢うつつ ("half-asleep," #80970 — うつつ is a different word,
"waking reality," and shares no root with つつ at all), and the adjective/adverb pair つつましい /
つつましやか ("modest," #159333, #92099). Every one of these is a real, unrelated Japanese word that
happens to contain the two-kana string つつ — none is a mis-segmented version of the auxiliary
itself, which is a cleaner failure mode than band 07 found for まい (several of whose contaminants
*were* the same underlying auxiliary in a different job). **The 25 genuine hits split cleanly: 22
are つつある** ("is in the process of ~ing," a formal, written aspectual marker for gradual ongoing
change — #164122 私のビジネスは再び回復しつつあります, "my business is picking up again"; #174615
古い伝統が消滅しつつある, "old traditions are crumbling away"; #217282 コンピューターがこの会社に
導入されつつあります, "computers are being introduced into this company," つつある stacked on a
passive verb, a genuine three-pattern citation with band 0's passive) — and **3 are bare つつ** doing
what looks, on the surface, exactly like ながら's two jobs: simultaneous action (#144511 人は泣きつつ
生まれ、泣き言を言いつつ暮らし、失望落胆して死ぬ, "we are born crying, spend our lives complaining,
and die disappointed" — two instances) and concession (#76645 気にしつつ、しかし素直になりきれない,
"while thinking about me, but unable to admit it," and #185773 将来を見据えつつ、今そこにある危機を
乗り越えていかねばならない, "while keeping the future in view, we must get through the crisis at
hand"). This is a genuinely interesting asymmetry worth stating plainly: band 2 found **zero**
freely-produced bare concessive ながら in this same corpus — every hit was a frozen idiom (残念なが
ら, 生まれながら, 涙ながら). つつ's own bare form has exactly what ながら's own corpus lacks: real,
clause-level, freely-produced concessive and simultaneous citations. That is not a coincidence to
paper over — it is the honest shape of a written-register word sometimes surviving in a corpus in
places its spoken-register cousin has calcified into idiom.

**において (50 raw, 47 genuine).** Also hand-read in full. Exactly **3 contaminants, and all three
are the same collision**: the verb 置く ("to put/place") conjugated to its て-form 置いて plus a
polite auxiliary, which is spelled identically to に + おいて once written in kana — #234564 私は
カメラを家においてきた ("I left my camera at home," 置いてきた, "put [it] and came"), #216737
自由貿易問題を協議事項のトップにおいています ("keeps free trade at the top of the agenda," 置いて
います, an ongoing placed-state), #79178 切手を沢山手元においてある ("I keep a lot of stamps on
hand," 置いてある). Each one has a direct object marked with を describing something being
physically placed — the tell that separates the verb from the particle-like construction, since
genuine locative/domain において never takes its own を object. Every other hit (47) is genuine, and
splits across three related jobs of the same grammaticalized word: **locative "in/at"** (#174595
古代において塩は希少で貴重な商品であった, "salt was rare and precious in ancient times" — also a
である citation, see §7), **domain/respect "in terms of"** (#219951 この服は品質においてあの服よりも
ずっと優れている, "this suit is far superior to that one in quality"; #93694 彼女は、彼より、数学に
おいて劣っている, "she is inferior to him in math"), and **the fixed idiom 責任において**, "at one's
own/under one's own responsibility" (#149797, #176788, two independent sentences, one shape). 47
genuine hits is richer than every "kept but thin" pattern this book has shipped so far except
ように — comfortably the second-densest single lesson in the book to date.

### 1.5 What "register and the written voice" is not, and should not grow into

Checking band 00's own note (§6.4 there) directly rather than trusting it secondhand: it names an
honorific/敬語 reading of られる surfacing in its passive citations, declines to teach it, and
flags — by name — that band 10's title is the kind of label someone could mistake for "the place
that owns formal/polite Japanese generally." **It does not.** Nothing taught anywhere in this ladder
covers honorific or humble speech (敬語): no いらっしゃる, no 召し上がる, no humble 伺う/申し上げる, no
です/ます-beyond-plain politeness register work at all — a manifest check confirms the only hit is
ございます as a frozen idiom inside "thank you," not productive keigo. That is a real, fifth gap of
the exact shape §3a–§3d already catalogued (grammar the course promised implicitly and never built),
and it is **not this band's job to close it.** である/つつ/ゆえ/において are the *plain declarative*
written register — the voice of an essay, a news report, a notice, a definition. Honorific speech is
a different system entirely (who is speaking to whom, not what century the sentence sounds like),
genuinely larger, and deserves its own planning pass the way band 00 recommended for its own
honorific collision. I am naming this boundary explicitly so nobody reads "register and the written
voice" as a green light to fold keigo in here later without a separate decision.

### 1.6 Conclusion

Four real patterns, one already-mistrusted number corrected upward by one (ゆえ), one number
correctly recognized as *not* implying multiple lessons despite being the biggest in the book
(である), one number cleared of contamination with a genuinely interesting cross-reference finding
attached (つつ), one number cleared of a narrow, single-source contamination and found richer than
expected (において). The band survives on its own four legs. It does not survive as a six-item list,
and it should not survive as a home for keigo. That is the whole verdict.

---

## 2. Naming and ids

Following `book-three-band-07.md` §2 and `book-three-band-08.md`'s naming convention:

| Thing | Value |
|---|---|
| Chapter (band) id | `b3.chapter-10` |
| Chapter title (internal/planning) | **Register and the written voice** |
| Lesson `situation` (learner-facing) | **Reading the written page** |
| Lesson ids | `b3.de-aru`, `b3.tsutsu`, `b3.yue`, `b3.ni-oite` |
| Checkpoint id | `b3.checkpoint-10`, `situation: Integration & checkpoint` |
| Pattern ids | `grammar.b3-de-aru`, `grammar.b3-tsutsu`, `grammar.b3-yue`, `grammar.b3-ni-oite` |
| Lessons/grammar/phrases file stem | `b3-10-register-and-the-written-voice.yaml` (band's own number; band 10 sits at book position — chapter 11, since band 0 opens the book — the filename tracks the band, matching band 07 §2's confirmed convention) |

**On global `order`.** The commissioning task assigns **274–281**, an 8-slot range, following
directly after band 9's assumed close at 273. This band's actual shape needs **274–278**, 5 slots.
**279–281 are returned, unspent.** Band 9 is not yet authored as of this document, so there is no
collision risk in reporting the return early the way band 07 had to defer to band 8's own parallel
draft — but I am still not spending the slack to look fuller, for the same reason band 07 and band
08 both gave: a defended smaller number beats an invented larger one.

---

## 3. The chapter header comment

Paste this at the top of `src/content/lessons/b3-10-register-and-the-written-voice.yaml`.

```yaml
# Band 10 -- Register and the written voice.
#
# Every book, essay, news article and notice a learner will eventually want
# to read is written in a voice this ladder has not taught yet. Not harder
# grammar -- a different voice for saying the same things. This band teaches
# four words that mark that voice: である, the written stand-in for だ/です
# that a speaker never says out loud; つつ, doing ながら's own two jobs
# (while, although) in that same formal register, plus its own extension,
# marking a change still under way; ゆえ, the written word for because; and
# において, the written word for in -- both a place and a respect in which
# something is true.
#
# である is not new grammar wearing a big number. Book Two already taught
# the whole plain copula paradigm in one lesson -- だ, だった, じゃない,
# じゃなかった -- and である's own paradigm is the same shape: である,
# であった, ではない. What is genuinely new is the boundary itself (nobody
# has told this learner yet that a word exists which must never be spoken to
# a friend) and であり, the copula's own linking form -- joining two
# statements the way "X, and Y" does, which this ladder has not taught in
# either register until now. One lesson, not several: the count of attested
# sentences is enormous because the copula is everywhere in formal writing,
# not because there is a great deal to teach about it.
#
# つつ earns its lesson from an unusual angle. Band 2 already found that
# concessive ながら barely exists as free production in this corpus --
# every hit was a frozen idiom. つつ's own corpus has exactly what ながら's
# lacks: real, freely produced while/although sentences. Its dominant job by
# far, though, is つつある -- a change still happening, "is in the process
# of," the second-most useful thing in this band after である itself.
#
# ゆえ is the thinnest lesson in this band and the second-thinnest this book
# has shipped -- seven sentences, one of them written with a kanji this
# lesson does not spend a kanji budget teaching. Thin, not hollow: every one
# of the seven is a clean, standalone example of because in formal
# register, contrasted directly against から/ので, already owned.
#
# において closes the band as its richest pattern after である -- 47 clean
# sentences doing one continuous job, marking where or in what respect
# something holds. Its own noun-modifying twin, における, belongs to band 9
# by the skeleton's own assignment; this lesson names that boundary rather
# than reaching past it.
#
#    1  である    the written is
#    2  つつ      while, although, and still changing
#    3  ゆえ      because, on paper
#    4  において  in -- a place, or a respect
#
# This band does not teach honorific or humble speech (敬語). "Written
# voice" here means the plain declarative register of an essay or a report,
# not the register that changes with who is speaking to whom -- a different,
# larger system, untaught anywhere in this ladder, and not this band's job
# to start (see the planning document, section 1.5).
#
# content-source: every phrase in this file is a verified Tatoeba pair,
#   cited by id in the grammarNote and in the phrase's own tatoebaId field.
#   No training-canonical sentence is used anywhere in this band
#   (04-stage-reading.md §8).
```

---

## 4. The lessons

### Lesson 1 — How writing says "is" (order 274)

- **Title:** How writing says "is"
- **Can-do:** Read and produce plain factual statements the way an essay, a report or a definition
  states them — and know why you would never say である out loud to a friend
- **Pattern id:** `grammar.b3-de-aru`, `pattern: "である"`
- **Teaches:** である as the written-register plain copula, filling exactly the slot だ/です already
  fills, with the same three-tense/polarity shape Book Two already drilled once for だ: **non-past**
  (#236127 １、３、５は奇数である, "one, three and five are odd numbers"; #146742 少佐は大尉の上官で
  ある, "a major is above a captain"), **past, であった** (#199356 ナイジェリアはかつてイギリスの
  植民地であった, "Nigeria was once a British colony"), **negative, ではない** (any of 195 clean
  raw hits — e.g. #210379 その仕事はまだほとんど終わったと言える状態ではない, "the job isn't
  anywhere near done"). **The lesson's spine is the register boundary itself, named directly, not
  left implicit:** である/であった/ではない are correct in an essay, a report, a formal notice, a
  definition — and wrong, jarringly so, in a spoken sentence to a friend, where だ/だった/じゃない
  (already owned, `grammar.b2-plain-da`) are the only natural choice. A second, genuinely new piece:
  **であり, the copula's continuative/linking form**, joining two nominal-predicate statements the
  way "is X, and is Y" does in English — #220948 この世で男にとって最良のことは良妻を選ぶことであり、
  最悪のことは選び損なって悪妻を持つことである ("the best thing for a man is choosing a good wife,
  the worst is failing to and ending up with a poor one" — two であり/である clauses back to back).
  **Two lines of recognition, not re-teaching:** であるが, the concessive "though it is" (#100502
  彼は貧乏であるが、気位が高くて援助を求めない, "he is poor, but too proud to ask for help" —
  cross-reference already-owned `grammar.b2-join-node`'s family and band 2's concessive work);
  であるべき, "ought to be" (#232346 あなたはもっと理性的であるべきだ, "you should be more
  reasonable" — the same べき band 8 teaches, wearing である instead of だ).
- **Attestation:** 761 raw for である itself, sampled by suffix bucket rather than exhaustively
  hand-read given the volume (§1.4) — no contamination pattern found in any bucket sampled. であった
  111 raw, ではない 195 raw, であり 20+ raw, all sampled clean. The richest single pattern's raw
  count in this book, and — per §1.2 — correctly *not* the richest in teaching content: it is one
  paradigm, the same shape as `grammar.b2-plain-da`, in a different register.
- **Depends on:** `grammar.b2-plain-da`, directly and by name — the entire lesson is a contrast
  against it, and the grammarNote should open with that contrast, not bury it.
- **Exercises (earlier books):** `grammar.b2-plain-da` re-surfaced deliberately, as the direct
  register contrast, the same move band 07 made for `grammar.b3-tame-ni` against `grammar.b3-you-ni`.
- **Exercises (this band):** none — opening lesson.
- **New vocabulary:** none (mining).
- **Reading-library slice:** at least one text should carry である and であった in the same short
  passage (e.g. a passage using #174595's shape, both a locative において and a copula であった in
  one sentence) so the register reads as continuous rather than a single decorated word.

### Lesson 2 — Still changing (order 275)

- **Title:** Still changing
- **Can-do:** Say something is changing, gradually, and still under way — and read the same word
  doing ながら's own job in more formal writing
- **Pattern id:** `grammar.b3-tsutsu`, `pattern: "つつ"`
- **Teaches:** [ます-stem] + つつ in its two real jobs. **The dominant job by far, つつある**, "is
  in the process of ~ing" — a formal aspectual marker for a gradual, ongoing change, most often
  paired with an intransitive change-of-state verb: #164122 私のビジネスは再び回復しつつあります
  ("my business is picking up again"), #174615 古い伝統が消滅しつつある ("old traditions are
  crumbling away"), #173054 国際情勢は重大になりつつある ("the international situation is becoming
  grave"), #217282 コンピューターがこの会社に導入されつつあります ("computers are being introduced
  into this company" — つつある stacked on the passive, a direct callback to band 0). **The second
  job, bare つつ (no ある), doing ながら's own two jobs at a formal register:** simultaneous action —
  #144511 人は泣きつつ生まれ、泣き言を言いつつ暮らし、失望落胆して死ぬ ("we are born crying, spend
  our lives complaining, and die disappointed," two instances in one sentence); concession — #76645
  そうやって俺のことを気にしつつ、しかし素直になりきれない ("while worrying about me like that, but
  unable to admit it"), #185773 我々は将来を見据えつつ、今そこにある危機を乗り越えていかねばならない
  ("we must keep our eyes on the future while getting through the crisis at hand"). **Worth naming
  directly, not smoothed over:** band 2 found bare concessive ながら essentially unattested as free
  production in this same corpus — every hit a frozen idiom. つつ's own bare form has exactly what
  ながら's corpus lacks, which is worth a line for a curious learner, not just a silent substitution.
- **Attestation:** 36 raw, **25 genuine** (§1.4) — 22 つつある, 3 bare つつ across the two jobs
  above. Eleven contaminants, all unrelated words sharing the string つつ (azalea, "each," peck,
  wrap, a fixed adverb, a fixed noun, an adjective pair) — none a mis-segmented version of the
  pattern itself, a cleaner failure mode than most of this book's contaminated patterns.
- **Depends on:** `grammar.b2-join-nagara` (simultaneous ながら) and `grammar.b3-nagara-concessive`
  (band 2, concessive ながらも) — both re-surfaced directly as the contrast this lesson's grammarNote
  is built on.
- **Exercises (earlier books):** `grammar.b2-join-nagara`, `grammar.b3-nagara-concessive`
  re-surfaced deliberately.
- **Exercises (this band):** `grammar.b3-de-aru` — a citation like #217282 shows つつある sitting on
  top of a passive verb inside a である-register sentence, worth flagging as a natural pairing if the
  reading-library slice can supply one.
- **New vocabulary:** none.
- **Reading-library slice:** at least one text pairing つつある (change under way) with a plain
  ている sentence (change already settled) would show the aspectual contrast on real material.

### Lesson 3 — Because, in writing (order 276)

- **Title:** Because, in writing
- **Can-do:** Recognize and use the written register's word for "because" — the one that shows up
  in a report or an argument, not in conversation
- **Pattern id:** `grammar.b3-yue`, `pattern: "ゆえ"`
- **Teaches:** [noun, or plain non-past clause + が] + ゆえ(に), the written-register causal marker,
  in its two attested shapes: **noun + ゆえに**, "because of N" — #236966 その起源ゆえに、カナダ英語
  にはアメリカ英語とイギリス英語の両方の特徴がある ("because of its origins, Canadian English has
  features of both American and British English"), #148764 若さゆえに彼に対する告訴は取り下げられた
  ("the charges against him were dropped because of his youth"); **clause + がゆえに**, "because
  [clause]" — #191565 愛するがゆえに言葉にできないこともあるし、言わぬが花ということもあります ("my
  love for you won't let me tell you everything — some things are better left unsaid"). **それゆえ
  (に), sentence-initial "therefore, hence"** — #184184 学寮長のベイカーさんは、それゆえに自分の所有
  する小さい車のために、駐車場に特別なスペースを設けた ("the head of college, Miss Baker, had a
  special place in the car park for her small car" — a direct, attested pairing with band 1's
  ために in the same sentence, worth citing for that reason alone), #204782 それゆえここにとどまらざ
  るを得ないだろう ("hence, I shall have to stay here" — also pairing with band 8's ざるを得ない).
  **One line of recognition, not a re-teach:** ゆえ is occasionally written with the kanji 故 —
  #75231 しかし、天才であるが故に一般ピーポーから理解され難いというのは宿命とも言えるわ ("you could
  say it's fate that being a genius makes you hard for ordinary people to understand" — が故に, and
  also a である citation, worth flagging for the checkpoint). **The lesson's spine is the register
  contrast against `grammar.b2-join-kara`/`grammar.b2-join-node`, named directly:** から and ので are
  what a learner already says; ゆえ(に) is what the same idea looks like in an essay or a report.
- **Attestation: the thinnest lesson in this band, and the second-thinnest in the book — 7 genuine
  sentences (6 kana + 1 kanji, §1.3), all clean, no forced or manufactured examples.**
- **Depends on:** `grammar.b2-join-kara`, `grammar.b2-join-node` (the spoken contrast); `grammar.b3-tame-ni`,
  `grammar.b3-sei-de`, `grammar.b3-okage-de` (band 1) by cross-reference, not hard prerequisite —
  #184184 and #204782 both attest ゆえ cooperating with band 1/8 patterns in the same sentence.
- **New vocabulary:** none. **New kanji: none** — 故 is named once, as a recognition aside on one
  citation, not taught as production vocabulary (§1.3).
- **Exercises (earlier books):** `grammar.b2-join-kara`, `grammar.b2-join-node` re-surfaced as the
  direct register contrast.
- **Exercises (this band):** none — unrelated in form to lessons 1–2.
- **Reading-library slice:** essential for this pattern specifically — 7 sentences is not a bank.
  Prioritise sourcing further ゆえ material for the library before this lesson's checkpoint pool is
  finalised, the same flag band 07 raised for まい.

### Lesson 4 — In, formally speaking (order 277)

- **Title:** In, formally speaking
- **Can-do:** Mark where, or in what respect, something is true — the formal written cousin of に
- **Pattern id:** `grammar.b3-ni-oite`, `pattern: "において"`
- **Teaches:** [noun] + において, in its three attested jobs: **locative "in/at,"** most often
  temporal or geographic — #174595 古代において塩は希少で貴重な商品であった ("salt was rare and
  precious in ancient times" — also a である citation, cite together), #75722 米国において「リベー
  ト」は、主にメーカーが消費者に直接提供するインセンティブ手段として広く認識されている ("in America,
  'rebate' is widely recognized as an incentive makers give directly to consumers"); **domain/respect
  "in terms of,"** the job with no clean spoken equivalent — #219951 この服は品質においてあの服より
  もずっと優れている ("this suit is far superior to that one in quality"), #93694 彼女は、彼より、
  数学において劣っている ("she is inferior to him in math"), #200331 …仕事のスピードアップをはかると
  いう点において問題があるようだ ("there seems to be a problem in the point of speeding up work" —
  点において, a common collocation worth naming); **the fixed idiom 責任において**, "at one's own/on
  one's own responsibility" — #149797 自分の責任において何でも行いなさい ("do everything at your own
  risk"), #176788 自らの責任において、自らの良心に照らし合わせ、決定を下さなくてはならない ("you
  must decide at your own responsibility, in the light of your own conscience" — also pairing with
  band 8's なくてはならない). **One line worth naming, not teaching:** the same word has a
  noun-modifying twin, における (Xにおける Y, "Y in X," modifying a noun directly instead of a
  clause) — assigned to band 9 by the skeleton, not this band; a learner meeting における in the
  reading library before band 9 covers it should be able to recognize it as において's own cousin.
- **Attestation:** 50 raw, **47 genuine** (§1.4) — the second-richest pattern in this band after
  である, comfortably richer than every "thin but kept" pattern this book has shipped. 3 contaminants,
  all the same collision: 置く ("to put") conjugated to its て-form, spelled identically to に +
  おいて once written in kana — flagged for authoring in §8.
- **Depends on:** basic locative に (Book One, already owned) as the register this lesson replaces
  in formal contexts. No hard dependency within this book.
- **New vocabulary:** none.
- **Exercises (earlier books):** none new beyond basic に, already owned since Book One.
- **Exercises (this band):** none — unrelated in form to lessons 1–3, closes the band's teaching
  content; the checkpoint follows.
- **Reading-library slice:** a text pairing the locative sense with the domain/respect sense (e.g.
  #174595's shape, in-a-time-period plus a quality claim) shows the word's range without requiring
  における, which this band does not teach. **Flag for whoever authors band 9:** re-surface
  `grammar.b3-ni-oite` in the SRS queue before における's own lesson, the same "resurface for
  contrast" move band 07 used for ために/ように — the two words are close enough that teaching
  における cold, without the において contrast fresh, risks the same confusion band 07 worked to
  avoid.

### Lesson 5 — Band 10 checkpoint (order 278)

- **Id:** `b3.checkpoint-10`. `checkpoint: recognition`, `wordIds: []`, `phraseIds: []`, `kanji: []`,
  no `patternId` — same shape as every prior band's checkpoint.
- **Can-do:** Recognise everything this band taught, and read the gate text (§7) — the last band
  checkpoint of the book.
- **The shrinking set.** である (huge margin) and において (47 genuine) both hold back recognition
  items the learner never saw in teaching with no difficulty. つつ (25 genuine, 22 of them つつある)
  has the same comfortable margin. **ゆえ does not** — 7 genuine sentences total means the checkpoint
  cannot avoid reusing at least one or two of the teaching set's own citations, the same shape band
  1's thinnest patterns (ことだから, からには) and band 07's まい already accepted rather than forced
  a fix for. Stated plainly here rather than discovered at authoring time.
- **What the checkpoint should test that no single lesson can:** whether the learner reads である
  and knows, without being told, that a spoken sentence would never use it — a register-recognition
  item, not a translation item, is the honest test of lesson 1. A second worthwhile item type: a
  short passage using two or more of this band's four patterns together (§7 lists the natural
  pairings already surfaced — である+において in #174595, である+ゆえ in #75231, つつある+passive in
  #217282, ゆえ+ために in #184184) to test that the register reads as continuous, not as four
  isolated vocabulary items.
- **Placement:** at the band boundary (DR-021), and at the book's own last band boundary. No lesson
  in this band gates another's form, so there is no earlier point the checkpoint could sensibly move
  to. **Whether Book Three needs a further, separate completion checkpoint beyond this band's own
  recognition gate (per `04-stage-reading.md` §3's "consolidation recurring, completion once" and
  DR-023's precedent for Book One) is a book-assembly question, not this band's** — flagged, not
  decided, the same posture band 07/08 held for cross-band questions outside their own scope.

---

## 5. Totals

| | Count | Note |
|---|---|---|
| Teaching lessons | 4 | of the brief's six named entries: 2 were never patterns (passive as formality, noun-heavy style — §1), cut as lessons and folded into notes/citations instead; the remaining 4 all survive attestation |
| Checkpoints | 1 | band boundary, and the book's last (DR-021) |
| New words | **0** | mining carries vocabulary at this stage (`04-stage-reading.md` §3) |
| New kanji | **0** | every genuine citation sourced spells its pattern in kana; ゆえ's kanji variant 故 is named once, not taught (§1.3) |
| New grammar patterns | 4 | one per teaching lesson |
| New phrases (estimate) | **~28–34** | lesson 1 (である, richest) ~10–12; lesson 2 (つつ) ~7–8; lesson 3 (ゆえ, thinnest) ~5–6; lesson 4 (において) ~8–10; every one cited with a real Tatoeba id, several already named above |
| Attested example sentences available (genuine) | 761+ (である, sampled not exhaustive) + 25 (つつ) + 7 (ゆえ) + 47 (において) | §1 |
| Global order | **274–278** | 5 of the assigned 8 slots; 279–281 returned, not spent (§2) |

---

## 6. Judgment calls — where I think the plan needs a decision, or is silent

### 6.1 である's raw count is the biggest number in the book and the lesson is still one lesson, not several — restated as a general principle

§1.2 makes the specific case; the general principle is worth stating once because it will recur:
**raw attestation measures how often a word appears, not how much there is to teach about it.**
ように earned three lessons because it does three structurally distinct jobs, each adding a
different auxiliary verb carrying a different core meaning (band 07 §6.1). である does not have that
shape — its huge count is the copula being everywhere in formal writing, not five different facts
hiding inside one string. Measuring "how many lessons" against "how many sentences" without also
asking "how many distinct grammatical facts" would have produced the wrong answer here, in the
direction of padding rather than cutting for once. I think this is worth flagging explicitly because
every other high-number decision in this book so far has gone the other way (more lessons, not
fewer) — a planner who pattern-matches "big number → split it" without re-deriving the reasoning
each time will get である wrong.

### 6.2 Cutting two of six named entries at the concept level, not the pattern level

Every other band that trimmed its brief did so pattern-by-pattern: a named grammar item turned out
to be too thin, or redundant with an earlier band, and was dropped (band 07's べく, ことにする; band
08's whichever pattern's own §6 explains it). This band's two cuts are different in kind: `passive as
formality` and `noun-heavy style` were never grammar items with a string to search for. I did not
manufacture a search for either — there is nothing to search. `Passive as formality` is folded into
this document as citations (である+つつある+passive stacking in #217282, für example) and belongs, if
anywhere, in the checkpoint's own framing rather than a lesson; `noun-heavy style` is a true
description of what a passage using all four of this band's patterns plus band 9's nominalisers will
tend to look like, and the honest place for that observation is the gate text's own design (§7), not
a taught pattern. I want this recorded as its own category of cut, distinct from "attestation killed
it," because a future band planner checking this document for precedent should not read "two entries
died" and assume a search came up empty — no search was possible.

### 6.3 The honorific/敬語 scope boundary is a fifth gap of the same shape as §3a–§3d, found here rather than invented here

`book-three-bands.md` §3a–§3d catalogue four gaps (the passive, だろう/でしょう/そう, なければならな
い, the plain volitional) sharing one shape: connective grammar was the skeleton's organizing
principle, and each gap is something that is not a connective. Honorific speech is the same shape of
miss from the opposite direction — it *is* about register, which is this band's own territory, and
still nothing in the ladder teaches it. I am not proposing this band absorb it (§1.5 gives the
reasoning), but I think it is worth recording here rather than nowhere, since band 10 is the only
band whose title makes the gap easy to mistake for already covered. Whoever eventually plans a keigo
band or book should start from `book-three-band-00-passive.md` §6.4's own honorific-られる finding,
not from a blank page.

### 6.4 No vocabulary exception is worth arguing for

None of this band's four words carry an independent standalone life worth a vocabulary card the way
band 1 considered for せい/おかげ. である, つつ, ゆえ and において are all function words — they mark
grammatical roles, not things or actions — and none surfaced attached to a nominal use in this
corpus that would justify teaching it apart from the construction itself. This band ships zero new
words, cleanly, the same as band 07.

---

## 7. The gate text (band close)

Per `04-stage-reading.md` §3 and matching every sibling band's equivalent section: **specify what it
must contain, not which text it is** — the text-source decision (`book-three-bands.md` §2) is still
open and this band's design does not depend on which way it resolves.

- **It must be unreadable without this band.** At least one sentence's claim must turn on correctly
  reading である as a statement of fact rather than misparsing it, or on との clause it modifies
  through つつ, ゆえ or において — not just fluency, but whether the reader can tell what is being
  claimed, why, or where.
- **It should draw on at least three of this band's four `grammarIds`, and である should be one of
  them if at all possible** — given how densely である is attested in any formal passage (§1.4), a
  gate text of this book's level is very likely to carry it naturally; a second and third pattern
  alongside it is a realistic ask given における's own genuine attested pairings surfaced during
  research (である+において in #174595's shape, である+ゆえ in #75231's shape). **Do not require
  ゆえ specifically** — its own attestation (7 genuine, §1.3) makes that an unrealistic ask for a
  short passage, the same reasoning band 07 applied to まい and band 08 to its own thinnest three.
- **This is the natural place for the "passive as formality" and "noun-heavy style" observations
  the skeleton named but which are not lessons (§1, §6.2).** A gate text at this band's level, drawn
  from formal writing, will tend to feature agentless passive constructions (band 0's own territory)
  and noun-heavy modification chains as a matter of course — the checkpoint's own framing can name
  this as "notice how the sentence never says who," rather than pretending a dedicated lesson taught
  it.
- **Vocabulary coverage at or above the flow line (~98%, `04-stage-reading.md` §5)** once Books
  One–Two and every earlier band's material, plus this band's own, are in the known set — this is a
  reading checkpoint, not a vocabulary stress test.
- **If the interim text source is the clustered-sentence stopgap**
  (`data/reading/micro-readings.json`'s model), the checkpoint's own copy must say so rather than
  present it as a story — the restraint every sibling band's gate-text section already holds itself
  to.
- **No score, no pass mark.** Consistent with DR-020: presented once the shrinking recognition set
  empties, framed as "you can read this now," never as a test the learner can fail.
- **The schema gap is inherited, not new.** `src/content/lessons/schema.ts` has no field for a
  reading passage at all, first found by `book-three-band-03.md` §3 lesson 7 and confirmed again by
  every sibling band since. I am not re-solving it — recording, per that shared finding, that
  whoever owns the reading-library build should treat this as one gap shared across every band's
  checkpoint, not a fresh one for this band.

---

## 8. Authoring checklist

1. **Every phrase's source is a real Tatoeba id**, cited in the commit message per CLAUDE.md, and in
   the `Phrase.tatoebaId` field.
2. **Write every `pattern:` field as a bare Japanese literal** (no Latin characters —
   `grammarSurface` in `scripts/levelling.mjs` rejects any pattern string containing one): `である`,
   `つつ`, `ゆえ`, `において`. All four clear the two-kana minimum.
3. **Do not cite #216737, #234564 or #79178 as において's teaching examples** — all three are the
   verb 置く conjugated to its て-form, not the particle-like construction this lesson teaches
   (§1.4).
4. **Do not cite #174037, #78480, #197445, #76788, #77078, #219470, #76078, #195367, #80970,
   #159333 or #92099 as つつ's teaching examples** — eleven unrelated words that happen to contain
   the string つつ (§1.4).
5. **Do not spend a kanji budget on 故** — one genuine citation (#75231) is a recognition aside on
   ゆえ, not a production target (§1.3).
6. **Re-surface `grammar.b2-plain-da` in the SRS queue before lesson 1** — the entire grammarNote
   opens by contrasting against it, and the callback only lands if it's fresh. Same treatment for
   `grammar.b2-join-nagara` and `grammar.b3-nagara-concessive` before lesson 2, and
   `grammar.b2-join-kara`/`grammar.b2-join-node` before lesson 3.
7. **Commit messages** on every content commit must name the source, or the commit is rejected
   (CLAUDE.md).
8. **Run `pnpm walkthrough`** before merge, signed in — as a guest run it will not reach Book Three
   at all (`TIER_BOOK_LIMIT`).
9. **Run `pnpm ladder`** once this content lands, regenerating the book's ladder doc — `pnpm test`
   fails on a stale one.
10. **The text-source decision** (`book-three-bands.md` §2) blocks the reading-library slice and the
    gate text, not the four teaching lessons — those can be authored and shipped from the attested
    sentences in §1 alone, same as every band in this book so far.
11. **Flag for whoever plans band 9:** において (this band) and における (band 9) are the same
    grammaticalized word in two syntactic slots — clausal/adverbial here, noun-modifying there.
    Band 9's own document should re-surface `grammar.b3-ni-oite` before its における lesson (§4,
    lesson 4).
12. **Flag for whoever assembles the book:** orders 279–281 are unused by this band (§2). This is
    also the book's last band — confirm separately whether Book Three needs its own completion
    checkpoint beyond this band's recognition gate (§4, lesson 5) before treating order 278 as the
    book's actual final lesson.
```
