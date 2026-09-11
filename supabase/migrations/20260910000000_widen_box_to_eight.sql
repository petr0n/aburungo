-- Widen user_content_progress.box from 1-5 to 1-8.
--
-- The client has scheduled eight boxes since the graduation change (DR-035);
-- the API and this constraint still said five. Six correct answers on one item
-- put it in box 6, and the batch push in hydrateFromServer then failed
-- validation -- taking EVERY item in that batch with it, not just the one out
-- of range. Review-state sync stopped for the account at that point, silently,
-- because the client suppresses the failure.
--
-- Append-only, per the graduation spec: the original migration is not edited
-- and no row is reset. Widening a check constraint cannot invalidate existing
-- rows, so this is safe to apply forward. Values outside 1-8 are still
-- rejected.
alter table public.user_content_progress
  drop constraint if exists user_content_progress_box_check;

alter table public.user_content_progress
  add constraint user_content_progress_box_check
  check (box between 1 and 8);
