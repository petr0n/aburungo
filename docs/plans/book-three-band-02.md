# Book Three, Band 2 — Contrast and concession

**Status: design, not content.** No Japanese sentence is composed here. Every example cited below
is either an existing manifest id or a real Tatoeba sentence, quoted with its id, per
[`04-stage-reading.md`](04-stage-reading.md) §8's stricter-than-Books-One-and-Two rule: **no
training-canonical sentences at this stage, at all.**

Source brief: [`book-three-bands.md`](book-three-bands.md) §1–§5. Worked example for depth and
voice: [`book-two-chapter-01.md`](book-two-chapter-01.md). Rule-chapter template:
[`n5-16-te-form.yaml`](../../src/content/lessons/n5-16-te-form.yaml). Trap this band was
commissioned to handle: [`b2-03-joining-sentences.yaml`](../../src/content/lessons/b2-03-joining-sentences.yaml)
and its grammar file, for what Book Two already told the learner about ながら.

**Shape landed: 6 teaching lessons + 1 recognition checkpoint, not 7+1.** とはいえ survives on the
thinnest attestation of the six and is kept; ながらも does not get its own lesson — it is folded
into ながら's lesson as the safe, unambiguous production form. **Global order: 204–210, contiguous
from the assigned 204. Order 211 is unused — tell the other three band authors and whoever
assembles the book.**

---


> **Orders here are provisional.** `book-three-bands.md` §3a was added after this document was
> written: a passive and causative band opens Book Three, before band 1, because Book Two chapter 7
> tells the learner the passive's conjugation and production "open the next book". That band is not
> sized yet, so every global `order` below shifts by its length, and this band's own number moves.
> Nothing else in this document changes — the patterns, the attestation and the lesson design all
> stand. Settle the numbering before authoring, not after.


## 1. Attestation — the part I most need to report

Counted against `server/data/jmdict-examples-eng-3.6.2.json` directly (25,983 unique Tatoeba
sentences embedded in the JMdict-for-Applications examples dump), not against `scripts/vocab.mjs`
or `scripts/jlpt.mjs`, because both of those tools index by *headword*, not by grammar string, and
what this band needs is "does the pattern occur," not "is a word attested." I streamed the file,
pulled every sentence pair, and regex-matched the literal Japanese string. Then I hand-read every
hit, because for four of these six patterns the literal string collides with an unrelated,
much more common thing.

| Pattern | Raw hits | Genuine hits (hand-checked) | Verdict |
|---|---:|---:|---|
| のに (concessive) | 184 | ~60 estimated (35% of a 40-sentence hand-classified sample; the rest split between the *other* のに — see §2 — and coincidental substrings inside words like におい, にこやか) | Abundant |
| くせに | 7 | 7 | Well attested, no false-positive risk (fixed string) |
| ながらも | 4 | 4 | Thin alone |
| ながら, concessive, bare | — | 0 productive; 9 lexicalized (残念ながら ×7, 生まれながら ×1, 涙ながら ×1) | Thin, and only as frozen idiom |
| ものの | 24 | 5 | Thin — 19 of 24 raw hits are もの (thing) + の (possessive), not the connector |
| とはいえ | 11 | 2 | **Thinnest in the band** — 9 of 11 raw hits are とは言えない/ません, the negated potential of 言う ("cannot be said to be"), an unrelated construction that happens to share four characters |
| にもかかわらず | 19 | 19 | Well attested, no meaningful false-positive risk |

Full genuine-hit lists, with ids, are in §4 under each lesson. The two patterns worth stating
plainly up front:

