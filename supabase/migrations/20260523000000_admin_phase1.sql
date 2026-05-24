-- Suspend flag for user accounts (admin-controlled)
alter table users add column suspended boolean not null default false;

-- User-submitted feedback
create table feedback (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references users(id) on delete set null,
  type           text not null check (type in ('bug', 'suggestion', 'other')),
  message        text not null,
  status         text not null default 'open' check (status in ('open', 'reviewed', 'resolved')),
  screenshot_url text,
  created_at     timestamptz not null default now()
);

create index on feedback (status, created_at desc);

alter table feedback enable row level security;

-- Users can submit feedback and read their own
create policy "feedback: insert own" on feedback
  for insert with check (auth.uid() = user_id);

create policy "feedback: read own" on feedback
  for select using (auth.uid() = user_id);
