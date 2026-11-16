# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js, http://localhost:3000)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint (eslint-config-next)
npx tsc --noEmit # Typecheck only
```

There is **no test suite** in this repo.

The app runs standalone — no external tile server is required at dev time (see "Tile data" below). `data/mbtiles/` only holds the MBTiles the PMTiles were converted from.

## What this is

**Geodashboard Bekasi** (formerly BekasiGIS) — a Next.js WebGIS that visualizes disaster-risk zones across the 12 kecamatan of Kota Bekasi. Risk classes (`Risiko Tinggi` / `Risiko Sedang` / `Risiko Rendah`, K=3, data BPS 2025) are produced offline by K-Means clustering and baked into the tile data as a `Risk_Label` property; this repo only renders them.

## Architecture

Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript. Code is organized by feature: `app/` holds routes only (`page.tsx`, `map/page.tsx`, `performance-test/`), `features/<name>/` holds each feature's components, hooks, constants and types, and `tools/` holds testing scripts and local CLI tools (not part of the app). Import via the `@/` root alias (e.g. `@/features/map/constants`). There are two distinct surfaces:

1. **Marketing homepage** (`app/page.tsx`) — composed from `features/home/components/`: `layout/` (`Navbar`, `Footer`), `sections/` (`About`, `Features`, `DataSources`, `Contact`) and `dashboard/` (the hero). Animation keyframes/utility classes live in `app/globals.css` (`anim-fade-up`, `animate-blink`, tour keyframes). Monospace labels use Tailwind `font-mono` = Geist Mono (loaded via `next/font` in `app/layout.tsx`); hero card tokens are in `dashboard/ui.ts`. `hooks/useScrollY` drives the navbar scrolled-state (the page background is plain white, no decorative layers); `HeroDashboard` is `memo`'d so scroll doesn't re-render it.
   - **Hero dashboard** — `HeroDashboard` lays out `KeyStats` (headline + `CtaCard`) beside `AffectedRanking` + `RiskDistribution`, then the 6-tile `KpiRow`. No map on the homepage: the former 3D `RiskGlobe` was removed (hard to justify in the thesis), so the homepage loads no MapLibre.
   - **Dashboard numbers** are hardcoded in `features/home/data/stats.ts`, aggregated from `public/spatial_risk.geojson`. They count *kelurahan affected*, not incidents. After regenerating the data run `node tools/check-home-stats.mjs` (fails if any number drifted).

2. **Map dashboard** (`app/map/page.tsx` → `features/map/components/MapDashboard.tsx`) — the real application. `MapDashboard` is loaded via `next/dynamic` with **`ssr: false`** because MapLibre and the PMTiles protocol require the browser. `MapDashboard` is the single stateful container; everything else is presentational and gets state + setters as props, grouped by folder under `features/map/components/`: `layers/` (`MapLayers` = every `<Source>/<Layer>`, `PitchControl`), `sidebar/` (`MapSidebar` shell + `SidebarHeader`, `SearchPanel`, `AboutPanel`, `LayerPanel`, `MeasurePanel`), `overlays/` (legend, popup, area card, hover tooltip, coordinates, emergency, `ToolHint`) and `tour/` (`MapTour` logic, `tourSteps`, `tourLayout`, `TourCard`, `GestureDemo`). Pure helpers live in `features/map/lib/` (`toPopupInfo`, `drawnShapeAt`). Layer visibility is one `Record<LayerKey, boolean>` state.

### Map data flow

- **Tile data** is served as **PMTiles** from `public/*.pmtiles` (`spatial_risk.pmtiles`, `kecamatan_borders.pmtiles`). The PMTiles protocol is registered once at module load in `MapDashboard.tsx` (`maplibregl.addProtocol("pmtiles", ...)`), and sources reference it as `url="pmtiles:///spatial_risk.pmtiles"`. (The project migrated from MBTiles/TileServer-GL to PMTiles.)
- **Point layers** (`rumah_sakit.geojson`, `puskesmas.geojson`, `school.geojson`) are fetched from `public/` at runtime via `useGeoJson` and passed to `<Source type="geojson">`.
- **Basemap** is the external CartoCDN Positron style (`MAP_STYLE` in `features/map/constants.ts`).
- Feature properties carry Indonesian, space-containing keys (e.g. `'Total Penduduk'`, `'Banjir_2020'`, `'Luas Area (km²)'`) read by string index in `lib/popupInfo.ts`. Risk colors live in `RISK_LEVELS` (`features/map/constants.ts`), which drives the legend/filter and the MapLibre fill `match` expression; the Tailwind class strings in `getRiskColor()` are a second copy that must be kept in sync.

### Custom hooks (`features/*/`)

- `useGeoman` — wraps `@geoman-io/maplibre-geoman-free` for the measurement tools. **All Geoman built-in UI is disabled** (`uiEnabled: false` for every control, plus `.maplibregl-ctrl-top-left { display: none }` in globals.css); drawing is driven entirely from `MapSidebar`'s custom buttons via `toggleDrawMode`. `toggleDrawMode` takes a `MapTool`: a draw shape or `edit`/`drag`/`delete` (Geoman's global modes); a finished shape switches to `edit` automatically (`gm:create`), and `TOOL_HINTS` in `overlays/ToolHint.tsx` is the on-map instruction banner per tool. `freehand` is not a Geoman mode (the free build lacks it): an effect in `useGeoman` collects the drag stroke and imports it as a polygon. `clearAll()` intentionally does `window.location.reload()` as a shortcut to wipe drawn shapes (noted in-code) — be aware before "fixing" it.
- `useMapSearch` — geocodes via Nominatim, hardcoding `+Bekasi` onto the query, then `flyTo` the result.

### Responsive conventions

Breakpoints: phone `<640px`, tablet/iPad `640–1024px`, desktop `≥1024px`. Section padding uses `px-5 sm:px-8 lg:px-12`. The map `MapSidebar` is a slide-in drawer below `lg` (toggled by a floating button + backdrop in `MapDashboard`, `isOpen`/`onClose` props) and a persistent panel at `lg` via `lg:translate-x-0`. Cursor-coordinate readout is hidden on touch (`hidden sm:flex`).

## Conventions

- Comments are in Bahasa Indonesia: one sentence per file/section saying what it is or why, no labels that just repeat the markup.

## Gotchas

- `reactStrictMode` is **off** (`next.config.ts`) — relevant because the MapLibre/Geoman init effects are not double-invocation safe.
- Adding/renaming a risk class requires editing both `RISK_LEVELS` and `getRiskColor`.
- The `<Map hash>` prop keeps `#zoom/lat/lng` in the URL; the sidebar Share button just shares `location.href`.
