-- Allows seed-cards to upsert on (deck_id, japanese) without duplicates
alter table cards add constraint cards_deck_japanese_unique unique (deck_id, japanese);
