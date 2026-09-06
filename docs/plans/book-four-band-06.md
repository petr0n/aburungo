# Book Four, Band 6 — In relation to

**Status: design, not content. No Japanese sentence composed.** Every example is a Tatoeba pair
cited by id from `server/data/jmdict-examples-eng-3.6.2.json`, verbatim (`04-stage-reading.md`
§8). Written by the controller on 2026-09-06 with the tooling of `book-four-band-00.md`.

Source brief: `docs/plans/book-four-bands.md` §3 (the relation-particle remainder of `04b`'s
"formal connectives"), §4, §6, §7, §9. Shape: `book-four-band-00.md`. The learner has Books
One–Three (Book Three ch.2 taught によって/により, ch.11 において/における) and Book Four bands 0–5
(orders 277–326).

**Shape landed: 8 teaching lessons + 1 recognition checkpoint, global orders 327–335.** として
is thin after screening (its 171 raw hits are mostly と + して) and the author is asked to find two
more from the raw set; everything else is comfortably attested.

**New vocabulary: ~42 firm words** — this band's sentences are the most abstract so far (society,
economy, science), and the words follow. **New kanji: ~60** (§5) — the highest of any band; the
wiring pass should budget for it.

---

## 1. Attestation

Method as band 4 (≤32 characters). Script `scratchpad/mine/band678-candidates.mjs` (throwaway).

| Lesson | Pattern | Clean | Notes |
|---|---|---|---|
| 1 | に対して / に対し | 65 | Rich. "Towards / against / per" — three senses on one particle; the lesson sorts them. |
| 2 | にとって | 54 | Rich. #122337 uses 外人 — a loaded term; card it with the note, or prefer another. |
| 3 | として | **2 usable of 171** | かっとして, ぼうっとして, きちんとして are と + して. The author screens the raw set for noun + として ("in the role of") and finds two more. |
| 4 | につれて | 14 | All genuine. |
| 5 | とともに / と共に | 11 + 5 | Both spellings ordinary; teach both. |
| 6 | を通して / を通じて | 10 | #237020 目を通して (band 0) and #176648 通してくれた are the verb 通す — excluded; #75809 is clinical — excluded. |
| 7 | に加えて · に基づいて | 5 · 8 | Thin but clean; two patterns in one lesson. |
| 8 | こそ · によると/によれば | 29 (screened for こそこそ, こそ泥, そこそこ, ようこそ) · 23 | こそ's clean set is ~8; によれば pairs with band 2's そうだ hearsay (#145165 carded there — not here). |

## 2. Why this band exists

Book Three gave the learner the connectives of cause, contrast, condition and time. What it did
not give is the set of particle-compounds that written and formal Japanese uses to say *in
relation to what*: towards, for, as, with, through, in addition to, based on, according to. Every
newspaper sentence carries one; Book Three's own sentences carried them unglossed (に対して appears
in its chapter 2 header material). `04b` filed them under "formal connectives"; they are taught
here as a family because they share one shape — noun + compound particle — and one lesson each.

## 3. The lessons

Conventions as band 0.

### Lesson 1 — Towards, against, per

- **Order:** 327 · **Title:** Towards, against, per · **Can-do:** Say what an action or attitude is
  directed at
- **Teaches:** noun + に対して (に対し in writing): the target of an attitude (私に対してぞんざい),
  opposition (ドルに対して弱く, 合衆国に対して宣戦), and "per / in return for" (サービスに対してチップ).
  Contrast にとって (lesson 2) — the two are the classic confusion and the checkpoint tests it.
- **Candidates:** #211198 その警官は私に対してかなりぞんざいだった。 · #164280 私のおいは卵に対して
  アレルギー体質だ。 · #122704 日本には良いサービスに対してチップを払う習慣はない。 · #188511 欧州通貨はドル
  に対して弱くなった。 · #219416 この問題に対して可否の論が色々とあった。
