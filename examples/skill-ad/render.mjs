// Renders film.html with Playwright from a local static server.
//   node render.mjs stills 0,2,5,10           -> qa/still-<t>.jpg
//   node render.mjs beats                     -> qa/beats.jpg (one frame per beat)
//   node render.mjs video [--fps 60 --sub 4] [--from 0 --to 31.7] [--out video.mp4]
import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const [mode = 'video', arg] = process.argv.slice(2);
const opt = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const FPS = Number(opt('fps', 60)), SUB = Number(opt('sub', 4)), OUT = opt('out', 'video.mp4'), PAGE = opt('page', 'film.html');
const VW = Number(opt('w', 1920)), VH = Number(opt('h', 1080)), TAG = opt('tag', '');

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const p = path.join(HERE, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(HERE) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: VW, height: VH } });
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('console.' + m.type(), m.text().slice(0, 300)); });
page.on('pageerror', (e) => console.log('pageerror', e.message));
await page.goto(base + PAGE);
await page.evaluate(() => window.ready);
const dur = await page.evaluate(() => window.DUR), beat = await page.evaluate(() => window.B);
fs.mkdirSync(path.join(HERE, 'qa'), { recursive: true });
const grab = async (t) => Buffer.from((await page.evaluate(([t]) => { window.seek(t); return document.getElementById('c').toDataURL('image/jpeg', 0.9); }, [t])).split(',')[1], 'base64');

if (mode === 'stills') {
  for (const t of arg.split(',').map(Number)) fs.writeFileSync(path.join(HERE, 'qa', `still${TAG}-${t.toFixed(2)}.jpg`), await grab(t));
} else if (mode === 'beats') {
  const dir = path.join(HERE, 'qa', 'beats' + TAG); fs.mkdirSync(dir, { recursive: true });
  const n = Math.round(dur / beat);
  for (let b = 0; b < n; b++) fs.writeFileSync(path.join(dir, `${String(b).padStart(2, '0')}.jpg`), await grab(b * beat + beat * 0.5));
  spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(dir, '%02d.jpg'), '-vf', (VW > VH ? 'scale=320:180,tile=8x8' : 'scale=180:320,tile=16x4') + ':padding=4:color=white', '-frames:v', '1', path.join(HERE, 'qa', 'beats' + TAG + '.jpg')], { stdio: 'inherit' });
} else {
  const from = Number(opt('from', 0)), to = Number(opt('to', dur));
  const i0 = Math.round(from * FPS), i1 = Math.round(to * FPS);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-r', String(FPS), path.join(HERE, OUT)], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = i0; i < i1; i++) {
    const url = await page.evaluate(([i, f, s]) => window.renderFrame(i, f, s), [i, FPS, SUB]);
    if (!ff.stdin.write(Buffer.from(url.split(',')[1], 'base64'))) await new Promise((r) => ff.stdin.once('drain', r));
    if ((i - i0) % 240 === 0) console.log(`${i - i0}/${i1 - i0}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  console.log(`${OUT} done in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
await browser.close();
server.close();
