const STEPS = [
  { n: '1', title: 'Buka peta', desc: 'Tekan tombol "Buka Peta". Tidak perlu daftar atau login. Panduan singkat akan muncul saat pertama kali dibuka.' },
  { n: '2', title: 'Baca warnanya', desc: 'Merah = Risiko Tinggi, kuning = Sedang, hijau = Rendah. Klik salah satu warna di keterangan untuk menyaring peta.' },
  { n: '3', title: 'Klik wilayahmu', desc: 'Ketuk kecamatan atau kelurahan di peta untuk melihat jumlah penduduk, luas, dan riwayat bencananya. Atau ketik nama tempat di kotak "Cari Lokasi".' },
  { n: '4', title: 'Lihat sekitar', desc: 'Nyalakan lapisan Rumah Sakit, Puskesmas, dan Sekolah di panel kiri. Tombol "Darurat" menampilkan nomor penting dan faskes terdekat.' },
];

// Langkah singkat cara memakai peta untuk pengunjung baru.
export default function HowTo() {
  return (
    <section id="cara-pakai" className="relative py-10 px-5 sm:px-8 lg:px-12">
      <div className="max-w-[1240px] mx-auto w-full">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-extrabold text-slate-900 leading-[1.1] tracking-[-0.02em] text-3xl md:text-4xl">Cara Pakai dalam 4 Langkah</h2>
          <p className="text-slate-500 mt-3">Cukup beberapa menit untuk mencoba semua fiturnya.</p>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s) => (
            <li key={s.n} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-[#0aab8a] text-white font-bold flex items-center justify-center mb-4">{s.n}</div>
              <h3 className="font-bold text-slate-900 mb-1.5">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-slate-500">
          Sedang mengisi kuesioner? Coba cari rumah atau kampusmu di peta, lalu lihat tingkat risiko kecamatannya.
        </p>
      </div>
    </section>
  );
}
