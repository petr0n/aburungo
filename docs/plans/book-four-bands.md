# Book Four — the bands

> **Delivery clarification (2026-09-06, DR-038):** content is authored first and inspected through
> the bookmap; teaching interfaces can follow. Complete the current book's agreed content before
> creating/writing the next book's content. References below to content “shipping” or being on
> `main` describe registration, not verified learner readiness. Record content scope, deferrals,
> and completion evidence separately from interface status in the
> [roadmap](99-roadmap.md#content-first-delivery-dr-038).

**Status: skeleton, written 2026-09-06 against Book Three as shipped.** Book Three is on `main`
at `1a35d54`: eleven chapters, 81 lessons, global orders 196–276. Per DR-034 books are specified
one ahead, each against the measured state of the one before it. This is that specification for
Book Four. It fixes the bands, the numbering, the stage, and one product decision (§2) that the
owner can veto; it does not compose a Japanese sentence and it does not fix lesson lists — those
are the band breakdowns' job (§7).

Source documents, in order of authority: `docs/plans/04b-stage-fluency.md` (the fluency-stage
skeleton this book is the first volume of), `docs/plans/04-stage-reading.md` §3 (the band model,
signed off 2026-08-20, unchanged here), `docs/plans/book-three-bands.md` (the shape this document
copies, including its two late additions §3a and §3d — a debt band that had to come first, and a
hole in earlier books that a later band filled). `04b` §7 said the real fluency plan should wait
for the reading library to meet real learners. The library does not exist (§1), so this plan is
written against the one measurement that does exist instead: what the app teaches versus the
reference lists, `pnpm jlpt:coverage n3`.

---

## 1. Where the learner actually is after Book Three

Three facts, all measured on 2026-09-06, and the third is the one this book is shaped around.

**Grammar: strong.** 175 patterns taught across Books One–Three (107 + 68). Book Three added the
passive and causative, the connective and stance grammar of N3, and the written register's core
(である, ゆえに, において, つつある). A learner finishing it can parse most N3 sentence shapes.

**Kanji: 229.** Book Three added ten. The N3 reference ceiling is roughly 650 cumulative.

**Vocabulary: 521 words in the whole app, 98 of them N3.** The N3 reference holds 2,347 words;
2,249 are untaught, of which **1,587 are common in JMdict and attested by both reference lists**.
Book Three added one word (ところ) on purpose: its model (`04` §3) says vocabulary at this stage
"cannot and must not" come from lessons and arrives instead by **mining the reading library**.
That library has no texts. The text source (`book-three-bands.md` §2) has been the open blocker
since 2026-08-20; the owner emailed NPO Tadoku Supporters on 2026-09-05 and the reply is pending.
So the mechanism Book Three delegated all vocabulary growth to has delivered nothing, and every
one of Book Three's 401 verbatim sentences carries words the learner was never taught — the
bands' own vocabulary headers say so.

This is not a defect in Book Three; it followed its plan. It is the fact Book Four cannot inherit.

## 2. The decision this document makes: lessons teach the words their sentences use

**Decision — confirmed by the owner on 2026-09-06 ("yes add new words"): every Book Four lesson
teaches the untaught words its own verified sentences contain.**

The mechanics already exist. A lesson has `wordIds`; a `Word` is a JMdict-verified headword with
reading and gloss (`content-source: training` on the gloss, as Books One and Two do); the produce
step and the SRS already handle words. What changes is only the *source* of the word list: not a
curated situation list (Books One–Two), not a library that does not exist (Book Three), but the
sentences the lesson is already quoting. A Tatoeba sentence chosen for its grammar carries three
to six words above the learner's set. Those become the lesson's words.

Why this and not the alternatives:

| Option | What it delivers | Cost |
|---|---|---|
| **(a) Grammar-only, as Book Three** | 0 words. The gap stays 2,249 with no mechanism. | Cheap. Dishonest: the book would quote 400 sentences the learner cannot read and call none of it teaching. |
| **(b) Vocabulary-led book, Book One shape** | ~570 words at 5.7/lesson. | Abandons the fluency grammar spine the learner needs next; a "word book" has no can-dos. |
| **(c) Hybrid — this decision** | ~5 words per teaching lesson × ~65 lessons ≈ **300–350 words**, all N3-common and all attested in the sentence the learner is already reading. | Authoring: each word JMdict-verified (headword, reading, sense). Wiring: the kanji pass grows, since words bring kanji (§6). Walkthrough: word cards lengthen each lesson. |

(c) also fixes the kanji count, which grammar-only bands cannot: words bring characters, and the
wiring pass places them. Expect **150–250 new kanji** over the book, against Book Three's ten.

**Prioritisation rule for a breakdown:** when a pattern has more attested sentences than a lesson
needs, prefer the sentence whose unknown words are in `data/jlpt/coverage-n3.json`'s
common-and-attested list. Do not choose a sentence *for* its words at the expense of its grammar;
the grammar is still the lesson.

**What this does to `04` §3.** It suspends one sentence of a signed-off plan — "for vocabulary it
cannot and must not" — for exactly as long as the library is blocked. When texts exist, the
library resumes carrying volume and lessons can drop back to a word or two. Nothing else in the
band model changes: a chapter is still a band, a lesson is still one pattern, checkpoints are still
shrinking-set gates.

## 3. What `04b`'s skeleton becomes after Book Three

`04b` §3 lists ten fluency bands. Three of them Book Three has largely taught, two depend on a
library that does not exist, one depends on an engine that does not exist, and none of them
covers the N4 debt found while auditing Book Three. Re-derived:

| `04b` band | State after Book Three | Book Four |
|---|---|---|
| 1 From spoken to written (だ/である, nominalisation) | Taught: である/であり/ではない (ch.11), こと/ところ/という/とは (ch.10) | Absorbed. The exposition-register remainder (のだ, ものだ) sits in bands 2 and 7 below. |
| 2 Formal connectives | Taught: ゆえに, において/における, にもかかわらず, によって | Remainder is band 8 (conjunctions) and band 6 (relation particles). |
| 3 Keigo in production | Untaught anywhere | Bands 4 and 5, two bands, humble before honorific. |
| 4 News reading | Library-dependent; corpus thin (恐れがある 0, と伝えられ 4, 見込み 7) | **Deferred** (§5). |
| 5 Stance and hedging | Taught: はず/わけ/みたい/らしい/っぽい/ようだ/に違いない/かもしれない (ch.6) | Remainder — だろう/でしょう, そうだ, のではないか, に過ぎない — is bands 2 and 7. |
| 6 Obligation and concession | Taught: chs. 3 and 9 | Remainder — からといって, といっても, にしては/にしても/としても, ことはない, までもない, ようがない — is band 7. |
| 7 Natural spoken register | Untaught anywhere | Band 3, and the contractions in band 0. |
| 8 Exposition at length | Library-dependent | **Deferred** (§5). |
| 9 Kanji to ~1,000 | 229 taught | Not a band. Arrives with words (§2) and the wiring pass. |
| 10 Formal written production | Engine-dependent: compose-then-compare is unbuilt, and `buildProductionQueue` has no schema slot for frames | **Deferred** (§5). |

And the debt, which `04b` could not see because it was found by Book Three's audits:

### 3a. Ten N4 forms taught nowhere

Checked on 2026-09-06 against every taught pattern string and every shipped phrase: **てしまう
(and ちゃう), ておく (とく), てみる, ていく/てくる, すぎる, the plain volitional (う/よう, ようと思う,
ようとする), the imperative and prohibitive (命令形, 〜な), そうだ (both jobs), んです/のだ, and
だろう/でしょう** appear in no pattern and in effectively no phrase. Book Three's bands 5 and 7
wrote around だろう by name; band 9's header flags 過ぎる as untaught in its own sentence. Every
one of them is among the densest forms in the corpus (§4). A learner who has finished Book Three
reads 〜にもかかわらず and cannot say "I forgot" with 忘れちゃった. These come first, as the passive
did in Book Three, and for the same reason: everything after them quotes them.

## 4. The bands

Attestation figures are **raw substring counts over the 25,983 unique corpus sentences, with the
count at ≤30 characters in parentheses** — ceilings, not yields. Book Three's breakdowns lost up
to half of a raw count to hand-classification (`book-three-band-05.md` §1), and §9 below lists
the false-positive classes this scan already tripped over. A planner re-derives every number.

Chapter numbers are the learner's; band numbers are internal (§6).

| Band | Chapter | Working title | Patterns (one lesson each unless noted) | Attestation, raw (≤30) |
|---|---|---|---|---|
| 0 | 1 | Finishing what was started | てしまう + ちゃう · ておく + とく · てみる · ていく · てくる · すぎる · 〜まま · 〜ずに/〜ないで | てしまっ 188 (131), ちゃった 32 (19), ておい 48 (38), てみ 115 (83), ていっ 55 (46), てきた 207 (166), すぎ 135 (112), ずに 69 (45), ないで 159 (121) |
| 1 | 2 | Meaning to, telling to | plain volitional う/よう · ようと思う · ようとする · 命令形 · 〜な (prohibitive) · 〜なさい · 〜たがる | しよう 134 (101), ようとし 65 (47), うと思 23 (13), なさい 343 (331), するな。 24 (22), たがっ 24 (19) |
| 2 | 3 | Why you're saying it | んです/のだ · だろう/でしょう · そうだ (hearsay) · そうだ (appearance) · のではないか/んじゃない · ものだ (exposition) | んだ。 380 (336), のです 316 (251), だろう 348 (260), でしょう 215 (163), そうだ 77 (59), そうな 26 (18), のではない 29 (19), ものだ 167 (134) |
| 3 | 4 | How people actually talk | じゃ/じゃない · sentence-final よ/ね/な/わ/ぞ · かな/かしら · っけ · なんて/なんか · とか · casual requests 〜て/〜てよ | じゃ 156 (85), のよ 279 (200), ぞ。 54 (46), かな。 23 (18), かしら 16 (13), っけ 13 (10), なんて 94 (63), とか 89 (47) |
| 4 | 5 | Speaking with care | ございます/でございます · いたす · 申す · 参る · おる · お/ご + noun · 〜ていただけますか · させていただく | ございます 22 (17), いたし 36 (28), 申し 71 (64, mostly 申し込み — screen), 参り 9 (7), いただけ 66 (50), させていただ 6 (5) |
| 5 | 6 | Raising the other person | いらっしゃる · おっしゃる · ご覧になる · 召し上がる · なさる · くださる · お〜になる · れる/られる as honorific (callback to Book Three ch.1) | いらっしゃ 15 (12), おっしゃ 6 (4), ご覧 7 (2), 召し上が 6 (5), なさ 378 (mostly なさい — screen), になり 110 (86, mostly plain になる — screen) |
| 6 | 7 | In relation to | に対して · にとって · として · につれて · とともに · を通して/を通じて · に加えて · こそ · に基づいて/によると | に対して 71 (50), にとって 68 (51), として 304 (216), につれて 16 (14), とともに 11 (7) + と共に 5, を通して 11 (9), に加えて 7 (5), こそ 42 (29), に基づ 11 (8), によると 8 + によれば 28 |
| 7 | 8 | Only so far, and no way round it | に過ぎない · ことはない · までもない · ようがない · わけにはいかない · からといって · といっても · にしては/にしても/としても · がち · 〜げ | にすぎない 18 (14) + に過ぎない 8, ことはない 26 (21), までもない 6 (4), ようがない 4 (3), わけにはいかない 7 (6), からといって 10 (4), といっても 8 (4), としても 16 (13), にしても 13 (7), がち 20 (17 — see §9), げに 19 (17) |
| 8 | 9 | Joining an argument | つまり/すなわち · したがって · ただし/なお · または/あるいは/それとも · しかも/さらに · むしろ · 一方 · 要するに | つまり 13 (6), したがって 11 (6), すなわち 7 (3), ただし 9 (3 — see §9), または 9 (6), それとも 11 (9), しかも 10 (7), さらに 28 (15), むしろ 15 (12), 一方 16 (8) |

**Shape as broken down (2026-09-06, `book-four-band-00.md` to `-08.md`):** 8 + 7 + 6 + 8 + 8 + 7 + 8 +
8 + 7 = **67 teaching lessons, plus nine recognition checkpoints = 76 lessons, global orders
277–352**, under Book Three's 81 and the ~100 landing zone (DR-033 shape directive: "about
learning, not strict 10×10"). Bands 7 and 8 merged their thin pairs, as this paragraph said they
might. The row table above keeps the pre-breakdown estimate; the breakdowns are the record.

**Vocabulary (§2):** at ~5 words per teaching lesson, ~350 words. **Kanji:** arrives with them.

## 5. Deferred, and what unblocks each

- **News and reportage** (`04b` band 4). Needs texts. The corpus is conversational: 恐れがある has
  zero sentences, と伝えられ four. Unblocked by the text source, or by a second verified corpus
  (Aozora is the wrong register; a news corpus would be a new data-sources entry needing owner
  sign-off).
- **Exposition at length** (`04b` band 8). Needs texts. Same blocker.
- **Formal written production** (`04b` band 10). Needs the compose-then-compare engine and a frame
  slot in the production checkpoint schema (`src/types.ts`, the gap Book Three's band 2 §7
  recorded). Engine work, not content.
- **Gate texts and reading slices** for every band above: the band model's "read something you
  could not read at the start" test still has no schema field and no texts. Book Three shipped all
  eleven chapters without them; Book Four ships the same way until the source lands.

None of these is dropped. Each is one blocker away, and the blocker is named.

## 6. Numbering, ids, stage, tier

- **Global orders start at 277 and end at 352.** Contiguous, band by band, no returned slots —
  the breakdowns already carry the final numbers (band 0 277–285, 1 286–293, 2 294–300, 3 301–309,
  4 310–318, 5 319–326, 6 327–335, 7 336–344, 8 345–352). An author that lands fewer lessons than
  its breakdown tells the controller, who renumbers the tail before the next band is authored.
- **Files** `b4-NN-<slug>.yaml` in all four content directories, NN = band number (`b4-00-…`).
- **Chapter id** `b4.band-N`, chapter `order` N+1, chapter title = the lessons' `situation:`.
  Lesson ids `b4.<slug>`, pattern ids `grammar.b4-<slug>`, phrase ids `b4band<N>.<slug>` (Book
  Three's `bandN.` prefix would collide). Word ids stay `vocab.<romaji>`; check the manifest for an existing id before minting one (six
  readings are already duplicated in the app — `pnpm jlpt:coverage` warns).
- **Checkpoint title** "Chapter N+1 checkpoint". The word "band" never reaches learner text.
- **`Book.stage`: `fluency`.** `isShifted` treats every non-foundation book the same, so the
  learner types every reading back; `recognitionOnly: true` for readings over 41 kana or readings
  nothing settles, and it now holds on review as well as on first meeting (`2056df2`).
- **Tier:** a free account reaches Book Four (`TIER_BOOK_LIMIT` `free: 4`, DR-033). Book Five is
  where the paywall belongs (`99-roadmap.md`). Nothing here changes tiers.
- **`progressKey`** `book-4`.

## 7. What a band breakdown must add

Everything `book-three-bands.md` §4 asks for (gate text and mining budget — both recorded as
blocked, not invented), plus:

- **The word list per lesson**, derived from the lesson's chosen sentences: headword, reading,
  JMdict seq and sense number, and whether it is on `coverage-n3.json`'s common list. Five is the
  target, not a quota; a lesson whose sentences carry two unknowns teaches two.
- **The kanji those words bring**, named per lesson for the wiring pass, with a check against the
  manifest's current set.
- **Hand-classified attestation** for every pattern, naming the false-positive classes removed.
  The raw figure in §4 is where to start, never what to cite.
- **Every "you already have X" claim** checked against the shipped lesson files. Book Three's
  audits found the same reversed pointer three times (a "last chapter" that was two or eleven
  chapters back).

## 8. Sequencing

Bands 0–3 first, in parallel: their forms are the densest in the whole corpus and none depends on
a text or a decision. Bands 4–5 (keigo) next: thinner, and honorific specials will need
recognition-only cards. Bands 6–8 last: thinnest, and the ones most likely to merge.

Each band follows Book Three's pipeline unchanged — breakdown, author, controller's byte-check,
audit, fix, wire, walk — with one addition: the author's JMdict verification now covers ~40 words
a band, not zero, and the wiring pass's kanji step is no longer a footnote.

## 9. Traps already visible in the raw scan

Recorded so that no planner re-derives them:

- **ただし** matches inside あわただしく (the scan's first hit). **がち** matches ちくちく. **申し**
  is mostly 申し込み. **なさ** is mostly なさい. **になり** is mostly plain になる. **命令** is a noun,
  not the imperative. **ございます** includes ありがとうございます, a set phrase already in Book One.
- **ちゃう/ちゃった** hits include contractions of てしまう (wanted) and unrelated strings; read them.
- **よう** is the single most overloaded string in the corpus (band 7 of Book Three found 413 raw
  for ように alone). The volitional lesson must search conjugated forms (しよう, 行こう, 見よう) and
  ようと, never よう.
- **そうだ** has two jobs (hearsay after a plain clause; appearance after a stem) that the same
  string carries; hand-split, and check the corpus's own English for which.
- **んだ。/のです** figures include every explanatory sentence ending in the corpus; the lesson
  needs the ones where the の/ん is doing the explaining job visibly, not a bare declarative.
- Tatoeba's English glosses hide Japanese grammar constantly at this level (Book Three's audits
  found 5–12 departures a band); the header rule stands — list every departure by id.
