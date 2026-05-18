# AburunGo — Data Sources & API Research

Research date: 2026-05-17

---

## 1. JMdict via jmdict-simplified

**Use for:** Vocabulary backbone (~213k entries).

**Repo:** https://github.com/scriptin/jmdict-simplified  
**Release cadence:** Automated weekly releases every Monday. Latest: `3.6.2+20260511143416`.

**Format:** Clean JSON (no `null` fields), TypeScript types available via `@scriptin/jmdict-simplified-types`. Four files per release:
- `jmdict-eng-3.x.x.json` — 113–115 MB, 213,268 entries
- `jmdict-eng-examples-3.x.x.json` — 67–68 MB (limited library support)
- `kanjidic2-3.x.x.json` — 15 MB, 13,108 kanji

**Postgres import:** No official tooling. Pattern: load into a `jsonb` staging column via `COPY`, then extract to relational tables. File size (113 MB+) requires streaming/chunked ingestion.

**License — read carefully:**  
The CLAUDE.md mentions "JMdict for Applications (CC BY 4.0)" but research found **no such variant in EDRDG's official documentation**. The actual license is **CC BY-SA 4.0** with additional requirements:
- On-screen attribution required on every screen displaying dictionary data
- Derived works must use the same license
- The jmdict-simplified *code/types packages* are MIT; the *data* is CC BY-SA 4.0

**Action:** Confirm license terms at https://www.edrdg.org/edrdg/licence.html before monetizing. For a non-commercial or correctly-attributed app, CC BY-SA 4.0 is fine.

---

## 2. Tatoeba

**Use for:** Example sentences (~17 MB Japanese-English subset) linked back to JMdict entries.

**Download:** https://downloads.tatoeba.org/exports/ (updated regularly; files last modified May 9, 2026)

**Key files:**

| File | Compressed | Uncompressed | Purpose |
|---|---|---|---|
| `sentences_detailed.tar.bz2` | 286 MB | 1.3 GB | All sentences, all languages |
| `jpn_indices.tar.bz2` | 2.7 MB | 17 MB | Japanese sentence ↔ JMdict cross-refs |
| `links.tar.bz2` | 141 MB | 428 MB | Translation pairs |

**Format:** Tab-separated CSV. `jpn_indices.csv` uses the older EDICT-style cross-reference format — mapping to jmdict-simplified's JSON schema requires parsing. Many Japanese sentences originate from the **Tanaka Corpus** (public domain).

**License:** CC BY 2.0 FR (sentences). Audio files have per-contributor licenses (separate from text).

**Gotcha:** The EDICT cross-reference format in `jpn_indices` doesn't map 1:1 to jmdict-simplified field names — write a small normalizer.

---

## 3. KanjiAPI.dev

**Use for:** Seeding the kanji table (2,136 Jōyō kanji with readings, meanings, JLPT levels, grade).

**Base URL:** `https://kanjiapi.dev/v1/`

| Endpoint | Returns |
|---|---|
| `GET /kanji/joyo` | List of 2,140 Jōyō characters |
| `GET /kanji/{char}` | Readings, meanings, stroke count, JLPT, grade, Unicode |
| `GET /words/{char}` | Example words |

**Auth:** None required.  
**Rate limits:** None documented. Endpoints are pre-built static files on Google Cloud Storage — no live server to throttle.

**Bulk seeding strategy:** Fetch `/kanji/joyo` for the list, then iterate with small delays. ~2,140 requests for full Jōyō coverage. Cache responses locally before importing to DB to avoid re-fetching.

**Gotcha:** No bulk export endpoint. JLPT level data comes from community lists, not official JLPT sources.

**Alternative:** Use the KANJIDIC2 JSON from jmdict-simplified directly (same underlying data, already downloaded as part of the vocabulary seed).

---

## 4. KanjiVG

**Use for:** SVG stroke order diagrams, bundled statically with the app.

