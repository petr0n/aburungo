# Book Four, Band 0 — Finishing what was started

**Status: design, not content.** Every lesson in the band is specified here in enough detail that
authoring the YAML is mechanical. **No Japanese sentence is composed here.** Every example named
below is a Tatoeba pair cited by id from `server/data/jmdict-examples-eng-3.6.2.json`, quoted
verbatim, per `04-stage-reading.md` §8. Written by the controller on 2026-09-06 after the planner
agents were cut off by an API session limit; same method, same corpus, same checks.

Source brief: `docs/plans/book-four-bands.md` §3a (the debt this band pays), §4 (this band's row),
§6 (numbering), §7 (what a breakdown must add — the word list per lesson is new), §9 (traps).
Shape and depth: `docs/plans/book-three-band-00-passive.md`. Grammar the learner arrives with:
everything in `data/content-manifest.json` — Books One–Two's て-form machinery (`n5-16-te-form`,
〜ています, 〜てください, 〜てあげます/〜てくれます/〜てもらいます), Book Two's potential, plain forms,
conditionals, and all eleven Book Three chapters (passive/causative, connectives, stance,
conditions, time, degree, purpose, obligation, reference, register).

**Shape landed: 8 teaching lessons + 1 recognition checkpoint, global orders 277–285** — the
skeleton's assignment, filled. Every pattern cleared attestation with room to spare; this is the
richest band in the book and the risk is choosing, not finding.

**New vocabulary: ~40 words, five per lesson, every one from the lesson's own sentences (§2 of
the skeleton).** New kanji: **roughly 45**, the characters those words carry that the 229-character
manifest lacks — listed per lesson in §3 and totalled in §5. That total is the cost of the
skeleton's vocabulary decision made visible: Book Three's bands placed ten kanji between them.

---

## 1. Attestation

**Method.** All 25,983 unique sentences extracted from `ex.sentences[]` (`lang: "jpn"`), never
from `ex.text` (the headword field — the trap every Book Three breakdown names). Raw = substring
hits. Clean = ≤30 characters, a single utterance (no 「」「」, no second 。), and none of the grammar
Book Four has not yet taught at this point (だろう/でしょう, んです/のです, そうだ, the volitional,
なさい, keigo forms — all bands 1–2 and 4–5). Script: `scratchpad/mine/band0-candidates.mjs`,
throwaway.

