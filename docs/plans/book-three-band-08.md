# Book Three, Band 8 — Obligation and permission

**Status: design, not content.** This document specifies every lesson in the band in enough
detail that authoring the YAML is mechanical. **No Japanese sentence is composed here.** Every
example sentence named below is a real Tatoeba pair, cited by id, pulled from
`server/data/jmdict-examples-eng-3.6.2.json` — never invented, per `04-stage-reading.md` §8, which
bans training-canonical sentences at this stage without exception.

Source brief: `docs/plans/book-three-bands.md` §3 (row "8 | Obligation and permission"), §3b (raw
attestation ceilings — re-derived below, not trusted), §4 (what a band breakdown must add).
Background: `docs/plans/04-stage-reading.md` §3 (the band model), §5 (the reading library), §8
(sourcing). Worked examples for structure, depth and voice: `docs/plans/book-two-chapter-01.md`,
`docs/plans/book-three-band-05.md`, `docs/plans/book-three-band-06.md` (the two most recent
siblings — this document matches their shape). Rule-chapter template:
`src/content/lessons/n5-16-te-form.yaml`. Precedent for adding a pattern the skeleton omitted:
`docs/plans/book-three-band-00-passive.md` §1 (a missing prerequisite that blocks the band it sits
in front of — the same shape of finding this document makes in §6.1).

**Shape landed: 5 teaching lessons + 1 recognition checkpoint = 6 lessons, global order 260–265 —
one slot short of the assigned 260–266.** That is the opposite mix from what the brief predicted:
it expected two of the five named patterns to fail attestation (ざるを得ない, ceiling 3;
ないわけにはいかない, ceiling 1) and treated べき/必要がある/てはならない as safe. What actually
happened: one of those "safe" three was carrying a false ceiling nearly three times its real size
(§1), one of the two "at risk" patterns survives on the same precedent Band 1 already set, the
other is cut for a reason sharper than thinness, and the band is missing its single most important
pattern entirely — one the skeleton never named. See §6.1 for why `～なければならない` is added
here, not merely flagged.

**New vocabulary: 0** (mining carries vocabulary at this stage, `04-stage-reading.md` §3). **New
kanji: 3** — 必, 要 (both from 必要がある, §1) and 得 (from ざるを得ない, §1) — confirmed absent
from `data/content-manifest.json`'s 219-kanji set. Every other pattern in this band is written in
kana in ordinary usage, matching Band 5's "grammar, full stop" finding for its own eight patterns.

---

## 1. Attestation — what I checked before committing anything, and what the brief's ceilings hid

Counted directly against `server/data/jmdict-examples-eng-3.6.2.json` (25,983 unique Tatoeba
sentences), reading `ex.sentences[]` under `lang: "jpn"` — not the `text` headword field, the
trap `book-three-bands.md` §3b names by name. Every raw hit for every pattern was read by hand, not
sampled. Throwaway scripts (not committed):
`/private/tmp/.../scratchpad/attest8.mjs`, `attest8b.mjs`.

| Pattern | §3b's ceiling | Raw hits (my count) | Genuine | Verdict |
|---|---:|---:|---:|---|
| ざるを得ない | 3 | 3 | **3** | Thin, but every hit is clean. Kept — see §6.3. |
| ないわけにはいかない | 1 | 1 | **1** | **Cut.** One sentence is below any floor this book has kept, and the pattern it negates is already taught. See §6.3. |
| べき | 178 | 178 | **176** | Rich. Two false positives, both 食べきれない/たべきれない (§1.1). |
| 必要がある | 26 | 26 | **26** | Clean. The brief's own caution ("probably solid") was right. |
| てはならない | 49 | 49 | **18** | **The brief's ceiling was wrong in a way that matters — see §1.2.** 31 of 49 raw hits are a different construction with the opposite polarity. |
| — (not in the skeleton) | — | — | **なければならない 159 + なくてはならない 31 + なくてはいけない 12 + なきゃ 18 + なくちゃ 12 = 232** | The single richest pool in the band, and it belongs to a pattern the brief never named. See §6.1. |

**Net read: this band's real risk was never the two patterns the brief flagged — it was a
mislabeled ceiling on the one pattern that anchors the whole theme, plus a genuine hole in the
learner's toolkit that no amount of hand-classification would have surfaced without checking what
Books One and Two actually teach.** Checking that is what §6.1 below is.

### 1.1 べき's two false positives, and why the other 176 are richer than they look

