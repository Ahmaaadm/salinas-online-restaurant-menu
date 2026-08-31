# Salinas — Online Menu (React + Vite)

Mobile-first online menu for **Salinas · Chef de la Mer Abo Mazloum**. Tap a dish to add it, the sticky bar shows the running total, "View Order" opens the order sheet, and the selection can be sent to the restaurant over WhatsApp. No payment, no delivery tracking — the order is a message, not a checkout.

An animated **Plat du Jour** carousel sits above the categories, and staff manage everything from an admin panel at `#/admin`.

## Run it

Requires Node 18+.

```bash
cd salinas-react
npm install
npm run dev     # http://localhost:5173
npm run build   # production bundle in dist/
```

## Open in VS Code + Claude Code

```bash
code salinas-react     # open the folder in VS Code
claude                 # start Claude Code inside that folder (in the VS Code terminal)
```

Then ask Claude Code things like "add a search field to the menu" or "make the order sheet send a WhatsApp message". `CLAUDE.md` in this folder tells it the project conventions.

## Ordering over WhatsApp

Set the restaurant's number in `.env` and the order sheet grows a **Send order on WhatsApp** button:

```
VITE_WHATSAPP_NUMBER=221771234567    # country code first, digits only, no + or spaces
```

Leave it empty and the button never renders — the menu stays purely display-only.

The guest optionally types a name or table number, taps the button, and WhatsApp opens with the
order already written:

```
*SALINAS — New order*

2 × Fried Calamari — 15 000 FCFA
1 × Whole Sea Bass — 17 000 FCFA

*Total: 32 000 FCFA*

Name / table: Ahmad — table 4
```

They press send themselves; the restaurant confirms in the chat. There is no payment step and
no order is stored anywhere — it is a handoff, not a checkout.

## Admin panel

Open `#/admin` (or tap **Staff** at the bottom of the menu). Three tabs:

| Tab | What you can do |
| --- | --- |
| Plat du Jour | Plan the week — pick a day, add as many plats as you like to it, reorder, hide, delete |
| Dishes | Add/edit any dish, move it between categories, mark it sold out, reorder within a category |
| Categories | Add/edit/reorder categories. Deleting one deletes its dishes. Empty categories are hidden |

Photos are resized and compressed in the browser before they are stored.

### Planning the week

The **Plat du Jour** tab is a week planner. Arrows move between weeks, the seven chips are the
days (a dot per plat, so gaps are obvious), and everything below applies to the day you picked.

The intended rhythm is that the owner sits down on Sunday and fills the week ahead — which is
why the tab opens on **next** week when today is Sunday. A day can hold as many plats as you
want; guests only ever see the ones dated to the day they are visiting.

Every plat belongs to a day — that is what makes it a plat du jour. There is no permanent or
undated kind; for dishes that are always available, use the **Dishes** tab instead.

Weeks run Monday–Sunday, and dates are the restaurant's own local calendar days.

## Data: local mode vs Supabase

The app runs on a swappable data layer, so it works with **zero setup** and upgrades without a rewrite.

**Local mode (default).** No account, no cost. The menu is seeded from `src/menuData.js` into
`localStorage` and edits stay in that one browser. Sign in at `#/admin` with the passcode
`salinas` (override with `VITE_ADMIN_PASSCODE`). Good for trying the panel out; not for a real
restaurant, since edits don't reach other devices.

**Supabase mode.** Real Postgres, shared across every device, CDN-hosted photos — free tier, no card:

