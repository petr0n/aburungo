-- Finish the job started by 20260601000000_fix_review_schema.sql.
--
-- That migration re-pointed user_card_progress, user_kanji_progress, sessions and
-- review_logs from public.users to auth.users, because writing progress must not
-- require a profile row to exist first. It missed user_kana_progress (created two
-- days earlier) and feedback, and user_path_progress later inherited the same
-- defect by using the kana migration as a template.
--
-- Effect of the bug: public.users is empty (its trigger only fires for signups
-- after 2026-06-01, and all existing users predate it), so every insert into
-- these three tables fails with a foreign key violation. Confirmed in production:
-- POST /api/progress/path returned 500, and user_kana_progress had 0 rows.

alter table user_kana_progress
  drop constraint user_kana_progress_user_id_fkey,
  add constraint user_kana_progress_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade;

alter table user_path_progress
  drop constraint user_path_progress_user_id_fkey,
  add constraint user_path_progress_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade;

alter table feedback
  drop constraint feedback_user_id_fkey,
  add constraint feedback_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade;

-- Backfill the profile rows the trigger never created, so anything that still
-- joins through public.users sees every existing user.
insert into public.users (id)
select id from auth.users
on conflict (id) do nothing;
