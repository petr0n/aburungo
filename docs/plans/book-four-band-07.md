# Book Four, Band 7 — Only so far, and no way round it

**Status: design, not content. No Japanese sentence composed.** Every example is a Tatoeba pair
cited by id from `server/data/jmdict-examples-eng-3.6.2.json`, verbatim (`04-stage-reading.md`
§8). Written by the controller on 2026-09-06 with the tooling of `book-four-band-00.md`.

Source brief: `docs/plans/book-four-bands.md` §3 (the remainder of `04b`'s "obligation and
concession" and "stance" bands after Book Three chs. 3, 6, 9), §4, §6, §7, §9. Shape:
`book-four-band-00.md`. The learner has Books One–Three and Book Four bands 0–6 (orders 277–335).

**Shape landed: 8 teaching lessons + 1 recognition checkpoint, global orders 336–344.** The
skeleton listed ten patterns; three pairs share a lesson because each member is thin and the pair
is a natural contrast (ようがない/わけにはいかない, にしては/にしても/としても, がち/げ). The
skeleton's row said this band "may merge or shed lessons at breakdown"; it merged.

**New vocabulary: ~40 firm words. New kanji: ~50** (§5).

---

## 1. Attestation

Method as band 4 (≤32 characters). Script `scratchpad/mine/band678-candidates.mjs`.

| Lesson | Pattern | Clean | Notes |
|---|---|---|---|
| 1 | に過ぎない / にすぎない | 22 | Both spellings; teach both. Not すぎる (band 0). |
| 2 | ことはない | 23 | Two jobs: "never has" (おくれたことはない — Book Two's たことがある negated) and "no need to / cannot be too" (しすぎることはない). Only the second is new; the lesson says so. |
| 3 | までもない | 5 | 言うまでもない is a fixed phrase (4 of 5); 待つまでもない the productive one. |
| 4 | ようがない · わけにはいかない | 3 · 6 | Thin; paired. 言いようがない is fixed. |
| 5 | からといって | 6 | All genuine; three end in Book Three patterns (とは限らない, わけではない, てはいけない) — good callbacks. |
| 6 | といっても | 5 | All genuine. |
| 7 | にしては · にしても · としても | 6 · 8 · 10 | にしては includes 無駄にしては (false positive, #165155) and 鵜呑みにしてはならない (Book Three ch.9's てはならない) — screen; にしても includes にしてもらう (#221314, #172795, #172205 — the causative-benefactive, excluded). |
| 8 | 〜がち · 〜げ | 8 · 5 | Both suffixes, both thin, both clean once the ちくちく/げに false positives are removed. |

## 2. Why this band exists

Book Three's stance chapter taught what a speaker thinks is likely; its obligation chapter taught
what must be done; its concession chapter taught "although". This band fills the shapes between
them: *merely* (に過ぎない), *no need* (までもない, ことはない), *no way to* (ようがない), *cannot very
well* (わけにはいかない), *just because... doesn't mean* (からといって), *so-called* (といっても), *for
a...* (にしては), *tends to* (がち), *looks...* (げ). Every one turns up in editorial prose and in
ordinary talk, and every one is a form the learner has met unglossed in Book Three sentences (band
7's own #174777 sits inside Book Three ch.9's candidate set).

## 3. The lessons

Conventions as band 0.

### Lesson 1 — Merely

- **Order:** 336 · **Title:** Merely · **Can-do:** Say that something is no more than what it is
- **Teaches:** noun or plain clause + に過ぎない/にすぎない: nothing more than. Formal-leaning; often
  with 一介の, ただ, ほんの. Not band 0's すぎる (too much) — same kanji, opposite direction.
- **Candidates:** #89191 彼女は事実を述べていたに過ぎない。 · #110032 彼は一介のビジネスマンにすぎない。 ·
  #126972 地球は宇宙空間に漂う球体にすぎない。 · #178349 君の言っていることは机上の空論にすぎないよ。(君:
  band 2) · #205286 それは贋の真珠にすぎない。 · #110027 彼は一介の事務員にすぎない。
- **New words:** 事実 じじつ 1313960 s1 (N3) · 地球 ちきゅう 1420970 s1 (N3) · 真珠 しんじゅ 1363810 s1 · 事務員
  じむいん 1314280 s1 · 漂う ただよう 1489240 s1. Optional: 述べる (Book Three ch.10 verified), 一介 1161300
  (rare), ビジネスマン 1104920.
- **Kanji new to the manifest:** 実 球 珠 務 員 漂 (実 band 1; 員 band 0's 乗組員 optional; 地 band 1's
  地図 optional; 事 taught).

### Lesson 2 — No need, and never

- **Order:** 337 · **Title:** No need, and never · **Can-do:** Say that something need not be done,
  or cannot be overdone
- **Teaches:** plain verb + ことはない: "no need to" and, with すぎる, "cannot be too" (注意しすぎることは
  ない). The other ことはない — たことはない "has never" (Book Two's たことがある negated) and ということは
  ない (Book Three ch.10) — are the same string doing older jobs; name them, do not re-teach.
- **Candidates:** #148966 車を運転する時はいくら注意してもしすぎることはない。(ても: Book Three ch.4; すぎる:
  band 0) · #193171 もはや言うことはない。 · #184519 学ぶのに年を取りすぎているということはない。 · #229595
  アンディはけっしてデートにおくれたことはない。(the "never has" contrast) · #234585 アイディアが足りないと
  いうことはない。(足りない: band 2)
- **New words:** 運転 うんてん 1172830 s1 (N3) · 注意 ちゅうい 1426530 s1 · 学ぶ まなぶ 1206530 s1 (N3) · もはや
  1294170 s1 · デート 1081430 s1. Optional: アイデア 1014210.
- **Kanji new to the manifest:** 運 転 注 学 (学 — check; 年 taught).

### Lesson 3 — It goes without saying

- **Order:** 338 · **Title:** It goes without saying · **Can-do:** Say that something is too obvious
  to need stating
- **Teaches:** plain verb + までもない: no need to go so far as to. 言うまでもない (needless to say) is
  its fixed form and the one to own; 待つまでもない shows the frame is productive.
- **Candidates:** #189239 英語が世界語であることは言うまでもない。(であること: Book Three) · #119606 彼が当代
  随一の作家のひとりであるのは言うまでもない。(31 characters — `recognitionOnly`) · #211757 その解釈は学者を
  待つまでもない。 · #174777 言うまでもないことだがローマは１日にしては成らず。(にしては: lesson 7; 成らず
  classical — recognition)
- **New words:** 作家 さっか 1297510 s1 (N3) · 学者 がくしゃ 1206800 s1 (N3) · 解釈 かいしゃく 1199010 s1 (N3) ·
  世界 (author verifies — せかい; check taught) · 英語 (check taught). Optional: ローマ 2078870.
- **Kanji new to the manifest:** 解 釈 (作 者 学 世 界 — check).

### Lesson 4 — No way to, can't very well

- **Order:** 339 · **Title:** No way to, can't very well · **Can-do:** Say that something cannot be
  expressed or cannot be allowed
- **Teaches:** ます-stem + ようがない (no way to: 言いようがない, 解釈のしようがない) and plain verb +
  わけにはいかない (cannot very well, for social or moral reasons — not inability). Book Three ch.6
  taught わけ's other jobs; this is the one it left out.
- **Candidates:** #187759 何とも言いようがないなあ。(なあ: band 3) · #116346 彼の発言は他に解釈のしようがない。
  · #198292 ばかばかしいとしか言いようがない。(しか: Book Two) · #84279 負け犬になるわけにはいかない。 · #82060
  僕はその問題を黙って見過ごすわけにはいかない。(僕: band 3) · #194466 [ALREADY CARDED in b3-05-stance -- pick another] もうこれ以上延ばすわけにはいかない。 ·
  #177201 [ALREADY CARDED in b3-05-stance -- pick another] 君は自分の健康を度外視するわけにはいかない。
- **New words:** 黙る だまる 1534930 s1 (N3) · 健康 けんこう 1256170 s1 (N3) · 以上 いじょう 1155120 s1 (N3) ·
  延ばす のばす 1600290 (the "postpone" sense — not s1 "grow long"; author picks) (N3) · 発言 はつげん
  1477350 s1. Optional: 何とも 1188690 (N2), 他に 1203280, 見過ごす 1612560, 負け犬 1498010.
- **Kanji new to the manifest:** 黙 健 康 延 発 言 (発 band 6; 言 — check; 以 Book Three ch.5).

### Lesson 5 — Just because

- **Order:** 340 · **Title:** Just because · **Can-do:** Deny that one fact licenses a conclusion
- **Teaches:** plain clause + からといって (and だからといって sentence-initial): "just because X, it
  doesn't follow that Y" — the second half is almost always a negative or a Book Three pattern
  (とは限らない, わけではない, てはいけない, ことにはならない). State that as the strong tendency it is.
- **Candidates:** #229853 ある人が間違いをしたからといってそれを笑うのは無作法である。(31 characters —
  `recognitionOnly`) · #137970 体積が大きいからといって常に重量も重いとは限らない。(とは限らない: Book
  Three ch.10, recognition there — now produced) · #208789 その人が申し分がないからといって、恋に落ちる
  わけではない。(わけではない: Book Three ch.6) · #85165 貧相な身なりをしているからといって、人を軽べつしては
  いけない。(てはいけない: Book Three ch.9) · #203835 [ALREADY CARDED in b3-05-stance -- pick another] だからといって異議があるわけではない。
