# Book Four, Band 4 — Speaking with care

**Status: design, not content. No Japanese sentence composed.** Every example is a Tatoeba pair
cited by id from `server/data/jmdict-examples-eng-3.6.2.json`, verbatim (`04-stage-reading.md`
§8). Written by the controller on 2026-09-06 with the tooling of `book-four-band-00.md`.

Source brief: `docs/plans/book-four-bands.md` §3 (the `04b` "keigo in production" band, split in
two: this band is the **humble and polite** half, 謙譲語 and 丁重語/丁寧語; band 5 is the honorific
half, 尊敬語), §4, §6, §7, §9. Shape: `book-four-band-00.md`. The learner has Books One–Three and
Book Four bands 0–3 (orders 277–309). Keigo is taught nowhere before this band; the learner has
met fragments as set phrases (ありがとうございます, ごめんなさい, いただきます, お願いします — Book One)
and as glossed strings inside Book Three sentences (お伴, ご面会, 恐縮ですが).

**Shape landed: 8 teaching lessons + 1 recognition checkpoint, global orders 310–318.** Every
pattern is attested; two (申す, させていただく) are thin and say so. Tatoeba's keigo is business-letter
and shop-counter register, which is exactly where a learner meets it first.

**New vocabulary: ~38 firm words**, most of them the business-and-service nouns keigo travels with
(連絡, 提案, 出席, 案内, 返事, 迷惑, 申し訳). **New kanji: ~45** (§5).

---

## 1. Attestation

Method as band 0; clean = ≤32 characters (keigo sentences run long — the ceiling is raised two
characters and the author still marks anything over 41 kana `recognitionOnly`), one utterance.
Script `scratchpad/mine/band45-candidates.mjs` (throwaway).

