import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useMenuStore, toMenu, activeSpecials } from './lib/store.js';
import PlatDuJour from './components/PlatDuJour.jsx';
import { money } from './lib/money.js';
import { whatsappNumber, whatsappUrl } from './lib/whatsapp.js';

const ACCENT = '#2b7fa8';

/* Striped placeholder used until a real photo URL is set in menuData.js */
function Thumb({ image, slot, size, radius, ring }) {
  return (
    <div style={{ position: 'relative', flex: 'none', width: size, height: size, borderRadius: radius, overflow: 'hidden', background: '#e4eef3', border: `1px solid ${ring}` }}>
      {image ? (
        <img src={image} alt={slot} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <>
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg,#dbe9f0 0 6px,#eef5f8 6px 12px)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', font: '400 7.5px/1.25 ui-monospace,Menlo,monospace', color: '#7d99a8', padding: 4, letterSpacing: '.04em' }}>{slot}</div>
        </>
      )}
    </div>
  );
}

function Header() {
  return (
    <header style={{ position: 'relative', padding: '34px 22px 26px', background: 'linear-gradient(168deg,#0b2f42 0%,#12455e 58%,#17607f 100%)', color: '#fff', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.2, background: 'repeating-linear-gradient(115deg,rgba(255,255,255,.55) 0 1px,transparent 1px 26px)' }} />
      <div style={{ position: 'absolute', right: -70, top: -90, width: 230, height: 230, borderRadius: '50%', border: '1px solid rgba(255,255,255,.22)' }} />
      <div style={{ position: 'absolute', right: -30, top: -40, width: 130, height: 130, borderRadius: '50%', border: '1px solid rgba(255,255,255,.14)' }} />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', textAlign: 'center' }}>
        <div style={{ font: '500 11px/1 Manrope,sans-serif', letterSpacing: '.34em', textTransform: 'uppercase', color: 'rgba(198,230,244,.85)' }}>Est. Beirut · Fresh Catch Daily</div>
        <div style={{ font: "400 54px/.9 'Cormorant Garamond',serif", letterSpacing: '.16em', paddingLeft: '.16em' }}>SALINAS</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', maxWidth: 290 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.45))' }} />
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#7fd0f0' }} />
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(255,255,255,.45),transparent)' }} />
        </div>
        <div style={{ font: "italic 400 19px/1.3 'Cormorant Garamond',serif", color: '#dff0f8' }}>Chef de la Mer — Abo Mazloum</div>
        <div style={{ font: '400 15px/1.4 Manrope,sans-serif', color: 'rgba(198,230,244,.72)', direction: 'rtl' }}>صالينا · مطعم الأسماك</div>
      </div>
    </header>
  );
}