- **New words:** 間違い まちがい 1215320 s1 (N3) · 笑う わらう 1351360 s1 · 常に つねに 1355970 s1 (N3) · 重量
  じゅうりょう 1336900 s1 (N2) · 異議 いぎ 1157580 s1 (N2). Optional: 体積 1409560 (N2), 身なり 1365570.
- **Kanji new to the manifest:** 違 笑 常 重 量 異 議 (違 Book Three ch.6; 重 taught).

### Lesson 6 — So-called

- **Order:** 341 · **Title:** So-called · **Can-do:** Grant a label and then qualify it
- **Teaches:** noun or clause + といっても: "though I say X / though it's called X, in fact..."; and
  といってもいい (one could say). Book Three ch.3's とはいえ is its written cousin — name the pair.
- **Candidates:** #147897 宿屋といってもまるで丸太小屋のようだった。(ようだ: Book Three ch.6) · #215953 ジムは
  多才な人といってもいいだろう。(だろう: band 2) · #90824 彼女は歌手といってもお粗末なものだ。(ものだ: band
  2) · #190639 一口に英会話教材といっても、千差万別だ。(千差万別 idiom — gloss) · #76867 いくら壁が高いと
  いっても、私も最初はおっかなびっくりでしたよ。(31 characters — `recognitionOnly`)