- **New words:** 習慣 しゅうかん 1333090 s1 (N3) · 払う はらう 1501620 s1 · かなり 1590560 s1 (N3) · 警官
  けいかん 1252330 s1 · 通貨 つうか 1433050 s1 (N3). Optional: 欧州 1181190, サービス 1055000, 可否 1191130.
- **Kanji new to the manifest:** 習 慣 払 警 官 貨 (通 band 2? — 通 is in the aggregate as new; wiring rules).

### Lesson 2 — For someone, from their side

- **Order:** 328 · **Title:** For someone, from their side · **Can-do:** Say how something stands
  from a particular person's or group's point of view
- **Teaches:** noun + にとって: from the standpoint of (彼にとって不利, 外国人にとって覚えにくい). Not
  a target (that is に対して) and not an actor. Often followed by an evaluation (不利, 名誉, 危険).
- **Candidates:** #221114 この証拠は彼にとって不利だった。 · #214328 スポーツマンにとって視力が悪いのは
  不利だ。 · #122337 日本語は外人にとって覚えにくい。(外人: note the register; 外国人 is the neutral word
  — lesson 8's band 8 teaches it) · #97879 彼らはその男を社会にとって危険人物と考えた。 · #188241 音読は
  彼にとってたいへん骨の折れる仕事であった。(骨の折れる idiom; であった: Book Three ch.11)
- **New words:** 証拠 しょうこ 1351600 s1 · 不利 ふり 1495220 s1 (N3) · 社会 しゃかい 1322700 s1 · 日本語
  にほんご 1464530 s1 (untaught as a word — check the manifest) · 彼ら かれら 1483090 s1 (N3). Optional:
  視力 1312150, 音読 1183990.
- **Kanji new to the manifest:** 証 拠 利 (視 力 音 読 if carded; 社 会 taught; 彼 — never placed, wiring rules).

### Lesson 3 — In the role of

- **Order:** 329 · **Title:** In the role of · **Can-do:** Say in what capacity someone acts
- **Teaches:** noun + として: as, in the capacity of (政治家として, インストラクターとして働く);
  としては (as for, from the standpoint of — a topic); としても is band 7's. Separate from と + して
  (かっとして) by the noun in front.
- **Candidates:** #143189 政治家として、彼は、演技のうまさを目一杯活用している。 · #93582 彼女は２０代に
  エアロビクスのインストラクターとして働いていた。 · **two more from the raw set**, author's choice,
  noun + として, ≤32 characters, single utterance.
- **New words:** 政治家 せいじか 1375980 s1 · 演技 えんぎ 1176820 s1 (N3) · 活用 かつよう 1208460 s1 (N3).
  Plus the words of the two added sentences.
- **Kanji new to the manifest:** 治 演 技 (政 band 2; 家 用 — 用 band 0).

### Lesson 4 — As one thing changes, so does another

- **Order:** 330 · **Title:** As one thing changes, so does another · **Can-do:** Tie two changes
  together
- **Teaches:** plain verb or noun + につれて: as X proceeds, Y changes (時が経つにつれて, 冬が近づく
  につれて). Both halves are changes; a one-off event does not go in front. Sit beside Book Three's
  〜ば〜ほど (ch.7) and とともに (lesson 5).
- **Candidates:** #150630 時間がたつにつれて我々の希望は消えた。 · #124386 冬が近づくにつれて日が短くなる。
  (近づく: band 0) · #150703 時が経つにつれて、悲しみは薄らぐ。 · #225478 クリスマスが近づくにつれて景気は
  いくらか回復した。 · #144340 人間の物欲はその収入が増すにつれて大きくなる。 · #211172 その芸術家は
  年を取るにつれて画風が変わるであろう。(であろう: band 2)
- **New words:** 希望 きぼう 1219910 s1 (N3) · 景気 けいき 1250830 s1 (N3) · 回復 かいふく 1199720 s1 (N3) ·
  人間 にんげん 1366770 s1 (N3) · 収入 しゅうにゅう 1330790 s1 (N3). Optional: 我々 1607050 (N3), 増す
  1403120 (N3), 変わる 1510790 (N3), 悲しみ 1590550, 芸術家 1253070.
