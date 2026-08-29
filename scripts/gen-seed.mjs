/* Regenerates supabase/seed.sql from src/menuData.js.
   Run after editing the seed menu:  npm run seed:sql  */
import { writeFileSync } from 'node:fs';
import { MENU } from '../src/menuData.js';

const q = v =>
  v === null || v === undefined || v === '' ? 'null' : `'${String(v).replace(/'/g, "''")}'`;

const block = (table, cols, rows) =>
  `insert into ${table} (${cols}) values\n${rows.join(',\n')}\non conflict (id) do nothing;`;

const categories = MENU.map((g, i) =>
  `  (${q(g.id)}, ${q(g.name)}, ${q(g.arabic)}, ${q(g.image)}, ${i})`);

/* sort_order is per category — dishes are grouped before they are sorted. */
const dishes = MENU.flatMap(g =>
  g.items.map((it, i) =>
    `  (${q(it.id)}, ${q(g.id)}, ${q(it.name)}, ${q(it.arabic)}, ${Number(it.price).toFixed(2)}, ${q(it.image)}, ${q(it.slot)}, true, ${i})`));

const sql = [
  '-- Salinas seed data, generated from src/menuData.js by scripts/gen-seed.mjs.',
  '-- Run AFTER schema.sql. Safe to re-run: existing rows are left untouched.',
  '',
  block('categories', 'id, name, arabic, image_url, sort_order', categories),
  '',
  block('dishes', 'id, category_id, name, arabic, price, image_url, slot, available, sort_order', dishes),
  '',
  '-- Plat du jour starts empty on purpose — add slides from the admin panel.',
  ''
].join('\n');

writeFileSync(new URL('../supabase/seed.sql', import.meta.url), sql);
console.log(`seed.sql written — ${MENU.length} categories, ${MENU.flatMap(g => g.items).length} dishes`);
