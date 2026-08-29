/* Hands a finished selection off to the restaurant's WhatsApp.
   Still no checkout — this composes a message and opens WhatsApp; the guest
   sends it themselves and the restaurant confirms in the chat. */
import { money } from './money.js';

/* wa.me wants digits only: full country code, no +, spaces or dashes. */
export const normalizeNumber = raw => (raw || '').replace(/\D/g, '');

export const whatsappNumber = normalizeNumber(import.meta.env.VITE_WHATSAPP_NUMBER);

export const RESTAURANT = 'SALINAS';

export function buildOrderMessage(lines, total, note) {
  const body = lines.map(l => `${l.qty} × ${l.name} — ${money(l.price * l.qty)}`);

  return [
    `*${RESTAURANT} — New order*`,
    '',
    ...body,
    '',
    `*Total: ${money(total)}*`,
    ...(note?.trim() ? ['', `Name / table: ${note.trim()}`] : [])
  ].join('\n');
}

export function whatsappUrl(lines, total, note) {
  if (!whatsappNumber) return null;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildOrderMessage(lines, total, note))}`;
}
