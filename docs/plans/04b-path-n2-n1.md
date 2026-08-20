# Books Four and Five — the long tail

**Tier:** Paid. **Status: not started.**

**Goal:** extend the reading, mining and production machinery of [Book Three](04-path-n3.md) with
harder and broader content, plus the register and nuance grammar that separates "can read the
news" from "can read a novel".

These are the books a reference would call N2 and N1. Per DR-024 the learner never reads either
label — they read **Book Four** and **Book Five**; the `jlpt` field lives only in the data.

**Sizing (owner directive, 2026-08-20):** each book targets ~10 chapters of ~10 lessons — a ~100
teaching-lesson skeleton, same landing zone as every other book. This doc therefore gives each book
its own section and a chapter-band skeleton at that size. It stops there on purpose: the bands are
themes and registers, not situations or lesson lists: the band model is now locked
([04 §3](04-path-n3.md), signed off 2026-08-20), but the levelling pipeline's behaviour on real
learners is the input the real plans need. Detail below band level written now would be fiction.

**What ~100 lessons can and cannot carry:** the lesson skeleton holds grammar, register and kanji
teaching. It cannot hold the vocabulary — the gap is roughly 2,300 words from Book Three to Four
and another 4,000 to Five, and that volume comes from **mining in the reading library**, not from
lessons. The skeleton is the taught spine; the library is the bulk.

---

## 1. Why these two still share a doc

Books Four and Five differ in **content difficulty, register, and volume — not in method**. Both
are: read widely at your level, mine what you do not know, produce about what you read, review on a
cumulative interleaved schedule. That is Book Three's machine, fed harder texts.

They share a doc until the real Book Four plan is written (§7). Two full design docs now would be
two copies of the same document with different numbers in the table.

## 2. What actually changes

Cumulative scope, from the standard reference estimates (gap-finders, never authorities — no
official JLPT lists have existed since 2010):

| Dimension | Book Three | **Book Four** | **Book Five** |
|---|---|---|---|
| Words (cumulative) | ~3,700 | **~6,000** | **~10,000+** |
| Kanji (cumulative) | ~650 | **~1,000** | **~2,000 (full Joyo); readings over shapes** |
| Text source | levelled corpus, assembled | **native exposition, selected** — news, articles | **native literary and specialist** — fiction, editorial, formal documents |
| Grammar | connective and discourse | **formal-written register + keigo, produced** | **literary and archaic register, mostly recognised** |
| Reading goal | comprehension with flow | **speed over exposition** | **stamina over long texts; style and implication** |
| Output | compose-then-compare on readings | **formal register production** — requests, opinion prose | **register calibration** — writing that signals the intended formality |

**The register shift is the real content, and it splits cleanly between the books.** Book Four
grammar is still *functional*: patterns that do a job in a sentence (formal connectives, keigo,
stance and hedging), and the learner must produce them. Book Five grammar is largely *register*:
literary and classical-remnant forms met in print far more often than spoken — the difference
between 〜んじゃないか and 〜のではないでしょうか is social, not semantic. Recognition-first is
the correct pedagogy there, not a compromise. This is the hardest thing to teach and the least
served by existing tools — the same argument that makes Book Three the flagship.

## 3. Book Four — chapter bands (provisional)

Bands, not commitments; Book Three's pipeline meeting real learners will reshape these. Checkpoints stay on the DR-021
cadence at band boundaries, using Book Three's gate: *read something you could not read at the
start of this band*. Gates, never grades (DR-020). One production checkpoint closes the book.

1. **From spoken to written** — the だ/である line, nominalisation, the register of exposition
2. **Formal connectives** — how written argument hangs together
3. **Keigo in production** — honorific and humble forms the learner must use, not just parse
4. **News reading** — articles and reportage; the band where the library goes native
5. **Stance and hedging** — asserting, qualifying and denying politely
6. **Obligation and concession** — the formal pattern families of duty, exception, contrast
7. **Natural spoken register** — contractions, sentence-final nuance, what a form signals
8. **Exposition at length** — essays and columns; stamina over multi-page argument
9. **Kanji to ~1,000** — completing the common-use set; compound readings
10. **Formal written production** — requests, apologies, opinion paragraphs, compose-then-compare

## 4. Book Five — chapter bands (provisional)

Same caveats and checkpoint shape as Book Four.

1. **Literary and archaic register** — classical remnants met in print, recognised not produced
2. **Editorial and critique** — following and weighing an argued position
3. **Fiction** — narrative style, dialogue in print, spoken colour rendered in text
4. **Idiom** — set phrases, proverbs, four-character compounds
5. **Near-synonym discrimination** — the nuance between words a dictionary calls equivalent
6. **Ceremonial and business formality** — set formulae, the highest keigo, formal letters
7. **The kanji long tail** — full Joyo; rare readings of shapes already known
8. **Abstract and specialist prose** — academic and technical register
9. **Speed and stamina** — full-length texts, read for pleasure
10. **Register calibration in production** — choosing the form that signals the right formality

**Corpus risk worth naming now:** Tatoeba skews conversational. Literary and formal-written
sentences at this level may be too thin in it to feed the library. Aozora Bunko (public-domain
Japanese literature) is the obvious verified corpus for Book Five reading — a **new content
source**, so it needs owner sign-off and a data-sources entry before anything is built on it.

## 5. What must not change

- **No gamification, at any level.** The temptation grows as content thins and engagement mechanics
  look like the answer. They are not.
- **Mastery gates, never grades** (DR-020). A shrinking set of work left, not a verdict.
- **Verified content only** (from Book Three onward). No training-canonical sentences.
- **The SRS interface stays swappable** — `Scheduler` in `src/types.ts`, `now` always injected.
- **Checkpoints stay on a cadence** at meaningful boundaries, whatever a boundary means by then.
- **No Hana dependency** (DR-023). Production runs through production checkpoints and
  compose-then-compare; nothing here assumes conversation comes back.

## 6. Listening — a floor now, a ceiling named

Listening finally gets a home, in two honest halves.

**The floor lives inside these books and costs almost no new engine.** Every verified sentence and
passage can carry pre-generated VOICEVOX audio (already planned), and Tatoeba's native-speaker
recordings cover a subset with real human speech. That enables listen-first formats on the existing
machinery: audio played *before* text in review, audio fill-in-the-blank (already on the roadmap),
dictation-style cloze, and a listen-then-read mode in the reading library. At Book Four, exposition
passages heard at natural speed before reading them is genuine listening practice. These are lesson
and review *formats*, not a separate track.

**The ceiling is real and stays flagged.** TTS over written sentences is scripted, single-speaker,
clean audio. Comprehending unscripted, multi-speaker, natural-speed speech — the skill that most
separates a Book Five learner from someone who can live in Japanese — cannot be assembled from a
sentence corpus, and DR-023 removes the interactive path. If listening ever becomes a book, it will
be the one that genuinely needs its own design doc, its own content pipeline (licensed real audio),
and possibly its own engine. It does not need solving now. It needs to not be forgotten.

## 7. When to write the real plan

When Book Three ships and its reading library has real usage. Not before. The levelling pipeline's
behaviour on real learners is the input that makes a Book Four plan worth more than a guess. That
is also the moment to split this doc — a full Book Four plan while Book Five stays thin — not
before.