- **Kanji new to the manifest:** 希 望 景 気 回 復 収 (回 band 3; 復 band 2; 人 間 taught; 我 増 悲 芸 術 if carded).

### Lesson 5 — Together with

- **Order:** 331 · **Title:** Together with · **Can-do:** Say that two things happen or move
  together
- **Teaches:** noun + とともに / と共に: accompaniment (私と共に来て), simultaneity (大音響とともに
  爆発), and change-with-change in writing (時流とともに進む — where speech says につれて). Formal.
- **Candidates:** #165692 私たちは時流とともに進まなければならない。(なければならない: Book Three ch.9) ·
  #74572 その瞬間、大音響とともに爆発した。 · #147615 春の訪れとともにつぼみはぱっと花咲く。 · #195178
  マリーゴールドは太陽とともに起きる。 · #77649 冷戦はソビエトの崩壊と共に終わった。 · #102633 彼は他の
  大勢の人達と共に亡命した。
- **New words:** 瞬間 しゅんかん 1341210 s1 (N3) · 爆発 ばくはつ 1475910 s1 (N3) · 太陽 たいよう 1408370 s1
  (N3) · 崩壊 ほうかい 1516280 s1 · 人達 ひとたち 1368740 s1. Optional: 訪れ 1852840, 亡命 1518730, 冷戦.
- **Kanji new to the manifest:** 瞬 響 爆 発 陽 崩 壊 達 (共 進 春 冷 戦 命 if carded).

### Lesson 6 — Through

- **Order:** 332 · **Title:** Through · **Can-do:** Say what something passes through or comes by
  way of
- **Teaches:** noun + を通して / を通じて: physically through (葉を通して日光, コートを通して), and by
  means of a person or medium (彼を通して知り合いになった). Not the verb 通す (目を通す, band 0) — the
  note separates them. を通じて is the more written twin.
- **Candidates:** #217221 こんもりと茂った木々の葉を通して日光が差し込んだ。 · #77662 冷たい風が彼のコートを
  通して身にしみた。 · #95807 彼を通して私は町の有力者と知り合いになった。(町: band 2) · #82485 望遠鏡を通して
  みると、惑星はまったく新たな様相を呈する。(てみる + と: band 0; 31 characters — `recognitionOnly`)
- **New words:** 日光 にっこう 1464030 s1 (N3) · 冷たい つめたい 1556730 s1 · 知り合い しりあい 1595070 s1 (N3) ·
  新た あらた 1361510 s1 (N3) · 身 み 1365520 s1 (N3). Optional: 望遠鏡 1519650 (N2), 惑星 1562600.
- **Kanji new to the manifest:** 光 冷 知 新 身 (光 band 4; 新 band 1; 望 鏡 星 葉 茂 if carded).

### Lesson 7 — On top of, on the basis of

- **Order:** 333 · **Title:** On top of, on the basis of · **Can-do:** Add a factor, or name what
  something rests on
- **Teaches:** noun + に加えて (in addition to; clause + ことに加えて) and noun + に基づいて/に基づき (based
  on). Two patterns, one lesson, because both are thin and both are the written register's plain
  connectors.
- **Candidates:** #121748 濃霧に加えてうねりも高かった。 · #79249 有名な物理学者であることに加えて、彼は
  偉大な小説家でもある。(であること: Book Three ch.10–11) · #182439 急行に乗るには、普通券に加えて急行券を
  買う必要がある。(必要がある: Book Three ch.9) · #218723 これに加えて彼は、ヘブライ語を読むことが出来る。 ·
  #186870 科学は観察に基づいている。 · #182350 給料は、経験と学歴に基づいて決まります。 · #219937 この物語は
  実際の出来事に基づいている。 · #206242 その理論は周到な研究に基づいている。
