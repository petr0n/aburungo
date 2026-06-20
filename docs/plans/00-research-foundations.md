# Learning Paths — Research Foundations

The evidence base for AburunGo's learning paths. Everything in the overarching plan
(`01-overarching-plan.md`) and the individual path docs traces back to a principle here.
The goal the brief set is **retention** — knowledge that survives days, weeks, and months,
and transfers to real speaking and reading. Sources are listed at the bottom.

---

## 1. The seven retention levers (what the science says)

| Lever | What it is | Why it matters | AburunGo status |
|---|---|---|---|
| **Spaced repetition (SRS)** | Review an item just before you'd forget it; intervals grow as memory strengthens | The single most evidence-backed technique. ~200–300% better retention than massed study; recall drops to ~20% in 24h without reinforcement but stays >90% with timed reviews | ✅ Have it (FSRS server + Leitner local) — **underused**: only fl/kanji drive it |
| **Active recall / testing effect** | Retrieve from memory (produce the answer) rather than re-read/recognize | Retrieval itself is the learning event; consistently beats restudy on delayed tests | ⚠️ Partial — fill-in-blank and kana type-mode do it; flashcards/words lean on recognition |
| **Interleaving** | Mix item types/skills within a session rather than blocking one kind | Forces the brain to discriminate (which rule? which reading?), which is exactly the real-world demand | ❌ Each bucket is siloed; sessions are single-type |
| **Comprehensible input (i+1)** | Consume content ~one level above current ability — understand ~95% without a dictionary | How fluency and intuition actually form; also raises motivation and autonomy (Tadoku / extensive reading) | ❌ Not present — phrases are isolated, no graded reading |
| **Output production** | Produce language (speak/write), ideally with feedback | **The market's biggest gap.** Comprehension ≠ fluency; spontaneous production needs its own practice | 🟡 Have the asset (Hana, Claude) — not woven into a path |
| **Elaboration / mnemonics** | Tie new items to vivid, personal associations (esp. kanji via radical stories) | Skips short-term memory bottleneck (humans hold ~6–8 chunks); 30 radicals cover ~80% of N5–N3 kanji | ❌ Kanji shown as flat characters, no component breakdown |
| **Sustainable habit** | Tiny trigger → small routine → immediate reward; 2 min you repeat beats 30 min you abandon | Short consistent sessions outperform long irregular ones; intensity causes burnout | ⚠️ No daily loop; **must respect the no-gamification rule** (see below) |

**The meta-finding:** no lever is a silver bullet. The wins come from *combining* them — SRS to
preserve, input to build intuition, output to make it usable, interleaving to make it
flexible, mnemonics to get it in fast. AburunGo's job is to combine them into coherent paths
rather than ship seven disconnected tools.

---

## 2. What the successful tools actually do

- **WaniKani** — kanji via **radicals → mnemonics → SRS**, in a strict unlock order. Lesson: a
  *sequenced* path with gated progression beats a pile of cards.
- **Bunpro** — grammar via SRS with **example sentences**, not rules in isolation. Lesson:
  always teach in context; review the pattern, not the abstraction.
- **Refold / AJATT / sentence mining** — immersion + **mining one-unknown-item sentences** into
  SRS. Lesson: i+1 sentences are the ideal SRS atom; "comprehend, then review" loop.
- **Tadoku (extensive reading)** — read large volumes at 95%+ comprehension, no dictionary.
  Lesson: volume of easy reading builds fluency and motivation better than analyzing hard text.
- **Duolingo** — world-class **habit engineering** (streaks, loss aversion) but criticized as
  "too easy," weak on real output and spontaneous conversation. Lesson: borrow the *consistency*,
  reject the manipulation, and win on the output gap they leave open.

---

## 3. Where the market is weak — AburunGo's openings

1. **Output / speaking with feedback.** Every review says apps fail here. AburunGo already pays
   for Claude (Hana). This is the clearest differentiator.
2. **Integration.** Learners are told to stitch together a vocab app + a grammar app + a reader +
   a conversation tool. An app that runs one coherent loop across those is rare.
3. **Reading fluency.** Graded/extensive reading is underserved in apps; AburunGo's real-life
   phrase corpus is raw material for it.
