# Book Four, Band 8 — Joining an argument

**Status: design, not content. No Japanese sentence composed.** Every example is a Tatoeba pair
cited by id from `server/data/jmdict-examples-eng-3.6.2.json`, verbatim (`04-stage-reading.md`
§8). Written by the controller on 2026-09-06 with the tooling of `book-four-band-00.md`.

Source brief: `docs/plans/book-four-bands.md` §3 (the sentence-initial half of `04b`'s "formal
connectives"), §4, §6, §7, §9. Shape: `book-four-band-00.md`. The learner has Books One–Three
(Book Two taught けど, から, ので; Book Three ch.11 taught ゆえに and が "but" as a callback) and Book
Four bands 0–7 (orders 277–344).

**Shape landed: 7 teaching lessons + 1 recognition checkpoint, global orders 345–352. This is the
last band; Book Four ends at order 352** — 76 lessons, under the skeleton's provisional 357
because bands 7 and 8 merged thin patterns. The skeleton warned this band was the thinnest; it is.
Lesson 2 (したがって/ただし/なお) has four clean sentences in the whole corpus and says so; the
learner meets these words in notices and reports, which Tatoeba barely contains.

**New vocabulary: ~30 firm words. New kanji: ~35** (§5).

---

## 1. Attestation

Method as band 4 (≤32 characters). Script `scratchpad/mine/band678-candidates.mjs`.

| Lesson | Pattern | Clean | Notes |
|---|---|---|---|
| 1 | つまり · すなわち · 要するに | 6 · 3 · 3 | とどのつまり (#208555) is an idiom — exclude. |
| 2 | したがって · ただし · なお | **1 · 1 · 2** | Sentence-initial only; ただし matches ただした/あわただしい — screened. Four cards, all there are. |
| 3 | または · あるいは · それとも | 6 · 2 · 10 | それとも already appears in two band 4 cards as a fragment. |
| 4 | しかも · さらに | 7 · 16 | さらに as "further" (adverb) and "furthermore" (conjunction) — both. |
| 5 | むしろ | 12 | Often after というより — teach the frame. |
| 6 | 一方 | 5 | Two jobs: "one of two / the other" (一方は…もう一方は) and "while, on the other hand" (一方で); 募る一方である ("keeps on ...ing") is a third — recognition. |
| 7 | ところで | 3 | Thin; the lesson also folds in その上 (band 7 lesson 8's sentence) as the spoken "on top of that". |

## 2. Why this band exists

Every connective Book Three taught joins two clauses inside one sentence. Written Japanese also
joins *sentences*, with a word at the head of the second: つまり (that is), したがって (therefore),
ただし (however), または (or), しかも (moreover), むしろ (rather), 一方 (on the other hand), ところで
(by the way). A learner who can parse a paragraph's sentences still cannot follow its argument
without them. The corpus is thin because Tatoeba is sentence-grained — exactly the limitation that
makes this band the last one and the one most improved by the reading library when it exists.

## 3. The lessons

Conventions as band 0.

### Lesson 1 — That is to say

- **Order:** 345 · **Title:** That is to say · **Can-do:** Restate or sum up what you just said
- **Teaches:** つまり (that is, in other words — mid-sentence after a comma, or sentence-initial),
  すなわち (namely — the written twin), 要するに (in short). 江戸、つまり東京 is the shape to own.
- **Candidates:** #236874 外国人の一団が江戸、つまり東京に到着した。 · #202527 つまり彼女は下手な踊り子だ。 ·
  #214578 すなわち彼はそれをしたくないのだ。(のだ: band 2) · #205590 それは１週間前、すなわち４月２日に行われた。
  (行われた: Book Three ch.1) · #86369 彼女は要するにおしゃべりなんだ。(なんだ: band 2) · #78816 要するに彼は
  何にでも飽きるのだ。
- **New words:** 外国人 がいこくじん 1203650 s1 · 到着 とうちゃく 1449870 s1 (N3) · 東京 とうきょう 1447690 s1 ·
  おしゃべり 1002450 s1 (N3) · 飽きる あきる 1586250 s1 (N3). Optional: 一団 1164680, 踊り子 1546900, 下手
  へた (the "poor at" sense — the tool resolved したて; author picks 1185200 or the correct entry).
- **Kanji new to the manifest:** 到 京 飽 (国 — check; 東 着 — 着 taught).

### Lesson 2 — Therefore, however, furthermore

- **Order:** 346 · **Title:** Therefore, however, furthermore · **Can-do:** Recognise the connectives
  of notices and reports
- **Teaches:** sentence-initial したがって (therefore; 従って in kanji. NOT a callback: no book teaches 従う, so treat it as new) [was: the same word as Book Three's
  したがって "in accordance with" one step further), ただし (however / provided that — the exception
  clause of a rule), なお (furthermore / note that — the postscript word). Four sentences; recognition;
  the lesson says where the learner will actually meet them (notices, terms, reports) and that the
  corpus has almost none.
- **Candidates:** #216172 したがって生産費を削る必要がある。(必要がある: Book Three ch.9; 生産: taught NOWHERE, not band 6) ·
  #203649 ただし、列をつくって並ばなくてはならないが・・・。(なくてはならない: Book Three ch.9) · #74313 なお、
  会社説明会後でも、会社見学は随時受け付けております。(おります: band 4; 32 characters — `recognitionOnly`) ·
  #75118 なお、危険防止の為、サブアド利用をお奨めします。(危険: band 0; お奨めします: band 4's お〜する)
- **New words:** 削る けずる 1298090 s1 (N2) · 列 れつ 1558330 s1 (N3) · 見学 けんがく 1259440 s1 (N2) · 利用
  りよう 1549660 s1 · 受け付ける うけつける 1329690 s1. Optional: 随時 1372760, 防止 (author verifies).
- **Kanji new to the manifest:** 削 列 学 利 (受 band 5; 付 band 1; 見 band 1; 随 防 止 if carded).

### Lesson 3 — Or

- **Order:** 347 · **Title:** Or · **Can-do:** Offer alternatives in three registers
- **Teaches:** または (or — written, between nouns), あるいは (or / alternatively — written, also
  "perhaps"), それとも (or — in questions, spoken: リンゴが好きですか、それともオレンジが好きですか).
  Book Two's や and か between nouns are the plain forms.
- **Candidates:** #229465 アンモニアは、非常に強い匂いをもった液体または気体である。(である: Book Three ch.11;
  31 characters — `recognitionOnly`) · #197448 ビュッフェ、またはカフェテリアは９号車にあります。 · #173494
  紅茶またはコーヒーはいかが？ · #172631 今は彼らは小型車または中型車を好む。(彼ら: band 6) · #226408 ガスで
  調理しますか、あるいは電気ですか。 · #232338 あなたはリンゴが好きですか、それともオレンジが好きですか。
  (オレンジ is taught nowhere in the course -- it needs a word card or a gloss) · #208754 その人は慎み深いのか、それとも怠惰なのかと人は思うだろう。(のか; だろう: band 2)
- **New words:** 非常に ひじょうに 1484930 s1 · 匂い におい 1599760 s1 (N3) · 好む このむ 1277520 s1 (N3) · 調理
  ちょうり 1429310 s1 · 液体 えきたい 1175030 s1 (N2). Optional: 気体 1222460 (N3), 中型 1424010, 紅茶 (check
  taught), 怠惰 1410730.
- **Kanji new to the manifest:** 非 常 匂 液 好 調 (常 band 7; 調 band 0; 体 気 — check).

### Lesson 4 — What's more

- **Order:** 348 · **Title:** What's more · **Can-do:** Add a point that strengthens the last one
- **Teaches:** しかも (moreover — and, pointedly, "and on top of that"), さらに (further / furthermore;
  also the adverb "even more": さらに強まった). その上 (band 7's sentence) is the spoken sibling.
- **Candidates:** #222368 この魚は安くてしかも栄養がある。 · #112214 彼はそれをした、しかも彼女のいる前で。 ·
  #74305 山越えの道は狭く、しかも急勾配だった。(狭く is the adjectival continuative -- NOT taught: no book teaches it, gloss it in the card note) · #100465 彼は不注意な
  過ちをおかす、しかも頻繁にだ。 · #208985 その上さらに５ドル払った。(払う: band 6) · #191457 悪い風邪をひいて
  いて、さらに悪いことには、雪が降ってきました。(31 characters — `recognitionOnly`; てくる: band 0) ·
  #218776 これでさらに困ったことになるだろう。(ことになる: Book Three ch.8; だろう: band 2) · #127046 知識は
  欠乏しており、知恵はさらに乏しい。(ており is the continuative -- NOT taught: no book teaches it, gloss it in the card note)
- **New words:** 栄養 えいよう 1173990 s1 (N3) · 知識 ちしき 1420590 s1 (N3) · 知恵 ちえ 1420530 s1 (N3) · 頻繁
  ひんぱん 1491050 s1 · 乏しい とぼしい 1584130 s1. Optional: 不注意 1493830, 過ち 1196010, 欠乏 1254100.
- **Kanji new to the manifest:** 栄 養 識 恵 頻 繁 乏 (栄 band 4; 知 band 6; 恵 band 5 optional).

### Lesson 5 — Rather

- **Order:** 349 · **Title:** Rather · **Can-do:** Prefer one description or choice over another
- **Teaches:** むしろ (rather, sooner): after というより (X というよりむしろ Y — "not so much X as Y"),
  after より (金よりむしろ名誉), and alone (むしろ外出したくない — "I'd rather not"). The というより frame is
  the one to own.
- **Candidates:** #157565 私は金よりむしろ名誉を選ぶ。(金: band 1) · #186476 過度の運動は身体のためというより
  むしろ害になる。(運動: band 7; ため: Book Three ch.2) · #103674 彼は親切というよりむしろ気がやさしい。 ·
  #171717 今日はむしろ外出したくない。(外出: band 0) · #204882 それは部屋というよりはむしろ広間だ。
- **New words:** 選ぶ えらぶ 1588730 s1 · 名誉 めいよ 1531870 s1 · 害 がい 1204330 s1 (N3) · 親切 しんせつ 1365250
  s1 (check taught — the mining flags it new) · 身体 しんたい 2830705 s1 (N3). Optional: 過度, 広間.
- **Kanji new to the manifest:** 選 誉 害 切 (切 band 4; 名 身 — 身 band 6; 親 band 3).

### Lesson 6 — One side, the other

- **Order:** 350 · **Title:** One side, the other · **Can-do:** Set two sides against each other
- **Teaches:** 一方 as "one (of two)... the other" (一方は…もう一方は), as "while / on the other hand"
  joining clauses (取る一方で他の者は), and sentence-initial その一方 (then again). 〜一方である/一方だ
  ("keeps on ...ing", #76047) is a third job — recognition only.
- **Candidates:** #190048 一方は背が高く、もう一方は背が低い。 · #207316 その猫の一方は黒で、もう一方は茶だ。 ·
  #76346 一部の住民が様子見の態度を取る一方で他の者は大洪水に備えた。(32 characters — `recognitionOnly`) ·
  #216343 しかし、その一方、ラテン語はそのときまでに「死語」となっていた。(brackets — `recognitionOnly`;
  死語: band 3; しかし: teach as a word here — never taught) · #76047 社会保険庁や厚生労働省への不信感は
  募る一方である。(the "keeps on" job — recognition; 30 characters)
- **New words:** 猫 ねこ 1467640 s1 (untaught — check) · 背 せ 1472650 (せ, not せい, in these sentences) (the "height" sense — not s1
  "back"; author picks) (N3) · 住民 じゅうみん 1334210 s1 (N3) · 備える そなえる 1244960 s1 (N3) · しかし
  1505990 s1 (untaught as a word — check the manifest; Book Two's けど family never included it).
  Optional: 一部 1166180, 募る 1514800, 態度 (author verifies).
- **Kanji new to the manifest:** 猫 背 住 民 備 (低 黒 茶 — check).

### Lesson 7 — By the way

- **Order:** 351 · **Title:** By the way · **Can-do:** Change the subject in conversation
- **Teaches:** sentence-initial ところで (by the way) — the discourse ところ Book Three ch.10 named and
  did not teach; and, as its spoken partner from band 7's sentence, その上 (on top of that). Three
  clean ところで sentences; the lesson says so and leans on the callback.
- **Candidates:** #200846 ところであなたはどんなスポーツが好きですか。 · #200866 ところで、お住まいはどちら
  ですか。(お住まい: band 4's お + noun) · #200862 ところで、ベティ、夢のマイホームはもう決まった？(夢: band 3;
  決まった: 決まる is band 6 / chapter 7, NOT Book Three ch.2) · #209336 その女性は悲しげで、その上疲れているようだった。(reused
  from band 7 lesson 8 for その上 — precedent b3-03 lesson 4)
- **New words:** どんな 1009330 s1 (N3; check the manifest — Book One may carry it) · スポーツ 1073210 s1 ·
  住まい すまい 1595750 s1 (N2). Optional: マイホーム 1127040.
- **Kanji new to the manifest:** 住 (lesson 6).

### Lesson 8 — Chapter 9 checkpoint

- **Order:** 352 · **Title:** Chapter 9 checkpoint · **Situation:** Integration & checkpoint ·
  `checkpoint: recognition`
- Pairs worth weighting: つまり against すなわち (register); または against それとも (statement vs
  question); しかも against さらに; 一方は against 一方で. This is the last checkpoint of Book Four; it is
  still a recognition checkpoint like the others (DR-021), not a book-completion one. No gate text
  (blocked).

## 4. Gate text and mining budget

Blocked; per-lesson word lists stand in. This band is the one the reading library would most
change: sentence-initial connectives live in paragraphs, and Tatoeba has almost none.

## 5. Totals

| | Count |
|---|---|
| Teaching lessons | 7 · Checkpoints 1 · Orders 345–352 |
| Grammar patterns | 12 across 7 lessons (several two- or three-word lessons) |
| Phrases | ~38 |
| New words | ~30 firm, 12 on the N3 gap list, 4 on N2; ~15 optional |
| New kanji | **~35**: 到 京 飽 削 列 利 非 匂 液 好 養 識 頻 繁 乏 選 誉 害 猫 背 住 民 備 and the optional words' characters |
| `recognitionOnly` | #74313, #229465, #191457, #76346, #216343, #76047 (length or brackets) |
| **Book Four totals** | 9 bands · 67 teaching lessons + 9 checkpoints = **76 lessons**, orders 277–352 · ~330 phrases · ~300 firm words · ~330 new kanji if every firm word ships |

## 6. Authoring checklist

As band 0's, plus: lesson 2 is recognition — say so in the header and mark it; しかし, 猫, どんな,
親切, 紅茶 are checked against the manifest before minting ids (several may be taught under an id
the mining missed); chapter id `b4.band-8`, chapter 9, checkpoint "Chapter 9 checkpoint", phrase
ids `b4band8.<slug>`, file stem `b4-08-argument`, orders 345–352, `kanji: []` throughout.
