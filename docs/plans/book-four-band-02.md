# Book Four, Band 2 — Why you're saying it

**Status: design, not content. No Japanese sentence composed.** Every example is a Tatoeba pair
cited by id from `server/data/jmdict-examples-eng-3.6.2.json`, verbatim (`04-stage-reading.md`
§8). Written by the controller on 2026-09-06 with the tooling of `book-four-band-00.md`.

Source brief: `docs/plans/book-four-bands.md` §3a, §4 (this band's row), §6, §7, §9. Shape:
`book-four-band-00.md`. This band is the missing half of Book Three's stance chapter
(`src/content/lessons/b3-05-stance.yaml`: はず, わけ, みたい, らしい, っぽい, ようだ, に違いない,
かもしれない), which wrote around だろう and そうだ by name. The learner also has Book Four bands
0–1 (orders 277–293: the て-auxiliaries, すぎる, まま, ずに; the volitional, imperative, なさい, たがる).

**Shape landed: 6 teaching lessons + 1 recognition checkpoint, global orders 294–300.**

**New vocabulary: ~28 firm words.** **New kanji: ~40** (§5).

---

## 1. Attestation

Method as band 0; clean = ≤30 characters, one utterance, no keigo (bands 4–5). Bands 0–1's forms
count as known. Script `scratchpad/mine/band23-candidates.mjs` (throwaway).

| Lesson | Pattern | Clean | What the count contains |
|---|---|---|---|
| 1 | んです / のです / のだ | んです。 52 · んですか 23 · んですが 9 · のです。/のだ。 224 | Most のです hits are bare declaratives; the lesson needs the ones where の visibly explains, asks for a reason, or opens a request. #85523 こちらケニーさんです is さん+です, a false positive. |
| 2 | だろう / でしょう | でしょう。 103 · でしょう？ 7 · だろう。 212 | Exclamative なんて〜だろう (#111397, #237362, #111388) is band 3's なんて — cite one as a preview at most. どうでしょう (#171789) is a fixed offer. |
| 3 | そうだ hearsay | 29 (plain clause + そうだ/そうです) | Clean set; several carry によれば/によると (#145165, #171885, #176027), a band 6 pattern — one is worth carding with the source-marker named as a fragment. |
| 4 | そうだ appearance | 89 (stem + そうだ/そうな/そうに) | Includes 「」-quoted speech (#4925 — dialogue, excluded); よさそう irregular attested (#223406). |
| 5 | のではないか / んじゃない(か) | 23 | Mixed: hedged assertion (#231278), suggestion (#228269), plain negation of の (#223523), and **prohibitive 〜んじゃない** (#138513, #204306) — band 1's job, carded here only as the contrast. |
| 6 | ものだ | 115 | Overloaded: plain noun + だ (#223574 独自のものだ — exclude), というものだ (#219011, #213973), たものだ nostalgia (#187211), たいものだ wish (#226772), ものではない generalisation (#189201) and prescription (#147355 — dated gender norm, exclude). |

## 2. Why this band exists

Book Three's stance chapter taught eight ways to say how sure you are and had to write around the
two commonest in Japanese: でしょう/だろう (band 5 §7.2 of the Book Three plan flagged the gap) and
そうだ (avoided in bands 5 and 7 by name). んです — the explanatory の that turns a statement into a
reason, a question into a request for one, and softens an opener — is taught nowhere, though it
appears in shipped phrases from Book Two on. Band 1's volitional gives ようと思う its verb; this band
gives と思う's cousins their hedges. Band 3 (spoken register) builds on んだ and じゃない from here.

## 3. The lessons

Conventions as band 0.

### Lesson 1 — Because that's the reason

- **Order:** 294 · **Title:** Because that's the reason · **Can-do:** Explain yourself, ask for
  someone's reason, or open a request the way Japanese does
- **Teaches:** plain form + んです (speech) / のです (polite writing) / のだ (plain writing); noun and
  な-adjective take な (ぎっくり腰なんです, 流行なのだ). Three jobs: answering an implicit "why" (I'd like
  to be a guitarist — that's why I'm asking); 〜んですか asking for the reason behind what you see;
  〜んですが opening a request or a problem and leaving the rest unsaid. Not "casual です": it
  presupposes something both people can see. Book Two's ので/から state a reason; んです marks the
  whole sentence as one.
- **Candidates:**
  - #161147 私はギタリストになりたいんです。 — I'd like to be a guitarist.
  - #75066 リレー用のバトンが１本足りないんです。 — We're one baton short for the relay.
  - #232498 どうやってそのお金を手に入れたんですか。 — How did you come by the money?
  - #221546 この自動販売機、動かないんですが。 — This vending machine isn't working. (opener)
  - #196993 フランスへの送金の仕方を教えて欲しいんですが。 — I'd like to know how to send money to
    France. (て欲しい: Book Two)
  - #227703 おしぼりが欲しいのです。 — Do you have hot towels? (のです)
  - #203365 だぶだぶの上着が最新の流行なのだ。 — Loose jackets are the latest fad. (なのだ, written)
- **Depends on:** Book Two から/ので, て欲しい; Book Three ch.11 だ/である register.
- **New words:** 足りる たりる 1404740 s1 · 手に入れる てにいれる 1327230 s1 · 仕方 しかた 1594110 s1 · 流行
  りゅうこう 1585110 s1 (N3) · 最新 さいしん 1294090 s1. Optional: 自動販売機 1318480, おしぼり 1001910,
  送金 1402750, ギタリスト 1042870.
- **Kanji new to the manifest:** 入 方 最 流 行 (販 機 if 自動販売機 is carded; 足 仕 taught; 動 band 0;
  新 送 金 bands 0–1).

### Lesson 2 — Probably

- **Order:** 295 · **Title:** Probably · **Can-do:** Say what you think will happen, and check
  something you already believe
- **Teaches:** plain form + でしょう (polite) / だろう (plain); noun and な-adjective bare (本物のダイヤ
  でしょう, 同じでしょう). Conjecture (#235778, #195063), and the rising tag でしょう？ that asks for
  agreement (#88382, #74724). Register as tendency: だろう in speech is blunt and male-coded, in
  writing neutral; でしょう is neutral in speech. Do not present だろう as "the plain form you
  should use". Set beside Book Three's かもしれない (weaker) and に違いない (stronger) — a line the
  stance chapter drew without this word on it.
- **Candidates:**
  - #235778 １時間以内にそこに着くでしょう。 — We'll arrive there within an hour.
  - #218083 これは本物のダイヤでしょう。 — This is probably a real diamond.
  - #195063 ミニスカートはすぐに復活するだろう。 — Miniskirts will soon come back.
  - #234041 あなたか私のどちらかが一位を取るだろう。 — Either you or I will get the first prize.
  - #199528 どんなに骨を折ってやっても、結果は同じでしょう。 — No matter how hard you try, the result
    will be the same. (ても: Book Three ch.4; 骨を折る idiom — gloss whole)
  - #88382 彼女は政府機関に勤めているのでしょう？ — She's with a government bureau, isn't she? (tag)
  - #74724 これは悪い話ではないでしょう？ — This isn't an unappealing proposition, is it? (tag on a
    negative; 話 read はなし)
- **Depends on:** Book Three ch.6 (かもしれない, に違いない), ch.4 ても.
- **New words:** 結果 けっか 1254690 s1 (N3) · 本物 ほんもの 1523180 s1 (N3) · 以内 いない 1155180 s1 ·
  復活 ふっかつ 1500700 s1 · 政府 せいふ 1376070 s1. Optional: 一位 1161020, 骨 1288550 (N3), 折る 1385910
  (N3), 機関 1220870 (the "agency" sense, not s1 "engine"), どんなに 1009340 (N3), ダイヤ 1076860.
- **Kanji new to the manifest:** 内 位 復 活 政 府 結 果 (骨 折 if carded; 本 物 一 関 taught).

### Lesson 3 — I hear that

- **Order:** 296 · **Title:** I hear that · **Can-do:** Pass on something you were told
- **Teaches:** plain clause + そうだ/そうです — hearsay. Attaches to every plain form including だ
  (忠実だそうだ) and だった (癌だったそうです); never to a stem. The source can be named in front with
  によると/によれば (#145165) — a Book Four band 6 pattern; here it is a fragment to recognise. Contrast
  with Book Three's らしい (inference from evidence) and ようだ.
- **Candidates:**
  - #197328 ビルは結局医大に行くそうだ。 — It looks like Bill will go to medical school after all.
  - #147929 叔父の死因は癌だったそうです。 — I hear my uncle died of cancer.
  - #195726 マイクは病気で寝こんでいるそうだ。 — They say that Mike is sick in bed.
  - #230445 あの翻訳は原文に忠実だそうだ。 — That translation is said to be true to the original.
    (な-adjective + だ + そうだ, the attachment cell that matters)
  - #145165 新聞によれば、その町に大火があったそうだ。 — According to the papers, there was a big fire
    in the town. (によれば named as a fragment)
- **Depends on:** Book Three ch.6 らしい/ようだ.
- **New words:** 結局 けっきょく 1254730 s1 (N3) · 叔父 おじ 1607070 s1 (N2) · 新聞 しんぶん 1362360 s1 ·
  町 まち 1603990 s1 (N3) · 翻訳 ほんやく 1523400 s1. Optional: 医大 1160030 (N3), 癌 1217110 (N3), 死因
  1310740, 原文 1262340, 忠実 1012210, 寝込む 1360130.
- **Kanji new to the manifest:** 局 叔 聞 町 翻 訳 (癌 因 原 文 忠 if carded; 医 大 父 死 火 taught).

### Lesson 4 — It looks like

- **Order:** 297 · **Title:** It looks like · **Can-do:** Say how something looks about to turn out
- **Teaches:** stem + そうだ — appearance: verb ます-stem (降りそうだ), い-adjective stem (簡単そう →
  no, 簡単 is な: 簡単そうだ; い-adjective 面白そう), and the irregulars よさそう/なさそう (#223406).
  そうな before a noun, そうに before a verb (#100487). The same string as lesson 3's hearsay; what is in
  front decides, and the author states that as the whole lesson. Contrast Book Three's みたい/ようだ
  (conjecture from evidence) — そう is what it looks like now.
- **Candidates:**
  - #195298 まもなく雨が降りそうだ。 — It is going to rain soon.
  - #219389 この問題は一見簡単そうだが実は難しい。 — This problem seems to be easy on the surface,
    but it's really difficult. (clause-joining が: Book Three ch.11 called it けど's formal counterpart)
  - #223406 このネクタイにしましょう、一番よさそうだから。 — I will take this tie, as it seems to be the
    best. (よさそう; ましょう Book Two; 一番 band 0)
  - #100487 彼は不安そうにあたりをきょときょと見回した。 — He looked around uneasily. (そうに)
  - #114934 彼はあなたとうまくやっていけそうな人だった。 — He was the sort of man you could get along
    with. (そうな; やっていける — band 0's ていく in the potential)
- **Depends on:** band 0 lesson 4; Book Two ましょう; Book Three ch.6.
- **New words:** 問題 もんだい 1536010 s1 · 簡単 かんたん 1214330 s1 · 不安 ふあん 1491150 s1 (N3) · 実は
  じつは 1320830 s1 (N3) · まもなく 1215290 s1 (N2). Optional: 一見 1162170, あたり 1448780 (the
  "vicinity" sense — not s1 "hit"), 見回す 1259400.
- **Kanji new to the manifest:** 問 題 簡 単 不 (実 見 bands 1; 安 band 0).

### Lesson 5 — Isn't it, though?

- **Order:** 298 · **Title:** Isn't it, though? · **Can-do:** Put forward a view while leaving room
  to be wrong
- **Teaches:** clause + のではないか (written, hedged assertion — "I suspect that") and its spoken
  form んじゃない(か) — which is also a suggestion (いいんじゃない？) and, with falling intonation after a
  dictionary form, a **prohibition** (食べるんじゃないよ — band 1's imperative family; card one as
  the contrast, teach it as "same string, opposite job"). Plain のではない without か is negation of
  the の (#223523: it's not that I asked). Book Three ch.11 taught ではない; this is what happens
  when の goes in front.
- **Candidates:**
  - #231278 あのパブではビールを水増ししているのではないか。 — I suspect they water down the beer in
    that pub.
  - #228269 ウスターソースがいいんじゃない？ — How about adding some Worcestershire sauce?
  - #178376 君の言うことは極端じゃないか。 — Aren't you pushing it too far? (君: register note —
    band 3)
  - #223523 このテーブルを頼んだのではない。 — I didn't ask for a table here. (plain negation)
  - #204306 そんなにがつがつ食べるんじゃないよ。 — Don't eat like a pig. (the prohibitive contrast)
- **Depends on:** Book Three ch.11 ではない; band 1 lesson 5 (prohibitive な).
- **New words:** 極端 きょくたん 1240380 s1 · 君 きみ 1247250 s1 (N3; blunt/intimate "you" — say so) ·
  水増し みずまし 1371810 s1 · そんなに 2008740 s1 · パブ 1102260 s1. Optional: ウスターソース (author
  verifies), がつがつ.
- **Kanji new to the manifest:** 増 極 端 君 (水 taught).

### Lesson 6 — That's just how it is

- **Order:** 299 · **Title:** That's just how it is · **Can-do:** State a general truth, or recall
  how things used to be
- **Teaches:** ものだ after a plain form: generalisation (〜ものだ / 〜ものではない, "that's the nature
  of it / that's not something you..."), nostalgia with the past (〜たものだ, "I used to"), a wish with
  たい (〜たいものだ), and というものだ ("is what you'd call"). Not plain noun + だ (独自のものだ) —
  Book Three ch.10's もの. Book Three ch.2 taught ものだから and ch.3 ものの; name them so the learner
  files three different things under one noun.
- **Candidates:**
  - #187211 夏はいつもマイアミに行ったものだ。 — During summers, I used to go to Miami.
  - #189201 英語というのは一朝一夕にマスターできるものではない。 — English cannot be mastered
    overnight. (というのは: Book Three ch.10)
  - #226772 お伴したいものです。 — I would like to go with you. (たいものだ; お伴 is humble —
    recognition; band 4 owns お+noun)
  - #213973 そいつは衰退のレトリックというものだ。 — But it's the rhetoric of failure.
  - #219011 これがいわゆる「天ぷら」というものです。 — This is what we call "tempura". (corner brackets
    — `recognitionOnly`)
- **Not this lesson:** #147355 女の子があぐらをかいて座るものではない — a dated gender prescription;
  do not card.
- **Depends on:** Book Three ch.2 ものだから, ch.3 ものの, ch.10 という/というのは.
- **New words:** 衰退 すいたい 1372550 s1 · マスター 1127970 (the verb sense) · そいつ 1006600 s1 (blunt —
  register note) · レトリック 1145640. Optional: 一朝一夕 1164850 (idiom), マイアミ 1126570.
- **Kanji new to the manifest:** 衰 (退 band 0).

### Lesson 7 — Chapter 3 checkpoint

- **Order:** 300 · **Title:** Chapter 3 checkpoint · **Situation:** Integration & checkpoint ·
  `checkpoint: recognition`
- Pairs worth weighting: 降るそうだ (hearsay) against 降りそうだ (appearance); でしょう against
  かもしれない against に違いない; いいんじゃない？ against 食べるんじゃない. No gate text (blocked).

## 4. Gate text and mining budget

Blocked; per-lesson word lists stand in.

## 5. Totals

| | Count |
|---|---|
| Teaching lessons | 6 · Checkpoints 1 · Orders 294–300 |
| Grammar patterns | 6 (lessons 3 and 4 are two patterns on one string, carded separately) |
| Phrases | ~32 |
| New words | ~28 firm (5+5+5+5+5+3), 10 on the N3 gap list, 2 on N2; ~20 optional |
| New kanji | **~40**: 入 方 最 流 行 内 位 復 活 政 府 結 果 局 叔 聞 町 翻 訳 問 題 簡 単 不 増 極 端 君 衰, plus 販 機 骨 折 癌 因 原 文 忠 if their words are carded |
| `recognitionOnly` | #219011 (brackets); #226772 if carded (humble お伴) |

## 6. Authoring checklist

As band 0's, plus: never card a のです sentence where the の is doing nothing visible; keep hearsay
そうだ and appearance そう in separate lessons with the attachment as the whole point; mark 君, そいつ,
だろう-in-speech as register notes with the corpus as evidence; chapter id `b4.band-2`, chapter 3,
checkpoint "Chapter 3 checkpoint", phrase ids `b4band2.<slug>`, file stem `b4-02-reason`, orders
294–300, `kanji: []` throughout.
