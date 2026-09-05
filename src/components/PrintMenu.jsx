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

function DishCard({ dish }) {
  return (
    <article className="pm-dish">
      {dish.image_url && (
        <div className="pm-dish-photo"><img src={dish.image_url} alt="" /></div>
      )}
      <div className="pm-dish-text">
        <h3>{dish.name}</h3>
        {dish.arabic && <p className="pm-arabic">{dish.arabic}</p>}
        <p className="pm-price">{money(dish.price)}</p>
      </div>
    </article>
  );
}

/* Without photos a dotted-leader list reads far better than a grid of
   name-and-price blocks floating in space. */
function DishLine({ dish }) {
  return (
    <article className="pm-line">
      <div className="pm-line-head">
        <h3>{dish.name}</h3>
        <span className="pm-leader" />
        <span className="pm-price">{money(dish.price)}</span>
      </div>
      {dish.arabic && <p className="pm-arabic">{dish.arabic}</p>}
    </article>
  );
}

function CategoryBlock({ category, index }) {
  const hasPhotos = category.items.some(i => i.image_url);

  /* The header travels with its first row and no further. Binding it to the
     whole category pushed entire sections onto fresh sheets; binding it to
     nothing left headers stranded at the foot of a page. */
  const openCount = hasPhotos ? 3 : 2;
  const opening = category.items.slice(0, openCount);
  const rest = category.items.slice(openCount);
  const Item = hasPhotos ? DishCard : DishLine;
  const wrap = hasPhotos ? 'pm-grid' : 'pm-list';

  return (
    <section className="pm-category">
      <div className="pm-cat-open">
      <header className="pm-cat-head">
        {category.image_url && (
          <div className="pm-cat-photo"><img src={category.image_url} alt="" /></div>
        )}
        <div className="pm-cat-titles">
          <span className="pm-cat-num">{pad2(index + 1)}</span>
          <h2>{category.name}</h2>
          {category.note && <p className="pm-cat-note">{category.note}</p>}
          {category.note_arabic && <p className="pm-cat-note-ar">{category.note_arabic}</p>}
        </div>
        <div className="pm-cat-meta">
          {category.arabic && <p className="pm-cat-arabic">{category.arabic}</p>}
          <span className="pm-cat-count">
            {category.items.length} {category.items.length === 1 ? 'dish' : 'dishes'}
          </span>
        </div>
      </header>

        <div className={wrap}>
          {opening.map(d => <Item key={d.id} dish={d} />)}
        </div>
      </div>

      {rest.length > 0 && (
        <div className={wrap}>
          {rest.map(d => <Item key={d.id} dish={d} />)}
        </div>
      )}
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