- **New words:** まるで 1216280 s1 (N3) · 歌手 かしゅ 1193290 s1 (N3) · 壁 かべ 1509290 s1 · 宿屋 やどや 1337230
  s1 · 教材 きょうざい 1237110 s1. Optional: 多才 1407690, 英会話 1174380, 最初 (band 6).
- **Kanji new to the manifest:** 歌 壁 宿 屋 教 材 (歌 手 — check).

### Lesson 7 — For a, even so, even if

- **Order:** 342 · **Title:** For a, even so, even if · **Can-do:** Judge against an expectation,
  and concede a hypothetical
- **Teaches:** noun + にしては ("for a" — against the norm: ６月にしては寒い, 新聞記者にしては腕がいい);
  にしても / それにしても / いずれにしても ("even so, in any case"); plain clause + としても ("even if,
  even supposing", and 〜としても〜としても "both as... and as..."). Three forms, one family, one
  lesson; the checkpoint keeps them apart.
- **Candidates:** #172415 今頃にしては暖かい。 · #235070 ６月にしては寒い朝だ。 · #179511 駆け出しの新聞記者に
  しては腕がいい。(腕: band 0) · #76610 それにしても、幼稚園というところは、季節の行事にとても敏感です。(31
  characters — `recognitionOnly`) · #202966 チャンスというものはいずれにしても、まれにしかない。(というもの:
  band 2) · #184192 学生服は普段着としても式服としても着られるので便利だ。(30 characters) · #225195 ゲンドウが
  この件に関与していたとしても不思議ではない。 · #78092 両者の間には、あったとしても、相違はごくわずかである。
