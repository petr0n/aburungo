# Book Three, Band 4 — Time and sequence

**Status: design, not content.** This document specifies every lesson in the band in enough
detail that authoring the YAML is mechanical. **No Japanese sentence is composed here.** Every
Japanese fragment below is either an existing word/pattern already shipped (cited by manifest id)
or an attested Tatoeba sentence quoted with its id — never invented.

Source brief: [`book-three-bands.md`](book-three-bands.md) §3 (band 4's row), §4 (what a band
breakdown must add). Sourcing rule: [`04-stage-reading.md`](04-stage-reading.md) §8 — Tatoeba only,
no training-canonical sentences at this stage, no exceptions. Worked example for depth and voice:
[`book-two-chapter-01.md`](book-two-chapter-01.md). Prerequisite grammar:
[`src/content/lessons/b2-03-joining-sentences.yaml`](../../src/content/lessons/b2-03-joining-sentences.yaml)
and [`src/content/grammar/b2-03-joining-sentences.yaml`](../../src/content/grammar/b2-03-joining-sentences.yaml)
— the とき lesson every lesson in this band argues against.

**Shape landed: 7 teaching lessons + 1 recognition checkpoint — exactly the skeleton's own order
budget.** New words: **0, by design** (§5.1). New phrases: **~30**, every one an attested Tatoeba
sentence. New kanji: **3** — 際, 途, 以 (§ per-lesson). Global order: **219–226 as briefed — see the
renumbering note below before treating that range as final.**

**Renumbering note, added while this document was being written.** `book-three-bands.md` §3a was
added mid-task by whichever sibling agent is drafting band 1: a passive/causative band (れる/られる,
せる/させる, their combination, then によって as the agent marker) has to open Book Three, before
band 1, because band 1's によって and Book Two chapter 7's と言われています both presuppose it and
nothing in the original ten-band list taught it. That band's own text says plainly: *"Bands 1-4 are
being broken down against orders 196-226 as this is written. Those shift by the size of the passive
band once it is planned... this should be settled before authoring starts."* This band — "Time and
sequence" — is therefore **provisionally chapter 4 and provisionally orders 219–226**, but is
functionally chapter 5 once the passive band is sized and inserted, and its order range shifts
forward by however many lessons that band turns out to need. Nothing in §§1–4 below (attestation,
lesson content, dependencies on Book Two) changes with the renumbering — the grammar spine is
independent of its position, the same reassurance `book-three-bands.md` §2 gives about the
text-source blocker. Only the id prefix (`b3.chapter-4` → `b3.chapter-5`), the chapter's `order`
field, and the global lesson `order` numbers need updating once the passive band lands. **Do not
author this chapter's ids as final until that band is sized.**

---


> **Global orders settled.** The passive band (`book-three-band-00-passive.md`) opens
> Book Three with 8 lessons at 196-203, so this band moved from 219 to **227**. Every
> `order` below shifts by 8; no lesson id changes. The band's own number moves too - this is
> the book's chapter 5, not 4.

## 0. The inventory pass

Checked mechanically against every `pattern:` and `japanese:` in the regenerated manifest
(`pnpm manifest`, 520 words / 511 phrases / 107 patterns / 219 kanji / 195 lessons as of this
writing).

**とき (grammar.b2-join-toki, Book Two chapter 3) is the one thing every lesson in this band must
answer to.** The skeleton's own framing is right: うちに and 間(に) both gloss as "while" against
とき's "when"; 際(に) is とき's formal twin; たとたん is とき's most punctual edge. Nothing in this
band is safe to teach as "how to say when" in isolation — every lesson's job is to say what it does
that とき cannot, and the header comment below leads with that.

**Three more collisions the skeleton flagged, checked and confirmed real:**

- **間 is not new — `vocab.aida`** (around-town.yaml, N5) already teaches 間 meaning "between", the
  spatial sense already shipped in the phrase 駅と学校の間にあります。("It's between the station and
  the school.") This band's 間(に) is the same word, a
  **second, unrelated job**: not a position between two objects but a stretch of time, with or
  without a bounded event inside it. Same collision shape as ながら in band 2 — same word, second
  job — and it gets the same treatment: taught as a second job, contrasted with the first, not
  silently assumed.
- **かける is not new — `vocab.kakeru`** (people-clothes.yaml, N5) already teaches かける meaning "to
  put on (glasses), to hang." JMdict confirms the sense this band actually wants is a **separate
  headword**: entry **1207610**, tagged `suf`/`v1`, glossed "to be partway doing…", "to begin (but
  not complete)…", "to be about to…" — the auxiliary that attaches to a verb's ます-stem, not the
  main verb that hangs a coat. The learner has cut a ます-stem before, for ながら
  (`grammar.b2-join-nagara`); this band reuses that exact cut for a different suffix. Both facts —
  same-reading-different-word, and reused-stem-different-job — are worth saying out loud in the
  lesson, not left for the learner to discover as a collision.
- **どこにもない — 途中, 以来, 際 (as a time noun), たとたん/とたん are all genuinely new.** None
  appears anywhere in `data/content-manifest.json`'s words, phrases or grammar. These are the
  band's real new ground.

