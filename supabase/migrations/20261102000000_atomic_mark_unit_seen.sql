-- Append a lesson to a learner's seen list in one statement.
--
-- markUnitSeen used to read the list, append in the server, and write the whole
-- list back. Two saves in flight at once could then lose a lesson: each reads
-- [a], one writes [a, b], the other writes [a, c] over it. That was safe while
-- the client waited for each save before the next; it stopped being safe when
-- lesson saves went to the background so a stalled save cannot freeze /learn
-- (issue #156). Here the upsert holds the row lock while it appends, so
-- concurrent calls queue instead of overwriting each other.
create function mark_unit_seen(p_user_id uuid, p_path_id text, p_unit_id text)
returns text[]
language sql
as $$
  insert into user_path_progress (user_id, path_id, seen_unit_ids)
  values (p_user_id, p_path_id, array[p_unit_id])
  on conflict (user_id, path_id) do update
    set seen_unit_ids = case
          when p_unit_id = any(user_path_progress.seen_unit_ids) then user_path_progress.seen_unit_ids
          else array_append(user_path_progress.seen_unit_ids, p_unit_id)
        end,
        updated_at = now()
  returning seen_unit_ids;
$$;

-- Server only. It takes a user id as an argument, so it must not be callable
-- with a learner's own token through the public API.
revoke execute on function mark_unit_seen(uuid, text, text) from public, anon, authenticated;
grant execute on function mark_unit_seen(uuid, text, text) to service_role;