**Repo:** https://github.com/KanjiVG/kanjivg  
**Latest release:** r20250816 (August 2025)  
**Coverage:** ~6,500 kanji

**Download options:**
- `kanjivg-{date}-main.zip` — one SVG per kanji (recommended)
- `kanjivg-{date}-all.zip` — includes variants (alternate stroke orders)
- `kanjivg-{date}-stripped.zip` — pure SVG paths, KanjiVG attributes removed

**File naming:** 5-digit zero-padded lowercase hex Unicode codepoint + `.svg`.  
Example: 日 (U+65E5) → `065e5.svg`

**Canvas:** 109×109 px. KanjiVG XML attributes in `main`/`all` releases include stroke groupings and radical decomposition — useful for animated stroke order via `kanji.js` or `kanjivg-animate`.

**License:** CC BY-SA **3.0** (not 4.0). Requires attribution. For simply *displaying* SVGs without redistributing modified files, standard in-app credit to KanjiVG satisfies the requirement.

---

## 5. KANJIDIC2

**Use for:** Offline kanji data if not using KanjiAPI.dev or the jmdict-simplified JSON bundle.

**Download:** `https://www.edrdg.org/kanjidic/kanjidic2.xml.gz` (gzipped XML, UTF-8)  
**Coverage:** 13,108 kanji, multiple languages

**License:** CC BY-SA 4.0 — **except SKIP codes, which are CC BY-NC-SA 4.0** (non-commercial only). If the app is commercial and uses SKIP pattern search, obtain separate permission from the maintainer.

**Recommendation:** Use the jmdict-simplified JSON bundle (`kanjidic2-3.x.x.json`) instead of parsing the raw XML — same data, already structured.

---

## 6. VOICEVOX (Self-hosted TTS)

**Use for:** Pre-generating audio for fixed vocabulary set at seed/build time; zero per-request cost.

**Docker image:** `voicevox/voicevox_engine`  
**Tags:** `cpu-latest` (1.8 GB), `nvidia-latest`. Use a pinned stable version tag — `0.26.x` visible on Docker Hub is pre-release dev.  
**Port:** 50021

**Synthesis workflow (two-step):**
```
POST /audio_query?text={text}&speaker={style_id}   → AudioQuery JSON
POST /synthesis?speaker={style_id}  (body: AudioQuery) → WAV audio
```

**Useful endpoints:**
- `GET /speakers` — list all voices with `style_id` values
- `POST /initialize_speaker` — pre-warm a voice (do this before batch runs)
- `POST /multi_synthesis` — batch synthesis, returns ZIP of WAVs

**Voice attribution:** Display `VOICEVOX:[Character Name]` somewhere in the app per voice terms.

**Pre-generation pipeline notes:**
- CPU synthesis runs at roughly real-time speed; plan accordingly for large vocabulary sets.
- `multi_synthesis` is cleanest for batch jobs.
- No async/queue support — synthesis calls are blocking. Run pre-generation in a script at seed time, store WAVs in Supabase Storage.

---

## 7. Web Speech API (Browser STT)

**V1 decision: selected.** Primary STT for fill-in-the-blank audio input.

**Browser support:**

| Browser | Status |
|---|---|
| Chrome / Edge (desktop) | Full support — audio sent to Google's servers |
| Safari macOS / iOS | Supported (on-device, more private) |
| Firefox | Flag-gated in `about:config`, not shipped to end users by default |
| Opera / IE | Never shipped |

**Setup:** `SpeechRecognition.lang = 'ja-JP'`. HTTPS required (no HTTP).

**Firefox:** Not a V1 concern. Show a graceful "microphone not supported" message and move on.

**Upgrade path:** `gpt-4o-transcribe` (see section 8) when mobile support or higher accuracy is needed.

---

## 8. OpenAI Whisper API (STT upgrade path)

**Use for:** Server-side STT when Web Speech API isn't sufficient (mobile, Firefox, higher accuracy).

