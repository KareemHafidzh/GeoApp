const POINTS = ['Banyak lapisan peta', 'Risiko dihitung otomatis', 'Ukur jarak & luas'];

// Penjelasan singkat aplikasi untuk pengguna yang baru pertama membuka peta.
export default function AboutPanel() {
  return (
    <div>
      <h3 className="text-[15px] font-bold text-slate-800 mb-2">Apa ini?</h3>
      <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 text-slate-600 text-[12.5px] leading-relaxed shadow-sm">
        <p className="mb-2.5">
          <strong className="text-emerald-700 font-bold">Geodashboard Bekasi</strong> adalah peta untuk <strong className="text-emerald-700 font-bold">membandingkan risiko bencana</strong> antar kecamatan di Kota Bekasi. Klik area di peta untuk melihat detailnya.
        </p>
        <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-emerald-100/60">
          {POINTS.map((text) => (
            <div key={text} className="flex items-start gap-2.5">
              <div className="bg-emerald-100/80 p-1 rounded-md shrink-0">
                <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <span className="font-medium text-slate-700">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
