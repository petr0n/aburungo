---
name: aburungo-data-sources
description: AburunGo's upstream data sources and their licenses - JMdict, Tatoeba, KANJIDIC2, KanjiVG, KRADFILE, KC yomu yomu graded readers, VOICEVOX, STT and conversation APIs. Use when sourcing or citing Japanese content, adding a new data source, checking what a license permits, or wiring an ingestion script.
---

# AburunGo data sources

| Data                 | Source                                     | License               |
| -------------------- | ------------------------------------------ | --------------------- |
| Vocabulary / phrases | JMdict ("JMdict for Applications" variant) | CC BY 4.0             |
| Example sentences    | Tatoeba TSV download + `jpn_indices.csv`   | CC BY 2.0 FR          |
| Graded readers (Book Three library) | KC よむよむ, Japan Foundation Kansai Center — `data/reading/kc-yomyom.json` | CC BY-NC 2.1 JP (non-commercial; ask JF Kansai before any paid release) |
| Kanji (~2136 Joyo)   | KANJIDIC2 / KanjiAPI.dev                   | CC BY-SA 4.0          |
| Stroke order SVGs    | KanjiVG (bundled)                          | CC BY-SA 3.0          |
| Kanji components     | KRADFILE via krad-unicode                  | CC BY-SA 3.0          |
| TTS audio (static)   | VOICEVOX (self-hosted, pre-generated)      | Per-voice terms       |
| TTS audio (dynamic)  | Google Neural2 / Azure Nanami              | Paid                  |
| STT                  | Web Speech API (V1) → OpenAI Whisper API   | Free / $0.006/min     |
| Conversation AI      | Claude Haiku via Anthropic API             | $0.80/$4 per M tokens |

Approved and rejected source verdicts, and the deferred Book Four news/exposition
candidates, are in `docs/data-sources.md`.
