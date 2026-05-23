# Learning Paths

AburunGo guides learners through five sequential paths, from character recognition to active production. Each path builds on the previous one.

1. Characters — Hiragana + Katakana (phonetics)
2. Words — Vocabulary flashcards with heavy furigana
3. Kanji — Introduced through words already learned
4. Phrases — Real-life scenario phrases
5. Fill in the Blank — Active production

---

## Path 1 — Characters

Both hiragana and katakana are available from the start. Hiragana is the recommended and highlighted starting point — it is the foundation for reading Japanese and appears throughout the rest of the app. Katakana can be started at any time in parallel.

Characters are taught in two parts.

### Part 1 — Recognition

Each character is introduced through three stages in sequence:

1. **Sound** — See the character, hear its pronunciation. The learner associates the shape with the sound before anything else.
2. **Stroke with sound** — Animated stroke order plays alongside the audio. The learner watches how the character is drawn while hearing it.
3. **Combined lesson** — Audio + visual recognition quiz. Given the sound (or romaji), identify the character; or given the character, recall the reading.

### Part 2 — Production

Once a character passes the recognition threshold, drawing practice unlocks:

- The learner traces or draws the character freehand, guided by stroke order overlays.
- Each stroke is validated in sequence.
- Audio plays on completion so the sound stays linked to the written form.


---

## Path 2 — Words

Vocabulary flashcards with heavy furigana and audio. Builds the word-level foundation that Paths 3–5 depend on.

### Vocabulary source — Hybrid

Words come from two sources, merged into a single ordered queue per learner.

**Source A — Scenario deck words (first)**
The 20 scenario YAML decks (`server/content/decks/`) contain phrases. Each phrase is tokenised at seed time to extract individual words. Those words are looked up in JMdict to get canonical readings, meanings, and frequency data, then stored in the `words` table with a link back to the originating deck(s). These surface first in the queue — the learner sees the building blocks of phrases they will encounter in Path 4.

**Source B — JMdict frequency fill (after)**
Once scenario-deck words are exhausted (or the learner advances), JMdict words flow in ordered by JLPT level (N5 → N4 → N3) then by frequency rank. This broadens vocabulary beyond travel situations into everyday Japanese.

Words appearing in both sources are deduplicated — a word extracted from a deck that also exists in JMdict is one entry, tagged with both origins.

### Database changes required

A new `words` table, separate from the existing `cards` table (which holds full phrases):

```sql
create table words (
  id             uuid primary key default gen_random_uuid(),
  japanese       text not null,         -- kanji form where applicable
  reading        text not null,         -- hiragana reading
  romaji         text not null,
  meanings       text[] not null,       -- 1–3 English meanings, short
  jlpt_level     int,                   -- 5=N5 … 1=N1, null if unknown
  frequency_rank int,                   -- JMdict frequency ordering
  source         text not null,         -- 'deck' | 'jmdict' | 'both'
  jmdict_id      int,
  audio_url      text,
  created_at     timestamptz not null default now(),
  unique (japanese, reading)
);

-- Which scenario decks does this word appear in
create table word_deck_links (
  word_id  uuid not null references words(id) on delete cascade,
  deck_id  uuid not null references decks(id) on delete cascade,
  primary key (word_id, deck_id)
);

-- FSRS progress per user per word, with recognition/production phase
create table user_word_progress (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references users(id) on delete cascade,
  word_id               uuid not null references words(id) on delete cascade,
  phase                 text not null default 'recognition'
                          check (phase in ('recognition', 'production')),
  state                 fsrs_state not null default 'new',
  stability             float not null default 0,
  difficulty            float not null default 0,
  elapsed_days          int not null default 0,
  scheduled_days        int not null default 0,
  reps                  int not null default 0,
  lapses                int not null default 0,
  due_at                timestamptz not null default now(),
  last_review_at        timestamptz,
  -- production unlocks when recognition reps reach this threshold
  production_unlocked   boolean not null default false,
  unique (user_id, word_id, phase)
);
```

`review_logs` needs a `word_id uuid references words(id)` column added (nullable, alongside the existing `card_id`).

### Card mechanic — recognition first, production unlocks

Each word has two sides in the SRS queue, but production is gated.

**Recognition phase** (always first):
- Front: Japanese word in large type, furigana shown above kanji, audio button.
- Back: English meanings (up to 3), romaji, one example sentence if available (Tatoeba).
- Rating: got-it / didn't (binary, matching the app's no-gamification rule).

**Production phase** (unlocks after 3 consecutive correct recognitions):
- Front: English meaning prompt.
- Back: Japanese word with furigana and audio.
- Input: type the reading in hiragana/romaji (auto-converted), or speak it.
- When production unlocks, a new FSRS row is inserted for that word with `phase = 'production'`. Both phases then run independently in the SRS queue.

### Queue ordering

1. Due recognition cards (FSRS `due_at <= now`), ordered by `due_at` ascending.
2. New recognition cards — scenario-deck words first (ordered by deck `display_order`, then card `display_order`), then JMdict words by JLPT level then frequency rank.
3. Due production cards interleaved after recognition, capped so production never outnumbers recognition in a single session.

### Furigana

Furigana is always shown in Path 2. A word's furigana is hidden in later paths only once the learner has explicitly marked the corresponding kanji as known in Path 3.

### Seeding pipeline

1. Parse each deck YAML in `server/content/decks/`.
2. Tokenise each phrase's `japanese` field using kuromoji (or ichiran) to extract surface forms.
3. Look each token up in JMdict by surface form and reading to get `jmdict_id`, canonical reading, meanings, JLPT level, frequency rank.
4. Insert into `words` (upsert on `japanese, reading`), insert `word_deck_links`.
5. Separately, seed the full JMdict N5–N3 set into `words` (upsert — deck-sourced words already present will just get their `source` updated to `'both'`).

---

## Path 3 — Kanji

Kanji are introduced through words the learner already knows from Path 2. Approximately 90% of kanji surfaced in this path appear in words already studied — the learner sees the kanji in a familiar context rather than in isolation. The remaining ~10% are new, easy, high-frequency kanji worth knowing early even if the word hasn't been seen yet.

Furigana is shown heavily throughout. A kanji is only hidden (furigana removed) once the learner has explicitly marked it as known.

_Lesson structure TBD_

---

## Path 4 — Phrases

Useful phrases for visiting Japan, organised by real-life scenario (restaurant, transit, hotel, shopping, etc.). Furigana shown on any kanji not yet learned in Path 3.

_Details TBD_

---

## Path 5 — Fill in the Blank

Active production: given an English prompt, type or speak the complete Japanese word or phrase.

_Details TBD_
