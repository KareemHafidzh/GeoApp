'use client';

// Bagian "Tentang": latar belakang dan tujuan aplikasi.
export default function About() {
  return (
    <section id="about" className="relative py-10 px-5 sm:px-8 lg:px-12">
      
      <div className="relative z-10 max-w-[1240px] mx-auto w-full">
        
        <div className="mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[#0aab8a] uppercase font-bold mb-4 font-mono" style={{ fontSize: 11, letterSpacing: '0.12em' }}>
            <span className="w-8 h-px bg-[#0aab8a]" />
            Tentang Aplikasi
          </div>
          <h2 className="font-extrabold text-slate-900 leading-[1.1] tracking-[-0.02em] text-4xl md:text-5xl">
            Dari Data Rumit <br />
            <span className="text-slate-400">Jadi Peta yang Mudah Dibaca.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-6 text-slate-500 leading-relaxed" style={{ fontSize: 16 }}>
            <p>
              <strong>Geodashboard Bekasi</strong> adalah peta online yang menunjukkan <strong>kecamatan mana di Kota Bekasi yang risiko bencananya lebih tinggi</strong> dibanding kecamatan lain. Cocok untuk mahasiswa, warga, maupun siapa saja yang ingin tahu kondisi wilayah tempat tinggalnya.
            </p>
            <p>
              Tingkat risiko dihitung dengan metode <strong>K-Means</strong> dari data kepadatan dan pertumbuhan penduduk, fasilitas kesehatan, sekolah dan guru (BPS, Kota Bekasi Dalam Angka 2026), serta indeks bahaya BNPB (inaRISK). Riwayat banjir dan longsor hanya ditampilkan sebagai informasi, tidak ikut dihitung. Hasilnya membagi 12 kecamatan menjadi Risiko Tinggi, Sedang, dan Rendah. Penilaian ini perbandingan antar kecamatan, jadi &quot;Risiko Rendah&quot; bukan berarti pasti bebas bencana.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0aab8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Banyak Lapisan Peta</h3>
              <p className="text-sm text-slate-500">Tampilkan batas wilayah, sekolah, rumah sakit, dan zona risiko sekaligus, lalu nyalakan atau matikan sesuai kebutuhan.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Berbasis Data</h3>
              <p className="text-sm text-slate-500">Klik wilayah untuk melihat penduduk, luas, dan riwayat banjir, longsor, serta gempa.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}