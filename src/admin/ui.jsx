import React, { useRef, useState } from 'react';

export const NAVY = '#0b2f42';
export const ACCENT = '#2b7fa8';
export const LINE = 'rgba(11,45,62,.12)';

export const label = { font: '600 10px/1 Manrope,sans-serif', letterSpacing: '.16em', textTransform: 'uppercase', color: '#8ea9b8' };
export const inputStyle = {
  width: '100%', padding: '11px 12px', borderRadius: 11, border: `1px solid ${LINE}`,
  background: '#fff', color: NAVY, font: '500 14px/1.2 Manrope,sans-serif'
};

export function Field({ title, hint, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={label}>{title}</span>
      {children}
      {hint && <span style={{ font: '400 11px/1.4 Manrope,sans-serif', color: '#a9bec9' }}>{hint}</span>}
    </label>
  );
}

export function Text({ rtl, ...props }) {
  return <input {...props} style={{ ...inputStyle, ...(rtl ? { direction: 'rtl', textAlign: 'right' } : null) }} />;
}

export function Button({ tone = 'ghost', children, ...props }) {
  const tones = {
    primary: { background: ACCENT, color: '#fff', border: '1px solid transparent' },
    dark: { background: NAVY, color: '#fff', border: '1px solid transparent' },
    ghost: { background: '#fff', color: '#4b7085', border: `1px solid ${LINE}` },
    danger: { background: '#fff', color: '#b4453c', border: '1px solid rgba(180,69,60,.3)' }
  };
  return (
    <button type="button" {...props}
      style={{ padding: '11px 16px', borderRadius: 12, cursor: props.disabled ? 'not-allowed' : 'pointer', opacity: props.disabled ? .5 : 1, font: '600 13px/1 Manrope,sans-serif', transition: 'all .16s ease', ...tones[tone], ...props.style }}>
      {children}
    </button>
  );
}

export function Toggle({ on, onChange, children }) {
  return (
    <button type="button" onClick={() => onChange(!on)}
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 12, border: `1px solid ${on ? ACCENT : LINE}`, background: on ? 'rgba(43,127,168,.08)' : '#fff', cursor: 'pointer', font: '600 13px/1 Manrope,sans-serif', color: on ? ACCENT : '#7b98a8' }}>
      <span style={{ width: 34, height: 20, borderRadius: 10, background: on ? ACCENT : 'rgba(11,45,62,.16)', position: 'relative', transition: 'background .18s ease', flex: 'none' }}>
        <span style={{ position: 'absolute', top: 2, left: on ? 16 : 2, width: 16, height: 16, borderRadius: 8, background: '#fff', transition: 'left .18s ease' }} />
      </span>
      {children}
    </button>
  );
}

/* Picks a photo, hands the raw File to the adapter (which resizes + stores it)
   and reports back the resulting URL. */
export function ImagePicker({ value, onChange, upload, slotLabel }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const pick = async e => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      onChange(await upload(file));
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <span style={label}>Photo</span>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 66, height: 66, flex: 'none', borderRadius: 14, overflow: 'hidden', border: `1px solid ${LINE}`, background: '#e4eef3' }}>
          {value ? (
            <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg,#dbe9f0 0 6px,#eef5f8 6px 12px)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '400 7px/1.2 ui-monospace,monospace', color: '#7d99a8', textAlign: 'center', padding: 3 }}>{slotLabel || 'no photo'}</div>
            </>
          )}
          {busy && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, border: `2px solid ${LINE}`, borderTopColor: ACCENT, animation: 'salSpin .9s linear infinite' }} />
          </div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => ref.current?.click()} disabled={busy} style={{ flex: 1, padding: '9px 12px' }}>
              {busy ? 'Uploading…' : value ? 'Replace' : 'Choose photo'}
            </Button>
            {value && <Button tone="danger" onClick={() => onChange(null)} style={{ padding: '9px 12px' }}>Remove</Button>}
          </div>
          <span style={{ font: '400 11px/1.4 Manrope,sans-serif', color: '#a9bec9' }}>Resized and compressed automatically.</span>
        </div>
      </div>
      {err && <span style={{ font: '500 11.5px/1.4 Manrope,sans-serif', color: '#b4453c' }}>{err}</span>}
      <input ref={ref} type="file" accept="image/*" onChange={pick} style={{ display: 'none' }} />
    </div>
  );
}

export function Card({ children, style }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(11,45,62,.08)', boxShadow: '0 2px 10px rgba(11,45,62,.05)', ...style }}>
      {children}
    </div>
  );
}

export function Empty({ children }) {
  return (
    <div style={{ padding: '38px 20px', textAlign: 'center', font: "italic 400 16px/1.4 'Cormorant Garamond',serif", color: '#a9bec9' }}>
      {children}
    </div>
  );
}