**Kanji check** (`際 途 以 端` against the 219 already-taught kanji): 間, 中, 来 are already taught;
**際, 途, 以 are not** — three new kanji, one per lesson that introduces the noun carrying it (§3).
端 is not needed — see §5.2 on why たとたん stays kana-only.

---

## 1. Attestation — the counts that gate this band

Every pattern was checked against the local Tatoeba corpus: **25,983 unique attested
sentence/translation pairs**, extracted from `server/data/jmdict-examples-eng-3.6.2.json` (the same
file `scripts/vocab.mjs` and the `feature/tatoeba-pipeline` branch's micro-readings pipeline both
read). This is a subset of full Tatoeba — the file bundles only sentences JMdict links to a
headword — so every count below is a **floor**, not a ceiling; the eventual full Tatoeba ingestion
(§8 of `04-stage-reading.md`, not yet built) will only add more. Even at this floor, every pattern
clears a usable minimum.

| Pattern | Clean attested count | Thinnest verb/register spread | Verdict |
|---|---|---|---|
| うちに | **24** (of 45 raw — the rest are 家/うち "house") | imperative (若いうちに-type), request (熱いうちに-type), past narrative | Comfortable |
| 間に (punctual event inside a span) | **~16** (of ~90 raw — most raw hits are the spatial "between" sense already owned, or 間に合う "make it in time", excluded) | past narrative, period nouns (好景気の間に), verb clauses | Comfortable |
| 間 without に (durative, full-span overlap) | **7** | imperative, habitual, narrative | Workable — this is the lesson's second half, not its only material |
| 際(に) | **~25** (of 39 raw, excluding 実際/国際/交際/際限/際立つ/水際/瀬戸際/窓際/学際的/金輪際/一際/間際/分際/手際 — all lexicalised compounds sharing the kanji, not the pattern) | instructional/announcement register (ダウンロードの際に, 火事の際は), past narrative | Comfortable, and the register split is itself in the data |
| たとたん | **6** | only 3 distinct verb stems (開く/開ける, 聞く×3, つける) | **Thinnest pattern in the band.** Workable for one lesson's ~4 phrases, no slack for a fifth |
| 途中で | **10** (+1 途中に, not needed) | commute narrative, imperative (途中であきらめるな), N+の+途中で | Comfortable |
| 以来 | **17** | N+以来 (１９８８年以来), Vて+以来 (発覚して以来) — both attachment shapes attested | Comfortable |
| かける (start-not-finish / on-the-verge, JMdict 1207610) | **11**, after excluding lexicalised compounds sharing the kanji but not the sense (話しかける "address", 出かける "go out", 追いかける "chase", 呼びかけ "call out", 声をかける "greet") | 読みかけ, やりかけ, 言いかけ, 死にかけ×2, 忘れかけ, 失いかけ, 終わりかけ, 生えかけ×2, おぼれかけ — 9 distinct stems | Comfortable, better spread than expected |

**All 7 patterns attest.** None needs to be cut or deferred. たとたん is the one to watch at
authoring time — 6 sentences is enough for one lesson and no reserve, so if the checkpoint or a
later reading needs a fresh たとたん example, it will need the full (not JMdict-linked) Tatoeba
corpus, which is not yet ingested.

---

## 2. The chapter header comment

Paste this at the top of the lessons file.