1. Create a project at [supabase.com](https://supabase.com).
2. SQL Editor → paste and run `supabase/schema.sql` (tables, row-level security, photo bucket).
3. SQL Editor → paste and run `supabase/seed.sql` (your categories and dishes).
4. SQL Editor → paste and run `supabase/open-writes.sql` — required, because the panel uses a
   static passcode rather than Supabase Auth. Read the header comment in that file first.
   *(Already have the tables from an earlier version? Run `supabase/add-service-date.sql` too —
   it adds the plat du jour scheduling column.)*
5. Copy `.env.example` to `.env` and fill in:

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co     # bare project URL, no /rest/v1
   VITE_SUPABASE_ANON_KEY=sb_publishable_...      # anon / publishable, never service_role
   ```

6. Restart `npm run dev` — Vite reads `.env` only at startup. The admin header now reads
   **Supabase** instead of **Local browser storage**.

### About the passcode

There are no accounts. `#/admin` asks for `VITE_ADMIN_PASSCODE` (default `salinas`) and that is
the whole gate, in both modes.

The comparison happens in the visitor's browser, so it keeps people out of the *panel* but not
out of the *database*: `open-writes.sql` lets the publishable key write, and that key is in the
page source. Anyone motivated enough to open DevTools can change the menu through the REST API
without ever seeing the passcode screen.

For a display-only menu that is usually an acceptable trade. To close it later, re-run
`supabase/schema.sql` (which restores authenticated-only writes) and switch the login back to
`signInWithPassword`.

Local-mode edits live in one browser and do **not** migrate. The menu comes in via
`supabase/seed.sql` (step 3) — regenerate it with `npm run seed:sql` if you have edited
`src/menuData.js` since.

## Files

| File | What's in it |
| --- | --- |
| `src/menuData.js` | Seed menu — categories, dishes, Arabic names, prices, image slots |
| `src/App.jsx` | The guest menu: `Header`, `CategoryRail`, `DishRow`, `OrderSheet`, cart state |
| `src/components/PlatDuJour.jsx` | The animated specials carousel (swipe, autoplay, dots) |
| `src/lib/store.js` | Picks an adapter, exposes `useMenuStore()` to React |
| `src/lib/localAdapter.js` | localStorage implementation |
| `src/lib/supabaseAdapter.js` | Supabase implementation (lazy-loaded) |
| `src/lib/images.js` | Browser-side resize + compress before upload |
| `src/lib/money.js` | FCFA formatting, shared by menu and admin |
| `src/lib/whatsapp.js` | Builds the order message and the `wa.me` link |
| `src/admin/AdminApp.jsx` | The admin panel — login, tabs, editors |
| `src/admin/ui.jsx` | Shared form controls for the panel |
| `src/components/PrintMenu.jsx` | The A4 carte — cover, categories, dish grid |
| `src/lib/week.js` | Local-time date helpers for the week planner |
| `supabase/schema.sql` | Tables, row-level security, storage bucket |
| `supabase/add-service-date.sql` | Migration adding plat du jour scheduling |
| `supabase/require-service-date.sql` | Migration making the serving day mandatory |
| `src/index.css` | Resets, CSS variables (colors/fonts), keyframes |
| `index.html` | Google Fonts (Cormorant Garamond + Manrope), viewport, theme color |

## Export the menu as A4

**Staff only.** Sign in at `#/admin` and hit the **A4** button in the bottom bar, next to *Add*.
It opens the browser print dialog — print it, or choose *Save as PDF* for something you can email
or hand to a printer. Guests never see it, and never download the code for it either: the
document lives in the lazy-loaded admin chunk.

The printed carte is a separate document ([`src/components/PrintMenu.jsx`](src/components/PrintMenu.jsx)
plus the `@media print` block in `src/index.css`), not the screen menu squeezed onto paper:

- A cover sheet with the harbour photo, the wordmark and the founder
- Numbered category headers with the category photo and Arabic name
- Dishes three across with their photos, dotted leaders to the price
- Categories with no photos fall back to a single-column classic carte, which reads better
  than a grid of empty boxes

Nothing in it depends on CSS backgrounds, because Chrome's print dialog ships with **Background
graphics** unchecked and silently drops them. Structure comes from rules, borders and photos, so
it prints correctly either way.

**Plat du jour is deliberately left out** — it changes every day, so a printed sheet would be
wrong by tomorrow.

The document is only built while you are exporting, and it waits for every photo to load before
the dialog opens, so nothing prints blank.

## The header photo

Save the harbour photo as **`public/header.jpg`** and it becomes the header background
automatically — no import, no rebuild step, no code change. Landscape crops work best; the
image is covered and centred, and a navy scrim keeps the wordmark readable over it.

If the file is missing the header falls back to the navy gradient, so nothing breaks.

## Adding real photos

Upload them from the admin panel — that is the whole workflow now. Any dish, category, or
special without a photo shows the striped placeholder labelled with what belongs there.
Categories fall back to their first dish's photo.

## Design tokens

- Navy gradient `#0b2f42 → #12455e → #17607f`, page `#f7fbfc`, tint `#e9f3f8`
- Accent blue `#2b7fa8`, soft `#3f9dc9`, highlight `#7fd0f0`
- Muted text `#7b98a8`, faint `#a9bec9`
- Display serif: Cormorant Garamond · UI sans: Manrope
- Radii: 12 / 16 (cards) · 15–24 (buttons, sheet) · pills fully round
- Max content width 430px, centered

## Deploy

Static output — `npm run build` then host `dist/` on Netlify, Vercel, or GitHub Pages. For a QR-code table menu, point the QR at the deployed URL.
