/* Local adapter — no services, no cost. Menu lives in localStorage, seeded
   once from src/menuData.js. Used until Supabase credentials are present.
   Image quota is the real limit here, so photos are stored small. */
import { MENU } from '../menuData.js';
import { resizeImage, blobToDataUrl } from './images.js';
import { gate } from './gate.js';

const KEY = 'salinas.menu.v1';

function seed() {
  const categories = MENU.map((g, i) => ({
    id: g.id, name: g.name, arabic: g.arabic, image_url: g.image, note: g.note ?? null, note_arabic: g.note_arabic ?? null, sort_order: i
  }));
  const dishes = MENU.flatMap((g, gi) =>
    g.items.map((it, i) => ({
      id: it.id, category_id: g.id, name: it.name, arabic: it.arabic,
      price: it.price, image_url: it.image, slot: it.slot,
      available: true, sort_order: gi * 100 + i
    }))
  );
  return { categories, dishes, specials: [] };
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { categories: [], dishes: [], specials: [], ...parsed };
    }
  } catch { /* corrupt or unavailable — fall through to seed */ }
  return seed();
}

function write(db) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    throw new Error('Browser storage is full. Remove a photo or connect Supabase to store images properly.');
  }
  return db;
}

const upsert = (list, row) => {
  const i = list.findIndex(r => r.id === row.id);
  if (i === -1) return [...list, row];
  const next = [...list];
  next[i] = { ...next[i], ...row };
  return next;
};

export function createLocalAdapter() {
  return {
    mode: 'local',

    async load() {
      return read();
    },

    async saveCategory(row) {
      const db = read();
      return write({ ...db, categories: upsert(db.categories, row) });
    },
    async deleteCategory(id) {
      const db = read();
      return write({
        ...db,
        categories: db.categories.filter(c => c.id !== id),
        dishes: db.dishes.filter(d => d.category_id !== id)
      });
    },

    async saveDish(row) {
      const db = read();
      return write({ ...db, dishes: upsert(db.dishes, row) });
    },
    async deleteDish(id) {
      const db = read();
      return write({ ...db, dishes: db.dishes.filter(d => d.id !== id) });
    },

    /* One write for bulk operations like reordering a whole group. */
    async saveMany(kind, rows) {
      const db = read();
      return write({ ...db, [kind]: rows.reduce((list, row) => upsert(list, row), db[kind]) });
    },

    async deleteMany(kind, ids) {
      const db = read();
      const gone = new Set(ids);
      return write({ ...db, [kind]: db[kind].filter(r => !gone.has(r.id)) });
    },

    async saveSpecial(row) {
      const db = read();
      return write({ ...db, specials: upsert(db.specials, row) });
    },
    async deleteSpecial(id) {
      const db = read();
      return write({ ...db, specials: db.specials.filter(s => s.id !== id) });
    },

    /* Small on purpose: these become base64 inside a ~5MB localStorage budget. */
    async uploadImage(file) {
      const blob = await resizeImage(file, { maxSize: 700, quality: 0.72 });
      return blobToDataUrl(blob);
    },

    /* Nothing to remove: the photo is a data URL inside the row itself, so it
       goes when the row does. Here so both adapters expose the same surface. */
    async deleteImage() {},
    async deleteImages() {},

    ...gate,

    async reset() {
      localStorage.removeItem(KEY);
      return seed();
    }
  };
}
