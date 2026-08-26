# Book Two — the bridge

**Tier:** Free account. **Status: not started.** No content exists; `grep "jlpt: N4" src/content/`
returns nothing.

**Goal:** the learner moves from survival phrases to **building their own sentences** — combining
grammar patterns, a working kanji habit, and the vocabulary to say things Book One never covered.
Book Two is the **bridge**: where recognition becomes production and the learner stops reciting and
starts composing.

Same engine as [Book One](02-book-one.md); this doc covers only what **shifts**, plus the two pieces
of groundwork that must land before any content is authored.

**This is not "the N4 book" (DR-033).** Book Two is a volume of about ten chapters and a hundred
teaching lessons, landing near 570 words — a shape, not a level. The N4 reference is a gap-finder
for the authoring queue and gates nothing. The `jlpt` field stays in the data as word metadata, the
learner never reads a level, and the course as a whole runs to roughly N2 (DR-034).

---

## 0. Groundwork — built, except the produce beat (PR #90)

Both blockers this section originally described are resolved; what is left is content-shaped, not
engine-shaped.

**(a) The book is a parameter — done.** `Book` carries id, `progressKey`, order, title, chapters,
lessons and `stage`; `bookOne` lives in [src/content/books.ts](../../src/content/books.ts) and the daily-loop
orchestrator takes a book rather than importing `n5Lessons`. Adding Book Two is a new `Book`
instance plus its content, not a refactor. Review eligibility deliberately spans **every book the
learner has worked through** while new material stays scoped to the current one — otherwise Book
One's items would go silent the day this book opened, which is the opposite of what §2 wants.

**`progressKey` is not `id` (DR-033).** Book One's id is `book-1` and its progress key is the legacy
`"n5"` — the primary key of every PathProgress row, in Dexie and on the server. Book Two picks its
own key once and freezes it. Passing `book.id` where a progress key belongs typechecks, passes every
test, and orphans learner progress on deploy.

**(b) The difficulty shift is the `stage` field — two of three behaviours built.** Book One is
`foundation`; Book Two is the first `building` book, and `stage` is what carries the shift now that
a boolean could not hold a third behaviour (DR-033). Recall as the default review gate and the
romaji display cut both work, and are provable against Book One content today via a dev-only
`?shift=1`. Romaji→kana *input* conversion is untouched, per §6.

**What is not built: the production-first produce beat.** Frame-based composition needs frames and
their model sentences as **authored content**, which §8 has always said. An attempt to derive them
at runtime failed twice over: kana has no word boundaries, so matching a word inside a phrase's
reading split words in half (き lifted out of the middle of きれい), and offering same-word-type
substitutes synthesised sentences nobody verified — the fabricated-Japanese rule. The lesson is
that this beat is gated on authoring, not on engineering: **author the frames alongside the
chapters** (§4) rather than expecting the engine to produce them.

## 1. The starting point — what a Book One graduate actually knows

The authority is the generated [docs/book-one-ladder.md](../book-one-ladder.md). **Book One is
finished as of 2026-08-24:** 12 chapters, 100 lessons (87 teaching, 13 checkpoints), **484 words,
227 phrases, 44 grammar patterns, 200 kanji** across 22 situations. Kana reading is built by
exposure — every ladder word shows kana — though **no kana gate exists**: kana practice is a
standalone free track and romaji rides along as Book One's crutch (§6 is where that ends).

The 484 words touch 457 of the N5 reference's 809. The remainder is not a debt (DR-033):
those words are Book Two's raw material where a situation calls for them, and nobody's problem where
it does not.

Grammar actually in hand: です and its questions, ます／ました／ませんでした, でした and
〜かったです, 〜てください with the verb groups sorted, 〜ています, 〜てもいいですか, one 〜たい
pattern, 好き／きらい, counters, dates and relative time.

Two things matter for sequencing:

