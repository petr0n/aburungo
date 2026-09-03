# Book Three — the band skeleton

**Status: skeleton, not breakdowns.** This is the layer above
`docs/plans/book-three-band-NN.md`, the way `03-book-two.md` §4 sat above
`book-two-chapter-NN.md`. It names the bands and the patterns each one owns, so band
breakdowns can be commissioned in parallel without two of them claiming the same grammar.

It settles no Japanese sentences. Sourcing is `04-stage-reading.md` §8 and is stricter here
than in Books One and Two: **no training-canonical sentences at this stage.** Every sentence
in this book comes from Tatoeba with its id, or it does not ship.

## 1. What is already decided

- **A chapter is a band** (`04-stage-reading.md` §3, owner sign-off 2026-08-20): ~10 connective
  patterns plus the slice of the library that exercises them. One pattern per lesson.
- **Checkpoints stay shrinking-set gates** (DR-020), and gain one thing no earlier book could
  offer: a **gate text** the learner could not have read when the band opened.
- **Vocabulary does not come from lessons.** It arrives by mining from the library. This is what
  lets the 10x10 shape survive at all — lessons carry patterns, the library carries words, so
  lesson count decouples from word count. Book One's honest teaching rate was 5.7 words a lesson;
  N3's ~2,200 words over ~100 lessons would demand 22.
- **Can-dos stay computed, not declared** (DR-022), rederived from passages actually read and
  patterns actually produced.

## 2. The one open blocker

**The text source (§5).** The pipeline levels texts; it cannot conjure them. Tatoeba is
sentence-grained, and a shelf of isolated sentences is not extensive reading.

The state of each option as of today, which the plan does not yet record:

| Option | State | Verdict |
|---|---|---|
| (a) License a graded-reader corpus | Not started; costs money | Best fit, needs an owner decision |
| (b) Aozora Bunko | **Built.** `scripts/aozora.mjs`, 202 texts fetched, ~11,200 filtered as public-domain + modern orthography | Wrong register for this book — its own header says "Book Five material by difficulty" |
| (c) Clustered sentence sequences | **Prototyped.** `data/reading/micro-readings.json` | Stopgap; must never be dressed up as a story |

**Nothing in this document depends on that decision.** The grammar spine is the same whichever
way the library is sourced, which is why it can be drafted now.

## 3. The bands

Ten bands, grouped by what the grammar *does* rather than by JLPT sub-level, because a learner
meets these by function. Pattern counts are targets, not quotas — Book Two proved a defended 7
beats a padded 10.

Every pattern below is **training-derived** and carries no sentence yet. A pattern earns its
lesson only when a Tatoeba sentence is found that demonstrates it at the band's level; a pattern
that cannot be attested moves to a later band or is cut. Expect this list to lose entries.

| Band | Theme | Patterns it owns |
|---|---|---|
| 1 | Cause and consequence | ため(に) **(causal only)** / せいで / おかげで / によって / から(に)は / ものだから / ことだから |
| 2 | Contrast and concession | のに / くせに / ながらも / ものの / とはいえ / にもかかわらず / ながら |
| 3 | Conditions, sharpened | 限り / 次第 / さえ〜ば / たとえ〜ても / ようでは / ものなら |
| 4 | Time and sequence | うちに / 間(に) / 以来 / 際(に) / 途中で / たとたん / かける |
| 5 | Speaker stance | はず / わけ / みたい / らしい / っぽい / ようだ / に違いない / かもしれない |
| 6 | Degree and comparison | ほど / くらい / だけ / ばかり / どころか / に比べて / 反面 |
| 7 | Purpose and intent | ように / ために **(purposive only — band 1 owns the causal sense)** / 〜べく / 〜まい / ~~つもり~~ / ことにする / ことになる |
| 8 | Obligation and permission | ざるを得ない / ないわけにはいかない / べき / 必要がある / てはならない / constructions of 許可 |
| 9 | Nominalisation and reference | こと / の / ところ / 〜という / 〜とは / 〜に関して / 〜について / 〜における |
| 10 | Register and the written voice | である / 〜つつ / 〜ゆえ / 〜において / passive as formality / noun-heavy style |

### Four of these are already taught, and only two are genuinely new

Checked mechanically against every `pattern:` in `src/content/grammar/`. A band author who
misses this re-teaches material the learner already owns, which is the single most common defect
Book Two's audits found.

| Pattern | What the learner already has | What the band adds |
|---|---|---|
| ながら (band 2) | ます-stem + ながら, *"two actions at once, one person"* — Book Two, joining chapter | The **concessive** sense, "although". Same form, unrelated meaning. Teach it as a second job and contrast it with the first, or it reads as a contradiction |
| くらい (band 6) | ～ふんくらいです, *"about ~ minutes"* — Book One | Degree and extent, "to the point that". Different job, same word |
| つもり (band 7) | plain non-past + つもりです, plus つもりはない / つもりでした — Book Two, deciding chapter | **Almost nothing. Cut it from band 7.** If a band wants it, the only new ground is ～たつもり, acting under an impression, and that is one lesson at most |
| こと (band 9) | ～たことがある and ことができる — Book Two | Bare こと as a nominaliser, and ことにする / ことになる in band 7. Real, but narrower than "こと" suggests — say which |

**Band 10 is the one to be suspicious of.** It is the written register rather than a grammar
family, and it may turn out to belong to Book Four, or to be spread through the other nine as
"here is how this looks in writing" rather than standing alone. Let the reading library decide:
if the levelled texts keep needing it early, it is not band 10.

