-- Salinas — optional serving note under a category name, in both languages:
-- "servi avec riz ou attiéké" / "يقدم مع الأرز أو الأتييكيه".
-- Run once in the Supabase SQL editor; safe to re-run, and safe to re-run if
-- you already ran the earlier version that added only `note`.
--
-- Nullable with no default. Each line renders only if it has text, so a
-- category can carry both, one, or neither.

alter table categories add column if not exists note        text;
alter table categories add column if not exists note_arabic text;

select id, name, note, note_arabic from categories order by sort_order;
