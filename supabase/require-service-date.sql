-- Plat du jour must belong to a day.
--
-- The app used to allow an undated "always showing" plat. That concept is
-- gone: a plat du jour is always tied to one calendar day, so the admin panel
-- no longer displays or creates undated rows.
--
-- Any rows left over from before are now invisible in both the panel and the
-- guest menu. Pick ONE of the two blocks below, then run the constraint.

-- OPTION A — give the leftovers a day (edit the date, then run):
-- update specials set service_date = '2026-09-01' where service_date is null;

-- OPTION B — delete them. THIS CANNOT BE UNDONE:
-- delete from specials where service_date is null;

-- Then lock the rule in so it cannot happen again:
-- alter table specials alter column service_date set not null;