- **New words:** 季節 きせつ 1222840 s1 · 不思議 ふしぎ 1492570 s1 (N3) · 件 けん 1255940 s1 (N3; Book Three
  ch.10 verified the reading) · チャンス 1078040 s1 · わずか 1240750 s1 (N3). Optional: 今頃 1289160, 幼稚園
  1545260 (N2), 行事 1281930 (N2), 敏感 1491070, 相違 1400820 (N2), 両者 1553650.
- **Kanji new to the manifest:** 季 節 思 議 件 (幼 稚 園 敏 感 相 違 両 if carded).

### Lesson 8 — Tends to, looks

- **Order:** 343 · **Title:** Tends to, looks · **Can-do:** Say what someone tends to do, and how
  they look while doing it
- **Teaches:** two suffixes: ます-stem or noun + がち (prone to, usually of something undesirable —
  忘れがち, 病気がち; ありがち "run-of-the-mill") and adjective stem + げ (looking..., 不安げ, 楽しげ,
  得意げ; adverbial げに). Both make な-adjectives. Contrast band 2's そう (appearance now) — げ is
  the person's air, そう the thing's likelihood; a tendency, not a law.
- **Candidates:** #180618 共同責任は無責任になりがちだ。 · #145631 寝不足だと注意が散漫になりがちです。(注意:
  lesson 2) · #189416 運動が健康の鍵であるのを私たちはとかく忘れがちだ。(健康: lesson 4) · #163123 うちの息子は
  病気がちだ。(息子: band 4) · #100488 彼は不安げにいすの上でもじもじした。(不安: band 2) · #86737 彼女は宝石
  を得意げに見せびらかした。(宝石: band 0) · #146991 小さな鳥が楽しげにさえずっている。 · #209336 その女性は
  悲しげで、その上疲れているようだった。
- **New words:** 運動 うんどう 1172910 s1 (N3) · 女性 じょせい 1345250 s1 · 人々 ひとびと 1580650 s1 · 見える
  みえる 1259140 s1 · その上 そのうえ 1006880 s1 (N3). Optional: 無責任 1530360, 寝不足 1360270, 小さな
  2136180, 得意 (author verifies).
- **Kanji new to the manifest:** 責 性 見 (性 見 band 1; 運 lesson 2; 女 上 taught; 鍵 鳥 疲 if carded).

### Lesson 9 — Chapter 8 checkpoint

- **Order:** 344 · **Title:** Chapter 8 checkpoint · **Situation:** Integration & checkpoint ·
  `checkpoint: recognition`
- Pairs worth weighting: に過ぎない against すぎる; ことはない (no need) against たことはない (never);
  わけにはいかない against Book Three's わけがない; にしては against にしても against としても; がち
  against そう. No gate text (blocked).

## 4. Gate text and mining budget

Blocked; per-lesson word lists stand in.

## 5. Totals

| | Count |
|---|---|
| Teaching lessons | 8 · Checkpoints 1 · Orders 336–344 |
| Grammar patterns | 12 across 8 lessons |
| Phrases | ~44 |
| New words | ~40 firm, 19 on the N3 gap list, 2 on N2; ~25 optional |
| New kanji | **~50** (§3 lists per lesson; 彼 私 recur in every sentence and were never placed — the wiring pass rules once for the book) |
| `recognitionOnly` | #119606, #229853, #76867, #76610 (over 30 characters); #174777 (classical ending) |

## 6. Authoring checklist

As band 0's, plus: screen にしても for にしてもらう and にしては for 無駄にしては; card ことはない's two
jobs as two cards with the note saying which is new; chapter id `b4.band-7`, chapter 8,
checkpoint "Chapter 8 checkpoint", phrase ids `b4band7.<slug>`, file stem `b4-07-limits`, orders
336–344, `kanji: []` throughout.
