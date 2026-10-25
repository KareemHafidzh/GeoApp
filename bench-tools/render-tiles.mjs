// Renders the vector thematic layers into PNG XYZ raster tiles (z10–14) for the
// vector-vs-raster benchmark. MapLibre itself does the drawing, so the raster
// baseline uses exactly the same style as the vector map.
//
// Each tile is rendered as a 256×256 CSS-px viewport at devicePixelRatio 2
// (=512×512 px PNG, served with tileSize 256). An XYZ 256-px tile at zoom z
// equals MapLibre zoom z−1 (MapLibre's world is 512 px at zoom 0).
//
// Usage: node render-tiles.mjs   →  ../public/raster_tiles/{z}/{x}/{y}.png
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP = path.resolve(HERE, '..');
const OUT = path.join(APP, 'public', 'raster_tiles');
const ZOOMS = [10, 11, 12, 13, 14];

// Kota Bekasi bounds = PMTiles header bounds of spatial_risk / kecamatan_borders.
const BOUNDS = [106.897728, -6.397356, 107.04377, -6.1670299];

// Read RISK_LEVELS straight from the app so the colors can't drift.
const constants = fs.readFileSync(path.join(APP, 'app/constants/map.ts'), 'utf8');
const riskBlock = constants.match(/RISK_LEVELS\s*=\s*\[([\s\S]*?)\];/)[1];
const RISK_LEVELS = [...riskBlock.matchAll(/color:\s*'([^']+)',\s*label:\s*'([^']+)'/g)]
  .map(([, color, label]) => ({ color, label }));
if (RISK_LEVELS.length === 0) throw new Error('Could not parse RISK_LEVELS from app/constants/map.ts');

const lon2x = (lon, z) => Math.floor(((lon + 180) / 360) * 2 ** z);
const lat2y = (lat, z) => {
  const r = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z);
};
const tileCenter = (x, y, z) => {
  const n = 2 ** z;
  const lng = ((x + 0.5) / n) * 360 - 180;
  const lat = (Math.atan(Math.sinh(Math.PI * (1 - (2 * (y + 0.5)) / n))) * 180) / Math.PI;
  return [lng, lat];
};

// Files the render page needs, served from disk (read-only use of the app's node_modules/public).
const FILES = {
  '/render.html': [path.join(HERE, 'render.html'), 'text/html'],
  '/lib/maplibre-gl.js': [path.join(APP, 'node_modules/maplibre-gl/dist/maplibre-gl.js'), 'application/javascript'],
  '/lib/maplibre-gl.css': [path.join(APP, 'node_modules/maplibre-gl/dist/maplibre-gl.css'), 'text/css'],
  '/lib/pmtiles.js': [path.join(APP, 'node_modules/pmtiles/dist/pmtiles.js'), 'application/javascript'],
  '/spatial_risk.pmtiles': [path.join(APP, 'public/spatial_risk.pmtiles'), 'application/octet-stream'],
  '/kecamatan_borders.pmtiles': [path.join(APP, 'public/kecamatan_borders.pmtiles'), 'application/octet-stream'],
};

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 256, height: 256 }, deviceScaleFactor: 2 });
page.on('pageerror', (e) => console.error('pageerror:', e.message));

await page.route('http://tiles.local/**', async (route) => {
  const url = new URL(route.request().url());
  const entry = FILES[url.pathname];
  if (!entry) return route.fulfill({ status: 404, body: '' });
  const [file, contentType] = entry;
  const buf = fs.readFileSync(file);
  const range = route.request().headers()['range']; // PMTiles reads by HTTP range
  if (range) {
    const [, a, b] = range.match(/bytes=(\d+)-(\d*)/);
    const start = Number(a);
    const end = b ? Math.min(Number(b), buf.length - 1) : buf.length - 1;
    return route.fulfill({
      status: 206,
      headers: { 'Content-Type': contentType, 'Content-Range': `bytes ${start}-${end}/${buf.length}`, 'Accept-Ranges': 'bytes' },
      body: buf.subarray(start, end + 1),
    });
  }
  return route.fulfill({ status: 200, headers: { 'Content-Type': contentType }, body: buf });
});

await page.goto('http://tiles.local/render.html');
await page.evaluate((levels) => window.initMap(levels), RISK_LEVELS);

fs.rmSync(OUT, { recursive: true, force: true });
let count = 0;
let bytes = 0;
for (const z of ZOOMS) {
  const [x0, x1] = [lon2x(BOUNDS[0], z), lon2x(BOUNDS[2], z)];
  const [y0, y1] = [lat2y(BOUNDS[3], z), lat2y(BOUNDS[1], z)];
  let zCount = 0;
  for (let x = x0; x <= x1; x++) {
    for (let y = y0; y <= y1; y++) {
      const [lng, lat] = tileCenter(x, y, z);
      const dataUrl = await page.evaluate(([lng, lat, zoom]) => window.renderTile(lng, lat, zoom), [lng, lat, z - 1]);
      const png = Buffer.from(dataUrl.split(',')[1], 'base64');
      const dir = path.join(OUT, String(z), String(x));
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `${y}.png`), png);
      count++;
      zCount++;
      bytes += png.length;
    }
  }
  console.log(`z${z}: x ${x0}–${x1}, y ${y0}–${y1}, ${zCount} tiles`);
}
await browser.close();

console.log(`RISK_LEVELS used: ${JSON.stringify(RISK_LEVELS)}`);
console.log(`Total tiles: ${count}`);
console.log(`Total size: ${bytes / 1024} KB`);