- **New words:** 経験 けいけん 1251270 s1 (N3) · 実際 じっさい 1321110 s1 (N3) · 科学 かがく 1192700 s1 (N3) ·
  給料 きゅうりょう 1230360 s1 (N3) · 普通 ふつう 1497190 s1 (N3) · 出来事 できごと 1340570 s1 (N3). Optional:
  観察 1214900 (N3), 学歴 1207200 (N3), 券 1256730 (N3), 急行 1228690 (N2), 偉大 1155920 (N3), 物語 1502480
  (N3), 理論 1550160, 研究 1258520.
- **Kanji new to the manifest:** 経 験 際 科 給 普 (基 加 観 察 歴 券 急 偉 説 理 論 研 究 if carded; 際 — band 4? no, Book Three ch.5 placed 際).

### Lesson 8 — Precisely this, and according to whom

- **Order:** 334 · **Title:** Precisely this, and according to whom · **Can-do:** Single out the
  thing that matters, and name the source of a claim
- **Teaches:** X こそ (emphasis: precisely X — 辛抱こそ大事; concessive 年こそ若いが; ばこそ "precisely
  because"), and noun + によると/によれば (according to), the source marker that pairs with band 2's
  そうだ/という hearsay. Screen こそ's look-alikes (こそこそ, こそ泥, そこそこ, ようこそ).
- **Candidates:** #144721 辛抱こそ大事なんだ。(なんだ: band 2) · #101380 彼は年こそ若いが十分その仕事を
  やっていける。(が "but"; やっていける: band 0) · #9448086 君のためを思えばこそこう言ってるんだ。(ば: Book
  Two; 君: band 2) · #118423 彼のいうところによれば、彼女は正直な女だ。(ところ: Book Three ch.10) · #190898
  医者によれば、彼女はリューマチをわずらっている。 · #143846 推定によれば、今年の鉄鋼生産は１億トンに達する
  だろう。(だろう: band 2; 31 characters — `recognitionOnly`) · #219760 この本によれば、最初の人工橋梁は
  新石器時代にさかのぼるという。(という hearsay: Book Three ch.10; 32 characters — `recognitionOnly`)
- **New words:** 大事 だいじ 1413940 s1 · 正直 しょうじき 1377590 s1 (N3) · 生産 せいさん 1378990 s1 (N3) · 最初
  さいしょ 1293990 s1 · 達する たっする 1416230 s1 (N3). Optional: 辛抱 1365930, 十分 1335080 (Book Three ch.4
  verified its reading じゅうぶん), 推定 1371210 (N2), 人工 1367380 (N3).
- **Kanji new to the manifest:** 正 直 産 初 達 (正 band 4; 辛 抱 推 定 工 if carded; 大 事 生 最 — 最 band 2).

### Lesson 9 — Chapter 7 checkpoint

- **Order:** 335 · **Title:** Chapter 7 checkpoint · **Situation:** Integration & checkpoint ·
  `checkpoint: recognition`
- Pairs worth weighting: に対して against にとって; につれて against とともに; を通して against Book Three
  ch.2's によって (means); によれば against によって. No gate text (blocked).

## 4. Gate text and mining budget

Blocked; per-lesson word lists stand in.

## 5. Totals

| | Count |
|---|---|
| Teaching lessons | 8 · Checkpoints 1 · Orders 327–335 |
| Grammar patterns | 10 (lessons 7 and 8 carry two each) |
| Phrases | ~44 |
| New words | ~42 firm, 26 on the N3 gap list, 2 on N2; ~25 optional |
| New kanji | **~60**: 習 慣 払 警 官 貨 証 拠 利 治 演 技 希 望 景 気 収 瞬 響 爆 発 陽 崩 壊 達 冷 知 身 経 験 科 給 普 直 産 初 and the optional words' characters. The wiring pass's component-keyword step will be substantial. |
| `recognitionOnly` | #82485, #143846, #219760 (over 30 characters) |

## 6. Authoring checklist

As band 0's, plus: screen として for と + して and こそ for its look-alikes; keep に対して and にとって
in separate lessons with the contrast stated; chapter id `b4.band-6`, chapter 7, checkpoint
"Chapter 7 checkpoint", phrase ids `b4band6.<slug>`, file stem `b4-06-relation`, orders 327–335,
`kanji: []` throughout.