**Endpoint:** `POST https://api.openai.com/v1/audio/transcriptions`

**Recommended model:** `gpt-4o-transcribe` (newer, better accuracy than legacy `whisper-1`, similar price).

| Model | Price |
|---|---|
| `whisper-1` (legacy) | $0.006/min |
| `gpt-4o-mini-transcribe` | ~$0.003/min |
| `gpt-4o-transcribe` | ~$0.006/min |

**Request:** Pass `language: 'ja'` explicitly — improves accuracy and reduces latency vs. auto-detection.  
**Format:** WebM from browser `MediaRecorder` is accepted directly (no transcoding).  
**Limit:** 25 MB max file size — chunk longer recordings.

---

## 9. Claude Haiku (Conversation Sessions)

**Use for:** Casual conversation sessions with persona + JLPT difficulty via system prompt.

**Model ID:** `claude-haiku-4-5`  
**Context window:** 200,000 tokens input / 64,000 tokens max output

**Pricing:**

| | Price |
|---|---|
| Input tokens | $1.00 / 1M |
| Output tokens | $5.00 / 1M |
| Cache write | $1.25 / 1M |
| Cache read | $0.10 / 1M |
| Batch API | 50% discount |

**Cost optimization:** Cache the system prompt (persona + JLPT instructions). Cache reads cost $0.10/1M vs $1.00/1M for standard input — up to 90% savings on the static portion of every turn.

**Note:** Do not confuse with `claude-3-haiku-20240307` (older) or `claude-haiku-3-5`. The current model is `claude-haiku-4-5`.

---

## 10. OpenAI Realtime API (Voice Conversation — Future Consideration)

**Use for:** Full voice-in/voice-out conversation mode (post-V1, if desired).

**Model:** `gpt-4o-realtime-preview` / `gpt-4o-mini-realtime-preview`

**Pricing (uncached):**
- Audio input: ~$0.06/min
- Audio output: ~$0.24/min
- Practical: **$0.18–$0.46/min** per conversation; drops to ~$0.05–$0.10/min with caching

**Integration:** WebRTC (browser-friendly) or WebSocket. Handles audio end-to-end in one model — lower latency than STT → LLM → TTS chains.

**Honest assessment:** Integration complexity is significant (2–4 weeks for robust implementation: interruption handling, audio buffer management, error recovery). For a language learning app, a simpler Whisper STT → Claude Haiku → VOICEVOX TTS pipeline achieves similar results at lower cost and complexity. Reserve Realtime API for a "voice immersion mode" feature if there is clear user demand.

---

## Decision Summary

| Component | V1 Choice | Notes |
|---|---|---|
| Vocabulary data | jmdict-simplified JSON → Postgres | Confirm CC BY-SA 4.0 attribution on every dictionary screen |
| Example sentences | Tatoeba `jpn_indices` + `sentences_detailed` | Write normalizer for EDICT cross-ref format |
| Kanji data | jmdict-simplified `kanjidic2` JSON | Avoids extra API calls; same data as KanjiAPI.dev |
| Kanji seeding fallback | KanjiAPI.dev | Use if jmdict-simplified coverage is insufficient |
| Stroke order | KanjiVG r20250816 `main.zip` | Bundle as static assets; credit in app footer |
| TTS (static vocab) | VOICEVOX self-hosted Docker, CPU tag | Pre-generate at seed time; store in Supabase Storage |
| TTS (dynamic) | Google Neural2 / Azure Nanami | Per CLAUDE.md; only for user-typed dynamic sentences |
| STT V1 | Web Speech API (`ja-JP`) | Graceful fallback for Firefox |
| STT upgrade | OpenAI `gpt-4o-transcribe` | Better than legacy `whisper-1`; same price |
| Conversation AI | Claude Haiku (`claude-haiku-4-5`) | Cache system prompt; use Batch API for non-real-time |
| Voice conversation | Skip for V1 | Revisit if voice immersion is a priority feature |