```yaml
# Chapter 4 — More than one way to say "when".
#
# Book Two taught one word for "when": 時, a noun, taking a whole clause in
# front of it the same way any noun can (b2-03 lesson 6, generalised to any
# noun at all in lesson 7). This chapter does not replace 時 -- it surrounds
# it. Six more ways to place two events against each other in time, and the
# whole point of the chapter is that none of them is a synonym. A learner who
# reaches for 時 every time is not wrong, exactly -- 時 is never ungrammatical
# where these six live -- but they will sound flat, formal where they should
# be casual, vague where they should be precise, and unable to say some things
# at all. Each lesson below states the one thing its pattern does that 時
# cannot, because that is the only fact worth teaching once the form itself is
# this easy to pick up.
#
# Five of the six run on a mechanism the learner already owns outright: 時 is
# an ordinary noun, and an ordinary noun takes a clause in front of it through
# one attachment table -- verb and い-adjective attach directly, な-adjective
# takes な, noun takes の. うち, 間, 際 and 途中 are all ordinary nouns too, and
# every one of them takes that same table. This chapter does not re-teach the
# table four more times; it teaches four more nouns and lets the table do the
# work it was built for. とたん breaks the pattern on purpose -- it is always
# plain past, never anything else, no attachment table needed -- and かける
# breaks it completely: not a noun at all, an auxiliary bolted onto a verb's
# ます-stem, the same cut the learner already made for ながら. That is placed
# last so the chapter does not end on "one more noun."
#
# 間 and かける both collide with words the learner already owns, and both
# collisions get named rather than left for the learner to trip over. 間 is
# already "between", spatial, from the around-town chapter; here it is a
# stretch of time, and whether something happened once inside that stretch or
# lasted the whole of it is the lesson's real content -- with に, without に.
# かける is already "to hang, to put on (glasses)" from the clothes chapter;
# the sense this chapter wants is a different headword entirely (JMdict
# 1207610), an auxiliary meaning started-and-not-finished or about-to. Same
# sound, unrelated job, and the lesson says so before the learner has to
# guess.
#
#   1  うちに     a closing window -- act before a state stops being true
#   2  間(に)     a stretch of time -- once inside it, or spanning all of it
#   3  際(に)     時's formal twin -- announcements, instructions, rules
#   4  たとたん    時's sharpest edge -- the instant, and it caught you off guard
#   5  途中で     not "when" at all -- partway through something unfinished
#   6  以来       not a moment but a start line -- true ever since, still true now
#   7  かける      not a noun -- a verb stopped partway, or about to begin
#
# Every lesson depends on grammar.b2-join-toki landing first, for the contrast
# each grammarNote draws. Lessons 1-4 additionally lean on the noun-clause
# attachment table from b2-03 lessons 6-7; lesson 4 needs the plain past
# (b2-01, grammar.b2-plain-ta) specifically, since たとたん takes nothing else.
# Lesson 7 needs the ます-stem cut from grammar.b2-join-nagara. No lesson here
# depends on another lesson in this chapter, so there is no internal ordering
# constraint -- the order above is pedagogical (cluster the とき-family first,
# then the two structural outliers, ending on the one that breaks the pattern
# hardest) rather than load-bearing, unlike Book Two chapter 1's forms.
#
# No new vocabulary ships in this chapter, by policy, not by accident --
# Book Three does not curate word lists per lesson (book-three-bands.md §1);
# mining does that job once the reading library exists. うち, 間, 際, 途中,
# 以来 and とたん are taught purely as grammar -- pattern, gloss, one attested
# Tatoeba sentence per pattern for the cloze review -- never as Word cards.
# The three new kanji (際, 途, 以) arrive on the lesson that needs them, the
# same way b2-03 let 時 carry no new kanji because it was already owned; here
# the nouns themselves are new, so their kanji ship with them, at three
# lessons' worth rather than curated separately.
#
# content-source: Tatoeba, CC BY 2.0 FR, via jmdict-examples-eng-3.6.2 --
#   every phrase in phrases/b3-04-time-sequence.yaml carries its sentence id.
#   No training-canonical sentence is used anywhere in this chapter.
```

---

## 3. Naming and ids

| Thing | Value |
|---|---|
| Book | `book-3`, `progressKey: "book-3"`, `stage: "reading"`, order 3 |
| Chapter id | `b3.chapter-4` |
| Chapter title (learner-facing) | **More than one way to say "when"** |
| Lesson `situation` | `Time and sequence` |
| Lesson ids | `b3.seq-uchini`, `b3.seq-aida`, `b3.seq-sai`, `b3.seq-totan`, `b3.seq-tochu`, `b3.seq-irai`, `b3.seq-kakeru`, `b3.checkpoint-4` |
| Pattern ids | `grammar.b3-uchini`, `grammar.b3-aida`, `grammar.b3-sai`, `grammar.b3-totan`, `grammar.b3-tochu`, `grammar.b3-irai`, `grammar.b3-kakeru` |
| Phrase file | `src/content/phrases/b3-04-time-sequence.yaml`, id prefix `seq.` |
| Lessons file | `src/content/lessons/b3-04-time-sequence.yaml` |
| Grammar file | `src/content/grammar/b3-04-time-sequence.yaml` |

**Every `-4` above (`b3.chapter-4`, `b3.checkpoint-4`, the `b3-04-` filenames) is written against
the skeleton as briefed and is subject to the renumbering note above.** If the passive/causative
band lands first, these become `-5` throughout, mechanically — a find-and-replace, not a redesign
— and the filenames follow suit (`b3-05-time-sequence.yaml`). Nothing else in this table changes.

**"Band 4" and "Time and sequence" are this document's own internal labels, matching the required
filename** (`book-three-band-04.md`) and the skeleton's planning table — not what ships. The
learner reads Book Three, Chapter 4, same as Book Two's "plain form" chapter shipped as "Talking
like a friend": Book / Chapter / Lesson only, never a JLPT level, never "band" or "unit" (DR-024).

`order`: **use 1–8 within the chapter.** Global order numbers, as briefed, are **219–226** — the
*count* (8) needs no deviation, §5.4 explains why the skeleton's own range already lands exactly on
7 patterns + 1 checkpoint, but the *starting number* is provisional — see the renumbering note
above.

---

## 4. The lessons

Every phrase candidate cited below is a **quoted, attested Tatoeba sentence** — an author copies
it, verifies it against the live corpus, and ships it; nothing here is composed.

### Lesson 1 — Before it's too late (うちに)