function CategoryRail({ cats, active, onPick }) {
  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(247,251,252,.94)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(11,45,62,.08)' }}>
      <div className="no-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '12px 16px' }}>
        {cats.map(c => {
          const on = c.id === active;
          return (
            <button key={c.id} type="button" onClick={() => onPick(c.id)}
              style={{ flex: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, width: 78, padding: '8px 4px 9px', borderRadius: 16, transition: 'all .18s ease', border: `1px solid ${on ? ACCENT : 'rgba(11,45,62,.12)'}`, background: on ? ACCENT : '#fff', boxShadow: on ? '0 6px 16px rgba(43,127,168,.22)' : '0 1px 2px rgba(11,45,62,.05)' }}>
              <Thumb image={c.image_url} slot={c.slot} size={46} radius={23} ring={on ? 'rgba(255,255,255,.55)' : 'rgba(11,45,62,.08)'} />
              <span style={{ font: '600 10.5px/1.15 Manrope,sans-serif', letterSpacing: '.02em', textAlign: 'center', color: on ? '#fff' : '#4b7085' }}>{c.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function DishRow({ item, qty, onAdd }) {
  return (
    <div role="button" tabIndex={0} onClick={onAdd} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onAdd()}
      style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px 4px', borderBottom: '1px solid rgba(11,45,62,.07)', cursor: 'pointer', borderRadius: 12, background: qty > 0 ? 'rgba(63,157,201,.07)' : 'transparent', transition: 'background .16s ease' }}>
      <Thumb image={item.image_url} slot={item.slot} size={74} radius={16} ring="rgba(11,45,62,.08)" />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ font: '600 15.5px/1.25 Manrope,sans-serif', color: '#0b2f42' }}>{item.name}</div>
        <div style={{ font: '400 12.5px/1.45 Manrope,sans-serif', color: '#7b98a8', direction: 'rtl', textAlign: 'right' }}>{item.arabic}</div>
        <div style={{ font: '600 14px/1 Manrope,sans-serif', color: ACCENT, marginTop: 2 }}>{money(item.price)}</div>
      </div>
      <div style={{ flex: 'none', alignSelf: 'center' }}>
        {qty > 0 ? (
          <div style={{ minWidth: 30, height: 30, padding: '0 9px', borderRadius: 15, background: '#0b2f42', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 13px/1 Manrope,sans-serif', animation: 'salPop .22s ease-out' }}>{qty}</div>
        ) : (
          <div style={{ width: 30, height: 30, borderRadius: 15, border: '1px solid rgba(11,45,62,.16)', color: '#3f9dc9', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '400 20px/1 Manrope,sans-serif', paddingBottom: 2 }}>+</div>
        )}
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flex: 'none' }}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.470 1.19 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.16 8.16 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23z" />
    </svg>
  );
}

function OrderSheet({ lines, total, countLabel, onClose, onBump, onClear }) {
  const [note, setNote] = useState('');
  const href = whatsappUrl(lines, total, note);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(6,26,36,.5)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 430, maxHeight: '86vh', background: '#f7fbfc', borderRadius: '24px 24px 0 0', animation: 'salSheet .28s cubic-bezier(.2,.8,.2,1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px 14px', background: '#0b2f42', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ font: "400 24px/1 'Cormorant Garamond',serif", letterSpacing: '.06em' }}>Your Order</div>
            <div style={{ font: '400 12px/1 Manrope,sans-serif', color: 'rgba(198,230,244,.7)' }}>{countLabel}</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: 17, border: '1px solid rgba(255,255,255,.25)', background: 'transparent', color: '#fff', font: '400 17px/1 Manrope,sans-serif', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 4px' }}>
          {lines.length === 0 ? (
            <div style={{ padding: '52px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, border: '1px dashed rgba(11,45,62,.25)' }} />
              <div style={{ font: "italic 400 18px/1.3 'Cormorant Garamond',serif", color: '#7b98a8' }}>Nothing selected yet</div>
              <div style={{ font: '400 13px/1.4 Manrope,sans-serif', color: '#a9bec9' }}>Tap any dish on the menu to add it here.</div>
            </div>
          ) : lines.map(l => (
            <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 4px', borderBottom: '1px solid rgba(11,45,62,.08)' }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ font: '600 14.5px/1.25 Manrope,sans-serif', color: '#0b2f42' }}>{l.name}</div>
                <div style={{ font: '400 12px/1 Manrope,sans-serif', color: '#8ea9b8' }}>{money(l.price)} each</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#e9f3f8', borderRadius: 18, padding: '4px 6px' }}>
                <button type="button" onClick={() => onBump(l.id, -1)} style={{ width: 26, height: 26, borderRadius: 13, border: 'none', background: '#fff', color: '#0b2f42', font: '600 15px/1 Manrope,sans-serif', cursor: 'pointer' }}>−</button>
                <div style={{ minWidth: 16, textAlign: 'center', font: '700 13px/1 Manrope,sans-serif', color: '#0b2f42' }}>{l.qty}</div>
                <button type="button" onClick={() => onBump(l.id, 1)} style={{ width: 26, height: 26, borderRadius: 13, border: 'none', background: '#0b2f42', color: '#fff', font: '600 15px/1 Manrope,sans-serif', cursor: 'pointer' }}>+</button>
              </div>
              <div style={{ width: 96, textAlign: 'right', font: '600 13.5px/1.2 Manrope,sans-serif', color: ACCENT }}>{money(l.price * l.qty)}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '16px 22px 24px', borderTop: '1px solid rgba(11,45,62,.10)', background: '#fff', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ font: '500 11px/1 Manrope,sans-serif', letterSpacing: '.18em', textTransform: 'uppercase', color: '#8ea9b8' }}>Total</div>
            <div style={{ font: '700 24px/1 Manrope,sans-serif', color: '#0b2f42' }}>{money(total)}</div>
          </div>

          {lines.length > 0 && whatsappNumber && (
            <>
              <input value={note} onChange={e => setNote(e.target.value)} maxLength={60}
                placeholder="Your name or table number (optional)"
                style={{ width: '100%', padding: '11px 13px', borderRadius: 13, border: '1px solid rgba(11,45,62,.14)', background: '#f7fbfc', color: '#0b2f42', font: '500 13px/1.2 Manrope,sans-serif' }} />

              <a href={href} target="_blank" rel="noopener noreferrer"
                style={{ width: '100%', padding: 15, borderRadius: 14, background: '#25D366', color: '#0a3622', font: '700 14.5px/1 Manrope,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, boxShadow: '0 8px 20px rgba(37,211,102,.32)' }}>
                <WhatsAppIcon />
                Send order on WhatsApp
              </a>

              <div style={{ font: '400 11px/1.5 Manrope,sans-serif', color: '#a9bec9', textAlign: 'center' }}>
                Opens WhatsApp with your order written out — you still press send. No payment here.
              </div>
            </>
          )}

          <button type="button" onClick={onClear} style={{ width: '100%', padding: 13, borderRadius: 14, border: '1px solid rgba(11,45,62,.14)', background: 'transparent', color: '#5d7d8e', font: '600 13px/1 Manrope,sans-serif', cursor: 'pointer' }}>Clear selection</button>
        </div>
      </div>
    </div>
  );
}

function Shell({ children }) {
  return (
    <div style={{ width: '100%', maxWidth: 430, margin: '0 auto', minHeight: '100vh', background: '#f7fbfc', position: 'relative', overflow: 'hidden', paddingBottom: 120, boxShadow: '0 0 60px rgba(11,45,62,.10)' }}>
      {children}
    </div>
  );
}

function Notice({ title, detail }) {
  return (
    <div style={{ padding: '80px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
      <div style={{ width: 26, height: 26, borderRadius: 13, border: '2px solid rgba(11,45,62,.12)', borderTopColor: ACCENT, animation: 'salSpin .9s linear infinite' }} />
      <div style={{ font: "italic 400 18px/1.3 'Cormorant Garamond',serif", color: '#7b98a8' }}>{title}</div>
      {detail && <div style={{ font: '400 12.5px/1.5 Manrope,sans-serif', color: '#a9bec9' }}>{detail}</div>}
    </div>
  );
}

export default function App() {
  const { db, loading, error } = useMenuStore();
  const [cart, setCart] = useState({});
  const [cat, setCat] = useState('all');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const menu = useMemo(() => toMenu(db).filter(g => g.items.length > 0), [db]);
  const specials = useMemo(() => activeSpecials(db), [db]);

  /* Specials are addable too, so the order sheet has to resolve both. */
  const addressable = useMemo(
    () => [...specials, ...menu.flatMap(g => g.items)],
    [menu, specials]
  );

  const add = item => {
    setCart(c => ({ ...c, [item.id]: (c[item.id] || 0) + 1 }));
    clearTimeout(toastTimer.current);
    setToast(`${item.name} added`);
    toastTimer.current = setTimeout(() => setToast(''), 1400);
  };

  const bump = (id, d) => setCart(c => {
    const next = { ...c };
    const n = (next[id] || 0) + d;
    if (n <= 0) delete next[id]; else next[id] = n;
    return next;
  });

  const cats = useMemo(
    () => [{ id: 'all', name: 'All Menu', slot: 'full menu', image_url: null }]
      .concat(menu.map(g => ({
        id: g.id,
        name: g.name,
        slot: g.items[0]?.slot ?? g.name,
        image_url: g.image_url ?? g.items[0]?.image_url ?? null
      }))),
    [menu]
  );

  /* A category can disappear while it is selected (admin deleted it). */
  const activeCat = cat !== 'all' && !menu.some(g => g.id === cat) ? 'all' : cat;
  const groups = activeCat === 'all' ? menu : menu.filter(g => g.id === activeCat);

  const lines = addressable.filter(i => cart[i.id]).map(i => ({ ...i, qty: cart[i.id] }));
  const total = lines.reduce((a, l) => a + l.price * l.qty, 0);
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const countLabel = count === 0 ? 'No items yet' : `${count} ${count === 1 ? 'item' : 'items'} selected`;

  if (loading) return <Shell><Header /><Notice title="Setting the table…" /></Shell>;
  if (error) return <Shell><Header /><Notice title="The menu could not be loaded" detail={error} /></Shell>;

  return (
    <Shell>
      <Header />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 22px', background: '#e9f3f8', borderBottom: '1px solid rgba(11,45,62,.07)' }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3f9dc9' }} />
        <div style={{ font: '500 11.5px/1 Manrope,sans-serif', letterSpacing: '.1em', textTransform: 'uppercase', color: '#3d6e87' }}>Online menu · tap a dish to add</div>
      </div>

      <PlatDuJour specials={specials} cart={cart} onAdd={add} />

      <CategoryRail cats={cats} active={activeCat} onPick={setCat} />

      {groups.map(g => (
        <section key={g.id} style={{ padding: '28px 18px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14, padding: '0 4px 14px', borderBottom: '1px solid rgba(11,45,62,.10)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <h2 style={{ margin: 0, font: "400 27px/1 'Cormorant Garamond',serif", color: '#0b2f42', letterSpacing: '.02em' }}>{g.name}</h2>
              <div style={{ font: '400 13px/1.3 Manrope,sans-serif', color: '#7b98a8', direction: 'rtl' }}>{g.arabic}</div>
            </div>
            <div style={{ font: '500 10.5px/1 Manrope,sans-serif', letterSpacing: '.18em', textTransform: 'uppercase', color: '#a9bec9', paddingBottom: 4 }}>{g.items.length} dishes</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {g.items.map(it => <DishRow key={it.id} item={it} qty={cart[it.id] || 0} onAdd={() => add(it)} />)}
          </div>
        </section>
      ))}

      {menu.length === 0 && (
        <Notice title="The menu is empty" detail="Add a category and a few dishes from the admin panel." />
      )}

      <div style={{ padding: '34px 22px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 1, background: 'rgba(11,45,62,.18)' }} />
        <div style={{ font: "italic 400 16px/1.4 'Cormorant Garamond',serif", color: '#7b98a8', textAlign: 'center' }}>Prices in FCFA. Catch of the day may vary.</div>
        <a href="#/admin" style={{ marginTop: 6, font: '500 10.5px/1 Manrope,sans-serif', letterSpacing: '.18em', textTransform: 'uppercase', color: '#a9bec9' }}>Staff</a>
      </div>

      {toast && (
        <div style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: 96, zIndex: 60, padding: '11px 18px', borderRadius: 24, background: '#0b2f42', color: '#fff', font: '600 13px/1 Manrope,sans-serif', boxShadow: '0 12px 30px rgba(11,45,62,.32)', animation: 'salUp .22s ease-out', whiteSpace: 'nowrap' }}>{toast}</div>
      )}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ width: '100%', maxWidth: 430, pointerEvents: 'auto', background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(14px)', borderTop: '1px solid rgba(11,45,62,.10)', padding: '12px 16px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 -8px 28px rgba(11,45,62,.10)' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ font: '500 10.5px/1 Manrope,sans-serif', letterSpacing: '.16em', textTransform: 'uppercase', color: '#8ea9b8' }}>{countLabel}</div>
            <div style={{ font: '700 21px/1 Manrope,sans-serif', color: '#0b2f42' }}>{money(total)}</div>
          </div>
          <button type="button" onClick={() => setSheetOpen(true)}
            style={{ flex: 'none', padding: '14px 26px', borderRadius: 15, border: 'none', cursor: 'pointer', font: '700 14px/1 Manrope,sans-serif', letterSpacing: '.03em', transition: 'all .2s ease', background: count ? ACCENT : 'rgba(11,45,62,.12)', color: count ? '#fff' : '#7b98a8', boxShadow: count ? '0 8px 20px rgba(43,127,168,.30)' : 'none' }}>View Order</button>
        </div>
      </div>

      {sheetOpen && (
        <OrderSheet lines={lines} total={total} countLabel={countLabel}
          onClose={() => setSheetOpen(false)} onBump={bump}
          onClear={() => { setCart({}); setSheetOpen(false); }} />
      )}
    </Shell>
  );
}