| Lesson | Pattern | Clean | Notes |
|---|---|---|---|
| 1 | ございます / でございます | 10 (excluding ありがとう/おはよう/おめでとうございます) | Shop and hotel register; two carry 申し訳ございません. |
| 2 | いたす / いたします | 22 (excluding どういたしまして) | Business notices; #191007 carries にともない (band 6) — flag. |
| 3 | 申し上げる / 申す | 13 / **1** | 申す alone is thin (#121768); 申し上げる in お礼申し上げます-type frames is the productive form. 申し込み/申し出/申し訳 are lexical false positives (申し訳 is a word, lesson 1's). |
| 4 | おる / おります · 参る | 21 / 5 | おります mostly in お〜しております frames (overlaps lesson 5 — intended). 参りましたね (#81525) is the "I'm stumped" idiom, excluded. |
| 5 | お + ます-stem + する | 18 | お借りして ×3, お待ちして, お送りしましょうか, お手伝いします. |
| 6 | いただく · 〜ていただけますか | 9 / 33 | ていただけますか is the richest keigo frame in the corpus and the one a learner uses most. |
| 7 | させていただく | 5 | Thin, all genuine; two are 30+ characters. |
| 8 | お / ご + noun | 35 | お名前, お電話, お部屋, お客様, ご案内, ご連絡, お返事. The お/ご choice by word origin is stated as a strong tendency with exceptions named (お電話, お返事 on Sino-Japanese nouns). |

## 2. Why this band exists

A learner who has finished Book Three can read a newspaper paragraph and cannot answer a shop
assistant's いらっしゃいませ、何名様ですか or write ご連絡いたします. The `04b` skeleton put keigo in
production as the fluency stage's third band; it is the first thing an adult learner in Japan is
judged on and the last thing courses teach. This band gives the **speaker's own side** — lowering
oneself, being formally polite — because that is what the learner must produce first (requests,
apologies, business email); band 5 gives the other side, raising the listener, which the learner
must mostly recognise. The split is the one every reference grammar makes; the order is the one a
foreigner's life in Japan makes.

## 3. The lessons

Conventions as band 0. **Register notes state what the corpus shows** (business letters, hotels,
shops, phone) and say that keigo has degrees; nothing here says a form is "always" required.

### Lesson 1 — There is, politely

- **Order:** 310 · **Title:** There is, politely · **Can-do:** Recognise and use the polite copula and
  existence verb of shops, hotels and formal writing
- **Teaches:** ございます as the 丁重 form of あります (お部屋がございます) and でございます for です
  (光栄でございます); 申し訳ございません as the formal apology built on it. ありがとうございます, which
  the learner has had since Book One, is this ございます — say so.
- **Candidates:**
  - #235665 １泊５０ドルのシングルのお部屋がございます。 — We have a single for 50 dollars per night.
  - #123970 当店にはいろいろな種類の本がございます。 — We have a wide choice of books.
  - #205054 それは身に余る光栄でございます。 — The honor is more than I deserve. (身に余る idiom — gloss)
  - #206670 申し訳ございません、その本は在庫切れになっております。 — Sorry, the book is out of stock.
    (おります: lesson 4 — preview)
  - #137270 大変ご不自由をおかけして申し訳ございません。 — I'm sorry to have caused you such
    inconvenience. (お〜する: lesson 5 — preview)
- **New words:** 種類 しゅるい 1328890 s1 (N3) · 当店 とうてん 1449200 s1 · 申し訳 もうしわけ 1363050 s1 (N3) ·
  光栄 こうえい 1272870 s1 · 不自由 ふじゆう 1492680 s1 (N3). Optional: 在庫 1296470, シングル 1063530.
- **Kanji new to the manifest:** 種 類 光 栄 申 由 (在 庫 if carded; 訳 不 自 bands 1–2; 当 店 taught).

### Lesson 2 — We will do it, formally

- **Order:** 311 · **Title:** We will do it, formally · **Can-do:** Announce what you or your side
  will do, in business register
- **Teaches:** いたす as the humble/formal する: noun + いたします (開設いたします, 割引いたします,
  ご連絡いたします), and にいたします for a choice (小額の札にいたしますか). どういたしまして is this verb
  in a set phrase the learner already has.
- **Candidates:**
  - #235007 ７月１０日より札幌支店を開設いたします。 — On July 10, we will open our Sapporo branch.
    (より "from": Book Three ch.10's より? — check; else gloss)
  - #174932 現金払いには１０パーセント割引いたします。 — We give a 10% discount for cash.
  - #229119 いずれご連絡いたします。 — I will get in touch with you.
  - #202685 ついては、私の手紙のコピーを添付いたします。 — I am sending a copy of my letter to you.
    (手紙: band 0)
  - #146743 小額の札にいたしますか、それとも高額の札にいたしましょうか。 — Do you want small bills or
    large? (31 characters — `recognitionOnly`; それとも: band 8 planned — fragment)
- **New words:** 連絡 れんらく 1559900 s1 · 支店 してん 1310230 s1 (N3) · 割引 わりびき 1606950 s1 · 現金
  げんきん 1263550 s1 · 添付 てんぷ 1440880 s1. Optional: 開設 1202800 (N2), いずれ 1566210 (N3; the
  "eventually" sense — not s1 "which"), 札 1298960 (N3), 高額 1283320, コピー 1050590, パーセント 1100610.
- **Kanji new to the manifest:** 支 払 引 連 絡 添 (設 札 幌 額 高 if carded; 現 金 付 bands 1–2; 店 日 taught).

### Lesson 3 — Saying it humbly

- **Order:** 312 · **Title:** Saying it humbly · **Can-do:** Thank, congratulate or state something
  in the humble register of a letter or a speech
- **Teaches:** 申し上げる (humble 言う, productive in お礼申し上げます / お祝い申し上げます /
  お祈り申し上げます — the frame お + noun + 申し上げます) and 申す/申します (humble 言う; the
  self-introduction 〜と申します the learner should own even though the corpus has one hit). Set
  against Book Two's 言う and と言いました.
- **Candidates:**
  - #122872 日頃のご愛顧にお礼申し上げます。 — We really thank you for your patronage.
  - #140082 息子に成り代わってお礼を申し上げます。 — I thank you on behalf of my son.
  - #217164 ご好意に対し厚くお礼を申し上げます。 — I'm deeply grateful for your kindness. (に対し:
    band 6 planned — fragment)
  - #217155 ご子息のご結婚を心よりお祝い申し上げます。 — Please accept our heartiest congratulations
    on the marriage of your son. (ご子息 = honorific "your son", against 息子 — a band 5 point,
    preview)
  - #121768 念のためにもう一度申しますが、締め切りは３月３１日です。 — Let me remind you again that
    March 31st is the due date. (31 characters — `recognitionOnly`)
- **New words:** お礼 おれい 1270810 s1 · 息子 むすこ 1404390 s1 · 結婚 けっこん 1254790 s1 · お祝い おいわい
  1612770 s1 · 締め切り しめきり 1594590 s1 (N2). Optional: 好意 1277530, 日頃 1464070, 念のため 1469350.
- **Kanji new to the manifest:** 礼 息 婚 祝 締 切 (頃 愛 顧 念 厚 成 if carded; 子 日 taught).

### Lesson 4 — We are, we go, humbly

- **Order:** 313 · **Title:** We are, we go, humbly · **Can-do:** State your own side's situation
  and movements in service register
- **Teaches:** おる/おります as the 丁重 いる (揺れております, お待ちしております — the ています of
  business); 参る/参ります as humble 行く/来る (ただいま参ります). 承る (humble 受ける/聞く) is met in
  #216998 as a service-counter set phrase — gloss whole. Note the ている → ております shift: the same
  aspect, one register up.
- **Candidates:**
  - #203616 ただ今気流の関係で揺れております。 — We are currently experiencing some turbulence.
  - #184955 皆様にご迷惑をおかけしております。 — Excuse us for the inconvenience. (お〜する: lesson 5)
  - #216998 ご用は承っておりますか。 — Is anybody waiting on you?
  - #203657 ただいま参ります。 — I will be with you right away.
  - #147784 出来るだけ早く参ります。 — I'll come as soon as I can. (出来るだけ: band 0)
- **New words:** 関係 かんけい 1215810 s1 · 揺れる ゆれる 1545710 s1 · 皆様 みなさま 1202260 s1 · 迷惑 めいわく
  1532800 s1 · ただいま 1538960 (the "right now" sense — s1 is the greeting; both worth the note) (N2).
  Optional: 承る 1349440 (N2), 気流 (author verifies).
- **Kanji new to the manifest:** 係 揺 皆 様 惑 (承 if carded; 迷 band 1; 関 気 taught).

### Lesson 5 — Doing it for you

- **Order:** 314 · **Title:** Doing it for you · **Can-do:** Offer to do something, or ask to borrow
  something, in humble form
- **Teaches:** お + ます-stem + する/いたす: お借りする (borrow, humbly), お待ちする, お送りする, お手伝いする;
  in requests お借りしてもよろしいですか (よろしい = polite いい). Note the ましょうか offer (Book Two)
  wearing keigo: お送りしましょうか. Which verbs take this frame is lexical — the note says so and
  gives the corpus's set.
- **Candidates:**
  - #222986 このワープロをお借りしていいですか。 — May I use this word processor?
  - #219525 この本をお借りしてもよろしいですか。 — May I borrow this book? (ても: Book Three ch.4)
  - #228856 いつでもお手伝いします。 — I am always ready to help you.
  - #226886 お宅までお送りしましょうか？ — May I escort you home?
  - #161715 お便り楽しみにお待ちしております。 — I am looking forward to hearing from you. (おります:
    lesson 4)
- **New words:** よろしい 1224880 s1 (N3) · お宅 おたく 1002400 s1 · 便り たより 1512410 s1 (N3) · 楽しみ
  たのしみ 1207250 s1 · いつでも 1577130 s1 (N3). Optional: ワープロ 1148520, 手伝い 1328170.
- **Kanji new to the manifest:** 宅 (借 手 伝 便 楽 待 taught; 送 band 0).

### Lesson 6 — Could you possibly

- **Order:** 315 · **Title:** Could you possibly · **Can-do:** Make a request one step above
  てください
- **Teaches:** 〜ていただけますか / 〜ていただけませんか — the request frame (potential of いただく,
  humble もらう); and いただく itself as humble receiving (ご紹介いただきました). Ladder from band 3:
  て < てよ < てくれる？ < てください < てくださいますか (band 5) < ていただけますか. Book Two's てもらう is
  the plain form this raises.
- **Candidates:**
  - #223546 このデータをアップデートしていただけますか。 — Could I get you to update this data for me?
  - #215552 ショッピングバッグに入れていただけますか。 — Could you put it in a shopping bag for me?
  - #194316 もう一度メニューを見せていただけますか。 — Can I have the menu again, please? (見せる: band 1)
  - #199615 トロント国際空港に近い部屋をとっていただけませんか。 — Would you please reserve a room near
    the Toronto International Airport? (30 characters)
  - #190141 一晩私たちを泊めていただけませんか。 — Will you put us up for one night?
- **New words:** データ 1081190 s1 · バッグ 1099100 s1 · 一晩 ひとばん 1165960 s1 · 国際 (author verifies —
  こくさい) · 空港 (author verifies — taught? check). Optional: ショッピング 1062760, トロント 1087530.
- **Kanji new to the manifest:** (国 際 空 港 — check at wiring; 晩 泊 taught; 一 taught).

### Lesson 7 — Allow me to

- **Order:** 316 · **Title:** Allow me to · **Can-do:** Announce your own action as something the
  listener permits
- **Teaches:** させていただく — causative (Book Three ch.1) + いただく: "I will (with your leave)".
  Genuinely humble in やめさせていただきます, 修正させていただきます; over-used in modern service speech
  — say so as a register note, not a rule. Five corpus sentences; all carded or described.
- **Candidates:**
  - #167353 私この度一身上の都合でやめさせていただきます。 — I wish to resign from my work for purely
    personal reasons. (都合 taught; 一身上 gloss whole)
  - #149555 失礼ですが御提案を修正させていただきます。 — I beg to modify your proposal.
  - #140433 相席させていただいてよろしいですか。 — May I share this table with you?
  - #214004 ぜひ取引させていただきたいと思います。 — We would love to work with you. (たいと思います:
    Book Two)
  - #233498 あなたのパーティーに喜んで出席させていただきます。 — I will be happy to attend your party.
