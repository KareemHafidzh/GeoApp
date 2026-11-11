import Link from 'next/link';

/** Call-to-action into the interactive map (/map). */
export default function CtaCard() {
  return (
    <div className="anim-fade-up rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-emerald-900 text-white" style={{ animationDelay: '0.12s' }}>
      <div className="font-bold text-base leading-snug">Jelajahi peta risiko interaktif</div>
      <p className="text-white/70 text-[13px] mt-1 leading-relaxed">Ukur area, cari faskes terdekat, filter kelas risiko.</p>
      <Link href="/map" className="mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0aab8a] hover:bg-emerald-500 font-semibold text-sm transition-colors">
        Open Spatial Map →
      </Link>
    </div>
  );
}
