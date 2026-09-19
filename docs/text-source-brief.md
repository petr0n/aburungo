# Reading-corpus shopping brief

What to look for when sourcing coherent Japanese texts for Book Three's reading library.
This serves the open decision in [docs/plans/04-stage-reading.md §5](plans/04-stage-reading.md) — the last
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

## Candidates verified 2026-09-06 — NOT adopted

Researched for the two bands deferred from Book Four (`04b` band 4 news/reportage,
band 8 exposition at length), which `book-four-bands.md` §5 records as waiting on
texts. They stay Book Four's until a roadmap change says otherwise.
**Nothing here is adopted.** Adopting one is an owner decision plus a row in
CLAUDE.md's data-sources table.

Every license below was read on the publisher's own terms page and the line is
quoted. That matters because the last time this was researched, search results
and dataset cards said Tadoku was CC BY-NC while the rights holder's own page
said CC BY-NC-**ND** — and the same trap caught a second source below.

### Global Voices 日本語 — <https://jp.globalvoices.org/>

Citizen-journalism reportage and commentary translated into Japanese and
editorially reviewed. ~2,894 posts, articles running 3,800–6,400 characters,
still publishing. Clean WordPress REST API at `/wp-json/wp/v2/posts`.

**CC BY 3.0**, attribution only, no SA/NC/ND. Verified on
<https://jp.globalvoices.org/about>: 「このサイトは Creative Commons Attribution 3.0
ライセンスで公開しています」. Derivatives and commercial use both permitted.

Two constraints, both real: their attribution policy requires a link to the
original and the author's name **at the top** of the republished text, which is a
reading-screen design constraint; and embedded photos/video may sit under other
terms, so take text only. It is also translated Japanese rather than natively
composed — professional, but worth a human pass.

### Japanese Wikinews — <https://ja.wikinews.org/>

Volunteer news wire, 2005–2026. 4,110 articles, median ~900 characters — sized
well for a reading unit. Full XML dump at
<https://dumps.wikimedia.org/jawikinews/latest/>.

**CC BY 4.0**, verified in the site footer: 「2005年9月25日以降に投稿されたテキストは、
一部の例外を除き、クリエイティブ・コモンズ 表示 4.0 (CC BY 4.0) で提供されます。」 Note this is
CC BY, **not** the CC BY-SA Wikipedia uses — Wikinews is the Wikimedia exception.
Filter to articles after 2005-09-25 to stay inside the grant.

**The project is closed.** The site carries the banner 「ウィキニュース全言語版は
2026年5月4日をもって閉鎖されました。」 so this is a frozen archive: plan a one-shot
import, never a recurring sync. 4,110 articles is all there will ever be.

### Held in reserve — Japanese government sites

公共データ利用規約 (PDL 1.0, 2024) is explicitly CC BY compatible and permits 翻案 and
commercial use. White papers are genuine long-form but bureaucratic and closer to
N1. Worth having only if the two above run short on volume.

### Rejected, with evidence

- **livedoor ニュースコーパス** — **CC BY-ND 2.1 JP**. The distributor's own page
  <https://www.rondhuit.com/download.html> reads 「各記事ファイルにはクリエイティブ・
  コモンズライセンス『表示 – 改変禁止』が適用されます」. This is the Tadoku trap repeating:
  Hugging Face dataset cards and NLP tutorials describe it loosely as "Creative
  Commons licensed". It is ND, and ND blocks a pipeline that adds furigana.
- **BCCWJ (NINJAL)** — paid, contract auto-renews every two years, commercial use
  case-by-case, covers only 1976–2005, and ships sampled fragments with no
  redistribution right. Three of those are this brief's own walk-away flags.
- **NHK News Web Easy** — 「許可なく転載することを禁じます」. Link-out only: no storage,
  no furigana layer, no TTS, no mining into SRS. That is the non-purchase
  fallback already in the plans, not a corpus.

## Candidates verified 2026-09-19 — Book Three story texts

Searched after the owner ruled Book Three incomplete without coherent texts and the
2026-09-05 email to NPO Tadoku went two weeks unanswered. Twelve sources, every licence
read on the publisher's own page. **One clears "modification allowed".**

### KC よむよむ — <https://www.jpf.go.jp/j/kansai/clip/yomyom/>

**CC BY-NC 2.1 日本**, verbatim on the page: 「クリエイティブ・コモンズ 表示 - 非営利 2.1 日本
ライセンスの下に提供されています。」 Attribution and non-commercial; **no ND**, so furigana,
segmentation and audio are allowed. Japan Foundation Kansai Center.

- 28 illustrated stories about life in Osaka: A1 ×7, A2 ×20, A2/B1 ×1. PDF + MP3.
- **PDFs carry real text.** Tested 2026-09-19 with pypdf on 001_taro and 006_kisetsu: ~800
  Japanese characters per book, furigana extracted as a separate kana run after each kanji
  (strippable). Not the baked-in-furigana walk-away case.
- Volume is small — roughly 20,000 characters across the set. A start for the library, not
  the library.
- **NC is the constraint.** Usable now, in the personal-use phase. A paid app needs JF Kansai's
  permission — they are one reachable licensor, unlike the ND wall at Tadoku. Ask them.

### Rejected, with evidence

- **読み物いっぱい** — 著作権フリー in name only: 「読み物の改変、編集、販売はできません」. ND and NC.
- **福娘童話集** (3,200 tales) — all rights reserved; 掲載について: 「個人・家庭・学校・図書館などの
  ほか他での使用は出来ません」.
- **Watanoc**, **たどくのひろば** (tadoku.info), **多読 日本語学習読本** (nihongotokuhon) — plain
  「All Rights Reserved」 footers, no licence.
- **Japan Foundation main site and Hirogaru/Marugoto** — 「private use」 only, no commercial
  use. KC よむよむ is the exception because it carries its own CC notice.
- **Wikijunior 日本語** — CC BY-SA 4.0, but ~15 encyclopedic books, mostly stubs. Not stories.
- **出入国在留管理庁 やさしい日本語** — the site is under 公共データ利用規約 (PDL 1.0): attribution,
  adaptation allowed. But the downloads are teaching guidance and workbooks, not passages.
  Nothing to ingest; the agency route stays "held in reserve" for exposition.
- **Japanese-language MCP servers** (mcp-jisho, JP-Organizer, japanophile-mcp, NihonGen) —
  dictionaries, flashcards and furigana tools. None serves texts, and Jisho is JMdict,
  which the repo already holds offline. Not a source.
- **Hugging Face** — no Japanese graded-reader or children's-story set under CC BY; the story
  sets there are synthetic (LLM-generated, banned here) and CC BY-NC.

---

*When a source is chosen: vet the actual license text against this checklist, then record the
decision in `book-four-bands.md` §5 and add a row to CLAUDE.md's data-sources table so
commits can cite it.*
