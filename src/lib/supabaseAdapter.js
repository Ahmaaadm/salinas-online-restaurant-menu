/* Supabase adapter — real Postgres, real auth, CDN-hosted photos.
   Schema and row-level security policies live in supabase/schema.sql.
   The client is imported lazily so guests never download it in local mode. */
import { resizeImage } from './images.js';
import { gate } from './gate.js';

const BUCKET = 'menu-photos';

async function client() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
}

let cached = null;
const sb = async () => (cached ??= await client());

function check({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

export function createSupabaseAdapter() {
  return {
    mode: 'supabase',

    async load() {
      const c = await sb();
      const [categories, dishes, specials] = await Promise.all([
        c.from('categories').select('*').order('sort_order').then(check),
        c.from('dishes').select('*').order('sort_order').then(check),
        c.from('specials').select('*').order('sort_order').then(check)
      ]);
      return { categories, dishes, specials };
    },

    async saveCategory(row) {
      check(await (await sb()).from('categories').upsert(row));
      return this.load();
    },
    async deleteCategory(id) {
      check(await (await sb()).from('categories').delete().eq('id', id));
      return this.load();
    },

    async saveDish(row) {
      check(await (await sb()).from('dishes').upsert(row));
      return this.load();
    },
    async deleteDish(id) {
      check(await (await sb()).from('dishes').delete().eq('id', id));
      return this.load();
    },

    /* One round trip for bulk operations like reordering a whole group. */
    async saveMany(table, rows) {
      if (rows.length) check(await (await sb()).from(table).upsert(rows));
      return this.load();
    },

    async saveSpecial(row) {
      check(await (await sb()).from('specials').upsert(row));
      return this.load();
    },
    async deleteSpecial(id) {
      check(await (await sb()).from('specials').delete().eq('id', id));
      return this.load();
    },

    async uploadImage(file) {
      const blob = await resizeImage(file, { maxSize: 1200, quality: 0.82 });
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      const c = await sb();
      check(await c.storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' }));
      return c.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    },

    ...gate
  };
}
