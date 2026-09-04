# Book Three, Band 6 — Degree and comparison

**Status: design, not content.** This document specifies every lesson in the band in enough
detail that authoring the YAML is mechanical. **No Japanese sentence is composed here.** Every
Japanese fragment below is either an existing word/pattern already shipped (cited by manifest id)
or an attested Tatoeba sentence quoted with its id — never invented, per `04-stage-reading.md` §8.

Source brief: [`book-three-bands.md`](book-three-bands.md) §3 (band 6's row), §3b (the passive band
that opens the book and shifts every later band's global order), §4 (what a band breakdown must
add), §3b's own table (raw attestation ceilings for this band's seven patterns). Sourcing rule:
[`04-stage-reading.md`](04-stage-reading.md) §8. Worked example for depth and voice:
[`book-two-chapter-01.md`](book-two-chapter-01.md). Rule-chapter template:
[`n5-16-te-form.yaml`](../../src/content/lessons/n5-16-te-form.yaml). Siblings for shape:
[`book-three-band-01.md`](book-three-band-01.md) and
[`book-three-band-02.md`](book-three-band-02.md).

**Shape landed: 7 teaching lessons + 1 recognition checkpoint = 8 lessons, global order 244–251 —
the full range the brief pre-assigned, and every one of the skeleton's seven patterns survives.**
That is the opposite of what the brief itself expected — it flagged に比べて (ceiling 5) and 反面
(ceiling 4) as likely cuts. Hand-classification found both genuinely attested at exactly those
ceilings, clean, no false positives, and at a depth this book has already shipped lessons on (Band
1 kept からには on 3 sentences and ことだから on 2). See §1.

**New vocabulary: 0, by design** (mining, not lessons — `book-three-bands.md` §1). **New kanji: 3**
— 比, 反, 面, both new-kanji patterns concentrated in the band's two thinnest, most written-register
lessons (に比べて, 反面). See §1 and §4.

---

## 1. Attestation — what I found, and where the brief's own expectations were wrong

Counted directly against `server/data/jmdict-examples-eng-3.6.2.json` (25,983 unique Tatoeba
sentences), the same file and the same `ex.sentences[].lang === "jpn"` field every sibling band
reads. Every raw hit was read by hand, not just counted — this band's whole premise is that the
ceilings in `book-three-bands.md` §3b are string counts, not construction counts, and four of the
seven patterns needed real separation work.

| Pattern | Raw hits (my search) | §3b's ceiling | Genuine, after hand-classification | Verdict |
|---|---:|---:|---:|---|
| だけ | 332 | 332 | **~206** core "only/just" + 6 だけに + 2 だけあって | Richest in the band. Not remotely at risk. |
| ほど | 181 | 181 | **~156** (147 comparison/degree + 9 ば〜ほど correlative) | Rich. |
| くらい/ぐらい | 107 (89+18) | 89 | **105** (2 false positives found, see below) | Rich, and it is genuinely a second job of an owned word (see §6.2). |
| ばかり | 82 | 82 | **82** — every raw hit is genuine; no collision word contains ばかり | Rich, two real jobs (see below). |
| どころか | 9 | 9 | **9** — every raw hit is genuine | Thin but clean. Ceiling matched exactly. |
| に比べて (+に比べれば, に比べ) | 10 | 5 | **10**, 5 in the exact て-form alone | **Survives** — the brief expected a cut. |
| 反面 | 4 | 4 | **4** — every raw hit is genuine | **Survives** — the brief expected a cut. Thinnest lesson in the band, same tier as Band 1's ことだから (2) and からには (3), both kept there. |

**Two collisions I found that a plain substring count would have shipped wrong, neither of which
the brief's ceiling table could see because it counts strings, not constructions:**

- **いただけ (potential of いただく, "to receive/could you...") is not だけ.** 62 of だけ's 332 raw
  hits are actually the potential-request conjugation of a different verb — 見せていただけますか
  ("could you show me"), ご紹介いただけませんか ("could you introduce me"). These are real,
  common, and completely unrelated to the limiting particle だけ; they collide only because
  いただく's potential stem いただけ happens to end in the same two characters. A further 56 hits
  are だけど/だけれど, which is not a separate word either — it is だ (copula) + けど, already
  taught in `b2-03-joining-sentences.yaml`. Neither should be sourced as a だけ teaching example.
  Four raw hits (敷いただけの, 一通届いただけで, できるだけ早く, 聞いただけで) *look* like いただけ
  hits on a substring scan but are genuine だけ — a ku-verb's plain-past ending in いた, immediately
  followed by だけ, spells いただけ by coincidence. I checked all 66 いただけ-substring hits by hand
  to pull those four back out; **do not trust an automated いただけ filter without a human pass.**
