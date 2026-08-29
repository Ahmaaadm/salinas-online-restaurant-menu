import React, { useEffect, useMemo, useState } from 'react';
import { adapter, usingSupabase, useMenuStore } from '../lib/store.js';
import { money, PRICE_STEP } from '../lib/money.js';
import { Button, Card, Empty, Field, ImagePicker, Text, Toggle, ACCENT, LINE, NAVY, inputStyle, label } from './ui.jsx';

const byOrder = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0);

const slugify = s =>
  (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

const newId = name => `${slugify(name) || 'item'}-${Math.random().toString(36).slice(2, 6)}`;

/* ---------------------------------------------------------------- login */

function Login({ onIn }) {
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      onIn(await adapter.signIn({ password }));
    } catch (ex) {
      setErr(ex.message);
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'linear-gradient(168deg,#0b2f42 0%,#12455e 58%,#17607f 100%)' }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 16, background: '#f7fbfc', padding: 26, borderRadius: 22, boxShadow: '0 24px 60px rgba(4,20,29,.4)' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ font: "400 34px/.9 'Cormorant Garamond',serif", letterSpacing: '.14em', color: NAVY, paddingLeft: '.14em' }}>SALINAS</div>
          <div style={{ ...label, letterSpacing: '.24em' }}>Menu Admin</div>
        </div>

        <Field title="Passcode">
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" style={inputStyle} />
        </Field>

        {err && <div style={{ font: '500 12px/1.4 Manrope,sans-serif', color: '#b4453c' }}>{err}</div>}

        <button type="submit" disabled={busy}
          style={{ padding: 13, borderRadius: 13, border: 'none', background: ACCENT, color: '#fff', font: '700 14px/1 Manrope,sans-serif', cursor: 'pointer', opacity: busy ? .6 : 1 }}>
          {busy ? 'Checking…' : 'Sign in'}
        </button>

        <div style={{ font: '400 11px/1.5 Manrope,sans-serif', color: '#a9bec9', textAlign: 'center' }}>
          {usingSupabase
            ? 'Edits are saved to the shared database and go live immediately.'
            : 'Local mode — edits are saved in this browser only.'}
        </div>
        <a href="#/" style={{ textAlign: 'center', font: '600 11px/1 Manrope,sans-serif', letterSpacing: '.14em', textTransform: 'uppercase', color: '#a9bec9' }}>Back to menu</a>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------- editors */

