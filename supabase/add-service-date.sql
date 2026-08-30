-- Plat du jour weekly planning.
-- Run once on an existing project; supabase/schema.sql already includes this
-- for a fresh one. Safe to re-run.

alter table specials add column if not exists service_date date;

create index if not exists specials_service_date_idx on specials (service_date, sort_order);

-- Existing specials keep service_date NULL, which means "show every day".
-- Give a plat a date and it only appears to guests on that calendar day.
