# Reading-corpus shopping brief

What to look for when sourcing coherent Japanese texts for Book Three's reading library.
This serves the open decision in [docs/plans/04-path-n3.md §5](plans/04-path-n3.md) — the last
pre-authoring blocker now that the band model is signed off (2026-08-20).

**The thing being bought:** ~100+ short, coherent Japanese texts (stories/articles, roughly
200–1,500 characters each) spanning the N4→N3 difficulty band, delivered as machine-readable
text, with the right to put them inside the app and cut them up.

---

## License must-haves (in order of how often they kill the deal)

1. **Derivatives allowed.** The sneaky one. The pipeline adds furigana, segments sentences,
   attaches VOICEVOX audio, and levels the text — all *derivative works*. A "**ND**"
   (no-derivatives) clause kills the deal even when commercial use is fine. This is why the free
   Tadoku books fail twice (NC *and* ND).
2. **Excerpting/storage rights.** Mining copies *individual sentences out of the text* into the
   learner's SRS queue, permanently. "Display only" licenses don't cover that. Ask explicitly:
   "may sentences be excerpted into a spaced-repetition review queue?"
3. **In-app display/hosting.** Not "classroom use," not "personal reading" — the text will be
   served from the app's storage to a browser.
4. **TTS/audio rendering.** Generating audio *of their text* must be covered (separate from
   VOICEVOX's own voice terms, tracked in CLAUDE.md's data-sources table).
5. **One-time, perpetual fee.** Walk away from per-user, per-MAU, or annual-renewal pricing —
   that's the Hana problem (DR-023) wearing a different hat.
6. **Commercial status.** Depends on the personal-vs-commercial identity decision. If AburunGo
   stays a personal/free tool, **CC BY-NC sources become viable** (NC without ND is workable) and
   the field widens — e.g. the Japan Foundation's Marugoto/Hirogaru materials are CC-licensed
   (verify the variant: BY-NC usable, BY-NC-**ND** not). If Book Three might ever charge,
   explicit commercial rights are needed from day one.

## Format must-haves

- **Plain machine-readable text**: TXT, CSV, JSON, or EPUB.
- **PDF-only is a walk-away.** Typeset graded readers with baked-in furigana don't extract
  cleanly; the pipeline can't level what it can't parse.
- Ideally text **without** furigana (the app adds its own), plus per-text metadata: title, level
  (Tadoku level or JLPT), length.
- **Not needed:** their vocab lists, translations, or comprehension questions — the pipeline
  levels texts against the learner's actual known items itself.

## Volume floor

Under ~30 texts is a demo, not a library. Extensive reading burns material fast — aim for 100+
texts across levels, or negotiate a series with later volumes included.

## Who to contact, best first

1. **NPO Tadoku Supporters** — <https://tadoku.org/japanese/en/graded-readers-en/> — rights
   holder behind both the free books and the Ask/Taishukan commercial series; White Rabbit's app
   proves they license digitally. Ask for app-licensing terms directly.
2. **Ask Publishing** (レベル別日本語多読ライブラリー) rights department — same content family.
3. **Indie graded-reader authors** (self-published EPUB sets) — most likely to say yes to a flat
   few-hundred-dollar deal with clean text files, least likely to have a rights department
   slowing things down.

Non-purchase fallbacks already in the plans: Tatoeba sentence-cluster micro-readings (labeled
stopgap), Aozora Bunko for upper bands (pending sign-off), and link-out reading + mining on NHK
News Web Easy / Watanoc, where the app never stores the text — only the learner's own mined
sentences.

## Copy-paste questions for the first email

> - Do you license digital text for use in a small learning app, for a one-time fee?
> - Does the license cover: in-app display, adding furigana and annotations, generating TTS
>   audio, and excerpting sentences into a review queue?
> - Can you deliver machine-readable text (TXT/CSV/JSON) without baked-in furigana?
> - How many texts, at which levels, at what lengths?
> - What attribution do you require?

## Red flags (walk away)

ND clauses · PDF-only delivery · per-user or annual pricing · "classroom use only" · no
excerpting · DRM requirements.

---

*When a source is chosen: vet the actual license text against this checklist, then record the
decision in 04 §5 and add a row to CLAUDE.md's data-sources table so commits can cite it.*