- **Title:** Before it's too late
- **Can-do:** Act now, before a passing state or chance stops being true
- **Teaches:** the closing-window sense of うちに. Attaches through the same table as 時: plain verb
  or い-adjective directly (若い**うちに**), な-adjective + な, noun rarely. Runs mostly negative
  (〜ないうちに, "before X stops being false" = "before X happens") and mostly with a state that is
  actively changing — daylight fading, a chance closing, a feeling passing. **What it does that 時
  cannot:** 時 states a coincidence; うちに states urgency against a clock. バスにのる時 says nothing
  about deadlines. 暗くならないうちに says the window is closing and you had better act.
- **Exercises (existing ids):** none required for the pattern itself. The attachment table is
  `b2-03`'s own (verb/い-adj direct, な+な), already owned; cite `grammar.b2-join-toki` in the
  grammarNote as the direct comparison.
- **Attested Tatoeba candidates:**
  - `[215035]` スープは熱いうちに召し上がって下さい。— "Eat your soup while it is hot." (request register, い-adj)
  - `[148866]` 若いうちに体を鍛えなさい。— "Build up your body while young." (imperative, い-adj)
  - `[166098]` 私たちは暗くならないうちにテントを張った。— "We set up our tents before dark." (negative, past narrative)
  - `[146393]` 消防車が到着しないうちに、その家は丸焼けになった。— "Before the fire engine arrived, the whole house had burnt down." (negative, dramatic stakes)
- **Exercises (earlier chapters of this book):** none citable — Bands 1–3 of Book Three are being
  drafted in parallel (orders 196–218) and carry no committed ids at this writing. Their territory
  (cause, contrast, condition) does not mechanically overlap with this band's time connectives, so
  no grammatical dependency is expected either way.
- **New vocabulary:** 0, by policy (§0, §5.1).
- **New phrases:** 4, from the candidates above.
- **New kanji:** none — うち is conventionally kana-only in this use.
- **Depends on:** `grammar.b2-join-toki` (the contrast); `grammar.b2-plain-nai-godan` /
  `-nai-ichidan` (the negative form うちに runs on most often).

### Lesson 2 — Sometime while it lasts (間・間に)

- **Title:** Sometime while it lasts
- **Can-do:** Say something happened at one point during a stretch of time, or lasted the whole of it
- **Teaches:** 間 as a stretch of time, split on one particle. Verb clause + **間に** = a one-off event
  happened *at some point inside* the stretch (彼女が電話をしている**間に**ふろ桶があふれた — the
  bath overflowed once, during the call). Verb clause + **間** with no に = the second thing lasted
  *the entire stretch*, matched duration for duration (ネクタイを締める**間**、ちょっとじっとしてね
  — be still for the whole time it takes). One に is the entire lesson. **What it does that 時
  cannot:** 時 marks a single moment; 間(に) marks a bounded duration and says whether the second
  event was a point inside it or matched its whole length — a distinction 時 has no way to draw.
  **Collision to name up front:** this is the same 間 as `vocab.aida` ("between", spatial) — same
  word, unrelated job, exactly the ながら pattern from Book Two band 2.
- **Exercises (existing ids):** `vocab.aida` (the word itself, second job — list it so the
  collision is reviewable, not just asserted).
- **Attested Tatoeba candidates — 間に (punctual):**
  - `[192859]` ヨーロッパにいる間に僕はパリをたずねた。— "I visited Paris while I was in Europe."
  - `[95280]` 彼女が電話をしている間にふろ桶があふれた。— "The tub ran over while she was on the phone."
  - `[441557]` 「休んでる間に追いつかれちゃったわね」— "They caught up with us while we were resting."
- **Attested Tatoeba candidates — 間 (durative, no に):**
  - `[198630]` ネクタイを締める間、ちょっとじっとしてね。— "Hold still a moment while I fix your tie."
  - `[81333]` 毎朝朝食をとっている間、彼の犬は彼をじっと見つめていた。— "His dog stared at him every morning while he had his breakfast."
- **Exercises (earlier chapters of this book):** none citable — see lesson 1.
- **New vocabulary:** 0.
- **New phrases:** 5 (3 + 2, since the lesson carries two sub-patterns that both need standing on their own).
- **New kanji:** none — 間 is already taught (around-town.yaml).
- **Depends on:** `grammar.b2-join-toki`; `vocab.aida` for the collision; lesson 1 loosely, for
  "bounded stretch of time" as a concept the learner has just met once.

### Lesson 3 — The formal way to say "when" (際に)

- **Title:** The formal way to say "when"
- **Can-do:** Say "when" the way an announcement, an instruction, or a rule does
- **Teaches:** 際(に) as 時's register twin. Same attachment table again — plain verb directly
  (ダウンロードの**際に**適宜ファイル名を変更してください), noun + の (火事の**際は**１１９番に電話
  してください). No new mechanism, a new register: 際 is what a sign, a manual, or a public notice
  reaches for, never a friend. **What it does that 時 cannot:** 時 is register-neutral — it is
  exactly as at-home in casual speech as in a manual. 際 signals formality by itself, the way です
  vs だ signalled it for a whole sentence in Book Two chapter 1, except here one word carries the
  whole job.