- **New words:** 提案 ていあん 1436320 s1 (N3) · 修正 しゅうせい 1332130 s1 (N3) · 出席 しゅっせき 1339460 s1
  (N3) · 取引 とりひき 1599120 s1 · 失礼 しつれい 1320230 s1. Optional: ぜひ 1374530, 喜んで 1218770, 相席
  1401080, パーティー.
- **Kanji new to the manifest:** 提 案 修 正 席 (相 if carded; 失 band 3; 取 出 taught/band 0).

### Lesson 8 — Your name, your call

- **Order:** 317 · **Title:** Your name, your call · **Can-do:** Put お and ご where service Japanese
  puts them
- **Teaches:** お/ご + noun as beautification and respect: お名前, お電話, お部屋, お客様, お返事; ご案内,
  ご連絡. Tendency: お before native words, ご before Sino-Japanese — with the exceptions the corpus
  itself shows (お電話, お返事). 様 after a customer. Book Three ch.11's ゆえ lesson met ご in passing.
- **Candidates:**
  - #233571 あなたのお名前のスペルをお願いします。 — Could you spell your name, please?
  - #196950 フリーダイヤル１―８００―４４６―２５８１にお電話ください。 — Call us toll-free at
    1-800-446-2581. (the number is 30 kana of digits — `recognitionOnly`, or drop)
  - #196688 ベルボーイがお部屋にご案内します。 — The bellboy will show you to your room.
  - #227316 お客様、テーブルにライターをお忘れですよ。 — Sir, you have left your lighter on the table.
    (お忘れです — the honorific noun frame, band 5 preview)
  - #190029 一両日中にお返事します。 — I'll give you an answer in a day or two.
