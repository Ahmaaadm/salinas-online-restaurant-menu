-- Salinas online menu — run this once in the Supabase SQL editor.
-- Public visitors can read the menu; only signed-in staff can change it.

create table if not exists categories (
  id          text primary key,
  name        text not null,
  arabic      text,
  image_url   text,
  sort_order  int  not null default 0
);

create table if not exists dishes (
  id          text primary key,
  category_id text not null references categories(id) on delete cascade,
  name        text not null,
  arabic      text,
  price       numeric(10,2) not null default 0,
  image_url   text,
  slot        text,
  available   boolean not null default true,
  sort_order  int  not null default 0
);

create table if not exists specials (
  id          text primary key,
  name        text not null,
  arabic      text,
  tagline     text,
  price       numeric(10,2) not null default 0,
  image_url   text,
  active      boolean not null default true,
  service_date date,
  sort_order  int  not null default 0
);

create index if not exists dishes_category_idx on dishes (category_id, sort_order);
create index if not exists specials_service_date_idx on specials (service_date, sort_order);

-- Row level security -------------------------------------------------------
alter table categories enable row level security;
alter table dishes     enable row level security;
alter table specials   enable row level security;

do $$
declare t text;
begin
  foreach t in array array['categories', 'dishes', 'specials'] loop
    execute format('drop policy if exists "public read %1$s" on %1$I', t);
    execute format('drop policy if exists "staff write %1$s" on %1$I', t);
    execute format('create policy "public read %1$s" on %1$I for select using (true)', t);
    execute format(
      'create policy "staff write %1$s" on %1$I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- Photo storage ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('menu-photos', 'menu-photos', true)
on conflict (id) do nothing;

drop policy if exists "public read photos"  on storage.objects;
drop policy if exists "staff write photos"  on storage.objects;

create policy "public read photos" on storage.objects
  for select using (bucket_id = 'menu-photos');

create policy "staff write photos" on storage.objects
  for all to authenticated
  using (bucket_id = 'menu-photos')
  with check (bucket_id = 'menu-photos');
