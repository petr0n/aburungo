-- Server-durable ladder position (DR-016).
--
-- PathProgress previously lived only in IndexedDB, which Safari's ITP clears
-- after 7 days without site interaction. One row per user per path; seen units
-- are an ordered text[] because the set is small (35 units at N5) and is always
-- read whole.
create table user_path_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references users(id) on delete cascade,
  path_id       text not null,
  seen_unit_ids text[] not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id, path_id)
);

create index on user_path_progress (user_id);

alter table user_path_progress enable row level security;

create policy "user_path_progress: own rows" on user_path_progress
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
