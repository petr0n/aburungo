-- Types
create type fsrs_state as enum ('new', 'learning', 'review', 'relearning');
create type review_rating as enum ('again', 'hard', 'good', 'easy');
create type session_type as enum (
  'flashcard', 'fill_blank', 'kana_practice',
  'kanji', 'audio_input', 'conversation'
);

-- User profiles (extends Supabase auth.users)
create table users (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Thematic groupings of cards
create table decks (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title_en      text not null,
  title_ja      text not null,
  description   text,
  display_order int not null default 0,
  created_at    timestamptz not null default now()
);

-- Individual phrase/vocabulary cards
create table cards (
  id            uuid primary key default gen_random_uuid(),
  deck_id       uuid not null references decks(id) on delete cascade,
  japanese      text not null,
  reading       text not null,
  romaji        text not null,
  english       text not null,
  notes         text,
  audio_url     text,
  jmdict_id     int,
  display_order int not null default 0,
  created_at    timestamptz not null default now()
);

-- ~2136 Joyo kanji seeded from KANJIDIC2
create table kanji (
  id            uuid primary key default gen_random_uuid(),
  character     char(1) unique not null,
  meanings      text[] not null,
  on_readings   text[],
  kun_readings  text[],
  stroke_count  int,
  jlpt_level    int,
  joyo_grade    int,
  frequency     int,
  kanjivg_svg   text,
  created_at    timestamptz not null default now()
);

-- Many-to-many: which kanji appear in which cards
create table card_kanji (
  card_id   uuid not null references cards(id) on delete cascade,
  kanji_id  uuid not null references kanji(id) on delete cascade,
  primary key (card_id, kanji_id)
);

-- FSRS progress per user per card
create table user_card_progress (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references users(id) on delete cascade,
  card_id         uuid not null references cards(id) on delete cascade,
  state           fsrs_state not null default 'new',
  stability       float not null default 0,
  difficulty      float not null default 0,
  elapsed_days    int not null default 0,
  scheduled_days  int not null default 0,
  reps            int not null default 0,
  lapses          int not null default 0,
  due_at          timestamptz not null default now(),
  last_review_at  timestamptz,
  unique (user_id, card_id)
);

-- FSRS progress per user per kanji
create table user_kanji_progress (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references users(id) on delete cascade,
  kanji_id        uuid not null references kanji(id) on delete cascade,
  state           fsrs_state not null default 'new',
  stability       float not null default 0,
  difficulty      float not null default 0,
  elapsed_days    int not null default 0,
  scheduled_days  int not null default 0,
  reps            int not null default 0,
  lapses          int not null default 0,
  due_at          timestamptz not null default now(),
  last_review_at  timestamptz,
  unique (user_id, kanji_id)
);

-- Review sessions
create table sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references users(id) on delete cascade,
  type            session_type not null,
  deck_id         uuid references decks(id),
  started_at      timestamptz not null default now(),
  ended_at        timestamptz,
  cards_reviewed  int not null default 0,
  correct         int not null default 0
);

-- Immutable log of every review event
create table review_logs (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references users(id) on delete cascade,
  session_id       uuid not null references sessions(id) on delete cascade,
  card_id          uuid references cards(id),
  kanji_id         uuid references kanji(id),
  rating           review_rating not null,
  stability_after  float,
  scheduled_days   int,
  reviewed_at      timestamptz not null default now()
);

-- Conversation session messages
create table conversation_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references sessions(id) on delete cascade,
  role        text not null check (role in ('user', 'assistant', 'system')),
  content     text not null,
  created_at  timestamptz not null default now()
);

-- Indexes
create index on cards (deck_id);
create index on user_card_progress (user_id, due_at);
create index on user_card_progress (user_id, state);
create index on user_kanji_progress (user_id, due_at);
create index on user_kanji_progress (user_id, state);
create index on review_logs (user_id, reviewed_at);
create index on sessions (user_id, started_at);
create index on conversation_messages (session_id, created_at);

-- Row-level security
alter table users enable row level security;
alter table user_card_progress enable row level security;
alter table user_kanji_progress enable row level security;
alter table sessions enable row level security;
alter table review_logs enable row level security;
alter table conversation_messages enable row level security;

-- Users can only read/write their own rows
create policy "users: own row" on users
  using (auth.uid() = id) with check (auth.uid() = id);

create policy "user_card_progress: own rows" on user_card_progress
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user_kanji_progress: own rows" on user_kanji_progress
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "sessions: own rows" on sessions
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "review_logs: own rows" on review_logs
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "conversation_messages: own session" on conversation_messages
  using (
    exists (
      select 1 from sessions
      where sessions.id = conversation_messages.session_id
      and sessions.user_id = auth.uid()
    )
  );

-- Content tables are read-only for all authenticated users
alter table decks enable row level security;
alter table cards enable row level security;
alter table kanji enable row level security;
alter table card_kanji enable row level security;

create policy "decks: read-only" on decks for select using (auth.role() = 'authenticated');
create policy "cards: read-only" on cards for select using (auth.role() = 'authenticated');
create policy "kanji: read-only" on kanji for select using (auth.role() = 'authenticated');
create policy "card_kanji: read-only" on card_kanji for select using (auth.role() = 'authenticated');