## 3a. A missing band: the passive, and it has to come first

**Found while planning band 1, and it is a hole in this skeleton rather than a detail.**

Book Two chapter 7 teaches 〜と言われています for recognition only and says so in its own header:
the passive's *"conjugation and production of both, open the next book."* That is this book. A
learner arrives having been told, in as many words, that the passive is coming — and none of the
ten bands above teaches it. Band 10's "passive as formality" is a register note that presupposes
a conjugation lesson that does not exist anywhere.

It also blocks band 1. によって's canonical use is marking the agent of a passive sentence;
band 1 works around this by sourcing only the means/variation sense and deferring the rest, which
is the right call locally and the wrong shape for the book.

**Resolved and planned: `book-three-band-00-passive.md`, 8 lessons at orders 196-203.** Bands 1-4
shift down by 8 (band 1 now 204-211, band 2 212-218, band 3 219-226, band 4 227-234) and their
documents carry the settled numbers. **A passive and causative band opens Book Three, before band 1.** れる/られる, then
せる/させる, then the combination, then によって as the agent marker that needs all three. It is
the one band that is conjugation rather than connective grammar, which is why it fell out of a
skeleton built around connectives — and why it cannot simply be appended at the end.

Renumbering cost nothing because no Book Three content existed when it landed. It would not have
been free later, which is why it was settled before authoring rather than after.

## 3b. Attestation ceilings for bands 5-10

Raw substring counts against the 25,983 unique Japanese sentences bundled in
`server/data/jmdict-examples-eng-3.6.2.json`. **These are ceilings, not counts.** Bands 1-4
found them shrinking hard once hand-classified: とはいえ showed 11 and yielded 2 (nine were
とは言えない); ものの showed 24 and yielded 5 (nineteen were もの+の); concessive ながら showed 9
and yielded **0**, every hit a frozen idiom. Treat a number here as permission to look, nothing more.

| Band | Pattern : ceiling |
|---|---|
| 5 stance | はず 69 · わけ 85 · みたい 46 · らしい 94 · っぽい 20 · ようだ 64 · に違いない 24 · かもしれない 53 |
| 6 degree | ほど 181 · くらい 89 · だけ 332 · ばかり 82 · どころか 9 · に比べて 5 · **反面 4** |
| 7 purpose | ように 413 · ために 259 · べく 12 · まい 117 · **ことにする 1** · ことになる 29 |
| 8 obligation | **ざるを得ない 3** · **ないわけにはいかない 1** · べき 178 · 必要がある 26 · てはならない 49 |
| 9 nominal | ところ 220 · という 423 · とは 499 · に関して 28 · について 180 · における 25 |
| 10 register | である 761 · つつ 36 · **ゆえ 6** · において 50 |

Five patterns are already at risk before anyone hand-classifies: 反面, ことにする, ざるを得ない,
ないわけにはいかない and ゆえ. Expect band 8 in particular to shrink — two of its five are in that
list, and its remaining three are common words whose ceilings are inflated by unrelated uses.

The high numbers mislead in the other direction. ところ 220 counts the ordinary noun "place",
だけ 332 counts the ordinary "only", まい 117 counts every word containing まい. A planner must
separate the construction from the word and say how.

**A trap I fell into producing this table, recorded so nobody repeats it:** in
`jmdict-examples-eng-3.6.2.json` an example's `text` field is the *headword form*
("ＣＤプレイヤー"), not the sentence. The sentence is in `ex.sentences[]` under `lang: "jpn"`.
Searching `text` returns numbers that look plausible and are meaningless — かもしれない came back
as 1. `scripts/jlpt.mjs` around line 601 reads it correctly; copy that.

## 3c. A second gap: だろう and でしょう are taught nowhere

**Found by the band-5 planner, verified here.** Neither appears as a pattern in any of the ten
bands, and neither is taught anywhere in Books One or Two — not as a rule, and not even inside a
phrase a learner has met. Nor is そう.

They are among the best-attested things in the corpus: **だろう 348 sentences, でしょう 215.**
Only という, とは, ある and である beat them. A learner cannot read a page of ordinary Japanese
without meeting one, and this book's whole premise is extensive reading.

They belong with band 5, whose eight patterns are all "how sure am I, and on what grounds" —
だろう is the plainest member of that family and the skeleton simply omitted it. Band 5 as planned
is already 9 lessons, so this is a decision about that band's size, not a free addition.

This is the second gap of the same kind as §3a's missing passive: the skeleton was built by
listing connective grammar, and both misses are things that are not connectives. Worth one pass
over the remaining bands looking for the same shape of omission before authoring starts.

## 4. What a band breakdown must add

The same shape as `book-two-chapter-NN.md`, plus two things that book had no need for:

- **The gate text.** Which passage closes the band, and the evidence it was unreadable at the
  band's start — the levelling pipeline's own coverage number for that learner state, not a
  guess.
- **The mining budget.** How many unknowns a band's texts should carry. §5 fixes the flow target
  at ~98% known, which puts 2-3 unknowns in a 150-word passage, so one number serves both flow
  and mining. A breakdown that proposes texts outside that band is proposing a different book.

## 5. Sequencing

Bands 1-4 are safe to break down now: their patterns are the ones Tatoeba attests most densely,
and none of them depends on the library's shape. Bands 5-10 should wait for the text-source
decision, because their patterns are the ones a levelled corpus is most likely to re-order.
