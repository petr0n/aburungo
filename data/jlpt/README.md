# JLPT reference vocabulary

A merged reference list per level, used to find gaps in our own content and to
sanity-check the `jlpt:` tags we author. **Development data. It is not bundled
into the app and never reaches a learner.**

Built by `scripts/jlpt.mjs`:

```
pnpm jlpt:fetch n5      # download the raw source files
pnpm jlpt:build n5      # merge them into reference-n5.json
pnpm jlpt:coverage n5   # diff the reference against what the app teaches
```

Every level works identically — N4 through N1 need a run, not new code.

## This is a reference, not an authority

**No official JLPT vocabulary list has existed since 2010.** The Japan
Foundation published lists for the old four-level test and stopped when the
N1–N5 system replaced it, describing the exam as measuring general communicative
competence rather than a fixed word set. Everything below is a community
reconstruction.

So: use it to find gaps and to check tags. Do not let it decide what gets
taught. This app teaches practical situations, and "can you handle a hotel
checkout" is a better question than "how much of a list have you covered." A
word being absent from these files is not a reason to cut it, and a word being
present is not a reason to teach it.

## Sources

Three, chosen because they actually differ. Nearly every JLPT word list online
traces back to Tanos, so stacking three of those would add rows and no
information.

| Source | What it contributes | Licence |
|---|---|---|
| **Tanos** | The de-facto reference list. Written form + reading, no meanings. | CC BY 4.0 |
| **open-anki-jlpt-decks** | Same lineage, community-corrected, and carries English meanings. Where it disagrees with Tanos, that disagreement is the signal. | MIT wrapper; deck data derives from Tanos (CC BY) |
| **JMdict** | Not a JLPT list at all — the `common` flag, from newspaper and corpus frequency markers. Answers a question no word list can: is this word actually common? | CC BY 4.0 ("JMdict for Applications") |

### Attribution

CC BY requires attribution. Both apply:

- JLPT level data from **<https://www.tanos.co.uk/jlpt/> by Jonathan Waller**,
  licensed CC BY. Converted to CSV/JSON by
  <https://github.com/Bluskyo/JLPT_Vocabulary> (MIT) and
  <https://github.com/jamsinclair/open-anki-jlpt-decks> (MIT).
- Commonness markers from **JMdict**, © the Electronic Dictionary Research and
  Development Group, licensed CC BY.

## What is in here

| File | |
|---|---|
| `raw/<source>-<level>.csv` | exactly as downloaded, so a re-merge needs no network |
| `reference-<level>.json` | merged entries with per-word source attestation |
| `coverage-<level>.json` | the gap list, ranked |

As built (2026-08-16):

| Level | Entries | In both lists | Flagged common |
|---|---|---|---|
| N5 | 809 | 606 | 788 |
| N4 | 770 | 545 | 744 |
| N3 | 2347 | 1628 | 2324 |
| N2 | 2179 | 1570 | 2038 |
| N1 | 3880 | 2294 | 3517 |

The two lists disagree on roughly a quarter of every level. That gap is why the
merge records *which* sources attest each word rather than flattening them.

## How the matching works, and why

Comparison is on the **normalised reading** — katakana folded to hiragana,
spacing and interpuncts stripped — never on the written form.

This is not a detail. Matching written forms reports 朝 as missing when the app
already teaches it as あさ, and acting on that produces a duplicate. Exactly
that mistake put `vocab.asa` and `vocab.noru` into this repo twice before.
`coverage` also warns if two of our own words share a reading, which is the same
bug caught from the other direction.

Homophones stay separate in the reference (はし the bridge and はし the
chopsticks are different words), so the key is reading **plus** written form.

## Reading the gap list

`coverage-<level>.json` ranks missing words by how much agreement stands behind
them:

1. **Both lists, and common in JMdict** — the safest candidates to author next.
   396 of N5's missing words are here.
2. Everything in between.
3. **One list only, and not common** — check before spending a lesson slot.
   15 of N5's.

`inAppNotInReference` is the other direction: words we tag at this level that no
list mentions. Not necessarily wrong — situational vocabulary an exam-oriented
list would not carry is exactly what this app should have — but worth reading.