- **Seen but never taught:** every verb card in Book One shows a dictionary form (食べる, 待つ),
  so the learner has been reading plain form since the first lesson and has never been told it is
  a form, what its negative and past look like, or that it sits in front of half of Book Two's
  patterns. That is the retroactive debt the plain-form chapter pays — the same debt the te-form
  and past-tense chapters paid in Book One.
- **Must not be assumed:** ない and た as forms, potential, any particle beyond the ones Book One's
  phrases carry in fixed uses. Particles were never taught as a system; Book Two teaches each one
  as a pattern needs it, never as a table.

## 2. What changes from Book One

| Dimension | Book One | **Book Two** |
|---|---|---|
| Default item gate | sits in Recognize longer | **Recall is the default**; Produce comes faster |
| Grammar | one pattern, one shape | **pattern combining** — plain form, から/ので, conditionals |
| Kanji | introduced per lesson, flat | components become **load-bearing**; parts recombine |
| Reading | phrases only | **themed sets of cited sentences** at ~98% coverage (§7) |
| Output beat | type the phrase | **frame-based composition** — a pattern plus chosen words (§8) |
| Romaji | shown | **cut at the book boundary** — kana and furigana only (§6) |

The through-line is **recombination**. Book Two items are deliberately built from Book One
components — kanji parts reused, patterns stacked, verbs the learner already owns conjugated into
forms they don't — so review naturally mixes old and new, which is the discrimination practice the
research calls for.

## 3. Scope — the volume, measured against the reference

The size comes from the shape, not from a level (DR-033): ~10 chapters, ~100 teaching lessons,
**near 570 words** at Book One's measured 5.7 words per teaching lesson. The reference numbers below
say where that lands a learner; they do not set the target.

- **Words:** ~570 new, taking cumulative vocabulary to **roughly 1,050**. The N4 community reference
  holds 770 words, 545 attested by both source lists — an authoring queue to draw from, never a
  syllabus to exhaust (`node scripts/jlpt.mjs coverage n4` works today; the tooling is
  level-agnostic). Book Two will not clear it, and does not need to.
- **Kanji:** Book One ships 200 at a measured 2.3 per teaching lesson, so ~100 lessons hold **roughly
  200 more** without straining — putting cumulative kanji near 400, past the conventional ~300 line.
  The real constraint is component and mnemonic quality (§5), never count; author to what the
  components support and let the total fall where it falls.
- **Grammar:** the N4 core — the plain-form family and its payoff patterns, sentence connectors,
  giving and receiving, wanting and intending, potential, quoted speech, conditionals. §4 maps it
  onto chapters and names what is left over, so anything cut is cut consciously.

## 4. Chapters — rule chapters first, and the ~10×10 shape

Book One ended up with two chapter shapes: *situation* chapters organised around a place, and
*rule* chapters organised around a piece of grammar. Book One is mostly situations because a
beginner needs somewhere to stand. **Book Two inverts the ratio.**

The reason is measurable. Only 44 of Book One's 87 teaching lessons carry a grammar pattern,
because situation chapters are word-shaped and add vocabulary without adding rules. Book Two's
whole purpose is combining patterns, so a book of situation chapters would miss its own goal.

The te-form and past-tense chapters are the working template: take one rule, split it across a
chapter by what the learner can *say* rather than by grammatical category, and bring fresh verbs
that exercise each row. Scaled to the target shape — **~10 chapters of ~10 lessons, ~100 teaching
lessons** — that gives a rule chapter room for a form and its payoff patterns, not just the form.

### Working skeleton

Dependency-ordered; each chapter closes in its own recognition checkpoint. Situation chapters are
deliberately interleaved as word-shaped breathers that exercise the rule chapters before them —
that spacing is the consolidation, not a concession.

