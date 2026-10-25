'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { ExpressionSpecification, StyleSpecification, LayerSpecification, EaseToOptions, JumpToOptions } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from 'pmtiles';
import { DEFAULT_VIEW_STATE, RISK_LEVELS } from '@/app/constants/map';

// Same registration as MapDashboard.
const protocol = new Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);

type Mode = 'vector' | 'raster' | 'geojson';

export interface BenchResult {
  mode: Mode;
  zoom_fps: number;
  pan_fps: number;
  dropped_frames_zoom: number;
  dropped_frames_pan: number;
  transfer_kb: number;
  refresh_hz: number;
  load_ms: number;
}

declare global {
  interface Window {
    runBenchmark?: () => Promise<BenchResult>;
    benchMap?: maplibregl.Map;
    benchReady?: boolean;
  }
}

// Kota Bekasi bounds (PMTiles header bounds of spatial_risk / kecamatan_borders).
const BOUNDS: [number, number, number, number] = [106.897728, -6.397356, 107.04377, -6.1670299];
const CENTER: [number, number] = [DEFAULT_VIEW_STATE.longitude, DEFAULT_VIEW_STATE.latitude];
const DROPPED_FRAME_MS = 25;

const RISK_FILL_COLOR = ['match', ['get', 'Risk_Label'], ...RISK_LEVELS.flatMap(l => [l.label, l.color]), '#cccccc'] as unknown as ExpressionSpecification;

// Paint values copied from MapDashboard.tsx.
const VECTOR_LAYERS: LayerSpecification[] = [
  { id: 'risk-fills', type: 'fill', source: 'spatial_risk', 'source-layer': 'spatial_risk',
    paint: { 'fill-color': RISK_FILL_COLOR, 'fill-opacity': 0.65 } },
  { id: 'desa-borders', type: 'line', source: 'spatial_risk', 'source-layer': 'spatial_risk',
    paint: { 'line-color': '#1e3a8a', 'line-width': 0.8, 'line-opacity': 0.8 } },
  { id: 'district-borders', type: 'line', source: 'kecamatan_borders', 'source-layer': 'kecamatan_borders',
    paint: { 'line-color': '#1e293b', 'line-width': 2.5, 'line-opacity': 1 } },
];

// Same layers and the same paint objects as VECTOR_LAYERS, minus 'source-layer' (GeoJSON sources have none).
const GEOJSON_LAYERS = VECTOR_LAYERS.map(
  (l) => Object.fromEntries(Object.entries(l).filter(([k]) => k !== 'source-layer')) as LayerSpecification,
);

// Data requests counted for transfer_kb in each mode.
const DATA_PATTERN: Record<Mode, string> = { vector: '.pmtiles', raster: '/raster_tiles/', geojson: '.geojson' };

function buildStyle(mode: Mode): StyleSpecification {
  const style: StyleSpecification = {
    version: 8,
    sources: {},
    layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#ffffff' } }],
  };
  if (mode === 'vector') {
    style.sources.spatial_risk = { type: 'vector', url: 'pmtiles:///spatial_risk.pmtiles' };
    style.sources.kecamatan_borders = { type: 'vector', url: 'pmtiles:///kecamatan_borders.pmtiles' };
    style.layers.push(...VECTOR_LAYERS);
  } else if (mode === 'geojson') {
    // Raw GeoJSON (the files the PMTiles were built from), downloaded once and tiled client-side by MapLibre.
    style.sources.spatial_risk = { type: 'geojson', data: '/spatial_risk.geojson' };
    style.sources.kecamatan_borders = { type: 'geojson', data: '/kecamatan_borders.geojson' };
    style.layers.push(...GEOJSON_LAYERS);
  } else {
    // bounds: tiles only exist inside Kota Bekasi; without it MapLibre would request (404) tiles
    // outside the generated set, which would pollute transfer_kb. PMTiles sources carry the same bounds.
    style.sources.raster = { type: 'raster', tiles: ['/raster_tiles/{z}/{x}/{y}.png'], tileSize: 256, minzoom: 10, maxzoom: 14, bounds: BOUNDS };
    style.layers.push({ id: 'raster', type: 'raster', source: 'raster' });
  }
  return style;
}

const linear = (t: number) => t;

