export type TourStep = {
  /** Nilai `data-tour` yang disorot, atau null untuk kartu di tengah layar. */
  selector: string | null;
  title: string;
  body: string;
  /** Apakah laci sidebar perlu terbuka pada langkah ini (HP/tablet). */
  sidebar: boolean;
  /** Langkah praktik: peta tidak digelapkan, ada animasi gerakan, dan gerakannya dideteksi. */
  interactive?: 'rotate' | 'click';
};

// Urutan langkah panduan; tiap langkah menunjuk elemen ber-atribut `data-tour`.
export const STEPS: TourStep[] = [
  {
    selector: null,
    title: 'Selamat Datang di Geodashboard Bekasi 👋',
    body: 'Peta interaktif zona risiko bencana Kota Bekasi. Yuk ikuti panduan singkat ini untuk mengenal fitur-fiturnya.',
    sidebar: false,
  },
  {
    selector: 'sidebar',
    title: 'Panel Kontrol',
    body: 'Semua pengaturan ada di panel ini. Pada layar kecil, buka panel lewat tombol menu (☰) di pojok kiri atas.',
    sidebar: true,
  },
  {
    selector: 'search',
    title: 'Cari Lokasi',
    body: 'Ketik nama tempat lalu tekan tombol cari. Peta akan otomatis terbang ke lokasi yang kamu cari di sekitar Bekasi.',
    sidebar: true,
  },
  {
    selector: 'mapset',
    title: 'Atur Lapisan Peta',
    body: 'Nyalakan atau matikan lapisan: zona risiko, batas kecamatan/kelurahan, serta titik rumah sakit dan sekolah sesuai kebutuhan.',
    sidebar: true,
  },
  {
    selector: 'measure',
    title: 'Alat Pengukuran',
    body: 'Gambar titik, garis, atau area di peta untuk mengukur jarak dan luas wilayah. Tekan tombol hapus untuk membersihkan gambar.',
    sidebar: true,
  },
  {
    selector: 'legend',
    title: 'Keterangan Risiko',
    body: 'Warna pada peta menunjukkan tingkat risiko bencana, mulai dari Risiko Rendah (hijau), Risiko Sedang (kuning), hingga Risiko Tinggi (merah).',
    sidebar: false,
  },
  {
    selector: null,
    title: 'Putar & Miringkan Peta 🧭',
    body: 'Ayo coba langsung! Tahan klik kanan mouse lalu geser — atau gunakan dua jari di layar sentuh, atau tekan tombol 3D di kanan bawah — untuk memutar arah dan memiringkan peta ke tampilan 3D. Tombol kompas di kanan bawah mengembalikan peta ke arah utara.',
    sidebar: false,
    interactive: 'rotate',
  },
  {
    selector: null,
    title: 'Klik Wilayah untuk Detail 🗺️',
    body: 'Coba sekarang! Klik atau ketuk salah satu zona berwarna pada peta untuk membuka detail wilayah: jumlah penduduk, fasilitas, dan riwayat bencana.',
    sidebar: false,
    interactive: 'click',
  },
];