- **Exercises (existing ids):** none required — the table is `b2-03`'s.
- **Attested Tatoeba candidates:**
  - `[74810]` …ダウンロードの際に適宜ファイル名を変更してください。— "…when downloading please change to a suitable filename." (instruction register)
  - `[186687]` 火事の際は１１９番に電話してください。— "In the case of fire, dial 119." (public-safety register)
  - `[78324]` 離陸の際は、シートベルトを締めなくてはならない。— "You must fasten your seat belts during take-off." (regulation register)
  - `[125853]` 長野にいる友人を訪問した際、おいしいそばをごちそうになった。— "When I visited my friend in Nagano, I was treated to delicious soba." (past narrative — shows 際 is not *only* for signage)
- **Exercises (earlier chapters of this book):** none citable — see lesson 1.
- **New vocabulary:** 0.
- **New phrases:** 4, from the candidates above.
- **New kanji:** **際** — new, JMdict entry confirms the "time, moment of" sense (id 1296290) alongside "edge, brink"; the lesson teaches the temporal sense only.
- **Depends on:** `grammar.b2-join-toki`.

### Lesson 4 — The instant it happened (たとたん)

- **Title:** The instant it happened
- **Can-do:** Say one thing happened the very instant another one did — and it caught you off guard
- **Teaches:** plain past + とたん(に). No attachment table — this is the exception the header
  comment flags: always た, never non-past, never an adjective or noun in front of it. The second
  clause is something the speaker did not see coming, often dramatic (a fire breaking out, a fuse
  blowing, someone going pale). **What it does that 時 cannot:** 時 tolerates any tense relationship
  and any register of consequence — バスにのる時、切符を買います is perfectly mundane. たとたん
  cannot do mundane and cannot do future: it is always past, always instant, and always carries a
  flavour of surprise. That is the entire teaching point, and the form itself is free.
- **Exercises (existing ids):** none required. Cite `grammar.b2-plain-ta` directly — this pattern
  is the payoff of the plain past chapter reaching this far into the course.
- **Attested Tatoeba candidates (all 6 attested sentences — this is the thinnest pattern in the
  band, §1, so the full set is listed rather than a subset):**
  - `[195823]` マーケットが開いたとたんに火事がおきた。— "Scarcely had the market opened when the fire broke out."
  - `[201810]` ドアを開けたとたんに、彼は焦げ臭い匂いを嗅いだ。— "The instant he opened the door, he smelt something burning."
  - `[207941]` その知らせを聞いたとたんに彼女は青くなった。— "The moment she heard the news, she turned pale."
  - `[200220]` トムがテレビをつけたとたんにヒューズがとんだ。— "No sooner had Tom turned on the TV than the fuse blew."
  - `[217686]` これをきいたとたん、彼は真っ青になった。— "On hearing this, he turned pale."
  - `[147319]` 女の子達は彼のジョークを聞いたとたんに笑い出した。— "The girls burst into laughter when they heard his joke."
- **Exercises (earlier chapters of this book):** none citable — see lesson 1.
- **New vocabulary:** 0.
- **New phrases:** 4, chosen from the 6 above for verb variety (開く/開ける, 聞く, つける) — leave 2
  in reserve for the checkpoint or a later reading, since this pattern has no slack.
- **New kanji:** none — this book writes たとたん in kana; see §5.2 for why 端 is deliberately not
  introduced.
- **Depends on:** `grammar.b2-plain-ta`; `grammar.b2-join-toki` for the contrast.

### Lesson 5 — Partway there (途中で)

- **Title:** Partway there
- **Can-do:** Say something happened partway through a trip or a task that wasn't finished yet
- **Teaches:** 途中で — not a time-of-day word at all, a **midpoint in an ongoing, unfinished
  process**. Verb directly (学校へ行く**途中で**トムに会った) or noun + の (道の**途中で**鍵を落とし
  た). Also stands alone as an imperative object (**途中で**あきらめるな — "don't give up halfway").
  **What it does that 時 cannot:** 時 marks a moment; 途中で marks a *location inside an incomplete
  journey or task*, and specifically implies the thing is not done yet. Both "on the way to the
  station" translations — a 時 version and a 途中で version — could gloss the same in English, but
  only 途中で commits to the trip itself being unfinished when the second event happens; 時 only
  claims the two events coincided.
- **Exercises (existing ids):** none required.
- **Attested Tatoeba candidates:**
  - `[188876]` 駅へ行く途中でにわか雨に遭った。— "I was caught in a shower on my way to the station."
  - `[184373]` 学校へ行く途中でトムに会った。— "I met Tom on my way to school."
  - `[124585]` 途中であきらめるな。— "Don't give up halfway." (imperative, no journey named)
  - `[123596]` 道の途中で鍵を落としたに違いない。— "I must have lost my key along the way." (noun + の attachment)
- **Exercises (earlier chapters of this book):** none citable — see lesson 1.
- **New vocabulary:** 0.
- **New phrases:** 4, from the candidates above.
- **New kanji:** **途** — new. 中 is already taught (Book One), so this lesson's cost is one
  character, not two.
