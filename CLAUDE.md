# Salinas Online Menu — project conventions

Mobile-first (max width 430px, centered) online menu for a Lebanese seafood restaurant.
Display only: **no checkout, no payment, no delivery tracking** — tapping a dish just adds it to
a local selection so guests can tally what they want. The selection can be handed off to the
restaurant's WhatsApp as a pre-written message (`src/lib/whatsapp.js`); the guest presses send
themselves and the restaurant confirms in the chat. Never add a payment step.

## Rules
- Menu content comes from the data layer (`src/lib/store.js`), never hardcoded in JSX.
  `src/menuData.js` is now the **seed** for local mode and the reference shape — keep it valid,
  but the live menu is whatever the adapter returns.
- Two adapters, one interface: `localAdapter.js` (localStorage, zero setup) and
  `supabaseAdapter.js` (Postgres + auth + storage). Supabase is used when `VITE_SUPABASE_URL`
  and `VITE_SUPABASE_ANON_KEY` are set. Any new persistence goes in **both** adapters.
- Styling is inline React style objects (matching the original design) plus CSS variables and
  keyframes in `src/index.css`. Don't add a CSS framework or Tailwind unless asked.
- Every dish name has an Arabic line beneath it (`direction: rtl`). Keep both in sync.
- Cart state is a plain `{ itemId: qty }` object in `App.jsx`. No state library.
- Touch targets ≥ 30px; body copy ≥ 12.5px.
- Colours are **role tokens** on `:root` in `src/index.css` (`--page`, `--surface`, `--card`,
  `--deep`, `--ink`, `--on-deep`, `--accent`, `--line*`), never raw hex in JSX. Inline styles
  use `var(--token)`; adding a literal breaks the palette.
- One palette: **ocean** — sky blue throughout, white type. The ground is deep on purpose, so
  white body text clears 4.5:1; a literal baby blue would sit near 1.7:1. Nothing uses pure
  `#ffffff` as a surface. Dish rows are cards (`--card`, `--card-line`).
- The `@media print` block **pins** `--navy` and `--accent` on `.pm-doc`. The screen palette is
  dark and the carte prints on white paper — without pinning, prices print pale on white.
- Fonts: Cormorant Garamond (display/serif), Manrope (UI). Loaded in `index.html`.
- `image_url: null` renders a striped placeholder — do not delete that fallback.
- Plat du jour is its own `specials` table, not a flag on dishes. The carousel hides itself
  when there are no active specials for today.
- Specials are scheduled per calendar day via `service_date`, which is required; several plats
  may share a day. There is no undated "always showing" plat — that was removed deliberately,
  a plat du jour belongs to a day. Guests see `specialsForDate(db, todayISO())`.
  Dates are local-time throughout (`src/lib/week.js`) — never `toISOString()`, which would
  shift the day across midnight. Weeks run Monday–Sunday; the planner opens on next week when
  today is Sunday, because that is when the owner plans.
- Admin panel is at `#/admin` (hash routing, no router dependency) and is lazy-loaded so
  guests never download it. Keep it that way.
- Admin sign-in is a static passcode (`VITE_ADMIN_PASSCODE`, default `salinas`) in
  `src/lib/gate.js`, shared by both adapters. There is no Supabase Auth — this was a deliberate
  choice by the owner. It means RLS allows anonymous writes (`supabase/open-writes.sql`), so
  treat the panel as unprotected and never put anything sensitive behind it.
- Photos are resized in the browser before upload (`src/lib/images.js`) — the Supabase free
  tier has no server-side image transformation.

- The A4 export (`src/components/PrintMenu.jsx` + the `@media print` block in `index.css`) is a
  separate document, not the screen menu reflowed. It is **admin-only** — mounted from
  `AdminApp`, so it stays in the lazy chunk and guests never download it. It mounts only while
  exporting, waits for images, then calls `window.print()`, and never includes plat du jour.
  Both the guest shell and the admin panel carry `.screen-only` so print hides them; keep that.
- Print styling must not rely on `background`/gradients — Chrome's "Background graphics" box is
  unchecked by default and drops them. Use rules, borders and `<img>`.

## Commands
- `npm run dev` — dev server
- `npm run build` — production build to `dist/`
- `supabase/schema.sql` — run once in the Supabase SQL editor to create tables, RLS and the bucket
