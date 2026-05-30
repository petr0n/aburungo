-- Add JLPT level to decks so stats can be broken down by tier
alter table decks add column jlpt_level int;

create index on decks (jlpt_level);

-- Kana recognition + recall progress per user per character
-- Not FSRS-based: threshold model (recognized_count >= 3, recalled_count >= 3)
create table user_kana_progress (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references users(id) on delete cascade,
  character        text not null,
  script           text not null check (script in ('hiragana', 'katakana')),
  recognized_count int not null default 0,
  recalled_count   int not null default 0,
  last_seen_at     timestamptz,
  created_at       timestamptz not null default now(),
  unique (user_id, character)
);

create index on user_kana_progress (user_id, script);

alter table user_kana_progress enable row level security;

create policy "user_kana_progress: own rows" on user_kana_progress
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
