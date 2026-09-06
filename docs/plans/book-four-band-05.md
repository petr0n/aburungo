# Book Four, Band 5 — Raising the other person

**Status: design, not content. No Japanese sentence composed.** Every example is a Tatoeba pair
cited by id from `server/data/jmdict-examples-eng-3.6.2.json`, verbatim (`04-stage-reading.md`
§8). Written by the controller on 2026-09-06 with the tooling of `book-four-band-00.md`.

Source brief: `docs/plans/book-four-bands.md` §3 (the honorific half of `04b`'s keigo band), §4, §6,
§7, §9. Shape: `book-four-band-00.md`. Band 4 (orders 310–318) taught the humble and polite side;
this band teaches 尊敬語 — the forms that raise the listener or a third person — mostly for
**recognition**: a learner hears them from shop staff, reads them in letters addressed to them,
and produces only the request frames (てくださいますか, お待ちください).

**Shape landed: 6 pattern lessons + 1 contrast lesson + 1 recognition checkpoint = 8 lessons,
global orders 319–326.** Lesson 7 carries no new pattern (the b2-09 / b3-03 precedent): it sets the
three-way verb sets (言う/申す/おっしゃる, 行く/参る/いらっしゃる, 食べる/いただく/召し上がる) side by side
from cards already taught.

**New vocabulary: ~25 firm words.** **New kanji: ~15** (§5).

---

## 1. Attestation

Method as band 4 (≤32 characters). Script `scratchpad/mine/band45-candidates.mjs` and
`band5-honorific.mjs` (throwaway).

| Lesson | Pattern | Clean | Notes |
|---|---|---|---|
| 1 | いらっしゃる | 11 | Includes いらっしゃいませ (set phrase) and またいらっしゃい (imperative form). |
| 2 | おっしゃる · ご覧になる | 4 · 2 | Both thin; ご覧なさい (#148364) and ご覧の通り (#74644) are the corpus's only ご覧 — recognition. |
| 3 | 召し上がる · なさる | 5 · 5 | なさる survives in the corpus almost only as なさいますか at counters (#214623, #202257); its imperative なさい is band 1's. |
| 4 | くださる | 10 (excluding ください) | てくださいますか ×3 (request), お恵みくださった (お + stem + くださる). |
| 5 | お + ます-stem + になる · お + ます-stem + ください · おいでになる | 3 · 4 · ~6 | お〜になる is thin (#189528, #229032, #141440); おいで matches におい (smell) and the imperative おいで — screened. |
| 6 | れる / られる as honorific | ~5 genuine of 75 raw | Almost all raw hits are passives (Book Three ch.1). Genuine: #220454 支持される方, #211878 出席されること, #76660 やけ食いをされる方, #202233 来られる (ambiguous with potential — the ambiguity is the lesson). |
| 7 | contrast lesson | — | No new pattern; reuses cards from bands 4–5. |

## 2. Why this band exists

Band 4 taught the learner to lower themselves; nothing yet lets them understand the assistant who
says お預けになる荷物はございますか or the letter that says ご出席くださるようお願い申し上げます. The
honorific forms are the half of keigo a foreigner receives far more than gives, which is why this
band is weighted to recognition and why its one production frame is the request (てくださいますか,
お待ちください). It also closes a loop Book Three opened: chapter 1's passive lesson named the
honorific られる ("a superior's 来る becomes 来られる out of respect... a chapter about register that
this chapter is not") — this is that chapter.

## 3. The lessons

Conventions as band 0. Register notes as tendencies with the corpus as evidence.

### Lesson 1 — They are here, respectfully

- **Order:** 319 · **Title:** They are here, respectfully · **Can-do:** Recognise the honorific
  いる/行く/来る, and greet a customer with it
- **Teaches:** いらっしゃる as honorific いる, 行く and 来る (one verb, three jobs — the sentence
  decides); ていらっしゃる for ている (似ていらっしゃいます); the set phrases いらっしゃいませ (shop
  greeting) and いらっしゃい (welcome / come). Band 4's 参る is its humble mirror.
- **Candidates:**
  - #226613 お母さんはいらっしゃいますか。 — Is your mother at home? (いる)
  - #216749 サファリパークにいらっしゃるなら５番のバスです。 — If you are going to the safari park,
    take the No.5 bus. (行く; なら: Book Two)
  - #232683 あなたはご両親のどちらに似ていらっしゃいますか。 — Which of your parents do you take after?
    (ている; 両親 taught)
  - #228460 いらっしゃいませ、何名様ですか。 — Good evening. How many are in your party?
  - #146346 紹介者はいらっしゃいますか。 — Did anybody recommend us to you?
- **New words:** 似る にる 1314600 s1 (N3) · 紹介 (author verifies — しょうかい, common) · 何名 (author
  verifies) · 番 (taught? — the counter; check). Optional: サファリパーク, 紹介者 1351440.
- **Kanji new to the manifest:** 似 紹 (介 名 様 — 様 band 4; check others at wiring).

### Lesson 2 — They say, they see

- **Order:** 320 · **Title:** They say, they see · **Can-do:** Recognise the honorific 言う and 見る
- **Teaches:** おっしゃる (honorific 言う; おっしゃってください as the polite "please tell us") against
  band 4's 申す; ご覧になる (honorific 見る) in its two corpus shapes, ご覧なさい (a gentle imperative
  from above — band 1's なさい) and ご覧の通り ("as you see"). Both thin in the corpus and both
  common in life; the note says so.
- **Candidates:**
  - #224623 ここではどんどん意見をおっしゃってかまいません。 — You can speak out freely here.
    (てかまわない — not taught; gloss and flag)
  - #76178 御社のお考えを先におっしゃってください。 — Please let us know your company's thoughts on this
    matter first.
  - #226579 お名前と社会保障番号をおっしゃって下さい。 — State your name and social security number,
    please. (お名前: band 4)
  - #148364 受付で聞いてご覧なさい。 — Please ask at the information desk.
  - #74644 残念ながら昨日はご覧の通りの結果となりました。 — Unfortunately, the results yesterday were
    as you see. (ながら: Book Three ch.3; 結果: band 2 — 30 characters)
- **New words:** 意見 いけん 1156530 s1 · 受付 うけつけ 1588060 s1 · 御社 おんしゃ 1270380 s1 · 考え かんがえ
  1281000 s1 (N3; the noun of band 1's 考える) · 先に さきに 1387280 s1. Optional: 社会保障 (author
  verifies), 番号 (author verifies — taught?).
- **Kanji new to the manifest:** 意 見 受 御 (意 見 bands 0–1; 先 社 taught; 付 band 1).

### Lesson 3 — Please eat, what will you have

- **Order:** 321 · **Title:** Please eat, what will you have · **Can-do:** Recognise the honorific
  食べる/飲む and する at a counter
- **Teaches:** 召し上がる (honorific 食べる/飲む; 召し上がれ is its imperative — "help yourself") against
  band 4's いただく; なさる (honorific する) as it survives in service speech, なさいますか — "what
  will you have?" — and as the source of band 1's なさい.
- **Candidates:**
  - #224548 ここで召し上がりますか、それともお持ち帰りですか。 — Is this to eat here, or to go?
    (お持ち帰り: お + noun, band 4)
  - #215035 スープは熱いうちに召し上がって下さい。 — Eat your soup while it is hot. (うちに: band 0;
    スープ: band 0)
  - #194141 もう少しケーキを召し上がりませんか。 — Will you have some more cake? (ませんか: Book Two)
  - #214623 ステーキの焼き方はどうなさいますか。 — How would you like your steak? (焼き方 — 方 かた
    "way of", band 2 lesson 1's 仕方)
  - #202257 デザートは何になさいますか？ — What would you like for dessert?
- **New words:** 持ち帰り もちかえり 1770030 s1 · ケーキ 1047860 s1 · ステーキ 1070280 s1 · デザート
  1082850 s1 · それとも 1007010 s1 (N3; band 8 will teach it as a conjunction — here a fragment).
- **Kanji new to the manifest:** 召 (持 帰 熱 少 — 少 band 0; others taught).

### Lesson 4 — Would you kindly

- **Order:** 322 · **Title:** Would you kindly · **Can-do:** Make a request that honours the
  listener
- **Teaches:** くださる as honorific くれる (Book Two's てくれる one register up); the request frame
  てくださいますか (the honorific counterpart of band 4's ていただけますか — both ask the same thing
  from opposite sides); お + ます-stem + くださる; and ください as its imperative, which the learner
  has had since Book One and now sees the verb behind.
- **Candidates:**
  - #194302 もう一度言ってくださいますか。 — Could you repeat that, please?
  - #202764 ちょっと時間をさいてくださいますか。 — Can you spare me a few minutes? (時間をさく — gloss)
  - #141203 洗濯物を持っていくために誰かよこしてくださいますか。 — Could you send someone up to pick up
    some laundry? (ていく: band 0; ために: Book Three ch.2; 31 characters — `recognitionOnly`)
  - #144912 神は私に富をお恵みくださった。 — God has blessed me with riches. (お + stem + くださる;
    literary — recognition)
  - #199060 なるべく早く、全額をご送金くださるようお願いします。 — May we ask you to remit the settlement
    in full at your earliest convenience? (ご + noun + くださる; ように: Book Three ch.8; 30 characters)
- **New words:** 洗濯物 せんたくもの 1391020 s1 · 誰か だれか 1416840 s1 (N3) · なるべく 1375620 s1 · 全額
  ぜんがく 1394970 s1 · 神 かみ 1364440 s1 (N3). Optional: 富 1496730, 恵み 1250470, 送金 1402750.
- **Kanji new to the manifest:** 洗 濯 神 (富 恵 if carded; 全 band 1; 額 band 4; 誰 band 1).

### Lesson 5 — The honoured action

- **Order:** 323 · **Title:** The honoured action · **Can-do:** Recognise the general honorific frame
  and use its one request form
- **Teaches:** お + ます-stem + になる (the productive honorific: お持ちになる, お出かけになる, お出になる);
  お + ます-stem + ください (お待ちください, お使いください — the request the learner produces);
  おいでになる (honorific 来る/行く/いる, the older cousin of いらっしゃる). Band 4's お + stem + する is
  the same frame pointed the other way — the pair is the lesson.
- **Candidates:**
  - #189528 雨具をお持ちになりましたか。 — Do you have rain gear with you?
  - #229032 いつお出かけになりますか。 — When will you go out?
  - #216089 しばらく電話を切らずにお待ちください。 — Please hold the line a moment. (ずに: band 0)
  - #202849 ちょっとお待ちください、受領書をお書きします。 — Please wait a moment while I write out your
    receipt. (both frames in one sentence — the contrast card)
  - #228596 いつ旅行においでになりますか。 — When will you go on a journey?
  - #222939 この雨の中をおいでにならないでください。 — Don't bother coming in this rain.
- **New words:** 雨具 あまぐ 1171940 s1 · しばらく 1304420 s1 · 切る (taught — the "hang up" sense; note) ·
  受領書 じゅりょうしょ 1937630 (rare — optional) · お出かけ 1338475 (N2). Firm: 雨具, しばらく, お出かけ.
- **Kanji new to the manifest:** 具 (受 lesson 2; 領 書 if 受領書 is carded; 雨 旅 電 話 待 — 話 band 0).

### Lesson 6 — The passive that is not one

- **Order:** 324 · **Title:** The passive that is not one · **Can-do:** Tell honorific れる/られる
  from the passive and the potential
- **Teaches:** the light honorific: れる/られる on a verb whose subject is the honoured person
  (出席される, 支持される方). Book Three ch.1 named it and said "context does the sorting"; this
  lesson does the sorting: no agent marked に (unlike the passive), an honoured subject, often 方
  after it. 来られる is ambiguous with the potential (#202233) — the corpus's own example of why.
  Thin: the corpus has about five genuine sentences; two or three cards, the rest described.
- **Candidates:**
  - #220454 この提議を支持される方は賛成とおっしゃって下さい。 — All in favor of this proposition will
    please say Aye. (される方; おっしゃって: lesson 2 — 30 characters)
  - #211878 その会合には出席されることが望ましい。 — It is desirable that you should attend the
    meeting. (出席: band 4)
  - #76660 ストレスでやけ食いをされる方も多いと思います。 — I think there are many who binge eat from
    stress. (される方; やけ食い gloss)
  - #202233 てっきりあなたが我々といっしょに来られるものと思っていました。 — I took it for granted that
    you would come with us. (the ambiguous one — recognition; 31 characters)
- **New words:** 会合 (author verifies — かいごう) · ストレス (author verifies) · 望ましい (author verifies
  — のぞましい) · 賛成 (author verifies — さんせい). Firm list depends on which cards ship.
- **Kanji new to the manifest:** (支 持 提 議 賛 望 — 支 提 band 4; check the rest at wiring).

### Lesson 7 — Three ways to say it

- **Order:** 325 · **Title:** Three ways to say it · **Can-do:** Choose the register of a verb from
  who is doing it
- **Teaches:** no new pattern. The special-verb table as three columns, plain / humble / honorific,
  from cards already taught: 言う・申す・おっしゃる; 行く/来る/いる・参る/おる・いらっしゃる; 食べる/飲む・
  いただく・召し上がる; する・いたす・なさる; 見る・(拝見する, named only)・ご覧になる; くれる/もらう・
  いただく・くださる. The rule is who the subject is, never how polite the situation feels — the
  one absolute this band does state, and it is the one reference grammars state.
- **Candidates:** reuse from bands 4–5 (b3-03 lesson 4 precedent: `phraseIds` may repeat earlier
  lessons'; the audit of that chapter judged it harmless to the SRS). No new words.

### Lesson 8 — Chapter 6 checkpoint

- **Order:** 326 · **Title:** Chapter 6 checkpoint · **Situation:** Integration & checkpoint ·
  `checkpoint: recognition`
- Pairs worth weighting: いらっしゃいます against 参ります against います; おっしゃる against 申す;
  てくださいますか against ていただけますか; 来られる (honorific) against 来られる (potential) against
  Book Three's passive. No gate text (blocked).

## 4. Gate text and mining budget

Blocked; per-lesson word lists stand in.

## 5. Totals

| | Count |
|---|---|
| Teaching lessons | 7 (6 patterns + 1 contrast) · Checkpoints 1 · Orders 319–326 |
| Grammar patterns | 6 |
| Phrases | ~30 new + reuse in lesson 7 |
| New words | ~25 firm, 4 on the N3 gap list, 1 on N2; ~10 optional pending author verification |
| New kanji | **~15**: 似 紹 受 御 召 洗 濯 神 具, plus 介 富 恵 領 書 会 賛 望 議 if their words are carded |
| `recognitionOnly` | #141203, #202233 (over 30 characters); #144912 (literary); lesson 6 by design |

## 6. Authoring checklist

As band 0's, plus: this band is recognition-weighted — say so in the header and mark cards
accordingly; the three-column table in lesson 7 is built only from forms this book has carded;
never write "keigo is always required with X" — register as tendency with the corpus register
named; chapter id `b4.band-5`, chapter 6, checkpoint "Chapter 6 checkpoint", phrase ids
`b4band5.<slug>`, file stem `b4-05-honorific`, orders 319–326, `kanji: []` throughout.
