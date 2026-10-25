// Vector vs raster vs GeoJSON FPS benchmark runner.
// Prerequisite (from the app root): npm run build && npm run start   (serves http://localhost:3000)
// Usage: node run-bench.mjs [runsPerMode=12]   (use a multiple of 3 so the rotation gives every mode every position equally)
//
// Writes results/runs.csv, results/summary.json, results/env.json and one z16 screenshot per mode.
import { chromium } from 'playwright';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RESULTS = path.join(HERE, 'results');
const SHOTS = '/Users/kareemhafidzh/Developer/Claude COWORK/THESIS/Cowork/Screenshots';
const BASE = process.env.BENCH_URL || 'http://localhost:3000';
const RUNS = Number(process.argv[2] || 12);
const MODES = ['vector', 'raster', 'geojson'];
const METRICS = ['zoom_fps', 'pan_fps', 'dropped_frames_zoom', 'dropped_frames_pan', 'transfer_kb', 'refresh_hz', 'initial_kb', 'load_ms', 'total_kb'];
const CONTEXT = { viewport: { width: 1280, height: 800 } };
const CENTER = [106.9896, -6.2335]; // DEFAULT_VIEW_STATE
// initial_kb: data bytes on the wire (body + headers) before runBenchmark() starts, counted from Playwright's network
// events for every mode alike. In-page resource timing cannot see GeoJSON, which MapLibre fetches inside a Web Worker.
const DATA_PATTERN = { vector: '.pmtiles', raster: '/raster_tiles/', geojson: '.geojson' };

fs.mkdirSync(RESULTS, { recursive: true });

const browser = await chromium.launch({
  headless: false,
  channel: 'chrome',
  // Keep rAF running at full rate even if the window is partly covered or not focused.
  args: ['--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling'],
});

async function openBench(mode) {
  const context = await browser.newContext(CONTEXT); // fresh context = empty cache
  const page = await context.newPage();
  page.on('pageerror', (e) => console.error(`[${mode}] pageerror:`, e.message));
  const dataSizes = [];
  page.on('requestfinished', (req) => {
    if (req.url().includes(DATA_PATTERN[mode])) dataSizes.push(req.sizes().then((s) => s.responseBodySize + s.responseHeadersSize));
  });
  await page.goto(`${BASE}/bench?mode=${mode}`);
  await page.bringToFront();
  await page.waitForFunction(() => window.benchReady === true, null, { timeout: 60000 });
  const initialKb = async () => (await Promise.all(dataSizes)).reduce((a, b) => a + b, 0) / 1024;
  return { context, page, initialKb };
}

const rows = [];
for (let run = 1; run <= RUNS; run++) {
  const order = MODES.map((_, i) => MODES[(i + run) % MODES.length]); // rotate: each mode takes each position in turn
  for (const mode of order) {
    const { context, page, initialKb } = await openBench(mode);
    const initial_kb = await initialKb(); // before the scenario starts
    const result = await page.evaluate(() => window.runBenchmark());
    await context.close();
    rows.push({ ...result, initial_kb, total_kb: initial_kb + result.transfer_kb, run }); // total: data before + during the scenario
    console.log(`run ${run} ${mode}`, JSON.stringify(result));
  }
}

// runs.csv (sorted by mode, then run)
rows.sort((a, b) => MODES.indexOf(a.mode) - MODES.indexOf(b.mode) || a.run - b.run);
const header = ['mode', 'run', ...METRICS];
const csv = [header.join(','), ...rows.map((r) => header.map((k) => r[k]).join(','))].join('\n') + '\n';
fs.writeFileSync(path.join(RESULTS, 'runs.csv'), csv);

// summary.json: mean / median / min / max of every metric per mode (unrounded)
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const summary = {};
for (const mode of MODES) {
  summary[mode] = { runs: rows.filter((r) => r.mode === mode).length };
  for (const metric of METRICS) {
    const xs = rows.filter((r) => r.mode === mode).map((r) => r[metric]);
    summary[mode][metric] = {
      mean: xs.reduce((a, b) => a + b, 0) / xs.length,
      median: median(xs),
      min: Math.min(...xs),
      max: Math.max(...xs),
    };
  }
}
fs.writeFileSync(path.join(RESULTS, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');

// z16 screenshots at the center for each mode
let devicePixelRatio;
for (const mode of MODES) {
  const { context, page } = await openBench(mode);
  devicePixelRatio = await page.evaluate(() => window.devicePixelRatio);
  await page.evaluate(
    (center) => new Promise((resolve) => {
      window.benchMap.once('idle', resolve);
      window.benchMap.jumpTo({ center, zoom: 16 });
    }),
    CENTER,
  );
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SHOTS, `bench-${mode}-z16.png`) });
  await context.close();
}

// GeoJSON compression: bytes on the wire vs decoded file size, in a separate fresh context.
// Read from Playwright's network events: MapLibre fetches GeoJSON in a Web Worker, outside the page's resource timing.
const geojsonTransfer = {};
{
  const context = await browser.newContext(CONTEXT);
  const page = await context.newPage();
  const pending = [];
  page.on('requestfinished', (req) => {
    if (!req.url().endsWith('.geojson')) return;
    pending.push((async () => {
      const res = await req.response();
      const sizes = await req.sizes();
      geojsonTransfer[new URL(req.url()).pathname] = {
        content_encoding: res.headers()['content-encoding'] || 'none',
        transfer_bytes: sizes.responseBodySize + sizes.responseHeadersSize, // body (as sent) + headers
        encoded_body_bytes: sizes.responseBodySize,
        decoded_body_bytes: (await res.body()).length,
      };
    })());
  });
  await page.goto(`${BASE}/bench?mode=geojson`);
  await page.waitForFunction(() => window.benchReady === true, null, { timeout: 60000 });
  await Promise.all(pending);
  await context.close();
}
console.log('geojson transfer:', JSON.stringify(geojsonTransfer));

// Environment
const sh = (cmd) => { try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch (e) { return `ERROR: ${e.message}`; } };
const env = {
  date: new Date().toISOString(),
  chrome_version: browser.version(),
  macos: sh('sw_vers'),
  hardware: sh("sysctl -n machdep.cpu.brand_string; sysctl -n hw.memsize"),
  displays: sh("system_profiler SPDisplaysDataType | grep -E 'Chipset|Resolution|Refresh|Display Type|UI Looks'"),
  power: sh('pmset -g batt'),
  playwright_viewport: CONTEXT.viewport,
  device_pixel_ratio: devicePixelRatio,
  base_url: BASE,
  runs_per_mode: RUNS,
  geojson_transfer: geojsonTransfer,
};
fs.writeFileSync(path.join(RESULTS, 'env.json'), JSON.stringify(env, null, 2) + '\n');

await browser.close();
console.log('\nDone. Results in', RESULTS);
