# Book Three, Band 0 — Doing, and being done to

**Status: design, not content.** This document specifies every lesson in the band in enough
detail that authoring the YAML is mechanical. **No Japanese sentence is composed here.** Every
example sentence named below is a real Tatoeba pair, cited by id, pulled from
`server/data/jmdict-examples-eng-3.6.2.json` — never invented, per `04-stage-reading.md` §8.

Source brief: `docs/plans/book-three-bands.md` §3a (binding — the reason this band exists at all,
and that it must open the book, before band 1). Background: `docs/plans/04-stage-reading.md` §3
(the band model), §5 (the reading library), §8 (sourcing). Sibling for shape and depth:
`docs/plans/book-three-band-01.md` — its orders are provisional precisely because this document
did not exist yet when it was written; **this document is what makes them settled.** Also read for
precedent: `docs/plans/book-three-band-02.md` §7.1–7.2 (two schema findings this band inherits) and
`book-three-band-03.md` §3, lesson 7 (the gate-text schema gap, also inherited, not re-solved
here). Book Two anchors: `src/content/lessons/b2-06-potential.yaml` (the られる collision this band
resolves) and `src/content/lessons/b2-07-quoted-speech.yaml` / `src/content/phrases/b2-07-quoted-speech.yaml`
(the promise this band cashes — the two `recognitionOnly: true` phrases there become producible
once this band ships).

**Shape landed: 7 teaching lessons + 1 recognition checkpoint, orders 196–203.** Every band 1–4
order shifts down by **8**: band 1 moves from 196–203 to 204–211, band 2 from 204–210 to 212–218,
band 3 from 211–218 to 219–226, band 4 from 219–226 to 227–234. That is the number this document
exists to deliver; see §8 for the full mapping.

**New vocabulary: 0. New kanji: 0.** Every auxiliary this band teaches — れる, られる, せる, させる
— is kana, full stop, with no independent kanji of its own. Every citable Tatoeba sentence used to
demonstrate a pattern is free to use a verb the learner does not yet own (some of the richest
examples do); per `04-stage-reading.md` §3, that vocabulary is not this band's to teach — it is
what the reading library and mining are *for*. See §7 for whether any exception is worth arguing
(it is not).

---

## 1. Why this band exists, and why it goes first

Restating `book-three-bands.md` §3a briefly, because everything below assumes it: Book Two chapter
7 taught と言われています for **recognition only**, and said so in its own grammarNote — "the form
itself — れる and られる — is next book's material." Two phrases in that chapter,
`quote.this-mountain-is-said-to-be-famous` and `quote.fish-is-said-to-be-good-for-you`, carry
`recognitionOnly: true` for exactly this reason. This band is what lifts that flag: once
`b3.passive-ichidan` ships, those two phrases have a home in production and the flag should come
off (see §8, item 5).

It also unblocks band 1. によって's single most common textbook job — marking the agent of a
passive sentence — was explicitly deferred by band 1's lesson 4 ("a lesson short of passive voice
can and can't say about it"), which sourced only the means/variation sense and screened out every
passive-agent hit it found. This band's lesson 7 is that deferred sense, finally taught.

And it resolves a collision Book Two already named and set down, not up. `b2-potential-ichidan`'s
own grammarNote says, in the learner's own material: "られる has another job this book has not
taught yet, so 見られる can mean I was able to see it or it was seen by somebody. Context does the
sorting." This band is where that context gets built. Lessons 1 and 2 open by naming the collision
directly, in the same words b2-06 used, rather than pretending it is new information.

---

## 2. Attestation — what I checked before committing anything, and how I separated the true hits

**Method.** I extracted every unique Tatoeba sentence pair embedded in the bundled corpus
(`server/data/jmdict-examples-eng-3.6.2.json`) — 25,983 pairs, the same figure band 1 reports — and
searched the Japanese text of every one for a set of surface-form markers, one per godan row plus
the ichidan/irregular shapes. Raw substring counts are cheap and, for this band specifically,
**badly misleading**: れる and られる are the surface of the passive, the potential (b2-06's own
collision), the honorific, and the spontaneous, and a fair number of ordinary ichidan verbs
(忘れる, 慣れる, 疲れる, 濡れる, 割れる, 倒れる…) simply end in "reru" without being derived from
anything. I read every short hit and a representative sample of the long ones, sentence by
sentence, and classified by what the sentence actually means, not by what string matched. Full
throwaway scripts in `/private/tmp/.../scratchpad/` if this needs re-running — not committed.

### 2.1 The false-positive classes, named once so the tables below don't have to repeat them

This band's search surface is worse than anything in band 1 (whose worst case was one false
positive in `ものだから` and one false trail in `から(に)は`). Six distinct collisions showed up,
and an author who does not know about them will cite the wrong sentence as "the easy short
example":

