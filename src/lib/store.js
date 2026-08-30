/* Picks an adapter and exposes the menu to React.
   Supabase is used when both env vars are set; otherwise everything runs
   locally so the app works with zero setup. */
import { useCallback, useEffect, useState } from 'react';
import { createLocalAdapter } from './localAdapter.js';
import { createSupabaseAdapter } from './supabaseAdapter.js';

export const usingSupabase = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const adapter = usingSupabase ? createSupabaseAdapter() : createLocalAdapter();

const byOrder = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0);

/* Rebuilds the nested { category, items[] } shape the menu UI renders from. */
export function toMenu(db) {
  return [...(db.categories ?? [])].sort(byOrder).map(c => ({
    ...c,
    items: (db.dishes ?? [])
      .filter(d => d.category_id === c.id && d.available !== false)
      .sort(byOrder)
  }));
}

/* Specials the guest should see on a given day: the ones scheduled for that
   date, plus any left undated, which act as "always showing".
   Today's plats lead — otherwise an evergreen one interleaves with them
   wherever sort_order happens to tie. */
const datedFirst = s => (s.service_date ? 0 : 1);

export const specialsForDate = (db, iso) =>
  (db.specials ?? [])
    .filter(s => s.active !== false && (!s.service_date || s.service_date === iso))
    .sort((a, b) => datedFirst(a) - datedFirst(b) || byOrder(a, b));

const EMPTY = { categories: [], dishes: [], specials: [] };

export function useMenuStore() {
  const [db, setDb] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      setDb(await adapter.load());
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  /* Every mutation returns the fresh database, so the UI never guesses. */
  const run = useCallback(async (fn, ...args) => {
    const next = await adapter[fn](...args);
    setDb(next ?? (await adapter.load()));
  }, []);

  return { db, loading, error, refresh, run };
}
