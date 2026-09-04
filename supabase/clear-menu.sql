-- Salinas — clear the menu and start fresh.
--
-- Deletes every category and every dish. Plat du jour is left alone on purpose:
-- clear that from the admin panel with "Start new week", which also deletes the
-- plats' photos. Run the steps one at a time in the Supabase SQL editor.
--
-- WHAT THIS CANNOT DO: remove the photos. SQL only reaches the menu tables, so
-- every uploaded file stays in the `menu-photos` bucket and keeps counting
-- against the free tier. Step 1 lists what is about to be orphaned; delete
-- those in the dashboard under Storage → menu-photos.
--
-- There is no undo. Nothing here is reversible once step 2 runs.


-- STEP 1 — dry run. What exists now, and which photos will be left stranded.

select
  (select count(*) from categories) as categories,
  (select count(*) from dishes)     as dishes,
  (select count(*) from specials)   as specials_kept;

select regexp_replace(image_url, '^.*/menu-photos/', '') as orphaned_file
from (
  select image_url from categories
  union all
  select image_url from dishes
) t
where image_url like '%/menu-photos/%'
order by 1;


-- STEP 2 — the delete. `dishes` first so its count is its own; dropping the
-- categories alone would cascade and take the dishes silently.

delete from dishes;
delete from categories;


-- STEP 3 — verify. Both counts must be 0, and the plats must still be there.

select
  (select count(*) from categories) as categories_left,
  (select count(*) from dishes)     as dishes_left,
  (select count(*) from specials)   as specials_kept;


-- STEP 4 (optional) — put the starter menu back by running supabase/seed.sql.
-- Skip it to build the menu from scratch in the admin panel instead.
