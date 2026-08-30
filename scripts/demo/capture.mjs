import http from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { db } from './demo-data.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DIST = path.join(ROOT, 'dist-demo');
const OUT = path.join(ROOT, 'demo');
const PORT = 5211;
const CHROME = '/usr/bin/google-chrome-stable';

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };

function serve() {
  const server = http.createServer(async (req, res) => {
    const url = req.url.split('?')[0];
    let file = path.join(DIST, url === '/' ? 'index.html' : url);
    if (!existsSync(file) || !file.startsWith(DIST)) file = path.join(DIST, 'index.html');
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise(r => server.listen(PORT, () => r(server)));
}

const wait = ms => new Promise(r => setTimeout(r, ms));

const shots = [];
async function shot(page, name) {
  const buf = await page.screenshot({ type: 'png' });
  shots.push({ name, b64: Buffer.from(buf).toString('base64') });
  console.log(`  captured ${shots.length}. ${name}`);
}

const server = await serve();
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-color-profile=srgb', '--font-render-hinting=none']
});

const page = await browser.newPage();
await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

const base = `http://localhost:${PORT}`;

/* Seed the demo menu, then reload so the app boots from it. */
await page.goto(base, { waitUntil: 'networkidle0' });
await page.evaluate(data => {
  localStorage.setItem('salinas.menu.v1', JSON.stringify(data));
}, db);

// ---------------------------------------------------------------- 1. home
await page.goto(base, { waitUntil: 'networkidle0' });
await wait(1600);
await shot(page, 'home');

// ------------------------------------------------------- 2. menu browsing
await page.evaluate(() => window.scrollTo({ top: 620, behavior: 'instant' }));
await wait(700);
await shot(page, 'menu');

// --------------------------------------------------- 3. building an order
await page.evaluate(() => {
  const rows = [...document.querySelectorAll('div[role="button"]')];
  rows[0]?.click(); rows[0]?.click(); rows[2]?.click(); rows[3]?.click();
});
await wait(900);
await shot(page, 'selecting');

// ---------------------------------------------------------- 4. order sheet
await page.evaluate(() => {
  [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'View Order')?.click();
});
await wait(900);
await shot(page, 'order-sheet');

// ----------------------------------------------------- 5. whatsapp handoff
await page.evaluate(() => {
  const input = document.querySelector('input[placeholder*="table number"]');
  if (input) {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'Ahmad — table 4');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
});
await wait(700);
await shot(page, 'whatsapp');

// ---------------------------------------------------------- 6. admin login
await page.evaluate(() => { sessionStorage.clear(); });
await page.goto(`${base}/#/admin`, { waitUntil: 'networkidle0' });
await wait(1200);
await shot(page, 'admin-login');

// ----------------------------------------------------------- 7. admin list
await page.evaluate(() => {
  const input = document.querySelector('input[type="password"]');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(input, 'salinas');
  input.dispatchEvent(new Event('input', { bubbles: true }));
});
await wait(300);
await page.evaluate(() => {
  [...document.querySelectorAll('button')].find(b => b.textContent.includes('Sign in'))?.click();
});
await wait(1400);
await page.evaluate(() => {
  [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Dishes')?.click();
});
await wait(900);
await shot(page, 'admin-dishes');

// --------------------------------------------------------- 8. admin editor
await page.evaluate(() => {
  const row = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Fried Calamari'));
  row?.click();
});
await wait(1100);
await shot(page, 'admin-editor');

await browser.close();
server.close();

await mkdir(OUT, { recursive: true });
await writeFile(path.join(OUT, 'shots.json'), JSON.stringify(shots));

/* Individual PNGs too — handy for decks, chat, or the app store listing. */
await Promise.all(shots.map((s, i) =>
  writeFile(path.join(OUT, `${String(i + 1).padStart(2, '0')}-${s.name}.png`), Buffer.from(s.b64, 'base64'))));
console.log(`\n${shots.length} screenshots captured`);