| # | Chapter | Shape | Carries |
|---|---|---|---|
| 1 | Plain form | rule | dictionary／ない／た／なかった as forms; だ; the payoffs needing nothing else — 〜たことがある, 〜たり〜たり, 〜ないでください. Reuses Book One's te-form verb groups |
| 2 | Giving & receiving | rule | あげる／くれる／もらう, then 〜てあげる／〜てくれる／〜てもらう |
| 3 | Joining sentences | rule | から, ので, けど, て as a connector; 〜ながら, 〜とき. The first multi-clause sentences |
| 4 | **Feeling ill & the doctor** | situation | Book One teaches 痛い and 頭; this adds 病気, お腹 and the symptom vocabulary. Explaining what hurts is the first thing that genuinely needs chapter 3's multi-clause sentences |
| 5 | Wanting & intending | rule | 〜たい beyond Book One's one pattern, 〜がほしい, 〜つもり, 〜ましょう／〜ませんか |
| 6 | Being able to | rule | potential forms, 〜ことができる; 〜やすい／〜にくい |
| 7 | Reported & quoted speech | rule | 〜と言っていました, 〜と思います — plain form's biggest payoff. Carries **passive as recognition only** (below) |
| 8 | **Making plans with friends** | situation | Book One teaches 友達 and 会う; this adds 約束 and the invitation register. Invitations exercise chapter 5's 〜ましょう／〜ませんか immediately |
| 9 | Conditionals | rule | たら, ば, と — and when each is wrong |
| 10 | **Trouble — lost, forgotten, broken** | situation | builds on 無くす／困る from Book One's home & work chapter. Trouble forces past tense plus a reason clause — the exact combination the book is built to produce; closes into the production checkpoint |

**Giving and receiving is pulled early on purpose.** An earlier draft of this doc called it "the
thing every course puts too late" and then listed it last — convention masquerading as dependency.
It needs only polite forms and the te-form, both in hand from Book One's first chapter onward, so
nothing blocks it and it unlocks the favour-asking register everything social sits on.

**Named leftovers** from the conventional N4 core, so cuts are conscious: **noun-modifying
clauses** (a plain-form clause in front of a noun — the biggest reading unlock on this list, and
implicit the moment 〜とき is taught), obligation and permission (〜なければならない,
〜なくてもいい, 〜てはいけない), advice (〜たほうがいい), the te-helpers (〜ておく, 〜てみる,
〜てしまう), passive, causative, appearance and hearsay (〜そう, 〜らしい), comparisons
(より／のほうが). Some fold into the skeleton at authoring time — noun modification belongs
inside or right after chapter 3, advice rides with conditionals, te-helpers extend chapter 2's
te-form territory, and situation lessons can carry patterns exactly as Book One's do.

**Passive and causative split** (decided 2026-08-24). Both are heavy, and Book Two already carries
seven rule chapters against three breathers. **Passive enters chapter 7 as recognition only** — read
it, never build it — hooked on 〜と言われています, which is the highest-frequency passive in written
Japanese and sits naturally beside 〜と言っていました. That is what stops §7's themed sets, and the
reading stage after them, landing on a learner who cannot parse a passive sentence. **Causative, and
production of both, open the next book.** Neither costs a chapter slot here.

Situation chapters still follow the Book One rule: check what is already taught before authoring,
or a chapter shrinks from "adjectives" to "the body and the pairs" the hard way. The three above
were checked against Book One's content on 2026-08-24 — every one has a footing in words already
taught, and the new vocabulary each brings is named in the table.

## 5. Kanji — where the method compounds

This is where a component layer pays for itself. Book Two's ~200 new kanji are unmanageable as
flat shapes and tractable as **recombined parts**: new kanji are introduced as "you already know
these pieces", which reinforces the system and makes each new kanji cheaper than the last.

The component layer does not exist yet. It was listed as Book One's main gap and Book One shipped
without it, so it is now **Book Two's first build** (§12) — 200 kanji already carry no
decomposition, and Book Two roughly doubles that.

## 6. Romaji ends here

Book One shows romaji on word cards and its production checkpoint counts romaji answers. Book Two
removes the crutch at the book boundary:

