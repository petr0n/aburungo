# Book Three, Band 5 — Speaker stance

**Status: design, not content.** This document specifies every lesson in the band in enough
detail that authoring the YAML is mechanical. **No Japanese sentence is composed here.** Every
example sentence named below is a real Tatoeba pair, cited by id, pulled from
`server/data/jmdict-examples-eng-3.6.2.json` — never invented, per `04-stage-reading.md` §8, which
bans training-canonical sentences at this stage without exception.

Source brief: `docs/plans/book-three-bands.md` §3 (row "5 | Speaker stance"), §3b (raw attestation
ceilings — re-derived below, not trusted), §4 (what a band breakdown must add). Background:
`docs/plans/04-stage-reading.md` §3 (the band model), §5 (the reading library), §8 (sourcing).
Worked examples for structure, depth and voice: `docs/plans/book-two-chapter-01.md`,
`docs/plans/book-three-band-01.md`, `docs/plans/book-three-band-02.md`. Rule-chapter template:
`src/content/lessons/n5-16-te-form.yaml`. Grammar dependency: `src/content/grammar/b2-01-plain-form.yaml`
(plain-form and だ/な attachment), `src/content/grammar/b2-05-deciding.yaml` (ます-stem + たい, the
false friend みたい collides with), `src/content/grammar/b2-07-quoted-speech.yaml`
(`grammar.b2-opinion-omou`, と思います — the one hedge the learner already owns, and this band's
real anchor).

**Shape landed: 8 teaching lessons + 1 recognition checkpoint, orders 235–243 — the full range
the brief assigned.** All eight patterns clear attestation once hand-classified; none scored zero
and none needed to be dropped or merged away. That is not the same as all eight being equally
rich — らしい and はず both lose more than half their raw hits to false positives, and one pattern
(わけ) is so overloaded with distinct jobs that it gets one lesson doing more work than its
neighbours rather than a second lesson the order budget does not have room for. See §1 and §7.1.

**New vocabulary: none. New kanji: none.** Every pattern here is written in kana in ordinary
usage except に違いない, whose 違 is already taught (`kanji.違`, confirmed against the manifest).
Every pattern attaches to a plain-form clause or an already-taught だ/な attachment slot. This
band is grammar, full stop, exactly as `04-stage-reading.md` §3 requires.

---

## 1. Attestation — what I checked before committing anything, and why the ceilings in §3b are not the number

`book-three-bands.md` §3b gives raw substring ceilings for this band: はず 69 · わけ 85 · みたい
46 · らしい 94 · っぽい 20 · ようだ 64 · に違いない 24 · かもしれない 53. I re-ran the same search
against the 25,983 unique Japanese sentences in `server/data/jmdict-examples-eng-3.6.2.json`
(reading `ex.sentences[]` under `lang: "jpn"`, not the `text` headword field — the trap §3b names)
and got identical raw numbers, which confirms I am reading the field correctly. Then I hand-read
every hit and classified it, because for four of the eight patterns the literal string is loaded
with unrelated words. Method script (throwaway, not committed):
`/private/tmp/.../scratchpad/attest5d.mjs`.

| Pattern | Raw hits | Genuine hits | What the raw count actually contains |
|---|---:|---:|---|
| はず | 69 | **21** | 外す/外れる (remove/come off), 弾む/弾み (bounce/momentum), 恥ずかしい (ashamed), and — the single biggest source — the topic particle は immediately followed by a ず-initial word with no relation at all: 彼はずっと (he is always...), それはずいぶん (that is quite...). None of this is the grammar pattern. |
| わけ | 85 | **72** | Clean by comparison. False positives are とりわけ (especially — a fixed adverb, 9 hits), いいわけ/言い訳 (excuse, a noun in its own right, 2 hits), and one stray hit of 分ける conjugated. |
| みたい | 46 | **32** | ます-stem + たい ("want to") written in hiragana collides with みたい whenever the stem ends in み: 飲みたい, 頼みたい, 住みたい, つかみたい, and 見たい ("want to see") written kana-only reads identically to みたい when preceded by が. てみたい (try-and-want, てみる+たい) is the same trap in a different shape. |
| らしい | 94 | **37** | The worst contamination in the band. すばらしい/素晴らしい alone is 39 of the 57 false hits — a completely different, lexicalized i-adjective ("wonderful") that happens to end in the three kana らしい. かわいらしい, みすぼらしい, わざとらしい, もっともらしい, 馬鹿らしい, しおらしい, 長たらしい, 汚らしい, 憎たらしい, そらぞらしい, 嫌らしい, めずらしい each add one or a few more. None of these are the productive suffix being applied live; all of them are their own JMdict headwords. |
| っぽい | 20 | **20** | Clean. Every hit is the genuine tendency/quality suffix. |
| ようだ | 64 | **64** | Clean. No lexicalized collision turned up in the corpus. |
| に違いない | 24 | **24** | Clean. |
| かもしれない | 53 | **53** | Clean. |

**Net read: every pattern clears the floor, four of the eight cleanly, and two (はず, らしい)
need real curation before a single sentence from them ships.** はず loses 70% of its raw hits;
らしい loses 61%. Neither is thin the way Band 1's からには (3 sentences) or ことだから (2) were —
21 and 37 genuine hits are a healthy teaching pool — but a naive script that searched the bare
string and took the first few hits by length would, for both patterns, ship 外す or すばらしい as
this band's first teaching example. That is a worse failure than thinness: it is wrong content
that looks plausible. I checked every hit by hand rather than sampling, for exactly this reason.

**The trap worth stating plainly, because it is the same shape as Band 2's のに/ものの trap but
larger:** はず's contamination is not one collision, it is at least six (外す, 外れる, 弾む, 弾み,
恥ずかしい, は+ず-initial-word), and らしい's is more than a dozen distinct lexicalized adjectives.
A single blocklist entry is not enough for either pattern — see the authoring checklist (§9) for
the full list used here, which any automatic tagging in the reading pipeline should reuse rather
than re-derive.

