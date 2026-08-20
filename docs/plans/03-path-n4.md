# Book Two — the bridge

**Tier:** Free account. **Status: not started.** No content exists; `grep "jlpt: N4" src/content/`
returns nothing.

**Goal:** the learner moves from survival phrases to **building their own sentences** — combining
grammar patterns, a working kanji habit, and the vocabulary to say things Book One never covered.
Book Two is the **bridge**: where recognition becomes production and the learner stops reciting and
starts composing.

Same engine as [Book One](02-path-n5.md); this doc covers only what **shifts**, plus the two pieces
of groundwork that must land before any content is authored.

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

**(b) The per-book difficulty shift does not exist.** Everything in §1 below — recall as the
default, weaning off romaji, production-first formats — describes behaviour no code implements.
Every card renders the same way at every level today. Decide whether the shift is a property of the
Book (a field), of the lesson, or of the learner's progress, and build it once.

Neither is large. Both are much larger after content exists.

## 1. What changes from Book One

| Dimension | Book One | **Book Two** |
|---|---|---|
| Default item gate | sits in Recognize longer | **Recall is the default**; Produce comes faster |
| Grammar | one pattern, one shape | **pattern combining** — plain form, から/ので, conditionals |
| Kanji | introduced per lesson, flat | components become **load-bearing**; parts recombine |
| Reading | phrases only | **short graded passages**, the first real Tadoku taste |
| Output beat | type the phrase | **compose a sentence** from a pattern + chosen vocabulary |
| Romaji | shown | **weaned off** — kana and furigana only |

The through-line is **recombination**. Book Two items are deliberately built from Book One
components — kanji radicals reused, particles recombined — so review naturally mixes old and new,
which is the discrimination practice the research calls for.

## 2. Chapter shape — expect more rule chapters

Book One ended up with two chapter shapes: *situation* chapters organised around a place, and
*rule* chapters organised around a piece of grammar. Book One is mostly situations because a
beginner needs somewhere to stand. **Book Two should invert that ratio.**

The reason is measurable. Only 39 of Book One's 76 teaching lessons carry a grammar pattern,
because situation chapters are word-shaped and add vocabulary without adding rules. Book Two's
whole purpose is combining patterns, so a book of situation chapters would miss its own goal.

The te-form and past-tense chapters are the working template: take one rule, split it by what the
learner can *say* rather than by grammatical category, and bring fresh verbs that exercise each
row. Both paid a retroactive debt for phrases the ladder was already carrying blind, and Book Two
starts with the same debt — plain form in particular. Every verb card in Book One already shows a
dictionary form (食べる, 待つ), so the learner has been reading plain form since the first lesson
and has never been told it is a form, what its negative and past look like, or that it is what
sits in front of half of Book Two's patterns.

Candidate rule chapters, in rough dependency order:

1. **Plain form** — the dictionary/ない/た forms, the precondition for most of what follows
2. **Joining sentences** — から, ので, けど, and て as a connector rather than a request
3. **Wanting and intending** — 〜たい beyond the one pattern Book One has, 〜つもり, 〜ましょう
4. **Being able to** — 〜ことができる, potential forms
5. **Reported and quoted speech** — 〜と言いました, 〜と思います
6. **Conditionals** — たら, ば, and when each is wrong
7. **Giving and receiving** — あげる/くれる/もらう, the thing every course puts too late

Situation chapters still belong, and should follow the Book One rule: check what is already taught
before authoring, or a chapter shrinks from "adjectives" to "the body and the pairs" the hard way.

## 3. Checkpoints

Unchanged in kind (DR-021): recognition checkpoints close chapters at situation boundaries on a
~10-lesson cadence; one production checkpoint closes the book. What shifts is the **format inside
them** — Book Two's recognition pass should lean on recall rather than tile-tap, and its production
checkpoint should ask for a composed sentence rather than a remembered phrase.

Mastery gates, never grades (DR-020). That does not relax at any level.

## 4. Kanji — where the method compounds

This is where a component layer pays for itself. Book Two's kanji load is unmanageable as flat
shapes and tractable as **recombined parts**: new kanji are introduced as "you already know these
pieces", which reinforces the system and makes each new kanji cheaper than the last.

The component layer does not exist yet and is listed as Book One's main gap for this reason — it
should be built during Book One's finish, not scrambled for here.

## 5. Content sourcing

Book Two words are marked `content-source: training` and verified headword-by-headword against
JMdict for Applications 3.6.2, exactly as Book One's are. The community reference is a gap-finder,
never an authority.

`node scripts/jlpt.mjs coverage n4` works today — the tooling is level-agnostic. The N4 reference
holds 770 words, 545 attested by both source lists. That is the authoring queue, not the syllabus.

**Sentences remain the constraint.** JMdict cannot verify a composed sentence; only fixed
expressions are headwords. `scripts/jlpt.mjs sentences` finds Tatoeba candidates whose every word
is already taught, and Book One's experience is that it yields few enough to be a *checking* tool
rather than a supply. Book Two sentences follow the same sanctioned path: training-canonical,
marked, pending verification.

## 6. Production practice — no Hana (DR-023)

The previous version of this doc built its entire output story on Hana: 8–12 turn conversations,
learner-initiated, with re-modelling correction. **Hana is shelved**, switched off behind
`VITE_HANA_ENABLED`, and this book must not be planned around that decision reversing.

The replacement is the same one Book One uses, scaled up. Where Book One's production checkpoint
asks the learner to write a remembered phrase from its English, Book Two's asks them to **compose**:
here is a pattern and a situation, write a sentence. That is a harder test than a steerable
conversation, needs no API, and is the actual stated goal of the book.

If Hana is ever switched back on, that is an *addition* to this, not the foundation of it.

## 7. Free/paid

Free, with an account. Book Two is the **last free book**; finishing it is the natural moment to
introduce Book Three. The learner has by then used the full method for weeks and built real
ability, which is the honest case for paying.

## 8. Build order

1. Finish Book One (food chapter, people & clothes chapter)
2. Kanji component + mnemonic layer
3. Multi-book support (§0a) and the difficulty shift (§0b)
4. Author Book Two chapters, rule chapters first
5. Graded reading passages, once there is enough vocabulary for i+1 to mean anything
