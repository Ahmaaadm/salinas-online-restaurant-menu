import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const OUT = path.resolve(import.meta.dirname, '../../demo');
const CHROME = '/usr/bin/google-chrome-stable';

const W = 1600, H = 900;
const PHONE_H = 812;
const PHONE_W = Math.round(PHONE_H * 430 / 932);

const shots = JSON.parse(await readFile(path.join(OUT, 'shots.json'), 'utf8'));

const slide = s => `
<section class="slide">
  <div class="bg"></div>
  <div class="ring r1"></div>
  <div class="ring r2"></div>
  <div class="glow"></div>
  <div class="phone"><img src="data:image/png;base64,${s.b64}" alt=""></div>
</section>`;

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @page { size: ${W}px ${H}px; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { background: #071e2b; }
  .slide {
    position: relative; width: ${W}px; height: ${H}px; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    break-after: page; page-break-after: always;
  }
  .slide:last-child { break-after: auto; page-break-after: auto; }
  .bg {
    position: absolute; inset: 0;
    background: linear-gradient(152deg, #0b2f42 0%, #12455e 52%, #17607f 100%);
  }
  .bg::after {
    content: ''; position: absolute; inset: 0; opacity: .16;
    background: repeating-linear-gradient(115deg, rgba(255,255,255,.5) 0 1px, transparent 1px 30px);
  }
  .ring { position: absolute; border-radius: 50%; border: 1px solid rgba(255,255,255,.13); }
  .r1 { width: 940px; height: 940px; right: -300px; top: -330px; }
  .r2 { width: 560px; height: 560px; left: -190px; bottom: -230px; border-color: rgba(255,255,255,.09); }
  .glow {
    position: absolute; width: 1000px; height: 1000px; border-radius: 50%;
    background: radial-gradient(circle, rgba(127,208,240,.20) 0%, rgba(127,208,240,0) 65%);
  }
  .phone {
    position: relative; width: ${PHONE_W}px; height: ${PHONE_H}px;
    border-radius: 30px; overflow: hidden;
    box-shadow: 0 40px 90px rgba(3,14,20,.62), 0 0 0 1px rgba(255,255,255,.10);
  }
  .phone img { width: 100%; height: 100%; display: block; object-fit: cover; }
</style></head>
<body>${shots.map(slide).join('')}</body></html>`;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-color-profile=srgb']
});
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0' });

const pdf = await page.pdf({
  width: `${W}px`, height: `${H}px`,
  printBackground: true, pageRanges: `1-${shots.length}`
});

await writeFile(path.join(OUT, 'salinas-demo.pdf'), Buffer.from(pdf));
await browser.close();
console.log(`PDF written — ${shots.length} slides`);
