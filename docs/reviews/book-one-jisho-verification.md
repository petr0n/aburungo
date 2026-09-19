# Book One Content Review — Dictionary Verification

**Date:** 2026-09-19 (first pass 2026-09-14)
**Scope:** Book One (`n5` ladder), every vocabulary entry: 28 YAML files, 484 words
**Source checked:** JMdict for Applications 3.6.2 via the committed `data/jmdict-index.json`
**Method:** `japanese` and `reading` of every entry looked up in the index; a word passes when
both appear as forms of one and the same dictionary entry

Jisho.org publishes JMdict, so this is the same data the first pass queried through the
`jisho-mcp` server — read locally, with no network and no per-word lookups. That first pass
scanned 18 of the 28 files (315 words) and its reading comparison was mis-wired, so its
numbers are replaced here rather than corrected in place.

---

## Result

**No content defects.** 484 words checked.

| Outcome | Count |
|---|---|
| `japanese` and `reading` are forms of one JMdict entry | 478 |
| `japanese` is a JMdict form, `reading` is not listed for it | 1 |
| `japanese` is not a JMdict headword | 5 |

All six exceptions are correct content that a headword dictionary does not list, by design:

- **歩いて / あるいて** — te-form of 歩く (1514310), taught as the set adverb "on foot".
- **食べたい / たべたい**, **飲みたい / のみたい** — たい-forms of 食べる and 飲む; the notes say so and
  explain that they conjugate as i-adjectives.
- **何円 / なんえん** — 何 + 円; a compound JMdict does not carry as its own entry.
- **～つ / つ** — the native counter suffix, written with a placeholder tilde. JMdict lists the
  counted forms (ひとつ, ふたつ …), not the bare suffix.
- **月 / がつ** — JMdict lists 月 as つき (1255430) and げつ (2153740). がつ is the reading 月 takes
  after a number in a month's name, which is exactly what the entry teaches ("month, in a
  month's name"); it appears in JMdict inside 一月, 二月 and so on, not as a standalone reading.

## What the first pass got wrong

**"Jisho does not index common kana-only words."** False. Every word it listed as a Jisho
coverage gap is a JMdict headword — これ (1628530), ここ (1288810), あなた (1223615), わたし
(1311110), はい (1010080), いいえ (1583250), とても (1008630), たくさん (1415870), きれい
(1591900), ください (1184270). The 73 "not found" results came from `get_word`, which looks up a
URL slug, not a word. The data was never missing.

**"187 reading mismatches — false positives, confirmed in every case examined."** The cause was
right (the script compared kanji against kana) but the confirmation was partial. The table above
is the full check: 478 of 484 readings match, and the six that do not are listed with reasons.

**"35 of 100 lessons are on the shipped ladder; 65 are gated."** False. A guest walks all 100.
The CI walkthrough on `main` completes `sessionsCompleted=100, ladderEndReached=true,
consoleErrors=0, pageErrors=0`. Hana's shelving (DR-023) removes conversation lessons that
were never in the count.

**"Tests pass (cannot be re-run here — Node 16)."** They were not run. Run now: 46 files, 681
tests pass. Running them surfaced an unrelated environment fault in the shared checkout —
`node_modules/aburungo-design-system` pointed at a deleted worktree
(`../aburungo-ds-fillinput`), and `pnpm install` considered that satisfied. Relinking to
`../aburungo-design-system`, where `package.json` points, fixed it.

**"The 73 NOT_FOUND entries include 227 phrases."** Phrases were never in the 315. The 227 is
Book One's phrase count from the ladder; it has nothing to do with the vocabulary result.

## JLPT tags

Not verifiable against this source. JMdict carries no JLPT data; Jisho's tags come from a
separate list of uncertain provenance. All 28 Book One vocabulary files carry
`# jlpt-source: training — JLPT level unverified (JMdict carries no JLPT data)`, which is what
CLAUDE.md requires until levels can be verified against a dataset that has them. A Jisho tag
that disagrees with a training-derived N5 assignment is not evidence of a content error, and
this review makes no claim either way about the 43 disagreements the first pass reported.

## Provenance

- 28 of 28 files carry both `# content-source` and `# jlpt-source` headers.
- 227 `JMdict seq NNNNNNN` citations in Book One vocabulary. `pnpm jmdict check` verifies every
  citation in the repo (693) resolves to a real entry that accounts for the item it sits on;
  it runs inside `pnpm test`.
- No Book One vocabulary entry carries a `tatoebaId` example block, so the first pass's
  "spot-check the example blocks against Tatoeba" item has nothing to act on.

## Not checked, and by what instead

- **Phrases (227):** sentences, not headwords. Attestation is a Tatoeba question — the
  `content-authoring.md` procedure covers it — not a dictionary one.
- **Grammar patterns (44):** abstractions over phrases; no dictionary check applies.
- **Kanji (200 introduced):** `kanji.yaml` is generated from KANJIDIC2 via kanjiapi.dev and says
  so in its header. Its guard is `src/content/kanji/scope.test.ts`, which passes.

## Assessment

Book One's vocabulary is sound against the dictionary of record. Nothing needs changing.

For Book Two and later, do not repeat the Jisho pass: `pnpm jmdict check` plus the
japanese-and-reading check above (a dozen lines against `data/jmdict-index.json`) cover the same
ground offline and completely. The `jisho-mcp` server also failed to start in this session
(`uvx` not on `$PATH`), which is a second reason not to depend on it.