`欲張っても食べきれないよ` ([#78766]) and `１日ではたべきれないほどのリンゴがある` ([#235702]) both
contain the literal string べき, and neither is the auxiliary べき — both are 食べる/たべる's
ます-stem + きれない ("can't finish eating"), an unrelated potential-exhaustive construction. Excluding
them leaves 176 genuine hits, the richest single pattern in this band by a wide margin.

Within those 176, one thing is worth stating plainly rather than smoothing over: a real minority —
恐るべき, 驚くべき, 恥ずべき, ありうべき, 来たるべき, しかるべき, あるべき, 記念すべき,
特筆大書すべき — are **lexicalized, attributive uses**: classical べし attached to a verb and frozen
into what now functions as a single adjective modifying a noun (恐るべき速さ, "a fearsome speed";
記念すべき日, "a memorable day"), not the productive "you should do X" sentence-ending pattern the
lesson teaches for production. They are genuinely built from the same auxiliary — unlike らしい's
すばらしい trap in Band 5, this is not a different word wearing the same three kana, it is the same
grammar frozen into idiom — so they are safe to cite as color and recognition, not safe to teach as
the lesson's central "V + べきだ" production examples.

Both spellings of the same modern verb attachment are attested and both are fine to use: classical
すべき (する's stem drops before べき, [#216790] ざっくばらんにすべきです) and the regularized modern
するべき ([#231883] 自分自身でするべきだと思いますよ) sit side by side in this corpus, the way most
current usage guides describe them — する is the one verb where speakers genuinely split on which
form to use, and the lesson should show both rather than picking a "correct" one.

### 1.2 てはならない's ceiling of 49 is contaminated by a construction with the opposite meaning, and this is the band's real trap

I ran the exact substring `てはならない` and got 49, matching the brief's own ceiling exactly — the
same starting point Band 5 and Band 6 both had for their own worst-contaminated patterns. Then I
classified every hit by whether the two characters immediately before `てはならない` are `なく`:

- **18 hits are genuine `～てはならない`** — a verb's て-form (or the copula's て-form, って) directly
  followed by はならない. This is the **prohibition**: "you must not do X." [#142728] 生徒はこの便所
  を使ってはならない。("Students must not use this toilet.")
- **31 hits are `～なくてはならない`** — the negative (ない) stem's て-form, `なくて`, followed by
  はならない. This is **not a variant spelling of the same idea — it is the opposite polarity.**
  なくてはならない literally reads "if [you] do not do X, it will not do" — a double negative that
  resolves to **obligation**: "you must do X." [#78324] 離陸の際は、シートベルトを締めなくてはなら
  ない。("You must fasten your seat belts during take-off.")

Two sentences that differ by exactly two kana — なく — mean opposite things: 締めてはならない would
say "you must **not** fasten your seat belt." The brief's raw ceiling of 49 folds both together
because `てはならない` is a literal substring of `なくてはならない`, the same shape of trap Band 6
found in いただけ⊂だけ and Band 5 found in すばらしい⊃らしい — except here the two readings are not
merely unrelated, they are **semantic opposites**, which makes this the single sharpest trap in the
band and the one thing this band's teaching cannot afford to blur. See lesson 4 and §6.5.

The 31 "lost" hits are not wasted, unlike a typical false-positive set — they are real sentences of
a real, common construction. They simply belong to the pattern named in §6.1, not to てはならない.

---

## 2. Naming and ids

Following `book-three-band-05.md` §3 and `book-three-band-06.md` §2's convention (id keeps the
band's own number, independent of the band's position once the passive band and band 7 are
counted):

| Thing | Value |
|---|---|
| Chapter (band) id | `b3.chapter-8` — **its position in the book is chapter 9**, not 8 (passive=1, band1=2, band2=3, band3=4, band4=5, band5=6, band6=7, band7=8, band8=9), same discrepancy `book-three-band-06.md` §2 already names and explains for its own band |
| Chapter title (internal/planning) | Obligation and permission |
| Lesson `situation` (learner-facing) | **What you have to do** |
| Lesson ids | `b3.nakereba`, `b3.beki`, `b3.hitsuyo-ga-aru`, `b3.tewanaranai`, `b3.zaru-wo-enai` |
| Checkpoint id | `b3.checkpoint-8`, `situation: Integration & checkpoint` |
| Pattern ids | `grammar.b3-nakereba`, `grammar.b3-beki`, `grammar.b3-hitsuyo-ga-aru`, `grammar.b3-tewanaranai`, `grammar.b3-zaru-wo-enai` |
| Lessons/grammar/phrases file stem | `b3-08-obligation-and-permission.yaml` |

**Global order: 260–265, six of the seven slots the brief assigned (260–266).** One slot is
returned unused, the same move `book-three-band-06.md` §2 records Band 2 making before it — a
defended 5 beats a stretched 6, and there is no sixth pattern with real material behind it once
なくてもいい is kept to a one-line mention rather than promoted to its own lesson (§6.2).

---

## 3. The chapter header comment

Paste this at the top of `src/content/lessons/b3-08-obligation-and-permission.yaml`.

```yaml
# Band 8 -- What you have to do.
#
# Book Two gave the learner two ways to lean on someone else's judgment:
# たほうがいい, "you'd better" -- advice, easy to ignore -- and
# てもいいですか, "may I?" -- a question about what's allowed. Neither one
# commits to anything. This band is where the learner starts making claims
# that carry weight: rules that must be followed, judgments about what's
# right, prohibitions that cannot be waved off. Five ways to say so, each
# committing to a different kind of authority.
#
# Lesson 1 has to come first, and it isn't on the original brief for this
# band -- it's the plain, ordinary word for "must" that the other four
# patterns all assume the learner already has, and nothing in Books One or
# Two ever taught it. You already own both halves: the nai-form (Book Two's
# plain-form chapter) and the ば conditional (Book Two's conditionals
# chapter, which already showed you that an i-adjective takes ければ, and
# ない conjugates exactly like one). Put them together and add ならない --
# the negative of なる, "to become," a word you've had since Book One -- and
# you have なければならない: "if this doesn't happen, it won't do." Four
# more shapes say the same thing at different registers -- なくてはならない,
# なくてはいけない, and the casual contractions なきゃ and なくちゃ, which
# often drop the ending word entirely and just trail off. One idea, five
# faces, taught together.
#
# Lessons 2-3 are two different reasons to say "should," and the difference
# is where the authority comes from. べき is a judgment: this is what's
# right, whether or not there's a rule. 必要がある is not a judgment at
# all -- it reports a fact about what's needed, the way you'd describe a car
# needing an oil change. Say べき where you mean 必要がある and you've turned
# a plain statement of fact into a verdict on someone.
#
# Lesson 4 is the other direction entirely: てはならない, prohibition, "you
# must not." It is the direct negative of Book One's てもいいですか ("may
# I?") -- ask the question, and this is what "no" sounds like when it's a
# rule rather than one person's preference. It is also the lesson with a
# trap the whole band has to be built around: なくてはならない, two kana
# different, is not a variant of てはならない -- it's lesson 1's obligation
# family wearing a costume. 締めてはならない forbids; 締めなくてはならない
# requires. Getting this backwards doesn't sound clumsy -- it says the
# opposite of what you meant.
#
# Lesson 5 closes the band with its most literary member: ざるを得ない, "I
# have no choice but to." It is thin in this corpus -- three sentences, no
# more -- but every one is genuine, the same tier Band 1 already shipped a
# lesson at (からには, also three). Its closest cousin, ないわけにはいかない,
# is not in this band at all: it's the negation of わけにはいかない, which
# Band 5 already taught as one of わけ's four jobs, and this corpus attests
# the negated form exactly once -- not enough to teach, and not new ground
# even if it were.
#
#    1  なければならない (+なくては/なきゃ/なくちゃ)   you have to
#    2  べき                                          you should -- a judgment
#    3  必要がある                                    there's a need to -- a fact
#    4  てはならない                                  you must not
#    5  ざるを得ない                                  there's no way around it
#
# No lesson in this band depends on another's *form* -- each attaches to
# plain-form material the learner already owns (dictionary form, nai-form,
# the ば conditional, だ/である) -- but lessons 1 and 4 are taught as a
# deliberate pair around the なく trap, and lessons 2 and 3 are taught as a
# deliberate pair around where the authority comes from. The checkpoint
# closes the band rather than splitting it (DR-021).
#
# content-source: every phrase in this file is a verified Tatoeba pair,
#   cited by id in the grammarNote and in the phrase's own tatoebaId field.
#   No training-canonical sentence is used anywhere in this band
#   (04-stage-reading.md §8).
```

---

## 4. The lessons

### Lesson 1 — You have to (order 260)

- **Title:** You have to
- **Can-do:** State a real obligation, at any register from a report to a text to a friend
- **Pattern id:** `grammar.b3-nakereba`, `pattern: "～なければならない"`
- **Teaches:** The plain, productive way to say "must," built from two things the learner already
  owns rather than anything new: the nai-form (`grammar.b2-plain-nai-ichidan`,
  `grammar.b2-plain-nai-godan`) plus the ば conditional (`grammar.b2-cond-ba-verbs`,
  `grammar.b2-cond-ba-adj-noun` — the same lesson that already established ない conjugates like an
  い-adjective and takes ければ) plus ならない, the negative of なる (`vocab.naru`, "to become,"
  Book One) — "if this doesn't happen, it won't do." Attachment across all word classes, all
  attested: godan/ichidan verb nai-stem + なければ (書かなければならない), い-adjective + くなければ
  (堅くなければならない), noun/な-adjective + でなければ (健康でなければならない — で, not では,
  because なければ is already doing the negating).
  Four further shapes say the same thing and belong in the same lesson rather than four separate
  ones, the same call Band 6 made for くらい's three jobs on one word: **なくてはならない** (て-form
  of nai + はならない — a register cousin, not a different meaning), **なくてはいけない** (the same
  shape with いけない in place of ならない), and the casual contractions **なきゃ** and **なくちゃ**,
  which frequently drop the completing verb entirely and just trail off — 飲まなきゃ。 said alone
  ("gotta drink it") is completely natural and the corpus attests it exactly that way.
  **Worth one line, not a teaching point:** なくてもいい ("don't have to") is the mirror image, built
  from the exact same nai-form the learner just used plus てもいい, permission, already owned from
  Book One's `grammar.n5-unit-13`. Flag it for recognition; it does not earn its own lesson (§6.2).
- **Attestation:** 232 genuine hits across the family, easily the richest pool in the band —
  なければならない 159, なくてはならない 31, なくてはいけない 12, なきゃ 18, なくちゃ 12. Every hit is
  the real construction; the string is specific enough (6+ kana) that no collision risk turned up
  anywhere in a full read of the set. Representative:
  - [#161319] 私はウサギの世話をしなければならない。 — "I must look after the rabbits." (verb, clean)
  - [#211556] その機械の骨組みは堅くなければならない。 — "The frame of the machine should be
    rigid." (い-adjective)
  - [#187653] 何よりもまず健康でなければならない。 — "Above all, we must be healthy." (noun/な-adj,
    で attachment)
  - [#78324] 離陸の際は、シートベルトを締めなくてはならない。 — "You must fasten your seat belts
    during take-off." (なくては register — and the sentence lesson 4 contrasts against directly)
  - [#78209] 旅に出たら地酒を飲まなきゃ。 — "When you travel, you've got to try the local brew."
    (casual なきゃ)
  - [#151057] 試験勉強をしなくちゃ。 — "I have to prepare for the test." (casual なくちゃ, elliptical)
- **Depends on:** `grammar.b2-plain-nai-ichidan`, `grammar.b2-plain-nai-godan`,
  `grammar.b2-cond-ba-verbs`, `grammar.b2-cond-ba-adj-noun`, `vocab.naru`. `grammar.b2-cond-hougaii`
  (たほうがいい, "you'd better") is the softer neighbour this lesson should open by naming — advice
  versus obligation, the header comment's opening line.
- **Exercises (earlier books):** `grammar.b2-cond-hougaii` re-surfaced deliberately, as the register
  contrast this lesson sharpens, not a form dependency.
- **Exercises (this band):** none — opening lesson.
- **New vocabulary:** none. **New kanji:** none — every hit in this family is written in kana.
- **Reading-library slice:** at least one text should carry two different registers of this family
  (e.g. なければならない and なきゃ) so the "one idea, five faces" point lands on real material.

### Lesson 2 — You should (order 261)

- **Title:** You should
- **Can-do:** Say what's right, as a judgment — not a rule, not a fact
- **Pattern id:** `grammar.b3-beki`, `pattern: "～べき"`
- **Teaches:** Dictionary form (plain non-past) + べきだ/べきです — a judgment about what's right,
  contrasted directly against lesson 1: なければならない reports an obligation that exists whether
  or not the speaker agrees with it; べき is the speaker's own verdict. する irregularly drops its
  stem before べき (すべき), and the corpus attests both the classical すべき and the regularized
  modern するべき — teach both, since usage genuinely splits here (§1.1). Noun/な-adjective needs
  である first (理性的であるべきだ, not 理性的べきだ) — べき attaches to a predicate in dictionary
  form, and である is that predicate's dictionary form for a noun/な-adjective, the same slot
  `grammar.b2-plain-da` already established. Negative: **べきではない/べきでない**, "shouldn't" —
  well attested on its own (11 hits) and worth its own line rather than a footnote.
  **The trap that decides this lesson's example pool:** 食べきれない/たべきれない (ます-stem + きれ
  ない, "can't finish eating") contain the literal string べき and are not this grammar at all
  (§1.1) — do not source from either.
  **Worth a line, not a drill:** a real minority of hits are lexicalized attributive uses — 恐るべき
  速さ ("a fearsome speed"), 記念すべき日 ("a memorable day") — the same auxiliary frozen into an
  adjective. Fine for recognition and color; not the production target.
- **Attestation:** 178 raw, **176 genuine** (§1.1). Representative:
  - [#177166] 君は借金を払うべきだ。 — "You should pay your debts." (verb, clean opener)
  - [#232346] あなたはもっと理性的であるべきだ。 — "You should be more reasonable." (である
    attachment)
  - [#216790] ざっくばらんにすべきです。 — classical すべき.
  - [#231883] 自分自身でするべきだと思いますよ。 — modern するべき, same meaning.
  - [#86490] 彼女は夜にひとりで出歩くべきではない。 — "She shouldn't go out by herself at night."
    (negative)
  - [#218449] これは驚くべき発見だ。 — "This is a surprising discovery." (lexicalized attributive,
    flag as color)
- **Depends on:** `grammar.b2-plain-dictionary`, `grammar.b2-plain-da` (だ→である attachment for
  noun/な-adjective). Lesson 1, directly — the authority contrast is the lesson.
- **Exercises (earlier books):** none new.
- **Exercises (this band):** `grammar.b3-nakereba` — the direct comparison (obligation vs. judgment)
  is the lesson's spine.
- **New vocabulary:** none. **New kanji:** none — べき is kana-only in ordinary usage; every genuine
  hit confirms it.
- **Reading-library slice:** curate against 食べきれない/たべきれない (§1.1) in any automatic tagging.

### Lesson 3 — There's a need to (order 262)

- **Title:** There's a need to
- **Can-do:** State a plain necessity, without making it a judgment about anyone
- **Pattern id:** `grammar.b3-hitsuyo-ga-aru`, `pattern: "～必要がある"`
- **Teaches:** Dictionary form (plain non-past) + 必要がある — "there is a need to X," the least
  personal of this band's three "should" flavors, closer to a report than a directive: it describes
  a state of the world (a need exists) rather than obliging a specific "you" (なければならない) or
  passing judgment (べき). This distinction is the lesson's whole content, taught directly against
  both — the same three-way "grounds" contrast Band 5 built for はず/に違いない/わけ. Negative:
  **必要はない**, "there's no need to" — clean, well attested (5 hits) and the natural pairing.
  Every attested hit in this corpus attaches to a verb; noun/な-adjective attachment (X が必要,
  X の必要がある) did not surface here — stated as the extension a learner will meet in the reading
  library, not proven by this band's own material, the same honesty Band 5 held itself to for
  はず's missing noun attachment.
- **Attestation:** 26 raw, **26 genuine — clean, the brief's own caution ("probably solid") was
  right.** Representative:
  - [#233523] あなたのシャツは洗う必要がある。 — "Your shirts need to be washed." (short, clean
    opener)
  - [#165778] 私たちは再生可能なエネルギー源を開発する必要がある。 — "We must develop renewable
    energy sources."
  - [#94686] 彼女のテクニックはすばらしいが、もっと感情を込めて演奏する必要がある。 — "Her technique
    is superb, but she needs to play with more expression." (contrast pair: skill judgment vs.
    stated need)
  - [#150948] 歯医者に行く必要はないですよ。 — "You don't need to go to the dentist's." (negative)
- **Depends on:** `grammar.b2-plain-dictionary`. Lessons 1–2, directly — the three-way grounds
  contrast (obligation / judgment / stated need) is this lesson's real content.
- **Exercises (earlier books):** none new.
- **Exercises (this band):** `grammar.b3-nakereba`, `grammar.b3-beki` — the full three-way contrast
  should be named explicitly once this lesson exists.
- **New vocabulary:** none — 必要 (necessary) is the head noun the whole construction is built from
  and is taught as part of the grammar pattern rather than as a separate vocabulary card, the same
  call Band 1 made for せい/おかげ.
- **New kanji: 必, 要.** Neither appears anywhere in the 219-kanji manifest. Every one of the 26
  genuine hits writes 必要 in kanji — there is no honest kana-only fallback the way ため/せい/おかげ
  had one in Band 1.
- **Reading-library slice:** no special caution — this pattern is clean.

### Lesson 4 — You must not (order 263)

- **Title:** You must not
- **Can-do:** Forbid something outright, and tell it apart on sight from lesson 1's "must"
- **Pattern id:** `grammar.b3-tewanaranai`, `pattern: "～てはならない"`
- **Teaches:** Verb て-form (or って for a suru-verb, or a copula's て-form) + はならない — flat
  prohibition, "you must not." Framed from the start as the negative counterpart of Book One's
  `grammar.n5-unit-13` (てもいいですか, "may I?") — ask the question, and this is the "no" that
  sounds like a rule rather than a preference. **This lesson's entire example pool depends on a
  trap that has to be named before a single sentence ships (§1.2):** なくてはならない is not a
  spelling variant of てはならない — it is lesson 1's obligation family, and the two mean opposite
  things. 締めてはならない forbids fastening; 締めなくてはならない requires it. Teach the contrast
  directly, ideally against the *exact same verb* the learner already has fresh from lesson 1 —
  [#78324]'s 締めなくてはならない ("must fasten") is the natural callback for this lesson's own
  締めてはならない-shaped example, if the reading library or checkpoint pool can supply one, and the
  grammarNote should name the two side by side even if it can't.
- **Attestation:** 49 raw, **18 genuine** after removing the 31 なくてはならない hits (§1.2) — thinner
  than the brief's ceiling suggested, but at 18 still comfortably above the floor this book has kept
  patterns at before (Band 6's どころか, 9; Band 1's からには, 3). Representative:
  - [#142728] 生徒はこの便所を使ってはならない。 — "Students must not use this toilet." (short,
    clean opener)
  - [#184744] 外国人労働者は日本経済のバッファーであってはならない。 — "We should not use foreign
    workers as a buffer against Japan's economic slowdown." (copula て-form, あって)
  - [#229291] いかなる国も他国の内政に干渉してはならない。 — "No country should interfere in another
    country's internal affairs." (formal/legal register — this pattern skews written and official)
  - [#149705] 自由と放任を取り違えてはならない。 — "You must not confuse liberty with license."
  - [#145338] 新しい葡萄酒は古い皮袋に入れてはならない。 — "Do not put new wine into old bottles."
    (proverbial register, worth flagging as color)
- **Depends on:** `grammar.n5-unit-13` (てもいいですか — named directly as the positive counterpart
  this lesson negates), the te-form family (`n5-te-*`). Lesson 1, directly — the なく trap is the
  lesson's central point, not a footnote.
- **Exercises (earlier books):** `grammar.n5-unit-13` re-surfaced deliberately, as the permission
  question this lesson's prohibition answers "no" to.
- **Exercises (this band):** `grammar.b3-nakereba` — the なく trap, named as the point.
- **New vocabulary:** none. **New kanji:** none — every genuine hit is written with kana はならない;
  no kanji spelling of ならない (成らない) turned up in this construction anywhere in the corpus.
- **Reading-library slice:** essential that any automatic tagging exclude なくてはならない (§1.2) — a
  bare literal-substring tagger for `grammar.b3-tewanaranai` would otherwise mis-tag 31 sentences
  with the opposite meaning as this lesson's grammar. This is the band's sharpest curation risk.

### Lesson 5 — No way around it (order 264)

- **Title:** No way around it
- **Can-do:** Say you had no real choice, however much you might not want to admit it
- **Pattern id:** `grammar.b3-zaru-wo-enai`, `pattern: "～ざるを得ない"`
- **Teaches:** Verb + ざるを得ない — a stronger, more literary claim than lesson 1's なければならない:
  not just "I must," but "there was no way around it, whatever I might have preferred." ざる is the
  classical negative auxiliary (a cousin of the ず that Band 5 §1 flagged as one of はず's
  false-positive sources — worth a one-line historical aside, not a teaching point), and 得ない is
  "cannot obtain/manage" — literally "cannot manage to not do it." する irregularly becomes せざるを
  得ない (せ, the classical mizenkei of する, not し). This is the band's closer: the most emphatic,
  most written-register member of the family, after four lessons that moved from plain obligation
  to judgment to stated need to flat prohibition.
- **Attestation: the thinnest lesson in the band, and every hit is load-bearing.** 3 sentences, no
  more exist in this corpus, matching `book-three-bands.md` §3b's ceiling exactly and every one
  genuine (§1) — the same tier as Band 1's からには (3, kept) and thicker than Band 1's ことだから
  (2, also kept). The brief's own floor is "no attestation," not "thin attestation," and this
  pattern clears it.
  - [#144528] 人は運命を甘受せざるを得ない。 — "One can't quarrel with destiny." (せざるを得ない, the
    irregular する form, clean and short — the best opener)
  - [#204782] それゆえここにとどまらざるを得ないだろう。 — "Hence, I shall have to stay here."
    (ordinary godan attachment, とどまる → とどまらざる)
  - [#213554] そして、こうしたものからほんのわずかしか隔たっていない知覚が、直接的な信号がまったくない
    のにおこる、「超感覚的な」というレッテルを付けざるを得ない知覚なのである。 — longer and more
    complex; usable as a compose-then-compare or reading-library citation rather than the lesson's
    first teaching example.
- **Depends on:** lesson 1 (the obligation family it intensifies), `grammar.b2-plain-nai-godan` for
  the mechanical る→ざる swap (parallel to the nai-form's dictionary→ない move, one more vowel-row
  change on top).
- **Exercises (earlier books):** none new.
- **Exercises (this band):** `grammar.b3-nakereba` — named directly as the milder cousin this
  lesson intensifies.
- **New vocabulary:** none. **New kanji: 得.** Not taught anywhere in the manifest; every genuine
  hit writes it in kanji (there is no honest kana-only える spelling in this construction in the
  corpus).
- **One cousin flagged, not taught:** ないわけにはいかない ("cannot afford not to") is this pattern's
  closest neighbor in meaning and is not part of this band — it is the negation of わけにはいかない,
  which `grammar.b3-wake` already taught in Band 5 lesson 7 ([#84279] 負け犬になるわけにはいかない,
  "can't afford to"), and this corpus attests the negated form exactly once ([#11742892]) — too thin
  to teach and not new ground even if it weren't (§6.3). Worth a one-line mention for recognition,
  not a grammarId of its own.
- **Reading-library slice:** with only 3 corpus sentences, real reinforcement has to come from the
  library. The checkpoint pool has no margin to hold back an unused sentence — see §5's note.

### Lesson 6 — Band 8 checkpoint (order 265)

- **Id:** `b3.checkpoint-8`. `checkpoint: recognition`, `wordIds: []`, `phraseIds: []`, `kanji: []`,
  no `patternId` — same shape as every earlier band checkpoint in this book.
- **Can-do:** Recognise everything this band taught, tell obligation from prohibition on sight, and
  read the gate text (§7).
- **The shrinking set.** なければならない (232), べき (176), 必要がある (26) and てはならない (18) all
  have real depth to hold back sentences the learner has not seen in teaching. **ざるを得ない (3) has
  no margin — the honest choice is the one Band 1 and Band 6 already made for their own thinnest
  patterns: reuse a teaching sentence rather than manufacture a fourth example that doesn't exist.**
- **What the checkpoint should test that no single lesson can:** the なく trap (§1.2, lesson 4) is
  this band's sharpest single point, and the checkpoint's item selection should include at least one
  near-miss pair built on the same verb — a てはならない sentence and a なくてはならない sentence
  differing by exactly two kana, asking the learner to tell which one forbids and which one requires.
  A checkpoint that never tests this has not tested this band's real content, only its individual
  glosses.
- **Placement:** at the band boundary (DR-021). No lesson in this band gates another's form, so
  there is no earlier point the checkpoint could sensibly move to.

---

## 5. Totals

| | Count | Note |
|---|---:|---|
| Teaching lessons | 5 | one added beyond the brief's five named patterns (なければならない, §6.1), one cut (ないわけにはいかない, §6.3) — net the same count the brief started with, differently earned |
| Checkpoints | 1 | band boundary (DR-021) |
| New words | **0** | mining carries vocabulary at this stage (`04-stage-reading.md` §3) |
| New kanji | **3** | 必, 要 (lesson 3), 得 (lesson 5) — every other lesson in the band is kana-only in ordinary use |
| New grammar patterns | 5 | one per teaching lesson |
| New phrases (estimate) | **~24–28** | richness varies sharply: ~6 for lesson 1 (the family spans five registers), ~5–6 each for lessons 2–4, exactly 3 for lesson 5 (all attested sentences, none held back) |
| Genuine attested example sentences | 232 (なければならない family) + 176 (べき) + 26 (必要がある) + 18 (てはならない) + 3 (ざるを得ない) = **455** | see §1; raw ceiling before hand-classification was 178+26+49+3+1 = 257 for the brief's five named patterns alone — the true pool is larger, not smaller, once なければならない's family is counted |
| Global order | 260–265 | one slot (266) returned unused, argued in §2 |

---

## 6. Judgment calls — where I think the plan needs a decision, or is silent

### 6.1 なければならない is missing from the skeleton, and unlike だろう/でしょう in Band 5, this band's job is to fix it, not just flag it

This document's own commissioning brief anticipated this finding directly: *"なければならない is
the single most common obligation form in Japanese; if it is untaught, that is a finding worth
reporting, because your band cannot sensibly teach ざるを得ない to a learner who has never met the
plain way to say 'must'."* I checked every grammar file in `src/content/grammar/` (Book One's
`n5.yaml` and all ten of Book Two's `b2-0N-*.yaml` files) and every lesson and phrase file for the
strings なければならない, なきゃ, なくちゃ, なくてはいけない and なくてはならない. **None appear
anywhere.** Neither does any other productive "must" construction — Book Two's nearest neighbors are
`grammar.b2-cond-hougaii` (たほうがいい, advice, easily declined) and `grammar.n5-unit-13`
(てもいいですか, a question about permission, not a statement of obligation). A learner who finishes
Book Two has never been told how to say "I have to."

Band 5's だろう/でしょう gap (`book-three-band-05.md` §7.2) is the nearest precedent, and I want to
be precise about why I am *not* treating this the same way that document did. That planner found a
real gap and declined to fix it, reasoning it belonged to a different band's theme (speaker stance)
and that inventing a pattern outside the brief's assigned list would blow the range assigned to a
different band. Neither reason applies here. なければならない is not adjacent to this band's theme —
it *is* this band's theme, more centrally than any of the five patterns the skeleton actually named:
every one of ざるを得ない, べき, 必要がある and てはならない is a variation on "must" or "must not"
that only makes sense to teach in contrast to the plain form, the way lesson 2 is built explicitly
against lesson 1 and lesson 4 is built explicitly against lesson 1's なく trap. This is closer in
shape to `book-three-band-00-passive.md` §1's finding — a missing prerequisite that directly blocks
the band it sits in front of — than to Band 5's "worth flagging, not mine to fix."

**What tips the decision toward adding rather than merely flagging:** the cost is genuinely small.
Both grammatical pieces なければならない is built from — the nai-form and the ば conditional — are
already taught, in Book Two, and already taught together closely enough that
`grammar.b2-cond-ba-adj-noun`'s own gloss states outright that an い-adjective (which is exactly
what ない is, per `grammar.b2-plain-nakatta`) takes ければ. なる is already a known word from Book
One. This is not a new grammatical mechanism the way the passive band's れる/られる was — it is two
owned rules combined, plus one new idea (the double-negative logic that makes "if not, no good" mean
"must"). One lesson, cheaply taught, closes a hole that would otherwise sit underneath every other
lesson in this band.

### 6.2 なくてもいい is real, well attested, and stays a one-line mention rather than a sixth lesson

なくてもいい ("don't have to") is the mirror image of lesson 1 — the same nai-form, plus てもいい
(permission, already owned from Book One). It is genuinely attested (7 clean hits) and would
complete the deontic square this band otherwise leaves at three-quarters (must / must not / should —
missing "don't have to"). I considered giving it a full lesson and decided against it: it is not in
the skeleton's five named patterns, and unlike なければならない it is not a blocking prerequisite for
anything else in this band — every one of the five taught lessons stands on its own without it. Per
the brief's own instruction not to pad to reach a lesson count, I flagged it for recognition in
lesson 1's grammarNote (§4) rather than spending one of the band's remaining order slots on it. If a
future revision of this band gets a seventh slot back, this is the first place I would spend it.

### 6.3 ないわけにはいかない is cut, and it is a cleaner cut than the brief's own "likely cut" framing suggests

One genuine sentence ([#11742892]) is below the floor this book has kept a pattern at anywhere so
far — the previous low-water mark was Band 1's ことだから at 2. But thinness alone is not the whole
argument, and I want to be careful not to repeat Band 6 §6.1's warning in the other direction: a low
ceiling means "check carefully," not "cut automatically," and Band 6 found two patterns the brief
expected to lose that survived cleanly. I did check carefully, and the reason this one stays cut is
not just the count — it is that **the material this pattern would teach is not new.**
ないわけにはいかない is わけにはいかない negated, and わけにはいかない itself — "a course of action is
closed off, can't afford to" — is already taught, in this book, as one of the four jobs
`grammar.b3-wake` covers in Band 5 lesson 7 ([#84279] 負け犬になるわけにはいかない). A learner who
has met わけにはいかない and then meets its negation in the reading library is extending a known
piece with ordinary negation, not learning a new construction from one attested sentence. That is a
materially different situation from ざるを得ない, whose three sentences are the *only* attested
material for a construction nothing else in this book teaches (§6.4 makes the contrast explicit).

### 6.4 ざるを得ない is kept at three sentences, on the precedent Band 1 already set, and I want to name the precedent rather than assume it

Three genuine hits is the same count Band 1 kept for からには, and thinner than Band 1's ことだから
(2) is not — ことだから is thinner still and was kept. The difference between "thin, keep it" and
"thin, cut it" in this book so far has never been the raw count; it has been whether the construction
is genuinely new ground with no owned near-equivalent nearby (ざるを得ない: yes — nothing else in
this band or in Books One/Two says "no way around it" with this force) versus a negation or minor
variant of something already taught (ないわekにはいかない: no, per §6.3). Applying that same test
consistently is why one three-sentence pattern survives and a one-sentence pattern next to it does
not — the count alone would not have distinguished them cleanly.

### 6.5 てはならない's real ceiling being 18, not 49, is not a shrinking finding — it is a redistribution, and that is worth stating plainly

Unlike Band 2's とはいえ (ceiling 11, genuine 2 — a pattern that turned out to be mostly noise) or
this book's own thin patterns, the 31 hits てはならない's raw count loses are not false positives in
the usual sense — they are not unrelated words that happen to contain the same kana. They are a real,
common, well-formed construction that simply belongs to a different pattern this band also teaches.
Once redirected, they make lesson 1's family richer (159 → 190 なければ-family hits once
なくてはならない is folded in) rather than vanishing. The band's total genuine attestation pool did
not shrink because of this finding — it grew, once なければならない's family is counted at all
(§1's total table). The lesson for whoever plans a later band and finds a similarly contaminated
ceiling: check whether the "false positive" is actually a different, real pattern before assuming it
is noise to be discarded — Band 6 already drew this same conclusion for いただけ⊂だけ (§6.1 there),
and this band's finding is the same shape at a larger scale, with the sharper twist that the two
readings here are opposites rather than merely unrelated.

### 6.6 Three new kanji, in a band that could plausibly have shipped zero

べき, なければならない (and its whole family), and ざるを得ない's -zaru- portion are all kana-only in
ordinary usage — this band could have shipped zero new kanji if 必要がある had turned out to have an
honest kana-only register the way ため/せい/おかげ did in Band 1. It does not: every one of the 26
genuine hits writes 必要 in kanji, and ざるを得ない's 得 is likewise never spelled in kana in this
corpus. This is the same call Band 4 (際, 途, 以) and Band 6 (比, 反, 面) already made and already
defended: teaching these patterns as fixed kana chunks to keep the kanji count at zero would mean
authoring examples that do not match how the source material actually writes them, which is a worse
compromise than three kanji this book has already established it is willing to spend when the real
material demands it.

### 6.7 "Permission" and 許可 — the skeleton's own row names it, and I think it is already served without a dedicated lesson

`book-three-bands.md`'s band 8 row is titled "Obligation and permission" and lists "constructions of
許可" as something the band owns. I did not find attestation-worthy material for 許可 (permission,
the noun) as its own productive construction distinct from what the learner already has, and I do
not think this band needs one: `grammar.n5-unit-13` (てもいいですか, "may I?") already covers
permission-asking from Book One, and lesson 4's てはならない is its direct negative counterpart —
"no" as a rule rather than a preference. Together they cover the permission half of this band's name
without a separate vocabulary lesson for 許可 itself, which did not turn up as a common standalone
construction in this corpus in a form distinct from what て-form + はならない/もいい already supply.
I would flag this differently if 許可 as a noun (許可が必要だ, 許可を得る) had turned up richly
attested and doing work these five patterns don't already cover — it didn't.

### 6.8 One factual correction to the commissioning brief

The brief that commissioned this document states the learner already has permission grammar "from
Book Two's 〜てもいいですか." That is not quite right: `grammar.n5-unit-13` (pattern
`～てもいいですか`, phrase `shopping.may-i-look`) is **Book One** material (the `n5` id prefix,
confirmed against `scripts/ladder.mjs`'s `BOOKS` table), not Book Two. The substance of the brief's
point stands — the learner does already own it — but it is owned a full book earlier than stated,
which matters for anyone checking this band's prerequisites against the ladder.

---

## 7. The gate text (band close)

Per `04-stage-reading.md` §3 and matching every sibling band's §6/§7: **specify what it must
contain, not which text it is** — the text-source decision (`book-three-bands.md` §2) is still open
and this band's design does not depend on which way it resolves.

- **It must be unreadable without this band, and specifically without lesson 4's なく trap.** At
  least one sentence's claim should turn on correctly distinguishing an obligation from a
  prohibition — misreading てはならない as なければならない (or the reverse) should change what the
  reader believes the passage is telling them to do, not just how fluently they read it. This is the
  strongest single test this band's design supports, and the checkpoint (§4, lesson 6) already
  builds toward it.
- **It should draw on at least three of this band's five `grammarIds`** — given the band's real
  material is thinner than Bands 5–6 (455 genuine sentences across five patterns, one of them only
  3), requiring all five in one short passage is not realistic; three is a genuine test of the
  band's range without demanding more than the attested pool comfortably supports.
- **Vocabulary coverage at or above the flow line (~98%, `04-stage-reading.md` §5)** once Books
  One–Two, Band 5's `grammar.b3-wake` (for the ないわけにはいかない cross-reference, §6.3) and this
  band's own material are in the known set.
- **Curated by a human for the なく trap specifically, not accepted from automatic tagging alone**
  (§1.2) — a gate-text candidate auto-tagged `grammar.b3-tewanaranai` needs a person to confirm the
  tag is not actually なくてはならない before it ships. This is the single highest-stakes curation
  check in this band, sharper than Band 5's はず/らしい check or Band 6's だけ/くらい/ほど check,
  because the failure mode here is not "wrong pattern" but "opposite meaning."
- **If the interim text source is the clustered-sentence stopgap**
  (`data/reading/micro-readings.json`'s model), the checkpoint's own copy must say so rather than
  present it as a story — the same restraint every sibling band's gate-text section already holds
  itself to.
- **No score, no pass mark.** Consistent with DR-020: presented once the shrinking recognition set
  empties, framed as "you can read this now," never as a test the learner can fail.

---

## 8. Authoring checklist

1. **Every phrase's source is a real Tatoeba id**, cited in the commit message per CLAUDE.md, and
   in the `Phrase.tatoebaId` field.
2. **Write every `pattern:` field as a bare Japanese literal** (no Latin characters —
   `grammarSurface` in `scripts/levelling.mjs` rejects any pattern string containing one):
   `～なければならない`, `～べき`, `～必要がある`, `～てはならない`, `～ざるを得ない`. All five clear
   the two-character minimum after splitting on ～.
3. **Do not source a べき teaching example from 食べきれない or たべきれない** (§1.1) — both are
   ます-stem+きれない, not this auxiliary.
4. **Do not tag or source a てはならない teaching example from anything preceded by なく** (§1.2) — a
   plain literal-substring search on てはならない will return なくてはならない sentences with the
   opposite meaning. Check the two characters immediately before every hit by hand.
5. **Re-surface `grammar.b2-cond-hougaii` before lesson 1** (the softer neighbour this lesson opens
   by naming), **`grammar.n5-unit-13` before lesson 4** (the permission question this lesson's
   prohibition answers), and **`grammar.b3-wake` before lesson 5** (the わけにはいかない cousin named
   in that lesson's closing note) — each callback only lands if the prerequisite is fresh in review.
6. **Commit messages** on every content commit must name the source, or the commit is rejected
   (CLAUDE.md).
7. **Run `pnpm walkthrough`** before merge, signed in — a guest run reaches only Book One
   (`TIER_BOOK_LIMIT`) and cannot verify this band.
8. **Run `pnpm ladder`** once this content lands, regenerating the book's ladder doc — `pnpm test`
   fails on a stale one.
9. **The text-source decision** (`book-three-bands.md` §2) blocks the reading-library slice and the
   gate text, not the five teaching lessons — those are authorable now, from the attested sentences
   in §1 alone, same as every other band in this book so far.
10. **Confirm Band 7's final shape before treating `b3.chapter-8`'s position (chapter 9) as settled**
    — this document's global order (260–265) is fixed by the brief regardless, but the chapter's
    *position* in the assembled book depends on Band 7 landing at exactly 8 slots (252–259) as
    currently planned in parallel. If Band 7 returns a slot the way this band does, the position
    number shifts; the id (`b3.chapter-8`) and the global `order` values in this document do not.