function Editor({ title, onClose, onSave, onDelete, canSave, children }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const guard = fn => async () => {
    setBusy(true);
    setErr('');
    try {
      await fn();
      onClose();
    } catch (ex) {
      setErr(ex.message);
      setBusy(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(6,26,36,.55)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 520, maxHeight: '92vh', background: '#f7fbfc', borderRadius: '22px 22px 0 0', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'salSheet .26s cubic-bezier(.2,.8,.2,1)' }}>
        <div style={{ padding: '16px 20px', background: NAVY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ font: "400 22px/1 'Cormorant Garamond',serif", letterSpacing: '.05em' }}>{title}</div>
          <button type="button" onClick={onClose} aria-label="Close"
            style={{ width: 32, height: 32, borderRadius: 16, border: '1px solid rgba(255,255,255,.25)', background: 'transparent', color: '#fff', font: '400 17px/1 Manrope,sans-serif', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 15 }}>
          {children}
          {err && <div style={{ font: '500 12px/1.4 Manrope,sans-serif', color: '#b4453c' }}>{err}</div>}
        </div>

        <div style={{ padding: '14px 20px 20px', borderTop: `1px solid ${LINE}`, background: '#fff', display: 'flex', gap: 10 }}>
          {onDelete && (
            <Button tone="danger" disabled={busy}
              onClick={() => { if (confirm('Delete this permanently?')) guard(onDelete)(); }}>Delete</Button>
          )}
          <Button tone="primary" disabled={busy || !canSave} onClick={guard(onSave)} style={{ flex: 1 }}>
            {busy ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SpecialEditor({ row, onClose, run }) {
  const [f, setF] = useState(row);
  const set = patch => setF(v => ({ ...v, ...patch }));

  return (
    <Editor title={row.id ? 'Edit special' : 'New plat du jour'} onClose={onClose}
      canSave={Boolean(f.name?.trim())}
      onSave={() => run('saveSpecial', { ...f, id: f.id || newId(f.name), price: Math.round(Number(f.price)) || 0 })}
      onDelete={row.id ? () => run('deleteSpecial', row.id) : null}>
      <ImagePicker value={f.image_url} onChange={u => set({ image_url: u })} upload={adapter.uploadImage} slotLabel="plat du jour" />
      <Field title="Dish name"><Text value={f.name} onChange={e => set({ name: e.target.value })} placeholder="Grilled Loup de Mer" /></Field>
      <Field title="Arabic" hint="Shown beneath the name, right to left.">
        <Text rtl value={f.arabic || ''} onChange={e => set({ arabic: e.target.value })} placeholder="لوت دو مير مشوي" />
      </Field>
      <Field title="Tagline" hint="Small blue line above the name. Optional.">
        <Text value={f.tagline || ''} onChange={e => set({ tagline: e.target.value })} placeholder="Caught this morning" />
      </Field>
      <Field title="Price">
        <Text type="number" min="0" step={PRICE_STEP} value={f.price} onChange={e => set({ price: e.target.value })} />
      </Field>
      <Toggle on={f.active !== false} onChange={v => set({ active: v })}>
        {f.active !== false ? 'Showing on the menu' : 'Hidden'}
      </Toggle>
    </Editor>
  );
}

function DishEditor({ row, categories, onClose, run }) {
  const [f, setF] = useState(row);
  const set = patch => setF(v => ({ ...v, ...patch }));

  return (
    <Editor title={row.id ? 'Edit dish' : 'New dish'} onClose={onClose}
      canSave={Boolean(f.name?.trim() && f.category_id)}
      onSave={() => run('saveDish', {
        ...f,
        id: f.id || newId(f.name),
        price: Math.round(Number(f.price)) || 0,
        slot: f.slot?.trim() || f.name.toLowerCase()
      })}
      onDelete={row.id ? () => run('deleteDish', row.id) : null}>
      <ImagePicker value={f.image_url} onChange={u => set({ image_url: u })} upload={adapter.uploadImage} slotLabel={f.slot || 'dish'} />
      <Field title="Dish name"><Text value={f.name} onChange={e => set({ name: e.target.value })} placeholder="Fried Calamari" /></Field>
      <Field title="Arabic"><Text rtl value={f.arabic || ''} onChange={e => set({ arabic: e.target.value })} placeholder="كاليماري مقلي" /></Field>
      <Field title="Category">
        <select value={f.category_id || ''} onChange={e => set({ category_id: e.target.value })} style={inputStyle}>
          <option value="" disabled>Choose a category…</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </Field>
      <Field title="Price">
        <Text type="number" min="0" step={PRICE_STEP} value={f.price} onChange={e => set({ price: e.target.value })} />
      </Field>
      <Field title="Placeholder label" hint="Text shown in the striped box until a photo is added.">
        <Text value={f.slot || ''} onChange={e => set({ slot: e.target.value })} placeholder="calamari" />
      </Field>
      <Toggle on={f.available !== false} onChange={v => set({ available: v })}>
        {f.available !== false ? 'Available' : 'Sold out — hidden from the menu'}
      </Toggle>
    </Editor>
  );
}

function CategoryEditor({ row, dishCount, onClose, run }) {
  const [f, setF] = useState(row);
  const set = patch => setF(v => ({ ...v, ...patch }));

  return (
    <Editor title={row.id ? 'Edit category' : 'New category'} onClose={onClose}
      canSave={Boolean(f.name?.trim())}
      onSave={() => run('saveCategory', { ...f, id: f.id || newId(f.name) })}
      onDelete={row.id ? () => run('deleteCategory', row.id) : null}>
      <ImagePicker value={f.image_url} onChange={u => set({ image_url: u })} upload={adapter.uploadImage} slotLabel="category" />
      <Field title="Category name"><Text value={f.name} onChange={e => set({ name: e.target.value })} placeholder="Hot Sea Starters" /></Field>
      <Field title="Arabic"><Text rtl value={f.arabic || ''} onChange={e => set({ arabic: e.target.value })} placeholder="مقبلات بحرية ساخنة" /></Field>
      {row.id && dishCount > 0 && (
        <div style={{ font: '400 11.5px/1.5 Manrope,sans-serif', color: '#b4453c', padding: '10px 12px', borderRadius: 11, background: 'rgba(180,69,60,.07)' }}>
          Deleting this category also deletes its {dishCount} {dishCount === 1 ? 'dish' : 'dishes'}.
        </div>
      )}
      <div style={{ font: '400 11.5px/1.5 Manrope,sans-serif', color: '#a9bec9' }}>
        Categories with no photo borrow the photo of their first dish. Empty categories are hidden from the menu.
      </div>
    </Editor>
  );
}

/* ---------------------------------------------------------------- lists */

function Row({ item, subtitle, meta, dim, onEdit, onMove, first, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderBottom: `1px solid rgba(11,45,62,.06)`, opacity: dim ? .5 : 1 }}>
      <div style={{ width: 46, height: 46, flex: 'none', borderRadius: 11, overflow: 'hidden', border: `1px solid ${LINE}`, background: '#e4eef3', position: 'relative' }}>
        {item.image_url
          ? <img src={item.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg,#dbe9f0 0 6px,#eef5f8 6px 12px)' }} />}
      </div>

      <button type="button" onClick={onEdit}
        style={{ flex: 1, minWidth: 0, textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ font: '600 14px/1.25 Manrope,sans-serif', color: NAVY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
        {subtitle && <span style={{ font: '400 11.5px/1.3 Manrope,sans-serif', color: '#8ea9b8', direction: 'rtl', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{subtitle}</span>}
        {meta && <span style={{ font: '600 11.5px/1 Manrope,sans-serif', color: ACCENT }}>{meta}</span>}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 'none' }}>
        <button type="button" aria-label="Move up" disabled={first} onClick={() => onMove(-1)}
          style={{ width: 30, height: 22, borderRadius: 7, border: `1px solid ${LINE}`, background: '#fff', color: first ? '#d3e0e7' : '#7b98a8', cursor: first ? 'default' : 'pointer', font: '400 10px/1 Manrope,sans-serif' }}>▲</button>
        <button type="button" aria-label="Move down" disabled={last} onClick={() => onMove(1)}
          style={{ width: 30, height: 22, borderRadius: 7, border: `1px solid ${LINE}`, background: '#fff', color: last ? '#d3e0e7' : '#7b98a8', cursor: last ? 'default' : 'pointer', font: '400 10px/1 Manrope,sans-serif' }}>▼</button>
      </div>
    </div>
  );
}

function Section({ title, count, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 4px' }}>
        <span style={{ font: "400 20px/1 'Cormorant Garamond',serif", color: NAVY, letterSpacing: '.03em' }}>{title}</span>
        <span style={label}>{count}</span>
      </div>
      <Card>{children}</Card>
    </div>
  );
}

/* ----------------------------------------------------------------- app */

const TABS = [
  { id: 'specials', name: 'Plat du Jour' },
  { id: 'dishes', name: 'Dishes' },
  { id: 'categories', name: 'Categories' }
];

function Panel({ onOut }) {
  const { db, loading, error, run } = useMenuStore();
  const [tab, setTab] = useState('specials');
  const [editing, setEditing] = useState(null);

  const categories = useMemo(() => [...(db.categories ?? [])].sort(byOrder), [db]);
  const specials = useMemo(() => [...(db.specials ?? [])].sort(byOrder), [db]);
  const dishesIn = id => (db.dishes ?? []).filter(d => d.category_id === id).sort(byOrder);

  /* Renumbers the whole group so a swap can never collide with stale values. */
  const reorder = (kind, list, from, dir) => {
    const to = from + dir;
    if (to < 0 || to >= list.length) return;
    const next = [...list];
    next.splice(to, 0, next.splice(from, 1)[0]);
    const changed = next
      .map((r, i) => ({ ...r, sort_order: i }))
      .filter(r => r.sort_order !== list.find(x => x.id === r.id).sort_order);
    return run('saveMany', kind, changed);
  };

  if (loading) return <Center>Loading the menu…</Center>;
  if (error) return <Center>{error}</Center>;

  return (
    <div style={{ minHeight: '100vh', background: '#eef4f7' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', minHeight: '100vh', background: '#f7fbfc', paddingBottom: 110 }}>

        <header style={{ padding: '18px 20px 16px', background: 'linear-gradient(168deg,#0b2f42 0%,#12455e 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div style={{ font: "400 26px/1 'Cormorant Garamond',serif", letterSpacing: '.1em' }}>SALINAS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: usingSupabase ? '#7fd0f0' : '#e0a24a' }} />
              <span style={{ font: '600 9.5px/1 Manrope,sans-serif', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(198,230,244,.8)' }}>
                {usingSupabase ? 'Supabase' : 'Local browser storage'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="#/" style={{ padding: '9px 13px', borderRadius: 11, border: '1px solid rgba(255,255,255,.24)', color: '#fff', font: '600 12px/1 Manrope,sans-serif' }}>Menu</a>
            <button type="button" onClick={async () => { await adapter.signOut(); onOut(); }}
              style={{ padding: '9px 13px', borderRadius: 11, border: '1px solid rgba(255,255,255,.24)', background: 'transparent', color: '#fff', font: '600 12px/1 Manrope,sans-serif', cursor: 'pointer' }}>Sign out</button>
          </div>
        </header>

        <nav className="no-scrollbar" style={{ position: 'sticky', top: 0, zIndex: 30, display: 'flex', gap: 8, padding: '12px 16px', overflowX: 'auto', background: 'rgba(247,251,252,.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid rgba(11,45,62,.08)` }}>
          {TABS.map(t => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              style={{ flex: 'none', padding: '9px 15px', borderRadius: 12, cursor: 'pointer', font: '600 12.5px/1 Manrope,sans-serif', transition: 'all .16s ease', border: `1px solid ${tab === t.id ? ACCENT : LINE}`, background: tab === t.id ? ACCENT : '#fff', color: tab === t.id ? '#fff' : '#4b7085' }}>
              {t.name}
            </button>
          ))}
        </nav>

        <main style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {tab === 'specials' && (
            <Section title="Plat du Jour" count={`${specials.length} slide${specials.length === 1 ? '' : 's'}`}>
              {specials.length === 0
                ? <Empty>No specials yet — the carousel stays hidden.</Empty>
                : specials.map((s, i) => (
                  <Row key={s.id} item={s} subtitle={s.arabic} dim={s.active === false}
                    meta={`${money(s.price)}${s.active === false ? ' · hidden' : ''}`}
                    first={i === 0} last={i === specials.length - 1}
                    onMove={d => reorder('specials', specials, i, d)}
                    onEdit={() => setEditing({ kind: 'special', row: s })} />
                ))}
            </Section>
          )}

          {tab === 'dishes' && (
            categories.length === 0
              ? <Card><Empty>Create a category first.</Empty></Card>
              : categories.map(c => {
                const list = dishesIn(c.id);
                return (
                  <Section key={c.id} title={c.name} count={`${list.length} dish${list.length === 1 ? '' : 'es'}`}>
                    {list.length === 0
                      ? <Empty>Nothing here yet.</Empty>
                      : list.map((d, i) => (
                        <Row key={d.id} item={d} subtitle={d.arabic} dim={d.available === false}
                          meta={`${money(d.price)}${d.available === false ? ' · sold out' : ''}`}
                          first={i === 0} last={i === list.length - 1}
                          onMove={dir => reorder('dishes', list, i, dir)}
                          onEdit={() => setEditing({ kind: 'dish', row: d })} />
                      ))}
                  </Section>
                );
              })
          )}

          {tab === 'categories' && (
            <Section title="Categories" count={`${categories.length}`}>
              {categories.length === 0
                ? <Empty>No categories yet.</Empty>
                : categories.map((c, i) => (
                  <Row key={c.id} item={c} subtitle={c.arabic}
                    meta={`${dishesIn(c.id).length} dishes`}
                    first={i === 0} last={i === categories.length - 1}
                    onMove={d => reorder('categories', categories, i, d)}
                    onEdit={() => setEditing({ kind: 'category', row: c })} />
                ))}
            </Section>
          )}
        </main>

        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ width: '100%', maxWidth: 520, pointerEvents: 'auto', padding: '12px 16px 18px', background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(14px)', borderTop: `1px solid ${LINE}` }}>
            <Button tone="dark" style={{ width: '100%', padding: 14 }}
              onClick={() => setEditing(
                tab === 'specials' ? { kind: 'special', row: { name: '', arabic: '', tagline: '', price: '', image_url: null, active: true, sort_order: specials.length } }
                  : tab === 'dishes' ? { kind: 'dish', row: { name: '', arabic: '', price: '', image_url: null, slot: '', available: true, category_id: categories[0]?.id ?? '', sort_order: 999 } }
                    : { kind: 'category', row: { name: '', arabic: '', image_url: null, sort_order: categories.length } }
              )}
              disabled={tab === 'dishes' && categories.length === 0}>
              + Add {tab === 'specials' ? 'plat du jour' : tab === 'dishes' ? 'dish' : 'category'}
            </Button>
          </div>
        </div>
      </div>

      {editing?.kind === 'special' && <SpecialEditor row={editing.row} run={run} onClose={() => setEditing(null)} />}
      {editing?.kind === 'dish' && <DishEditor row={editing.row} categories={categories} run={run} onClose={() => setEditing(null)} />}
      {editing?.kind === 'category' && <CategoryEditor row={editing.row} dishCount={dishesIn(editing.row.id).length} run={run} onClose={() => setEditing(null)} />}
    </div>
  );
}

function Center({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center', font: "italic 400 17px/1.4 'Cormorant Garamond',serif", color: '#7b98a8' }}>
      {children}
    </div>
  );
}

export default function AdminApp() {
  const [session, setSession] = useState(undefined);

  useEffect(() => { adapter.getSession().then(s => setSession(s ?? null)).catch(() => setSession(null)); }, []);

  if (session === undefined) return <Center>…</Center>;
  if (!session) return <Login onIn={setSession} />;
  return <Panel onOut={() => setSession(null)} />;
}
