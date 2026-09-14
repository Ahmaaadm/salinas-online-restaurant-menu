-- Salinas — optional note under a dish, in both languages:
-- "pour 2 personnes" / "لشخصين".
-- Run once in the Supabase SQL editor; safe to re-run.
--
-- Nullable with no default. Each line renders only if it has text, so a dish
-- can carry both, one, or neither, and a dish with none looks exactly as it
-- does today — nothing is reserved, no empty line.

alter table dishes add column if not exists note        text;
alter table dishes add column if not exists note_arabic text;

select id, name, note, note_arabic from dishes order by category_id, sort_order;