- **Depends on:** `grammar.b2-join-toki` for the contrast; no other chapter grammar.

### Lesson 6 — Ever since (以来)

- **Title:** Ever since
- **Can-do:** Say something has been true continuously, starting from one clear point
- **Teaches:** 以来 — not a moment but a **start line**: N + 以来 (１９８８年**以来**トムに会って
  いません) or Vて + 以来 (スキャンダルが発覚して**以来**落ち目になってしまった), both attested. The
  clause that follows is a state or trend that has held continuously from that point to now.
  **What it does that 時 cannot:** 時 cannot express "and it is still true" — it marks a moment, not
  an unbroken span running forward from it. **Second collision to name:** から already means "since"
  in English translation for `grammar.n5-unit-4` (origin: アメリカから来ました) and for
  `grammar.b2-join-kara` (reason: because). 以来 is neither — it is exclusively temporal, always
  marks a *turning point*, and always implies the result is still ongoing. A learner translating
  "since" word-for-word will reach for から by habit; the grammarNote should say so and give the
  test: if "and it still is" is implied, it is 以来, not から.
- **Exercises (existing ids):** none required — the から collision is a warning, not an exercise
  dependency; cite `grammar.n5-unit-4` and `grammar.b2-join-kara` in the grammarNote by id so a
  reviewer can pull them into the same session.
- **Attested Tatoeba candidates:**
  - `[235889]` １９８８年以来トムに会っていません。— "I haven't seen Tom since 1988." (N + 以来)
  - `[230681]` …リクルート・スキャンダルが発覚して以来落ち目になってしまった。— "…has come down in the world since the so-called 'Recruit scandal' was publicized." (Vて + 以来)
  - `[74632]` ９.１１テロ以来、世界の各地で大規模なテロリズムが発生している。— "Since 9.11 large scale acts of terrorism have occurred all over the world." (contemporary register)
  - `[204482]` それ以来彼のうわさは聞いていない。— "He has never been heard of since." (それ以来, the most common everyday shape)
- **Exercises (earlier chapters of this book):** none citable — see lesson 1.
- **New vocabulary:** 0.
- **New phrases:** 4, from the candidates above.
- **New kanji:** **以** — new. 来 is already taught (Book One, 来る), so this lesson's cost is one
  character.
- **Depends on:** `grammar.n5-te-ku`/`-tte`/`-nde`/`-ichidan` (the te-form table, for the Vて+以来
  shape); `grammar.n5-unit-4` and `grammar.b2-join-kara` for the collision to warn against.

### Lesson 7 — Started, and then... (かける)

