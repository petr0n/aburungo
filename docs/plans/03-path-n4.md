# Book Two — the bridge

**Tier:** Free account. **Status: not started.** No content exists; `grep "jlpt: N4" src/content/`
returns nothing.

**Goal:** the learner moves from survival phrases to **building their own sentences** — combining
grammar patterns, a working kanji habit, and the vocabulary to say things Book One never covered.
Book Two is the **bridge**: where recognition becomes production and the learner stops reciting and
starts composing.

Same engine as [Book One](02-path-n5.md); this doc covers only what **shifts**, plus the two pieces
of groundwork that must land before any content is authored. Naming per DR-024: internally this is
the N4 book, and a learner never reads that — the `jlpt` field lives only in the data.

---

## 0. Groundwork first — two things block this book

**(a) The app knows only one book.** `n5Lessons` is a hardcoded export in
[src/content/lessons/index.ts](../../src/content/lessons/index.ts), referenced in eight places in
[LearnPage.tsx](../../src/pages/LearnPage.tsx). There is no concept of "the book you are in", no
book-to-book transition, and no per-book gating. Authoring Book Two content first and generalising
afterwards means retrofitting two books instead of one — the same mistake as retrofitting chapters
into a ladder that already had 64 lessons.

What is needed is small: make the book a parameter rather than an import, give `Book` an id, order,
title and chapter list, and let the orchestrator take one. `placeInChapter` and the chapter helpers
are already pure functions taking lessons and chapters as arguments, so they generalise for free.

**(b) The per-book difficulty shift does not exist.** Everything in §2 below — recall as the
default, the romaji cut, production-first formats — describes behaviour no code implements.
Every card renders the same way at every level today. The open decision is whether the shift is a
property of the Book (a field), of the lesson, or of the learner's progress. **Recommended: a Book
field.** The shift is this book's premise, not a per-lesson nuance; a per-learner override can be
added later if testing demands one, and a field is the cheapest thing that can ship.

Neither is large. Both are much larger after content exists.

## 1. The starting point — what a Book One graduate actually knows

The authority is the generated [docs/book-one-ladder.md](../book-one-ladder.md), which moves as
Book One finishes; the numbers below are dated, not promised. **As of 2026-08-20:** 423 words
(finishing toward ~800 against the reference gap), 163 kanji, 39 grammar patterns, and kana
fluency guaranteed by the mini-ladder that gates the book.

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
| Reading | phrases only | **short graded passages**, the first real Tadoku taste (§7) |
| Output beat | type the phrase | **frame-based composition** — a pattern plus chosen words (§8) |
| Romaji | shown | **cut at the book boundary** — kana and furigana only (§6) |

The through-line is **recombination**. Book Two items are deliberately built from Book One
components — kanji parts reused, patterns stacked, verbs the learner already owns conjugated into
forms they don't — so review naturally mixes old and new, which is the discrimination practice the
research calls for.

## 3. Scope — the conventional N4 line

- **Words:** the N4 community reference holds 770 words, 545 attested by both source lists — the
  authoring queue, not the syllabus (`node scripts/jlpt.mjs coverage n4` works today; the tooling
  is level-agnostic). On top of a finished Book One that lands cumulative vocabulary near the
  conventional **~1,500-word** N4 line. A landing zone, not a quota.
- **Kanji:** the conventional cumulative line is **~300**; Book One ships 163, so Book Two carries
  roughly 140 new. At Book One's measured 2.3 kanji per teaching lesson, ~100 lessons hold that
  with room to spare — the constraint is component and mnemonic quality (§5), never count.
- **Grammar:** the N4 core — the plain-form family and its payoff patterns, sentence connectors,
  giving and receiving, wanting and intending, potential, quoted speech, conditionals. §4 maps it
  onto chapters and names what is left over, so anything cut is cut consciously.

## 4. Chapters — rule chapters first, and the ~10×10 shape

Book One ended up with two chapter shapes: *situation* chapters organised around a place, and
*rule* chapters organised around a piece of grammar. Book One is mostly situations because a
beginner needs somewhere to stand. **Book Two inverts the ratio.**