- **Display: none.** No Book Two item ever renders romaji, and Book One items reviewed inside
  Book Two drop theirs. Kana with furigana everywhere, per the furigana principle. A learner
  arriving here has read kana beside every word for ninety-plus lessons, and the standalone kana
  track covers remediation — the crutch is removable, and removing it is the point: every romaji
  glance is a kana rep not taken.
- **Input: romaji survives as a typing method only.** Typing "mizu" to produce みず is an IME, not
  reading; answer fields keep romaji→kana conversion indefinitely. What the learner reads, and
  what is checked, is kana. Book One's "kana or romaji both count" checkpoint note is a Book One
  accommodation and does not carry over.
- **A hard cut, not a taper** — recommended. It is the cheapest build (one consequence of the
  Book-level shift, §0b) and the kana prerequisite makes a taper pointless. If testing shows real
  distress, the fallback is a per-learner "show romaji" override, off by default — not a schedule.

## 7. Themed reading sets — not passages

**Decided 2026-08-24, and the name is the decision.** An earlier draft of this section asked for
"graded passages": a handful of *linked* sentences read for flow, the first real Tadoku taste. Book
Two cannot honestly ship that, and saying so is cheaper than pretending.

The reason is the corpus. The i+1 pipeline already exists —
[scripts/reading.mjs](../../scripts/reading.mjs), with a committed dev set in
`data/reading/micro-readings.json` — and its own header states the limit plainly: what it produces
are "thematic neighbours, **NOT** coherent texts", and the reader UI "must not dress these up as
stories." Verbatim Tatoeba sentences carry attribution and zero fabrication; what they cannot carry
is a through-line. The only way to get coherent prose at this level is to author it, and a
multi-sentence authored passage is the largest fabricated surface in the project — precisely what
CLAUDE.md's no-fabricated-sentences rule exists to prevent. The N5 phrase exemption does not reach
Book Two.

So Book Two ships what the corpus can attest, under its real name:

- **Shape:** a themed set of real, cited Tatoeba sentences at a shared coverage band — every one
  attributed by sentence id. Read for volume and recognition, no dictionary, no questions after.
  Read, not SRS'd. Presented as a set of related sentences, never as a story.
- **Band:** the unassisted-flow threshold is ~98% known items (Hu & Nation; see
  [04 §5](04-stage-reading.md)), which lands in the pipeline's `95` band (coverage in [0.95, 1)) and
  above. Book Two draws from `95` and `100`; the `90` band is mining material — one unknown token by
  design — and stays out.
- **When:** from roughly chapter 4 on, once joining-sentences exists — before that the eligible
  sentences are single-clause and the set is just phrases stacked. One set near each chapter close.
- **Yield is the open risk.** At Book One's 484 words the pipeline found 72 eligible sentences
  across the whole corpus, clustering into 11 sets. Book Two roughly doubles the taught inventory,
  which should raise that sharply — but it is a measurement, not a promise. Re-run
  `node scripts/reading.mjs tag` once chapter 3 ships and size the feature against the answer.
- **Sourcing:** verbatim and cited. No authored connectives, no bridging prose (both were
  considered and rejected — mixed-provenance text is the hardest kind to audit later).

**The first true extensive reading moves to the reading stage**, where licensed graded readers or
levelled Aozora texts are the source and the text-source decision in [04 §5](04-stage-reading.md)
lands. That is a real cost of this decision: a learner arrives there having read sets, not stories.

## 8. Production practice — no Hana (DR-023)

The previous version of this doc built its entire output story on Hana: 8–12 turn conversations,
learner-initiated, with re-modelling correction. **Hana is shelved**, switched off behind
`VITE_HANA_ENABLED`, and this book must not be planned around that decision reversing. If Hana is
ever switched back on, that is an *addition* to what follows, not the foundation of it.

The replacement is the same one Book One uses, scaled from recall to composition:

