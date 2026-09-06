# Book Four, Band 3 — How people actually talk

**Status: design, not content. No Japanese sentence composed.** Every example is a Tatoeba pair
cited by id from `server/data/jmdict-examples-eng-3.6.2.json`, verbatim (`04-stage-reading.md`
§8). Written by the controller on 2026-09-06 with the tooling of `book-four-band-00.md`.

Source brief: `docs/plans/book-four-bands.md` §3 (the `04b` "natural spoken register" band), §4
(this band's row), §6, §7, §9. Shape: `book-four-band-00.md`. The learner has Books One–Three and
Book Four bands 0–2 (orders 277–300), which already gave the contractions ちゃう/とく (band 0), the
volitional and the prohibitive な (band 1), and んだ/じゃないか (band 2). This band does not
re-teach any of them; it calls them back.

**Shape landed: 8 teaching lessons + 1 recognition checkpoint, global orders 301–309.** Two thin
patterns (っけ, とか) were kept as lessons rather than merged because each is a distinct thing to
recognise; both carry three or four cards and say so.

**New vocabulary: ~35 firm words.** **New kanji: ~30** (§5). **Register is the content.** Every
coding claim below is a tendency with the corpus as evidence — never "men say / women say" as a
rule. Tatoeba's sentences skew to one register and one era; the lesson notes must say so.

---

## 1. Attestation

Method as band 0; clean = ≤30 characters, **one utterance** (this band's material is exactly where
two-speaker exchanges cluster — dozens were excluded), no keigo. Script
`scratchpad/mine/band23-candidates.mjs` (throwaway).

| Lesson | Pattern | Clean | Notes |
|---|---|---|---|
| 1 | じゃ / じゃない | じゃなくて 5 · falling じゃない 19 | じゃないか overlaps band 2 lesson 5; #178376 is band 2's. **#172676 is already a Book Three card** (b3-03) — excluded. |
| 2 | よ / ね / よね | よ 386 · ね 188 · よね 22 | **#146800 is already a Book Three card** (b3-06 少し走っただけで) — excluded. Bulk is fine; the risk is picking sentences whose other grammar is untaught. |
| 3 | sentence-final な (emphatic) | 32 | Screened for dictionary form + な (band 1's prohibitive). #74920 ええ仕事 is dialect — flag. |
| 4 | かな / かしら / っけ | 20 · 9 · 3 | っけ is genuinely thin; three clean cards. かしら is older-feminine — tendency, stated. |
| 5 | なんて / なんか | 59 · 17 | なんて includes the exclamative なんて〜だろう (band 2 taught だろう, so cardable here). |
| 6 | とか | 29 raw, **4 usable** | かけ離れた, かえって, かんがえた are substring false positives; とかいう (#195162) is the hearsay-hedge job. |
| 7 | ぞ / ぜ / わ | 77 | ぞ male-coded and rough; わ feminine and dated in Tokyo speech, ordinary in Kansai for both sexes — say both as tendencies. |
| 8 | casual requests (〜て / 〜てよ / 〜ないでくれ) | 90 raw | Bare て as request (#213972), てよ (#76044), ないでくれ (#204303). No clean てくれる？ under the filters. |

## 2. Why this band exists

Books One–Two taught polite speech; Book Three taught the written register; Book Four bands 0–2
taught the plain-form machinery of everyday talk. Nothing has yet taught the particles and
contractions that make plain speech sound like a person: じゃ for では, よ/ね/な on the end, かな
for wondering aloud, なんて for dismissing, とか for vagueness, and a request with nothing but て.
Book Three's audits flagged register three times (お前, 君, ぞ) with no lesson to point at. This is
that lesson set. The `04b` skeleton called it "what a form signals"; the corpus lets it be taught
from evidence.

## 3. The lessons

Conventions as band 0. Register lines state coding as tendency with the corpus as evidence.

### Lesson 1 — Not that, this

- **Order:** 301 · **Title:** Not that, this · **Can-do:** Say "not X but Y" and "it isn't" the way
  speech does
- **Teaches:** じゃ as the spoken では: じゃない (Book Three ch.11 gave ではない), じゃなくて "not X
  but", じゃありません. Sentence-final じゃない with falling intonation asserts ("it isn't") and with
  rising or after a noun invites agreement ("isn't it?" — band 2's じゃないか is its か-marked form).
  じゃ opening a sentence (じゃ、行こう) is "well then" — name it.
- **Candidates:**
  - #172116 今度の旅行は仕事じゃなくて遊びです。 — Our next trip is for pleasure, not for work.
  - #75740 百円じゃなくて、王冠でした。 — It wasn't a 100 yen coin, it was a bottle cap.
  - #205790 それって死語じゃないの。 — People don't say that anymore. (って topic marker — lesson 3
    names it; の final — soft)
  - #234657 あいつの手先じゃない。 — I don't live in his pocket. (falling; あいつ band 1)
  - #203279 たまにまる一日ぼけっとしていても別に悪い事じゃない。 — It's no crime to just idle the whole
    day once in a while. (ても: Book Three ch.4; 30 characters)
- **Depends on:** Book Three ch.11 ではない; band 2 lesson 5.
- **New words:** 今度 こんど 1289370 s1 · 遊び あそび 1542070 s1 · 別に べつに 1509480 s1 (N3) · たまに
  1634500 s1 · 死語 しご 1310840 s1. Optional: 王冠 1181450, 手先 (author verifies).
- **Kanji new to the manifest:** 今 度 語 別 (王 冠 if carded; 遊 死 taught).

### Lesson 2 — You know, right?

- **Order:** 302 · **Title:** You know, right? · **Can-do:** Add what a plain statement is for:
  telling, agreeing, or both
- **Teaches:** sentence-final よ (I'm telling you something you don't know), ね (I expect you agree
  / share this), よね (I'm fairly sure and want you to confirm). Tendencies, not rules — よ can be
  pushy or gentle by intonation, ね can be a pure softener. Both sit on です/ます as easily as on plain
  forms (Book One's ですね is this ね).
- **Candidates:**
  - #121485 買い替えた方がお得ですよ。 — You will be better off buying a new one than trying to fix
    it. (方が: Book Two たほうがいい's 方)
  - #229416 いいお天気ですね。 — It's a beautiful day, isn't it?
  - #202858 ちょっとウエストがきついね。 — The waist is a little small.
  - #227486 おや、今朝は早いですね。 — Oh, you are early this morning.
  - #178489 君のやることはじれったいね。 — I am losing my patience with you.
  - #75147 今の日本は自滅へのみちを突き進んでいますよね。 — Present-day Japan is going down the route to
    self destruction, isn't it? (よね; 30 characters)
- **Depends on:** Book One ですね; Book Two たほうがいい.
- **New words:** 得 とく 1454490 s1 (N3; お得) · 方 ほう 1516925 (the "side/alternative" sense — author
  picks; band 2's 仕方 is a different word) · 自滅 じめつ 1318710 s1 · ウエスト 1026070 s1. Optional:
  買い替える 2012810, じれったい (author verifies), 突き進む 1456730.
- **Kanji new to the manifest:** 滅 (突 進 if carded; 得 早 taught; 方 band 2).

### Lesson 3 — To yourself, out loud

- **Order:** 303 · **Title:** To yourself, out loud · **Can-do:** Recognise a remark made half to
  oneself
- **Teaches:** sentence-final な after anything but a bare dictionary form: reflection, mild
  emphasis, a wish (いいな). The look-alike is band 1's prohibitive (dictionary form + な) — one card
  from band 1 could be shown for contrast. Male-coded in assertive use, neutral in いいな/だな
  musing — tendency. Also names って as the spoken topic/quotation marker (#203868 電話って), which
  Book Three ch.10's という/とは family did not cover.
- **Candidates:**
  - #177898 君はウオーミングアップを始めたな。 — You've started warming up.
  - #82120 僕はエンディングが気に入らなかったな。 — Oh, I didn't like the ending.
  - #161261 私はオレンジよりグレープフルーツのほうが好きだな。 — I prefer grapefruits to oranges.
  - #234759 ああ、バスタブ付きがいいな。 — Oh, a bath, please.
  - #230644 あの双子は瓜二つだな。 — Those twins look like two peas in a pod. (瓜二つ idiom — gloss)
  - #203868 ダイヤル式の電話って、ほとんど見なくなったな。 — You don't see many dial phones around
    anymore. (って; なくなった: band 0's てくる family? no — Book Two's くなる)
- **Depends on:** band 1 lesson 5 (contrast); Book Two より〜のほうが.
- **New words:** 始める はじめる 1307550 s1 · 気に入る きにいる 1221740 s1 · 双子 ふたご 1398750 s1 (N3) ·
  ほとんど 1522050 s1 · 付き つき 1583630 s1 (N3; 〜付き "with ... attached"). Optional: 僕 (author checks
  the manifest — Book Three carded 僕 in ch.9 sentences without teaching it), グレープフルーツ 1047590.
- **Kanji new to the manifest:** 始 双 付 (僕 if carded; 気 — check at wiring).

### Lesson 4 — I wonder

- **Order:** 304 · **Title:** I wonder · **Can-do:** Wonder aloud, and check your own memory
- **Teaches:** かな (I wonder; with the volitional, "maybe I'll" — band 1's しよう + かな), かしら
  (same job, older-feminine in Tokyo speech — tendency), っけ (was it...? trying to recall; だっけ,
  たっけ). の before かな/かしら (したのかな) is band 2's の.
- **Candidates:**
  - #76839 えーと、パン粉は有ったかな？ — Hmm, did we have some breadcrumbs?
  - #192197 ロス出張をキャンセルしようかな。 — I should cancel my L.A. trip. (volitional + かな)
  - #204469 そろそろプログラミングを覚えようかな。 — Maybe it's about time I started learning to program.
  - #234673 あいつどこに雲隠れしたのかな。 — I wonder where he is hiding.
  - #218202 これは誰の車かしら。 — I wonder whose car this is.
  - #216625 サンドイッチとおにぎりじゃ、どっちが重いかしら。 — Which are heavier, sandwiches or onigiris?
    (じゃ: lesson 1)
  - #163264 私の新しいムスタングを見せてなかったっけ？ — Didn't I show you my new Mustang? (てなかった:
    contracted ていなかった — name it)
  - #148919 車酔いするほうだっけ？ — Don't you tend to get carsick?
  - #220765 この前、僕が君にあったのはいつだっけ。 — Do you remember when I saw you last?
- **Depends on:** band 1 lesson 1 (volitional); band 2 lesson 1 (の).
- **New words:** 出張 しゅっちょう 1339660 s1 (N2) · キャンセル 1042050 s1 · そろそろ 1345605 s1 · この前
  2216900 s1 · サンドイッチ 1058580 s1. Optional: パン粉 1103500, 雲隠れ 1173110, 車酔い 1872770.
- **Kanji new to the manifest:** 張 前 (前 is the character of 前 まえ, taught since Book One and
  never placed — wiring rules; 出 band 0).

### Lesson 5 — Things like that

- **Order:** 305 · **Title:** Things like that · **Can-do:** Play something down, or be amazed by it
- **Teaches:** なんて — dismissive/surprised ("the idea that...", #235713 １等になるなんて) and
  exclamative なんて〜だろう ("how ...!", #111388; だろう from band 2); なんか — "things like", hedging
  or belittling (#164132 パソコンなんか), and なんか + negative for "anything but" (#221811). Both are
  from 何 — name that; neither is rude in itself.
- **Candidates:**
  - #235713 １等になるなんて夢にも思わなかった。 — Never did I dream of winning first prize.
  - #195400 また同じ失敗をするなんて、我ながら愚かだと思う。 — It is silly of me to have made the same
    mistake twice. (ながら: Book Three ch.3's concessive)
  - #111388 彼はなんて大食らいなんだろう。 — What a big eater he is! (なんだろう: band 2)
  - #221811 この仕事は決してやさしくなんかないんだよ。 — This work is anything but easy. (んだよ: band 2)
  - #164132 私のパソコンなんかへんでネットに乗れませんでした。 — Something was wrong with my computer
    and I couldn't get on-line.
- **Depends on:** band 2 lessons 1–2; Book Three ch.3 ながら.
- **New words:** 夢 ゆめ 1529410 s1 · 失敗 しっぱい 1320140 s1 · 決して けっして 1254130 s1 · パソコン
  1101570 s1 · 愚か おろか 1245100 s1. Optional: 変 へん 1510640 (the adjective), ネット 1093020,
  大食らい 1862010.
- **Kanji new to the manifest:** 夢 失 敗 決 愚 (変 taught).

### Lesson 6 — And so on

- **Order:** 306 · **Title:** And so on · **Can-do:** List loosely, or report loosely
- **Teaches:** とか after nouns for a non-exhaustive list (包丁とか鍋とか), after a clause for a vague
  suggestion (コーンフレークとか、軽い物にしようか — band 1's volitional + か), and とかいう for a name
  or claim held at arm's length (マルコーニさんとかいう人). Softer than や; Book Two's や〜など is the
  neutral list. Four cards; the corpus has no more clean ones, and the lesson says so.
- **Candidates:**
  - #82758 包丁とか鍋とか、台所用品を持参すること。 — Don't forget to bring kitchen utensils such as
    knives and cooking pots. (sentence-final こと as an instruction — name it as written register)
  - #75517 明日からコーンフレークとか、軽い物にしようか？ — Shall we go with cornflakes or something
    light from tomorrow?
  - #195162 マルコーニさんとかいう人がご面会です。 — A Mr. Marconi wants to see you. (ご面会: band 4's
    ご — recognition)
  - #74030 私も親の面倒とか見られないですね。 — I can't look after my parents and such either.
- **Depends on:** band 1 lesson 1; Book Two や.
- **New words:** 鍋 なべ 1459720 s1 (N3) · 包丁 ほうちょう 1515530 s1 (N2) · 親 おや 1365040 s1 (N3) · 面倒
  めんどう 1533550 s1 (N3; 面倒を見る "look after" — gloss the idiom) · 持参 じさん 1315790 s1 (N2).
  Optional: 用品 1546400, 面会 1533440.
- **Kanji new to the manifest:** 包 丁 鍋 倒 親 (品 if carded; 参 band 1; 面 会 持 taught).

### Lesson 7 — Rough and soft endings

- **Order:** 307 · **Title:** Rough and soft endings · **Can-do:** Recognise who is talking from the
  last syllable
- **Teaches:** ぞ (assertive, male-coded, rough — to oneself or downward), ぜ (same, softer, dated),
  わ (feminine in Tokyo speech and somewhat dated; neutral emphatic in western Japan for everyone).
  Recognition first; production of ぞ/ぜ is not asked. Every coding claim is a tendency stated with
  the corpus's own sentences as evidence — the corpus is where the learner will meet them.
- **Candidates:**
  - #172500 今回はしくじれないぞ。 — You cannot fail this time. (potential negative)
  - #229559 あんなやつを信用したら骨までしゃぶられちゃうぞ。 — If you trust such a fellow, you'll lose
    everything you have. (たら; passive + ちゃう: band 0; 骨 band 2 optional)
  - #161315 うっかりそれを忘れるところだったわ。 — I almost forgot all about that. (ところだった: Book
    Three ch.10)
  - #226669 お返しに微積分のノートを貸してあげるわ。 — I'll pay you back with my calculus notes.
    (てあげる: Book Two)
  - #195969 ほら、あなたの乗る電車が来たわ。 — Look, here comes your train.
- **Depends on:** band 0 lesson 1; Book Three ch.10 ところだった; Book Two てあげる.
- **New words:** 今回 こんかい 1289070 s1 (N3) · 信用 しんよう 1359620 s1 (N3) · うっかり 1001010 s1 (N3) ·
  あんな 1000590 s1 · ノート 1093450 s1. Optional: お返し 1002640, しくじる, しゃぶる 1005670 (N2).
- **Kanji new to the manifest:** 回 信 (今 lesson 1; 用 band 0; 返 taught).

### Lesson 8 — Just do it, would you

- **Order:** 308 · **Title:** Just do it, would you · **Can-do:** Ask for something the short way
- **Teaches:** the bare て-form as a request between intimates (つかまえて！), てよ (insistent), ないで
  as a request (band 0 lesson 8 taught the adverbial; the request reading is called back), ないでくれ
  (blunt, male-coded), and where てくれる？/てくれない？ sit (no clean card — described). Ladder: て <
  てよ < てくれる？ < てください < ていただけますか (band 4).
- **Candidates:**
  - #213972 そいつをつかまえて！ — Get him! (そいつ: band 2)
  - #76044 謝ったんだから、さっきのはチャラにしてよ。 — I've apologised, so lay off, OK? (んだから: band 2;
    チャラ slang — gloss)
  - #236099 １０４のオペレーターに聞いてみて。 — Call the operator at 104 then. (てみて: band 0)
  - #194982 みんなソックスを引っ張り上げて。 — Everybody pulled their socks up, yeah.
  - #204303 そんなにコロコロ、言う事を変えないでくれよ。 — Don't change your mind so often. (ないでくれ)
- **Depends on:** band 0 lessons 3 and 8; band 2 lesson 1; Book One てください.
- **New words:** 捕まえる つかまえる 1597780 s1 · 謝る あやまる 1323010 s1 · オペレーター 1035320 s1 ·
  ソックス 1075420 s1. Optional: 引っ張り上げる 2081160, コロコロ 1004840, みんな 1202150 (check the
  manifest — likely taught).
- **Kanji new to the manifest:** 謝 (捕 band 1).

### Lesson 9 — Chapter 4 checkpoint

- **Order:** 309 · **Title:** Chapter 4 checkpoint · **Situation:** Integration & checkpoint ·
  `checkpoint: recognition`
- Pairs worth weighting: するな (band 1) against したな; じゃない falling against rising; よ against
  ね; かな against っけ. Register items are recognition only. No gate text (blocked).

## 4. Gate text and mining budget

Blocked; per-lesson word lists stand in.

## 5. Totals

| | Count |
|---|---|
| Teaching lessons | 8 · Checkpoints 1 · Orders 301–309 |
| Grammar patterns | 8 |
| Phrases | ~40 |
| New words | ~35 firm (5+4+5+5+5+5+5+4), 11 on the N3 gap list, 3 on N2; ~20 optional |
| New kanji | **~30**: 今 度 語 別 滅 始 双 付 張 前 夢 失 敗 決 愚 包 丁 鍋 倒 親 回 信 謝, plus 王 冠 突 進 僕 気 品 if their words are carded |
| `recognitionOnly` | none required by length; register-coded finals (ぞ ぜ わ) are recognition by design — the author decides whether `recognitionOnly` is the right flag or a note |

## 6. Authoring checklist

As band 0's, plus: one utterance per card — no exchanges, even short ones; every register claim a
tendency with a corpus sentence beside it; do not card #172676 or #146800 (Book Three has them);
chapter id `b4.band-3`, chapter 4, checkpoint "Chapter 4 checkpoint", phrase ids `b4band3.<slug>`,
file stem `b4-03-talk`, orders 301–309, `kanji: []` throughout.