- **New words:** お客様 おきゃくさま 1001770 s1 · 案内 あんない 1154860 s1 · 返事 へんじ 1512220 s1 · お名前
  おなまえ 2853328 s1 (or teach 名前's お-form in the note — 名前 is taught) · スペル 1073140. Optional:
  ライター 1137880, 一両日 (author verifies).
- **Kanji new to the manifest:** 客 様 案 (両 事 名 電 話 — 話 band 0; others taught).

### Lesson 9 — Chapter 5 checkpoint

- **Order:** 318 · **Title:** Chapter 5 checkpoint · **Situation:** Integration & checkpoint ·
  `checkpoint: recognition`
- Pairs worth weighting: あります against ございます; します against いたします; 言います against 申します;
  ています against ております; てもらえますか against ていただけますか. No gate text (blocked).

## 4. Gate text and mining budget

Blocked; per-lesson word lists stand in.

## 5. Totals

| | Count |
|---|---|
| Teaching lessons | 8 · Checkpoints 1 · Orders 310–318 |
| Grammar patterns | 8 |
| Phrases | ~40 |
| New words | ~38 firm, 11 on the N3 gap list, 3 on N2; ~20 optional |
| New kanji | **~45**: 種 類 光 栄 申 由 支 払 引 連 絡 添 礼 息 婚 祝 締 切 係 揺 皆 様 惑 宅 提 案 修 正 席 客 案, plus 在 庫 設 札 幌 額 高 頃 愛 顧 念 厚 成 承 相 国 際 空 港 if their words are carded |
| `recognitionOnly` | #146743, #121768 (over 30 characters); #196950 (digit string) |

## 6. Authoring checklist

As band 0's, plus: every register statement names the corpus register it comes from (business
letter, hotel, shop, phone); no "always required"; keep humble (this band) and honorific (band 5)
apart — where a sentence carries both (#217155, #227316), the note says which half is which;
chapter id `b4.band-4`, chapter 5, checkpoint "Chapter 5 checkpoint", phrase ids `b4band4.<slug>`,
file stem `b4-04-humble`, orders 310–318, `kanji: []` throughout.
