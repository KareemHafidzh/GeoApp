# Geodashboard Bekasi

Peta web risiko bencana untuk 12 kecamatan di Kota Bekasi. Kelas risiko (Tinggi / Sedang / Rendah) dihitung di luar aplikasi dengan K-Means (K=3, data BPS 2025) dan disimpan di data tile sebagai properti `Risk_Label`; aplikasi ini hanya menampilkannya.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
```

Tidak perlu server tile: data peta dibaca langsung dari `public/*.pmtiles`.

```bash
npm run build    # build produksi
npm run lint     # ESLint
npx tsc --noEmit # cek tipe
node tools/check-home-stats.mjs  # cek angka beranda masih sesuai data
```

## Struktur folder

```
app/                      rute Next.js (beranda, /map, /performance-test)
features/home/            beranda: hero, bagian-bagian halaman, data ringkasan
features/map/
  components/
    MapDashboard.tsx      halaman peta, pemegang semua state
    layers/               sumber data dan lapisan MapLibre, tombol 3D
    sidebar/              panel kiri: cari, tentang, lapisan, alat ukur
    overlays/             kartu di atas peta: legenda, detail wilayah, darurat, dll.
    tour/                 panduan penggunaan peta
  hooks/                  Geoman (alat ukur), pencarian, pemuat GeoJSON
  lib/                    fungsi bantu murni (isi kartu detail, luas gambar)
public/                   PMTiles dan GeoJSON yang dipakai peta
data/mbtiles/             sumber MBTiles asal file PMTiles
tools/                    skrip uji dan hasil skripsi (bukan bagian aplikasi)
```