---

## 2. The near-synonym boundaries — the actual content of this band

Eight patterns that gloss in English as some flavor of "seems," "should," or "might" are useless
taught in isolation — a learner who meets all eight as separate vocabulary items with the same
English gloss has learned nothing they can use to choose between them. The brief says this
directly: *"A lesson that teaches one of these without saying what distinguishes it from its
neighbours has taught nothing usable."* Here is the actual shape, worked out from what the corpus
shows each pattern actually doing, not from the English gloss:

**Two families, not eight loose items.**

- **Appearance and hearsay** — みたい, ようだ, らしい, っぽい. All render "seems"/"-ish" in English.
  They differ by **where the impression comes from**: みたい and ようだ are the same core meaning
  (an inference from what the speaker can currently observe or reason out) at two registers —
  casual and neutral/formal. らしい shifts the evidence source entirely: it is what the speaker
  was **told**, not what they observed — hearsay, not inference. っぽい is not an inference word
  at all; it is a suffix that manufactures a new i-adjective describing an inherent quality or
  tendency (怒りっぽい, "quick to anger" — a trait, not a guess about a specific situation). It
  belongs in this family only because English flattens all four into "-ish"/"seems," and the
  lesson's job is to show where that flattening breaks.
- **Certainty and its grounds** — はず, わけ, に違いない, かもしれない. These do not describe an
  appearance; they state how confident the speaker is that something is true, and on what basis.
  はず is expectation from a known fact or schedule ("given what I know, this should be the
  case"). に違いない is a stronger claim — genuine conviction, "this must be true," usually built
  from circumstantial evidence rather than a known fact. わけ is different work again: it does not
  predict, it **accounts for** a situation already known to be true (わけだ, "so that's why"), or
  denies an inference someone might draw from it (わけではない, "that doesn't mean..."), or states
  a course of action is socially or practically closed (わけにはいかない, "I can't afford to").
  かもしれない closes the family at the opposite pole from はず/に違いない: real uncertainty, a
  genuine hedge rather than a confident claim softened for politeness.

**The one real collision between the two families, and it is worth teaching on purpose rather
than leaving the learner to find it:** はずがない ("there's no way that's true," strong denial of
an expectation) and わけがない ("there's no way that's true," strong denial of a stated fact) are
close enough in meaning that native speakers use them close to interchangeably in casual speech,
and a learner who has just been taught they belong to two different families will reasonably
expect them not to overlap at all. The lessons below place はず and わけ two lessons apart on
purpose (はず → に違いない → わけ) so this collision lands as a deliberate callback in the わけ
lesson rather than a surprise contradiction discovered in the reading library.

**What the corpus's attachment behaviour shows, and it matters for teaching, not just gloss —
stated carefully, because two of these are textbook rules this corpus does not happen to attest
and should not be taught as if a sentence below proves them:**

- **みたい and らしい attach bare** — directly to a noun, no linking copula at all, and みたい then
  takes its own だ/です the way a な-adjective would. Both corpus-confirmed: #211038 化け物みたいだ
  (bare noun + みたい), #111673 紳士らしい / #224688 ホモらしい (bare noun + らしい).
- **ようだ needs の before a noun** (猫のようだ, not 猫ようだ) — genuinely attested, #199735 子ネコの
  ようだった, #224336 飲み屋のようだ — and is the direct contrast point against みたい's bare
  attachment (#211038), taught in lesson 2.
- **に違いない and かもしれない attach to a bare な-adjective/noun stem with no copula at all** —
  幸福に違いない (#110547), 雨かもしれない (#197418) — breaking whatever pattern the earlier lessons
  established, called out as an exception in lessons 6 and 8 rather than left for the learner to
  discover as an inconsistency.
- **わけ takes な before what is functioning as a な-adjective**, attested once at #75984 (名前負け
  なわけじゃん) and consistent with the attributive だ→な swap Book Two's から/ので pair already
  taught (Band 1's header comment states the same rule for せいで/おかげで). A bare noun more
  commonly bridges to わけ through という rather than a direct copula at all — #75618 バツイチという
  わけだ, #81456 …漁夫の利を得たってわけだ (casual だ+って) — and the lesson should teach that
  bridge as the noun case's natural form rather than force a bare-noun+な construction the corpus
  does not actually use.
- **はず's noun/な-adjective attachment did not surface in this corpus at all** — every one of the
  21 genuine hits attaches to a plain verb or い-adjective clause. The standard reference rule is
  noun + の + はず, な-adjective + な + はず (parallel to ようだ's の, not to わけ's な) — **stated
  here as the textbook rule, not as something this band's corpus proves**, and lesson 5's author
  should either source a noun/な-adjective + はず sentence separately or teach the rule as a stated
  fact alongside verb/adjective examples the corpus does support.

---

## 3. Naming and ids

Following `book-two-chapter-01.md` §2 and the Book Three convention settled in `book-three-band-01.md`
and `book-three-band-03.md`:

| Thing | Value |
|---|---|
| Chapter (band) id | `b3.chapter-5` |
| Chapter title (learner-facing) | **Speaker stance** — internal/planning name only; see §4 for why the learner-facing `situation` differs |
| Lesson `situation` | `How sure are you?` |
| Lesson ids | `b3.mitai`, `b3.youda`, `b3.rashii`, `b3.ppoi`, `b3.hazu`, `b3.nichigainai`, `b3.wake`, `b3.kamoshirenai` |
| Checkpoint id | `b3.checkpoint-5`, `situation: Integration & checkpoint` |
| Pattern ids | `grammar.b3-mitai`, `grammar.b3-youda`, `grammar.b3-rashii`, `grammar.b3-ppoi`, `grammar.b3-hazu`, `grammar.b3-nichigainai`, `grammar.b3-wake`, `grammar.b3-kamoshirenai` |
| Lessons/grammar/phrases file stem | `b3-05-speaker-stance.yaml` |

**Global order: 235–243, the full range the brief assigned**, following directly after band 4's
227–234 (`book-three-band-04.md`). No renumbering needed — this band's shape is exactly the
skeleton's default (8 patterns + 1 checkpoint = 9), unlike bands 2 and 3, which each lost a slot
to attestation.

---

## 4. The chapter header comment

Paste this at the top of `src/content/lessons/b3-05-speaker-stance.yaml`, matching the register of
the existing Book Three chapter files.

```yaml
# Band 5 -- Speaker stance.
#
# Book Two gave the learner one way to hedge: plain clause + と思います, "I
# think that...". It carries no information about *why* the speaker thinks
# it, or how sure they are. This band is what happens when that single hedge
# gets split into eight, each one committing to a source of evidence and a
# level of confidence English usually leaves to tone of voice. A learner who
# has only と思います cannot tell a reader "I saw this with my own eyes" apart
# from "someone told me this" or "this has to be true, logically" -- Japanese
# makes the speaker choose, every time, and choosing wrong says something
# backwards, the same way Band 1 warned that せいで where おかげで belongs does.
#
# Two families, taught in that order.
#
# Lessons 1-4 are about *where the impression comes from*. みたい and ようだ
# are the same idea -- an inference from what you can see or reason out right
# now -- at two registers, casual then neutral; ようだ also needs の before a
# noun where みたい does not, which is the one attachment fact this half
# cannot skip. らしい changes the evidence source entirely: not what you
# observed, but what you were told -- hearsay, and its own trap, because the
# single most common word ending in らしい in ordinary Japanese --
# すばらしい, "wonderful" -- has nothing to do with this grammar at all.
# っぽい closes the half by breaking the family on purpose: not a guess about
# a situation, but a suffix that manufactures a new adjective for a trait or
# quality. Four lessons, one question each time: how do you know?
#
# Lessons 5-8 are about *how sure you are, and on what grounds*. はず is
# expectation from something already known -- a schedule, a fact, a plan.
# に違いない is stronger: real conviction, usually from circumstantial
# evidence rather than a known fact, taught directly against はず because the
# brief itself names them as the band's closest pair -- both gloss "must be,"
# and the difference is entirely in the grounds. わけ does different work
# again -- it does not predict, it accounts for what is already known to be
# true, or denies what someone might wrongly conclude from it, or closes off
# a course of action as unworkable -- and it lands two lessons after はず on
# purpose, because わけがない and はずがない overlap enough that a learner who
# has just been taught they are unrelated families needs that collision
# named directly rather than met as a surprise in the reading library.
# かもしれない closes the band at the opposite pole from はず and に違いない:
# real uncertainty, not a confident claim wearing a polite hedge.
#
#    1  みたい          it looks like -- casual
#    2  ようだ          it looks like -- neutral, and needs の for a noun
#    3  らしい          I hear that -- hearsay, not observation
#    4  っぽい          the different job: a trait, not a guess
#    5  はず            it should be -- expectation from a known fact
#    6  に違いない      it has to be -- stronger, against はず directly
#    7  わけ            that explains it / that doesn't mean / can't afford to
#    8  かもしれない    it might be -- the weak end, and the closer
#
# Attachment is not uniform across the band, and that is taught on purpose
# rather than smoothed over: みたい and らしい attach bare to a noun; ようだ
# needs の first; わけ takes な the way Book Two's から/ので pair already does;
# はず's own noun/な-adjective attachment never turned up in this corpus and
# is taught as a stated rule, not a proven one. に違いない and かもしれない
# break the pattern hardest of all -- both attach to a bare な-adjective or
# noun stem with no copula at all (幸福に違いない, not 幸福だに違いない). That
# is stated as an exception in lessons 6 and 8, not discovered as an
# inconsistency.
#
# No lesson in this band depends on Bands 1-4 -- these are independent
# semantic territory, and forcing a callback to cause/consequence or
# contrast/concession material would be manufacturing a connection that
# is not there. The one real prerequisite is Book Two chapter 7's
# と思います (grammar.b2-opinion-omou), named explicitly in lesson 1's
# grammarNote as the hedge this whole band sharpens.
#
# content-source: every phrase in this file is a verified Tatoeba pair, cited
#   by id in the grammarNote and, where the schema allows it, in the phrase's
#   own tatoebaId field. No training-canonical sentence is used anywhere in
#   this band (04-stage-reading.md §8).
```

**One naming note.** The internal chapter title is "Speaker stance" for planning purposes — this
document, the brief, and the file stem all use it — but the learner-facing `situation` field is
**"How sure are you?"**, matching DR-024's rule that the learner never reads a grammarian's label.
"Speaker stance" is a linguistics term; nothing in the learner-facing content should say it.

---

## 5. The lessons

### Lesson 1 — It looks like (order 235)

- **Title:** It looks like
- **Can-do:** Guess what's going on from what you can see right now
- **Pattern id:** `grammar.b3-mitai`, `pattern: "～みたい"`
- **Teaches:** みたいだ/みたいです — inference from present observation ("it looks like, it seems"),
  attaching directly to a plain clause, or bare to a noun with no linking copula at all — 化け物
  みたいだ ("it's like a monster"), not 化け物のみたいだ — confirmed at [#211038]. みたい then takes
  its own だ/です the way a な-adjective would. A second, related job
  shares the same word: comparison, "like/similar to" (お尻みたいにすべすべ, "smooth like a baby's
  bottom") — the same underlying idea of resemblance, worth naming as the same word doing two
  things rather than a second pattern. **The trap, stated up front because it decides which
  example sentences are usable at all:** ます-stem + たい ("want to") written in hiragana collides
  with みたい whenever the stem ends in み — 飲みたい ("want to drink") is not みたい, and the
  learner's own deck already has this exact collision: `vocab.nomitai` (飲みたい) and the phrase
  `food-preferences.want-water` (水が飲みたいです) both contain the literal substring みたい and
  neither is this grammar. The tell: たい ("want to") always follows a verb's ます-stem directly,
  with no intervening noun or な-adjective; みたい ("seems/like") always follows a complete idea —
  a noun, an adjective, or a full clause.
- **Attestation:** 46 raw, **32 genuine** after removing the たい collision (§1). Representative:
  [#76843] 誤診だったみたい ("it seems it was a misdiagnosis" — 12 chars, clean opener), [#211038]
  化け物みたいだ ("it's a monstrous structure" — bare noun attachment), [#75939] お尻みたいにすべすべ
  だ (comparison sense), [#177566] まるで人ごとみたいな顔 (まるで...みたい as a matched pair, worth
  flagging as a common collocation).
- **Depends on:** `grammar.b2-plain-da` (だ/な attachment table, reused not re-taught) and
  `grammar.b2-tai` (ます-stem + たい) — named explicitly as the collision to rule out, not a
  grammatical prerequisite. `grammar.b2-opinion-omou` (と思います) is this band's real anchor —
  the grammarNote should open by naming it as the one hedge the learner already has.
- **Exercises (earlier books):** `grammar.b2-tai` re-surfaced deliberately, as the false-friend
  check rather than a content dependency.
- **Exercises (this band):** none — opening lesson.
- **New vocabulary:** none (mining).
- **Reading-library slice:** at least one text should carry both the evidential and comparison
  senses so the "one word, two jobs" point lands on real material, not just the lesson's own
  examples.

### Lesson 2 — It looks like, more formally (order 236)

- **Title:** It looks like, more formally
- **Can-do:** Make the same guess in neutral or written Japanese
- **Pattern id:** `grammar.b3-youda`, `pattern: "～ようだ"`
- **Teaches:** ようだ/ようです — the same core meaning as lesson 1's みたい (inference from
  observation or reasoning), at a more neutral-to-formal register, common in both speech and
  writing where みたい reads as casual. **The one attachment fact this lesson cannot skip:** a
  noun needs の before ようだ — 猫のようだ, not 猫ようだ — where みたい attached bare. This is the
  lesson's spine, stated directly against lesson 1 rather than presented as an isolated rule.
  Also common: まるで...ようだ ("as if...") as a matched pair for vivid comparison, and the
  adverbial ように ("in a way that...", "so that...") as the form's other inflection, worth a
  one-line flag for reading recognition even though this lesson's production target is ようだ/
  ような, not ように's own separate uses (which reach into purpose constructions Band 7 was
  originally slated to cover — see `book-three-band-01.md` §6.2 for the parallel caution about
  ために being claimed by two bands).
- **Attestation:** 64 raw, **64 genuine — the cleanest and richest pattern in the band.** No
  lexicalized collision turned up anywhere in the corpus. Representative: [#179075] 君が一番乗りの
  ようだ ("it seems as if you are the first one here" — 11 chars, clean opener with の-attachment
  visible), [#224336] いい飲み屋のようだ (の-attachment again), [#211038]-style noun case for
  contrast, [#195145] まるで酔っているようだ (まるで pairing).
- **Depends on:** lesson 1, directly — the register and attachment contrast is the lesson.
- **Exercises (earlier books):** none beyond what lesson 1 already re-surfaced.
- **Exercises (this band):** `grammar.b3-mitai` — the direct comparison is the lesson's spine.
- **New vocabulary:** none.
- **Reading-library slice:** a text carrying both みたい and ようだ for the same kind of situation
  (one casual register, one neutral) would be the strongest possible reinforcement, if the
  eventual text source can supply it.

### Lesson 3 — I hear that (order 237)

- **Title:** I hear that
- **Can-do:** Pass on something you were told, and mark it as secondhand
- **Pattern id:** `grammar.b3-rashii`, `pattern: "～らしい"`
- **Teaches:** らしい, attaching to a plain clause the same way as lessons 1–2, but shifting the
  evidence source entirely: not what the speaker observed, but what they were told or read —
  hearsay. A second job, less central but real: noun + らしい as "typical of, every inch a..."
  (彼らしい, "just like him" — [#126176], [#212519] メグらしい). **The trap that decides this
  lesson's whole example pool:** the single most common word containing らしい in ordinary
  Japanese is すばらしい/素晴らしい ("wonderful"), a completely unrelated, lexicalized i-adjective —
  it alone accounts for 39 of the 57 false hits in this pattern's raw count (§1), with かわいらしい,
  みすぼらしい, わざとらしい, もっともらしい, 馬鹿らしい and several more each adding a few. None of
  these are the productive suffix in use; every one is its own dictionary headword. State this
  plainly for reading recognition — a learner who has just met らしい will meet すばらしい in the
  very next passage and needs to know it is not the same grammar.
- **Attestation:** 94 raw, **37 genuine.** Representative, hearsay: [#87037] 彼女は病気だったらしい
  ("it seems she was ill" — 12 chars), [#173429] 荒稼ぎしているらしいね ("I hear you're raking in the
  money"), [#199801] 授業の予習をしているらしい. Representative, typifying: [#126176] いかにも彼らしい
  ("it's just like him"), [#111673] どこからどこまでも紳士らしい ("every inch a gentleman").
- **Depends on:** `grammar.b2-plain-dictionary`, and lessons 1–2 as the contrast (evidence source,
  not just register).
- **Exercises (earlier books):** none new.
- **Exercises (this band):** `grammar.b3-mitai`, `grammar.b3-youda` — the evidence-source contrast
  across all three is the point; the grammarNote should name all three together once this lesson
  exists.
- **New vocabulary:** none. すばらしい/かわいらしい etc. are legitimate mining fodder if a learner
  meets them in the reading library — they are real, common words, just not this lesson's word.
- **Reading-library slice:** essential that any automatic tagging exclude the lexicalized
  adjectives (§1's blocklist) — a gate text or reinforcement passage tagged for this pattern via
  bare literal match on らしい would otherwise mis-tag every すばらしい sentence in the library as
  this band's grammar.

### Lesson 4 — The look of it (order 238)

- **Title:** The look of it
- **Can-do:** Describe a quality or tendency, not a guess about a situation
- **Pattern id:** `grammar.b3-ppoi`, `pattern: "～っぽい"`
- **Teaches:** っぽい, attaching to a noun or verb ます-stem to manufacture a new i-adjective — not
  an inference about a specific situation the way lessons 1–3 were, but a lasting trait or a
  surface quality: 怒りっぽい ("quick-tempered," a trait), 水っぽい ("watery," a perceived quality),
  子供っぽい ("childish"). It conjugates exactly like any other i-adjective once formed — っぽくない,
  っぽかった — the same machinery `grammar.n5-past-katta` already taught. **This lesson's whole job
  is closing the "seems" family by showing where it stops applying**: っぽい does not take だ/な,
  does not attach to a full clause, and does not mean "it appears that [proposition]" the way the
  previous three lessons' patterns do — it makes a word, not a sentence-level claim. State this
  contrast directly rather than let a learner assume っぽい slots into the same sentence positions
  as みたい/ようだ/らしい.
- **Attestation:** 20 raw, **20 genuine — completely clean.** Representative: [#93137] 彼女は怒りっ
  ぽい ("she has a hot temper" — 9 chars, shortest and cleanest opener in the entire band),
  [#121343] 肌が脂っぽい ("greasy skin"), [#117212] 子供っぽい笑い方 (attributive use), [#210561]
  黒っぽいコート ("dark-ish coat" — the perceived-quality flavor, contrasted with the trait flavor).
- **Depends on:** `grammar.n5-past-katta` (い-adjective conjugation, since っぽい produces one).
  Contrasted against lessons 1–3 as "the different job," not built on them.
- **Exercises (earlier books):** `grammar.n5-past-katta` re-surfaced for the conjugation machinery.
- **Exercises (this band):** `grammar.b3-mitai` — as the explicit point of contrast ("this is not
  another way to say みたい").
- **New vocabulary:** none.
- **Reading-library slice:** no special caution needed — this pattern is the band's cleanest, and
  any attested sentence tagged for it is safe to reuse.

### Lesson 5 — It should be (order 239)

- **Title:** It should be
- **Can-do:** Say what must be true, going by what you already know
- **Pattern id:** `grammar.b3-hazu`, `pattern: "～はず"`
- **Teaches:** はずだ/はずです — expectation from a known fact, schedule or plan ("given what I
  know, this should be true"), attaching to a plain verb/い-adjective clause. **The noun/な-adjective
  attachment (noun + の + はず, な-adjective + な + はず — parallel to ようだ's の, not to わけ's な)
  did not turn up in this corpus at all** (§2) — state it as the standard rule, and either source a
  noun/な-adjective example separately or lean on the verb/adjective material this band can attest.
  はずがない/はずはない ("there's no way that's true")
  is the pattern's strong-denial cousin and gets its own line — it is the negative half of the
  same word, not a separate pattern, and it is the half that will collide with lesson 7's わけがない.
  **This lesson's whole example pool depends on getting the false-positive filter right**: はず is
  massively contaminated by 外す/外れる ("remove"/"come off"), 弾む/弾み ("bounce"/"momentum"),
  恥ずかしい ("ashamed"), and — the single largest source — the topic particle は immediately
  followed by an unrelated ず-initial word (彼はずっと, "he is always..."). None of the false
  positives are hard to catch by eye once flagged, but a script that searches the bare string and
  takes the first few short hits will ship one of them.
- **Attestation:** 69 raw, **21 genuine.** Representative: [#83791] 物価はまもなく下がるはずだ
  ("prices ought to come down soon" — 14 chars, clean opener), [#199940] トムは今にもここに来るはず
  です ("Tom should be here any minute"), [#226462] カールが優等生だったはずがない ("Carl cannot have
  been a model student" — the がない cousin), [#217664] これを解く何らかの方法があるはずだ ("there
  must be some way to solve this").
- **Depends on:** `grammar.b2-plain-da` (attachment table), `grammar.b2-opinion-omou` (the hedge
  this band sharpens).
- **Exercises (earlier books):** none new beyond what lessons 1–2 already re-surfaced.
- **Exercises (this band):** none yet — opens the second half of the band. The grammarNote should
  flag forward to lesson 7 (わけがない) as a collision worth watching for, without teaching it yet.
- **New vocabulary:** none.
- **Reading-library slice:** curate any automatic tagging against the same blocklist as §1 —
  外す/外れる/弾む/弾み/恥ずかしい and topic-は-plus-ず-word are not this pattern.

### Lesson 6 — It has to be (order 240)

- **Title:** It has to be
- **Can-do:** State a strong conviction — stronger than a guess, built from evidence
- **Pattern id:** `grammar.b3-nichigainai`, `pattern: "～に違いない"`
- **Teaches:** に違いない — a stronger claim than lesson 5's はず, taught directly against it because
  the brief itself names them as this band's closest pair: both gloss "must be," and the
  difference is entirely in the grounds. はず says "this should be true, given a known fact" (a
  schedule, an arrangement); に違いない says "I am convinced this is true," typically built from
  circumstantial evidence about a situation rather than a known fact — closer to a detective's
  conclusion than a calendar check. **The attachment exception, stated directly rather than left
  for the learner to notice as an inconsistency:** に違いない attaches to a bare な-adjective or
  noun stem with **no** だ/な at all — 幸福に違いない ("must be happier now" — [#110547]), ばかに
  違いない ("must be a fool" — [#229560]) — breaking the だ/な pattern every earlier lesson in this
  band just established.
- **Attestation:** 24 raw, **24 genuine — completely clean.** Representative: [#201011] どこか機構
  が悪いに違いない ("something must be wrong with the machinery" — 14 chars, clean opener),
  [#107277] 彼らは高飛びしたに違いない ("they must've skipped town"), [#110547] 幸福に違いない
  (bare-stem attachment example), [#221664] 誰か黒幕がいるに違いない ("there must be someone behind
  this").
- **Depends on:** lesson 5, directly — the grounds contrast is the lesson.
- **Exercises (earlier books):** none new.
- **Exercises (this band):** `grammar.b3-hazu` — the direct comparison is the spine.
- **New vocabulary:** none.
- **Reading-library slice:** a text carrying both はず and に違いない for different claims (one from
  a known fact, one from evidence/deduction) is the strongest reinforcement for this pair, if the
  eventual text source can supply it.

### Lesson 7 — That explains it (order 241)

- **Title:** That explains it
- **Can-do:** Account for a situation, say what it doesn't mean, or say a choice is off the table
- **Pattern id:** `grammar.b3-wake`, `pattern: "～わけ"`
- **Teaches:** わけ as a formal noun ("the circumstance, the reason") carrying three real jobs
  through already-known predicate machinery, plus one idiomatic bare use — more ground than any
  other single lesson in this band covers, and covered in one lesson rather than several because
  the brief names わけ as one line item and the order budget has no room for a second (see §7.1
  for the full argument):
  - **わけだ** — logical conclusion from something already known: "so that's why," "that explains
    it." [#123542] 道理で、君が喜ぶわけだ ("no wonder you're happy").
  - **わけではない/わけじゃない** — the pattern's dominant job by far (37 of 72 genuine hits): softly
    denies an inference someone might draw, without denying the underlying fact. "That doesn't
    mean..." [#75888] 誰もが名文を書けるわけではない ("it's not as if just anybody can write a
    literary gem").
  - **わけにはいかない** — a fixed modal built on the same noun: a course of action is closed off,
    socially or practically. "Can't afford to." [#84279] 負け犬になるわけにはいかない ("I can't
    stand getting beaten").
  - **わけがない/わけない** — strong denial, "there's no way." [#144914] 私に勝てるわけがないだろう
    ("there's no way you can beat me"). **This is the lesson's deliberate callback to lesson 5's
    はずがない** — near-interchangeable in casual speech, named directly per §2 rather than left as
    a surprise.
  Attachment: な-adjective-like predicates take な before わけ, attested once at [#75984] 名前負けな
  わけじゃん, consistent with the attributive だ→な swap Book Two already taught for から/ので. A
  bare noun more commonly bridges to わけ through という rather than a direct copula — [#75618]
  バツイチというわけだ, [#81456] …てわけだ (casual だ+って) — and the lesson should teach that bridge
  as the noun case's natural form rather than force a construction the corpus does not use.
  **The trap that decides this lesson's example pool:** とりわけ ("especially," a fixed
  adverb) and いいわけ/言い訳 ("excuse," its own noun) both contain the literal string わけ and are
  neither.
- **Attestation:** 85 raw, **72 genuine — the richest pattern in the band**, split わけだ 8 /
  わけではない 37 / わけがない 5 / わけにはいかない 10 / bare idiomatic (どういうわけか, わけもない)
  12. This richness is exactly why one lesson can honestly carry four jobs — there is no shortage
  of material for any of them.
- **Depends on:** `grammar.b2-plain-da` (attachment), lesson 5 directly (the がない collision is
  the lesson's closing point).
- **Exercises (earlier books):** none new.
- **Exercises (this band):** `grammar.b3-hazu` — the がない collision, stated as the point rather
  than glossed over.
- **New vocabulary:** none.
- **Reading-library slice:** curate any automatic tagging against とりわけ/いいわけ/言い訳 — a bare
  literal match on わけ will otherwise over-tag both in the reading library.

### Lesson 8 — It might be (order 242)

- **Title:** It might be
- **Can-do:** Hedge honestly, when you're really not sure
- **Pattern id:** `grammar.b3-kamoshirenai`, `pattern: "～かもしれない"`
- **Teaches:** かもしれない — genuine uncertainty, the weak end of the certainty family and the
  band's natural closer: where はず and に違いない are confident claims (softened by convention, not
  by real doubt), かもしれない is an honest "I don't know, but it's possible." Attaches to a plain
  clause, or — sharing lesson 6's attachment exception — a bare な-adjective/noun stem with no
  だ/な (雨かもしれない, "it might rain" — [#197418]; 賢明かもしれない, "might be wise" — [#146835]).
  Worth naming as the second instance of that exception rather than a fresh rule. Common softening
  particles/adverbs worth a line: もしかすると, ひょっとすると, ひょっとしたら all pair naturally with
  かもしれない to front-load the hedge.
- **Attestation:** 53 raw, **53 genuine — completely clean.** Representative: [#137561] 大根は人参
  より高いかもしれない ("daikon might be more expensive than carrots" — 16 chars, clean opener),
  [#197418] ひょっとすると明日は雨かもしれない (もしかすると-pairing), [#233344] あなたの言うことは正し
  いかもしれない ("you could be right"), [#218082] 本物のダイヤではないかもしれない (ではない +
  かもしれない, stacking with the negative).
- **Depends on:** lesson 6, for the shared bare-stem attachment exception. Otherwise stands on its
  own as the family's closing member.
- **Exercises (earlier books):** none new.
- **Exercises (this band):** `grammar.b3-nichigainai`, `grammar.b3-hazu` — the confidence-scale
  contrast across all three (should be → must be → might be) is worth stating explicitly once this
  lesson exists, and is the natural setup for the checkpoint.
- **New vocabulary:** none.
- **Reading-library slice:** no special caution — this pattern is clean.

### Lesson 9 — Band 5 checkpoint (order 243)

- **Id:** `b3.checkpoint-5`. `checkpoint: recognition`, `wordIds: []`, `phraseIds: []`, `kanji: []`,
  no `patternId` — same shape as `b3.checkpoint-1` through `b3.checkpoint-4`.
- **Can-do:** Recognise everything this band taught, and read the gate text (§8).
- **The shrinking set.** All eight patterns are attested well enough to hold back sentences from
  the checkpoint pool that were never used in teaching — even はず at 21 genuine hits comfortably
  supports a teaching set of 4–5 and a held-back recognition set of similar size. No pattern in
  this band needs the "reuse the teaching sentence" fallback Band 1 had to use for its three thin
  patterns.
- **What the checkpoint should test that no single lesson can:** the family boundaries themselves.
  A recognition item that gives a situation and asks "would a Japanese speaker reach for みたい,
  らしい, or っぽい here" is a stronger test of this band than "recognise this string means
  'seems'" — the whole point of §2 is that the boundary, not the individual gloss, is what was
  taught. The checkpoint's item selection should include at least a few near-miss pairs (a
  hearsay-appropriate situation paired with a みたい-tagged distractor, and vice versa) rather than
  drawing every item from a single pattern in isolation.
- **Placement:** at the band boundary (DR-021). No lesson in this band gates another's form (§4's
  header comment), so there is no earlier point the checkpoint could sensibly move to.

---

## 6. Totals

| | Count | Note |
|---|---|---|
| Teaching lessons | 8 | matches the skeleton's pattern list exactly — none dropped |
| Checkpoints | 1 | band boundary (DR-021) |
| New words | **0** | mining carries vocabulary at this stage (`04-stage-reading.md` §3) |
| New kanji | **0** | 違 (に違いない) already taught; every other pattern is kana-only in ordinary usage |
| New grammar patterns | 8 | one per teaching lesson |
| New phrases (estimate) | **~40–48** | 4–6 attested sentences per lesson, more for lesson 7 (わけ's four jobs); every one cited with a real Tatoeba id, several already named above |
| Attested example sentences available (genuine) | 32 + 64 + 37 + 20 + 21 + 24 + 72 + 53 = **323** | see §1; raw ceiling before hand-classification was 455 |
| Global order | 235–243 | full range used, no shift needed |

---

## 7. Judgment calls — where I think the plan needs a decision, or is silent

### 7.1 わけ carries four jobs in one lesson because the order budget has no room for a second, and that trade-off should be visible rather than hidden

わけ is, by genuine attestation, the richest pattern in the band (72 hits against a next-highest of
64) and does more distinct grammatical work than any other single item on the brief's list —
わけだ, わけではない, わけがない and わけにはいかない are commonly catalogued as four separate N3
grammar points in standard references, not sub-senses of one rule the way ため(に)'s cause/purpose
split was in Band 1. I considered giving it two lessons (わけではない/わけがない as the negation
family, わけだ/わけにはいかない as the affirmative-conclusion-and-modal pair) and decided against it
for one reason that overrides the pedagogical case: **the brief names わけ as a single line item
in an eight-pattern band assigned exactly nine global order slots (235–243), and this band's own
attestation clears all eight patterns — there is no thin one to cut to make room.** Splitting わけ
without dropping something else would either blow past the assigned range or force a cut this
band's attestation does not justify.

The honest fix, matching Band 1's precedent for ため(に) (two senses, one lesson, both taught
explicitly rather than one smuggled in as a footnote), is what lesson 7 does: all four jobs taught
by name, with real attested material for each, in a lesson that is allowed to run longer and carry
more content than its neighbours because the material genuinely supports it. If a future revision
of this band gets a tenth order slot, splitting わけではない/わけがない out as its own lesson is the
first place I would spend it — that job alone (37 genuine hits) is richer than four of this band's
other eight patterns standing alone.

### 7.2 The skeleton is missing だろう/でしょう and そう, and this band is where their absence is most visible

Neither だろう/でしょう (plain/polite "probably," attached to a predicate the way this band's
patterns are) nor そう (様態のそう, "looks about to..." — stem + そう — and 伝聞のそう, "I heard
that..." — plain clause + そうだ) appears anywhere in `book-three-bands.md`'s ten-band pattern
list. I checked every band's row, not just this one's. This is the same shape of finding
`book-three-band-01.md` §6.1 made about によって and the passive: a genuinely standard piece of
"how sure are you, and how do you know" grammar that every mainstream course teaches alongside
はず/かもしれない/らしい is simply not assigned to any band. だろう/でしょう in particular is a real
gap for **this specific band's own theme** — it is the plain-register cousin of と思います (this
band's stated anchor, §4) and arguably belongs closer to it than any of the eight patterns I was
given. そう's hearsay sense also sits close enough to らしい's job that a learner who meets both
without ever being taught either formally is worse off than one who never meets そう in the reading
library at all.

**What I did about it:** nothing — these are not this band's patterns to add. The brief fixes
this band's eight patterns and its order range; inventing a ninth or tenth pattern not on that
list would blow the assigned range for a decision that is not mine to make. **What I think should
happen:** either a future band or a revision of this one should pick up だろう/でしょう and そう —
most naturally as an extension of this band, since the "how sure are you" register and evidence
question is exactly what they answer, and a learner who finishes this band capable of choosing
between eight fine-grained stance markers but unable to produce the single most common one
（でしょう) has a real gap. I'd rather flag this loudly, matching Band 1's precedent for によって,
than let it go unrecorded.

### 7.3 No vocabulary exception is worth arguing for

None of this band's eight words carry a standalone-noun life independent of the grammar
construction the way Band 1 considered for せい/おかげ. わけ (訳) does have an independent noun
sense in some fixed idioms (わけあり, "with a story/complication"), but it did not surface in this
corpus and is not common enough in this band's material to justify a vocabulary card. This band
ships zero new words, cleanly.

### 7.4 らしい's typifying job is real but thin enough that it should be taught as color, not drilled

The 37 genuine らしい hits split roughly 20 hearsay to 17 typifying-or-adjacent by hand count, close
enough to even that both jobs earn a place in the lesson. But the typifying examples that are
cleanly "noun + らしい, no clause" (彼らしい, 紳士らしい, メグらしい) are a smaller, tighter set than
the hearsay examples once the borderline cases are set aside, and the checkpoint's recognition pool
should weight toward hearsay accordingly — that is the job this band's own theme (how do you know)
is actually about; typifying is closer to an idiom family worth recognising than a rule worth
drilling to production.

---

## 8. The gate text (band close)

Per `04-stage-reading.md` §3 and matching every sibling band's §6/§7: **specify what it must
contain, not which text it is** — the text-source decision (`book-three-bands.md` §2) is still
open and this band's design does not depend on which way it resolves.

- **It must be unreadable without this band.** At least one sentence's claim must turn on the
  learner correctly reading the confidence level or evidence source a pattern here marks — not
  just fluency, but whether the reader knows the speaker is hedging, certain, or reporting hearsay.
- **It should draw on at least four of this band's eight `grammarIds`, preferably from both
  families** (at least one appearance/hearsay pattern, at least one certainty pattern) — a gate
  text built entirely from one family would test half this band's actual content. Given all eight
  patterns clear a healthy attestation floor (§1), this is a reasonable bar to hold, unlike Band
  1's three thin patterns, which the gate text there was explicitly told not to require.
- **Vocabulary coverage at or above the flow line (~98%, `04-stage-reading.md` §5)** once Books
  One–Two and this band's own material are in the known set — this is a reading checkpoint, not a
  vocabulary stress test.
- **Curated by a human for はず and らしい specifically**, not accepted from automatic tagging
  alone — both have the same shape of false-positive risk Band 2 flagged for のに and ものの (§1
  above has the full blocklist). A gate-text candidate auto-tagged with `grammar.b3-hazu` or
  `grammar.b3-rashii` needs a person to confirm the tagged sentence is genuinely the grammar
  pattern and not 外れる or すばらしい before it ships.
- **If the interim text source is the clustered-sentence stopgap**
  (`data/reading/micro-readings.json`'s model), the checkpoint's own copy must say so rather than
  present it as a story — the same restraint every sibling band's gate-text section already holds
  itself to.
- **No score, no pass mark.** Consistent with DR-020: presented once the shrinking recognition set
  empties, framed as "you can read this now," never as a test the learner can fail.

---

## 9. Authoring checklist

1. **Every phrase's source is a real Tatoeba id**, cited in the commit message per CLAUDE.md, and
   in the `Phrase.tatoebaId` field now that it exists (`src/types.ts`) — this band is the first to
   have the field available from the start; use it, don't leave the citation only in git history.
2. **Write every `pattern:` field as a bare Japanese literal** (no Latin characters — `grammarSurface`
   in `scripts/levelling.mjs` rejects any pattern string containing one), matching Band 2 §7.1's
   fix: `～みたい`, `～ようだ`, `～らしい`, `～っぽい`, `～はず`, `～に違いない`, `～わけ`, `～かもしれない`.
   All eight clear the two-character minimum after splitting on ～.
3. **Do not auto-accept はず or らしい candidates from a literal substring search** — both need the
   full blocklist in §1 applied by a human before a sentence ships. みたい needs the narrower
   ます-stem+たい check. わけ needs the とりわけ/いいわけ check. っぽい, ようだ, に違いない,
   かもしれない are clean and can be sourced directly from a substring search.
4. **Do not use any sentence containing** 外す/外れる/弾む/弾み/恥ずかしい (はず false positives),
   すばらしい/かわいらしい/みすぼらしい/わざとらしい/もっともらしい/馬鹿らしい/しおらしい/長たらしい/
   汚らしい/憎たらしい/そらぞらしい/嫌らしい/めずらしい (らしい false positives), とりわけ/いいわけ/
   言い訳 (わけ false positives), or ます-stem+たい written in hiragana (見たい/飲みたい/頼みたい/
   住みたい/つかみたい and any -てみたい, みたい false positives) as a teaching example for the
   pattern the surface string suggests.
5. **Re-surface `grammar.b2-opinion-omou`** in the SRS queue before lesson 1 — it is this band's
   named anchor, and the grammarNote's opening line only lands if it is actually fresh.
6. **Commit messages** on every content commit must name the source, or the commit is rejected
   (CLAUDE.md).
7. **Run `pnpm walkthrough`** before merge. Note its own caveat: as a guest run it will not reach
   Book Three at all (`TIER_BOOK_LIMIT`); a signed-in run is required to verify this band.
8. **Run `pnpm ladder`** once this content lands, regenerating `docs/book-three-ladder.md` (or
   whichever doc `scripts/ladder.mjs`'s `BOOKS` table names once Book Three has an entry there —
   confirm this before shipping, per Band 2's authoring checklist item 6).
9. **The text-source decision** (`book-three-bands.md` §2) blocks the reading-library slice and
   the gate text, not the eight teaching lessons — those can be authored and shipped from the
   attested sentences in §1 alone, same as any Book Two chapter.