- **Title:** Started, and then...
- **Can-do:** Say you started something and didn't finish it — or that something was just about to happen
- **Teaches:** ます-stem + かける (JMdict 1207610), an auxiliary, not a noun — the chapter's
  deliberate break from the attachment table every other lesson used. Two related readings, both
  attested: **interrupted mid-task** (宿題を**やりかけ**にしておいた — left the homework half-done;
  彼が何か**言いかけた**が先手を打ってやった — started to say something, got cut off) and **on the
  verge of** (その男は**死にかけていた**— was on the brink of death; この子は今歯が**生えかけている**
  ところです — the child's teeth are just starting to come in). Same mechanism, same aux, two faces
  of "not complete yet." **What it does that 時 cannot:** 時 cannot describe an action's own internal
  state of incompleteness — only かける can say the action itself stopped short or hasn't fully
  started. This lesson does not compete with 時 the way the first four did; it is answering a
  different question entirely. **Collision to name up front, loudly:** this is not the かける the
  learner already has. `vocab.kakeru` means "to hang, to put on (glasses)" — a full verb with its
  own object, already shipped as the phrase `people.i-wear-glasses` (めがねをかけています。— "I wear
  glasses."). This かける is a suffix riding on another verb's stem and cannot stand alone. Same
  sound, unrelated word, and JMdict agrees — they are different headword entries.
- **Exercises (existing ids):** `vocab.kakeru` — list it explicitly so the collision is reviewable,
  not asserted; pull the shipped phrase `people.i-wear-glasses` into the same review session for
  direct contrast, rather than authoring a new one.
- **Attested Tatoeba candidates:**
  - `[154798]` 私は読みかけていて所がわからなくなった。— "I have lost my place [reading]." (interrupted mid-task)
  - `[147864]` 宿題をやりかけにしておいた。— "The boy left his homework half-finished." (interrupted mid-task)
  - `[120598]` 彼が何か言いかけたが先手を打ってやった。— "He started to say something, but I beat him to it." (interrupted mid-task)
  - `[208057]` その男は死にかけていた。— "The man was on the brink of death." (on the verge of)
  - `[221764]` この子は今歯が生えかけているところです。— "This child's teeth are just starting to come in." (on the verge of)
- **Exercises (earlier chapters of this book):** none citable — see lesson 1.
- **New vocabulary:** 0.
- **New phrases:** 5, from the candidates above — both senses need to stand on their own.
- **New kanji:** none — かける is kana-only in this use, matching `vocab.kakeru`'s own display.
- **Depends on:** `grammar.b2-join-nagara` for the ます-stem cut; `vocab.kakeru` for the collision.

### Lesson 8 — Chapter 4 checkpoint

- **Title:** Chapter 4 checkpoint
- **Can-do:** Recognise everything taught so far
- **`checkpoint: recognition`**, `wordIds: []`, `phraseIds: []`, `kanji: []`, no `patternId` — same
  shape as `b2.checkpoint-3`. A mastery gate, not a grade (DR-020): the remaining set shrinks to
  zero, retries unlimited, nothing recorded, misses rejoin the SRS queue. Placed at the chapter
  boundary per the checkpoint cadence (DR-021).
- **This is where the side-by-side comparison lives**, not in a separate teaching lesson. §5.4
  argues why: the skeleton's own order budget (7 patterns + 1 checkpoint = 8 slots, 219–226) already
  assumes this, and `b2.checkpoint-3`'s own grammarNote — "だから against なので, て against ながら
  against たり" — is the precedent. This checkpoint's grammarNote should do the equivalent for the
  five-way "when" family: とき is the neutral default; うちに adds urgency against a closing state;
  間(に) adds a bounded duration, punctual or matched; 際(に) adds formality; たとたん adds
  instantness and surprise, past tense only. 途中で and 途中で's cousin かける get one line each,
  flagged as *not* competing for "when" at all — 途中で locates a midpoint in something unfinished,
  かける describes a verb's own incompleteness.
- **Placement:** at the chapter boundary — 8 lessons is the whole chapter, no internal dependency
  chain forces an earlier split (§2's header comment: "no lesson here depends on another lesson in
  this chapter").

---

## 5. The open calls

### 5.1 No new vocabulary — a policy, not a shortfall

**Answer: 0 new words, deliberately, and this is a genuine break from how Book Two's とき was
taught, not an oversight.**

Book Two gave 時 both a grammar pattern (`grammar.b2-join-toki`) and a Word card (`vocab.toki`),
because Book Two curates vocabulary per lesson. Book Three does not — `book-three-bands.md` §1 is
explicit that vocabulary "arrives by mining from the library," and that decoupling is what lets
~100 connective patterns fit ~100 lessons without needing ~2,200 words to ride along. Treating うち,
間, 際, 途中, 以来 as pure grammar (pattern + gloss + one attested phrase for the cloze, no Word
card) is the consistent application of that policy to this band, even though every one of them is,
mechanically, an ordinary noun the way 時 is. Kanji still ship — 際, 途, 以 are taught, informational
`kanji:` entries on the lesson that needs them — because a character a learner will keep meeting in
the reading library is worth introducing regardless of whether its carrier word gets a flashcard.

### 5.2 たとたん stays kana-only

**Answer: no kanji for this lesson, and 端 is not introduced.**

途端 is a legitimate written form and a learner will meet it in the reading library. But every
attested Tatoeba sentence in the corpus writes it とたん, kana-only — colloquial and written register
both, in this sample — and 端 (edge, end) carries no other load-bearing job at this stage of the
course to justify introducing it for one word. If the eventual reading library surfaces 途端 in
kanji often enough to matter, that is a kanji-recognition item for a later pass, not a reason to
front-load 端 here on zero attested need.

### 5.3 Gate text — what it must contain, not which text it is

The band's checkpoint closes on a passage unreadable when the chapter opened. Since the levelled
reading library does not exist yet (`book-three-bands.md` §2, the open blocker; `04-stage-reading.md`
§11's "not built yet" list), this band cannot point at a specific library text — it specifies the
requirement a future one must meet, the same way `book-three-bands.md` says nothing here depends on
that decision.

The gate text must:

1. **Use at least 5 of this band's 7 patterns** — not all 7, since forcing every pattern into one
   short passage risks the "dressed up as a story" trap §5(c) of `04-stage-reading.md` explicitly
   warns against; 5 of 7 demonstrates real coverage without contorting the passage to fit.
2. **Carry no vocabulary or grammar past Book One, Book Two, and this band's own new kanji** (際,
   途, 以) — so that difficulty is gated entirely on this band's grammar, and the "unreadable before,
   readable now" claim is honest rather than confounded by unrelated new words.
3. **Be assembled from sentences already used as this band's own lesson phrases**, per §5(c)'s
   stopgap (thematically clustered sentences, not a composed narrative) — reuse, not fresh sourcing,
   and the UI must not present it as continuous prose if it is not.
4. **Its "unreadable before" evidence is structural, not measured:** before lesson 1 of this
   chapter, the learner's grammar inventory contains とき and nothing else in this band. Any of the
   attested sentences quoted in §4 — 消防車が到着しないうちに, 火事の際は１１９番に電話してください,
   宿題をやりかけにしておいた — would have contained an untaught connective the learner had no way to
   parse. After lesson 7, all seven are legible. That is the evidence, not a coverage percentage
   computed against a corpus that does not exist yet.

### 5.4 Why 219–226's *shape* needs no deviation, even though the *numbers* will move

**Answer: the count (8 slots: 7 patterns + 1 checkpoint) is exactly right; the absolute numbers
219–226 are not final, per the renumbering note at the top of this document.** Checking the sibling
bands' own ranges as briefed confirms the parent brief sized each one as (patterns + 1 checkpoint):
band 1's range (196–203) is 8 slots against 7 listed patterns; band 2's (204–211) is 8 against 7;
band 3's (212–218) is **7 slots against 6 listed patterns**. This band lists 7 patterns, all 7
attest (§1), so **8 contiguous slots, wherever they end up starting**, is exactly right — no lesson
to merge and no pattern to cut. Once the passive/causative band is sized and inserted before band 1
(`book-three-bands.md` §3a), every range from band 1 on shifts forward by that band's own lesson
count; this band's 8 slots move with it but stay 8. The one place the count could have grown — a
dedicated side-by-side comparison lesson, which §4's own brief invites — is folded into the
checkpoint instead (lesson 8, §4), matching `b2.checkpoint-3`'s own precedent of doing exactly that
comparison work in its grammarNote rather than as separate new material. This keeps "one lesson
teaches one pattern" intact — the checkpoint teaches no new pattern, it reviews seven.

### 5.5 The mining budget does not apply to anything authored here

`book-three-bands.md` §4 asks a band breakdown to state its mining budget — how many unknowns its
texts should carry, per §5's ~98%-known / 2–3-unknowns-per-150-words target. **This band authors no
texts**, only patterns and their example phrases, because the levelled reading library and the
Tatoeba-to-library pipeline are both still unbuilt (§5.3 above). Stating a mining budget for texts
that do not exist would be inventing a number to fill a section, which is the exact failure mode
this project's plans keep catching each other on. The honest answer: the budget is inherited as
spec (2–3 unknowns per 150-word passage) for whichever library texts eventually get built at this
band's level, once the text-source decision (§5 of `04-stage-reading.md`) lands — nothing this band
ships is subject to it today.

---

## 6. Totals

| | Count | Note |
|---|---|---|
| Teaching lessons | 7 | one per attested pattern (§1) |
| Checkpoints | 1 | closes on the side-by-side comparison (§4 lesson 8, §5.4) |
| New words | **0** | policy, not shortfall (§5.1) |
| New phrases | **~30** (4+5+4+4+4+4+5) | every one an attested Tatoeba sentence, ids cited in §4 |
| New grammar patterns | 7 | one per teaching lesson |
| New kanji | **3** | 際 (lesson 3), 途 (lesson 5), 以 (lesson 6) |
| Global order | 219–226 as briefed | 8-slot *count* confirmed (§5.4); *starting number* pending the passive band's size (renumbering note, top of doc) |

---

## 7. Authoring checklist

1. **Sourcing.** Every phrase in §4 is quoted with its Tatoeba sentence id. An author copies the
   `japanese`/`english` text as printed here, re-verifies against the live
   `jmdict-examples-eng-3.6.2.json` extraction (or the full Tatoeba corpus once ingested), and fills
   in `reading`/`romaji`. **No sentence in this band is composed** — commit messages must cite the
   Tatoeba id per `CLAUDE.md`'s content-source rule, not "training, pending verification" (that
   escape hatch does not exist past this stage).
2. **たとたん has no reserve.** 6 attested sentences total, 4 used, 2 held back (§4 lesson 4). Do not
   invent a 7th; if the checkpoint or a later reading needs more, the full Tatoeba corpus (not yet
   ingested) is the place to look, not composition.
3. **Both collisions get named in the grammarNote, not just in this document.** 間 vs `vocab.aida`
   (lesson 2), かける vs `vocab.kakeru` (lesson 7) — each grammarNote states the existing word, the
   new job, and that they are unrelated, the way Book Two's ながら lesson did for its own second-job
   collision.
4. **Run `pnpm manifest`** before finalising ids, to confirm none of `grammar.b3-uchini` through
   `grammar.b3-kakeru`, or the lesson/phrase ids in §3, collide with anything shipped since this
   document was written.
5. **Confirm the chapter number and global order range before writing a single id.** Check
   `book-three-bands.md` §3a: has the passive/causative band been sized and inserted before band 1
   yet? If yes, this chapter is `b3.chapter-5` (or later) and its global order shifts forward by
   that band's lesson count — renumber every `-4` in §3 and the order fields in §4 before authoring.
   If the passive band still isn't sized, treat everything in §3 as a placeholder and flag that to
   whoever assembles the book, rather than shipping ids that will need a rename.
6. **Register `b3.` with `scripts/ladder.mjs`'s `BOOKS`** before running `pnpm ladder` — per
   `CLAUDE.md`, a chapters file whose id prefix has no `BOOKS` entry makes generation throw.
   Whichever Book Three chapter actually ships first (likely the passive band, not this one, per
   §3a) does this registration; this band does not assume it is first anymore.
7. **Run `pnpm walkthrough`** before merge — it only reaches Book One as a guest (`CLAUDE.md`), so it
   cannot verify this band's content directly, but it still catches build/runtime breakage from a
   malformed chapter file.
