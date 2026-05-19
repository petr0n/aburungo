-- review_logs.session_id is optional until session tracking is wired end-to-end
alter table review_logs alter column session_id drop not null;