| Lesson | Pattern | Raw | Clean | What the raw count contains |
|---|---|---|---|---|
| 1 | てしまう / ちゃう | 329 | 183 | てしまっ dominates (188); ちゃった/ちゃう 55, a few じゃった. No lexical false positives worth naming — しまう as "put away" (1305380 sense 1) is rare in the corpus and the て in front separates it. |
| 2 | ておく / とく | 127 | 91 | ておい 48 is the bulk; **さておき/さておいて** (#146110, #78023) is a fixed conjunction, not this pattern — 2 hits, excluded. **とく/どく as a contraction has zero clean hits**; described, not carded. |
| 3 | てみる | 119 | 72 | てみ 115. Includes てみたい (desire) and てみせる (#111338 やってみせた, "demonstrate" — a different auxiliary, excluded). |
| 4 | ていく | 130 | 93 | **でいく matches いくら and いっぱい** (#212724, #77485, #212218) — 3 false positives in the first fourteen alone; screen on ていっ/ていく/ていき only. |
| 5 | てくる | 434 | 303 | てきた 207 is most of it. Both jobs present: deixis (やってくる, ついてくる, 買ってきて) and change-over-time (近づいてきた, 減ってきている, になってきた). |
| 6 | すぎる | 208 | 156 | **に過ぎない** (#89191 述べていたに過ぎない) is Book Four band 7's pattern, not this one — exclude. 過ぎ as "past (an hour)" (#236041 １０時過ぎ) is the noun. |
| 7 | まま | 72 | 49 | Includes そのまま (fixed, teach as the anchor), あるがまま/なすがまま (literary, recognition only), and ままに + verb. |
| 8 | ずに / ないで | 209 | 127 | ずに 69 of which ~27 are the plain adverbial; ずにいられない (#225690, #209900, #118332) is a fixed emphatic — name it, do not card it as the adverbial. ないで 159 is mostly requests (ないで。/ないでください, Book One's), and **ないです** is the polite negative, not this pattern (#223741, #191010, #75273 excluded). |

## 2. Why this band exists, and why it comes first

`book-four-bands.md` §3a: a learner who has finished Book Three can parse 〜にもかかわらず and
〜ざるを得ない and cannot say 忘れちゃった, 買ってきて or 食べすぎた. These eight forms are the te-form's
second life — the auxiliaries and adverbials that every N3 text, and every conversation, leans on
in nearly every sentence — and Books One and Two stopped at ています/てください/てあげる. Book Three
quoted them constantly: 帰っていった, 減ってきた, 過ぎて appear inside its own attested sentences with
no gloss. This band is where they get one, before bands 1–2 (volitional, imperative, んです,
だろう) build on them.

The band owes two callbacks and makes one promise. It calls back Book Two's te-form chapter (the
shape 〜て + second verb is exactly what an auxiliary is) and Book Three's ようになる (lesson 5's
になってきた sits beside it). It promises band 3 (spoken register) the contraction machinery:
ちゃう is taught here as てしまう's spoken form, and とく/てる are named here for band 3 to build on.

## 3. The lessons

Each lesson: 4–6 candidate sentences, of which the author cards four to five. Words are the
untaught content words of those sentences (checked against the manifest by reading and written
form on 2026-09-06), with JMdict seq; N3/N2 marks the reading's presence on
`data/jlpt/coverage-n3.json` / `coverage-n2.json`. The author verifies every seq and sense before
shipping and drops any word whose sentence is not carded. Kanji lists name only the characters the
229-character manifest lacks, for the wiring pass.

### Lesson 1 — Done, and gone

- **Order:** 277 · **Title:** Done, and gone · **Can-do:** Say that something is finished, or that
  it happened and you wish it hadn't
- **Teaches:** て-form + しまう. Two readings the same form carries — completion (finished, all of
  it) and regret (it happened and cannot be undone) — and the contraction ちゃう/ちゃった (じゃう
  after a voiced て, 読んじゃった). State the two readings as what the sentence around the verb
  decides, not as two forms; the corpus has both in the same shape.
- **Candidates:**
  - #162222 こないだ、カメラをなくしてしまった。 — I lost my camera the other day.
  - #228239 うちのクーラーが故障してしまった。 — The air conditioner is out of order.
  - #234291 アドレス帳を部屋に忘れちゃった。 — I left my address book in my room.
  - #166668 私たちは５時間の旅でぐったりしてしまった。 — We felt dead from the five-hour trip.
  - #234505 アクション場面の少ない映画にはいつも退屈してしまう。 — I'm always bored with films that have little action.
  - #95000 彼女にばっちりキスされちゃったよ。 — She kissed me full on the lips. (passive + ちゃった; the
    callback to Book Three ch.1, and the corpus's clearest "it happened to me" reading)
- **Depends on:** `n5-16-te-form`; Book Three's passive for #95000.
- **New words:** 故障 こしょう 1267180 s1 (N3) · 旅 たび 1553120 s1 (N3) · 場面 ばめん 1355910 s1 (N3) ·
  退屈 たいくつ 1596750 s1 (N3) · 少ない すくない 1348910 s1. Optional if room: うち 1191740 s1
  (one's home — the sense, not 内), カメラ 1038350, クーラー 1043310.
- **Kanji new to the manifest:** 故 障 場 退 屈 少.

### Lesson 2 — Ready in advance, left as it is

- **Order:** 278 · **Title:** Ready in advance, left as it is · **Can-do:** Say you did something
  ahead of time, or left something the way it was
- **Teaches:** て-form + おく: preparation (用意しておいた) and leaving a state in place (つけたままに
  しておく shape, 任せておけば). Both are "do it now for later". Name the contraction とく (しとく,
  買っとく) as what speech does with it, **without a card — the corpus has no clean example** —
  and say band 3 comes back to it. Do not confuse with さておき, a fixed "setting aside".
- **Candidates:**
  - #166624 私たちはあらかじめスナックを用意しておいた。 — We prepared snacks beforehand.
  - #212677 そのフォルダ、共有にしておいて。 — Make that a shared folder.
  - #149773 自分の部屋は出来るだけきちんとしておきたい。 — I want to keep my room as neat as possible.
    (出来るだけ: call back できる限り, Book Three ch.4)
  - #234664 あいつに仕事を任せておけば安心だ。 — You can trust him with any job. (ておけば)
  - #237020 プレゼンテーションの前に資料に目を通しておくのが一番いい。 — It is best to review the
    material before the presentation. (30 characters; the のが nominaliser is Book Three ch.10's)
- **Not this lesson:** #225528 クリーニング取ってきておいて uses てきて before lesson 5 teaches it.
- **Depends on:** Book Two's ば conditional; Book Three ch.4 (できる限り) and ch.10 (の nominaliser).
- **New words:** 用意 ようい 1546220 s1 (N3) · 任せる まかせる 1467150 s1 (N3) · 安心 あんしん 1153890 s1 ·
  一番 いちばん 1165970 s1 (N3) · 自分 じぶん 1318610 s1. Optional: きちんと 1003400 (N3), 資料 1312820
  (N2), 共有 1235240, あらかじめ 1542860.
- **Kanji new to the manifest:** 用 意 任 安 心 番 自 (資 共 if carded).

### Lesson 3 — Give it a try

- **Order:** 279 · **Title:** Give it a try · **Can-do:** Say you tried something to see what
  would happen, or suggest that someone does
- **Teaches:** て-form + みる: do it and see. てみて(ください) as a soft instruction; てみたら as a
  suggestion (call back Book Two's たら); てみると as "on trying, I found" (call back Book Two's と
  of discovery); てみたい as a wish. Separate from てみせる (show someone by doing — not taught).
- **Candidates:**
  - #196781 ヘッドライトをつけてみてください。 — Could you turn on your headlights?
  - #189354 営業の者と話をしてみました。 — I talked with our sales people.
  - #226673 お別れを言いにちょっと立ち寄ってみました。 — I just dropped in to say goodbye.
  - #126036 調べてみるとその宝石はイミテーションだと分かった。 — On examination the jewel proved to be
    an imitation. (てみると)
  - #194328 もう一度それにトライしてみたら。 — Why don't you give it another try? (てみたら)
  - #112180 彼はそれを試してみたくてうずうずしていた。 — He was panting to have a go at it. (てみたくて)
- **Depends on:** Book Two たら and と; Book Two たい.
- **New words:** 調べる しらべる 1429060 s1 · 試す ためす 1312260 s1 · 者 もの 1322990 s1 (N3; the
  humble "person" — say so, since Book Three ch.10's もの is the nominaliser) · 営業 えいぎょう 1173430
  s1 (N3) · 宝石 ほうせき 1516220 s1 (N3). Optional: 別れ 1509490 (N3), 立ち寄る 1551300.
- **Kanji new to the manifest:** 調 試 営 業 宝 石 (別 if carded).

### Lesson 4 — Away from here, on from now

- **Order:** 280 · **Title:** Away from here, on from now · **Can-do:** Say that something moves
  away from you, or keeps going from now on
- **Teaches:** て-form + いく. Two jobs, one form: motion away from the speaker (出掛けていった,
  追っていく) and continuation into the future (生きていく, エスカレートしていく). The tell is whether
  anything physically moves. Written 行く or kana; the corpus has both.
- **Candidates:**
  - #126798 智子はイソイソと出掛けていった。 — Tomoko bounced happily out the door.
  - #226445 カウボーイが牛を牧草地へ追っていく。 — A cowboy is driving cattle to the pasture.
  - #75893 脱線がどんどんエスカレートしていく。 — The digression is escalating more and more.
  - #165556 私達が生きていくためには衣食住が必要です。 — We need food, clothes and a home in order to
    live. (ために: Book Three ch.2)
  - #143662 水着の上に羽織られるもの持っていったほうがいいね。 — It's a good idea to bring something to
    slip on over your bathing suit. (30 characters; passive + ほうがいい, both known)
- **Not this lesson:** #100843 彼は彼女の腕を取り、引きずっていった uses the continuative 取り, Book
  Three ch.11's written joining — fine to read, but the author should prefer the five above.
- **Depends on:** Book Three ch.2 (ために), Book Two ほうがいい.
- **New words:** 追う おう 1432410 s1 · 腕 うで 1562850 s1 · 牛 うし 1231490 s1 (N3) · 生きる いきる
  1378520 s1 · 必要 ひつよう 1487660 s1 (the word; Book Three ch.9 taught the construction 必要がある
  and placed its kanji — call that back). Optional: どんどん 1009320 s2 (rapidly), 脱線 1416560 (N2).
- **Kanji new to the manifest:** 追 腕 (線 衣 if carded; 生 必 要 牛 are taught — 牛 check at wiring).

### Lesson 5 — Towards you, up to now

- **Order:** 281 · **Title:** Towards you, up to now · **Can-do:** Say that something comes your
  way, or has been changing up to now
- **Teaches:** て-form + くる, the mirror of lesson 4: motion towards the speaker (やってくる,
  ついてくる, 買ってきて — go, do, and come back) and change that has been building up to the present
  (近づいてきた, 減ってきている, になってきた). Sit になってきた beside Book Three's ようになる.
- **Candidates:**
  - #226586 お盆が近づいてきた。 — The Bon Festival is near at hand.
  - #229868 ある種の動物はどんどん数が減ってきている。 — Certain animals are fast disappearing.
  - #202686 ついでに私のも買ってきてくれますか。 — Can you buy one for me as well? (Book Two's てくれますか)
  - #163745 私の犬は、どこでも私の行くところへついてくる。 — My dog follows me wherever I go. (ところ:
    Book Three ch.10)
  - #235998 １０分もすれば彼がやってきます。 — He'll be along in ten minutes. (ば)
  - #228187 うちの赤ん坊は口をきくようになってきました。 — Our baby is learning to speak. (ようになる +
    てくる, the direct callback)
- **Depends on:** Book Two てくれますか and ば; Book Three ch.8 ようになる, ch.10 ところ.
- **New words:** 近づく ちかづく 1242170 s1 · 減る へる 1263120 s1 (N3) · 数 かず 1580820 s1 (N3) ·
  動物 どうぶつ 1451470 s1 · 犬 いぬ 1258330 s1. Optional: ついでに 1008050, 赤ん坊 1383310 (N2).
- **Kanji new to the manifest:** 減 数, plus 動 and 犬 — **not checked on 2026-09-06; the wiring pass
  checks** (近 is taught).

### Lesson 6 — Too much

- **Order:** 282 · **Title:** Too much · **Can-do:** Say that something is more than it should be
- **Teaches:** すぎる after an い-adjective stem (大きすぎる, 小さすぎて), a な-adjective stem
  (エキセントリックすぎて), or a verb's ます-stem (食べ過ぎた, 飲みすぎ); the nominal 〜すぎ (出し過ぎ,
  飲みすぎ); the irregular よすぎる/なさすぎる named. Written 過ぎる or kana, both ordinary — the corpus
  has both, so the learner must recognise both. Not に過ぎない ("merely" — band 7's).
- **Candidates:**
  - #223720 このサイズは私には大きすぎます。 — This size is too large for me.
  - #201130 どうやら食べ過ぎたみたいだ。 — I'm afraid I've eaten too much. (みたい: Book Three ch.6)
  - #202121 デメリットが多すぎます。 — It has too many disadvantages.
  - #223657 このスープは、しょっぱ過ぎて飲めないよ。 — This soup is too salty to eat. (すぎて + potential
    negative, the commonest frame)
  - #214534 スピードの出し過ぎは危険です。 — Driving too fast is dangerous. (nominal)
  - #74962 このドライバーは小さすぎて役に立たない。 — This screwdriver is too small to be any use.
- **Depends on:** Book Two potential; Book Three ch.6 みたい.
- **New words:** 危険 きけん 1218560 s1 · 役に立つ やくにたつ 1537980 s1 · スピード 1072310 · スープ
  1067040 · どうやら 1009020 s1. Optional: ワイン 1148850, デメリット 1083990, ドライバー 1088560 s2
  (screwdriver — not s1, the motorist). しょっぱい: author verifies the seq.
- **Kanji new to the manifest:** 危 険 役 過 (the pattern's own kanji) · 飲 (飲める — check; 飲む is
  taught but the character is not in the manifest's list).

### Lesson 7 — Left as it was

- **Order:** 283 · **Title:** Left as it was · **Can-do:** Say that a state was left unchanged
  while something else happened
- **Teaches:** まま after a past verb (つけたまま, 込めたまま, 乗せたまま), a negative (噛み合わないまま),
  and its fixed forms そのまま (anchor — teach whole) and ままにする/ままにしている (leave it that way;
  bridge to lesson 2's ておく). あるがまま/なすがまま are literary — recognition only, one card at most.
- **Candidates:**
  - #197683 ヒーターをつけたまま外出した。 — I went out with the heater on.
  - #113761 彼はこの銃に弾丸を込めたままにしている。 — He keeps this gun loaded. (ままにしている)
  - #228098 うまく噛み合わないまま何時間も話し合った。 — They talked for hours at cross purposes. (ないまま)
  - #141111 船は全乗組員を乗せたまま海中へと沈んでいった。 — Down under the sea went the ship with all
    her crew. (ていった: lesson 4)
  - #235915 １９００年に彼はイギリスを去り、そのまま二度と戻らなかった。 — In 1900, he left England, and
    he never returned. (31 characters — `recognitionOnly`; carries そのまま and 去り, written joining)
  - #161382 私はいつも事物をあるがままに描くことにしている。 — I always make it a point to paint things as
    they are. (あるがまま; ことにしている: Book Three ch.8 — recognition only)
- **Depends on:** lesson 2 (ておく), lesson 4 (ていった); Book Three ch.8 ことにする.
- **New words:** 外出 がいしゅつ 1203800 s1 · 戻る もどる 1535880 (the sense "to return", not s1 "turn
  back half-way" — author picks the sense; Book Three ch.10 verified the reading) · そのまま 1406030
  s1 (N3) · 船 ふね 1602800 s1 (N3) · 描く えがく 1583460 s1 (N3). Optional: 去る 1231650, 話し合う
  1562310, 沈む 1431670, 乗せる 1600270, 二度と 2110850.
- **Kanji new to the manifest:** 出 戻 船 描 (沈 乗 組 員 話 度 if carded; 外 去 合 何 間 海 中 are taught).
  **出 and 話 read as missing from the 229 although 出かける and 話す are taught words** — the
  wiring pass confirms; if genuinely missing, this lesson places them.

### Lesson 8 — Without

- **Order:** 284 · **Title:** Without · **Can-do:** Say that something was done without doing
  something else
- **Teaches:** the adverbial negative: verb ない-stem + ずに (割らずに, かぶらずに; する → せずに,
  never しずに) and its everyday twin 〜ないで (開封しないで送り返した). Both mean "without doing";
  ずに is the more written. Separate two look-alikes the learner already has or will meet: ないで as
  a request (Book One's ないでください, and bare 使わないで — same string, different job, decided by
  what follows) and 〜ずにはいられない (cannot help doing — a fixed emphatic, named not carded).
- **Candidates:**
  - #203324 たまごを割らずにオムレツは作れない。 — You can't make an omelet without breaking eggs.
  - #196686 ヘルメットをかぶらずにバイクに乗るのは危険だ。 — It is dangerous to ride a motorbike
    without a helmet. (かぶる: Book One; 危険: lesson 6)
  - #184197 学生達は身じろぎもせずに講義に聞き入っていた。 — The students sat still, listening to the
    lecture. (せずに — the する irregular, load-bearing)
  - #112693 彼はその手紙を開封しないで送り返した。 — He sent the letter back unopened. (ないで adverbial)
  - #226793 お湯を全部使わないで。 — Don't use all the hot water. (ないで as request — the contrast card)
  - #109822 彼は雨の中を傘もささずに歩きつづけた。 — He went on walking in the rain without an
    umbrella. (傘をさす — author verifies さす's seq; つづける untaught, flag)
- **Depends on:** Book One 〜ないでください and かぶる; Book Two ない-form; lesson 6.
- **New words:** 割る わる 1208000 (the "break/crack" sense — author picks; s1 is "divide") (N3) ·
  手紙 てがみ 1327720 s1 · 講義 こうぎ 1282260 s1 · 送り返す おくりかえす 1402710 s1 · お湯 おゆ 1002510
  s1. Optional: ヘルメット 1119000, バイク 1097810, オムレツ 1035450, 開封 1202920.
- **Kanji new to the manifest:** 割 講 義 紙 送 湯 (封 if carded; 手 is taught).

### Lesson 9 — Chapter 1 checkpoint

- **Order:** 285 · **Title:** Chapter 1 checkpoint · **Situation:** Integration & checkpoint ·
  `checkpoint: recognition`
- Shrinking-set gate over the eight patterns and the band's words (DR-020). The pairs worth
  weighting: てしまう completion against regret; ていく against てくる on the same verb; ずに against
  ないで-the-request; すぎる against に過ぎない (not yet taught — do not test it, but the note may name
  it as coming). Nothing recorded; retry unlimited. No gate text (skeleton §5: blocked on the text
  source, not invented).

## 4. Gate text and mining budget

Both recorded as blocked, per `book-four-bands.md` §5. The mining budget is replaced, for as long
as the library is blocked, by the per-lesson word list above: five words a lesson is the "2–3
unknowns in a 150-word passage" budget applied to five 20-character sentences instead.

## 5. Totals

| | Count |
|---|---|
| Teaching lessons | 8 |
| Checkpoints | 1 |
| Global orders | 277–285 |
| Grammar patterns | 8 (one per lesson; ちゃう rides on lesson 1's card as its spoken form, not a ninth) |
| Phrases | ~40 (5 a lesson; the author may card 4–6) |
| New words | ~40 firm + ~20 optional; 19 of the firm 40 are on the N3 gap list, 3 on N2 |
| New kanji | **~45** if the firm list ships (故 障 場 退 屈 少 用 意 任 安 心 番 自 調 試 営 業 宝 石 追 腕 減 数 危 険 役 過 出 戻 船 描 割 講 義 紙 送 湯, plus 動 犬 飲 to check) |
| `recognitionOnly` | #235915 (31 characters); #161382 if carded |

The kanji count is the skeleton's §2 decision showing its price: one band of Book Four places
more characters than all of Book Three. The wiring pass's component-keyword step
(`src/content/kanji/components.yaml`) will need several hand-written keywords; budget for it.

## 6. Authoring checklist

1. Every phrase a verbatim corpus sentence with a string `tatoebaId`; byte-check by script before
   committing. No `content-source: training` on sentences.
2. Every word verified against JMdict (headword, reading, the sense named above); every word's
   sentence actually carded, or the word dropped. Six readings are already duplicated in the app
   (`pnpm jlpt:coverage` warns) — check the manifest for an existing id before minting `vocab.*`.
3. Words carry `content-source: training` on the gloss, as Books One–Two do; `jlpt` per the
   reference list (N3 where the gap list says so, else the nearest — Book Three's ところ precedent).
4. Screen every candidate again for grammar taught after this band: no だろう/でしょう, んです,
   そうだ, volitional, なさい, keigo. The clean lists above were screened mechanically; read them.
5. List every English departure from Tatoeba in the phrase header by id and kind.
6. `kanji: []` on every lesson; this document's per-lesson lists tell the wiring pass what goes
   where. The wirer confirms 動 犬 飲 出 話 against the manifest before placing.
7. Chapter id `b4.band-0`, chapter 1, title = `situation:`, checkpoint "Chapter 1 checkpoint";
   "band" never in learner text. Phrase ids `b4band0.<slug>`; file stem `b4-00-finishing`.
8. Commit with an explicit pathspec on the four files; message file named for the stem.
