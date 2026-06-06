-- Add vocabulary metadata columns to the cards table.
--
-- card_type distinguishes standalone vocabulary words from situational phrases.
-- word_type and verb_class are populated for word cards; null for phrase cards.
-- verb_class is a data field used server-side to generate polite forms — it is
-- never surfaced directly to learners.

alter table cards
  add column if not exists card_type text not null default 'phrase'
    check (card_type in ('phrase', 'word')),
  add column if not exists word_type text
    check (word_type in ('noun', 'verb', 'i-adj', 'na-adj', 'adverb', 'counter')),
  add column if not exists verb_class text
    check (verb_class in ('ru', 'u', 'irregular'));
