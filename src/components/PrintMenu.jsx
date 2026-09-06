import React, { useEffect, useRef } from 'react';
import { money } from '../lib/money.js';

/* A4 carte for printing or saving as PDF. Rendered only while exporting.

   Plat du jour is excluded on purpose: it changes daily and a printed sheet
   would be wrong by tomorrow.

   Design constraint: Chrome's print dialog has "Background graphics" OFF by
   default, which drops every CSS background and gradient. So nothing here
   depends on one — structure comes from rules, borders and <img> photos,
   which print either way. */

const pad2 = n => String(n).padStart(2, '0');

/* One dish: a small square photo, the name, a dotted leader to the price, and
   the Arabic beneath. Two of these fit across an A4 column, which is what keeps
   the carte to a few sheets instead of a photo album. */
function Dish({ dish, withThumb }) {
  return (
    <article className="pm-dish">
      {withThumb && (
        dish.image_url
          ? <div className="pm-thumb"><img src={dish.image_url} alt="" /></div>
          /* An empty frame rather than no frame: the names stay in one column
             whether or not a dish has been photographed yet. */
          : <div className="pm-thumb pm-thumb-empty" />
      )}
      <div className="pm-txt">
        <div className="pm-row">
          <h3>{dish.name}</h3>
          <span className="pm-leader" />
          <span className="pm-price">{money(dish.price)}</span>
        </div>
        {dish.arabic && <p className="pm-ar">{dish.arabic}</p>}
      </div>
    </article>
  );
}

function CategoryBlock({ category, index }) {
  /* All or nothing per category: reserving thumb space in a category nobody
     has photographed would print a column of empty boxes. */
  const withThumb = category.items.some(i => i.image_url);

  return (
    <section className="pm-category">
      <header className="pm-cat-head">
        {category.image_url && (
          <div className="pm-cat-photo"><img src={category.image_url} alt="" /></div>
        )}
        <span className="pm-cat-num">{pad2(index + 1)}</span>
        <h2>{category.name}</h2>
        {category.arabic && <span className="pm-cat-ar">{category.arabic}</span>}
        <span className="pm-cat-count">
          {category.items.length} {category.items.length === 1 ? 'dish' : 'dishes'}
        </span>
      </header>

      {(category.note || category.note_arabic) && (
        <div className="pm-cat-notes">
          {category.note && <p className="pm-cat-note">{category.note}</p>}
          {category.note_arabic && <p className="pm-cat-note-ar">{category.note_arabic}</p>}
        </div>
      )}

      <div className="pm-items">
        {category.items.map(d => <Dish key={d.id} dish={d} withThumb={withThumb} />)}
      </div>
    </section>
  );
}

export default function PrintMenu({ menu, onDone }) {
  const ref = useRef(null);

  /* Photos must be decoded before the dialog opens or they print blank. */
  useEffect(() => {
    let cancelled = false;
    const node = ref.current;
    if (!node) return;

    const images = [...node.querySelectorAll('img')];
    const ready = images.map(img =>
      img.complete ? Promise.resolve() : new Promise(res => { img.onload = img.onerror = res; }));

    const done = () => { if (!cancelled) onDone(); };

    Promise.all(ready).then(() => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        window.addEventListener('afterprint', done, { once: true });
        window.print();
        /* Some Linux builds never fire afterprint. */
        setTimeout(done, 1000);
      });
    });

    return () => { cancelled = true; window.removeEventListener('afterprint', done); };
  }, [onDone]);

  return (
    <div className="pm-doc" ref={ref}>
      <header className="pm-masthead">
        <div className="pm-banner"><img src="/header.jpg" alt="" /></div>
        <p className="pm-eyebrow">From Tyre to San Pedro</p>
        <h1 className="pm-wordmark">SALINAS</h1>
        <div className="pm-rule"><span /><i /><span /></div>
        <p className="pm-founder">Chef de la Mer — Abo Mazloum</p>
      </header>

      {menu.map((c, i) => <CategoryBlock key={c.id} category={c} index={i} />)}

      <footer className="pm-endnote">
        <span />
        <p>Catch of the day may vary · Prices in FCFA</p>
        <span />
      </footer>
    </div>
  );
}
