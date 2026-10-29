# bench-tools

Testing tools and results for the thesis (not part of the app).

## Scripts
| File | Purpose |
|---|---|
| `blackbox.mjs` | Black-box test, 18 scenarios × 3 runs (`--tablet` for tablet). Writes to `blackbox-results/` or `blackbox-results-tablet/` (or `$BLACKBOX_OUT`). |
| `run-bench.mjs` | Map smoothness benchmark (FPS, data transferred, load time), 12 runs per mode. Writes to `results/` (or `$BENCH_RESULTS`). Needs `npm run build && npm run start` in the app root. |
| `mann-whitney.mjs` | Two-sided Mann-Whitney U test (continuity-corrected, ties), with self-check. |
| `render-tiles.mjs` + `render.html` | Renders the raster tiles in `public/raster_tiles/` used as the raster comparison. |
| `osm-hospital-addresses.py` + `hospital-addresses-review.csv` | Hospital address lookup from OSM (Saran no. 7 in Bab 5). |

## thesis-results/ — used in the thesis
| Folder | Thesis | Run |
|---|---|---|
| `blackbox-desktop-2026-10-19/` | Tabel 4.11 (desktop) | 19 Oct 2026, 00:22–00:27 WIB, commit 2dd0480 |
| `blackbox-tablet-2026-10-18/` | Tabel 4.11 (tablet) | 18 Oct 2026, ~16:56–16:58 WIB (scenario 12 at 17:05) — re-run pending |
| `performance-2026-10-25/` | Tabel 4.10 + Mann-Whitney (vector vs raster vs GeoJSON) | 25 Oct 2026, 12 runs/mode, Chrome 155.0.8059.85 |

## archive/ — history, not cited in the thesis
| Folder | What |
|---|---|
| `blackbox-desktop-2026-10-18-early/` | First desktop black-box run |
| `blackbox-desktop-2026-10-19-run1/` | Desktop attempt before the final run; `diagnosis-scenario8.*` explains the scenario 8 tooltip artifact |
| `performance-2026-10-17-vector-raster/` | Older 2-mode benchmark (vector vs raster) |
| `mlt-maplibre5-2026-10-28/` | MLT vs MVT on MapLibre 5.17 (code on branch `exp/mlt-maplibre5`). Decision: keep MVT |

MLT vs MVT on MapLibre 6.16 lives in the separate worktree `../GeoApp-mlt-exp` (branch `exp/mlt-maplibre6`), `bench-tools/results-mlt-v6/`.