- **The per-lesson produce beat** becomes **frame-based composition**: the lesson's pattern as a
  frame with a slot or two, the learner chooses the vocabulary and types the sentence. Constrained
  composition is mechanically checkable — the frame plus the slotted word determines the expected
  sentence, conjugation included — so it needs no API and no judge. Free composition ("write
  anything about X") is not checkable without a grader and is deliberately deferred to Book
  Three's compose-then-compare.
- **The production checkpoint** closes the book, once, as in Book One — but where Book One asks
  for a remembered phrase from its English, Book Two asks the learner to **compose** from a
  pattern and a situation. A harder test than a steerable conversation, and the actual stated
  goal of the book.

Frames and their model sentences are authored content and follow §9 sourcing. Learner-typed output
is checked against them, never stored as content.

## 9. Content sourcing

Book Two words are marked `content-source: training` and verified headword-by-headword against
JMdict for Applications 3.6.2, exactly as Book One's are. The community reference is a gap-finder,
never an authority.

**Sentences remain the constraint.** JMdict cannot verify a composed sentence; only fixed
expressions are headwords. `scripts/jlpt.mjs sentences` finds Tatoeba candidates whose every word
is already taught, and Book One's experience is that it yields few enough to be a *checking* tool
rather than a supply. Book Two sentences — pattern examples, composition frames, and graded
passages alike — follow the same sanctioned path: training-canonical, marked, pending
verification. Verified-only content starts at Book Three.

## 10. Checkpoints

Unchanged in kind (DR-021): recognition checkpoints close chapters at situation boundaries, one
production checkpoint closes the book, and consolidation and completion stay separate things. At
the ~10-lesson chapter target the cadence and the chapter boundary coincide by construction. What
shifts is the **format inside them** — Book Two's recognition pass leans on recall (type the
reading or meaning) rather than tile-tap, and its production checkpoint asks for a composed
sentence rather than a remembered phrase (§8).

Mastery gates, never grades (DR-020): the remaining set shrinks to zero, retries are unlimited,
nothing is recorded, misses rejoin the SRS queue. A judged answer reads "Correct" or "Not quite"
(changed 2026-08-21, see CLAUDE.md); what stays banned is the aggregate verdict. That does not relax
at any level.

## 11. Owner decisions — all three settled 2026-08-24

1. **Situation chapters: doctor, making plans, trouble** — the three the skeleton drafted, now
   confirmed and detailed in §4. Errands (post office & bank) and phone & messages were the
   alternatives and were not taken; both remain available if a chapter has to be swapped during
   authoring.
2. **Passive rides into chapter 7 as recognition only; causative and production of both open the
   next book** (§4). Neither displaces a situation chapter, and the reading surface in §7 does not
   inherit a learner who cannot parse a passive.
3. **Book Two ships themed sets of cited Tatoeba sentences, not authored passages** (§7). The name
   changed with the decision. Authoring coherent prose, and a Tatoeba-plus-authored-bridges hybrid,
   were both considered and rejected — the first is the largest fabricated surface in the project,
   the second is the hardest to audit. First true extensive reading moves to the reading stage.

**Nothing is blocking authoring.** The remaining risk is the kanji component layer (§5, §12) and
the §7 yield measurement, both of which are build work rather than decisions.

## 12. Build order

1. ~~Finish Book One~~ — **done** (people & clothes shipped as Chapter 12, closing the book at 100
   lessons)
2. Kanji component + mnemonic layer — now the first build, and the largest single risk (§5)
3. ~~Multi-book support and the Book-level difficulty shift~~ — **done** (§0, PR #90), except the
   produce beat, which moves into step 4 because it is authoring work
4. Author Book Two chapters, rule chapters first, in skeleton order (§4) — plain form before
   anything that stands on it — **authoring each lesson's composition frame alongside it** (§0, §8)
5. Themed reading sets from mid-book on (§7), once joining-sentences has shipped. Re-run
   `node scripts/reading.mjs tag` at that point and size the feature against the measured yield
   rather than against the 11 sets Book One's inventory produced