The reason is measurable. Only 39 of Book One's 76 teaching lessons carry a grammar pattern,
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
| 4 | Situation A | situation | candidate: **feeling ill & the doctor** — builds on Book One's body-and-pain lessons |
| 5 | Wanting & intending | rule | 〜たい beyond Book One's one pattern, 〜がほしい, 〜つもり, 〜ましょう／〜ませんか |
| 6 | Being able to | rule | potential forms, 〜ことができる; 〜やすい／〜にくい |
| 7 | Reported & quoted speech | rule | 〜と言っていました, 〜と思います — plain form's biggest payoff |
| 8 | Situation B | situation | candidate: **making plans with friends** — invitations exercise chapter 5 |
| 9 | Conditionals | rule | たら, ば, と — and when each is wrong |
| 10 | Situation C | situation | candidate: **trouble — lost, forgotten, broken** — builds on 無くす／困る from Book One; closes into the production checkpoint |

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
te-form territory, and situation lessons can carry patterns exactly as Book One's do. Passive and
causative are the heavy pair and need an owner call (§11).

Situation chapters still follow the Book One rule: check what is already taught before authoring,
or a chapter shrinks from "adjectives" to "the body and the pairs" the hard way. The candidates
above are candidates, pending that check.

## 5. Kanji — where the method compounds

This is where a component layer pays for itself. Book Two's ~140 new kanji are unmanageable as
flat shapes and tractable as **recombined parts**: new kanji are introduced as "you already know
these pieces", which reinforces the system and makes each new kanji cheaper than the last.

The component layer does not exist yet and is listed as Book One's main gap for this reason — it
should be built during Book One's finish, not scrambled for here.

## 6. Romaji ends here

Book One shows romaji on word cards and its production checkpoint counts romaji answers. Book Two
removes the crutch at the book boundary:

- **Display: none.** No Book Two item ever renders romaji, and Book One items reviewed inside
  Book Two drop theirs. Kana with furigana everywhere, per the furigana principle. The kana
  mini-ladder is a hard prerequisite of Book One, so every Book Two learner already reads kana —
  the crutch is removable by construction, and removing it is the point: every romaji glance is a
  kana rep not taken.
- **Input: romaji survives as a typing method only.** Typing "mizu" to produce みず is an IME, not
  reading; answer fields keep romaji→kana conversion indefinitely. What the learner reads, and
  what is checked, is kana. Book One's "kana or romaji both count" checkpoint note is a Book One
  accommodation and does not carry over.
- **A hard cut, not a taper** — recommended. It is the cheapest build (one consequence of the
  Book-level shift, §0b) and the kana prerequisite makes a taper pointless. If testing shows real
  distress, the fallback is a per-learner "show romaji" override, off by default — not a schedule.

## 7. First graded passages

The first real Tadoku taste, and deliberately a *shape*, not a library — the levelled library and
mining are Book Three builds.

- **Shape:** a handful of linked sentences at ~98% known items — the unassisted-flow threshold
  (Hu & Nation; see [04 §5](04-path-n3.md)), cheap to hit here since passages are authored against
  the ladder — read for flow, no dictionary, no questions after. Read, not SRS'd.
- **When:** from roughly chapter 4 on — a passage is pointless before joining-sentences exists,
  because a passage of single-clause sentences is just phrases stacked. One short passage near
  each chapter close from there.
- **Levelling:** by construction, not by pipeline — author each passage against the ladder so it
  uses only items taught by that point. That is what makes i+1 mean something here; the Tatoeba
  i+1 pipeline stays a Book Three build.
- **Sourcing:** as §9 — training-canonical, marked, pending verification, with
  `scripts/jlpt.mjs sentences` as the checking tool for what Tatoeba can attest.

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
nothing is recorded, misses rejoin the SRS queue. "Recalled", never "correct". That does not relax
at any level.

## 11. Open questions for the owner

1. **Situation chapters:** which three? Candidates in §4 (doctor, making plans, trouble); others
   that fit the brand: phone & messages, post office and bank errands.
2. **Passive and causative:** conventionally N4, and the heaviest leftovers. Late Book Two rule
   chapter (displacing a situation chapter), or first rule band of Book Three?
3. **Graded passages sourcing comfort:** Q3 sanctions training-canonical short readings at this
   level, but a multi-sentence passage is a bigger authored surface than a phrase. Comfortable, or
   should passages wait for the Tatoeba pipeline to be pulled earlier?

## 12. Build order

1. Finish Book One (people & clothes chapter; food shipped as Chapter 11, DR-032)
2. Kanji component + mnemonic layer
3. Multi-book support (§0a) and the Book-level difficulty shift (§0b) — recall default, romaji
   cut, frame-based produce beat
4. Author Book Two chapters, rule chapters first, in skeleton order (§4) — plain form before
   anything that stands on it
5. Graded passages from mid-book on, once joining-sentences has shipped and vocabulary is deep
   enough for i+1 to mean anything