4. **Situational, practical framing.** AburunGo's brand is "practical Japanese for real life."
   Scenario-based journeys ("handle a restaurant," "navigate transit") are concrete, motivating,
   and differentiated from abstract gamified trees.

---

## 4. Hard constraints this plan must honor (from CLAUDE.md)

- **No gamification.** No XP, hearts, badges, mascots, level-ups, manipulative streaks. Retention
  here comes from *genuine* mechanisms — visible mastery, spaced reviews, real "I can do this now"
  moments — not loss-aversion dark patterns. Progress tracking (SRS state, review history,
  honest streaks-as-information) is fine; reward loops are not.
- **No fabricated Japanese sentences.** All sentence content must come from JMdict / Tatoeba /
  KANJIDIC2 or a verified source. This directly shapes the reading/input paths: graded reading
  material must be sourced (Tatoeba sentences, graded readers) or assembled from verified atoms,
  never invented.
- **Touch-first, mobile-first**, 44px targets, no hover-only affordances.
- **Tiered access.** Guest = N5, free = N5+N4, paid = N3–N1 + Hana. Paths are "mostly paid," so
  most live in the paid tier, with a free on-ramp.

---

## 5. Design implications (the principles every path will follow)

1. **One loop, many buckets.** A path is a *sequence* that pulls words, kana/kanji, phrases,
   flashcards, audio, and Hana into a single daily flow — not a new silo.
2. **Recognize → Recall → Produce.** Every item graduates through increasing difficulty:
   see it → retrieve it → use it in output. Don't let anything stall at recognition.
3. **Always in context.** Teach and review inside sentences/situations, not as bare items.
4. **i+1 sequencing.** Only introduce material the learner is ~95% ready for; the SRS + path
   ordering enforce this.
5. **Interleave on review.** Daily review mixes item types and past material, not one bucket.
6. **Output is the finish line.** Every path ends in production — speaking to Hana, typing a
   reply, reading aloud — so comprehension converts to ability.
7. **Honest, calm habit.** A small, repeatable daily session with a clear "done for today,"
   mastery you can see, and gentle (never punishing) re-engagement.

---

## Sources

- [SRS setup for Japanese learners — Japanese Explorer](https://www.japaneseexplorer.com.sg/srs-setup-for-japanese-learners/)
- [Spaced repetition + input — Speakable Japanese](https://speakablejapanese.com/en/lessons/natural-japanese/learning-methods/spaced-repetition-system-for-learning-japanese/)
- [Refold review — Tofugu](https://www.tofugu.com/japanese-learning-resources-database/refold/)
- [The science behind active recall — Number Analytics](https://www.numberanalytics.com/blog/the-science-behind-active-recall-and-memory)
- [Why passive exposure isn't enough (active recall) — Aprelendo](https://blog.aprelendo.com/2025/12/why-passive-exposure-isnt-enough-the-role-of-active-recall-in-language-mastery/)
- [Spacing, feedback, and testing boost vocabulary learning — NIH/PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12288144/)
- [Learn kanji with radicals and mnemonics — Tofugu](https://www.tofugu.com/japanese/kanji-radicals-mnemonic-method/)
- [Kanji mnemonics that work — Migaku](https://migaku.com/blog/japanese/kanji-mnemonics)
- [Sentence mining — Clozemaster](https://www.clozemaster.com/blog/sentence-mining/)
- [Tadoku extensive reading overview — NCCJ LibGuides](https://guides.nccjapan.org/tadoku-extensive-reading)
- [Japanese reading levels (Tadoku) — Migaku](https://migaku.com/blog/japanese/japanese-reading-levels)
- [Why daily-streak apps fail serious learners — Taalhammer](https://www.taalhammer.com/why-daily-streak-apps-often-fail-serious-learners-and-which-language-learning-app-works-better-instead-in-2026/)
- [Building a language-app habit that lasts — Science Based Learning](https://www.sciencebasedlearning.com/blog/language-learning-app-habit)
- [Best Japanese apps compared (output gaps) — CCube Academy](https://www.ccubeacademy.com/best-apps-for-learning-japanese-in-2026-compare-by-speaking-grammar-kanji-and-jlpt/)
- [Apps that actually work / output gap — Kaiwa](https://trykaiwa.com/blog/best-japanese-learning-resources-2026)
