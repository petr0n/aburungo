# Adding Content to AburunGo

All vocabulary decks live in `server/content/decks/`. Each file is one deck.
Seeding is idempotent — you can re-run any seed command as many times as you like.

---

## Quick start: add a new deck

1. Create a new file in `server/content/decks/` following the naming convention `NN-slug.yaml` where `NN` is the next display order number.

2. Fill in the required fields:

```yaml
slug: my-new-deck          # URL-safe, lowercase, hyphens only
title_en: My New Deck
title_ja: 新しいデッキ
description: What this deck covers in one sentence
display_order: 21          # Controls the order decks appear in the UI

cards:
  - japanese: おはようございます
    reading: おはようございます
    romaji: ohayou gozaimasu
    english: Good morning.
    notes: Optional context note. Explain when/how to use the phrase.

  - japanese: こんにちは
    reading: こんにちは
    romaji: konnichiwa
    english: Hello.
```

3. Seed it:

```sh
cd server
npm run seed:decks   # upserts the new deck row
npm run seed:cards   # upserts the cards (requires decks to exist first)
```

---

## Add cards to an existing deck

Open the deck's YAML file and append to the `cards` list. Then re-run:

```sh
npm run seed:cards
```

Only new cards (matched by `japanese` text within the deck) are inserted.
Existing cards have their `reading`, `romaji`, `english`, `notes`, and `display_order` updated.

---

## Rename or reorder a deck

- **Rename:** change `title_en` or `title_ja` and re-run `seed:decks`. The slug is the stable identifier.
- **Reorder:** change `display_order` values and re-run `seed:decks`.
- **Change a slug:** do not do this lightly — it orphans existing `user_card_progress` rows. If you must, write a migration that updates the slug and migrates foreign keys.

---

## Full re-seed

```sh
npm run seed
```

This runs decks → cards → kanji in order. Kanji takes several minutes (fetches ~2136 entries from KanjiAPI.dev in batches).

To skip kanji:

```sh
npm run seed:decks && npm run seed:cards
```

---

## Content rules

- **Real Japanese only.** Every phrase must be natural, polite-register Japanese that a native speaker would recognise and use. No fabricated or placeholder content.
- **Consistent register.** Default to polite forms (-masu/-desu) unless the deck is explicitly casual (e.g. small-talk between friends).
- **Reading field:** full hiragana/katakana reading of the `japanese` field, including any kanji. Do not include the romaji here.
- **Romaji field:** Hepburn romanisation. Use macrons for long vowels (ō, ū) or double vowels (oo, uu) — be consistent within a deck.
- **Notes field:** optional but encouraged. Explain when/how to use the phrase, cultural context, register differences, or common alternatives. Keep it under 3 sentences.
- **Unique japanese per deck.** Two cards with the same `japanese` string in the same deck will be treated as one card on upsert.

---

## File layout

```
server/
  content/
    decks/
      01-greetings.yaml
      02-restaurant.yaml
      ...                  ← add your file here
    schema.ts              ← Zod validation schema (don't edit lightly)
    ADDING_CONTENT.md      ← this file
  scripts/
    seed.ts                ← orchestrator (npm run seed)
    seed-decks.ts          ← reads YAML, upserts decks table
    seed-cards.ts          ← reads YAML, upserts cards table
    seed-kanji.ts          ← fetches from KanjiAPI.dev, upserts kanji table
```

---

## Validation errors

When you run a seed, each YAML file is validated against `content/schema.ts` before any DB writes. If a file is invalid, the seed stops and prints the file name and error.

Common mistakes:
- Missing required fields (`slug`, `title_en`, `title_ja`, `description`, `display_order`, `cards`)
- Slug contains uppercase letters or spaces (must match `/^[a-z0-9-]+$/`)
- `display_order` is not a positive integer
- `cards` array is empty
