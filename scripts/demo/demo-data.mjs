/* Sample menu injected into localStorage before screenshots, so the deck shows
   realistic CFA prices and a populated plat du jour instead of seed leftovers. */
import { MENU } from '../../src/menuData.js';

/* Seed prices were dollar-scale; ×500 rounded to 500 lands in CFA territory. */
const toCfa = usd => Math.round((usd * 500) / 500) * 500;

export const categories = MENU.map((g, i) => ({
  id: g.id, name: g.name, arabic: g.arabic, image_url: null, sort_order: i
}));

export const dishes = MENU.flatMap(g =>
  g.items.map((it, i) => ({
    id: it.id, category_id: g.id, name: it.name, arabic: it.arabic,
    price: toCfa(it.price), image_url: null, slot: it.slot,
    available: true, sort_order: i
  })));

export const specials = [
  {
    id: 'sp-loup', name: 'Grilled Loup de Mer', arabic: 'لوت دو مير مشوي على الفحم',
    tagline: 'Caught this morning', price: 19000, image_url: null,
    active: true, sort_order: 0
  },
  {
    id: 'sp-crevettes', name: 'Gambas à la Provençale', arabic: 'جمبري بالثوم و الكزبرة',
    tagline: "Chef's plate today", price: 14500, image_url: null,
    active: true, sort_order: 1
  },
  {
    id: 'sp-plateau', name: 'Plateau Royal — for two', arabic: 'صحن بحري ملكي · لشخصين',
    tagline: 'Weekend special', price: 38000, image_url: null,
    active: true, sort_order: 2
  }
];

export const db = { categories, dishes, specials };
