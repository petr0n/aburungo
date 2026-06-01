-- Fix 1: review_logs.session_id was NOT NULL but submitReview inserts without
-- a session. Make it optional so per-card reviews can be logged independently.
alter table review_logs
  alter column session_id drop not null;

-- Fix 2: progress tables reference users(id), which requires a row in the
-- public users profile table. Re-point them at auth.users(id) directly so
-- any authenticated user can write progress regardless of whether a profile
-- row exists yet.
alter table user_card_progress
  drop constraint user_card_progress_user_id_fkey,
  add constraint user_card_progress_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade;

alter table user_kanji_progress
  drop constraint user_kanji_progress_user_id_fkey,
  add constraint user_kanji_progress_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade;

alter table sessions
  drop constraint sessions_user_id_fkey,
  add constraint sessions_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade;

alter table review_logs
  drop constraint review_logs_user_id_fkey,
  add constraint review_logs_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade;

-- Auto-create a profile row when a new user signs up so the users table
-- stays consistent for any code that still joins through it.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