**とはいえ is real but barely there.** Two sentences: [Tatoeba #74923] 幾ら親戚とはいえ、私は先輩医師よ
("You might be my relative but here I'm your senior") and [#76485] 若かったとはいえ、しょうもない凡ミスだ
("I was young, but what a stupid mistake"). That is at the floor Book Two itself already
established as acceptable — lesson 1 of `book-two-chapter-01.md` says "cut it to 2 rather than
reaching forward" for exactly this situation. I kept it rather than cutting it, because 2 ≠ 0 and
the instruction is to drop what has **no** attestation, not what has thin attestation — but it is
the one lesson in this band where both sentences are load-bearing and neither can be swapped out
without re-searching the corpus.

**ながらも cannot support a lesson by itself, and neither can bare concessive ながら — but together
they can, and the honest way to teach them is together.** See §3.

---

## 2. のに has the collision the brief asked me to check for — and it is not the same shape as ながら's

ながら's problem (flagged in the skeleton, and the reason this band exists at the size it does) is
**a prior lesson creating a false expectation**: Book Two taught ます-stem+ながら as "two actions at
once," and a learner who meets concessive ながら reads it through that lens and gets a
contradiction instead of a second meaning.

のに's problem is different in shape, though it rhymes. Nothing in the ladder has taught の or
のに before now, so there is no prior lesson to contradict. But のに itself covers **two unrelated
grammatical jobs that look identical on the page**, and the reading library will hand the learner
both without warning:

- **Concessive** (this lesson): "even though / and yet" — [#82252] たった今ここにあったのに ("They
  were here a minute ago" — implying "and now they're gone").
- **Nominalizer-の + purpose/target-に**, not taught anywhere and not this lesson's job either:
  [#160305] 私はそのレコードを買うのに３０００円かかった ("It cost me 3,000 yen to buy the record") —
  here のに means roughly "for [the act of] buying," attaching to a cost or utility predicate
  (使う, 必要, 便利, かかる, 十分, 役立つ, 苦労する). In my 40-sentence hand-classified sample, 13 of 40
  were this second job.

This is not "already taught with a different meaning" the way ながら is. It is "one string, two
unrelated jobs, and the learner has met neither formally before this lesson." The fix belongs in
this lesson's grammarNote, as a **recognition-only warning**, not a second pattern: tell the
learner that のに followed immediately by a cost, difficulty, or usefulness word is doing a
different job, and that job is not this band's concern. The tell: concessive のに sits *between*
two contrasting clauses (or ends a sentence on its own, trailing into a complaint); purpose-のに is
always followed by the utility predicate. **This deserved its own check, and the brief was right to
ask for it** — it just isn't the ながら-shaped problem.

くせに does not have this problem. It is a fixed three-kana string with no productive component
(there is no bare くせ+に reading as "for the purpose of"), so every hit that isn't literal noise is
genuine, and the 7/7 rate in §1 confirms it.

---

## 3. Why ながらも and bare concessive ながら are one lesson, not two

The skeleton's table lists ながらも and ながら as two of the band's seven candidate patterns. I am
overriding that: **one lesson, patternId on ながらも, bare concessive ながら taught inside it as
recognition color.** Three reasons, and the third is the one that actually decided it.

1. **Neither is individually attestable.** 4 genuine ながらも sentences and, once you set aside the
   fact that every "bare concessive ながら" hit in the corpus is a frozen idiom (残念ながら,
   生まれながら, 涙ながら), zero freely-generated bare instances. Pooled, that is 13 usable sentences
   — a normal lesson's worth. Split, neither half clears the floor.
2. **They are the same particle.** ながらも is ながら with an emphatic も stacked on, the same
   relationship Book Two already trusted the learner with elsewhere (から vs. からには). Teaching
   them as two separate grammar ids would be teaching one fact twice under two names.
3. **The automatic tagging in `scripts/levelling.mjs` cannot tell bare concessive ながら apart from
   the already-taught simultaneous ながら — but it can tell ながらも apart, because that string is
   unambiguous.** `grammarSurface`/`matchesGrammar` (see §7) match on a literal substring. If this
   lesson's taggable pattern were bare ながら, the pipeline would tag *every* simultaneous-ながら
   sentence in the library as this band's pattern too, over-tagging the reading corpus with a
   false positive on every single review of `grammar.b2-join-nagara`. Making ながらも the taught,
   tagged, produced form and treating bare concessive ながら as untagged recognition vocabulary
   (its own frozen idioms: 残念ながら "unfortunately," 生まれながら(の) "born-," 涙ながら(に) "in
   tears") sidesteps that entirely. This is a pipeline-shaped reason, not just a content one, and
   it is the strongest of the three.

The lesson still explicitly contrasts against `grammar.b2-join-nagara` — that contrast is the
lesson's whole point — it just does not mint a second grammar id for the half of ながら that the
corpus won't support as a drillable rule anyway. One corner is left out on purpose, the same way
Book Two's noun-clause lesson left one out: a stative verb (知る, わかる) plus bare ながら can *also*
be concessive ("even though I knew..."), genuinely ambiguous with the simultaneous sense, resolved
only by which verb it is. No attested example of that shape turned up in this corpus. Recognise it
exists, teach nothing about it here — a later book's or a reading-time footnote's problem, not
this lesson's.

---

## 4. The lessons

Chapter/band id: `b3.chapter-2`. Learner-facing title: **"Even though"** — not "concession," not a
grammar label (DR-024: the learner never reads a level, and by the same spirit never reads a
grammarian's name for a form). `situation:` for every teaching lesson is `Even though`; the
checkpoint's is `Integration & checkpoint`, matching `b2.checkpoint-3`.

No lesson below carries a `wordIds:`-equivalent new-vocabulary budget, and none should — **vocabulary
does not come from lessons in this book** (`book-three-bands.md` §1). What each lesson needs is a
handful of attested Tatoeba sentences: one to serve as the grammar pattern's `blank`, the rest as
its practice phrases, doubling later as compose-then-compare items once the learner has met the
pattern (`04-stage-reading.md` §7). Where a candidate sentence's *non-pattern* vocabulary happens
to already be taught, I say so — but attestation this thin does not always leave a choice, and
where it doesn't, the leftover unknown word is legitimate mining fodder, not a defect.

### Lesson 1 — Yes, but (order 204)

- **Title:** Yes, but
- **Can-do:** React to something that contradicts what you'd expect — "even though"
- **Pattern id:** `grammar.b3-noni`. **`pattern:` field must be the bare literal `～のに`, not
  "plain form + のに"** — see §7.1 for why the English-word style Book Two used breaks automatic
  tagging.
- **Teaches:** Attachment: verb/い-adjective, plain form, direct — 高いのに, 行ったのに. な-adjective
  and noun take な — 静かなのに, 学生なのに (the same slot だ occupies in Book Two chapter 1's
  attachment table, with な substituting for だ, exactly parallel to how ので took な where から took
  だ). Register: neutral to slightly surprised/regretful; often trails off at the end of a
  sentence on its own as a complaint. **Then the warning from §2**: のに followed by a
  cost/usefulness word is doing an unrelated job this lesson does not cover.
- **Attested sentences (genuine, hand-checked; more exist — §1's ~60 estimate):**
  - [#82252] たった今ここにあったのに — "They were here a minute ago" (contrast/regret)
  - [#147047] まだまだもとの通りしっかりとしているのに — "though it was just as good as ever" (uses
    know-adjacent vocabulary; check against manifest at authoring)
  - [#193301] もっと一生懸命勉強すべきだったのに — "You should have worked harder" (regret register)
  - [#184951] 皆留守だというのに、不思議なことに家中の電灯がついていた — "though no one was home, oddly
    all the lights were on" (だ+という+のに, a common paraphrase shape worth flagging as a variant,
    not a new rule)
- **Exercises (earlier books):** re-surface `grammar.b2-join-kara` for direct contrast — から gives
  a reason *for* an outcome; のに withholds the outcome you'd expect *from* a reason or fact. That
  contrast is worth stating in the grammarNote once Band 1's cause/consequence patterns exist to
  pair against — not this document's to cite by id yet, since Band 1 has not shipped.
  `grammar.b2-plain-da`/attachment table for the な rule.
- **Exercises (this band):** none — opening lesson.
- **New vocabulary:** none (mining).
- **Depends on:** Book Two chapter 1 (plain form, だ/な attachment), chapter 3 (registers the
  learner already contrasts, から/ので/けど).

### Lesson 2 — Even though, and I mean it (order 205)

- **Title:** Even though, and I mean it
- **Can-do:** Point out a contradiction with an edge of criticism or mockery
- **Pattern id:** `grammar.b3-kuseni`, `pattern: "～くせに"`.
- **Teaches:** Same verb/い-adjective direct attachment as lesson 1. **The trap, placed directly
  against lesson 1 on purpose**: a noun takes の here, not な — 学生のくせに, not 学生なくせに, while
  のに takes 学生なのに. Two lessons apart on purpose, the から/なので structure from Book Two chapter
  3 repeated: teach the first attachment, then hand the learner the same slot taking something
  different right after. な-adjective takes な, same as のに (静かなくせに) — the noun row is the
  only place the two patterns disagree, and that is exactly why it is worth stating out loud.
  Register: くせに is never neutral — it always carries irritation, mockery, or indignation, unlike
  のに which can be plainly informational.
- **Attested sentences (genuine, all 7):**
  - [#102553] 彼は太っているくせに声は細い — "His voice is thin even though he is fat" (細い already
    taught, `vocab.hosoi`; 太る is not — one clean unknown, good mining fodder)
  - [#145102] 新米のくせに大きな顔をするな — "Act your place" (noun+の attachment, exactly the trap)
  - [#142557] 青二才のくせに何を言うか — noun+の again
  - [#170678] 最近は、年下のくせにため口を聞く奴が多すぎる — noun+の again, a third confirming instance
  - [#75400], [#203641], [#75530] — verb-predicate attachment, register color
- **Exercises (earlier books):** none directly; re-surface `grammar.b2-plain-da` for the noun
  attachment contrast.
- **Exercises (this band):** `grammar.b3-noni` — the lesson's spine is the direct comparison.
- **New vocabulary:** none. 太る is the one clean gap in the strongest example sentence and is left
  for mining rather than pre-taught.
- **Depends on:** lesson 1, directly — the contrast is the lesson.

### Lesson 3 — The other job of ながら (order 206)

- **Title:** The other job of ながら
- **Can-do:** Recognise and produce "even though" using a form already owned for something else
- **Pattern id:** `grammar.b3-nagara-concessive`, `pattern: "～ながらも"` (not bare ながら — see §3
  and §7.1: bare ながら is untaggable-safe to use here precisely because using it *would* tag every
  already-taught simultaneous-ながら sentence as this pattern too).
- **Teaches:** Open by naming the collision directly, the way this lesson has to: "You know ながら
  as *while* — 食べながらテレビを見る. This is its other job: *even though*, and the form warns you
  which one it means by adding も." Attachment for the concessive sense: adjective/noun stem, not a
  verb ます-stem — 女ながらも, 不本意ながらも. も is the safe marker to *produce*; bare concessive ながら
  is real but shows up almost entirely as frozen phrases the learner should *recognise*, not
  build: 残念ながら (unfortunately), 生まれながら(の) (born-), 涙ながら(に) (in tears). State plainly
  that a stative verb (知る, わかる) plus bare ながら can also mean "even though" and is genuinely
  ambiguous with the simultaneous sense — recognise that this exists, teach nothing about it here;
  no attested example surfaced to teach it honestly.
- **Attested sentences (genuine, all 4 for ながらも, plus the idiom set):**
  - [#86975] 彼女は不本意ながらもそうした — "She did it against her will"
  - [#76655] ぜいぜい言いながらも、気合をいれて走り続ける — "Puffing and panting we continued to run"
  - [#147360] 女ながらも彼女は勇敢だった — "Woman as she was, she was brave"
  - [#115550] 彼は、結婚するためにイランに帰るかもしれないと言いながらも、… — "Although he says he might
    return..." (longer, richer sentence — good compose-then-compare candidate later)
  - Idiom recognition set: [#225050], [#212401], [#169219], [#169249], [#138265], [#169251],
    [#74644] (all 残念ながら), [#177105] (生まれながらの), [#86243] (涙ながらに)
- **Exercises (earlier books):** **`grammar.b2-join-nagara` is a hard, named dependency, not a
  loose one.** This lesson does not work if the learner has decayed or never solidified the
  simultaneous sense — the whole lesson is the contrast. Re-surface it in the SRS queue
  immediately before this lesson, the same move Book Two made for the te-form before its own
  plain-past lesson.
- **Exercises (this band):** none yet — first lesson in the band to depend on prior-book material
  this specifically rather than lesson 1/2's family.
- **New vocabulary:** none.
- **Depends on:** `grammar.b2-join-nagara` (hard). Not on lessons 1–2.

### Lesson 4 — Although, in writing (order 207)

- **Title:** Although, in writing
- **Can-do:** Read and produce a formal "although" connecting two clauses
- **Pattern id:** `grammar.b3-monono`, `pattern: "～ものの"`.
- **Teaches:** Attaches directly to a plain-form predicate — verb or い-adjective — the same slot
  as lesson 1 and 2's verb row. Register: written and formal; this is an essay-and-news connector,
  markedly less common in speech than のに or くせに, and the grammarNote should say so rather than
  imply parity. Flag the false-friend risk explicitly, since it is why the attestation search came
  back thin: もの is an ordinary noun (thing), so もの+の (possessive: "the thing's...") reads
  identically on the page and is far more common than the connector. If a learner searches for
  ものの in real text, most hits will not be this pattern — the grammarNote should warn for reading,
  the way lesson 1 warns about のに's other job.
- **Attested sentences (genuine, all 5):**
  - [#75487] 高校時代からつきあっている彼氏はいるものの、つきあいが惰性になっている… — "She has a
    boyfriend... but feels their relationship has become a matter of habit"
  - [#78255] 流言飛語に惑わされるべからず、とはいうものの、言うは易く行うは難し — "They say you shouldn't
    take rumors seriously, but that's easier said than done" (とはいうものの — a fixed idiom worth
    naming as the bridge to lesson 5)
  - [#188575] 汚い手で会社を乗っ取ったものの、腹心だと思っていた部下に裏切られ… — "Having taken over the
    company..., he was betrayed by his trusted confidant"
  - [#198491] パーティーに行くことにしたものの、気が進まない — "Though I decided to go to the party, I'm
    not looking forward to it"
  - [#228108] うまく、あの学校に入れたものの全部が全部、詰め込み勉強だけで入れたわけではなかった — "All those
    who made the grade... could not have done so only by cramming"
- **Exercises (earlier books):** none direct; conceptually pairs with lesson 1 (のに) as "the same
  idea, plainer vs. more formal" — worth a grammarNote line, not a re-drill.
- **Exercises (this band):** none required, though the checkpoint should place it near the same
  pool as lessons 5–6 given the shared register.
- **New vocabulary:** none. [#198491] (パーティーに行くことにしたものの) is the vocabulary-lightest of
  the five and the strongest candidate for the pattern's `blank`.
- **Depends on:** Book Two chapter 1 (plain form). Loosely follows lessons 1–2 for the "we've done
  this idea casually, now formally" arc, not a hard dependency.

### Lesson 5 — That said (order 208)

- **Title:** That said
- **Can-do:** Recognise and produce a formal "that said / granted that" qualifier
- **Pattern id:** `grammar.b3-tohaie`, `pattern: "～とはいえ"`.
- **Teaches:** Attaches directly to a noun (no copula needed — 親戚とはいえ, not 親戚だとはいえ) or to a
  plain predicate. Often paired with いくら/どんなに ("however much..., still..."), which is what
  both surviving attested sentences happen to demonstrate — call that out as the natural home for
  this pattern rather than presenting it as a coincidence of a thin sample. **State plainly this
  is the thinnest lesson in the band**: two sentences, both load-bearing, and the grammarNote must
  work harder than any other lesson's to make two examples feel like enough — lean on the
  とはいうものの bridge from lesson 4 (already attested, already met) to show the learner this is not
  an isolated fact but a family member.
- **Attested sentences (genuine, both):**
  - [#74923] 幾ら親戚とはいえ、私は先輩医師よ？院内ではちゃんとケジメをつけなさい — "You might be my
    relative but here I'm your senior and a doctor"
  - [#76485] あぁ……、若かったとはいえ、しょうもない凡ミスだ — "I was young, but what a stupid mistake"
- **A trap worth naming for reading, mirroring §2's のに warning:** とは言えない/ません ("cannot be
  said to be X") is a different construction — the negated potential of 言う — that shares four
  characters with this pattern and outnumbers it roughly 4-to-1 in raw search hits. The
  grammarNote should say so, the same way lesson 1 warns about purpose-のに.
- **Exercises (earlier books):** none.
- **Exercises (this band):** `grammar.b3-monono` — explicit callback to とはいうものの.
- **New vocabulary:** none; both sentences carry vocabulary (親戚, 先輩, ケジメ, 凡ミス) that is very
  likely outside Book One/Two and outside this band's remit to pre-teach — genuine mining
  material, and the grammarNote should not pretend otherwise.
- **Depends on:** lesson 4, loosely (register family, the とはいうものの bridge).

### Lesson 6 — Despite that (order 209)

- **Title:** Despite that
- **Can-do:** Read and produce "despite / regardless of" in formal writing
- **Pattern id:** `grammar.b3-nimokakawarazu`, `pattern: "～にもかかわらず"`.
- **Teaches:** Attaches directly to a noun (晴天にもかかわらず, no copula) or to a plain/である clause
  (そのような境遇であったにもかかわらず). Also stands alone sentence-initially as それにもかかわらず ("and
  yet, ..."), which is worth its own line since it is one of the attested sentences below and
  reads differently from the mid-sentence use. Heaviest and most literary of the six — good
  closer, and the pattern the gate text should lean on hardest (§6).
- **Attested sentences (genuine — a representative sample of 19):**
  - [#229666] あれほどのベテランにもかかわらず、彼はどうしてよいのかわからなかった — noun, direct
  - [#142993] 晴天にもかかわらず、空気は冷え冷えとしていた — noun, direct
  - [#212529] そのような境遇であったにもかかわらず、彼は自分一人で道を切り開いた — clause, であった
  - [#153148] 私は疲れていたが、それにもかかわらず眠れなかった — それにもかかわらず, sentence-initial
  - [#205649] それにもかかわらず彼女は私たちの言い値を受け入れた — それにもかかわらず again
  - [#116451] 彼の努力にもかかわらず、すべては以前と変りなかった — noun, direct, plain vocabulary
- **Exercises (earlier books):** none.
- **Exercises (this band):** `grammar.b3-monono`, `grammar.b3-tohaie` — same written-register
  family, worth an explicit "three ways to say it more formally" line in the grammarNote once all
  three exist.
- **New vocabulary:** none. [#116451] (彼の努力にもかかわらず、すべては以前と変りなかった) is a strong,
  vocabulary-light candidate for the pattern's `blank`.
- **Depends on:** lessons 4–5 loosely (closes the written-register trio). Not on lessons 1–3.

### Lesson 7 — Band 2 checkpoint (order 210)

- **Id:** `b3.checkpoint-2`. `checkpoint: recognition`, `wordIds: []`, `phraseIds: []`, `kanji: []`,
  no `patternId` — same shape as `b2.checkpoint-3`.
- **Can-do:** Recognise everything this band taught, and read the gate text (§6).
- **Format:** recall, not tile-tap, matching Book Two's recognition checkpoints (03 §10 as cited
  in `book-two-chapter-01.md` §3, lesson 11). Mastery gate (DR-020): the remaining set shrinks to
  zero, retries unlimited, nothing recorded, misses rejoin the SRS queue.
- **Placement:** at the band boundary — must not be split earlier. Lesson 3 has a hard external
  dependency on `grammar.b2-join-nagara` rather than on any earlier lesson in this band, so the
  internal ordering (1→2 contrast, 3 standalone, 4→5→6 register climb) has no other split
  constraint, but the checkpoint itself is one unit at the end, per DR-021.

---

## 5. Totals

| | Count | Note |
|---|---:|---|
| Teaching lessons | 6 | Skeleton proposed 7 patterns; とはいえ survives thin, ながらも merges into ながら — net one fewer lesson, argued in §1 and §3 |
| Checkpoints | 1 | Band boundary (DR-021) |
| New grammar patterns | 6 | One per teaching lesson |
| New vocabulary | 0 (by design) | Mining, not lessons (`book-three-bands.md` §1) |
| Attested example sentences cited | 6 (のに, representative of ~60) + 7 (くせに) + 4 (ながらも) + 9 (ながら idioms) + 5 (ものの) + 2 (とはいえ) + 6 (にもかかわらず, representative of 19) | Every one carries a real Tatoeba id |
| Global order | 204–210 | 211 unused — flag to the assembler and to Bands 1/3/4's authors |

---

## 6. The gate text

**Specify what it must contain, not which text it is** — the text-source decision (`04-stage-reading.md`
§5) is unresolved and is not this band's problem to solve.

**The mechanism already exists and should be used, not re-invented.** `scripts/levelling.mjs`'s
`tagSentence` marks a sentence's `grammarIds` by literal surface match
(`grammarSurface`/`matchesGrammar`), separately from its vocabulary coverage — the file's own
comment is explicit that "coverage cannot see an unknown grammar pattern... grammar readiness is a
tagging question." That is exactly the tool this checkpoint needs: **the gate text's
"unreadable → readable" claim should be evidenced by the pipeline's own `grammarIds` diff against
the learner's taught set, not by a person's judgment call that a passage looks harder.**

What the gate text must contain:

- **At least four of this band's six `grammarIds` tagged in load-bearing position** — removing or
  misreading the connective changes what the passage says. Six of six is better if a coherent
  source happens to carry it, but is not required: とはいえ and ながらも are too thin to guarantee
  inclusion in any one passage without composing, which is forbidden.
- **Vocabulary coverage at or above the flow line (~98%, §5) once Books One–Two and this band's
  own material are in the known set** — the gate text is a *reading* checkpoint, not a vocabulary
  stress test; the band's own patterns should be the thing that was missing, not obscure words.
- **The same passage, scored against the learner's state at band-open, must show at least one of
  those four-plus `grammarIds` absent from the taught set** — that absence is the "could not have
  read this" evidence. If every pattern in the passage was already tagged as taught before this
  band, it is not a gate text for this band.
- **Curated by a human for the false-positive patterns**, not accepted from automatic tagging
  alone: のに (over-tags the purpose/target sense, §2) and ものの (over-tags もの+の, §1, §4 lesson
  4) will both surface false matches under literal surface search. A gate text candidate tagged
  with `grammar.b3-noni` or `grammar.b3-monono` needs a person to confirm the tagged sentence is
  actually the concessive sense before it ships.
- **If the interim text source is the clustered-sentence stopgap** (`data/reading/micro-readings.json`'s
  model, §2 option (c) of `04-stage-reading.md` §5), the checkpoint's own copy must call it what it
  is — a set of sentences at a shared level, not a story — the same restraint that file's own
  header already imposes on itself.

---

## 7. What I think the plan is wrong or silent about

### 7.1 `GrammarPattern.pattern` written Book-Two-style silently breaks this band's own checkpoint mechanism

Book Two's grammar files write `pattern: "plain form + から"` — English words mixed with the kana.
`scripts/levelling.mjs`'s `grammarSurface` rejects any pattern string containing a Latin letter or
digit outright (`/[A-Za-z0-9０-９／・+…]/.test(pattern)` → `null`, untaggable). That was a free pass
for Book Two, which the reading pipeline never touches. **It is not a free pass here**: this band's
whole second half (§6) depends on these six patterns being taggable. Fortunately all six patterns
in this band are, in their own right, short fixed strings with no attachment-table placeholder
needed inside the `pattern:` field itself — unlike から, `のに` *is* the searchable literal. The
fix is just discipline: every `pattern:` field in `src/content/grammar/b3-02-*.yaml` must be the
bare Japanese literal (`～のに`, `～くせに`, `～ものの`, `～とはいえ`, `～にもかかわらず`, `～ながらも`), and
the attachment-table explanation belongs in `gloss:` and the grammarNote, never in `pattern:`.
This is cheap to get right up front and expensive to discover after six lessons ship untaggable —
flagging, and fixing it in the spec rather than after the fact.

### 7.2 `Phrase` has no field to carry a Tatoeba id, and this band cannot ship without one

`src/types.ts`'s `Word` type has `example?: WordExample`, and `WordExample.tatoebaId` is
`required` — the type comment says outright "an example without a source id cannot be checked."
`Phrase`, the type every lesson in this band actually uses for its exercises, has no equivalent
field at all — no `tatoebaId`, nothing beyond a free-text `notes?: string` that nothing validates.
Book One and Two never needed one, because their content was training-canonical-then-verified, not
sourced-at-authoring. **This band's entire content model — "every sentence must come from Tatoeba
with its id, or it does not ship" — has nowhere in the schema to put that id.** Today the only
place it would live is a commit message, which CLAUDE.md already requires but which is not
queryable, not validated at load time, and not what the gate-text mechanism in §6 can key off of.
This is a small, mechanical fix (a `tatoebaId` field on `Phrase`, mirroring `WordExample`, ideally
required for anything with `jlpt` at N3+) — but it is a prerequisite for authoring this band's
YAML honestly, not a nice-to-have, and I'd rather it land before the first `b3-02-*.yaml` commit
than be retrofitted after six lessons' worth of source ids are sitting only in git history.

### 7.3 The skeleton's seven-pattern list for this band was optimistic, and it says so itself

`book-three-bands.md` §3 already warns "expect this list to lose entries." This band is the
concrete case: two of the seven line items (ながらも as its own lesson, とはいえ at any real depth)
do not clear the bar the corpus can support, for reasons that have nothing to do with pedagogy and
everything to do with what 25,983 Tatoeba sentences happen to contain. That is not a defect in the
band — it is the mechanism working as designed, catching a padded count before it became six
lessons of author's own invented example sentences. Worth restating in the skeleton once bands 1,
3 and 4 report back: if this band lost 2 of 7 to attestation, the other bands should expect
similar shrinkage rather than treating 7 as a floor.

---

## 8. Authoring checklist

1. **Every phrase's source is a real Tatoeba id**, cited in the commit message per CLAUDE.md, and
   ideally in the data itself once §7.2's `tatoebaId` field lands. `scripts/vocab.mjs`'s
   `lookupFromDict` pattern (stream, don't load 128 MB into memory) is the right model for any
   further search; the ad hoc script used for §1's counts followed the same approach.
2. **Write `pattern:` fields as bare Japanese literals** (§7.1) — verify with
   `grammarSurface(pattern) !== null` before committing, not after.
3. **Curate, don't auto-accept, any のに/ものの/とはいえ candidate** — all three have a same-string,
   different-construction collision (§2, §4 lessons 4 and 5) that literal surface matching cannot
   see through.
4. **Re-surface `grammar.b2-join-nagara`** in the SRS queue immediately before lesson 3 — a hard
   dependency, not a soft one (§4, lesson 3).
5. **No dialogue, no composed connective tissue between quoted sentences.** Every phrase is one
   verbatim Tatoeba sentence; nothing here should ever look like an author bridged two real
   sentences with an invented one.
6. **Run `pnpm ladder`** once this content lands — any change under `src/content/` must regenerate
   `docs/book-three-ladder.md` (or whichever doc `scripts/ladder.mjs`'s `BOOKS` table names once
   Book Three gets an entry there; it does not have one yet, and that is a prerequisite for this
   band shipping at all, not just for the ladder doc — `pnpm test` fails on a stale ladder, and
   ladder generation throws for an unregistered book prefix).
7. **Run `pnpm walkthrough`** before merge, same as every content change that adds or renumbers
   lessons — though note its own caveat: it walks as a guest, reaching only Book One, so it cannot
   verify this band directly. That gap is `walkthrough_tooling` memory's problem, not this band's,
   but it means this content needs a signed-in manual pass, not just a green walkthrough.
