-- Salinas — switch menu writes from "signed-in staff" to "anyone".
--
-- Run this ONLY because the admin panel uses a static passcode checked in the
-- browser instead of Supabase Auth. A browser-side check cannot gate the
-- database, so the anon key must be allowed to write.
--
-- WHAT THIS MEANS: anyone who opens the site can read the publishable key from
-- the page source and then add, edit, or delete menu rows and upload photos by
-- calling the REST API directly. The passcode screen does not stop them — it
-- is a lock on the door of a room with no walls.
--
-- TO REVERT: re-run supabase/schema.sql. It drops and recreates these policies
-- as authenticated-only.

do $$
declare t text;
begin
  foreach t in array array['categories', 'dishes', 'specials'] loop
    execute format('drop policy if exists "staff write %1$s" on %1$I', t);
    execute format('drop policy if exists "open write %1$s" on %1$I', t);
    execute format(
      'create policy "open write %1$s" on %1$I for all to anon using (true) with check (true)', t);
  end loop;
end $$;

-- Photo uploads need the same treatment.
drop policy if exists "staff write photos" on storage.objects;
drop policy if exists "open write photos"  on storage.objects;

create policy "open write photos" on storage.objects
  for all to anon
  using (bucket_id = 'menu-photos')
  with check (bucket_id = 'menu-photos');
