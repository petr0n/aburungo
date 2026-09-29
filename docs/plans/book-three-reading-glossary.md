# Book Three — the reading glossary

**Status:** planner breakdown, 2026-09-28. No content authored yet.
**Owner ruling (2026-09-19):** Book Three is incomplete without coherent reading texts.
**Texts:** the 26 KC よむよむ stories, `data/reading/kc-yomyom.json` (#136).

## What this document settles, and what it asks

Book Three's plan already decided how reading vocabulary arrives
([book-three-bands.md §1](book-three-bands.md)): *"Vocabulary does not come from lessons. It
arrives by mining from the library."* So the content Book Three is missing is not a vocabulary
band of new lessons. It is the **glossary the mining feature will consume**: for each story, the
words it uses that Books One to Three do not teach, each resolved to its JMdict entry and the
sense the story means.

Content first (DR-038): the mining interface is unbuilt, and that is not a reason to omit the
content it will consume.

**One decision is needed before authoring** — where that content lives (§4).

## 1. The inventory

`node scripts/kc-yomyom.mjs unknowns` writes `data/reading/kc-unknowns.json`: every unknown in
the stories, resolved from the surface run the levelling reports (逃げ, 勉) to a JMdict headword
(逃げる, 勉強), and sorted into four kinds. Generated, reproducible, not authored content.

| Kind | What it is | Glossary treatment |
|---|---|---|
| **new** | No book teaches this JMdict entry | A glossary entry, JMdict-cited |
| **spelling** | Taught, but in another form — Book One's なまえ, the story's 名前 | A glossary entry pointing at the taught id: the word is known, the kanji is not |
| **Book Four** | Book Four teaches it (上手, 一番, 気持ち) | Reuse the Book Four id; never a duplicate |
| **unresolved** | No JMdict entry — names (アイン, 清姫), places (田尻, 堺市), onomatopoeia, tokenizer debris | Story-local notes for names; the rest is not vocabulary |

Run the command for current counts; at 2026-09-28 it reported roughly three hundred new
headwords, a dozen spelling gaps and eighty Book Four reuses.

**The distribution is the design input.** Only about thirty headwords appear in two or more
stories. The rest belong to a single story — the vocabulary of *that* story's topic: 非常口 in
the fire-exit story, 披露宴 in the wedding. That is a per-story glossary, not a core list to teach
up front, and it is exactly the shape the mining model expects.

## 2. What a glossary buys

Each story's coverage now, and if every word it resolves were known (`perStory` in the file):

- **Now:** 60–84% of tokens covered by Books One to Three.
- **With its glossary:** 71–92%.
- **Words per story:** median around seventeen, from seven to thirty-seven.

The glossary does not reach the 98% flow target, and the plan should not pretend it does. The
remainder is proper nouns, onomatopoeia and segmentation debris a tokenizer without a
morphological analyser cannot remove — so the true figure is higher than this floor, by an
amount this repo cannot measure until it has one.

Read it this way: these are **mining texts**, not flow texts, for a Book Three graduate. Seventeen
unknowns in a story is well past the two-or-three mining budget of §4 of the bands plan. That is
the honest consequence of topical A1–A2 stories meeting a course whose early books taught
situations rather than Osaka. It argues for pre-reading the glossary, which is what a mining
flow does.

## 3. Authoring rules

- One entry per headword per story, carrying: the JMdict seq (cited in the house form, so
  `pnpm jmdict check` covers it), the reading, the gloss **for the sense this story uses** — not
  JMdict's first sense — and the kind from §1.
- The author verifies the sense against the sentence it came from. The inventory picks an entry
  mechanically; 絵 is "picture" and 形 is "shape" in these stories, but a mechanical pick will be
  wrong somewhere, and that is what the verifier role exists to catch.
- **spelling** entries reference the taught id rather than creating a new word.
- **Book Four** entries reference the Book Four id. This does not move the word into Book Three
  or change its tier gate; it only lets a Book Three reader look it up.
- Names get a story-local note (who or what they are), never a JMdict citation, because there is
  none to give. They are not vocabulary and never enter SRS.
- Nothing is composed. Every Japanese string in a glossary is either a JMdict form or text
  quoted verbatim from the story.

## 4. The decision: where the glossary lives

There is no schema slot for it. `src/content/vocabulary/` cannot hold it as-is:
`contentIntegrity.test.ts` requires every word there to be taught by a lesson, and the plan
says these words must not come from lessons. An absent slot has to be resolved, not worked
around (content-authoring.md §2).

**Recommended: a new content kind, `src/content/reading/`.** One YAML file per story
(`kc-taro.yaml` …), its own schema and parser beside the others, its own integrity test (every
glossary entry cites a real JMdict entry; every referenced taught id exists; every story id
exists in `kc-yomyom.json`). Clean boundary, no exemption carved into an existing rule, and the
future mining UI reads one obvious place.

Alternative: store glossary words as ordinary vocabulary entries with a `readingOnly: true`
flag and exempt them from the taught-by-a-lesson test. Smaller diff, but it puts a second kind
of word into a file the whole app treats as "taught", and every consumer of the vocabulary
index would then have to know about the flag. The first time one forgets, a glossary word
shows up in a lesson review.

## 5. Order of work, once §4 is settled

1. Schema, parser and integrity test for the chosen slot (integrator role; no Japanese).
2. Author the glossaries story by story, A1 first, citing JMdict for every entry.
3. Verify: `pnpm jmdict check`, the new integrity test, and a per-entry sense check against the
   source sentence.
4. Expose in the bookmap and record the Book Three content contract (content-authoring.md §2).
