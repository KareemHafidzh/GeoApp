import Link from 'next/link';

// Kartu ajakan membuka halaman peta interaktif (/map).
export default function CtaCard() {
  return (
    <div className="anim-fade-up rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-emerald-900 text-white" style={{ animationDelay: '0.12s' }}>
      <div className="font-bold text-base leading-snug">Coba petanya sekarang</div>
      <p className="text-white/70 text-[13px] mt-1 leading-relaxed">Klik wilayah untuk lihat detailnya, cari lokasi rumahmu, dan temukan rumah sakit & puskesmas terdekat.</p>
      <Link href="/map" className="mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0aab8a] hover:bg-emerald-500 font-semibold text-sm transition-colors">
        Buka Peta →
      </Link>
    </div>
  );
}
