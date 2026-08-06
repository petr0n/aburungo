-- Server-durable review state for the /learn daily loop (DR-018).
--
-- LearnPage wrote every review to IndexedDB only, so a learner's entire N5
-- history lived in storage Safari clears after 7 days idle. DR-016 made ladder
-- position durable but not what was actually learned in that same flow.
--
-- Keyed by content id (vocab.totemo, greetings.hello, grammar.n5-unit-1) rather
-- than by a cards row: words, phrases and grammar patterns all live in YAML in
-- the repo, and seeding them into Postgres would duplicate the content and put
-- it beyond reach of the commit-message source citations the content rules
-- require. Only the pointer and the schedule live here — never the Japanese.
--
-- FK targets auth.users directly, per the lesson in 20260805000000: public.users
-- requires a profile row that may not exist.
create table user_content_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  content_id   text not null,
  box          int not null default 1 check (box between 1 and 5),
  due_at       timestamptz not null,
  last_seen_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, content_id)
);

create index on user_content_progress (user_id, due_at);

alter table user_content_progress enable row level security;

create policy "user_content_progress: own rows" on user_content_progress
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