export default function BenchMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('mode');
    const mode: Mode = requested === 'raster' || requested === 'geojson' ? requested : 'vector';
    // The default buffer (250 entries) is too small to hold every tile request of a run.
    performance.setResourceTimingBufferSize(100000);

    const map = new maplibregl.Map({
      container: containerRef.current!,
      style: buildStyle(mode),
      center: CENTER,
      zoom: 11,
      maxZoom: 16,
      attributionControl: false,
    });
    window.benchMap = map;
    // load_ms: time from navigation start to the first fully rendered (idle) map.
    let loadMs = 0;
    map.once('idle', () => { loadMs = performance.now(); window.benchReady = true; });

    // triggerRepaint guarantees one more render, so 'idle' fires even if the map was already idle.
    const waitIdle = () => new Promise<void>(resolve => {
      map.once('idle', () => resolve());
      map.triggerRepaint();
    });
    const jumpToIdle = async (opts: JumpToOptions) => {
      const idle = waitIdle();
      map.jumpTo(opts);
      await idle;
    };
    const easeToEnd = (opts: EaseToOptions) => new Promise<void>(resolve => {
      map.once('moveend', () => resolve());
      map.easeTo({ ...opts, easing: linear, essential: true });
    });

    // Records every requestAnimationFrame timestamp while `run` is in progress.
    const recordFrames = async (run: () => Promise<void>) => {
      const timestamps: number[] = [];
      let recording = true;
      const loop = (t: number) => {
        if (!recording) return;
        timestamps.push(t);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
      await run();
      recording = false;
      return timestamps;
    };

    const frameStats = (ts: number[]) => {
      let dropped = 0;
      for (let i = 1; i < ts.length; i++) if (ts[i] - ts[i - 1] > DROPPED_FRAME_MS) dropped++;
      const seconds = (ts[ts.length - 1] - ts[0]) / 1000;
      return { fps: (ts.length - 1) / seconds, dropped };
    };

    const measureRefreshHz = () => new Promise<number>(resolve => {
      let frames = 0;
      let start: number | null = null;
      const loop = (t: number) => {
        if (start === null) start = t;
        if (t - start >= 1000) return resolve(frames);
        frames++;
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });

    window.runBenchmark = async () => {
      // g) display refresh rate, measured while the map is idle.
      const refresh_hz = await measureRefreshHz();

      const scenarioStart = performance.now();

      // a) start view.
      await jumpToIdle({ center: CENTER, zoom: 11 });

      // b) ZOOM phase.
      const zoomFrames = await recordFrames(() => easeToEnd({ center: CENTER, zoom: 16, duration: 5000 }));

      // c) settle, then jump to the west edge at zoom 14.
      await waitIdle();
      const lat = CENTER[1];
      await jumpToIdle({ center: [BOUNDS[0], lat], zoom: 14 });

      // d) PAN phase: 4 legs west → east, 2500 ms each.
      const panFrames = await recordFrames(async () => {
        for (let i = 1; i <= 4; i++) {
          const lng = BOUNDS[0] + ((BOUNDS[2] - BOUNDS[0]) * i) / 4;
          await easeToEnd({ center: [lng, lat], zoom: 14, duration: 2500 });
        }
      });

      // f) tile bytes transferred during the scenario. GeoJSON is fetched once, before the scenario and inside
      // MapLibre's worker (not visible here), so it is 0 for geojson; run-bench.mjs measures initial_kb from the network.
      const pattern = DATA_PATTERN[mode];
      const transferBytes = (performance.getEntriesByType('resource') as PerformanceResourceTiming[])
        .filter(e => e.startTime >= scenarioStart && e.name.includes(pattern))
        .reduce((sum, e) => sum + e.transferSize, 0);

      // e) per-phase stats.
      const zoom = frameStats(zoomFrames);
      const pan = frameStats(panFrames);

      return {
        mode,
        zoom_fps: zoom.fps,
        pan_fps: pan.fps,
        dropped_frames_zoom: zoom.dropped,
        dropped_frames_pan: pan.dropped,
        transfer_kb: transferBytes / 1024,
        refresh_hz,
        load_ms: loadMs,
      };
    };

    return () => {
      delete window.runBenchmark;
      delete window.benchMap;
      delete window.benchReady;
      map.remove();
    };
  }, []);

  return <div ref={containerRef} style={{ position: 'fixed', inset: 0 }} />;
}
