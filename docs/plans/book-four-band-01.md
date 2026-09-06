# Book Four, Band 1 — Meaning to, telling to

**Status: design, not content.** Every lesson specified; **no Japanese sentence composed**. Every
example is a Tatoeba pair cited by id from `server/data/jmdict-examples-eng-3.6.2.json`, quoted
verbatim (`04-stage-reading.md` §8). Written by the controller on 2026-09-06 with the same corpus
tooling as `book-four-band-00.md`.

Source brief: `docs/plans/book-four-bands.md` §3a, §4 (this band's row), §6, §7, §9. Shape:
`docs/plans/book-four-band-00.md`. The learner arrives with Books One–Three and Book Four band 0
(orders 277–285: てしまう/ちゃう, ておく, てみる, ていく, てくる, すぎる, まま, ずに/ないで). Book Two
taught つもり, ましょう and ませんか (`grammar.b2-*`, check the manifest for the exact ids) — the
polite stand-ins for what this band builds plainly.

**Shape landed: 7 teaching lessons + 1 recognition checkpoint, global orders 286–293** — the
skeleton's assignment, filled.

**New vocabulary: ~30 firm words, 2–6 per lesson, all from the lessons' own sentences.** Lesson 1's
sentences are almost entirely taught vocabulary, so it carries two words; that is the rule working
(five is a target, not a quota). **New kanji: ~35** (§5), including five characters of long-taught
words that the manifest's 229 never placed (見 道 地 図 金) — the wiring pass decides whether this
band places them.

---

## 1. Attestation

**Method** as band 0: 25,983 unique sentences from `ex.sentences[]`; clean = ≤30 characters, one
utterance, none of the grammar taught after this band (だろう/でしょう, んです/のです, そうだ, keigo).
Script `scratchpad/mine/band1-candidates` (throwaway). **よう is the most overloaded string in the
corpus**; the volitional was searched only by conjugated endings.

| Lesson | Pattern | Clean hits | What the count contains |
|---|---|---|---|
| 1 | plain volitional (う/よう, sentence-final) | 145 (ending in an お-row + う/よう, optionally + か) | Includes であろう/だろう-family written conjecture (#78023, #228332, #219092 — **excluded**, band 2's), and ようにしよう (#225647 — kept: ようにする is Book Three ch.8's). しよう dominates. |
| 2 | ようと思う / ようと思っている | 11 | All genuine. Thin but clean; first-person intention throughout. |
| 3 | ようとする / ようとした / ようとしている | 106 | Includes うとうと (#109890 — onomatopoeia, excluded) and として (#146969 is genuine: 終わろうとしている). Three jobs: trying (盗もうとして), about to (終わろうとしている), failed attempt (開けようとしたら). |
| 4 | imperative 命令形 | 31 clean on a list of common imperatives (やれ, やめろ, 急げ, 言え, 書け, しろ, 来い); a bare regex on え-row endings returns 428, almost all ね-final sentences — **false positives**. | Register is the content, not the count: blunt speech, signs, quotes, self-address. |
| 5 | prohibitive 〜な | 90 (dictionary form + な, sentence-final) | **Sentence-final emphatic な (#74920 してるな, "you're doing good work") is band 3's**, same string — 1 in the first twelve; the tell is the form in front (dictionary form + な = prohibition; anything else = emphasis). |
| 6 | なさい | 297 | Includes ごめんなさい (#226510, fixed phrase — Book One's), ごらんなさい (honorific stem, band 5's), やめなさい/見つけなさい (this lesson's). |
| 7 | たがる / たがっている / たがらない | 18 after screening | **したがって/にしたがって (従って) is a false positive** — 10 of the raw 28, excluded; またがって (#137789) too. The rest are genuine and mostly third person, as the grammar says. |

## 2. Why this band exists

Books One and Two taught the learner to propose politely (ましょう, ませんか), to state intention
politely (つもりです), and to request politely (てください, ないでください). They never taught the
plain forms under those: the volitional that ましょう is the polite version of, the imperative that
てください softens, the prohibitive that ないでください softens, and なさい between them. Book Three
quoted all of them — its own audit noted やれ in a からには sentence "is the blunt imperative, and
the sentence is somebody being told" with no lesson to point at. たがる closes a hole of its own:
Book Two's たい is first person, and the learner has had no way to say what someone else wants.

The band owes band 0 nothing and hands band 2 the volitional (ようと思う is where 思う meets it) and
band 3 the register facts (な emphatic vs. prohibitive; ぞ/ぜ after volitionals).

## 3. The lessons

Conventions as band 0: candidates verbatim by id; words are the untaught content words of carded
sentences (manifest checked 2026-09-06 by reading and written form), with JMdict seq and sense;
N3/N2 marks `coverage-n3.json`/`coverage-n2.json`; kanji lists name characters the 229-character
manifest lacks (band 0's placements excluded where noted).

### Lesson 1 — Let's, plainly

- **Order:** 286 · **Title:** Let's, plainly · **Can-do:** Propose something in plain speech, the
  way ましょう does politely
- **Teaches:** the volitional by class: godan last sound → お-row + う (呼ぶ → 呼ぼう, 割る →
  割ろう); ichidan → stem + よう; する → しよう, 来る → 来よう. Sentence-final it is "let's" (or "I'll",
  self-directed — #226919 お前を娘の夫にしよう is a decision, not an invitation; say the sentence
  decides). ようにしよう = Book Three ch.8's ようにする in the volitional. **Not** であろう/だろう: that
  looks like a volitional of ある/だ and is band 2's conjecture — name the look-alike.
- **Candidates:**
  - #235316 ３時はお茶にしよう。 — Let's have tea at 3:00.
  - #122030 忍者ごっこをしよう。 — Let's make believe we're ninjas.
  - #210943 その犬をスキッパーと呼ぼう。 — Let's call the dog Skipper. (犬: band 0)
  - #223675 このジンをトニック水で割ろう。 — Let's qualify this gin with tonic water. (割る: band 0
    lesson 8, its "dilute" sense — a chance to show the word's second sense)
  - #225647 くどくど言わないようにしよう。 — Let's not go into details. (ようにする: Book Three ch.8)
  - #226919 お前を娘の夫にしよう。 — You shall be my daughter's husband. (the non-"let's" reading;
    お前 is blunt — say so, it is band 3's register)
- **Depends on:** Book Two ましょう (`grammar.b2-*`), Book Three ch.8 ようにする, band 0 lesson 8.
- **New words:** 忍者 にんじゃ 1467470 s1 · くどくど 1003890 s1. Optional: 娘 むすめ (check seq —
  1355930 resolves to じょう "unmarried woman"; the daughter sense is a different entry), 夫 おっと
  1496480 s1.
- **Kanji new to the manifest:** 忍 (娘 夫 if carded; 者 茶 水 犬 are taught or band 0's).

### Lesson 2 — Meaning to

- **Order:** 287 · **Title:** Meaning to · **Can-do:** Say what you intend to do
- **Teaches:** volitional + と思う (I think I'll — the speaker's intention, formed now) and
  と思っている (a standing intention). First person by default; third person takes 思っている. Set
  beside Book Two's つもりです (firmer, a plan) and Book Three's と思います (an opinion, not an
  intention — the same verb, different job because of what precedes it).
- **Candidates:**
  - #202096 デモに参加しようと思う。 — I'm going to join a demonstration.
  - #222865 この夏はこんがり焼こうと思います。 — I am going to try to get a good tan.
  - #74135 電話で済まそうと思いました。 — I thought I could settle it by phone.
  - #227223 お金を借りようと思ってかけずり回った。 — I ran all over town trying to borrow some money.
    (と思って joining; かけずり回る is rare — recognition or skip)
  - #190926 医者が勧めるので、どこかへ転地療養に行こうと思っています。 — I'm thinking of going somewhere
    for a change of air, since my doctor advises me to. (33 characters — `recognitionOnly`; carries
    the standing-intention form)
  - #158934 私はポップ・ミュージックはそろそろ卒業しようと思っているの。 — I feel I'm growing out of pop
    music. (sentence-final の is band 2's; use only if the author wants a 思っている card under 41 kana
    and flags the の)
- **Depends on:** Book Two つもり; Book Three ch.7 と思います (b2-07 `grammar.b2-opinion-omou`).
- **New words:** 参加 さんか 1302090 s1 (N3) · 勧める すすめる 1595680 s1 (N3) · どこか 1189000 s1 (N3) ·
  焼く やく 1350600 (the sense "to tan (skin)" — author picks; s1 is "to burn") · 済ます すます
  1295030 s1. Optional: デモ 1084000 s1, 医者 is taught.
- **Kanji new to the manifest:** 参 加 勧 焼 済.

### Lesson 3 — Trying to, about to

- **Order:** 288 · **Title:** Trying to, about to · **Can-do:** Say that someone tried to do
  something, or was on the point of it
- **Teaches:** volitional + とする: attempt (盗もうとして), attempt that failed (開けようとしたら —
  たら from Book Two), and "about to" with non-volitional subjects (ブームは終わろうとしている). Do not
  state that ようとする always implies failure — #146969 is not about failure — and do not confuse
  with として "as" (Book Four band 6) or うとうと.
- **Candidates:**
  - #86738 彼女は宝石を盗もうとして捕まった。 — She was captured trying to steal jewelry. (宝石: band 0)
  - #110310 彼はロボットを動かそうとした。 — He tried to make the robot run.
  - #201790 ドアを開けようとしたら、ドアの握りがとれた。 — I tried to open the door, and the doorknob
    came off.
  - #146969 小型車のブームは終わろうとしている。 — The small car boom is ending. (about to)
  - #82274 僕に金をせびろうとしても無駄だ。 — It's no use asking me for money. (ようとしても: Book Three
    ch.4's ても; せびる is rare — gloss in the note)
  - #93106 彼女はオレンジからジュースを絞り出そうとした。 — She tried to express juice from the orange.
- **Depends on:** Book Two たら; Book Three ch.4 ても.
- **New words:** 盗む ぬすむ 1448440 s1 · 捕まる つかまる 1514110 s1 · 動かす うごかす 1451170 s1 · 無駄
  むだ 1530510 s1 (N3) · ドア 1087820 s1. Optional: ロボット 1147870, オレンジ 1035860, 金 かね 1242590
  s1 (N3 — the bare noun; お金 is taught), ブーム 1113160.
- **Kanji new to the manifest:** 盗 捕 無 駄 (金 if carded; 動 is band 0's).

### Lesson 4 — Do it

- **Order:** 289 · **Title:** Do it · **Can-do:** Recognise a blunt command, and know when one is
  and is not rude
- **Teaches:** the imperative by class: godan last sound → え-row (やる → やれ, 急ぐ → 急げ, 言う →
  言え, 書く → 書け); ichidan → stem + ろ (やめる → やめろ, 考える → 考えろ); する → しろ, 来る → 来い
  (こい). Register as tendency, not rule: blunt between equals or downward, male-coded in speech,
  **ordinary and unmarked** on signs, in instructions, in quoted speech, in sports and emergencies,
  and to oneself. The polite ladder the learner already owns sits above it: てください (Book One),
  なさい (lesson 6). Book Three ch.2 quoted やれ and called it "the blunt imperative"; this is that
  lesson.
- **Candidates:**
  - #201388 どうせやるなら上手にやれ。 — If you do it at all, do it well. (なら: Book Two)
  - #188722 猿まねはやめろ。 — Don't be a copycat.
  - #183142 汽車に間に合うように急げ。 — Hurry up in order to catch the train. (ように: Book Three ch.8)
  - #174286 後先をよく考えて物を言え。 — Weigh your words well.
  - #174863 現実を回避するのはもうやめろ。 — Stop hiding your head in the sand.
  - #74476 恵一、天ぷら揚がったから、皿持って来い。 — Keiichi, the tempura's done, so bring a plate.
    (the irregular 来い; 揚がる and 皿 the author verifies)
- **Not this lesson:** #191407 悪人でも手柄は認めてやれ uses てやる (the casual てあげる), untaught.
- **Depends on:** Book Two なら, Book Three ch.8 ように, Book One てください for contrast.
- **New words:** やめる 1310680 s1 · 考える かんがえる 1281020 s1 · 上手 じょうず 1353320 s1 · 間に合う
  まにあう 1215260 s1 · 現実 げんじつ 1263710 s1. Optional: 物 もの 1502390 s1 (the plain noun — Book
  Three ch.10 taught the nominaliser; say which this is), 汽車 1222700, 猿まね 1177460 (rare).
- **Kanji new to the manifest:** 考 現 実 (汽 if carded; 上 手 間 合 物 are taught).

### Lesson 5 — Don't

- **Order:** 290 · **Title:** Don't · **Can-do:** Recognise a blunt prohibition
- **Teaches:** dictionary form + な, sentence-final: the imperative's negative twin, same register.
  The look-alike to defuse now: sentence-final な after anything else is emphasis or reflection
  (してるな, いいな) — band 3 teaches it; the tell is the dictionary form immediately in front.
  Softer prohibitions the learner has: ないでください (Book Two ch.1), ないで (band 0 lesson 8), てはいけない
  (Book Three ch.9).
- **Candidates:**
  - #234503 あくどい事をするな。 — Don't do wicked things.
  - #226902 お袋の前ではそのことに触れるな。 — Don't talk about it in my mother's presence.
  - #201814 ドアをバタンと閉めるな。 — Don't shut the door with a bang. (ドア: lesson 3; 閉める taught)
  - #138537 他人のいうことを気にかけるな。 — Don't worry about what others say.
  - #183532 喜怒哀楽を見せるな。 — Don't let your feelings show. (喜怒哀楽 is a four-character idiom —
    gloss it whole; its kanji are not this lesson's to place)
  - #184062 噛みつくといけないのでそのブルドッグに近寄るな。 — Don't go near the bulldog. You wouldn't
    want him to bite you. (といけない, "it won't do if" — untaught frame; flag, recognition only)
- **Depends on:** lesson 4; band 0 lesson 8; Book Three ch.9 てはいけない.
- **New words:** 触れる ふれる 1357990 s1 (N3) · 他人 たにん 1581400 s1 (N3) · 近寄る ちかよる 1242230 s1
  (N2) · 見せる みせる 1259210 s1. Optional: お袋 1002370 s1 (casual "mum" — register note), 気にかける
  1221700 (expression).
- **Kanji new to the manifest:** 触 他 寄 見 (見 is the character of 見る, taught since Book One and
  never placed — the wiring pass decides) (袋 喜 怒 哀 if carded).

### Lesson 6 — Do it, from above

- **Order:** 291 · **Title:** Do it, from above · **Can-do:** Give an instruction the way a parent
  or teacher does
- **Teaches:** ます-stem + なさい: firmer than てください, gentler than the bare imperative, from a
  position of authority (parent, teacher, sign, exam paper). From なさる (band 5's honorific) — name
  the origin, do not teach なさる. ごめんなさい is a fixed phrase the learner already has; ごらんなさい
  is band 5's. なさい appears in eight shipped phrases (Book Two, Book Three) with no lesson — this
  is that lesson.
- **Candidates:**
  - #82590 帽子を弄り回すのはやめなさい。 — Please stop playing with your hat. (やめる: lesson 4)
  - #191316 安全のために御守りを持って行きなさい。 — Take an amulet for safety's sake. (ために: Book
    Three ch.2)
  - #184713 咳、くしゃみ、あくびをする時は口を手で隠しなさい。 — Cover your mouth when you cough, sneeze,
    or yawn. (咳 is taught; 30 characters)
  - #187134 家でごろごろするのをやめて、何かすることを見つけなさい。 — Stop being lazy and find
    something to do. (31 characters — `recognitionOnly`)
  - #123613 道に迷うといけないから、地図をもって行きなさい。 — Take a map with you in case you get lost.
    (といけない again — flag; the map sentence is otherwise the plainest なさい in the corpus)
- **Depends on:** Book One てください; lesson 4.
- **New words:** 迷う まよう 1532710 s1 · 安全 あんぜん 1153930 s1 · 隠す かくす 1170650 s1 · 見つける
  みつける 1604570 s1 · 何か なにか 1188270 s1 (N3). Optional: くしゃみ 1003710 (N2), あくび 1254010 (N2),
  持って行く 1315700, 御守り 1002060.
- **Kanji new to the manifest:** 迷 全 隠 (咳 守 if carded; 安 is band 0's; 何 口 手 家 are taught).

### Lesson 7 — What someone else wants

- **Order:** 292 · **Title:** What someone else wants · **Can-do:** Say what another person wants
  to do
- **Teaches:** ます-stem + たがる: third-person desire, observed from outside, where たい is the
  speaker's own. Usually たがっている (a current wish) or たがらない (reluctance); bare たがる reads as a
  habit and often carries disapproval (#143122 統制したがる) — a tendency, not a rule (#198980
  飼いたがっていますか is a neutral question). Conjugates as a godan verb.
- **Candidates:**
  - #200084 トムはしきりに新車を買いたがっている。 — Tom is eager to buy a new car.
  - #202510 ディーラーは車を売りたがっている。 — The dealer wants to sell a car.
  - #198980 ナンシーは犬を飼いたがっていますか。 — Does Nancy want to have a dog? (飼う taught)
  - #195876 ほんの一握りの男性しか育児休暇を取りたがらない。 — Only a handful of men want to take
    childcare leave. (しか: Book Two)
  - #187499 何事が起こったのか誰もが知りたがっていた。 — Everybody was anxious to know what had
    happened. (embedded question のか — check Book Two taught か-embedding; flag if not)
  - #143122 政府はともすればマスメディアを統制したがる。 — The government tends to control the media.
    (the disapproving bare たがる; ともすれば is rare — recognition)
- **Depends on:** Book Two たい (`grammar.b2-*`), しか.
- **New words:** 新車 しんしゃ 1361920 s1 · 男性 だんせい 1420160 s1 · 休暇 きゅうか 1227610 s1 · 起こる
  おこる 1223680 s1 · 誰も だれも 1416860 s1. Optional: 何事 1188740, 一握り 1160980, ディーラー 1081610,
  政府 1376070.
- **Kanji new to the manifest:** 新 性 起 誰 (車 男 休 暇 are taught).

### Lesson 8 — Chapter 2 checkpoint

- **Order:** 293 · **Title:** Chapter 2 checkpoint · **Situation:** Integration & checkpoint ·
  `checkpoint: recognition`
- Shrinking-set gate over the seven patterns and the band's words. Pairs worth weighting: しよう
  against しましょう (same proposal, two registers); やめろ against やめなさい against やめてください;
  するな against しないで; 買いたい against 買いたがっている. No gate text (blocked).

## 4. Gate text and mining budget

Blocked, as band 0 records; the per-lesson word lists stand in.

## 5. Totals

| | Count |
|---|---|
| Teaching lessons | 7 |
| Checkpoints | 1 |
| Global orders | 286–293 |
| Grammar patterns | 7 |
| Phrases | ~35 |
| New words | ~30 firm (2 + 5 + 5 + 5 + 4 + 5 + 5) + ~15 optional; 9 of the firm words on the N3 gap list, 1 on N2 |
| New kanji | **~35**: 忍 参 加 勧 焼 済 盗 捕 無 駄 考 現 実 触 他 寄 見 迷 全 隠 新 性 起 誰, plus 金 娘 夫 汽 袋 喜 怒 哀 咳 守 if their words are carded. 見 道 地 図 金 are characters of long-taught words the manifest never placed — the wiring pass rules. |
| `recognitionOnly` | #190926, #187134 (over 30 characters); #184062 and #123613 if carded (といけない untaught) |

## 6. Authoring checklist

As band 0's, plus:

1. Search the volitional by conjugated forms; never card a であろう/だろう sentence here.
2. Card no ね-final sentence as an imperative; the imperative list in §1 is the corpus's real set.
3. Screen every な card: dictionary form immediately before な, or it is band 3's emphatic.
4. Screen たがる cards for したがって/従って.
5. Register notes (imperative, お前, お袋) state tendencies with the corpus as evidence, never
   "men say / women say" as rules.
6. Chapter id `b4.band-1`, chapter 2, title = `situation:`, checkpoint "Chapter 2 checkpoint";
   phrase ids `b4band1.<slug>`; file stem `b4-01-meaning`; orders 286–293; `kanji: []` throughout.
