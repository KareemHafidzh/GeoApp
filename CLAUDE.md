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

The app runs standalone — no external tile server is required at dev time (see "Tile data" below). The `Dockerfile` is **not** for the app; it builds a TileServer-GL image from `data/mbtiles`, a legacy serving path no longer used by the running app.

## What this is

**BekasiGIS** — a Next.js WebGIS that visualizes disaster-risk zones across the 12 kecamatan of Kota Bekasi. Risk classes (`Very High Risk` / `High Risk` / `Medium Risk` / `Low Risk`) are produced offline by K-Means clustering and baked into the tile data as a `Risk_Label` property; this repo only renders them.

## Architecture

Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript. Everything lives under `app/`. There are two distinct surfaces:

1. **Marketing homepage** (`app/page.tsx`) — composed from `components/home/*` and `components/layout/*`. Heavy bespoke styling: animation keyframes/utility classes live in `app/globals.css` (`anim-fade-up`, `animate-blink`, etc.), fonts and effects are mostly inline `style={{ fontFamily: 'Syne'/'DM Mono' }}`. `useScrollY` drives parallax and the navbar scrolled-state.

2. **Map dashboard** (`app/map/page.tsx` → `components/map/MapDashboard.tsx`) — the real application. `MapDashboard` is loaded via `next/dynamic` with **`ssr: false`** because MapLibre and the PMTiles protocol require the browser. `MapDashboard` is the single stateful container; all sibling map components (`MapSidebar`, `MapLegend`, `MapAreaInfo`, `MapCoordinateBar`, `MapHoverTooltip`, `MapPopup`) are presentational and receive state + setters as props.

### Map data flow

- **Tile data** is served as **PMTiles** from `public/*.pmtiles` (`spatial_risk.pmtiles`, `kecamatan_borders.pmtiles`). The PMTiles protocol is registered once at module load in `MapDashboard.tsx` (`maplibregl.addProtocol("pmtiles", ...)`), and sources reference it as `url="pmtiles:///spatial_risk.pmtiles"`. Note the project migrated from MBTiles/TileServer-GL to PMTiles — `TILE_SERVER_URL` in `constants/map.ts` and the README's "Run TileServer-GL" step are **stale leftovers** of the old approach.
- **Point layers** (`rumah_sakit.geojson`, `school.geojson`) are fetched from `public/` at runtime into React state and passed to `<Source type="geojson">`.
- **Basemap** is the external CartoCDN Positron style (`MAP_STYLE` in `constants/map.ts`).
- Feature properties carry Indonesian, space-containing keys (e.g. `'Total Penduduk'`, `'Banjir_2020'`, `'Luas Area (km²)'`) read by string index in `MapDashboard.onClick`. Risk colors are defined **twice** and must be kept in sync: as MapLibre `match` paint expressions inline in `MapDashboard`, and as Tailwind class strings in `getRiskColor()` (`constants/map.ts`).

### Custom hooks (`app/hooks/`)

- `useGeoman` — wraps `@geoman-io/maplibre-geoman-free` for the measurement tools. **All Geoman built-in UI is disabled** (`uiEnabled: false` for every control, plus `.maplibregl-ctrl-top-left { display: none }` in globals.css); drawing is driven entirely from `MapSidebar`'s custom buttons via `toggleDrawMode`. `clearAll()` intentionally does `window.location.reload()` as a shortcut to wipe drawn shapes (noted in-code) — be aware before "fixing" it.
- `useMapSearch` — geocodes via Nominatim, hardcoding `+Bekasi` onto the query, then `flyTo` the result.

### Responsive conventions

Breakpoints: phone `<640px`, tablet/iPad `640–1024px`, desktop `≥1024px`. Section padding uses `px-5 sm:px-8 lg:px-12`. The map `MapSidebar` is a slide-in drawer below `lg` (toggled by a floating button + backdrop in `MapDashboard`, `isOpen`/`onClose` props) and a persistent panel at `lg` via `lg:translate-x-0`. Cursor-coordinate readout is hidden on touch (`hidden sm:flex`).

## Gotchas

- `reactStrictMode` is **off** (`next.config.ts`) — relevant because the MapLibre/Geoman init effects are not double-invocation safe.
- Adding/renaming a risk class requires editing both the paint `match` expression in `MapDashboard` and `getRiskColor`.