- **くらい/ぐらい has two of its own collisions, both genuine false positives, not variant jobs:**
  [#188444] 屋根にいく階段は狭くて急でくらいです — "the staircase... is narrow, steep, and dark" —
  くらい here is **暗い** ("dark"), an ordinary い-adjective, written in hiragana. [#216241]
  しかし今は、一目見て、サメがその人にくらいつくのは避けられない — くらいつく is **食らい付く**
  ("to sink its teeth into"), a different verb entirely. Neither is the degree particle. This is
  exactly the kind of trap the brief's warning about だけ/ほど turned out to generalize to くらい
  too, and it was not on my radar until I hand-read the sample — worth stating for whoever plans
  band 5 or later bands with a similarly common kana string.

**ほど's own false-positive family, excluded from the count above:** なるほど (11 hits — a fixed
interjection, "I see," not this construction), 先ほど/後ほど (3 — fixed time nouns, "a moment ago" /
"shortly"), ほどく/ほどける (4 — "to untie," an unrelated verb that happens to start with ほど),
ほどほどに (1 — a reduplicated idiom, "in moderation"), 〜のほど (6 — a fixed formal set phrase,
ご自愛のほど, too narrow a register to teach as the general rule). None of these should be sourced
as ほど teaching examples; all are legitimate incidental exposure if met in the reading library.

**だけ and ばかり each cover two real, distinct jobs that this band teaches together, on purpose,
the same way Band 1 taught ため(に)'s cause and purpose senses in one lesson rather than two:**

- ばかり: **"nothing but X"** (て-form/noun + ばかり, the dominant sense — over 50 of the 82 raw
  hits) and **"just did X"** (た-form + ばかり, ~10 hits) are the same word doing two jobs a
  learner needs to tell apart on sight, and the brief names this split explicitly. A third,
  smaller job — ばかりでなく/ばかりか, "not only X but also Y" (~7 hits) — is close enough to the
  nothing-but sense to fold in as a variant, not a third teaching point.
- くらい: the job Book One already gave it — **~ふんくらいです, approximate quantity** — is not
  retaught here. This band adds three related-but-distinct new jobs on the same word: **equal
  comparison** (同じくらい, "just as much as"), **degree/extent** (できるくらいになりたい, "to the
  point of being able to"), and the idiom **くらいなら** ("if it comes to X, I'd rather Y" — a
  clean, well-attested 4-sentence family). See §6.2 for why these ship as one lesson, not three.

**Net read: this band is the richest in the book by raw material, and its risk was never
attestation — it was mistaking a collision for the construction.** Every one of the seven patterns
clears the bar with room to spare; the two the brief expected to lose (に比べて, 反面) turn out to
be exactly as solid as two patterns Band 1 already shipped at the same depth.

---

## 2. Naming and ids

Following `book-three-band-01.md` §2 and `book-three-band-02.md`'s convention:

| Thing | Value |
|---|---|
| Chapter (band) id | `b3.chapter-6` — the id keeps the band's own number; **its position in the book is chapter 7**, not 6 (passive=1, band1=2, band2=3, band3=4, band4=5, band5=6, band6=7) |
| Chapter title (learner-facing) | **Just how much** |
| Lesson `situation` | `Just how much` |
| Lesson ids | `b3.dake`, `b3.bakari`, `b3.kurai`, `b3.hodo`, `b3.dokoroka`, `b3.ni-kurabete`, `b3.hanmen` |
| Checkpoint id | `b3.checkpoint-6`, `situation: Integration & checkpoint` |
| Pattern ids | `grammar.b3-dake`, `grammar.b3-bakari`, `grammar.b3-kurai`, `grammar.b3-hodo`, `grammar.b3-dokoroka`, `grammar.b3-ni-kurabete`, `grammar.b3-hanmen` |
| Lessons file | `src/content/lessons/b3-06-degree-and-comparison.yaml` |
| Grammar file | `src/content/grammar/b3-06-degree-and-comparison.yaml` |

**On the filename stem:** the task brief that commissions this document says the file should carry
`b<book>-<chapter>` — which would be `b3-07` by position. Every sibling band file so far
(`b3-01` through `b3-04`) instead used the band's own number, independent of the passive band's
insertion shifting its position. I matched the established sibling convention (`b3-06`) rather than
the generic instruction, because four files already exist on that convention and a fifth breaking
it is a worse inconsistency than the mismatch between "chapter" and "band number" the sibling docs
already flag and explain inline. Whoever assembles the book should treat `b3-0N` as "band N," not
"chapter N," across this whole run of files.

**Global `order`:** 244–251, as pre-assigned by the brief. Full range used; no unused slots (unlike
Band 2, which returned one).

---

## 3. The chapter header comment

Paste this at the top of `b3-06-degree-and-comparison.yaml`.

```yaml
# Band 6 — Just how much.
#
# English has one small toolkit for "only," "just," "about," "to that
# extent," "compared to," and "on the other hand" -- a handful of words
# that flex to cover all of it. Japanese does not economise the same way:
# it has seven, and they are not interchangeable. This band's whole job is
# teaching the learner which one to reach for, because reaching for the
# wrong one here does not sound clumsy the way a wrong verb ending does --
# it changes the emotional temperature of the sentence. だけ is neutral.
# ばかり is a complaint. くらい is warm and casual. ほど is careful and can
# be cold. Getting the choice wrong is the difference between stating a
# fact and sounding like you're keeping score.
#
# The band falls into three families, and the lesson order follows them.
#
# だけ and ばかり (lessons 1-2) both mean "only" -- but だけ is a plain
# statement of a limit (見ているだけです, "just looking," already owned
# from the shopping chapter) and ばかり is the same limit with a judgment
# attached: いつもゲームばかりしている doesn't just say "only games," it
# says "nothing else, and I'm tired of it." ばかり does a second job too --
# 来たばかりです, "just arrived" -- built on た instead of a noun or
# て-form, which is why lesson 2 teaches both openly rather than picking
# one.
#
# くらい and ほど (lessons 3-4) are this band's second pair, and the one
# that most needs its own header note: くらい is not new. Book One already
# taught it for "about five minutes" (～ふんくらいです). This band gives it
# a second job -- degree and comparison, "as much as," "to the point
# that" -- and teaches ほど right after it as the same idea in stricter
# clothes: くらい says two things are about equal; ほど usually says they
# are not (このケーキは母のケーキほどおいしくない, "not nearly as good as
# Mom's"), and leans more formal doing it. Same shape, opposite lean --
# taught back to back on purpose, the way Band 1 paired blame and credit.
#
# The last three (lessons 5-7) are real, attested, and thin -- 9, 10 and 4
# sentences respectively, against the first four's dozens. They are placed
# last because they are refinements on everything above: どころか
# overturns an assumption built on だけ/ばかり's idea of "only" ("far from
# just X, actually Y"); に比べて sets two things side by side by name,
# where ほど only implied the comparison; 反面 closes the band by holding
# two true things about the same subject at once, formal enough to sit
# beside にもかかわらず and ものの from the contrast chapter this learner
# has already finished.
#
#    1  だけ          just this much
#    2  ばかり        nothing but -- and just now
#    3  くらい        as much as -- a second job for a word you own
#    4  ほど          nowhere near -- くらい's stricter cousin
#    5  どころか      far from it
#    6  に比べて      next to that
#    7  反面          on the other hand
#
# No lesson in this band depends on another's *form*. Lessons 1-2 and 3-4
# are taught as contrastive pairs, but each still attaches to a plain-form
# clause, noun, or adjective the learner already owns from Book Two's
# plain-form chapter. The checkpoint closes the band rather than
# splitting it (DR-021) -- see section 7 for the gate text it carries.
#
# content-source: every phrase in this file is a verified Tatoeba pair,
#   cited by id in the grammarNote. No training-canonical sentence is used
#   anywhere in this band (04-stage-reading.md §8).
```

---

## 4. The lessons

### Lesson 1 — Just this much (order 244)

- **Title:** Just this much
- **Can-do:** Say that one thing, and nothing else, is true
- **Pattern id:** `grammar.b3-dake`, `pattern: "～だけ"`
- **Teaches:** だけ attaches directly to a verb (dictionary or plain-past), い-adjective, noun, or
  な-adjective+な — the same attachment slot band 2 already drilled for のに/くせに, with the same
  trap: noun/な-adjective take な before だけ (生理痛なだけ — [#76386]), not だ. This is genuinely
  new territory: `見ているだけです` (n5-03-shopping, `phraseIds: [shopping.just-looking]`) is the
  only place だけ has appeared in the ladder so far, inside one fixed shop-closing phrase with no
  grammarNote explaining what だけ itself does — **this is a real gap the brief's own caution ("だけ
  is almost certainly taught too — check") turned out not to describe.** だけ has never been taught
  as a productive rule; this lesson is the first time a learner is told what it does and how to
  build with it, and it should say so, naming and re-using `shopping.just-looking` as the sentence
  the learner already half-knows. One idiom worth a line, richly attested on its own: できるだけ,
  "as much as possible" — [#149773] 自分の部屋は出来るだけきちんとしておきたい. One correlative
  worth a line: だけでなく, "not only X" — [#214352] スポーツだけでなく、音楽も好きだ.
- **Attestation:** ~206 genuine hits for plain だけ (§1), the richest pattern in the book so far.
  Representative sentences:
  - [#78728] 来たのはメアリーだけだった。 — "No one came except Mary." (noun, clean, short)
  - [#146800] 少し走っただけで膝がガクガクしてるよ。 — "All I did was run a little and now my knees
    are wobbly." (verb-past)
  - [#226236] ガブリエルは熱いスープとシェリー酒を少し飲んだだけだった。 — "Gabriel took nothing but
    the hot soup and a little sherry." (verb-past, longer)
  - [#76386] もしかしてツンツンしているのは、生理痛なだけとか？ — "Could it be... just because she
    has period pains?" (な-adjective — the attachment trap, worth citing directly)
  - [#149773] and [#214352] above for できるだけ/だけでなく.
  - **Do not source from いただけ or だけど hits — §1's trap.** Four hits that scan as いただけ but
    are genuine (敷いただけの [#75829], 一通届いただけで [#120679], できるだけ早く [#202322], 聞い
    ただけで [#230426]) are fine to use once hand-verified; nothing else in that 66-hit family is.
- **Depends on:** `grammar.b2-plain-dictionary`, `grammar.b2-plain-ta`, `grammar.b2-plain-da` (the
  な attachment row). Directly re-uses `shopping.just-looking` (`見ているだけです`) as the opener —
  re-surface it in the SRS queue immediately before this lesson so the callback lands.
- **New vocabulary:** none.
- **New kanji:** none — だけ is kana-only in ordinary use; every hit in the corpus confirms it.
- **Exercises (earlier chapters):** `shopping.just-looking` (N5), otherwise nothing — opening
  lesson of the band.
- **Reading-library slice:** any Band-6 text should carry だけ at least twice across different word
  classes (noun and verb, ideally) so the attachment table is reinforced, not just asserted.

### Lesson 2 — Nothing but (order 245)

- **Title:** Nothing but
- **Can-do:** Complain that someone does nothing else, or say something just happened
- **Pattern id:** `grammar.b3-bakari`, `pattern: "～ばかり"`
- **Teaches:** Two jobs, taught together and explicitly contrasted against lesson 1. **Job one,
  the dominant sense**: noun/て-form + ばかり, "nothing but X, and it's wearing on me" — where だけ
  is a neutral limit, ばかり always carries irritation, repetition, or excess.
  いつもゲームばかりしている doesn't just report a fact; it's a complaint. **Job two**: plain-past +
  ばかり, "just did X" — 来たばかりです — new territory nowhere else in the ladder teaches (no
  "just did" construction exists anywhere in Books One or Two). Both attach differently (て-form
  vs た-form) and mean something genuinely different, which is exactly why one lesson covering both
  openly, the way lesson 1 of Band 1 covered ため(に)'s two senses, is the honest shape — hiding
  either job to keep the lesson "clean" would just mean the learner meets it unprepared in the
  reading library. A third, related shape worth one line: ばかりでなく/ばかりか, "not only X but
  also Y" — close enough to job one to fold in as a variant.
- **Attestation:** 82 raw hits, all genuine (§1) — no collision word contains ばかり.
  - Nothing-but: [#234642] あいつはいつもぐずぐず文句ばかり言っている。, [#200114] トムはいつもテレビ
    ゲームばかりしている。, [#88247] 彼女は先生にこびてばかり。 (short, て-form alone), [#99658]
    彼は名ばかりの会長だ。 ("president in name only" — noun+ばかり, a useful idiom)
  - Just-did: [#206254] その来たばかりの子はおどおどして口ごもった。, [#84074] 封切られたばかりの
    映画はなんですか。 (clean, short question), [#185283] 会社に入ってきたばかりの新人は何をするに
    もオズオズしている。
  - Not only/but also: [#87092] 彼女は美しいばかりでなく才能もあった。, [#177878] 君ばかりか僕まで
    巻き添えを食らった。
  - Recognition-only, literary, not built: んばかり ("as if about to") — [#76662] スタディアムは
    溢れんばかりの人込みだった。, [#230848] あの少年たちは若さがあふれんばかりだ。 Flag these as
    "you'll meet this in writing; don't try to produce it yet," the same restraint Band 1 used for
    によって's passive-agent sense.
- **Depends on:** lesson 1, directly (the "only" family, contrasted). `grammar.b2-plain-ta` for the
  just-did sense; the general te-form family (`n5-te-*`) for the nothing-but sense.
- **New vocabulary:** none.
- **New kanji:** none — ばかり (許り) is kana-only in ordinary use.
- **Exercises (this band):** `grammar.b3-dake` — the lesson's spine is the direct contrast.
- **Reading-library slice:** a text carrying both だけ and ばかり in proximity is the strongest
  reinforcement for the contrast and should be prioritised if the text source allows it.

### Lesson 3 — As much as (order 246)

- **Title:** As much as
- **Can-do:** Say two things are about equal, or that something goes to a surprising extent
- **Pattern id:** `grammar.b3-kurai`, `pattern: "～くらい"` (register note: ぐらい after a voiced
  final sound is the same word, common in this corpus — 18 of 107 hits — but a literal-substring
  tagger only catches the くらい spelling; flag this as a known reading-library gap, not an
  authoring problem, the same way Band 1 flagged によって/により's register split)
- **Teaches:** Open by naming what the learner already owns: `grammar.n5-unit-26`,
  ～ふんくらいです, "about ~ minutes" (Book One). **This lesson is a second job on the same word,
  not a new one** — the brief's own framing for this pattern, and the header comment should say so
  before anything else. Three related new jobs, all attested:
  1. **Equal comparison** — noun+と+同じくらい, "just as much as" — [#228010] ええ、ほとんど私と
     同じくらいの背丈になっていますよ。, [#215052] スーパーマンはロケットと同じくらいに速く飛ぶ。
  2. **Degree/extent** — clause (often potential-form) + くらい + predicate, "to the point that" —
     [#213995] せめて日常会話ができるくらいになりたい。, [#108941] 彼は外車を買えるぐらい金持ちだ。
  3. **くらいなら, "if it comes to X, I'd rather Y"** — a clean idiom, well attested for its size —
     [#173267] 降伏するくらいなら死んだほうが増しだ。, [#185463] 餓死するくらいなら溺死したほうが
     ましだ。
  A fourth flavor worth one line, not a full teaching point: the belittling minimum, "even just X"
  — [#75568] 少しの頭痛くらい我慢しろ。 ("just put up with a little headache") — same word,
  dismissive edge, recognisable once the learner has the degree sense.
- **Attestation:** 105 genuine (107 raw minus 2 false positives — §1: [#188444] is 暗い "dark," not
  this word; [#216241] is 食らい付く "sink its teeth into," not this word). Neither should be
  sourced as a teaching example, and both are worth a one-line trap note in the grammarNote given
  how easy the collision is to miss on a fast scan.
- **Depends on:** `grammar.n5-unit-26`, directly and by name — the whole lesson is framed as "you
  already have this word; here is its other job." `grammar.b2-potential-ichidan`/
  `-godan` for the degree-sense examples that lean on potential verbs (買える, 持ち運べる).
- **New vocabulary:** none.
- **New kanji:** none — くらい (位, in this reading) is kana-only in ordinary use; no hit in the
  corpus uses the kanji for this word.
- **Exercises (earlier chapters):** re-surface `grammar.n5-unit-26` in the SRS queue immediately
  before this lesson — the callback only lands if it's fresh, the same move Band 1 made for
  `grammar.b2-join-kara` before からには.
- **Reading-library slice:** at least one text should place くらい's degree sense next to an
  ordinary ～ふんくらいです sentence so the "same word, second job" framing has something real to
  point at, not just the lesson's own assertion.

### Lesson 4 — Nowhere near (order 247)

- **Title:** Nowhere near
- **Can-do:** Say something falls short of another, or reaches a striking extent — more carefully
  than くらい does
- **Pattern id:** `grammar.b3-hodo`, `pattern: "～ほど"`
- **Teaches:** ほど's two core jobs, both richly attested, directly contrasted against lesson 3.
  **Negative comparison** — AはBほど〜ない, "A doesn't measure up to B" — is the textbook-canonical
  use and the one that most sharply distinguishes ほど from くらい: くらい says two things are about
  equal; ほど usually appears in a negative sentence saying they are not. **Degree/extent** —
  clause+ほど+predicate, "to such a degree that" — is くらい's degree sense in more formal, often
  written register (コーヒーは舌が焼けるほど熱かった reads more careful than the equivalent with
  くらい would). A third job, richly attested and worth its own paragraph rather than a footnote:
  the **ば〜ほど correlative**, "the more X, the more Y" — built directly on the ば conditional the
  learner already owns (`grammar.b2-cond-ba-verbs`), which makes it a natural closer for this
  lesson rather than a bolt-on.
- **Attestation:** ~156 genuine hits after excluding ほど's own false-positive family (§1: なるほど,
  先ほど/後ほど, ほどく/ほどける, ほどほどに, 〜のほど — none of these are this construction).
  - Negative comparison: [#212974] そのチームは今日ほどよくプレーしたことはなかった。, [#144266]
    人間は神ほど万能ではない。, [#230432] あの木はこれほど高くない。 (short, clean opener)
  - Degree/extent: [#148103] 集中講習で私のフランス語は驚くほど上達した。, [#220178] この箱は持ち
    運べるほど軽い。, [#179461] 空には数え切れないほど星が出ている。
  - ば〜ほど correlative: [#82673] 法律が多ければ多いほど、違反者も多くなる。, [#236362]
    「急げば急ぐほど遅くなる」は逆説である。, [#118333] 彼のことを知れば知るほどいっそう彼のことが
    好きになる。
- **Depends on:** lesson 3, directly — the contrast is the lesson. `grammar.b2-cond-ba-verbs`/
  `-adj-noun` for the correlative, named explicitly. `grammar.b2-potential-ichidan`/`-godan` for
  the degree-sense examples, same as lesson 3.
- **New vocabulary:** none.
- **New kanji:** none — ほど (程, in this reading) is kana-only in ordinary use. The one kanji hit
  in the corpus, 程度 ("degree, extent," [#146287]), is a different word appearing incidentally in
  that example and is not part of this lesson's construction — legitimate mining fodder, not a
  taught kanji.
- **Exercises (this band):** `grammar.b3-kurai` — the lesson's spine is the direct contrast.
- **Reading-library slice:** a text pairing くらい and ほど in adjacent sentences, ideally one
  positive-equal and one negative-comparison, is the strongest reinforcement for the pair.

### Lesson 5 — Far from it (order 248)

- **Title:** Far from it
- **Can-do:** Correct an assumption by naming what's actually true, in either direction
- **Pattern id:** `grammar.b3-dokoroka`, `pattern: "～どころか"`
- **Teaches:** Attaches directly to a verb (dictionary form), い-adjective, な-adjective stem, or
  noun — no copula needed, the same no-だ attachment Band 2 taught for とはいえ. どころか overturns
  an expectation the sentence itself sets up: "far from X, actually Y," where Y is often more
  extreme than X in the opposite direction. It reads naturally as this band's answer to lessons 1-2
  — where だけ/ばかり limit a claim to one thing, どころか rejects the claim outright and replaces
  it. Often opens with それ/いや as a stock reaction — いやそれどころか, "no, far from it" — worth
  naming as the pattern's most natural conversational shape.
- **Attestation: thin, and the whole 9-sentence set is clean.** Every raw hit is genuine (§1);
  ceiling and true count match exactly.
  - [#237276] 「あなたは仕事が気に入っていると思います」「いやそれどころか、嫌いです」 — "I think you
    like your job." "On the contrary, I hate it." (dialogue, clean opener)
  - [#108381] 彼は強健どころか実に虚弱だった。 — "So far from being robust, he was extremely weak."
    (short, な-adjective stem)
  - [#114350] 彼はウイスキーどころかビールさえ飲まない。 — "He doesn't even drink beer, not to
    mention whiskey." (noun, pairs naturally with さえ, worth a one-line flag as a common partner
    though さえ itself is not this band's pattern)
  - [#193045] やむどころか、嵐はいっそう激しくなった。 — "Far from stopping, the storm became much
    more intense." (verb, dictionary form)
  - [#172155] 今度の上司？個性的どころか、ありがちなタイプね。 — conversational register, na-adj stem
- **Depends on:** loosely on lessons 1-2 (the "only/nothing but" family it inverts) — worth a
  grammarNote line, not a hard prerequisite. `grammar.b2-plain-dictionary` for attachment.
- **New vocabulary:** none.
- **New kanji:** none — どころか is kana-only; no collision risk (ところ, "place," would need を、が
  or another particle after か to read differently, and does not share the だ゛-marked どころ
  spelling at all).
- **Exercises (this band):** `grammar.b3-dake`, `grammar.b3-bakari` — named explicitly as the
  family this pattern answers.
- **Reading-library slice:** with only 9 corpus sentences, real reinforcement has to come from the
  library. Prioritise sourcing further どころか sentences if the text corpus allows it — the
  band's second-most exposed pattern to "taught once, never seen again," after 反面.

### Lesson 6 — Next to that (order 249)

- **Title:** Next to that
- **Can-do:** Set two things side by side and say how they differ
- **Pattern id:** `grammar.b3-ni-kurabete`, `pattern: "～に比べて"` (cite に比べれば and bare に比べ
  as attested register variants in the grammarNote, not as separate patterns — same move Band 1
  made for によって/により)
- **Teaches:** noun+に比べて (or noun+の+に比べて after a nominalized clause), "compared to X, Y."
  Where ほど (lesson 4) *implies* a comparison inside a negative sentence, に比べて *names* it
  directly and works in positive sentences too — that contrast is worth a line, since a learner who
  has just spent a lesson on ほど's negative lean may otherwise assume all comparison needs a
  negative predicate. Register: neutral-to-formal, comfortable in both speech and writing, more
  versatile than ほど/くらい in that respect.
- **Attestation: thin but clean, and the brief expected this pattern cut.** Exact に比べて: 5 hits,
  matching `book-three-bands.md` §3b's ceiling exactly, all 5 genuine. Counting the attested
  register variants に比べれば (3) and bare に比べ (2), the family totals 10 — the same tier as
  Band 1's からには (3) and thicker than its ことだから (2), both kept there. **This band keeps it
  too, and disagrees with the brief's own expectation** (see §6.1).
  - [#205342] それは以前に比べて格段に進歩した。 — "It has greatly improved compared with what it
    was." (short, clean opener)
  - [#81064] 味は日本のお米に比べて遜色はありません。 — "It tastes every bit as good as Japanese
    rice." (positive comparison, worth flagging — this is exactly the "に比べて doesn't need a
    negative" point above)
  - [#123683] 同業他社に比べて業績がずっと良かった。 — "Business results... were much better than
    other companies in the industry."
  - [#224158] こちらはあちらに比べれば全く原始的だった。 — に比べれば variant.
  - [#76607] それに比べ最近彼女のお天気は良好。 — bare に比べ variant, sentence-initial それに比べ.
- **Depends on:** lesson 4, loosely (register family, "here is comparison named outright"). No hard
  grammatical dependency — attaches to a bare noun.
- **New vocabulary:** none. 比べる itself (the verb この pattern is built from) is not pre-taught —
  legitimate mining fodder for a learner who wants the free verb, same call Band 1 made for せい/
  おかげ as standalone nouns.
- **New kanji: 比.** Not taught anywhere in the 219-kanji manifest. Every attested hit uses the
  kanji spelling (比べて/比べれば/比べ), never kana — unlike this band's other six patterns, this
  one cannot ship kana-only and stay honest to how the corpus actually writes it.
- **Exercises (this band):** `grammar.b3-hodo`, named directly for the "implied vs. named"
  contrast above.
- **Reading-library slice:** essential — 10 sentences is not a bank. Prioritise sourcing further
  に比べて material for the library before this lesson's checkpoint pool is finalized.

### Lesson 7 — On the other hand (order 250)

- **Title:** On the other hand
- **Can-do:** Say one thing is true, and its opposite is true too, of the same subject
- **Pattern id:** `grammar.b3-hanmen`, `pattern: "～反面"`
- **Teaches:** plain-predicate+反面, or noun+の+反面 — "X, but on the other hand Y," both things
  true of the same subject at once, no contradiction implied the way にもかかわらず (band 2) or
  のに would suggest one side is a letdown. This is a **register and posture** closer for the band:
  where にもかかわらず and ものの (`grammar.b3-nimokakawarazu`, `grammar.b3-monono`, both already
  shipped in this book's contrast chapter) hold a fact against an expectation, 反面 holds two
  independent facts against each other, evenly, without judging either — worth stating that
  distinction directly and citing both ids by name, since the learner has already met the shape.
- **Attestation: the thinnest lesson in the band, and every hit is load-bearing.** 4 sentences, no
  more exist in this corpus, matching `book-three-bands.md` §3b's ceiling exactly and every one
  genuine (§1). This is the band's `ことだから` — Band 1's own thinnest lesson, also 2 sentences,
  which the brief's floor is "no attestation," not "thin attestation."
  - [#204988] それは値段は安いが、その反面品質がよくない。 — "It is cheap, but on the other hand it
    is not good." (clean, short, and note it already carries が for the first half — 反面 doesn't
    replace が/けど, it adds the second, evener contrast on top)
  - [#210359] その仕事は十分にお金になるが、その反面１日に12時間働かなくてはならない。 — "The job pays
    well, but on the other hand I have to work twelve hours a day."
  - [#79270] 憂いの反面には喜びがあるものだ。 — "Every cloud has a silver lining." (noun+の反面, and
    a genuine proverb — flag it as one)
  - [#169778] 昨年は輸出が好調の反面、輸入が落ち着いていたので貿易収支は改善した。 — noun+の反面, a
    longer, more written-register sentence; good compose-then-compare candidate once the pattern
    is met.
- **Depends on:** `grammar.b3-nimokakawarazu`, `grammar.b3-monono` (Band 2) — named explicitly for
  the "holds two facts evenly, doesn't judge either" contrast. No dependency inside this band.
- **New vocabulary:** none.
- **New kanji: 反, 面.** Neither is taught anywhere in the manifest. Every attested hit uses the
  kanji spelling; the corpus gives no kana-only はんめん example to fall back on, so honesty to the
  source means shipping both kanji with this lesson, the way Band 4 shipped 際/途/以 on the lessons
  that needed them.
- **Exercises (this band):** none new — closes the band; the header comment's whole arc points
  here.
- **Reading-library slice:** essential, same caution as lesson 6. 4 sentences with no margin means
  this pattern's checkpoint pool has to reuse a teaching sentence (see §7's lesson-8 note) unless
  the eventual text source turns up more.

### Lesson 8 — Band 6 checkpoint (order 251)

- **Id:** `b3.checkpoint-6`. `checkpoint: recognition`, `wordIds: []`, `phraseIds: []`, `kanji: []`,
  no `patternId` — same shape as `b3.checkpoint-1` and `b3.checkpoint-2`.
- **Can-do:** Recognise everything this band taught, and read the gate text (§7).
- **The shrinking set, honestly sized.** For だけ, ばかり, くらい, ほど — the four richly-attested
  patterns — the recognition pool should hold back sentences the learner has not seen in the
  teaching lesson; all four have real depth for this. For どころか (9 sentences, all used or
  close to it in lesson 5), に比べて (10, mostly used in lesson 6) and 反面 (4, all used in lesson
  7), **the honest choice is the one Band 1 already made for its own thin trio: reuse a teaching
  sentence rather than manufacture a fourth example that doesn't exist.** A recognition pass on a
  familiar sentence is still a real mastery gate — it asks whether the learner knows what the
  pattern is doing, not whether they've never seen the exact string.
- **Placement:** at the band boundary (DR-021). No lesson in this band gates another's *form* — the
  1-2 and 3-4 pairings are pedagogical contrasts, not prerequisite chains — so there is no earlier
  point the checkpoint could sensibly split to.

---

## 5. Totals

| | Count | Note |
|---|---:|---|
| Teaching lessons | 7 | matches the skeleton's pattern list exactly — none dropped, contrary to the brief's own expectation for に比べて and 反面 |
| Checkpoints | 1 | band boundary (DR-021) |
| New words | **0** | mining carries vocabulary at this stage (`book-three-bands.md` §1) |
| New kanji | **3** | 比 (lesson 6), 反 and 面 (lesson 7) — every other lesson in the band is kana-only in ordinary use |
| New grammar patterns | 7 | one per teaching lesson |
| Genuine attested example sentences | ~206 (だけ) + 82 (ばかり) + 105 (くらい) + ~156 (ほど) + 9 (どころか) + 10 (に比べて) + 4 (反面) = **~572**, concentrated overwhelmingly in the first four patterns | §1 |
| Global order | 244–251 | pre-assigned by the brief; full range used, no unused slots |

---

## 6. Judgment calls

### 6.1 The brief's expectation that に比べて and 反面 would be cut was wrong, and I want to say why rather than just report the number

`book-three-bands.md` §3b names five patterns as "already at risk before anyone hand-classifies":
反面, ことにする, ざるを得ない, ないわけにはいかない and ゆえ — and separately flags に比べて's
ceiling of 5 as this band's other soft spot. Both survive here, cleanly, at exactly the ceiling the
brief itself printed. I think the brief's caution was reading raw-count size as a proxy for risk,
which is the right instinct in general (§3b's whole point is that big ceilings can hide false
positives) but doesn't run the other way: a **small** ceiling with **zero** false positives once
checked by hand is not the same finding as a small ceiling that turns out to be mostly noise. とはいえ
in Band 2 is the case that actually matches the brief's worry — ceiling 11, genuine 2, because 9 of
11 were an unrelated negated-potential construction. に比べて and 反面 never had that problem: every
raw hit for both was the real pattern. The lesson for later bands (7-10, still to be planned) is the
same one Band 2 already drew in its own §7.3 — a low ceiling means "look carefully," not "expect a
cut." Sometimes a thin pattern is thin because it's rare, not because it's a mirage.

### 6.2 くらい's three new jobs ship as one lesson, not three, and that decision deserves a real defense

Equal comparison, degree/extent, and くらいなら are pragmatically distinct enough that a stricter
reading of "one lesson teaches one pattern" (`04-stage-reading.md` §3) could argue for splitting
them, the way Band 1 kept からには/ものだから/ことだから as three separate lessons despite family
resemblance. I decided against it here, for a reason that doesn't apply to Band 1's case: からには,
ものだから and ことだから are three different *words* that happen to rhyme in shape. くらい's three
jobs are the same *word*, doing three things a single grammarNote can teach as one continuous idea
— "the word that measures 'about this much' can measure equality, extent, or a threshold you'd
rather not cross" — without the seams Band 1 was right to keep visible. Splitting them would mean
teaching くらい three separate times in three separate lessons, which reads as three new facts
rather than one word's range. The precedent this actually follows is ため(に)'s cause/purpose split
in Band 1 lesson 1 — same word, related jobs, one lesson — not the からには/ものだから/ことだから
split, which was three different words.

### 6.3 だけ's "already taught" check needed correcting, and the correction matters for how the lesson opens

The brief instructed: "だけ is almost certainly taught too — check." I checked, and the honest
answer is *narrower than either "yes" or "no"*: だけ has appeared once, inside one fixed phrase
(`shopping.just-looking`, 見ているだけです), with **no grammarNote anywhere explaining what だけ
does**. A learner who has completed Book One and Two can produce and recognise that one sentence as
a memorized chunk, and has never been told だけ is a productive particle they can attach to anything
else. That is a real difference from くらい's situation, where `grammar.n5-unit-26` genuinely does
teach the word as a rule (～ふんくらいです is presented as a pattern, not a fixed phrase). I designed
lesson 1 to open by naming this precisely — re-using `shopping.just-looking` as the sentence the
learner already half-knows, then generalizing it into a rule for the first time — rather than either
pretending だけ is brand new (it isn't; the string has been seen) or pretending it's already taught
(it isn't, as a rule). This is worth flagging for whoever plans a later band and hits the same
"check if it's taught" instruction: a manifest hit for a *string* is not the same finding as a
manifest hit for a *taught rule*, and the two need different lesson openings.

### 6.4 Three new kanji in one band, after four consecutive bands shipped zero, needed a decision rather than a shrug

Bands 1-3 all shipped 0 new kanji (every pattern in cause/consequence, contrast/concession, and
conditions is kana-only in ordinary use); Band 4 shipped 3 (際, 途, 以) because its patterns are
built on nouns that are genuinely written with kanji. This band lands in Band 4's camp, not Bands
1-3's: に比べて and 反面 are both, in the corpus, always written with 比 and 反/面 — there is no
honest kana-only version to fall back on the way ため/せい/おかげ had one in Band 1. I considered
teaching these two patterns as fixed kana chunks anyway, to keep the band's kanji count at zero, and
decided against it: it would mean authoring example sentences that don't match how the source
material actually writes the pattern, which is a worse compromise than three kanji that Band 4
already established this book is willing to spend when the real material demands it.

---

## 7. The gate text (band close)

Per `04-stage-reading.md` §3 and the sibling bands' §7/§6 sections: a passage the learner could not
have read when the band opened, now readable. The actual text is not this document's call — the
text-source decision (`book-three-bands.md` §2) is unresolved and this band's problem to receive,
not to solve.

What the gate text must contain, whichever source supplies it:

- **At least four of this band's seven `grammarIds` tagged in load-bearing position** — removing or
  misreading the pattern changes what the passage says, not just its fluency. Require this only
  from だけ, ばかり, くらい and ほど — the four richly-attested patterns. どころか, に比べて and 反面
  should be credited if a coherent source happens to carry one, not required — their own
  attestation counts (§1) are the evidence a short passage is unlikely to carry all three by chance.
- **Vocabulary coverage at or above the ~98% flow line** once Books One-Two and this band's own
  material are in the known set (`04-stage-reading.md` §5) — this is a reading checkpoint, not a
  vocabulary stress test.
- **A `grammarIds` diff against the learner's band-open state** showing at least one of the tagged
  patterns absent from the taught set at that point — the mechanical "could not have read this"
  evidence `scripts/levelling.mjs`'s `tagSentence` already produces, the same mechanism Band 2's §6
  specifies using.
- **Curated by a human for this band's own false-positive families, not accepted from automatic
  tagging alone (§1):** だけ over-tags every いただけ (potential of いただく) and だけど sentence;
  くらい over-tags 暗い ("dark") and 食らい付く ("sink its teeth into") whenever either happens to be
  spelled in kana; ほど over-tags なるほど, 先ほど/後ほど, ほどく/ほどける and ご〜のほど. A gate-text
  candidate carrying any of `grammar.b3-dake`, `grammar.b3-kurai` or `grammar.b3-hodo` needs a
  person to confirm the tagged sentence is the real construction before it ships — the same
  discipline Band 2 already established for のに and ものの.
- **No score, no pass mark** (DR-020) — presented once the checkpoint's shrinking recognition set
  empties, framed as "you can read this now," never as a test the learner can fail.

---

## 8. Authoring checklist

1. **Sourcing.** Every phrase in this band is a verified Tatoeba pair, cited by its numeric id in
   the `grammarNote`. No training-canonical sentence anywhere — `04-stage-reading.md` §8, no
   exemption for this book.
2. **Do not source a teaching example from いただけ (potential of いただく) for lesson 1**, or
   from なるほど/先ほど/後ほど/ほどく/ほどける/ほどほど/〜のほど for lesson 4, or from a kana-only
   spelling of 暗い or 食らい付く for lesson 3 — all documented traps in §1, not open questions.
3. **Write every `pattern:` field as a bare Japanese literal** (`～だけ`, `～ばかり`, `～くらい`,
   `～ほど`, `～どころか`, `～に比べて`, `～反面`) — verify with `grammarSurface(pattern) !== null`
   before committing, mirroring Band 2's §7.1 fix. All seven pass (每 fragment is ≥2 characters).
4. **Re-surface `shopping.just-looking` before lesson 1 and `grammar.n5-unit-26` before lesson 3** —
   both lessons are built explicitly as extensions of owned material, and the callback only lands
   if the prerequisite is fresh in review.
5. **Commit messages** on every content commit must name the source, or the commit is rejected
   (CLAUDE.md).
6. **`Phrase.tatoebaId` now exists on the type** (`src/types.ts`, added for this book per the
   commissioning brief) — populate it for every phrase this band ships rather than relying on the
   commit message alone to carry provenance, the gap Band 2 flagged and this band does not need to
   re-flag.
7. **Run `pnpm ladder`** once this content lands — any change under `src/content/` must regenerate
   the book's ladder doc, and `pnpm test` fails on a stale one.
8. **Run `pnpm walkthrough`** before merge — note its own caveat: as a guest run it reaches only
   Book One (`TIER_BOOK_LIMIT`); a signed-in run is required to verify this band directly.
9. **The text-source decision** (`book-three-bands.md` §2) blocks the reading-library slice and the
   gate text, not the seven teaching lessons — those are authorable now, from the attested
   sentences in §1 alone, same as every other band in this book so far.