1. **なかれ — the classical prohibitive.** 「〜するなかれ」("do not do ~," e.g. #83758
   「物事は中途半端にするなかれ。」, #176040 「鶏口となるも牛後となるなかれ。」) is a fossilized
   archaic negative imperative, unrelated to modern れる/られる. It collides with every search for
   a か/た/ば-row + れ marker.
2. **われ／われわれ — the pronoun.** 我・我々, "I" and "we" in slightly formal registers
   (#191748 「われに自由を与えよ。」, #236262 「神はわれらの救いである」), collides with the
   う-row passive marker われ. Roughly 10–15% of raw われ hits in this corpus are the pronoun, not
   the passive of 言う/使う/行う/覆う.
3. **Lexicalized -reru ichidan verbs.** 忘れる, 慣れる, 現れる, 疲れる, 濡れる, 割れる, 倒れる,
   遅れる, 売れる and their kin are independent verbs whose *stems* happen to end in "re" — not a
   base verb plus られる. A bare られ/れる search catches every one of them. なれる is the sharpest
   case: it is overwhelmingly the **potential of なる** ("to become") — already b2-06's own
   material, godan る-row + れる, the exact shape 帰る → 帰れる takes — and only rarely the passive
   of 死ぬ. Of 47 raw なれ hits, the great majority are potential-of-なる (#144460
   「人は誰でも芸術家になれるわけではない。」, "Not everybody can be an artist"); the genuine
   passive minority is discussed in §2.4.
4. **Lexicalized godan-row collisions.** あこがれる (long for), のがれる (escape), すたれる (fall
   out of use), へこたれる (lose heart), もたれる (lean), たれる (hang down), ばれる (be found
   out) are each independent verbs that collide with one specific row marker (がれ, たれ, ばれ
   respectively) without being derived passives of anything.
5. **The classical -する passive, せられる.** 課せられる, 罰せられる, 処せられる, 称せられる,
   熱せられる, 魅せられる, 帰せられる, 列せられる (#215177, #99190, #208039, #82702, #143735,
   #198506, #122620, #183023 among others) are the archaic/literary passive of classical
   suru-compound verbs (課する, 罰する, 処する…) — a register point, not causative-passive. They
   collide with the causative-passive contraction search because せられる is a substring of both.
6. **Already-causative-shaped -asu/-kasu/-masu/-wasu lexical verbs.** だます (deceive), 悩ます
   (trouble), 励ます (encourage), 甘やかす (spoil), 見透かす (see through), 脅かす (threaten),
   満たす (fill), 交わす (exchange), わずらわす (bother), 惑わす (mislead), 跳ね飛ばす (knock down),
   吹き飛ばす (blow away), 延ばす (postpone) are ordinary transitive verbs whose own dictionary form
   already ends in ‑asu. Their **plain passive** — だまされる, 悩まされる, 励まされる — is
   orthographically identical to the **causative-passive contraction** of a different verb
   (待たせられる → 待たされる). Only knowing whether the base verb is already causative-shaped
   distinguishes them. This is the single most consequential trap in this band — see §2.6.

### 2.2 Passive formation — ichidan, 来る, する (lesson 1's material)

| Search | Raw | ≤30 chars | Verdict |
|---|---:|---:|---|
| られ (excl. させられ) | **581** | 445 | Rich, heavily mixed with potential/honorific/spontaneous — see below |
| される (irregular する) | **868** | 680 | Very rich, overwhelmingly clean |

される is the cleanest large bucket in the whole band: a sample of 30 spread across the set turned
up essentially no false positives — 発行される, 議論される, 規制される, 選出される, 召集される,
探索される, and dozens more, every one a genuine suru-compound passive. られる is the opposite
case: rich in raw count but the true passive reading has to be picked out by hand. Clean, citable
passive examples found this way: #75344 「売春宿から出てきたところを友人に見られてばつが悪かった。」
("As I left the brothel, I was embarrassed to be seen by my friends" — 見られる, unambiguously
passive from context, the exact ambiguity b2-06 flagged, resolved by the sentence around it);
#106722 「彼は殺人罪で刑務所に送られた。」("He was sent to jail for murder" — 送られる, clean);
#222336 「この橋は１０本の柱で支えられている。」("The bridge is supported by 10 posts" — 支えられる,
clean); #140789 「前世紀の中頃まで日本が封建国家であったことは、よくしられている。」("It is well
known that up to the middle of the last century Japan was a feudal state" — られている, clean);
#190121 「一番下の弟は祖母により幼年時代育てられた。」("My youngest brother was brought up by our
grandmother" — 育てられる, ichidan, and a preview of lesson 7's により). 来る's own passive
(こられる, distinct from こられる-as-potential) is thin in this corpus specifically — every こられる
hit I found reads as potential, matching b2-06's own remark that context does the sorting. I do not
force a 来る-passive example into lesson 1; ichidan and する carry it.

### 2.3 Passive formation — godan (lesson 2's material)

| Row marker | Raw | ≤30 chars | Genuine passive (sampled/read in full) | Verdict |
|---|---:|---:|---|---|
| かれ (く-row) | 128 | 110 | ~100+ (書かれる, 開かれる, 描かれる, 招かれた, 引かれた, 気付かれる, 好かれる…) | Rich |
| がれ (ぐ-row) | 23 | 22 | ~6 (つながれる, そがれた, 仰がれた, 受け継がれる) | Thin, expected — ぐ is a thin row everywhere in this book |
| され (す-row, overlaps irregular され) | 868 | 680 | large (話される, 貸される, 直される, plus every suru-compound) | Rich |
| たれ (つ-row) | 43 | 37 | ~10 (打たれる, 撃たれる, 先立たれる, 断たれる) | Solid once もたれる/たれる/すたれる are screened out |
| なれ (ぬ-row, 死ぬ only) | 47 | 35 | ~3, all 死なれる — see §2.4 | Thin, but see the adversity lesson |
| ばれ (ぶ-row) | 48 | 31 | ~40+ (呼ばれる dominant, 選ばれる, 運ばれる, 結ばれる) | Rich |
| まれ (む-row) | 152 | 121 | ~100+ (生まれる, 含まれる, 恵まれる, 好まれる, 頼まれる, 盗まれる, 囲まれる, 巻き込まれる) | Very rich |
| われ (う-row) | 254 | 196 | ~200+ (言われる, 使われる, 行われる, 覆われる, 奪われる, 見舞われる, 襲われる) minus ~10–15% pronoun noise | Very rich |

**る-row godan verbs (帰る, 走る) are the one row I do not attempt to isolate by string search.**
Their passive (帰られる, 走られる) is orthographically identical to the ichidan られる shape — the
same collision the te-form and plain-form chapters both flagged for this row (帰る "looks" ichidan
and isn't). Lesson 2's grammarNote should carry the same warning those chapters already gave, not
reinvent it: ask which class the verb is, not what letter it ends in.

**Net read, formation:** every row is attested well enough to teach, and four of eight rows are
genuinely rich (く, す, ぶ, む, う). This mirrors the potential chapter's own finding almost
exactly — not every row needs to be individually deep for the *rule* to be well attested, because
the rule is one substitution repeated across nine endings, and the learner meets それ once, not
nine times.

### 2.4 The adversity/indirect passive (lesson 4's material) — genuinely the thinnest slice, but richer than feared once split correctly

I ran two separate searches, because the construction has two faces that traditional reference
grammar (迷惑受身/間接受身, the "adversative" or "indirect" passive) treats as one category: a
transitive verb whose object *stays marked with を* while the person affected becomes the
grammatical subject, and an intransitive verb with no object at all, where the subject is simply
someone the event happened *to*.

| Search | Raw | ≤30 chars | Representative |
|---|---:|---:|---|
| を盗まれ | 6 | 6 | #157142 「私は更衣室で財布を盗まれた。」("I had my purse stolen in the changing room") |
| を取られ | 4 | 3 | #198662 「ぬかるみに足を取られた。」("I lost my balance on the muddy road") |
| 奪われる (in the われ set) | 1 | 1 | #147280 「女事務員が銀行からの帰途、１０万円入った封筒を奪われた。」("An office girl was robbed of an envelope containing 100,000 yen") |
| に死なれ | 2 (+1 more in the なれ set) | 2 | #161152 「私はガンで一人息子に死なれた。」("I had my only son die of cancer"); #115163 「彼は２年前に細君に死なれた。」("He had his wife die two years ago") |
| に降られ | 1 | 1 | #189616 「雨に降られてぬれちゃったよ。」("I was caught in the rain and got wet") — the canonical textbook example |
| に見舞われ | 3 | 3 | #124155 「東北地方は大変な冷害に見舞われた。」("The Tohoku district was badly hit by the cold weather") |

Split apart: retained-object ≈ **11** raw, intransitive-only ≈ **7** raw. Neither half alone clears
the bar comfortably, and 死ぬ、盗む、降る、見舞う share nothing morphologically that would let one
lesson's grammarNote generalize across them the way "a-row + れる" does for formation. **Combined,
18 raw sentences, every one short, every one clean** — no false-positive class touches this search
at all, because を盗まれ/を取られ/に死なれ/に降られ/に見舞われ are five-plus-character strings with
no lexicalized homonym anywhere near them. See §7.1 for why I teach these as one lesson rather than
two.

### 2.5 せる/させる — causative (lesson 5's material)

| Search | Raw | ≤30 chars | Verdict |
|---|---:|---:|---|
| させ (broad — suru-compound + ichidan causative + polite request) | 164 | 125 | Very rich |
| たせ (spot-check of one godan row) | 24 | 17 | Rich, dominated by 待たせる — see below |

させ alone is dense enough to source both senses this lesson needs — "make" (#109254
「彼は家政婦に部屋を掃除させた。」, "He had the maid sweep his room") and "let/allow" (#180380
「恐縮ですが、２月２７日の約束をキャンセルさせてください。」, "I am very sorry, but I must cancel
our appointment" — a させてください request) — plus the extremely common polite-request idiom
〜させてください／〜させていただけますか, which the search せてください alone attests **12** times
(2 of them the full させてください, the rest the godan equivalent, e.g. a hypothetical
歌わせてください shape). I did not exhaustively re-run every godan row the way lesson 2 needed to,
because by this lesson the row-shift move is the *third* time the learner has seen it (potential in
Book Two, passive in lessons 1–2 here) and one spot-check — たせ, dominated by the extremely common
待たせる family (#75345 「お待たせしました。」, #137945 「待たせてごめん。」, #11455691
「長らくお待たせして申し訳ありません。」) — is enough to confirm the row behaves exactly like the
other two auxiliaries. See §7.2 for why formation and sentence-usage are one lesson here, not two.

### 2.6 させられる — causative-passive (lesson 6's material)

**This is the pattern I most expected to fail, and it did not — once the false-positive class in
§2.1 item 6 is screened out by hand.**

| Search | Raw | ≤30 chars | Genuine causative-passive |
|---|---:|---:|---|
| させられ (full, unambiguous form) | 12 | 9 | **12/12** — every hit is genuine |
| たされ (godan contraction, つ-row) | 6 | 4 | 5/6 (待たされる ×4, 立たされる ×1; 満たされた is a false positive — plain passive of 満たす) |
| かされ (godan contraction, く-row) | 17 | 13 | ~9 (驚かされる, 寝かされる, たちのかされる, 気付かされる, 働かされる, 動かされる, 聞かされる, かかされる) |
| まされ (godan contraction, む-row) | 26 | 25 | ~4 (飲まされる ×2, つかまされる ×2 — the rest are だまされる/悩まされる/励まされる family, §2.1 item 6) |
| わされ (godan contraction, う-row) | 13 | 10 | ~6 (買わされる, 支払わされる, 負わされる ×2, and two borderline idioms) |
| ばされ (godan contraction, ぶ-row) | 7 | 5 | ~1 (並ばされる — the rest are 跳ね飛ばす/吹き飛ばす/延ばす family passives) |

The full uncontracted form させられる is small (12) but **completely clean** — every single hit is
a genuine "was made to X," with no false-positive class touching it at all: #115495
「彼は、自分の意志に反して契約書に署名させられた。」("He was made to sign the contract against his
will"), #146249 「上司に残業させられたんだよ。」("My boss made me work overtime"), #199894
「トムは授業中おしゃべりをしていたので居残りさせられた。」("Tom was given detention for talking
during class"). The godan *contraction* (せられる → される, colloquial and extremely common in
speech — 待たされる, "made to wait," is arguably the single most-used causative-passive shape in
ordinary Japanese) adds roughly 25 more genuine hits once screened, for a combined total near **37
usable sentences** — richer than the band brief predicted, and richer than three of band 1's seven
patterns. The trade is that reaching that number required real manual screening, not a bigger raw
count: だまされる, 悩まされる, 励まされる, 覚まされる, 済まされる, 見透かされる, 甘やかされる,
脅かされる, 交わされる and their kin are **not** causative-passive at all — they are the plain
passive of verbs that were already causative-shaped before anyone touched them, and using one as a
teaching example would silently teach the wrong derivation. Lesson 6's grammarNote must name this
trap explicitly; see §4.

### 2.7 によって as the agent marker (lesson 7's material)

Band 1 already reports によって/により's total: **157** hits, 86 at ≤30 characters, with the
caveat that "a real share of these need passive voice." I re-ran that same set against every
passive-shaped verb ending found across §2.2–2.4 (a joint regex over the row markers) to isolate
the agent-marking subset specifically:

**64 of the 157 によって/により sentences contain a passive-shaped verb.** Sampling all 64: this is
the cleanest large bucket in the entire band. The agent-marking construction is unambiguous once
combined with a passive verb — there is no honorific/potential/spontaneous reading of ...によって
[passive verb] the way bare られる has. Representative, all short and clean: #222882
「この音楽はバッハによって作曲された。」("This music was composed by Bach"), #151206
「紙は中国人によって発明された。」("Paper was invented by the Chinese"), #207435
「その洞穴はその少年たちによって発見されたのですか。」("Was the cave found by the boys?"), #216814
「サッカーのチームはトムによって引率される。」("The soccer team is led by Tom"), #75363
「管理人によってアカウントの認証が行われたあと、あなたに確認のメールが送られます。」("after your
account has been activated by an administrator"), and the register-mate により: #190121
「一番下の弟は祖母により幼年時代育てられた。」("My youngest brother was brought up by our
grandmother"). Band 1's own lesson 4 already cites two of these same-flavoured sentences
(#219367, #222410) as the passive-agent hits it had to screen *out* — this band's lesson 7 is where
they belong instead.

### 2.8 Totals

| Pattern (lesson) | Raw hits | ≤30 chars | Verdict |
|---|---:|---:|---|
| られる ichidan/する/来る (L1) | 581 + 868 = 1,449 | 445 + 680 = 1,125 | Rich, disambiguation by reading required |
| godan a-row+れる, aggregate (L2) | 128+23+43+47+48+152+254 = 695 | 552 | Rich overall, one thin row (ぐ) |
| direct passive sentence, に-agent (L3) | drawn from L1/L2 pools | — | Rich, plenty of clean に-agent hits |
| indirect/adversity passive (L4) | 18 | 17 | Thin but clean, no false positives |
| せる/させる causative (L5) | 164 + spot-checked godan rows | 125+ | Rich |
| させられる causative-passive (L6) | 12 + ~25 screened contractions ≈ 37 | ~30 | Solid once screened — contrary to the brief's own expectation |
| によって as agent (L7) | 64 of 157 | most | Very rich, cleanest bucket in the band |

**No pattern in this band scored zero. None is dropped.** The one genuinely thin slice — the
indirect/adversity passive — is thin in exactly the way the brief predicted, and is handled by
merging what could have been two threadbare lessons into one adequately-attested one (§7.1), the
same honesty band 1 practiced by *not* merging its own thin patterns, for the opposite reason: band
1's thin patterns were pragmatically distinct and stayed separate; this band's are the same
construction wearing two faces, and merging them is linguistically correct, not a workaround.

---

## 3. Naming and ids

Following `book-three-band-01.md` §2:

| Thing | Value |
|---|---|
| Band id | `b3.band-0` |
| Band title (learner-facing) | **Doing, and being done to** |
| Lesson `situation` | `Doing, and being done to` |
| Lesson ids | `b3.passive-ichidan`, `b3.passive-godan`, `b3.passive-sentence`, `b3.passive-adversity`, `b3.causative`, `b3.causative-passive`, `b3.niyotte-agent` |
| Checkpoint id | `b3.checkpoint-0`, `situation: Integration & checkpoint` |
| Pattern ids | `grammar.b3-passive-ichidan`, `grammar.b3-passive-godan`, `grammar.b3-passive-sentence`, `grammar.b3-passive-adversity`, `grammar.b3-causative`, `grammar.b3-causative-passive`, `grammar.b3-niyotte-agent` |
| Lessons file | `src/content/lessons/b3-00-passive-and-causative.yaml` |
| Phrases file | `src/content/phrases/b3-00-passive-and-causative.yaml` |
| Grammar file | `src/content/grammar/b3-00-passive-and-causative.yaml` |

**Why "band 0" and not a renumbering of bands 1–10.** The skeleton (`book-three-bands.md` §3a)
calls this "a missing band" that "has to come first," found *after* bands 1–10 were already named
and, in band 1's case, already broken down. Renumbering every existing `b3.band-N` id and every
cross-reference inside four already-written planning documents to make room for a new "band 1"
costs real editing risk for zero learner-facing benefit (the learner never sees a band number at
all — DR-024). Calling this **band 0** keeps every existing id stable and says exactly what
happened: found after the fact, belongs before everything else. The filename
(`book-three-band-00-passive.md`) and this section agree on that shape; whoever assembles the book
should keep it rather than "fixing" it into band 1.

---

## 4. The band header comment

Paste this at the top of the lessons file, in the style of band 1 and the potential/plain-form
chapters this band most resembles in shape.

```yaml
# Band 0 — Doing, and being done to.
#
# Book Two chapter 7 made a promise it could not keep on its own: と言われて
# います, taught for reading only, with a note in its own grammarNote that the
# form itself "is next book's material." This is that book, and this band pays
# the debt before anything else in Book Three is built, because によって --
# band 1's most formal "by" -- cannot mean what it usually means until a
# learner has met the passive it marks.
#
# The order follows Book Two's own rule-chapter precedent, not band 1's
# particle-by-particle shape, because this band is conjugation, not connective
# grammar -- the skeleton says so itself. Formation comes first and is split
# in two, exactly the way the potential chapter split it, for exactly the same
# reason: ichidan/する/来る take one shape, godan verbs take a different one
# across eight endings, and the two shapes do not teach well in one lesson.
# The ichidan shape carries a debt of its own on the way in -- it is the same
# られる the potential chapter already built, and that chapter's own words are
# worth repeating rather than paraphrasing: "見られる can mean I was able to
# see it or it was seen by somebody. Context does the sorting." This band is
# where the sorting gets built.
#
# Formation alone does not make a sentence. A third lesson teaches what
# changes around the verb once it goes passive -- the thing that was the
# object becomes the subject, and whoever did it, if named at all, takes に.
# A fourth lesson teaches the one passive English has no clean equivalent for:
# something happens to you, and the sentence says so whether or not you were
# ever the grammatical object of anything. 財布を盗まれた keeps を on the
# stolen wallet and makes the owner the subject; 雨に降られた has no object at
# all, because rain has nothing to take one. Reference grammars treat these as
# one construction -- the indirect or adversative passive -- because they are:
# the subject is not who the verb happened to, it is who the event happened
# to, for the worse. Teaching them apart would manufacture a distinction the
# grammar does not make, on top of being the thinnest material in the band by
# a wide margin, and manufacturing a distinction to hide thinness is exactly
# what this book's own rules exist to prevent.
#
# せる/させる earns one lesson, not two, and that is a real compression, said
# out loud rather than left to look like an oversight: by this point in the
# band a learner has done the row-shift move twice already -- potential in
# Book Two, passive twice over in lessons 1-2 here -- and the third telling
# needs far less room. Formation and the sentence it builds -- に for a
# causee taken from a transitive verb, を or に for one taken from an
# intransitive -- fit in one lesson because the scaffolding that used to need
# its own lesson has already been paid for twice.
#
# させられる closes the causative side by combining the last two lessons
# literally -- causative, then passive, stacked. Colloquial speech contracts
# the godan half of it (待たせられる, "made to wait," almost always surfaces
# as 待たされる), and that contraction is worth teaching directly rather than
# leaving a learner to meet it unglossed, but it comes with the band's sharpest
# trap: だまされる, 悩まされる, 励まされる and their kin look identical to a
# contraction and are not one -- they are the plain passive of a verb that was
# already causative-shaped before this lesson touched it. Getting this lesson
# wrong teaches a phantom derivation for real, common words.
#
# によって closes the band because it needed everything before it. Band 1's
# own によって lesson already named this dependency and worked around it by
# refusing the sense that needed it -- see that chapter's own header, and see
# section 6.1 below for the two-line update its text now needs.
#
#    1  something was done to it, the easy half   ichidan／する／来る, and the
#                                                   collision with "can"
#    2  something was done to it, the rest         every godan ending, one rule
#    3  who did it, and who it happened to         に for the agent, が for the
#                                                   one it happened to
#    4  when it happens to you                     を stays, or there was no
#                                                   object to begin with
#    5  making someone, letting someone            せる／させる, both jobs
#    6  made to do it                               させられる, full and
#                                                    contracted, and its trap
#    7  by, this time for real                      によって as the agent band 1
#                                                    could not spend
#
# Lessons 3 and 4 stand on 1 and 2; lesson 6 stands on both 1-2 and 5; lesson 7
# stands on 1-3. This band does not split before its checkpoint for the same
# reason the te-form, plain-form and potential chapters didn't.
#
# content-source: every phrase in this file is a verified Tatoeba pair, cited
#   by id in tatoebaId (added to the Phrase schema for exactly this book) and
#   named again in the grammarNote. No training-canonical sentence is used
#   anywhere in this band (04-stage-reading.md §8).
```

---

## 5. The lessons

### Lesson 1 — Something was done to it, the easy half

- **Order:** 196
- **Title:** Something was done to it, the easy half
- **Can-do:** Read and build a passive sentence for ichidan verbs, する and 来る — and tell it
  apart from what "can" already sounds like
- **Teaches:** られる for ichidan verbs (stem + られる, e.g. 見る → 見られる), される for する, and
  こられる for 来る (read こられる, the same く→こ shift the negative and potential already taught).
  The grammarNote must open by naming the collision directly, in b2-06's own words: this is the
  identical shape as `grammar.b2-potential-ichidan`. Disambiguation is contextual — a potential
  reading answers "am I able to," a passive reading answers "did this happen to me" or "who did
  this" — and the lesson's job is giving the learner three or four worked examples where only one
  reading makes sense, not a rule that removes the ambiguity (there isn't one).
- **Attestation:** られる 581 raw (excl. させられる), 445 ≤30 chars, mixed with potential/
  honorific/spontaneous — clean passive examples confirmed by reading: #75344
  「売春宿から出てきたところを友人に見られてばつが悪かった。」("I was embarrassed to be seen by my
  friends" — 見られる, unmistakably passive from context), #106722
  「彼は殺人罪で刑務所に送られた。」("He was sent to jail for murder"), #222336
  「この橋は１０本の柱で支えられている。」("supported by 10 posts"). される 868 raw, 680 ≤30 chars,
  overwhelmingly clean: any suru-compound (発行される, 議論される, 選出される) demonstrates it.
- **Depends on:** `grammar.b2-plain-dictionary` for the verb shapes; **`grammar.b2-potential-ichidan`
  and `grammar.b2-potential-ga`, directly and by name** — resurface both in the SRS queue before
  this lesson, since the entire teaching point is telling this shape apart from one the learner
  already owns.
- **New vocabulary:** none.
- **Reading-library slice:** at least one text at this band's level should place a genuinely
  ambiguous られる sentence (of the 見られる kind) next to enough surrounding context to resolve it,
  so the disambiguation skill is exercised in situ rather than only in the lesson's worked examples.

### Lesson 2 — Something was done to it, the rest

- **Order:** 197
- **Title:** Something was done to it, the rest
- **Can-do:** Read and build a passive sentence for any verb
- **Teaches:** one rule for all nine godan endings — move the last sound to the あ row, add れる:
  書く→書かれる, 泳ぐ→泳がれる, 話す→話される, 待つ→待たれる, 死ぬ→死なれる, 呼ぶ→呼ばれる,
  読む→読まれる, 買う→買われる (う→わ, the same exception the plain-negative and potential chapters
  already carry), 帰る→帰られる (る-row, the same trap those chapters flag — ask which class the
  verb is, not what letter it ends in). Unlike lesson 1, this shape does **not** collide with the
  potential (potential is え-row + る; passive is あ-row + れる — two different rows, two different
  endings, genuinely distinct strings for every ending except る-row verbs, which inherit lesson 1's
  ambiguity instead).
- **Attestation:** aggregate 695 raw across all eight rows, 552 ≤30 chars. Four rows are rich
  (かれ 128, され 868 shared with the irregular, ばれ 48, まれ 152, われ 254); one is thin but real
  (がれ 23, ~6 genuine after screening あこがれる/のがれる/すたれる out). Clean, citable examples:
  #216739 「サミットが開かれるのはこの部屋です。」("It is in this room that the summit will be
  held" — 開かれる), #195932 「ホワイトさんはみんなに好かれています。」("Miss White is liked by
  everyone" — 好かれる), #197882 「バラは花の女王と呼ばれている。」("The rose is called the queen of
  flowers" — 呼ばれる), #174478 「湖は緑の丘に囲まれている。」("The lake is surrounded by green
  hills" — 囲まれる).
- **Depends on:** lesson 1, immediately — the two form one concept split by mechanics, the same
  relationship `grammar.b2-potential-godan` has to `grammar.b2-potential-ichidan`.
- **New vocabulary:** none.
- **Reading-library slice:** any Band-0-level text tagged with this pattern should carry at least
  two different godan rows, not the same verb twice, so the row-shift generalizes rather than being
  memorized as one word's conjugation.

### Lesson 3 — Who did it, and who it happened to

- **Order:** 198
- **Title:** Who did it, and who it happened to
- **Can-do:** Build a full passive sentence — say what happened to something, and who did it, if
  it matters
- **Teaches:** what changes around the verb once it goes passive. The thing that was marked を in
  the active sentence becomes the subject, marked は or が; whoever did it, if named, takes に. This
  is not a new form — it is the sentence-level payoff lessons 1–2 could not show in isolation,
  mirroring `grammar.b2-potential-ga`'s own move (potential swaps を for が; passive keeps the
  undergoer as subject and adds に for the agent). Worth naming as a genuine parallel in the
  grammarNote, not a coincidence.
- **Attestation:** drawn from the same pools as lessons 1–2, filtered for a clean に-agent reading.
  Clean, short, citable: #195319 「ママに叱られますよ。」("You'll catch it from Mummy" — a
  scolding, agent marked, 10 characters), #91423 「彼女はみんなに愛されている。」("She is loved by
  everybody"), #165791 「私たちは今晩食事に呼ばれました。」("We have been invited to dinner this
  evening"), #216401 「ジェスチャーは彼らに使われていない。」("Gestures are not used by them"),
  #102256 「彼は男まさりの姉に育てられた。」("He was brought up by his strong willed sister").
- **Depends on:** lessons 1 and 2 — sentences here draw on both formation classes.
- **New vocabulary:** none.
- **Reading-library slice:** should carry at least one に-agent sentence where the agent is a
  person (人に叱られた-style) and one where it is not (国によって統制されている-style is lesson 7's
  job, but 政府に規制されている-style belongs here), so the learner meets に doing this job before
  meeting によって as its more formal cousin two lessons later.

### Lesson 4 — When it happens to you

- **Order:** 199
- **Title:** When it happens to you
- **Can-do:** Say that something happened to you — something was taken, lost, or done around
  you — the way Japanese says it and English cannot
- **Teaches:** the indirect/adversative passive, in both of its shapes, taught together and named
  as one construction rather than two: (a) a transitive verb whose object keeps を while the person
  affected becomes the subject — 財布を盗まれた, "I had my wallet stolen" (literally closer to "as
  for me, [someone] stole my wallet, and it happened to me"); and (b) an intransitive verb with no
  object at all, where the passive still applies to say the event happened to someone, usually
  unwelcome — 雨に降られた, "I got rained on." The grammarNote should say explicitly that English
  has no single sentence shape for this — "I had my wallet stolen" and "I got rained on" are
  unrelated constructions in English and the same one in Japanese — which is the whole reason this
  band's brief calls it out by name.
- **Attestation: the thinnest material in the band, 18 raw sentences total, but every one clean.**
  Retained-object: #157142 「私は更衣室で財布を盗まれた。」("I had my purse stolen in the changing
  room"), #103713 「彼は真っ昼間に車を盗まれた。」("He had his car stolen in broad daylight"),
  #198662 「ぬかるみに足を取られた。」("I lost my balance on the muddy road"), #147280
  「女事務員が銀行からの帰途、１０万円入った封筒を奪われた。」("An office girl was robbed of an
  envelope containing 100,000 yen"). Intransitive: #189616 「雨に降られてぬれちゃったよ。」("I was
  caught in the rain and got wet" — the canonical example), #161152
  「私はガンで一人息子に死なれた。」("I had my only son die of cancer" — 死ぬ is already owned,
  `vocab.shinu`), #115163 「彼は２年前に細君に死なれた。」("He had his wife die two years ago"),
  #124155 「東北地方は大変な冷害に見舞われた。」("The Tohoku district was badly hit by the cold
  weather").
- **Depends on:** lesson 3 — this lesson assumes the learner already has "the undergoer becomes the
  subject, the agent takes に" and is extending it to a case where the undergoer was never the
  direct object at all.
- **New vocabulary:** none.
- **Reading-library slice:** essential for this pattern specifically, same caution band 1 gave
  からには and ことだから — 18 sentences split across two sub-shapes is not a bank, and this lesson's
  real reinforcement has to come from the reading library, not the lesson alone. See §7.1 for why I
  did not split it further despite the thinness.

### Lesson 5 — Making someone, letting someone

- **Order:** 200
- **Title:** Making someone, letting someone
- **Can-do:** Say that you made or let someone do something, and ask politely to be allowed to do
  something yourself
- **Teaches:** せる/させる, formation and sentence usage together (see §7.2 for why this is one
  lesson where passive needed three). Formation: godan verbs shift to the あ row and add せる —
  the same shift lesson 2 just taught, same exceptions (買わせる, not 買あせる); ichidan verbs drop る
  and add させる; する → させる; 来る → こさせる. Usage: for a causee taken from a transitive verb,
  the causee takes に and the original object keeps を — attested at #146220
  「上手い外交官は、人に秘密を漏らさせる手をいつも使う人である。」("A good diplomat is a person who
  practices the technique of letting someone else let the cat out of the bag" — 人に秘密を漏らさせる,
  causee に, retained object を); for an intransitive verb, the causee more often takes を instead —
  #219081 「コメディは人を笑わせるものである。」("Comedy is something that makes you laugh" —
  人を笑わせる, no object to retain, causee takes を) and #74111
  「たまには赤ちゃんを泣かせておくのもいい。」("It's OK to leave the baby to cry on occasion" —
  赤ちゃんを泣かせる). The single most useful real-world shape is the
  request idiom 〜させてください／〜させていただけますか — "let me," the polite way to ask
  permission — and it deserves its own worked examples, not just a footnote.
- **Attestation:** させ 164 raw, 125 ≤30 chars — very rich, covering both "make" and "let/allow":
  #109254 「彼は家政婦に部屋を掃除させた。」("He had the maid sweep his room" — make), #180380
  「恐縮ですが、２月２７日の約束をキャンセルさせてください。」("I am very sorry, but I must cancel
  our appointment" — させてください request), #235023 「６人宿泊させて欲しい。」("We need
  accommodation for six" — causative + ほしい). Request idiom せてください/させてください attested
  12 times overall. Godan row spot-checked via たせ (24 raw, 17 ≤30 chars), dominated by the
  extremely common 待たせる family: #75345 「お待たせしました。」("Thank you for waiting"), #137945
  「待たせてごめん。」("Sorry to have kept you waiting"), #11455691
  「長らくお待たせして申し訳ありません。」("I'm sorry to have kept you waiting so long").
- **Depends on:** `grammar.b2-plain-dictionary`; and, as the row-shift's third telling, `b3.passive-godan`
  (lesson 2) by cross-reference rather than hard prerequisite — the grammarNote should say "you've
  done this shift twice already" rather than re-derive it.
- **New vocabulary:** none.
- **Reading-library slice:** should carry at least one 〜させてください-style request, since it is the
  single most common real-world causative shape and the one most likely to matter to a learner
  outside a textbook.

### Lesson 6 — Made to do it

- **Order:** 201
- **Title:** Made to do it
- **Can-do:** Say that you were made to do something, and recognise the colloquial contracted form
  when you meet it
- **Teaches:** させられる — causative, then passive, stacked, exactly the way the two auxiliaries
  read left to right. Full form: 待つ → 待たせる → 待たせられる (uncontracted), 食べる → 食べさせる →
  食べさせられる, する → させられる. Then the colloquial godan contraction: 待たせられる contracts to
  待たされる in ordinary speech, and this contraction is common enough (§2.6) to teach directly
  rather than leave the learner to meet it unglossed. The lesson's sharpest and most necessary
  warning: だまされる, 悩まされる, 励まされる, 満たされる and their kin **look identical** to this
  contraction and are not — they are the plain passive of verbs that were already causative-shaped
  (だます, 悩ます, 励ます, 満たす) before this lesson touched them. The grammarNote should give the
  test directly: strip される and ask whether what's left (だます, 悩ます) is already a complete,
  independent dictionary-form verb with its own meaning — if it is, this is a plain passive, not a
  contraction. Only strip further, to a genuinely different base verb (待たされる → 待つ, 働かされる →
  働く), does the causative-passive reading hold.
- **Attestation:** full form させられる 12 raw, 9 ≤30 chars, **all 12 genuine** — no false-positive
  class touches it: #115495 「彼は、自分の意志に反して契約書に署名させられた。」("He was made to sign
  the contract against his will"), #146249 「上司に残業させられたんだよ。」("My boss made me work
  overtime"), #99688 「彼は無理やり残業させられた。」("He was forced to work overtime"). Godan
  contraction, screened: ~25 genuine across the five rows checked, dominated by 待たされる (#77585
  「列に並んで長い間待たされた後…」, "After a long wait in line…"; #215992; #137946; #119130),
  働かされる (#102665 「彼は続けざまに五時間以上働かされた。」, "He was forced to work more than
  five hours on end"), and 気付かされる (#170697), 聞かされる (#76807), 並ばされる (#166069),
  買わされる (#215653), 支払わされる (#91507). Combined ≈37 usable sentences — see §2.6 for the
  full screening table.
- **Depends on:** lesson 5 (causative) and lessons 1–2 (passive) — this lesson is explicitly their
  combination and should be introduced that way, not as new material.
- **New vocabulary:** none.
- **Reading-library slice:** should carry at least one contracted godan form (a 待たされる-shaped
  sentence is the safest choice — no register risk, no ambiguity) so the learner meets the
  colloquial shape somewhere other than this lesson's own worked examples.

### Lesson 7 — By, this time for real

- **Order:** 202
- **Title:** By, this time for real
- **Can-do:** Say who or what did something, in the formal register — the sense band 1's によって
  lesson had to set aside
- **Teaches:** によって (and により, its more written register-mate, same as band 1 already
  taught) marking the agent of a passive sentence — this book's cleanest, richest teaching material
  by a wide margin. Explicitly frame this as the missing third job band 1's lesson 4 named and could
  not build: means (already taught), variation (already taught), and now agent. The grammarNote
  should open by naming that lesson directly — a learner who did band 1 already has によって/により
  in hand for two jobs and is picking up the third, not meeting the word from scratch.
- **Attestation: 64 of the 157 によって/により sentences in the corpus (band 1's own total) contain
  a passive-shaped verb — the cleanest large bucket in the entire band, with no honorific/potential/
  spontaneous collision at all, because a によって〜られる/される combination has no other reading.**
  #222882 「この音楽はバッハによって作曲された。」("This music was composed by Bach"), #151206
  「紙は中国人によって発明された。」("Paper was invented by the Chinese"), #207435
  「その洞穴はその少年たちによって発見されたのですか。」("Was the cave found by the boys?"),
  #216814 「サッカーのチームはトムによって引率される。」("The soccer team is led by Tom"), #190121
  「一番下の弟は祖母により幼年時代育てられた。」("My youngest brother was brought up by our
  grandmother" — により, the register-mate).
- **Depends on:** lessons 1–3 (passive formation and its に-agent sentence structure); by
  cross-reference, band 1's `grammar.b3-niyotte` (means/variation sense) — not a hard prerequisite
  in the dependency-graph sense, since band 1 now sits *after* this band, but the two lessons teach
  the same word's different jobs and should say so to each other. See §6.1.
- **New vocabulary:** none.
- **Reading-library slice:** the richest slice in the band to source — 64 clean attested sentences
  means this lesson's texts can be chosen for register variety (news-style, academic-style,
  historical-style) rather than scraped together from a handful of options.

### Lesson 8 — Band 0 checkpoint

- **Order:** 203
- **Title:** Band 0 checkpoint
- **Can-do:** Recognise everything Band 0 taught
- **`checkpoint: recognition`**, `wordIds: []`, `phraseIds: []`, `kanji: []`, no `patternId` — same
  shape as `b3.checkpoint-1`. Mastery gate, not a grade (DR-020): the remaining set shrinks to zero,
  retries unlimited, nothing recorded, misses rejoin the SRS queue.
- **The shrinking set, honestly sized.** For lessons 1–3, 5 and 7, the recognition pool should hold
  back sentences the learner has not seen in the teaching lesson — all five patterns are deep enough
  that this costs nothing. For lesson 4 (18 raw sentences total) and lesson 6's contracted-godan
  half, the honest choice, following band 1's own precedent exactly, is to **reuse teaching
  sentences rather than manufacture new ones that don't exist in the corpus.** A recognition pass on
  familiar material is still a real mastery gate — it tests whether the learner can identify what
  the construction is doing, not whether they have never seen the exact string before.
- **What this checkpoint is uniquely positioned to test that no earlier checkpoint could: the
  potential/passive disambiguation itself.** At least some recognition items should be られる
  sentences the learner has to read for meaning — "can" or "was done to" — rather than merely
  transcribe. This is the one place in the book so far where the shrinking-set format can carry a
  genuine comprehension check rather than a pure recall check, and it is worth using that
  deliberately rather than defaulting to the type-the-reading format every earlier checkpoint used.
- **The gate text** closes the band. See §8 for what it must contain.
- **Placement:** at the band boundary, coinciding with the ~10-lesson cadence at this band's size
  (DR-021). Lessons 3, 4, 6 and 7 all stand on earlier lessons in this band, so there is no earlier
  point the checkpoint could sensibly move to — the same constraint the te-form, plain-form and
  potential chapters all carried.

---

## 6. Judgment calls — where I think the plan needs a decision, or where I am departing from the suggested shape

### 6.1 Band 1's によって lesson needs a two-line update once this band exists

Band 1's lesson 4 (`b3.niyotte`, currently ordered 199, moving to 207 once this band's 8 slots are
inserted) says, in its own text: "passive voice is not built anywhere in Book One or Book Two" and
"a passive-agent によって sentence met in the reading library should be treated as incidental
exposure the learner is not expected to parse yet, not a lesson failure." Both statements are true
as of when band 1 was written and **false once this band ships.** I am not rewriting band 1's
document — that is a different band's file and not mine to edit — but flagging plainly, the way
band 1 itself flagged the ため(に)/band 7 overlap in its own §6.2, that band 1's authoring pass
should update those two sentences to point at this band's lesson 7 rather than silently ship a
stale claim. This is a two-line fix, not a redesign: band 1's lesson 4 correctly keeps sourcing only
means/variation によって, because that is still its job; it just needs to stop saying passive voice
doesn't exist.

### 6.2 The retained-object and intransitive adversity passive are taught as one lesson, against a literal reading of the brief's two bullets

The brief lists "the passive with を and に" and "the 'adversity' or suffering passive" as separate
items. I read the first as basic passive-sentence mechanics (lesson 3: に for the agent, the object
that keeps を disappearing into が the moment it becomes the subject) and folded the retained-を case
into the adversity lesson instead, because — argued at length in §2.4 and the header comment —
reference grammar treats 財布を盗まれた and 雨に降られた as one construction, not two, and the
attestation numbers support merging rather than fighting: 11 and 7 raw sentences respectively is two
thin lessons; 18 combined is one adequately-attested lesson. This is the opposite move from band 1's
§6.4, which kept three thin patterns *separate* because they were pragmatically distinct despite
sharing a family resemblance. I am not contradicting that precedent — I am applying its same test
(is the distinction real, or is a split just hiding thinness?) and getting the opposite answer,
because here the distinction genuinely isn't real: を盗まれた and 雨に降られた differ only in
whether the base verb happens to be transitive, and a learner who understands "the subject is who it
happened to, not necessarily who the verb was done to" understands both without needing two
separate rules.

### 6.3 せる/させる is one lesson where passive needed two (formation) plus one (sentence usage) — three total

I split passive formation by verb class and gave sentence-usage its own lesson (three lessons for
one auxiliary), then compressed causative formation and usage into one lesson for the same
auxiliary family. This looks inconsistent until the sequencing is considered: passive is the
learner's *first* encounter with れる/られる in this band, arriving right on top of a known
collision (potential) that needs real room to resolve. Causative arrives after the learner has done
the row-shift move three times total (potential in Book Two, passive twice here) and does not carry
a pre-existing collision to untangle. The economy argument is about what has already been paid for,
not about causative being a smaller rule — せる/させる's own に/を causee-marking split is a real
teaching point, and lesson 5 spends its own room on it; it just does not need a fourth lesson the
way passive needed a third, because lesson 3 already established "who does what to whom, marked
with に" as a concept, and causative reuses rather than re-derives it.

### 6.4 Honorific られる is named as a collision and explicitly kept out of scope

Several attested sentences surfaced an honorific reading of られる (居られる "to be [respectfully]",
おられた, 立たれる in a status sense) that is neither the passive nor the potential this band
teaches. `book-three-bands.md` §3's ten bands do not list keigo/honorific speech anywhere, and band
10 ("register and the written voice") is explicitly flagged in its own skeleton entry as needing
scrutiny before it is trusted. I recommend this band's lessons **name the honorific collision in one
line each**, the same way b2-06 named — not resolved — the spontaneous られる collision for 思われる,
and leave a full honorific-speech treatment to whichever later band or book actually owns keigo. It
would be a mistake for this band to grow an eighth lesson trying to cover it; that is a different,
larger topic (the whole register system, not one auxiliary) that deserves its own planning pass, not
a footnote stretched into a lesson.

### 6.5 The `pattern:` field has no clean literal for godan formation, and I am flagging it rather than solving it

`book-three-band-02.md` §7.1 found that `scripts/levelling.mjs`'s `grammarSurface` rejects any
`pattern:` string containing a Latin character and requires every ～-delimited fragment to be at
least two kana — Book Two's own `pattern: "godan: last sound to the え row, add る"` (a free English
description) would return `null`, untaggable, if it shipped in this book. That finding applies here
with a wrinkle band 2's own patterns didn't have: godan passive and causative have **no single fixed
literal at all** — 書かれる, 読まれる and 話される are three different strings for the same rule, unlike
のに or ものの, which are one fixed string each. The best value achievable within the constraint is
the bare auxiliary itself — `pattern: "～れる"` for lesson 2, `"～せる"` for lesson 5 — which is
taggable (a single two-kana fragment, no Latin) but coarse: it will flag every lexicalized ichidan
verb (忘れる, 慣れる) that happens to contain the same two kana, the identical class of noise §2.1
had to screen out by hand. I recommend accepting the coarse literal over shipping untaggable,
consistent with band 1's own acceptance of によって's imprecision (its "real share... need passive
voice" caveat was not a blocker) — but this is a pipeline-design question, not a lesson-content
question, and I am flagging it rather than deciding it, the same posture band 2 took with its own
finding.

### 6.6 The gate-text schema gap is inherited, not new

`book-three-band-03.md` §3, lesson 7 already found and named this precisely: `src/content/lessons/schema.ts`
has no field for a reading passage at all. Everything that document says applies to this band's
checkpoint unchanged — I am not re-deriving the finding, only confirming it also blocks
`b3.checkpoint-0`, and noting that this band, being first, is the earliest point in the ladder where
the gap actually bites. Whoever owns the reading-library build should treat this as one gap shared
across every band's checkpoint, not four separate tickets.

### 6.7 No vocabulary exception is worth arguing for

Every example sentence cited above uses at least one verb — 盗む, 降る, 見舞う, 招く, 悩む, 驚く — the
learner does not yet own as a vocabulary card. I considered whether any of them is central enough to
this band's *own* teaching point (the way band 1 considered せい and おかげ) to deserve an authored
exception, and concluded no: none of these verbs is more essential to demonstrating a passive or
causative form than any other transitive verb would be, and `04-stage-reading.md` §3 is explicit
that this is exactly what mining exists to absorb. This band ships zero new words.

---

## 7. The gate text (band close)

Same requirement `book-three-band-01.md` §7 specifies, restated for this band's material. The
actual text is not this document's call — the text-source decision (`book-three-bands.md` §2) is
still open, and nothing here depends on which way it resolves.

- **It must be unreadable without this band.** At least one sentence's meaning must turn on a
  passive or causative form this band taught — remove the reader's ability to parse られる, される
  or させる and the sentence becomes unparseable or, worse, parseable *wrong* (read as a "can"
  sentence when it means "was done to"). This band's gate text has a sharper bar than band 1's: it
  is not enough for the sentence to become harder without the pattern, it must become **actively
  ambiguous or misleading** without it, which is a real and checkable property given the
  potential/passive collision this band exists to resolve.
- **It should draw on at least three of this band's seven patterns.** Given the richness confirmed
  in §2, this is realistic even for a short passage — formation (lessons 1–2), a direct or agent-
  marked passive sentence (lesson 3 or 7), and ideally one causative or causative-passive form
  (lessons 5–6) would demonstrate the band's full arc rather than one corner of it. Do not require
  lesson 4's material (the adversity passive) to appear — its own attestation (§2.4) makes that an
  unrealistic ask for a short passage, the same reasoning band 1 applied to its own thinnest three
  patterns.
- **Vocabulary must sit inside the same ~98% known target every Band-0 text carries** —
  `04-stage-reading.md` §5's fixed number, not one this band gets to renegotiate.
- **It should read as connected text**, not an isolated sentence, for the reasons band 1's §7
  already gives at length.
- **No score, no pass mark.** Consistent with DR-020.

---

## 8. Totals, and the number every other band shifts by

| | Count | Note |
|---|---|---|
| Teaching lessons | 7 | argued in §6.3–6.4 against the brief's six-item list; one extra split for formation, one merge for adversity |
| Checkpoints | 1 | band boundary (DR-021) |
| New words | **0** | mining carries vocabulary at this stage; no exception argued (§6.7) |
| New kanji | **0** | every auxiliary is kana; incidental kanji from cited verbs ride in via mining or are already owned |
| New grammar patterns | 7 | one per teaching lesson |
| Attested example sentences available | 1,449 (L1) + 695 (L2) + 18 (L4) + 164+ (L5) + ~37 (L6) + 64 (L7) = just over 2,400 raw, with real screening required for L1, L2 and L6 | see §2 |
| Global order, this band | **196–203** | 8 slots (7 teaching + 1 checkpoint) |

**Every band 1–4 order shifts down by 8**, uniformly:

| Band | Old orders | New orders |
|---|---|---|
| 0 (this band) | — | **196–203** |
| 1 | 196–203 | **204–211** |
| 2 | 204–210 | **212–218** |
| 3 | 211–218 | **219–226** |
| 4 | 219–226 | **227–234** |

No id changes — every `b3.*` lesson, pattern and checkpoint id in bands 1–4 is stable; only the
numeric `order` field moves, mechanically, by +8.

---

## 9. Authoring checklist

1. **Sourcing.** Every phrase in this band is a verified Tatoeba pair. Cite the id in the phrase's
   `tatoebaId` field (added to the `Phrase` schema today, per this document's brief — band 2's §7.2
   finding is resolved as of this band) **and** in the `grammarNote`, matching the pattern this
   document uses throughout §5.
2. **Screen every られる/せられる citation by hand** before it ships. §2.1 names six distinct
   false-positive classes; the worst of them (だまされる-family plain passives masquerading as
   causative-passive contractions, §2.1 item 6) will not be caught by any automated check this
   codebase currently has — it requires reading the sentence.
3. **Do not cite Tatoeba #229619 or any of band 1's already-flagged traps** if this band's authoring
   pass reuses any band-1 material for cross-reference — unrelated risk, but worth restating since
   both bands touch によって.
4. **Update band 1's lesson 4 grammarNote** per §6.1 once this band exists — two sentences, not a
   redesign.
5. **Flip `recognitionOnly` to absent (or explicitly `false`) on `quote.this-mountain-is-said-to-be-famous`
   and `quote.fish-is-said-to-be-good-for-you`** in `src/content/phrases/b2-07-quoted-speech.yaml`
   once `b3.passive-ichidan` ships — the block comment in that file names this exact condition.
6. **Commit messages** on every content commit must name the source, or the commit is rejected
   (CLAUDE.md).
7. **Run `pnpm walkthrough`** before merge, signed in — as a guest it will not reach Book Three at
   all (`TIER_BOOK_LIMIT`).
8. **The text-source decision** (`book-three-bands.md` §2) blocks the reading-library slice and the
   gate text, not the seven teaching lessons — those can be authored and shipped from the attested
   sentences in §2 alone, same as band 1.
