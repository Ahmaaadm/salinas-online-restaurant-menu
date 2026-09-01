import React, { useCallback, useEffect, useRef, useState } from 'react';
import { money } from '../lib/money.js';

const ACCENT = 'var(--accent)';
const AUTOPLAY_MS = 5200;

const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Remounting on activation restarts the slow zoom on whichever slide is showing. */
function SlideArt({ special, active }) {
  if (special.image_url) {
    return (
      <img key={active ? 'on' : 'off'} src={special.image_url} alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', animation: active ? 'salKen 14s ease-out both' : 'none' }} />
    );
  }
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg,var(--deep-4) 0 8px,var(--deep-3) 8px 16px)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '400 9px/1.3 ui-monospace,Menlo,monospace', color: 'var(--on-deep-faint)', letterSpacing: '.06em' }}>
        {special.tagline || 'plat du jour photo'}
      </div>
    </>
  );
}

export default function PlatDuJour({ specials, onAdd, cart }) {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const trackRef = useRef(null);
  const startX = useRef(null);
  const paused = useRef(false);
  const count = specials.length;

  const go = useCallback(n => setIndex(((n % count) + count) % count), [count]);

  /* Keep the index valid when the admin deletes the slide we are sitting on. */
  useEffect(() => { if (index >= count) setIndex(0); }, [count, index]);

  useEffect(() => {
    if (count < 2 || prefersReducedMotion()) return;
    const t = setInterval(() => { if (!paused.current) setIndex(i => (i + 1) % count); }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [count]);

  if (count === 0) return null;

  const onPointerDown = e => {
    startX.current = e.clientX;
    paused.current = true;
    trackRef.current?.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = e => {
    if (startX.current === null) return;
    setDrag(e.clientX - startX.current);
  };
  const onPointerUp = () => {
    if (startX.current === null) return;
    if (Math.abs(drag) > 48) go(index + (drag < 0 ? 1 : -1));
    startX.current = null;
    setDrag(0);
    paused.current = false;
  };

  const current = specials[index];
  const qty = cart[current.id] || 0;

  return (
    <section aria-label="Plat du jour"
      style={{ background: 'linear-gradient(180deg,var(--deep) 0%,var(--deep-2) 100%)', padding: '18px 16px 16px' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '0 2px 12px' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sky)', animation: 'salPulse 2.4s ease-in-out infinite' }} />
        <span style={{ font: '600 10.5px/1 Manrope,sans-serif', letterSpacing: '.26em', textTransform: 'uppercase', color: 'var(--on-deep-muted)' }}>Plat du Jour</span>
        <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(255,255,255,.28),transparent)' }} />
        <span style={{ font: '400 12px/1 Manrope,sans-serif', color: 'var(--on-deep-faint)', direction: 'rtl' }}>طبق اليوم</span>
      </div>

      <div ref={trackRef}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
        style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', touchAction: 'pan-y', cursor: count > 1 ? 'grab' : 'default', boxShadow: '0 14px 34px rgba(4,20,29,.42)' }}>

        <div style={{ display: 'flex', width: `${count * 100}%`, transform: `translateX(calc(${(-index * 100) / count}% + ${drag}px))`, transition: startX.current === null ? 'transform .5s cubic-bezier(.22,.85,.25,1)' : 'none' }}>
          {specials.map((s, i) => (
            <article key={s.id} aria-hidden={i !== index}
              style={{ width: `${100 / count}%`, flex: 'none', position: 'relative', height: 208, background: 'var(--deep-4)' }}>
              <SlideArt special={s} active={i === index} />

              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(6,26,36,.05) 0%,rgba(6,26,36,.42) 46%,rgba(6,26,36,.88) 100%)' }} />

              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '16px 16px 15px', display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {s.tagline && (
                    <div style={{ font: '600 9.5px/1 Manrope,sans-serif', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--sky)' }}>{s.tagline}</div>
                  )}
                  <h3 style={{ margin: 0, font: "400 26px/1.05 'Cormorant Garamond',serif", color: 'var(--on-deep)', letterSpacing: '.02em' }}>{s.name}</h3>
                  {s.arabic && (
                    <div style={{ font: '400 12.5px/1.4 Manrope,sans-serif', color: 'var(--on-deep-muted)', direction: 'rtl', textAlign: 'right' }}>{s.arabic}</div>
                  )}
                </div>
                <button type="button" onClick={() => onAdd(s)} tabIndex={i === index ? 0 : -1}
                  style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 14, border: 'none', cursor: 'pointer', background: qty > 0 && i === index ? 'var(--surface)' : ACCENT, color: qty > 0 && i === index ? 'var(--ink)' : 'var(--accent-on-fill)', font: '700 13px/1 Manrope,sans-serif', boxShadow: '0 6px 18px rgba(4,20,29,.4)' }}>
                  <span>{money(s.price)}</span>
                  <span style={{ opacity: .55 }}>|</span>
                  <span>{qty > 0 && i === index ? `×${qty}` : '+'}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 7, paddingTop: 13 }}>
          {specials.map((s, i) => (
            <button key={s.id} type="button" onClick={() => go(i)} aria-label={`Show ${s.name}`}
              style={{ width: i === index ? 20 : 6, height: 6, padding: 0, borderRadius: 3, border: 'none', cursor: 'pointer', transition: 'width .35s ease, background .35s ease', background: i === index ? 'var(--sky)' : 'rgba(198,230,244,.32)' }} />
          ))}
        </div>
      )}

      <div style={{ margin: '14px -16px -16px' }}>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true"
          style={{ display: 'block', width: '100%', height: 20 }}>
          <path fill="var(--page)" d="M0,45 C120,80 240,80 360,60 C480,40 600,0 720,5 C840,10 960,60 1080,70 C1200,80 1320,55 1440,35 L1440,90 L0,90 Z" />
        </svg>
      </div>
    </section>
  );
}
